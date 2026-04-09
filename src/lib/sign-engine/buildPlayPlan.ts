import { getSignEntry } from "@/lib/repositories/signRepository";
import { getTransitionEntry } from "@/lib/repositories/transitionRepository";
import { resolveFingerSpellingPlan } from "@/lib/sign-engine/resolveFingerSpellingPlan";
import type { PlayPlan, PlayStep, SignPlan } from "@/lib/types/plans";

const pushTransition = (steps: PlayStep[], fromPoseId: string | null, toPoseId: string) => {
  if (!fromPoseId) {
    return;
  }

  const transition = getTransitionEntry(fromPoseId, toPoseId);
  if (!transition) {
    return;
  }

  steps.push({
    id: `transition-${fromPoseId}-${toPoseId}-${steps.length}`,
    type: "transition",
    label: `Transición ${fromPoseId} -> ${toPoseId}`,
    durationMs: transition.durationMs,
    poseId: toPoseId,
    source: transition.id,
  });
};

export const buildPlayPlan = (signPlan: SignPlan): PlayPlan => {
  const steps: PlayStep[] = [];
  let lastPoseId: string | null = null;

  signPlan.steps.forEach((signStep, index) => {
    if (signStep.type === "fingerspell" && signStep.token) {
      resolveFingerSpellingPlan(signStep.token).forEach((spellStep) => {
        pushTransition(steps, lastPoseId, spellStep.poseId ?? "NEUTRAL");
        steps.push(spellStep);
        lastPoseId = spellStep.poseId ?? lastPoseId;
      });
      steps.push({
        id: `pause-fingerspell-${index}`,
        type: "pause",
        label: "Pausa de deletreo",
        durationMs: 120,
      });
      return;
    }

    if (!signStep.signId) {
      return;
    }

    const signEntry = getSignEntry(signStep.signId);
    if (!signEntry) {
      return;
    }

    if (signEntry.type === "pose" && signEntry.poseId) {
      pushTransition(steps, lastPoseId, signEntry.poseId);
      steps.push({
        id: `sign-${signEntry.id}-${index}`,
        type: "pose",
        label: signEntry.label,
        durationMs: signEntry.durationMs,
        poseId: signEntry.poseId,
        signId: signEntry.id,
        source: signStep.reason,
      });
      lastPoseId = signEntry.poseId;
      return;
    }

    signEntry.sequence?.forEach((unit, unitIndex) => {
      if (unit.kind === "pause") {
        steps.push({
          id: `pause-${signEntry.id}-${unitIndex}`,
          type: "pause",
          label: `Pausa ${signEntry.label}`,
          durationMs: unit.durationMs,
          signId: signEntry.id,
          source: signStep.reason,
        });
        return;
      }

      if (!unit.poseId) {
        return;
      }

      pushTransition(steps, lastPoseId, unit.poseId);
      steps.push({
        id: `sign-${signEntry.id}-${unitIndex}`,
        type: "pose",
        label: signEntry.label,
        durationMs: unit.durationMs,
        poseId: unit.poseId,
        signId: signEntry.id,
        source: signStep.reason,
      });
      lastPoseId = unit.poseId;
    });
  });

  if (lastPoseId !== "NEUTRAL") {
    pushTransition(steps, lastPoseId, "NEUTRAL");
    steps.push({
      id: "neutral-end",
      type: "pose",
      label: "Neutral",
      durationMs: 280,
      poseId: "NEUTRAL",
      source: "reset",
    });
  }

  return {
    sourceText: signPlan.sourceText,
    steps,
    finalPoseId: "NEUTRAL",
  };
};
