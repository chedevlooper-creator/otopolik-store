# Deferred Items

- `npm test -- --run` executes Playwright specs under Vitest. The 15 Vitest suites and 110 unit tests pass, but `tests/configurator.spec.ts` and `tests/gallery.spec.ts` fail at collection because Playwright's `test.describe()` cannot run inside Vitest. This pre-existing test-runner boundary is unrelated to Plan 09-02; targeted Phase 9 Vitest tests pass.
