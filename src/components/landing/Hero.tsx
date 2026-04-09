export function Hero() {
  return (
    <section className="container-shell px-0 pb-10 pt-10 md:pt-14">
      <div className="mx-auto max-w-[900px] text-center">
        <span className="eyebrow">
          <span className="signal-dot" />
          Traducción contextual bajo demanda
        </span>
        <h1 className="display-title mt-6 interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="hero-title" tabIndex={0}>
          Accesibilidad digital con traducción contextual en LSC
        </h1>
        <p
          className="body-copy interactive-target mx-auto mt-6 max-w-[760px] text-lg"
          data-semantic-scope="block"
          data-translate="block"
          data-translate-id="hero-copy"
          tabIndex={0}
        >
          Detecta el texto relevante del DOM, lo interpreta en una capa semántica y reproduce una respuesta visual con avatar VRM sin depender de webcam ni tracking humano.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="action-button primary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="hero-cta-demo" type="button">
            Probar demo
          </button>
          <button className="action-button secondary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id="hero-cta-integration" type="button">
            Ver integración
          </button>
        </div>
      </div>
    </section>
  );
}
