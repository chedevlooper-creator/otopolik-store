---
last_mapped_date: 2026-07-17
---

# Conventions

## Code Style
- React Functional Components using standard arrow or `export default function` syntax.
- Tailwind CSS heavily utilized for all styling (very few custom CSS rules, mostly utility classes).
- Use of CSS variables for some theming aspects in `globals.css` (e.g. `--background`, `--foreground`).

## File Naming
- PascalCase for React Components (e.g. `FeaturedProducts.tsx`).
- kebab-case or camelCase for utilities (e.g. `cms-defaults.ts`).

## Patterns
- Component architecture separates page-level routing (`src/app`) from pure UI logic (`src/components`).
- Interactive forms (`"use client"`) hold component-level state with `useState`.
