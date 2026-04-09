import { classifyIntent } from "@/lib/translation/classifyIntent";
import { extractEntities } from "@/lib/translation/extractEntities";
import { normalizeText } from "@/lib/translation/normalizeText";
import type { SemanticDomain, SemanticPlan } from "@/lib/types/plans";

const inferDomain = (normalizedText: string): SemanticDomain => {
  if (/accesibilidad|lsc|traduccion|traducción/.test(normalizedText)) {
    return "accessibility";
  }
  if (/widget|integracion|integración|implementacion|implementación/.test(normalizedText)) {
    return "integration";
  }
  if (/soporte|ayuda|contacto/.test(normalizedText)) {
    return "support";
  }
  if (/comprar|descargar|solicitar/.test(normalizedText)) {
    return "commerce";
  }
  if (/aprender|guia|guía/.test(normalizedText)) {
    return "education";
  }

  return "general";
};

export const translateTextToSemanticPlan = (sourceText: string): SemanticPlan => {
  const normalizedText = normalizeText(sourceText);
  const intent = classifyIntent(normalizedText);
  const domain = inferDomain(normalizedText);
  const entities = extractEntities(normalizedText);

  return {
    sourceText,
    normalizedText,
    locale: "es-CO",
    signLanguage: "LSC",
    domain,
    intent,
    entities,
    confidence: Math.min(0.94, 0.55 + entities.length * 0.08 + (intent !== "inform" ? 0.1 : 0)),
    notes: [
      "Motor local basado en reglas extensibles.",
      "Las señas y poses incluidas son placeholders funcionales de demo.",
    ],
  };
};
