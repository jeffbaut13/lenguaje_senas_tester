import { Euler, Quaternion } from "three";
import { clamp } from "@/lib/utils/clamp";

const euler = new Euler();
const DEG = Math.PI / 180;

const LIMITS: Record<string, { x: [number, number]; y: [number, number]; z: [number, number] }> = {
  hips: { x: [-18 * DEG, 18 * DEG], y: [-26 * DEG, 26 * DEG], z: [-14 * DEG, 14 * DEG] },
  spine: { x: [-18 * DEG, 18 * DEG], y: [-20 * DEG, 20 * DEG], z: [-18 * DEG, 18 * DEG] },
  chest: { x: [-20 * DEG, 20 * DEG], y: [-22 * DEG, 22 * DEG], z: [-18 * DEG, 18 * DEG] },
  upperChest: { x: [-20 * DEG, 20 * DEG], y: [-22 * DEG, 22 * DEG], z: [-18 * DEG, 18 * DEG] },
  neck: { x: [-28 * DEG, 28 * DEG], y: [-34 * DEG, 34 * DEG], z: [-18 * DEG, 18 * DEG] },
  head: { x: [-32 * DEG, 32 * DEG], y: [-42 * DEG, 42 * DEG], z: [-20 * DEG, 20 * DEG] },
  leftShoulder: { x: [-24 * DEG, 18 * DEG], y: [-18 * DEG, 24 * DEG], z: [-32 * DEG, 28 * DEG] },
  rightShoulder: { x: [-24 * DEG, 18 * DEG], y: [-24 * DEG, 18 * DEG], z: [-28 * DEG, 32 * DEG] },
  leftUpperArm: { x: [-135 * DEG, 45 * DEG], y: [-85 * DEG, 35 * DEG], z: [-95 * DEG, 95 * DEG] },
  rightUpperArm: { x: [-135 * DEG, 45 * DEG], y: [-35 * DEG, 85 * DEG], z: [-95 * DEG, 95 * DEG] },
  leftLowerArm: { x: [-165 * DEG, 20 * DEG], y: [-35 * DEG, 35 * DEG], z: [-165 * DEG, 165 * DEG] },
  rightLowerArm: { x: [-165 * DEG, 20 * DEG], y: [-35 * DEG, 35 * DEG], z: [-165 * DEG, 165 * DEG] },
  leftHand: { x: [-25 * DEG, 35 * DEG], y: [-30 * DEG, 30 * DEG], z: [-22 * DEG, 22 * DEG] },
  rightHand: { x: [-25 * DEG, 35 * DEG], y: [-30 * DEG, 30 * DEG], z: [-22 * DEG, 22 * DEG] },
};

export const clampBoneQuaternion = (boneName: string, quaternion: Quaternion) => {
  const limits = LIMITS[boneName];
  if (!limits) {
    return quaternion;
  }

  euler.setFromQuaternion(quaternion, "XYZ");
  euler.x = clamp(euler.x, limits.x[0], limits.x[1]);
  euler.y = clamp(euler.y, limits.y[0], limits.y[1]);
  euler.z = clamp(euler.z, limits.z[0], limits.z[1]);
  return new Quaternion().setFromEuler(euler);
};
