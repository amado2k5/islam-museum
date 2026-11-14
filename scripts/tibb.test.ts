import { describe, expect, it } from "vitest";
import type { Node } from "./build-graph.js";
import { tibbFold, tibbSignalsOf, tibbTopicsOf, tibbCorpusOf, tibbTagSection, tibbTagTopics, isTibbPassage, TIBB_TOPICS, TIBB_SECTIONS } from "./tibb.js";

const makeNode = (id: string, cls: string, data: Record<string, any> = {}, tags: string[] = []): Node => ({
  id, class: cls, slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub: false,
  wings: [], regions: [], periods: [], tags, aliases: [], themes: [], data, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-14",
});
const quran = (sura: number, aya: number, text: string) =>
  makeNode(`passage/quran-${sura}-${aya}`, "passage", { unit: "ayah", work: "work/quran", sura, aya, text });
const hadith = (id: string, text: string) =>
  makeNode(`passage/${id}`, "passage", { unit: "hadith", work: "work/sahih-al-bukhari", ref: id.split("-")[1], text });
const book = (id: string, text: string) =>
  makeNode(`passage/${id}`, "passage", { unit: "chapter", work: "work/book-x", ref: "1", text });

// The acceptance rules of docs/engineering/47-tibb-browser-requirements.md (TIB-R..).
describe("medicine detector (docs/plan/57, docs/engineering/47)", () => {
  it("TIB-R01: the six topics and five sections are the browser's title and corpora, in order", () => {
    expect([...TIBB_TOPICS]).toEqual(["nabawi", "tibb", "tashrih", "jiraha", "dawa", "tadawi"]);
    expect([...TIBB_SECTIONS]).toEqual(["quran", "sunnah", "seerah", "books", "curated"]);
  });

  it("TIB-R02: folding strips vowel marks and unifies alif forms", () => {
    expect(tibbFold("الْحَبَّةِ السَّوْدَاءِ شِفَاءٌ")).toBe("الحبة السوداء شفاء");
    expect(tibbFold("أَبْرِئُ الأَكْمَهَ")).toBe("ابرئ الاكمه");
  });

  it("TIB-R03: prophetic-medicine reports are detected under nabawi", () => {
    expect(tibbTopicsOf(hadith("bukhari-1", "في الحبة السوداء شفاء من كل داء إلا السام"))).toEqual(expect.arrayContaining(["nabawi", "dawa", "tadawi"]));
    expect(tibbTopicsOf(hadith("bukhari-2", "احتجم رسول الله وأعطى الحجام أجره"))).toContain("nabawi");
    expect(tibbTopicsOf(hadith("bukhari-3", "الشفاء في ثلاث شربة عسل وشرطة محجم وكية نار وأنهى أمتي عن الكي"))).toContain("nabawi");
    expect(tibbSignalsOf(hadith("bukhari-4", "التلبينة مجمة لفؤاد المريض"))).toContain("talbina");
  });

  it("TIB-R04: illness, fever, plague, contagion and visiting the sick are detected under tibb", () => {
    expect(tibbTopicsOf(hadith("bukhari-5", "الحمى من فيح جهنم فأبردوها بالماء"))).toContain("tibb");
    expect(tibbSignalsOf(hadith("bukhari-6", "إذا سمعتم بالطاعون بأرض فلا تدخلوها"))).toContain("waba");
    expect(tibbSignalsOf(hadith("bukhari-7", "لا عدوى ولا طيرة وفر من المجذوم كما تفر من الأسد"))).toEqual(expect.arrayContaining(["adwa", "judham"]));
    expect(tibbSignalsOf(hadith("bukhari-8", "من عاد مريضا لم يزل في خرفة الجنة"))).toContain("iyada");
  });

  it("TIB-R05: the stages of creation and the organs are detected under tashrih", () => {
    expect(tibbTopicsOf(quran(22, 5, "فإنا خلقناكم من تراب ثم من نطفة ثم من علقة ثم من مضغة"))).toContain("tashrih");
    expect(tibbTopicsOf(quran(50, 16, "ونحن أقرب إليه من حبل الوريد"))).toContain("tashrih");
    expect(tibbTopicsOf(hadith("bukhari-9", "كل سلامى من الناس عليه صدقة"))).toContain("tashrih");
  });

  it("TIB-R06: wound treatment is surgery; the legal compensation of wounds is not", () => {
    expect(tibbTopicsOf(hadith("bukhari-10", "كنا نغزو مع النبي نسقي القوم ونداوي الجرحى"))).toContain("jiraha");
    expect(tibbTopicsOf(hadith("bukhari-11", "فأخذت حصيرا فأحرقته فحشت به جرحه فاستمسك الدم"))).toContain("jiraha");
    expect(isTibbPassage(hadith("bukhari-12", "وفي الجراح القصاص والموضحة فيها خمس من الإبل"))).toBe(false);
  });

  it("TIB-R07: drugs, poison and seeking treatment are detected", () => {
    expect(tibbTopicsOf(hadith("bukhari-13", "ما أنزل الله داء إلا أنزل له دواء"))).toContain("dawa");
    expect(tibbTopicsOf(hadith("bukhari-14", "تداووا عباد الله فإن الله لم يضع داء إلا وضع له شفاء"))).toContain("tadawi");
    expect(tibbSignalsOf(hadith("bukhari-15", "إنه ليس بدواء ولكنه داء"))).toContain("haram_dawa");
  });

  it("TIB-R08: the guarded words do not fire outside their medical sense", () => {
    expect(isTibbPassage(quran(2, 10, "في قلوبهم مرض فزادهم الله مرضا"))).toBe(false); // the disease of the hearts
    expect(isTibbPassage(quran(7, 40, "حتى يلج الجمل في سم الخياط"))).toBe(false); // the eye of the needle
    expect(isTibbPassage(quran(4, 135, "كونوا قوامين بالقسط شهداء لله"))).toBe(false); // justice, not costus
    expect(isTibbPassage(quran(47, 15, "وأنهار من عسل مصفى"))).toBe(false); // the rivers of Paradise
    expect(isTibbPassage(quran(60, 1, "لا تتخذوا عدوي وعدوكم أولياء"))).toBe(false); // «عدوّي», not contagion
    expect(isTibbPassage(hadith("bukhari-16", "ألا وإن حمى الله محارمه"))).toBe(false); // the protected pasture, not fever
    expect(isTibbPassage(quran(1, 1, "بسم الله الرحمن الرحيم"))).toBe(false); // «بسم», not poison
    expect(isTibbPassage(hadith("bukhari-17", "حدثنا علي بن ميمون الرقي حدثنا محمد بن عبيد قال صلى بنا"))).toBe(false); // a narrator's nisba, not ruqya
    expect(isTibbPassage(hadith("bukhari-18", "حدثنا وكيع بن الجراح عن سفيان قال صلى بنا"))).toBe(false); // a name, not a wound
  });

  it("TIB-R09: outside the Qur'an and hadith a bare illness or healing word alone is not enough", () => {
    expect(isTibbPassage(book("book-x-1", "ثم مرض الأمير في جمادى الآخرة وسار إلى دمشق"))).toBe(false);
    expect(isTibbPassage(book("book-x-2", "وفي هذا البسط شفاء الغليل لمن طلب التحقيق"))).toBe(false);
    expect(isTibbPassage(book("book-x-3", "ثم مرض الأمير فأحضر له الطبيب فوصف له الدواء"))).toBe(true);
    expect(isTibbPassage(hadith("bukhari-19", "ما من مسلم يصيبه أذى من مرض فما سواه إلا حط الله سيئاته"))).toBe(true);
  });

  it("TIB-R10: corpus sections follow the work — Qur'an, hadith, seerah, other books", () => {
    expect(tibbCorpusOf("work/quran", undefined, "ayah")).toBe("quran");
    expect(tibbCorpusOf("work/sahih-al-bukhari", ["hadith"], "hadith")).toBe("sunnah");
    expect(tibbCorpusOf("work/zad-al-maad", ["sira"], "chapter")).toBe("seerah");
    expect(tibbCorpusOf("work/al-qanun-fi-al-tibb", ["medicine"], "chapter")).toBe("books");
    expect(tibbCorpusOf("work/future-book", undefined, "page")).toBe("books"); // a book harvested later lands by itself
  });

  it("TIB-R11: curated records join by tag and carry their topics", () => {
    const n = makeNode("person/al-zahrawi", "person", {}, ["tibb-browser", "tibb-jiraha"]);
    expect(tibbTagSection(n)).toBe("curated");
    expect(tibbTagTopics(n)).toEqual(["jiraha"]);
    expect(tibbSignalsOf(n)).toEqual([]); // only passages are detected by text
  });
});
