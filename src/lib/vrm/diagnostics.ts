import { VRMHumanBoneName, type VRM } from "@pixiv/three-vrm";

const fingerBones = [
  VRMHumanBoneName.LeftThumbMetacarpal,
  VRMHumanBoneName.LeftThumbProximal,
  VRMHumanBoneName.LeftThumbDistal,
  VRMHumanBoneName.LeftIndexProximal,
  VRMHumanBoneName.LeftIndexIntermediate,
  VRMHumanBoneName.LeftIndexDistal,
  VRMHumanBoneName.LeftMiddleProximal,
  VRMHumanBoneName.LeftMiddleIntermediate,
  VRMHumanBoneName.LeftMiddleDistal,
  VRMHumanBoneName.LeftRingProximal,
  VRMHumanBoneName.LeftRingIntermediate,
  VRMHumanBoneName.LeftRingDistal,
  VRMHumanBoneName.LeftLittleProximal,
  VRMHumanBoneName.LeftLittleIntermediate,
  VRMHumanBoneName.LeftLittleDistal,
  VRMHumanBoneName.RightThumbMetacarpal,
  VRMHumanBoneName.RightThumbProximal,
  VRMHumanBoneName.RightThumbDistal,
  VRMHumanBoneName.RightIndexProximal,
  VRMHumanBoneName.RightIndexIntermediate,
  VRMHumanBoneName.RightIndexDistal,
  VRMHumanBoneName.RightMiddleProximal,
  VRMHumanBoneName.RightMiddleIntermediate,
  VRMHumanBoneName.RightMiddleDistal,
  VRMHumanBoneName.RightRingProximal,
  VRMHumanBoneName.RightRingIntermediate,
  VRMHumanBoneName.RightRingDistal,
  VRMHumanBoneName.RightLittleProximal,
  VRMHumanBoneName.RightLittleIntermediate,
  VRMHumanBoneName.RightLittleDistal,
] as const;

export interface VrmFingerDiagnostics {
  present: string[];
  missing: string[];
}

export const collectVrmFingerDiagnostics = (vrm: VRM): VrmFingerDiagnostics => {
  const present: string[] = [];
  const missing: string[] = [];

  fingerBones.forEach((boneName) => {
    const node = vrm.humanoid.getNormalizedBoneNode(boneName);
    if (node) {
      present.push(boneName);
    } else {
      missing.push(boneName);
    }
  });

  return {
    present,
    missing,
  };
};
