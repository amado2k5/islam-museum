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
    if (existsSync(file)) { skip("an api record of this hadith exists"); continue; }
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
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook);
console.log("skipped", why);
