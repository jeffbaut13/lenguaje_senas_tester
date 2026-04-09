import type { SemanticIntent } from "@/lib/types/plans";

const intentMatchers: Array<{ intent: SemanticIntent; patterns: RegExp[] }> = [
  { intent: "integrate", patterns: [/integracion/, /widget/, /embebible/, /api/] },
  { intent: "implement", patterns: [/implementacion/, /implementa/, /despliegue/, /solicitar/] },
  { intent: "support", patterns: [/soporte/, /ayuda/, /acompanamiento/, /acompañamiento/] },
  { intent: "learn", patterns: [/aprender/, /conocer/, /guia/, /guía/] },
  { intent: "contact", patterns: [/contacto/, /hablar/, /escribir/] },
  { intent: "cta", patterns: [/probar/, /ver /, /conocer mas/, /conocer más/, /solicitar/] },
  { intent: "navigate", patterns: [/siguiente/, /volver/, /aqui/, /aquí/] },
  { intent: "observe", patterns: [/ver/, /revisar/, /explorar/] },
];

export const classifyIntent = (normalizedText: string): SemanticIntent => {
  for (const matcher of intentMatchers) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedText))) {
      return matcher.intent;
    }
  }

  return "inform";
};
