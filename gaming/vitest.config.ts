// Gaming tests are named *.gtest.ts so the museum's root vitest run (which has no include filter and no gaming
// dependencies installed) never collects them, and the museum's tests are never collected here.
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("."),
  resolve: { alias: { "@im/kernel": r("./packages/kernel/src"), "@im/worldkit": r("./packages/worldkit/src"), "@im/atlas": r("./games/atlas/src") } },
  test: { include: ["**/*.gtest.ts"], exclude: ["node_modules/**", "dist/**"], environment: "node" },
});
