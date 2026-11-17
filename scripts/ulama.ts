// The Ulama Browser's shared reads (docs/plan/70-ulama-browser.md): «متصفح المفكرون والعلماء والأدباء
// والمحدثون والكتاب» — which person records are thinkers, scholars, litterateurs, muhaddiths and writers
// (the founder's five categories plus all knowledge professions; poets excluded by decision), and which
// passage records mention them — in the Qur'an by a reviewed verse table, in every other corpus by
// canonical `mentions` edges and a guarded, reviewed name lexicon. Detection runs at build time over the
// compiled graph, so a scholar mentioned in a book harvested later appears without a tagging step.
// Curated records join through the `ulama-browser` tag.
//
// Two detection paths, because the two kinds of subject need different care:
//  1. The people themselves: a `person` record qualifies by `roles` (ULAMA_ROLES) or by an
//     `occupations[].job` in ULAMA_JOBS. Poets are out of scope (the poetry wing carries them).
//  2. The mentions: a `passage` qualifies by a `mentions` edge to a qualifying person (the canonical
//     edges the harvest pipelines write), by ULAMA_QURAN_REFS for the frozen Qur'an — verses naming a
//     learned figure (Luqman) or speaking of the people of knowledge as a class — or by ULAMA_NAMES, a
//     reviewed folded-spelling alternation of the well-known scholars' names. Single common names never
//     match alone: only compound or distinctive forms («ابن باز», «سيّد قطب», «أمين الخولي») are listed.
// ULAMA_EXCLUDE is the curated escape hatch for verified false positives; a passage can also join with
// an `ulama-browser` tag when its wording carries no detectable name.
import type { Node, Edge } from "./build-graph.js";

export const ULAMA_TAG = "ulama-browser";

/**
 * Page sections: the four passage corpora, then the five people categories, then curated records of
 * other classes (the umbrella concept, works about scholarship, screens of interviews).
 */
export const ULAMA_SECTIONS = [
  "quran", "sunnah", "seerah", "books",
  "ulama", "muhaddithun", "mufakkirun", "udaba", "kuttab",
  "curated",
] as const;
export type UlamaSection = (typeof ULAMA_SECTIONS)[number];
export type UlamaCorpus = "quran" | "sunnah" | "seerah" | "books";

/** Category chips carried by a person (several at once) or by a curated `ulama-<category>` tag. */
export const ULAMA_TOPICS = ["alim", "muhaddith", "mufakkir", "adib", "katib", "scientist"] as const;
export type UlamaTopic = (typeof ULAMA_TOPICS)[number];

/** Roles that make a person one of the people of knowledge and the pen (founder's scope, plan 70 §detector). */
export const ULAMA_ROLES = new Set([
  "scholar", "muhaddith", "jurist", "mufti", "qadi", "shaykh-al-islam",
  "theologian", "philosopher", "historian", "geographer", "writer", "teacher", "preacher",
  "scientist", "mathematician", "astronomer", "physician", "calligrapher",
]);

/** Occupation jobs that qualify equally: data/job/<id> records under the scholarship cluster. */
export const ULAMA_JOBS = new Set([
  "job/alim", "job/muhaddith", "job/adib", "job/katib", "job/faqih",
  "job/mufassir", "job/mufti", "job/historian", "job/qari",
]);

/** role/job → category chip. A person can hold several chips; the first in ULAMA_CATS order files his section. */
const ROLE_CATS: Record<string, UlamaTopic> = {
  scholar: "alim", jurist: "alim", mufti: "alim", qadi: "alim", "shaykh-al-islam": "alim",
  teacher: "alim", preacher: "alim",
  muhaddith: "muhaddith",
  theologian: "mufakkir", philosopher: "mufakkir",
  writer: "katib", historian: "katib", geographer: "katib",
  scientist: "scientist", mathematician: "scientist", astronomer: "scientist",
  physician: "scientist", calligrapher: "scientist",
};
const JOB_CATS: Record<string, UlamaTopic> = {
  "job/alim": "alim", "job/faqih": "alim", "job/mufassir": "alim", "job/mufti": "alim", "job/qari": "alim",
  "job/muhaddith": "muhaddith",
  "job/adib": "adib",
  "job/katib": "katib", "job/historian": "katib",
};
/** Category → people section (first matching category files the card; the rest stay as chips). */
const CAT_SECTION: Record<UlamaTopic, UlamaSection> = {
  alim: "ulama", muhaddith: "muhaddithun", mufakkir: "mufakkirun",
  adib: "udaba", katib: "kuttab", scientist: "mufakkirun",
};

/** True when a person record is one of the مفكرون والعلماء والأدباء والمحدثون والكتاب. */
export function isUlamaPerson(n: Node): boolean {
  if (n.class !== "person" || n.stub) return false;
  const roles = (n.data.roles as string[] | undefined) ?? [];
  if (roles.some((r) => ULAMA_ROLES.has(r))) return true;
  const occs = (n.data.occupations as { job?: string }[] | undefined) ?? [];
  return occs.some((o) => typeof o.job === "string" && ULAMA_JOBS.has(o.job));
}

/** Every category chip a qualifying person carries (roles first, then jobs, deduplicated). */
export function ulamaCategoriesOf(n: Node): UlamaTopic[] {
  const out = new Set<UlamaTopic>();
  for (const r of (n.data.roles as string[] | undefined) ?? []) { const c = ROLE_CATS[r]; if (c) out.add(c); }
  for (const o of (n.data.occupations as { job?: string }[] | undefined) ?? []) { const c = o.job ? JOB_CATS[o.job] : undefined; if (c) out.add(c); }
  return ULAMA_TOPICS.filter((t) => out.has(t));
}

/** Which people section a person files under: the first of his categories in ULAMA_TOPICS order. */
export function ulamaPersonSection(n: Node): UlamaSection {
  const cats = ulamaCategoriesOf(n);
  return cats.length ? CAT_SECTION[cats[0]] : "ulama";
}

/**
 * [sura, first aya, last aya, topics] — every row read against the verse and the classical commentaries
 * (al-Tabari, Ibn Kathir, al-Qurtubi). The Qur'an names no scholar after the prophets, so the table is in
 * two parts: the verses naming a learned figure — Luqman the sage — and the verses speaking of the
 * people of knowledge, the ulama, as a class; plus the verse of the pen and of writing that the adib and
 * the katib stand under, and the verse of asking the people of remembrance. The comment names why the
 * verse is here; the verse text itself is never typed.
 */
export const ULAMA_QURAN_REFS: ReadonlyArray<readonly [number, number, number, readonly UlamaTopic[]]> = [
  // — the people of knowledge as a class
  [35, 28, 28, ["alim"]], // «إنما يخشى الله من عباده العلماء» — the ulama named as those who most fear God
  [3, 18, 18, ["alim"]], // God, the angels and «أولو العلم» bear witness that there is no god but He
  [58, 11, 11, ["alim"]], // God raises the believers and «الذين أوتوا العلم» in degrees
  [39, 9, 9, ["alim"]], // «قل هل يستوي الذين يعلمون والذين لا يعلمون» — those who know and those who do not are not equal
  [20, 114, 114, ["alim"]], // «وقل رب زدني علما» — the prayer for increase in knowledge
  [29, 43, 43, ["alim"]], // the likenesses are grasped only by «العالمون»
  [22, 54, 54, ["alim"]], // «الذين أوتوا العلم» know the revelation is the truth from their Lord
  [34, 6, 6, ["alim"]], // those given knowledge see what was revealed as the truth that guides
  [30, 56, 56, ["alim"]], // «الذين أوتوا العلم والإيمان» on the Day of Resurrection
  [4, 162, 162, ["alim"]], // «الراسخون في العلم» among the believers of the scriptuaries
  [2, 269, 269, ["mufakkir"]], // wisdom given to whom God wills — «ومن يؤت الحكمة فقد أوتي خيرا كثيرا»
  [16, 43, 44, ["alim"]], // «فاسألوا أهل الذكر إن كنتم لا تعلمون» — ask the people of remembrance (repeated 21:7)
  [21, 7, 7, ["alim"]], // the same charge to ask the people of remembrance
  [12, 76, 76, ["alim"]], // «نرفع درجات من نشاء وفوق كل ذي علم عليم»
  // — the pen and the written word that the katib and the adib stand under
  [96, 4, 5, ["katib"]], // «الذي علم بالقلم، علم الإنسان ما لم يعلم» — the first revelation honours the pen
  [68, 1, 1, ["katib"]], // «ن والقلم وما يسطرون» — the oath by the pen and what they write
  [2, 282, 283, ["katib"]], // the verse of debt: «وليكتب بينكم كاتب بالعدل» — the scribe's office enjoined
  // — Luqman the sage, the one learned figure the Qur'an names to the community
  [31, 12, 19, ["mufakkir"]], // «ولقد آتينا لقمان الحكمة» and his ten counsels to his son — the Qur'an's sage
  [25, 63, 63, ["mufakkir"]], // servants of the Merciful who walk gently — read with Luqman's «واقصد في مشيك» (31:19)
];

/** The ulama topics a Qur'an passage carries (the reviewed table only — the frozen text is never searched). */
export function ulamaQuranTopics(sura: unknown, aya: unknown): UlamaTopic[] {
  const s = Number(sura), a = Number(aya);
  if (!s || !a) return [];
  const out = new Set<UlamaTopic>();
  for (const [rs, from, to, topics] of ULAMA_QURAN_REFS) if (rs === s && a >= from && a <= to) for (const t of topics) out.add(t);
  return [...out];
}

/** One spelling for matching: vowel marks, Qur'anic marks and tatweel dropped, alef forms joined, final ya and ta marbuta folded. */
export const ulamaFold = (s: string): string =>
  s.normalize("NFC").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ");

// ---------- the reviewed name lexicon, in the folded spelling. Only compound or distinctive forms are
// listed — «علي» or «الحسن» alone never match: a bare common name is not a mention of a scholar. Forms
// carry an optional one- or two-letter prefix and the optional article where a prefixed form is common.
const B = "(?<![ء-ي])[وفبلك]{0,2}(?:ال)?";
const E = "(?![ء-ي])";

/**
 * The well-known scholars' names as the books write them — the four imams, the muhaddiths, the exegetes
 * and historians, the thinkers and the scientists of the pen, the modern scholars the founder named.
 * Each alternation is distinctive: a single token that could be a common name («ابن», «علي», «احمد») is
 * never alone in the list. Additions go through review like the table above.
 */
const NAMES: string[] = [
  // the four imams and their circle
  "ابو حنيفه", "النعمان بن ثابت", "مالك بن انس", "امام مالك", "الشافعي", "محمد بن ادريس", "احمد بن حنبل", "ابن حنبل",
  "ابو يوسف", "محمد بن الحسن الشيباني", "الشيباني", "الليث بن سعد", "سفيان الثوري", "سفيان بن عيينه", "الاوزاعي",
  // the muhaddithun
  "البخاري", "مسلم بن الحجاج", "الترمذي", "ابو داود", "ابو داود السجستاني", "النسائي", "ابن ماجه", "الدارمي",
  "ابن خزيمه", "ابن حبان", "الحاكم النيسابوري", "البيهقي", "الطبراني", "عبد الرزاق", "مصعب ابن عبد الرزاق", "ابن ابي شيبه",
  "الدارقطني", "ابن الجارود", "البغوي", "ابن الاثير", "ابن حجر", "العسقلاني", "النووي", "الذهبي", "المنذري", "ابن القيم",
  "ابن قيم الجوزيه", "الحافظ بن حجر", "السيوطي", "جلال الدين السيوطي", "ابن كثير", "العيني", "القسطلاني", "ابن رجب",
  "زين الدين العراقي", "العراقي", "ابن الملقن", "شمس الدين السخاوي", "السخاوي", "السندي", "محمد بن اسماعيل",
  // exegetes, historians, genealogists
  "الطبري", "ابن جرير", "محمد بن جرير", "الزمخشري", "القرطبي", "ابو عبد الله القرطبي", "الرازي", "فخر الدين الرازي",
  "النسفي", "البيضاوي", "ابن عطيه", "ابن عاشور", "الطاهر بن عاشور", "السدي", "مقاتل بن سليمان", "وهب بن منبه", "كعب الاحبار",
  "ابن اسحاق", "محمد بن اسحاق", "ابن هشام", "الواقدي", "محمد بن عمر الواقدي", "ابن سعد", "البلاذري", "اليعقوبي", "الطبري المؤرخ",
  "ابن الاثير الجزري", "عز الدين بن الاثير", "ابن خلدون", "عبد الرحمن بن خلدون", "المسعودي", "الخطيب البغدادي", "ابن عساكر",
  "ياقوت الحموي", "ابن الفوطي", "المقريزي", "ابن تغريرد", "ابن اياس", "ابن بطوطه", "ابن جبير", "الهروي", "الادريسي",
  "ابن خلكان", "شمس الدين ابن خلكان", "ابن العديم", "ابن الابار", "ابن كثير الدمشقي", "صفدي", "الصفدي", "ابن شاكر الكتبي",
  "ابن تيميه", "تقي الدين بن تيميه", "ابن ناصر الدين", "السبكي", "تاج الدين السبكي", "ابن الصلاح", "الشهرستاني", "الاشعري",
  // thinkers, theologians, philosophers
  "الغزالي", "ابو حامد الغزالي", "حجه الاسلام", "ابن رشد", "ابن سينا", "الفارابي", "الكندي", "ابن باجه", "ابن طفيل",
  "الجاحظ", "عمرو بن بحر", "ابن الجوزي", "ابن الجوزيه", "عبد الرحمن بن الجوزي", "ابن عربي", "محيي الدين", "ابن عطاء الله",
  "القشيري", "الهجويري", "السهروردي", "شهاب الدين السهروردي", "الماوردي", "الجويني", "امام الحرمين", "الباقلاني",
  "واصل بن عطاء", "عمرو بن عبيد", "النظام", "الجبائي", "ابو الحسن الاشعري", "الماتريدي", "الطحاوي", "ابن حزم", "ابن حزم الظاهري",
  "حسن البصري", "الحسن البصري", "الحسن بن ابي الحسن", "ربيع الراي", "محمد بن الحنفيه",
  // grammar, language, adab, kuttab
  "سيبويه", "الخليل بن احمد", "الفراهيدي", "الكسائي", "الفراء", "ابو عبيده", "معمر بن المثني", "الاصمعي",
  "ابن قتيبه", "عبد الله بن مسلم بن قتيبه", "ابن دريد", "الازهري", "ابن فارس", "الجوهري", "ابن منظور", "الفيروزابادي",
  "ابن جني", "ثعلب", "المبرد", "ابن السكيت", "الزجاج", "الزجاجي", "ابن خلاويه", "السيرافي", "ابن عصفور",
  "ابن هشام النحوي", "جمال الدين بن هشام", "ابن مالك", "محمد بن مالك", "السيوطي النحوي", "العيني النحوي",
  "ابن المقفع", "عبد الله بن المقفع", "عبد الحميد بن يحيي", "عبد الحميد الكاتب", "التوحيدي", "ابو حيان التوحيدي",
  "المعري", "ابو العلاء المعري", "ابن عبد ربه", "ابن عبد البر", "ابن عبد البر النمري", "الثعالبي", "القلقشندي",
  "ابن النديم", "ابن خير الاشبيلي", "القفطي", "ابن ابي اصيبعه", "ابن الفرضي", "الحميري", "ابن بشكوال",
  "الدميري", "كمال الدين الدميري", "ابن قاضي شهبه", "ابن فهد المكي", "العسقلاني النساج", "ابن عابدين", "محمد امين ابن عابدين",
  "ابن قدامه", "موفق الدين", "النووي الفقيه", "ابن رشد الجد", "ابن العربي المالكي", "الخرشي", "الدسوقي", "الباجوري",
  // the scientists of the pen
  "الخوارزمي", "محمد بن موسي الخوارزمي", "ابن الهيثم", "الحسن بن الهيثم", "البيروني", "ابو الريحان البيروني",
  "الرازي", "ابو بكر الرازي", "ابن النفيس", "الزهراوي", "ابو القاسم الزهراوي", "ابن زهر", "ابن البيطار", "داود الانطاكي",
  "البتاني", "الفرغاني", "الصوفي", "عبد الرحمن الصوفي", "الطوسي", "نصير الدين الطوسي", "الخازن", "الجزري", "بديع الزمان الجزري",
  "الادريسي الجغراوي", "ابن مجيد", "احمد بن ماجد", "البروجردي", "المراغي", "ابطوغ المراغي", "علي قوشجي", "تقي الدين الراصد",
  "ابن يونس", "البيار", "البرجل", "الشاطبي", "ابو القاسم الشاطبي", "ابن الجزري", "الداني", "ابو عمرو الداني",
  // sahaba and tabi'un scholars
  "ابن عباس", "عبد الله بن عباس", "ابن مسعود", "عبد الله بن مسعود", "ابن عمر", "عبد الله بن عمر", "زيد بن ثابت",
  "معاذ بن جبل", "ابي بن كعب", "ابي موسي الاشعري", "عائشه", "ام المؤمنين عائشه", "عروه بن الزبير", "سعيد بن المسيب",
  "القاسم بن محمد", "سالم بن عبد الله", "نافع مولي ابن عمر", "مجاهد بن جبر", "عطاء بن ابي رباح", "طاوس", "طاوس بن كيسان",
  "محمد بن سيرين", "ابن شهاب الزهري", "الزهري", "قتاده", "قتاده بن دعامه", "ابراهيم النخعي", "الشعبي", "عامر الشعبي",
  "الزبير بن العوام", "سعد بن ابي وقاص", "ابو هريره", "انس بن مالك", "جابر بن عبد الله", "ابو سعيد الخدري", // modern figures (the founder's list and the anchors around them)
  "يوسف القرضاوي", "القرضاوي", "محمد الغزالي", "الشيخ الغزالي", "محمد متولي الشعراوي", "الشعراوي", "محمد سيد طنطاوي", "سيد طنطاوي",
  "ابن باز", "عبد العزيز بن باز", "الالباني", "ناصر الدين الالباني", "ابن عثيمين", "محمد بن صالح العثيمين", "صالح الفوزان",
  "رمضان البوطي", "محمد سعيد البوطي", "محمد عبده", "جمال الدين الافغاني", "محمد رشيد رضا", "رشيد رضا", "سيد قطب",
  "ابو الاعلي المودودي", "المودودي", "عبد الحليم محمود", "احمد ديدات", "زغلول النجار", "عمر عبد الكافي", "طارق السويدان",
  "عمرو خالد", "مصطفي محمود", "يوسف زيدان", "خالد منتصر", "اسلام البحيري", "اسلام بحيري", "هبه قطب", "سعد الدين الهلالي",
  "حمدي عبد العال", "عباس محمود العقاد", "العقاد", "طه حسين", "عميد الادب", "احمد امين", "زكي مبارك", "عبد الرحمن بدوي",
  "مصطفي عبد الرازق", "محمد عبد الله دراز", "شلتوت", "محمود شلتوت", "عبد الوهاب خلاف", "علي عبد الواحد وافي", "محمد ابو زهره",
  "ابو زهره", "الخضري", "محمد الخضري", "سليم البهنساوي", "مصطفي السباعي", "سعيد حوي", "محمد قطب", "علي الطنطاوي", "انور الجندي",
];
/** One compiled pattern over the reviewed names, written folded; spaces inside a form match any spacing. */
const NAME_ALT = NAMES.map((w) => w.replace(/ /g, " ")).join("|");
export const ULAMA_NAMES = new RegExp(`${B}(?:${NAME_ALT})${E}`);

/** English-language companions of the name list, for the museum's own en summaries/translations. */
export const ULAMA_NAMES_EN = /\b(al-?Bukhari|Sahih Muslim|imam (Malik|Shafi'?i|Ahmad|Abu Hanifa)|Abu Hanifa|al-?Tabari|Ibn Kathir|al-?Ghazali|Ibn Taymiyy?a|Ibn (al-?)?Qayyim|Ibn Hajar|al-?Suyuti|al-?Dhahabi|al-?Nawawi|Ibn Khaldun|al-?Jahiz|Ibn al-?Jawzi|Sibawayh|al-?Khalil|al-?Asma'?i|Ibn Qutayba|Ibn Manzur|al-?Zamakhshari|al-?Qurtubi|Fakhr al-?Din al-?Razi|al-?Baydawi|Ibn (al-?)?'Arab|Ibn Hazm|al-?Mawardi|al-?Juwayni|al-?Baqillani|al-?Ash'?ari|al-?Maturidi|al-?Tahawi|al-?Khwarizmi|Ibn al-?Haytham|al-?Biruni|Ibn Sina|Avicenna|al-?Razi|al-?Zahrawi|Ibn (al-?)?Nafis|al-?Jazari|Ibn Battuta|Ibn Jubayr|al-?Idrisi|Ibn Khallikan|al-?Mas'?udi|al-?Khatib al-?Baghdadi|Ibn '?Asakir|Yaqut al-?Hamawi|al-?Maqrizi|al-?Waqidi|Ibn Ishaq|Ibn Hisham|al-?Baladhuri|Ibn Sa'?d|al-?Hasan al-?Basri|Ibn Sirin|al-?Zuhri|Qatada|Ibn '?Abbas|Ibn Mas'?ud|Zayd ibn Thabit|Mu'?adh ibn Jabal|Yusuf al-?Qaradawi|al-?Albani|Ibn Baz|Ibn '?Uthaymin|al-?Sha'?rawi|Muhammad '?Abduh|Jamal al-?Din al-?Afghani|Rashid Rida|Sayyid Qutb|Maududi|Mawdudi|Ahmed Deedat|Zaghloul (el[- ])?Naggar|Omar Abdelkafy|Tareq (al-?)?Suwaidan|Amr Khaled|Mustafa Mahmoud|Youssef Ziedan|Khaled Montaser|Islam Behery|Heba Kotb|Saad El-?Din (El-?)?Hilali|Hamdy Abdel ?Aal|al-?Aqqad|Taha Hussein|Taha Husayn)\b/i;

/**
 * Passage ids whose only hit is a verified false positive. Curated escape hatch, each verified by
 * reading the passage; empty until an audit flags one.
 */
export const ULAMA_EXCLUDE = new Set<string>([]);

/** A passage written by a mining tool: label/summary are the tool's boilerplate, so only quoted text is judged. */
const mined = (n: Node): boolean => /-(?:ocr|hadithapi|api)-\d+$/.test(String((n.data.provenance as { run?: string } | undefined)?.run ?? ""));
/** The folded Arabic a passage is judged on: matn and normalized search text, plus label/summary of hand-written records. */
const arabicOf = (n: Node): string =>
  ulamaFold((mined(n) ? [n.data.text, n.data.text_search] : [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar]).filter(Boolean).join(" "));
const englishOf = (n: Node): string =>
  mined(n) ? "" : [n.summary?.en, n.label?.en, (n.data.translations as { en?: { text?: string } } | undefined)?.en?.text].filter(Boolean).join(" ");

/** The scholar-name signals inside a text (ar must already be folded with ulamaFold). */
export function ulamaNameMatchesOfText(ar: string, en = ""): string[] {
  const hits: string[] = [];
  const ma = ar.match(ULAMA_NAMES); if (ma) hits.push(ma[0].trim());
  const me = en.match(ULAMA_NAMES_EN); if (me) hits.push(me[0]);
  return hits;
}

/** The name signals a non-Qur'an passage carries (the audit prints them; the page lists persons, not forms). */
export function ulamaNameMatches(n: Node): string[] {
  if (n.class !== "passage" || n.stub || n.data.work === "work/quran") return [];
  return ulamaNameMatchesOfText(arabicOf(n), englishOf(n));
}

/**
 * The qualifying persons a passage mentions through canonical `mentions` edges (passage → person).
 * `qualifying` is the set the caller built with isUlamaPerson — the edges carry only ids, not roles.
 */
export function ulamaMentionedPersons(passageId: string, edges: Edge[], qualifying: Set<string>): string[] {
  const out: string[] = [];
  for (const e of edges) {
    if (e.type !== "mentions" || e.inverse || e.from !== passageId) continue;
    if (qualifying.has(e.to)) out.push(e.to);
  }
  return out;
}

/** True when the passage mentions a scholar — by edge, by Qur'an table, or by the reviewed name lexicon. */
export function isUlamaPassage(n: Node, mentionedPersons?: string[]): boolean {
  if (n.class !== "passage" || n.stub || ULAMA_EXCLUDE.has(n.id)) return false;
  if (n.data.work === "work/quran") return ulamaQuranTopics(n.data.sura, n.data.aya).length > 0;
  return (mentionedPersons?.length ?? 0) > 0 || ulamaNameMatches(n).length > 0;
}

/** Which corpus a passage belongs to, from its work (same rule as the sibling browsers). */
export function ulamaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): UlamaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

const CURATED: readonly string[] = ["curated", "ulama", "muhaddithun", "mufakkirun", "udaba", "kuttab"];

/** Which section a curated (tagged, non-passage) record files under — `ulama-<section>` tag, else its class. */
export function ulamaTagSection(n: Node): UlamaSection {
  for (const t of n.tags) {
    if (!t.startsWith("ulama-") || t === ULAMA_TAG) continue;
    const id = t.slice(6) as UlamaSection;
    if (CURATED.includes(id) && (ULAMA_SECTIONS as readonly string[]).includes(id)) return id;
  }
  if (n.class === "person") return ulamaPersonSection(n);
  return "curated";
}

/** The `ulama-<topic>` category tags a curated record carries. */
export function ulamaTagTopics(n: Node): UlamaTopic[] {
  return n.tags
    .filter((t) => t.startsWith("ulama-") && t !== ULAMA_TAG)
    .map((t) => t.slice(6))
    .filter((t): t is UlamaTopic => (ULAMA_TOPICS as readonly string[]).includes(t));
}
