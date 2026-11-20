// The Elegy and Death-Announcement Browser's shared reads (docs/plan/72-ritha-browser.md,
// «متصفح أشهر ما قيل في الرثاء والنعي»): which passage records carry an elegy (رثاء), a
// death announcement (نعي), words of condolence and consolation (تعزية، استرجاع) or the
// weeping and wailing reports and their limits (بكاء، نياحة) — and which corpus section
// each belongs to. Detection runs at build time over the compiled graph, so an elegy or
// a death announcement in any harvested book — and in every book harvested later —
// appears without any tagging step. Curated records join through the `ritha-browser` tag.
//
// Scope (founder's brief, 20 November 2026): the famous words said in elegy and in
// announcing a death — in the Qur'an, the Sunnah, the seerah, the reports of the
// Companions and the Successors, and every harvested book. Out of scope by design:
// «العزى» the idol and «عزاه إلى» (attributed it to), «تعزى بعزاء الجاهلية» (tribal
// rallying cry), «نعت» the description, «نعيم/نعمة» blessing, «يندب» the fiqh
// "recommended", «نوح» the prophet, «رثّ» worn-out, and «استرجع» for taking back a gift.
import type { Node } from "./build-graph.js";

export const RITHA_TAG = "ritha-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const RITHA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type RithaSection = (typeof RITHA_SECTIONS)[number];
export type RithaCorpus = Exclude<RithaSection, "curated">;
/** What the record carries: an elegy, a death announcement, condolence and consolation, or weeping and wailing. */
export const RITHA_KINDS = ["ritha", "nay", "taziya", "bukaa"] as const;
export type RithaKind = (typeof RITHA_KINDS)[number];

/** Boundary characters around a token: whitespace, quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗۚۛۘۙ]`;
const BL = String.raw`(?:^|${B})`;
const BR = String.raw`(?=$|${B})`;
/** One-letter proclitics that may stand before a token. */
const P = String.raw`[وفبلك]?`;
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
const tok = (alts: string, flags = "") => new RegExp(`${BL}${P}(?:${alts})${BR}`, flags);

// ---------------------------------------------------------------------------
// The Qur'an: a reviewed table, never a lexicon. These are the verses mourners,
// consolers and elegists quote — the istirja' of the patient, the verses Abu Bakr
// recited the day the Prophet died, Ya'qub's grief, and the Qur'an's own words over
// those who were killed in God's way. Keyed "sura:aya" → kind.
// ---------------------------------------------------------------------------
export const RITHA_QURAN: Record<string, RithaKind> = {
  "2:154": "taziya", "2:155": "taziya", "2:156": "taziya", "2:157": "taziya",
  "3:144": "nay", "3:145": "taziya", "3:169": "ritha", "3:170": "ritha", "3:171": "ritha", "3:185": "taziya",
  "4:78": "taziya", "9:84": "bukaa",
  "12:84": "bukaa", "12:85": "bukaa", "12:86": "bukaa",
  "19:15": "ritha", "19:33": "ritha",
  "21:34": "nay", "21:35": "taziya", "28:88": "taziya", "29:57": "taziya",
  "33:23": "ritha", "39:30": "nay", "44:29": "bukaa",
  "55:26": "taziya", "55:27": "taziya", "57:22": "taziya", "57:23": "taziya",
  "62:8": "taziya", "89:27": "ritha", "89:28": "ritha", "89:29": "ritha", "89:30": "ritha",
};

// ---------------------------------------------------------------------------
// Lexicon (matched on text with diacritics removed and hamza carriers folded)
// ---------------------------------------------------------------------------

/** رثاء — the elegy and the act of elegising. «يرثى له» (pitiable) and «رثّ» (worn) never match. */
const AR_RITHA = tok("رثاء|الرثاء|رثاءه|رثايه|يرثي|يرثيه|يرثيها|يرثيهم|ترثي|ترثيه|ترثيهم|راثيا|مرثية|المرثية|مرثيته|مرثيتها|مراثي|المراثي|مراثيه|مراثيها|مرثاة|المراث|ترثية", "g");
/** Perfect forms that read «ورثته» (inherited) behind a «و»: admitted only without it. */
const AR_RITHA_PERFECT = new RegExp(`${BL}ف?(?:رثاه|رثاها|رثاهم|رثاهما|رثته|رثوه|رثيت|رثيته|رثى)${BR}`);

/** نعي — the death announcement. «نعت» description, «نعيم» blessing and «نعم» never match. */
const AR_NAY = tok("نعى|نعاه|نعاها|نعاهم|نعاهما|نعوه|نعوا|نعيته|نعيت|ينعى|ينعاه|ينعاها|ينعون|ينعونه|تنعى|تنعاه|ننعى|النعي|نعي|نعيه|نعيها|نعيهم|نعيهما|بنعيه|الناعي|ناعي|ناعيه|الناعية|النعاة", "g");
/** «نعي» + a following «ال‍/proper noun» is the announcement; «نعي» alone at a line end is too. No gate needed beyond the token list. */

/** تعزية — condolence. «العزى» the idol never matches (no proclitic ال in the list); «عزاه إلى» is gated per match. */
const AR_TAZIYA = tok("تعزية|التعزية|تعزيته|تعزيتهم|تعازي|التعازي|عزاه|عزاها|عزاهم|عزاهما|عزيته|عزيتهم|عزوه|عزاني|عزانا|عزاك|يعزي|يعزيه|يعزيها|يعزيهم|يعزيني|يعزونه|يعزون|نعزي|نعزيك|اعزيك|تعزي|تعزيه|العزاء|عزاءك|عزاءكم|عزاءه|عزاء|المعزي|المعزون|المعزين|معزيا|معزين|تعز|فتعز", "g");
/** «عزاه إلى/ل» = attributed it to; «عزاء الجاهلية» / «تعزى ب» = the tribal cry. */
const TAZIYA_FP = /(?:عزاه|عزاها|عزوه|عزاهما)\s+(?:الى|إلى|ل[ء-ي]+)|عزاء\s+الجاهلية|بعزاء|تعزى\s+ب|يعزى\s+(?:الى|إلى|ل)|عزاء\s+(?:بن|بنت)/;

/** Fixed condolence and consolation formulas — strong on their own. */
const AR_FORMULA: [string, RegExp, RithaKind][] = [
  ["istirja", /انا لله وانا اليه راجعون/, "taziya"],
  ["lillah_ma_akhadh", /(?:^|\s)(?:ان\s+)?لله ما اخذ/, "taziya"],
  ["ajirni", /اجرني في مصيبتي|اجرني في مصيبتي|واخلف لي خيرا منها|واعقبني منها/, "taziya"],
  ["azzama_ajrak", /اعظم الله اجرك|عظم الله اجرك|احسن الله عزاءك|احسن عزاءك|وغفر لميتك/, "taziya"],
  ["sadma_ula", /الصبر عند الصدمة الاولى|الصبر عند اول صدمة|عند اول الصدمة/, "taziya"],
  ["ayn_tadma", /العين تدمع|تدمع العين|القلب يحزن|يحزن القلب|بفراقك[^.]{0,30}لمحزونون/, "ritha"],
  ["ya_abatah", /وا ابتاه|واابتاه|يا ابتاه اجاب|يا ابتاه من ربه|يا ابتاه جنة|الى جبريل ننعاه|وا كرب ابتاه|وا كرب اباه|واكرب اباه/, "ritha"],
  ["man_kana_yabudu", /من كان يعبد محمدا|من كان منكم يعبد محمدا|طبت حيا وميتا/, "nay"],
  ["al_jafar", /اصنعوا لال جعفر|لال جعفر طعاما|اتاهم ما يشغلهم|اتاهم امر يشغلهم/, "taziya"],
  ["nay_najashi", /مات اليوم رجل صالح|توفي اليوم رجل صالح|اخا لكم قد مات|مات النجاشي|نعى النجاشي/, "nay"],
  ["mustarih", /مستريح ومستراح منه/, "taziya"],
  ["adhkuru_mahasin", /اذكروا محاسن موتاكم|لا تسبوا الاموات|اثنيتم عليه خيرا|فاثنوا عليها خيرا|فاثني عليها خير|وجبت وجبت/, "ritha"],
];

/** نياحة — wailing and its limits. «نوح» the prophet never matches (only «النوح على»). */
const AR_NIYAHA = tok("نياحة|النياحة|نياحتها|النايحة|نايحة|النوايح|نوايح|ناحت|ينوحون|ينحن|تنوح|تنوحي|ينوح عليه|نيح عليه|يناح عليه|ناحوا|النادبة|نادبة|ندبته|تندبه|يندبه|يندبن|تندبن|الندبة|تعدد عليه|يعذب ببكاء|ليعذب ببكاء|ببكاء اهله|ببكاء الحي|لطم الخدود|شق الجيوب|ضرب الخدود|دعوى الجاهلية|الصالقة والحالقة|الحالقة والصالقة|السالقة والحالقة|الحالقة والسالقة", "g");
const AR_NAWH_ALA = /(?:^|\s)[وفب]?النوح\s+(?:على|عليه|عليها|عليهم)(?!\s+السلام)/;
/** «دعوى الجاهلية» belongs here only beside the mourning acts. */
const NIYAHA_ALONE_WEAK = /دعوى الجاهلية/;

/** بكاء — weeping, admitted only beside a death in the same window. */
const AR_BUKAA = new RegExp(`${BL}${P}(?:(?:بكى|بكت|بكوا|بكين|يبكي|تبكي|يبكون|يبكين|نبكي|ابكي|بكيت|البكاء|بكاء|بكاءهم|بكايهم)\\s+(?:على|عليه|عليها|عليهم|عليهما)|بكاه|بكته|بكوه|بكاها|يبكيه|تبكيه|يبكونه|ابكيه|نبكيه|يبكينه|ذرفت عيناه|عيناه تذرفان|دمعت عيناه|فاضت عيناه|ففاضت عينا)${BR}`, "g");
const DEATH_CTX = /مات|توفي|توفيت|ماتت|الميت|ميت|ميتا|الموت|موته|موتها|وفاته|وفاتها|قبض|قبر|القبر|قبره|دفن|دفنه|جنازة|الجنازة|قتل|استشهد|اصيب|هلك|مصيبة|المصيبة|احتضر|يجود بنفسه|نفسه تقعقع|فاضت نفسه|الناعي|نعي|نعى|فقد|المنية|اجله|ثكل|ثكلى/;
/** Weeping from fear of God, at recitation or in prayer is another subject (not a loss). */
const BUKAA_OTHER = /من خشية الله|بكى من خشية|خشية الله|يبكي في صلاته|ازيز|تباكوا/;

const STRONG = new Set(["ritha", "nay", "taziya", "niyaha", ...AR_FORMULA.map(([id]) => id)]);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated
 * escape hatch: tagging a passage `ritha-browser` also admits it.
 */
export const RITHA_EXCLUDE = new Set<string>([]);

/** One spelling for matching: diacritics and tatweel off, dagger alif restored, hamza carriers folded. */
export function rithaFold(text: string): string {
  return text
    .replace(/ٰ/g, "ا")
    .replace(/ـ/g, "")
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ئ/g, "ي")
    .replace(/ؤ/g, "و");
}

function rawTextOf(n: Node): string {
  // Poem lines carry their elegy in the record's title («أبيات مرثية حمزة…»), not in the verse itself.
  const title = n.data.unit === "poem-line" ? [n.label?.ar, n.data.label?.ar] : [];
  return rithaFold([n.data.text_search, n.data.text, ...title].filter(Boolean).join(" "));
}

/** The matched signal names for a passage, or [] when it is not about elegy, death announcement or condolence. */
export function rithaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  if (RITHA_EXCLUDE.has(n.id)) return [];
  if (n.data.work === "work/quran") {
    const k = RITHA_QURAN[`${n.data.sura}:${n.data.aya}`];
    return k ? [`quran_${k}`] : [];
  }
  const raw = rawTextOf(n);
  return raw ? rithaSignalsOfText(raw) : [];
}

/** The signals of a text already folded by rithaFold (the harvesters test excerpts with it). */
export function rithaSignalsOfText(raw: string): string[] {
  const hits = new Set<string>();

  for (const m of raw.matchAll(AR_RITHA)) {
    const after = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 6);
    if (/^\s*(?:له|لها|لحال)/.test(after) && /يرث/.test(m[0])) continue; // «يرثي له»: pitying, not elegising
    hits.add("ritha");
    break;
  }
  if (AR_RITHA_PERFECT.test(raw)) hits.add("ritha");
  for (const m of raw.matchAll(AR_NAY)) {
    const after = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 8);
    if (/^\s*(?:على|علي|عليه|عليهم)(?:\s|$)/.test(after)) continue; // «ينعى عليه»: reproaching, not announcing a death
    hits.add("nay");
    break;
  }
  for (const m of raw.matchAll(AR_TAZIYA)) {
    const window = raw.slice(Math.max(0, m.index! - 12), m.index! + m[0].length + 22);
    if (/^[وف]?عز[او]ه?[او]?$|^[وف]?عزاه/.test(m[0]) && /^\s*(?:السيوطي|الحافظ|المصنف|بعضهم|ابن|الحاكم|البيهقي|الطبراني|الى|اليه)/.test(raw.slice(m.index! + m[0].length, m.index! + m[0].length + 14))) continue;
    if (TAZIYA_FP.test(window)) continue;
    // «عزاه فلان في كتابه»: the takhrij sense of attributing a report — the bare verb counts only beside a loss
    if (/عزا|عزو/.test(m[0]) && !DEATH_CTX.test(raw.slice(Math.max(0, m.index! - 60), m.index! + 70))) continue;
    hits.add("taziya");
    break;
  }
  for (const [id, re] of AR_FORMULA) if (re.test(raw)) hits.add(id);
  for (const m of raw.matchAll(AR_NIYAHA)) {
    if (NIYAHA_ALONE_WEAK.test(m[0]) && !/لطم|شق|نياحة|نايحة|ميت|مصيبة/.test(raw)) continue;
    hits.add("niyaha");
    break;
  }
  if (AR_NAWH_ALA.test(raw)) hits.add("niyaha");
  for (const m of raw.matchAll(AR_BUKAA)) {
    const window = raw.slice(Math.max(0, m.index! - 140), m.index! + 160);
    if (!DEATH_CTX.test(window) || BUKAA_OTHER.test(window)) continue;
    hits.add("bukaa");
    break;
  }
  return [...hits];
}

/** True when the passage carries an elegy, a death announcement, condolence, or weeping over a loss. */
export function isRithaPassage(n: Node): boolean {
  return rithaSignalsOf(n).length > 0;
}

const FORMULA_KIND = new Map(AR_FORMULA.map(([id, , k]) => [id, k]));
/** The record's leading kind, by priority: elegy, death announcement, condolence, weeping and wailing. */
export function rithaKindOf(n: Node): RithaKind | null {
  return rithaKindOfSignals(rithaSignalsOf(n));
}
export function rithaKindOfSignals(signals: string[]): RithaKind | null {
  if (!signals.length) return null;
  const kinds = new Set<RithaKind>();
  for (const s of signals) {
    if (s.startsWith("quran_")) kinds.add(s.slice(6) as RithaKind);
    else if (s === "ritha" || s === "nay" || s === "taziya") kinds.add(s);
    else if (s === "niyaha" || s === "bukaa") kinds.add("bukaa");
    else { const k = FORMULA_KIND.get(s); if (k) kinds.add(k); }
  }
  return RITHA_KINDS.find((k) => kinds.has(k)) ?? null;
}

/** True when at least one signal is strong (not weeping-beside-a-death alone). */
export function rithaIsStrong(n: Node): boolean {
  return rithaStrongSignals(rithaSignalsOf(n));
}
export function rithaStrongSignals(signals: string[]): boolean {
  return signals.some((s) => STRONG.has(s) || s.startsWith("quran_"));
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre
 * `sira`), and every other harvested work.
 */
export function rithaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): RithaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `ritha-<section>` when present, else `curated`. */
export function rithaTagSection(n: Node): RithaSection {
  for (const t of n.tags) {
    if (!t.startsWith("ritha-") || t === RITHA_TAG) continue;
    const id = t.slice(6);
    if ((RITHA_SECTIONS as readonly string[]).includes(id)) return id as RithaSection;
  }
  return "curated";
}

/** The kind tag of a curated record: `ritha-kind-<kind>` when it names one. */
export function rithaTagKind(n: Node): RithaKind | null {
  for (const t of n.tags) {
    if (!t.startsWith("ritha-kind-")) continue;
    const id = t.slice(11);
    if ((RITHA_KINDS as readonly string[]).includes(id)) return id as RithaKind;
  }
  return null;
}

/** Where the first elegy, announcement or condolence wording stands in a folded text (-1 when none): the harvesters centre excerpts on it. */
const RITHA_ANCHOR = /رثا[ءهي]|مرثي|مراثي|يرثي|نعى|نعاه|ينعى|نعي|الناعي|تعزي|يعزي|عزاه|عزاء|نياح|نايح|ببكاء|لطم|شق الجيوب|ضرب الخدود|العين تدمع|تدمع العين|راجعون|لله ما اخذ|مصيبتي|لال جعفر|رجل صالح|قد مات|ابتاه|يبكي|تبكي|بكى|بكت|يبكين|البكاء/;
export function rithaFirstAt(folded: string): number {
  return folded.search(RITHA_ANCHOR);
}
