import type { BodyKeypoint, BodyLandmark, Result } from "@vladmandic/human";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import type { PoseFrame, RetargetFrame, TrackingJointName } from "@/lib/tracking/trackerTypes";
import { clamp } from "@/lib/utils/clamp";
import { lookRotation, safeNormalize } from "@/lib/utils/math";
import type { VRMRig } from "@/lib/vrm/vrmRig";
import { clampBoneQuaternion } from "@/lib/vrm/constraints";

const TRACKED_JOINTS: TrackingJointName[] = [
  "nose",
  "leftEye",
  "rightEye",
  "leftEar",
  "rightEar",
  "leftShoulder",
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist",
  "leftHip",
  "rightHip",
];

const worldForward = new Vector3(0, 0, 1);
const worldUp = new Vector3(0, 1, 0);
const matrix = new Matrix4();
const inverseMatrix = new Matrix4();
const tempEuler = new Euler();
const imagePlaneScaleX = 2.4;
const imagePlaneScaleY = 1.8;
const depthPlaneScale = 3.6;
const normalizedToSceneScale = (imagePlaneScaleX + imagePlaneScaleY) * 0.5;

const segmentBaseline = new Map<string, number>();
const jointDepthState: Partial<Record<TrackingJointName, number>> = {};

const getImageDistance = (
  joints: Partial<Record<TrackingJointName, PoseFrame["joints"][TrackingJointName]>>,
  from: TrackingJointName,
  to: TrackingJointName,
) => {
  const fromJoint = joints[from];
  const toJoint = joints[to];
  if (!fromJoint?.imagePosition || !toJoint?.imagePosition) {
    return null;
  }

  return Math.hypot(
    toJoint.imagePosition.x - fromJoint.imagePosition.x,
    toJoint.imagePosition.y - fromJoint.imagePosition.y,
  );
};

const readBaseline = (key: string, fallback: number) => {
  const current = segmentBaseline.get(key);
  if (typeof current === "number" && Number.isFinite(current) && current > 0) {
    return current;
  }

  segmentBaseline.set(key, fallback);
  return fallback;
};

const updateBaseline = (key: string, observed: number | null, fallback: number, confidence: number) => {
  const current = readBaseline(key, fallback);
  if (!observed || !Number.isFinite(observed) || observed <= 0 || confidence < 0.45) {
    return current;
  }

  const next =
    observed > current
      ? current * 0.82 + observed * 0.18
      : Math.max(fallback, current * 0.996);

  segmentBaseline.set(key, next);
  return next;
};

const smoothJointDepth = (jointName: TrackingJointName, nextDepth: number) => {
  const previous = jointDepthState[jointName] ?? nextDepth;
  const smoothed = previous * 0.68 + nextDepth * 0.32;
  jointDepthState[jointName] = smoothed;
  return smoothed;
};

const applyPseudoDepthToArms = (joints: PoseFrame["joints"]) => {
  const shoulderSpanObserved = getImageDistance(joints, "leftShoulder", "rightShoulder");
  const shoulderConfidence =
    ((joints.leftShoulder?.confidence ?? 0) + (joints.rightShoulder?.confidence ?? 0)) * 0.5;
  const shoulderSpan = updateBaseline("shoulderSpan", shoulderSpanObserved, 0.16, shoulderConfidence);

  const applySide = (side: "left" | "right") => {
    const shoulderName = side === "left" ? "leftShoulder" : "rightShoulder";
    const elbowName = side === "left" ? "leftElbow" : "rightElbow";
    const wristName = side === "left" ? "leftWrist" : "rightWrist";

    const shoulder = joints[shoulderName];
    const elbow = joints[elbowName];
    const wrist = joints[wristName];

    if (!shoulder || !elbow || !wrist || !shoulder.imagePosition || !elbow.imagePosition || !wrist.imagePosition) {
      return;
    }

    const upperConfidence = ((shoulder.confidence + elbow.confidence) * 0.5);
    const lowerConfidence = ((elbow.confidence + wrist.confidence) * 0.5);
    const upperObserved = getImageDistance(joints, shoulderName, elbowName);
    const lowerObserved = getImageDistance(joints, elbowName, wristName);
    const upperBaseline = updateBaseline(`${side}UpperArm`, upperObserved, shoulderSpan * 0.92, upperConfidence);
    const lowerBaseline = updateBaseline(`${side}LowerArm`, lowerObserved, shoulderSpan * 0.88, lowerConfidence);

    const upperForeshortening =
      upperObserved && upperBaseline > upperObserved
        ? Math.sqrt(Math.max(upperBaseline * upperBaseline - upperObserved * upperObserved, 0))
        : 0;
    const lowerForeshortening =
      lowerObserved && lowerBaseline > lowerObserved
        ? Math.sqrt(Math.max(lowerBaseline * lowerBaseline - lowerObserved * lowerObserved, 0))
        : 0;

    const shoulderToElbow2D = new Vector3(
      elbow.position.x - shoulder.position.x,
      elbow.position.y - shoulder.position.y,
      0,
    );
    const elbowToWrist2D = new Vector3(
      wrist.position.x - elbow.position.x,
      wrist.position.y - elbow.position.y,
      0,
    );

    const upperTargetLength = Math.max(upperBaseline * normalizedToSceneScale, 0.08);
    const lowerTargetLength = Math.max(lowerBaseline * normalizedToSceneScale, 0.08);
    const upperProjectedLength = shoulderToElbow2D.length();
    const lowerProjectedLength = elbowToWrist2D.length();
    const elbowDepth = smoothJointDepth(
      elbowName,
      clamp(upperForeshortening * depthPlaneScale, 0, 1.4),
    );
    const wristDepth = smoothJointDepth(
      wristName,
      clamp((upperForeshortening * 0.35 + lowerForeshortening) * depthPlaneScale, 0, 2.1),
    );

    const upperDirection3D = new Vector3(
      shoulderToElbow2D.x,
      shoulderToElbow2D.y,
      elbowDepth,
    ).normalize();

    if (upperDirection3D.lengthSq() > 1e-6) {
      elbow.position.copy(shoulder.position.clone().add(upperDirection3D.multiplyScalar(upperTargetLength)));
    }

    const lowerDirection3D = new Vector3(
      elbowToWrist2D.x,
      elbowToWrist2D.y,
      Math.max(0, wristDepth - elbowDepth * 0.35),
    ).normalize();

    if (lowerDirection3D.lengthSq() > 1e-6) {
      wrist.position.copy(elbow.position.clone().add(lowerDirection3D.multiplyScalar(lowerTargetLength)));
    }
  };

  applySide("left");
  applySide("right");
};

const bodyKeypointMap = (keypoints: BodyKeypoint[]) => {
  const map = new Map<BodyLandmark, BodyKeypoint>();
  keypoints.forEach((keypoint) => {
    map.set(keypoint.part, keypoint);
  });
  return map;
};

const toTrackingPoint = (keypoint: BodyKeypoint, sourceWidth: number, sourceHeight: number) => {
  const [rx, ry, rz] = keypoint.positionRaw;
  const [px, py] = keypoint.position;
  const imageX = clamp(px / Math.max(1, sourceWidth), 0, 1);
  const imageY = clamp(py / Math.max(1, sourceHeight), 0, 1);

  return {
    position: new Vector3(
      (imageX - 0.5) * imagePlaneScaleX,
      (0.5 - imageY) * imagePlaneScaleY,
      typeof rz === "number" ? clamp(-rz * 0.12, -0.12, 0.12) : 0,
    ),
    imagePosition: {
      x: imageX,
      y: imageY,
    },
    confidence: keypoint.score,
  };
};

export const mapHumanResultToPoseFrame = (
  result: Result,
  video: HTMLVideoElement,
): PoseFrame | null => {
  const body = result.body?.[0];
  if (!body) {
    return null;
  }

  const sourceWidth = video.videoWidth || result.width || 1;
  const sourceHeight = video.videoHeight || result.height || 1;

  const keypointMap = bodyKeypointMap(body.keypoints);

  const joints = Object.fromEntries(
    TRACKED_JOINTS.flatMap((jointName) => {
      const keypoint = keypointMap.get(jointName);
      if (!keypoint) {
        return [];
      }

      const tracked = toTrackingPoint(keypoint, sourceWidth, sourceHeight);
      return [[
        jointName,
        {
          name: jointName,
          position: tracked.position,
          imagePosition: tracked.imagePosition,
          confidence: tracked.confidence,
        },
      ]];
    }),
  ) as PoseFrame["joints"];

  applyPseudoDepthToArms(joints);

  const averageConfidence =
    Object.values(joints).reduce((sum, joint) => sum + (joint?.confidence ?? 0), 0) /
    Math.max(1, Object.values(joints).length);

  return {
    timestamp: result.timestamp,
    joints,
    averageConfidence,
    bodyConfidence: body.score,
    sourceResolution: {
      width: video.videoWidth || result.width,
      height: video.videoHeight || result.height,
    },
    latencyMs: Math.max(0, Date.now() - result.timestamp),
  };
};

const getJoint = (frame: PoseFrame | null, jointName: TrackingJointName) => frame?.joints[jointName] ?? null;

const getVector = (frame: PoseFrame | null, from: TrackingJointName, to: TrackingJointName) => {
  const fromJoint = getJoint(frame, from);
  const toJoint = getJoint(frame, to);
  if (!fromJoint || !toJoint) {
    return null;
  }
  return toJoint.position.clone().sub(fromJoint.position);
};

const getMidpoint = (frame: PoseFrame | null, a: TrackingJointName, b: TrackingJointName) => {
  const first = getJoint(frame, a);
  const second = getJoint(frame, b);
  if (!first || !second) {
    return null;
  }
  return first.position.clone().lerp(second.position, 0.5);
};

const jointConfidence = (frame: PoseFrame | null, joints: TrackingJointName[]) =>
  joints.reduce((sum, jointName) => sum + (getJoint(frame, jointName)?.confidence ?? 0), 0) / joints.length;

const solveDirectionDelta = (rig: VRMRig, boneName: string, desiredWorldDirection: Vector3) => {
  const bone = rig.bones.get(boneName);
  if (!bone || !bone.parent || !bone.restDirectionToChild) {
    return null;
  }

  const parentWorldQuat = bone.parent.getWorldQuaternion(new Quaternion());
  const desiredLocalDirection = desiredWorldDirection.clone().applyQuaternion(parentWorldQuat.invert()).normalize();

  if (desiredLocalDirection.lengthSq() < 1e-6) {
    return null;
  }

  return new Quaternion().setFromUnitVectors(
    bone.restDirectionToChild.clone().normalize(),
    desiredLocalDirection,
  );
};

const solveBasisDelta = (
  rig: VRMRig,
  boneName: string,
  desiredWorldForward: Vector3,
  desiredWorldUp: Vector3,
) => {
  const bone = rig.bones.get(boneName);
  if (!bone || !bone.parent) {
    return null;
  }

  const parentWorldQuat = bone.parent.getWorldQuaternion(new Quaternion());
  matrix.makeRotationFromQuaternion(parentWorldQuat);
  inverseMatrix.copy(matrix).invert();

  const forwardLocal = safeNormalize(desiredWorldForward).clone().applyMatrix4(inverseMatrix).normalize();
  const upLocal = safeNormalize(desiredWorldUp).clone().applyMatrix4(inverseMatrix).normalize();
  return lookRotation(forwardLocal, upLocal);
};

const applyRollSoftening = (quaternion: Quaternion, rollWeight: number) => {
  tempEuler.setFromQuaternion(quaternion, "XYZ");
  tempEuler.z *= rollWeight;
  return new Quaternion().setFromEuler(tempEuler);
};

export const retargetPoseFrameToVRM = (
  frame: PoseFrame | null,
  rig: VRMRig,
  confidenceThreshold: number,
): RetargetFrame => {
  const timestamp = performance.now();
  const boneTargets: RetargetFrame["boneTargets"] = {};

  if (!frame) {
    return {
      timestamp,
      hipsPositionOffset: new Vector3(),
      boneTargets,
      averageConfidence: 0,
    };
  }

  const shoulderCenter = getMidpoint(frame, "leftShoulder", "rightShoulder");
  const hipCenter = getMidpoint(frame, "leftHip", "rightHip");
  const headRight = getVector(frame, "rightEar", "leftEar");
  const torsoUp = shoulderCenter && hipCenter ? shoulderCenter.clone().sub(hipCenter) : null;

  if (shoulderCenter && hipCenter && torsoUp) {
    const up = torsoUp.normalize();
    const confidence = jointConfidence(frame, ["leftShoulder", "rightShoulder", "leftHip", "rightHip"]);

    [VRMHumanBoneName.Hips, VRMHumanBoneName.Spine, VRMHumanBoneName.Chest, VRMHumanBoneName.UpperChest].forEach(
      (boneName, index) => {
        if (confidence < confidenceThreshold) {
          return;
        }

        const delta = solveDirectionDelta(rig, boneName, up);
        if (!delta) {
          return;
        }

        boneTargets[boneName] = {
          quaternion: clampBoneQuaternion(boneName, applyRollSoftening(delta, index === 0 ? 0.25 : 0.5)),
          confidence,
          updatedAt: timestamp,
          source: "torso",
        };
      },
    );
  }

  const nose = getJoint(frame, "nose");
  if (nose && shoulderCenter && headRight) {
    const neckUp = nose.position.clone().sub(shoulderCenter).normalize();
    const faceRight = headRight.clone().normalize();
    const faceForward = safeNormalize(faceRight.clone().cross(neckUp), worldForward);
    const confidence = jointConfidence(frame, ["nose", "leftShoulder", "rightShoulder"]);

    if (confidence >= confidenceThreshold) {
      [VRMHumanBoneName.Neck, VRMHumanBoneName.Head].forEach((boneName, index) => {
        const delta = solveBasisDelta(rig, boneName, faceForward, neckUp);
        if (!delta) {
          return;
        }

        boneTargets[boneName] = {
          quaternion: clampBoneQuaternion(boneName, applyRollSoftening(delta, index === 0 ? 0.45 : 0.65)),
          confidence,
          updatedAt: timestamp,
          source: "head",
        };
      });
    }
  }

  const armPairs: Array<{
    boneName: string;
    joints: [TrackingJointName, TrackingJointName];
    source: string;
    rollWeight: number;
  }> = [
    { boneName: VRMHumanBoneName.LeftShoulder, joints: ["leftShoulder", "leftElbow"], source: "leftShoulder", rollWeight: 0.25 },
    { boneName: VRMHumanBoneName.RightShoulder, joints: ["rightShoulder", "rightElbow"], source: "rightShoulder", rollWeight: 0.25 },
    { boneName: VRMHumanBoneName.LeftUpperArm, joints: ["leftShoulder", "leftElbow"], source: "leftUpperArm", rollWeight: 0.55 },
    { boneName: VRMHumanBoneName.RightUpperArm, joints: ["rightShoulder", "rightElbow"], source: "rightUpperArm", rollWeight: 0.55 },
    { boneName: VRMHumanBoneName.LeftLowerArm, joints: ["leftElbow", "leftWrist"], source: "leftLowerArm", rollWeight: 1 },
    { boneName: VRMHumanBoneName.RightLowerArm, joints: ["rightElbow", "rightWrist"], source: "rightLowerArm", rollWeight: 1 },
  ];

  armPairs.forEach(({ boneName, joints, source, rollWeight }) => {
    const vector = getVector(frame, joints[0], joints[1]);
    const confidence = jointConfidence(frame, joints);

    if (!vector || confidence < confidenceThreshold) {
      return;
    }

    const delta = solveDirectionDelta(rig, boneName, vector.normalize());
    if (!delta) {
      return;
    }

    boneTargets[boneName] = {
      quaternion: clampBoneQuaternion(boneName, applyRollSoftening(delta, rollWeight)),
      confidence,
      updatedAt: timestamp,
      source,
    };
  });

  const wrists: Array<{ handBone: string; side: "left" | "right" }> = [
    { handBone: VRMHumanBoneName.LeftHand, side: "left" },
    { handBone: VRMHumanBoneName.RightHand, side: "right" },
  ];

  wrists.forEach(({ handBone, side }) => {
    const shoulder = side === "left" ? "leftShoulder" : "rightShoulder";
    const elbow = side === "left" ? "leftElbow" : "rightElbow";
    const wrist = side === "left" ? "leftWrist" : "rightWrist";
    const wristVector = getVector(frame, elbow, wrist);
    const armVector = getVector(frame, shoulder, elbow);
    const confidence = jointConfidence(frame, [shoulder, elbow, wrist]);

    if (!wristVector || !armVector || confidence < Math.max(confidenceThreshold + 0.08, 0.56)) {
      return;
    }

    const up = safeNormalize(armVector.clone().cross(wristVector), worldUp);
    const delta = solveBasisDelta(rig, handBone, wristVector.normalize(), up);
    if (!delta) {
      return;
    }

    boneTargets[handBone] = {
      quaternion: clampBoneQuaternion(handBone, applyRollSoftening(delta, 0.25)),
      confidence,
      updatedAt: timestamp,
      source: `${side}Hand`,
    };
  });

  const hipsPositionOffset = hipCenter
    ? new Vector3(clamp(hipCenter.x * 0.08, -0.07, 0.07), clamp(hipCenter.y * 0.06, -0.04, 0.06), 0)
    : new Vector3();

  return {
    timestamp,
    hipsPositionOffset,
    boneTargets,
    averageConfidence: frame.averageConfidence,
  };
};
