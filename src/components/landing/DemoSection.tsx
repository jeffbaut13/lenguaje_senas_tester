import { FeatureCard } from "@/components/landing/FeatureCard";
import { SecondaryCard } from "@/components/landing/SecondaryCard";

export function DemoSection() {
  return (
    <section className="container-shell py-8 pb-24">
      <div className="grid gap-8">
        <FeatureCard
          badge="Accesibilidad"
          bullets={["LSC", "Traducción contextual", "Overlay embebible"]}
          ctaPrimary="Probar demo"
          ctaSecondary="Conocer más"
          description="Captura el bloque semántico correcto, reconstruye texto fragmentado entre spans y entrega una reproducción visual estable que puede interrumpirse cuando el usuario cambia de contexto."
          title="Un pipeline serio para traducir lo que importa en cada momento"
          translateId="card-accessibility"
        />
        <FeatureCard
          badge="Integración"
          bullets={["DOM capture", "semanticPlan", "playPlan"]}
          ctaPrimary="Ver integración"
          ctaSecondary="Solicitar implementación"
          description="Pensado para equipos de producto y frontend: reglas locales hoy, adaptador para IA externa mañana, y una librería de poses y frases que puede crecer sin rehacer el motor."
          title="Del DOM al avatar con capas claras, debug visible y crecimiento ordenado"
          translateId="card-integration"
        />
        <SecondaryCard />
      </div>
    </section>
  );
}
