import {
  composeMotionBones,
  handPresetBones,
  neutralBodyBones,
  raiseHandPrimitive,
  wristWavePrimitive,
  type PoseBones,
} from "@/data/motionPrimitives";

export interface MacroPoseDefinition {
  id: string;
  label: string;
  description: string;
  durationMs: number;
  emphasis: number;
  tags: string[];
  category: string;
  bones: PoseBones;
}

export const buildWaveHelloMacroPoses = (): MacroPoseDefinition[] => {
  const relaxedBothHands = composeMotionBones(
    handPresetBones("relaxed", "left"),
    handPresetBones("relaxed", "right"),
  );

  return [
    {
      id: "WAVE_HELLO_PREP",
      label: "Wave Hello Prep",
      description: "Preparacion: brazo derecho sube y la mano se abre en posicion de saludo.",
      durationMs: 220,
      emphasis: 0.55,
      tags: ["macro", "wave", "hello"],
      category: "macro",
      bones: composeMotionBones(neutralBodyBones, relaxedBothHands, raiseHandPrimitive("right", 0.88)),
    },
    {
      id: "WAVE_HELLO_SWING_OUT",
      label: "Wave Hello Swing Out",
      description: "Primer barrido de saludo hacia afuera usando muneca y antebrazo.",
      durationMs: 170,
      emphasis: 0.62,
      tags: ["macro", "wave", "hello"],
      category: "macro",
      bones: composeMotionBones(
        neutralBodyBones,
        relaxedBothHands,
        raiseHandPrimitive("right", 0.92),
        wristWavePrimitive("right", "out", 0.9),
      ),
    },
    {
      id: "WAVE_HELLO_SWING_IN",
      label: "Wave Hello Swing In",
      description: "Segundo barrido de saludo hacia adentro para completar el gesto.",
      durationMs: 170,
      emphasis: 0.62,
      tags: ["macro", "wave", "hello"],
      category: "macro",
      bones: composeMotionBones(
        neutralBodyBones,
        relaxedBothHands,
        raiseHandPrimitive("right", 0.92),
        wristWavePrimitive("right", "in", 0.9),
      ),
    },
    {
      id: "WAVE_HELLO_END",
      label: "Wave Hello End",
      description: "Salida controlada: brazo desciende parcialmente y vuelve a reposo.",
      durationMs: 220,
      emphasis: 0.45,
      tags: ["macro", "wave", "hello"],
      category: "macro",
      bones: composeMotionBones(neutralBodyBones, relaxedBothHands, raiseHandPrimitive("right", 0.35)),
    },
  ];
};
