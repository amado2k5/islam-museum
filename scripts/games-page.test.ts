// The Games landing page (site/src/pages/[lang]/games/) names the games by hand, because the site imports nothing
// from the games' workspace. This keeps that hand-written list, its strings in all seven languages, and the two menu
// links in step with the games' registry, and holds the page to the games' production host.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const root = join(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");
const registry = (JSON.parse(read("gaming/games/registry.json")) as { games: Array<{ id: string; status: string }> }).games;
const page = read("site/src/pages/[lang]/games/index.astro");
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];

describe("the Games landing page", () => {
  it("lists every game of the registry that has a page, in the registry's order", () => {
    const listed = page.match(/const GAMES = \[([^\]]*)\]/)![1]!.split(",").map((s) => s.trim().replace(/"/g, ""));
    expect(listed).toEqual(registry.map((g) => g.id));
  });

  it("calls every game a prototype while the registry does", () => {
    expect(registry.every((g) => g.status === "prototype")).toBe(true);
    expect(page).toContain("{G.prototype}");
  });

  it("links to the games' production host, and to no test address", () => {
    expect(page).toContain('const HOST = "https://games.islam.museum"');
    expect(page).not.toContain("uat-games");
  });

  it("has its strings, and each game's name and description, in all seven languages", () => {
    for (const lang of LANGS) {
      const T = parse(read(`i18n/${lang}.yaml`)) as { nav: Record<string, string>; games: Record<string, unknown> & { items: Record<string, { name?: string; blurb?: string }> } };
      expect(T.nav.games, `${lang}: nav.games`).toBeTruthy();
      for (const key of ["title", "lede", "list", "status_title", "status_body", "history", "needs", "play", "opens", "prototype"]) expect(T.games[key], `${lang}: games.${key}`).toBeTruthy();
      for (const g of registry) {
        expect(T.games.items[g.id]?.name, `${lang}: ${g.id} name`).toBeTruthy();
        expect(T.games.items[g.id]?.blurb, `${lang}: ${g.id} blurb`).toBeTruthy();
      }
    }
  });

  it("is in the header and the footer of every page", () => {
    const layout = read("site/src/layouts/BaseLayout.astro");
    expect(layout.match(/href=\{`\/\$\{lang\}\/games\/`\}/g)?.length).toBe(2);
  });
});
