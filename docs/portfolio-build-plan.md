# John Wu portfolio — build plan and running state

**Status file.** Read this first when picking the project back up. It carries the design
direction, the conventions, what is finished, and the exact brief for what is not.

Last updated: 2026-08-10.

---

## 1. What this is

A personal portfolio for John Wu: CS student at UMD, ML/CV researcher, photographer.
Built on the `next16-claude-starter` template, so every rule in `AGENTS.md` and the
`obsidian/` vault applies (spring-only motion, no `any`, routes delegate to views,
Server Components by default, design tokens for everything).

**Brief from John:** visually stunning; first screen is a professional profile with a
headshot; professional and photography work compartmentalized; specific project pages
with tailored designs; complete the first draft autonomously and iteratively; keep a
critical eye out for AI-slop hallmarks and useless controls. Later instruction:
**leave placeholders for content that is not available yet.**

---

## 2. Aesthetic direction (committed)

> **"Lab bench / darkroom."** The site is a precision measuring instrument printed on
> photographic paper. Swiss editorial grid, hairline rules, monospace telemetry
> annotations, and one amber accent borrowed from a darkroom safelight, which is the
> lamp that connects the sensor work to the photography.

Two compartments, one token set:

| Compartment | Theme attribute | Where |
|---|---|---|
| **Lab** (professional) | `:root, [data-theme="lab"]` | `/`, `/work/*`, plus the door band at the foot of `/photography` |
| **Darkroom** (photography) | `[data-theme="darkroom"]` | `/photography`, plus the door band on the home page |

Both compartments need a real selector. The lab is the document default, but it also has
to be addressable, or a lab band nested inside a darkroom page inherits the darkroom
tokens and never lights up.

The compartment split *is* the design. Entering photography turns the lights off.

### Palette — every colour has physical provenance

| Token | Lab | Darkroom | Provenance |
|---|---|---|---|
| `--paper` | `#f4f1ea` | `#0b0a09` | fibre-based baryta photo paper / an unexposed frame |
| `--paper-2` | `#eae5d9` | `#141210` | raised panel |
| `--paper-3` | `#ded7c7` | `#1e1b17` | sunken well |
| `--line` | `#c9c1ae` | `#302b24` | hairline rule |
| `--line-strong` | `#a79d86` | `#4a4238` | emphasised rule |
| `--ink` | `#15171a` | `#ece5d7` | printing ink / emulsion highlight |
| `--ink-2` | `#4d535b` | `#a8a091` | secondary prose |
| `--ink-3` | `#837e70` | `#6f6a5e` | mono labels, captions |
| `--safelight` | `#bc4718` | `#f08a3c` | the amber darkroom safelight |
| `--cyanotype` | `#1c4c6b` | `#79aecc` | Prussian blue of a cyanotype print |

Semantics hold in both themes: **ink is what you write with, paper is what you write on.**
`bg-paper text-ink` is correct in either compartment. No purple, no default black/white.

### Typography

| Role | Face | Why |
|---|---|---|
| Display | **Instrument Serif** 400 + italic | high-contrast editorial serif, reads as printed matter |
| Body / UI | **Instrument Sans** | quiet neo-grotesque that sits under the serif |
| Telemetry | **IBM Plex Mono** 400/500 | every label, unit, index number and measurement |

Deliberately avoids Inter, Roboto, system stacks, and Space Grotesk.

> **Load-bearing gotcha, already fixed once:** the `next/font` variable classes must go
> on `<html>`, **not** `<body>`. `globals.css` composes them into `:root` tokens
> (`--font-display-family: var(--font-instrument-serif), …`), and a custom property is
> substituted where it is *declared*. A token on `:root` cannot see a variable defined
> on a descendant. Put them on `<body>` and every font silently falls back to a system
> face with no error anywhere. See the comment in `src/app/layout.tsx`.

### Type scale

Declared with Tailwind v4 `@utility` (not `@layer utilities`) so responsive variants
work. Each step carries its phone size plus a nested `@media (min-width: 1024px)` block:
`text-display-xl`, `text-display`, `text-display-sm`, `text-readout`, `text-lede`,
`text-body`, `text-fine`, `label-mono`, `rule-t/b/l`.

### Signature interaction

`src/components/site/scroll-rail.tsx`. A fixed right-edge scale (xl+ only) that is a
true miniature of the page: each tick sits at the section's real document fraction, so
tick spacing tells you how long a section is. Amber caret springs to scroll position
(the only spring on the site with visible residual motion). Ticks are buttons and they
scroll. Sections opt in with `data-rail-section="Label"` plus an `id`, so new sections
join automatically.

---

## 3. Architecture

```
src/
  app/
    layout.tsx              fonts on <html>, theme bootstrap, chrome, ScrollRail
    page.tsx                → views/home
    work/<slug>/page.tsx    one route per project, delegates to views/work/<slug>
    photography/page.tsx    → views/photography
  data/
    types.ts                content model + PLACEHOLDER sentinel + AssetSlot
    profile.ts              identity, status readout, experience, skills, education
    projects.ts             project index + additionalWork + lookup helpers
    case-studies.ts         per-project narrative copy (VOICE-CRITICAL, see §5)
    photography.ts          contact sheet manifest, all frames empty for now
  lib/
    motion.ts               the only four spring configs on the site
    site.ts                 SEO config for John
  components/
    ui/                     Reveal, MonoLabel, Section, MetricReadout, AssetFrame
    site/                   SiteHeader, SiteFooter, ScrollRail, ThemeSync, CompartmentDoor
    project/                shared case-study scaffolding
  views/
    home.tsx + home/*       hero, work-index, darkroom-door, experience, toolkit, contact
    work/<slug>.tsx         bespoke case study pages
    photography.tsx + photography/  SheetMasthead, ContactSheet, metadata
```

### Conventions that must not drift

1. **All motion through `Reveal`** (`components/ui/reveal.tsx`), which wraps `Inview`
   with the house config, `mode="once"`. Never re-animate on scroll-back.
2. **Four spring configs only**, from `lib/motion.ts`: `ease`, `heavy`, `react`, `snap`.
3. **Every label/unit/index in `MonoLabel`.** Prose never uses mono.
4. **No hardcoded colour or type values.** Tokens or the scale utilities.
5. **`AssetFrame` for every image slot.** It renders the image, or a print-layout
   "unplaced image" mark (corner brackets + diagonal cross). The drop-in path shows
   **only in development**; visitors see `publicLabel`. Never ship a filesystem path
   to a visitor.
6. **No CSS transitions or keyframes.** Hover states change instantly, which suits an
   instrument. Grain and gradients are static and therefore fine.
7. Sections carry `id` + `data-rail-section` so the rail picks them up.

---

## 4. Deliberate omissions (do not "fix" these)

Each of these was removed or refused on purpose. Re-adding one is a regression.

- **Cookie banner** (`LazyCookie`) removed from the layout. No analytics, no cookies,
  so the banner was a control that existed to be a control.
- **No hamburger menu.** Three nav labels fit at 360px in mono.
- **No contact form.** A form on a personal site is a mail client that loses drafts.
- **No back-to-top button.** The browser has that key.
- **No skill percentage bars.** "82% at PyTorch" is a number nobody measured.
- **No social icon row** in the footer, no newsletter.
- **Résumé link is hidden until the PDF exists** (`profile.ts → resume.available`), so
  the site never ships a link to a 404. The footer reads that flag — it did not until
  the review pass, when the flag turned out to be wired to nothing.
- **No `/api/*` routes.** The starter's `api/contact` example was deleted: no contact
  form means no caller, and an unreferenced public `POST` that logs whatever is sent to
  it is a surface with no purpose. `lib/api`, `api-client.ts` and `env.ts` remain as the
  convention for the first real endpoint.
- **The `Cookie/` module is gone,** not just unmounted. Deleted 2026-08-10 after six
  weeks unreferenced. A backup sits in this session's scratchpad under `removed/`; the
  canonical copy is the upstream starter.

---

## 5. Voice rules for all copy (non-negotiable)

Derived from `~/UMD/applications/docs/voice.md` and `voice/corrections.md`. John will
reject copy that breaks these.

- **No em dashes anywhere in prose.** This is his loudest tell. En dashes in date
  ranges are fine.
- No bold, no inline lists, no colon-headed bullets inside prose.
- No three-item lists used for rhythm. No antithesis. No aphorisms.
- **The test: "is this explaining, or performing?" If a sentence would work as a pull
  quote, it is performing. Delete it and explain the thing instead.**
- Banned vocabulary: delve, leverage, utilize, spearhead, foster, underscore, showcase,
  testament, landscape (figurative), tapestry, pivotal, crucial, robust, seamless,
  vibrant, intricate, realm, journey (figurative), "at its core", "in today's",
  "it's not just X, it's Y", "serves as", "stands as", "a testament to",
  "I'm passionate about".
- Banned openers: "By leveraging", "Having realized", "Importantly,", "Notably,",
  "Interestingly,", "In doing so,", "Ultimately,".
- Narrate the causal chain. Do not state the conclusion and attach evidence.
- Repeat the plain noun. No elegant variation.
- **Comma splices are a signature. Preserve them.** Mild roughness is positive signal.
- End flat, on a concrete consequence, never on a lyrical summary line.
- American spelling.

### Facts that must not be overstated

- ArmToPoint has **no recorded obstacle or failure** in the fact bank. Do not invent
  one. Do not invent dataset size, randomization scheme, or evaluation metric.
- Cherry Canary is deliberately off his résumé (his call). Fine on the site, but do not
  present it as résumé-headline work.
- UKC 2024 cloud-seeding: no DOI on file. Do not call it a published paper.
- Leuterio Thomas: the ~3 hours → ~15 minutes number is verified. Team size, adoption
  and user counts are not.
- President's Scholarship: award year unknown, rendered without a year.
- Write "Semester Academic Honors", never bare "Dean's List".
- Never mention the MATH246 grade, and never quote the registrar's word "Freshman".
- **Unvetted repos deliberately excluded from the site:** `learnedSignal`,
  `autoResearch`, `hackTemplate`, `Voice_Emotion_Checkin`. They are real on disk but
  are not in the verified fact bank and their numbers are research-log data. Flag them
  to John rather than writing copy about them.

---

## 6. Content John still owes (placeholders are live and intentional)

| Slot | Where | What to drop in |
|---|---|---|
| Headshot | `data/profile.ts → profile.headshot` | `public/assets/portrait/john-wu.jpg`, 4:5, min 1200px tall |
| Photographs | `data/photography.ts → frames` | `public/assets/photography/01.jpg` …, long edge 2000px, sRGB; then swap `kind: "placeholder"` → `kind: "image"` and fill `caption` + `exif` |
| Résumé PDF | `data/profile.ts → resume` | `public/john-wu-resume.pdf`, then set `available: true` |
| OG image | `public/open-graph.png` | still the template's placeholder art, 900×600; ideal is 1200×630 |
| Photography facts | `data/photography.ts → sheet.lede` / `sheet.note` | the fact bank knows only that he shoots and that it is where his design eye comes from. Genre, camera, links all unknown. |
| Scholarship year | `data/profile.ts → credentials` | President's Scholarship award year |

---

## 7. Task state

| # | Task | State |
|---|---|---|
| 1 | Design foundation: tokens, fonts, `globals.css` | **done** |
| 2 | Content data layer (`types`, `profile`, `projects`, `case-studies`, `photography`) | **done** |
| 3 | Shared UI kit + site chrome (Reveal, MonoLabel, Section, MetricReadout, AssetFrame, header, footer, ScrollRail, ThemeSync) | **done** |
| 4 | Home view (hero, work index, darkroom door, experience, toolkit, contact) | **done**, verified in a headless screenshot |
| 5 | Five bespoke project pages | **done** — see §8 for what shipped |
| 6 | Photography compartment (`/photography`) | **done** — see §10 |
| 7 | SEO: site config + Person JSON-LD, sitemap (incl. `/photography`), per-page metadata + CreativeWork JSON-LD for `/work/*` | **done** |
| 8 | Critical review pass: AI-slop audit | **done** — see §10 |
| 9 | Verify: `yarn lint`, `yarn build`, screenshots at 1440/768/375 | **done** — lint, `tsc --noEmit` and build clean; both compartments re-shot after the audit. Mobile is verified at 600px, not 375 (see the screenshot caveat). |
| 10 | Update `obsidian/` vault (changelog, ADRs, catalogs, tech-stack) | **done** through task 8 |

### Bugs already found and fixed
- Fonts silently falling back: `next/font` variables were on `<body>`, moved to `<html>`.
- Hydration mismatch from the theme bootstrap script: `suppressHydrationWarning` on `<html>`.
- Hero grid dead zone: status readout auto-placed under the portrait; now an explicit
  3-column dl beneath the statement.
- `Reveal tag="dl"` does not type-check. The `Tags` union in `src/types/springs.ts`
  has no `dl` / `dt` / `dd`. Wrap a real `<dl>` inside a `Reveal` div. Fixed in the
  hero and the project masthead; do not reintroduce it.
- ArmToPoint figure: the frustum edge ran through two dimension labels. Labels that
  cross geometry now carry a `paint-order` halo in the plate colour.
- `[data-theme="lab"]` was not a real selector — `globals.css` declared the lab palette
  on bare `:root` only, so the lab-themed door at the foot of `/photography` inherited
  the darkroom tokens and rendered black on black. Lab tokens now sit on
  `:root, [data-theme="lab"]`. A compartment has to be addressable, not just the
  absence of the other one.
- `--ink-3` failed WCAG AA for small text in **both** compartments (3.59:1 and 3.67:1
  against `--paper`, against a 4.5:1 requirement), and it is the colour of nearly every
  label and caption on the site. Now `#625e54` / `#898374`. Measure a token that will
  hold small text; do not pick it by eye. ADR-0021.
- `SiteHeader` marked two nav items "current" at once. `isActive` returned true for both
  `/#work` and `/#contact` whenever `pathname === "/"`. Hash links are jumps, not routes,
  and no longer take an active state.
- `MetricReadout`'s `unit` prop renders as a **superscript unit symbol**. Feeding it a
  magnitude suffix or a word produced `32ᴮ`, `7ᴳᴾᵁ` and `3ᴰ` in the "verified figures
  only" panel. Units are `Hz`, `%`, `cm`, `min`; anything else belongs in the value or
  the label.

### Screenshot caveat

A headless window taller than roughly 3000px renders the page with every `Reveal` still
at `opacity: 0` — the in-view observer does not fire and the capture comes back as
chrome-only with a blank body. It looks exactly like a catastrophic regression and is
not one. **Keep captures at or below ~2600px tall**, or shoot the page in sections.

Headless Chrome on macOS clamps `--window-size` to a minimum width around 500px and
then crops the capture, so a 375-wide shot looks like a broken, overflowing layout when
it is not. Verify small screens at **600px or above**, or use the Chrome extension when
it is connected. A 600px capture of `/work/tackle-vision` collapses correctly.

---

## 8. The five project pages (task 5, shipped)

One route and one view per project rather than a `[slug]` template, so each page is
genuinely tailored. ADR-0019 in the vault records why.

| Slug | Figure | Accent | Composition |
|---|---|---|---|
| `vla-benchmarking` | two coverage matrices, ragged vs complete, through one observation adapter | cyanotype | figure leads, then sticky spec sidebar beside stacked prose |
| `tackle-vision` | lifted pose + velocity / acceleration / jerk, impact frame marked | safelight | spec band, problem, figure, remaining prose in margin layout |
| `terps-dashboard` | boot time before/after on one axis, plus a one-second 60 Hz ruler | safelight | spec band, all prose, figure closes |
| `armtopoint` | orthographic sheet: frustum → predicted point → ±5 cm volume, with a title block | cyanotype | prose, full-bleed drawing sheet, closing prose, spec as colophon |
| `cherry-canary` | HR / breathing divergence over a late SpO2 drop, plus the signal chain with the model outside it | safelight | spec band, prose, figure in a safelight-bloom band, closing prose |

Shared scaffolding lives in `src/components/project/`; figures in
`src/components/project/figures/`. Rules that still apply to any new page:

- Copy comes verbatim from `src/data/case-studies.ts`. Do not rewrite it.
- Figures are hand-authored inline SVG using `currentColor`. No chart library.
  A figure whose curves are generated rather than recorded is marked `Schematic`.
- Only numbers from the fact bank get dimensioned. Everything else is shape only.
- Routes import from `views/` only; per-page metadata comes from
  `src/views/work/metadata.ts`.

---

## 9. The photography compartment (task 6, shipped)

`/photography` is the darkroom side. Three parts, no filler:

| Part | What it is |
|---|---|
| `SheetMasthead` | The only client component. Same skeleton as a case-study masthead — running head, clipped title, flat facts left, sentence right — because both compartments are the same person's document on different paper. The title is one step larger (`text-display-xl`); it is one word and it is the first thing behind the door. |
| `ContactSheet` | The whole roll printed at frame size: two six-frame strips, square frames butted on hairlines, film edge numbers in the rebate, strip codes in the margin. Frames are small on purpose — a contact sheet is a proof, not a gallery wall. The first draft used three across and the frames were the size of posters. |
| `CompartmentDoor theme="lab"` | The door back. Same component as the home page's darkroom band, so it is literally the same door from the other side. A lit baryta rectangle at the foot of a dark page. |

Rules that still apply:

- **All twelve frames are unexposed and stay that way** until John loads photographs.
  No stock imagery, no invented captions, no artist statement. ADR-0020 records why.
- Loading work is a **data edit, not a code change**: set a frame's `asset` to
  `{ kind: "image", src, alt }` in `data/photography.ts` and fill `caption` / `exif`.
  The caption row only renders once a frame has one.
- The masthead states facts about the *sheet* (code, frames, printed), never facts
  about the photographer — the fact bank has none.
- `/photography` carries no JSON-LD on purpose. Add an `ImageGallery` with the first
  real frame.

---

## 10. The critical review pass (task 8, shipped)

Every page was read twice: as rendered pixels at 1600px and 500px, and as the text a
crawler or a screen reader gets, extracted from the server-rendered HTML. Then swept for
the four things that make a site read as generated — a claim stated more than once in
slightly different words, a control that does nothing, a number that is not a
measurement, and code for a feature that was cut.

### Fixed

| What | Why it mattered |
|---|---|
| `--ink-3` raised to AA in both compartments | 3.6:1 on the colour that carries every label and caption. The one finding a visitor would actually be harmed by. ADR-0021. |
| Header lit two nav items at once on `/` | An "active" marker that never changes is not a marker. Hash links no longer take one. |
| `32ᴮ`, `7ᴳᴾᵁ`, `3ᴰ` in the metrics panel | `unit` is a superscript unit slot. `3D lifted joint tracks` was a word dressed as a figure and was deleted; the panel is headed "verified figures only". `MetricReadout` now sizes its grid to the count. |
| Deleted `app/api/contact/route.ts` | Unreferenced public `POST` that console-logged submitted names, emails and messages, on a site with no contact form. Every route is now static. |
| Deleted `components/common/Cookie/` | Seven files, zero imports since ADR-0014 unmounted the banner in June. |
| Footer rewritten | Repeated the positioning line a fourth time, carried a Photography link that self-linked on `/photography`, and signed off with an aphorism. Now the name, the links, a colophon. |
| Résumé link actually wired | `profile.resume.available` existed and nothing read it, so the documented "never ship a link to a 404" guard was not connected to anything. The footer now renders the link when the flag flips. |
| `Fig. 01 — …` → `Fig. 01. …` ×5 | No em dashes in his prose, including in captions. |
| "Coverage, not scores" → "Task coverage" | Antithesis. |
| "too inflexible to edge cases" | A preposition error, not one of his comma splices. |
| Deleted `profile.aside.photography` | A third phrasing of what `photography.ts` says twice. Nothing rendered it. |
| Removed `SpecSheet`'s "N rows", the hero's duplicate `FIG. 01`, and `/photography`'s "12 frames · 0 printed" | Each annotated the page with something already on the screen. |
| Hardcoded `GPA 3.73` in the hero | Reads `education.gpa` now. Rule 4. |
| `rel="noopener noreferrer"` on external links | |

### Checked and deliberately left alone

- **`--safelight`** is 4.59:1 on `--paper` and passes. It is 4.12:1 over `--paper-2`,
  which would fail, but no markup puts a `signal`-tone label on a raised lab panel. If
  one ever does, darken the accent to about `#b24316` first. It has provenance, so it
  does not get changed speculatively.
- **The wide empty left column** under `SpecSheet` on `/work/vla-benchmarking`. A
  `position: sticky` spec rail would fill it, but the sticky element is the one `Reveal`
  transforms, and the animation engine is off-limits without sign-off. It also reads as
  a deliberate Swiss margin rather than a mistake. John's call.
- **"2 engineers on the pipeline"** duplicates a Tackle Vision spec row, and **"2
  sensors, one enclosure"** is a thin figure. Both are true, and the fact bank has
  nothing to replace them with. Pruning further would have emptied the panel.
- **`/photography` still emits no JSON-LD.** An `ImageGallery` with zero images is worse
  than none. ADR-0020 stands.
- **Comma splices throughout the case studies.** They are a signature, not typos.

### Not resolved — needs John

- The four unvetted repos in §5 are still excluded. Nothing on the site mentions them.
- The `/privacy-policy` route referenced by the deleted cookie modal never existed. With
  the module gone there is no dangling link, and the site sets no cookies, so there is
  nothing to write a policy about.

---

## 11. How to see it

```bash
yarn dev            # http://localhost:3000
yarn lint           # must be clean
yarn build          # must be clean
```

Screenshots without the Chrome extension (it was not connected in this session):

```bash
/private/tmp/.../scratchpad/shot.sh /work/tackle-vision out.png 1600 2400
```

which is a wrapper around headless Chrome:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=W,H --virtual-time-budget=25000 --screenshot=out.png URL
```

Do not pass `--user-data-dir`; it hangs.
