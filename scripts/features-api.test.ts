import { describe, expect, it } from "vitest";
import type { Compiled, Node } from "./build-graph.js";
import { featureApiData } from "./export-api.js";

const makeNode = (id: string, cls: string, data: Record<string, any> = {}, prose: Record<string, any> = {}): Node => ({
  id, class: cls, slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub: false,
  wings: [], regions: [], periods: [], tags: [], aliases: [], themes: [], data, prose, degree: 0, contemporaries: [], updated: "2026-11-06",
});
const coverage: Compiled["coverage"] = {
  entities: 0, stubs: 0, byClass: {}, byWing: {}, byPeriod: {}, byRegion: {}, byTheme: {}, emptyThemes: [],
  byReview: {}, proseByLang: {}, avgSourcesPerEntity: 0, womenShare: null, wanted: [],
};

describe("one API export per browser or explorer (AGENTS.md: every feature is graph, API and search)", () => {
  const job = makeNode("job/scribe", "job", { kind: "office", domain: "court-administration", hirfa: false }, { ar: {} });
  const holder = makeNode("person/katib", "person", { occupations: [{ job: "job/scribe", kind: "primary", sources: ["source/x"] }] });
  const fatwa = makeNode("work/fatwa-x", "work", { kind: "fatwa", publisher: "group/dar-al-ifta", url: "https://example.org" });
  const sermon = makeNode("work/khutba-x", "work", { kind: "sermon", delivered: { by: "person/khatib" }, order: 2 });
  const poem = makeNode("work/poem-x", "work", { kind: "poem", authors: ["person/poet"], metre: "tawil" });
  const film = makeNode("screen/film-x", "screen", { format: "film", relevance: "primary", released: { edtf: "1976" }, countries: ["lb"] });
  const book = makeNode("work/book-x", "work", { kind: "book" });
  const qudsi = { ...makeNode("passage/muslim-2577", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "2577", text: "يا عبادي" }), tags: ["hadith-qudsi", "qudsi-zulm"], themes: ["ethics-and-character"] };
  const plainHadith = makeNode("passage/muslim-0001", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "1" });
  const dreamHadith = makeNode("passage/bukhari-3681", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "3681", text: "رأيت كأني أشرب لبناً" });
  const dreamAyah = makeNode("passage/quran-12-4", "passage", { unit: "ayah", work: "work/quran", sura: 12, aya: 4, text: "إذ قال يوسف لأبيه يا أبت إني رأيت أحد عشر كوكباً", translations: { en: { text: "I saw in a dream eleven planets" } } });
  const dreamConcept = { ...makeNode("concept/ahlam", "concept", { kind: "term" }), tags: ["dream-browser", "dream-concepts"] };
  const sighting = makeNode("passage/bukhari-0002", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "2", text: "أرى في نافذة بيت أخي" });
  const expression = makeNode("passage/muwatta-1-187", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "1.187", text: "ما أعرف شيئاً مما أدركت عليه الناس إلا النداء بالصلاة", text_search: "بقي على حاله إلا النداء بالصلاة، تعبيراً عما رآه من تغير أحوال الناس." });
  const madhhabBook = makeNode("work/mughni-x", "work", { kind: "book" });
  const madhhabFaqih = { ...makeNode("person/faqih-x", "person"), tags: ["madhahib-browser", "mh-salaf", "mh-hanafi"] };
  const compiled: Compiled = {
    generated: "2026-11-06T00:00:00Z", commit: null, coverage,
    nodes: [job, holder, fatwa, sermon, poem, film, book, qudsi, plainHadith, dreamHadith, dreamAyah, dreamConcept, sighting, expression, madhhabBook, madhhabFaqih, makeNode("work/quran", "work", { genre: ["scripture"] }), makeNode("work/sahih-bukhari", "work", { genre: ["hadith"] }), makeNode("work/sahih-muslim", "work", { genre: ["hadith"] }), makeNode("work/muwatta-malik", "work", { genre: ["hadith"] })],
    edges: [
      { from: "work/fatwa-x", to: "person/mufti", type: "issued_by", inverse: true },
      { from: "work/mughni-x", to: "group/hanbali-madhhab", type: "mentions", inverse: false },
      { from: "group/hanbali-madhhab", to: "work/mughni-x", type: "mentioned_in", inverse: true },
    ],
  };

  it("writes jobs, fatwa, khutab, poetry and screens with their fields, edges, prose languages and job holders", () => {
    const data = featureApiData(compiled);
    expect(Object.keys(data).sort()).toEqual(["angels.json", "asma.json", "battles.json", "companions.json", "dreams.json", "fatwa.json", "ghayb.json", "jinn-devils.json", "jobs.json", "khulafa.json", "khutab.json", "madhahib.json", "nature.json", "poetry.json", "qudsi.json", "screens.json", "tafsir.json"]);
    expect(data["qudsi.json"].items.map((i) => i.id)).toEqual(["passage/muslim-2577"]);
    expect(data["qudsi.json"].items[0]).toMatchObject({ work: "work/sahih-muslim", ref: "2577", hadith: "zulm", themes: ["ethics-and-character"] });
    expect(data["qudsi.json"].feature).toBe("hadith-qudsi-browser");
    expect(data["jobs.json"].items[0]).toMatchObject({ id: "job/scribe", domain: "court-administration", hirfa: false, holders: ["person/katib"], prose: ["ar"] });
    expect(data["fatwa.json"].items[0]).toMatchObject({ id: "work/fatwa-x", publisher: "group/dar-al-ifta", connections: [{ type: "issued_by", to: "person/mufti", inverse: true }] });
    expect(data["khutab.json"].items[0]).toMatchObject({ id: "work/khutba-x", delivered: { by: "person/khatib" }, order: 2 });
    expect(data["poetry.json"].items[0]).toMatchObject({ id: "work/poem-x", metre: "tawil", authors: ["person/poet"] });
    expect(data["screens.json"].items[0]).toMatchObject({ id: "screen/film-x", format: "film", countries: ["lb"] });
    expect(data["poetry.json"].items.map((i) => i.id)).not.toContain("work/book-x");
    expect(data["jobs.json"].feature).toBe("job-browser");
  });

  it("exports dreams: detected passages by corpus, tagged concepts by section tag, no sighting false positives", () => {
    const items = featureApiData(compiled)["dreams.json"].items;
    const ids = items.map((i) => i.id).sort();
    expect(ids).toEqual(["concept/ahlam", "passage/bukhari-3681", "passage/quran-12-4"]);
    expect(ids).not.toContain("passage/muwatta-1-187"); // «تعبيراً عما رآه» = "expression", not a dream
    expect(items.find((i) => i.id === "passage/bukhari-3681")).toMatchObject({ section: "sunnah", work: "work/sahih-bukhari" });
    expect(items.find((i) => i.id === "passage/quran-12-4")).toMatchObject({ section: "quran", sura: 12, aya: 4 });
    expect(items.find((i) => i.id === "concept/ahlam")).toMatchObject({ section: "concepts" });
  });

  it("exports madhahib: tagged records by mh- sections, mentions edges by school and dhikr", () => {
    const items = featureApiData(compiled)["madhahib.json"].items;
    const byId = new Map(items.map((i) => [i.id as string, i]));
    expect(byId.get("work/mughni-x")).toMatchObject({ sections: ["hanbali", "dhikr"] });
    expect(byId.get("person/faqih-x")).toMatchObject({ sections: ["hanafi", "salaf"] });
    expect(byId.has("work/book-x")).toBe(false);
  });

  it("is empty-capable", () => {
    const data = featureApiData({ ...compiled, nodes: [book], edges: [] });
    for (const body of Object.values(data)) expect(body.items).toEqual([]);
  });
});
