// Runs before every test file (vitest.config.ts, setupFiles). It gives the event loop a turn before each test.
//
// Several test files do long synchronous work (validating or rendering the whole repository: 5 to 45 seconds a test).
// Between two such tests the worker has to answer vitest's messages to the main process; if it never gets a free turn
// for 60 seconds, vitest fails the run with "[vitest-worker]: Timeout calling onTaskUpdate" even though every test passed,
// and the Build workflow then cancels the whole build because "the tests failed". That happened to two of three pull
// request runs and to the first build of the fix for the open-ended date on 6 November 2026 (373 tests passed, 1 error).
// Only scripts/pipeline.test.ts and scripts/khutab.test.ts used to yield; this does it for all of them.
// No test is skipped and no rule is relaxed: a test that fails still fails.
import { beforeEach } from "vitest";

beforeEach(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
