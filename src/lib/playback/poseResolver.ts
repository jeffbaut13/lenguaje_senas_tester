import { Euler, Quaternion } from "three";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import { getPoseEntry } from "@/lib/repositories/poseRepository";

const boneNameMap: Record<string, VRMHumanBoneName> = {
  Chest: VRMHumanBoneName.Chest,
  Head: VRMHumanBoneName.Head,
  LeftHand: VRMHumanBoneName.LeftHand,
  LeftIndexIntermediate: VRMHumanBoneName.LeftIndexIntermediate,
  LeftIndexProximal: VRMHumanBoneName.LeftIndexProximal,
  LeftLittleIntermediate: VRMHumanBoneName.LeftLittleIntermediate,
  LeftLittleProximal: VRMHumanBoneName.LeftLittleProximal,
  LeftLowerArm: VRMHumanBoneName.LeftLowerArm,
  LeftMiddleIntermediate: VRMHumanBoneName.LeftMiddleIntermediate,
  LeftMiddleProximal: VRMHumanBoneName.LeftMiddleProximal,
  LeftRingIntermediate: VRMHumanBoneName.LeftRingIntermediate,
  LeftRingProximal: VRMHumanBoneName.LeftRingProximal,
  LeftShoulder: VRMHumanBoneName.LeftShoulder,
  LeftThumbDistal: VRMHumanBoneName.LeftThumbDistal,
  LeftThumbMetacarpal: VRMHumanBoneName.LeftThumbMetacarpal,
  LeftThumbProximal: VRMHumanBoneName.LeftThumbProximal,
  LeftUpperArm: VRMHumanBoneName.LeftUpperArm,
  Neck: VRMHumanBoneName.Neck,
  RightHand: VRMHumanBoneName.RightHand,
  RightIndexIntermediate: VRMHumanBoneName.RightIndexIntermediate,
  RightIndexProximal: VRMHumanBoneName.RightIndexProximal,
  RightLittleIntermediate: VRMHumanBoneName.RightLittleIntermediate,
  RightLittleProximal: VRMHumanBoneName.RightLittleProximal,
  RightLowerArm: VRMHumanBoneName.RightLowerArm,
  RightMiddleIntermediate: VRMHumanBoneName.RightMiddleIntermediate,
  RightMiddleProximal: VRMHumanBoneName.RightMiddleProximal,
  RightRingIntermediate: VRMHumanBoneName.RightRingIntermediate,
  RightRingProximal: VRMHumanBoneName.RightRingProximal,
  RightShoulder: VRMHumanBoneName.RightShoulder,
  RightThumbDistal: VRMHumanBoneName.RightThumbDistal,
  RightThumbMetacarpal: VRMHumanBoneName.RightThumbMetacarpal,
  RightThumbProximal: VRMHumanBoneName.RightThumbProximal,
  RightUpperArm: VRMHumanBoneName.RightUpperArm,
};

export const resolvePoseRotations = (poseId: string) => {
  const pose = getPoseEntry(poseId);
  if (!pose) {
    return new Map<VRMHumanBoneName, Quaternion>();
  }

  const rotations = new Map<VRMHumanBoneName, Quaternion>();
  Object.entries(pose.bones).forEach(([boneName, euler]) => {
    const vrmBoneName = boneNameMap[boneName];
    if (!vrmBoneName) {
      return;
    }

    const radians = euler.map((value) => (value * Math.PI) / 180) as [number, number, number];
    rotations.set(vrmBoneName, new Quaternion().setFromEuler(new Euler(radians[0], radians[1], radians[2], "XYZ")));
  });

  return rotations;
};
