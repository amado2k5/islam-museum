// The Fire Browser's shared reads (docs/plan/51-nar-browser.md): which passage records report or
// mention النار — the Fire — and which section each belongs to. Detection runs at build time over
// the compiled graph, so a fire mention in any harvested book — and in every book harvested later —
// appears without any tagging step. Curated records join through the `nar-browser` tag instead.
//
// Scope, per the founder's answers (11 Nov 2026): every hellfire name — النار gated, جهنم، الجحيم،
// سقر، لظى، الحطمة، الحامية، الهاوية، السعير — plus the keepers, the fuel, the food and drink of
// the Fire, the bridge over it and the refuge formulas — AND worldly fire (نار إبراهيم، نار شجرة
// موسى، نار الحرب والطبخ) in its own `dunya` section. A passage naming only a hellfire word is
// hellfire; a passage whose only fire words carry worldly signals is worldly; a passage carrying
// both is hellfire (the hellfire mention wins the section). Verified false positives are excluded
// by id in NAR_EXCLUDE; known worldly passages are listed in NAR_DUNYA.
import type { Node } from "./build-graph.js";

export const NAR_TAG = "nar-browser";
/** Page sections: the four passage corpora, the worldly-fire shelf, then the curated records. */
export const NAR_SECTIONS = ["quran", "sunnah", "seerah", "books", "dunya", "curated"] as const;
export type NarSection = (typeof NAR_SECTIONS)[number];
export type NarCorpus = Exclude<NarSection, "dunya" | "curated">;
/** `hellfire` = a mention of the Fire of the hereafter; `worldly` = a mention of this world's fire. */
export type NarKind = "hellfire" | "worldly";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/**
 * The «نار» lexeme: bare, definite, or with clitic prefixes (وبفسكل) and pronoun/morphological
 * suffixes (نارا، ناره، ناركم، نيرانها…). The leading boundary keeps دينار، منار، أنار، ديار
 * out of every hit.
 */
const AR_NAR_LEXEME = new RegExp(`${BL}(?:(?:ال)|[وبفسكل]){0,3}نار(?:ا|ه|ها|هم|كن|كم|كما|نا|ي|هما|ان|انه|انها|ات)?(?=$|${E})`);

/* ---- Hellfire names ---- */
const AR_JAHANNAM = new RegExp(`${BL}(?:ال)?جهنم[ء-ي]{0,3}(?=$|${E})`);
const AR_JAHIM = new RegExp(`${BL}(?:ال)?جحيم[ء-ي]{0,2}(?=$|${E})`);
const AR_SAQAR = new RegExp(`${BL}(?:ال)?سقر[ء-ي]{0,2}(?=$|${E})`);
const AR_HUTAMA = new RegExp(`${BL}(?:ال)?حطمة(?=$|${E})`);
const AR_LADHA = new RegExp(`${BL}لظى(?=$|${E})`);
const AR_HAMIYA = /نار\s+(?:ال)?حامية|النار\s+الحامية/;
/** الهاوية — the abyss of sura 101 — counts only beside fire, hell or the «فأمه هاوية» frame. */
const AR_HAWIYA = new RegExp(`${BL}(?:ال)?هاوية(?=$|${E})`);
const HAWIYA_CONTEXT = /نار|جهنم|جحيم|عذاب|سقر|أمه|أمّه|القيامة|الآخرة|الاخرة/;
const AR_SAIR = new RegExp(`${BL}(?:ال)?سعير[ء-ي]{0,2}(?=$|${E})`);
const AR_DAR_BAWAR = /دار\s+(?:ال)?بوار|دار\s+البوار/;
const AR_DARAK = /درك\s+(?:ال)?أسفل|أسفل\s+درك|الدرك\s+الأسفل|دركات\s+(?:النار|جهنم)/;

/* ---- Keepers, fuel, food and crossing ---- */
const AR_ZABANIYYA = /الزبانية|زبانية/;
const AR_KEEPER = /خازن\s+(?:ال)?نار|خازن\s+جهنم|خزنة\s+(?:النار|جهنم)|خزان\s+(?:ال)?نار|مالكا?\s+خازن|مالك\s+خازن\s+(?:ال)?(?:نار|جهنم)/;
const AR_FUEL = /وقود\s+(?:ال)?نار|وقود\s+جهنم|وقودها\s+(?:ال)?ناس|حطب\s+جهنم|وقود\s+(?:ال)?جحيم|النار\s+ذات\s+الوقود/;
const AR_AHL = /أهل\s+(?:ال)?نار|أصحاب\s+(?:ال)?نار|أهل\s+جهنم|أصحاب\s+جهنم|أهل\s+(?:ال)?جحيم|أصحاب\s+(?:ال)?سعير/;
const AR_ADHAB = /عذاب\s+(?:ال)?نار|عذاب\s+جهنم|عذاب\s+(?:ال)?حريق|عذاب\s+(?:ال)?سعير|عذاب\s+(?:ال)?جحيم/;
const AR_MAWA = /مأو(?:ى|اه|اهم|اها|اكم|انا|اهما)\s+(?:ال)?(?:نار|جهنم)|مثواهم\s+(?:ال)?(?:نار|جهنم)|مستقرهم\s+(?:ال)?(?:نار|جهنم)|مصيرهم\s+(?:إلى\s+)?(?:ال)?(?:نار|جهنم)/;
const AR_ITTAQU = /اتقوا\s+(?:ال)?نار/;
const AR_KHALID_NAR = /خالد[ء-ي]{0,3}\s+(?:في\s+)?(?:ال)?(?:نار|جهنم)|مخلد[ء-ي]{0,3}\s+في\s+(?:ال)?(?:نار|جهنم)/;
const AR_YUSLA = /(?:سيصلى|يصلى|صلى|يصليها|يصلاها|تصلون)\s+(?:ال)?نارا?|صالوها\s+في\s+(?:ال)?نار|يصلون\s+(?:ال)?نارا?/;
const AR_ENTER_NAR = /يلقون\s+في\s+(?:ال)?(?:نار|جهنم)|يلقى\s+في\s+(?:ال)?(?:نار|جهنم)|ألقوهم\s+في\s+(?:ال)?نار|ألقوه\s+في\s+(?:ال)?نار|يسحبون\s+في\s+(?:ال)?نار|يسحبون\s+في\s+جهنم|يحشرون\s+إلى\s+جهنم|يحشرون\s+في\s+(?:ال)?نار|يقحمون\s+(?:في\s+)?(?:ال)?نار|يدعون\s+في\s+(?:ال)?نار|أدخلوه\s+(?:ال)?نار|أدخل(?:ه|ها|هم|تم)?\s+(?:ال)?نار|دخل(?:ت|وا)?\s+(?:ال)?نار|يدخل(?:ون)?\s+(?:ال)?نار|حشروا\s+إلى\s+جهنم|ذروا\s+في\s+جهنم|تدكهم\s+في\s+(?:ال)?نار|ورطهم\s+(?:ال)?نار|أوردها\s+(?:ال)?نار/;
const AR_ZAMAM = /(?:سبعون|سبعين)\s+ألف\s+زمام|ألف\s+زمام/;
const AR_SIRAT_NAR = /(?:ال)?صراط\s+(?:على|فوق)\s+(?:متن\s+)?(?:ال)?(?:نار|جهنم)|على\s+صراط\s+جهنم|الصراط\s+متن\s+جهنم/;
const AR_ZAQQUM = /(?:ال)?زقوم/;
const AR_GHUSLIN = /(?:ال)?غسلين|(?:ال)?غساق/;
const AR_DARI = /(?:ال)?ضريع/;
/** صديد pus — hellfire drink only when a hell or drink word is near. */
const AR_SADID = new RegExp(`${BL}صديد[ء-ي]{0,3}(?=$|${E})`);
const SADID_CONTEXT = /عذاب|نار|جهنم|شراب|سقيا|ماء|أهل/;
/** حميم — boiling water AND an intimate friend — counts only beside a hellfire-food frame. */
const AR_HAMIM = new RegExp(`${BL}(?:ال)?حميم[ء-ي]{0,2}(?=$|${E})`, "g");
const HAMIM_CONTEXT = /شراب|ماء|سقي(?:وا|ه|هم|تم|ت)?|كأس|عذاب|جهنم|النار|غساق|يغلي|بطون|رءوس/;
const AR_TALFAH = /تلفح\s+وجوههم|تلفحهم\s+(?:ال)?نار|لفحت\s+وجوههم/;
const AR_TALAZZA = /تلظى|تلظّى/;
const AR_QITA = /قطع(?:ة|ان|ا)\s+من\s+(?:ال)?نار/;
const AR_LAHAB = /ذات\s+لهب|لهب\s+من\s+(?:ال)?نار|نارا?\s+ذات\s+لهب/;
const AR_NADRAN = /نذرت\s+(?:ال)?نار|نذر\s+(?:ال)?نار|قذف\s+في\s+(?:ال)?نار/;
const AR_NAR_JAHANNAM = /نار\s+جهنم|النار\s+جهنم/;
const AR_TASQAR = /تسعر(?:وا|ون)?\s+(?:ال)?نار|تسعر\s+جهنم|أسعروا\s+(?:ال)?نار|سعر(?:نا|وا)\s+(?:ال)?نار/;
const AR_MATIB = /مطيبهم\s+إلى\s+(?:ال)?نار|ترديهم\s+في\s+(?:ال)?نار/;
const AR_HUNUD = /حميم\s+وغساق/;
const AR_NAR_NAMES_PHRASE = /أسماء\s+(?:ال)?نار|سميت\s+(?:ال)?نار|سبعة\s+أسماء\s+للنار|أبواب\s+جهنم|سبعة\s+أبواب\s+(?:ل)?جهنم|لها\s+سبعة\s+أبواب/;

/* ---- Worldly-fire signals (checked in the passage window) ---- */
const DUNYA_SIGNALS: RegExp[] = [
  /بردا\s+و?سلاما|كوني\s+بردا|برداً\s+وسلاماً/,          // نار إبراهيم «كوني برداً وسلاماً»
  /حرقوه\s+وانصروا|ألقوه\s+في\s+(?:ال)?جحيم/,           // إلقاء إبراهيم في الجحيم (النار الدنيوية)
  /قبس|شقاص|بخبر\s+منها|آتيكم\s+منها/,                  // نار موسى «آتيكم منها بخبر أو قبس»
  /أنست\s+نارا|آنست\s+نارا|أناس|لاح\s+(?:لهم\s+)?نار/,  // موسى «آنس ناراً» / «لاح لهم نار»
  /من\s+(?:ال)?شجرة|البقعة\s+المباركة/,                  // الشجرة في الوادي المقدس (gate: نار في الأفق)
  /أوقد|أوقاد|يوقد|توقدون|استوقد|إيقاد|توقيد/,          // إيقاد النار دنيا «أوقدوا لنا ناراً للحرب» (الموقدة اسم من أسماء النار، لا إيقاداً)
  /تنور|تنّور|التنور|فرن/,                              // التنور والفرن
  /نارا?\s+للحرب|للحرب\s+نارا/,                          // نار الحرب (المائدة 64)
  /رماد/,                                               // رماد الدنيا
  /مطبخ|طبخ\s+(?:على|فوق)?\s*(?:ال)?نار|نار\s+(?:لل)?طبخ|شواء\s+على\s+(?:ال)?نار|قدر\s+على\s+(?:ال)?نار/, // نار الطبخ
  /تورون|يورون|من\s+(?:ال)?شجر\s+الأخضر|شجر\s+أخضر/,    // «النار التي تورون» «من الشجر الأخضر ناراً»
  /الأخدود/,                                            // نار أصحاب الأخدود — محرقة دنيا للمؤمنين
  /وجدت\s+نارا|وجد\s+نارا|نارا\s+في\s+(?:ال)?طريق/,
];

/**
 * Passage ids verified worldly by hand — the Qur'anic fire narratives whose wording alone could
 * not be told apart from the hereafter («ألقوه في الجحيم» is Ibrahim's pyre, not hell).
 */
export const NAR_DUNYA = new Set([
  "passage/quran-2-17",   // مثل الذي استوقد ناراً — parable, worldly kindling
  "passage/quran-5-64",   // «أوقدوا ناراً للحرب»
  "passage/quran-20-10",  // موسى «آتيكم منها بخبر أو آتيكم بشهاب قبس»
  "passage/quran-27-7",   // «إني آنست ناراً»
  "passage/quran-27-8",   // «فلما جاءها نودي أن بورك من في النار»
  "passage/quran-28-29",  // «آنس من جانب الطور ناراً»
  "passage/quran-21-68",  // «حرقوه وانصروا آلهتكم»
  "passage/quran-21-69",  // «قلنا يا نار كوني برداً وسلاماً على إبراهيم»
  "passage/quran-29-24",  // «فقالوا اقتلوه أو حرقوه فأنجاه الله من النار»
  "passage/quran-37-97",  // «فألقوه في الجحيم» — Ibrahim's pyre
  "passage/quran-36-80",  // «من الشجر الأخضر ناراً فإذا أنتم منه توقدون»
  "passage/quran-56-71",  // «أفرأيتم النار التي تورون»
  "passage/quran-56-72",
  "passage/quran-56-73",
  "passage/quran-85-4",   // أصحاب الأخدود
  "passage/quran-85-5",   // «النار ذات الوقود»
  "passage/quran-85-6",
  "passage/quran-85-7",
]);

/**
 * Passage records whose only lexical hit is a verified false positive — a «نار» that is not a
 * fire at all. Curated escape hatch: tagging a passage `nar-browser` also admits it.
 */
export const NAR_EXCLUDE = new Set<string>([
]);

/**
 * Passage ids verified hellfire by hand though their wording carries a worldly signal — the
 * Prophet's parable of the man who kindles a fire while moths fall into it (صحيح مسلم) is a
 * parable *of hellfire*: the fire he holds his people back from.
 */
export const NAR_HELL = new Set([
  "passage/muslim-2284",
]);

/**
 * The matched signal names for a passage, or [] when it is not about the Fire.
 * Signal names ending in `_d` are worldly-fire signals; everything else is hellfire.
 */
export function narSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || NAR_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  if (has(AR_NAR_LEXEME)) hits.add("nar");
  if (has(AR_JAHANNAM)) hits.add("jahannam");
  if (has(AR_JAHIM)) hits.add("jahim");
  if (has(AR_SAQAR)) hits.add("saqar");
  if (has(AR_HUTAMA)) hits.add("hutama");
  if (has(AR_LADHA)) hits.add("ladha");
  if (has(AR_HAMIYA)) hits.add("hamiya");
  if (has(AR_HAWIYA) && HAWIYA_CONTEXT.test(raw)) hits.add("hawiya");
  if (has(AR_SAIR)) hits.add("sair");
  if (has(AR_DAR_BAWAR)) hits.add("dar_bawar");
  if (has(AR_DARAK)) hits.add("darak");
  if (has(AR_ZABANIYYA)) hits.add("zabaniyya");
  if (has(AR_KEEPER)) hits.add("keeper");
  if (has(AR_FUEL)) hits.add("fuel");
  if (has(AR_AHL)) hits.add("ahl");
  if (has(AR_ADHAB)) hits.add("adhab");
  if (has(AR_MAWA)) hits.add("mawa");
  if (has(AR_ITTAQU)) hits.add("ittaqu");
  if (has(AR_KHALID_NAR)) hits.add("khalid");
  if (has(AR_YUSLA)) hits.add("yusla");
  if (has(AR_ENTER_NAR)) hits.add("enter");
  if (has(AR_ZAMAM)) hits.add("zamam");
  if (has(AR_SIRAT_NAR)) hits.add("sirat");
  if (has(AR_ZAQQUM)) hits.add("zaqqum");
  if (has(AR_GHUSLIN)) hits.add("ghuslin");
  if (has(AR_DARI)) hits.add("dari");
  if (has(AR_SADID) && SADID_CONTEXT.test(raw)) hits.add("sadid");
  for (const m of raw.matchAll(AR_HAMIM)) {
    const window = raw.slice(Math.max(0, m.index! - 30), m.index! + m[0].length + 40);
    if (HAMIM_CONTEXT.test(window)) { hits.add("hamim"); break; }
  }
  if (has(AR_TALFAH)) hits.add("talfah");
  if (has(AR_TALAZZA)) hits.add("talazza");
  if (has(AR_QITA)) hits.add("qita");
  if (has(AR_LAHAB)) hits.add("lahab");
  if (has(AR_NADRAN)) hits.add("nadran");
  if (has(AR_NAR_JAHANNAM)) hits.add("nar_jahannam");
  if (has(AR_TASQAR)) hits.add("tasqar");
  if (has(AR_MATIB)) hits.add("matib");
  if (has(AR_HUNUD)) hits.add("hamim_ghassaq");
  if (has(AR_NAR_NAMES_PHRASE)) hits.add("names");
  // Worldly signals classify a fire mention; they never create one by themselves
  // (a passage about طعام or الجمر with no fire word is not about fire).
  if (hits.size > 0) for (const re of DUNYA_SIGNALS) if (has(re)) { hits.add("dunya"); break; }
  return [...hits];
}

/** True when the passage reports or mentions the Fire. */
export function isNarPassage(n: Node): boolean {
  return narSignalsOf(n).length > 0;
}

/**
 * `hellfire` when any hellfire signal is present, or when the passage is the bare «النار» lexeme
 * (the default reading of «النار» in these corpora) — worldly only when the worldly signals are
 * the *only* evidence, or the passage is whitelisted in NAR_DUNYA.
 */
export function narKindOf(n: Node): NarKind {
  const signals = narSignalsOf(n);
  if (NAR_HELL.has(n.id)) return "hellfire";
  if (NAR_DUNYA.has(n.id)) return "worldly";
  const nonDunya = signals.filter((s) => s !== "dunya");
  if (nonDunya.length > 1 || (nonDunya.length === 1 && nonDunya[0] !== "nar")) return "hellfire";
  if (signals.includes("dunya")) return "worldly";
  return "hellfire";
}

/**
 * Which corpus a fire passage belongs to, from its work — the frozen Qur'an, the hadith
 * collections, the seerah books, every other harvested work — with the worldly-fire passages
 * split into the `dunya` shelf whatever their corpus.
 */
export function narSectionOf(n: Node, genre: string[] | undefined): NarSection {
  const workId = n.data.work as string | undefined;
  if (narKindOf(n) === "worldly") return "dunya";
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || n.data.unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `nar-<section>` when present, else `curated`. */
export function narTagSection(n: Node): NarSection {
  const tag = n.tags.find((t) => t.startsWith("nar-") && t !== NAR_TAG);
  const id = tag?.slice(4) ?? "curated";
  return (NAR_SECTIONS as readonly string[]).includes(id) ? (id as NarSection) : "curated";
}
