import type { Zone } from "./page-id";

type Theme = 0 | 1;

/**
 * Theme target queue (M:327–335, 469, 520): a running wipe always finishes;
 * clicks mid-wipe flip `want`, and one follow-up pass runs if it differs from
 * where the wipe landed. Each zone remembers its own theme.
 */
export const createThemeQueue = (initial: Record<Zone, Theme>) => {
  const zones = { ...initial };
  let zone: Zone = "site", to: Theme = zones.site, running = false;

  const start = () => {
    if (running || zones[zone] === to) return false;
    to = zones[zone];
    running = true;
    return true;
  };

  return {
    get want() { return zones[zone]; },
    /** Theme the current (or last) wipe lands on. */
    get to() { return to; },
    /** True: start a wipe now. */
    toggle() {
      zones[zone] = zones[zone] ? 0 : 1;
      return start();
    },
    /** True: run a follow-up pass to `want`. */
    onWipeEnd() {
      running = false;
      return start();
    },
    /** Switch zone; returns its target theme (the page wave carries it when idle). */
    enter(next: Zone): Theme {
      zone = next;
      start();
      return zones[zone];
    },
  };
};
