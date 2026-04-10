const featureCards = [
  {
    badge: "Traduccion",
    title: "Del DOM al avatar con capas claras y depurables",
    description:
      "El producto principal sigue un flujo controlado: captura semantica del texto, normalizacion, semanticPlan, signPlan, playPlan y reproduccion visual. Nada de landmarks crudos moviendo el avatar en runtime.",
    bullets: ["semanticPlan", "signPlan", "playPlan"],
    ctaPrimary: "Conocer mas",
    ctaSecondary: "Ver debug",
    translateId: "feature-pipeline",
  },
  {
    badge: "Integracion",
    title: "Un widget embebible que reacciona al contenido relevante",
    description:
      "El avatar acompana titulos, parrafos cortos y CTAs sin pedir permisos del navegador. Puedes activar la traduccion por hover, focus o click segun el contexto del producto.",
    bullets: ["Widget embebible", "Fingerspelling", "Replace playback"],
    ctaPrimary: "Ver integracion",
    ctaSecondary: "Solicitar implementacion",
    translateId: "feature-widget",
  },
];

const supportHighlights = [
  "Biblioteca inicial de poses y micro-secuencias para la landing",
  "Ruta interna para capturar poses candidatas desde tres videos",
  "Staging de poses antes de promoverlas a la libreria estable",
];

export function DemoSection() {
  return (
    <section className="container-shell pb-24">
      <div className="grid gap-8">
        {featureCards.map((card, index) => (
          <article key={card.title} className="editorial-card grid gap-8 overflow-hidden p-6 md:grid-cols-[0.95fr_1.05fr] md:p-8 lg:p-10">
            <div
              className={`relative min-h-[280px] overflow-hidden rounded-[30px] ${
                index === 0 ? "bg-[linear-gradient(160deg,#f5e8d6_0%,#fff9f2_50%,#ebd4b6_100%)]" : "bg-[linear-gradient(160deg,#efe4d1_0%,#fffaf4_45%,#f4d4bf_100%)]"
              }`}
            >
              <div className="absolute inset-6 rounded-[24px] border border-white/40" />
              <div className="absolute left-7 top-7 h-24 w-24 rounded-[28px] bg-white/55 shadow-lg" />
              <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/45 bg-[rgba(255,251,245,0.78)] p-5 backdrop-blur-sm">
                <div className="h-3 w-24 rounded-full bg-[rgba(217,119,53,0.36)]" />
                <div className="mt-4 h-3 w-32 rounded-full bg-[rgba(36,29,24,0.14)]" />
                <div className="mt-3 h-3 w-full rounded-full bg-[rgba(36,29,24,0.08)]" />
                <div className="mt-3 h-3 w-4/5 rounded-full bg-[rgba(36,29,24,0.08)]" />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div>
                <span className="eyebrow !text-[10px]">{card.badge}</span>
                <h2 className="section-title interactive-target mt-5" data-semantic-scope="block" data-translate="block" data-translate-id={`${card.translateId}-title`} tabIndex={0}>
                  {card.title}
                </h2>
                <p
                  className="body-copy interactive-target mt-4"
                  data-semantic-scope="block"
                  data-translate="block"
                  data-translate-id={`${card.translateId}-description`}
                  tabIndex={0}
                >
                  {card.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.bullets.map((bullet) => (
                    <span
                      key={bullet}
                      className="interactive-target rounded-full border border-[var(--border)] bg-[rgba(255,249,240,0.86)] px-3 py-2 text-sm text-[var(--muted)]"
                      data-semantic-scope="block"
                      data-surface="true"
                      data-translate="block"
                      data-translate-id={`${card.translateId}-${bullet}`}
                      tabIndex={0}
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="action-button primary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id={`${card.translateId}-cta-primary`} type="button">
                  {card.ctaPrimary}
                </button>
                <button className="action-button secondary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id={`${card.translateId}-cta-secondary`} type="button">
                  {card.ctaSecondary}
                </button>
              </div>
            </div>
          </article>
        ))}

        <section className="editorial-card grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10">
          <div className="space-y-5">
            <span className="eyebrow !text-[10px]">Authoring y crecimiento</span>
            <h2 className="section-title interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="support-title" tabIndex={0}>
              Una base seria para crecer nuevas poses sin volver el producto una app de camara
            </h2>
            <p className="body-copy interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="support-copy" tabIndex={0}>
              El runtime principal sigue limpio. El toolkit de authoring procesa videos de referencia, selecciona keyframes y construye candidate poses que se guardan en staging para revision antes de entrar a la pose library estable.
            </p>
            <div className="grid gap-3">
              {supportHighlights.map((item, index) => (
                <button
                  key={item}
                  className="interactive-target rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.88)] p-4 text-left text-sm text-[var(--text)]"
                  data-semantic-scope="block"
                  data-surface="true"
                  data-translate="block"
                  data-translate-id={`support-item-${index}`}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-[linear-gradient(180deg,#f7edde_0%,#eddac2_100%)] p-5">
            <div className="rounded-[26px] border border-white/55 bg-[rgba(255,251,245,0.78)] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Superficies de prueba</p>
              <div className="mt-5 space-y-4">
                {[
                  ["Landing", "Titulos, parrafos y botones listos para probar hover, focus o click."],
                  ["Pose Library", "Pagina de validacion visual para revisar poses y secuencias."],
                  ["Pose Capture", "Herramienta interna para procesar tres videos y producir candidate pose data."],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="interactive-target rounded-[22px] border border-[var(--border)] bg-white/60 p-4"
                    data-semantic-scope="block"
                    data-surface="true"
                    data-translate="block"
                    data-translate-id={`surface-${title}`}
                    tabIndex={0}
                  >
                    <div className="font-semibold">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
