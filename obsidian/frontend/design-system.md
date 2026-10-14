---
tags: [frontend, design-system, stable]
updated: 2026-08-10
---

# Design System — Tailwind v4

Styling uses **Tailwind CSS v4**, configured entirely in CSS. There is **no
`tailwind.config.js`**. ADR: [[decisions-log]] ADR-0004.

> [!important] This project's tokens are not the starter's tokens
> The generic `--background` / `--foreground` pair was replaced when the repo became
> John Wu's portfolio. The live token set is described below; the direction it comes
> from is documented in `docs/portfolio-build-plan.md`.

## Where config lives

`src/app/globals.css` is the single config file. Extra CSS layers can be split into
`src/style/index.css` and imported.

## The token set — "lab bench / darkroom"

Two compartments share one set of semantic tokens. `:root, [data-theme="lab"]` is the
**lab** (light, paper-and-ink, the professional side). `[data-theme="darkroom"]` is the
**darkroom** (lights off, amber safelight, the photography side).

> [!warning] Both compartments need a real selector
> The lab palette is declared on `:root` **and** on `[data-theme="lab"]`. Dropping the
> second one looks harmless — the lab is the default, after all — but then a lab-themed
> band nested inside a darkroom page inherits the darkroom values and silently never
> lights up. That is exactly what the door back out of `/photography` is. A compartment
> has to be addressable, not merely the absence of the other one.

Semantics hold in both: **`ink` is what you write with, `paper` is what you write on.**
`bg-paper text-ink` is therefore correct in either compartment, and no component needs
to know which theme it is in.

| Token | Lab | Darkroom | Role |
|---|---|---|---|
| `--paper` | `#f4f1ea` | `#0b0a09` | page ground |
| `--paper-2` | `#eae5d9` | `#141210` | raised panel, hovered row |
| `--paper-3` | `#ded7c7` | `#1e1b17` | sunken well |
| `--line` | `#c9c1ae` | `#302b24` | hairline rule |
| `--line-strong` | `#a79d86` | `#4a4238` | emphasised rule |
| `--ink` | `#15171a` | `#ece5d7` | body and display text |
| `--ink-2` | `#4d535b` | `#a8a091` | secondary prose |
| `--ink-3` | `#625e54` | `#898374` | mono labels, captions |
| `--safelight` | `#a83e12` | `#f08a3c` | the one load-bearing accent |
| `--safelight-soft` | `#e08544` | `#ffb367` | |
| `--cyanotype` | `#1c4c6b` | `#79aecc` | data and diagram strokes |
| `--cyanotype-soft` | `#5b8fae` | `#4b7c98` | |

Each colour references something physical: baryta photographic paper, printing ink, the
amber darkroom safelight, the Prussian blue of a cyanotype print. Adding a colour means
adding it to both blocks and binding it in `@theme inline`.

> [!important] Measure a token before shipping it, not after
> `--ink-3` holds nearly every label and caption on the site, and its first values
> (`#837e70` / `#6f6a5e`) were picked by eye to look faint. They were 3.6:1 — a WCAG AA
> failure for small text in **both** compartments. The current values clear 4.5:1 on
> `paper`, `paper-2` and `paper-3`. [[decisions-log]] ADR-0021.
>
> This note used to end by conceding one sub-4.5 pair — `--safelight` over `--paper-2`
> at 4.12:1 — and dismissing it as something "no markup currently produces". That was
> wrong, and it was wrong at the time it was written: `FigurePlate` and `ComparePlate`
> both sit on `--paper-2`, so every mono annotation inside every drawing on the site was
> exactly that pair. `--safelight` was darkened `#bc4718` → `#a83e12` (4.97:1 measured)
> rather than keep the exception. **A contrast pair that markup "does not currently
> produce" is a pair nobody has checked — audit the rendered page, not the palette.**

Theme switching is covered in [[decisions-log]] ADR-0016.

## Typography

| Namespace | Face | Used for |
|---|---|---|
| `--font-display` | **Fraunces** variable (`opsz`, `SOFT`, `WONK`) + italic | headlines, metric numerals |
| `--font-sans` | Instrument Sans | body and UI |
| `--font-mono` | IBM Plex Mono 400/500 | every label, unit, index, measurement |

> [!important] The display face is recut per size, not scaled
> Fraunces carries a real optical-size axis. Every display type step sets
> `font-variation-settings: "opsz" <its own px size>`, so a 144px headline gets a
> display cut and a 28px subhead gets a text cut from one file. **A new display
> step that forgets `opsz` inherits the wrong optical cut.**
>
> `SOFT` is pinned to 20, `WONK` to **0** — WONK is what makes Fraunces read as
> quirky, and this site is an instrument, not a novelty.
>
> There is **no blanket negative tracking** on `.font-display`. The previous face
> had `-0.022em` here plus `-0.03em` again at `text-display-xl`, which is what
> made headlines read as jammed together. Serifs need more room than a sans at
> the same size, not less. [[decisions-log]] ADR-0023.

> [!warning] The variable classNames go on `<html>`
> `globals.css` composes them into `:root` tokens, and a custom property is substituted
> where it is *declared*. Putting them on `<body>` makes every font silently fall back
> with no error. [[decisions-log]] ADR-0017.

## Type scale

Declared with Tailwind v4 `@utility` so responsive variants work. Every step is a
`clamp()` interpolating between the **360px** and **1440px** design widths and pinning
outside them.

| Step | 360px → 1440px | Notes |
|---|---|---|
| `text-display-xl` | 52 → 144px | `opsz` 144 |
| `text-display` | 40 → 64px | `opsz` 64 |
| `text-display-sm` | 30 → 40px | `opsz` 40 |
| `text-readout` | 34 → 44px | `opsz` 44, tabular lining numerals |
| **`text-sub`** | **22 → 28px** | **the middle register** |
| `text-lede` | 19 → 24px | |
| `text-body` | 16 → 17px | |
| `text-fine` | 14px flat | |
| `label-mono` | 12.5px flat, `0.1em` | |

Plus `rule-t` / `rule-b` / `rule-l`.

> [!important] `text-sub` exists because the page had a hole
> Before it, nothing on the home page sat between 21px and 38px. Every label, spec
> and description fell to 11–16px, so no middle-weight element could lead the eye
> down the page. Reach for `text-sub` before reaching for bold body text.

`label-mono` is the instrument-panel voice: uppercase, tracked out, mono. Prose never
uses it. Reach for the `MonoLabel` component rather than the raw class. Its tracking is
`0.1em`, not the original `0.14em` — at 11–12px that much tracking stops letters
grouping into words.

> [!warning] Display leading is below 1.0, so descenders need two separate allowances
> The display steps run tight leading, which means the glyphs are **taller than their
> own line-box**. Two different things then cut them, and both fixes are usually needed
> on the same heading:
>
> | Symptom | Cause | Fix |
> |---|---|---|
> | Descenders sliced flat mid-glyph | `TextEngine`'s `overflow` puts `overflow: hidden` on a one-line-box-tall per-line mask | `wrapLineClassName="line-mask"` |
> | A rule sitting on top of the descenders | the container's border is at the line-box edge | `descender-room` on the heading |
>
> `line-mask` pads the mask down `0.3em` and takes the space back with a negative
> margin, so spacing is unchanged. Fixing only the rule position looks like it worked —
> the rule stops touching the text — while every descender is still severed. Check the
> letterforms, not the gap.
>
> **Every `TextEngine` with `overflow` needs `line-mask`. There is no exception.** The
> contact address shipped without it and lost the tail of its "j" for a full round,
> because the masthead and hero were fixed by name rather than by auditing the prop:
> `grep -rn 'overflow' src --include=*.tsx | grep -i textengine` finds all of them.

> [!warning] `overflow: hidden` also clips sideways, and an email cannot wrap
> The same one-line mask truncates horizontally. A string with no space, `@` or `.`
> break opportunity — an email address, a long URL — will not wrap to fit a narrow
> measure, so it is silently cut instead. `johnwu07@terpmail.umd.edu` at `text-display-sm`
> on a 390px viewport shipped as `johnwu07@terpmail.umd`. Set such strings at a step
> that fits the smallest measure and let them grow at `sm`/`lg`, and verify with a
> zoomed crop rather than a bounding-box measurement — the box reports the *container*
> width, which fits perfectly while the text inside it is being amputated.

Every display step also carries `text-wrap: balance`, so short headings even out their
line lengths instead of stranding a last word. Body copy is deliberately left greedy —
balancing is capped by browsers at a few lines and is a headline tool.

## Spacing and shape

`--spacing-gutter` (20 → 24px), `--spacing-page` (40 → 80px) and `--spacing-section`
(56 → 120px) are `clamp()`ed across the same 360–1440px range. `--radius-frame` is 1px:
corners are sharp on purpose, because this is an instrument, not a bubble.

> [!warning] The root font-size is a fixed 16px — do not reintroduce `vw` on `html`
> It used to be `vw`-based per breakpoint, which shrank the whole site by 11–20% at
> every width *between* breakpoints (9px mono labels at 1150px) and broke browser
> font-size preferences. All fluidity belongs in `clamp()` on the individual token.
> [[decisions-log]] ADR-0022.

## Atmosphere (`@layer components`)

| Class | What it does |
|---|---|
| `.grain` | fixed SVG `feTurbulence` grain plate on `::after`; multiply in the lab, screen in the darkroom |
| `.safelight-bloom` | off-centre radial warm glow, darkroom only |
| `.field-rules` | hairline column rules, the engineering-paper substrate |
| `.scroll-fade` | masks the right edge of a horizontally scrollable figure below `sm`, so the drawing runs under the plate border instead of being severed by it |

No CSS keyframes or transitions anywhere; the grain is static, which is also the
physically honest version.

## Design tokens

All colours, spacing, font sizes, radii, and shadows are **tokens** declared under
`:root` (raw values) and `@theme inline` (Tailwind bindings).

Once a token is in `@theme`, it becomes a utility automatically:

| Token | Generated utilities |
|-------|--------------------|
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--radius-card` | `rounded-card` |
| `--spacing-section` | `pt-section`, `mt-section`, … |

> [!important] The token rule
> **Never** hardcode hex values, pixel spacing, or named colours in `className` or
> inline styles. If a value doesn't exist as a token, **add it to `globals.css`
> first** — with a comment noting where it came from (e.g. a Figma frame).

## CSS layers

Every custom style goes inside a layer — never outside one:

```css
@layer base {        /* element resets & defaults: h1, p, a … */ }
@layer components {  /* pseudo-elements & 3rd-party overrides only — see below */ }
@layer utilities {   /* single-purpose helpers: .scrollbar-none … */ }
```

## Where a style goes (ADR-0012)

`globals.css` is **not** a place to park component styles — it holds tokens and
base resets and stays a few hundred lines forever. Follow this order; the first
match wins:

| Situation | Goes where |
|-----------|-----------|
| One-off styling | Tailwind utilities in `className` — nothing in CSS |
| Repeated pattern with markup / structure / props | a **React component** in `components/ui/` |
| Repeated *pure-utility* combo, no structure | a Tailwind v4 `@utility` |
| Pseudo-elements, 3rd-party DOM overrides, complex selectors | `@layer components` — the genuine exceptions |
| A new colour / spacing / radius value | a **token** in `:root` + `@theme` |

> [!important] The default answer to "this looks repeated" is a **React
> component**, not a CSS class. An eyebrow label with a `::before` dot is an
> `<Eyebrow>` component — not a `.label-eyebrow` global class. `@layer
> components` is for what utilities and components genuinely *cannot* express.

There are **no CSS Modules** in this project — utilities + components cover
every case (motion is spring-based, so there are no keyframes to co-locate).

## Styling rules

- Use utilities in JSX `className`; keep class strings short and readable.
- Extract a repeated pattern to a **React component** — not a `@layer
  components` class. See *Where a style goes* above (ADR-0012).
- Mobile-first responsive: `sm:` / `md:` / `lg:` / `xl:` prefixes.
- **No `dark:` prefix and no `prefers-color-scheme`.** Light and dark are not modes
  here, they are the two compartments, chosen by route and stamped as `data-theme` on
  `<html>`. Write `bg-paper text-ink` and let the token set resolve. ADR-0016.
- No inline `style` except for dynamic values (e.g. spring-animated values).

## Related

[[component-conventions]] · [[animation-system]] · [[new-page]]
