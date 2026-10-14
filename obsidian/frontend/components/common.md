---
tags: [frontend, stable]
updated: 2026-08-10
---

# Catalog — Common Components

Files in `src/components/common/` — shared infrastructure that may depend on
providers. Conventions: [[component-conventions]].

---

## Portfolio UI kit — `src/components/ui/`

Added when the repo became John Wu's portfolio. These are the primitives every page
composes from; keeping them in one small set is what stops the site drifting into six
slightly different treatments of the same thing.

| Component | Props | Role |
|---|---|---|
| `Reveal` | `tag`, `className`, `delay`, `shift` (`up` / `left` / `none`), `id` | **The site's only reveal.** Wraps `<Inview>` with the house config, always `mode="once"`. Use it instead of `<Inview>` directly. |
| `MonoLabel` | `tone` (`quiet` / `loud` / `signal` / `data`), `as`, `className` | The instrument-panel voice. Every label, unit, index number and piece of metadata. |
| `Section` | `id`, `index`, `title`, `annotation`, `className` | A page section with its margin index and header rule. Emits `data-rail-section` so [[#ScrollRail]] picks it up. Keep the header's bottom padding tight: several sections open with content that carries its own top rule, so a generous `pb` puts ~70px of empty page between two full-width hairlines. The header is a caption on a rule, not a band. |
| `MetricReadout` | `metrics`, `layout` (`row` / `stack`) | Gauge-face numbers: value in the display serif, unit and label in mono. Values are pre-formatted strings. `row` **stacks below `sm`** and divides evenly over `metrics.length` (1–4) above it — the column count was unconditional, which at 390px gave each reading a ~110px cell while a `text-readout` numeral like "155,656" needs ~130px, so the readings drew over each other. The divider turns with the axis: top rule stacked, left rule side-by-side. Values carry `whitespace-nowrap` so a unit never breaks away from its numeral. Below three readings it also **stops spanning the page** (`max-w-xs` / `max-w-2xl`) — a full-width band holding one figure reads as a three-slot row with two slots missing rather than as one deliberate number. (For exactly one figure, `ProjectMetrics` also lifts it onto the heading rule.) **`unit` is a superscript unit symbol** (`Hz`, `%`, `cm`, `min`) — not a magnitude suffix and not a word. `32B` is a value; `{value:"7", unit:"GPU"}` renders `7ᴳᴾᵁ`. **The unit is `text-ink-3`, never the accent** — it was `text-safelight`, which made the loudest thing in a three-figure band the unit of whichever figure happened to have one. Anything rendering a `Metric` outside this component must match the superscript exactly (`label-mono ml-1 align-super text-ink-3`); the work index drifted from it once. |
| `AssetFrame` | `asset`, `ratio`, `marker`, `publicLabel`, `priority`, `sizes` | An image, or a print-layout "unplaced image" mark. **The drop-in path renders in development only**; visitors see `publicLabel`. Never ship a filesystem path to a visitor. |

## Site chrome — `src/components/site/`

| Component | Notes |
|---|---|
| `SiteHeader` | Client. Three links, no hamburger; every label survives 360px in mono, and a menu that hides three links is a control that exists to be a control. Hover and active states change instantly, since CSS transitions are banned and an instrument that snaps is honest anyway. **Nothing is marked current on the home page** — `/#work` and `/#contact` are in-page jumps, and marking both of them current for the whole of `/` is an indicator that never changes. **"Work" *is* marked on the five `/work/*` routes**, even though its href points at the index: those are real pages and the deepest reads on the site, and their nav was otherwise pixel-identical to the home page's. |
| `SiteFooter` | Server. The name and the contact links. **No colophon row** — it held the email and the location, and both were restatements: the home page ended on the address in 64px Fraunces, an "Email" link in this footer's own nav, and the address a third time in mono under a rule, with the location twice inside 750px. No newsletter, no social icon row, no back-to-top, no second Photography link (the header has one on every page). The positioning line is deliberately **not** repeated here — it is already the hero, the header tagline and the metadata description. Renders a Résumé link only when `profile.resume.available` is true. |
| `ScrollRail` | Client. **The signature interaction.** A fixed right-edge scale (xl+) that is a true miniature of the page: each tick sits at its section's real document fraction, so tick spacing shows how long a section is. The amber caret is the only spring on the site with visible residual motion. Ticks are buttons and they scroll. Sections opt in with `data-rail-section="Label"` + an `id`, so new sections join automatically. |
| `CompartmentDoor` | Server. The boundary between lab and darkroom, and the same component from either side — the home page's band into `/photography`, and the band back out at the foot of it. Renders in the **other** side's theme, so mid-page the lights go out or come back on. The bloom only exists in the darkroom. Copy for both directions lives in `data/photography.ts → doors`. |
| `ThemeSync` | Client, renders `null`. Keeps `data-theme` on `<html>` correct across client-side navigation. Exports `THEME_BOOTSTRAP`, the pre-paint script the root layout inlines, and `DARKROOM_ROUTES`, the one place a darkroom route is registered. [[decisions-log]] ADR-0016. |

## Case-study scaffolding — `src/components/project/`

What the five `/work/*` pages are built from. Every page composes these in its own
order; nothing here decides layout, which is why five tailored pages still read as one
document. See [[decisions-log]] ADR-0019.

| Component | Notes |
|---|---|
| `ProjectMasthead` | Client (the only one). Running head, title as a clipped line-slide `TextEngine`, flat facts left, lede right. **`headline` puts the page's single strongest result on the first screen**, under the standfirst — pass it *only* when the figure is an outcome, never a volume count (`tackle-vision` passes nothing). The full band still lives at the end of the page; one figure up top and three at the bottom is the split that gives a reader evidence without making the fold a dashboard. `TextEngine` emits its own visually hidden copy, so `tag="h1"` here is a real `h1`. The running head shows the **discipline only** — the project ordinal used to lead it, which put a bare `02` above body sections numbered `02.1`, `02.2`, `02.3`. The metadata `dl` carries no `border-t`: on phones it stacks straight under the title's own rule, and its top border drew a second full-width hairline 32px below the first with nothing between them. |
| `SpecSheet` | The datasheet block, numbered **01** so the page's sequence resolves — prose is `02.x` and the stats band is `03`, and without an index here the first number a reader met was `02.1`. `layout="column"` for a narrow sidebar, `"band"` for a wide strip. **All five pages use `"band"`** ([[decisions-log]] ADR-0025); `"column"` is supported and unused. The band's column count follows its row count — hard-coded six columns left the right 45% blank on a three-spec page, reading as a six-slot datasheet with three slots missing. Labels sit over values, not beside them. No row count in the header rule: it annotated the block with the one number a reader can get by looking at it. |
| `CaseStudyBody` | Renders `data/case-studies.ts` verbatim. `layout="margin"` hangs headings in the left column, `"stacked"` fits inside one. **All five pages use `"margin"`** (ADR-0025). `offset` keeps numbering continuous when a page splits its prose around a figure. `group` is the *page section* index, not the project ordinal — body sections are always `02.x` because the masthead is 01 and the metrics are 03. |
| `FigurePlate` | The mount a **drawing** sits in: paper, registration marks, corner note, caption. `bleed` runs it to the viewport edge and keeps the caption in the gutter. Sets the accent as `color`, so the SVG inside draws with `currentColor`. **Below `sm` the drawing holds a 34rem minimum and the plate scrolls to it** — these figures carry 11px annotations in a ~1000-unit viewBox, so fitting one to a 390px phone renders its labels at roughly 4px while the HTML chrome around it stays full size. The scroll region needs its affordance or it reads as a broken figure: `.scroll-fade` softens the cut edge and a "Scroll →" label names it, both `sm`-and-below only. The corner `note` is **hidden below `sm`** — it occupies the same top-right corner these drawings use for their own annotation, and on a phone the two stacked ~30px apart in the same rust mono with the lower one cut mid-word. |
| `ComparePlate` | The mount **photographic evidence** sits in — two captures of one system before and after a single change, each with its own state label and measurement. No ruled substrate (there is already a photograph there) and no default corner note: the plate's note and the second pane's readout occupy the same corner and collide, so leave `note` unset unless the panes are unlabelled. Pane headers **stack below `lg`** so both panes are always the same height: side by side at 768px the left pane's longer strings wrapped to two lines while the right pane's fitted on one, pushing the two frames ~17px out of vertical alignment — and in a before/after the shared top and bottom edges are the entire point. Both `state` and `readout` carry `whitespace-nowrap` and the pair wraps as a unit — "Stock CAD · 0.620 m" was breaking to leave a lone "m", and a measurement that splits between numeral and unit stops being one. |
| `FigureThumb` | A project's drawing, small, for the work index. Reads its component from `figure-registry.ts`, reserves its box from the registry's `ratio` so the row cannot reflow, and is `aria-hidden` — the full drawing carries the description on the case-study page. Rendered **full width in every index row** (1248 / 711 / 334 at desktop / tablet / mobile). It was a 4-of-12 column on rows 02–05, which is 395px at desktop — narrower than the same drawing gets on a 768px tablet, so the widest viewport showed the work worst. Do not cap it below the content width: an intermediate `max-w` adds a right edge that nothing else on the page shares. **Does not get `FigurePlate`'s mobile scroll treatment**, though its annotations land at ~4px on a phone: it sits inside the row's navigation `<Link>`, and a scroll region inside a link makes a touch drag ambiguous between scrolling and navigating. The plates can scroll because nothing wraps them. To change the trade, lift the figure out of the link or drop it below `sm`. |
| `figure-registry.ts` | Slug → `{ Figure, accent, ratio }`. The single place a project's drawing and accent are declared. The case-study pages read their `ACCENT` from here; previously each page held its own `const ACCENT` and the index would have been a sixth copy. Throws on an unknown slug, like `loadCaseStudy`. **`ratio` must track the figure's `viewBox`** — and the `viewBox` should be tight to the ink. Two figures shipped a 1000-unit box whose drawing stopped 133 and 70 units short of the right edge, so in the index they sat visibly left of centre in their plates while the balanced figures below them did not. Measure with `inkbox.mjs` (`getBBox()` against `viewBox`) rather than by eye. |
| `ProjectMetrics` | The numbers, deliberately at the end. A case study that opens with three big figures is asking to be skimmed. No "verified figures only" note on the rule any more — it read as a disclaimer and drew attention to a doubt the reader had not had. **`label` defaults to "Measured", which is a promise that the figures under it are outcomes**; a page whose numbers describe the size of the work rather than its result passes `label="Scope"` (currently `tackle-vision`). **One construction whatever the figure count** — heading on its own row, readout under it. A single figure was special-cased twice (onto the heading rule, then off the right edge and back); each attempt made `tackle-vision` and `vla-benchmarking` read as two different components in the same slot, which is worse than the emptiness it solved. `MetricReadout` already stops a lone value from stretching (`max-w-xs`), and a section with one number looking like one number is the point of labelling it "Scope". Order each project's `metrics` outcome-first — a band that opens with a volume count tells a research reader only that the author was busy. |
| `ProjectNav` | Previous / next, wrapping around the index so neither slot is ever a disabled arrow. Runs full bleed but pads to `px-gutter` / `lg:px-page`, so its titles land on the same margin as the rest of the document — a flat `p-6 lg:p-10` put them at x=40 against the page's x=80. `border-t` only: the footer opens with its own top rule a section-gap below, and a bottom border here drew a second rule with nothing between the two. |
| `ProjectSchema` | Per-page `CreativeWork` JSON-LD pointing at the root `Person` node. |
| `accent.ts` | `safelight` or `cyanotype` per page, written out as full class names because Tailwind cannot build one at runtime. |

### Figures — `src/components/project/figures/`

One per case study, inline SVG, server-rendered, no chart library and no client JS.
`trace.ts` samples closed-form curves so server and client draw the same line.
Any plate whose curves are generated rather than recorded is marked `Schematic` in its
corner. [[decisions-log]] ADR-0018.

`EvaluationMatrix` · `ImpactKinematics` · `BootSequence` · `SingleCameraEstimate` ·
`DivergenceAlert`

> [!important] A figure now appears in two places
> Each drawing renders full-size inside its case study **and** small in the home
> work index, via `FigureThumb`. They are the same component, so they cannot drift.
> Register a new figure in `figure-registry.ts` — with its `viewBox` aspect ratio —
> or the index will throw at build time rather than render a hole.
>
> "One figure per case study" is no longer strictly true either: `vla-benchmarking`
> carries a second plate, a `ComparePlate` of real captures. The rule that still
> holds is that a **drawing** depicts a mechanism and a **capture** shows it worked;
> they get different mounts because they make different claims.

> [!warning] `Tags` has no `dl`
> `Reveal tag="dl"` fails type-check. Wrap a real `<dl>` inside a `Reveal` div instead.

## Motion vocabulary — `src/lib/motion.ts`

Four spring configs, and nothing else on the site may invent a fifth:

| Config | Use |
|---|---|
| `ease` | default reveal |
| `heavy` | hero blocks, full-bleed panels, the portrait develop curtain |
| `react` | hover and focus |
| `snap` | the scroll-rail caret, the only place residual spring is wanted |

Plus `textTiming` (line/word stagger and duration) so every `TextEngine` heading stays
in step, and `revealShift` (18px), deliberately small because this is print rather than
a slide deck.

> [!warning] The cookie module was deleted
> `<LazyCookie />` came out of the root layout in June ([[decisions-log]] ADR-0014): the
> portfolio sets no cookies and runs no analytics. The `Cookie/` tree stayed behind
> unreferenced until the 2026-08-10 review pass deleted it — seven files, zero imports.
> If another project built from this template needs consent, take it from the upstream
> starter rather than from this repo. Its documentation lived here and was removed with
> it, so nothing in the vault now describes a component that does not exist.

## Grid — adaptive scaling (`grid/`)

The **adaptive scaling grid** keeps a rem-based layout proportional across every
viewport by scaling the root (`<html>`) font-size. Design in `rem` once, and the
whole UI scales as one unit. Lives in `src/components/common/grid/`.

| File | Role |
|------|------|
| `grid.config.ts` | Breakpoints + `FONT_BASE` — the single source of truth for the grid |
| `adaptive-grid.tsx` | `<AdaptiveGrid>` client component — drives the scale-up, renders `null` |
| `index.ts` | Barrel exports — `AdaptiveGrid`, `GRID_BREAKPOINTS`, … |

**How it works** — only the scale-up half survives:

- **Scale up** (viewport > 1920px) — the `<AdaptiveGrid>` component sets an
  inline `html` font-size at runtime via [[hooks|`useAdaptiveGrid`]], so the
  design keeps growing (damped by `coef`) on large displays.
- **Scale down** — **removed.** Below 1920px the root font-size is a fixed 16px
  and `useAdaptiveGrid` simply clears its inline value.

> [!warning] Do not reintroduce the `vw` media queries
> Scale-down used to be `vw`-based `html { font-size }` queries in `globals.css`,
> one per breakpoint in `grid.config.ts`, which the two files had to keep in sync.
> They only hit 16px *at* each breakpoint; between them they shrank the entire
> site — body text to 12.8px and mono labels to 8.8px at a 1150px viewport — and
> they overrode the reader's browser font-size setting (WCAG 1.4.4). Fluidity now
> lives in `clamp()` on each type step and spacing token. [[decisions-log]] ADR-0022.
>
> Consequence: the sub-1920 entries in `GRID_BREAKPOINTS` are inert. They are kept
> only because `GRID_BASE_WIDTH` is derived from the set.

**Mounting** — the root layout renders `<AdaptiveGrid />` inside `ScrollLayout`:
```tsx
import { AdaptiveGrid } from "@/components/common/grid";
```
Mount it once. Props: `baseWidth` (defaults to the largest breakpoint) and
`coef` (0–1 scale-up damping, default `0.6666`).

> [!note]
> This replaced a `styled-components`-based scaling system that was dropped into
> `common/` — see [[decisions-log]] ADR-0008 (whose scale-down half is now
> superseded by ADR-0022). `styled-components` is **not** a project dependency.

## ReducedMotion — `reduced-motion.tsx`

`<ReducedMotion>` — a client leaf that calls react-spring's `useReducedMotion()`.
It watches the `prefers-reduced-motion` media query and toggles react-spring's
global `skipAnimation`, so every spring — and `spring-text-engine` — jumps to its
end state instead of animating. Renders `null`; mounted once in the root layout.
See [[animation-system]] and [[seo-metadata]].

## Skeleton loaders

Three skeleton components for `loading` states of async-data components — every
async component must mirror its final layout with one of these
(see [[component-conventions]]).

| Component | File | For |
|-----------|------|-----|
| `<SkeletonImage>` | `skeleton-image.tsx` | image placeholders |
| `<SkeletonLoader>` | `skeleton-loader.tsx` | generic block placeholders |
| `<SkeletonVideo>` | `skeleton-video.tsx` | video placeholders |

> [!note]
> `components/ui/` (design-system primitives) does not exist yet — create it when
> the first primitive is added. See [[folder-structure]].

## Related

[[component-conventions]] · [[components/animation-springs]]
