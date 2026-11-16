// The Testaments Browser's shared reads (docs/plan/61-wasaya-browser.md): «متصفح وصايا الأنبياء والمرسلين
// والصالحين والأئمة والتابعين والخلفاء والصحابة قبل وفاتهم ومورثاتهم وأثرهم ومراقدهم» — which passage
// records speak of the last testaments and parting counsels of the prophets, the caliphs, the Companions,
// the Successors, the imams and the righteous, of their last hours, of what they left behind (estates and
// inheritance), of their relics and of their graves — and which corpus section each belongs to. Detection
// runs at build time over the compiled graph, so a mention in any harvested book — and in every book
// harvested later — appears without a tagging step. Curated records join through the `wasaya-browser` tag.
//
// Two detection paths, because the two kinds of text need different care:
//  1. The Qur'an: an explicit, reviewed table of verses (WASAYA_QURAN_REFS). The verse text is frozen and
//     never searched by vocabulary: a verse is in the browser because a person decided it carries a
//     testament, a ruling on bequest and inheritance, a relic or a death and burial.
//  2. Every other passage (hadith, seerah, tafsir, history, biography, zuhd): a guarded lexicon over the
//     passage's own text, search text, label and summary, folded (vowel marks dropped, alef forms joined).
//     Bare common words never match alone: «القبر» is also the trial of the grave, «ترك» any leaving,
//     «الأثر» any report, «عهد» any covenant. The lexicon uses phrases that carry the topic.
// WASAYA_EXCLUDE is the curated escape hatch for verified false positives; a passage can also join with a
// `wasaya-browser` tag when its wording carries no lexicon word.
import type { Node } from "./build-graph.js";

export const WASAYA_TAG = "wasaya-browser";
/** Page sections: the four passage corpora, then the curated records by whose testament it is or what it is. */
export const WASAYA_SECTIONS = ["quran", "sunnah", "seerah", "books", "prophets", "caliphs", "companions", "successors", "righteous", "legacy", "graves", "works"] as const;
export type WasayaSection = (typeof WASAYA_SECTIONS)[number];
export type WasayaCorpus = "quran" | "sunnah" | "seerah" | "books";

/** Topic chips carried by a record: detected families on passages, `wasaya-<topic>` tags on curated records. */
export const WASAYA_TOPICS = ["wasiyya", "ihtidar", "mirath", "athar", "marqad"] as const;
export type WasayaTopic = (typeof WASAYA_TOPICS)[number];

/**
 * [sura, first aya, last aya, topics] — every row read against the verse and the classical commentaries
 * (al-Tabari, Ibn Kathir, al-Qurtubi). The comment names why the verse is here, in the museum's own words;
 * the verse text itself is never typed. The page never states more than the comment does.
 */
export const WASAYA_QURAN_REFS: ReadonlyArray<readonly [number, number, number, readonly WasayaTopic[]]> = [
  // — the testaments of the prophets and the righteous
  [2, 132, 133, ["wasiyya", "ihtidar"]], // Ibrahim and Ya'qub enjoin the religion on their sons; Ya'qub's question to his sons as death came to him
  [31, 13, 19, ["wasiyya"]], // Luqman's counsels to his son
  [12, 67, 67, ["wasiyya"]], // Ya'qub's counsel to his sons before their journey
  [12, 101, 101, ["ihtidar"]], // Yusuf's prayer to be taken in submission and joined with the righteous
  [19, 31, 33, ["wasiyya", "ihtidar"]], // 'Isa: enjoined to prayer and alms for life; peace on the day of his death
  [19, 15, 15, ["ihtidar"]], // peace on Yahya the day he dies
  [42, 13, 13, ["wasiyya"]], // the religion enjoined on Nuh, Ibrahim, Musa and 'Isa
  [4, 131, 131, ["wasiyya"]], // the charge of God-consciousness laid on the earlier peoples of the Book and on this community
  [6, 151, 153, ["wasiyya"]], // the ten charges, each closed with the word of enjoining
  [3, 102, 102, ["wasiyya", "ihtidar"]], // the charge not to die except in submission (the wording of the prophets' testament in 2:132)
  [5, 3, 3, ["wasiyya"]], // the perfecting of the religion, revealed at the Farewell Pilgrimage
  [110, 1, 3, ["ihtidar"]], // read by Ibn 'Abbas and 'Umar as the announcement of the Prophet's approaching death (al-Bukhari)
  [2, 281, 281, ["ihtidar"]], // reported as among the last verses revealed
  [3, 144, 144, ["ihtidar"]], // the verse Abu Bakr recited on the day the Prophet died
  [39, 30, 31, ["ihtidar"]], // recited with it on that day
  [21, 34, 35, ["ihtidar"]], // no man before him was given unending life
  // — the bequest: its duty, its witnesses, its limits
  [2, 180, 182, ["wasiyya"]], // the bequest prescribed when death approaches; changing it; reconciling
  [2, 240, 240, ["wasiyya"]], // the bequest for widows
  [5, 106, 108, ["wasiyya", "ihtidar"]], // witnesses to a bequest when death comes on a journey
  [36, 50, 50, ["wasiyya", "ihtidar"]], // those the Cry overtakes cannot make a bequest
  [4, 9, 9, ["wasiyya"]], // those who would fear for weak offspring left behind
  // — what they left: inheritance among the prophets and the shares of the estate
  [27, 16, 16, ["mirath"]], // Sulayman inherited from Dawud
  [19, 5, 6, ["mirath"]], // Zakariyya asks for an heir who will inherit from him and from the house of Ya'qub
  [21, 89, 90, ["mirath"]], // Zakariyya's prayer not to be left alone
  [35, 32, 32, ["mirath"]], // the Book given as an inheritance
  [4, 7, 8, ["mirath"]], // a share for men and for women of what parents and kin leave
  [4, 11, 12, ["mirath", "wasiyya"]], // the shares, each "after a bequest or a debt"
  [4, 33, 33, ["mirath"]],
  [4, 176, 176, ["mirath"]],
  [8, 75, 75, ["mirath"]],
  [33, 6, 6, ["mirath"]],
  [89, 19, 19, ["mirath"]],
  // — relics and traces
  [2, 248, 248, ["athar"]], // the Ark holding what the house of Musa and the house of Harun left
  [12, 93, 96, ["athar"]], // Yusuf's shirt sent to his father
  [2, 125, 125, ["athar"]], // the Station of Ibrahim
  [3, 96, 97, ["athar"]], // the House and the Station of Ibrahim among its signs
  [36, 12, 12, ["athar"]], // what they sent ahead and their traces are written
  [40, 21, 21, ["athar"]], // the traces of earlier peoples in the land
  [40, 82, 82, ["athar"]],
  [30, 9, 9, ["athar"]],
  // — death, burial and the resting place
  [5, 31, 31, ["marqad"]], // the raven that showed how to bury
  [80, 21, 21, ["marqad"]], // death and the grave
  [18, 21, 21, ["marqad"]], // the dispute over what to build at the Sleepers' resting place
  [9, 84, 84, ["marqad"]], // standing at a grave
  [36, 51, 52, ["marqad"]], // the rising from the resting place
  [34, 14, 14, ["ihtidar", "marqad"]], // the death of Sulayman
  [20, 55, 55, ["marqad"]], // from the earth, back into it, out of it again
  [77, 25, 26, ["marqad"]], // the earth holding the living and the dead
  [102, 1, 2, ["marqad"]], // until the graves are visited
  [35, 22, 22, ["marqad"]],
  [60, 13, 13, ["marqad"]],
  [22, 7, 7, ["marqad"]],
  [82, 4, 4, ["marqad"]],
  [100, 9, 9, ["marqad"]],
  [3, 185, 185, ["ihtidar"]], // every soul tastes death
  [2, 259, 259, ["ihtidar", "athar"]], // the man caused to die a hundred years, his food and his donkey a sign
  [7, 150, 150, ["wasiyya"]], // Musa to Harun: how he had deputised for him in his absence
  [7, 142, 142, ["wasiyya"]], // Musa's charge to Harun before the appointed time
];

/** Topic families of a Qur'an verse from the reviewed table. */
export function wasayaQuranTopics(sura: unknown, aya: unknown): WasayaTopic[] {
  const s = Number(sura), a = Number(aya);
  if (!s || !a) return [];
  const out = new Set<WasayaTopic>();
  for (const [rs, from, to, topics] of WASAYA_QURAN_REFS) if (rs === s && a >= from && a <= to) for (const t of topics) out.add(t);
  return [...out];
}

/** One spelling for matching: vowel marks, Qur'anic marks and tatweel dropped, alef forms joined, final ya and ta marbuta folded. */
export const wasayaFold = (s: string): string =>
  s.normalize("NFC").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ");

// ---------- lexicon for everything that is not the Qur'an, written in the folded spelling.
// B opens a word (an optional one- or two-letter prefix, an optional article); E closes it.
const B = "(?<![ء-ي])[وفبلك]{0,2}(?:ال)?";
const E = "(?![ء-ي])";
const re = (...alts: string[]) => new RegExp(alts.join("|"));
/** The people whose graves, estates and relics the browser follows, as the books name them. */
const WHO = "(?:النبي|رسول الله|نبي الله|ابي بكر|ابو بكر|الصديق|عمر|عثمان|علي بن ابي طالب|فاطمه|عائشه|خديجه|حمزه|الحسن|الحسين|ابراهيم|الخليل|موسي|هارون|يوسف|يعقوب|ادم|نوح|هود|صالح|داود|سليمان|يحيي|زكريا|يونس|ايوب|دانيال|الصحابه|الانبياء|الشهداء|ابي ايوب|خالد|معاذ|بلال|سلمان|ابي عبيده|سعد|ابن عباس|ابن عمر|ابن مسعود|ابي الدرداء|ابي ذر|ابي هريره|الشافعي|مالك|احمد|ابي حنيفه|البخاري)";
/** Testaments and parting counsels. «خصوصية» and «وصيف» do not match: the word must open at B. */
const AR_WASIYYA = re(
  `${B}وصي[هت]${E}`, `${B}وصيت[هيكن]${E}`, `${B}وصيت(?:ها|هم|هما|نا|كم)${E}`, `${B}وصايا${E}`, `${B}وصاي[اه]${E}`,
  `(?<![ء-ي])[وف]?اوصي${E}`, `(?<![ء-ي])[وف]?اوصا(?:ني|نا|ه|ها|هم|ك|كم)${E}`, `(?<![ء-ي])[وف]?اوصي(?:ك|كم|كما|ه|هم|ت)${E}`,
  `(?<![ء-ي])[وف]?(?:ي|ت|ن)وصي${E}`, `(?<![ء-ي])[وف]?اوصني${E}`, `(?<![ء-ي])[وف]?اوصنا${E}`, `استوصوا`, `(?<![ء-ي])[وف]?وصا(?:ه|هم|ني|نا|كم)${E}`,
  `عهد (?:الي|الينا|اليه|اليهم) (?:رسول الله|النبي|خليلي|ابو بكر|عمر)`, `اخر ما (?:تكلم|عهد|اوصي|قال|سمعت)`, `اخر (?:كلامه|كلام رسول|كلام النبي|عهده|وصيته)`,
  `خطبه الوداع`, `خطب(?:نا|هم)? [ء-ي ]{0,30}حجه الوداع`, `لعلي لا القاكم بعد عامي`, `ليبلغ الشاهد`, `تركت فيكم`, `استنصت الناس`, `استخلف (?:عمر|عثمان|ابا بكر|عليا)`, `جعلها شوري`, `اهل الشوري`, `كتب (?:وصيته|عهده)`,
);
/** The last hours: the deathbed and the final illness. */
const AR_IHTIDAR = re(
  `حضرته الوفاه`, `حضرتها الوفاه`, `حضرتهم الوفاه`, `حضره الموت`, `حضرها الموت`, `حضرت [ء-ي ]{2,24} الوفاه`, `حضر [ء-ي ]{2,24} (?:الوفاه|الموت)`,
  `${B}احتضر${E}`, `${B}احتضاره${E}`, `${B}محتضر${E}`, `مرض موته`, `مرض الموت`, `مرضه الذي (?:مات|توفي|قبض) فيه`, `وجعه الذي (?:مات|توفي|قبض) فيه`, `شكواه الذي (?:مات|توفي|قبض) فيه`,
  `عند موته`, `عند وفاته`, `قبل موته ب`, `قبل وفاته`, `قبل ان يموت ب`, `لما نزل به الموت`, `نزل برسول الله`, `لما ثقل (?:رسول الله|النبي|ابو بكر|عمر)`, `لما طعن عمر`, `حين طعن`,
  `في سياقه الموت`, `سكرات الموت`, `الرفيق الاعلي`, `وفاه (?:النبي|رسول الله|ابي بكر|عمر|عثمان|علي)`, `مقتل (?:عمر|عثمان|علي)`, `قبض رسول الله`, `توفي رسول الله`,
);
/** What they left: estates, heirs, the inheritance of the prophets. */
const AR_MIRATH = re(
  `لا نورث`, `ما تركنا صدقه`, `ما تركناه صدقه`, `ما تركنا فهو صدقه`, `لا يقتسم ورثتي`, `لا تقتسم ورثتي`, `ورثه الانبياء`, `الانبياء لم يورثوا`, `لم يورثوا دينارا`,
  `${B}ميراث(?:ه|ها|هما|ي|نا)? (?:من )?${WHO}`, `(?:تطلب|تسال|يطلبان|يلتمسان|سالت|ساله|سالاه) [ء-ي ]{0,24}ميراث(?:ه|ها|هما)`, `(?<![ء-ي])[وف]?ورث(?:ه|ها)? ${WHO}`, `${B}ورثتي${E}`, `${B}ترك(?:ه|ته)? ${WHO}${E}`, `(?<![ء-ي])[وف]?خلف (?:من الولد|من المال|دينارا|الف|مالا|تركه)`,
  `ما ترك (?:رسول الله|النبي) `, `ما ترك (?:عند موته|بعده) `, `لم يترك (?:دينارا|درهما|صفراء|شيئا الا)`, `ما ترك دينارا`, `مات وعليه دين`, `درعه مرهونه`, `ودرعه رهن`, `(?<![ء-ي])فدك${E}`, `سهمه (?:من|ب)خيبر`,
  `صدقه رسول الله`, `صدقات (?:النبي|رسول الله)`, `قضي دينه`, `اقضوا ديني`, `اقض عني ديني`, `الثلث والثلث كثير`, `لا وصيه لوارث`, `ان تذر ورثتك`,
);
/** Relics and belongings kept after them. */
const AR_ATHAR = re(
  `برده (?:النبي(?!ين)|رسول الله)`, `البرده النبويه`, `خاتم (?:النبي(?!ين)|رسول الله)`, `بئر اريس`, `سيف (?:النبي(?!ين)|رسول الله)`, `ذو الفقار`, `ذا الفقار`, `شعر (?:النبي(?!ين)|رسول الله)`, `من شعر (?:النبي(?!ين)|رسول الله)`, `شعرات`,
  `قدح (?:النبي(?!ين)|رسول الله)`, `نعل (?:النبي(?!ين)|رسول الله)`, `نعلا (?:النبي(?!ين)|رسول الله)`, `قضيب (?:النبي(?!ين)|رسول الله)`, `عنزه (?:النبي(?!ين)|رسول الله)`, `درع (?:النبي(?!ين)|رسول الله)`, `بغله (?:النبي(?!ين)|رسول الله)`, `(?<![ء-ي])دلدل${E}`,
  `اثار (?:النبي|رسول الله|الانبياء|الصالحين)`, `الاثار النبويه`, `يتبرك ب`, `تبركا ب`, `التبرك ب`, `جبه رسول الله`, `قميص رسول الله`, `ازار (?:النبي(?!ين)|رسول الله)`, `كساء ملبدا`, `منبر (?:النبي(?!ين)|رسول الله)`, `سلاح (?:النبي(?!ين)|رسول الله)`,
  `مقام ابراهيم`, `تابوت (?:موسي|بني اسرائيل|السكينه)`, `قميص يوسف`, `عصا موسي`, `خاتم سليمان`,
);
/** Graves, burial and resting places: a named person's grave or a burial, never the bare word. */
const AR_MARQAD = re(
  `قبر ${WHO}`, `قبور ${WHO}`, `${B}قبر(?:ه|ها|هما|ي)${E} (?:ب|في|عند|الي جنب|مع)`, `(?:علي|عند|الي|زار|زرت|اتي|في) قبر(?:ه|ها|هما)${E}`, `موضع قبر`, `حفر (?:له|لها|قبر)`,
  `(?<![ء-ي])[وف]?دفن(?:ت|وه|وها|اه)?${E} (?:ب|في|مع|عند|الي|ليلا|من)`, `ادفنوني`, `ادفنوه`, `ادفنيني`, `ادفني`, `يدفن (?:مع|في|ب|عند)`, `ان ادفن`, `ان يدفن`, `مدفون`, `${B}مدفن(?:ه|ها)?${E}`,
  `الحدوا لي`, `لحد له`, `لحدوا`, `اللحد لنا`, `${B}ضريح(?:ه|ها)?${E}`, `${B}مرقد(?:ه|ها)?${E}`, `${B}مراقد${E}`, `${B}مقبره${E}`, `${B}مقابر${E}`, `${B}تربت(?:ه|ها)${E}`,
  `(?<![ء-ي])[وفبل]{0,2}البقيع${E}`, `بقيع الغرقد`, `(?<![ء-ي])[وفب]{0,2}الحجون${E}`, `الحجره (?:النبويه|الشريفه)`, `حجره عائشه`, `دفن(?:وه|وا)? في بيت(?:ه|ها| عائشه)`, `زياره القبور`, `زوروا القبور`, `فزوروها`,
  `كفن(?:وني|وه|ه|ت)${E}`, `غسل(?:وه|ه|ته)${E} (?:علي|ابنه|امراته|اسماء)`, `صلي عليه (?:عمر|صهيب|ابو بكر|ابن عمر|علي|عثمان|ابو هريره|مروان)`, `وقبره (?:ب|في|يزار|معروف|ظاهر)`, `مشهد(?:ه|ها) (?:ب|معروف|يزار)`, `مشهد (?:معروف|يزار)`,
);

/** English fields: the museum's own translations name these plainly. */
const EN_WASIYYA = /\b(testament|last will|his will|her will|bequest|bequeathed (a third|his|her)|wasiyy?a|wasaya|parting counsel|last counsel|final counsel|farewell sermon|farewell pilgrimage|dying counsel|enjoined (his|her) sons?|shura council|named .{0,40} as (his )?successor)\b/i;
const EN_IHTIDAR = /\b(deathbed|death-bed|last illness|final illness|last words|dying words|as he lay dying|as death approached|when death came|hour of (his|her) death|the Highest Companion|was stabbed|his last days|her last days)\b/i;
const EN_MIRATH = /\b(we are not inherited|we (prophets )?leave no inheritance|inheritance (of|from) (the Prophet|the Messenger|the prophets|her father|his father)|(his|her|the Prophet'?s) estate|estate of|Fadak|left (neither|no|behind no) (dinar|dirham)|left behind (only|nothing)|his armou?r (was )?pawned|inherited (from )?(Dawud|David|the prophets))\b/i;
const EN_ATHAR = /\b(relics?|mantle of the Prophet|the Prophet'?s (mantle|cloak|ring|seal|sword|hair|sandals?|cup|staff|mule|armou?r|minbar)|Dhu al-Faqar|Station of Ibrahim|Maqam Ibrahim|tabarruk|Ark of the Covenant)\b/i;
const EN_MARQAD = /\b(buried (in|at|beside|next to|near|with|by|there|on)|was buried|burial of|(grave|tomb|shrine|mausoleum|resting[- ]place) of|(his|her|their) (tomb|shrine|mausoleum|resting[- ]place|burial)|al-Baqi'?|laid to rest|interred|visit(ing)? (the )?graves|shrouded (in|him|her))\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch, each
 * verified by reading the passage; empty until an audit flags one.
 */
export const WASAYA_EXCLUDE = new Set<string>([]);

/**
 * A passage written by one of the mining tools (run `<browser>-ocr-<n>` or `<browser>-hadithapi-<n>`): its label and
 * summary are that tool's own boilerplate naming its browser's topics, so only the quoted text is judged.
 */
const mined = (n: Node): boolean => /-(?:ocr|hadithapi)-\d+$/.test(String((n.data.provenance as { run?: string } | undefined)?.run ?? ""));
/** The Arabic text a passage is judged on, folded: matn and normalized search text, plus the Arabic label and summary of a hand-written record. */
const arabicOf = (n: Node): string =>
  wasayaFold((mined(n) ? [n.data.text, n.data.text_search] : [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar]).filter(Boolean).join(" "));
const englishOf = (n: Node): string =>
  mined(n) ? "" : [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** Per-topic lexicon for non-Qur'an passages: the Arabic pattern first, then the English one. */
const LEXICON: Record<WasayaTopic, [RegExp, RegExp]> = {
  wasiyya: [AR_WASIYYA, EN_WASIYYA],
  ihtidar: [AR_IHTIDAR, EN_IHTIDAR],
  mirath: [AR_MIRATH, EN_MIRATH],
  athar: [AR_ATHAR, EN_ATHAR],
  marqad: [AR_MARQAD, EN_MARQAD],
};

/** The words that made a text match, per topic. `ar` must already be folded with wasayaFold. */
export function wasayaMatchesOfText(ar: string, en = ""): Partial<Record<WasayaTopic, string[]>> {
  const out: Partial<Record<WasayaTopic, string[]>> = {};
  for (const t of WASAYA_TOPICS) {
    const hits: string[] = [];
    const [a, e] = LEXICON[t];
    const ma = ar.match(a); if (ma) hits.push(ma[0].trim());
    const me = en.match(e); if (me) hits.push(me[0]);
    if (hits.length) out[t] = hits;
  }
  return out;
}

/** The words that made a passage match, per topic (the audit prints them; the page never does). */
export function wasayaMatches(n: Node): Partial<Record<WasayaTopic, string[]>> {
  if (n.class !== "passage" || n.stub || n.data.work === "work/quran") return {};
  return wasayaMatchesOfText(arabicOf(n), englishOf(n));
}

/** The topic families a passage mentions. The Qur'an by the reviewed table, all else by the lexicon. */
export function wasayaTopicsOf(n: Node): WasayaTopic[] {
  if (n.class !== "passage" || n.stub || WASAYA_EXCLUDE.has(n.id)) return [];
  if (n.data.work === "work/quran") return wasayaQuranTopics(n.data.sura, n.data.aya);
  return Object.keys(wasayaMatches(n)) as WasayaTopic[];
}

/** True when the passage's own text mentions a testament, a deathbed, an estate, a relic or a grave. */
export function isWasayaPassage(n: Node): boolean {
  return wasayaTopicsOf(n).length > 0;
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith collections
 * (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and every other
 * harvested work. Works not yet harvested land in the right section by their genre the day
 * their passages arrive.
 */
export function wasayaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): WasayaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The curated sections a record may be filed under by tag. */
const CURATED: readonly WasayaSection[] = ["prophets", "caliphs", "companions", "successors", "righteous", "legacy", "graves", "works"];
/**
 * The section of a curated record: the first `wasaya-<section>` tag naming a curated section;
 * without one, by class — a place or a building is filed under graves, an object under legacy,
 * a work under works, everything else under the righteous.
 */
export function wasayaTagSection(n: Node): WasayaSection {
  for (const t of n.tags) {
    if (!t.startsWith("wasaya-") || t === WASAYA_TAG) continue;
    const id = t.slice(7) as WasayaSection;
    if (CURATED.includes(id)) return id;
  }
  if (n.class === "place" || n.class === "building") return "graves";
  if (n.class === "object") return "legacy";
  if (n.class === "work") return "works";
  return "righteous";
}

/** The topic chips of a curated record, from its `wasaya-<topic>` tags (section tags are not topics). */
export function wasayaTagTopics(n: Node): WasayaTopic[] {
  return n.tags
    .filter((t) => t.startsWith("wasaya-") && t !== WASAYA_TAG)
    .map((t) => t.slice(7))
    .filter((t): t is WasayaTopic => (WASAYA_TOPICS as readonly string[]).includes(t));
}
