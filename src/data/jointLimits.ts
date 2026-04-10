export type BoneRotation = [number, number, number];

export interface JointLimit {
  x: [number, number];
  y: [number, number];
  z: [number, number];
}

type NormalizedRotation = [number, number, number];
type AxisMirrorConfig = { x: boolean; y: boolean; z: boolean };

const DEFAULT_JOINT_LIMIT: JointLimit = {
  x: [-120, 120],
  y: [-120, 120],
  z: [-120, 120],
};

/* ── Canonical Left-side limits (Right is auto-derived by mirroring) ─── */

const LEFT_LIMITS: Record<string, JointLimit> = {
  LeftShoulder: { x: [-111, 70], y: [-26, 50], z: [-10, 15] },
  LeftUpperArm: { x: [-162, 80], y: [-45, 40], z: [-60, 53] },
  LeftLowerArm: { x: [-63, -16], y: [-150, 15], z: [-80, 30] },
  LeftHand:     { x: [-60, 60], y: [-50, 50], z: [-60, 60] },
};

const CENTER_LIMITS: Record<string, JointLimit> = {
  Neck:  { x: [-35, 35], y: [-45, 45], z: [-30, 30] },
  Head:  { x: [-30, 30], y: [-60, 60], z: [-35, 35] },
  Chest: { x: [-25, 25], y: [-30, 30], z: [-20, 20] },
};

/*
 * Mirror config per bone-suffix:
 * true = negate the axis when deriving the right-side limit / rotation.
 */
const PAIR_MIRROR: Record<string, AxisMirrorConfig> = {
  Shoulder: { x: false, y: true, z: true },
  UpperArm: { x: false, y: true, z: true },
  LowerArm: { x: false, y: true, z: true },
  Hand:     { x: false, y: true, z: true },
};

const mirrorRange = ([lo, hi]: [number, number]): [number, number] => [-hi, -lo];

const deriveRightLimits = (): Record<string, JointLimit> => {
  const right: Record<string, JointLimit> = {};
  for (const [leftBone, limits] of Object.entries(LEFT_LIMITS)) {
    const suffix = leftBone.slice(4);
    const rightBone = `Right${suffix}`;
    const mirror = PAIR_MIRROR[suffix] ?? { x: false, y: true, z: true };
    right[rightBone] = {
      x: mirror.x ? mirrorRange(limits.x) : limits.x,
      y: mirror.y ? mirrorRange(limits.y) : limits.y,
      z: mirror.z ? mirrorRange(limits.z) : limits.z,
    };
  }
  return right;
};

export const jointLimits: Record<string, JointLimit> = {
  ...LEFT_LIMITS,
  ...deriveRightLimits(),
  ...CENTER_LIMITS,
};

const clampValue = (value: number, [min, max]: [number, number]) =>
  Math.min(max, Math.max(min, value));
const lerp = (min: number, max: number, t: number) =>
  min + (max - min) * Math.min(1, Math.max(0, t));

export const clampBoneRotation = (
  bone: string,
  rotation: BoneRotation,
): BoneRotation => {
  const limits = jointLimits[bone] ?? DEFAULT_JOINT_LIMIT;
  return [
    clampValue(rotation[0], limits.x),
    clampValue(rotation[1], limits.y),
    clampValue(rotation[2], limits.z),
  ];
};

/**
 * Construye una rotacion a partir de fracciones normalizadas del rango del hueso.
 * t=0 -> minimo, t=0.5 -> centro, t=1 -> maximo.
 */
export const fromLimits = (
  bone: string,
  tx: number,
  ty: number,
  tz: number,
): BoneRotation => {
  const limits = jointLimits[bone] ?? DEFAULT_JOINT_LIMIT;
  return [
    lerp(limits.x[0], limits.x[1], tx),
    lerp(limits.y[0], limits.y[1], ty),
    lerp(limits.z[0], limits.z[1], tz),
  ];
};

/**
 * Construye par simétrico Left / Right desde una sola referencia normalizada
 * del lado izquierdo. Los límites Right son espejo exacto del Left, por lo que
 * basta invertir la fracción (1-t) en ejes con mirror=true para obtener la
 * rotación negada exacta.
 */
export const fromLimitsPairFromLeft = (
  leftBone: string,
  leftNormalized: NormalizedRotation,
): Record<string, BoneRotation> => {
  const suffix = leftBone.startsWith("Left") ? leftBone.slice(4) : leftBone;
  const rightBone = `Right${suffix}`;
  const mirror = PAIR_MIRROR[suffix] ?? { x: false, y: true, z: true };

  const leftRotation = fromLimits(
    leftBone,
    leftNormalized[0],
    leftNormalized[1],
    leftNormalized[2],
  );
  const rightRotation = fromLimits(
    rightBone,
    mirror.x ? 1 - leftNormalized[0] : leftNormalized[0],
    mirror.y ? 1 - leftNormalized[1] : leftNormalized[1],
    mirror.z ? 1 - leftNormalized[2] : leftNormalized[2],
  );

  return {
    [leftBone]: leftRotation,
    [rightBone]: rightRotation,
  };
};

export const clampBones = (
  bones: Record<string, BoneRotation>,
): Record<string, BoneRotation> => {
  const clamped: Record<string, BoneRotation> = {};

  Object.entries(bones).forEach(([bone, rotation]) => {
    clamped[bone] = clampBoneRotation(bone, rotation);
  });

  return clamped;
};
