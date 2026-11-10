import { describe, expect, it } from "vitest";
// @ts-expect-error plain ES module without types
import { changedShellStrings, i18nPathsRead, summarize } from "../tools/deploy/shell-impact.mjs";
// @ts-expect-error plain ES module without types
import { isShellPath, parseShellPaths, shellPaths } from "../tools/deploy/shell-paths.mjs";
import { existsSync } from "node:fs";
import { p } from "./lib";

describe("shell files", () => {
  it("lists the layouts and the inlined stylesheet, and not the shell scripts, which are single files", () => {
    expect(isShellPath("site/src/layouts/BaseLayout.astro")).toBe(true);
    expect(isShellPath("site/src/lib/nav.ts")).toBe(true);
    expect(isShellPath("site/src/styles/global.css")).toBe(true);
    expect(isShellPath("site/public/shell/shell.js")).toBe(false);
    expect(isShellPath("site/src/components/Tour3D.astro")).toBe(false);
    expect(isShellPath("content/ar/person/x.md")).toBe(false);
  });
  it("matches a listed folder by its contents, not by a name that merely starts the same", () => {
    expect(isShellPath("site/src/layouts/Other.astro", ["site/src/layouts"])).toBe(true);
    expect(isShellPath("site/src/layouts-old/x.astro", ["site/src/layouts"])).toBe(false);
  });
  it("ignores comments and blank lines", () => {
    expect(parseShellPaths("# c\n\n a/b \n#d\nc/d\n")).toEqual(["a/b", "c/d"]);
  });
  it("names only files that exist, so the list cannot rot", () => {
    for (const path of shellPaths()) expect(existsSync(p(path)), path).toBe(true);
  });
});

describe("shell strings", () => {
  it("reads the i18n paths a component uses", () => {
    const src = `const T = ui(lang);\n<a>{T.nav.more}</a> {T["footer"].support} {T.wings[w].title} {T.nav.donate.length} {T.a11y.menu_open}`;
    expect(i18nPathsRead(src)).toEqual(["a11y.menu_open", "footer.support", "nav.donate", "nav.more", "wings"]);
  });
  it("flags only the shell strings whose value changed, whatever the key order", () => {
    const base = { nav: { more: "More", today: "Today" }, landing: { hero: "A" }, wings: { time: { title: "Time" } } };
    const head = { wings: { time: { title: "Time" } }, landing: { hero: "B" }, nav: { today: "Today", more: "More" } };
    expect(changedShellStrings(base, head, ["nav.more", "nav.today", "wings"])).toEqual([]);
    expect(changedShellStrings(base, { ...head, nav: { more: "Menu", today: "Today" } }, ["nav.more", "nav.today"])).toEqual(["nav.more"]);
    expect(changedShellStrings(base, { ...head, wings: { time: { title: "Times" } } }, ["wings"])).toEqual(["wings"]);
  });
});

describe("summary", () => {
  it("is quiet for a content change and loud for a shell change", () => {
    expect(summarize({ shellFiles: [], strings: [] }).rewrites).toBe(false);
    const s = summarize({ shellFiles: ["site/src/layouts/BaseLayout.astro"], strings: ["i18n/en.yaml: nav.more"] });
    expect(s.rewrites).toBe(true);
    expect(s.text).toContain("BaseLayout.astro");
    expect(s.text).toContain("nav.more");
    expect(s.text).toContain("164,000");
  });
});
