/**
 * Harvest the hadith reports that name «الحلال والحرام» — what is lawful and what is unlawful —
 * from the hadith-api Arabic editions (fawazahmed0/hadith-api, Unlicense) into data/passage/,
 * for the Halal and Haram Browser (docs/plan/58-halal-haram-browser.md).
 *
 * Every candidate is gated by the same detector the browser uses (scripts/halal.ts), under the
 * strong-signal rule (a bare verb or a neighbouring word alone is not enough), so only reports
 * the page will show become records. A report already in the graph is skipped, and so is a
 * repeat of the same wording inside one collection. Records follow the hadith-api harvest
 * convention: a matn excerpt of at most 55 words centred on the first lawful/unlawful wording,
 * honorific formulas left out, and provenance naming the edition and the hadith.
 *
 * Usage: npx tsx scripts/harvest-halal-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { halalFirstStrongAt, halalFold, halalSignalsOfText } from "./halal.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
const UMBRELLA = "concept/halal-haram";
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-halal-hadithapi.ts <dir> [--dry]");

interface Hadith { hadithnumber: number; arabicnumber?: number | string; text: string; reference?: { book?: number; hadith?: number } }
interface Edition { metadata?: { sections?: Record<string, string> }; hadiths: Hadith[] }

const BOOKS: { file: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string }[] = [
  { file: "ara-bukhari", prefix: "bukhari", work: "work/sahih-al-bukhari", source: "source/sahih-al-bukhari", ar: "صحيح البخاري", en: "Sahih al-Bukhari", ur: "صحیح بخاری" },
  { file: "ara-muslim", prefix: "muslim", work: "work/sahih-muslim", source: "source/sahih-muslim", ar: "صحيح مسلم", en: "Sahih Muslim", ur: "صحیح مسلم" },
  { file: "ara-tirmidhi", prefix: "tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi", ar: "جامع الترمذي", en: "Jami' al-Tirmidhi", ur: "جامع ترمذی" },
  { file: "ara-nasai", prefix: "nasai", work: "work/sunan-al-nasai", source: "source/sunan-al-nasai", ar: "سنن النسائي", en: "Sunan al-Nasa'i", ur: "سنن نسائی" },
  { file: "ara-abudawud", prefix: "abudawud", work: "work/sunan-abi-dawud", source: "source/sunan-abi-dawud", ar: "سنن أبي داود", en: "Sunan Abi Dawud", ur: "سنن ابی داؤد" },
  { file: "ara-ibnmajah", prefix: "ibnmajah", work: "work/sunan-ibn-majah", source: "source/sunan-ibn-majah", ar: "سنن ابن ماجه", en: "Sunan Ibn Majah", ur: "سنن ابن ماجہ" },
  { file: "ara-malik", prefix: "muwatta", work: "work/muwatta-malik", source: "source/muwatta-malik", ar: "موطأ مالك", en: "Muwatta Malik", ur: "موطأ مالک" },
];

/** What each signal says, for the label and the summary, in the three languages. */
const SAYS: Record<string, [string, string, string]> = {
  "halal": ["الحلال", "the lawful", "حلال"],
  "ahalla-li": ["ما أُحل", "what was made lawful", "جو حلال کیا گیا"],
  "ahalla-allah": ["ما أُحل", "what was made lawful", "جو حلال کیا گیا"],
  "la-yahill": ["ما لا يحل", "what is not lawful", "جو حلال نہیں"],
  "istihlal": ["استحلال الشيء", "treating a thing as lawful", "کسی چیز کو حلال ٹھہرانا"],
  "haram": ["الحرام", "the unlawful", "حرام"],
  "harrama-allah": ["ما حُرّم", "what was made unlawful", "جو حرام کیا گیا"],
  "harrama-ala": ["ما حُرّم", "what was made unlawful", "جو حرام کیا گیا"],
  "harramna": ["ما حُرّم", "what was made unlawful", "جو حرام کیا گیا"],
  "tahrim": ["التحريم", "prohibition", "تحریم"],
  "muharramat": ["المحرمات", "the forbidden things", "محرمات"],
  "tayyibat": ["الطيبات", "the good things", "پاکیزہ چیزیں"],
  "khabaith": ["الخبائث", "the foul things", "خبیث چیزیں"],
  "shubuhat": ["الشبهات", "the doubtful matters", "مشتبہ امور"],
  "mubah": ["المباح", "the permissible", "مباح"],
  "makruh": ["المكروه", "the disliked", "مکروہ"],
  "rukhsa": ["الرخصة", "the concession", "رخصت"],
};

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

/** A window of at most 55 words around the first lawful/unlawful wording. */
function excerptOf(full: string): string {
  const words = full.split(" ").filter(Boolean);
  if (words.length <= 55) return full;
  const folded = halalFold(words.join(" "));
  const first = Math.max(0, halalFirstStrongAt(folded));
  const hitWord = Math.min(words.length - 1, folded.slice(0, first + 1).split(" ").length - 1);
  let start = Math.max(0, hitWord - 18);
  const end = Math.min(words.length, start + 55);
  start = Math.max(0, end - 55);
  return (start > 0 ? "… " : "") + words.slice(start, end).join(" ") + (end < words.length ? " …" : "");
}

const q = (s: string) => JSON.stringify(s);
const uniq = <T,>(xs: T[]) => [...new Set(xs)];

const siblings = new Set<string>();
for (const f of readdirSync(OUT_DIR)) {
  const m = f.match(/^(bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah)-0*(\d+)[a-z]?\.yaml$/);
  if (m) siblings.add(`${m[1]}-${m[2]}`);
}
let written = 0;
const why: Record<string, number> = {};
const skip = (k: string) => { why[k] = (why[k] ?? 0) + 1; };
const perBook: Record<string, number> = {};
for (const book of BOOKS) {
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    if (!halalSignalsOfText(halalFold(h.text), true).length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    if (existsSync(file)) {
      // keep its wording in view, so a second run does not take a repeat of it for a new report
      seen.push(halalFold(excerptOf(clean(h.text))));
      skip("an api record of this hadith exists");
      continue;
    }
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    const text = excerptOf(clean(h.text));
    const folded = halalFold(text);
    const signals = halalSignalsOfText(folded, true);
    if (!signals.length) { skip("excerpt lost the signal"); continue; }
    const at = Math.max(0, halalFirstStrongAt(folded));
    const key = folded.slice(Math.max(0, at - 45), at + 40);
    if (seen.some((t) => t.includes(key))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const says = uniq(signals.map((s) => SAYS[s]).filter(Boolean).map((s) => s.join("\u0001"))).map((s) => s.split("\u0001"));
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = {
      ar: `${book.ar} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، يذكر ${says.map((s) => s[0]).join("، و")}. يجمعه متصفح الحلال والحرام مع نصوص القرآن والسنة والسيرة وأخبار الصحابة والتابعين في ما أُحل وما حُرّم.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, that mentions ${says.map((s) => s[1]).join(", ")}. The Halal and Haram Browser lists it with the texts of the Qur'an, the Sunnah, the seerah and the reports of the Companions and Successors on what is lawful and what is unlawful.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے۔ حلال و حرام براؤزر اسے قرآن، سنت، سیرت اور صحابہ و تابعین کے آثار کی ان نصوص کے ساتھ جمع کرتا ہے جو حلال اور حرام بیان کرتی ہیں۔`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const ref = h.reference?.book !== undefined ? ` (book ${h.reference.book} hadith ${h.reference.hadith})` : "";
    const yaml = [
      `id: ${id}`,
      `class: passage`,
      `unit: hadith`,
      `work: ${book.work}`,
      `ref: "${h.hadithnumber}"`,
      `label: { ar: ${q(label.ar)}, en: ${q(label.en)}, ur: ${q(label.ur)} }`,
      `text: ${q(text)}`,
      `summary:`,
      `  ar: ${q(summary.ar)}`,
      `  en: ${q(summary.en)}`,
      `  ur: ${q(summary.ur)}`,
      `relations:`,
      `  - { type: mentions, target: ${UMBRELLA}, sources: ${src} }`,
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "halal-hadithapi-1" }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the hadith-api Arabic edition; label and summary are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    written++;
    perBook[book.prefix] = (perBook[book.prefix] ?? 0) + 1;
  }
}

/**
 * Reports the lexicon cannot find because they act on the lawful and the unlawful without naming
 * them: the scruple of the Prophet, the Companions and the Successors before a doubtful morsel,
 * and the customs of the Jahiliyya that forbade what God had not. They are admitted by number,
 * tagged `halal-haram-browser` (the curated escape hatch of scripts/halal.ts), and excerpted
 * around the words given here.
 */
const PINNED: { file: string; n: number; at: string; ar: string; en: string; ur: string }[] = [
  { file: "ara-bukhari", n: 3842, at: "كان لأبي بكر غلام", ar: "ورع أبي بكر عن طعام من كسب الكهانة", en: "Abu Bakr's scruple over food earned by soothsaying", ur: "کہانت کی کمائی کے کھانے سے ابوبکر کا ورع" },
  { file: "ara-bukhari", n: 2055, at: "بتمرة", ar: "ترك التمرة خشية أن تكون من الصدقة", en: "leaving a fallen date for fear it was charity", ur: "صدقے کے اندیشے سے گری ہوئی کھجور چھوڑ دینا" },
  { file: "ara-bukhari", n: 1491, at: "أخذ الحسن", ar: "منع الحسن بن علي من تمرة الصدقة", en: "al-Hasan ibn 'Ali stopped from eating a date of the charity", ur: "حسن بن علی کو صدقے کی کھجور سے روکنا" },
  { file: "ara-bukhari", n: 5507, at: "إن قوما يأتونا", ar: "اللحم الذي لا يُدرى أذُكر اسم الله عليه", en: "meat of which it is not known whether God's name was said over it", ur: "وہ گوشت جس پر اللہ کا نام لینے کا علم نہ ہو" },
  { file: "ara-bukhari", n: 3521, at: "البحيرة", ar: "البحيرة والسائبة وأول من سيّب السوائب", en: "the bahira, the sa'iba and the first to set animals loose for the idols", ur: "بحیرہ، سائبہ اور سب سے پہلے جانور بتوں کے نام چھوڑنے والا" },
  { file: "ara-malik", n: 606, at: "شرب عمر", ar: "ورع عمر بن الخطاب عن لبن من نعم الصدقة", en: "'Umar ibn al-Khattab's scruple over milk from the charity camels", ur: "صدقے کے اونٹوں کے دودھ سے عمر بن خطاب کا ورع" },
  { file: "ara-tirmidhi", n: 2518, at: "دع ما يريبك", ar: "ترك ما يريب إلى ما لا يريب", en: "leaving what gives doubt for what gives none", ur: "شک والی چیز چھوڑ کر بے شک چیز اختیار کرنا" },
  { file: "ara-tirmidhi", n: 2451, at: "لا يبلغ العبد", ar: "ترك ما لا بأس به حذرا مما به بأس", en: "leaving what is harmless out of caution for what is harmful", ur: "جس میں حرج ہے اس کے ڈر سے بے حرج چیز چھوڑ دینا" },
  { file: "ara-tirmidhi", n: 614, at: "لا يربو لحم", ar: "اللحم النابت من السحت", en: "flesh grown from unlawful gain", ur: "حرام کمائی سے پلا ہوا گوشت" },
  { file: "ara-muslim", n: 6516, at: "البر حسن الخلق", ar: "الإثم ما حاك في الصدر", en: "sin as what wavers in the breast", ur: "گناہ وہ جو سینے میں کھٹکے" },
];
const fold = (x: string) => x.replace(/[ً-ٰٟۖ-ۭـ]/g, "");
let pinned = 0;
for (const pin of PINNED) {
  const book = BOOKS.find((b) => b.file === pin.file)!;
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) continue;
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const h = edition.hadiths.find((x) => x.hadithnumber === pin.n);
  if (!h?.text) throw new Error(`pinned hadith ${pin.file} ${pin.n} not found`);
  const file = join(OUT_DIR, `${book.prefix}-api-${pin.n}.yaml`);
  if (existsSync(file)) continue;
  const words = clean(h.text).split(" ").filter(Boolean);
  const at = fold(words.join(" ")).indexOf(pin.at);
  if (at < 0) throw new Error(`pinned hadith ${pin.file} ${pin.n}: «${pin.at}» not in the text`);
  const hitWord = fold(words.join(" ")).slice(0, at + 1).split(" ").length - 1;
  const start = Math.max(0, Math.min(hitWord - 3, words.length - 55));
  const end = Math.min(words.length, start + 55);
  const text = (start > 0 ? "… " : "") + words.slice(start, end).join(" ") + (end < words.length ? " …" : "");
  const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
  const ref = h.reference?.book !== undefined ? ` (book ${h.reference.book} hadith ${h.reference.hadith})` : "";
  const yaml = [
    `id: passage/${book.prefix}-api-${pin.n}`,
    `class: passage`,
    `unit: hadith`,
    `work: ${book.work}`,
    `ref: "${pin.n}"`,
    `label: { ar: ${q(`${book.ar} ${pin.n} — ${pin.ar}`)}, en: ${q(`${book.en} ${pin.n} — ${pin.en}`)}, ur: ${q(`${book.ur} ${pin.n} — ${pin.ur}`)} }`,
    `text: ${q(text)}`,
    `summary:`,
    `  ar: ${q(`خبر في ${book.ar}، رقم ${pin.n}، في ${pin.ar}. لا يرد فيه لفظ الحلال أو الحرام، ويجمعه متصفح الحلال والحرام مع أخبار الورع وتحرّي الحلال.`)}`,
    `  en: ${q(`A report in ${book.en}, no. ${pin.n}, on ${pin.en}. It does not use the words halal or haram; the Halal and Haram Browser lists it with the reports of scruple and of seeking the lawful.`)}`,
    `  ur: ${q(`${book.ur} کی روایت نمبر ${pin.n}: ${pin.ur}۔ اس میں حلال یا حرام کا لفظ نہیں آیا؛ حلال و حرام براؤزر اسے ورع اور حلال کی جستجو کی روایات کے ساتھ جمع کرتا ہے۔`)}`,
    `tags: [halal-haram-browser]`,
    `relations:`,
    `  - { type: mentions, target: ${UMBRELLA}, sources: ${src} }`,
    `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${pin.n}${ref}; matn excerpt of at most 55 words, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "halal-hadithapi-1" }`,
    `sources: ${src}`,
    `status: { review: draft, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the hadith-api Arabic edition; label and summary are the museum's own words" }`,
    ``,
  ].join("\n");
  if (!DRY) writeFileSync(file, yaml);
  pinned++;
}
console.log(`${pinned} pinned reports ${DRY ? "(dry run)" : "written"}`);
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook);
console.log("skipped", why);
