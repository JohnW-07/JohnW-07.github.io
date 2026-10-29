import { KO_FC, KO_LG, KO_SM } from "./constants";
import { clamp, smoothstep } from "./math";

/** Font size in columns mapped onto [0, 1] across KO_FC (M:372). */
export const koTier = (fontPx: number, cellPx: number) =>
  +clamp((fontPx / cellPx - KO_FC[0]) / (KO_FC[1] - KO_FC[0])).toFixed(2);

/** [core, blur, edge] in columns, lerped KO_SM → KO_LG. */
export const tierValues = (t: number) => KO_SM.map((a, i) => a + (KO_LG[i] - a) * t) as [number, number, number];

/**
 * Chamfer distance (in columns) from every cell to the nearest lit cell of an
 * RGBA grid (alpha > 30); a row step costs `ay`, a diagonal √(1 + ay²) (M:363–371).
 */
export const distanceTransform = (rgba: Uint8ClampedArray, cols: number, rows: number, ay: number) => {
  const n = cols * rows, dt = new Float32Array(n), ad = Math.hypot(1, ay);
  for (let i = 0; i < n; i++) dt[i] = rgba[i * 4 + 3] > 30 ? 0 : 1e9;
  const relax = (i: number, j: number, d: number) => { if (dt[j] + d < dt[i]) dt[i] = dt[j] + d; };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    if (c > 0) relax(i, i - 1, 1);
    if (r > 0) { relax(i, i - cols, ay); if (c > 0) relax(i, i - cols - 1, ad); if (c < cols - 1) relax(i, i - cols + 1, ad); }
  }
  for (let r = rows - 1; r >= 0; r--) for (let c = cols - 1; c >= 0; c--) {
    const i = r * cols + c;
    if (c < cols - 1) relax(i, i + 1, 1);
    if (r < rows - 1) { relax(i, i + cols, ay); if (c < cols - 1) relax(i, i + cols + 1, ad); if (c > 0) relax(i, i + cols - 1, ad); }
  }
  return dt;
};

export type KnockoutGrid = { w: number; h: number; dpr: number; cols: number; rows: number; cw: number; ch: number };

type Draw = (x: CanvasRenderingContext2D) => void;

/**
 * Per-cell text knockout for a page (M:373–400): every `selectors` box and the
 * h1's glyphs, one bubble per font-size tier, merged per cell. Boxes are read
 * in viewport space, which is the fixed field canvas's space.
 */
export const buildKnockout = (layer: HTMLElement, selectors: string, g: KnockoutGrid, blurFn: (src: ArrayLike<number>, cols: number, rows: number, rad: number, radY: number) => Float32Array) => {
  const kc = document.createElement("canvas"), gc = document.createElement("canvas");
  kc.width = g.w; kc.height = g.h; gc.width = g.cols; gc.height = g.rows;
  const kx = kc.getContext("2d")!, gx = gc.getContext("2d", { willReadFrequently: true })!;
  const tiers = new Map<number, Draw[]>();
  const rel = (el: Element) => { const b = el.getBoundingClientRect(); return [b.left * g.dpr, b.top * g.dpr, b.width * g.dpr, b.height * g.dpr] as const; };
  const add = (el: Element, draw: Draw) => {
    const t = koTier(parseFloat(getComputedStyle(el).fontSize), g.cw / g.dpr);
    tiers.set(t, [...(tiers.get(t) ?? []), draw]);
  };
  layer.querySelectorAll(selectors).forEach((el) => add(el, (x) => x.fillRect(...rel(el))));
  const h1 = layer.querySelector("h1");
  if (h1) {
    const cs = getComputedStyle(h1), fs = parseFloat(cs.fontSize) * g.dpr, lh = parseFloat(cs.lineHeight) * g.dpr, [hx, hy, hw] = rel(h1);
    const lines = h1.innerText.split("\n").map((l) => l.trim()).filter(Boolean), right = cs.textAlign === "right" || cs.textAlign === "end";
    add(h1, (x) => {
      x.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      x.letterSpacing = `${parseFloat(cs.letterSpacing) * g.dpr || 0}px`;
      x.textAlign = right ? "right" : "left";
      const mt = x.measureText(lines[0] ?? ""), base = lh / 2 + (mt.fontBoundingBoxAscent - mt.fontBoundingBoxDescent) / 2;
      lines.forEach((line, n) => x.fillText(line, right ? hx + hw : hx, hy + n * lh + base));
    });
  }
  const kn = new Float32Array(g.cols * g.rows);
  for (const [t, draws] of tiers) {
    const [core, rad, edge] = tierValues(t);
    kx.clearRect(0, 0, g.w, g.h);
    draws.forEach((d) => d(kx));
    gx.clearRect(0, 0, g.cols, g.rows);
    gx.drawImage(kc, 0, 0, g.w, g.rows * g.ch, 0, 0, g.cols, g.rows);
    const dt = distanceTransform(gx.getImageData(0, 0, g.cols, g.rows).data, g.cols, g.rows, g.ch / g.cw);
    const bub = blurFn(Array.from(dt, (d) => (d <= core ? 1 : 0)), g.cols, g.rows, Math.round(rad), Math.round((rad * g.cw) / g.ch));
    for (let i = 0; i < kn.length; i++) kn[i] = Math.max(kn[i], bub[i], 1 - smoothstep(0, edge, dt[i]));
  }
  return kn;
};
