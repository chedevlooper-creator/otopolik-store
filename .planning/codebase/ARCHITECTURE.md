---
last_mapped_date: 2026-07-17
---

# Architecture

## Pattern
The application follows a standard **Next.js App Router** architecture (React Server Components by default, Client Components where interaction is needed).

## Layers
1. **Frontend (Next.js)**:
   - Server Components (`src/app/page.tsx`, etc.) handle initial data fetching (or static rendering).
   - Client Components (`"use client"`) handle interactive state (e.g. `HeroMedia.tsx`, `HomeConfiguratorShowcase.tsx`).

2. **Backend (Convex)**:
   - Resides in `convex/`.
   - Exposes queries and mutations invoked via Convex React hooks in Client Components.

3. **Styling (Tailwind CSS v4)**:
   - Global tokens in `globals.css`.
   - Utility-first classes used heavily in TSX.

## Data Flow
- Initial static UI loaded from Next.js server.
- Interactive widgets (Configurator, Gallery) hydrate and manage state on the client.
- Database reads/writes use Convex queries/mutations.
