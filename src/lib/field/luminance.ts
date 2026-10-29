import { clamp, smoothstep } from "./math";

/**
 * Photo → per-cell darkness in [0, 1] on a COLS×ROWS grid (M:270–282). The image
 * covers the W×H design frame (or only the `art` band of it, fading at its
 * edges), anchored vertically at focus `fy`; contrast is stretched 2%–98%.
 */
export const toLum = (img: HTMLImageElement, fy: number, cols: number, rows: number, ys: number, W: number, H: number, art?: [number, number]) => {
  const c = document.createElement("canvas");
  c.width = cols; c.height = rows;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.imageSmoothingQuality = "high";
  x.fillStyle = "#fff";
  x.fillRect(0, 0, cols, rows);
  x.setTransform(cols / W, 0, 0, ys, 0, 0);
  const [y0, bh] = art ? [art[0] * H, (art[1] - art[0]) * H] : [0, H];
  const s = Math.max(W / img.naturalWidth, bh / img.naturalHeight), iw = img.naturalWidth * s, ih = img.naturalHeight * s;
  if (art) { x.beginPath(); x.rect(0, y0, W, bh); x.clip(); }
  x.drawImage(img, (W - iw) / 2, y0 + (bh - ih) * fy, iw, ih);
  const d = x.getImageData(0, 0, cols, rows).data, L = new Float32Array(cols * rows);
  for (let i = 0; i < L.length; i++) L[i] = 1 - (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
  const so = Float32Array.from(L).sort(), lo = so[(L.length * 0.02) | 0], hi = so[(L.length * 0.98) | 0], fz = 0.08 * H;
  const ef = (i: number) => { const y = (((i / cols) | 0) + 0.5) / ys; return smoothstep(y0, y0 + fz, y) * (1 - smoothstep(y0 + bh - fz, y0 + bh, y)); };
  return L.map((v, i) => clamp((v - lo) / (hi - lo)) * (art ? ef(i) : 1));
};

/** Three-pass separable box blur, normalized to [0, 1] (M:285–294). */
export const blur = (src: ArrayLike<number>, cols: number, rows: number, rad: number, radY = rad) => {
  const a = Float32Array.from(src), b = new Float32Array(a.length);
  for (let pass = 0; pass < 3; pass++) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      let s = 0, n = 0;
      for (let k = -rad; k <= rad; k++) { const cc = c + k; if (cc >= 0 && cc < cols) { s += a[r * cols + cc]; n++; } }
      b[r * cols + c] = s / n;
    }
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
      let s = 0, n = 0;
      for (let k = -radY; k <= radY; k++) { const rr = r + k; if (rr >= 0 && rr < rows) { s += b[rr * cols + c]; n++; } }
      a[r * cols + c] = s / n;
    }
  }
  let lo = Infinity, hi = -Infinity;
  for (const v of a) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  return a.map((v) => (hi > lo ? (v - lo) / (hi - lo) : 0));
};
