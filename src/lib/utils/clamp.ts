export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const saturate = (value: number) => clamp(value, 0, 1);
