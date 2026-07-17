---
last_mapped_date: 2026-07-17
---

# Structure

## Directory Layout
- `.agents/` - GSD project planning and skill instructions.
- `.planning/` - GSD meta-planning documents (codebase mapping, roadmap, etc.).
- `convex/` - Backend logic, schema, and API methods for Convex DB.
- `public/` - Static assets, images, icons, and fonts.
- `scripts/` - Build and data processing scripts (e.g. `generate-gallery-data.js`).
- `src/`
  - `app/` - Next.js App Router (pages, layouts, globals.css).
  - `components/` - Shared UI components (Header, Footer, Logo, etc.).
    - `home/` - Homepage-specific components (Hero, ConfiguratorShowcase, Faq, etc.).
  - `lib/` - Utility functions, constants, and structured data schemas.

## Key Locations
- **Global Styles**: `src/app/globals.css`
- **Main Configurator**: `src/components/home/HomeConfiguratorShowcase.tsx`
- **Hero Video/Image**: `src/components/home/HeroMedia.tsx`
