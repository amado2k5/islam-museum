// The Du'a Browser's shared reads (docs/plan/43-dua-browser.md): which passage records report or
// mention supplications (du'a), and which corpus section each belongs to. Detection runs at build
// time over the compiled graph, so a supplication in any harvested book — and in every book
// harvested later — appears without any tagging step. Curated records join through the
// `dua-browser` tag instead. Scope is supplication to God only: the word «دعاء» the noun, the
// formulas («اللهم»، «ربنا»، «يا رب»، «ربِ + follower»), the supplication verbs with a divine
// object, isti'adha and istighfar, and passages *about* supplication. Calling to false gods
// («ادعوا شركاءكم»، «يدعون من دون الله»), the da'wa sense of «دعوة/يدعو» (preaching, inviting),
// and tasbih formulas («سبحان الله»، «الحمد لله») are out of scope.
import type { Node } from "./build-graph.js";

export const DUA_TAG = "dua-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const DUA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type DuaSection = (typeof DUA_SECTIONS)[number];
export type DuaCorpus = Exclude<DuaSection, "curated">;
/** `formula` = the passage carries an actual supplication; `mention` = it is about supplication. */
export type DuaKind = "formula" | "mention";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

const AR_LAHUM = /اللهم/;
const AR_RABBANA = new RegExp(`${BL}و?ربنا(?=$|${E})`);
const AR_YA_RAB = new RegExp(`${BL}(?:يا|أيا)\\s+رب(?:ي|ه|ها|نا|هم|كن|كم|كما)?(?=$|${E})`);
const AR_FA_YA_QUL_RABBI = /فيقول\s+ربي(?=\s|$)/;
/** «ربِ/ربي» followed by a word that begins a supplication (whitelist below). */
const AR_RAB_VOC = new RegExp(`${BL}و?رب(?:ي)?\\s+(\\S+)`);

/**
 * Words that may follow the vocative «ربِ» in a supplication: attested Qur'anic and hadith
 * followers plus the common imperative and particle openings. Anything else («رب البيت»،
 * «رب القوم» in a story) is not treated as an address to God.
 */
const RAB_FOLLOWERS = new Set(
  `إني إن إنك إنهم إنهن اغفر اغفرنا اجعل اجعلني هب انصر انصرني انصرنا نجني نجنا نجيني بما
   أذنبت أرني أرنا اشرح ارحمهما ارحمه ارحمني ارحمنا أعوذ أنى أدخلني أنزلني أنظرني فأنظرني لترضى
   لا لولا قد زدني زدنا شقيا أوزعني تحييني قدمني ارجعون أصلح اهدني اهد سل اكتب احفظ اكفني أجرني تب
   تقبل بارك رزقني رزقنا ارفع اقبض أحي توفني بسط يسر قوي ثبت اعصم خلصني سلم آمن آتنا ارحمنا انظر
   كفني أعطني أعطنا مكني وفقني قربني باعدني عافني شفني ادن طهرني زك نم أيقظني اغنني أعزني احفظني
   احفظنا ارزقنا علمني الهمني بين فهمني ألق قيض سخر أنج خلص سلّط احكم اقض سجل اشفع جنّبنا صرف صل سلّم
   اكشف فرّج كف ثبّت أعنّا أوينا ارزق اغن اشفني اكف ارحم اغفرنا ارحمنا لك الحمد تزغ تضل تمكر
   تؤاخذ تحرم تبتل تسلب تكل تجعل تؤذ ترد تخرج تدخل تلبس تكشف تبعد تقرب تؤخر تقدم تزحزح تخفض تيسّر
   تعسر تبتلى تفتن تزل تهم تعذب تفتر تفنى تغفل تكسل تنساك تهمل تهون تهجر تدع تدعنا تدعني تقضي
   تقبل منك رحمك عفوك مغفرتك فضلک فضلَك غفرانك رحمتك بركةك بركاتك رحابك جنابك جوارك قربك قرباك
   جوارك جوارك جنّتك جناتك هداك هدايتك رشادك سوابك مرضاتك عجائبك`.split(/\s+/),
);

/**
 * Supplication verb morphology: optional clitic prefixes (و ف ب ل ك س), then an imperfect/imperative
 * marker (أ ا ي ت ن ل), then the دع stem, then a person/number suffix. «ادعى» (claimed), «دعوة»،
 * «دعاء»، «دعاة»، «مدعو»، «استدعى»، «تداعى» and «دعص» all fail the suffix-or-boundary check.
 */
const VERB_PREFIX = String.raw`(?:[وبفسلك])?(?:[أايتنل]{0,2})?`;
const DUA_VERB = String.raw`دع(?:وا|ون|ين|اه|اهن|اهما|اهم|هما|كما|كن|ها|هم|هن|نا|تم|تن|وه|ي|ت|ه|ا|و)?`;
const GOD_OBJECT = String.raw`الله|ربي|ربه|ربها|ربنا|رب العالمين|الرحمن|الرحيم|ربك|ربكم|ربكن|ربهم|إلها|معبود`;
/** Verb + divine object: «يدعو ربه»، «أدعو ربي»، «دعا ربنا»، «ادعوا الله»، «سأل الله». */
const AR_DUA_VERB_OBJ = new RegExp(`${BL}${VERB_PREFIX}${DUA_VERB}(?=$|${E})\\s+(?:${GOD_OBJECT})(?=$|${E})`);
/** «سأل الله/سأل ربه» — subject suffixes only; «فيسألهم ربهم» is God *asking them*, not a supplication. */
const AR_SAL_OBJ = new RegExp(`${BL}${VERB_PREFIX}(?:[أايتنل]{0,2})?سأل(?:ت|تم|تن|وا)?(?=$|${E})\\s+(?:${GOD_OBJECT})(?=$|${E})`);
/** Imperfect verb + benefactive pronoun: «يدعو له»، «تدعون لهم» — supplicating *for* someone. */
const AR_DUA_VERB_LI = new RegExp(`${BL}(?:[وبفسلك])?(?:[أايتن])دع(?:و|وا)(?=$|${E})\\s+ل(?:ه|ها|هم|هن|نا|ي|ك|كم|كن|كما)(?=$|${E})`);
/** Past «ودعا لي بالبركة» — supplicating for someone *with* blessing vocabulary (summons like «فدعا له بسوط» stay out). */
const AR_DUA_VERB_LI_PAST = new RegExp(`${BL}(?:[وبفسلك])?دعا(?=$|${E})\\s+ل(?:ي|نا|ك|كم|كن|كما|ه|ها|هم)(?=$|${E})\\s+ب(?=البركة|رحمة|فضل|عفو|غفران|هداية|بركة|رحاب|جناب|كلمات|الله|الرحمن)`);
/** «ادع لنا ربك» — the Banu Isra'il formula asking Moses to supplicate to his Lord for them. */
const AR_DUA_VERB_LI_RABB = new RegExp(`${BL}${VERB_PREFIX}ادع(?:وا|ي|ه|هم)?(?=$|${E})\\s+ل(?:نا|كم|ه|ها|هم|ي|ك|كن|كما)\\s+رب(?:ك|كم|ه|ها|هم|نا|ي)(?=$|${E})`);
/**
 * «يدعو ب…» — supplicating *with/by* words. The word after ب must be a supplication word
 * (a pronoun standing for the words, or blessing/forgiveness vocabulary); «دعا بماء»،
 * «دعا بالقدح»، «تدعون بعلا» and «دعي به» are summons or false-god calls, not supplication.
 */
const AR_DUA_VERB_BI = new RegExp(`${BL}${VERB_PREFIX}${DUA_VERB}(?=$|${E})\\s+ب(?=هؤلاء|ها|هما|هم|كن|البركة|الدعوات|دعوة|كلمات|سم|الله|الرحمن|الرحيم|ربي|ربنا|ربك|ربهم|فضل|رحمة|عفو|غفران|هداية|بركة|رحاب|جناب)`);
/** «ادعوني أستجب لكم» — God's command to invoke Him; unambiguous Form-IV imperative. */
const AR_DUA_ME_CALL = new RegExp(`${BL}(?:[وبفسلك])?(?:ادعوني|أدعوني)(?=$|${E})`);
/** «ادع على المشركين» — invoking *against* someone is still a supplication mention. */
const AR_DUA_ALA = new RegExp(`${BL}(?:[وبفسلك])?(?:[أايتنل]{0,2})?ادع(?:وا|ي|ه|هم)?(?=$|${E})\\s+على(?=$|${E}|\\s)`);
/** God speaking about being called/asked: «من يدعوني فأستجيب»، «إذا سألني عبدي»، «إذا دعان». */
const AR_GOD_SPEECH = new RegExp(`${BL}(?:من|إذا)\\s+(?:يسألني|يسألنا|سألني|سألتموني|دعاني|يدعوني|تدعوني|ندعوني|ادعوني|أدعوني|دعان|يدعان|تدعان)(?=$|${E})`);
/** Isti'adha verb family: أعوذ، نعوذ، تعوذ، يستعيذ، تستعيذ، استعيذوا، أعوذوا… and the و-less Form-X «استعذ/تستعذ/يستعذ». */
const AR_ISTIADHA_ANY = new RegExp(`${BL}${VERB_PREFIX}(?:عوذ|ستعيذ|ستعذ)(?:ه|ها|هم|كن|كم|ك|نا|ي|ت|تم|تن|وا|ون|ين|و|وه|هما)?(?=$|${E})`, "g");
/**
 * Refuge is supplication unless it is sought *in* a created being: «يعوذون برجال من الجن»
 * (people sheltering with jinn) is idolatrous refuge-seeking, not dua. «أعوذ من سوء القضاء»
 * with no explicit divine object still counts — the harm-objected-to is the context.
 */
const ISTIADHA_CREATURE = /ب(?:ال)?(?:رجال|جن|أصنام|أوثان|مخلوق|عبيد|شياطين|أحجار|شجر|أنبياء|ملائكة|شمس|قمر|نجوم)(?=$|[\s،؛ء-ي])/;
/** Istighfar verb family: أستغفر، نستغفر، يستغفر، استغفر، استغفروا… */
const AR_ISTIGHFAR = new RegExp(`${BL}${VERB_PREFIX}ستغفر(?:وا|ون|ين|ن|ه|ها|هم|كن|كم|ك|نا|ي|ت|تم|تن|و|وه|هما)?(?=$|${E})`);
/** Earnest supplication vocabulary: ابتهل، يتضرع، تضرعوا — mention-level. */
const AR_EARNEST = /ابتهل|يتضرع|تتضرع|يتضرعون|تضراعا|ابتهالا|ضراعة/;

/**
 * The noun «دعاء» with clitic prefixes and pronoun suffixes: الدعاء، بدعاء، فالدعاء، دعائه، دعاءكم…
 * A bare leading «ا» is NOT allowed as a prefix — that would make «ادعاء» ("a claim") a false hit;
 * «الادعاء» stays out because «دعاء» is then not at a boundary. Suffixes take up to three
 * Arabic letters ( pronoun sets like هم، كما، ك). «دعوات/ادعيه/أدعية» likewise.
 */
const AR_DUAA = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}دعاء[ء-ي]{0,3}(?=$|${E})`);
const AR_DUAWAT = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}(?:دعوات|ادعيه|أدعية|ادعية)[ء-ي]{0,3}(?=$|${E})`);
/** «دعوة/دعوات» gated: not the da'wa senses «دعوة إلى»، «دعوة من»، «دعوة تكذب». */
const AR_DAWWA = new RegExp(`${BL}(?:(?:ال)|[وبفسك]){0,3}(?:دعوة|دعوات)(?:ه|ها|هم|كن|ك|نا|ي|كم)?(?=$|${E})`);
/**
 * «داع يدعو» — "a supplicant supplicates": the indefinite active participle of dua.
 * Gated on a nearby answer-word («يستجاب»، «دعاء»، «لله») so the da'wa sense
 * «داع يدعو إلى هدى» (a caller to guidance) stays out.
 */
const AR_DAAI_YADU3 = new RegExp(`${BL}داع(?=$|${E})\\s+ي?دعو(?=$|${E})`, "g");
const DAAI_ANSWER = /يستجاب|يستجاب|استجيب|دعاء|بالله|لله|ربه|ربنا|اللهم|السماء/;
/** «حسبي الله ونعم الوكيل» — the prophets' formula of reliance, mention-level. */
const AR_HASBI = new RegExp(`${BL}حسب(?:ي|نا)(?=$|${E})\\s+(?:الله|ربي|ربنا|الله وحده)`);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `dua-browser` also admits it (see pick in export-api).
 */
export const DUA_EXCLUDE = new Set([
  // «فدعا بماء فأتبعه إياه» — he called for water, a mundane request, not a supplication.
  "passage/muwatta-1-164",
  // Pre-Islamic verse: «دعص» is not a دع verb at all.
  "passage/poem-muallaqat-tarafa-06",
  // Pre-Islamic boast poem: «دعي بني شجع لحرب محمد» is a call to arms, not supplication.
  "passage/poem-hassan-diwan-laqad-laan-al-rahman-jamaan-01",
  // «وقل داع ترد عليه دعوته» — the adhan's call to prayer, not supplication.
  "passage/muwatta-1-178",
]);

const FORMULA_SIGNALS = new Set([
  "lahum", "rabbana", "ya_rab", "rab_voc", "fayakulrabbi",
  "dua_verb_obj", "dua_ask", "dua_verb_li", "dua_verb_lipast", "dua_verb_lirabb", "dua_verb_bi",
  "isti'adha", "istighfar",
]);
const MENTION_SIGNALS = new Set(["duaa", "duawat", "dawwa", "daai", "hasbi", "earnest", "god_speech", "me_call", "dua_ala"]);

/** The matched signal names for a passage, or [] when it is not about supplication. */
export function duaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // the «كتاب الدعاء» chapter of a hadith collection without the passage itself being a supplication.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || DUA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);
  const search = (re: RegExp) => { const m = re.exec(raw); return m ? m[0] : null; };

  if (has(AR_LAHUM)) hits.add("lahum");
  if (has(AR_RABBANA)) hits.add("rabbana");
  if (has(AR_YA_RAB)) hits.add("ya_rab");
  if (has(AR_FA_YA_QUL_RABBI)) hits.add("fayakulrabbi");
  const voc = AR_RAB_VOC.exec(raw);
  if (voc) {
    const follower = voc[1].replace(/[^ء-يA-Za-z0-9 ]/g, "");
    // «هو ربي لا إله إلا هو» is a statement of creed, not an address: «لا» counts only before a verb.
    const afterLa = follower === "لا" ? raw.slice(voc.index! + voc[0].length).trimStart() : "";
    if (RAB_FOLLOWERS.has(follower) && !(follower === "لا" && /^لا\s+إله/.test(afterLa))) hits.add("rab_voc");
  }
  if (has(AR_GOD_SPEECH)) hits.add("god_speech");
  if (has(AR_DUA_VERB_OBJ)) hits.add("dua_verb_obj");
  if (has(AR_SAL_OBJ)) hits.add("dua_ask");
  if (has(AR_DUA_VERB_LI)) hits.add("dua_verb_li");
  if (has(AR_DUA_VERB_LI_PAST)) hits.add("dua_verb_lipast");
  if (has(AR_DUA_VERB_LI_RABB)) hits.add("dua_verb_lirabb");
  if (has(AR_DUA_VERB_BI)) hits.add("dua_verb_bi");
  for (const m of raw.matchAll(AR_ISTIADHA_ANY)) {
    const window = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (!ISTIADHA_CREATURE.test(window)) { hits.add("isti'adha"); break; }
  }
  if (has(AR_ISTIGHFAR)) hits.add("istighfar");
  if (has(AR_DUAA)) hits.add("duaa");
  if (has(AR_DUAWAT)) hits.add("duawat");
  for (const m of raw.matchAll(AR_DAAI_YADU3)) {
    const window = raw.slice(m.index!, m.index! + m[0].length + 80);
    if (DAAI_ANSWER.test(window)) { hits.add("daai"); break; }
  }
  if (has(AR_HASBI)) hits.add("hasbi");
  if (has(AR_EARNEST)) hits.add("earnest");
  if (has(AR_DUA_ME_CALL)) hits.add("me_call");
  if (has(AR_DUA_ALA)) hits.add("dua_ala");
  if (has(AR_DAWWA)) {
    let ok = false;
    for (const m of raw.matchAll(/دعوة|دعوات/g)) {
      const tail = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 12);
      if (!/^\s*(إلى|من|تكذب)/.test(tail)) { ok = true; break; }
    }
    if (ok) hits.add("dawwa");
  }
  return [...hits];
}

/** True when the passage reports or mentions a supplication. */
export function isDuaPassage(n: Node): boolean {
  return duaSignalsOf(n).length > 0;
}

/** `formula` when the passage carries an actual supplication, `mention` when it is only about one. */
export function duaKindOf(n: Node): DuaKind {
  const signals = duaSignalsOf(n);
  return signals.some((s) => FORMULA_SIGNALS.has(s)) ? "formula" : "mention";
}

/**
 * Which corpus a dua passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function duaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): DuaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `dua-<section>` when present, else `curated`. */
export function duaTagSection(n: Node): DuaSection {
  const tag = n.tags.find((t) => t.startsWith("dua-") && t !== DUA_TAG && !t.startsWith("dua-occ"));
  const id = tag?.slice(4) ?? "curated";
  return (DUA_SECTIONS as readonly string[]).includes(id) ? (id as DuaSection) : "curated";
}

/**
 * The occasions axis (founder request of 14 November 2026): the divisions of al-Nawawi's al-Adhkar, in the book's own
 * order, as read on al-Maktaba al-Shamila (book 1956; `screen` is the Shamila page where the division begins, and the
 * printed page is two higher). A curated record joins a division through the tag `dua-occ-<id>`; nothing is placed by
 * guesswork, and a division is listed only when it holds a record. `title` is al-Nawawi's heading, copied.
 */
export const DUA_OCCASIONS = [
  { id: "day", title: "أبواب", screen: 13 },
  { id: "quran", title: "كتاب تلاوة القرآن", screen: 99 },
  { id: "praise", title: "كتاب حمد الله تعالى", screen: 109 },
  { id: "blessing-on-the-prophet", title: "كتاب الصلاة على رسول الله", screen: 112 },
  { id: "passing-matters", title: "كتاب الأذكار والدعوات للأمور العارضات", screen: 117 },
  { id: "hardship", title: "أبواب الأذكار التي تقال في أوقات الشدة وعلى العاهات", screen: 119 },
  { id: "illness-and-death", title: "كتاب أذكار المرض والموت وما يتعلق بهما", screen: 130 },
  { id: "particular-prayers", title: "كتاب الأذكار في صلوات مخصوصة", screen: 167 },
  { id: "fasting", title: "كتاب أذكار الصيام", screen: 186 },
  { id: "hajj", title: "كتاب أذكار الحج", screen: 189 },
  { id: "jihad", title: "كتاب أذكار الجهاد", screen: 204 },
  { id: "travel", title: "كتاب أذكار المسافر", screen: 212 },
  { id: "food", title: "كتاب أذكار الأكل والشرب", screen: 226 },
  { id: "greeting", title: "كتاب السلام والاستئذان وتشميت العاطس وما يتعلق بها", screen: 239 },
  { id: "marriage", title: "كتاب أذكار النكاح وما يتعلق به", screen: 279 },
  { id: "names", title: "كتاب الأسماء", screen: 284 },
  { id: "miscellany", title: "كتاب الأذكار المتفرقة", screen: 295 },
  { id: "guarding-the-tongue", title: "كتاب حفظ اللسان", screen: 330 },
  { id: "comprehensive", title: "كتاب جامع الدعوات", screen: 385 },
  { id: "forgiveness", title: "كتاب الاستغفار", screen: 400 },
] as const;
export type DuaOccasion = (typeof DUA_OCCASIONS)[number]["id"];
const OCC_PREFIX = "dua-occ-";
/** The al-Adhkar division a record is filed under, from its `dua-occ-<id>` tag; null when it carries none. */
export function duaOccasionOf(n: Node): DuaOccasion | null {
  const t = n.tags.find((x) => x.startsWith(OCC_PREFIX));
  const id = t?.slice(OCC_PREFIX.length);
  return DUA_OCCASIONS.some((o) => o.id === id) ? (id as DuaOccasion) : null;
}
