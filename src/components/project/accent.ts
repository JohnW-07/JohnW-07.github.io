/**
 * Per-project accent.
 *
 * Each case study leans on one of the two non-neutral tokens. Amber for the
 * work that is about a physical thing moving in real time, Prussian blue for
 * the work that is about measurement and inference. Two accents across five
 * pages is enough to make the pages feel distinct and few enough that they
 * still read as one site.
 *
 * Tailwind cannot assemble a class name at runtime, so every variant is
 * written out here rather than interpolated at the call site.
 */
export type Accent = "safelight" | "cyanotype";

/** Maps onto the tones `MonoLabel` already knows about. */
export const accentTone: Record<Accent, "signal" | "data"> = {
  safelight: "signal",
  cyanotype: "data",
};

/** Set on a figure's wrapper; the SVG inside draws with `currentColor`. */
export const accentText: Record<Accent, string> = {
  safelight: "text-safelight",
  cyanotype: "text-cyanotype",
};

export const accentBorder: Record<Accent, string> = {
  safelight: "border-safelight",
  cyanotype: "border-cyanotype",
};

export const accentHover: Record<Accent, string> = {
  safelight: "group-hover:text-safelight",
  cyanotype: "group-hover:text-cyanotype",
};
