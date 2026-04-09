import type { PlayPlan, PlaybackSnapshot } from "@/lib/types/plans";

type SnapshotListener = (snapshot: PlaybackSnapshot) => void;
type PoseListener = (poseId: string) => void;

const wait = (ms: number, signal: AbortSignal, speed: number) =>
  new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms / Math.max(speed, 0.25));
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Playback aborted", "AbortError"));
      },
      { once: true },
    );
  });

export class AvatarPlaybackController {
  private speed = 1;
  private activeAbortController: AbortController | null = null;
  private snapshot: PlaybackSnapshot = {
    status: "idle",
    currentStepIndex: -1,
    currentPoseId: "NEUTRAL",
    activeLabel: "Reposo",
    speed: 1,
    queueLength: 0,
  };
  private onSnapshot?: SnapshotListener;
  private onPose?: PoseListener;

  constructor(options?: { onSnapshot?: SnapshotListener; onPose?: PoseListener }) {
    this.onSnapshot = options?.onSnapshot;
    this.onPose = options?.onPose;
  }

  private emitSnapshot(partial: Partial<PlaybackSnapshot>) {
    this.snapshot = {
      ...this.snapshot,
      ...partial,
      speed: this.speed,
    };
    this.onSnapshot?.(this.snapshot);
  }

  setSpeed(multiplier: number) {
    this.speed = multiplier;
    this.emitSnapshot({});
  }

  stop() {
    this.activeAbortController?.abort();
    this.activeAbortController = null;
    this.emitSnapshot({
      status: "stopped",
      currentStepIndex: -1,
      activeLabel: "Detenido",
      queueLength: 0,
    });
  }

  resetToNeutral() {
    this.onPose?.("NEUTRAL");
    this.emitSnapshot({
      status: "idle",
      currentPoseId: "NEUTRAL",
      currentStepIndex: -1,
      activeLabel: "Neutral",
      queueLength: 0,
    });
  }

  async play(plan: PlayPlan) {
    const abortController = new AbortController();
    this.activeAbortController = abortController;
    this.emitSnapshot({
      status: "playing",
      queueLength: plan.steps.length,
      currentStepIndex: -1,
      activeLabel: "Iniciando",
    });

    try {
      for (const [index, step] of plan.steps.entries()) {
        if (abortController.signal.aborted) {
          return;
        }

        this.emitSnapshot({
          status: "playing",
          currentStepIndex: index,
          activeLabel: step.label,
          currentPoseId: step.poseId ?? this.snapshot.currentPoseId,
          activeToken: step.token,
          queueLength: plan.steps.length,
        });

        if (step.poseId) {
          this.onPose?.(step.poseId);
        }

        await wait(step.durationMs, abortController.signal, this.speed);
      }

      if (this.activeAbortController === abortController) {
        this.activeAbortController = null;
      }

      this.resetToNeutral();
    } catch {
      if (this.activeAbortController === abortController) {
        this.activeAbortController = null;
      }
    }
  }

  replace(plan: PlayPlan) {
    this.stop();
    void this.play(plan);
  }
}
