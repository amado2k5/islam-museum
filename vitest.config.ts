import { defineConfig } from "vitest/config";

// Several pipeline tests validate the whole repository (about 7,200 entities, 690 prose files), which takes
// 3 to 5 seconds locally and longer on a shared CI runner. The default 5-second limit made the deploy fail
// on timeouts, not on a rule. The limit is raised here; no test is skipped and no rule is relaxed.
export default defineConfig({
  test: { testTimeout: 60_000, hookTimeout: 60_000 },
});
