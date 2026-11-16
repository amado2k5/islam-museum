/**
 * Harvest the hadith reports that speak of testaments and parting counsels, last hours, estates,
 * relics and graves from the hadith-api Arabic editions (fawazahmed0/hadith-api, Unlicense) into
 * data/passage/, for the Testaments Browser (docs/plan/62-wasaya-browser.md). Adapted from
 * scripts/harvest-qiraat-hadithapi.ts.
 *
 * Every candidate is gated by the same detector the browser uses (scripts/wasaya.ts). A hit that
 * is only a date reckoned from the Prophet's death or a cemetery named as a landmark is not
 * enough. A report already in the graph is skipped, and so is a repeat of the same wording inside
 * one collection. Records follow the hadith-api harvest convention: a matn excerpt of at most 55
 * words centred on the first hit, honorific formulas left out, and provenance naming the edition
 * and the hadith. Qur'an text is never typed here: an excerpt that carries the Qur'an's brackets or
 * Uthmani letters is skipped, as is one that shares four consecutive words with a verse of the
 * frozen Tanzil text in data/passage/quran-*.yaml.
 *
 * Whole chapters: every report of each collection's book of testaments (the section the edition
 * names Wills, Testaments, Bequests or Wasaya) is taken, topic "wasiyya", even where the lexicon
 * does not fire.
 *
 * Usage: npx tsx scripts/harvest-wasaya-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { wasayaFold, wasayaMatchesOfText, type WasayaTopic } from "./wasaya.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-wasaya-hadithapi.ts <dir> [--dry]");

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

/** What each topic says, for the label and the summary, in the three languages. */
const SAYS: Record<WasayaTopic, [string, string, string]> = {
  wasiyya: ["وصية أو عهد أخير", "a testament or parting counsel", "وصیت یا آخری نصیحت"],
  ihtidar: ["ساعة الاحتضار والوفاة", "a deathbed and last hours", "وقتِ وفات اور آخری لمحات"],
  mirath: ["ما خلّفه من تركة وميراث", "what was left behind: estate and inheritance", "ترکہ اور میراث"],
  athar: ["أثر من الآثار المحفوظة", "a relic kept after its owner", "محفوظ آثار و تبرکات"],
  marqad: ["دفن وقبر ومرقد", "a burial, grave or resting place", "تدفین، قبر اور مرقد"],
};
const TARGETS: Record<WasayaTopic, string> = {
  wasiyya: "concept/al-wasiyya", ihtidar: "concept/ihtidar", mirath: "concept/tarika-estate", athar: "concept/tabarruk", marqad: "concept/ziyarat-al-qubur",
};
/** Hits that say too little on their own in a hadith: a date reckoned from the Prophet's death, a cemetery as a landmark. */
const NARRATOR_NAMES = new Set(["توفي رسول الله", "قبض رسول الله", "البقيع", "بالبقيع", "المقبره", "مقبره", "المقابر", "عند موته", "عند وفاته", "قبل وفاته", "استوصوا", "تركت فيكم"]);
/** Whole chapters taken in full: the books of testaments (wasaya) of each collection, by their English section name in the edition. */
const VIRTUES = /\b(wills?|testaments?|bequests?|wasaya|wasiyyah?)\b/i;
const VIRTUES_EXTRA: [RegExp, WasayaTopic][] = [[/./, "wasiyya"]];
const FORCED: Record<string, [number, number, string, string, string]> = {};

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
/** Honorific formulas the cleaner does not cut: such an excerpt is skipped, not repaired. */
const HONORIFIC_LEFT = /رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ/;

/** Every run of four consecutive words of the Qur'an (frozen Tanzil text in the museum's verse passages). */
const norm = (w: string) => wasayaFold(w).replace(/[^ء-ي]/g, "");
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

/** The topics of a text, the narrator-name hits taken out. */
function judge(folded: string): { topics: WasayaTopic[]; hits: string[] } {
  const m = wasayaMatchesOfText(folded);
  const topics: WasayaTopic[] = [];
  const hits: string[] = [];
  for (const [t, ws] of Object.entries(m) as [WasayaTopic, string[]][]) {
    const real = ws.filter((w) => !NARRATOR_NAMES.has(w));
    if (!real.length) continue;
    topics.push(t);
    hits.push(...real);
  }
  return { topics, hits };
}

/** A window of at most 55 words around the first hit (or, with none, the end of the report, where the matn is). */
function excerptOf(full: string, hit?: string): string {
  const words = full.split(" ").filter(Boolean);
  if (words.length <= 55) return full;
  let start: number;
  if (hit) {
    const folded = wasayaFold(words.join(" "));
    const at = Math.max(0, folded.indexOf(hit));
    const hitWord = Math.min(words.length - 1, folded.slice(0, at + 1).split(" ").length - 1);
    start = Math.max(0, hitWord - 18);
  } else start = Math.max(0, words.length - 55);
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
const forcedExisting: string[] = [];
const forcedPerBook: Record<string, number> = {};
for (const book of BOOKS) {
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const forced = FORCED[book.prefix];
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    const num = Number(h.hadithnumber);
    const isForced = !!forced && Number.isInteger(num) && num >= forced[0] && num <= forced[1];
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const inVirtues = !!secEn && VIRTUES.test(secEn);
    const fullFolded = wasayaFold(clean(h.text));
    let { topics } = judge(fullFolded);
    if (inVirtues) for (const [re, t] of VIRTUES_EXTRA) if (re.test(fullFolded) && !topics.includes(t)) topics.push(t);
    if (!topics.length && !isForced) continue;
    if (isForced && !topics.length) topics = ["wasiyya"];
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (isForced) forcedPerBook[book.prefix] = (forcedPerBook[book.prefix] ?? 0) + 1;
    if (existsSync(file)) {
      seen.push(wasayaFold(excerptOf(clean(h.text))));
      skip("an api record of this hadith exists");
      if (isForced) forcedExisting.push(id);
      continue;
    }
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); if (isForced) forcedExisting.push(`passage/${book.prefix}-${std}`); continue; }
    // the excerpt: centred on the first real hit; for a forced report with no hit, the end of the report
    const firstHit = judge(fullFolded).hits[0];
    const text = excerptOf(clean(h.text), firstHit);
    const folded = wasayaFold(text);
    if (HONORIFIC_LEFT.test(folded)) { skip("honorific formula left in the excerpt"); continue; }
    if (quotesQuran(text)) { skip("the excerpt carries Qur'an text"); continue; }
    const ex = judge(folded);
    let exTopics = ex.topics;
    if (inVirtues) for (const [re, t] of VIRTUES_EXTRA) if (re.test(folded) && !exTopics.includes(t)) exTopics.push(t);
    if (!exTopics.length) {
      if (!isForced) { skip("excerpt lost the signal"); continue; }
      exTopics = ["wasiyya"];
    }
    const key = folded.slice(0, 120);
    if (!isForced && seen.some((t) => t.includes(key.slice(20, 100)))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const says = exTopics.map((t) => SAYS[t]);
    const kitab = isForced ? forced : null;
    const label = {
      ar: kitab ? `${book.ar} ${h.hadithnumber} — ${kitab[2]}، ${says[0][0]}` : `${book.ar} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: kitab ? `${book.en} ${h.hadithnumber} — ${kitab[3]}; ${says[0][1]}` : `${book.en} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: kitab ? `${book.ur} ${h.hadithnumber} — ${kitab[4]}، ${says[0][2]}` : `${book.ur} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، يذكر ${says.map((s) => s[0]).join("، و")}. يجمعه متصفح الوصايا والمواريث والآثار والمراقد مع نصوص القرآن والسنة والسيرة والكتب في هذا الباب.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, that mentions ${says.map((s) => s[1]).join(", ")}. The Testaments Browser lists it with the texts of the Qur'an, the Sunnah, the seerah and the books on testaments, last hours, estates, relics and graves.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے۔ وصایا، ترکہ، آثار اور مراقد کا براؤزر اسے قرآن، سنت، سیرت اور کتابوں کی متعلقہ نصوص کے ساتھ جمع کرتا ہے۔`,
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
      ...uniq(exTopics.map((t) => TARGETS[t])).map((t) => `  - { type: mentions, target: ${t}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words chosen by the testaments detector (scripts/wasaya.ts)${isForced ? "; the whole chapter is taken" : ""}, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "wasaya-hadithapi-1" }`,
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
console.log("whole chapters taken, reports seen", forcedPerBook);
if (forcedExisting.length) console.log(`${forcedExisting.length} reports of the whole chapters were already records (check they fire the detector, or tag them wasaya-browser):`, forcedExisting.join(" "));
