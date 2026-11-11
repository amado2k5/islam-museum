// The Hasanat Browser's shared reads (docs/plan/44-hasanat-browser.md): which passage records
// mention or report the good deeds (al-hasanat), and which corpus section each belongs to.
// Detection runs at build time over the compiled graph, so a mention of الحسنات in any
// harvested book — and in every book harvested later — appears without any tagging step.
// Curated records join through the `hasanat-browser` tag instead.
//
// Scope is the literal good-deeds noun family only: «الحسنات»، «حسنات»، «الحسنة»، «حسنة»،
// the reward form «الحسنى» (gated — «الأسماء الحسنى» is the divine names, not a deed), and
// two fixed collocations («قرضا حسنا» the good loan, «بدل … حسنا بعد سوء»). Out of scope by
// design: bare «حسن»/«الحسن» (the Hasan names, the hadith grade, adjectives), «حسن الخلق»,
// the «حسنا» adverb/adjective («رزقا حسنا»، «أجرا حسنا»، «وعدا حسنا»), and the wider
// good-deeds vocabulary (الصالحات، البر، الطاعات) — those are synonyms, not الحسنات.
// «حسنة» and «الحسنة» also serve as the feminine adjective "goodly" («أسوة حسنة»،
// «الموعظة الحسنة»): adjective hosts are rejected by a preceding-token gate and verified
// false positives are frozen in HASANAT_EXCLUDE. «سنة حسنة» deliberately stays in — the
// «من سن في الإسلام سنة حسنة» report is about good deeds.
import type { Node } from "./build-graph.js";

export const HASANAT_TAG = "hasanat-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const HASANAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type HasanatSection = (typeof HASANAT_SECTIONS)[number];
export type HasanatCorpus = Exclude<HasanatSection, "curated">;
/** The matched term family: `hasanat` = plural deeds, `hasana` = singular deed, `husna` = «الحسنى» the best. */
export type HasanatKind = "hasanat" | "hasana" | "husna";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;
/** Trailing boundary that also matches the end of the text. */
const E = String.raw`(?:$|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/**
 * The good-deeds nouns take clitic prefixes like the dua noun did: و ب ل ف ك س and the
 * article — «وبالحسنات»، «فحسنات»، «للحسنة»، «كحسنة». The prefix class is kept OUTSIDE
 * the boundary check so «المحسنات» (those who do good) still cannot match: the «م» before
 * «حسنات» is an Arabic letter, not a boundary.
 */
const PRE = String.raw`(?:[وبفسلك]){0,2}`;
const ART = String.raw`(?:ال)?`;

/** «الحسنات» definite plural and «حسنات» indefinite — always the good deeds. */
const AR_HASANAT = new RegExp(`${BL}${PRE}${ART}حسنات(?=$|${B})`);
/** «الحسنة» definite singular and «حسنة» indefinite — noun uses kept, adjective hosts gated below. */
const AR_HASANA = new RegExp(`${BL}${PRE}${ART}حسنة(?=$|${B})`, "g");
/** «الحسنى» definite — the best reward; divine-name and «good word» adjective uses gated below. */
const AR_HUSNA = new RegExp(`${BL}${PRE}الحسنى(?=$|${B})`, "g");
/** «قرضا حسنا» — the good loan to God (qard hasan), a fixed good-deeds formula. */
const AR_QARD_HASAN = new RegExp(`${BL}قرضا?\\s+حسنا(?=$|${B})`);
/** «بدل/بدلت/بدلنا … حسنا بعد سوء» — "He changes evil for good" (27:11 family). */
const AR_BADAL_HASAN = /بدل[ء-ي]{0,3}\s+حسنا\s+بعد\s+سوء/;

/**
 * Feminine nouns after which «حسنة/الحسنة» is the adjective "goodly", not a deed:
 * «أسوة حسنة» (an excellent example), «الموعظة الحسنة» (the goodly exhortation),
 * «شفاعة حسنة» (a goodly intercession). Checked on the token immediately before the
 * match, stripped of clitic prefixes and the article. «سنة» is deliberately absent:
 * «سنة حسنة» is the good-deeds report, not an adjective to exclude.
 */
const ADJ_HOSTS = new Set(
  `أسوة اسوة سيرة امرأة امرأه شفاعة شفاعه موعظة موعظه موعظه دعوة دعوه خصلة خلقًا خلقا
   رؤية رؤيا آية اية صورة صوره منزلة منزله نعمة نعم حال حاله نفس نفسا كلمة كلمه
   قصة قصه رواية روايه مقالة مقاله صيغة صيغه طريقة طريقه أسلوب اسلوب`.split(/\s+/),
);
/** The word immediately before a match, clitics and article stripped, or "" at text start. */
function prevToken(raw: string, index: number): string {
  const before = raw.slice(0, index).replace(/\s+$/, "");
  const m = /([ء-يA-Za-z0-9]+)$/.exec(before);
  return m ? m[1].replace(/^(?:ال|[وبفسلك])+/, "") : "";
}
/** «الحسنى» is the adjective "most beautiful" after the divine-names formula or «good word» phrases. */
const HUSNA_ADJ_WINDOW = /أسماء|اسماء|اسم|كلم[ةته]/;

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape
 * hatch: tagging a passage `hasanat-browser` also admits it (see pick in export-api).
 */
export const HASANAT_EXCLUDE = new Set<string>([
  // «إن الحسنات يذهبن السيئات» stays; nothing is excluded yet — the list fills as the
  // detector's corpus run is reviewed (adjective hosts are already gated above).
]);

const HASANAT_SIGNALS = new Set(["hasanat"]);
const HUSNA_SIGNALS = new Set(["al-husna"]);

/** The matched signal names for a passage, or [] when it does not mention the good deeds. */
export function hasanatSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // the topic («الحسنات والسيئات» in a chapter title) without the passage itself mentioning it.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    // Dagger alif and wasla stand for a real alif («شَفَٰعَة» = «شفاعة»); map them before
    // stripping or the vocalized copy tokenizes differently («شفعة») and defeats the gates.
    .replace(/[ٰٱ]/g, "ا")
    .replace(DIACRITICS, "");
  if (!raw || HASANAT_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();

  if (AR_HASANAT.test(raw)) hits.add("hasanat");
  if (AR_QARD_HASAN.test(raw)) hits.add("qard-hasan");
  if (AR_BADAL_HASAN.test(raw)) hits.add("badal-hasan");

  for (const m of raw.matchAll(AR_HASANA)) {
    // «أسوة حسنة» is an adjective on a host noun, not a deed: reject when the preceding
    // token is a known feminine host. Everything else («جاء بالحسنة»، «منهم حسنة») counts.
    if (ADJ_HOSTS.has(prevToken(raw, m.index!))) continue;
    hits.add("hasana");
    break;
  }
  for (const m of raw.matchAll(AR_HUSNA)) {
    // «الأسماء الحسنى» and «كلمت ربك الحسنى» are adjectives, not the reward: reject when the
    // divine-names or good-word formula sits in the preceding window.
    const window = raw.slice(Math.max(0, m.index! - 45), m.index!);
    if (HUSNA_ADJ_WINDOW.test(window)) continue;
    hits.add("al-husna");
    break;
  }
  return [...hits];
}

/** True when the passage mentions or reports the good deeds (الحسنات). */
export function isHasanatPassage(n: Node): boolean {
  return hasanatSignalsOf(n).length > 0;
}

const KIND_PRECEDENCE: [HasanatKind, ReadonlySet<string>][] = [
  ["hasanat", HASANAT_SIGNALS],
  ["hasana", new Set(["hasana", "qard-hasan", "badal-hasan"])],
  ["husna", HUSNA_SIGNALS],
];

/** The dominant term family of a detected passage: plural > singular > «الحسنى». */
export function hasanatKindOf(n: Node): HasanatKind | null {
  const signals = new Set(hasanatSignalsOf(n));
  for (const [kind, set] of KIND_PRECEDENCE) {
    if ([...signals].some((s) => set.has(s))) return kind;
  }
  return null;
}

/**
 * Which corpus a hasanat passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function hasanatCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): HasanatCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `hasanat-<section>` when present, else `curated`. */
export function hasanatTagSection(n: Node): HasanatSection {
  const tag = n.tags.find((t) => t.startsWith("hasanat-") && t !== HASANAT_TAG);
  const id = tag?.slice(8) ?? "curated";
  return (HASANAT_SECTIONS as readonly string[]).includes(id) ? (id as HasanatSection) : "curated";
}
