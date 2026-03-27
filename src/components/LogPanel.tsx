"use client";

import type { TrackingLogEntry } from "@/lib/tracking/trackerTypes";

interface LogPanelProps {
  entries: TrackingLogEntry[];
}

export function LogPanel({ entries }: LogPanelProps) {
  return (
    <section className="panel rounded-3xl p-4">
      <div className="mb-3">
        <p className="panel-label">Runtime Logs</p>
        <h2 className="panel-title">Errores, warnings y eventos de control</h2>
      </div>
      <div className="max-h-56 space-y-2 overflow-auto rounded-2xl border border-white/10 bg-black/25 p-3">
        {entries.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Sin eventos todavía.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm">
              <p
                className={
                  entry.level === "error"
                    ? "text-[var(--danger)]"
                    : entry.level === "warning"
                      ? "text-[var(--warning)]"
                      : "text-[var(--accent)]"
                }
              >
                {entry.level.toUpperCase()}
              </p>
              <p className="mt-1 text-[var(--text)]">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
