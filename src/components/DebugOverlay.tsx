"use client";

interface DebugOverlayProps {
  lines: string[];
}

export function DebugOverlay({ lines }: DebugOverlayProps) {
  return (
    <section className="panel rounded-3xl p-4">
      <div className="mb-3">
        <p className="panel-label">Debug</p>
        <h2 className="panel-title">Estado técnico del rig</h2>
      </div>
      <div className="space-y-2 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-[var(--muted)]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}
