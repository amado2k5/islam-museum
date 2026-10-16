import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";

const run = (script: string) =>
  execFileSync("npx", ["tsx", `scripts/${script}`], { encoding: "utf8", timeout: 60000 });

describe("museum cards data", () => {
  it("word-map JSON files are well-formed", () => {
    const dir = "cards/wordmap";
    const files = readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "index.json");
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
      expect(d.slug).toBe(f.replace(/\.json$/, ""));
      expect(d.forms.length).toBeGreaterThan(0);
    }
  });
  it("list decks validate", () => {
    expect(run("cards-lists-validate.ts")).toMatch(/decks OK/);
  });
  it("explainer decks validate", () => {
    expect(run("cards-explainers-validate.ts")).toMatch(/decks OK/);
  });
  it("story decks validate", () => {
    expect(run("cards-stories-validate.ts")).toMatch(/decks OK/);
  });
});
