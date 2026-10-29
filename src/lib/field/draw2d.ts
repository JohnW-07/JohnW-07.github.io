import { themeSplit, type Cells, type GlyphSink } from "./atlas";

/** 2D fallback: one `drawImage` per glyph straight from the atlases (M:398–400). */
export const create2dSink = (cv: HTMLCanvasElement, atlases: HTMLCanvasElement[], cells: Cells, TH: Float32Array): GlyphSink | null => {
  const x = cv.getContext("2d");
  if (!x) return null;
  const { cw, ch, aw, ah } = cells;
  return {
    push: (g, hI, a, c, r, i) =>
      themeSplit(a, TH[i], (k, aa) => {
        x.globalAlpha = Math.min(1, aa);
        x.drawImage(atlases[k], g * aw, hI * ah, aw, ah, c * cw - 1, r * ch - 1, aw, ah);
      }),
    begin: () => { x.globalAlpha = 1; x.clearRect(0, 0, cv.width, cv.height); },
    end: () => {},
    destroy: () => {},
  };
};
