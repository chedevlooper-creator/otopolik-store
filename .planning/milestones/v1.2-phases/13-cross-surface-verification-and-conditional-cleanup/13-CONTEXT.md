# Phase 13: Cross-Surface Verification and Conditional Cleanup - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify the simplified storefront across desktop and mobile, ensuring conversion paths, accessibility, and admin AI are intact, and perform conditional cleanup (linting, typechecks, and scroll behavior decisions).

</domain>

<decisions>
## Implementation Decisions

### Critical path verification (VERIFY-01)
- **D-01:** Home → configurator → cart → checkout → WhatsApp flow works on both desktop and mobile viewports.

### Accessibility and motion (VERIFY-02)
- **D-02:** Motion allowlist is verified; transition/motion scales are disabled under `prefers-reduced-motion`.

### AI Isolation (VERIFY-03)
- **D-03:** Storefront customer AI remains hidden while admin functions and admin AI routes remain functional.

### Quality checks (VERIFY-04)
- **D-04:** TypeScript compilation and targeted ESLint rules are clean.

### Scroll behavior (VERIFY-05)
- **D-05:** Lenis is retained since native scroll shows no clear measured improvements.

</decisions>

<canonical_refs>
## Canonical References

- `src/app/globals.css` — main styles and animation transitions
- `src/components/configurator/MatConfigurator.tsx` — configurator page

</canonical_refs>

<code_context>
## Existing Code Insights

- All simplified pages compile and run correctly. Pre-existing lint issues are noted but no new violations were introduced.

</code_context>

<specifics>
## Specific Ideas

- Check and run all verification steps.

</specifics>

<deferred>
## Deferred Ideas

- None.

</deferred>
