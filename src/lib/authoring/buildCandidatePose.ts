import type { CandidatePoseEntry, PoseCaptureResult, PoseDescriptor, PoseLandmarkPoint } from "@/lib/types/plans";

const averageLandmarks = (landmarkSets: Record<string, PoseLandmarkPoint>[]) => {
  const averages = new Map<string, { x: number; y: number; z: number; visibility: number; count: number }>();

  landmarkSets.forEach((landmarks) => {
    Object.entries(landmarks).forEach(([key, point]) => {
      const current = averages.get(key) ?? { x: 0, y: 0, z: 0, visibility: 0, count: 0 };
      current.x += point.x;
      current.y += point.y;
      current.z += point.z;
      current.visibility += point.visibility;
      current.count += 1;
      averages.set(key, current);
    });
  });

  return Array.from(averages.entries()).reduce<Record<string, PoseLandmarkPoint>>((accumulator, [key, value]) => {
    accumulator[key] = {
      x: value.x / value.count,
      y: value.y / value.count,
      z: value.z / value.count,
      visibility: value.visibility / value.count,
    };
    return accumulator;
  }, {});
};

const clampAngle = (value: number) => Math.max(-80, Math.min(80, value));

const buildDescriptorFromLandmarks = (landmarks: Record<string, PoseLandmarkPoint>): PoseDescriptor => {
  const leftShoulderDrop = (landmarks.leftShoulder?.y ?? 0) - (landmarks.leftElbow?.y ?? 0);
  const rightShoulderDrop = (landmarks.rightShoulder?.y ?? 0) - (landmarks.rightElbow?.y ?? 0);
  const wristDepth = (landmarks.rightWrist?.z ?? 0) - (landmarks.leftWrist?.z ?? 0);

  return {
    emphasis: 0.3,
    bones: {
      LeftShoulder: [clampAngle(leftShoulderDrop * 24), 0, -4],
      RightShoulder: [clampAngle(rightShoulderDrop * 24), 0, 4],
      LeftUpperArm: [24 + clampAngle(leftShoulderDrop * 40), -2, -4],
      RightUpperArm: [24 + clampAngle(rightShoulderDrop * 40), 2, 4],
      LeftLowerArm: [4, -2, -2],
      RightLowerArm: [4, 2, 2],
      LeftHand: [6, 0, clampAngle(wristDepth * -8)],
      RightHand: [6, 0, clampAngle(wristDepth * 8)],
    },
  };
};

export const buildCandidatePose = (
  captureResult: PoseCaptureResult,
  id: string,
  tags: string[],
  notes: string[],
): CandidatePoseEntry => {
  const allLandmarks = [
    ...captureResult.keyframes.start.map((item) => item.landmarks),
    ...captureResult.keyframes.middle.map((item) => item.landmarks),
    ...captureResult.keyframes.end.map((item) => item.landmarks),
  ];

  const normalizedLandmarks = averageLandmarks(allLandmarks);
  const suggestedPoseDescriptor = buildDescriptorFromLandmarks(normalizedLandmarks);

  return {
    id,
    sourceVideos: captureResult.sourceVideos,
    captureMode: "triple_video_authoring",
    extractedAt: captureResult.extractedAt,
    keyframes: captureResult.keyframes,
    normalizedLandmarks,
    suggestedPoseDescriptor,
    tags,
    notes,
    reviewStatus: "draft",
  };
};
