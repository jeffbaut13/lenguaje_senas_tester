import { Quaternion } from "three";
import type { VRM } from "@pixiv/three-vrm";
import { getAvailableBoneNames } from "@/lib/vrm/vrmBones";

export const captureRestPose = (vrm: VRM) => {
  const rest = new Map<string, Quaternion>();
  const pose = vrm.humanoid.normalizedRestPose;

  getAvailableBoneNames(vrm).forEach((boneName) => {
    const rotation = pose[boneName]?.rotation;

    if (rotation) {
      rest.set(boneName, new Quaternion(rotation[0], rotation[1], rotation[2], rotation[3]));
      return;
    }

    const node = vrm.humanoid.getNormalizedBoneNode(boneName);
    if (node) {
      rest.set(boneName, node.quaternion.clone());
    }
  });

  return rest;
};
