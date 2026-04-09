const navItems = ["Producto", "Integración", "Flujo", "Soporte", "Contacto"];

export function Hero() {
  return (
    <>
      <header className="border-b border-white/6 bg-[#0f1622]/92 backdrop-blur-xl">
        <div className="container-shell flex min-h-[72px] items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6f97d8]/35 bg-[#131c2b] text-sm font-semibold text-[#9bc0ff]">
              CT
            </div>
            <div>
              <div className="text-[1.1rem] font-semibold tracking-tight text-white">Contexto LSC</div>
              <div className="text-xs text-[#7185a6]">Traducción contextual con avatar VRM</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-[#8ca0bf] lg:flex">
            {navItems.map((item) => (
              <button key={item} className="interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id={`nav-${item}`} type="button">
                {item}
              </button>
            ))}
          </nav>

          <button className="action-button primary !min-h-[44px] !px-5 text-sm" data-semantic-scope="block" data-translate="block" data-translate-id="header-cta" type="button">
            Solicitar implementación
          </button>
        </div>
      </header>

      <section className="container-shell px-0 pb-12 pt-14 md:pt-20">
        <div className="mx-auto max-w-[840px] text-center">
          <span className="eyebrow">
            <span className="signal-dot" />
            Flujo semántico sin cámara
          </span>
          <h1 className="display-title mt-7 interactive-target text-white" data-semantic-scope="block" data-translate="block" data-translate-id="hero-title" tabIndex={0}>
            Traduce el contenido del sitio con un avatar accesible y contextual
          </h1>
          <p
            className="body-copy interactive-target mx-auto mt-6 max-w-[720px] text-lg text-[#8ea2bf]"
            data-semantic-scope="block"
            data-translate="block"
            data-translate-id="hero-copy"
            tabIndex={0}
          >
            Detecta bloques relevantes del DOM, interpreta intención y dominio, arma un plan de reproducción y responde con un avatar VRM bajo demanda.
          </p>

          <div className="mt-8 inline-flex rounded-2xl border border-white/8 bg-[#121a28] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <button className="rounded-xl bg-[#6e93d1] px-5 py-3 text-sm font-semibold text-white" data-semantic-scope="block" data-translate="block" data-translate-id="hero-pill-widget" type="button">
              Widget embebible
            </button>
            <button className="rounded-xl px-5 py-3 text-sm font-medium text-[#8ea2bf]" data-semantic-scope="block" data-translate="block" data-translate-id="hero-pill-flow" type="button">
              semanticPlan → playPlan
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
