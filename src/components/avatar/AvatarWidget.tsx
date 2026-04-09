"use client";

import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
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
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-[#131b29] text-sm text-[#9ab8ea] transition hover:border-[#6a91d8]/45 hover:text-white"
      onClick={onClick}
      type="button"
    >
      <span>{icon}</span>
      <span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/8 bg-[#111827] px-3 py-2 text-xs font-medium text-[#dbe7fb] shadow-[0_10px_24px_rgba(0,0,0,0.35)] group-hover:block">
        {label}
      </span>
    </button>
  );
}

export function AvatarWidget() {
  const { debugOpen, playCurrent, playbackSnapshot, resetPlayback, setDebugOpen, setWidgetOpen, stopPlayback, widgetOpen } =
    useTranslationContext();

  if (!widgetOpen) {
    return (
      <button
        className="fixed right-5 top-1/2 z-40 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#121a27]/96 px-3 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#b7c8e6] shadow-[0_18px_44px_rgba(0,0,0,0.28)]"
        onClick={() => setWidgetOpen(true)}
        type="button"
      >
        Avatar
      </button>
    );
  }

  return (
    <aside className="fixed right-5 top-1/2 z-40 flex -translate-y-1/2 items-center gap-3">
      <div className="flex flex-col gap-2">
        <IconButton icon=">" label="Reproducir el plan actual" onClick={playCurrent} />
        <IconButton icon="[]" label="Detener reproduccion" onClick={stopPlayback} />
        <IconButton icon="R" label="Volver a postura neutral relajada" onClick={resetPlayback} />
        <IconButton icon="i" label="Haz click en un titulo, texto o boton para activar el avatar" onClick={() => undefined} />
        <IconButton icon="D" label={debugOpen ? "Ocultar panel debug" : "Mostrar panel debug"} onClick={() => setDebugOpen(!debugOpen)} />
        <IconButton icon="x" label="Cerrar widget" onClick={() => setWidgetOpen(false)} />
      </div>

      <div className="relative h-[372px] w-[212px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,31,46,0.98),rgba(15,22,34,0.96))] shadow-[0_28px_60px_rgba(0,0,0,0.35)]">
        <AvatarCanvas className="absolute inset-0" poseId={playbackSnapshot.currentPoseId} variant="compact" />
      </div>
    </aside>
  );
}
