// The Ibadat and Adhkar Browser's shared reads (docs/plan/51-ibadat-browser.md): which passage
// records report, perform or mention an act of worship or remembrance (عبادة، صلاة، طهارة، صوم،
// زكاة وصدقة، حج وعمرة، ذكر وأذكار، دعاء، تلاوة، توبة، رقية), and which corpus section each
// belongs to. Detection runs at build time over the compiled graph, so an act of worship in any
// harvested book — and in every book harvested later — appears without any tagging step. Curated
// records join through the `ibadat-browser` tag instead. Scope is worship directed to God:
// worship of idols («يعبدون الأصنام») and the argument sense of «حجّ/احتجّ» are out; the du'a
// family is shared with scripts/dua.ts (isDuaPassage) so every supplication the Du'a Browser
// counts is an act of worship here too.
import type { Node } from "./build-graph.js";
import { isDuaPassage, duaKindOf } from "./dua.js";

export const IBADAT_TAG = "ibadat-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const IBADAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type IbadatSection = (typeof IBADAT_SECTIONS)[number];
export type IbadatCorpus = Exclude<IbadatSection, "curated">;
/** `act` = the passage performs or commands the worship; `mention` = it is about the worship. */
export type IbadatKind = "act" | "mention";
export type IbadatTopic =
  | "ibada" | "salah" | "tahara" | "sawm" | "zakat" | "hajj"
  | "dhikr" | "dua" | "tilawa" | "tawba" | "ruqya";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— Worship itself: عبادة ————— */
/** عبادة/عبادات/العبادة — the noun family is always a mention of worship. */
const AR_IBADA_NOUN = new RegExp(`${BL}(?:ال)?عباد[ةه](?:ات)?[ء-ي]{0,3}(?=$|${E})`);
/** عبد + divine object: «نعبده»، «إياك نعبد»، «اعبدوا الله»، «يعبدون الله/الرحمن/ربهم». */
const AR_IBADA_VERB_GOD = new RegExp(
  `${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?عبد(?:وا|ون|ين|ه|هما|هم|ك|كم|كن|نا|ي|ت|تم|تن|و|وه)?(?=$|${E})\\s+(?:الله|إياك|إياه|رب[ي ه ك ن م]|الرحمن|معبود[ه ك م ن])`);
/** «إياك نعبد» — the Fatiha order (object first). */
const AR_IYYAKA = new RegExp(`${BL}إياك\\s+نعبد(?=$|${E})`);
/** False-god objects: «يعبدون الأصنام/الأوثان/الطاغوت/الشمس/الكواكب/الأنداد/هبل/اللات/العزى/مناة/الشيطان». */
const IBADA_FALSE = /(?:الأصنام|الأوثان|أصنام|أوثان|الطاغوت|الشمس|الكواكب|النجوم|الأنداد|أنداد|هبل|اللات|العزى|مناة|الشيطان|الجن|الملائكة|عيسى|عزير|البقر|النار|الصلب)/;

/* ————— الصلاة ————— */
/** صلاة/الصلاة/الصلوات — noun, with clitics and pronoun suffixes. */
const AR_SALAT_NOUN = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}صلا[ةهت][ء-ي]{0,3}(?=$|${E})`);
const AR_SALAWAT = new RegExp(`${BL}(?:ال)?صلوات(?=$|${E})`);
/** The performing verb: أصلي/أصلّي/نصلي/يصلي/يصلون/تصلي/صلّى/صلى/صلوا/صلِّ. */
const AR_SALAT_VERB = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?صل[يىواّ]{1,3}(?=$|${E})`);
/** Bowing and prostration: ركع/يركع/الركوع، سجد/يسجد/السجود، ساجد. */
const AR_RUKU_SUJUD = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?(?:ركع|سجد|راكع|ساجد|ركوع|سجود|الركع|السجد|الساجد|الراكع)(?:وا|ون|ين|ه|ها|هم|هما|ك|كم|كن|نا|ي|ت|تم|تن|و|وه|ة|ين|ان|ات)?(?=$|${E})`);
/** «أقيموا الصلاة»، «حافظوا على الصلوات»، «المصلين»، «صلاة الجمعة». */
const AR_MUSALLI = new RegExp(`${BL}(?:ال)?مصل[يى](?:ين|ون|ن)?(?=$|${E})`);

/* ————— الطهارة ————— */
const AR_WUDU = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?(?:وضوء|توضأ|وضّأ|تطهر|أحدث|حدث)(?:وا|ون|ين|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه|ئه|أ)?(?=$|${E})`);
const AR_GHUSL = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?(?:اغتسل|غسل)(?:وا|ون|ين|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})\\s*(?:من|عن)?`);
const AR_TAYAMMUM = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?(?:تيمم|تيمموا|التيمم|الصعيد)(?:وا|ون|ين|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})`);
const AR_TAHARA = new RegExp(`${BL}(?:ال)?طهارة(?:ت)?[ء-ي]{0,3}(?=$|${E})`);

/* ————— الصوم والاعتكاف ————— */
const AR_SAWM = new RegExp(`${BL}(?:ال)?(?:صيام|صوم|سيام|صائم|صائمين|صائمون|صوّم)(?:ه|ها|هم|هما|ك|كم|نا|ي|ة|ين|ون)?(?=$|${E})`);
const AR_SAWM_VERB = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?ص[او]م(?:وا|ون|ين|ن|ت|تم|تن|ي|نا)?(?=$|${E})`);
const AR_IFTAR_SUHUR = new RegExp(`${BL}(?:ال)?(?:إفطار|افطار|سحور|سحر|فطر|أفطر)(?:ه|ها|هم|ك|كم|نا|ي|ة|ين|وا|ون|ت)?(?=$|${E})`);
const AR_ITIKAF = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?(?:اعتكاف|اعتكف|عاكف|عكوف|العاكف)(?:وا|ون|ين|ن|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})`);

/* ————— الزكاة والصدقة ————— */
const AR_ZAKAT = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}زك[او]ة(?:ت|ه|ها|هم|ك|كم|نا|ي)?(?=$|${E})`);
const AR_ZAKA_VERB = new RegExp(`${BL}يؤتون\\s+الزكاة|زكّى|يزكي|زكى(?=$|${E})`);
const AR_SADAQA = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}صدق[ةه](?:ات|ت|ه|ها|هم|ك|كم|نا|ي)?(?=$|${E})`);
const AR_TASADDAQ = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?تصدّ?ق(?:وا|ون|ين|ن|ت|تم|ي|نا)?(?=$|${E})`);

/* ————— الحج والعمرة والطواف ————— */
/** «الحج» and Hajj vocabulary; word-initial matching keeps «احتجّ» (argument) and «حجة» (proof) out. */
const AR_HAJJ = new RegExp(`${BL}(?:ال)?(?:حج|حجاج|حاج|الحاج|بيت الله الحرام)(?:ّ|وا|ون|ين|ة المسلمين|ه|ها|هم|ك|كم|نا|ي|ت|تم)?(?=$|${E})`);
const AR_YUHAJJ = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?حج(?:ّ|وا|ون|ين|ج|ت|تم|ي|نا)(?=$|${E})`);
const AR_UMRA = new RegExp(`${BL}(?:ال)?(?:عمرة|العمرة|عمارة)(?:ة|ه|ها|هم|ك|كم|نا|ي)?(?=$|${E})`);
const AR_ITAMAR = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?(?:اعتمر|عمّر)(?:وا|ون|ين|ن|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})`);
const AR_TAWAF = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن)?(?:طواف|طاف|يطوف|طائف|الطائفين|طوف)(?:وا|ون|ين|ن|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})`);
const AR_SAY = new RegExp(`${BL}(?:ال)?سعي\\s+(?:بين|في)|يسعى\\s+بين|سعى\\s+بين|شعائر`);
const AR_HAJJ_RITES = new RegExp(`${BL}(?:ال)?(?:إحرام|احرام|أحرم|عرفة|عرفات|مزدلفة|رمي الجمار|رمي الجمرات|المناسك|مناسك|الوقوف بعرفة|الإفاضة|الطواف)(?:وا|ون|ين|ن|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})`);

/* ————— الذكر والأذكار ————— */
/** ذكر الله / يذكرون الله / اذكروا الله / ذاكر — remembrance with a divine object. */
const AR_DHIKR_GOD = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?ذكر(?:وا|ون|ين|ه|ها|هم|هما|ك|كم|كن|نا|ي|ت|تم|تن|و|وه|هن|ن)?(?=$|${E})\\s+(?:الله|رب[ي ه ك ن م]|الرحمن|اسم رب)`);
const AR_DHIKR_NOUN = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}(?:ذكر|أذكار|اذكار|اوراد|أوراد|ورد|اوراد)(?:ه|ها|هم|ك|كم|نا|ي)?(?=$|${E})`);
/** Tasbih: سبحان الله، يسبح، سبّح، التسبيح، مسبحة. */
const AR_TASBIH = new RegExp(`${BL}(?:[وبفس])?(?:سبحان|يسبح|يسبحون|تسبح|نسبح|سبّح|سبح|تسبيح|التسبيح|مسبح[ةه]|سبحوا|سبحت)(?=$|${E}|\\s)`);
/** Tahmid: الحمد لله، يحمد الله، حامد. */
const AR_TAHMID = new RegExp(`${BL}(?:ال)?حمد\\s+لله|يحمد\\s+الله|حامد(?=$|${E}|\\s)`);
/** Tahlil: لا إله إلا الله، لا إله إلا هو، التهليل. */
const AR_TAHLIL = new RegExp(`${BL}لا\\s+إله\\s+إلا\\s+(?:الله|هو|أنت|الرحمن)|التهليل|تهليل(?=$|${E})`);
/** Takbir: الله أكبر، كبّر، التكبير. */
const AR_TAKBIR = new RegExp(`${BL}الله\\s+أكبر|أكبر\\s+الله|يكبّر|كبّر(?:وا)?|التكبير|تكبير(?=$|${E})`);
/** Istighfar verb family (also counted by the dua detector). */
const AR_ISTIGHFAR = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?ستغفر(?:وا|ون|ين|ن|ه|ها|هم|كن|كم|ك|نا|ي|ت|تم|تن|و|وه|هما)?(?=$|${E})`);
const AR_ISTIGHFAR_NOUN = new RegExp(`${BL}(?:ال)?(?:استغفار|مستغفر|استغفر)(?:ه|ها|هم|ك|كم|نا|ي|ين|ون)?(?=$|${E})`);
/** Salat 'ala al-nabi: صلى الله عليه، صلوا عليه، الصلاة على النبي، مسلّم. */
const AR_SALAT_NABI = new RegExp(`${BL}(?:صلى|صلّى|صلوا|صلّوا|يصلون|تصلون)\\s+(?:الله\\s+)?علي[هه](?=$|${E}|\\s)|الصلاة على النبي|صل على|سلّم تسليما`);
/** Hawqala, basmala, hasbala: لا حول ولا قوة، بسم الله، حسبنا الله (last also via dua). */
const AR_HAWQALA = new RegExp(`${BL}لا\\s+حول\\s+ولا\\s+قوة\\s+إلا\\s+بالله|بسم\\s+الله|بسمي|باسم الله(?=$|${E})`);

/* ————— التلاوة ————— */
const AR_TILAWA = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?(?:تلاوة|تلا|يتلو|تتلى|يتلى|رتل|يرتل|رتّل|القراءة|قرأ القرآن|اقرأ)(?:وا|ون|ين|ن|ه|ها|هم|ك|كم|نا|ي|ت|تم|و|وه)?(?=$|${E})`);

/* ————— التوبة ————— */
const AR_TAWBA = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}(?:توبة|التاب|تائب|تائبين|تائبون|التواب|ينيب|أناب|إنابة|منيب|منيبين|أوبة)(?:ه|ها|هم|ك|كم|نا|ي|ين|ون|ة)?(?=$|${E})`);
const AR_TUB = new RegExp(`${BL}(?:[وبفس])?(?:توبوا|يتوب|تتوب|نتوب|أتوب|توب)(?=$|${E})`);

/* ————— الرقية ————— */
const AR_RUQYA = new RegExp(`${BL}(?:ال)?(?:رقية|رقى|الرقى|يرقي|ترقي|رقّى|ارق|استرقى|راقي)(?:ة|ه|ها|هم|ك|كم|نا|ي|ين|ون|وا|ت|تم)?(?=$|${E})`);

/* ————— قيام الليل ————— */
const AR_QIYAM = new RegExp(`${BL}(?:قيام الليل|تهجد|يتهجد|المتهجد|صلاة الليل|قيامة|الوتر|أوتر|يوتر|سنن الصلوات|النوافل|النوافل|التراويح|تراويح)(?=$|${E}|\\s)`);

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `ibadat-browser` also admits it (see pick in export-api). */
export const IBADAT_EXCLUDE = new Set<string>([]);

/** Signals that mean the passage performs or commands the act itself. */
const ACT_SIGNALS = new Set([
  "iyyaka", "ibada_verb",
  "salat_verb", "ruku_sujud", "musalli",
  "wudu", "ghusl", "tayammum",
  "sawm_verb", "itikaf",
  "zaka_verb", "tasaddaq",
  "yuhajj", "itamar", "tawaf", "say", "hajj_rites",
  "dhikr_god", "tasbih", "tahmid", "tahlil", "takbir", "istighfar", "salat_nabi", "hawqala",
  "tilawa", "tub",
  "ruqya", "qiyam",
]);

/** topic for each signal name. */
const SIGNAL_TOPICS: Record<string, IbadatTopic> = {
  ibada_noun: "ibada", ibada_verb: "ibada", iyyaka: "ibada",
  salat_noun: "salah", salawat: "salah", salat_verb: "salah", ruku_sujud: "salah", musalli: "salah",
  wudu: "tahara", ghusl: "tahara", tayammum: "tahara", tahara: "tahara",
  sawm: "sawm", sawm_verb: "sawm", iftar_suhur: "sawm", itikaf: "sawm",
  zakat: "zakat", zaka_verb: "zakat", sadaqa: "zakat", tasaddaq: "zakat",
  hajj: "hajj", yuhajj: "hajj", umra: "hajj", itamar: "hajj", tawaf: "hajj", say: "hajj", hajj_rites: "hajj",
  dhikr_god: "dhikr", dhikr_noun: "dhikr", tasbih: "dhikr", tahmid: "dhikr", tahlil: "dhikr",
  takbir: "dhikr", istighfar: "dhikr", istighfar_noun: "dhikr", salat_nabi: "dhikr", hawqala: "dhikr",
  tilawa: "tilawa",
  tawba: "tawba", tub: "tawba",
  ruqya: "ruqya",
  qiyam: "salah",
};

/** The matched signal names for a passage, or [] when it is not about worship or remembrance. */
export function ibadatSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // the «كتاب الصلاة» chapter of a hadith collection without the passage itself reporting worship.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || IBADAT_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  /* ibada: noun always counts; the verb counts only with a divine object and never with
     a false-god object («يعبدون الأصنام» stays out entirely). */
  if (has(AR_IBADA_VERB_GOD) || has(AR_IYYAKA)) {
    for (const m of raw.matchAll(new RegExp(AR_IBADA_VERB_GOD.source, "g"))) {
      const window = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 30);
      if (!IBADA_FALSE.test(window)) { hits.add("ibada_verb"); break; }
    }
    if (has(AR_IYYAKA)) hits.add("iyyaka");
  }
  if (has(AR_IBADA_NOUN)) {
    for (const m of raw.matchAll(new RegExp(AR_IBADA_NOUN.source, "g"))) {
      const window = raw.slice(Math.max(0, m.index! - 30), m.index! + m[0].length + 30);
      if (!IBADA_FALSE.test(window)) { hits.add("ibada_noun"); break; }
    }
  }

  if (has(AR_SALAT_NOUN)) hits.add("salat_noun");
  if (has(AR_SALAWAT)) hits.add("salawat");
  if (has(AR_SALAT_VERB)) hits.add("salat_verb");
  if (has(AR_RUKU_SUJUD)) hits.add("ruku_sujud");
  if (has(AR_MUSALLI)) hits.add("musalli");

  if (has(AR_WUDU)) hits.add("wudu");
  if (has(AR_GHUSL)) hits.add("ghusl");
  if (has(AR_TAYAMMUM)) hits.add("tayammum");
  if (has(AR_TAHARA)) hits.add("tahara");

  if (has(AR_SAWM)) hits.add("sawm");
  if (has(AR_SAWM_VERB)) hits.add("sawm_verb");
  if (has(AR_IFTAR_SUHUR)) hits.add("iftar_suhur");
  if (has(AR_ITIKAF)) hits.add("itikaf");

  if (has(AR_ZAKAT)) hits.add("zakat");
  if (has(AR_ZAKA_VERB)) hits.add("zaka_verb");
  if (has(AR_SADAQA)) hits.add("sadaqa");
  if (has(AR_TASADDAQ)) hits.add("tasaddaq");

  if (has(AR_HAJJ)) hits.add("hajj");
  if (has(AR_YUHAJJ)) hits.add("yuhajj");
  if (has(AR_UMRA)) hits.add("umra");
  if (has(AR_ITAMAR)) hits.add("itamar");
  if (has(AR_TAWAF)) hits.add("tawaf");
  if (has(AR_SAY)) hits.add("say");
  if (has(AR_HAJJ_RITES)) hits.add("hajj_rites");

  if (has(AR_DHIKR_GOD)) hits.add("dhikr_god");
  if (has(AR_DHIKR_NOUN)) hits.add("dhikr_noun");
  if (has(AR_TASBIH)) hits.add("tasbih");
  if (has(AR_TAHMID)) hits.add("tahmid");
  if (has(AR_TAHLIL)) hits.add("tahlil");
  if (has(AR_TAKBIR)) hits.add("takbir");
  if (has(AR_ISTIGHFAR)) hits.add("istighfar");
  if (has(AR_ISTIGHFAR_NOUN)) hits.add("istighfar_noun");
  if (has(AR_SALAT_NABI)) hits.add("salat_nabi");
  if (has(AR_HAWQALA)) hits.add("hawqala");

  if (has(AR_TILAWA)) hits.add("tilawa");
  if (has(AR_TAWBA) || has(AR_TUB)) hits.add("tawba");
  if (has(AR_RUQYA)) hits.add("ruqya");
  if (has(AR_QIYAM)) hits.add("qiyam");

  return [...hits];
}

/** True when the passage performs, commands or mentions an act of worship or remembrance —
 * including every supplication the Du'a Browser counts. */
export function isIbadatPassage(n: Node): boolean {
  return isDuaPassage(n) || ibadatSignalsOf(n).length > 0;
}

/** `act` when the passage performs or commands the worship, `mention` when it is only about it.
 * Du'a-only passages inherit the dua kind (formula → act). */
export function ibadatKindOf(n: Node): IbadatKind {
  const signals = ibadatSignalsOf(n);
  if (signals.length === 0) return isDuaPassage(n) && duaKindOf(n) === "formula" ? "act" : "mention";
  return signals.some((s) => ACT_SIGNALS.has(s)) ? "act" : "mention";
}

/** The worship topics a passage touches: every family whose signals hit, plus `dua` for any
 * passage the Du'a Browser counts. */
export function ibadatTopicsOf(n: Node): IbadatTopic[] {
  const topics = new Set<IbadatTopic>();
  for (const s of ibadatSignalsOf(n)) {
    const t = SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  if (isDuaPassage(n)) topics.add("dua");
  return [...topics];
}

/**
 * Which corpus an ibadat passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function ibadatCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): IbadatCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `ibadat-<section>` when present, else `curated`. */
export function ibadatTagSection(n: Node): IbadatSection {
  const tag = n.tags.find((t) => t.startsWith("ibadat-") && t !== IBADAT_TAG);
  const id = tag?.slice(7) ?? "curated";
  return (IBADAT_SECTIONS as readonly string[]).includes(id) ? (id as IbadatSection) : "curated";
}
