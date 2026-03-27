import { Matrix4, Quaternion, Vector3 } from "three";

export const FORWARD = new Vector3(0, 0, 1);
export const UP = new Vector3(0, 1, 0);
export const RIGHT = new Vector3(1, 0, 0);

export const tmpVec3 = () => new Vector3();
export const tmpQuat = () => new Quaternion();
export const tmpMat4 = () => new Matrix4();

export const safeNormalize = (vector: Vector3, fallback = FORWARD) => {
  if (vector.lengthSq() < 1e-8) {
    return fallback.clone();
  }

  return vector.normalize();
};

export const quaternionAngle = (a: Quaternion, b: Quaternion) => {
  const dot = Math.abs(a.dot(b));
  return 2 * Math.acos(Math.min(1, Math.max(-1, dot)));
};

export const expSmoothingFactor = (strength: number, deltaSeconds: number) =>
  1 - Math.exp(-Math.max(0.0001, strength) * Math.max(0.0001, deltaSeconds));

export const lookRotation = (forward: Vector3, up: Vector3) => {
  const z = safeNormalize(forward).clone();
  const x = safeNormalize(up.clone().cross(z), RIGHT).clone();
  const y = safeNormalize(z.clone().cross(x), UP).clone();
  const matrix = new Matrix4().makeBasis(x, y, z);
  return new Quaternion().setFromRotationMatrix(matrix);
};
