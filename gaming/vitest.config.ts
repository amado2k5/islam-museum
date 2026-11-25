// Gaming tests are named *.gtest.ts so the museum's root vitest run (which has no include filter and no gaming
// dependencies installed) never collects them, and the museum's tests are never collected here.
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("."),
  resolve: { alias: { "@im/kernel": r("./packages/kernel/src"), "@im/worldkit": r("./packages/worldkit/src"), "@im/atlas": r("./games/atlas/src"), "@im/audio": r("./packages/audio/src"), "@im/golden-age": r("./games/golden-age/src"), "@im/granada": r("./games/granada/src") } },
  // The time allowance is generous on purpose. Several tests play hundreds of whole campaigns and take two or three
  // seconds on a fast machine; under load, or on a hosted runner, the default five seconds made three of them fail
  // by the clock while every assertion held (seen on 25 November 2026 while the museum's suite ran beside them).
  // No assertion depends on time.
  test: { include: ["**/*.gtest.ts"], exclude: ["node_modules/**", "dist/**"], environment: "node", testTimeout: 120_000 },
});
