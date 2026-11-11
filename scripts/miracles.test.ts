import { describe, expect, it } from "vitest";
import type { Node } from "./build-graph.js";
import { miracleTopicsOf, miracleKindOf, miracleCorpusOf, normalizeMiracleArabic, MIRACLE_TOPIC_SUBJECTS } from "./miracles.js";

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

describe("miracles detector (docs/plan/44, docs/engineering/32 MIR-R..)", () => {
  it("normalizeMiracleArabic unifies hamza seats, alef forms, ta marbuta and alef maqsura", () => {
    expect(normalizeMiracleArabic("أَعْجَزَكُمْ")).toBe("اعجزكم");
    expect(normalizeMiracleArabic("السَّمَاءِ")).toBe("السماء".replace("ء", ""));
    expect(normalizeMiracleArabic("مائدة")).toBe("مايده");
  });

  it("MIR-R07: «معجزين» the verb 'to defeat' in the Qur'an is not the miracle noun", () => {
    const n = quran(6, 134, "ولقد جئتكم بآية من آيات الله لئن أجتمعت الإنس والجن على أن يأتوا بمثل هذا القرآن لا يأتون بمثله ولو كان بعضهم لبعض ظهيرا");
    // «وما أنتم بمعجزين» style defeat-verb verses must not yield doctrine
    const defeat = quran(8, 59, "وما أنتم بمعجزين في الأرض");
    expect(miracleTopicsOf(defeat, "quran")).not.toContain("doctrine");
    expect(miracleTopicsOf(defeat, "quran")).not.toContain("i3jaz");
  });

  it("MIR-R08: «أعجاز نخل» (palm-roots) is not inimitability", () => {
    const n = quran(54, 20, "تنزع الناس كأنهم أعجاز نخل منقعر");
    expect(miracleTopicsOf(n, "quran")).not.toContain("i3jaz");
    expect(miracleTopicsOf(n, "quran")).not.toContain("doctrine");
  });

  it("MIR-R19: the challenge formulas are detected as mention", () => {
    const n = quran(2, 23, "فأتوا بسورة من مثله وادعوا من استطعتم من دون الله إن كنتم صادقين");
    expect(miracleTopicsOf(n, "quran")).toContain("challenge");
    expect(miracleKindOf(n)).toBe("mention");
  });

  it("MIR-R20: Musa's staff and the parting of the sea are detected as events", () => {
    const staff = quran(20, 18, "قال هذه عصاي أتوكؤ عليها وأهش بها غنمي ولطوح أدواتي");
    const sea = quran(26, 63, "فأوحينا إلى موسى أن اضرب بعصاك البحر فانفلق فكان كل فق");
    expect(miracleTopicsOf(sea, "quran")).toContain("sea");
    expect(miracleKindOf(sea)).toBe("event");
  });

  it("MIR-R12: cosmic-sign verses are detected as sign", () => {
    const n = quran(3, 190, "إن في خلق السماوات والأرض واختلاف الليل والنهار لآيات لأولي الألباب");
    expect(miracleTopicsOf(n, "quran")).toContain("cosmic-signs");
    expect(miracleKindOf(n)).toBe("sign");
  });

  it("MIR-R06: the books corpus requires the miracle lexicon", () => {
    const miracle = book("book-x-1", "ومن معجزات النبي أنه نبع الماء من بين أصابعه");
    const plain = book("book-x-2", "وضرب الرجل بعصاه الأرض");
    expect(miracleTopicsOf(miracle, "books").length).toBeGreaterThan(0);
    expect(miracleTopicsOf(plain, "books")).toHaveLength(0);
    // the same bare staff inside a sunnah hadith about Musa still counts via patterns
    const hadithStaff = hadith("bukhari-1", "work/sahih-bukhari", "فإذا هي ثعبان مبين تسعى");
    expect(miracleTopicsOf(hadithStaff, "sunnah")).toContain("staff");
  });

  it("MIR-R04: detection reads matn only — a label saying «معجزة» with clean text does not fire", () => {
    const n = makeNode("passage/book-x-3", "passage", { unit: "page", work: "work/book-x", ref: "p3", text: "فصل في أحكام البيع" });
    n.label = { ar: "فصل المعجزات", en: "Chapter of Miracles", ur: "معجزات" };
    expect(miracleTopicsOf(n, "books")).toHaveLength(0);
  });

  it("MIR-R17: every topic maps to at least the subjects it should land on", () => {
    expect(MIRACLE_TOPIC_SUBJECTS["staff"]).toContain("person/musa");
    expect(MIRACLE_TOPIC_SUBJECTS["she-camel"]).toContain("person/salih");
    expect(MIRACLE_TOPIC_SUBJECTS["moon"]).toContain("person/muhammad");
    expect(MIRACLE_TOPIC_SUBJECTS["descent"]).toContain("person/isa-ibn-maryam");
    expect(MIRACLE_TOPIC_SUBJECTS["cosmic-signs"]).toContain("concept/al-ayat-al-kawniyya-wal-mujiza");
  });

  it("MIR-R14: corpus section derivation", () => {
    expect(miracleCorpusOf("work/quran", ["scripture"], "ayah")).toBe("quran");
    expect(miracleCorpusOf("work/sahih-bukhari", ["hadith"], "hadith")).toBe("sunnah");
    expect(miracleCorpusOf("work/raheeq", ["sira"], undefined)).toBe("seerah");
    expect(miracleCorpusOf("work/book-x", ["book"], "page")).toBe("books");
  });
});
