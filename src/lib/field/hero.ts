import type { GlyphFn } from "./atlas";
import { BAMP, CORE, FZ, GLOW, GLYPHS, HBOLD, HHOLD, HSWEEP, HUES, HZA, HZV, NOISE_BAND, RAMP, SCAT, TRAIL } from "./constants";
import { clamp, easeSine, hash, smoothstep } from "./math";

/** The cell grid the field is drawn on; `ux`/`uy` are design units per cell, `T` the hue diagonal. */
export type Grid = { cols: number; rows: number; n: number; ux: number; uy: number; T: Float32Array };

/** A page layer on the field: its reveal per cell and its text knockout. */
export type FieldLayer = [vis: (i: number) => number, kn: Float32Array];

const RIDGE = 650; // depth ridge half-width in design units (M:422)
const FIRST_HOLD = 1500; // ms before the first sweep (M:427)

export const glitch = (s: number) => RAMP.length + ((s * GLYPHS.length) | 0);

/**
 * R18 B shared hero field (M:419–467): photo frames swept by the hero curve,
 * breathing, depth ridge and per-layer knockout. `draw(now, layers, glyph)`
 * pushes every visible glyph; `cur()` is the frame on screen.
 */
export const createHero = (g: Grid, heroDist: (x: number, y: number) => number, frames: Float32Array[], now: number) => {
  const { cols: COLS, rows: ROWS, n: N, ux: UX, uy: UY, T } = g;
  const HQ = new Float32Array(N), HG = new Float32Array(N), Z = new Float32Array(N);
  for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) {
    HQ[i] = heroDist((c + 0.5) * UX, (r + 0.5) * UY);
    Z[i] = 1 - smoothstep(0, RIDGE, Math.abs(HQ[i]));
  }
  for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) {
    const gx = (HQ[r * COLS + Math.min(COLS - 1, c + 1)] - HQ[r * COLS + Math.max(0, c - 1)]) / (2 * UX);
    const gy = (HQ[Math.min(ROWS - 1, r + 1) * COLS + c] - HQ[Math.max(0, r - 1) * COLS + c]) / (2 * UY);
    HG[i] = Math.max(1e-6, Math.hypot(gx, gy));
  }
  let lo = Infinity, hi = -Infinity;
  for (const q of HQ) { lo = Math.min(lo, q); hi = Math.max(hi, q); }
  const margin = (CORE + TRAIL + GLOW + 2 * FZ + SCAT + NOISE_BAND) * Float32Array.from(HG).sort()[N >> 1];
  let cur = 0, start: number | null = null, hold = now + FIRST_HOLD;
  const rowDx = new Float32Array(ROWS), rowN = new Float32Array(ROWS), colDy = new Float32Array(COLS), colN = new Float32Array(COLS);

  const samp = (L: Float32Array, c: number, r: number) => {
    c = Math.min(COLS - 1.001, Math.max(0, c)); r = Math.min(ROWS - 1.001, Math.max(0, r));
    const c0 = c | 0, r0 = r | 0, fc = c - c0, fr = r - r0, i = r0 * COLS + c0;
    return (L[i] * (1 - fc) + L[i + 1] * fc) * (1 - fr) + (L[i + COLS] * (1 - fc) + L[i + COLS + 1] * fc) * fr;
  };

  const draw = (now: number, layers: FieldLayer[], glyph: GlyphFn) => {
    if (!frames.length) return;
    const t = now / 1000, slow = (now / 320) | 0;
    if (frames.length > 1 && start === null && now > hold) start = now;
    const p = start === null ? 0 : Math.min(1, (now - start) / HSWEEP), front = lo - margin + easeSine(p) * (hi - lo + 2 * margin);
    const a = frames[cur], b = frames[(cur + 1) % frames.length], breathe = 0.5 + 0.5 * Math.sin((t * Math.PI) / 4.5);
    for (let r = 0; r < ROWS; r++) { rowDx[r] = 0.5 * Math.sin(r * 0.09 + t * 0.6) + 0.24 * Math.sin(r * 0.31 - t * 1.2); rowN[r] = Math.sin(r * 0.11 - t * 0.37); }
    for (let c = 0; c < COLS; c++) { colDy[c] = 0.19 * Math.sin(c * 0.05 + t * 0.5); colN[c] = Math.sin(c * 0.07 + t * 0.5); }
    for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) {
      let fade = 0;
      for (const [vis, KN] of layers) {
        const vi = vis(i);
        if (vi >= 0.02) fade += vi * (1 - smoothstep(0.1, 0.6, KN[i] + BAMP * (Math.sin(t * 0.8) * 0.6 + Math.sin(t * 0.5 + c * 0.06 + r * 0.11) * 0.4)));
      }
      fade = Math.min(1, fade);
      if (fade < 0.02) continue;
      const sc = c + rowDx[r], sr = r + colDy[c], zA = HZA + (1 - HZA) * Z[i];
      const fg = (gl: number, hI: number, al: number) => glyph(gl, hI, al * fade * zA, c, r, i);
      const du0 = start === null ? -1e9 : (front - HQ[i]) / HG[i], du = du0 + (hash(i, 0) - 0.5) * SCAT, hI0 = Math.round(T[i] * (HUES - 1));
      const bI = smoothstep(-FZ, 0, du) * (1 - smoothstep(CORE, CORE + FZ, du)), mix = smoothstep(-FZ, CORE + FZ, du);
      let v = mix <= 0 ? samp(a, sc, sr) : mix >= 1 ? samp(b, sc, sr) : samp(a, sc, sr) * (1 - mix) + samp(b, sc, sr) * mix;
      v = (v * (0.945 + 0.055 * breathe) + 0.026 * rowN[r] * colN[c]) * (HZV + (1 - HZV) * Z[i]);
      if (du < -FZ && du > -FZ - GLOW) v += 0.2 * HBOLD * (1 + (du + FZ) / GLOW) ** 2;
      v *= fade;
      const halo = Math.max(0, 1 - Math.abs(du0 - CORE / 2) / (CORE / 2 + NOISE_BAND));
      if (halo > 0 && hash(i, slow + 11) < 0.07 * halo * halo * fade * fade) { fg(glitch(hash(i, slow + 13)), Math.round(hI0 * 0.4), 0.25 + 0.35 * halo); continue; }
      if (bI > 0.02 && hash(i, slow) < (0.1 + 0.6 * bI) * fade * fade) {
        const pv = clamp(v);
        fg(hash(i, slow + 5) < 0.3 * bI ? glitch(hash(i, slow + 9)) : Math.max(RAMP.length - 6 + Math.round(bI * 4), Math.min(RAMP.length - 1, (pv * RAMP.length) | 0)),
          Math.round(hI0 * (0.15 + 0.4 * (1 - bI))), Math.max(HBOLD * (0.35 + 0.65 * bI), 0.3 + 0.7 * pv));
        continue;
      }
      const tr = du >= CORE + FZ && du < CORE + FZ + TRAIL ? 1 - (du - CORE - FZ) / TRAIL : 0, hI = Math.round(clamp(T[i] * 0.92 + clamp(v) * 0.08) * (HUES - 1));
      if (tr > 0 && hash(i, slow + 3) < tr * tr * 0.45 * HBOLD * fade * fade) { fg(glitch(hash(i, slow + 7)), Math.round(hI * (1 - 0.5 * tr)), 0.3 + 0.4 * tr); continue; }
      v = clamp(v);
      const k = Math.min(RAMP.length - 1, (v * RAMP.length) | 0);
      if (k) fg(k, hI, 0.3 + 0.7 * v);
    }
    if (start !== null && p >= 1) { cur = (cur + 1) % frames.length; start = null; hold = now + HHOLD; }
  };

  return { draw, cur: () => cur };
};
