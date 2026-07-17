---
last_mapped_date: 2026-07-17
---

# Concerns

## Technical Debt & Ongoing Refactoring
- **Aesthetics Migration**: The app is currently undergoing a visual transformation to a "Sleek Luxury" aesthetic (Porsche/Apple style). Many legacy `--sand` or beige styles might still exist as dead code or in un-updated components and need to be systematically audited and replaced with white/black/red palettes.
- **Image Optimization**: Hard-coded images and potentially large un-optimized assets in `public/media/` may affect page load performance on slow networks.
- **Responsiveness**: The site layout was recently updated to scale smoothly on ultra-wide desktop monitors (1536px+), but custom breakpoints may need constant verification on mobile versus desktop.
