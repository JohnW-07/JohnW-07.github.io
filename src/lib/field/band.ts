import type { GlyphFn } from "./atlas";
import { BOLD, CORE, FZ, HUES, NOISE_BAND, RAMP, SCAT, TRAIL } from "./constants";
import { glitch } from "./hero";
import { clamp, hash, smoothstep } from "./math";

/** Per-cell fields the band reads: Q signed distance across the curve, G its gradient, T the hue diagonal. */
export type BandGrid = { cols: number; rows: number; Q: Float32Array; G: Float32Array; T: Float32Array };

const TR0 = CORE + FZ;
const soft = (seed: number, d: number, wd: number) => smoothstep(seed - wd, seed + wd, d);

/**
 * The ASCII wave band (bar + glitch halo + trail) riding the nearest front (M:489–505).
 * Each cell has fixed seeds and its coverage, glyph and alpha vary continuously with the front, so nothing pops.
 */
export const drawBand = (g: BandGrid, fronts: number[], glyph: GlyphFn): void => {
  for (let r = 0, i = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++, i++) {
    let du0 = Infinity;
    for (const f of fronts) {
      const d = (f - g.Q[i]) / g.G[i];
      if (Math.abs(d - CORE / 2) < Math.abs(du0 - CORE / 2)) du0 = d;
    }
    const du = du0 + (hash(i, 0) - 0.5) * SCAT, hI0 = Math.round(g.T[i] * (HUES - 1));
    const bI = smoothstep(-FZ, 0, du) * (1 - smoothstep(CORE, CORE + FZ, du)), halo = Math.max(0, 1 - Math.abs(du0 - CORE / 2) / (CORE / 2 + NOISE_BAND));
    const tr = smoothstep(TR0 - 8, TR0, du) * (1 - clamp((du - TR0) / TRAIL));
    const aH = halo > 0 ? soft(hash(i, 11), 0.1 * halo * halo, 0.02) : 0, aB = bI > 0.02 ? soft(hash(i, 1), 0.25 + 0.7 * bI, 0.08) * (1 - aH) : 0;
    const aT = tr > 0 ? soft(hash(i, 3), tr * tr * 0.45 * BOLD, 0.05) * (1 - aH) : 0;
    if (aH > 0.01) glyph(glitch(hash(i, 13)), Math.round(hI0 * 0.4), (0.25 + 0.35 * halo) * aH, c, r, i);
    if (aB > 0.01) {
      const a = Math.max(BOLD * (0.35 + 0.65 * bI), 0.5) * aB, hI = Math.round(hI0 * (0.15 + 0.4 * (1 - bI)));
      if (hash(i, 5) < 0.2) glyph(glitch(hash(i, 9)), hI, a, c, r, i);
      else {
        const x = RAMP.length - 6 + bI * 4, g0 = x | 0, f = x - g0;
        glyph(g0, hI, a * (1 - f), c, r, i);
        if (f > 0.02) glyph(g0 + 1, hI, a * f, c, r, i);
      }
    }
    if (aT > 0.01) glyph(glitch(hash(i, 7)), Math.round(hI0 * (1 - 0.5 * tr)), (0.3 + 0.4 * tr) * aT, c, r, i);
  }
};
