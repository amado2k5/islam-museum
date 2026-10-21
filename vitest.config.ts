import { configDefaults, defineConfig } from "vitest/config";

// Several pipeline tests validate the whole repository synchronously on every
// test (about 16,900 entities and 2,000 prose files as of Oct 2026), which takes
// 60 to 90 seconds in a worker on a shared machine and longer on CI. The 60-second
// limit made the suite fail on timeouts, not on a rule. The limit is raised here;
// no test is skipped and no rule is relaxed.
// workers/*/test use node:test, not vitest; the deploy and R2 HTML workflows run them
// with `node --test` (see .github/workflows/deploy.yml), so vitest must skip them.
export default defineConfig({
  test: {
    testTimeout: 300_000,
    hookTimeout: 60_000,
    exclude: [...configDefaults.exclude, "workers/**/test/**"],
  },
});
