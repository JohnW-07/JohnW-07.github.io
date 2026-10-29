import { KO_FC, KO_LG, KO_SM } from "./constants";
import { clamp } from "./math";

/** Font size in columns mapped onto [0, 1] across KO_FC (M:372). */
export const koTier = (fontPx: number, cellPx: number) =>
  +clamp((fontPx / cellPx - KO_FC[0]) / (KO_FC[1] - KO_FC[0])).toFixed(2);

/** [core, blur, edge] in columns, lerped KO_SM → KO_LG. */
export const tierValues = (t: number) => KO_SM.map((a, i) => a + (KO_LG[i] - a) * t) as [number, number, number];
