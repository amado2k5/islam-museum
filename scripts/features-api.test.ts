import { describe, expect, it } from "vitest";
import type { Compiled, Node } from "./build-graph.js";
import { featureApiData } from "./export-api.js";
import { duaKindOf, duaSignalsOf } from "./dua.js";
import { ibadatKindOf, ibadatSignalsOf, ibadatTopicsOf } from "./ibadat.js";
import { sayyiatKindOf, sayyiatSignalsOf } from "./sayyiat.js";
import { hududKindOf, hududSignalsOf } from "./hudud.js";
import { hasanatKindOf, hasanatSignalsOf } from "./hasanat.js";
import { hisabFold, hisabKindsOfSignals, hisabSignalsOfText } from "./hisab.js";
import { mukatabatKindOf, mukatabatSenderOf, mukatabatSignalsOf } from "./mukatabat.js";
import { narKindOf, narSignalsOf } from "./nar.js";
import { jannaKindOf, jannaSignalsOf } from "./janna.js";
import { qiyamaKindOf, qiyamaSignalsOf } from "./qiyama.js";

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
  const eschAyah = makeNode("passage/quran-75-1", "passage", { unit: "ayah", work: "work/quran", sura: 75, aya: 1, text: "لا أقسم بيوم القيامة" });
  const eschHadith = makeNode("passage/muslim-9998", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9998", text: "أشراط الساعة" });
  const eschConcept = { ...makeNode("concept/yaum-al-qiyama", "concept", { kind: "belief" }), tags: ["eschatology-browser", "eschatology-hereafter", "eschatology-qiyama"] };
  const eschFp = makeNode("passage/muwatta-9998", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9998", text: "اشتريت ساعة من السوق" });
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
    nodes: [job, holder, fatwa, sermon, poem, film, book, qudsi, plainHadith, dreamHadith, dreamAyah, dreamConcept, eschAyah, eschHadith, eschConcept, eschFp, sighting, expression, madhhabBook, madhhabFaqih, baytHadith, baytAyah, baytExtra, baytPerson, baytEvent, notBaytPharaoh, notBaytAhlKitab, notBaytQasim, notBaytAhlBaytihi, makeNode("work/quran", "work", { genre: ["scripture"] }), makeNode("work/sahih-bukhari", "work", { genre: ["hadith"] }), makeNode("work/sahih-muslim", "work", { genre: ["hadith"] }), makeNode("work/muwatta-malik", "work", { genre: ["hadith"] })],
    edges: [
      { from: "work/fatwa-x", to: "person/mufti", type: "issued_by", inverse: true },
      { from: "work/mughni-x", to: "group/hanbali-madhhab", type: "mentions", inverse: false },
      { from: "group/hanbali-madhhab", to: "work/mughni-x", type: "mentioned_in", inverse: true },
    ],
  };

  it("writes jobs, fatwa, khutab, poetry and screens with their fields, edges, prose languages and job holders", () => {
    const data = featureApiData(compiled);
    expect(Object.keys(data).sort()).toEqual(["angels.json", "asma.json", "battles.json", "bayt.json", "companions.json", "dreams.json", "duas.json", "eschatology.json", "fatwa.json", "ghayb.json", "hasanats.json", "hisab.json", "hudud.json", "ibadat.json", "islamic-economy.json", "jannas.json", "jinn-devils.json", "jobs.json", "khulafa.json", "khutab.json", "madhahib.json", "magic.json", "messengers.json", "miracles.json", "mukatabat.json", "nar.json", "nature.json", "nubuwat.json", "places.json", "poetry.json", "qiyama.json", "qudsi.json", "sayyiat.json", "screens.json", "tafsir.json"]);
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

  it("exports duas: detected passages by corpus and kind, gated false positives, future-book inclusion", () => {
    const duaHadith = makeNode("passage/muslim-9997", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9997", text: "كان يقول: اللهم إني أعوذ بك من العجز والكسل" });
    const duaAyah = makeNode("passage/quran-40-60x", "passage", { unit: "ayah", work: "work/quran", sura: 40, aya: 60, text: "وقال ربكم ادعوني أستجب لكم" });
    const duaMention = makeNode("passage/muwatta-9997", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9997", text: "أفضل الدعاء دعاء يوم عرفة" });
    const callFp = makeNode("passage/quran-16-125x", "passage", { unit: "ayah", work: "work/quran", sura: 16, aya: 125, text: "ادع إلى سبيل ربك بالحكمة والموعظة الحسنة" });
    const falseGod = makeNode("passage/quran-7-195x", "passage", { unit: "ayah", work: "work/quran", sura: 7, aya: 195, text: "قل ادعوا شركاءكم ثم كيدون فلا تنظرون" });
    const summonFp = makeNode("passage/muwatta-9998", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9998", text: "فدعا له بسوط فأتي بسوط مكسور" });
    const claimFp = makeNode("passage/muwatta-9999", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9999", text: "ادعى الرجل أنه من الصالحين" });
    const futureBook = makeNode("passage/futurebook-1", "passage", { unit: "hadith", work: "work/future-tahdhib", ref: "1", text: "قال الشيخ: كان يدعو في سجوده اللهم لك الحمد" });
    const duaConcept = { ...makeNode("practice/dua", "practice", { kind: "practice" }), tags: ["dua-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, duaHadith, duaAyah, duaMention, callFp, falseGod, summonFp, claimFp, futureBook, duaConcept] });
    const items = data["duas.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/muslim-9997");
    expect(ids).toContain("passage/quran-40-60x");
    expect(ids).toContain("passage/muwatta-9997");
    expect(ids).toContain("practice/dua");
    expect(ids).toContain("passage/futurebook-1"); // a book harvested later lands automatically
    expect(ids).not.toContain("passage/quran-16-125x"); // «ادع إلى» is da'wa preaching, not supplication
    expect(ids).not.toContain("passage/quran-7-195x"); // «ادعوا شركاءكم» calls false gods
    expect(ids).not.toContain("passage/muwatta-9998"); // «دعا له بسوط» is a summons, not a supplication
    expect(ids).not.toContain("passage/muwatta-9999"); // «ادعى» is "claimed", not supplicated
    expect(items.find((i) => i.id === "passage/muslim-9997")).toMatchObject({ section: "sunnah", dua_kind: "formula" });
    expect(items.find((i) => i.id === "passage/quran-40-60x")).toMatchObject({ section: "quran", dua_kind: "mention" });
    expect(items.find((i) => i.id === "passage/muwatta-9997")).toMatchObject({ section: "sunnah", dua_kind: "mention" });
    expect(items.find((i) => i.id === "practice/dua")).toMatchObject({ section: "curated", dua_kind: null });
    expect(featureApiData(compiled)["duas.json"].feature).toBe("dua-browser");
    expect(duaKindOf(duaHadith as any)).toBe("formula");
    expect(duaSignalsOf(callFp as any)).toEqual([]);
  });

  it("exports ibadat: detected passages by corpus and kind, worship topics, false-god and argument gates, du'a inherited", () => {
    const salatAyah = makeNode("passage/quran-2-43x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 43, text: "وأقيموا الصلاة وآتوا الزكاة واركعوا مع الراكعين" });
    const iyyakaAyah = makeNode("passage/quran-1-5x", "passage", { unit: "ayah", work: "work/quran", sura: 1, aya: 5, text: "إياك نعبد وإياك نستعين" });
    const dhikrHadith = makeNode("passage/muslim-9996", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9996", text: "كان يقول سبحان الله وبحمده مائة مرة" });
    const duaPassage = makeNode("passage/muslim-9997", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9997", text: "كان يقول: اللهم إني أعوذ بك من العجز والكسل" });
    const idolsFp = makeNode("passage/quran-7-70x", "passage", { unit: "ayah", work: "work/quran", sura: 7, aya: 70, text: "أتعبدون الأصنام وتتركون ربكم" });
    const argueFp = makeNode("passage/quran-2-258x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 258, text: "احتج على إبراهيم في ربه" });
    const futureBook = makeNode("passage/futurebook-2", "passage", { unit: "hadith", work: "work/future-adhkar", ref: "2", text: "قال الشيخ: من قال لا إله إلا الله وحده لا شريك له" });
    const ibadatPractice = { ...makeNode("practice/salah", "practice", { kind: "practice" }), tags: ["ibadat-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, salatAyah, iyyakaAyah, dhikrHadith, duaPassage, idolsFp, argueFp, futureBook, ibadatPractice] });
    const items = data["ibadat.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-2-43x");
    expect(ids).toContain("passage/quran-1-5x");
    expect(ids).toContain("passage/muslim-9996");
    expect(ids).toContain("passage/muslim-9997"); // du'a inherited from the Du'a detector
    expect(ids).toContain("practice/salah");
    expect(ids).toContain("passage/futurebook-2"); // a book harvested later lands automatically
    expect(ids).not.toContain("passage/quran-7-70x"); // worship of idols is out of scope
    expect(ids).not.toContain("passage/quran-2-258x"); // احتجّ is argument, not hajj
    expect(items.find((i) => i.id === "passage/quran-2-43x")).toMatchObject({ section: "quran", ibadat_kind: "act" });
    expect(items.find((i) => i.id === "passage/quran-1-5x")).toMatchObject({ section: "quran", ibadat_kind: "act" });
    expect(items.find((i) => i.id === "practice/salah")).toMatchObject({ section: "curated", ibadat_kind: null });
    expect(ibadatTopicsOf(salatAyah as any)).toEqual(expect.arrayContaining(["salah", "zakat"]));
    expect(ibadatTopicsOf(duaPassage as any)).toContain("dua");
    expect(featureApiData(compiled)["ibadat.json"].feature).toBe("ibadat-browser");
    expect(ibadatKindOf(iyyakaAyah as any)).toBe("act");
    expect(ibadatSignalsOf(argueFp as any)).toEqual([]);
  });

  it("exports nar: hellfire names, gated nar lexeme, worldly-fire shelf, curated records, future-book inclusion", () => {
    const hellAyah = makeNode("passage/quran-2-24x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 24, text: "فاتقوا النار التي وقودها الناس والحجارة أعدت للكافرين" });
    const nameAyah = makeNode("passage/quran-74-26x", "passage", { unit: "ayah", work: "work/quran", sura: 74, aya: 26, text: "سأصليه سقر" });
    const ittaquHadith = makeNode("passage/muslim-2299", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "2299", text: "اتقوا النار ولو بشق تمرة" });
    const ibrahimAyah = makeNode("passage/quran-21-69x", "passage", { unit: "ayah", work: "work/quran", sura: 21, aya: 69, text: "قلنا يا نار كوني بردا وسلاما على إبراهيم" });
    const dinarFp = makeNode("passage/muwatta-2299", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "2299", text: "اشترى الثوب بدينارين من السوق" });
    const minarFp = makeNode("passage/muwatta-2300", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "2300", text: "وقف على منار المسجد فأنار المصابيح" });
    const futureBook = makeNode("passage/takhwif-1", "passage", { work: "work/takhwif-min-al-nar", ref: "1", text: "قال ابن رجب: جهنم دار عذاب أعدها الله للكافرين" });
    const narConcept = { ...makeNode("concept/jahannam", "concept", { kind: "belief" }), tags: ["nar-browser", "nar-doctrine"] };
    const dunyaConcept = { ...makeNode("concept/fire", "concept", { kind: "natural" }), tags: ["nar-browser", "nar-dunya"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, hellAyah, nameAyah, ittaquHadith, ibrahimAyah, dinarFp, minarFp, futureBook, narConcept, dunyaConcept] });
    const items = data["nar.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-2-24x");
    expect(ids).toContain("passage/quran-74-26x");
    expect(ids).toContain("passage/muslim-2299");
    expect(ids).toContain("passage/quran-21-69x");
    expect(ids).toContain("passage/takhwif-1"); // a hellfire book harvested later lands automatically
    expect(ids).toContain("concept/jahannam");
    expect(ids).toContain("concept/fire");
    expect(ids).not.toContain("passage/muwatta-2299"); // دينار is a coin, not a fire
    expect(ids).not.toContain("passage/muwatta-2300"); // منار/أنار are not the «نار» lexeme
    expect(items.find((i) => i.id === "passage/quran-2-24x")).toMatchObject({ section: "quran", nar_kind: "hellfire" });
    expect(items.find((i) => i.id === "passage/muslim-2299")).toMatchObject({ section: "sunnah", nar_kind: "hellfire" });
    expect(items.find((i) => i.id === "passage/quran-21-69x")).toMatchObject({ section: "dunya", nar_kind: "worldly" });
    expect(items.find((i) => i.id === "passage/takhwif-1")).toMatchObject({ section: "books", nar_kind: "hellfire" });
    expect(items.find((i) => i.id === "concept/jahannam")).toMatchObject({ section: "curated", nar_kind: null });
    expect(items.find((i) => i.id === "concept/fire")).toMatchObject({ section: "dunya", nar_kind: null });
    expect(featureApiData(compiled)["nar.json"].feature).toBe("nar-browser");
    expect(narKindOf(hellAyah as any)).toBe("hellfire");
    expect(narKindOf(ibrahimAyah as any)).toBe("worldly");
    expect(narSignalsOf(dinarFp as any)).toEqual([]);
    expect(narSignalsOf(minarFp as any)).toEqual([]);
  });

  it("exports nubuwat: detected passages by corpus and topic, tagged records, ambiguous-form gates", () => {
    const prophecyHadith = makeNode("passage/muslim-8877", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "8877", text: "ليأتين عليكم من بعدي اشياء" });
    const miracleHadith = makeNode("passage/bukhari-8877", "passage", { unit: "hadith", work: "work/sahih-al-bukhari", ref: "8877", text: "انشق القمر نصفين" });
    const genericFp = makeNode("passage/muwatta-8877", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "8877", text: "كان ياتي بالليل فيصلي" });
    const nubConcept = { ...makeNode("concept/dalail-al-nubuwwa", "concept", { kind: "term" }), tags: ["nubuwat-browser", "nubuwat-nubuwwa"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, prophecyHadith, miracleHadith, genericFp, nubConcept], edges: compiled.edges });
    const items = data["nubuwat.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/muslim-8877");
    expect(ids).toContain("passage/bukhari-8877");
    expect(ids).toContain("concept/dalail-al-nubuwwa");
    expect(ids).not.toContain("passage/muwatta-8877"); // «ياتي» without a prophecy collocation is not a prediction
    expect(items.find((i) => i.id === "passage/muslim-8877")).toMatchObject({ section: "sunnah", topics: ["nubuwat"] });
    expect(items.find((i) => i.id === "passage/bukhari-8877")).toMatchObject({ section: "sunnah", topics: ["muajizat"] });
    expect(items.find((i) => i.id === "concept/dalail-al-nubuwwa")).toMatchObject({ section: "curated", topics: ["nubuwwa"] });
    expect(featureApiData(compiled)["nubuwat.json"].feature).toBe("nubuwat-browser");
  });

  it("exports sayyiat: the full sins theme by corpus and kind, gated ambiguous forms, exclusions, future-book inclusion", () => {
    const sayyiHadith = makeNode("passage/muslim-9996", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9996", text: "إن الله كتب الحسنات والسيئات" });
    const sayyiAyah = makeNode("passage/quran-11-114x", "passage", { unit: "ayah", work: "work/quran", sura: 11, aya: 114, text: "إن الحسنات يذهبن السيئات" });
    const ithmMention = makeNode("passage/muwatta-9996", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9996", text: "البر حسن الخلق والإثم ما حاك في نفسك" });
    const asaHadith = makeNode("passage/bukhari-9996", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "9996", text: "يبسط يده بالليل ليتوب مسيء النهار" });
    const nisaFp = makeNode("passage/muwatta-9997", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9997", text: "خرج النبي إلى النساء في المساجد" });
    const masaFp = makeNode("passage/muwatta-9998", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9998", text: "كان رسول الله يصلي صلاة المساء" });
    const asasFp = makeNode("passage/quran-2-214x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 214, text: "ألم يأن للذين آمنوا أن تخشع قلوبهم لذكر الله لما نزل من الحق" });
    const kohlFp = makeNode("passage/poem-x-ithmid", "passage", { unit: "verse", work: "work/poem-x", ref: "2", text: "لا تكحلن العين بعدي إثمد" });
    const braceletFp = makeNode("passage/poem-x-misam", "passage", { unit: "verse", work: "work/poem-x", ref: "3", text: "وشم في نواشر معصم" });
    const kabiraOnly = makeNode("passage/muwatta-9999", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9999", text: "سكن في دار كبيرة من الدور" });
    const pairGated = makeNode("passage/quran-18-49x", "passage", { unit: "ayah", work: "work/quran", sura: 18, aya: 49, text: "لا يغادر صغيرة ولا كبيرة إلا أحصاها وترى المجرمين مشفقين" });
    const waterskinFp = makeNode("passage/muwatta-1-166", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "1.166", text: "أمر رسول الله بذنوب من ماء فصب على ذلك المكان" });
    const futureBook = makeNode("passage/futurebook-2", "passage", { unit: "hadith", work: "work/future-targhib", ref: "1", text: "ومن هم بسيئة لم تكتب عليه" });
    const sayyiatConcept = { ...makeNode("concept/al-sayyiat", "concept", { kind: "ethical" }), tags: ["sayyiat-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, sayyiHadith, sayyiAyah, ithmMention, asaHadith, nisaFp, masaFp, asasFp, kohlFp, braceletFp, kabiraOnly, pairGated, waterskinFp, futureBook, sayyiatConcept] });
    const items = data["sayyiat.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/muslim-9996");
    expect(ids).toContain("passage/quran-11-114x");
    expect(ids).toContain("passage/muwatta-9996");
    expect(ids).toContain("passage/bukhari-9996");
    expect(ids).toContain("passage/quran-18-49x");
    expect(ids).toContain("passage/futurebook-2"); // a book harvested later lands automatically
    expect(ids).toContain("concept/al-sayyiat");
    expect(ids).not.toContain("passage/muwatta-9997"); // «النساء» hides «ساء» inside it
    expect(ids).not.toContain("passage/muwatta-9998"); // «مساء» is evening, not evil
    expect(ids).not.toContain("passage/quran-2-214x"); // «البأساء» is hardship
    expect(ids).not.toContain("passage/poem-x-ithmid"); // «إثمد» is kohl
    expect(ids).not.toContain("passage/poem-x-misam"); // «معصم» is a bracelet
    expect(ids).not.toContain("passage/muwatta-9999"); // «كبيرة» = "big" without a sin signal
    expect(ids).not.toContain("passage/muwatta-1-166"); // «ذنوب» waterskins — id-level exclusion
    expect(items.find((i) => i.id === "passage/muslim-9996")).toMatchObject({ section: "sunnah", sayyiat_kind: "sayyi" });
    expect(items.find((i) => i.id === "passage/quran-11-114x")).toMatchObject({ section: "quran", sayyiat_kind: "sayyi" });
    expect(items.find((i) => i.id === "passage/muwatta-9996")).toMatchObject({ section: "sunnah", sayyiat_kind: "related" });
    expect(items.find((i) => i.id === "passage/bukhari-9996")).toMatchObject({ section: "sunnah", sayyiat_kind: "related" });
    expect(items.find((i) => i.id === "passage/quran-18-49x")).toMatchObject({ section: "quran" });
    expect(items.find((i) => i.id === "concept/al-sayyiat")).toMatchObject({ section: "curated", sayyiat_kind: null });
    expect(featureApiData(compiled)["sayyiat.json"].feature).toBe("sayyiat-browser");
    expect(sayyiatKindOf(sayyiHadith as any)).toBe("sayyi");
    expect(sayyiatKindOf(ithmMention as any)).toBe("related");
    expect(sayyiatSignalsOf(nisaFp as any)).toEqual([]);
    expect(sayyiatSignalsOf(kohlFp as any)).toEqual([]);
    expect(sayyiatSignalsOf(braceletFp as any)).toEqual([]);
    expect(sayyiatSignalsOf(kabiraOnly as any)).toEqual([]);
    expect(sayyiatSignalsOf(pairGated as any)).toEqual(expect.arrayContaining(["kabira", "saghiira", "ijrim"]));
  });

  it("exports hudud: limits, penalties and major sins by corpus and kind, gated weak signals, exclusions, future-book inclusion", () => {
    const hududAyah = makeNode("passage/quran-2-229x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 229, text: "تلك حدود الله فلا تعتدوها" });
    const zinaAyah = makeNode("passage/quran-24-2x", "passage", { unit: "ayah", work: "work/quran", sura: 24, aya: 2, text: "الزانية والزاني فاجلدوا كل واحد منهما مائة جلدة" });
    const qatAyah = makeNode("passage/quran-5-38x", "passage", { unit: "ayah", work: "work/quran", sura: 5, aya: 38, text: "والسارق والسارقة فاقطعوا أيديهما" });
    const mubiqatHadith = makeNode("passage/muslim-0089x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "89x", text: "قال رسول الله اجتنبوا السبع الموبقات" });
    const densityPassage = makeNode("passage/tirmidhi-2625x", "passage", { unit: "hadith", work: "work/jami-al-tirmidhi", ref: "2625x", text: "في الزنا والسرقة من أصاب من ذلك شيئا فأقيم فيه الحد" });
    const tarjumaFp = makeNode("passage/musnad-9991", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9991", text: "وذكره في ترجمة أبي بكر رضي الله عنه" });
    const swordsFp = makeNode("passage/bukhari-4265x", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "4265x", text: "انقطعت في يدي يوم مؤتة تسعة أسياف" });
    const tazirFp = makeNode("passage/quran-48-9x", "passage", { unit: "ayah", work: "work/quran", sura: 48, aya: 9, text: "لتؤمنوا بالله ورسوله وتعزروه وتوقروه" });
    const guessFp = makeNode("passage/quran-18-22", "passage", { unit: "ayah", work: "work/quran", sura: 18, aya: 22, text: "سيقولون ثلاثة رابعهم كلبهم ويقولون خمسة سادسهم كلبهم رجما بالغيب" });
    const weakOnly = makeNode("passage/muwatta-9995", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9995", text: "وسار بين حدود المدينة" });
    const futureBook = makeNode("passage/futurefiqh-1", "passage", { unit: "hadith", work: "work/future-hidaya", ref: "1", text: "ويجب عليه الرجم إذا زنى" });
    const hududConcept = { ...makeNode("concept/hudud-allah-wal-kabair", "concept", { kind: "legal" }), tags: ["hudud-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, hududAyah, zinaAyah, qatAyah, mubiqatHadith, densityPassage, tarjumaFp, swordsFp, tazirFp, guessFp, weakOnly, futureBook, hududConcept] });
    const items = data["hudud.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-2-229x");        // «حدود الله»
    expect(ids).toContain("passage/quran-24-2x");         // «فاجلدوا» punishment flogging
    expect(ids).toContain("passage/quran-5-38x");         // «فاقطعوا أيديهما» the amputated hand
    expect(ids).toContain("passage/muslim-0089x");        // «السبع الموبقات»
    expect(ids).toContain("passage/tirmidhi-2625x");      // «الحد»+«الزنا»+«السرقة» density admission
    expect(ids).toContain("passage/futurefiqh-1");        // a book harvested later lands automatically
    expect(ids).toContain("concept/hudud-allah-wal-kabair");
    expect(ids).not.toContain("passage/musnad-9991");     // «ترجمة» biography, not stoning
    expect(ids).not.toContain("passage/bukhari-4265x");   // «انقطعت» broke, not «قطع»
    expect(ids).not.toContain("passage/quran-48-9x");     // «تعزّروه» honour, not «تعزير»
    expect(ids).not.toContain("passage/quran-18-22");     // «رجما بالغيب» guessing — id-level exclusion
    expect(ids).not.toContain("passage/muwatta-9995");    // lone weak «حدود» (borders)
    expect(items.find((i) => i.id === "passage/quran-2-229x")).toMatchObject({ section: "quran", hudud_kind: "hudud" });
    expect(items.find((i) => i.id === "passage/muslim-0089x")).toMatchObject({ section: "sunnah", hudud_kind: "kabair" });
    expect(items.find((i) => i.id === "passage/tirmidhi-2625x")).toMatchObject({ section: "sunnah", hudud_kind: "hudud" });
    expect(items.find((i) => i.id === "concept/hudud-allah-wal-kabair")).toMatchObject({ section: "curated", hudud_kind: null });
    expect(featureApiData(compiled)["hudud.json"].feature).toBe("hudud-browser");
    expect(hududKindOf(mubiqatHadith as any)).toBe("kabair");
    expect(hududSignalsOf(tarjumaFp as any)).toEqual([]);
    expect(hududSignalsOf(swordsFp as any)).toEqual([]);
    expect(hududSignalsOf(tazirFp as any)).toEqual([]);
    expect(hududSignalsOf(weakOnly as any)).toEqual([]);
  });

  it("exports hasanats: detected passages by corpus and kind, gated false positives, future-book inclusion", () => {
    const hasanatAyah = makeNode("passage/quran-11-114x", "passage", { unit: "ayah", work: "work/quran", sura: 11, aya: 114, text: "إن الحسنات يذهبن السيئات" });
    const hasanaHadith = makeNode("passage/muslim-9996", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9996", text: "كل عمل ابن آدم يضاعف الحسنة بعشر أمثالها" });
    const husnaAyah = makeNode("passage/quran-18-88x", "passage", { unit: "ayah", work: "work/quran", sura: 18, aya: 88, text: "فله جزاء الحسنى" });
    const qardHadith = makeNode("passage/muwatta-9996", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9996", text: "أقرضوا الله قرضا حسنا يضاعف لكم" });
    const badalAyah = makeNode("passage/quran-27-11x", "passage", { unit: "ayah", work: "work/quran", sura: 27, aya: 11, text: "إلا من ظلم ثم بدل حسنا بعد سوء" });
    const adjFp = makeNode("passage/quran-33-21x", "passage", { unit: "ayah", work: "work/quran", sura: 33, aya: 21, text: "لقد كان لكم في رسول الله أسوة حسنة" });
    const namesFp = makeNode("passage/quran-7-180x", "passage", { unit: "ayah", work: "work/quran", sura: 7, aya: 180, text: "ولله الأسماء الحسنى فادعوه بها" });
    const nameFp = makeNode("passage/muslim-9995", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9995", text: "روى الحسن بن علي عن النبي" });
    const gradeFp = makeNode("passage/muwatta-9995", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9995", text: "وهذا الحديث حسن صحيح" });
    const adverbFp = makeNode("passage/muslim-9994", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9994", text: "ففعل الرجل حسنا حين تصدق" });
    const futureBook = makeNode("passage/futurefiqh-1", "passage", { unit: "chapter", work: "work/future-fiqh", ref: "1", text: "قال المصنف: من همّ بحسنة لم يعملها كتبت له حسنة" });
    const futureWork = makeNode("work/future-fiqh", "work", { genre: ["fiqh"] });
    const hasanatConcept = { ...makeNode("concept/al-hasanat", "concept", { kind: "ethical" }), tags: ["hasanat-browser", "hasanat-concepts"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, hasanatAyah, hasanaHadith, husnaAyah, qardHadith, badalAyah, adjFp, namesFp, nameFp, gradeFp, adverbFp, futureBook, futureWork, hasanatConcept] });
    const items = data["hasanats.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-11-114x");
    expect(ids).toContain("passage/muslim-9996");
    expect(ids).toContain("passage/quran-18-88x");
    expect(ids).toContain("passage/muwatta-9996");
    expect(ids).toContain("passage/quran-27-11x");
    expect(ids).toContain("passage/futurefiqh-1"); // a book harvested later lands automatically
    expect(ids).toContain("concept/al-hasanat");
    expect(ids).not.toContain("passage/quran-33-21x"); // «أسوة حسنة» is the adjective, not a deed
    expect(ids).not.toContain("passage/quran-7-180x"); // «الأسماء الحسنى» is the divine names
    expect(ids).not.toContain("passage/muslim-9995"); // «الحسن بن علي» is a person's name
    expect(ids).not.toContain("passage/muwatta-9995"); // «حديث حسن» is the hadith grade
    expect(ids).not.toContain("passage/muslim-9994"); // «حسنا» the adverb is out of scope
    expect(items.find((i) => i.id === "passage/quran-11-114x")).toMatchObject({ section: "quran", hasanat_kind: "hasanat" });
    expect(items.find((i) => i.id === "passage/muslim-9996")).toMatchObject({ section: "sunnah", hasanat_kind: "hasana" });
    expect(items.find((i) => i.id === "passage/quran-18-88x")).toMatchObject({ section: "quran", hasanat_kind: "husna" });
    expect(items.find((i) => i.id === "passage/futurefiqh-1")).toMatchObject({ section: "books", hasanat_kind: "hasana" });
    expect(items.find((i) => i.id === "concept/al-hasanat")).toMatchObject({ section: "curated", hasanat_kind: null });
    expect(featureApiData(compiled)["hasanats.json"].feature).toBe("hasanat-browser");
    expect(hasanatKindOf(hasanatAyah as any)).toBe("hasanat");
    expect(hasanatSignalsOf(hasanaHadith as any)).toContain("hasana");
    expect(hasanatSignalsOf(qardHadith as any)).toContain("qard-hasan");
    expect(hasanatSignalsOf(adjFp as any)).toEqual([]);
    expect(hasanatSignalsOf(namesFp as any)).toEqual([]);
  });


  it("exports jannas: detected passages by corpus and kind, gated false positives, future-book inclusion", () => {
    const firdawsAyah = makeNode("passage/quran-23-11x", "passage", { unit: "ayah", work: "work/quran", sura: 23, aya: 11, text: "الذين يرثون الفردوس هم فيها خالدون" });
    const gateHadith = makeNode("passage/bukhari-1897x", "passage", { unit: "hadith", work: "work/sahih-al-bukhari", ref: "1897x", text: "في الجنة باب يقال له الريان يدخل منه الصائمون يوم القيامة" });
    const gatedAyah = makeNode("passage/quran-2-35x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 35, text: "يا آدم اسكن أنت وزوجك الجنة وكلا منها رغدا حيث شئتما" });
    const siraPassage = makeNode("passage/sira-1x", "passage", { unit: "chapter", work: "work/sira-ibn-hisham", ref: "1", text: "فبشره النبي بالجنة والفردوس" });
    const siraWork = makeNode("work/sira-ibn-hisham", "work", { genre: ["sira"] });
    const orchardAyah = makeNode("passage/quran-18-33x", "passage", { unit: "ayah", work: "work/quran", sura: 18, aya: 33, text: "كلا الجنتين آتت أكلها ولم تظلم منه شيئا وفجرنا خلالهما نهرا" });
    const shieldHadith = makeNode("passage/muslim-1151x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "1151x", text: "الصيام جنة فلا يرفث ولا يجهل" });
    const jinnAyah = makeNode("passage/quran-72-1x", "passage", { unit: "ayah", work: "work/quran", sura: 72, aya: 1, text: "أوحي إلي أنه استمع نفر من الجن فقالوا إنا سمعنا قرآنا عجبا" });
    const futureBook = makeNode("passage/futurebook-1", "passage", { unit: "chapter", work: "work/future-book", ref: "1", text: "وسئل عن الفردوس الأعلى فقال: هي أعلى الجنة" });
    const futureWork = makeNode("work/future-book", "work", { genre: ["fiqh"] });
    const jannaConcept = { ...makeNode("concept/firdaws", "concept", { kind: "belief" }), tags: ["janna-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, firdawsAyah, gateHadith, gatedAyah, siraPassage, siraWork, orchardAyah, shieldHadith, jinnAyah, futureBook, futureWork, jannaConcept] });
    const items = data["jannas.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-23-11x");
    expect(ids).toContain("passage/bukhari-1897x");
    expect(ids).toContain("passage/sira-1x");
    expect(ids).toContain("passage/futurebook-1"); // a book harvested later lands automatically
    expect(ids).toContain("concept/firdaws");
    expect(ids).not.toContain("passage/quran-2-35x"); // worldly garden of Adam's command context — no Paradise collocation
    expect(ids).not.toContain("passage/muslim-1151x"); // «الصيام جنة» is the shield matn
    expect(ids).not.toContain("passage/quran-72-1x"); // «الجن» is the jinn, never جنة
    expect(items.find((i) => i.id === "passage/quran-23-11x")).toMatchObject({ section: "quran", janna_kind: "description" });
    expect(items.find((i) => i.id === "passage/bukhari-1897x")).toMatchObject({ section: "sunnah" });
    expect(items.find((i) => i.id === "passage/sira-1x")).toMatchObject({ section: "seerah" });
    expect(items.find((i) => i.id === "passage/futurebook-1")).toMatchObject({ section: "books" });
    expect(items.find((i) => i.id === "concept/firdaws")).toMatchObject({ section: "curated", janna_kind: null });
    expect(featureApiData(compiled)["jannas.json"].feature).toBe("janna-browser");
    expect(jannaKindOf(firdawsAyah as any)).toBe("description");
    expect(jannaSignalsOf(firdawsAyah as any)).toContain("firdaws");
    expect(jannaSignalsOf(jinnAyah as any)).toEqual([]);
    expect(jannaSignalsOf(shieldHadith as any)).toEqual([]);
  });

  it("exports mukatabat: detected correspondence by corpus, kind and sender, gated false positives, future-book inclusion", () => {
    const propheticLetter = makeNode("passage/muslim-7541x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "7541x", text: "أرسل النبي إلى هرقل كتابا مختوما فيه من محمد إلى هرقل رسول الله" });
    const caliphalLetter = makeNode("passage/muwatta-9997", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9997", text: "فكتب عمر إلى معاوية كتابا فيه الأمر بكذا من أمره" });
    const royalReply = makeNode("passage/bukhari-9997", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "9997", text: "فكتب هرقل إلى النبي جوابه: من هرقل إلى محمد رسول الله" });
    const sulaymanAyah = makeNode("passage/quran-27-30x", "passage", { unit: "ayah", work: "work/quran", sura: 27, aya: 30, text: "إنه من سليمان وإنه بسم الله الرحمن الرحيم إنه علي أن أشكركم" });
    const baridMention = makeNode("passage/muwatta-9998", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9998", text: "كان صاحب البريد يتولى المكاتبات بين أقاليم الخلافة" });
    const fiqhFp = makeNode("passage/muwatta-9999", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9999", text: "بيعت جاريته بمكاتبة على ألف درهم" });
    const divineFp = makeNode("passage/muslim-9998", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9998", text: "لما خلق الله الخلق كتب في كتابه ما هو كائن إلى يوم القيامة" });
    const bookRefFp = makeNode("passage/muslim-9997", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9997", text: "روي في كتاب مسلم عن النبي" });
    const futureBook = makeNode("passage/futurebook-3", "passage", { unit: "chapter", work: "work/future-rasaail", ref: "1", text: "قال المؤلف: بعث الملك إلى السلطان كتابا بخطابه" });
    const futureWork = makeNode("work/future-rasaail", "work", { genre: ["adab"] });
    const curatedEvent = { ...makeNode("event/letters-to-rulers", "event", { kind: "other" }), tags: ["mukatabat-browser", "mukatabat-prophetic"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, propheticLetter, caliphalLetter, royalReply, sulaymanAyah, baridMention, fiqhFp, divineFp, bookRefFp, futureBook, futureWork, curatedEvent] });
    const items = data["mukatabat.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/muslim-7541x");
    expect(ids).toContain("passage/muwatta-9997");
    expect(ids).toContain("passage/bukhari-9997");
    expect(ids).toContain("passage/quran-27-30x");
    expect(ids).toContain("passage/muwatta-9998");
    expect(ids).toContain("passage/futurebook-3"); // a book harvested later lands automatically
    expect(ids).toContain("event/letters-to-rulers");
    expect(ids).not.toContain("passage/muwatta-9999"); // fiqh mukataba self-purchase, not correspondence
    expect(ids).not.toContain("passage/muslim-9998"); // «كتب في كتابه» is the divine register
    expect(ids).not.toContain("passage/muslim-9997"); // «في كتاب مسلم» names the book, not a letter
    expect(items.find((i) => i.id === "passage/muslim-7541x")).toMatchObject({ section: "sunnah", mukatabat_kind: "letter", sender: "prophetic" });
    expect(items.find((i) => i.id === "passage/muwatta-9997")).toMatchObject({ section: "sunnah", mukatabat_kind: "letter", sender: "caliphal" });
    expect(items.find((i) => i.id === "passage/bukhari-9997")).toMatchObject({ section: "sunnah", mukatabat_kind: "letter", sender: "royal" });
    expect(items.find((i) => i.id === "passage/quran-27-30x")).toMatchObject({ section: "quran", mukatabat_kind: "letter" });
    expect(items.find((i) => i.id === "passage/muwatta-9998")).toMatchObject({ section: "sunnah", mukatabat_kind: "mention", sender: "caliphal" });
    expect(items.find((i) => i.id === "passage/futurebook-3")).toMatchObject({ section: "books", mukatabat_kind: "letter", sender: "royal" });
    expect(items.find((i) => i.id === "event/letters-to-rulers")).toMatchObject({ section: "curated", mukatabat_kind: null, sender: "prophetic" });
    expect(featureApiData(compiled)["mukatabat.json"].feature).toBe("mukatabat-browser");
    expect(mukatabatKindOf(propheticLetter as any)).toBe("letter");
    expect(mukatabatKindOf(baridMention as any)).toBe("mention");
    expect(mukatabatSenderOf(propheticLetter as any)).toBe("prophetic");
    expect(mukatabatSenderOf(royalReply as any)).toBe("royal");
    expect(mukatabatSenderOf(baridMention as any)).toBe("caliphal"); // صاحب البريد is a caliphal office
    expect(mukatabatSignalsOf(fiqhFp as any)).toEqual([]);
    expect(mukatabatSignalsOf(divineFp as any)).toEqual([]);
    expect(mukatabatSignalsOf(bookRefFp as any)).toEqual([]);
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

  it("exports qiyama: detected passages by corpus and kind, gated ambiguous lexemes, exclusions, future-book inclusion", () => {
    const dayAyah = makeNode("passage/quran-99-6x", "passage", { unit: "ayah", work: "work/quran", sura: 99, aya: 6, text: "ان يوم الفصل كان ميقاتا يوميذ يصدر الناس أشتاتا" });
    const scaleAyah = makeNode("passage/quran-101-6x", "passage", { unit: "ayah", work: "work/quran", sura: 101, aya: 6, text: "فاما من فثقلت موازينه يوم القيامة فهو في عيشة راضية" });
    const hashrHadith = makeNode("passage/muslim-7777x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "7777x", text: "يحشر الناس يوم القيامة حفاة عراة غرلا" });
    const siraPassage = makeNode("passage/sira-2x", "passage", { unit: "chapter", work: "work/sira-ibn-hisham", ref: "2", text: "وذكر فيها البعث والحساب يوم القيامة" });
    const siraWork = makeNode("work/sira-ibn-hisham", "work", { genre: ["sira"] });
    const futureBook = makeNode("passage/futurebook-2", "passage", { unit: "chapter", work: "work/future-book", ref: "2", text: "وفي يوم الحساب توزن الاعمال بالميزان" });
    const futureWork = makeNode("work/future-book", "work", { genre: ["fiqh"] });
    const sendPassage = makeNode("passage/muwatta-7777x", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "7777x", text: "بعث الخليفة عاملا على المدينة فاقام فيها" });
    const clockPassage = makeNode("passage/bukhari-7777x", "passage", { unit: "hadith", work: "work/sahih-bukhari", ref: "7777x", text: "دخل المسجد والساعة عشر من النهار فصلى ركعتين" });
    const qiyamaConcept = { ...makeNode("concept/al-hisab-x", "concept", { kind: "belief" }), tags: ["qiyama-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, dayAyah, scaleAyah, hashrHadith, siraPassage, siraWork, futureBook, futureWork, sendPassage, clockPassage, qiyamaConcept] });
    const items = data["qiyama.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-99-6x");
    expect(ids).toContain("passage/quran-101-6x");
    expect(ids).toContain("passage/muslim-7777x");
    expect(ids).toContain("passage/sira-2x");
    expect(ids).toContain("passage/futurebook-2"); // a book harvested later lands automatically
    expect(ids).toContain("concept/al-hisab-x");
    expect(ids).not.toContain("passage/muwatta-7777x"); // «بعث» the dispatch, no resurrection collocation
    expect(ids).not.toContain("passage/bukhari-7777x"); // «الساعة» the clock-hour
    expect(items.find((i) => i.id === "passage/quran-99-6x")).toMatchObject({ section: "quran" });
    expect(items.find((i) => i.id === "passage/muslim-7777x")).toMatchObject({ section: "sunnah" });
    expect(items.find((i) => i.id === "passage/sira-2x")).toMatchObject({ section: "seerah" });
    expect(items.find((i) => i.id === "passage/futurebook-2")).toMatchObject({ section: "books" });
    expect(items.find((i) => i.id === "concept/al-hisab-x")).toMatchObject({ section: "curated", qiyama_kind: null });
    expect(featureApiData(compiled)["qiyama.json"].feature).toBe("qiyama-browser");
    expect(qiyamaKindOf(scaleAyah as any)).toBe("hisab");
    expect(qiyamaKindOf(hashrHadith as any)).toBe("baath");
    expect(qiyamaSignalsOf(scaleAyah as any)).toContain("mizan-strong");
    expect(qiyamaSignalsOf(clockPassage as any)).toEqual([]);
  });

  it("exports eschatology: detected passages by corpus and topic, tagged records, ambiguous-form gates", () => {
    const items = featureApiData(compiled)["eschatology.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-75-1");
    expect(ids).toContain("passage/muslim-9998");
    expect(ids).toContain("concept/yaum-al-qiyama");
    expect(ids).not.toContain("passage/muwatta-9998"); // «ساعة» the watch, not the Hour
    expect(items.find((i) => i.id === "passage/quran-75-1")).toMatchObject({ section: "quran", sura: 75, aya: 1 });
    expect(items.find((i) => i.id === "passage/muslim-9998")).toMatchObject({ section: "sunnah" });
    expect(items.find((i) => i.id === "concept/yaum-al-qiyama")).toMatchObject({ section: "hereafter" });
    expect(featureApiData(compiled)["eschatology.json"].feature).toBe("eschatology-browser");
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

  it("exports miracles: detected topics, corpus sections, kind, subjects and the subject index", () => {
    const staff = makeNode("passage/quran-26-30x", "passage", { unit: "ayah", work: "work/quran", sura: 26, aya: 30, text: "فألقي عصاه فإذا هي ثعبان مبين" });
    const sea = makeNode("passage/quran-26-63x", "passage", { unit: "ayah", work: "work/quran", sura: 26, aya: 63, text: "فأوحينا إلى موسى أن اضرب بعصاك البحر" });
    const camel = makeNode("passage/quran-26-155x", "passage", { unit: "ayah", work: "work/quran", sura: 26, aya: 155, text: "فكذبت ثمود بعذابه" });
    const plain = makeNode("passage/muslim-0002x", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "2x", text: "إن الرجل ليصلي" });
    const bookMiracle = makeNode("passage/book-x-1", "passage", { unit: "page", work: "work/book-x", ref: "p1", text: "ومن معجزات النبي أنه نبع الماء من بين أصابعه وكان ذلك بأمر الله" });
    const bookPlain = makeNode("passage/book-x-2", "passage", { unit: "page", work: "work/book-x", ref: "p2", text: "وضرب الرجل بعصاه الأرض" });
    const musa = makeNode("person/musa", "person", { kind: "prophet" });
    const data = featureApiData({
      ...compiled,
      nodes: [...compiled.nodes, staff, sea, camel, plain, bookMiracle, bookPlain, musa],
    });
    const items = data["miracles.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-26-30x");
    expect(ids).toContain("passage/quran-26-63x");
    expect(ids).toContain("passage/book-x-1");
    expect(ids).not.toContain("passage/muslim-0002x");
    expect(ids).not.toContain("passage/book-x-2"); // a bare staff in a book is not a miracle mention
    expect(items.find((i) => i.id === "passage/quran-26-63x")).toMatchObject({ section: "quran", kind: "event" });
    expect((data["miracles.json"] as any).subjects.map((s: any) => s.id)).toContain("person/musa");
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

  it("exports islamic-economy: detected passages by corpus and topic, tagged records, gated ambiguous forms", () => {
    const ribaAyah = makeNode("passage/quran-2-275x", "passage", { unit: "ayah", work: "work/quran", sura: 2, aya: 275, text: "الذين يأكلون الربا لا يقومون إلا كما يقوم الذي يتخبطه الشيطان" });
    const waqfHadith = makeNode("passage/muslim-9996", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9996", text: "أوقف رجل أرضه على المسجد والأوقاف للعباد" });
    const deedHadith = makeNode("passage/muwatta-9996", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9996", text: "كتبوا في الوثيقة بينهما ميثاقاً" });
    const bookPassage = makeNode("passage/fiqhbook-1", "passage", { unit: "section", work: "work/future-fiqh", ref: "1", text: "باب في البيوع والربا" });
    const seerahPassage = makeNode("passage/sira-1", "passage", { unit: "section", work: "work/future-sira", ref: "1", text: "وكان يتجر فتاجر فأعطاه ديناراً" });
    const stopFp = makeNode("passage/muwatta-9997", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9997", text: "وقف الرجل عند الباب ثم انصرف" });
    const debtFp = makeNode("passage/muslim-9997", "passage", { unit: "hadith", work: "work/sahih-muslim", ref: "9997", text: "الدين يسر والرزق" });
    const waqfConcept = { ...makeNode("concept/waqf", "concept", { kind: "term" }), tags: ["islamic-economy-browser", "islamic-economy-waqf"] };
    const bookWork = { ...makeNode("work/iqtisad-x", "work", { kind: "book" }), tags: ["islamic-economy-browser", "islamic-economy-books", "islamic-economy-money"] };
    const siraWork = makeNode("work/future-sira", "work", { genre: ["sira"] });
    const fiqhWork = makeNode("work/future-fiqh", "work", { genre: ["fiqh"] });
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, ribaAyah, waqfHadith, deedHadith, bookPassage, seerahPassage, stopFp, debtFp, waqfConcept, bookWork, siraWork, fiqhWork] });
    const items = data["islamic-economy.json"].items;
    const ids = items.map((i) => i.id);
    expect(ids).toContain("passage/quran-2-275x");
    expect(ids).toContain("passage/muslim-9996");
    expect(ids).toContain("passage/muwatta-9996");
    expect(ids).toContain("passage/fiqhbook-1"); // a book harvested later lands automatically
    expect(ids).toContain("passage/sira-1");
    expect(ids).toContain("concept/waqf");
    expect(ids).toContain("work/iqtisad-x");
    expect(ids).not.toContain("passage/muwatta-9997"); // «وقف» "he stopped" is not endowment
    expect(ids).not.toContain("passage/muslim-9997"); // «الدين» "religion" is not debt
    expect(items.find((i) => i.id === "passage/quran-2-275x")).toMatchObject({ section: "quran", topics: ["money"] });
    expect(items.find((i) => i.id === "passage/muslim-9996")).toMatchObject({ section: "sunnah", topics: ["waqf"] });
    expect(items.find((i) => i.id === "passage/muwatta-9996")).toMatchObject({ section: "sunnah", topics: ["sukuk"] });
    expect(items.find((i) => i.id === "passage/fiqhbook-1")).toMatchObject({ section: "books" });
    expect(items.find((i) => i.id === "passage/sira-1")).toMatchObject({ section: "seerah" });
    expect(items.find((i) => i.id === "concept/waqf")).toMatchObject({ section: "curated", topics: ["waqf"] });
    expect(items.find((i) => i.id === "work/iqtisad-x")).toMatchObject({ section: "books", topics: ["money"] });
    expect(data["islamic-economy.json"].feature).toBe("islamic-economy-browser");
  });

  it("is empty-capable", () => {
    const data = featureApiData({ ...compiled, nodes: [book], edges: [] });
    for (const body of Object.values(data)) expect(body.items).toEqual([]);
  });

  it("exports hisab: counting passages by corpus and ledger kind, calculator rows, gated false positives, future-book inclusion", () => {
    const tenfold = makeNode("passage/quran-6-160x", "passage", { unit: "ayah", work: "work/quran", sura: 6, aya: 160, text: "من جاء بالحسنة فله عشر أمثالها ومن جاء بالسيئة فلا يجزى إلا مثلها" });
    const tahlil = makeNode("passage/muwatta-9990", "passage", { unit: "hadith", work: "work/muwatta-malik", ref: "9990", text: "كانت له عدل عشر رقاب وكتبت له مئة حسنة ومحيت عنه مئة سيئة" });
    const vowelled = makeNode("passage/tirmidhi-9990", "passage", { unit: "hadith", work: "work/jami-al-tirmidhi", ref: "9990", text: "تُكْتَبُ لَهُ أَلْفُ حَسَنَةٍ وَتُحَطُّ عَنْهُ أَلْفُ سَيِّئَةٍ" });
    const scale = makeNode("passage/quran-101-6x", "passage", { unit: "ayah", work: "work/quran", sura: 101, aya: 6, text: "فأما من ثقلت موازينه" });
    const scribes = makeNode("passage/quran-82-11x", "passage", { unit: "ayah", work: "work/quran", sura: 82, aya: 11, text: "كراما كاتبين" });
    const plainMention = makeNode("passage/quran-7-131x", "passage", { unit: "ayah", work: "work/quran", sura: 7, aya: 131, text: "فإذا جاءتهم الحسنة قالوا لنا هذه" });
    const faithGrain = makeNode("passage/bukhari-9990", "passage", { unit: "hadith", work: "work/sahih-al-bukhari", ref: "9990", text: "أخرجوا من كان في قلبه مثقال حبة من خردل من إيمان" });
    const ahzabDua = makeNode("passage/tirmidhi-9991", "passage", { unit: "hadith", work: "work/jami-al-tirmidhi", ref: "9991", text: "اللهم منزل الكتاب سريع الحساب اهزم الأحزاب" });
    const futureBook = makeNode("passage/futurezuhd-1", "passage", { unit: "chapter", work: "work/future-zuhd", ref: "1", text: "قال الحسن: من صلى ركعتين غفر له ما تقدم من ذنبه" });
    const futureWork = makeNode("work/future-zuhd", "work", { genre: ["zuhd"] });
    const row = { ...makeNode("concept/hisab-row-x", "concept", { kind: "doctrine", reckoning: { effect: "hasanat", hasanat: 10, hasanat_max: 700, unit: { en: "per good deed" }, basis: ["passage/quran-6-160x"] } }), tags: ["hisab-browser", "hisab-calculator"] };
    const umbrella = { ...makeNode("concept/hisab-al-hasanat-wal-sayyiat", "concept", { kind: "doctrine" }), tags: ["hisab-browser"] };
    const data = featureApiData({ ...compiled, nodes: [...compiled.nodes, tenfold, tahlil, vowelled, scale, scribes, plainMention, faithGrain, ahzabDua, futureBook, futureWork, row, umbrella] });
    expect(data["hisab.json"].feature).toBe("hisab-browser");
    const items = data["hisab.json"].items;
    const ids = items.map((i) => i.id);
    for (const id of ["passage/quran-6-160x", "passage/muwatta-9990", "passage/tirmidhi-9990", "passage/quran-101-6x", "passage/quran-82-11x", "passage/futurezuhd-1", "concept/hisab-row-x", "concept/hisab-al-hasanat-wal-sayyiat"]) expect(ids).toContain(id);
    expect(ids).not.toContain("passage/quran-7-131x"); // a plain mention with no counting belongs to the Hasanat browser
    expect(ids).not.toContain("passage/bukhari-9990"); // «مثقال حبة من إيمان» weighs faith, not a deed
    expect(ids).not.toContain("passage/tirmidhi-9991"); // «سريع الحساب اهزم الأحزاب» is a supplication
    expect(items.find((i) => i.id === "passage/quran-6-160x")).toMatchObject({ section: "quran", hisab_kinds: ["hasanat", "sayyiat"] });
    expect(items.find((i) => i.id === "passage/muwatta-9990")).toMatchObject({ section: "sunnah", hisab_kinds: ["hasanat", "sayyiat", "erasure"] });
    expect(items.find((i) => i.id === "passage/tirmidhi-9990")).toMatchObject({ section: "sunnah" });
    expect(items.find((i) => i.id === "passage/quran-101-6x")).toMatchObject({ hisab_kinds: ["scale"] });
    expect(items.find((i) => i.id === "passage/futurezuhd-1")).toMatchObject({ section: "books", hisab_kinds: ["erasure"] });
    expect(items.find((i) => i.id === "concept/hisab-row-x")).toMatchObject({ section: "curated", hisab_kinds: ["hasanat"], reckoning: { hasanat: 10, hasanat_max: 700 } });
    expect(items.find((i) => i.id === "concept/hisab-al-hasanat-wal-sayyiat")).toMatchObject({ section: "curated", reckoning: null });
    expect(hisabKindsOfSignals(hisabSignalsOfText(hisabFold("صَلاَةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلاَةِ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً")))).toEqual(["hasanat"]);
  });
});
