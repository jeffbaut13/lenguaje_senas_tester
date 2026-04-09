const materials = [
  {
    icon: "⌂",
    title: "Texto semántico del sitio",
    description: "Reconstruye contenido aunque venga fragmentado en spans, links o nodos inline.",
    translateId: "material-site",
  },
  {
    icon: "◫",
    title: "Planes depurables",
    description: "Expone semanticPlan, signPlan y playPlan para iterar el motor sin romper la UI.",
    translateId: "material-plan",
  },
  {
    icon: "◎",
    title: "Avatar reactivo",
    description: "La reproducción actual se interrumpe y reemplaza cuando el usuario cambia de bloque.",
    translateId: "material-avatar",
  },
];

const installSteps = [
  "Define el trigger mode para hover, focus o click.",
  "Marca los bloques importantes con `data-translate=\"block\"` cuando quieras priorizar captura.",
  "Ajusta frases, señas y transiciones desde la pose library interna.",
];

export function DemoSection() {
  return (
    <section className="container-shell pb-24">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-5">
          <h2 className="section-title text-white">Qué necesita la demo</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((item) => (
            <article
              key={item.title}
              className="rounded-[22px] border border-white/7 bg-[#121925] p-7 shadow-[0_18px_44px_rgba(0,0,0,0.24)]"
              data-semantic-scope="block"
              data-surface="true"
              data-translate="block"
              data-translate-id={item.translateId}
              tabIndex={0}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182235] text-lg text-[#8fb7ff]">{item.icon}</div>
              <h3 className="text-[1.7rem] font-semibold tracking-tight text-white">{item.title}</h3>
              <p className="mt-3 text-[1rem] leading-7 text-[#7f93b1]">{item.description}</p>
            </article>
          ))}

          <article
            className="rounded-[22px] border border-white/7 bg-[#121925] p-7 shadow-[0_18px_44px_rgba(0,0,0,0.24)] md:col-span-2"
            data-semantic-scope="block"
            data-surface="true"
            data-translate="block"
            data-translate-id="material-install"
            tabIndex={0}
          >
            <div className="mb-6 flex items-center justify-between gap-6">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fb7ff]">Implementación</div>
                <h3 className="mt-2 text-[1.9rem] font-semibold tracking-tight text-white">Cómo activar la experiencia en una landing real</h3>
              </div>
              <button className="action-button primary !min-h-[44px] !px-5 text-sm" data-semantic-scope="block" data-translate="block" data-translate-id="install-cta" type="button">
                Ver integración
              </button>
            </div>

            <div className="space-y-3">
              {installSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[18px] border border-white/6 bg-[#0f1622] px-4 py-4 text-[0.98rem] leading-7 text-[#8ea2bf]"
                  data-semantic-scope="block"
                  data-surface="true"
                  data-translate="block"
                  data-translate-id={`install-step-${index}`}
                  tabIndex={0}
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#182235] text-sm font-semibold text-[#9bc0ff]">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
