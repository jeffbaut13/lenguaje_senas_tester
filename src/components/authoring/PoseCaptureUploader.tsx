"use client";

import type { PoseCaptureInput } from "@/lib/types/plans";

const angles: Array<PoseCaptureInput["angle"]> = ["front", "threeQuarter", "side"];

export function PoseCaptureUploader({
  files,
  onChange,
}: {
  files: Partial<Record<PoseCaptureInput["angle"], File>>;
  onChange: (angle: PoseCaptureInput["angle"], file: File | null) => void;
}) {
  return (
    <section className="editorial-card p-6">
      <div className="mb-4">
        <p className="eyebrow">Paso 1</p>
        <h2 className="section-title mt-4">Sube tres videos de referencia</h2>
        <p className="body-copy mt-3">Usa una misma pose o seña desde frente, tres cuartos y perfil para construir una pose candidata revisable.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {angles.map((angle) => (
          <label key={angle} className="flex min-h-[190px] cursor-pointer flex-col justify-between rounded-[26px] border border-[var(--border)] bg-[rgba(255,249,240,0.82)] p-5">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">{angle}</div>
              <div className="mt-3 text-sm text-[var(--muted)]">
                {files[angle] ? files[angle]?.name : "Selecciona un archivo mp4/webm para este ángulo."}
              </div>
            </div>
            <input
              accept="video/*"
              className="hidden"
              onChange={(event) => onChange(angle, event.target.files?.[0] ?? null)}
              type="file"
            />
            <div className="rounded-full border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)]">
              {files[angle] ? "Reemplazar video" : "Elegir video"}
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
