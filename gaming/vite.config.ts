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
      "@im/atlas": r("./games/atlas/src"),
      "@im/audio": r("./packages/audio/src"),
      "@im/golden-age": r("./games/golden-age/src"),
      "@im/granada": r("./games/granada/src"),
      "@im/hudhud": r("./games/hudhud/src"),
    },
  },
  // The model loader is asked for only when a model is fetched, after the page is up. Named here so that the dev
  // server has it ready and does not stop to re-bundle its dependencies in the middle of a page (which fails that fetch).
  optimizeDeps: { include: ["three/addons/loaders/GLTFLoader.js"] },
  server: { port: 4330, strictPort: true, host: "127.0.0.1" },
  build: { target: "es2023", outDir: r("./dist/dev"), emptyOutDir: true },
});
