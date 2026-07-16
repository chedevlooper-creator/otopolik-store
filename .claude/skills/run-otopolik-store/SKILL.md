---
name: run-otopolik-store
description: Run, start, build, smoke-test, or screenshot the OTO POLİK storefront (Next.js dev server on :3000) — launches the app and drives it headless via the committed Playwright driver; use for "run the app", "screenshot the homepage", "does the site still render", "smoke test".
---

# Run OTO POLİK storefront

Next.js 16 (App Router) web app. It is driven headless with the
**Playwright driver committed in this skill dir**
(`.claude/skills/run-otopolik-store/driver.mjs`) — `chromium-cli` is
not available in this container. All paths below are relative to the
repo root.

## Prerequisites

**Use a Linux-native Node (≥20).** This repo lives on the WSL
filesystem; the default `PATH` often resolves to Windows npm
(`/mnt/c/Program Files/nodejs`), which fails on `\\wsl.localhost\...`
paths with `EISDIR`/`EPERM` during `npm install`. Check `which npm` —
if it points into `/mnt/c`, prepend a Linux node. In this container
one exists at:

```bash
export PATH="/tmp/node-v22.16.0-linux-x64/bin:$PATH"
```

No `apt-get` packages are needed: the app is a web server and the
driver uses Playwright's self-contained headless Chromium.

## Setup

```bash
npm install                       # repo deps (run with the Linux node!)
cd .claude/skills/run-otopolik-store
npm install                       # driver dep: playwright (~1.61)
npx playwright install chromium   # downloads headless chromium to ~/.cache/ms-playwright
cd ../../..
```

Do **not** use `playwright install --with-deps` — the dpkg step fails
in this WSL container on systemd/dbus packages. The browser-only
install is sufficient; pages render fine without the extra system
libs.

## Run + drive (agent path)

Start the dev server in the background and poll the port (don't
`sleep`-and-hope):

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000 > /tmp/otopolik-dev.log 2>&1 &
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
```

Then drive it with the committed driver (run from the skill dir):

```bash
cd .claude/skills/run-otopolik-store
node driver.mjs smoke            # visits /, /urunler, /olusturucu, /sepet + mobile home;
                                 # screenshots to ./screenshots/; exit 1 on console/page errors
node driver.mjs shot /olusturucu # single screenshot of a route
node driver.mjs shot / --width 390 --height 844 --out mobile.png
```

- Screenshots land in `.claude/skills/run-otopolik-store/screenshots/`
  (gitignored). **Look at them** — a rendered page with a broken
  section still exits 0 unless it throws.
- `SITE_URL=http://localhost:3001 node driver.mjs smoke` targets a
  different port.
- The driver auto-dismisses the cookie banner ("KABUL ET") so it
  doesn't cover the bottom of every screenshot.

Stop the server with `pkill -f "[n]ext dev"`. The brackets are not
decoration: a plain `pkill -f "next dev"` matches **your own shell's
command line** (it contains that text) and kills it — exit code 144,
no output. The `[n]` regex trick makes the pattern match the server
processes but not the literal `[n]ext dev` text in your own command.

## Build / lint / typecheck

```bash
npm run build      # Turbopack, ~2s compile + static gen; see gotcha below
npm run lint
npm run typecheck  # tsc --noEmit
```

## Run (human path)

`npm run dev` and open http://localhost:3000. Useless headless — use
the driver above.

## Gotchas

- **`npm run build` kills a running dev server** (they share
  `.next/`). Restart `npm run dev` after building.
- **If smoke exits 1 with `An empty string ("") was passed to the src
  attribute`**, a catalog product has an empty `image`/`gallery` value
  — a data bug, not a driver flake. With Convex configured
  (`.env.local` has a real `NEXT_PUBLIC_CONVEX_URL`) the storefront
  reads products from **Convex prod**, so fix the row there (via
  `/admin/urunler`, or a `products:update` mutation with the
  `ADMIN_SECRET` adminKey); the static fallback lives in
  `src/lib/products.ts`. This exact bug was hit and fixed on
  2026-07-16 ("İthal Halı Bagaj Paspası" had `image: ""`).
- **Convex is usually not configured in dev** (`NEXT_PUBLIC_CONVEX_URL`
  still the `.env.example` placeholder). That's normal: the storefront
  silently serves the static fallbacks (`products.ts`,
  `cms-defaults.ts`). Don't chase "why is Convex not connecting".
- **Pre-existing lint errors** (`react-hooks/set-state-in-effect` in
  `ConsentAnalytics.tsx`, `CookieConsent.tsx`, `Hero.tsx`) — `npm run
  lint` is red before you touch anything; don't treat as your
  regression.
- Playwright prints `BEWARE: your OS is not officially supported` on
  this WSL kernel — harmless, the fallback ubuntu build works.

## Troubleshooting

- `npm error EISDIR ... \\wsl.localhost\...` during install → you're on
  Windows npm; re-run with the Linux node on `PATH` (see
  Prerequisites).
- `curl http://localhost:3000` returns `000` after a build → the build
  killed the dev server; relaunch it (see Run).
- `Cannot find package 'playwright'` from the driver → you skipped the
  `npm install` inside the skill dir; the driver resolves playwright
  from its own `node_modules`, not the repo's.
