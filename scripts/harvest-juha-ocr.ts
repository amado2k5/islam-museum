/**
 * Harvest the passages that carry Juha, the wits and fools, anecdotes (نوادر), jests and laughter
 * from books already OCR'd on the harvest drive (Apple Vision text in <book>/<scan>/pages.json)
 * into data/passage/, for the Juha and Islamic Folklore Browser (docs/plan/72-juha-browser.md).
 * Adapted from scripts/harvest-umam-ocr.ts with the same safety rules: no PDF, OCR text or page
 * image enters git — only an excerpt of at most 40 words per page, cited to the work and the scan
 * page (docs/sources-policy.md). Qur'an text is never typed: a window is skipped when it carries
 * a quotation marker or shares four consecutive words with a verse. Windows the OCR garbled, and
 * windows with an honorific formula the cleaner cannot cut, are skipped. A book whose work or
 * source record is missing is skipped, so a book harvested later is added by one line in BOOKS.
 *
 * Two modes:
 *   books  — every book in BOOKS: the best 40-word window per page by the browser's own detector
 *            (scripts/juha.ts juhaSignalsOfText), the strongest pages of each book up to its cap.
 *   juha   — Nawadir Juha al-Kubra anecdote by anecdote, from the anecdote table read off the OCR
 *            (<rows.json>) and its five-language titles and retellings (<out-N.json>).
 *
 * Usage: npx tsx scripts/harvest-juha-ocr.ts <harvest books dir> [--dry] [--only <prefix>]
 *        npx tsx scripts/harvest-juha-ocr.ts <harvest books dir> --juha <dir with rows.json and out-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { juhaFold, juhaSignalsOfText, juhaKindOfSignals, type JuhaKind } from "./juha.js";

const ROOT = process.argv[2];
const DRY = process.argv.includes("--dry");
const arg = (k: string) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : null);
const ONLY = arg("--only");
const JUHA_DIR = arg("--juha");
const OUT_DIR = "data/passage";
if (!ROOT || ROOT.startsWith("--")) throw new Error("usage: harvest-juha-ocr.ts <books dir> [--dry] [--only <prefix>] [--juha <dir>]");

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
type Lang = (typeof LANGS)[number];
type L5 = Record<Lang, string>;

/** `scans`: only these scan folders (the humour volume of a multi-volume set); `sources`: one source per scan, in scan order. */
interface Book { dir: string; prefix: string; work: string; source: string; cap: number; scans?: string[]; sources?: string[] }
const BOOKS: Book[] = [
  // The adab shelf: the books that collect the nawadir.
  { dir: "adab-zuhd/nihayat-al-arab", prefix: "nihayat-al-arab", work: "work/nihayat-al-arab-fi-funun-al-adab", source: "source/nihayat-al-arab-nuwayri-vol4-scan", cap: 80, scans: ["nefa04"] },
  { dir: "adab-zuhd/mustatraf", prefix: "mustatraf", work: "work/al-mustatraf", source: "source/al-mustatraf-abshihi-scan-vol1", cap: 60 },
  { dir: "adab-zuhd/uyun-akhbar", prefix: "uyun-akhbar", work: "work/uyun-al-akhbar", source: "source/uyun-al-akhbar-dar-al-kutub-1996", cap: 80 },
  { dir: "adab-zuhd/bayan-tabyin-jahiz", prefix: "bayan-tabyin", work: "work/al-bayan-wa-al-tabyin", source: "source/bayan-tabyin-harun-khanji-1998", cap: 50, scans: ["al-Jahiz"] },
  { dir: "adab-zuhd/hayawan-jahiz", prefix: "hayawan-jahiz", work: "work/kitab-al-hayawan", source: "source/hayawan-jahiz-ilmiyya-2003-v1", cap: 40, sources: ["source/hayawan-jahiz-ilmiyya-2003-v1", "source/hayawan-jahiz-ilmiyya-2003-v2", "source/hayawan-jahiz-ilmiyya-2003-v3", "source/hayawan-jahiz-ilmiyya-2003-v4"] },
  { dir: "adab-zuhd/ihya-ulum-din", prefix: "ihya", work: "work/ihya-ulum-al-din", source: "source/ihya-shamela-dar-al-marifa", cap: 30 },
  // The seerah, Companion, biography and history shelves.
  { dir: "seerah/sira-ibn-hisham", prefix: "sira-ibn-hisham", work: "work/sira-ibn-ishaq-ibn-hisham", source: "source/ibn-hisham-sira", cap: 15 },
  { dir: "seerah/subul-huda", prefix: "subul-huda", work: "work/subul-al-huda-wa-al-rashad", source: "source/subul-huda-salihi", cap: 25 },
  { dir: "seerah/zad-maad", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad", cap: 15 },
  { dir: "seerah/dalail-nubuwwa-bayhaqi", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi", cap: 12 },
  { dir: "tabaqat/tabaqat-ibn-saad", prefix: "tabaqat-ibn-saad", work: "work/al-tabaqat-al-kubra-ibn-sad", source: "source/tabaqat-ibn-sad", cap: 20 },
  { dir: "sahaba/hilyat-awliya", prefix: "sahaba-hilyat-awliya", work: "work/hilyat-al-awliya", source: "source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988", cap: 15 },
  { dir: "sahaba/hayat-sahaba", prefix: "sahaba-hayat-sahaba", work: "work/hayat-al-sahaba", source: "source/hayat-al-sahaba-kandahlawi-sabbani", cap: 20 },
  { dir: "sahaba/usd-ghaba", prefix: "sahaba-usd-ghaba", work: "work/usd-al-ghaba", source: "source/usd-al-ghaba", cap: 20 },
  { dir: "sahaba/isaba", prefix: "sahaba-isaba", work: "work/al-isaba-fi-tamyiz-al-sahaba", source: "source/isaba", cap: 20 },
  { dir: "sahaba/isti-ab", prefix: "sahaba-isti-ab", work: "work/al-istiab", source: "source/isti-ab-ibn-abd-al-barr", cap: 20 },
  { dir: "hadith/musannaf-ibn-abi-shayba", prefix: "musannaf-ibn-abi-shayba", work: "work/al-musannaf-ibn-abi-shayba", source: "source/al-musannaf-ibn-abi-shayba", cap: 15 },
  { dir: "hadith/fath-bari", prefix: "fath-bari", work: "work/fath-al-bari", source: "source/fath-al-bari", cap: 15 },
  { dir: "tareekh/tarikh-tabari", prefix: "tarikh-tabari", work: "work/tarikh-al-rusul-wa-al-muluk", source: "source/tarikh-al-tabari", cap: 20 },
  { dir: "tareekh/bidaya-nihaya", prefix: "bidaya-nihaya", work: "work/al-bidaya-wal-nihaya", source: "source/al-bidaya-wal-nihaya", cap: 25 },
  { dir: "tareekh/tarikh-islam-dhahabi", prefix: "tarikh-islam-dhahabi", work: "work/tarikh-islam-dhahabi", source: "source/tarikh-islam-dhahabi", cap: 25 },
  { dir: "tareekh/tarikh-dimashq", prefix: "tarikh-dimashq", work: "work/tarikh-dimashq", source: "source/tarikh-dimashq-ibn-asakir-fikr-1995", cap: 20 },
  { dir: "tareekh/wafayat-ayan", prefix: "wafayat-ayan", work: "work/wafayat-al-ayan", source: "source/wafayat-ayan", cap: 30 },
  { dir: "tareekh/muntazam", prefix: "muntazam", work: "work/al-muntazam-ibn-al-jawzi", source: "source/muntazam-ibn-al-jawzi", cap: 25 },
  { dir: "tareekh/muruj-dhahab", prefix: "muruj-dhahab", work: "work/muruj-al-dhahab", source: "source/muruj-al-dhahab", cap: 25 },
  { dir: "tafsir/tafsir-qurtubi", prefix: "tafsir-qurtubi", work: "work/al-jami-li-ahkam-al-quran", source: "source/jami-ahkam-quran-resala-v1", cap: 10 },
];

/** What a detected passage carries, by kind, for the label and the summary. */
const SAYS: Record<JuhaKind, L5> = {
  juha: { ar: "ذكر جحا", en: "a mention of Juha", ur: "جحا کا ذکر", fr: "une mention de Juha", es: "una mención de Juha" },
  wits: { ar: "خبر من أخبار الظرفاء والمغفلين", en: "a report of the wits and the fools", ur: "ظریفوں اور مغفلوں کی ایک خبر", fr: "un récit des beaux esprits et des sots", es: "un relato de ingeniosos y necios" },
  anecdote: { ar: "نادرة أو طرفة", en: "an anecdote or witty tale", ur: "ایک نادرہ یا لطیفہ", fr: "une anecdote ou un trait d'esprit", es: "una anécdota o agudeza" },
  jest: { ar: "مزاح ودعابة", en: "jesting and playfulness", ur: "مزاح اور خوش طبعی", fr: "plaisanterie et badinage", es: "broma y jovialidad" },
  laughter: { ar: "ضحك وتبسم", en: "laughter and smiling", ur: "ہنسی اور تبسم", fr: "rire et sourire", es: "risa y sonrisa" },
  ethics: { ar: "أدب المزاح وحدوده", en: "the ethics and limits of jesting", ur: "مزاح کے آداب اور حدود", fr: "l'éthique et les limites de la plaisanterie", es: "la ética y los límites de la broma" },
};
/** The record each kind points to with a `mentions` edge. */
const TARGET: Record<JuhaKind, string> = {
  juha: "person/juha-abu-al-ghusn", wits: "concept/al-zurafa-wa-al-mughaffalun", anecdote: "concept/al-nawadir",
  jest: "concept/al-muzah", laughter: "concept/al-dahik", ethics: "concept/al-muzah",
};
const WEIGHT: Record<string, number> = { juha: 6, wits_named: 5, nadira: 4, ethics: 4, muzah: 3, wits_type: 3, dahik: 1 };
const PROV = `generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "juha-ocr-1"`;

const HONORIFICS = /\s*(?:صلى\s+الله\s+عليه\s+وسلم|صلى\s+الله\s+عليه\s+وآله\s+وسلم|رضى\s+الله\s+عن(?:ه|ها|هما|هم)|رضي\s+الله\s+عن(?:ه|ها|هما|هم)|عليه\s+السلام|عليهما\s+السلام|عليهم\s+السلام|رحمه\s+الله)/g;
const MARKS = /[ً-ٰٟۖ-ۭـ]/;
/** Drop honorific formulas (the UI renders them) and the edition's directional marks. */
function clean(raw: string): string {
  const map: number[] = [];
  let shadow = "";
  for (let i = 0; i < raw.length; i++) {
    if (MARKS.test(raw[i])) continue;
    shadow += raw[i];
    map.push(i);
  }
  let out = "";
  let at = 0;
  for (const m of shadow.matchAll(HONORIFICS)) {
    const a = map[m.index!];
    const last = m.index! + m[0].length;
    out += raw.slice(at, a);
    at = last < map.length ? map[last] : raw.length;
  }
  out += raw.slice(at);
  return out.replace(/[‎‏‪-‮]/g, "").replace(/\s+([،.])/g, "$1").replace(/\s+/g, " ").trim();
}
const QURAN_MARK = /[﴾﴿{}]|قوله تعالي|قوله تعالى|قال تعالي|قال تعالى|قال الله|عز وجل|قوله سبحانه|قول الله|الآية/;
const HONORIFIC_LEFT = /رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ/;
/** Blessing formulas of a colophon or an opening, which the cleaner does not cut. */
const SALAWAT = /صل[يى] الله|وصل[يى] اللهم|سيدنا محمد|تسليما|كرم الله|قدس سره|تغمده الله|عفا الله عنه|غفر الله له/;
const norm = (w: string) => juhaFold(w).replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");

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
for (const verses of SURAS.values()) {
  const ws = verses.sort((a, b) => a[0] - b[0]).flatMap((v) => v[1]);
  for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
const known = (w: string) => VOCAB.has(w) || VOCAB.has(w.replace(/^[وفبلك]/, "")) || VOCAB.has(w.replace(/^[وفبلك]?ال/, "")) || VOCAB.has(w.replace(/^[وفبلك]?لل/, ""));
const quotesQuran = (ws: string[]) => { for (let i = 0; i + 4 <= ws.length; i++) if (QURAN_4GRAMS.has(ws.slice(i, i + 4).join(" "))) return true; return false; };
const q = (s: string) => JSON.stringify(s);
const l5 = (o: L5) => `{ ${LANGS.map((l) => `${l}: ${q(o[l])}`).join(", ")} }`;
const pageWords = (text: string) => clean(text.replace(/[A-Za-z0-9٠-٩()\[\]«»"*#_=|/\\<>~^`]+/g, " ").replace(/\s+/g, " ")).split(" ").filter(Boolean);

/** Whether a 40-word slice is safe to quote: no verse, no leftover honorific, not garbled. `strict` also asks for known vocabulary. */
function quotable(slice: string[], strict: boolean): boolean {
  const text = slice.join(" ");
  const folded = juhaFold(text);
  const bare = text.replace(/[ً-ٰٟۖ-ۭـ]/g, "");
  if (QURAN_MARK.test(folded) || QURAN_MARK.test(text) || HONORIFIC_LEFT.test(folded) || HONORIFIC_LEFT.test(bare) || SALAWAT.test(bare)) return false;
  if (/[ٱۖ-ۭ]/.test(text)) return false;
  const ws = slice.map(norm).filter(Boolean);
  if (ws.filter((w) => w.length <= 1).length + (slice.length - ws.length) > slice.length * 0.08) return false;
  if (strict && ws.filter(known).length < ws.length * 0.7) return false;
  return !quotesQuran(ws);
}

function workLabel(work: string): L5 {
  const d = parse(readFileSync(`data/${work}.yaml`, "utf8"));
  const out = {} as L5;
  for (const l of LANGS) out[l] = String(d.label?.[l] ?? d.label?.en ?? d.label?.ar).replace(/[\u2066\u2069]/g, "").replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  return out;
}
const TAIL: L5 = {
  ar: "من النسخة المصورة المقروءة آليا، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر. يجمعه متصفح جحا والفلكلور الإسلامي.",
  en: "from the machine-read scan, quoted within forty words per the sources policy. The Juha and Islamic Folklore Browser lists it.",
  ur: "مشینی طور پر پڑھی گئی نقل سے، چالیس الفاظ کی حد میں۔ جحا اور اسلامی لوک ادب کا براؤزر اسے درج کرتا ہے۔",
  fr: "tiré de la numérisation lue par machine, cité dans la limite de quarante mots selon la politique des sources. Le Navigateur de Juha et du folklore islamique le recense.",
  es: "tomado del escaneo leído por máquina, citado dentro de las cuarenta palabras que fija la política de fuentes. El Navegador de Juha y del folclore islámico lo recoge.",
};

function emit(slug: string, o: { work: string; ref: string; label: L5; text: string; summary: L5; targets: string[]; source: string; prov: string; status: string; tags?: string[] }): boolean {
  const file = join(OUT_DIR, `${slug}.yaml`);
  if (existsSync(file)) return false;
  const src = `[${o.source}]`;
  const yaml = [
    `id: passage/${slug}`, `class: passage`, `unit: chapter`, `work: ${o.work}`, `ref: ${q(o.ref)}`,
    ...(o.tags ? [`tags: [${o.tags.join(", ")}]`] : []),
    `label: ${l5(o.label)}`, `text: ${q(o.text)}`, `summary:`, ...LANGS.map((l) => `  ${l}: ${q(o.summary[l])}`),
    `relations:`, ...o.targets.map((t) => `  - { type: mentions, target: ${t}, sources: ${src} }`),
    `provenance: { layer: own-research, source: ${q(o.prov)}, ${PROV} }`, `sources: ${src}`,
    `status: { review: draft, completeness: 1, generated_by: ${q(o.status)} }`, ``,
  ].join("\n");
  if (!DRY) writeFileSync(file, yaml);
  return true;
}

// ---------------------------------------------------------------------------
// Mode `juha`: Nawadir Juha al-Kubra, anecdote by anecdote
// ---------------------------------------------------------------------------
if (JUHA_DIR) {
  const WORK = "work/nawadir-juha-al-kubra";
  const SOURCE = "source/juha-nawadir-kubra-djuwaydi";
  const rows: { i: number; page: number; no: number | null; title_ar: string }[] = JSON.parse(readFileSync(join(JUHA_DIR, "rows.json"), "utf8"));
  const tr = new Map<number, { title: Record<string, string>; summary: L5 }>();
  for (const f of readdirSync(JUHA_DIR).filter((x) => /^out-\d+\.json$/.test(x))) for (const r of JSON.parse(readFileSync(join(JUHA_DIR, f), "utf8"))) tr.set(r.i, r);
  const pages: { page: number; text?: string }[] = JSON.parse(readFileSync(join(ROOT, "adab-zuhd/civ-3027/civ-3027/pages.json"), "utf8"));
  const pageText = new Map(pages.map((p) => [p.page, p.text ?? ""]));
  const book = workLabel(WORK);
  const bad = /[()]/;
  let n = 0, skipped = 0;
  const used = new Set<string>();
  for (const r of rows) {
    const t = tr.get(r.i);
    if (!t) { skipped++; continue; }
    const strip = (s: string) => s.replace(/"/g, "'").replace(/\s+/g, " ").trim();
    if (LANGS.some((l) => !t.summary[l]) || bad.test(t.summary.ar) || bad.test(t.summary.ur) || bad.test(t.title.ur ?? "") || HONORIFIC_LEFT.test(juhaFold(t.summary.ar + t.summary.ur))) { console.error(`skip row ${r.i}: translation fails the text rules`); skipped++; continue; }
    // The excerpt: up to 40 words of the page from the anecdote's printed title on; the first quotable window otherwise.
    const words = pageWords(pageText.get(r.page) ?? "");
    const key = r.title_ar.split(/\s+/).slice(0, 2).map(norm).filter(Boolean);
    let at = -1;
    for (let i = 0; i + key.length <= words.length && at < 0; i++) if (key.every((k, j) => norm(words[i + j]) === k)) at = i;
    let text = "";
    for (const start of at >= 0 ? [at, at + 5, at + 10] : [0, 10, 20, 30]) {
      const slice = words.slice(start, start + 40);
      if (slice.length < 12 || !quotable(slice, false)) continue;
      text = (start > 0 ? "… " : "") + slice.join(" ") + (start + 40 < words.length ? " …" : "");
      break;
    }
    if (!text) { console.error(`skip row ${r.i}: no quotable window on page ${r.page}`); skipped++; continue; }
    let slug = `nawadir-juha-${r.no ?? `p${r.page}`}`;
    while (used.has(slug)) slug += "b";
    used.add(slug);
    const title: L5 = { ar: r.title_ar, en: strip(t.title.en), ur: strip(t.title.ur), fr: strip(t.title.fr), es: strip(t.title.es) };
    const label: L5 = {
      ar: `${book.ar}، ص ${r.page} — «${title.ar}»`, en: `${book.en}, p. ${r.page} — '${title.en}'`, ur: `${book.ur}، ص ${r.page} — «${title.ur}»`,
      fr: `${book.fr}, p. ${r.page} — « ${title.fr} »`, es: `${book.es}, p. ${r.page} — «${title.es}»`,
    };
    const cite = ` {cite:juha-nawadir-kubra-djuwaydi p. ${r.page}}`;
    const summary = Object.fromEntries(LANGS.map((l) => [l, strip(t.summary[l]) + cite])) as L5;
    if (emit(slug, {
      work: WORK, ref: r.no ? `${r.page}:${r.no}` : String(r.page), label, text, summary, targets: [TARGET.juha, "concept/al-nawadir"], source: SOURCE,
      prov: `Apple Vision OCR of the scan adab-zuhd/civ-3027, page ${r.page}${r.no ? `, anecdote ${r.no}` : ""}; an excerpt of at most 40 words from the anecdote's opening; the retelling is the museum's own words from the OCR reading, translated by Claude (claude-sonnet-5-5); OCR text not corrected`,
      status: "Claude (claude-fable-5-2) from the OCR'd book; retelling and translations by Claude (claude-sonnet-5-5), machine translation not read by a human",
    })) n++;
  }
  console.log(`nawadir-juha: ${n} anecdote passages ${DRY ? "(dry run)" : "written"}, ${skipped} skipped`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Mode `books`
// ---------------------------------------------------------------------------
interface Cand { vol: number; scan: string; page: number; text: string; signals: string[]; score: number }
function bestWindow(words: string[]): { text: string; signals: string[]; score: number } | null {
  let best: { text: string; signals: string[]; score: number } | null = null;
  for (let start = 0; start < words.length; start += 10) {
    const slice = words.slice(start, start + 40);
    if (slice.length < 18) break;
    if (!quotable(slice, true)) continue;
    const signals = juhaSignalsOfText(juhaFold(slice.join(" ")));
    if (!signals.length) continue;
    const score = signals.reduce((s, x) => s + (WEIGHT[x] ?? 1), 0);
    if (!best || score > best.score) best = { text: (start > 0 ? "… " : "") + slice.join(" ") + (start + 40 < words.length ? " …" : ""), signals, score };
  }
  return best;
}

const pageFiles = readdirSync(OUT_DIR);
let total = 0;
for (const book of BOOKS) {
  if (ONLY && book.prefix !== ONLY) continue;
  const srcs = book.sources ?? [book.source];
  if (!existsSync(`data/${book.work}.yaml`) || srcs.some((s) => !existsSync(`data/${s}.yaml`))) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const base = join(ROOT, book.dir);
  if (!existsSync(base)) { console.error(`skip ${book.prefix}: ${base} missing`); continue; }
  const scans = readdirSync(base).filter((d) => existsSync(join(base, d, "pages.json")) && (!book.scans || book.scans.includes(d))).sort();
  const name = workLabel(book.work);
  const cands: Cand[] = [];
  const seenText = new Set<string>();
  scans.forEach((scan, vi) => {
    const pages: { page: number; text?: string }[] = JSON.parse(readFileSync(join(base, scan, "pages.json"), "utf8"));
    for (const p of pages) {
      if (!p.text || p.text.length < 200) continue;
      const w = bestWindow(pageWords(p.text));
      if (!w) continue;
      const key = w.text.split(" ").map(norm).filter(Boolean).slice(4, 16).join(" ");
      if (seenText.has(key)) continue;
      seenText.add(key);
      cands.push({ vol: vi + 1, scan, page: p.page, ...w });
    }
  });
  // Laughter alone is everywhere; a book's quota goes to the stronger signals first.
  cands.sort((a, b) => b.score - a.score || a.vol - b.vol || a.page - b.page);
  const kept: Cand[] = [];
  for (const c of cands) {
    if (kept.length >= book.cap) break;
    if (kept.some((k) => k.vol === c.vol && Math.abs(k.page - c.page) <= 1)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.vol - b.vol || a.page - b.page);
  const multi = scans.length > 1;
  let wrote = 0;
  for (const c of kept) {
    const tail = `${multi ? `${c.vol}-` : ""}${c.page}`;
    if (pageFiles.some((f) => f.startsWith(`${book.prefix}-`) && f.endsWith(`-${tail}.yaml`))) continue;
    const kind = juhaKindOfSignals(c.signals)!;
    const where: L5 = {
      ar: `${multi ? `المجلد المصوَّر ${c.vol}، ` : ""}ص ${c.page}`, en: `${multi ? `scan volume ${c.vol}, ` : ""}p. ${c.page}`, ur: `${multi ? `اسکین جلد ${c.vol}، ` : ""}ص ${c.page}`,
      fr: `${multi ? `volume numérisé ${c.vol}, ` : ""}p. ${c.page}`, es: `${multi ? `volumen escaneado ${c.vol}, ` : ""}p. ${c.page}`,
    };
    const sep: L5 = { ar: "، ", en: ", ", ur: "، ", fr: ", ", es: ", " };
    const label = Object.fromEntries(LANGS.map((l) => [l, `${name[l]}${sep[l]}${where[l]} — ${SAYS[kind][l]}`])) as L5;
    const summary: L5 = {
      ar: `مقطع من ${name.ar}، ${where.ar}، فيه ${SAYS[kind].ar}؛ ${TAIL.ar}`,
      en: `An excerpt from ${name.en}, ${where.en}, with ${SAYS[kind].en}; ${TAIL.en}`,
      ur: `${name.ur}، ${where.ur} کا اقتباس جس میں ${SAYS[kind].ur} ہے؛ ${TAIL.ur}`,
      fr: `Un extrait de ${name.fr}, ${where.fr}, avec ${SAYS[kind].fr} ; ${TAIL.fr}`,
      es: `Un extracto de ${name.es}, ${where.es}, con ${SAYS[kind].es}; ${TAIL.es}`,
    };
    const source = book.sources?.[c.vol - 1] ?? book.source;
    if (emit(`${book.prefix}-juha-${tail}`, {
      work: book.work, ref: multi ? `${c.vol}:${c.page}` : String(c.page), label, text: c.text, summary, targets: [TARGET[kind]], source,
      prov: `Apple Vision OCR of the scan ${book.dir}/${/^[\x20-\x7e]+$/.test(c.scan) ? c.scan : `volume-${c.vol}`}, page ${c.page}; a window of at most 40 words chosen by the Juha browser's detector (scripts/juha.ts); OCR text not corrected`,
      status: "Claude (claude-fable-5-2) from the OCR'd book; label and summary are the museum's own words",
    })) { wrote++; total++; }
  }
  console.log(book.prefix, `${wrote} written, ${kept.length} kept of ${cands.length} candidate pages in ${scans.length} scan(s)`);
}
console.log(`${total} passages ${DRY ? "(dry run)" : "written"}`);
