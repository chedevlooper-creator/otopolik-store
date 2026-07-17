---
last_mapped_date: 2026-07-17
---

# Testing

## Frameworks
Currently, the project does not have a formal test suite (Jest, Cypress, or Playwright) configured for continuous integration.
- `.playwright-cli` folder exists, suggesting Playwright might have been evaluated or used in an ad-hoc manner, but no standard test scripts exist in `package.json`.

## Best Practices
- Focus on manual visual testing and hydration checking (React Server Components vs Client Components).
- TypeScript typing provides compile-time correctness for props and state.
