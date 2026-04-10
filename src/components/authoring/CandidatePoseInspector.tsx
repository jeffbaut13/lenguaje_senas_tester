"use client";

import type { CandidatePoseEntry } from "@/lib/types/plans";

export function CandidatePoseInspector({
  candidate,
  onCandidateIdChange,
  onNotesChange,
  onTagsChange,
}: {
  candidate: CandidatePoseEntry | null;
  onCandidateIdChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}) {
  return (
    <section className="editorial-card p-6">
      <div className="mb-4">
        <p className="eyebrow">Paso 4</p>
        <h2 className="section-title mt-4">Refina la pose candidata</h2>
        <p className="body-copy mt-3">Asigna id, tags y notas antes de guardarla en staging. El resultado sigue siendo un asset curable, no una promoción automática a producción.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.84)] p-4">
          <div className="mb-2 text-sm font-semibold">Candidate id</div>
          <input className="w-full rounded-xl border border-[var(--border)] bg-white/80 px-3 py-3 outline-none" onChange={(event) => onCandidateIdChange(event.target.value)} value={candidate?.id ?? ""} />
        </label>
        <label className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.84)] p-4">
          <div className="mb-2 text-sm font-semibold">Tags</div>
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-white/80 px-3 py-3 outline-none"
            onChange={(event) => onTagsChange(event.target.value)}
            placeholder="accessibility, support, cta"
            value={candidate?.tags.join(", ") ?? ""}
          />
        </label>
        <label className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,249,240,0.84)] p-4">
          <div className="mb-2 text-sm font-semibold">Notas</div>
          <input className="w-full rounded-xl border border-[var(--border)] bg-white/80 px-3 py-3 outline-none" onChange={(event) => onNotesChange(event.target.value)} value={candidate?.notes.join(" | ") ?? ""} />
        </label>
      </div>
    </section>
  );
}
