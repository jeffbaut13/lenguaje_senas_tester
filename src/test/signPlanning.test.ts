import { describe, expect, it } from "vitest";
import { buildSignPlanFromSemanticPlan } from "@/lib/sign-engine/buildSignPlanFromSemanticPlan";
import { resolvePhrasePlan } from "@/lib/sign-engine/resolvePhrasePlan";
import { resolveFingerSpellingPlan } from "@/lib/sign-engine/resolveFingerSpellingPlan";
import { translateTextToSemanticPlan } from "@/lib/translation/translateTextToSemanticPlan";

describe("sign planning", () => {
  it("encuentra frases conocidas primero", () => {
    const semanticPlan = translateTextToSemanticPlan("Accesibilidad digital con traducción contextual en LSC");
    const phrase = resolvePhrasePlan(semanticPlan);

    expect(phrase?.id).toBe("PHRASE_ACCESSIBILITY_CONTEXTUAL");
  });

  it("produce un signPlan con match de frase y tokens", () => {
    const semanticPlan = translateTextToSemanticPlan("Solicitar implementación");
    const signPlan = buildSignPlanFromSemanticPlan(semanticPlan);

    expect(signPlan.steps.some((step) => step.signId === "IMPLEMENTACION")).toBe(true);
    expect(signPlan.strategy.some((step) => step.startsWith("phrase:"))).toBe(true);
  });

  it("usa fingerspelling para palabras no cubiertas", () => {
    const spelling = resolveFingerSpellingPlan("xyz");

    expect(spelling).toHaveLength(3);
    expect(spelling.map((step) => step.poseId)).toEqual(["FS_X", "FS_Y", "FS_Z"]);
  });
});
