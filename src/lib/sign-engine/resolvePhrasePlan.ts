import { findPhraseByNormalizedText } from "@/lib/repositories/phraseRepository";
import type { PhraseEntry, SemanticPlan } from "@/lib/types/plans";

export const resolvePhrasePlan = (semanticPlan: SemanticPlan): PhraseEntry | null =>
  findPhraseByNormalizedText(semanticPlan.normalizedText) ?? null;
