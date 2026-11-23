// A folder of data or media that is published to R2 has to be named in every place that decides where a file
// may go. Missing one place fails the deploy only at its R2 step, after the build was found, the Workers were
// deployed and thousands of files were already sent (the podcast folder, 20 November 2026: the sync Worker
// refused `podcast/…` because its ALLOWED_PREFIXES list did not have it). This test reads the lists as text and
// fails in pull requests instead.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

// Folders of site/public that stay on Cloudflare Pages (code and logic, not data). Everything else under
// site/public is data and must be published to R2.
const PAGES_ONLY = new Set(["shell", "vendor", ".well-known"]); // .well-known holds only api-catalog, a root file (ROOT_FILES)
// Generated at build time, not in site/public, but published to R2 like the others.
const GENERATED_R2 = ["timeline-data"];

const quoted = (s: string) => [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

// publish.mjs: the language search indexes, the API, and the list of shared data folders.
const publish = read("workers/r2-sync/batch/publish.mjs");
const publishDirs = [...publish.matchAll(/\{ dir: "([\w-]+)", prefix: "[\w-]+", cacheControl: "public, max-age=(?:31536000|3600)/g)].map((m) => m[1]);
const publishShared = quoted(publish.match(/\.\.\.\[([^\]]+)\]\.map\(\(d\) => \(\{ dir: d, prefix: d/)![1]);
const r2Dirs = [...new Set([...publishDirs, ...publishShared])].sort();

describe("every folder published to R2 is registered everywhere", () => {
  it("finds the publish list", () => {
    expect(publishShared).toContain("media");
    expect(r2Dirs).toContain("api");
  });

  it("route.js R2_DATA_DIRS carries every shared data folder and every search index", () => {
    const route = read("workers/site/src/route.js");
    const dirs = quoted(route.match(/export const R2_DATA_DIRS = \[([^\]]+)\]/)![1]);
    for (const d of r2Dirs.filter((x) => x !== "api")) expect(dirs, `R2_DATA_DIRS lacks ${d}`).toContain(d);
  });

  it("each sync Worker environment allows every R2 folder", () => {
    const toml = read("workers/r2-sync/wrangler.production.toml");
    const lines = toml.split("\n").filter((l) => l.startsWith("ALLOWED_PREFIXES"));
    expect(lines.length).toBeGreaterThanOrEqual(2);
    for (const line of lines) {
      const allowed = line.match(/"([^"]*)"/)![1].split(",");
      for (const d of r2Dirs) expect(allowed, `ALLOWED_PREFIXES lacks ${d}/`).toContain(`${d}/`);
      for (const l of ["ar", "en", "ur", "fr", "es", "tr", "id"]) expect(allowed, `ALLOWED_PREFIXES lacks ${l}/`).toContain(`${l}/`);
    }
  });

  it("each site Worker environment runs first for every R2 folder", () => {
    const toml = read("workers/site/wrangler.production.toml");
    const lines = toml.split("\n").filter((l) => l.startsWith("run_worker_first"));
    expect(lines.length).toBeGreaterThanOrEqual(2);
    for (const line of lines) {
      const globs = quoted(line);
      for (const d of r2Dirs.filter((x) => x !== "api")) expect(globs, `run_worker_first lacks /${d}/*`).toContain(`/${d}/*`);
    }
  });

  it.each(["deploy-env.yml", "deploy-shared-env.yml", "deploy-lang-env.yml"])("%s keeps R2 folders off Pages", (name) => {
    const text = read(`.github/workflows/${name}`);
    const excludes = [...text.matchAll(/--exclude=\/([\w-]+)/g)].map((m) => m[1]);
    if (!excludes.length) return; // a workflow that does not build the assets-only folder
    for (const d of r2Dirs.filter((x) => !x.startsWith("pagefind-") || name !== "deploy-lang-env.yml")) {
      expect(excludes, `${name} does not exclude /${d}`).toContain(d);
    }
  });

  it("the root-file rules agree in the Worker, the publisher and the site", () => {
    const sync = read("workers/r2-sync/src/index.js").match(/export const ROOT_FILES = (\[.*\]);/)![1];
    const pub = publish.match(/const ROOT_FILES = (\[.*\]);/)![1];
    const site = read("workers/site/src/route.js").match(/export const R2_ROOT_FILES = (\[.*\]);/)![1].replaceAll("^\\/", "^");
    expect(pub).toBe(sync);
    expect(site.replaceAll("\\/\\.well-known", "\\.well-known")).toBe(sync);
  });

  it("every folder of site/public is on R2 or named as Pages-only here", () => {
    const pub = join(root, "site/public");
    const dirs = readdirSync(pub).filter((e) => statSync(join(pub, e)).isDirectory());
    for (const d of dirs) {
      if (PAGES_ONLY.has(d)) continue;
      expect(r2Dirs, `site/public/${d} is neither published to R2 (publish.mjs, route.js, both wrangler files, both exclude lists) nor in PAGES_ONLY`).toContain(d);
    }
    for (const d of GENERATED_R2) expect(r2Dirs).toContain(d);
  });
});
