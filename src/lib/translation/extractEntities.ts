import type { SemanticEntity } from "@/lib/types/plans";

const entityMatchers: Array<{ type: SemanticEntity["type"]; terms: string[] }> = [
  { type: "feature", terms: ["accesibilidad", "traduccion", "traducción", "lsc", "widget", "avatar"] },
  { type: "cta", terms: ["probar", "ver", "solicitar", "conocer", "descargar"] },
  { type: "audience", terms: ["usuarios sordos", "equipos", "plataformas"] },
  { type: "action", terms: ["integracion", "integración", "implementacion", "implementación", "soporte"] },
  { type: "metric", terms: ["impacto", "analitica", "analítica"] },
];

export const extractEntities = (normalizedText: string): SemanticEntity[] => {
  const found: SemanticEntity[] = [];

  entityMatchers.forEach((matcher) => {
    matcher.terms.forEach((term) => {
      if (normalizedText.includes(term)) {
        found.push({ type: matcher.type, value: term });
      }
    });
  });

  return found;
};
