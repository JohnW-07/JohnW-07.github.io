---
tags: [frontend, stable]
updated: 2026-05-21
---

# Catalog — Utilities

Pure helper functions in `src/utils/` (no side effects, unless noted).

## `is-bot.ts`

`isBot(): Promise<boolean>` — **server-only**. Reads the `user-agent` header,
returns `true` for crawlers/audit tools. Used to skip heavy animation for bots.
See [[seo-metadata]].

## `scroll-to.ts`

`scrollTo(id?, immediate?)` — programmatic scroll to an element id (string) or a
numeric position. Integrates with the Lenis [[smooth-scroll|scroll store]];
temporarily disables scroll state during the animation. Has `//if lenis` guards so
the Lenis dependency can be stripped if smooth scroll is removed.

## `math.ts`

| Function | Purpose |
|----------|---------|
| `transformRange(value, min, max, newMin, newMax)` | remap a value between ranges (clamped) |
| `lerp(start, end, t)` | linear interpolation |
| `debounce(...)` | debounce helper (used by `useWindowSize`) |

## `lvh.ts`

CSS-string builders for viewport-height units with fallbacks
(`vh` → `lvh` → `calc(var(--vh) …)`): `heightLvh`, `minHeightLvh`, `marginTopLvh`,
`marginBottomLvh`. Solves mobile-browser viewport-height inconsistencies.

## `animation/coords.ts`

Element-coordinate helpers — `getElementCoords`, `getScrollCoordsFromElement` —
used internally by the scroll/animation system. Marked `@ts-nocheck`. `#do-not-modify`

## `seo/generate-page-metadata.ts`

`generateMetadata(props?)` — shared page-`Metadata` builder. `generateViewport()`
— the `Viewport` export (carries `themeColor`). See [[seo-metadata]].

## `seo/structured-data.ts`

`getSiteStructuredData()` — builds the `Organization` + `WebSite` JSON-LD graph
rendered by the root layout. See [[seo-metadata]].

## `echoed-year.ts`

`withoutEchoedYear(text, context)` — returns `text` with any four-digit year that
`context` already states removed, along with the punctuation and whitespace it
leaves behind. Returns `text` untouched when nothing overlaps.

Used wherever an org sits beside a period: the work index rows and the "Also" cards.
`"Bitcamp 2026"` beside `"Apr 2026"` becomes `"Bitcamp"`; `"Stanford University,
NeuroAI Lab"` beside `"May – Aug 2026"` is unchanged.

> [!warning] Direction matters — do not point this at an award's detail line
> Awards use `creditLine()` in `views/home/toolkit.tsx`, which suppresses the
> **appended** year instead. Running `withoutEchoedYear` on the detail would turn
> "Fall 2025 and Spring 2026" into "Fall 2025 and Spring". The rule is *drop the
> redundant copy*, and which copy is redundant depends on which one carries meaning.

`compactPeriod(period)` — states a shared year once: `"May 2026 – Aug 2026"` becomes
`"May – Aug 2026"`. Spans crossing a year boundary keep both, because there the second
year is information rather than repetition. Used by the Positions list, whose data
writes the long form while the project data writes the short one.

> [!note] Why this is a util and not four edits
> The same defect was fixed three times by editing individual data entries, and came
> back each time somewhere the previous edit had not covered. Per-entry editing cannot
> see a pattern. **A year already present in the neighbouring string is not a fact, it
> is an echo** — and that is something the render can decide on its own.

## Adding a util

Keep utilities **pure** and side-effect-free (server-only ones like `isBot` are the
exception — note it clearly). Group by domain under `utils/<domain>/`.

## Related

[[hooks]] · [[seo-metadata]] · [[smooth-scroll]]
