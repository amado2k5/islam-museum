/**
 * Harvest the hadith reports that speak of the father and fatherhood — possessed father
 * forms, the father addressing his son (يا بني), dutifulness to the parents and its
 * opposite (بر الوالدين، العقوق), the father raising, teaching and counselling (التربية،
 * الوصية، لقمان), paternity and lineage (النسب)، and the orphan who has lost his father
 * (اليتيم) — from the hadith-api Arabic editions (fawazahmed0/hadith-api, Unlicense) into
 * data/passage/, for the Ubuwwa (Fatherhood) Browser (docs/plan/65-ubuwwa-browser.md).
 * Adapted from scripts/harvest-wasaya-hadithapi.ts.
 *
 * Every candidate is gated by the same detector the browser uses (scripts/ubuwwa.ts): only
 * reports whose text fires ubuwwaSignalsOfText become records, so the same guarded lexicon
 * that drives the page decides what the graph holds. A report already in the graph is
 * skipped, and so is a repeat of the same wording inside one collection. Records follow the
 * hadith-api harvest convention: a matn excerpt of at most 55 words centred on the first
 * hit, honorific formulas left out, and provenance naming the edition and the hadith.
 * Qur'an text is never typed here: an excerpt that carries the Qur'an's brackets or Uthmani
 * letters is skipped, as is one that shares four consecutive words with a verse of the
 * frozen Tanzil text in data/passage/quran-*.yaml.
 *
 * Usage: npx tsx scripts/harvest-ubuwwa-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ubuwwaSignalsOfText, UBUWWA_SIGNAL_TOPICS, type UbuwwaTopic } from "./ubuwwa.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-ubuwwa-hadithapi.ts <dir> [--dry]");

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
  { file: "ara-nawawi", prefix: "nawawi", work: "work/arbaeen-al-nawawiyya", source: "source/arbaun-nawawi", ar: "الأربعون النووية", en: "al-Arba'in al-Nawawiyya", ur: "اربعین نوویہ" },
];

/** What each topic says, for the label and the summary, in the three languages. */
const SAYS: Record<UbuwwaTopic, [string, string, string]> = {
  ab: ["الأب والأبوة", "the father and fatherhood", "باپ اور والدیت"],
  birr: ["بر الوالدين أو عقوقهما", "dutifulness to the parents or disobedience to them", "والدین کے ساتھ نیکی یا نافرمانی"],
  tarbiyya: ["تربية الأب ووصيته", "the father raising and counselling", "باپ کی تربیت اور نصیحت"],
  nasab: ["النسب والانتساب", "paternity and lineage", "نسب اور انتساب"],
  yatm: ["اليتيم وفقد الأب", "the orphan and the father lost", "یتیم اور باپ کی موت"],
};
const TARGETS: Record<UbuwwaTopic, string> = {
  ab: "concept/ubuwwa", birr: "concept/ubuwwa", tarbiyya: "concept/ubuwwa",
  nasab: "concept/intisab", yatm: "concept/yatim-fiqh",
};
/** Hits that say too little on their own in a hadith: «يا بني» as a chain of address to Bani
 *  Adam or a tribe is already gated in the detector; here we additionally drop reports whose
 *  only signal is the weak child word, still a father's report when the excerpt carries it. */
const WEAK_ONLY = new Set(["ya_bunayya", "wlad_weak"]);

const HONORIFICS = /\s*(?:صلى\s+الله\s+عليه\s+وسلم|صلى\s+الله\s+عليه\s+وآله\s+وسلم|رضى\s+الله\s+عن(?:ه|ها|هما|هم)|رضي\s+الله\s+عن(?:ه|ها|هما|هم)|عليه\s+السلام|عليهما\s+السلام|عليهم\s+السلام|رحمه\s+الله)/g;
const MARKS = /[ً-ٰٟۖ-ۭـ]/g;
/** Drop honorific formulas (the UI renders them) and the edition's directional marks. */
function clean(raw: string): string {
  // match honorifics on a vowel-less shadow, cut the same spans from the vowelled text
  const map: number[] = [];
  let shadow = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (MARKS.test(c)) { MARKS.lastIndex = 0; continue; }
    MARKS.lastIndex = 0;
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
/** Honorific formulas the cleaner does not cut: such an excerpt is skipped, not repaired. */
const HONORIFIC_LEFT = /رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ/;

const fold = (s: string) => s.replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[‎‏‪-‮]/g, "").replace(/\s+/g, " ").trim();
/** Every run of four consecutive words of the Qur'an (frozen Tanzil text in the museum's verse passages). */
const norm = (w: string) => fold(w).replace(/[^ء-ي]/g, "");
const QURAN_4GRAMS = new Set<string>();
const SURAS = new Map<number, [number, string[]][]>();
for (const f of readdirSync(OUT_DIR)) {
  if (!/^quran-\d+-\d+\.yaml$/.test(f)) continue;
  const m = readFileSync(join(OUT_DIR, f), "utf8").match(/^text_search: "(.*)"$/m);
  if (!m) continue;
  const ws = m[1].split(/\s+/).map(norm).filter(Boolean);
  const [, su, ay] = f.match(/^quran-(\d+)-(\d+)\.yaml$/)!;
  (SURAS.get(+su) ?? SURAS.set(+su, []).get(+su)!).push([+ay, ws]);
}
// the four-word runs are taken over a whole sura, so a quotation that crosses from one short verse to the next is caught too
for (const verses of SURAS.values()) {
  const ws = verses.sort((a, b) => a[0] - b[0]).flatMap((v) => v[1]);
  for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
const quotesQuran = (text: string): boolean => {
  if (/[﴾﴿{}ٱۖ-ۭ]/.test(text)) return true;
  const ws = text.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i + 4 <= ws.length; i++) if (QURAN_4GRAMS.has(ws.slice(i, i + 4).join(" "))) return true;
  return false;
};

/** The topics of a text: signals mapped through UBUWWA_SIGNAL_TOPICS, weak-only reports kept
 *  (a «يا بني» beside a father word is a father's address by definition of the gate). */
function judge(folded: string): { topics: UbuwwaTopic[]; signals: string[] } {
  const signals = ubuwwaSignalsOfText(folded);
  const topics = [...new Set(signals.map((s) => UBUWWA_SIGNAL_TOPICS[s]).filter(Boolean))] as UbuwwaTopic[];
  return { topics, signals };
}

/** The first strong father-word in a text, for centring the excerpt. */
const FINDER = /أبوه|أبوها|أبيه|أبوك|أبوي|أبونا|أبانا|آباء|آبائ|يا ?أبت|والده|والدك|والدي|والدين|والديه|الوالد|لقمان|يتيم|يتامى|نسب|عقوق|بر الوالدين|بالوالدين|رباه|ربّى/;

/** A window of at most 55 words around the first father word (or the end of the report, where the matn is). */
function excerptOf(full: string): string {
  const words = full.split(" ").filter(Boolean);
  if (words.length <= 55) return full;
  const folded = fold(words.join(" "));
  const m = folded.match(FINDER);
  const hitWord = m ? Math.min(words.length - 1, folded.slice(0, m.index!).split(" ").length - 1) : words.length - 1;
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
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    const { topics } = judge(clean(h.text));
    if (!topics.length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (existsSync(file)) { seen.push(fold(excerptOf(clean(h.text)))); skip("an api record of this hadith exists"); continue; }
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    const text = excerptOf(clean(h.text));
    const folded = fold(text);
    if (HONORIFIC_LEFT.test(folded)) { skip("honorific formula left in the excerpt"); continue; }
    if (quotesQuran(text)) { skip("the excerpt carries Qur'an text"); continue; }
    const ex = judge(folded);
    if (!ex.topics.length) { skip("excerpt lost the signal"); continue; }
    const key = folded.slice(0, 120);
    if (seen.some((t) => t.includes(key.slice(20, 100)))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const says = ex.topics.map((t) => SAYS[t]);
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = {
      ar: `${book.ar} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، يذكر ${says.map((s) => s[0]).join("، و")}. يجمعه متصفح الأبوة في الإسلام مع نصوص القرآن والسنة والسيرة والكتب في هذا الباب.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, that mentions ${says.map((s) => s[1]).join(", ")}. The Fatherhood in Islam Browser lists it with the texts of the Qur'an, the Sunnah, the seerah and the books on the father.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے۔ اسلام میں ابوبت کا براؤزر اسے قرآن، سنت، سیرت اور کتابوں کی متعلقہ نصوص کے ساتھ جمع کرتا ہے۔`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const ref = h.reference?.book !== undefined ? ` (book ${h.reference.book} hadith ${h.reference.hadith})` : "";
    const weakOnly = ex.signals.every((s) => WEAK_ONLY.has(s));
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
      ...uniq(ex.topics.map((t) => TARGETS[t])).map((t) => `  - { type: mentions, target: ${t}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words chosen by the fatherhood detector (scripts/ubuwwa.ts)${weakOnly ? ", its only signal a father-context child word" : ""}, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "ubuwwa-hadithapi-1" }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the hadith-api Arabic edition; label and summary are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    written++;
    perBook[book.prefix] = (perBook[book.prefix] ?? 0) + 1;
  }
}
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook);
console.log("skipped", why);
