---
tags: [architecture, stable]
updated: 2026-10-14
---

# Tech Stack

Every dependency in `package.json`, what it does, and why it is here.
Package name: `next16-claude-starter` · version `0.1.0` · private.

## Core framework

| Package | Version | Role |
|---------|---------|------|
| `next` | `16.2.0` | App Router framework. ⚠️ See warning below. |
| `react` / `react-dom` | `19.2.4` | UI runtime |
| `typescript` | `^5` | Type system — `any` is banned |

> [!warning] This is not the Next.js you may know
> `AGENTS.md` warns: APIs, conventions, and file structure may differ from older
> Next.js knowledge. Always check [[routing]] before writing routing code, and
> heed deprecation notices.

## Styling

| Package | Version | Role |
|---------|---------|------|
| `tailwindcss` | `^4` | Utility CSS — **no `tailwind.config.js`** |
| `@tailwindcss/postcss` | `^4` | PostCSS integration |

Tailwind v4 is configured entirely in `src/app/globals.css` via `@theme inline`.
See [[design-system]].

## Animation (the heart of the starter)

| Package | Version | Role |
|---------|---------|------|
| `@react-spring/web` | `^10.0.3` | Spring physics — drives **all** motion |
| `spring-text-engine` | `^0.1.5` | Scroll-aware spring text animation |

No `framer-motion`, no CSS transitions/keyframes. See [[animation-system]] and
[[text-engine]]. ADR: [[decisions-log]] ADR-0002.

## Scroll & state

| Package | Version | Role |
|---------|---------|------|
| `lenis` | `^1.3.19` | Smooth scrolling |
| `zustand` | `^5.0.12` | Lightweight global state (scroll store) |
| `resize-observer-polyfill` | `^1.5.1` | ResizeObserver fallback for animation hooks |
| `zod` | `^4.4.3` | Schema validation — env (`src/env.ts`) + API payloads. See [[api-architecture]] |

See [[smooth-scroll]] and [[data-flow]].

## Misc

No miscellaneous runtime dependencies. Cookie consent was an in-house component
(`src/components/common/Cookie/`), deleted 2026-08-10 after six weeks unreferenced —
it was built on Zustand + `@react-spring/web`, and the
former `react-cookie-consent` package was removed. See [[components/common]].

## Tooling

| Package | Role |
|---------|------|
| `eslint` `^9` + `eslint-config-next` | Linting — run `yarn lint` before commits |
| `@types/*` | Type definitions for node/react |

## Scripts

```bash
yarn dev      # next dev — local development
yarn build    # next build — production build
yarn start    # next start — serve production build
yarn lint     # eslint
```

Package manager: **Yarn** (`yarn.lock` is committed).

## Typefaces (`next/font/google`)

No new npm dependency; all three are self-hosted at build time by `next/font`.

| Family | Weights | Variable | Used for |
|---|---|---|---|
| Fraunces | variable — `wght`, `opsz` 9–144, `SOFT`, `WONK` | `--font-fraunces` | display |
| Instrument Sans | variable | `--font-instrument-sans` | body and UI |
| IBM Plex Mono | 400, 500 | `--font-plex-mono` | labels, units, telemetry |

Replaces **Onest**, which the starter shipped and which is no longer imported.
Fraunces in turn replaced **Instrument Serif** as the display face — see
[[decisions-log]] ADR-0023. Its `opsz` axis is set per type step in `globals.css`;
`WONK` is pinned to 0.

> [!warning] The variable classNames are applied to `<html>`, not `<body>`
> `globals.css` composes them into `:root` design tokens. A custom property is
> substituted where it is declared, so a `:root` token cannot see a variable defined on
> a descendant, and every font falls back silently with no error.
> [[decisions-log]] ADR-0017.

## Hosting

Static export (`output: "export"` → `out/`) deployed to **GitHub Pages** at
`https://johnw-07.github.io` by `.github/workflows/deploy.yml` on push to `main`.
No server at runtime — no Route Handlers, `headers()`/`cookies()`, middleware, or
image optimisation (`images.unoptimized: true`). See ADR-0028 in [[decisions-log]].

## Not yet in the stack

Auth, database/ORM, payments, i18n, data-fetching libraries. The original starter
spec listed these as "add as needed" placeholders. Document them here when adopted,
and add an ADR to [[decisions-log]].

## Related

[[system-overview]] · [[folder-structure]]
