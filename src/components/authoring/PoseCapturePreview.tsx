"use client";

import type { CandidatePoseEntry, PoseCaptureResult } from "@/lib/types/plans";

export function PoseCapturePreview({
  candidate,
  captureResult,
}: {
  captureResult: PoseCaptureResult | null;
  candidate: CandidatePoseEntry | null;
}) {
  return (
    <section className="editorial-card p-6">
      <div className="mb-4">
        <p className="eyebrow">Paso 2</p>
        <h2 className="section-title mt-4">Resumen de extracción</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.84)] p-4">
          <div className="mb-2 text-sm font-semibold">Metadata de captura</div>
          <pre className="text-xs text-[var(--muted)]">{JSON.stringify(captureResult, null, 2)}</pre>
        </div>
        <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.84)] p-4">
          <div className="mb-2 text-sm font-semibold">Pose candidata derivada</div>
          <pre className="text-xs text-[var(--muted)]">{JSON.stringify(candidate, null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}
