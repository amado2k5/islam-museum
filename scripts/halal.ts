// The Halal and Haram Browser's shared reads (docs/plan/58-halal-haram-browser.md): which
// passage records mention or carry «الحلال والحرام» — what God made lawful and what He
// made unlawful — and which corpus section each belongs to. Detection runs at build time
// over the compiled graph, so a halal or haram mention in any harvested book — and in every
// book harvested later — appears without any tagging step. Curated records join through the
// `halal-haram-browser` tag instead.
//
// Scope is the one theme the founder named, «الحلال والحرام في الإسلام», and nothing wider:
//  • the lawful — «حلال» and «الحلال», the verb of making lawful with its object («أحل الله»،
//    «أحل لكم»، «أحلت لكم»، «يحل لهم»، «لا يحل لامرئ»), and «استحل» (to treat as lawful);
//  • the unlawful — «حرام» and «الحرام» outside the sanctuary names, the verb of forbidding
//    with its subject or object («حرم الله»، «حرمت عليكم»، «حرم عليهم»، «حرمنا»), «تحريم»،
//    «المحرمات» and «محارم الله».
// Weak signals — the bare verbs («أحل»، «يحل»، «حرم»، «يحرم»، «محرم») and the neighbouring
// vocabulary («الطيبات»، «الخبائث»، «المشتبهات»، «مباح») — count only beside a strong one,
// with one pair rule: a bare lawful verb (or «مباح») and a bare unlawful verb in the same
// passage admit it («يحلونه عاما ويحرمونه عاما»، «فهو محرم ... تباح لحوم الخيل»). Out of scope, and removed before matching: the
// sanctuary and sacred-time names («المسجد الحرام»، «البيت الحرام»، «الشهر الحرام»،
// «المشعر الحرام»، «البلد الحرام»), the personal name Haram («أم حرام»، «حرام بن ملحان»),
// the state of being out of ihram («وهو حلال»), the reward wordings «حرمه الله على النار»
// and «حلت له شفاعتي», and the prayer's «تحريمها التكبير وتحليلها التسليم». The wider
// themes of sin, fixed penalties and trade belong to the Sayyi'at, Hudud and Islamic
// Economy browsers.
import type { Node } from "./build-graph.js";

export const HALAL_TAG = "halal-haram-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const HALAL_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type HalalSection = (typeof HALAL_SECTIONS)[number];
export type HalalCorpus = Exclude<HalalSection, "curated">;
/** `halal` = only the lawful is named; `haram` = only the unlawful; `both` = the passage names the two. */
export type HalalKind = "halal" | "haram" | "both";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;
/** Trailing boundary that also matches the end of the text. */
const ER = String.raw`(?=$|${E})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/** Clitic cluster allowed before a noun: «والحلال»، «فالحرام»، «بالحلال»، «كالحرام». */
const PRE = String.raw`(?:(?:ال)|[وبفلك]){0,3}`;
/** Conjunction/particle cluster allowed before a verb: «وأحل»، «فحرم»، «ليحل»، «أتحرم». */
const VPRE = String.raw`[وفلأس]{0,2}`;
/** Pronoun suffixes on a verb or noun. */
const PRON = String.raw`(?:هما|هم|هن|كما|كم|كن|ها|ه|نا|ك|ني|ي)?`;
/** Verb endings before the pronoun: «حرمت»، «حرموا»، «يحرمون»، «حرمنا»، «حرمتم». */
const VEND = String.raw`(?:ت|تم|تما|نا|وا|ون|ان|ن|ا)?`;

// ---------- phrases removed before matching (out of scope) ----------

const OUT_OF_SCOPE: RegExp[] = [
  // The sanctuary and the sacred times: «المسجد الحرام»، «البيت الحرام»، «الشهر الحرام»،
  // «المشعر الحرام»، «البلد الحرام»، «بيتك المحرم»، «شهر الله المحرم».
  /(?:المسجد|مسجد|البيت|بيت|بيت الله|بيتك|الشهر|شهر|بالشهر|والشهر|المشعر|البلد|بلد|الاشهر|الأشهر|أشهر|اشهر|شهر الله) (?:ال)?(?:حرام|محرم|حرم)(?=$|[\s«»"'()\[\]{},،.;:!؟?\-ۖۗ])/g,
  // The personal name Haram: «أم حرام»، «حرام بن ملحان»، «ابن حرام»، «بنت حرام».
  /(?:أم|ام|بن|ابن|بنت|ابنة|أبو|ابو|أبي|ابي|بني|بنو) حرام(?=$|[\s«»"'()\[\]{},،.;:!؟?\-ۖۗ])/g,
  /حرام (?:بن|ابن) /g,
  // Out of ihram: «وهو حلال»، «ونحن حلال»، «وهم حلال»، «حلالا» after the state particle.
  /و(?:هو|هي|هم|نحن|أنا|انا|أنت|انت|أنتم|انتم|هما) (?:حلال|حلالان|حلالا|محل|محلون)(?=$|[\s«»"'()\[\]{},،.;:!؟?\-ۖۗ])/g,
  // Reward and warning wordings that use the verb but are not a ruling on a thing or an act:
  // «حرمه الله على النار»، «حرم الله عليه الجنة»، «حرمت النار على»، «حلت له شفاعتي».
  /حرم[ء-ي]{0,3} (?:الله )?(?:تعالى )?(?:عز وجل )?(?:علي[ء-ي]{0,3} |على )?(?:ال)?(?:نار|جنة)[ء-ي]{0,2}/g,
  /حرم[ء-ي]{0,3} (?:الله )?(?:تعالى )?(?:عز وجل )?(?:ال)?(?:نار|جنة) (?:على|علي[ء-ي]{0,3})/g,
  /(?:ال)?(?:نار|جنة) (?:علي[ء-ي]{0,3} |على [ء-ي]{2,12} )?(?:حرام|محرمة)/g,
  /حرام (?:على|علي[ء-ي]{0,3}) (?:ال)?(?:نار|جنة)/g,
  /حل[ء-ي]{0,2} (?:له|لهم|لها|عليه|عليهم|عليها) (?:ال)?شفاع[ء-ي]{1,3}/g,
  // The state of ihram and leaving it: «وهو محرم»، «ونحن محرمات»، «محلات ومحرمات»، «لا يحل حتى
  // يطوف»، «المحرم لا يحله إلا البيت»، «ثم لا يحل حتى يحل منهما».
  /و(?:هو|هي|هم|نحن|أنا|انا|أنت|انت|أنتم|انتم|هما|هن) (?:محرم|محرمة|محرمون|محرمين|محرمان|محرمات|حرم)(?=$|[\s«»"'()\[\]{},،.;:!؟?\-ۖۗ])/g,
  /محلات ومحرمات/g,
  /(?:لا|لم|ثم لا) يحل(?:ه|ها|وا|ون)? (?:حتى|إلا البيت|منه|منها|منهما)[^.،]{0,60}/g,
  /حتى يحل(?=$|[\s«»"'()\[\]{},،.;:!؟?\-ۖۗ])/g,
  /(?:رجل|رجلا|المرأة|امرأة) (?:ال)?حرام(?=$|[\s«»"'()\[\]{},،.;:!؟?\-ۖۗ])|فينا حلالا|يحل لشيء حرم منه|(?:لم|فلا) يحل (?:من أجل|ومن) /g,
  // Untying, alighting and coming between: «ولا يحل عنها ثلاثة أيام»، «لا يحل الممرض على
  // المصح»، «لا يحل وكاء»، «لا أحل لها عقدة»، «ولم يحل دون منظره سحاب».
  /يحل عن[ء-ي]{0,3}|يحل الممرض|ليحلل المصح|يحل (?:وكاء|سقاء|عقدة|دون)|أحل لها عقدة/g,
  // The Prophet's sanctuary as a place, and being deprived of a good: «أفي حرم رسول الله»،
  // «من حرم خيرها فقد حرم»، «من يحرم الرفق يحرم الخير».
  /في حرم رسول الله|حرم خير[ء-ي]{0,3}(?: فقد حرم)?|[يت]?حرم الرفق [يت]?حرم الخير/g,
  // The personal name again, by its apposition: «حرام أخو أم سليم».
  /حرام (?:أخو|اخو|خال) /g,
  // The prayer's opening and closing: «تحريمها التكبير وتحليلها التسليم».
  /تحريمها التكبير|تحليلها التسليم/g,
  // The wrath that "alights": «يحل عليكم غضبي»، «فيحل عليه غضبي»، «حل عليهم».
  /[يت]?حل[ء-ي]{0,2} علي[ء-ي]{0,3} (?:غضب|سخط|العذاب|عذاب)[ء-ي]{0,3}/g,
];

// ---------- strong: the lawful ----------

/** «حلال»، «الحلال»، «حلالا» — the word the founder named. */
const AR_HALAL = new RegExp(`${BL}${PRE}حلال(?:ا|ه|ها|هم)?${ER}`);
/**
 * Making lawful with its doer or its beneficiary: «أحل الله البيع»، «أحل لكم»، «أحلت لكم»،
 * «أحللنا لك»، «يحل لهم الطيبات»، «حل لكم»، «تحل له». The preposition must carry a pronoun
 * or a person word, so «حل بالمكان» (alighted) never matches.
 */
const HALAL_VERB = String.raw`(?:أحل|احل|أحلت|احلت|أحللنا|احللنا|أحلوا|احلوا|يحل|تحل|نحل|حل|حلت|يحلل|حلل)`;
const LAHU = String.raw`ل(?:كم|هم|هن|هما|كما|كن|ه|ها|ك|ي|نا|ل[ء-ي]{2,10}|امرئ|مسلم|مؤمن|مؤمنة|أحد|احد|رجل|امرأة|من)`;
const AR_AHALLA_LI = new RegExp(`${BL}${VPRE}${HALAL_VERB}${PRON} ${LAHU}${ER}`);
const AR_AHALLA_ALLAH = new RegExp(`${BL}${VPRE}(?:أحل|احل|أحله|احله|أحلها|احلها|أحلهما|يحل|حلل|حلله|حللها) (?:الله|ربي|ربكم|ربنا|رسول الله|النبي|الطيبات|البيع)${ER}|${BL}${PRE}الحل والحرمة${ER}|${BL}${PRE}ما (?:أحل|احل) (?:الله|لكم|لهم|لك|له)${ER}`);
/** The negated permission: «لا يحل لامرئ»، «لا تحل له»، «لا يحل دم»، «لم يحل»، «ما يحل». */
const AR_LA_YAHILL = new RegExp(`${BL}${VPRE}(?:لا|لم|ما|ليس|لن) (?:يحل|تحل|يحلان|يحللن|يحلون|تحلوا)${PRON}${ER}`);
/** «استحل»، «يستحلون»، «استحلال»، «مستحل» — treating a thing as lawful. */
const AR_ISTIHLAL = new RegExp(`${BL}${VPRE}${PRE}(?:استحل|استحلل|يستحل|تستحل|نستحل|استحلال|مستحل)(?:وا|ون|ين|ت|تم|نا|ن|ا)?${PRON}${ER}`);

// ---------- strong: the unlawful ----------

/** «حرام»، «الحرام»، «حراما» — after the sanctuary names and the personal name are removed. */
const AR_HARAM = new RegExp(`${BL}${PRE}حرام(?:ا|ه|ها|هم|ان)?${ER}`);
/**
 * Forbidding with its doer or its object: «حرم الله»، «حرم ربي الفواحش»، «حرمت عليكم
 * الميتة»، «حرم عليهم»، «حرمنا عليهم»، «يحرم عليهم الخبائث»، «محرم على»، «حرمه رسول الله».
 */
const HARAM_VERB = String.raw`(?:حرم|يحرم|تحرم|نحرم|محرم|محرمة|محرما)`;
const AR_HARRAMA_ALLAH = new RegExp(`${BL}${VPRE}(?:حرم|يحرم|حرمه|حرمها|حرمهما|حرمهن) (?:الله|ربي|ربكم|ربنا|رسول الله|النبي|إسرائيل|اسرائيل)${ER}|${BL}(?:الله|ربكم|ربي|ربنا|ورسوله|رسوله) حرم${PRON}${ER}|${BL}${VPRE}حرم (?:الفواحش|بيع|أكل|أكلها|أشياء|الخمر|الربا|الميتة|الظلم)${ER}|${BL}${VPRE}[يت]حرم (?:ما [يت]حرم|من الرضاع[ء-ي]{0,2})${ER}|${BL}${VPRE}(?:من|الذي|التي) حرم${PRON}${ER}|${BL}${VPRE}حرم (?:هذا|ذلك|أم|ام|زينة)${ER}|${BL}${VPRE}حرمت ظهور${PRON}${ER}|${BL}${PRE}ما حرم (?:الله|ربكم|ربي|عليكم|عليهم|عليه|علينا)${ER}`);
const AR_HARRAMA_ALA = new RegExp(`${BL}${VPRE}(?:ال)?${HARAM_VERB}${VEND}${PRON} (?:على|علي[ء-ي]{0,3})${ER}|${BL}${VPRE}(?:حرم|حرمت|يحرم)${PRON} [ء-ي]{2,12}(?: [ء-ي]{2,12})? (?:على|علي[ء-ي]{0,3})${ER}`);
/** «حرمنا»، «حرمناها»، «حرموا»، «يحرمون»، «حرمتم» — forms only the forbidding verb takes. */
const AR_HARRAMNA = new RegExp(`${BL}${VPRE}(?:حرمنا|حرموا|يحرمون|تحرمون|حرمتم|تحرموا|يحرموا|يحرمونه|حرموه|حرموها|يحرمه|يحرمها)${PRON}${ER}`);
/** «تحريم»، «التحريم»، «تحريمه» — the act of forbidding. */
const AR_TAHRIM = new RegExp(`${BL}${PRE}تحريم(?:ا|ه|ها|هما|هم)?${ER}`);
/** «المحرمات»، «محرمات» and «محارم الله»، «محارمه» — the forbidden things. */
const AR_MUHARRAMAT = new RegExp(`${BL}${PRE}محرمات${PRON}${ER}|${BL}${PRE}محارم (?:الله|ه)${ER}|${BL}${PRE}محارمه${ER}`);

// ---------- weak: bare verbs and the neighbouring vocabulary ----------

/** Bare lawful verbs: «أحل»، «أحلت»، «يحلون»، «يحل» — also "left ihram" and "alighted"; weak. */
const AR_AHALLA = new RegExp(`${BL}${VPRE}(?:أحل|احل|أحلت|احلت|أحلوا|احلوا|يحلون|يحلونه|تحلون|تحلوا|يحلوا|أحللتم|احللتم|يحل|تحل|تحليل|التحليل)${PRON}${ER}`);
/** Bare unlawful verbs: «حرم»، «يحرم»، «محرم» — also the sanctuary, ihram and the month; weak. */
const AR_HARRAMA = new RegExp(`${BL}${VPRE}(?:ال)?(?:حرم|حرمت|يحرم|تحرم|نحرم|محرم|محرمة|محرما)${PRON}${ER}`);
/** «الطيبات»، «طيبات» — the good things the Qur'an pairs with the lawful; weak. */
const AR_TAYYIBAT = new RegExp(`${BL}${PRE}طيبات${ER}|${BL}${PRE}حلالا طيبا${ER}`);
/** «الخبائث»، «الخبيث» — the foul things forbidden; weak. */
const AR_KHABAITH = new RegExp(`${BL}${PRE}(?:خبائث|خبيث|خبيثة)${ER}`);
/** «مشتبهات»، «شبهات»، «الشبهة» — the doubtful matters between the two; weak. */
const AR_SHUBUHAT = new RegExp(`${BL}${PRE}(?:مشتبهات|مشبهات|شبهات|شبهة)${ER}`);
/** «مباح»، «إباحة»، «يباح»، «أباح» — the jurists' permissible; weak. */
const AR_MUBAH = new RegExp(`${BL}${VPRE}${PRE}(?:مباح|مباحة|مباحا|إباحة|اباحة|يباح|تباح|أباح|اباح|أباحه|أباحها)${ER}`);
/** «مكروه»، «كراهة» — the disliked, short of unlawful; weak. */
const AR_MAKRUH = new RegExp(`${BL}${PRE}(?:مكروه|مكروهة|مكروها|كراهة|كراهية)${ER}`);
/** «الرخصة»، «رخص» — the concession; weak. */
const AR_RUKHSA = new RegExp(`${BL}${VPRE}${PRE}(?:رخصة|رخص|يرخص|أرخص)${ER}`);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `halal-haram-browser` also admits it (see pick in export-api).
 */
export const HALAL_EXCLUDE = new Set<string>([]);

const STRONG: [RegExp, string][] = [
  [AR_HALAL, "halal"],
  [AR_AHALLA_LI, "ahalla-li"],
  [AR_AHALLA_ALLAH, "ahalla-allah"],
  [AR_LA_YAHILL, "la-yahill"],
  [AR_ISTIHLAL, "istihlal"],
  [AR_HARAM, "haram"],
  [AR_HARRAMA_ALLAH, "harrama-allah"],
  [AR_HARRAMA_ALA, "harrama-ala"],
  [AR_HARRAMNA, "harramna"],
  [AR_TAHRIM, "tahrim"],
  [AR_MUHARRAMAT, "muharramat"],
];
const WEAK: [RegExp, string][] = [
  [AR_AHALLA, "ahalla"],
  [AR_HARRAMA, "harrama"],
  [AR_TAYYIBAT, "tayyibat"],
  [AR_KHABAITH, "khabaith"],
  [AR_SHUBUHAT, "shubuhat"],
  [AR_MUBAH, "mubah"],
  [AR_MAKRUH, "makruh"],
  [AR_RUKHSA, "rukhsa"],
];
/** The signals on the lawful side and on the unlawful side; the rest are neighbours of both. */
export const HALAL_SIDE = ["halal", "ahalla-li", "ahalla-allah", "la-yahill", "istihlal", "ahalla", "tayyibat", "mubah", "rukhsa"] as const;
export const HARAM_SIDE = ["haram", "harrama-allah", "harrama-ala", "harramna", "tahrim", "muharramat", "harrama", "khabaith", "makruh"] as const;
export const NEUTRAL_SIDE = ["shubuhat"] as const;
const HALAL_SET = new Set<string>(HALAL_SIDE);
const HARAM_SET = new Set<string>(HARAM_SIDE);

/**
 * A text as the detector reads it: diacritics stripped and the out-of-scope phrases blanked
 * (each letter replaced, the spaces kept, so word positions survive for the harvest excerpts).
 */
export function halalFold(text: string): string {
  let raw = text.replace(DIACRITICS, "");
  for (const re of OUT_OF_SCOPE) raw = raw.replace(re, (m) => m.replace(/\S/g, "·"));
  return raw;
}

/** The passage text the detector reads: text_search first, text as the fallback, folded. */
export function halalTextOf(n: Node): string {
  return halalFold([n.data.text_search, n.data.text].filter(Boolean).join(" "));
}

/** The matched signal names of a folded text. `strongOnly` leaves the pair rule out (the harvest gate). */
export function halalSignalsOfText(raw: string, strongOnly = false): string[] {
  if (!raw.trim()) return [];
  const hits = new Set<string>();
  for (const [re, name] of STRONG) if (re.test(raw)) hits.add(name);
  if (strongOnly && hits.size === 0) return [];
  const weak = new Set<string>();
  for (const [re, name] of WEAK) if (re.test(raw)) weak.add(name);
  // A weak signal counts beside a strong one; the one pair rule admits a passage that carries
  // both bare verbs («يحلونه عاما ويحرمونه عاما») or «مباح» beside the bare unlawful verb.
  if (hits.size > 0 || ((weak.has("ahalla") || weak.has("mubah")) && weak.has("harrama"))) for (const s of weak) hits.add(s);
  return [...hits];
}

/** Offset of the first strong match in a folded text, or -1. */
export function halalFirstStrongAt(raw: string): number {
  let at = -1;
  for (const [re] of STRONG) {
    const m = re.exec(raw);
    if (m && (at === -1 || m.index < at)) at = m.index;
  }
  return at;
}

/** The matched signal names for a passage, or [] when it is not about «الحلال والحرام». */
export function halalSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata.
  if (HALAL_EXCLUDE.has(n.id)) return [];
  return halalSignalsOfText(halalTextOf(n));
}

/** True when the passage mentions or carries the «الحلال والحرام» theme. */
export function isHalalPassage(n: Node): boolean {
  return halalSignalsOf(n).length > 0;
}

/** `both` when the passage names the lawful and the unlawful, else the one side it names. */
export function halalKindOf(n: Node): HalalKind | null {
  const s = halalSignalsOf(n);
  if (!s.length) return null;
  const h = s.some((x) => HALAL_SET.has(x));
  const r = s.some((x) => HARAM_SET.has(x));
  if (h && r) return "both";
  if (r) return "haram";
  if (h) return "halal";
  return "both"; // only the doubtful matters fired beside a strong signal: they stand between the two
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function halalCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): HalalCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `halal-haram-<section>` when present, else `curated`. */
export function halalTagSection(n: Node): HalalSection {
  const tag = n.tags.find((t) => t.startsWith("halal-haram-") && t !== HALAL_TAG);
  const id = tag?.slice("halal-haram-".length) ?? "curated";
  return (HALAL_SECTIONS as readonly string[]).includes(id) ? (id as HalalSection) : "curated";
}
