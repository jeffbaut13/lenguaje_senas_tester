export class FpsCounter {
  private frames = 0;
  private last = performance.now();
  private smoothed = 0;

  constructor(private readonly smoothing = 0.2) {}

  tick(now = performance.now()) {
    this.frames += 1;
    const elapsed = now - this.last;

    if (elapsed < 250) {
      return this.smoothed;
    }

    const instant = (this.frames * 1000) / elapsed;
    this.smoothed = this.smoothed === 0 ? instant : this.smoothed + (instant - this.smoothed) * this.smoothing;
    this.frames = 0;
    this.last = now;
    return this.smoothed;
  }

  value() {
    return this.smoothed;
  }
}
