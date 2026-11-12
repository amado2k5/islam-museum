import { describe, expect, it } from "vitest";
import type { Node } from "./build-graph.js";
import { qurunTopicsOf, qurunKindOf, qurunCorpusOf, normalizeQurunArabic, QURUN_TOPIC_SUBJECTS } from "./qurun.js";

const makeNode = (id: string, cls: string, data: Record<string, any> = {}): Node => ({
  id, class: cls, slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub: false,
  wings: [], regions: [], periods: [], tags: [], aliases: [], themes: [], data, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-06",
});
const quran = (sura: number, aya: number, text: string) =>
  makeNode(`passage/quran-${sura}-${aya}`, "passage", { unit: "ayah", work: "work/quran", sura, aya, text });
const hadith = (id: string, work: string, text: string) =>
  makeNode(`passage/${id}`, "passage", { unit: "hadith", work, ref: id.split("-")[1], text });
const book = (id: string, text: string) =>
  makeNode(`passage/${id}`, "passage", { unit: "page", work: "work/book-x", ref: "p1", text });

describe("qurun detector (docs/plan/54, docs/engineering/42 QUR-R..)", () => {
  it("normalizeQurunArabic unifies hamza seats, alef forms, ta marbuta and alef maqsura", () => {
    expect(normalizeQurunArabic("الأَشْهُرُ الْحُرُمُ")).toBe("الاشهر الحرم");
    expect(normalizeQurunArabic("ذِي الْحِجَّةِ")).toBe("ذي الحجه");
    expect(normalizeQurunArabic("سَنَةً")).toBe("سنه");
  });

  it("QUR-R01: the twelve-months verse is detected as sacred", () => {
    const n = quran(9, 36, "إن عدة الشهور عند الله اثنا عشر شهرا في كتاب الله يوم خلق السماوات والأرض منها أربعة حرم ذلك الدين القيم فلا تظلموا فيهن أنفسكم");
    expect(qurunTopicsOf(n, "quran")).toContain("sacred");
    expect(qurunTopicsOf(n, "quran")).toContain("shuhur");
    expect(qurunKindOf(n)).toBe("period");
  });

  it("QUR-R02: شهر رمضان is detected as period", () => {
    const n = quran(2, 185, "شهر رمضان الذي أنزل فيه القرآن هدى للناس وبينات من الهدى والفرقان");
    expect(qurunTopicsOf(n, "quran")).toContain("ramadan");
    expect(qurunKindOf(n)).toBe("period");
  });

  it("QUR-R03: ليلة القدر is detected under ramadan", () => {
    const n = quran(97, 1, "إنا أنزلناه في ليلة القدر");
    expect(qurunTopicsOf(n, "quran")).toContain("ramadan");
  });

  it("QUR-R04: the Nasī' verse is detected as sacred", () => {
    const n = quran(9, 37, "إنما النسيء زيادة في الكفر يضل به الذين كفروا يحلونه عاما ويحرمونه عاما");
    expect(qurunTopicsOf(n, "quran")).toContain("sacred");
  });

  it("QUR-R05: «سنة» the sunnah sense never fires; «سنين» the years plural does", () => {
    const sunnah = hadith("bukhari-1", "work/sahih-bukhari", "من رغب عن سنتي فليس مني");
    const years = quran(12, 47, "قال تزرعون سبع سنين دأبا فما حصدتم فذروه في سنبله");
    expect(qurunTopicsOf(sunnah, "sunnah")).toHaveLength(0);
    expect(qurunTopicsOf(years, "quran")).toContain("sunnin");
  });

  it("QUR-R06: «قرون» beside beasts is horns, not generations", () => {
    const horns = book("book-x-1", "وفي الرعاية ضبط قرون الثيران وقرون البقر عند الحلب في موسم النتاج");
    const generations = book("book-x-2", "وتوالت القرون والأجيال على هذا العلم حتى دونه المؤلفون في شهر محرم من سنتهم");
    expect(qurunTopicsOf(horns, "books")).not.toContain("qurun");
    expect(qurunTopicsOf(generations, "books")).toContain("qurun");
  });

  it("QUR-R07: «رجب» the man's name never fires; رجب مضر does", () => {
    const man = book("book-x-3", "قال ابن رجب في كتابه في شهر رمضان");
    const month = hadith("bukhari-2", "work/sahih-bukhari", "كان العرب يسمون رجب شهر الله الأصم وهو رجب مضر");
    expect(qurunTopicsOf(man, "books")).not.toContain("rajab");
    expect(qurunTopicsOf(month, "sunnah")).toContain("rajab");
  });

  it("QUR-R08: «صفر» bare never fires; صفر الخير does", () => {
    const n = book("book-x-4", "وسفره في الرياضيات رمز للعدد صفر في شهر محرم");
    const m = book("book-x-5", "وهلال صفر الخير يطلع بعد المحرم في الشهور الهجرية");
    expect(qurunTopicsOf(n, "books")).not.toContain("safar");
    expect(qurunTopicsOf(m, "books")).toContain("safar");
  });

  it("QUR-R09: the named years of the seerah are detected as period", () => {
    const n = book("book-x-6", "ولد النبي عام الفيل وأمات أبا طالب وخديجة عام الحزن في شهر رمضان");
    expect(qurunTopicsOf(n, "books")).toContain("named-years");
    expect(qurunKindOf(n)).toBe("period");
  });

  it("QUR-R10: «عام» the public/general sense never fires", () => {
    const n = book("book-x-7", "وهذا مما اجمع عليه عام الناس وعامه العلماء في القرن الثالث الهجري");
    expect(qurunTopicsOf(n, "books")).not.toContain("sunnin");
  });

  it("QUR-R11: ذو الحجة and its عشر and عرفة and أيام التشريق are detected", () => {
    const n = hadith("bukhari-3", "work/sahih-bukhari", "ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام يعني أيام العشر يوم عرفة ويوم النحر وأيام التشريق في ذي الحجة");
    const t = qurunTopicsOf(n, "sunnah");
    expect(t).toContain("dhul-hijja");
  });

  it("QUR-R12: detection reads matn only — a label saying رمضان with clean text does not fire", () => {
    const n = makeNode("passage/book-x-8", "passage", { unit: "page", work: "work/book-x", ref: "p8", text: "فصل في أحكام البيع" });
    n.label = { ar: "باب صيام رمضان", en: "Ramadan chapter", ur: "رمضان" };
    expect(qurunTopicsOf(n, "books")).toHaveLength(0);
  });

  it("QUR-R13: every topic maps to at least the subjects it should land on", () => {
    expect(QURUN_TOPIC_SUBJECTS["muharram"]).toContain("concept/muharram-month");
    expect(QURUN_TOPIC_SUBJECTS["sacred"]).toContain("concept/al-ashhur-al-hurum");
    expect(QURUN_TOPIC_SUBJECTS["named-years"]).toContain("event/year-of-the-elephant-and-birth");
    expect(QURUN_TOPIC_SUBJECTS["ramadan"]).toContain("concept/ramadan-month");
    expect(QURUN_TOPIC_SUBJECTS["dhul-hijja"]).toContain("concept/ayyam-al-tashriq");
  });

  it("QUR-R14: corpus section derivation", () => {
    expect(qurunCorpusOf("work/quran", ["scripture"], "ayah")).toBe("quran");
    expect(qurunCorpusOf("work/sahih-bukhari", ["hadith"], "hadith")).toBe("sunnah");
    expect(qurunCorpusOf("work/raheeq", ["sira"], undefined)).toBe("seerah");
    expect(qurunCorpusOf("work/book-x", ["book"], "page")).toBe("books");
  });
});
