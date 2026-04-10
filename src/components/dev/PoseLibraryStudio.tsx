"use client";

import { useEffect, useMemo, useState } from "react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PlaybackControls } from "@/components/avatar/PlaybackControls";
import { jointLimits, type JointLimit } from "@/data/jointLimits";
import { AvatarPlaybackController } from "@/lib/playback/AvatarPlaybackController";
import { poseLibrary } from "@/lib/repositories/poseRepository";
import { planTranslation } from "@/lib/translation/planTranslation";
import type { PlaybackSnapshot } from "@/lib/types/plans";

const INITIAL_SNAPSHOT: PlaybackSnapshot = {
  status: "idle",
  currentStepIndex: -1,
  currentPoseId: "NEUTRAL",
  activeLabel: "Neutral",
  speed: 1,
  queueLength: 0,
};

const AXIS = ["x", "y", "z"] as const;
const DEFAULT_LIMIT: JointLimit = {
  x: [-120, 120],
  y: [-120, 120],
  z: [-120, 120],
};

const formatNumber = (value: number) => (Number.isInteger(value) ? value.toString() : value.toFixed(1));
const formatFraction = (value: number) => value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toLimitFraction = (value: number, [min, max]: [number, number]) => {
  if (max === min) {
    return 0;
  }

  return clamp((value - min) / (max - min), 0, 1);
};

const parseInputToNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const copyText = async (value: string) => {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

export function PoseLibraryStudio() {
  const [poseId, setPoseId] = useState("NEUTRAL");
  const [speed, setSpeed] = useState(1);
  const [sampleText, setSampleText] = useState("Solicitar implementacion");
  const [playbackSnapshot, setPlaybackSnapshot] = useState<PlaybackSnapshot>(INITIAL_SNAPSHOT);
  const [calibrationMode, setCalibrationMode] = useState(true);
  const [editableBones, setEditableBones] = useState<Record<string, [number, number, number]>>({});
  const [selectedBone, setSelectedBone] = useState("RightUpperArm");
  const [runtimeLimits, setRuntimeLimits] = useState<Record<string, JointLimit>>(jointLimits);
  const [copyState, setCopyState] = useState<string>("");
  const [controller] = useState(
    () =>
      new AvatarPlaybackController({
        onPose: setPoseId,
        onSnapshot: setPlaybackSnapshot,
      }),
  );
  const bundle = useMemo(() => planTranslation(sampleText), [sampleText]);

  const selectedPose = useMemo(() => poseLibrary.find((pose) => pose.id === poseId), [poseId]);

  useEffect(() => {
    controller.setSpeed(speed);
  }, [controller, speed]);

  useEffect(() => {
    if (!selectedPose) {
      return;
    }

    const nextEditableBones = Object.fromEntries(
      Object.entries(selectedPose.bones).map(([bone, values]) => [bone, [...values] as [number, number, number]]),
    ) as Record<string, [number, number, number]>;

    setEditableBones(nextEditableBones);

    if (!nextEditableBones[selectedBone]) {
      const nextBone = Object.keys(nextEditableBones)[0];
      if (nextBone) {
        setSelectedBone(nextBone);
      }
    }
  }, [selectedPose, selectedBone]);

  const sortedBoneNames = useMemo(() => {
    return Object.keys(editableBones).sort((a, b) => {
      const aHasLimit = runtimeLimits[a] ? 0 : 1;
      const bHasLimit = runtimeLimits[b] ? 0 : 1;
      if (aHasLimit !== bHasLimit) {
        return aHasLimit - bHasLimit;
      }
      return a.localeCompare(b);
    });
  }, [editableBones, runtimeLimits]);

  const selectedRotation = editableBones[selectedBone] ?? ([0, 0, 0] as [number, number, number]);
  const selectedLimit = runtimeLimits[selectedBone] ?? DEFAULT_LIMIT;

  const setAxisValue = (axisIndex: 0 | 1 | 2, rawValue: number) => {
    const axisKey = AXIS[axisIndex];
    const [min, max] = selectedLimit[axisKey];
    const next = clamp(rawValue, min, max);

    setEditableBones((previous) => {
      const current = previous[selectedBone] ?? [0, 0, 0];
      const updated = [...current] as [number, number, number];
      updated[axisIndex] = next;
      return {
        ...previous,
        [selectedBone]: updated,
      };
    });
  };

  const setAxisLimit = (axisKey: (typeof AXIS)[number], side: "min" | "max", rawValue: number) => {
    setRuntimeLimits((previous) => {
      const current = previous[selectedBone] ?? DEFAULT_LIMIT;
      const nextAxis = [...current[axisKey]] as [number, number];

      if (side === "min") {
        nextAxis[0] = Math.min(rawValue, nextAxis[1]);
      } else {
        nextAxis[1] = Math.max(rawValue, nextAxis[0]);
      }

      return {
        ...previous,
        [selectedBone]: {
          ...current,
          [axisKey]: nextAxis,
        },
      };
    });

    setEditableBones((previous) => {
      const current = previous[selectedBone] ?? [0, 0, 0];
      const axisIndex = AXIS.indexOf(axisKey);
      const currentLimit = runtimeLimits[selectedBone] ?? DEFAULT_LIMIT;
      const nextMin = side === "min" ? Math.min(rawValue, currentLimit[axisKey][1]) : currentLimit[axisKey][0];
      const nextMax = side === "max" ? Math.max(rawValue, currentLimit[axisKey][0]) : currentLimit[axisKey][1];
      const updated = [...current] as [number, number, number];
      updated[axisIndex] = clamp(current[axisIndex], nextMin, nextMax);

      return {
        ...previous,
        [selectedBone]: updated,
      };
    });
  };

  const handleCopy = async (value: string, successMessage: string) => {
    const copied = await copyText(value);
    setCopyState(copied ? successMessage : "No se pudo copiar. Usa el snippet manualmente.");
    window.setTimeout(() => {
      setCopyState("");
    }, 2400);
  };

  const boneSnippet = `${selectedBone}: fromLimits("${selectedBone}", ${formatFraction(toLimitFraction(selectedRotation[0], selectedLimit.x))}, ${formatFraction(toLimitFraction(selectedRotation[1], selectedLimit.y))}, ${formatFraction(toLimitFraction(selectedRotation[2], selectedLimit.z))}),`;
  const limitSnippet = `${selectedBone}: { x: [${selectedLimit.x[0]}, ${selectedLimit.x[1]}], y: [${selectedLimit.y[0]}, ${selectedLimit.y[1]}], z: [${selectedLimit.z[0]}, ${selectedLimit.z[1]}] },`;

  return (
    <main className="container-shell py-10">
      <div className="mb-8 max-w-[880px]">
        <p className="eyebrow">Dev page</p>
        <h1 className="section-title mt-5">Pose library y secuencias de demo</h1>
        <p className="body-copy mt-4">
          Revisa poses placeholder, prueba el flujo <code>texto -&gt; semanticPlan -&gt; signPlan -&gt; playPlan</code> y valida que entra a la libreria estable antes de sumar mas assets.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="editorial-card overflow-hidden p-4 md:p-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#f7edde_0%,#eddac2_100%)]">
            <AvatarCanvas className="absolute inset-0" poseId={poseId} poseOverride={calibrationMode ? editableBones : undefined} />
          </div>
          <div className="mt-4">
            <PlaybackControls
              onPlay={() => {
                setCalibrationMode(false);
                controller.replace(bundle.playPlan);
              }}
              onReset={() => {
                controller.resetToNeutral();
                setCalibrationMode(true);
              }}
              onSpeedChange={setSpeed}
              onStop={() => {
                controller.stop();
                setCalibrationMode(true);
              }}
              speed={speed}
            />
            <div className="mt-3 rounded-[24px] bg-[rgba(255,249,240,0.9)] p-4 text-sm">
              <div className="mb-2 font-semibold">Estado de preview</div>
              <pre>{JSON.stringify(playbackSnapshot, null, 2)}</pre>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="editorial-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Calibrador de limites y pose</div>
                <div className="text-sm text-[var(--muted)]">Ajusta eje por eje viendo el avatar en vivo, y copia el snippet al archivo.</div>
              </div>
              <button
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  calibrationMode ? "border-[var(--accent)] bg-[rgba(217,119,53,0.12)] text-[var(--accent-strong)]" : "border-[var(--border)] bg-[rgba(255,249,240,0.86)] text-[var(--muted)]"
                }`}
                onClick={() => setCalibrationMode((previous) => !previous)}
                type="button"
              >
                {calibrationMode ? "Calibrando" : "Calibracion off"}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(255,249,240,0.86)] p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Huesos</div>
                <div className="max-h-[280px] space-y-1 overflow-y-auto pr-1">
                  {sortedBoneNames.map((bone) => (
                    <button
                      key={bone}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                        bone === selectedBone ? "bg-[rgba(217,119,53,0.13)] text-[var(--accent-strong)]" : "hover:bg-[rgba(217,119,53,0.06)]"
                      }`}
                      onClick={() => setSelectedBone(bone)}
                      type="button"
                    >
                      {bone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(255,249,240,0.86)] p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{selectedBone}</div>
                <div className="space-y-4">
                  {AXIS.map((axis, axisIndex) => {
                    const currentValue = selectedRotation[axisIndex];
                    const [limitMin, limitMax] = selectedLimit[axis];

                    return (
                      <div key={axis} className="rounded-xl border border-[var(--border)] bg-white/70 p-3">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-semibold uppercase tracking-[0.1em]">{axis}</span>
                          <span>{formatNumber(currentValue)}°</span>
                        </div>
                        <input
                          className="w-full"
                          max={limitMax}
                          min={limitMin}
                          onChange={(event) => setAxisValue(axisIndex as 0 | 1 | 2, Number(event.target.value))}
                          step={1}
                          type="range"
                          value={currentValue}
                        />
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <label className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white/80 px-2 py-1">
                            <span>min</span>
                            <input
                              className="w-16 bg-transparent text-right outline-none"
                              onChange={(event) => setAxisLimit(axis, "min", parseInputToNumber(event.target.value, limitMin))}
                              type="number"
                              value={limitMin}
                            />
                          </label>
                          <label className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white/80 px-2 py-1">
                            <span>max</span>
                            <input
                              className="w-16 bg-transparent text-right outline-none"
                              onChange={(event) => setAxisLimit(axis, "max", parseInputToNumber(event.target.value, limitMax))}
                              type="number"
                              value={limitMax}
                            />
                          </label>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs"
                            onClick={() => setAxisValue(axisIndex as 0 | 1 | 2, limitMin)}
                            type="button"
                          >
                            Ir a min
                          </button>
                          <button
                            className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs"
                            onClick={() => setAxisValue(axisIndex as 0 | 1 | 2, limitMax)}
                            type="button"
                          >
                            Ir a max
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,249,240,0.9)] p-3 text-xs">
                <div className="mb-2 font-semibold">Snippet para pose</div>
                <div className="mb-2 text-[11px] text-[var(--muted)]">Genera `fromLimits(...)` con valores normalizados entre 0 y 1.</div>
                <pre className="whitespace-pre-wrap break-all">{boneSnippet}</pre>
                <button
                  className="mt-2 rounded-lg border border-[var(--border)] px-2 py-1"
                  onClick={() => handleCopy(boneSnippet, "Snippet de pose copiado")}
                  type="button"
                >
                  Copiar
                </button>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,249,240,0.9)] p-3 text-xs">
                <div className="mb-2 font-semibold">Snippet para jointLimits</div>
                <pre className="whitespace-pre-wrap break-all">{limitSnippet}</pre>
                <button
                  className="mt-2 rounded-lg border border-[var(--border)] px-2 py-1"
                  onClick={() => handleCopy(limitSnippet, "Snippet de limites copiado")}
                  type="button"
                >
                  Copiar
                </button>
              </div>
            </div>
            {copyState ? <div className="mt-2 text-xs text-[var(--accent-strong)]">{copyState}</div> : null}
          </div>

          <div className="editorial-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Libreria inicial</div>
                <div className="text-sm text-[var(--muted)]">Selecciona una pose para previsualizarla o revisar su descripcion.</div>
              </div>
              <div className="text-sm text-[var(--muted)]">{poseLibrary.length} poses</div>
            </div>
            <div className="grid max-h-[52vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {poseLibrary.map((pose) => (
                <button
                  key={pose.id}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    pose.id === poseId ? "border-[var(--accent)] bg-[rgba(217,119,53,0.09)]" : "border-[var(--border)] bg-[rgba(255,249,240,0.86)]"
                  }`}
                  onClick={() => {
                    setPoseId(pose.id);
                    setCalibrationMode(true);
                  }}
                  type="button"
                >
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{pose.metadata?.category}</div>
                  <div className="mt-1 font-semibold">{pose.label}</div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pose.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
