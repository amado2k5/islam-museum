// The words: every script is whole, every line exists in all seven languages, no wall of text, no dead end, and no
// invented sentence dressed as a quotation.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SCRIPTS, THINGS } from "../content/workshop";
import { MAX_ESSENTIAL_LINES, back, choicesOf, choose, faults, forward, open } from "../narrative/dialogue";

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;

describe("the scripts", () => {
  it.each(LANGS)("have no fault against the %s strings", (lang) => {
    expect(faults(SCRIPTS, table(lang))).toEqual([]);
  });
  it("never hold the player for more than three short lines", () => {
    const en = table("en");
    for (const [name, s] of Object.entries(SCRIPTS)) {
      for (const [id, n] of Object.entries(s.nodes)) {
        expect(n.lines.length, `${name}.${id}`).toBeLessThanOrEqual(MAX_ESSENTIAL_LINES);
        for (const l of n.lines) {
          expect(en[l.key]!.length, l.key).toBeLessThanOrEqual(130);
          expect(en[l.key]!.split(/[.!?]+\s/).length, l.key).toBeLessThanOrEqual(3);
        }
      }
    }
  });
  it("mark the optional questions and always offer a way on that is not one", () => {
    const hello = SCRIPTS.scholar!.nodes.hello!;
    expect(hello.choices!.filter((c) => c.deeper)).toHaveLength(2);
    expect(hello.choices!.some((c) => !c.deeper)).toBe(true);
  });
  it("walk forward, back and through a choice", () => {
    let t = open(SCRIPTS, "scholar");
    expect(back(t)).toEqual(t);
    t = forward(SCRIPTS, t).talk!;
    expect(t.line).toBe(1);
    expect(back(t).line).toBe(0);
    // At the last line with choices, forward waits for the choice.
    expect(forward(SCRIPTS, t).talk).toEqual(t);
    expect(choicesOf(SCRIPTS, t, new Set())).toHaveLength(3);
    const step = choose(SCRIPTS, t, 0, new Set());
    expect(step.talk).toEqual({ script: "scholar", node: "dark", line: 0 });
    expect(step.set).toEqual(["askedMore"]);
    expect(choose(SCRIPTS, t, 9, new Set()).talk).toEqual(t);
    const bye = choose(SCRIPTS, t, 2, new Set()).talk!;
    expect(forward(SCRIPTS, bye).talk).toBeNull();
  });
  it("catch a broken script", () => {
    const broken = { x: { start: "a", nodes: { a: { lines: [{ who: "n", key: "missing", mood: "glad" as const }], choices: [{ key: "c_thanks", to: "nowhere", deeper: true }] }, lost: { lines: [] } } } };
    const found = faults(broken, table("en")).join("\n");
    for (const part of ["no string missing", "leads nowhere", "never reached", "no lines", "every way on is an optional one"]) expect(found).toContain(part);
  });
});

describe("the strings", () => {
  it.each(LANGS)("put no quotation marks round an invented line, in %s", (lang) => {
    const t = table(lang);
    for (const [k, v] of Object.entries(t)) {
      if (!/^(d_|c_|note_)/.test(k)) continue;
      expect(/["“”„«»‹›「」]/.test(v), `${lang} ${k}: ${v}`).toBe(false);
    }
  });
  it.each(LANGS)("name every thing that can be touched and every speaker, in %s", (lang) => {
    const t = table(lang);
    for (const thing of THINGS) expect(typeof t[thing.name], thing.name).toBe("string");
    for (const who of ["hudhud", "keeper", "scholar", "cat", "narrator"]) expect(typeof t[`who_${who}`], who).toBe("string");
  });
  it.each(LANGS)("have a form of the Storykeeper's name and lines for a girl explorer, in %s", (lang) => {
    const t = table(lang);
    expect(t.who_keeper_f!.trim().length).toBeGreaterThan(2);
    // Every "_f" line has the line it stands in for.
    for (const k of Object.keys(t).filter((x) => x.endsWith("_f"))) expect(typeof t[k.slice(0, -2)], k).toBe("string");
    for (const k of ["cover_choose", "keeper_girl", "keeper_boy"]) expect(t[k]!.trim().length, k).toBeGreaterThan(2);
  });
  it("say on the page, in every language, that the game is a prototype, that the title is a working one, that the story is invented and that the pictures are a trial drawn by code", () => {
    for (const lang of LANGS) {
      const t = table(lang);
      for (const k of ["prototype", "working_title", "review_note", "art_note", "note_uncertain", "privacy"]) expect(t[k]!.trim().length, `${lang} ${k}`).toBeGreaterThan(3);
    }
    const app = readFileSync(resolve(__dirname, "..", "ui", "app.ts"), "utf8");
    for (const k of ["prototype", "working_title", "review_note", "art_note", "note_uncertain", "privacy"]) expect(app.includes(`t("${k}")`), k).toBe(true);
  });
  it("use no clock and no unseeded chance in the rules", () => {
    for (const f of ["sim/light.ts", "sim/chain.ts", "sim/move.ts", "sim/scene.ts", "narrative/dialogue.ts", "save/save.ts", "content/workshop.ts"]) {
      const src = readFileSync(resolve(__dirname, "..", f), "utf8");
      expect(/Math\.random|Date\.now|new Date|performance\.now/.test(src), f).toBe(false);
    }
    // The picture may only use the seeded generator, even for a blink.
    for (const f of ["scenes/workshop.ts", "art/kit.ts", "art/world.ts", "art/cast.ts", "art/props.ts"]) expect(/Math\.random/.test(readFileSync(resolve(__dirname, "..", f), "utf8")), f).toBe(false);
  });
});
