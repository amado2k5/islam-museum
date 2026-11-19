// The search page fetches only the synonym shards of what is typed (scripts/derive.ts synonymShards). The page carries its
// own copy of shardOf; if the two drift apart the page asks for the wrong shard and a variant spelling silently stops
// expanding, which changes result counts. These tests keep the copy equal and the shards a lossless split of the map.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildSynonyms, derive, SYNONYM_SHARDS, shardOf, synonymShards } from "./derive";
import { p, readYaml } from "./lib";
import type { Compiled, Node } from "./build-graph";
import { canonLookup, canonSearchIndex } from "./search-canon";

const PAGE = p("site", "src", "pages", "[lang]", "search", "index.astro");

describe("French homework search", () => {
  const { topics } = readYaml<{ topics: { id: string; target: string; phrasings: { fr: string[] } }[] }>(p("edu", "homework-topics.yaml"));
  const nodes: Node[] = topics.map((t, i) => ({
    id: t.target, class: t.target.split("/")[0], slug: t.target.split("/")[1],
    label: i === 0 ? { ar: "الحروب الصليبية", en: "The Crusades", fr: "Les croisades" } : { en: `Homework ${t.id}` },
    summary: {}, stub: false, wings: [], regions: [], periods: [], tags: [], aliases: [], themes: [],
    data: { importance: 1 }, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-18",
  }));
  const graph = { nodes, edges: [] } as unknown as Compiled;
  const src = readFileSync(PAGE, "utf8");
  const norm = new Function(`return ${src.match(/var norm = (function \(t\) \{[^\n]*\});/)![1]}`)() as (s: string) => string;

  it("French search loads French shards and expands every homework phrase to its target label", () => {
    const language = new Function("lang", `return ${src.match(/var synLang = ([^;]+);/)![1]}`) as (lang: string) => "ar" | "en" | "fr";
    expect(language("fr")).toBe("fr");
    expect(language("en")).toBe("en");
    expect(language("ar")).toBe("ar");
    expect(language("ur")).toBe("ar");
    const synonyms = derive(graph).synonyms;
    const shards = synonymShards(synonyms[language("fr")]);
    for (const [i, topic] of topics.entries()) for (const phrase of topic.phrasings.fr) {
      const key = norm(phrase.toUpperCase());
      expect(shards.get(shardOf(key))!.whole[key], phrase).toContain(nodes[i].label.fr ?? nodes[i].label.en);
    }
  });

  it("French homework synonyms name the same record in canon search", () => {
    const synonyms = buildSynonyms(graph, "fr");
    const index = canonSearchIndex(graph, "fr", synonyms.whole);
    expect(canonLookup(index, "devoir sur les croisades")?.id).toBe(topics[0].target);
    expect(canonLookup(index, "exposé sur les croisades")?.id).toBe(topics[0].target);
  });

  it("missing targets and unknown queries do not invent synonym matches", () => {
    expect(buildSynonyms({ ...graph, nodes: [] }, "fr")).toEqual({ whole: {}, words: {} });
    expect(buildSynonyms(graph, "fr").whole[norm("un sujet inconnu")]).toBeUndefined();
  });
});

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
