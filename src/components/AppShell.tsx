"use client";

import { useState } from "react";
import { APP_CONFIG } from "@/lib/config/appConfig";
import { useCamera } from "@/hooks/useCamera";
import { useAvatarTracking } from "@/hooks/useAvatarTracking";
import { CameraPanel } from "@/components/CameraPanel";
import { AvatarCanvas } from "@/components/AvatarCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { MetricsPanel } from "@/components/MetricsPanel";
import { LogPanel } from "@/components/LogPanel";
import { DebugOverlay } from "@/components/DebugOverlay";
import type { TrackingControlsState } from "@/lib/tracking/trackerTypes";

const initialControls: TrackingControlsState = {
  smoothingEnabled: true,
  showDebugSkeleton: false,
  showLandmarksOverlay: true,
  mirrorCamera: true,
  smoothingGlobal: APP_CONFIG.tracking.smoothing,
  rotationDamping: APP_CONFIG.tracking.rotationDamping,
  confidenceThreshold: APP_CONFIG.tracking.confidenceThreshold,
  resolutionPreset: "high",
};

export default function AppShell() {
  const [controls, setControls] = useState<TrackingControlsState>(initialControls);
  const camera = useCamera(controls.resolutionPreset);
  const tracking = useAvatarTracking({
    controls,
    videoRef: camera.videoRef,
    overlayRef: camera.overlayRef,
    streamState: camera.streamState,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1700px] flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
      <header className="panel rounded-3xl p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="panel-label mb-2">Realtime VRM Pose Transfer</p>
            <h1 className="text-3xl font-semibold tracking-tight">Human + Three.js + VRM Stability Lab</h1>
            <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">
              Pipeline client-side con detección desacoplada del render, retargeting por quaternions y filtros
              orientados a minimizar jitter.
            </p>
          </div>
          <MetricsPanel metrics={tracking.metrics} status={tracking.status} />
        </div>
      </header>

      <ControlPanel
        controls={controls}
        onChange={setControls}
        onStartCamera={camera.startCamera}
        onStopCamera={camera.stopCamera}
        onLoadAvatar={tracking.loadAvatar}
        onResetPose={tracking.resetPose}
        cameraActive={camera.streamState === "running"}
        avatarLoaded={tracking.avatarLoaded}
      />

      <section className="grid flex-1 gap-4 xl:grid-cols-[0.95fr_1.35fr]">
        <CameraPanel
          videoRef={camera.videoRef}
          overlayRef={camera.overlayRef}
          showOverlay={controls.showLandmarksOverlay}
          mirrorCamera={controls.mirrorCamera}
          streamState={camera.streamState}
          lastError={camera.lastError ?? tracking.lastError}
          trackingSummary={tracking.trackingSummary}
        />
        <AvatarCanvas {...tracking.avatarViewProps} />
      </section>

      <LogPanel entries={tracking.logs} />
      <DebugOverlay lines={tracking.debugLines} />
    </main>
  );
}
