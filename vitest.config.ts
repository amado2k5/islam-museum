import { configDefaults, defineConfig } from "vitest/config";

// The one test that validates the whole repository (about 17,000 entities) is slow on a shared CI machine;
// fixture tests use validateAll(extra, { onlyExtra: true }) and check only their own entities. The generous
// timeout stays as a safety margin; no test is skipped and no rule is relaxed.
// workers/*/test use node:test, not vitest; the deploy and R2 HTML workflows run them
// with `node --test` (see .github/workflows/deploy.yml), so vitest must skip them.
export default defineConfig({
  test: {
    testTimeout: 300_000,
    hookTimeout: 60_000,
    exclude: [...configDefaults.exclude, "workers/**/test/**"],
  },
});
