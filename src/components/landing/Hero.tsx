const navItems = ["Producto", "Integracion", "Flujo", "Biblioteca", "Soporte"];

export function Hero() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(241,239,235,0.88)] backdrop-blur-xl">
        <div className="container-shell flex min-h-[78px] items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[rgba(255,248,239,0.94)] font-semibold text-[var(--accent-strong)]">
              CL
            </div>
            <div>
              <div className="text-[1.15rem] font-semibold tracking-tight text-[var(--text)]">Contexto LSC</div>
              <div className="text-xs text-[var(--muted)]">Widget de traduccion contextual con avatar VRM</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                className="interactive-target"
                data-semantic-scope="block"
                data-translate="block"
                data-translate-id={`nav-${item}`}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            className="action-button primary !min-h-[46px] !px-5 text-sm"
            data-semantic-scope="block"
            data-translate="block"
            data-translate-id="header-cta"
            type="button"
          >
            Solicitar implementacion
          </button>
        </div>
      </header>

      <section className="container-shell px-0 pb-14 pt-12 md:pt-18">
        <div className="mx-auto max-w-[920px] text-center">
          <span className="eyebrow">
            <span className="signal-dot" />
            Accesibilidad contextual sin webcam
          </span>
          <h1 className="display-title interactive-target mt-7" data-semantic-scope="block" data-translate="block" data-translate-id="hero-title" tabIndex={0}>
            Accesibilidad digital con traduccion contextual en LSC
          </h1>
          <p
            className="body-copy interactive-target mx-auto mt-6 max-w-[760px] text-lg"
            data-semantic-scope="block"
            data-translate="block"
            data-translate-id="hero-copy"
            tabIndex={0}
          >
            Detecta bloques del DOM, construye semanticPlan, resuelve signPlan y reproduce una respuesta visual con avatar VRM flotante para ayudar a usuarios sordos sin romper la navegacion del sitio.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button className="action-button primary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="hero-cta-demo" type="button">
              Probar demo
            </button>
            <button className="action-button secondary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="hero-cta-integration" type="button">
              Ver integracion
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
