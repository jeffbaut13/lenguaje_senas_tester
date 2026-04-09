"use client";

import { useEffect, useMemo, useState } from "react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PlaybackControls } from "@/components/avatar/PlaybackControls";
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

export function PoseLibraryStudio() {
  const [poseId, setPoseId] = useState("NEUTRAL");
  const [speed, setSpeed] = useState(1);
  const [sampleText, setSampleText] = useState("Solicitar implementación");
  const [playbackSnapshot, setPlaybackSnapshot] = useState<PlaybackSnapshot>(INITIAL_SNAPSHOT);
  const [controller] = useState(
    () =>
      new AvatarPlaybackController({
        onPose: setPoseId,
        onSnapshot: setPlaybackSnapshot,
      }),
  );
  const bundle = useMemo(() => planTranslation(sampleText), [sampleText]);

  useEffect(() => {
    controller.setSpeed(speed);
  }, [controller, speed]);

  return (
    <main className="container-shell py-10">
      <div className="mb-8">
        <p className="eyebrow">Dev page</p>
        <h1 className="section-title mt-5">Pose library y secuencias de demo</h1>
        <p className="body-copy mt-4 max-w-[760px]">
          Página interna para revisar poses placeholder, validar el pipeline y probar el flujo{" "}
          <code>texto -&gt; semanticPlan -&gt; signPlan -&gt; playPlan</code> sin depender de la landing principal.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="soft-panel overflow-hidden rounded-[32px] p-4 md:p-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#f5ece0_0%,#ead8c1_100%)]">
            <AvatarCanvas className="absolute inset-0" poseId={poseId} />
          </div>
          <div className="mt-4">
            <PlaybackControls
              onPlay={() => controller.replace(bundle.playPlan)}
              onReset={() => controller.resetToNeutral()}
              onSpeedChange={setSpeed}
              onStop={() => controller.stop()}
              speed={speed}
            />
            <div className="mt-3 rounded-[24px] bg-[rgba(255,248,239,0.9)] p-4 text-sm">
              <div className="mb-2 font-semibold">Estado de preview</div>
              <pre>{JSON.stringify(playbackSnapshot, null, 2)}</pre>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="soft-panel rounded-[32px] p-5">
            <div className="mb-3 text-sm font-semibold">Probar traducción</div>
            <textarea
              className="min-h-[120px] w-full rounded-[24px] border border-[var(--border)] bg-[rgba(255,248,239,0.9)] p-4 outline-none"
              onChange={(event) => setSampleText(event.target.value)}
              value={sampleText}
            />
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(255,248,239,0.86)] p-4 text-sm">
                <div className="mb-2 font-semibold">semanticPlan</div>
                <pre>{JSON.stringify(bundle.semanticPlan, null, 2)}</pre>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,248,239,0.86)] p-4 text-sm">
                <div className="mb-2 font-semibold">signPlan</div>
                <pre>{JSON.stringify(bundle.signPlan, null, 2)}</pre>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,248,239,0.86)] p-4 text-sm">
                <div className="mb-2 font-semibold">playPlan</div>
                <pre>{JSON.stringify(bundle.playPlan, null, 2)}</pre>
              </div>
            </div>
          </div>

          <div className="soft-panel rounded-[32px] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Librería inicial</div>
                <div className="text-sm text-[var(--muted)]">Selecciona una pose para previsualizarla.</div>
              </div>
              <div className="text-sm text-[var(--muted)]">{poseLibrary.length} poses</div>
            </div>
            <div className="grid max-h-[52vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {poseLibrary.map((pose) => (
                <button
                  key={pose.id}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    pose.id === poseId
                      ? "border-[var(--accent)] bg-[rgba(220,125,46,0.09)]"
                      : "border-[var(--border)] bg-[rgba(255,248,239,0.86)]"
                  }`}
                  onClick={() => setPoseId(pose.id)}
                  type="button"
                >
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{pose.metadata?.category}</div>
                  <div className="mt-1 font-semibold">{pose.id}</div>
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
