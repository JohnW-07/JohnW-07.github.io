import { THEMES } from "./constants";

/** The field's cell grid in CSS px, with Q (signed distance across the site curve) per cell. */
export type CellGrid = { cols: number; rows: number; cw: number; ch: number; Q: Float32Array };

type Kind = "mid" | "mute" | "acc";

/** A page leaf (`[data-c]` text or `[data-p]` mark) and the cells along its wave normal; `m`/`bg`/`pc` cache what was last written. */
export type Item = { el: HTMLElement; text: boolean; kind: Kind; photo: boolean; ci: number; deg: string; idx: number[]; m?: string; bg?: string; pc?: string };

/** Photo reveal: `u(i)` behind the front, eased from `e0` to `e1`; `out` fades instead of reveals. */
export type Band = [u: (i: number) => number, e0: number, e1: number, out: boolean];

const MIN_STOPS = 5, STOP_PX = 6;
const CLEAR = "linear-gradient(transparent,transparent)";

const cellAt = (g: CellGrid, x: number, y: number) =>
  Math.min(g.rows - 1, Math.max(0, (y / g.ch) | 0)) * g.cols + Math.min(g.cols - 1, Math.max(0, (x / g.cw) | 0));

/** Measures every leaf of `layer` once, relative to `root` (M:337–344). */
export const prep = (layer: HTMLElement, root: DOMRect, g: CellGrid): Item[] =>
  [...layer.querySelectorAll<HTMLElement>("[data-c], [data-p]")].map((el) => {
    const b = el.getBoundingClientRect(), x = b.left - root.left + b.width / 2, y = b.top - root.top + b.height / 2;
    const ci = cellAt(g, x, y), c = ci % g.cols, r = (ci / g.cols) | 0, Q = g.Q;
    const gx = (Q[r * g.cols + Math.min(g.cols - 1, c + 1)] - Q[r * g.cols + Math.max(0, c - 1)]) / g.cw;
    const gy = (Q[Math.min(g.rows - 1, r + 1) * g.cols + c] - Q[Math.max(0, r - 1) * g.cols + c]) / g.ch;
    const gl = Math.hypot(gx, gy) || 1, nx = gx / gl, ny = gy / gl, ang = Math.atan2(nx, -ny);
    const L = Math.abs(b.width * Math.sin(ang)) + Math.abs(b.height * Math.cos(ang)), K = Math.max(MIN_STOPS, Math.ceil(L / STOP_PX));
    return {
      el, text: !!el.dataset.c, kind: (el.dataset.c || el.dataset.p) as Kind, photo: el.tagName === "FIGURE", ci, deg: ((ang * 180) / Math.PI).toFixed(1),
      idx: Array.from({ length: K }, (_, k) => cellAt(g, x + (k / (K - 1) - 0.5) * L * nx, y + (k / (K - 1) - 0.5) * L * ny)),
    };
  });

const ease = (k: number) => k * k * (3 - 2 * k);

/** Photos: u is linear across a frame, so the reveal is a short exact gradient tracking the wave edge (M:346–349). */
const pmask = (it: Item, [u, e0, e1, out]: Band) => {
  const u0 = u(it.idx[0]), u1 = u(it.idx[it.idx.length - 1]), lo = Math.min(u0, u1), hi = Math.max(u0, u1);
  if (lo >= e1 || hi <= e0) return (lo >= e1) !== out ? "" : CLEAR;
  const st = [0, 0.25, 0.5, 0.75, 1]
    .map((k) => [(100 * (e0 + (e1 - e0) * k - u0)) / (u1 - u0 || 1e-6), out ? 1 - ease(k) : ease(k)])
    .sort((a, b) => a[0] - b[0]);
  return `linear-gradient(${it.deg}deg,${st.map(([p, a]) => `rgba(0,0,0,${a.toFixed(3)}) ${p.toFixed(2)}%`).join(",")})`;
};

/** Leaves: alpha sampled along the normal (M:350–352). */
const mask = (it: Item, alpha: (i: number) => number) => {
  const a = it.idx.map(alpha);
  if (a.every((v) => v > 0.999)) return "";
  if (a.every((v) => v < 0.001)) return CLEAR;
  return `linear-gradient(${it.deg}deg,${a.map((v, k) => `rgba(0,0,0,${v.toFixed(3)}) ${((100 * k) / (a.length - 1)).toFixed(1)}%`).join(",")})`;
};

/** Writes each leaf's mask only when it changes; `alpha === null` clears it (M:353–356). */
export const paint = (items: Item[], alpha: ((i: number) => number) | null, band?: Band): void => {
  for (const it of items) {
    const m = !alpha ? "" : it.photo && band ? pmask(it, band) : mask(it, alpha);
    if (m === (it.m ?? "")) continue;
    it.el.style.maskImage = it.el.style.webkitMaskImage = it.m = m;
  }
};

/** A theme colour between light (th 0) and dark (th 1) (M:330). */
const tcol = (kind: Kind | "paper", th: number) => {
  const A = THEMES[0][kind], B = THEMES[1][kind];
  return `rgb(${(A[0] + (B[0] - A[0]) * th) | 0},${(A[1] + (B[1] - A[1]) * th) | 0},${(A[2] + (B[2] - A[2]) * th) | 0})`;
};

/**
 * Theme colour along the wave normal (M:354–355): text as a gradient clipped to its glyphs, marks as `--pc`/`--pp`.
 * Written only while the theme moves; `bt === null` hands colour back to the stylesheet.
 */
export const tint = (items: Item[], bt: Float32Array | null): void => {
  for (const it of items) {
    const st = it.el.style;
    if (it.text) {
      const g = !bt ? "" : `linear-gradient(${it.deg}deg,${it.idx.map((i, k) => `${tcol(it.kind, bt[i])} ${((100 * k) / (it.idx.length - 1)).toFixed(1)}%`).join(",")})`;
      if (g === (it.bg ?? "")) continue;
      st.backgroundImage = it.bg = g;
      st.backgroundClip = g && "text";
      st.setProperty("-webkit-background-clip", g && "text");
      st.color = g && "transparent";
      continue;
    }
    const pc = bt ? tcol(it.kind, bt[it.ci]) : "";
    if (pc === (it.pc ?? "")) continue;
    st.setProperty("--pc", (it.pc = pc));
    st.setProperty("--pp", bt ? tcol("paper", bt[it.ci]) : "");
  }
};
