# AGENTS.md

Project-specific guidance lives in `CLAUDE.md` (architecture, design system, conventions). Read it first. This file adds environment/run notes for Cursor Cloud agents.

## Cursor Cloud specific instructions

The startup update script already runs `npm install`, so dependencies are present when a session begins. Node 20+ is required (VM has v22).

### Services

This is a single Next.js 16 (App Router) storefront + a Convex backend. See `CLAUDE.md` for the data layer and `DEPLOY.md` for the deploy flow.

| Service | Command | Notes |
|---|---|---|
| Next.js dev server | `npm run dev` (http://localhost:3000) | Primary app. Reads `.env.local`. |
| Convex backend | `CONVEX_AGENT_MODE=anonymous npx convex dev` | Optional locally; the storefront falls back to static files (`src/lib/products.ts`, `cms-defaults.ts`) when `NEXT_PUBLIC_CONVEX_URL` is unset/placeholder. Required to test orders, admin CRUD, and uploads. |

Standard commands (lint/typecheck/build/test) are in `package.json` and `CLAUDE.md` — don't duplicate them here.

### Running Convex locally (non-obvious)

- There is **no cloud Convex login** in this environment. Use `CONVEX_AGENT_MODE=anonymous` to spin up a **local** anonymous deployment (listens on `127.0.0.1:3210`, dashboard-less). Without `CONVEX_AGENT_MODE=anonymous`, `npx convex` commands try to log in and will hang/fail.
- `npx convex dev --once` deploys the schema/functions and then **exits, stopping the local backend**. To keep Convex serving alongside `npm run dev`, run `CONVEX_AGENT_MODE=anonymous npx convex dev` (no `--once`) as a long-lived process (e.g. its own tmux session).
- Running `convex dev` writes `NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210` (and `CONVEX_DEPLOYMENT=anonymous:...`) into `.env.local`. **Start Convex before `npm run dev`**, or restart the Next.js dev server afterward, so it picks up the local Convex URL (env is read at server start).
- Create `.env.local` (gitignored) if missing. Minimum for full E2E: set `ADMIN_PASSWORD` and `ADMIN_SECRET` to any dev values, and set the **same** `ADMIN_SECRET` on Convex: `CONVEX_AGENT_MODE=anonymous npx convex env set ADMIN_SECRET "<value>"`. Admin-gated Convex functions (`seed:*`, `cms:*`, `orders:listAll`, admin CRUD) require this `adminKey`.
- Seed data after the backend is up: `CONVEX_AGENT_MODE=anonymous npx convex run seed:seedProducts '{"adminKey":"<ADMIN_SECRET>"}'` and `... cms:seedCms '{"adminKey":"<ADMIN_SECRET>"}'` (loads 7 products + CMS content).

### AI features

AI (`/api/ai/*`, admin content generator) is gated off unless a real `ANTHROPIC_API_KEY` is set and `AI_FEATURES_ENABLED !== false`. Core commerce works without it; leave `AI_FEATURES_ENABLED=false` when no key is available.

### Checkout note

Checkout has no payment gateway: submitting an order opens a `wa.me` WhatsApp deep link (a browser popup to open the external app is expected — dismissing it still shows the web fallback) and writes the order to Convex best-effort, then redirects to `/tesekkurler`. Verify persistence with `orders:listAll`.
