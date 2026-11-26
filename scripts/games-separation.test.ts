// The website's side of the wall between the website and the games (founder's instruction, 25 November 2026):
// "make sure the existing islam museum build and deployment workflows do not deploy the games code or files or
// resources". A museum page may link to a game and the site may carry a Play page and a menu entry; the games' code
// and files are built, tested and deployed only by the games-*.yml workflows. The games' side of the same wall is
// guarded in their own suite, workers/games/test/separation.test.mjs.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");
const workflows = readdirSync(join(root, ".github/workflows")).filter((f) => f.endsWith(".yml"));
const website = workflows.filter((f) => !f.startsWith("games-"));
const GAMES_PATHS = ["gaming/**", "workers/games/**", "docs/gaming/**", ".github/workflows/games-*.yml"];
/** A workflow without its comments and without its paths-ignore lists, which are the one place it names the games. */
const code = (text: string) =>
  text
    .split("\n")
    .filter((line) => !GAMES_PATHS.some((p) => line.trim() === `- "${p}"`))
    .map((line) => line.replace(/(^|\s)#.*$/, ""))
    .join("\n");

describe("the website's workflows and the games", () => {
  it("no website workflow builds, tests, packs or deploys anything of the games", () => {
    expect(website.length).toBeGreaterThan(20);
    for (const name of website) {
      const text = code(read(`.github/workflows/${name}`));
      for (const forbidden of ["gaming/", "gaming ", "workers/games", "games-release", "games-build", "games-deploy", "games/r/", "games/channel"]) expect(text.includes(forbidden), `${name} mentions ${forbidden}`).toBe(false);
    }
  });

  it("the website's test and build workflows do not run for a change to the games alone", () => {
    for (const name of ["validate.yml", "build.yml"]) {
      const text = read(`.github/workflows/${name}`);
      for (const path of GAMES_PATHS) expect(text.includes(`- "${path}"`), `${name} does not ignore ${path}`).toBe(true);
      expect(text).toContain("paths-ignore:");
    }
  });

  it("the site Worker does not serve the games' folder, and the site's publish does not write or delete in it", () => {
    const route = read("workers/site/src/route.js");
    const dirs = route.match(/export const R2_DATA_DIRS = \[([^\]]*)\]/)![1]!;
    expect(dirs).not.toMatch(/"games"/);
    const wrangler = read("workers/site/wrangler.production.toml");
    for (const list of wrangler.matchAll(/^run_worker_first = \[(.*)\]$/gm)) expect(list[1]).not.toMatch(/"\/games/);
    expect(wrangler).not.toContain("islam-museum-games");
    const publish = read("workers/r2-sync/batch/publish.mjs");
    expect(publish).not.toMatch(/(dir|prefix): "games"/);
    expect(publish).not.toMatch(/"games\//);
    for (const config of ["workers/r2-sync/wrangler.toml", "workers/r2-sync/wrangler.production.toml"]) {
      for (const list of read(config).matchAll(/^ALLOWED_PREFIXES = "([^"]+)"/gm)) expect(list[1]!.split(",")).not.toContain("games/");
    }
  });

  it("the site imports nothing from the games' workspace", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.(astro|ts|tsx|js|mjs|svelte|json)$/.test(entry) && /(from\s+|import\(\s*|require\(\s*)["'][^"']*(\/gaming\/|workers\/games)/.test(readFileSync(path, "utf8"))) offenders.push(path.slice(root.length + 1));
      }
    };
    for (const dir of ["site/src", "scripts", "workers/site", "workers/r2-sync"]) walk(join(root, dir));
    expect(offenders).toEqual([]);
    for (const file of ["package.json", "site/package.json", "site/astro.config.mjs", "vitest.config.ts"]) expect(read(file), file).not.toMatch(/["'/]gaming\//);
  });
});
