import { buildPlayPlan } from "@/lib/sign-engine/buildPlayPlan";
import { buildSignPlanFromSemanticPlan } from "@/lib/sign-engine/buildSignPlanFromSemanticPlan";
import { translateTextToSemanticPlan } from "@/lib/translation/translateTextToSemanticPlan";
import type { TranslationBundle } from "@/lib/types/plans";

export const planTranslation = (text: string): TranslationBundle => {
  const semanticPlan = translateTextToSemanticPlan(text);
  const signPlan = buildSignPlanFromSemanticPlan(semanticPlan);
  const playPlan = buildPlayPlan(signPlan);

  return {
    semanticPlan,
    signPlan,
    playPlan,
  };
};
