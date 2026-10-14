// 📖 Docs: obsidian/frontend/components/common.md

/**
 * Adaptive scaling grid configuration.
 *
 * The grid keeps a rem-based design proportional across viewports by scaling
 * the root (`<html>`) font-size. Each breakpoint maps a viewport `maxWidth` to
 * the design `baseWidth` it was laid out at — at `baseWidth` the root
 * font-size equals `FONT_BASE` and rem values match the design 1:1.
 *
 * - Scaling UP (viewport above `GRID_BASE_WIDTH`) is driven at runtime by the
 *   `AdaptiveGrid` component / `useAdaptiveGrid` hook. This is the only half of
 *   the mechanism still in use, and `GRID_BASE_WIDTH` (1920) is the only value
 *   below that it reads.
 * - Scaling DOWN no longer exists. It used to be `vw` media queries on `html`
 *   in `globals.css`, one per breakpoint below. Those shrank the whole site by
 *   11–20% at every width *between* breakpoints and broke browser font-size
 *   preferences, so they were deleted; the root font-size is a fixed 16px and
 *   fluidity lives in `clamp()` on each type step and spacing token.
 *   See obsidian/meta/decisions-log.md ADR-0022.
 *
 * The sub-1920 entries in `GRID_BREAKPOINTS` are therefore inert — kept only
 * because `GRID_BASE_WIDTH` is derived from the set. Do NOT reintroduce `vw`
 * media queries on `html` to "match" them.
 */

/** Root font-size (px) the design is measured against. */
export const FONT_BASE = 16;

export interface GridBreakpoint {
  /** Media-query `max-width` threshold (px). */
  maxWidth: number;
  /** Design base width (px) the range was laid out at. */
  baseWidth: number;
}

/** Breakpoints, largest first. */
export const GRID_BREAKPOINTS: readonly GridBreakpoint[] = [
  { maxWidth: 1920, baseWidth: 1920 },
  { maxWidth: 1440, baseWidth: 1440 },
  { maxWidth: 1024, baseWidth: 1024 },
  { maxWidth: 640, baseWidth: 360 },
];

/** Largest breakpoint width — above it the root font-size scales up. */
export const GRID_BASE_WIDTH = Math.max(
  ...GRID_BREAKPOINTS.map((bp) => bp.maxWidth),
);
