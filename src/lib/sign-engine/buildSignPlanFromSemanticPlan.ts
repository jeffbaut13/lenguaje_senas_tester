import { signRepository } from "@/lib/repositories/signRepository";
import { resolvePhrasePlan } from "@/lib/sign-engine/resolvePhrasePlan";
import { resolveTokenPlan } from "@/lib/sign-engine/resolveTokenPlan";
import type { SemanticPlan, SignPlan } from "@/lib/types/plans";

export const buildSignPlanFromSemanticPlan = (semanticPlan: SemanticPlan): SignPlan => {
  const phraseMatch = resolvePhrasePlan(semanticPlan);
  const tokenResolution = resolveTokenPlan(semanticPlan.normalizedText);
  const steps: SignPlan["steps"] = [];
  const strategy: string[] = [];
  const added = new Set<string>();

  if (phraseMatch) {
    strategy.push(`phrase:${phraseMatch.id}`);
    phraseMatch.signIds.forEach((signId) => {
      if (added.has(signId)) {
        return;
      }
      steps.push({ type: "sign", signId, reason: "phrase" });
      added.add(signId);
    });
  }

  const intentMatch = signRepository.find((entry) => entry.intents?.includes(semanticPlan.intent));
  if (intentMatch && !added.has(intentMatch.id)) {
    strategy.push(`intent:${semanticPlan.intent}`);
    steps.push({ type: "sign", signId: intentMatch.id, reason: "intent" });
    added.add(intentMatch.id);
  }

  tokenResolution.matchedSignIds.forEach((signId) => {
    if (added.has(signId)) {
      return;
    }
    strategy.push(`token:${signId}`);
    steps.push({ type: "sign", signId, reason: "token" });
    added.add(signId);
  });

  tokenResolution.unmatchedTokens.forEach((token) => {
    strategy.push(`fingerspell:${token}`);
    steps.push({ type: "fingerspell", token, reason: "fallback" });
  });

  if (steps.length === 0) {
    steps.push({ type: "sign", signId: "INFO_EMPHASIS", reason: "intent" });
    strategy.push("default:INFO_EMPHASIS");
  }

  return {
    sourceText: semanticPlan.sourceText,
    matchedPhraseIds: phraseMatch ? [phraseMatch.id] : [],
    strategy,
    steps,
    unmatchedTokens: tokenResolution.unmatchedTokens,
  };
};
