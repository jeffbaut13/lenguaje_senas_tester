interface FeatureCardProps {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  translateId: string;
}

export function FeatureCard({ badge, bullets, ctaPrimary, ctaSecondary, description, title, translateId }: FeatureCardProps) {
  return (
    <article className="editorial-card grid gap-8 overflow-hidden p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8 lg:p-10">
      <div className="relative min-h-[260px] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#e9f3ff_0%,#ffffff_48%,#d7e6f8_100%)]">
        <div className="absolute inset-6 rounded-[24px] border border-white/40" />
        <div className="absolute left-6 top-6 h-28 w-28 rounded-[32px] bg-white/60 shadow-lg backdrop-blur-sm" />
        <div className="absolute bottom-8 left-10 right-10 rounded-[28px] border border-white/45 bg-[rgba(250,252,255,0.78)] p-5 backdrop-blur-sm">
          <div className="h-3 w-24 rounded-full bg-[rgba(74,143,212,0.32)]" />
          <div className="mt-4 h-3 w-36 rounded-full bg-[rgba(31,27,22,0.12)]" />
          <div className="mt-3 h-3 w-full rounded-full bg-[rgba(31,27,22,0.08)]" />
          <div className="mt-3 h-3 w-4/5 rounded-full bg-[rgba(31,27,22,0.08)]" />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6">
        <div>
          <span className="eyebrow !text-[10px]">{badge}</span>
          <h2 className="section-title interactive-target mt-5" data-semantic-scope="block" data-translate="block" data-translate-id={`${translateId}-title`} tabIndex={0}>
            {title}
          </h2>
          <p
            className="body-copy interactive-target mt-4"
            data-semantic-scope="block"
            data-translate="block"
            data-translate-id={`${translateId}-description`}
            tabIndex={0}
          >
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {bullets.map((bullet) => (
              <span
                key={bullet}
                className="interactive-target rounded-full border border-[var(--border)] bg-[rgba(248,251,255,0.82)] px-3 py-2 text-sm text-[var(--muted)]"
                data-semantic-scope="block"
                data-surface="true"
                data-translate="block"
                data-translate-id={`${translateId}-${bullet}`}
                tabIndex={0}
              >
                {bullet}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="action-button primary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id={`${translateId}-cta-primary`} type="button">
            {ctaPrimary}
          </button>
          <button className="action-button secondary interactive-target" data-semantic-scope="block" data-translate="block" data-translate-id={`${translateId}-cta-secondary`} type="button">
            {ctaSecondary}
          </button>
        </div>
      </div>
    </article>
  );
}
