import { describe, expect, it } from "vitest";
import type { Node } from "./build-graph.js";
import { arabiyyaCorpusOf, arabiyyaTagSection, isArabiyyaPassage, stripMarks } from "./arabiyya.js";

// Requirements: docs/engineering/66-arabic-language-browser-requirements.md (R2, R3, R4).
const makeNode = (id: string, cls: string, data: Record<string, any> = {}, tags: string[] = []): Node => ({
  id, class: cls, slug: id.split("/")[1], label: { ar: id, en: id, ur: id }, summary: { ar: "", en: "", ur: "" }, stub: false,
  wings: [], regions: [], periods: [], tags, aliases: [], themes: [], data, prose: {}, degree: 0, contemporaries: [], updated: "2026-11-21",
});
const ayah = (id: string, text: string) => makeNode(id, "passage", { unit: "ayah", work: "work/quran", text_search: text });
const book = (id: string, text: string, extra: Record<string, any> = {}) => makeNode(id, "passage", { unit: "page", work: "work/some-book", text, ...extra });

describe("Arabic Language Browser detector", () => {
  it("finds the verses in which the Qur'an names its tongue, vowelled or not", () => {
    expect(isArabiyyaPassage(ayah("passage/quran-a", "إنا أنزلناه قرآنا عربيا لعلكم تعقلون"))).toBe(true);
    expect(isArabiyyaPassage(ayah("passage/quran-b", "وما أرسلنا من رسول إلا بلسان قومه ليبين لهم"))).toBe(true);
    expect(isArabiyyaPassage(ayah("passage/quran-c", "ولو نزلناه على بعض الأعجمين"))).toBe(true);
    expect(isArabiyyaPassage(makeNode("passage/quran-d", "passage", { unit: "ayah", work: "work/quran", text: "قُرْءَٰنًا عَرَبِيًّا غَيْرَ ذِى عِوَجٍ" }))).toBe(true);
  });
  it("does not take the desert Arabs or an unrelated verse for the language", () => {
    expect(isArabiyyaPassage(ayah("passage/quran-e", "الأعراب أشد كفرا ونفاقا"))).toBe(false);
    expect(isArabiyyaPassage(ayah("passage/quran-f", "قل هو الله أحد"))).toBe(false);
    expect(isArabiyyaPassage(makeNode("passage/quran-12", "passage", { unit: "surah", work: "work/quran", text: "عربيا" }))).toBe(false);
  });
  it("finds talk about Arabic in any harvested book, and so in any book harvested later", () => {
    expect(isArabiyyaPassage(book("passage/x-1", "فاكتبوه بلسان قريش فإنما نزل بلسانهم"))).toBe(true);
    expect(isArabiyyaPassage(book("passage/x-2", "تَعَلَّمُوا العَرَبِيَّةَ فإنها تزيد في العقل"))).toBe(true);
    expect(isArabiyyaPassage(book("passage/x-3", "وكان أول من وضع النحو أبو الأسود"))).toBe(true);
    expect(isArabiyyaPassage(book("passage/future-book-9", "والقرآن نزل بلغة العرب"))).toBe(true);
  });
  it("leaves out the known false positives", () => {
    expect(isArabiyyaPassage(book("passage/x-4", "قال ابن العربي: والصحيح أنه واجب"))).toBe(false); // a man's name
    expect(isArabiyyaPassage(book("passage/x-5", "انظر لسان العرب، ج 3 ص 20"))).toBe(false); // a dictionary citation
    expect(isArabiyyaPassage(book("passage/x-6", "وعلى النحو المذكور في الباب"))).toBe(false); // "in the manner"
    expect(isArabiyyaPassage(makeNode("concept/x", "concept", { text: "اللغة العربية" }))).toBe(false); // passages only
    expect(isArabiyyaPassage({ ...book("passage/x-7", "اللغة العربية"), stub: true })).toBe(false);
  });
  it("files a passage by its work and a curated record by its tag", () => {
    expect(arabiyyaCorpusOf("work/quran", undefined, "ayah")).toBe("quran");
    expect(arabiyyaCorpusOf("work/x", ["hadith"], "hadith")).toBe("sunnah");
    expect(arabiyyaCorpusOf("work/x", ["sira"], "page")).toBe("seerah");
    expect(arabiyyaCorpusOf("work/x", ["tafsir"], "page")).toBe("tafsir");
    expect(arabiyyaCorpusOf("work/x", ["history"], "page")).toBe("books");
    expect(arabiyyaTagSection(makeNode("concept/a", "concept", {}, ["arabiyya-browser", "arabiyya-ijaz"]))).toBe("ijaz");
    expect(arabiyyaTagSection(makeNode("concept/b", "concept", {}, ["arabiyya-browser"]))).toBe("sciences");
    expect(arabiyyaTagSection(makeNode("concept/c", "concept", {}, ["arabiyya-browser", "arabiyya-unknown"]))).toBe("sciences");
  });
  it("strips vowel marks and the dagger alif", () => {
    expect(stripMarks("عَرَبِيًّا")).toBe("عربيا");
  });
});
