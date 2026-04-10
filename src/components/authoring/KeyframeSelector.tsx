"use client";

import type { PoseCaptureResult } from "@/lib/types/plans";

export function KeyframeSelector({
  captureResult,
}: {
  captureResult: PoseCaptureResult | null;
}) {
  const groups = captureResult?.keyframes;

  return (
    <section className="editorial-card p-6">
      <div className="mb-4">
        <p className="eyebrow">Paso 3</p>
        <h2 className="section-title mt-4">Frames clave seleccionados</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(["start", "middle", "end"] as const).map((label) => (
          <div key={label} className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.84)] p-4">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">{label}</div>
            <pre className="mt-3 text-xs text-[var(--muted)]">
              {JSON.stringify(groups?.[label].map((item) => ({ angle: item.angle, timeMs: item.timeMs, frame: item.sourceFrame })) ?? [], null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}
