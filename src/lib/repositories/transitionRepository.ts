import transitions from "@/data/transitions.json";
import type { TransitionEntry } from "@/lib/types/plans";

export const transitionRepository = transitions as TransitionEntry[];

export const getTransitionEntry = (fromPoseId: string, toPoseId: string) =>
  transitionRepository.find((entry) => (entry.from === fromPoseId || entry.from === "ANY") && entry.to === toPoseId);
