export function SecondaryCard() {
  return (
    <section className="editorial-card grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10">
      <div className="space-y-5">
        <span className="eyebrow !text-[10px]">Soporte y aprendizaje</span>
        <h2 className="section-title interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="secondary-title" tabIndex={0}>
          Una experiencia accesible que responde al contexto y acompaña la navegación
        </h2>
        <p className="body-copy interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="secondary-copy" tabIndex={0}>
          El overlay puede activarse por hover, focus o click. Así permite asistir recorridos guiados, superficies de ayuda y contenidos clave sin sobrecargar el sitio ni romper su estructura.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Widget embebible para sitios y plataformas",
            "Analítica del contenido más consultado",
            "Personalización del avatar y velocidad",
            "Soporte para nuevas señas y frases",
          ].map((item, index) => (
            <button
              key={item}
              className="interactive-target rounded-[24px] border border-[var(--border)] bg-[rgba(248,251,255,0.9)] p-4 text-left text-sm text-[var(--text)]"
              data-semantic-scope="block"
              data-surface="true"
              data-translate="block"
              data-translate-id={`secondary-chip-${index}`}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[30px] bg-[linear-gradient(180deg,#eef6ff_0%,#dbe9f8_100%)] p-5">
        <div className="rounded-[26px] border border-white/55 bg-[rgba(249,252,255,0.82)] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Escenarios</p>
          <div className="mt-5 space-y-4">
            {[
              ["Onboarding", "Guía inicial para recorrer una landing accesible con foco en beneficios."],
              ["Integración", "Lectura contextual de CTAs, bloques de producto y prompts de implementación."],
              ["Soporte", "Ayuda visual para FAQs, contacto y recursos de acompañamiento."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="interactive-target rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-4"
                data-semantic-scope="block"
                data-surface="true"
                data-translate="block"
                data-translate-id={`scenario-${title}`}
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
  );
}
