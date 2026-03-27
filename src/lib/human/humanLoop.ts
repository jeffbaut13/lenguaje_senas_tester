import type Human from "@vladmandic/human";
import type { Result } from "@vladmandic/human";
import type { PoseFrame, TrackingControlsState, TrackingLogEntry } from "@/lib/tracking/trackerTypes";
import { mapHumanResultToPoseFrame } from "@/lib/vrm/retarget";

interface HumanLoopOptions {
  video: HTMLVideoElement;
  getHuman: () => Promise<Human>;
  getControls: () => TrackingControlsState;
  onFrame: (frame: PoseFrame | null, result: Result) => void;
  onError: (error: unknown) => void;
  onLog: (entry: TrackingLogEntry) => void;
}

export class HumanLoop {
  private active = false;
  private timeoutId: number | null = null;

  constructor(private readonly options: HumanLoopOptions) {}

  start() {
    if (this.active) {
      return;
    }

    this.active = true;
    void this.tick();
  }

  stop() {
    this.active = false;
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private async tick() {
    if (!this.active) {
      return;
    }

    const startedAt = performance.now();

    try {
      const human = await this.options.getHuman();
      const result = await human.detect(this.options.video);
      const frame = mapHumanResultToPoseFrame(result, this.options.video);
      this.options.onFrame(frame, result);
    } catch (error) {
      this.options.onError(error);
      this.options.onLog({
        id: `human-${Date.now()}`,
        level: "error",
        message: error instanceof Error ? error.message : "Human detect loop failed.",
        timestamp: Date.now(),
      });
    }

    const elapsed = performance.now() - startedAt;
    const waitMs = Math.max(4, 1000 / 24 - elapsed);

    this.timeoutId = window.setTimeout(() => {
      void this.tick();
    }, waitMs);
  }
}
