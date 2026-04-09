"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PlaybackControls } from "@/components/avatar/PlaybackControls";
import { TriggerModeSelector } from "@/components/translator/TriggerModeSelector";
import { useTranslationContext } from "@/lib/state/TranslationContext";

export function AvatarWidget() {
  const {
    activeText,
    debugOpen,
    playbackSnapshot,
    playCurrent,
    resetPlayback,
    setDebugOpen,
    setSpeed,
    setTriggerMode,
    setWidgetOpen,
    speed,
    stopPlayback,
    triggerMode,
    widgetOpen,
  } = useTranslationContext();

  if (!widgetOpen) {
    return (
      <button
        className="fixed bottom-5 right-5 z-40 rounded-full border border-[var(--border-strong)] bg-[rgba(248,251,255,0.96)] px-4 py-3 text-sm font-semibold shadow-[var(--shadow)]"
        onClick={() => setWidgetOpen(true)}
        type="button"
      >
        Abrir avatar
      </button>
    );
  }

  return (
    <aside className="soft-panel fixed bottom-4 right-4 z-40 flex w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px]">
      <div className="flex items-start justify-between border-b border-[var(--border)] px-4 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Overlay LSC</p>
          <h2 className="mt-1 text-xl font-semibold">Avatar contextual</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{playbackSnapshot.activeLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Abrir panel debug"
            className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"
            onClick={() => setDebugOpen(!debugOpen)}
            type="button"
          >
            Debug
          </button>
          <button
            aria-label="Cerrar widget"
            className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"
            onClick={() => setWidgetOpen(false)}
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="relative aspect-[5/6] overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(180deg,#eef6ff_0%,#d8e7f8_100%)]">
        <AvatarCanvas className="absolute inset-0" poseId={playbackSnapshot.currentPoseId} />
      </div>

      <div className="widget-scroll max-h-[44vh] space-y-4 overflow-y-auto px-4 py-4">
        <div className="rounded-3xl bg-[rgba(248,251,255,0.92)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Texto activo</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text)]">{activeText || "Pasa el cursor, enfoca o haz click sobre un bloque relevante."}</p>
        </div>

        <TriggerModeSelector mode={triggerMode} onChange={setTriggerMode} />

        <PlaybackControls onPlay={playCurrent} onReset={resetPlayback} onSpeedChange={setSpeed} onStop={stopPlayback} speed={speed} />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-[rgba(248,251,255,0.92)] p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Estado</div>
            <div className="mt-1 font-semibold capitalize">{playbackSnapshot.status}</div>
          </div>
          <div className="rounded-2xl bg-[rgba(248,251,255,0.92)] p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Pasos</div>
            <div className="mt-1 font-semibold">{Math.max(playbackSnapshot.queueLength, 0)}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
