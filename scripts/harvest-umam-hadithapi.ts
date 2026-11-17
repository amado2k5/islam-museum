/**
 * Harvest the hadith reports that name the non-Muslim nations, religions, sects and peoples from
 * the hadith-api Arabic editions (fawazahmed0/hadith-api, Unlicense) into data/passage/, for the
 * Umam Browser (docs/plan/67-umam-browser.md). Adapted from scripts/harvest-wasaya-hadithapi.ts.
 *
 * Every candidate is gated by the same detector the browser uses (scripts/umam.ts
 * umamMatchesOfText), whose patterns are all strong names, so no weak-word list is needed. A
 * report already in the graph is skipped, and so is a repeat of the same wording inside one
 * collection. Records follow the hadith-api harvest convention: a matn excerpt of at most 55
 * words centred on the first hit, honorific formulas left out, and provenance naming the edition
 * and the hadith. Qur'an text is never typed here: an excerpt that carries the Qur'an's brackets
 * or Uthmani letters is skipped, as is one that shares four consecutive words with a verse of the
 * frozen Tanzil text in data/passage/quran-*.yaml.
 *
 * Usage: npx tsx scripts/harvest-umam-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { umamFold, umamMatchesOfText } from "./umam.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-umam-hadithapi.ts <dir> [--dry]");

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

const SAYS: [string, string, string] = ["ذكر أمم وأديان وشعوب غير مسلمة", "mentions of non-Muslim nations, religions and peoples", "غیر مسلم امتوں، ادیان اور اقوام کا ذکر"];
const MAX_TARGETS = 8;

const HONORIFICS = /\s*(?:صلى\s+الله\s+عليه\s+وسلم|صلى\s+الله\s+عليه\s+وآله\s+وسلم|رضى\s+الله\s+عن(?:ه|ها|هما|هم)|رضي\s+الله\s+عن(?:ه|ها|هما|هم)|عليه\s+السلام|عليهما\s+السلام|عليهم\s+السلام|رحمه\s+الله)/g;
const MARKS = /[ً-ٰٟۖ-ۭـ]/;
/** Drop honorific formulas (the UI renders them) and the edition's directional marks. */
function clean(raw: string): string {
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
const norm = (w: string) => umamFold(w).replace(/[^ء-ي]/g, "");
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

/** A window of at most 55 words around the first detected name. */
function excerptOf(full: string, hit?: string): string {
  const words = full.split(" ").filter(Boolean);
  if (words.length <= 55) return full;
  let start: number;
  if (hit) {
    const folded = umamFold(words.join(" "));
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
for (const book of BOOKS) {
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    const num = Number(h.hadithnumber);
    void num;
    const fullFolded = umamFold(clean(h.text));
    const targets = umamMatchesOfText(fullFolded);
    if (!targets.length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (existsSync(file)) { skip("an api record of this hadith exists"); continue; }
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    const firstHit = targets[0].split("/").pop();
    const text = excerptOf(clean(h.text), firstHit);
    const folded = umamFold(text);
    if (HONORIFIC_LEFT.test(folded)) { skip("honorific formula left in the excerpt"); continue; }
    if (quotesQuran(text)) { skip("the excerpt carries Qur'an text"); continue; }
    const exTargets = umamMatchesOfText(folded);
    if (!exTargets.length) { skip("excerpt lost the signal"); continue; }
    const key = folded.slice(0, 120);
    if (seen.some((t) => t.includes(key.slice(20, 100)))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = {
      ar: `${book.ar} ${h.hadithnumber} — ${SAYS[0]}`,
      en: `${book.en} ${h.hadithnumber} — ${SAYS[1]}`,
      ur: `${book.ur} ${h.hadithnumber} — ${SAYS[2]}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، فيه ${SAYS[0]}. يجمعه متصفح الأمم والأديان والطوائف والشعوب غير المسلمة مع نصوص القرآن والسنة والسيرة والكتب في هذا الباب.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, with ${SAYS[1]}. The Umam Browser lists it with the texts of the Qur'an, the Sunnah, the seerah and the books on the non-Muslim nations, religions, sects and peoples.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${SAYS[2]} ہے۔ غیر مسلم امتوں، ادیان، فرقوں اور اقوام کا براؤزر اسے قرآن، سنت، سیرت اور کتابوں کی متعلقہ نصوص کے ساتھ جمع کرتا ہے۔`,
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
      ...uniq(exTargets).slice(0, MAX_TARGETS).map((t) => `  - { type: mentions, target: ${t}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words chosen by the umam detector (scripts/umam.ts), honorific formulas left out`)}, generated_by: "Devin (SWE-2 Medium)", model: "swe-2-medium", run: "umam-hadithapi-1" }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Devin (SWE-2 Medium) from the hadith-api Arabic edition; label and summary are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    written++;
    perBook[book.prefix] = (perBook[book.prefix] ?? 0) + 1;
  }
}
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook);
console.log("skipped", why);
