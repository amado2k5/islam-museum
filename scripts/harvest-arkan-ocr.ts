/**
 * Harvest the passages that name the pillars of Islam, the pillars of faith, the branches of
 * faith and the traits of the believer from books already OCR'd on the harvest drive (Apple
 * Vision text in <book>/<scan>/pages.json) into data/passage/, for the Pillars and Branches of
 * Faith Browser (docs/plan/61-arkan-browser.md): the seerah books, the biographies and reports
 * of the Companions and the Successors, the books of faith and creed, the hadith commentaries,
 * the books of renunciation and manners, and the histories. No PDF, OCR text or page image
 * enters git — only an excerpt of at most 40 words per page, cited to the work and the scan
 * page (docs/sources-policy.md).
 *
 * A page is a candidate when the browser's own detector (scripts/arkan.ts) fires on a 40-word
 * window of it with at least one strong signal; the densest pages of each book are kept, up to
 * the book's cap, never two neighbouring pages. Qur'an text is never typed: a window is skipped
 * when it carries a quotation marker or shares any four consecutive words with a verse (checked
 * against the frozen Tanzil text in data/passage/quran-*.yaml). Windows the OCR garbled are
 * skipped too (too many stray letters, or fewer than about eight words in ten known from the museum's
 * own Qur'an and hadith passages), and so are windows with an honorific formula the cleaner
 * cannot cut, and pages another harvest already excerpted. A book whose work or source record is
 * missing is skipped, so a book harvested later is added by one line in BOOKS.
 *
 * Usage: npx tsx scripts/harvest-arkan-ocr.ts <harvest books dir> [--dry] [--only <prefix>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { arkanFold, arkanHitsOfText, ARKAN_TOPICS } from "./arkan.js";
import { ARKAN_ANCHOR, clean, HONORIFIC_LEFT, q, SAYS, uniq } from "./arkan-harvest-lib.js";

const ROOT = process.argv[2];
const DRY = process.argv.includes("--dry");
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const OUT_DIR = "data/passage";
if (!ROOT || ROOT.startsWith("--")) throw new Error("usage: harvest-arkan-ocr.ts <books dir> [--dry] [--only <prefix>]");

/** `scan` limits a book to one scan folder when the source record describes one volume only. */
interface Book { dir: string; scan?: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string; cap: number }
const BOOKS: Book[] = [
  // the books of faith and creed
  { dir: "hadith/shuab-iman", scan: "Shiab_Al_Iman", prefix: "shuab-iman-v10", work: "work/shuab-al-iman", source: "source/shuab-iman-dar-al-rushd-v10", ar: "شعب الإيمان للبيهقي، الجزء العاشر", en: "al-Bayhaqi's Shu'ab al-Iman, vol. 10", ur: "شعب الایمان، بیہقی، جلد 10", cap: 40 },
  { dir: "hadith/shuab-iman", scan: "shiman", prefix: "shuab-iman-v2", work: "work/shuab-al-iman", source: "source/shuab-iman-dki-zaghlul-v2", ar: "شعب الإيمان للبيهقي، الجزء الثاني", en: "al-Bayhaqi's Shu'ab al-Iman, vol. 2", ur: "شعب الایمان، بیہقی، جلد 2", cap: 40 },
  { dir: "aqeedah/kitab-iman-ibn-taymiyya", prefix: "kitab-iman-ibn-taymiyya", work: "work/kitab-al-iman-ibn-taymiyya", source: "source/kitab-iman-ibn-taymiyya", ar: "كتاب الإيمان لابن تيمية", en: "Ibn Taymiyya's Kitab al-Iman", ur: "کتاب الایمان، ابن تیمیہ", cap: 40 },
  { dir: "aqeedah/sharh-tahawiyya", prefix: "sharh-tahawiyya", work: "work/sharh-aqida-tahawiyya", source: "source/sharh-tahawiyya-ibn-abi-al-izz", ar: "شرح العقيدة الطحاوية لابن أبي العز", en: "Ibn Abi al-'Izz's commentary on the Tahawi creed", ur: "شرح عقیدہ طحاویہ، ابن ابی العز", cap: 40 },
  { dir: "sunnah-aqeedah/ibana-ibn-batta", prefix: "ibana-ibn-batta", work: "work/ibana-al-kubra-ibn-batta", source: "source/ibana-kubra-muti-iman", ar: "الإبانة الكبرى لابن بطة، كتاب الإيمان", en: "Ibn Batta's al-Ibana al-Kubra, the Book of Faith", ur: "الابانۃ الکبریٰ، ابن بطہ، کتاب الایمان", cap: 40 },
  { dir: "sunnah-aqeedah/sharh-usul-itiqad", prefix: "sharh-usul-itiqad", work: "work/sharh-usul-itiqad-lalakai", source: "source/sharh-usul-itiqad-basira", ar: "شرح أصول اعتقاد أهل السنة للالكائي", en: "al-Lalaka'i's Sharh Usul I'tiqad Ahl al-Sunna", ur: "شرح اصول اعتقاد اہل السنہ، لالکائی", cap: 30 },
  { dir: "sunnah-aqeedah/kitab-sunnah-khallal", prefix: "sunna-khallal", work: "work/kitab-al-sunnah-khallal", source: "source/kitab-al-sunna-khallal-al-hamdan-2018", ar: "كتاب السنة للخلال", en: "al-Khallal's Kitab al-Sunna", ur: "کتاب السنہ، خلال", cap: 25 },
  { dir: "sunnah-aqeedah/kitab-sunnah-abdullah-ahmad", prefix: "sunna-abdullah-ahmad", work: "work/kitab-al-sunnah-abdullah-ibn-ahmad", source: "source/sunna-abdullah-ahmad-hamdan-1441", ar: "كتاب السنة لعبد الله بن أحمد", en: "'Abd Allah ibn Ahmad's Kitab al-Sunna", ur: "کتاب السنہ، عبد اللہ بن احمد", cap: 25 },
  // the hadith commentaries and compilations
  { dir: "hadith/jami-ulum-hikam", prefix: "jami-ulum-hikam", work: "work/jami-ulum-hikam", source: "source/ibn-rajab-jami-ulum-hikam", ar: "جامع العلوم والحكم لابن رجب", en: "Ibn Rajab's Jami' al-'Ulum wa-l-Hikam", ur: "جامع العلوم والحکم، ابن رجب", cap: 50 },
  { dir: "hadith/fath-bari", prefix: "fath-bari", work: "work/fath-al-bari", source: "source/fath-al-bari", ar: "فتح الباري لابن حجر", en: "Ibn Hajar's Fath al-Bari", ur: "فتح الباری، ابن حجر", cap: 50 },
  { dir: "hadith/fath-bari-ibn-rajab", prefix: "fath-bari-ibn-rajab", work: "work/fath-al-bari-ibn-rajab", source: "source/fath-al-bari-ibn-rajab-1417", ar: "فتح الباري لابن رجب", en: "Ibn Rajab's Fath al-Bari", ur: "فتح الباری، ابن رجب", cap: 40 },
  { dir: "hadith/sharh-nawawi-muslim", prefix: "sharh-nawawi-muslim", work: "work/al-minhaj-sharh-sahih-muslim", source: "source/sharh-sahih-muslim-al-nawawi", ar: "شرح النووي على صحيح مسلم", en: "al-Nawawi's commentary on Sahih Muslim", ur: "شرح نووی بر صحیح مسلم", cap: 50 },
  { dir: "hadith/riyad-salihin", prefix: "riyad-salihin", work: "work/riyad-al-salihin", source: "source/riyad-al-salihin", ar: "رياض الصالحين للنووي", en: "al-Nawawi's Riyad al-Salihin", ur: "ریاض الصالحین، نووی", cap: 40 },
  { dir: "hadith/targhib-tarhib", prefix: "targhib-tarhib", work: "work/al-targhib-wa-al-tarhib-mundhiri", source: "source/targhib-tarhib-qayyima", ar: "الترغيب والترهيب للمنذري", en: "al-Mundhiri's al-Targhib wa-l-Tarhib", ur: "الترغیب والترہیب، منذری", cap: 40 },
  { dir: "hadith/adab-mufrad", prefix: "adab-mufrad", work: "work/al-adab-al-mufrad", source: "source/al-adab-al-mufrad", ar: "الأدب المفرد للبخاري", en: "al-Bukhari's al-Adab al-Mufrad", ur: "الادب المفرد، بخاری", cap: 30 },
  { dir: "hadith/mishkat-masabih", prefix: "mishkat-masabih", work: "work/mishkat-al-masabih", source: "source/mishkat-al-masabih", ar: "مشكاة المصابيح", en: "Mishkat al-Masabih", ur: "مشکاۃ المصابیح", cap: 40 },
  { dir: "hadith/sahih-ibn-hibban", prefix: "sahih-ibn-hibban", work: "work/sahih-ibn-hibban", source: "source/sahih-ibn-hibban", ar: "صحيح ابن حبان", en: "Sahih Ibn Hibban", ur: "صحیح ابن حبان", cap: 30 },
  { dir: "hadith/musannaf-abd-al-razzaq", prefix: "musannaf-abd-al-razzaq", work: "work/al-musannaf-abd-al-razzaq", source: "source/musannaf-abd-al-razzaq", ar: "مصنف عبد الرزاق", en: "the Musannaf of 'Abd al-Razzaq", ur: "مصنف عبد الرزاق", cap: 30 },
  { dir: "hadith/musannaf-ibn-abi-shayba", prefix: "musannaf-ibn-abi-shayba", work: "work/al-musannaf-ibn-abi-shayba", source: "source/al-musannaf-ibn-abi-shayba", ar: "مصنف ابن أبي شيبة", en: "the Musannaf of Ibn Abi Shayba", ur: "مصنف ابن ابی شیبہ", cap: 40 },
  // the seerah
  { dir: "seerah/zad-maad", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad", ar: "زاد المعاد لابن القيم", en: "Ibn al-Qayyim's Zad al-Ma'ad", ur: "زاد المعاد، ابن القیم", cap: 30 },
  { dir: "seerah/sira-ibn-hisham", prefix: "sira-ibn-hisham", work: "work/sira-ibn-ishaq-ibn-hisham", source: "source/ibn-hisham-sira", ar: "السيرة النبوية لابن هشام", en: "Ibn Hisham's Sira", ur: "سیرت ابن ہشام", cap: 30 },
  { dir: "seerah/maghazi-waqidi", prefix: "maghazi-waqidi", work: "work/kitab-al-maghazi", source: "source/al-waqidi-maghazi", ar: "المغازي للواقدي", en: "al-Waqidi's Maghazi", ur: "المغازی، واقدی", cap: 20 },
  { dir: "seerah/rawd-unuf", prefix: "rawd-unuf", work: "work/al-rawd-al-unuf", source: "source/al-rawd-al-unf", ar: "الروض الأنف للسهيلي", en: "al-Suhayli's al-Rawd al-Unuf", ur: "الروض الانف، سہیلی", cap: 20 },
  { dir: "seerah/subul-huda", prefix: "subul-huda", work: "work/subul-al-huda-wa-al-rashad", source: "source/subul-huda-salihi", ar: "سبل الهدى والرشاد للصالحي", en: "al-Salihi's Subul al-Huda wa-l-Rashad", ur: "سبل الہدیٰ والرشاد، صالحی", cap: 30 },
  { dir: "seerah/dalail-nubuwwa-bayhaqi", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi", ar: "دلائل النبوة للبيهقي", en: "al-Bayhaqi's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، بیہقی", cap: 20 },
  // the Companions, the Successors and the early ascetics
  { dir: "tabaqat/tabaqat-ibn-saad", prefix: "tabaqat-ibn-saad", work: "work/al-tabaqat-al-kubra-ibn-sad", source: "source/tabaqat-ibn-sad", ar: "الطبقات الكبرى لابن سعد", en: "Ibn Sa'd's al-Tabaqat al-Kubra", ur: "الطبقات الکبریٰ، ابن سعد", cap: 40 },
  { dir: "sahaba/hilyat-awliya", prefix: "sahaba-hilyat-awliya", work: "work/hilyat-al-awliya", source: "source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988", ar: "حلية الأولياء لأبي نعيم", en: "Abu Nu'aym's Hilyat al-Awliya'", ur: "حلیۃ الاولیاء، ابو نعیم", cap: 60 },
  { dir: "sahaba/safwat-safwa", prefix: "sahaba-safwat-safwa", work: "work/sifat-al-safwa", source: "source/sifat-al-safwa-tartusi-2012", ar: "صفة الصفوة لابن الجوزي", en: "Ibn al-Jawzi's Sifat al-Safwa", ur: "صفۃ الصفوہ، ابن الجوزی", cap: 40 },
  { dir: "sahaba/hayat-sahaba", prefix: "sahaba-hayat-sahaba", work: "work/hayat-al-sahaba", source: "source/hayat-al-sahaba-kandahlawi-sabbani", ar: "حياة الصحابة للكاندهلوي", en: "al-Kandahlawi's Hayat al-Sahaba", ur: "حیاۃ الصحابہ، کاندھلوی", cap: 40 },
  { dir: "sahaba/usd-ghaba", prefix: "sahaba-usd-ghaba", work: "work/usd-al-ghaba", source: "source/usd-al-ghaba", ar: "أسد الغابة لابن الأثير", en: "Ibn al-Athir's Usd al-Ghaba", ur: "اسد الغابہ، ابن الاثیر", cap: 25 },
  { dir: "sahaba/isaba", prefix: "sahaba-isaba", work: "work/al-isaba-fi-tamyiz-al-sahaba", source: "source/isaba", ar: "الإصابة لابن حجر", en: "Ibn Hajar's al-Isaba", ur: "الاصابہ، ابن حجر", cap: 25 },
  { dir: "sahaba/isti-ab", prefix: "sahaba-isti-ab", work: "work/al-istiab", source: "source/isti-ab-ibn-abd-al-barr", ar: "الاستيعاب لابن عبد البر", en: "Ibn 'Abd al-Barr's al-Isti'ab", ur: "الاستیعاب، ابن عبد البر", cap: 20 },
  { dir: "sahaba/siyar-alam-nubala", prefix: "siyar-alam-nubala", work: "work/siyar-alam-al-nubala", source: "source/siyar-alam-nubala", ar: "سير أعلام النبلاء للذهبي", en: "al-Dhahabi's Siyar A'lam al-Nubala'", ur: "سیر اعلام النبلاء، ذہبی", cap: 30 },
  { dir: "adab-zuhd/zuhd-ahmad", prefix: "zuhd-ahmad", work: "work/kitab-al-zuhd-ahmad-ibn-hanbal", source: "source/zuhd-ahmad-dkim-1983", ar: "الزهد لأحمد بن حنبل", en: "Ahmad ibn Hanbal's Kitab al-Zuhd", ur: "کتاب الزہد، احمد بن حنبل", cap: 40 },
  { dir: "adab-zuhd/zuhd-ibn-mubarak", prefix: "zuhd-ibn-mubarak", work: "work/kitab-al-zuhd-ibn-al-mubarak", source: "source/zuhd-ibn-mubarak-azami-scan", ar: "الزهد لابن المبارك", en: "Ibn al-Mubarak's Kitab al-Zuhd", ur: "کتاب الزہد، ابن المبارک", cap: 40 },
  { dir: "adab-zuhd/ihya-ulum-din", prefix: "ihya", work: "work/ihya-ulum-al-din", source: "source/ihya-shamela-dar-al-marifa", ar: "إحياء علوم الدين للغزالي", en: "al-Ghazali's Ihya' 'Ulum al-Din", ur: "احیاء علوم الدین، غزالی", cap: 40 },
  // the histories
  { dir: "tareekh/bidaya-nihaya", prefix: "bidaya-nihaya", work: "work/al-bidaya-wal-nihaya", source: "source/al-bidaya-wal-nihaya", ar: "البداية والنهاية لابن كثير", en: "Ibn Kathir's al-Bidaya wa-l-Nihaya", ur: "البدایہ والنہایہ، ابن کثیر", cap: 30 },
  { dir: "tareekh/tarikh-tabari", prefix: "tarikh-tabari", work: "work/tarikh-al-rusul-wa-al-muluk", source: "source/tarikh-al-tabari", ar: "تاريخ الطبري", en: "al-Tabari's History", ur: "تاریخ طبری", cap: 20 },
  { dir: "tareekh/tarikh-dimashq", prefix: "tarikh-dimashq", work: "work/tarikh-dimashq", source: "source/tarikh-dimashq-ibn-asakir-fikr-1995", ar: "تاريخ دمشق لابن عساكر", en: "Ibn 'Asakir's History of Damascus", ur: "تاریخ دمشق، ابن عساکر", cap: 30 },
  // fiqh and usul
  { dir: "fiqh/fiqh-mawsua-noor-doc", prefix: "mawsua-fiqhiyya", work: "work/al-mawsua-al-fiqhiyya-al-kuwaitiyya", source: "source/fiqh-mawsua-noor-doc", ar: "الموسوعة الفقهية الكويتية", en: "the Kuwaiti Encyclopaedia of Fiqh", ur: "موسوعہ فقہیہ کویتیہ", cap: 30 },
  { dir: "fiqh/fiqh-sunna", prefix: "fiqh-sunna", work: "work/fiqh-al-sunnah-sabiq", source: "source/sabiq-fiqh-al-sunnah", ar: "فقه السنة لسيد سابق", en: "Sayyid Sabiq's Fiqh al-Sunna", ur: "فقہ السنہ، سید سابق", cap: 20 },
  { dir: "usul/muwafaqat", prefix: "muwafaqat", work: "work/al-muwafaqat", source: "source/muwafaqat", ar: "الموافقات للشاطبي", en: "al-Shatibi's al-Muwafaqat", ur: "الموافقات، شاطبی", cap: 15 },
];

const QURAN_MARK = /[﴾﴿{}]|قوله تعالي|قوله تعالى|قال تعالي|قال تعالى|قال الله|عز وجل|قوله سبحانه|قول الله|الآية/;
/** Honorific formulas as the OCR misreads them: «وضى الله عنه»، «صلابن عليه ولم». Such a window is skipped. */
const LOOSE_HONORIFIC = /ض[يى] ?الل|الله عن(?:ه|ها|هما|هم)(?=$|[\s،.])|عليه و?لم(?=$|[\s،.])|صل[ايى]? ?[ء-ي]{0,4} عليه|سبحانه وتعال|رحم[ةه] الله/;
/** One spelling for the comparison with the Qur'an and the vocabulary: alef forms, final ya and ta marbuta folded. */
const norm = (w: string) => arkanFold(w).replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");
/** Every run of four consecutive words of the Qur'an, and the vocabulary of the museum's Qur'an and hadith passages. */
const QURAN_4GRAMS = new Set<string>();
const VOCAB = new Set<string>();
for (const f of readdirSync(OUT_DIR)) {
  const isQuran = /^quran-\d+-\d+\.yaml$/.test(f);
  if (!isQuran && !/^(?:bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah|muwatta|riyad|arbaun)-/.test(f)) continue;
  const raw = readFileSync(join(OUT_DIR, f), "utf8");
  const m = raw.match(isQuran ? /^text_search: "(.*)"$/m : /^text: "(.*)"$/m);
  if (!m) continue;
  const ws = m[1].split(/\s+/).map(norm).filter(Boolean);
  for (const w of ws) VOCAB.add(w);
  if (isQuran) for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
/** The testimony and the faith formula are verse wordings too; they are the runs an excerpt may share. */
const ALLOWED = new Set(["لا اله الا الله", "ان لا اله الا", "اله الا الله وان", "بالله واليوم الاخر", "يؤمن بالله واليوم الاخر", "تؤمن بالله واليوم الاخر", "كان يؤمن بالله واليوم", "بالله وملائكته وكتبه ورسله"].map((s) => s.split(" ").map(norm).join(" ")));
const known = (w: string) => VOCAB.has(w) || VOCAB.has(w.replace(/^[وفبلك]/, "")) || VOCAB.has(w.replace(/^[وفبلك]?ال/, "")) || VOCAB.has(w.replace(/^[وفبلك]?لل/, ""));
function quotesQuran(ws: string[]): boolean {
  for (let i = 0; i + 4 <= ws.length; i++) { const g = ws.slice(i, i + 4).join(" "); if (QURAN_4GRAMS.has(g) && !ALLOWED.has(g)) return true; }
  return false;
}

/** Clean an OCR page: footnote digits, Latin, brackets and line breaks go; honorific formulas go. */
function pageWords(text: string): string[] {
  return clean(text.replace(/[A-Za-z0-9٠-٩()\[\]«»"*#_=|/\\<>~^`]+/g, " ").replace(/\s+/g, " ")).split(" ").filter(Boolean);
}

interface Cand { vol: number; scan: string; page: number; text: string; keys: string[]; weight: number }

function bestWindow(words: string[]): { text: string; keys: string[]; weight: number } | null {
  let best: { text: string; keys: string[]; weight: number } | null = null;
  for (let start = 0; start < words.length; start += 8) {
    const slice = words.slice(start, start + 40);
    if (slice.length < 18) break;
    const text = slice.join(" ");
    const folded = arkanFold(text);
    if (QURAN_MARK.test(folded) || QURAN_MARK.test(text) || HONORIFIC_LEFT.test(folded)) continue;
    if (/[ٱۖ-ۭ]/.test(text)) continue; // Uthmani letters: a verse set in the page
    const ws = slice.map(norm).filter(Boolean);
    const stray = ws.filter((w) => w.length <= 1).length + (slice.length - ws.length);
    if (stray > slice.length * 0.08) continue;
    if (ws.filter(known).length < ws.length * 0.82) continue;
    if (LOOSE_HONORIFIC.test(folded)) continue;
    if (quotesQuran(ws)) continue;
    const hits = arkanHitsOfText(folded, true);
    if (!hits.length) continue;
    const keys = uniq(hits.map((h) => `${h.topic}:${h.signal}`));
    // the terms themselves weigh double: a window that says «أركان الإسلام» or «شعب الإيمان» outranks a saying alone
    const weight = keys.length + keys.filter((k) => /arkan-al-|:shuab$|:khisal$|:buniya$|:bid-wa-sabun$/.test(k)).length;
    if (!best || weight > best.weight) best = { text: (start > 0 ? "… " : "") + text + (start + 40 < words.length ? " …" : ""), keys, weight };
  }
  return best;
}

const pageFiles = readdirSync(OUT_DIR);
let total = 0;
const perTopic: Record<string, number> = {};
for (const book of BOOKS) {
  if (ONLY && book.prefix !== ONLY) continue;
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const base = join(ROOT, book.dir);
  if (!existsSync(base)) { console.error(`skip ${book.prefix}: ${base} missing`); continue; }
  const scans = readdirSync(base).filter((d) => existsSync(join(base, d, "pages.json")) && (!book.scan || d === book.scan)).sort();
  const cands: Cand[] = [];
  const seenText = new Set<string>();
  scans.forEach((scan, vi) => {
    let pages: { page: number; text?: string }[];
    try { pages = JSON.parse(readFileSync(join(base, scan, "pages.json"), "utf8")); } catch { return; }
    for (const p of pages) {
      if (!p.text || p.text.length < 200) continue;
      const w = bestWindow(pageWords(p.text));
      if (!w) continue;
      const key = w.text.split(" ").map(norm).filter(Boolean).slice(4, 16).join(" ");
      if (seenText.has(key)) continue; // the same edition scanned twice
      seenText.add(key);
      cands.push({ vol: vi + 1, scan, page: p.page, ...w });
    }
  });
  // densest pages first, then spread: never two neighbouring pages
  cands.sort((a, b) => b.weight - a.weight || a.vol - b.vol || a.page - b.page);
  const kept: Cand[] = [];
  for (const c of cands) {
    if (kept.length >= book.cap) break;
    if (kept.some((k) => k.vol === c.vol && Math.abs(k.page - c.page) <= 1)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.vol - b.vol || a.page - b.page);
  for (const c of kept) {
    const multi = scans.length > 1;
    const slug = `${book.prefix}-arkan-${multi ? `${c.vol}-` : ""}${c.page}`;
    const file = join(OUT_DIR, `${slug}.yaml`);
    if (existsSync(file)) continue;
    const pageTail = `-${multi ? `${c.vol}-` : ""}${c.page}.yaml`;
    if (pageFiles.some((f) => f.startsWith(`${book.prefix}-`) && f.endsWith(pageTail))) continue; // another harvest excerpted this page
    const topics = ARKAN_TOPICS.filter((t) => c.keys.some((k) => k.startsWith(`${t}:`)));
    const says = uniq(c.keys.map((k) => SAYS[k]).filter(Boolean).map((s) => s.join("\u0001"))).map((s) => s.split("\u0001"));
    const where = { ar: `${multi ? `المجلد المصوَّر ${c.vol}، ` : ""}ص ${c.page}`, en: `${multi ? `scan volume ${c.vol}, ` : ""}p. ${c.page}`, ur: `${multi ? `اسکین جلد ${c.vol}، ` : ""}ص ${c.page}` };
    const label = {
      ar: `${book.ar}، ${where.ar} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en}, ${where.en} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur}، ${where.ur} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `مقطع من ${book.ar}، ${where.ar}، يذكر ${says.map((s) => s[0]).join("، و")}؛ من النسخة المصورة المقروءة آليا، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر. يجمعه متصفح أركان الإسلام وأركان الإيمان وشعب الإيمان وخصال المؤمن.`,
      en: `An excerpt from ${book.en}, ${where.en}, that mentions ${says.map((s) => s[1]).join(", ")}; from the machine-read scan, quoted within forty words per the sources policy. The Pillars and Branches of Faith Browser lists it.`,
      ur: `${book.ur}، ${where.ur} کا اقتباس جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے؛ مشینی طور پر پڑھی گئی نقل سے، چالیس الفاظ کی حد میں۔ ارکانِ اسلام، ارکانِ ایمان، شعبِ ایمان اور مومن کی خصلتوں کا براؤزر اسے درج کرتا ہے۔`,
    };
    const src = `[${book.source}]`;
    const yaml = [
      `id: passage/${slug}`,
      `class: passage`,
      `unit: chapter`,
      `work: ${book.work}`,
      `ref: ${q(multi ? `${c.vol}:${c.page}` : String(c.page))}`,
      `label: { ar: ${q(label.ar)}, en: ${q(label.en)}, ur: ${q(label.ur)} }`,
      `text: ${q(c.text)}`,
      `summary:`,
      `  ar: ${q(summary.ar)}`,
      `  en: ${q(summary.en)}`,
      `  ur: ${q(summary.ur)}`,
      `relations:`,
      ...topics.map((t) => `  - { type: mentions, target: ${ARKAN_ANCHOR[t]}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`Apple Vision OCR of the scan ${book.dir}/${c.scan}, page ${c.page}; a window of at most 40 words chosen by the pillars and branches of faith detector (scripts/arkan.ts); OCR text not corrected`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "arkan-ocr-1" }`,
      `sources: ${src}`,
      `status: { review: published, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the OCR'd book; label and summary are the museum's own words; the excerpt is machine-read and not corrected" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    total++;
    for (const t of topics) perTopic[t] = (perTopic[t] ?? 0) + 1;
  }
  console.log(book.prefix, `${kept.length} kept of ${cands.length} candidate pages in ${scans.length} scan(s)`);
}
console.log(`${total} passages ${DRY ? "(dry run)" : "written"}`, perTopic);
