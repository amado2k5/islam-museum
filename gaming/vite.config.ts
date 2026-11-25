// Dev server and lab builds for the gaming workspace. The production release build is tools/build.ts
// (content-addressed output plus a release manifest); this file only serves the workspace during development.
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("."),
  resolve: {
    alias: {
      "@im/kernel": r("./packages/kernel/src"),
      "@im/worldkit": r("./packages/worldkit/src"),
    },
  },
  server: { port: 4330, strictPort: true, host: "127.0.0.1" },
  build: { target: "es2023", outDir: r("./dist/dev"), emptyOutDir: true },
});
