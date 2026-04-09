"use client";

import type { TriggerMode } from "@/lib/types/plans";

const modes: TriggerMode[] = ["hover", "focus", "click"];

export function TriggerModeSelector({
  mode,
  onChange,
}: {
  mode: TriggerMode;
  onChange: (mode: TriggerMode) => void;
}) {
  return (
    <div className="flex gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,249,240,0.86)] p-1">
      {modes.map((item) => (
        <button
          key={item}
          className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
            item === mode ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"
          }`}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
