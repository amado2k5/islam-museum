import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { canonLookup, canonSearchIndex, normSearch } from "./search-canon.js";
import { buildSynonyms } from "./derive.js";
import type { Compiled } from "./build-graph.js";

// Canon-first search (audit of 13 November 2026, S11). The query set is data and is frozen with the Grand Tour run
// (scripts/fable/search-queries.json): fifty queries a visitor would type, each with the canon record it means.
// This test runs the set through the same index and the same spelling expansion the search page uses. The rendered
// test, against a built site with its Pagefind index, is scripts/fable/o06_search.mjs.
const GRAPH = ".cache/graph.json";
const { queries } = JSON.parse(readFileSync("scripts/fable/search-queries.json", "utf8")) as { queries: { lang: "ar" | "en"; q: string; expect: string[] }[] };

describe("canon-first search", () => {
  const ready = existsSync(GRAPH);
  const c: Compiled | null = ready ? JSON.parse(readFileSync(GRAPH, "utf8")) : null;
  const syn = c ? { ar: buildSynonyms(c, "ar"), en: buildSynonyms(c, "en") } : null;
  const index = c ? { ar: canonSearchIndex(c, "ar", syn!.ar.whole), en: canonSearchIndex(c, "en", syn!.en.whole) } : null;
  // what the page does with a typed term before it searches (search/index.astro processTerm)
  const processed = (lang: "ar" | "en", q: string) => {
    const s = syn![lang]; const whole = s.whole[normSearch(q)];
    return whole?.length ? whole[0] : q.split(/\s+/).map((w) => s.words[normSearch(w)] || w).join(" ");
  };
  const first = (lang: "ar" | "en", q: string) => (canonLookup(index![lang], q) ?? canonLookup(index![lang], processed(lang, q)))?.id ?? null;

  it("the frozen set holds at least fifty queries", () => { expect(queries.length).toBeGreaterThanOrEqual(50); });

  it.skipIf(!ready)("at least 48 of the 50 queries name their canon record first", () => {
    const misses = queries.filter(({ lang, q, expect: want }) => !want.includes(first(lang, q) ?? ""));
    expect(misses.map((m) => `${m.lang} "${m.q}" -> ${first(m.lang, m.q)}`), "queries that do not return their canon record").toHaveLength(Math.min(misses.length, 2));
    expect(queries.length - misses.length).toBeGreaterThanOrEqual(48);
  });

  it.skipIf(!ready)("the five named queries return the record a visitor means", () => {
    expect(first("en", "Muhammad")).toBe("person/muhammad");
    expect(first("en", "Saladin")).toBe("person/salah-al-din-yusuf-ibn-ayyub");
    expect(first("en", "Baghdad")).toBe("place/baghdad");
    expect(first("en", "Quran")).toBe("work/quran");
    expect(first("en", "Kaaba")).toBe("building/kaaba");
    expect(first("en", "Ibn Sina")).toBe("person/ibn-sina");
    expect(first("ar", "ابن سينا")).toBe("person/ibn-sina");
  });

  it.skipIf(!ready)("only canon records are in the index, each written once, and a common word names nothing", () => {
    const canon = new Set(c!.nodes.filter((n) => !n.stub && [1, 2].includes(n.data.importance)).map((n) => n.id));
    for (const lang of ["ar", "en"] as const) {
      const ids = index![lang].records.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(canon.has(id), `${id} is not canon`).toBe(true);
    }
    for (const q of ["battle", "mosque", "the", "ibn"]) expect(first("en", q)).toBeNull();
  });

  it("the page's copy of the normaliser equals the build's", () => {
    const js = readFileSync("site/public/shell/search-canon.js", "utf8");
    const body = (name: string) => js.match(new RegExp(`var ${name} = (function \\([^)]*\\) \\{[^\\n]*\\});`))![1];
    const norm = new Function(`return ${body("norm")}`)() as (t: string) => string;
    for (const s of ["Qur'an", "The Kaaba", "al-Ghazālī", "أَبُو بَكْرٍ الصِّدِّيق", "مكّة المكرمة", "Ibn Sina (Avicenna)", "«كتاب»: Title"]) expect(norm(s)).toBe(normSearch(s));
  });
});
