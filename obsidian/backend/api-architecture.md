---
tags: [backend, api, stable]
updated: 2026-08-10
---

# API Architecture

How the app talks to external services. ADR: [[decisions-log]] ADR-0011.

> [!warning] Not available on the current host
> The site is a static export on GitHub Pages (ADR-0028). There is no server, so
> `app/api/**` Route Handlers fail the build. This pattern applies only if the site
> moves to a Node host (e.g. Vercel) — revisit ADR-0028 first.

## The one hard line

> The **browser never calls a third-party API directly and never holds a
> secret**. Every external call runs in server code; client components only
> call **same-origin `/api/*`**.

## `app/api` endpoints — the convention

API endpoints are Next.js Route Handlers: `src/app/api/<resource>/route.ts`.

- **One resource per folder** — `app/api/contact/route.ts`,
  `app/api/<resource>/[id]/route.ts` for items. Name folders by resource (noun).
- **The handler owns the work.** Business logic, calling one or more upstream
  services, filtering/transforming, and reading secret env vars all live in
  `route.ts`. There is no mandatory passthrough layer.
- **Secrets are safe here by construction** — `route.ts` is never bundled into
  the browser, so reading a secret env var directly in a handler is fine.

### Non-negotiables

1. **Validate input** with a `zod` schema (body + query) — never trust the
   client. Invalid input → `400`.
2. **Consistent envelope** — success `{ data }`, failure
   `{ error: { code, message, issues? } }`, correct status codes.
3. **Error handling** — never leak stack traces / upstream internals.
4. **Node runtime** (Fluid Compute on Vercel) — do **not** set `runtime = "edge"`.

### The `handle()` wrapper

`src/lib/api/` exports `handle()` and `ApiError`. Wrap every handler with
`handle()` — it produces the envelope and maps thrown errors (`ZodError` →
400, malformed JSON → 400, `ApiError` → its status, anything else → 500):

```ts
// src/app/api/contact/route.ts
import { z } from "zod";
import { getServerEnv } from "@/env";
import { ApiError, handle } from "@/lib/api";

const schema = z.object({ name: z.string().min(1), email: z.email() });

export const POST = handle(async (req) => {
  const input = schema.parse(await req.json());          // → 400 on bad input
  const { CONTACT_ENDPOINT } = getServerEnv();           // secret, server-only
  if (CONTACT_ENDPOINT) {
    const res = await fetch(CONTACT_ENDPOINT, { method: "POST", body: JSON.stringify(input) });
    if (!res.ok) throw new ApiError(502, "upstream_error", "Delivery failed.");
  }
  return { received: true };                             // → { data: { received: true } }
});
```

### Extract only when it pays

Keep logic in the route by default. Lift code into a shared module only when
it is **genuinely reused** across routes (an upstream client, a shared schema,
auth helpers). Don't pre-build a service layer.

## Environment & secrets

`src/env.ts` validates env with zod:
- `publicEnv` — `NEXT_PUBLIC_*` values, safe anywhere.
- `getServerEnv()` — server-only secrets; call from route handlers only.

Secret vars are **unprefixed** (`CONTACT_ENDPOINT`) — `NEXT_PUBLIC_` only for
values safe in the browser. See [[environment-variables]].

## Calling endpoints from the client

Client Components that fetch after mount use `apiFetch` from
`src/lib/api-client.ts` — it calls a same-origin `/api/*` path and unwraps the
envelope, throwing `ApiClientError` on failure. Render-time data is fetched in
Server Components instead (no client request at all).

## This project ships no `/api/*` routes

> [!important] The `contact` route above is an illustration, not a live file
> `app/api/contact/route.ts` was the starter's worked example and it shipped with the
> portfolio for a while. The site has no contact form by design
> ([[decisions-log]] ADR-0013 and `docs/portfolio-build-plan.md` §4), so nothing called
> it, and an unreferenced public `POST` that console-logs a submitted name, email and
> message is a surface with no purpose. The 2026-08-10 review pass deleted it, and every
> route in the build is now static.
>
> The convention on this page is unchanged and still applies to the first real endpoint
> John adds. `src/lib/api/` (`handle`, `ApiError`), `src/lib/api-client.ts` and
> `src/env.ts` all stay in place for it.

## Related

[[backend/README]] · [[environment-variables]] · [[routing]] · [[data-flow]] · [[tech-stack]]
