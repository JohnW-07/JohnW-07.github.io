/**
 * Curve sampling for the hand-drawn figures.
 *
 * The traces on these plates are schematic. They describe the shape of a
 * signal, not a recorded measurement, and every plate that uses them says so
 * in its corner. Sampling a closed-form function keeps them deterministic, so
 * the server and the client draw the same line and nothing hydrates twice.
 */

export interface TraceBox {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

/** Samples `fn` over t ∈ [0,1] into an SVG polyline `points` string. */
export const trace = (
  fn: (t: number) => number,
  box: TraceBox,
  samples = 180,
): string =>
  Array.from({ length: samples }, (_, i) => {
    const t = i / (samples - 1);
    const v = Math.min(1, Math.max(0, fn(t)));
    return `${(box.x + t * box.w).toFixed(1)},${(box.y + (1 - v) * box.h).toFixed(1)}`;
  }).join(" ");

/** Gaussian bump. Used for impact spikes. */
export const bell = (t: number, center: number, width: number): number =>
  Math.exp(-(((t - center) / width) ** 2));

/** Logistic step. Used for anything that ramps and holds. */
export const step = (t: number, center: number, slope: number): number =>
  1 / (1 + Math.exp(-(t - center) * slope));

/** Horizontal position of a normalized time within a box. */
export const at = (box: TraceBox, t: number): number => box.x + t * box.w;
