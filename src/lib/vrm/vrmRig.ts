import { Bone, Object3D, Quaternion, Vector3 } from "three";
import { VRMHumanBoneName, type VRM } from "@pixiv/three-vrm";
import { captureRestPose } from "@/lib/vrm/restPose";

export interface BoneRestInfo {
  name: string;
  node: Object3D;
  parent: Object3D | null;
  restLocalRotation: Quaternion;
  restDirectionToChild: Vector3 | null;
}

export interface VRMRig {
  vrm: VRM;
  restPose: Map<string, Quaternion>;
  bones: Map<string, BoneRestInfo>;
}

const CHILD_HINTS: Partial<Record<string, string>> = {
  [VRMHumanBoneName.Hips]: VRMHumanBoneName.Spine,
  [VRMHumanBoneName.Spine]: VRMHumanBoneName.Chest,
  [VRMHumanBoneName.Chest]: VRMHumanBoneName.UpperChest,
  [VRMHumanBoneName.UpperChest]: VRMHumanBoneName.Neck,
  [VRMHumanBoneName.Neck]: VRMHumanBoneName.Head,
  [VRMHumanBoneName.LeftShoulder]: VRMHumanBoneName.LeftUpperArm,
  [VRMHumanBoneName.RightShoulder]: VRMHumanBoneName.RightUpperArm,
  [VRMHumanBoneName.LeftUpperArm]: VRMHumanBoneName.LeftLowerArm,
  [VRMHumanBoneName.RightUpperArm]: VRMHumanBoneName.RightLowerArm,
  [VRMHumanBoneName.LeftLowerArm]: VRMHumanBoneName.LeftHand,
  [VRMHumanBoneName.RightLowerArm]: VRMHumanBoneName.RightHand,
};

const getChildNode = (vrm: VRM, boneName: string, node: Object3D) => {
  const hinted = CHILD_HINTS[boneName];
  if (hinted) {
    const hintedNode = vrm.humanoid.getNormalizedBoneNode(hinted as never);
    if (hintedNode) {
      return hintedNode;
    }
  }

  return node.children.find((child) => child instanceof Bone) ?? null;
};

export const buildVRMRig = (vrm: VRM): VRMRig => {
  const restPose = captureRestPose(vrm);
  const bones = new Map<string, BoneRestInfo>();

  restPose.forEach((quaternion, boneName) => {
    const node = vrm.humanoid.getNormalizedBoneNode(boneName as never);
    if (!node) {
      return;
    }

    const childNode = getChildNode(vrm, boneName, node);
    const restDirectionToChild = childNode ? childNode.position.clone().normalize() : null;

    bones.set(boneName, {
      name: boneName,
      node,
      parent: node.parent,
      restLocalRotation: quaternion.clone(),
      restDirectionToChild,
    });
  });

  return { vrm, restPose, bones };
};
