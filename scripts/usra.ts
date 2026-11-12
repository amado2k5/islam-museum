// The Usra (Family and Marriages) Browser's shared reads (docs/plan/54-usra-browser.md): which
// passage records report or mention marriage (الزواج والنكاح), the spouses and children of the
// Muslim family (الأسرة), their dwellings (المساكن), their livelihood (المعاش), their daily life
// (الحياة اليومية) and their social customs (العادات الاجتماعية), and which corpus section each
// belongs to. Detection runs at build time over the compiled graph, so a family-life report in any
// harvested book — and in every book harvested later — appears without any tagging step. Curated
// records join through the `usra-browser` tag instead. The ambiguous words are guarded: «زوج»
// (a pair/kind, «أزواجاً ثلاثة») and «بعل» (a lord or the idol Baal) count only beside marriage
// vocabulary, «بيت» counts only in its home plural and possessive forms (never Bayt al-Maqdis or
// the poetry bayt), «دار» only in its possessed home forms (never Dar al-Islam), «نار» the hearth
// sense stays out, and verified false positives are excluded by id.
import type { Node } from "./build-graph.js";

export const USRA_TAG = "usra-browser";
/** Page sections: the four passage corpora, then the famous marriages, then the curated records. */
export const USRA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type UsraSection = (typeof USRA_SECTIONS)[number];
export type UsraCorpus = Exclude<UsraSection, "curated">;
export type UsraTopic =
  | "zawaj" | "usra" | "maskan" | "maisha" | "yawmi" | "adat";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— الزواج والنكاح — marriage and the marriage contract ————— */
/** نكاح/النكاح/نكّح — the noun family; «فانكحوا»، «أنكحوا»، «ينكح»، «تنكح». */
const AR_NIKAH = new RegExp(`${BL}(?:[وبفسك])?(?:أ|ا|ي|ت|ن|ل)?نك[احى]ّ?(?:وا|ون|ين|ه|ها|هم|هما|ك|كم|كن|نا|ي|ت|تم|تن|و|وه|ة)?(?=$|${E})`);
/** زواج/زواجات noun and the تزوج/زوّج/متزوج verb family. */
const AR_ZAWAJ_NOUN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?زواج(?:ات|ه|ها|هم|ك|كم|نا|ي)?(?=$|${E})`);
const AR_TAZAWWAJ = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?(?:تزوج|تزوّج|زوّج|زوجها|زوّجها|زوجه|زوجته|يزوج|متزوج|مزوج)(?:وا|ون|ين|ه|ها|هم|هما|ك|كم|كن|نا|ي|ت|تم|تن|و|وه|ة)?(?=$|${E})`);
/** Possessed spouses — unambiguous marital forms: زوجة، زوجها، زوجته، زوجات، زوجك، أزواجهن… */
const AR_ZAWJ_POSSESSED = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:زوجة|زوجها|زوجته|زوجي|زوجات|زوجاته|زوجاتكم|زوجاتكن|زوجك|زوجكم|زوجكن|أزواجهن|أزواجكم|أزواجنا|أزواجهم|أزواجك|أزواج النبي|أزواج مطهرة|أزواجا مطهرة|أزواج مطهرات|أمهات المؤمنين|بعلها|بعلته|بعلك|بعلتك|حليلة|حليلته|حليلها)(?=$|${E})`);
/** Weak spouses: bare زوج/أزواج/بعل count only beside marriage vocabulary («زوج» is also a pair or a kind). */
const AR_ZAWJ_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:زوج|أزواج|أزواجا|بعل)(?=$|${E})`, "g");
const ZAWJ_CONTEXT = /نكاح|زواج|تزوج|زوجة|زوجات|امرأة|امرأته|نساء|نسائه|ذرية|بنين|بنات|مهر|صداق|وليمة|حليل|ضجة|بضع|طلاق|طلقكن|ثيبات|أبكار|مسلمات|مطهر|سكن إليها|لتسكنوا/;
/** The proposal word («خطبة») gates on *marriage* vocabulary, never its own family — a sermon
 *  خطبة has no نكاح or امرأة beside it. */
const KHITBA_CONTEXT = /نكاح|زواج|تزوج|زوجة|زوجات|امرأة|امرأته|نساء|مهر|وليمة|حليل/;
/** مهر — the dower; صداق is weak (it can mean friendship) so it counts only beside marriage words. */
const AR_MAHR = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:مهر|مهور|مهرها|مهرهن|مهركم|مهائر|أجور|نحلة|نحلتها)(?=$|${E})`);
const AR_SADAQ = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?صداق(?:ه|ها|هم|ك|كم|نا)?(?=$|${E})`, "g");
/** الوليمة — the wedding feast. */
const AR_WALIMA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:وليمة|ولائم|أولم|يولم|أولمت)(?:ة|ه|ها|هم|ك|كم|نا|ي|ت|تم|وا)?(?=$|${E})`);
/** الخطبة in the proposal sense — gated on a nearby marriage word. */
const AR_KHITBA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:خطبة|خطبها|يخطب|تخطب|خطيبة|مخطوبة)(?=$|${E})`, "g");
/** عرس/أعراس — the wedding itself; عِرْس in poetry can mean other things, kept strong (boundary-safe). */
const AR_URS = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:عرس|أعراس|عريسه|عروس|عروسه|عروسها|العروس)(?=$|${E})`);

/* ————— الأسرة — family, household members and children ————— */
/** أسرة/عائلة/عيال — the household as a unit; bare «أهل» stays out (too broad), «أهل بيته/أهليه» counts. */
const AR_USRA_NOUN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:أسرة|أسرهم|أسرته|عائلة|عائلته|عائلاتهم|عوائل|عيال|عياله|عيالهم|عيالة|أهل بيته|أهل بيت|أهليه|أهليها|أهليك|أهليها|رب الأسرة)(?=$|${E})`);
/** Children and offspring: plurals and possessed forms only — ابن/ولد alone are too broad (يا بني، ابن آدم). */
const AR_AWLAD = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:بنون|بنين|بنونا|بنيكم|بنيهم|بنات|بناته|بناتكم|بناتكن|بناتكم|أولاد|أولاده|أولادها|أولادهم|أولادك|أولادكم|أبناء|أبنائه|أبنائها|أبنائكم|ذرية|ذريته|ذريتها|ذريتهم|ذراري|ذرية طيبة|نسله|نسلهم|عقبه|عقبهم|فلذة|فلذات)(?=$|${E})`);
/** Parents as a pair — بر الوالدين is a family report. */
const AR_WALIDAYN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:والدين|والديه|والديها|والديك|والديكم|أبويه|أبويها|أبويك|أبويهم|بالوالدين|بأبوي)(?=$|${E})`);
/** الرضاعة — nursing and milk-kinship; الحاضنة — child custody. */
const AR_RADAA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:رضاعة|الرضاعة|رضاع|رضاعتهن|أرضع|ترضع|يرضعن|أرضعن|مرضعة|مرضعات|حاضنة|حواضن|رضيع)(?=$|${E})`);

/* ————— المساكن — dwellings and housing ————— */
/** مسكن/مساكن/سكنى — the dwelling nouns, always the home sense. */
const AR_MASKAN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:مسكن|مساكن|مسكنه|مسكنها|مسكنكم|مساكنهم|مساكنكم|سكنى|سكنا)(?=$|${E})`);
/** الحجرات — the apartments of the Prophet's wives and the dwelling sense generally. */
const AR_HUJURAT = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?حجرات(?:ه|ها|هم|كن|كم)?(?=$|${E})`);
/** Possessed homes: بيته/بيتها/بيتك/بيتهم/بيتنا/بيوتهم/بيوتكم/داره/دارهم/ديارهم/منزله/منازلهم —
 *  the possessive keeps Bayt al-Maqdis, bayt al-mal and the poetry bayt out; bare «بيت/دار/منزل»
 *  stays weak below. */
const AR_BAYT_POSSESSED = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:بيته|بيتها|بيتك|بيتكم|بيتكن|بيتهم|بيتنا|بيوت|بيوته|بيوتها|بيوتكم|بيوتكن|بيوتهم|بيوتنا|داره|دارها|دارك|دارهم|دارهن|ديار|ديارهم|دياركم|منزله|منزلها|منازلهم|منازلكم)(?=$|${E})`);
/** «لتسكنوا إليها»، «يسكن إليها»، «ساكنوهم» — the dwelling-together verb, marriage-tinged. */
const AR_SAKANA_VERB = new RegExp(`${BL}(?:[وبفس])?(?:ل?تسكنوا|يسكن|سكن|ساكن|ساكنوا|ساكنوهم|نسكن|أسكن)(?:وا|ون|ين|ه|ها|هم|ك|كم|نا|ي|ت|تم)?(?=$|${E})`);
/** Weak homes: bare سكن/دار/منزل/بيت count only beside household vocabulary (entering, leaving, permission, household). */
const AR_BAYT_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:سكن|دار|منزل|بيت)(?=$|${E})`, "g");
const BAYT_CONTEXT = /دخل|دخول|استأذن|أذن|خرج|سكن|أهل|نساء|حجرة|باب|سطح|فراش|ستر|عورة|تسكنوا|معيشت|زوج|ولد|ولد|خدم|خادم|طعام|رحمة/;
/** Never homes: the fixed compounds that carry بيت or دار without a dwelling sense. */
const BAYT_FALSE = /(?:بيت المقدس|بيت الله|بيت المال|بيت الحكمة|بيت الشعر|البيت الحرام|البيت العتيق|البيت المعمور|دار الإسلام|دار الحرب|دار الكفر|دار الهجرة|دار الخلافة|دار الآخرة|الدار الآخرة|دار السلام|دار الخلد|دار المقامة|دار الفساد|دار قوم|بيت شعر|دار الفكر|دار الكتاب|دار ابن|دار المعرفة|دار المعارف|دار إحياء|دار الجيل|دار الطلائع|دار صادر|دار الثقافة|دار الفتح|دار المنهاج|دار القبلة|دار الشروق|دار هجر|دار عالم|دار الرتاج|دار الوفاء|دار الكتب|دار الغرب|دار الشرق|مكتبة)/;

/* ————— المعاش — livelihood, provision and maintenance ————— */
/** معيشة/معاش — the way of living; قوت — subsistence. */
const AR_MAISHA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:معيشة|معيشتهم|معاش|معاشهم|قوت|أقوات|قوات|عيش|عيشتهم|معيشة ضنكا)(?=$|${E})`);
/** نفقة/إنفاق على الأهل — maintenance of the household. */
const AR_NAFAQA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:نفقة|نفقات|نفقتها|نفقتهن|نفقتكم|نفقتهم)(?=$|${E})`);
/** The spending verbs count only on household beneficiaries («أنفق عليك» is God addressing man). */
const AR_NAFAQA_VERB = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?(?:ينفق|أنفق|أنفقوا|ينفقون|الإنفاق|إنفاق)(?=$|${E})`, "g");
const NAFAQA_CONTEXT = /أهل|زوج|زوجة|ولد|عيال|نساء|امرأة|والدين|أولاد|بنين|بنات/;
/** كسوة/كساء — clothing someone as provision. */
const AR_KISWA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:كسوة|كسوتهم|كساهم|كساه|أكسو|كسواهم)(?=$|${E})`);
/** رزق family — provision; possessed and verb forms only («الرزق» alone stays out as too broad). */
const AR_RIZQ = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:رزقه|رزقها|رزقهم|رزقكم|رزقنا|رزقت|رزقهن|أرزاقهم|أرزاقكم|نرزقهم|نرزقكم|يرزقهم|يرزقكم|يرزقون|رزقناهم|ارزقوا|ارزقونا|سعة الرزق|وسع الرزق|ضيق الرزق)(?=$|${E})`);

/* ————— الحياة اليومية — daily life in and around the home ————— */
/** نوم/منام/قيلولة/سبات — sleep and rest. */
const AR_NAWM = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:نوم|نومهم|منام|منامهم|نائم|نيام|ينام|نام|نامت|قيلولة|وسن|سبات|سباتا)(?=$|${E})`);
/** ثياب/لباس/ملابس — everyday clothing (زينة the adornment of this world stays out). */
const AR_THIYAB = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:ثياب|ثيابه|ثيابها|ثيابكم|ثيابهم|لباس|لباسهم|لباسكم|ملابس|إزار|رداء|قباء|قميص)(?=$|${E})`);
/** خادم/خدمة — the servant in the household. */
const AR_KHADIM = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:خادم|خادمة|خدم|خدام|خدمه|خدمهم|يخدم|يخدمهم|يخدمه|خدمة|خدمتها|خدّام)(?=$|${E})`);
/** Household furniture and chores: فراش، وسادة، سرير، مرتفق، سفرة، قصعة، ثريد، إدام، طبخ، كنس. */
const AR_HOUSEHOLD = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:فراش|فراشه|فراشها|فراشكم|وسادة|وسائد|سرير|أسرة|مرتفق|مرافق|سفرة|قصعة|ثريد|إدام|إدامهم|طبخ|يطبخ|طبخت|كنس|تكنس|أثاث|رحى|يطحن|عجن|تعجن|حطب)(?=$|${E})`);

/* ————— العادات الاجتماعية — social customs, visiting, neighbours, gifts ————— */
/** الاستئذان — asking permission before entering, the great household custom. */
const AR_ISTIDHAN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:استئذان|الاستئذان|يستأذن|استأذن|استأذنوا|يستأذنون|استأذنكم|تستأذن)(?=$|${E})`);
/** جار/جيران — neighbours; ضيف/ضيافة/أضاف — the guest and hospitality. */
const AR_JAR_DAYF = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:جار|جاره|جارهم|جيران|جيرانهم|الجار|جاور|جارة|ضيف|ضيفه|ضيفان|ضيوف|ضيافة|أضاف|يضيف|أضافهم|إضافة الضيف|إكرام الضيف|مضيف|إقراء الضيف)(?=$|${E})`);
/** هدية/هدايا/تهادوا/أهدى — gift-giving. */
const AR_HADIYYA = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:هدية|هدايا|هديته|هديتها|تهادوا|أهدى|أهديت|يهدي لكم|مُهدى)(?=$|${E})`);
/** عادة/عادات/معروف/معاشرة — custom and good companionship; «بالمعروف» is the great social-norm marker. */
const AR_ADA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:عادة|عادات|عادتهم|عاداتهم|أعراف|معروف|معروفا|بالمعروف|معاشرة|عاشرة|عاشروا|عاشروهن|حسن المعاشرة|المعاشرة|حسن العشرة|عشرة)(?=$|${E})`);
/** مجلس/مجالس — the social gathering; السلام عليكم entering homes. */
const AR_MAJLIS = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:مجلس|مجالس|مجلسه|المجالس|سلام عليكم|سلموا على|سلّموا على|تحية|حيوا بتحية)(?=$|${E})`);

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `usra-browser` also admits it (see pick in export-api). */
export const USRA_EXCLUDE = new Set<string>([]);

/** topic for each signal name. */
const SIGNAL_TOPICS: Record<string, UsraTopic> = {
  nikah: "zawaj", zawaj_noun: "zawaj", tazawwaj: "zawaj", zawj_possessed: "zawaj",
  zawj_bare: "zawaj", mahr: "zawaj", sadaq: "zawaj", walima: "zawaj", khitba: "zawaj", urs: "zawaj",
  usra_noun: "usra", awlad: "usra", walidayn: "usra", radaa: "usra",
  maskan: "maskan", hujurat: "maskan", bayt_possessed: "maskan", sakana_verb: "maskan", bayt_bare: "maskan",
  maisha: "maisha", nafaqa: "maisha", kiswa: "maisha", rizq: "maisha",
  nawm: "yawmi", thiyab: "yawmi", khadim: "yawmi", household: "yawmi",
  istidhan: "adat", jar_dayf: "adat", hadiyya: "adat", ada: "adat", majlis: "adat",
};

/** The matched signal names for a passage, or [] when it is not about Muslim family life. */
export function usraSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // the «كتاب النكاح» chapter of a hadith collection without the passage itself being a family report.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || USRA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  /* zawaj */
  if (has(AR_NIKAH)) hits.add("nikah");
  if (has(AR_ZAWAJ_NOUN)) hits.add("zawaj_noun");
  if (has(AR_TAZAWWAJ)) hits.add("tazawwaj");
  if (has(AR_ZAWJ_POSSESSED)) hits.add("zawj_possessed");
  for (const m of raw.matchAll(AR_ZAWJ_BARE)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (ZAWJ_CONTEXT.test(window)) { hits.add("zawj_bare"); break; }
  }
  if (has(AR_MAHR)) hits.add("mahr");
  for (const m of raw.matchAll(AR_SADAQ)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (ZAWJ_CONTEXT.test(window)) { hits.add("sadaq"); break; }
  }
  if (has(AR_WALIMA)) hits.add("walima");
  for (const m of raw.matchAll(AR_KHITBA)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (KHITBA_CONTEXT.test(window)) { hits.add("khitba"); break; }
  }
  if (has(AR_URS)) hits.add("urs");

  /* usra */
  if (has(AR_USRA_NOUN)) hits.add("usra_noun");
  if (has(AR_AWLAD)) hits.add("awlad");
  if (has(AR_WALIDAYN)) hits.add("walidayn");
  if (has(AR_RADAA)) hits.add("radaa");

  /* maskan */
  if (has(AR_MASKAN)) hits.add("maskan");
  if (has(AR_HUJURAT)) hits.add("hujurat");
  if (!BAYT_FALSE.test(raw) && has(AR_BAYT_POSSESSED)) hits.add("bayt_possessed");
  if (has(AR_SAKANA_VERB)) hits.add("sakana_verb");
  if (!BAYT_FALSE.test(raw)) {
    for (const m of raw.matchAll(AR_BAYT_BARE)) {
      const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
      if (BAYT_CONTEXT.test(window)) { hits.add("bayt_bare"); break; }
    }
  }

  /* maisha */
  if (has(AR_MAISHA)) hits.add("maisha");
  if (has(AR_NAFAQA)) hits.add("nafaqa");
  for (const m of raw.matchAll(AR_NAFAQA_VERB)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (NAFAQA_CONTEXT.test(window)) { hits.add("nafaqa"); break; }
  }
  if (has(AR_KISWA)) hits.add("kiswa");
  if (has(AR_RIZQ)) hits.add("rizq");

  /* yawmi */
  if (has(AR_NAWM)) hits.add("nawm");
  if (has(AR_THIYAB)) hits.add("thiyab");
  if (has(AR_KHADIM)) hits.add("khadim");
  if (has(AR_HOUSEHOLD)) hits.add("household");

  /* adat */
  if (has(AR_ISTIDHAN)) hits.add("istidhan");
  if (has(AR_JAR_DAYF)) hits.add("jar_dayf");
  if (has(AR_HADIYYA)) hits.add("hadiyya");
  if (has(AR_ADA)) hits.add("ada");
  if (has(AR_MAJLIS)) hits.add("majlis");

  return [...hits];
}

/** True when the passage reports or mentions Muslim family life in any of the six families. */
export function isUsraPassage(n: Node): boolean {
  return usraSignalsOf(n).length > 0;
}

/** The family-life topics a passage touches: every family whose signals hit. */
export function usraTopicsOf(n: Node): UsraTopic[] {
  const topics = new Set<UsraTopic>();
  for (const s of usraSignalsOf(n)) {
    const t = SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  return [...topics];
}

/**
 * Which corpus an usra passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function usraCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): UsraCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `usra-<section>` when present, else `curated`. */
export function usraTagSection(n: Node): UsraSection {
  const tag = n.tags.find((t) => t.startsWith("usra-") && t !== USRA_TAG);
  const id = tag?.slice(5) ?? "curated";
  return (USRA_SECTIONS as readonly string[]).includes(id) ? (id as UsraSection) : "curated";
}
