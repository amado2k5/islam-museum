// The Arabic Language Browser's shared reads (docs/plan/73-arabic-language-browser.md): which passage
// records speak about the Arabic language — the Qur'an's own verses on its Arabic tongue, the hadith
// and the reports of the Companions and Successors, the seerah, the tafsir and every other harvested
// book — and which section each belongs to. Detection runs at build time over the compiled graph, so a
// mention in any harvested book, and in every book harvested later, appears without a tagging step.
// Curated records (the sciences, the scholars, the books, the dialects, the Arab world) join through the
// `arabiyya-browser` tag and one `arabiyya-<section>` tag.
import type { Node } from "./build-graph.js";

export const ARABIYYA_TAG = "arabiyya-browser";

/** The passage corpora, in page order. */
export const ARABIYYA_CORPORA = ["quran", "sunnah", "seerah", "tafsir", "books"] as const;
export type ArabiyyaCorpus = (typeof ARABIYYA_CORPORA)[number];

/** The curated sections, in page order; an `arabiyya-<id>` tag not listed here falls into `sciences`. */
export const ARABIYYA_SECTIONS = ["lisan", "ijaz", "origins", "script", "sciences", "dialects", "world", "scholars", "books"] as const;
export type ArabiyyaSection = (typeof ARABIYYA_SECTIONS)[number];

/** Strip Arabic vowel marks, the dagger alif and the tatweel, and fold alif wasla, so one pattern meets every spelling. */
export const stripMarks = (s: string): string =>
  s.replace(/[ً-ْٰـۖ-ۭ]/g, "").replace(/ٱ/g, "ا");

/**
 * The Qur'an's own words about its language. Every verse of the frozen text that carries one of
 * these is about the tongue of the revelation: «عربي» (twelve verses), «أعجمي» / «الأعجمين»,
 * «بلسان قومه» (14:4) and «بلسانك» (19:97, 44:58). «الأعراب» (the desert Arabs) does not match.
 */
const QURAN_ARABIC = /عربي|أعجمي|الأعجمين|بلسان قومه|بلسانك/;

/**
 * Unambiguous talk about the Arabic language in every other harvested text. Deliberately narrow:
 * «العربي» alone is usually a man's name (Ibn al-Arabi), «لسان العرب» alone is usually a footnote
 * citing the dictionary, «النحو» alone is "the manner", and «العرب» alone is the people — none of
 * those is enough on its own.
 */
const AR_ARABIC = new RegExp(
  [
    "بلسان عربي", "قرآنا عربيا", "لسانا عربيا", "عربي مبين", "(?:ب|ال)لسان العربي", "اللغة العربية",
    "(?:بلسان|بلغة|لغة|لسان) قريش", "(?:بلسان|بلغة|لغة) العرب", "ب?كلام العرب",
    "(?:تعلموا|تعلم|يتعلم|أهل|علماء|علم|علوم|وضع|أئمة) العربية", "(?:تكلم|يتكلم|نطق|تكلموا) بالعربية",
    "يتعلم من لسان العرب", "يتعلموا لسان العرب", "عربية حمير", "إعراب القرآن", "أعربوا القرآن",
    "(?:من|في|عن) اللحن", "يلحن في", "لحن في", "علم النحو", "أهل النحو", "أئمة النحو", "وضع النحو",
    "(?:أعجمي|عجمي) و(?:لا )?عربي", "لسان أعجمي", "أفصح العرب", "إعجاز القرآن", "بمثل هذا القرآن",
  ].join("|"),
);

/** Passage records whose only lexical hit is a known false positive (curated escape hatch; empty until one is found). */
export const ARABIYYA_EXCLUDE = new Set<string>([]);

/** True when the passage's own Arabic text speaks about the Arabic language. */
export function isArabiyyaPassage(n: Node): boolean {
  if (n.class !== "passage" || n.stub || ARABIYYA_EXCLUDE.has(n.id)) return false;
  if (n.data.work === "work/quran") {
    // Sura containers carry no verse text; only ayah records are read.
    if (n.data.unit !== "ayah") return false;
    return QURAN_ARABIC.test(stripMarks(String(n.data.text_search ?? n.data.text ?? "")));
  }
  const ar = stripMarks([n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar].filter(Boolean).join(" "));
  return AR_ARABIC.test(ar);
}

/**
 * Which corpus an Arabic-language passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), the
 * commentaries (genre `tafsir`), and every other harvested work. A work harvested later lands in
 * the right section by its genre the day its passages arrive.
 */
export function arabiyyaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): ArabiyyaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("tafsir")) return "tafsir";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section of a curated record: its `arabiyya-<section>` tag when listed, else `sciences`. */
export function arabiyyaTagSection(n: Node): ArabiyyaSection {
  const tag = n.tags.find((t) => t.startsWith("arabiyya-") && t !== ARABIYYA_TAG);
  const id = tag?.slice(9) ?? "sciences";
  return (ARABIYYA_SECTIONS as readonly string[]).includes(id) ? (id as ArabiyyaSection) : "sciences";
}
