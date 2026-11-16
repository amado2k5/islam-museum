/**
 * Harvest the passages that speak of the readings of the Qur'an, the seven ahruf, the readers,
 * the collection and the codices, the orthography (rasm), the dotting and vowel marks (naqt) and
 * the scripts (khatt) from books already OCR'd on the harvest drive (Apple Vision text in
 * <book>/<scan>/pages.json) into data/passage/, for the Qira'at, Rasm, Scripts and Dotting
 * Browser (docs/plan/60-qiraat-browser.md). Adapted from scripts/harvest-qiraat-ocr.ts with the
 * same safety rules. No PDF, OCR text or page image enters git: only an excerpt of at most 40
 * words per page, cited to the work and the scan page (docs/sources-policy.md).
 *
 * A page is a candidate when the browser's own detector (scripts/qiraat.ts) fires on a 40-word
 * window of it, and the hit is not a bare «مصحف» / «مصاحف» (or a bare «النقط») alone: a window
 * needs a non-codex topic, or two topics, or a stronger codex phrase. The densest pages of each
 * book are kept, up to the book's cap, never two neighbouring pages. Qur'an text is never typed:
 * a window is skipped when it carries a quotation marker or shares any four consecutive words
 * with a verse (checked against the frozen Tanzil text in data/passage/quran-*.yaml). Windows the
 * OCR garbled are skipped too, and so are windows with an honorific formula the cleaner cannot
 * cut, and pages another harvest already excerpted. A book whose work or source record is
 * missing is skipped, so a book harvested later is added by one line in BOOKS.
 *
 * Usage: npx tsx scripts/harvest-qiraat-ocr.ts <harvest books dir> [--dry] [--only <prefix>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { qiraatFold, qiraatMatchesOfText, type QiraatTopic } from "./qiraat.js";

const ROOT = process.argv[2];
const DRY = process.argv.includes("--dry");
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const OUT_DIR = "data/passage";
if (!ROOT || ROOT.startsWith("--")) throw new Error("usage: harvest-qiraat-ocr.ts <books dir> [--dry] [--only <prefix>]");

interface Book { dir: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string; cap: number }
const BOOKS: Book[] = [
  // the sciences of the Qur'an and the readings: the books the browser is built around
  { dir: "quran-sciences/itqan", prefix: "itqan", work: "work/al-itqan-fi-ulum-al-quran", source: "source/itqan-suyuti", ar: "الإتقان في علوم القرآن للسيوطي", en: "al-Suyuti's al-Itqan fi 'Ulum al-Qur'an", ur: "الاتقان فی علوم القرآن، سیوطی", cap: 60 },
  { dir: "quran-sciences/burhan-zarkashi", prefix: "burhan-zarkashi", work: "work/al-burhan-fi-ulum-al-quran-zarkashi", source: "source/burhan-dar-al-hadith-2006", ar: "البرهان في علوم القرآن للزركشي", en: "al-Zarkashi's al-Burhan fi 'Ulum al-Qur'an", ur: "البرہان فی علوم القرآن، زرکشی", cap: 60 },
  { dir: "quran-sciences/manahil-irfan", prefix: "manahil-irfan", work: "work/manahil-al-irfan", source: "source/manahil-irfan-sabt", ar: "تهذيب مناهل العرفان في علوم القرآن", en: "the digest of Manahil al-'Irfan fi 'Ulum al-Qur'an", ur: "تہذیب مناہل العرفان فی علوم القرآن", cap: 60 },
  { dir: "quran-sciences/nashr-ibn-jazari", prefix: "nashr-ibn-jazari", work: "work/al-nashr-fi-al-qiraat-al-ashr", source: "source/nashr-dahman-damascus-1345-v1", ar: "النشر في القراءات العشر لابن الجزري", en: "Ibn al-Jazari's al-Nashr fi al-Qira'at al-'Ashr", ur: "النشر فی القراءات العشر، ابن الجزری", cap: 60 },
  { dir: "quran-sciences/taysir-dani", prefix: "taysir-dani", work: "work/al-taysir-fi-al-qiraat-al-sab", source: "source/taysir-pretzl-istanbul-1930", ar: "التيسير في القراءات السبع للداني", en: "al-Dani's al-Taysir fi al-Qira'at al-Sab'", ur: "التیسیر فی القراءات السبع، دانی", cap: 60 },
  { dir: "quran-sciences/hirz-amani-shatibi", prefix: "hirz-amani-shatibi", work: "work/hirz-al-amani-wa-wajh-al-tahani", source: "source/hirz-al-amani-wa-wajh-al-tahani", ar: "حرز الأماني ووجه التهاني للشاطبي", en: "al-Shatibi's Hirz al-Amani wa-Wajh al-Tahani", ur: "حرز الامانی ووجہ التہانی، شاطبی", cap: 60 },
  // bibliography, history and biography
  { dir: "tareekh/fihrist-ibn-nadim", prefix: "fihrist-ibn-nadim", work: "work/al-fihrist", source: "source/fihrist-ibn-al-nadim", ar: "الفهرست لابن النديم", en: "Ibn al-Nadim's al-Fihrist", ur: "الفہرست، ابن الندیم", cap: 40 },
  { dir: "tareekh/subh-asha", prefix: "subh-asha", work: "work/subh-al-asha", source: "source/subh-al-asha-cairo-v1", ar: "صبح الأعشى للقلقشندي", en: "al-Qalqashandi's Subh al-A'sha", ur: "صبح الاعشیٰ، قلقشندی", cap: 40 },
  { dir: "tareekh/muqaddima-ibn-khaldun", prefix: "muqaddima-ibn-khaldun", work: "work/al-muqaddima", source: "source/muqaddima-ibn-khaldun", ar: "مقدمة ابن خلدون", en: "Ibn Khaldun's Muqaddima", ur: "مقدمہ ابن خلدون", cap: 40 },
  { dir: "tareekh/kashf-zunun", prefix: "kashf-zunun", work: "work/kashf-al-zunun", source: "source/kashf-zunun-furqan", ar: "كشف الظنون لحاجي خليفة", en: "Hajji Khalifa's Kashf al-Zunun", ur: "کشف الظنون، حاجی خلیفہ", cap: 25 },
  { dir: "tareekh/wafayat-ayan", prefix: "wafayat-ayan", work: "work/wafayat-al-ayan", source: "source/wafayat-ayan", ar: "وفيات الأعيان لابن خلكان", en: "Ibn Khallikan's Wafayat al-A'yan", ur: "وفیات الاعیان، ابن خلکان", cap: 25 },
  { dir: "tareekh/tarikh-baghdad", prefix: "tarikh-baghdad", work: "work/tarikh-baghdad-khatib", source: "source/tarikh-baghdad-khatib", ar: "تاريخ بغداد للخطيب البغدادي", en: "al-Khatib al-Baghdadi's Tarikh Baghdad", ur: "تاریخ بغداد، خطیب بغدادی", cap: 25 },
  { dir: "tareekh/tarikh-tabari", prefix: "tarikh-tabari", work: "work/tarikh-al-rusul-wa-al-muluk", source: "source/tarikh-al-tabari", ar: "تاريخ الرسل والملوك للطبري", en: "al-Tabari's Tarikh al-Rusul wa-l-Muluk", ur: "تاریخ الرسل والملوک، طبری", cap: 25 },
  { dir: "tareekh/bidaya-nihaya", prefix: "bidaya-nihaya", work: "work/al-bidaya-wal-nihaya", source: "source/al-bidaya-wal-nihaya", ar: "البداية والنهاية لابن كثير", en: "Ibn Kathir's al-Bidaya wa-l-Nihaya", ur: "البدایہ والنہایہ، ابن کثیر", cap: 25 },
  { dir: "tareekh/tarikh-islam-dhahabi", prefix: "tarikh-islam-dhahabi", work: "work/tarikh-islam-dhahabi", source: "source/tarikh-islam-dhahabi", ar: "تاريخ الإسلام للذهبي", en: "al-Dhahabi's Tarikh al-Islam", ur: "تاریخ الاسلام، ذہبی", cap: 25 },
  { dir: "tareekh/tarikh-dimashq", prefix: "tarikh-dimashq", work: "work/tarikh-dimashq", source: "source/tarikh-dimashq-ibn-asakir-fikr-1995", ar: "تاريخ دمشق لابن عساكر", en: "Ibn 'Asakir's Tarikh Dimashq", ur: "تاریخ دمشق، ابن عساکر", cap: 20 },
  { dir: "tabaqat/tabaqat-huffaz", prefix: "tabaqat-huffaz", work: "work/tazkirat-al-huffaz", source: "source/tabaqat-huffaz", ar: "تذكرة الحفاظ للذهبي", en: "al-Dhahabi's Tadhkirat al-Huffaz", ur: "تذکرۃ الحفاظ، ذہبی", cap: 25 },
  { dir: "tabaqat/tabaqat-ibn-saad", prefix: "tabaqat-ibn-saad", work: "work/al-tabaqat-al-kubra-ibn-sad", source: "source/tabaqat-ibn-sad", ar: "الطبقات الكبرى لابن سعد", en: "Ibn Sa'd's al-Tabaqat al-Kubra", ur: "الطبقات الکبریٰ، ابن سعد", cap: 40 },
  // the seerah
  { dir: "seerah/sira-ibn-hisham", prefix: "sira-ibn-hisham", work: "work/sira-ibn-ishaq-ibn-hisham", source: "source/ibn-hisham-sira", ar: "السيرة النبوية لابن هشام", en: "Ibn Hisham's Sira", ur: "سیرت ابن ہشام", cap: 25 },
  { dir: "seerah/zad-maad", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad", ar: "زاد المعاد لابن القيم", en: "Ibn al-Qayyim's Zad al-Ma'ad", ur: "زاد المعاد، ابن القیم", cap: 25 },
  { dir: "seerah/rawd-unuf", prefix: "rawd-unuf", work: "work/al-rawd-al-unuf", source: "source/al-rawd-al-unf", ar: "الروض الأنف للسهيلي", en: "al-Suhayli's al-Rawd al-Unuf", ur: "الروض الانف، سہیلی", cap: 25 },
  { dir: "seerah/subul-huda", prefix: "subul-huda", work: "work/subul-al-huda-wa-al-rashad", source: "source/subul-huda-salihi", ar: "سبل الهدى والرشاد للصالحي", en: "al-Salihi's Subul al-Huda wa-l-Rashad", ur: "سبل الہدیٰ والرشاد، صالحی", cap: 25 },
  { dir: "seerah/maghazi-waqidi", prefix: "maghazi-waqidi", work: "work/kitab-al-maghazi", source: "source/al-waqidi-maghazi", ar: "المغازي للواقدي", en: "al-Waqidi's Maghazi", ur: "المغازی، واقدی", cap: 20 },
  { dir: "seerah/dalail-nubuwwa-bayhaqi", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi", ar: "دلائل النبوة للبيهقي", en: "al-Bayhaqi's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، بیہقی", cap: 20 },
  // the Companions
  { dir: "sahaba/hilyat-awliya", prefix: "sahaba-hilyat-awliya", work: "work/hilyat-al-awliya", source: "source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988", ar: "حلية الأولياء لأبي نعيم", en: "Abu Nu'aym's Hilyat al-Awliya'", ur: "حلیۃ الاولیاء، ابو نعیم", cap: 25 },
  { dir: "sahaba/usd-ghaba", prefix: "sahaba-usd-ghaba", work: "work/usd-al-ghaba", source: "source/usd-al-ghaba", ar: "أسد الغابة لابن الأثير", en: "Ibn al-Athir's Usd al-Ghaba", ur: "اسد الغابہ، ابن الاثیر", cap: 20 },
  { dir: "sahaba/isaba", prefix: "sahaba-isaba", work: "work/al-isaba-fi-tamyiz-al-sahaba", source: "source/isaba", ar: "الإصابة لابن حجر", en: "Ibn Hajar's al-Isaba", ur: "الاصابہ، ابن حجر", cap: 20 },
  { dir: "sahaba/isti-ab", prefix: "sahaba-isti-ab", work: "work/al-istiab", source: "source/isti-ab-ibn-abd-al-barr", ar: "الاستيعاب لابن عبد البر", en: "Ibn 'Abd al-Barr's al-Isti'ab", ur: "الاستیعاب، ابن عبد البر", cap: 20 },
  { dir: "sahaba/safwat-safwa", prefix: "sahaba-safwat-safwa", work: "work/sifat-al-safwa", source: "source/sifat-al-safwa-tartusi-2012", ar: "صفة الصفوة لابن الجوزي", en: "Ibn al-Jawzi's Sifat al-Safwa", ur: "صفۃ الصفوہ، ابن الجوزی", cap: 20 },
  { dir: "sahaba/hayat-sahaba", prefix: "sahaba-hayat-sahaba", work: "work/hayat-al-sahaba", source: "source/hayat-al-sahaba-kandahlawi-sabbani", ar: "حياة الصحابة للكاندهلوي", en: "al-Kandahlawi's Hayat al-Sahaba", ur: "حیاۃ الصحابہ، کاندھلوی", cap: 20 },
  // the hadith books
  { dir: "hadith/musannaf-abd-al-razzaq", prefix: "musannaf-abd-al-razzaq", work: "work/al-musannaf-abd-al-razzaq", source: "source/musannaf-abd-al-razzaq", ar: "مصنف عبد الرزاق", en: "the Musannaf of 'Abd al-Razzaq", ur: "مصنف عبد الرزاق", cap: 40 },
  { dir: "hadith/musannaf-ibn-abi-shayba", prefix: "musannaf-ibn-abi-shayba", work: "work/al-musannaf-ibn-abi-shayba", source: "source/al-musannaf-ibn-abi-shayba", ar: "مصنف ابن أبي شيبة", en: "the Musannaf of Ibn Abi Shayba", ur: "مصنف ابن ابی شیبہ", cap: 40 },
  { dir: "hadith/jami-tirmidhi", prefix: "jami-tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi", ar: "جامع الترمذي", en: "Jami' al-Tirmidhi", ur: "جامع ترمذی", cap: 20 },
  { dir: "hadith/fath-bari", prefix: "fath-bari", work: "work/fath-al-bari", source: "source/fath-al-bari", ar: "فتح الباري لابن حجر", en: "Ibn Hajar's Fath al-Bari", ur: "فتح الباری، ابن حجر", cap: 25 },
  // the commentaries and the dictionaries
  { dir: "tafsir/tafsir-ibn-kathir", prefix: "tafsir-ibn-kathir", work: "work/tafsir-ibn-kathir", source: "source/tafsir-ibn-kathir", ar: "تفسير ابن كثير", en: "Ibn Kathir's Tafsir", ur: "تفسیر ابن کثیر", cap: 15 },
  { dir: "tafsir/tafsir-qurtubi", prefix: "tafsir-qurtubi", work: "work/al-jami-li-ahkam-al-quran", source: "source/jami-ahkam-quran-resala-v1", ar: "الجامع لأحكام القرآن للقرطبي", en: "al-Qurtubi's al-Jami' li-Ahkam al-Qur'an", ur: "الجامع لاحکام القرآن، قرطبی", cap: 15 },
  { dir: "lugha/lisan-arab", prefix: "lisan-arab", work: "work/lisan-al-arab", source: "source/lisan-al-arab-dar-sadir", ar: "لسان العرب لابن منظور", en: "Ibn Manzur's Lisan al-'Arab", ur: "لسان العرب، ابن منظور", cap: 15 },
  { dir: "lugha/sahah-jawhari", prefix: "sahah-jawhari", work: "work/al-sihah-jawhari", source: "source/sihah-attar-1979-v1", ar: "الصحاح للجوهري", en: "al-Jawhari's al-Sihah", ur: "الصحاح، جوہری", cap: 15 },
];

/** What each topic says, for the label and the summary, in the three languages. */
const SAYS: Record<QiraatTopic, [string, string, string]> = {
  ahruf: ["الأحرف السبعة", "the seven ahruf", "سبعہ احرف"],
  readings: ["قراءات القرآن", "the readings of the Qur'an", "قرآن کی قراءتیں"],
  readers: ["القراء", "the readers", "قراء"],
  codex: ["جمع القرآن والمصاحف", "the collection of the Qur'an and the codices", "جمعِ قرآن اور مصاحف"],
  rasm: ["رسم المصحف", "the orthography of the mushaf", "رسمِ مصحف"],
  naqt: ["نقط المصحف وشكله", "the dotting and vowel marks of the mushaf", "مصحف کے نقطے اور اعراب"],
  khatt: ["الخطوط والكتابة", "the scripts and the craft of writing", "خطوط اور کتابت"],
};
/** The concept each topic is a mention of. */
const TARGETS: Record<QiraatTopic, string> = {
  ahruf: "concept/qiraat", readings: "concept/qiraat", readers: "concept/qiraat",
  codex: "concept/mushaf", rasm: "concept/rasm-al-quran", naqt: "concept/rasm-al-quran", khatt: "concept/khatt-al-arabi",
};
/** A bare «مصحف» / «مصاحف», a bare «النقط», «على حرف واحد» (a rhyme, a letter) or a dropped alef (grammar) says too little for a book page on its own. */
const WEAK = new Set([
  "مصحف", "مصاحف", "النقط", "علي حرف واحد", "علي حرفين", "بحذف الالف", "باثبات الالف",
  "في الصحف", "الصحف التي", "الوراقين", "الوراقون", // a preface, a market of paper-sellers
  "روايه شعبه", // a hadith transmitted by Shu'ba, not a reading
  "عاصم بن ابي النجود", "عاصم بن بهدله", "حفص بن سليمان", "ابو جعفر القارئ", "ابي جعفر القارئ", // a narrator's name in a chain
]);

const HONORIFICS = /\s*(?:صلى\s+الله\s+عليه\s+وسلم|صلى\s+الله\s+عليه\s+وآله\s+وسلم|رضى\s+الله\s+عن(?:ه|ها|هما|هم)|رضي\s+الله\s+عن(?:ه|ها|هما|هم)|عليه\s+السلام|عليهما\s+السلام|عليهم\s+السلام|رحمه\s+الله)/g;
const MARKS = /[ً-ٰٟۖ-ۭـ]/;
/** Drop honorific formulas (the UI renders them) and the edition's directional marks. */
function clean(raw: string): string {
  // match honorifics on a vowel-less shadow, cut the same spans from the vowelled text
  const map: number[] = [];
  let shadow = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (MARKS.test(c)) continue;
    shadow += c;
    map.push(i);
  }
  const cuts: [number, number][] = [];
  for (const m of shadow.matchAll(HONORIFICS)) {
    const a = map[m.index!];
    const last = m.index! + m[0].length;
    const b = last < map.length ? map[last] : raw.length;
    cuts.push([a, b]);
  }
  let out = "";
  let at = 0;
  for (const [a, b] of cuts) { out += raw.slice(at, a); at = b; }
  out += raw.slice(at);
  return out.replace(/[‎‏‪-‮]/g, "").replace(/\s+([،.])/g, "$1").replace(/\s+/g, " ").trim();
}

const QURAN_MARK = /[\uFD3E\uFD3F{}]|قوله تعالي|قوله تعالى|قال تعالي|قال تعالى|قال الله|عز وجل|قوله سبحانه|قول الله|الآية/;
/** Honorific formulas the OCR spelled in a way the cleaner does not cut: such a window is skipped, not repaired. */
const HONORIFIC_LEFT = /رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|\uFDFA|\uFDFB/;
const uniq = <T,>(xs: T[]) => [...new Set(xs)];

/** One spelling for the comparison with the Qur'an and the vocabulary: alef forms, final ya and ta marbuta folded. */
const norm = (w: string) => qiraatFold(w).replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");
/** Every run of four consecutive words of the Qur'an, and the vocabulary of the museum's Qur'an and hadith passages. */
const QURAN_4GRAMS = new Set<string>();
const VOCAB = new Set<string>();
const SURAS = new Map<number, [number, string[]][]>();
for (const f of readdirSync(OUT_DIR)) {
  const isQuran = /^quran-\d+-\d+\.yaml$/.test(f);
  if (!isQuran && !/^(?:bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah|muwatta|riyad|arbaun)-/.test(f)) continue;
  const raw = readFileSync(join(OUT_DIR, f), "utf8");
  const m = raw.match(isQuran ? /^text_search: "(.*)"$/m : /^text: "(.*)"$/m);
  if (!m) continue;
  const ws = m[1].split(/\s+/).map(norm).filter(Boolean);
  for (const w of ws) VOCAB.add(w);
  if (isQuran) {
    const [, su, ay] = f.match(/^quran-(\d+)-(\d+)\.yaml$/)!;
    (SURAS.get(+su) ?? SURAS.set(+su, []).get(+su)!).push([+ay, ws]);
  }
}
// the four-word runs are taken over a whole sura, so a quotation that crosses from one short verse to the next is caught too
for (const verses of SURAS.values()) {
  const ws = verses.sort((a, b) => a[0] - b[0]).flatMap((v) => v[1]);
  for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
const known = (w: string) => VOCAB.has(w) || VOCAB.has(w.replace(/^[وفبلك]/, "")) || VOCAB.has(w.replace(/^[وفبلك]?ال/, "")) || VOCAB.has(w.replace(/^[وفبلك]?لل/, ""));
function quotesQuran(ws: string[]): boolean {
  for (let i = 0; i + 4 <= ws.length; i++) if (QURAN_4GRAMS.has(ws.slice(i, i + 4).join(" "))) return true;
  return false;
}
const q = (s: string) => JSON.stringify(s);

/** Clean an OCR page: footnote digits, Latin, brackets and line breaks go; honorific formulas go. */
function pageWords(text: string): string[] {
  return clean(text.replace(/[A-Za-z0-9\u0660-\u0669()\[\]«»"*#_=|/\\<>~^`]+/g, " ").replace(/\s+/g, " ")).split(" ").filter(Boolean);
}

interface Cand { vol: number; scan: string; page: number; text: string; topics: QiraatTopic[]; words: number }

/** Topics of a window, and whether they are enough: not a bare weak word alone. */
function judge(folded: string): { topics: QiraatTopic[]; words: number } | null {
  const m = qiraatMatchesOfText(folded);
  const topics = Object.keys(m) as QiraatTopic[];
  if (!topics.length) return null;
  // «الخطاط» (a calligrapher) is also the start of «الخطاطيف» (swallows): the word must end where the hit ends
  // and «فانقط» (impersonal «فانقطعوا», they were cut off) likewise
  for (const [t, w] of [["khatt", "الخطاط"], ["naqt", "فانقط"]] as const) {
    if (!m[t]) continue;
    m[t] = m[t]!.filter((x) => x !== w || new RegExp(`${w}(?![ء-ي])`).test(folded));
    if (!m[t]!.length) { delete m[t]; topics.splice(topics.indexOf(t), 1); }
  }
  if (!topics.length) return null;
  const all = topics.flatMap((t) => m[t]!);
  if (all.every((w) => WEAK.has(w))) return null; // only bare weak words
  return { topics, words: all.length };
}
const scoreOf = (x: { topics: unknown[]; words: number }) => x.topics.length * 100 + x.words;

function bestWindow(words: string[]): { text: string; topics: QiraatTopic[]; words: number } | null {
  let best: { text: string; topics: QiraatTopic[]; words: number } | null = null;
  for (let start = 0; start < words.length; start += 10) {
    const slice = words.slice(start, start + 40);
    if (slice.length < 18) break;
    const text = slice.join(" ");
    const folded = qiraatFold(text);
    if (QURAN_MARK.test(folded) || QURAN_MARK.test(text) || HONORIFIC_LEFT.test(folded)) continue;
    if (/[ٱ\u06D6-\u06ED]/.test(text)) continue; // Uthmani letters: a verse set in the page
    const ws = slice.map(norm).filter(Boolean);
    const stray = ws.filter((w) => w.length <= 1).length + (slice.length - ws.length);
    if (stray > slice.length * 0.08) continue;
    if (ws.filter(known).length < ws.length * 0.7) continue;
    if (quotesQuran(ws)) continue;
    const j = judge(folded);
    if (!j) continue;
    if (!best || scoreOf(j) > scoreOf(best)) best = { text: (start > 0 ? "… " : "") + text + (start + 40 < words.length ? " …" : ""), ...j };
  }
  return best;
}

const pageFiles = readdirSync(OUT_DIR);
let total = 0;
for (const book of BOOKS) {
  if (ONLY && book.prefix !== ONLY) continue;
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const base = join(ROOT, book.dir);
  if (!existsSync(base)) { console.error(`skip ${book.prefix}: ${base} missing`); continue; }
  const scans = readdirSync(base).filter((d) => existsSync(join(base, d, "pages.json"))).sort();
  const cands: Cand[] = [];
  const seenText = new Set<string>();
  scans.forEach((scan, vi) => {
    const pages: { page: number; text?: string }[] = JSON.parse(readFileSync(join(base, scan, "pages.json"), "utf8"));
    for (const p of pages) {
      if (!p.text || p.text.length < 200) continue;
      const w = bestWindow(pageWords(p.text));
      if (!w) continue;
      const key = w.text.split(" ").map(norm).filter(Boolean).slice(4, 16).join(" ");
      if (seenText.has(key)) continue; // the same edition scanned twice
      seenText.add(key);
      cands.push({ vol: vi + 1, scan, page: p.page, text: w.text, topics: w.topics, words: w.words });
    }
  });
  // densest pages first, then spread: never two neighbouring pages
  cands.sort((a, b) => scoreOf(b) - scoreOf(a) || a.vol - b.vol || a.page - b.page);
  const kept: Cand[] = [];
  for (const c of cands) {
    if (kept.length >= book.cap) break;
    if (kept.some((k) => k.vol === c.vol && Math.abs(k.page - c.page) <= 1)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.vol - b.vol || a.page - b.page);
  for (const c of kept) {
    const slug = `${book.prefix}-qiraat-${scans.length > 1 ? `${c.vol}-` : ""}${c.page}`;
    const file = join(OUT_DIR, `${slug}.yaml`);
    if (existsSync(file)) continue;
    const pageTail = `-${scans.length > 1 ? `${c.vol}-` : ""}${c.page}.yaml`;
    if (pageFiles.some((f) => f.startsWith(`${book.prefix}-`) && f.endsWith(pageTail))) continue; // another harvest excerpted this page
    const says = c.topics.map((t) => SAYS[t]);
    const where = { ar: `${scans.length > 1 ? `المجلد المصوَّر ${c.vol}، ` : ""}ص ${c.page}`, en: `${scans.length > 1 ? `scan volume ${c.vol}, ` : ""}p. ${c.page}`, ur: `${scans.length > 1 ? `اسکین جلد ${c.vol}، ` : ""}ص ${c.page}` };
    const label = {
      ar: `${book.ar}، ${where.ar} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en}, ${where.en} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur}، ${where.ur} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `مقطع من ${book.ar}، ${where.ar}، يذكر ${says.map((s) => s[0]).join("، و")}؛ من النسخة المصورة المقروءة آليا، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر. يجمعه متصفح قراءات القرآن والرسم والخطوط والضبط.`,
      en: `An excerpt from ${book.en}, ${where.en}, that mentions ${says.map((s) => s[1]).join(", ")}; from the machine-read scan, quoted within forty words per the sources policy. The browser of the museum for how the Qur'an was read and written lists it.`,
      ur: `${book.ur}، ${where.ur} کا اقتباس جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے؛ مشینی طور پر پڑھی گئی نقل سے، چالیس الفاظ کی حد میں۔ قراءات، رسم، خطوط اور نقطوں کا براؤزر اسے درج کرتا ہے۔`,
    };
    const src = `[${book.source}]`;
    const yaml = [
      `id: passage/${slug}`,
      `class: passage`,
      `unit: chapter`,
      `work: ${book.work}`,
      `ref: ${q(scans.length > 1 ? `${c.vol}:${c.page}` : String(c.page))}`,
      `label: { ar: ${q(label.ar)}, en: ${q(label.en)}, ur: ${q(label.ur)} }`,
      `text: ${q(c.text)}`,
      `summary:`,
      `  ar: ${q(summary.ar)}`,
      `  en: ${q(summary.en)}`,
      `  ur: ${q(summary.ur)}`,
      `relations:`,
      ...uniq(c.topics.map((t) => TARGETS[t])).map((t) => `  - { type: mentions, target: ${t}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`Apple Vision OCR of the scan ${book.dir}/${c.scan}, page ${c.page}; a window of at most 40 words chosen by the qira'at detector (scripts/qiraat.ts); OCR text not corrected`)}, generated_by: "Claude (claude-sonnet-5-5)", model: "claude-sonnet-5-5", run: "qiraat-ocr-1" }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Claude (claude-sonnet-5-5) from the OCR'd book; label and summary are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    total++;
  }
  console.log(book.prefix, `${kept.length} kept of ${cands.length} candidate pages in ${scans.length} scan(s)`);
}
console.log(`${total} passages ${DRY ? "(dry run)" : "written"}`);
