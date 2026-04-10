import type { HandPresetEntry } from "@/lib/types/plans";

type HandBones = Record<string, [number, number, number]>;
export type HandPresetFamily = "relaxed" | "plane" | "fist";
export type HandPresetVariant = "left" | "right" | "pair";

const mergeHandBones = (...sets: HandBones[]): HandBones => Object.assign({}, ...sets);

export const relaxedFingersLeft = {
  LeftThumbMetacarpal: [0, 10, -10] as [number, number, number],
  LeftThumbProximal: [0, 40, -10] as [number, number, number],
  LeftThumbDistal: [0, 20, 0] as [number, number, number],
  LeftIndexProximal: [0, 5, -20] as [number, number, number],
  LeftIndexIntermediate: [0, 0, -10] as [number, number, number],
  LeftIndexDistal: [0, 0, -20] as [number, number, number],
  LeftMiddleProximal: [0, 4, -25] as [number, number, number],
  LeftMiddleIntermediate: [0, 0, -10] as [number, number, number],
  LeftMiddleDistal: [0, 0, -20] as [number, number, number],
  LeftRingProximal: [0, 3, -28] as [number, number, number],
  LeftRingIntermediate: [0, 0, -10] as [number, number, number],
  LeftRingDistal: [0, 0, -20] as [number, number, number],
  LeftLittleProximal: [0, 0, -30] as [number, number, number],
  LeftLittleIntermediate: [0, 0, -10] as [number, number, number],
  LeftLittleDistal: [0, 0, -20] as [number, number, number],
};

export const relaxedFingersRight = {
  RightThumbMetacarpal: [0, -10, 10] as [number, number, number],
  RightThumbProximal: [0, -40, -10] as [number, number, number],
  RightThumbDistal: [0, -20, 0] as [number, number, number],
  RightIndexProximal: [0, -5, 20] as [number, number, number],
  RightIndexIntermediate: [0, 0, 10] as [number, number, number],
  RightIndexDistal: [0, 0, 20] as [number, number, number],
  RightMiddleProximal: [0, -4, 25] as [number, number, number],
  RightMiddleIntermediate: [0, 0, 10] as [number, number, number],
  RightMiddleDistal: [0, 0, 20] as [number, number, number],
  RightRingProximal: [0, -3, 28] as [number, number, number],
  RightRingIntermediate: [0, 0, 10] as [number, number, number],
  RightRingDistal: [0, 0, 20] as [number, number, number],
  RightLittleProximal: [0, 0, 30] as [number, number, number],
  RightLittleIntermediate: [0, 0, 10] as [number, number, number],
  RightLittleDistal: [0, 0, 20] as [number, number, number],
};

export const relaxedFingers = mergeHandBones(relaxedFingersLeft, relaxedFingersRight);

export const planeFingersCloseLeft = {
  LeftThumbMetacarpal: [0, 30, 0] as [number, number, number],
  LeftThumbProximal: [0, 5, 0] as [number, number, number],
  LeftThumbDistal: [0, -10, 0] as [number, number, number],
  LeftIndexProximal: [0, 8, 0] as [number, number, number],
  LeftIndexIntermediate: [0, 0, 0] as [number, number, number],
  LeftIndexDistal: [0, 0, 0] as [number, number, number],
  LeftMiddleProximal: [0, 4, 0] as [number, number, number],
  LeftMiddleIntermediate: [0, 0, 0] as [number, number, number],
  LeftMiddleDistal: [0, 0, 0] as [number, number, number],
  LeftRingProximal: [0, 2, 0] as [number, number, number],
  LeftRingIntermediate: [0, 0, 0] as [number, number, number],
  LeftRingDistal: [0, 0, 0] as [number, number, number],
  LeftLittleProximal: [0, -2, 0] as [number, number, number],
  LeftLittleIntermediate: [0, 0, 0] as [number, number, number],
  LeftLittleDistal: [0, 0, 0] as [number, number, number],
};

export const planeFingersCloseRight = {
  RightThumbMetacarpal: [0, -30, 0] as [number, number, number],
  RightThumbProximal: [0, -5, 0] as [number, number, number],
  RightThumbDistal: [0, 10, 0] as [number, number, number],
  RightIndexProximal: [0, -8, 0] as [number, number, number],
  RightIndexIntermediate: [0, 0, 0] as [number, number, number],
  RightIndexDistal: [0, 0, 0] as [number, number, number],
  RightMiddleProximal: [0, -4, 0] as [number, number, number],
  RightMiddleIntermediate: [0, 0, 0] as [number, number, number],
  RightMiddleDistal: [0, 0, 0] as [number, number, number],
  RightRingProximal: [0, -2, 0] as [number, number, number],
  RightRingIntermediate: [0, 0, 0] as [number, number, number],
  RightRingDistal: [0, 0, 0] as [number, number, number],
  RightLittleProximal: [0, 2, 0] as [number, number, number],
  RightLittleIntermediate: [0, 0, 0] as [number, number, number],
  RightLittleDistal: [0, 0, 0] as [number, number, number],
};

export const planeFingersClose = mergeHandBones(planeFingersCloseLeft, planeFingersCloseRight);

export const fistLeft = {
  LeftThumbMetacarpal: [50, 0, -20] as [number, number, number],
  LeftThumbProximal: [0, 40, -10] as [number, number, number],
  LeftThumbDistal: [0, 70, 0] as [number, number, number],
  LeftIndexProximal: [0, 0, -90] as [number, number, number],
  LeftIndexIntermediate: [0, 0, -90] as [number, number, number],
  LeftIndexDistal: [0, 0, -90] as [number, number, number],
  LeftMiddleProximal: [0, 0, -95] as [number, number, number],
  LeftMiddleIntermediate: [0, 0, -90] as [number, number, number],
  LeftMiddleDistal: [0, 0, -90] as [number, number, number],
  LeftRingProximal: [0, 0, -98] as [number, number, number],
  LeftRingIntermediate: [0, 0, -90] as [number, number, number],
  LeftRingDistal: [0, 0, -90] as [number, number, number],
  LeftLittleProximal: [0, 0, -100] as [number, number, number],
  LeftLittleIntermediate: [0, 0, -90] as [number, number, number],
  LeftLittleDistal: [0, 0, -90] as [number, number, number],
};

export const fistRight = {
  RightThumbMetacarpal: [50, 0, 20] as [number, number, number],
  RightThumbProximal: [0, -40, -10] as [number, number, number],
  RightThumbDistal: [0, -70, 0] as [number, number, number],
  RightIndexProximal: [0, 0, 90] as [number, number, number],
  RightIndexIntermediate: [0, 0, 90] as [number, number, number],
  RightIndexDistal: [0, 0, 90] as [number, number, number],
  RightMiddleProximal: [0, 0, 95] as [number, number, number],
  RightMiddleIntermediate: [0, 0, 90] as [number, number, number],
  RightMiddleDistal: [0, 0, 90] as [number, number, number],
  RightRingProximal: [0, 0, 98] as [number, number, number],
  RightRingIntermediate: [0, 0, 90] as [number, number, number],
  RightRingDistal: [0, 0, 90] as [number, number, number],
  RightLittleProximal: [0, 0, 100] as [number, number, number],
  RightLittleIntermediate: [0, 0, 90] as [number, number, number],
  RightLittleDistal: [0, 0, 90] as [number, number, number],
};

export const fistBoth = mergeHandBones(fistLeft, fistRight);

export const debugFinger = {
  LeftThumbMetacarpal: [0, 0, 0] as [number, number, number],
  LeftThumbProximal: [0, 0, 0] as [number, number, number],
  LeftThumbDistal: [0, 0, 0] as [number, number, number],
  LeftIndexProximal: [0, 5, -20] as [number, number, number],
  LeftIndexIntermediate: [0, 0, -10] as [number, number, number],
  LeftIndexDistal: [0, 0, -20] as [number, number, number],
};

export const pointIndexLeft = {
  ...planeFingersClose,
  LeftIndexProximal: [0, 5, -20] as [number, number, number],
  LeftIndexIntermediate: [0, 0, -10] as [number, number, number],
  LeftIndexDistal: [0, 0, -20] as [number, number, number],
};

export const pointIndexRight = {
  ...planeFingersClose,
  RightIndexProximal: [0, -5, 20] as [number, number, number],
  RightIndexIntermediate: [0, 0, 10] as [number, number, number],
  RightIndexDistal: [0, 0, 20] as [number, number, number],
};

const handPresetBonesByFamily: Record<HandPresetFamily, Record<HandPresetVariant, HandBones>> = {
  relaxed: {
    left: relaxedFingersLeft,
    right: relaxedFingersRight,
    pair: relaxedFingers,
  },
  plane: {
    left: planeFingersCloseLeft,
    right: planeFingersCloseRight,
    pair: planeFingersClose,
  },
  fist: {
    left: fistLeft,
    right: fistRight,
    pair: fistBoth,
  },
};

export const getHandPresetBones = (family: HandPresetFamily, variant: HandPresetVariant = "pair") =>
  handPresetBonesByFamily[family][variant];

export const createHandPreset = (family: HandPresetFamily, variant: HandPresetVariant = "pair"): HandPresetEntry => {
  const baseLabel = family === "plane" ? "Hand Plane Close" : `Hand ${family.charAt(0).toUpperCase()}${family.slice(1)}`;
  const variantLabel = variant === "pair" ? "Pair" : variant === "left" ? "Left" : "Right";
  const idSuffix = variant === "pair" ? "PAIR" : variant.toUpperCase();
  return {
    id: `HAND_${family.toUpperCase()}_${idSuffix}`,
    label: `${baseLabel} ${variantLabel}`,
    description: `Preset ${family} para mano ${variant === "pair" ? "izquierda y derecha" : variant}.`,
    bones: getHandPresetBones(family, variant),
    tags: [family, variant],
  };
};

export const handLibrary: HandPresetEntry[] = [
  {
    id: "HAND_RELAXED_LEFT",
    label: "Hand Relaxed Left",
    description: "Preset relajado solo para la mano izquierda.",
    bones: relaxedFingersLeft,
    tags: ["relaxed", "left"],
  },
  {
    id: "HAND_RELAXED_RIGHT",
    label: "Hand Relaxed Right",
    description: "Preset relajado solo para la mano derecha.",
    bones: relaxedFingersRight,
    tags: ["relaxed", "right"],
  },
  {
    id: "HAND_RELAXED",
    label: "Hand Relaxed",
    description: "Preset relajado base capturado con rangos validados sobre este VRM.",
    bones: relaxedFingers,
    tags: ["relaxed", "pair", "base"],
  },
  {
    id: "HAND_PLANE_CLOSE_LEFT",
    label: "Hand Plane Close Left",
    description: "Mano plana y controlada solo para la mano izquierda.",
    bones: planeFingersCloseLeft,
    tags: ["plane", "close", "left"],
  },
  {
    id: "HAND_PLANE_CLOSE_RIGHT",
    label: "Hand Plane Close Right",
    description: "Mano plana y controlada solo para la mano derecha.",
    bones: planeFingersCloseRight,
    tags: ["plane", "close", "right"],
  },
  {
    id: "HAND_PLANE_CLOSE",
    label: "Hand Plane Close",
    description: "Mano plana y controlada para estados intermedios o presentacion.",
    bones: planeFingersClose,
    tags: ["plane", "close", "pair"],
  },
  {
    id: "HAND_FIST_LEFT",
    label: "Hand Fist Left",
    description: "Puno izquierdo cerrado usando el rango calibrado de dedos.",
    bones: fistLeft,
    tags: ["fist", "left"],
  },
  {
    id: "HAND_FIST_RIGHT",
    label: "Hand Fist Right",
    description: "Puno derecho cerrado usando el rango calibrado de dedos.",
    bones: fistRight,
    tags: ["fist", "right"],
  },
  {
    id: "HAND_FIST",
    label: "Hand Fist Pair",
    description: "Punos izquierdo y derecho cerrados usando el rango calibrado de dedos.",
    bones: fistBoth,
    tags: ["fist", "pair"],
  },
  {
    id: "HAND_POINT_INDEX_LEFT",
    label: "Hand Point Index Left",
    description: "Indice izquierdo extendido con resto de dedos mas controlados.",
    bones: pointIndexLeft,
    tags: ["point", "left"],
  },
  {
    id: "HAND_POINT_INDEX_RIGHT",
    label: "Hand Point Index Right",
    description: "Indice derecho extendido con resto de dedos mas controlados.",
    bones: pointIndexRight,
    tags: ["point", "right"],
  },
  {
    id: "HAND_DEBUG_INDEX_LEFT",
    label: "Hand Debug Index Left",
    description: "Preset minimo para inspeccionar indice y pulgar izquierdos.",
    bones: debugFinger,
    tags: ["debug", "left"],
  },
];
