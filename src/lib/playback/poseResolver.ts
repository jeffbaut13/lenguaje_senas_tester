import { Euler, Quaternion } from "three";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import { getPoseEntry } from "@/lib/repositories/poseRepository";

const boneNameMap: Record<string, VRMHumanBoneName> = {
  Chest: VRMHumanBoneName.Chest,
  Head: VRMHumanBoneName.Head,
  LeftHand: VRMHumanBoneName.LeftHand,
  LeftLowerArm: VRMHumanBoneName.LeftLowerArm,
  LeftShoulder: VRMHumanBoneName.LeftShoulder,
  LeftUpperArm: VRMHumanBoneName.LeftUpperArm,
  Neck: VRMHumanBoneName.Neck,
  RightHand: VRMHumanBoneName.RightHand,
  RightLowerArm: VRMHumanBoneName.RightLowerArm,
  RightShoulder: VRMHumanBoneName.RightShoulder,
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
