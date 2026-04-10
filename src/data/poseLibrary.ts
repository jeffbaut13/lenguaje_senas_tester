import { buildWaveHelloMacroPoses } from "@/data/actionMacros";
import { handLibrary } from "@/data/handLibrary";
import { clampBones, fromLimits, fromLimitsPairFromLeft } from "@/data/jointLimits";
import {
  composeMotionBones,
  handPresetBones,
  neutralBodyBones,
} from "@/data/motionPrimitives";
import type { PoseEntry } from "@/lib/types/plans";

const baseArmature = {
  LeftShoulder: [0, 0, -8] as [number, number, number],
  RightShoulder: [0, 0, 8] as [number, number, number],
  LeftUpperArm: [0, 0, -6] as [number, number, number],
  RightUpperArm: [0, 0, 6] as [number, number, number],
  LeftLowerArm: [0, 0, 0] as [number, number, number],
  RightLowerArm: [0, 0, 0] as [number, number, number],
  LeftHand: [0, 0, 0] as [number, number, number],
  RightHand: [0, 0, 0] as [number, number, number],
  LeftThumbMetacarpal: [0, 0, 0] as [number, number, number],
  LeftThumbProximal: [0, 0, 0] as [number, number, number],
  LeftThumbDistal: [0, 0, 0] as [number, number, number],
  LeftIndexProximal: [0, 0, 0] as [number, number, number],
  LeftIndexIntermediate: [0, 0, 0] as [number, number, number],
  LeftIndexDistal: [0, 0, 0] as [number, number, number],
  LeftMiddleProximal: [0, 0, 0] as [number, number, number],
  LeftMiddleIntermediate: [0, 0, 0] as [number, number, number],
  LeftMiddleDistal: [0, 0, 0] as [number, number, number],
  LeftRingProximal: [0, 0, 0] as [number, number, number],
  LeftRingIntermediate: [0, 0, 0] as [number, number, number],
  LeftRingDistal: [0, 0, 0] as [number, number, number],
  LeftLittleProximal: [0, 0, 0] as [number, number, number],
  LeftLittleIntermediate: [0, 0, 0] as [number, number, number],
  LeftLittleDistal: [0, 0, 0] as [number, number, number],
  RightThumbMetacarpal: [0, 0, 0] as [number, number, number],
  RightThumbProximal: [0, 0, 0] as [number, number, number],
  RightThumbDistal: [0, 0, 0] as [number, number, number],
  RightIndexProximal: [0, 0, 0] as [number, number, number],
  RightIndexIntermediate: [0, 0, 0] as [number, number, number],
  RightIndexDistal: [0, 0, 0] as [number, number, number],
  RightMiddleProximal: [0, 0, 0] as [number, number, number],
  RightMiddleIntermediate: [0, 0, 0] as [number, number, number],
  RightMiddleDistal: [0, 0, 0] as [number, number, number],
  RightRingProximal: [0, 0, 0] as [number, number, number],
  RightRingIntermediate: [0, 0, 0] as [number, number, number],
  RightRingDistal: [0, 0, 0] as [number, number, number],
  RightLittleProximal: [0, 0, 0] as [number, number, number],
  RightLittleIntermediate: [0, 0, 0] as [number, number, number],
  RightLittleDistal: [0, 0, 0] as [number, number, number],
  Neck: [0, 0, 0] as [number, number, number],
  Head: [0, 0, 0] as [number, number, number],
  Chest: [0, 0, 0] as [number, number, number],
};

const pose = (
  id: string,
  label: string,
  description: string,
  bones: Record<string, [number, number, number]>,
  tags: string[],
  category: string,
  durationMs = 420,
  emphasis = 0.5,
): PoseEntry => ({
  id,
  label,
  description,
  durationMs,
  emphasis,
  tags,
  metadata: {
    placeholder: true,
    category,
  },
  bones: clampBones({
    ...baseArmature,
    ...bones,
  }),
});

export const poseLibrary: PoseEntry[] = [
  pose(
    "NEUTRAL",
    "Neutral",
    "Pose de reposo con cuerpo neutro y manos relajadas.",
    composeMotionBones(neutralBodyBones, handPresetBones("relaxed", "pair")),
    ["base"],
    "base",
    320,
    0.18,
  ),
  pose(
    "FIST_LEFT",
    "Puño izquierdo cerrado",
    "Cuerpo neutro con mano derecha relajada y puño izquierdo cerrado.",
    composeMotionBones(
      neutralBodyBones,
      handPresetBones("relaxed", "right"),
      handPresetBones("fist", "left"),
    ),
    ["base"],
    "base",
    320,
    0.18,
  ),
  pose(
    "FIST_RIGHT",
    "Puño derecho cerrado",
    "Cuerpo neutro con mano izquierda relajada y puño derecho cerrado.",
    composeMotionBones(
      neutralBodyBones,
      handPresetBones("relaxed", "left"),
      handPresetBones("fist", "right"),
    ),
    ["base"],
    "base",
    320,
    0.18,
  ),
  pose(
    "HANDS_FRONT_FISTS",
    "Ambos puños al frente",
    "Ambos brazos al frente con puños cerrados, util para guardia o enfasis bilateral.",
    composeMotionBones(
      neutralBodyBones,
      {
        LeftShoulder: fromLimits("LeftShoulder", 0.88, 0.43, 0.24),
        RightShoulder: fromLimits("RightShoulder", 0.18, 0.22, 0.68),
        LeftUpperArm: fromLimits("LeftUpperArm", 0.26, 0, 0),
        RightUpperArm: fromLimits("RightUpperArm", 0.69, 0.88, 0.95),
        LeftLowerArm: fromLimits("LeftLowerArm", 0.32, 0.27, 0.52),
        RightLowerArm: fromLimits("RightLowerArm", 0.14, 0, 1),
        LeftHand: fromLimits("LeftHand", 0.66, 0.5, 0.5),
        RightHand: fromLimits("RightHand", 0.66, 0.5, 0.5),
        Chest: fromLimits("Chest", 0.6, 0.5, 0.5),
      },
      handPresetBones("fist", "pair"),
    ),
    ["base", "two_hands", "fist"],
    "base",
    380,
    0.34,
  ),
  pose(
    "HANDS_UP_SUN_PALMS",
    "Manos al cielo (palmas planas)",
    "Ambos brazos elevados hacia arriba, como tocando el sol, con dedos extendidos en plano.",
    composeMotionBones(
      neutralBodyBones,
      {
        ...fromLimitsPairFromLeft("LeftShoulder", [1.0, 0.72, 0.88]),
        ...fromLimitsPairFromLeft("LeftUpperArm", [0.08, 0.68, 0.94]),
        ...fromLimitsPairFromLeft("LeftLowerArm", [0.9, 0.4, 0.54]),
        ...fromLimitsPairFromLeft("LeftHand", [0.18, 0.6, 0.68]),
        Chest: fromLimits("Chest", 0.58, 0.50, 0.50),
        Head: fromLimits("Head", 0.34, 0.50, 0.50),
      },
      handPresetBones("plane", "pair"),
    ),
    ["base", "two_hands", "up", "plane"],
    "base",
    420,
    0.42,
  ),
  /*  ...buildWaveHelloMacroPoses().map((macro) =>
    pose(
      macro.id,
      macro.label,
      macro.description,
      macro.bones,
      macro.tags,
      macro.category,
      macro.durationMs,
      macro.emphasis,
    ),
  ), */
];

export const getPoseEntry = (id: string) =>
  poseLibrary.find((entry) => entry.id === id);
export { handLibrary };
