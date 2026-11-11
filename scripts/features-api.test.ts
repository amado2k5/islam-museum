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
  const baytHadith = makeNode("passage/muslim-2408x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "2408x", text: "إني تارك فيكم ثقلين أحدهما كتاب الله والآخر أهل بيتي" });
  const baytAyah = makeNode("passage/quran-33-33x", "passage", { unit: "ayah", work: "work/quran", sura: 33, aya: 33, text: "إنما يريد الله ليذهب عنكم الرجس أهل البيت", translations: { en: { text: "Allah intends only to remove from you the impurity, O people of the house" } } });
  const baytExtra = makeNode("passage/quran-33-28", "passage", { unit: "ayah", work: "work/quran", sura: 33, aya: 28, text: "يا أيها النبي قل لأزواجك إن كنتن تردن الحياة" });
  const baytPerson = { ...makeNode("person/fatima-x", "person", { kind: "companion" }), tags: ["bayt-browser", "bayt-ahl"] };
  const baytEvent = { ...makeNode("event/ghadir-khumm-x", "event", { kind: "event" }), tags: ["bayt-browser", "bayt-mawaqif"] };
  const notBaytPharaoh = makeNode("passage/quran-2-49x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 49, text: "ونجيناكم من آل فرعون يسومونكم سوء العذاب وأغرقنا آل فرعون" });
  const notBaytAhlKitab = makeNode("passage/quran-5-15x", "passage", { unit: "ayah", work: "work/quran", sura: 5, aya: 15, text: "يا أهل الكتاب قد جاءكم رسولنا يبين لكم" });
  const notBaytQasim = makeNode("passage/muwatta-1-012x", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "1.012x", text: "بلغ مالكا أن القاسم بن محمد وسالم بن عبد الله كانوا يقولون" });
  const notBaytAhlBaytihi = makeNode("passage/muslim-1829x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "1829x", text: "والرجل راع على أهل بيته وهو مسؤول عنهم" });
  const compiled: Compiled = {
    generated: "2026-11-06T00:00:00Z", commit: null, coverage,
    nodes: [job, holder, fatwa, sermon, poem, film, book, qudsi, plainHadith, dreamHadith, dreamAyah, dreamConcept, sighting, expression, madhhabBook, madhhabFaqih, baytHadith, baytAyah, baytExtra, baytPerson, baytEvent, notBaytPharaoh, notBaytAhlKitab, notBaytQasim, notBaytAhlBaytihi, makeNode("work/quran", "work", { genre: ["scripture"] }), makeNode("work/sahih-bukhari", "work", { genre: ["hadith"] }), makeNode("work/sahih-muslim", "work", { genre: ["hadith"] }), makeNode("work/muwatta-malik", "work", { genre: ["hadith"] })],
    edges: [
      { from: "work/fatwa-x", to: "person/mufti", type: "issued_by", inverse: true },
      { from: "work/mughni-x", to: "group/hanbali-madhhab", type: "mentions", inverse: false },
      { from: "group/hanbali-madhhab", to: "work/mughni-x", type: "mentioned_in", inverse: true },
    ],
  };

  it("writes jobs, fatwa, khutab, poetry and screens with their fields, edges, prose languages and job holders", () => {
    const data = featureApiData(compiled);
    expect(Object.keys(data).sort()).toEqual(["angels.json", "asma.json", "battles.json", "bayt.json", "companions.json", "dreams.json", "fatwa.json", "ghayb.json", "jinn-devils.json", "jobs.json", "khulafa.json", "khutab.json", "madhahib.json", "magic.json", "messengers.json", "nature.json", "poetry.json", "qudsi.json", "screens.json", "tafsir.json"]);
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

  it("exports magic: detected passages by corpus and topic, tagged records, ambiguous-form gates", () => {
    const sihrHadith = makeNode("passage/muslim-9999", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9999", text: "اجتنبوا السبع الموبقات ومنها السحر" });
    const aynFp = makeNode("passage/muwatta-9999", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9999", text: "رأيت العين تسقي الزرع" });
    const sihrConcept = { ...makeNode("concept/sihr", "concept", { kind: "term" }), tags: ["magic-browser", "magic-sihr"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, sihrHadith, aynFp, sihrConcept], edges: compiled.edges });
    const items = data["magic.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/muslim-9999");
    expect(ids).toContain("concept/sihr");
    expect(ids).not.toContain("passage/muwatta-9999"); // «العين» watering crops is not the evil eye
    expect(items.find((i) => i.id === "passage/muslim-9999")).toMatchObject({ section: "sunnah", topics: ["sihr"] });
    expect(items.find((i) => i.id === "concept/sihr")).toMatchObject({ section: "concepts", topics: ["sihr"] });
  });

  it("exports messengers: detected names and class terms, gated ambiguous names, edge mentions, and the subject index", () => {
    const nuh = makeNode("passage/muslim-8888", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "8888", text: "قال نوح لقومه إني لكم نذير مبين" });
    const salih = makeNode("passage/bukhari-7777", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "7777", text: "إن صالحا نبي ثمود" });
    const ambiguous = makeNode("passage/muwatta-7777", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "7777", text: "كان الرجل صالحا في دينه" });
    const ibnAdam = makeNode("passage/muslim-7777", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "7777", text: "يا ابن آدم لا تقنط من رحمة الله" });
    const edgeOnly = makeNode("passage/quran-2-247", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 247, text: "وقال لهم نبيهم إن الله قد بعث لكم" });
    const muhammadOnly = makeNode("passage/muslim-6666", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "6666" });
    const musa = makeNode("person/musa", "person", { kind: "prophet" });
    const muhammad = makeNode("person/muhammad", "person", { kind: "prophet" });
    const data = featureApiData({
      ...compiled,
      nodes: [...compiled.nodes, nuh, salih, ambiguous, ibnAdam, edgeOnly, muhammadOnly, musa, muhammad],
      edges: [
        ...compiled.edges,
        { from: "passage/quran-2-247", to: "person/musa", type: "mentions", inverse: false },
        { from: "passage/muslim-6666", to: "person/muhammad", type: "mentions", inverse: false },
      ],
    });
    const items = data["messengers.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/muslim-8888");
    expect(ids).toContain("passage/bukhari-7777");
    expect(ids).toContain("passage/quran-2-247");
    expect(ids).not.toContain("passage/muwatta-7777"); // «صالح» as an adjective is not Salih
    expect(ids).not.toContain("passage/muslim-7777"); // «ابن آدم» is mankind, not Adam
    expect(ids).not.toContain("passage/muslim-6666"); // a bare narrator edge to Muhammad is not a mention
    expect(items.find((i) => i.id === "passage/muslim-8888")).toMatchObject({ section: "sunnah", subjects: ["person/nuh"] });
    expect(items.find((i) => i.id === "passage/quran-2-247")).toMatchObject({ section: "quran", subjects: expect.arrayContaining(["person/musa"]) });
    expect((data["messengers.json"] as any).subjects.map((s: any) => s.id)).toContain("person/musa");
  });

  it("exports bayt: detected passages by corpus, tagged records by section tag, gated false positives", () => {
    const items = featureApiData(compiled)["bayt.json"].items;
    const ids = items.map((i) => i.id).sort();
    expect(ids).toContain("passage/muslim-2408x");
    expect(ids).toContain("passage/quran-33-33x");
    expect(ids).toContain("passage/quran-33-28"); // BAYT_EXTRA: wife verse with no lexical marker
    expect(ids).toContain("person/fatima-x");
    expect(ids).toContain("event/ghadir-khumm-x");
    expect(ids).not.toContain("passage/quran-2-49x"); // آل فرعون is not the Prophet's family
    expect(ids).not.toContain("passage/quran-5-15x"); // أهل الكتاب is not the household
    expect(ids).not.toContain("passage/muwatta-1-012x"); // القاسم بن محمد = the Muwatta narrator
    expect(ids).not.toContain("passage/muslim-1829x"); // أهل بيته = "his household" in fiqh
    expect(items.find((i) => i.id === "passage/muslim-2408x")).toMatchObject({ section: "sunnah" });
    expect(items.find((i) => i.id === "passage/quran-33-33x")).toMatchObject({ section: "quran" });
    expect(items.find((i) => i.id === "person/fatima-x")).toMatchObject({ section: "ahl" });
    expect(items.find((i) => i.id === "event/ghadir-khumm-x")).toMatchObject({ section: "mawaqif" });
  });

  it("is empty-capable", () => {
    const data = featureApiData({ ...compiled, nodes: [book], edges: [] });
    for (const body of Object.values(data)) expect(body.items).toEqual([]);
  });
});
