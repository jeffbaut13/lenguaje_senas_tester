"use client";

import type { Dispatch, SetStateAction } from "react";
import type { TrackingControlsState } from "@/lib/tracking/trackerTypes";

interface ControlPanelProps {
  controls: TrackingControlsState;
  onChange: Dispatch<SetStateAction<TrackingControlsState>>;
  onStartCamera: () => Promise<void>;
  onStopCamera: () => void;
  onLoadAvatar: () => Promise<void>;
  onResetPose: () => void;
  cameraActive: boolean;
  avatarLoaded: boolean;
}

const ToggleButton = ({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button type="button" className="control-button rounded-2xl px-4 py-2 text-sm" data-active={active} onClick={onClick}>
    {label}
  </button>
);

export function ControlPanel({
  controls,
  onChange,
  onStartCamera,
  onStopCamera,
  onLoadAvatar,
  onResetPose,
  cameraActive,
  avatarLoaded,
}: ControlPanelProps) {
  return (
    <section className="panel rounded-3xl p-5">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.5fr]">
        <div className="space-y-3">
          <p className="panel-label">Session Controls</p>
          <div className="flex flex-wrap gap-3">
            <ToggleButton label="Start camera" onClick={() => void onStartCamera()} />
            <ToggleButton label="Stop camera" onClick={onStopCamera} />
            <ToggleButton label="Load avatar" onClick={() => void onLoadAvatar()} />
            <ToggleButton label="Reset pose" onClick={onResetPose} />
            <ToggleButton
              active={controls.showDebugSkeleton}
              label="Toggle debug skeleton"
              onClick={() => onChange((current) => ({ ...current, showDebugSkeleton: !current.showDebugSkeleton }))}
            />
            <ToggleButton
              active={controls.showLandmarksOverlay}
              label="Toggle landmarks overlay"
              onClick={() => onChange((current) => ({ ...current, showLandmarksOverlay: !current.showLandmarksOverlay }))}
            />
            <ToggleButton
              active={controls.smoothingEnabled}
              label="Toggle smoothing"
              onClick={() => onChange((current) => ({ ...current, smoothingEnabled: !current.smoothingEnabled }))}
            />
            <ToggleButton
              active={controls.mirrorCamera}
              label="Toggle mirror camera"
              onClick={() => onChange((current) => ({ ...current, mirrorCamera: !current.mirrorCamera }))}
            />
          </div>
          <div className="grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2">
            <p>Camera: {cameraActive ? "running" : "stopped"}</p>
            <p>Avatar: {avatarLoaded ? "loaded" : "pending"}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="panel-label">Smoothing Global</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="range-input"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={controls.smoothingGlobal}
                onChange={(event) => onChange((current) => ({ ...current, smoothingGlobal: Number(event.target.value) }))}
              />
              <span className="metric-value w-12 text-right text-sm">{controls.smoothingGlobal.toFixed(2)}</span>
            </div>
          </label>

          <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="panel-label">Rotation Damping</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="range-input"
                type="range"
                min="0.01"
                max="0.85"
                step="0.01"
                value={controls.rotationDamping}
                onChange={(event) => onChange((current) => ({ ...current, rotationDamping: Number(event.target.value) }))}
              />
              <span className="metric-value w-12 text-right text-sm">{controls.rotationDamping.toFixed(2)}</span>
            </div>
          </label>

          <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="panel-label">Confidence Threshold</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="range-input"
                type="range"
                min="0.1"
                max="0.95"
                step="0.01"
                value={controls.confidenceThreshold}
                onChange={(event) =>
                  onChange((current) => ({ ...current, confidenceThreshold: Number(event.target.value) }))
                }
              />
              <span className="metric-value w-12 text-right text-sm">{controls.confidenceThreshold.toFixed(2)}</span>
            </div>
          </label>

          <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="panel-label">Input Resolution</span>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#081722] px-3 py-2 text-sm outline-none"
              value={controls.resolutionPreset}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  resolutionPreset: event.target.value as TrackingControlsState["resolutionPreset"],
                }))
              }
            >
              <option value="low">Low 640 x 360</option>
              <option value="medium">Medium 960 x 540</option>
              <option value="high">High 1280 x 720</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
