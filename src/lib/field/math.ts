export type RGB = [number, number, number];

export const clamp = (x: number) => Math.min(1, Math.max(0, x));

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export const hash = (i: number, t: number) => {
  const x = Math.sin(i * 12.9898 + t * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const easeOut = (t: number) => Math.sin((Math.PI * t) / 2);
export const easeSine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

export const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;

/** Colour at `t` along a gradient of evenly spaced stops. */
export const rampColor = (t: number, stops: RGB[]): RGB => {
  const x = Math.min(0.999, Math.max(0, t)) * (stops.length - 1);
  const i = x | 0;
  const f = x - i;
  return stops[i].map((c, k) => c + (stops[i + 1][k] - c) * f) as RGB;
};
