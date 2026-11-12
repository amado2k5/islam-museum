/**
 * Write passage records for the seerah and merit books' pages that count, write, multiply,
 * erase, weigh or reckon a deed (Hasanat and Sayyi'at Ledger, docs/plan/50-hisab-browser.md).
 * The pages were found by the detector (scripts/hisab.ts) over OCR text and then read and
 * vetted one by one; this script turns each vetted page into a record with a cited page number
 * and an excerpt of at most 40 words centred on the counting words (sources policy).
 *
 * Usage: npx tsx scripts/harvest-hisab-seerah.ts <pages dir> <spec.json> [--dry]
 *   spec.json: { "<tag>": [page, ...] }  with tags below.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { hisabFold, hisabMatchesOfText, hisabSignalsOfText, hisabKindsOfSignals } from "./hisab.js";

const [PAGES_DIR, SPEC] = [process.argv[2], process.argv[3]];
const DRY = process.argv.includes("--dry");
if (!PAGES_DIR || !SPEC) throw new Error("usage: harvest-hisab-seerah.ts <pages dir> <spec.json> [--dry]");

interface Book { dir: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string }
const BOOKS: Record<string, Book> = {
  H: { dir: "sira-ibn-hisham/20251231_20251231_0914", prefix: "sira-ibn-hisham", work: "work/sira-ibn-ishaq-ibn-hisham", source: "source/ibn-hisham-dar-ibn-hazm", ar: "السيرة النبوية لابن هشام", en: "Ibn Hisham's Sirah", ur: "سیرت ابن ہشام" },
  W: { dir: "maghazi-waqidi/AlMaghaziAlwaghidi", prefix: "maghazi-waqidi", work: "work/kitab-al-maghazi", source: "source/al-waqidi-maghazi", ar: "كتاب المغازي للواقدي", en: "al-Waqidi's Kitab al-Maghazi", ur: "کتاب المغازی للواقدی" },
  Z: { dir: "zad-maad/20200822_20200822_1205", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad", ar: "زاد المعاد لابن القيم", en: "Ibn al-Qayyim's Zad al-Ma'ad", ur: "زاد المعاد، ابن القیم" },
  U: { dir: "uyun-athar/oyoun-athar-ibn-sayd-nass", prefix: "uyun-athar", work: "work/uyun-al-athar", source: "source/uyun-al-athar-sharqawi-1993", ar: "عيون الأثر لابن سيد الناس", en: "Ibn Sayyid al-Nas's Uyun al-Athar", ur: "عیون الاثر، ابن سید الناس" },
  K: { dir: "sira-nabawiyya-ibn-kathir/sirah-ibn-kathir", prefix: "sira-nabawiyya-ibn-kathir", work: "work/al-sira-al-nabawiyya-ibn-kathir", source: "source/al-bidaya-wal-nihaya", ar: "السيرة النبوية لابن كثير", en: "Ibn Kathir's Sira", ur: "سیرت نبویہ، ابن کثیر" },
  R: { dir: "rawd-unuf/Rawd_Al_Enf_Siheili", prefix: "rawd-unuf", work: "work/al-rawd-al-unuf", source: "source/al-rawd-al-unf", ar: "الروض الأنف للسهيلي", en: "al-Suhayli's al-Rawd al-Unuf", ur: "الروض الانف، سہیلی" },
  B: { dir: "dalail-nubuwwa-bayhaqi/311Pdf219", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi", ar: "دلائل النبوة للبيهقي", en: "al-Bayhaqi's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، بیہقی" },
  N: { dir: "dalail-nubuwwa-abu-nuaym/20200129_20200129_1406", prefix: "dalail-nubuwwa-abu-nuaym", work: "work/dalail-al-nubuwwa-abu-nuaym", source: "source/dalail-al-nubuwwa-abu-nuaym", ar: "دلائل النبوة لأبي نعيم", en: "Abu Nu'aym's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، ابو نعیم" },
};
const SAYS: Record<string, [string, string, string]> = {
  "count-hasanat": ["عدد الحسنات", "a stated number of good deeds", "نیکیوں کی مقررہ تعداد"],
  tenfold: ["مضاعفة الحسنة", "the good deed multiplied", "نیکی کا کئی گنا ہونا"],
  multiply: ["مضاعفة الأجر", "the reward multiplied", "اجر کا بڑھنا"],
  "written-hasana": ["كتابة الحسنات", "the writing of good deeds", "نیکیوں کا لکھا جانا"],
  degree: ["رفع الدرجات", "ranks raised", "درجات کی بلندی"],
  "qirat-reward": ["قيراط الأجر", "the qirat of reward", "اجر کا قیراط"],
  equivalence: ["عمل يعدل عملا أعظم", "a deed that equals a greater one", "ایک عمل جو بڑے عمل کے برابر ہے"],
  "two-rewards": ["الأجران", "the double reward", "دوہرا اجر"],
  "count-sayyia": ["عدد السيئات", "a stated number of bad deeds", "برائیوں کی تعداد"],
  "written-sayyia": ["كتابة السيئات", "the writing of bad deeds", "برائیوں کا لکھا جانا"],
  "qirat-loss": ["نقص قيراط من الأجر", "a qirat lost from the reward", "اجر سے قیراط کی کمی"],
  burden: ["وزر من تبع", "bearing the burden of those who follow", "پیروی کرنے والوں کا بوجھ"],
  bankrupt: ["المقاصة بالحسنات", "deeds settled between people", "نیکیوں سے بدلہ چکانا"],
  erased: ["محو السيئات وحط الخطايا", "bad deeds erased and sins shed", "برائیوں کا مٹنا"],
  exchanged: ["إبدال السيئة حسنة", "a bad deed exchanged for a good one", "برائی کا نیکی سے بدلنا"],
  "forgiven-past": ["مغفرة الذنب", "forgiveness of sins", "گناہوں کی مغفرت"],
  scale: ["الميزان", "the Scale", "میزان"],
  record: ["كتاب الأعمال والكاتبون", "the record of deeds and its scribes", "نامۂ اعمال اور لکھنے والے"],
  reckoning: ["الحساب", "the reckoning", "حساب"],
};
const q = (s: string) => JSON.stringify(s);
const MAXW = 40;

const HON = /(?:ﷺ|(?:صلى|صلي|صل)\s+(?:الله|اللاه|اله)\s+عليه(?:\s+(?:وعلى\s+آله\s+)?وسلم)?|(?:رضي|رضى)\s+(?:الله|اللاه)\s+عن(?:ه|ها|هما|هم)|عليه\s+السلام|رحمه\s+الله|تعالى\s+عنه)/g;
/** The honorifics are rendered by the UI and the validator rejects them; bare parentheses are dropped (Arabic-parenthesis rule). */
const clean = (s: string) => s.replace(/[\u064B-\u065F\u0670]*/g, (m) => m).replace(HON, "").replace(/[()\u2066\u2069﴿﴾]/g, "").replace(/\s+/g, " ").trim();

/** At most 40 words of the raw page, centred on the first counting words. */
function excerptOf(raw: string): string {
  const words = raw.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= MAXW) return words.join(" ");
  const folded: string[] = [];
  const at: number[] = [];
  words.forEach((w, i) => { const f = hisabFold(w); if (f) for (const part of f.split(" ")) { folded.push(part); at.push(i); } });
  const text = folded.join(" ");
  const ms = hisabMatchesOfText(text);
  const first = ms.length ? Math.min(...ms.map((m) => m.index)) : 0;
  const hit = at[Math.min(text.slice(0, first).split(" ").length - 1, at.length - 1)] ?? 0;
  let start = Math.max(0, hit - 14);
  const end = Math.min(words.length, start + MAXW);
  start = Math.max(0, end - MAXW);
  return (start > 0 ? "… " : "") + words.slice(start, end).join(" ") + (end < words.length ? " …" : "");
}

const spec: Record<string, number[]> = JSON.parse(readFileSync(SPEC, "utf8"));
let written = 0;
const skipped: string[] = [];
for (const [tag, pagesList] of Object.entries(spec)) {
  const book = BOOKS[tag];
  if (!book) { skipped.push(`${tag}: unknown tag`); continue; }
  const pages: { page: number; text: string }[] = JSON.parse(readFileSync(join(PAGES_DIR, book.dir, "pages.json"), "utf8"));
  for (const no of pagesList) {
    const page = pages.find((p) => p.page === no);
    const slug = `${book.prefix}-hisab-${no}`;
    const file = `data/passage/${slug}.yaml`;
    if (!page?.text) { skipped.push(`${slug}: no page text`); continue; }
    if (existsSync(file)) { skipped.push(`${slug}: exists`); continue; }
    const text = excerptOf(clean(page.text));
    const signals = hisabSignalsOfText(hisabFold(text));
    if (!signals.length) { skipped.push(`${slug}: excerpt lost the signal`); continue; }
    const kinds = hisabKindsOfSignals(signals);
    const says = signals.map((s) => SAYS[s]).filter(Boolean);
    const lab = (i: 0 | 1 | 2, join: string) => says.slice(0, 2).map((s) => s[i]).join(join);
    const names = [book.ar, book.en, book.ur];
    const src = `[${book.source}]`;
    const rels = [`  - { type: mentions, target: concept/hisab-al-hasanat-wal-sayyiat, sources: ${src} }`];
    if (kinds.includes("hasanat")) rels.push(`  - { type: mentions, target: concept/al-hasanat, sources: ${src} }`);
    if (kinds.includes("sayyiat") || kinds.includes("erasure")) rels.push(`  - { type: mentions, target: concept/al-sayyiat, sources: ${src} }`);
    const yaml = [
      `id: passage/${slug}`,
      `class: passage`,
      `unit: chapter`,
      `work: ${book.work}`,
      `ref: "${no}"`,
      `label: { ar: ${q(`${names[0]} ص ${no} — ${lab(0, "، ")}`)}, en: ${q(`${names[1]}, p. ${no} — ${lab(1, "; ")}`)}, ur: ${q(`${names[2]} ص ${no} — ${lab(2, "، ")}`)} }`,
      `text: ${q(text)}`,
      `summary:`,
      `  ar: ${q(`مقطع من ${names[0]}، ص ${no}، يذكر ${says.map((s) => s[0]).join("، و")}؛ من النسخة المستخرجة، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر.`)}`,
      `  en: ${q(`An excerpt from ${names[1]}, p. ${no}, that speaks of ${says.map((s) => s[1]).join(", ")}; from the extracted copy, quoted within forty words per the sources policy.`)}`,
      `  ur: ${q(`${names[2]} کے صفحہ ${no} کا اقتباس جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے؛ نکالی گئی نقل سے، چالیس الفاظ کی حد میں۔`)}`,
      `relations:`,
      ...rels,
      `provenance: { layer: own-research, source: ${q(`${book.ar} ص ${no} — صفحة معدودة العمل، مفحوصة بالكاشف ومراجعة يدويا؛ مقتطف أقل من أربعين كلمة`)}, generated_by: "Claude (claude-sonnet-5-5)", model: "claude-sonnet-5-5", run: "hisab-seerah-1" }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Claude (claude-sonnet-5-5) from the OCR'd book; label, summary and excerpt are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    written++;
  }
}
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}; skipped ${skipped.length}`);
for (const s of skipped) console.log("  " + s);
