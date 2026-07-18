# AGENTS.md — OTO POLİK storefront (Next.js 16 + Convex + Anthropic)

Compact agent-facing notes for this repo. Every line is something an agent
would likely get wrong without it. Most strings are Turkish; the admin area
and API error codes are too.

## Stack & boundaries

- **Next.js 16 App Router**, Turbopack dev. Convex cloud backend (no local
  Convex process — product/catalog data comes from `NEXT_PUBLIC_CONVEX_URL`).
  Deploy region `fra1` (Vercel + `vercel.json`).
- **Convex backend lives in `convex/`** — `schema.ts` (single-file schema,
  Convex CLI auto-migrates), `products.ts`, `orders.ts`, `cms.ts`,
  `siteSettings.ts`, `contentGenerations.ts`. `convex/_generated/` is
  codegen — never hand-edit, ESLint ignores it.
- **App entrypoints**: `src/app/layout.tsx` (root, async server component —
  pre-fetches settings/SEO/products, wires `ConvexClientProvider` →
  `SettingsProvider` → `CmsProvider` → `CatalogProvider`). `src/proxy.ts`
  is the Next.js 16 middleware replacement (was `middleware.ts`) — protects
  `/admin/:path*`, nothing else.
- **Admin APIs**: `src/app/api/admin/{ai,convex-key}/`, `src/lib/admin-auth.ts`.
  `src/app/api/ai/{chat,support,vehicle-match,status}/`. Admin auth is
  HMAC-SHA256 cookie (`admin_session`); secret = `ADMIN_SECRET` or falls back
  to `ADMIN_PASSWORD` — the same value must be set in both Vercel and Convex
  env (`npx convex env set ADMIN_SECRET …`).
- **Cart is client-only**: `src/lib/cart-store.ts` is a hand-rolled
  `useSyncExternalStore` store keyed on `otopolik-cart` in `localStorage`,
  server snapshot always `[]`. No cart state in Convex.
- **Graceful degradation**: `src/lib/convex-client.ts` & `convex-server.ts`
  return null / `isConvexConfigured() === false` when the URL is missing or
  contains `your-deployment`. The site renders with fallbacks — don't assume
  Convex calls always succeed. `src/lib/ai/config.ts` guards AI likewise
  (feature flags + placeholder-key detection).

## Commands

```bash
npm install
npm run dev          # http://localhost:3000 — no build step (Turbopack lazy)
npm run build        # next build
npm run lint         # eslint (flat config in eslint.config.mjs)
npm run typecheck    # tsc --noEmit
```

**Tests — the order and excludes matter**:

| command | what | gotcha |
|---|---|---|
| `npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"` | unit suite (57 tests, ~1s) | **plain `npm test` (= `vitest run`) fails** — vitest also picks up the Playwright specs in `tests/` and throws "did not expect test.describe()". The `npm run ai:eval:*` scripts have the same bug (they're `vitest run <file>` without excludes); invoke the file directly as below instead. |
| `npx vitest run src/lib/ai/evals/vehicle-match-eval.test.ts` (and the three sibling `*-eval.test.ts` files) | AI golden evals | **Offline, no `ANTHROPIC_API_KEY` needed** — these test pricing/tools/golden-case shape, not live model calls. The `ai:eval:*` npm scripts wrap them but inherit the `tests/**` collision risk if `tests/` isn't excluded. |
| `npx playwright test` | E2E (config reuses a running dev server on :3000, or starts one) | `tests/configurator.spec.ts` has a **known stale failure**: asserts step label `"Aracınız"` but the UI now renders `"Araç"` (copy changed). Not an app bug — don't "fix" the component for this. `tests/gallery.spec.ts` passes. |

Recommended pre-commit gate: `npm run lint && npm run typecheck && npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"`.

A committed Playwright driver exists for agent-driven smoke checks:
`.claude/skills/run-otopolik-store/driver.mjs` — see that skill for `smoke`,
`ss`, `dom` subcommands and screenshots under `.claude/skills/run-otopolik-store/shots/`.

## Dev-server gotchas (Windows / Next 16)

- **`npm run dev` exits if a server for this dir is already running** — Next 16
  detects the live PID and refuses a second instance; it also grabs port
  3001 first, so a naive "wait for port" check deadlocks. Curl `:3000` and
  reuse the live server, or `taskkill /PID <pid> /F` (printed in the error).
- **Cookie-consent banner** (`ÇEREZ VE GİZLİLİK`, bottom-left) intercepts
  clicks on first visit. Dismiss via `button:has-text("KABUL ET")` before
  driving lower-page elements in Playwright.
- **Most products require vehicle fields before add-to-cart** — "Sepete Ekle"
  silently no-ops (focuses the brand field) until `#product-vehicle-brand`,
  `-model` (enabled only after brand), `-year`, `-body` are filled. Same
  pattern with `configurator-vehicle-*` ids on `/olusturucu`.
- **Hydration lag**: dev routes compile lazily; wait ~1.5–2s after
  `domcontentloaded` before clicking (the e2e specs wait 2s; the driver 1.5s).
- **Git Bash mangles `/route` args** via MSYS path rewrites
  (`/urunler` → `C:/Program Files/Git/urunler`). The committed driver strips
  this prefix; any ad-hoc script taking `/route` args needs the same fix, or
  run it from PowerShell.

## Env (`.env.local`, git-ignored; `.env.example` is the template)

Required to do anything useful:
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL. Without it the storefront
  falls back to placeholder data; with it, all catalog comes from the cloud.
- `ANTHROPIC_API_KEY` + `AI_FEATURES_ENABLED=true` — gates `src/app/api/ai/*`
  (configurator chat uses `claude-sonnet-5`, support `claude-sonnet-5`,
  vehicle-match `claude-haiku-4-5`, content-gen `claude-opus-4-8`; see
  `src/lib/ai/config.ts`). `CUSTOMER_AI_UI_ENABLED` only toggles the customer
  AI surface, not admin AI or `/api/ai/*`.
- `ADMIN_PASSWORD` (and preferably `ADMIN_SECRET`) — `/admin` login + HMAC
  cookie. Must match across Vercel and Convex env. Never deploy `admin123`.

Rate limiter (`src/lib/ai/rate-limit.ts`) is **process-local** (10 req/min/IP).
On multi-instance Vercel it's a soft limit only — note this if touching AI.

## Conventions worth preserving

- `@/*` path alias → `./src/*` (tsconfig + vitest alias; ESLint flat config).
- Server-only modules `import "server-only"` (`admin-auth.ts`,
  `convex-server.ts`) — keep Convex/analytics secrets out of client bundles;
  never re-export their internals from client code.
- Path arg quoting on Windows: always quote `/route` literals.
- `next.config.ts` whitelists `*.convex.cloud` image hosts and
  `dangerouslyAllowSVG: true` with a strict CSP on `/media/(.*)` (immutable cache).
- Convex schema migrations happen on `npx convex dev` / `deploy`; there is no
  separate migration step — edit `convex/schema.ts` and run the CLI.
- Gallery pipeline scripts: `npm run gallery:optimize` /
  `gallery:generate` (`scripts/*.js`) — run when `public/` gallery assets
  change; output feeds the `/galeri` page.

## Where to read more

- `.claude/skills/run-otopolik-store/SKILL.md` — authoritative for running
  the app, the Playwright driver, and known test gotchas (authoritative on the
  `npm test` failure and the stale `configurator.spec.ts`).
- `.env.example` — authoritative env var list + Vercel deploy notes.
