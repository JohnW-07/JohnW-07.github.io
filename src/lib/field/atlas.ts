import { ALL, HUES, THEMES, type Theme } from "./constants";
import { rampColor } from "./math";

/** Cell size in device px and the padded atlas tile around it. */
export type Cells = { cw: number; ch: number; aw: number; ah: number };

/** Draws one glyph `g` in hue row `hI` at cell (c, r), alpha `a`, split across the two themes by TH[i]. */
export type GlyphFn = (g: number, hI: number, a: number, c: number, r: number, i: number) => void;

/** A per-frame glyph target: WebGL2 instanced batch or the 2D fallback. */
export type GlyphSink = { push: GlyphFn; begin: () => void; end: () => void; destroy: () => void };

/** Every glyph × hue for one theme, one tile per cell (M:309–312). */
export const buildAtlas = (t: Theme, cells: Cells, family: string) => {
  const at = document.createElement("canvas");
  at.width = ALL.length * cells.aw; at.height = HUES * cells.ah;
  const ax = at.getContext("2d")!;
  ax.font = `${t.wt} ${cells.ch * 0.9}px ${family}`;
  ax.textBaseline = "top";
  for (let hI = 0; hI < HUES; hI++) {
    ax.fillStyle = `rgb(${rampColor(hI / (HUES - 1), t.grad).map(Math.round)})`;
    for (let g = 0; g < ALL.length; g++) ax.fillText(ALL[g], g * cells.aw + 1, hI * cells.ah + 1);
  }
  return at;
};

/** Calls `draw(k, alpha)` for each theme k whose share of `a` is visible (M:399, M:416). */
export const themeSplit = (a: number, th: number, draw: (k: number, aa: number) => void) => {
  for (const k of [0, 1]) {
    const aa = a * (k ? th : 1 - th) * THEMES[k].dim;
    if (aa > 0.004) draw(k, aa);
  }
};
