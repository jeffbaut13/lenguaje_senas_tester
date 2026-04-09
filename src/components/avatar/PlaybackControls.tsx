"use client";

interface PlaybackControlsProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function PlaybackControls({ speed, onSpeedChange, onPlay, onStop, onReset }: PlaybackControlsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button className="action-button secondary !min-h-[42px] text-sm" onClick={onPlay} type="button">
          Play
        </button>
        <button className="action-button secondary !min-h-[42px] text-sm" onClick={onStop} type="button">
          Stop
        </button>
        <button className="action-button secondary !min-h-[42px] text-sm" onClick={onReset} type="button">
          Reset
        </button>
      </div>
      <label className="block">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          <span>Velocidad</span>
          <span>{speed.toFixed(2)}x</span>
        </div>
        <input
          aria-label="Velocidad de reproducción"
          className="range-input"
          max={1.7}
          min={0.6}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          step={0.1}
          type="range"
          value={speed}
        />
      </label>
    </div>
  );
}
