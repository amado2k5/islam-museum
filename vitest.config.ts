import { configDefaults, defineConfig } from "vitest/config";

// The one test that validates the whole repository (about 17,000 entities) is slow on a shared CI machine;
// fixture tests use validateAll(extra, { onlyExtra: true }) and check only their own entities. The generous
// timeout stays as a safety margin; no test is skipped and no rule is relaxed.
// workers/*/test use node:test, not vitest; the deploy and R2 HTML workflows run them
// with `node --test` (see .github/workflows/deploy.yml), so vitest must skip them.
//
// Memory: the compiled graph is 549 MB of JSON and about 2 GB in memory each time a test file loads it, and the
// whole-repository tests (pipeline, build-graph) each need 5 to 7 GB. On a hosted runner (4 CPUs, 16 GB) vitest runs
// three test files at once, and when two or three of the heavy ones overlap the runner is shut down in the middle of
// `npm test` ("The runner has received a shutdown signal"): runs 44736140498, 44738042244 and 44742628818 of
// "Build islam.museum by language" on 20 November 2026, each two to three minutes in. On CI (the CI variable that
// GitHub sets) the files run one after the other, so only one heavy file is in memory at a time. Nothing is skipped
// and no assertion changes; the suite takes longer in CI, locally it keeps all cores.
const ci = Boolean(process.env.CI);

export default defineConfig({
  test: {
    pool: "forks",
    poolOptions: { forks: ci ? { minForks: 1, maxForks: 1 } : {} },
    testTimeout: 300_000,
    hookTimeout: 60_000,
    exclude: [...configDefaults.exclude, "workers/**/test/**"],
    // Gives the event loop a turn before every test, so long synchronous tests cannot starve vitest's own messages
    // ("Timeout calling onTaskUpdate"). See scripts/vitest-setup.ts.
    setupFiles: ["./scripts/vitest-setup.ts"],
  },
});
