"use client";

import { useTranslationContext } from "@/lib/state/TranslationContext";

export function TranslationDebugPanel() {
  const { debugOpen, playPlan, playbackSnapshot, semanticPlan, signPlan } = useTranslationContext();

  if (!debugOpen) {
    return null;
  }

  return (
    <aside className="soft-panel fixed left-4 top-4 z-30 hidden w-[min(420px,calc(100vw-24px))] rounded-[28px] p-4 xl:block">
      <div className="mb-4 flex items-center gap-2">
        <span className="signal-dot" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Debug pipeline</p>
          <p className="text-sm text-[var(--muted)]">Inspección rápida de planes y estado del playback.</p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <section className="rounded-3xl bg-[rgba(255,248,239,0.9)] p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Playback</h3>
          <pre>{JSON.stringify(playbackSnapshot, null, 2)}</pre>
        </section>
        <section className="rounded-3xl bg-[rgba(255,248,239,0.9)] p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">semanticPlan</h3>
          <pre>{JSON.stringify(semanticPlan, null, 2)}</pre>
        </section>
        <section className="rounded-3xl bg-[rgba(255,248,239,0.9)] p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">signPlan</h3>
          <pre>{JSON.stringify(signPlan, null, 2)}</pre>
        </section>
        <section className="rounded-3xl bg-[rgba(255,248,239,0.9)] p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">playPlan</h3>
          <pre>{JSON.stringify(playPlan, null, 2)}</pre>
        </section>
      </div>
    </aside>
  );
}
