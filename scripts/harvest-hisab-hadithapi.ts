/**
 * Harvest the hadith reports that count, write, multiply, erase, weigh or reckon good and bad
 * deeds from the hadith-api Arabic editions (fawazahmed0/hadith-api, Unlicense) into
 * data/passage/, for the Hasanat and Sayyi'at Ledger (docs/plan/50-hisab-browser.md).
 *
 * Every candidate is gated by the same detector the ledger uses (scripts/hisab.ts), so only
 * passages the page will show become records. A report already in the graph (same collection,
 * same matched words) is skipped. Records follow the hadith-api harvest convention: a matn
 * excerpt of at most 55 words centred on the counting words, honorific formulas left out, and
 * provenance naming the edition and the hadith.
 *
 * Usage: npx tsx scripts/harvest-hisab-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { hisabFold, hisabMatchesOfText, hisabSignalsOfText, hisabKindsOfSignals } from "./hisab.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-hisab-hadithapi.ts <dir> [--dry]");

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
  "count-hasanat": ["عدد الحسنات", "a stated number of good deeds", "نیکیوں کی مقررہ تعداد"],
  tenfold: ["مضاعفة الحسنة بعشر أمثالها", "the good deed multiplied tenfold and beyond", "نیکی کا دس گنا اور اس سے زیادہ بڑھنا"],
  multiply: ["مضاعفة الأجر", "the reward doubled or multiplied", "اجر کا دوگنا یا کئی گنا ہونا"],
  "written-hasana": ["كتابة الحسنات", "the writing of good deeds", "نیکیوں کا لکھا جانا"],
  degree: ["رفع الدرجات", "ranks raised", "درجات کی بلندی"],
  "qirat-reward": ["قيراط الأجر", "the qirat of reward", "اجر کا قیراط"],
  equivalence: ["عمل يعدل عملا أعظم منه", "a deed that equals a greater one", "ایک عمل جو بڑے عمل کے برابر ہے"],
  "two-rewards": ["الأجران", "the double reward", "دوہرا اجر"],
  "count-sayyia": ["عدد السيئات", "a stated number of bad deeds", "برائیوں کی تعداد"],
  "written-sayyia": ["كتابة السيئات", "the writing of bad deeds", "برائیوں کا لکھا جانا"],
  "qirat-loss": ["نقص قيراط من الأجر كل يوم", "a qirat lost from the reward each day", "ہر روز اجر سے ایک قیراط کی کمی"],
  burden: ["وزر من تبع", "bearing the burden of those who follow", "پیروی کرنے والوں کا بوجھ"],
  bankrupt: ["المقاصة بالحسنات والسيئات", "deeds settled between people", "نیکیوں اور برائیوں سے بدلہ چکانا"],
  erased: ["محو السيئات وحط الخطايا", "bad deeds erased and sins shed", "برائیوں کا مٹنا اور خطاؤں کا جھڑنا"],
  exchanged: ["إبدال السيئة حسنة", "a bad deed exchanged for a good one", "برائی کا نیکی سے بدل جانا"],
  "forgiven-past": ["مغفرة ما تقدم من الذنب", "forgiveness of past sins", "پچھلے گناہوں کی مغفرت"],
  scale: ["الميزان", "the Scale", "میزان"],
  record: ["كتاب الأعمال والملائكة الكاتبون", "the record of deeds and the recording angels", "نامۂ اعمال اور لکھنے والے فرشتے"],
  reckoning: ["الحساب", "the reckoning", "حساب"],
};

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

/** A window of at most 55 raw words around the first matched counting words. */
function excerptOf(full: string): string {
  const words = full.split(/\s+/).filter(Boolean);
  if (words.length <= 55) return full;
  const folded: string[] = [];
  const at: number[] = [];
  words.forEach((w, i) => { const f = hisabFold(w); if (f) for (const part of f.split(" ")) { folded.push(part); at.push(i); } });
  const text = folded.join(" ");
  const ms = hisabMatchesOfText(text);
  const first = ms.length ? Math.min(...ms.map((m) => m.index)) : 0;
  const tokenIdx = text.slice(0, first).split(" ").length - 1;
  const hitWord = at[Math.min(tokenIdx, at.length - 1)] ?? 0;
  let start = Math.max(0, hitWord - 16);
  const end = Math.min(words.length, start + 55);
  start = Math.max(0, end - 55);
  return (start > 0 ? "… " : "") + words.slice(start, end).join(" ") + (end < words.length ? " …" : "");
}

const q = (s: string) => JSON.stringify(s);

// Texts already in the graph, per collection prefix, to skip a report that is already a record.
const existing = new Map<string, string[]>();
for (const f of readdirSync(OUT_DIR)) {
  const book = BOOKS.find((b) => f.startsWith(`${b.prefix}-`));
  if (!book) continue;
  const y = readFileSync(join(OUT_DIR, f), "utf8");
  const m = y.match(/^text_search:\s*"?(.*?)"?$/m) ?? y.match(/^text:\s*"?(.*?)"?$/m);
  if (m) (existing.get(book.prefix) ?? existing.set(book.prefix, []).get(book.prefix)!).push(hisabFold(m[1]));
}

const siblings = new Set<string>();
for (const f of readdirSync(OUT_DIR)) {
  const m = f.match(/^(bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah)-0*(\d+)[a-z]?\.yaml$/);
  if (m) siblings.add(`${m[1]}-${m[2]}`);
}
let written = 0;
const skipped: string[] = [];
const perBook: Record<string, number> = {};
for (const book of BOOKS) {
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const have = existing.get(book.prefix) ?? [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    const foldedFull = hisabFold(h.text);
    if (!hisabSignalsOfText(foldedFull).length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-"); // a few editions number a sub-report 3604.04
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    if (existsSync(file)) { skipped.push(`${id}: exists`); continue; }
    // the same hadith number may already be a record under the collection's plain id
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skipped.push(`${id}: already in the graph`); continue; }
    const text = excerptOf(clean(h.text));
    const folded = hisabFold(text);
    const signals = hisabSignalsOfText(folded);
    if (!signals.length) { skipped.push(`${id}: excerpt lost the signal`); continue; }
    const probe = hisabMatchesOfText(folded)[0];
    const key = folded.slice(Math.max(0, probe.index - 45), probe.index + probe.match.length + 10);
    if (have.some((t) => t.includes(key))) { skipped.push(`${id}: already in the graph`); continue; }
    have.push(folded);
    const kinds = hisabKindsOfSignals(signals);
    const says = signals.map((s) => SAYS[s]).filter(Boolean);
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = {
      ar: `${book.ar} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، يذكر ${says.map((s) => s[0]).join("، و")}. تجمعه قائمة الحسنات والسيئات مع النصوص التي تعدّ العمل أو تكتبه أو تمحوه أو تزنه.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, that speaks of ${says.map((s) => s[1]).join(", ")}. The Hasanat and Sayyi'at Ledger lists it with the texts that count, write, erase or weigh a deed.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے۔ حسنات و سیئات کی فہرست اسے ان نصوص کے ساتھ جمع کرتی ہے جو عمل کو گنتے، لکھتے، مٹاتے یا تولتے ہیں۔`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const rels = [`  - { type: mentions, target: concept/hisab-al-hasanat-wal-sayyiat, sources: ${src} }`];
    if (kinds.includes("hasanat")) rels.push(`  - { type: mentions, target: concept/al-hasanat, sources: ${src} }`);
    if (kinds.includes("sayyiat") || kinds.includes("erasure")) rels.push(`  - { type: mentions, target: concept/al-sayyiat, sources: ${src} }`);
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
      ...rels,
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "hisab-hadithapi-1" }`,
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
console.log(`skipped ${skipped.length}`);
const why: Record<string, number> = {};
for (const s of skipped) { const k = s.split(": ")[1]; why[k] = (why[k] ?? 0) + 1; }
console.log(why);
