// The search page fetches only the synonym shards of what is typed (scripts/derive.ts synonymShards). The page carries its
// own copy of shardOf; if the two drift apart the page asks for the wrong shard and a variant spelling silently stops
// expanding, which changes result counts. These tests keep the copy equal and the shards a lossless split of the map.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SYNONYM_SHARDS, shardOf, synonymShards } from "./derive";
import { p } from "./lib";

const PAGE = p("site", "src", "pages", "[lang]", "search", "index.astro");

describe("search synonym shards", () => {
  it("the search page's shardOf is the build's", () => {
    const src = readFileSync(PAGE, "utf8");
    const m = src.match(/var shardOf = (function \(k\) \{.*?\});\n/);
    expect(m, "search page must define shardOf").toBeTruthy();
    const pageShardOf = new Function(`return ${m![1]}`)() as (k: string) => string;
    for (const k of ["saladin", "salah al din", "صلاح الدين", "صلاح الدین", "مكه", "", "a", "ibn khaldun", "قرطبه"]) {
      expect(pageShardOf(k)).toBe(shardOf(k));
    }
    expect(src).toContain(`% ${SYNONYM_SHARDS}`);
  });

  it("the shards split the map without losing or moving a key", () => {
    const syn = {
      whole: { saladin: ["Saladin"], "salah al din": ["Saladin"], "صلاح الدين": ["صلاح الدين الأيوبي"] },
      words: { مكه: "مكة", الاسلام: "الإسلام", koran: "Qur'an" },
    };
    const shards = synonymShards(syn);
    expect(shards.size).toBe(SYNONYM_SHARDS);
    const whole: Record<string, string[]> = {};
    const words: Record<string, string> = {};
    for (const [k, part] of shards) {
      for (const key of [...Object.keys(part.whole), ...Object.keys(part.words)]) expect(shardOf(key)).toBe(k);
      Object.assign(whole, part.whole);
      Object.assign(words, part.words);
    }
    expect(whole).toEqual(syn.whole);
    expect(words).toEqual(syn.words);
  });
});
