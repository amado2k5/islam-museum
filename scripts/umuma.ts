// The Umuma (Motherhood in Islam) Browser's shared reads (docs/plan/63-umuma-browser.md): which
// passage records report or mention the mother and her standing (الأم ومكانتها), pregnancy
// (الحمل), childbirth (الولادة), nursing and milk-kinship (الرضاعة), the custody and raising of
// children (الحضانة والتربية), and dutifulness to parents — the mother first (بر الوالدين) —
// and which corpus section each belongs to. Detection runs at build time over the compiled
// graph, so a motherhood report in any harvested book — and in every book harvested later —
// appears without any tagging step. Curated records join through the `umuma-browser` tag
// instead. The ambiguous words are guarded: bare «أم» counts only beside family vocabulary
// (never «أم القرى» or «أم الكتاب»), «حمل» the pregnancy sense is kept apart from حمل "to
// carry" by a pregnancy context gate, «ولد» the boy stays out (only the birth forms count),
// «بر» counts only beside parent vocabulary (never برّ the land or البرّ the grain), and
// verified false positives are excluded by id.
import type { Node } from "./build-graph.js";

export const UMUMA_TAG = "umuma-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const UMUMA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type UmumaSection = (typeof UMUMA_SECTIONS)[number];
export type UmumaCorpus = Exclude<UmumaSection, "curated">;
export type UmumaTopic =
  | "umm" | "haml" | "wilada" | "radaa" | "tarbiya" | "birr";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— الأم ومكانتها — the mother, her standing and her right ————— */
/** Possessed and explicit mothers: أمه، أمها، أمك، أمهات، أمي، أمنا… plus والدة/والدته and
 *  أمومة itself; these forms are unambiguous (never «أم القرى»). */
const AR_UMM_POSSESSED = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:(?:أ|ا)م(?:هات|هاته|هاتها|هاتهم|هاتكم|هاتكن|هاتنا|ه|ها|هما|هم|هن|ك|كم|كما|كن|نا|ي|يه|اه)|والدة|والدته|والدتها|والدتهم|والدتهما|والدتك|والدتكم|والدتكن|والدتنا|والدتي|(?:أ|ا)مومة|(?:أ|ا)مهات الم(?:ؤ|و)منين|يا (?:أ|ا)م|يا (?:أ|ا)مي|يا (?:أ|ا)ماه|(?:أ|ا)م موسى|(?:أ|ا)م (?:إ|ا)سماعيل|(?:أ|ا)م الولد|(?:أ|ا)مهات ال(?:أ|ا)ولاد)(?=$|${E})`);
/** Bare «أم» or «الأم»: counts only beside mother/family vocabulary — «أم القرى» and
 *  «أم الكتاب» are fixed compounds and are excluded by UMM_FALSE below. */
const AR_UMM_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:أ|ا)مّ?(?=$|${E})`, "g");
const UMM_CONTEXT = /والد|والدة|أبيه|أبيهم|ابن|ابنها|ابنائها|بنت|بنتها|ولدت|تلد|ولادة|رضع|رضاعة|أرضع|حمل|حامل|حوامل|بر |بِرّ|إحسان|جنة|أقدام|نسل|ذرية|أولاد|بنين|بنات|حاضنة|حضانة|أختها|أخوها|جدته|خالتها|خالته|رحم|أرحام|صلة الرحم/;
/** Fixed compounds where «أم» is not a mother: أم القرى، أم الكتاب، أم الجماجم… */
const UMM_FALSE = /(?:(?:أ|ا)م القرى|(?:أ|ا)م الكتاب|(?:أ|ا)م الجماجم|(?:أ|ا)م الرأس|(?:أ|ا)م الشر|(?:أ|ا)م الخبائث|(?:أ|ا)م الخمر|(?:أ|ا)م الدنيا|(?:أ|ا)م الفساد|(?:أ|ا)م البنايات)/;

/* ————— الحمل — pregnancy ————— */
/** حامل/حوامل/حاملات/حملت الحمل — the unambiguous pregnancy words; «وهن على وهن» is the
 *  Qur'anic pregnancy-and-weaning phrase and stays as a literal. */
const AR_HAML_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:حامل|حاملة|حوامل|حاملات|حاملها|حاملهن|حملت حملها|أحمالها|وهن على وهن|وهنا على وهن|كرها ووضعته|حملته أمه|حملته|وهنًا|وهنا)(?=$|${E})`);
/** حمل as a noun: counts only beside pregnancy vocabulary — the carry sense stays out. */
const AR_HAML_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?حمل(?:ها|هن|ك|كم|ه|ا|ي)?(?=$|${E})`, "g");
const HAML_CONTEXT = /ولد|ولادة|تلد|يولد|مولود|جنين|أجنة|رحم|أرحام|بطن|بطون|رضع|فصال|فطام|أشهر|تسعة|تسعه|شهور|كلفة|مخاض|وضع|وضعت|وهن|نفاس|نفساء|قروء|عدة|عدتها|تربص|أولات/;

/* ————— الولادة — childbirth ————— */
/** ولادة and the birth verbs: ولدت، تلد، يلد، يولد، مولود، وضعت حملها، المخاض، نفاس/نفساء.
 *  Bare «ولد» (a boy) never counts. */
const AR_WILADA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:ولادة|ولادتها|ولادته|ولادتك|ولدت|ولدة|تلد|تلدا|يلد|يولد|يولدن|مولود|مولودة|مولودها|مولودان|مواليد|وضعت|وضعته|وضعت حملها|تضع|تضع حملها|مخاض|المخاض|نفاس|نفساء|النفساء|ألم الوضع|ساعة الوضع)(?=$|${E})`);

/* ————— الرضاعة — nursing and milk-kinship ————— */
/** رضاعة and the nursing family, the foster mothers, the weaning. */
const AR_RADAA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:رضاعة|الرضاعة|رضاع|رضاعتهن|رضاعتها|رضاعة صحيحة|أرضع|أرضعت|أرضعتك|أرضعتها|ترضع|ترضعن|يرضع|يرضعن|أرضعن|أرضعوا|مرضعة|مرضعات|مرضع|رضيع|رضيعة|رضيعها|أراضيع|فطام|الفطام|فصال|فصاله|فطيم|ثدي|ثديها|أثداء|حليب أمه|مرضعة له|رضعا|رضعة)(?=$|${E})`);

/* ————— الحضانة والتربية — custody and the raising of children ————— */
/** حضانة/حاضنة — custody of the child; تربية/ربت — the raising; كفالة اليتيم is a mother's
 *  household duty when the report is about the orphan in her care. */
const AR_TARBIYA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:حضانة|حاضنة|حواضن|الحضانة|تربية|تربيته|تربيتها|ربت|تربى|يربى|ربّت|فلذة|فلذات|فلذة كبدها|كفالة اليتيم|كافل اليتيم|كفل اليتيم|احتضنت|حضنت|حضنها)(?=$|${E})`);

/* ————— بر الوالدين — dutifulness to parents, the mother first ————— */
/** بر/إحسان to the parents: the birr family counts only beside parent vocabulary, so
 *  برّ the land and البرّ the grain stay out. */
const AR_BIRR = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:بر|بِرّ|البر|بِرُّ|بار|بارا|أبر|بروا|يبر|يبرون|إحسان|أحسن|أحسنوا|الإحسان|أحسنت|إحسانا|بإحسان|برا|صلة|صلة الرحم|صِلَة|يصل|يصِل)(?=$|${E})`, "g");
const BIRR_CONTEXT = /والدين|والديه|والديها|والديك|والديكم|والدة|والدت|أبويه|أبيه|أمه|أمها|أمك|أمهات|أبيهم/;

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 *  tagging a passage `umuma-browser` also admits it (see pick in export-api). */
export const UMUMA_EXCLUDE = new Set<string>([]);

/** topic for each signal name. */
const SIGNAL_TOPICS: Record<string, UmumaTopic> = {
  umm_possessed: "umm", umm_bare: "umm",
  haml_strong: "haml", haml_bare: "haml",
  wilada: "wilada",
  radaa: "radaa",
  tarbiya: "tarbiya",
  birr: "birr",
};

/** The matched signal names for a passage, or [] when it is not about motherhood. */
export function umumaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // a mother's name or a chapter title without the passage itself being a motherhood report.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || UMUMA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  /* umm */
  if (has(AR_UMM_POSSESSED)) hits.add("umm_possessed");
  if (!UMM_FALSE.test(raw)) {
    for (const m of raw.matchAll(AR_UMM_BARE)) {
      const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
      if (UMM_CONTEXT.test(window)) { hits.add("umm_bare"); break; }
    }
  }

  /* haml */
  if (has(AR_HAML_STRONG)) hits.add("haml_strong");
  for (const m of raw.matchAll(AR_HAML_BARE)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (HAML_CONTEXT.test(window)) { hits.add("haml_bare"); break; }
  }

  /* wilada */
  if (has(AR_WILADA)) hits.add("wilada");

  /* radaa */
  if (has(AR_RADAA)) hits.add("radaa");

  /* tarbiya */
  if (has(AR_TARBIYA)) hits.add("tarbiya");

  /* birr */
  for (const m of raw.matchAll(AR_BIRR)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (BIRR_CONTEXT.test(window)) { hits.add("birr"); break; }
  }

  return [...hits];
}

/** True when the passage reports or mentions motherhood in any of the six families. */
export function isUmumaPassage(n: Node): boolean {
  return umumaSignalsOf(n).length > 0;
}

/** The motherhood topics a passage touches: every family whose signals hit. */
export function umumaTopicsOf(n: Node): UmumaTopic[] {
  const topics = new Set<UmumaTopic>();
  for (const s of umumaSignalsOf(n)) {
    const t = SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  return [...topics];
}

/**
 * Which corpus an umuma passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function umumaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): UmumaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `umuma-<section>` when present, else `curated`. */
export function umumaTagSection(n: Node): UmumaSection {
  const tag = n.tags.find((t) => t.startsWith("umuma-") && t !== UMUMA_TAG);
  const id = tag?.slice(6) ?? "curated";
  return (UMUMA_SECTIONS as readonly string[]).includes(id) ? (id as UmumaSection) : "curated";
}
