import type { SpringConfig } from "@react-spring/web";

/**
 * House motion.
 *
 * Every spring on the site comes from this file. One vocabulary of four
 * configs, chosen so the whole page feels like one mechanism rather than a
 * collection of independently tuned components.
 *
 * The site's aesthetic is a measuring instrument, so the motion is damped:
 * nothing overshoots visibly, nothing bounces. `snap` is the only config with
 * any spring left in it, and it is reserved for the scroll-position caret,
 * which is the one element meant to read as a physical needle.
 */

/** Default reveal. Settles without overshoot. */
export const ease: SpringConfig = { tension: 190, friction: 30 };

/** Long, heavy elements: hero blocks, full-bleed panels. */
export const heavy: SpringConfig = { tension: 120, friction: 28 };

/** Hover and focus states. Fast enough to feel connected to the cursor. */
export const react: SpringConfig = { tension: 420, friction: 32 };

/** The needle. The one place a little residual spring is wanted. */
export const snap: SpringConfig = { tension: 260, friction: 26 };

/** Text reveal timings, in ms. Kept here so headings stay in step site-wide. */
export const textTiming = {
  lineStagger: 90,
  wordStagger: 26,
  lineDuration: 900,
  wordDuration: 620,
} as const;

/** Standard reveal offset, in px. Small: this is print, not a slide deck. */
export const revealShift = 18;
