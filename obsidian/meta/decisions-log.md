---
tags: [meta, decision]
updated: 2026-10-14
---

# Decisions Log (ADRs)

Architecture Decision Records. Each entry captures a choice, its context, and its
consequences. Use [[templates/adr-note]] for new entries. Newest first.

---

## ADR-0028 — Static export, hosted on GitHub Pages

- **Status:** Accepted, 2026-10-14.
- **Context:** The site is to live at `https://johnw-07.github.io` (repo
  `JohnW-07/JohnW-07.github.io`). GitHub Pages serves static files only — no Node
  server, no image optimiser, no Route Handlers. An audit found nothing that needs a
  server: no `app/api/**` routes, `api-client.ts` unused, `utils/is-bot.ts` (the only
  `headers()` call) unreferenced, and all 10 routes already prerender as `○ Static`.
- **Decision:** `next.config.ts` sets `output: "export"` (build emits `out/`) and
  `images.unoptimized: true` (assets are pre-encoded WebP, served as-is). `robots.ts`
  and `sitemap.ts` declare `dynamic = "force-static"`. `.github/workflows/deploy.yml`
  builds on every push to `main` with `NEXT_PUBLIC_SITE_URL=https://johnw-07.github.io`
  and publishes `out/` via `actions/deploy-pages` (repo Pages source = GitHub Actions).
  User-site repo → served at the domain root, so no `basePath`.
- **Consequences:** Anything that needs a request at runtime is now a **build
  failure**: `app/api/**` Route Handlers (the [[api-architecture]] pattern), `headers()`
  / `cookies()`, un-prerendered dynamic routes (add `generateStaticParams`), middleware/
  proxy, and `next/image` resizing. A contact form or any secret-bearing call needs a
  different host (Vercel) or an external service — revisit this ADR before adding one.
  The site URL is hardcoded lowercase in the workflow; change it there if a custom domain
  is added (plus `public/CNAME`).

---

## ADR-0027 — Five index rows, one structure, figures at full content width

- **Status:** Accepted, 2026-08-10. The index counterpart to ADR-0025.
- **Context:** The work index ran two row constructions: a lead row with a full-width
  figure, and rows 02–05 with the figure in a 4-of-12 column beside the text. That column
  is **395px on a 1440 desktop**, and these drawings carry ~11px annotations in a
  ~1000-unit viewBox, so at 395px their labels land near 5px and stop resolving. The same
  SVG renders at 711px on a 768px tablet, fully legible — the widest viewport was giving
  the work its worst presentation. Two separate reviews also reported that the change of
  structure between row 01 and row 02 made a reader relearn where the number and the
  chips lived.
- **Decision:** One structure for all five rows — full-width figure, a 12-column content
  row (meta / title / summary / right-aligned metric), then a utility band with chips
  left and the call to action right under a single rule. `isLead` changes **scale only**:
  title size, metric size, chip count. Figures render at the full content width at every
  breakpoint (1248 / 711 / 334).
- **Consequences and the trap:** this makes the index longer, and the obvious way to
  shorten it is to cap the subordinate figures. That was tried at `max-w-[58rem]` and
  **reverted** — it reads better in isolation and worse on the page, because the figure
  then ends at x=928 while the title, summary, metric and every rule run to 1360, adding
  a fifth right edge to a layout whose entire claim is that things line up. If the index
  must get shorter, cut rows or crop the drawings; do not introduce an intermediate
  figure width.

---

## ADR-0026 — One outcome on the fold, the full band at the end, and only outcomes

- **Status:** Accepted, 2026-08-10. Partially supersedes the "numbers deliberately at the
  end" rationale in `ProjectMetrics`.
- **Context:** The figures band was placed at the foot of every case study on the
  reasoning that a page opening with three big numbers is asking to be skimmed. That
  reasoning still holds, but it had a cost nobody had measured: on `vla-benchmarking`
  the first viewport carried eight metadata fields and six tech chips and no evidence at
  all, and the one number that decides whether a research reader keeps scrolling —
  rig IoU 0.564 → 0.658 — first appeared at 85% page depth, about two and a half screens
  down. Two independent judges reached the same conclusion from different directions:
  a hiring manager finishes the case study without learning whether the system worked.
- **Decision:** Split them. `ProjectMasthead` takes an optional `headline` metric shown
  under the standfirst; the full `MetricReadout` band stays at the end of the page.
  **`headline` is passed only when the figure is an outcome.** A volume count, a sample
  rate, a team size or a training-set size must not appear there.
- **Consequences:** `tackle-vision` passes no `headline`, because the only figure it can
  substantiate is the size of its fine-tuning set — the same reason its band is labelled
  *Scope* rather than *Measured*. A page with nothing to put on its fold is telling the
  truth about itself, and the fix is a verified number, not a different layout. The
  ordering rule in `projects.ts` follows from this: `metrics[0]` is the outcome, because
  it is what both the masthead and the work index render.

---

## ADR-0025 — Five case studies, one template

- **Status:** Accepted, 2026-08-10.
- **Context:** `vla-benchmarking` was built with a different skeleton from the other
  four: `SpecSheet layout="column"` as a sticky left rail, with `CaseStudyBody
  layout="stacked"` beside it. The reasoning at the time was that the page should spend
  its width on the evaluation figure. In practice the rail held four spec rows and a
  stack list, ran out about a third of the way down, and left the left 36% of the page
  empty for roughly 1,500px while the prose ran as a 645px ribbon pinned right of
  centre with dead margin on both sides. An independent design judge found it without
  being told to look, and paired it with the observation that the five pages were not
  one document.
- **Decision:** One skeleton for all five. Masthead, spec band, the problem, the
  figure, the rest of the prose with headings hanging in the margin. `SpecSheet
  layout="column"` and `CaseStudyBody layout="stacked"` still exist and are still
  supported, but nothing uses them.
- **Consequences:** A page arguing that a lab should measure its policies the same way
  every time is no longer laid out two different ways. The figure moves below the
  problem statement, which is where a reader has just been told what is being compared.
  If a future page genuinely needs the column layout, the prop is there — but it should
  be a decision with a reason, and the reason cannot be "this page has a big figure",
  because all five do.

---

## ADR-0024 — Figures are registered, and a drawing is not a capture

- **Status:** Accepted
- **Date:** 2026-08-10
- **Amends:** the "one bespoke figure per case study" convention in
  [[decisions-log]] ADR-0018

**Context.** Two problems met in the same place.

The home work index was five rows of prose at a single grey value — no image,
no diagram, nothing to navigate by. Meanwhile every project already owned a
hand-drawn SVG that explained its mechanism, and each one was reachable only by
opening the case study it lived in. The page whose entire purpose is to make a
visitor open a case study was the one page carrying no evidence.

Separately, the accent colour for each project existed as a local
`const ACCENT` inside each of the five case-study pages. Showing the figures in
the index needed a sixth copy of that mapping.

**Decision.**

1. **`figure-registry.ts` is the single source** for slug → `{ Figure, accent,
   ratio }`. Case-study pages read their `ACCENT` from it instead of declaring
   one. It throws on an unregistered slug, matching `loadCaseStudy`.
2. **`FigureThumb`** renders the registered component small in the index. The
   drawing is scaled, not redrawn as a simplified mark — at thumbnail size its
   mono annotations become texture, which is the intent: the thumbnail asks to
   be recognised as a diagram, not read. Same component both places, so the
   index and the case study cannot disagree. `aria-hidden`, because the full
   drawing carries the description where it can be read.
3. **A drawing and a capture get different mounts.** `FigurePlate` mounts a
   hand-drawn schematic of a mechanism. The new **`ComparePlate`** mounts
   photographic evidence that the mechanism worked: two captures at identical
   dimensions, each with a state label and a measurement. No ruled substrate,
   because there is already a photograph there; and a before/after with no
   numbers under it is an assertion, not a result.

**Consequences.** ADR-0018's "exactly one figure per case study" no longer
holds — `vla-benchmarking` carries a drawn Fig. 01 and a captured Fig. 02. The
distinction that replaces it is about the *claim*: a drawing says "this is how
it works", a capture says "it worked". A new figure must be registered with its
`viewBox` ratio or the index throws at build time rather than rendering a hole.
`ComparePlate`'s optional corner `note` collides with the second pane's readout,
so it stays unset unless the panes are unlabelled.

---

## ADR-0023 — Fraunces replaces Instrument Serif as the display face

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** The display face read as compressed at every size. Two causes
compounded. Instrument Serif is a single narrow, high-contrast cut with no
optical-size axis, so a 144px headline used the same letterforms as a 30px one,
merely scaled. On top of that `globals.css` applied `letter-spacing: -0.022em` to
every `.font-display` element and `text-display-xl` added a further `-0.03em`, so
the largest type on the site was tracked in twice on a face that had no room to
give. The convention that display type wants negative tracking comes from sans
faces; serifs need *more* room than a sans at the same size, not less.

**Decision.** Swap to **Fraunces** (variable, `next/font/google`), loading the
`opsz`, `SOFT` and `WONK` axes.

- `opsz` is set per type step in `globals.css` to that step's pixel size, so the
  face is genuinely recut per size rather than scaled.
- `SOFT` is pinned to 20 — enough to take the mechanical edge off the terminals.
- `WONK` is pinned to **0**. Fraunces' eccentric alternates are the reason the
  face has a reputation for being quirky; switched off, it keeps the instrument
  register the rest of the site is written in.
- All blanket negative tracking on `.font-display` is deleted. Spacing is the
  `opsz` axis's job now.

**Consequences.** Three families are loaded (Fraunces, Instrument Sans, IBM Plex
Mono), which sits at the edge of the two-family performance guidance; justified
because mono carries a real semantic role here (see [[design-system]]) rather
than being decorative. Any new display type step must set `opsz` to its own size
or it inherits the wrong optical cut — the `@utility` blocks are the single place
this is declared. Italic is loaded; `Instrument_Serif`'s separate italic file is
no longer needed.

---

## ADR-0022 — The root font-size is fixed; fluidity moves to `clamp()`

- **Status:** Accepted
- **Date:** 2026-08-10
- **Supersedes:** the *scale-down* half of [[decisions-log]] ADR-0008

**Context.** ADR-0008 scaled the root font-size with `vw` media queries, one step
per grid breakpoint, so a rem-based layout would stay proportional. The formula
(`16 * 100 / baseWidth`) only yields the intended size at exactly the breakpoint
width. At every width *between* breakpoints it scaled the entire site down.
Measured on the shipped build:

| Viewport | Body | Mono labels |
|---|---|---|
| 1440px (design width) | 16.0px | 11.0px |
| 1280px | 14.2px | 9.8px |
| 1150px | 12.8px | 8.8px |
| 1600px | 13.3px | 9.2px |

Ordinary laptop widths rendered the site 11–20% smaller than designed, with mono
labels at ~9px. This was the dominant cause of the site reading as "too much
small text", and it was invisible to per-component tuning because the root kept
moving underneath. A `vw` root font-size additionally ignores the reader's
browser font-size preference, failing WCAG 1.4.4 (Resize Text).

**Decision.** `html { font-size: 16px }`, full stop. The four `vw` media queries
are deleted. Fluidity is declared per type step and per spacing token as
`clamp(min, preferred, max)`, interpolating between the 360px and 1440px design
widths and pinning outside them.

**Consequences.** Type scales continuously rather than in breakpoint jumps, and
has a floor it cannot fall below. Browser font-size settings are honoured again.
`grid.config.ts` no longer needs to be kept in sync with `globals.css` media
queries for the scale-down range — that duplication, called out as deliberate in
ADR-0008, is gone. The **scale-up** half of ADR-0008 is untouched: above 1920px
`<AdaptiveGrid>` still sets an inline root size, and its `else` branch (which
clears the inline value) now lands on a fixed 16px instead of a `vw` query.

---

## ADR-0021 — `--ink-3` is pinned to WCAG AA, and the aesthetic bends around it

**Status:** accepted · 2026-08-10

**Context.** `--ink-3` is the mono-label colour: every eyebrow, unit, index number,
caption, spec label and section annotation on the site. The original values were chosen
by eye to sit *behind* the prose — a faint pencil annotation on a datasheet. Measured,
they were 3.59:1 in the lab and 3.67:1 in the darkroom against `--paper`. WCAG AA wants
4.5:1 for text that small, so the single most repeated piece of text on the site failed
in both compartments.

**Decision.** Set `--ink-3` from contrast first and let the look follow: `#625e54` in
the lab and `#898374` in the darkroom, each clearing 4.5:1 against `paper`, `paper-2`
and `paper-3`. The labels are now a step darker than intended and still read as
subordinate, because the hierarchy was never carried by the colour alone — it is carried
by size, uppercase, and letter-spacing.

**Consequences.**

- Any new token that will hold small text gets measured before it ships, not after.
  `--ink-2` (6.89 / 7.63) and `--safelight` (4.59 on `paper`) were checked and pass.
- `--safelight` is 4.12:1 over `--paper-2`, which would fail. That combination does not
  occur in the markup today; if a `signal`-tone label is ever placed on a raised lab
  panel, the accent needs darkening to about `#b24316` first.
- "Looks subtle enough" is not evidence. The numbers above were computed, and the
  computation belongs in the note so the next person does not re-litigate the palette.

---

## ADR-0020 — The photography compartment ships as an unexposed contact sheet

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** John's fact bank records exactly one thing about his photography: that he
shoots, and that it is where his eye for design came from. No genre, no camera, no
images, no links. `/photography` still has to exist, because the compartment split is
the design and the home page has a door pointing at it.

**Decision.** The page is a contact sheet with all twelve frames unexposed. No stock
photographs, no invented captions, no artist statement, and no "selected works"
carousel — writing any of those would mean inventing a body of work. The masthead
states only what is knowable: sheet code, frame count, printed count. Loading real work
is a data edit, not a code change: swap a frame's `asset` to `{ kind: "image", … }` in
`data/photography.ts` and fill its `caption` / `exif`.

**Consequences.** The page is honest and it is short. An empty frame is a real state on
a real contact sheet, so twelve of them reads as intentional rather than unfinished —
which is only true because the frames are printed small, in strips, with edge numbers.
A grid of twelve large grey boxes would have read as a broken gallery. `/photography`
also carries no JSON-LD: an `ImageGallery` with zero images is worse than none. Add it
with the first real frame.

---

## ADR-0019 — Case-study routes get per-slug files, not one `[slug]` route

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** John asked for "specific project pages with tailored designs". A single
`app/work/[slug]/page.tsx` reading from `data/case-studies.ts` would render five pages
from one template, which is the opposite of tailored, and any real per-project layout
would then arrive as a `switch` on the slug inside a shared view.

**Decision.** One route and one view per project: `app/work/<slug>/page.tsx` →
`views/work/<slug>.tsx`. Each view composes the same scaffolding from
`components/project/` in its own order, and owns its figure. The pages differ in
composition, in accent, and in where the figure sits; they share the masthead, spec
sheet, prose renderer, metrics band and prev/next nav, which is what keeps five
bespoke pages reading as one document.

**Consequences.** Adding a project means adding a route, a view and a figure, plus a
row in `data/projects.ts` and `data/case-studies.ts`. That is deliberate friction: the
site has five case studies, not fifty. The sitemap derives its entries from
`projects.filter(hasPage)`, so it does not need touching. Routes still import only
from `views/`, via `views/work/metadata.ts`.

---

## ADR-0018 — Figures are hand-authored SVG, with no chart library

- **Status:** Accepted — the "hand-authored SVG, no chart library" rule stands.
  Amended by [[decisions-log]] ADR-0024: figures are now registered centrally and
  also render as index thumbnails, and "exactly one figure per case study" is
  replaced by a distinction between a **drawing** (a mechanism) and a **capture**
  (evidence it worked), which get different mounts.
- **Date:** 2026-08-10

**Context.** Every case study needs one drawing. A charting library would give axes and
tooltips, add a dependency and a client bundle, and produce the same drawing shape on
every page. None of these figures is a series being plotted; each depicts a specific
mechanism (a coverage matrix, a lifted pose against three kinematic traces, a boot
timeline, a camera frustum with a tolerance volume, a signal chain with the model
outside it).

**Decision.** Each figure is an inline SVG component in
`src/components/project/figures/`, rendered on the server with no client JavaScript.
Colour comes from `currentColor`, so a figure inherits the accent from the
`FigurePlate` it sits in and recolors itself in either theme. Neutral geometry is a
`<g>` carrying a token text class. Curves come from sampling a closed-form function in
`figures/trace.ts` rather than from data.

**Consequences.** No dependency, no bundle cost, no hydration. Because the traces are
generated rather than recorded, any plate that draws one is marked `Schematic` in its
corner. Nothing in these drawings is presented as a measurement: the numbers that are
real (±5 cm, 20 s → under 5 s, 60 Hz) come from the fact bank and are dimensioned;
everything else is shape only. Text that crosses geometry uses a `paint-order` halo in
the plate colour, which is how a drafting program breaks a line around dimension text.

---

## ADR-0017 — `next/font` variables belong on `<html>`, not `<body>`

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** The starter put the `next/font` variable classes on `<body>`. When the
portfolio started composing them into design tokens on `:root`
(`--font-display-family: var(--font-instrument-serif), …`), every face on the site
silently rendered as a system fallback. No console error, no build error.

**Cause.** A custom property's value is substituted **where it is declared**. A token
declared on `:root` resolves `var(--font-instrument-serif)` against `:root`, where the
variable does not exist because it was defined on a descendant.

**Decision.** `next/font` variable classNames go on `<html>` in `src/app/layout.tsx`.
Any token that composes a font variable must be declared at or below the element that
defines the variable.

**Consequences.** Fonts resolve. The failure mode is invisible, so the reason is
commented at the call site as well as recorded here. See [[design-system]].

---

## ADR-0016 — Theme compartments via `data-theme` and a pre-paint bootstrap script

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** The portfolio has two visual compartments: a light "lab" for the
professional work and a dark "darkroom" for photography. The palette inverts entirely
between them. The root layout is shared, so a nested layout cannot set the theme
server-side, and waiting for hydration flashes a white page on the way into the
darkroom — exactly the moment the design is making its point.

**Decision.** Semantic tokens (`--paper`, `--ink`, `--line`, …) are redefined under
`[data-theme="darkroom"]`. A small blocking script in `<body>` stamps the attribute on
`<html>` from `location.pathname` before first paint, and a client `ThemeSync`
component keeps it correct across client-side navigation. `<html>` carries
`suppressHydrationWarning` because the script mutates it before React hydrates.

Sections can also opt a *band* into the darkroom by carrying `data-theme="darkroom"`
locally, which is how the photography door on the home page works.

**Consequences.** Utilities are compartment-agnostic: `bg-paper text-ink` is correct in
both. Adding a darkroom route means adding it to `DARKROOM_ROUTES` in
`src/components/site/theme-sync.tsx` and nowhere else.

---

## ADR-0015 — Custom type-scale utilities use `@utility`, not `@layer utilities`

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** The type scale was first written as plain classes inside
`@layer utilities`. Tailwind v4 does not generate responsive variants for those, so
`lg:text-display` produced nothing.

**Decision.** Every custom utility (`text-display-xl`, `text-display`,
`text-display-sm`, `text-readout`, `text-lede`, `text-body`, `text-fine`,
`label-mono`, `rule-t/b/l`) is declared with Tailwind v4's `@utility` directive. Each
step carries its phone size plus a nested `@media (min-width: 1024px)` block, so one
type step lives in one place.

**Consequences.** Variants work. `@layer components` is still the right home for
pseudo-element work such as the grain plate and the safelight bloom.

---

## ADR-0014 — Cookie banner removed from the portfolio layout

- **Status:** Accepted
- **Date:** 2026-08-10

**Context.** The starter mounts `<LazyCookie />` in the root layout. This site sets no
cookies and runs no analytics.

**Decision.** Removed from `src/app/layout.tsx`. The `Cookie/` component tree stays in
the repo for other projects built from this template.

**Consequences.** One fewer control that exists only to be a control. If analytics are
ever added, remount it. See [[components/common]].

---

## ADR-0013 — `<Inview>` self-observe fix; spring components honour resize

- **Status:** Accepted
- **Date:** 2026-06-07

**Context.** `<Inview>` only animated when an external `trigger` ref was passed.
Without one it never revealed. Root cause: `useDynamicInView` returns its target
attachment as a **callback ref** (`setNode`) in the first tuple slot, but
`in-view.tsx` destructured it as `inViewRef` and wrote `inViewRef.current = node`
in the JSX `ref` callback — assigning `.current` to a function instead of calling
it. `setNode` never ran, the observed `node` stayed `null`, and with no `trigger`
the observer had nothing to watch (`trigger?.current ?? node` → `null`). With a
`trigger` it worked only because `trigger.current` bypassed the dead `node` path.
TypeScript flagged this at build time (`Property 'current' does not exist on type
'TargetRefCallback'`), so the build was already failing.

Separately, `<Inview>`, `<Spring>`, and `<Hover>` tracked `width`
(`useWindowWidth()`) as a `useMemo`/`useEffect` dependency to re-evaluate mobile
gating on resize, but never passed it to `isMobileDisabled()` — so the value was
genuinely unused (ESLint `react-hooks/exhaustive-deps` warning) **and** resize
re-evaluation silently did nothing; the check always read `window.innerWidth` at
call time.

**Decision.** This is the second authorized edit to the `#do-not-modify` engine
(after ADR-0009). Two corrections:
1. In `in-view.tsx`, call the callback ref — `setInViewNode(node)` — instead of
   assigning `.current`, so the component observes itself when no `trigger` is
   given.
2. Pass the React-tracked `width` into every `isMobileDisabled(value, width)`
   call across `in-view.tsx`, `spring.tsx`, and `hover.tsx`. This is the
   documented second parameter of `isMobileDisabled` and makes the `width`
   dependency meaningful, fixing resize re-evaluation and clearing the lint
   warnings.

**Consequences.** `<Inview>` now works standalone (the common case). `yarn build`
and `yarn lint` are both clean (0 errors, 0 warnings). The springs folder remains
`#do-not-modify` by default — these were explicitly signed-off bug fixes.

---

## ADR-0012 — Styling lives in utilities and components, not `globals.css`

- **Status:** Accepted
- **Date:** 2026-05-22

**Context.** ADR-0004 made design tokens the styling currency and ruled that
"new values must be added to `globals.css` first." Combined with the
design-system guidance to *"extract repeated multi-class patterns to
`@layer components`"*, the path of least resistance for any repeated visual
pattern became a named class in `globals.css`. On an animation-heavy,
multi-section marketing site that grows the file without bound — a single
global stylesheet accumulating hundreds of component-specific classes that are
never deleted when their component is. The fix is a placement rule, not a
file-splitting trick: splitting `globals.css` into many files only spreads the
same bloat.

**Decision.** Styling follows a strict placement order; `globals.css` stays
bounded by design.

- One-off styling → **Tailwind utilities** in `className`. Nothing enters CSS.
- A repeated pattern with markup/structure/props → a **React component**
  (`components/ui/`), *not* a CSS class. This is the default answer to "this
  looks repeated" — e.g. an eyebrow label with a `::before` dot is an
  `<Eyebrow>` component, not a `.label-eyebrow` class.
- A repeated pure-utility combo with no structure → a Tailwind v4 `@utility`.
- `@layer components` is reserved **strictly** for what utilities and
  components genuinely cannot express: pseudo-elements (`::before`/`::after`),
  third-party DOM overrides (`!important` on library markup), complex
  descendant/state selectors.
- `globals.css` only ever holds: `@import`, tokens (`:root` + `@theme`), base
  element resets (`@layer base`), and the narrow `@layer components`
  exceptions above. If it grows past that, something was misplaced.
- CSS Modules were considered and **rejected** — a second styling mechanism
  for the rare bespoke-CSS case is not worth the extra mental model when
  motion is spring-based (no keyframes — ADR-0002) and utilities + components
  cover everything else.

**Consequences.** `globals.css` stays a few-hundred-line file indefinitely.
"Repeated thing" pressure now pushes toward React components — which the
project wants anyway. This **amends ADR-0004**: design *tokens* still go in
`globals.css` first, but component-specific *classes* no longer do.
[[design-system]] and [[component-conventions]] updated to match.

---

## ADR-0011 — API layer: `app/api` route handlers, secrets server-side

- **Status:** Accepted
- **Date:** 2026-05-22

**Context.** The starter had no API layer. It needs a convention for reaching
external services that keeps secret keys off the client and gives endpoints a
consistent shape.

**Decision.** External calls go through Next.js Route Handlers —
`src/app/api/<resource>/route.ts`:
- **The handler owns the work** — business logic, multiple upstream calls,
  filtering, and reading secret env vars all live in `route.ts`. No mandatory
  passthrough service layer; extract shared code only when genuinely reused.
- Secrets are safe in handlers because `route.ts` is never bundled to the
  browser. Secret env vars are **unprefixed**; `NEXT_PUBLIC_` only for
  browser-safe values.
- Every endpoint: validates input with `zod`, returns the `{ data }` /
  `{ error }` envelope via the shared `handle()` wrapper (`src/lib/api/`), runs
  on the Node runtime (not Edge).
- `src/env.ts` validates env with zod — `publicEnv` vs `getServerEnv()`.
- Client Components fetch via `apiFetch` (`src/lib/api-client.ts`), same-origin
  only. Render-time data is read in Server Components.
- Added `zod`. The example endpoint is `app/api/contact/route.ts`.
- Codified as **AGENTS.md hard rule #9**.

**Consequences.** A clear, secret-safe API convention (full note:
[[api-architecture]]). Server Actions were considered for mutations but
deferred — for now everything goes through `app/api`. The choice can be
revisited if forms need progressive enhancement. First server dependency
(`zod`) and first server-only env var (`CONTACT_ENDPOINT`) now exist.

---

## ADR-0010 — SEO & performance hardening

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** A review found gaps that would hurt a production marketing site:
`metadataBase` defaulted to `null` (relative OG/canonical URLs never resolved to
absolute — broken social previews); `themeColor` sat on the deprecated metadata
field; there was no `robots.txt`, `sitemap.xml`, or structured data; the
`next.config.ts` was empty; `ScrollLayout` leaked a `requestAnimationFrame`
loop; the home view was a top-level `"use client"` (violating hard rule #6);
and the animation-heavy starter ignored `prefers-reduced-motion`.

**Decision.**
- **Site config.** `src/lib/site.ts` (`siteConfig`) is the single source of
  truth for SEO, fed by `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`).
- **Metadata.** `metadataBase` is always set; `themeColor` moved to a
  `generateViewport()` / `viewport` export; dead `keywords` / `other` tags
  dropped; OG dimensions corrected to match the asset.
- **Crawlability.** Added `app/robots.ts`, `app/sitemap.ts`, and a JSON-LD
  `Organization`+`WebSite` helper rendered once in the root layout.
- **App Router files.** Added `loading.tsx` (enables streaming), `error.tsx`,
  `not-found.tsx`.
- **Rendering.** `HomeView` is a Server Component; client-only animation moved
  to the `HomeShowcase` leaf — models hard rule #6 instead of breaking it.
- **Reduced motion.** `<ReducedMotion>` calls react-spring's `useReducedMotion`,
  toggling the global `skipAnimation` — one app-root mount covers every spring
  and `spring-text-engine`. Chosen over per-component handling for its reach.
- **Build config.** `next.config.ts` now sets `removeConsole` (prod),
  AVIF/WebP, `next/image` breakpoints aligned to the adaptive-grid widths, and
  `poweredByHeader: false`. React Compiler is left as a documented opt-in (needs
  `babel-plugin-react-compiler`).
- Fixed the `ScrollLayout` Lenis rAF leak (cancel on unmount).

**Consequences.** Social/SEO metadata is correct in production once
`NEXT_PUBLIC_SITE_URL` is set. The first project env var now exists (see
[[environment-variables]]). `isBot()` stays available but is discouraged — it
opts routes out of static rendering; reduced-motion is the preferred lever (see
[[seo-metadata]]). React Compiler remains opt-in pending a dependency install.

---

## ADR-0009 — Shared animation ticker; authorized engine performance refactor

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** A performance review of the animation engine found load issues that
scale with the number of animated components on a page:
- `useLoop` started a **private `requestAnimationFrame` loop per hook instance** —
  N scroll-driven components meant N rAF loops, none of which ever stopped.
- `useWindowWidth` attached a **separate debounced `resize` listener per call** —
  one per spring component.
- `useDynamicInView` re-created its `IntersectionObserver` **on every render**
  (effect keyed on an unstable `options` object), and a dead `Proxy` branch
  created observers that were never disconnected.
- `useLoop`'s mount-only effect captured a **stale `onRender`**, so prop changes
  after mount were ignored.
All of this lives under `src/hooks/animation/` and `src/components/animation/springs/`
— `#do-not-modify` (ADR-0002).

**Decision.** With explicit user sign-off, apply a one-time performance refactor
to the protected engine, and introduce a shared, unprotected loop primitive:
- New `src/lib/animation/ticker.ts` — a single app-wide, reference-counted rAF
  loop (`subscribeToTicker`). It starts on the first subscriber, stops on the
  last, and throttles each subscriber independently. **Not** `#do-not-modify` —
  it is the supported extension point.
- `useLoop` now subscribes to the ticker and reads `onRender` / `framerate`
  through refs (fixes the stale-closure bug). Public signature unchanged.
- `useDynamicInView` rewritten without the `Proxy`: one observer, re-created only
  when the observed element or options actually change; exposes a callback ref.
- `use-window-size.ts` (not protected) now serves all three hooks from one
  debounced `resize` listener via `useSyncExternalStore`. The unused
  `debounceDelay` parameter was dropped.
- `mode="forward"` `scroll` listeners in `<Spring>` / `<Inview>` made `passive`.
- Hard rule #2 amended: the engine stays protected by default; changes require
  explicit sign-off.

**Consequences.** A page with N animated components now runs **one** rAF loop and
**one** resize listener instead of N of each, with no observer churn. Public
hook/component APIs are unchanged except `useWindowWidth`/`Height`/`Size`, which
no longer take a `debounceDelay` argument (no caller passed one). This **amends
ADR-0002's** do-not-modify scope.

A follow-up pass then cleared all 13 pre-existing ESLint problems in the engine
(also authorized): `isMobileDisabled` gained an optional `viewportWidth`
argument, missing `disableOnMobile` effect deps were added, a
`trigger.current`-in-cleanup hazard in `<Hover>` was fixed, `<Handle>`'s
transition effects were ref-stabilised, and `useProgressTrigger` now returns
`progress` as a `RefObject<number>` (no consumer affected).

---

## ADR-0008 — Adaptive scaling grid via root font-size

- **Status:** Partially superseded by [[decisions-log]] ADR-0022 — the
  **scale-down** mechanism (the `vw` media queries) is removed; the **scale-up**
  mechanism (`<AdaptiveGrid>` above 1920px) stands.
- **Date:** 2026-05-21

**Context.** An adaptive scaling system was dropped into `src/components/common/`
to keep a rem-based design proportional across viewports. It shipped as a
`styled-components` implementation (`createGlobalStyle`, a `css` `media` helper,
`rm`/`em` helpers, plus `colors.ts` / `fonts.ts` / `utils.ts`). `styled-components`
is not a project dependency, and global CSS belongs in `globals.css` per ADR-0004.

**Decision.** Keep only the scaling behaviour; rebuild it to the project stack.
- **Scale down** (viewport ≤ largest breakpoint) — `vw`-based `html { font-size }`
  media queries in `globals.css`, inside `@layer base`.
- **Scale up** (viewport > largest breakpoint) — a `<AdaptiveGrid>` client
  component (`useAdaptiveGrid` hook) sets an inline `html` font-size at runtime,
  reusing the existing `useResizeLoop` render loop.
- Breakpoints live in `grid.config.ts` as typed config; the `globals.css` media
  queries mirror them and must be kept in sync (formula in both files).
- The dropped `styled-components` files were deleted, not committed.

**Consequences.** A rem-based layout now scales as one unit on every viewport.
`styled-components` stays out of the dependency tree. The breakpoint set is
duplicated across `grid.config.ts` and `globals.css` by design — the CSS-only
config rule (ADR-0004) forbids generating the media queries from JS.

---

## ADR-0007 — Automate the vault workflow with Claude Code hooks

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** The "read the vault first, follow the relevant guide, update the docs
after every change" workflow depended on the user reminding the agent each time.
Documentation drifts the moment it relies on memory.

**Decision.** Encode the workflow as Claude Code hooks in `.claude/settings.json`
(committed, team-wide):
- `SessionStart` — injects a pointer to read the vault first.
- `UserPromptSubmit` — on every request, reminds the agent to consult the relevant
  guide and to update docs for any change made.
- `Stop` — at the end of every turn, blocks **once** to confirm the vault was
  updated. A `${TMPDIR}` marker keyed by session id guarantees it blocks at most
  once per turn (no infinite loop).

**Consequences.** The documentation workflow is enforced without user prompting.
`.claude/settings.json` is now a tracked project file. Hooks are reviewable and
disableable via `/hooks`. New hooks take effect on the next session start (or after
opening `/hooks`). See [[ai-agent-guide]].

---

## ADR-0006 — The vault is the single source of truth

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** ADR-0001 left dense spec files (`project-specs.md`, `text-engine-docs.md`)
at the repo root alongside the vault, creating duplication — the same conventions
existed both as terse specs and as expanded vault notes, which would drift.

**Decision.** The vault is the **only** documentation source.
- `project-specs.md` — deleted; its content was already decomposed into the
  `architecture/` and `frontend/` notes (and `environment-variables.md`).
- `text-engine-docs.md` — moved into the vault as [[text-engine-reference]].
- `generic-layout-prompt.md` — moved into the vault (see ADR via [[changelog]]).
- Root keeps only thin shims: `AGENTS.md` carries the breaking-change warning and
  hard rules and points into the vault; `CLAUDE.md` and `.cursorrules` both
  `@`-import `AGENTS.md`.

**Consequences.** No documentation duplication. Agents bootstrap from `AGENTS.md`
and read vault notes on demand. This **amends ADR-0001** — root files no longer
hold canonical spec content.

---

## ADR-0005 — Use standard `next/link` for navigation

- **Status:** Accepted
- **Date:** 2026-05-21

**Context.** Two conflicting conventions existed: `project-specs.md` specified
standard `next/link` / `useRouter`, while `generic-layout-prompt.md` specified
custom `<AnimLink>` / `useAnimRouter()` wrappers. The custom wrappers were never
built.

**Decision.** Use standard Next.js navigation — `<Link>` from `next/link` and
`useRouter` from `next/navigation`. The `AnimLink` / `useAnimRouter` convention is
dropped. See [[routing]].

**Consequences.** `generic-layout-prompt.md` §5 updated to match. No animated-route-
transition layer exists; if one is needed later, revisit with a new ADR.

---

## ADR-0001 — Adopt an Obsidian vault as the project brain

- **Status:** Accepted — amended by ADR-0006
- **Date:** 2026-05-21

**Context.** Project knowledge was scattered across root markdown files
(`project-specs.md`, `text-engine-docs.md`, `AGENTS.md`). New contributors and AI
agents had no structured map of the system.

**Decision.** Introduce `obsidian/` as an Obsidian vault — a linked, navigable
second brain. Root spec files remain as machine-read sources; the vault expands on
them. See [[ai-agent-guide]].

**Consequences.** Docs must now be maintained alongside code. The vault is the
canonical place to *understand* the project; root files stay canonical for *tooling*.

---

## ADR-0002 — All motion is spring-based (`@react-spring/web`)

- **Status:** Accepted (inherited from starter)
- **Date:** Project baseline

**Context.** Marketing sites need rich, interruptible, physically natural motion.
CSS transitions and keyframes are rigid; competing libraries add weight.

**Decision.** Use `@react-spring/web` for every animation. A custom component layer
(`src/components/animation/springs/`) wraps it. CSS transitions, CSS keyframes, and
`framer-motion` are **banned**.

**Consequences.** All animation goes through the [[animation-system]]. The springs
folder is `#do-not-modify`. Text animation is delegated to [[text-engine]].

---

## ADR-0003 — Routes delegate to Views

- **Status:** Accepted (inherited from starter)
- **Date:** Project baseline

**Context.** Mixing routing concerns with page UI makes `app/` files heavy and hard
to test.

**Decision.** `app/**/page.tsx` files only import and render a component from
`src/views/`. All layout/UI logic lives in the view. See [[routing]].

**Consequences.** Every route is a 3-line file. Views are the real page components.

---

## ADR-0004 — Tailwind v4 with CSS-based config

- **Status:** Accepted (inherited from starter)
- **Date:** Project baseline

**Context.** Tailwind v4 removes `tailwind.config.js` in favour of CSS-native config.

**Decision.** All theme tokens live in `globals.css` under `:root` and `@theme inline`.
No JS config file. Raw values in class names are banned. See [[design-system]].

**Consequences.** Design tokens are the only styling currency. New values must be
added to `globals.css` first.
