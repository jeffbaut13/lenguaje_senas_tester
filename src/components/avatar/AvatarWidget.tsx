"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { TriggerModeSelector } from "@/components/translator/TriggerModeSelector";
import { useTranslationContext } from "@/lib/state/TranslationContext";

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,249,240,0.92)] text-sm text-[var(--accent-strong)] transition hover:border-[rgba(217,119,53,0.45)] hover:bg-white"
      onClick={onClick}
      type="button"
    >
      <span>{icon}</span>
      <span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[rgba(255,249,240,0.98)] px-3 py-2 text-xs font-medium text-[var(--text)] shadow-[0_18px_40px_rgba(66,40,10,0.18)] group-hover:block">
        {label}
      </span>
    </button>
  );
}

export function AvatarWidget() {
  const {
    debugOpen,
    playCurrent,
    playbackSnapshot,
    resetPlayback,
    setDebugOpen,
    setTriggerMode,
    setWidgetOpen,
    stopPlayback,
    triggerMode,
    widgetOpen,
  } = useTranslationContext();

  if (!widgetOpen) {
    return (
      <button
        className="fixed right-5 top-1/2 z-40 -translate-y-1/2 rounded-[24px] border border-[var(--border)] bg-[rgba(255,250,244,0.96)] px-3 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)] shadow-[0_24px_48px_rgba(88,51,18,0.16)]"
        onClick={() => setWidgetOpen(true)}
        type="button"
      >
        Avatar
      </button>
    );
  }

  return (
    <aside className="fixed right-5 top-1/2 z-40 flex -translate-y-1/2 items-center gap-4">
      <div className="flex flex-col gap-2">
        <IconButton icon=">" label="Reproducir plan actual" onClick={playCurrent} />
        <IconButton icon="[]" label="Detener reproduccion" onClick={stopPlayback} />
        <IconButton icon="R" label="Volver a neutral relajada" onClick={resetPlayback} />
        <IconButton icon="i" label="Activa el avatar con hover, focus o click sobre contenido relevante" onClick={() => undefined} />
        <IconButton icon="D" label={debugOpen ? "Ocultar debug" : "Mostrar debug"} onClick={() => setDebugOpen(!debugOpen)} />
        <IconButton icon="x" label="Cerrar widget" onClick={() => setWidgetOpen(false)} />
      </div>

      <div className="soft-panel relative w-[258px] overflow-hidden rounded-[32px] p-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-2 pt-1">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Avatar contextual</div>
            <div className="text-xs text-[var(--muted)]">{playbackSnapshot.activeLabel}</div>
          </div>
        </div>
        <div className="px-2 pb-3">
          <TriggerModeSelector mode={triggerMode} onChange={setTriggerMode} />
        </div>
        <div className="relative h-[388px] overflow-hidden rounded-[28px] border border-[rgba(183,146,109,0.2)] bg-[linear-gradient(180deg,#fff7ef_0%,#f6e7d4_100%)]">
        <AvatarCanvas className="absolute inset-0" poseId={playbackSnapshot.currentPoseId} variant="compact" />
        </div>
      </div>
    </aside>
  );
}
