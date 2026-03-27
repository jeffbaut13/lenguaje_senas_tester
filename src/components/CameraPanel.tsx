"use client";

import type { RefObject } from "react";

interface CameraPanelProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  overlayRef: RefObject<HTMLCanvasElement | null>;
  showOverlay: boolean;
  mirrorCamera: boolean;
  streamState: string;
  lastError: string | null;
  trackingSummary: string[];
}

export function CameraPanel({
  videoRef,
  overlayRef,
  showOverlay,
  mirrorCamera,
  streamState,
  lastError,
  trackingSummary,
}: CameraPanelProps) {
  return (
    <section className="panel relative overflow-hidden rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="panel-label">Camera Input</p>
          <h2 className="panel-title">Preview + overlay técnico</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">{streamState}</span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: mirrorCamera ? "scaleX(-1)" : "none" }}
        />
        <canvas
          ref={overlayRef}
          className={`pointer-events-none absolute inset-0 h-full w-full ${showOverlay ? "opacity-100" : "opacity-0"}`}
          style={{ transform: mirrorCamera ? "scaleX(-1)" : "none" }}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="panel-label mb-2">Tracking State</p>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            {trackingSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="panel-label mb-2">Warnings</p>
          <p className={`text-sm ${lastError ? "text-[var(--danger)]" : "text-[var(--muted)]"}`}>
            {lastError ?? "Sin errores críticos. Si baja la confianza, el rig conserva la última pose estable."}
          </p>
        </div>
      </div>
    </section>
  );
}
