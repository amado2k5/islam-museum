/**
 * Harvest the passages that carry an elegy, a death announcement or words of condolence from
 * books already OCR'd on the harvest drive (Apple Vision text in <book>/<scan>/pages.json) into
 * data/passage/, for the Elegy and Death-Announcement Browser (docs/plan/72-ritha-browser.md):
 * the seerah books, the biographies and reports of the Companions and the Successors, the hadith
 * commentaries, the books of renunciation and manners, the anthologies and the histories. No PDF,
 * OCR text or page image enters git — only an excerpt of at most 40 words per page, cited to the
 * work and the scan page (docs/sources-policy.md).
 *
 * A page is a candidate when the browser's own detector (scripts/ritha.ts) fires on a 40-word
 * window of it with an elegy, announcement or condolence wording (weeping beside a death alone is
 * not enough here); the densest pages of each book are kept, up to the cap, never two neighbouring
 * pages. Qur'an text is never typed: a window is skipped when it carries a quotation marker or
 * shares any four consecutive words with a verse (checked against the frozen Tanzil text in
 * data/passage/quran-*.yaml). Windows the OCR garbled are skipped too (too many stray letters, or
 * fewer than about eight words in ten known from the museum's own Qur'an and hadith passages), and
 * so are windows with an honorific formula the cleaner cannot cut, and pages another harvest
 * already excerpted. A book whose work or source record is missing is skipped, so a book harvested
 * later is added by one line in BOOKS.
 *
 * Usage: npx tsx scripts/harvest-ritha-ocr.ts <harvest books dir> [--dry] [--only <prefix>] [--cap <n>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { rithaFold, rithaKindOfSignals, rithaSignalsOfText, rithaStrongSignals } from "./ritha.js";
import { clean, HONORIFIC_LEFT } from "./arkan-harvest-lib.js";
import { BROWSER_NAME, KIND_SAYS, labelYaml, LANGS5, q, RITHA_ANCHOR_RECORD, workTitles, type L5 } from "./ritha-harvest-lib.js";

const ROOT = process.argv[2];
const DRY = process.argv.includes("--dry");
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const CAP = process.argv.includes("--cap") ? Number(process.argv[process.argv.indexOf("--cap") + 1]) : 12;
const OUT_DIR = "data/passage";
if (!ROOT || ROOT.startsWith("--")) throw new Error("usage: harvest-ritha-ocr.ts <books dir> [--dry] [--only <prefix>] [--cap <n>]");

/** `scan` limits a book to one scan folder when the source record describes one volume only. */
interface Book { dir: string; scan?: string; prefix: string; work: string; source: string }
const BOOKS: Book[] = [
  { dir: "hadith/jami-ulum-hikam", prefix: "jami-ulum-hikam", work: "work/jami-ulum-hikam", source: "source/ibn-rajab-jami-ulum-hikam" },
  { dir: "hadith/fath-bari", prefix: "fath-bari", work: "work/fath-al-bari", source: "source/fath-al-bari" },
  { dir: "hadith/fath-bari-ibn-rajab", prefix: "fath-bari-ibn-rajab", work: "work/fath-al-bari-ibn-rajab", source: "source/fath-al-bari-ibn-rajab-1417" },
  { dir: "hadith/sharh-nawawi-muslim", prefix: "sharh-nawawi-muslim", work: "work/al-minhaj-sharh-sahih-muslim", source: "source/sharh-sahih-muslim-al-nawawi" },
  { dir: "hadith/riyad-salihin", prefix: "riyad-salihin", work: "work/riyad-al-salihin", source: "source/riyad-al-salihin" },
  { dir: "hadith/targhib-tarhib", prefix: "targhib-tarhib", work: "work/al-targhib-wa-al-tarhib-mundhiri", source: "source/targhib-tarhib-qayyima" },
  { dir: "hadith/adab-mufrad", prefix: "adab-mufrad", work: "work/al-adab-al-mufrad", source: "source/al-adab-al-mufrad" },
  { dir: "hadith/mishkat-masabih", prefix: "mishkat-masabih", work: "work/mishkat-al-masabih", source: "source/mishkat-al-masabih" },
  { dir: "hadith/sahih-ibn-hibban", prefix: "sahih-ibn-hibban", work: "work/sahih-ibn-hibban", source: "source/sahih-ibn-hibban" },
  { dir: "hadith/musannaf-abd-al-razzaq", prefix: "musannaf-abd-al-razzaq", work: "work/al-musannaf-abd-al-razzaq", source: "source/musannaf-abd-al-razzaq" },
  { dir: "hadith/musannaf-ibn-abi-shayba", prefix: "musannaf-ibn-abi-shayba", work: "work/al-musannaf-ibn-abi-shayba", source: "source/al-musannaf-ibn-abi-shayba" },
  { dir: "seerah/zad-maad", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad" },
  { dir: "seerah/sira-ibn-hisham", prefix: "sira-ibn-hisham", work: "work/sira-ibn-ishaq-ibn-hisham", source: "source/ibn-hisham-sira" },
  { dir: "seerah/maghazi-waqidi", prefix: "maghazi-waqidi", work: "work/kitab-al-maghazi", source: "source/al-waqidi-maghazi" },
  { dir: "seerah/rawd-unuf", prefix: "rawd-unuf", work: "work/al-rawd-al-unuf", source: "source/al-rawd-al-unf" },
  { dir: "seerah/subul-huda", prefix: "subul-huda", work: "work/subul-al-huda-wa-al-rashad", source: "source/subul-huda-salihi" },
  { dir: "seerah/dalail-nubuwwa-bayhaqi", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi" },
  { dir: "tabaqat/tabaqat-ibn-saad", prefix: "tabaqat-ibn-saad", work: "work/al-tabaqat-al-kubra-ibn-sad", source: "source/tabaqat-ibn-sad" },
  { dir: "sahaba/hilyat-awliya", prefix: "sahaba-hilyat-awliya", work: "work/hilyat-al-awliya", source: "source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988" },
  { dir: "sahaba/safwat-safwa", prefix: "sahaba-safwat-safwa", work: "work/sifat-al-safwa", source: "source/sifat-al-safwa-tartusi-2012" },
  { dir: "sahaba/hayat-sahaba", prefix: "sahaba-hayat-sahaba", work: "work/hayat-al-sahaba", source: "source/hayat-al-sahaba-kandahlawi-sabbani" },
  { dir: "sahaba/usd-ghaba", prefix: "sahaba-usd-ghaba", work: "work/usd-al-ghaba", source: "source/usd-al-ghaba" },
  { dir: "sahaba/isaba", prefix: "sahaba-isaba", work: "work/al-isaba-fi-tamyiz-al-sahaba", source: "source/isaba" },
  { dir: "sahaba/isti-ab", prefix: "sahaba-isti-ab", work: "work/al-istiab", source: "source/isti-ab-ibn-abd-al-barr" },
  { dir: "sahaba/siyar-alam-nubala", prefix: "siyar-alam-nubala", work: "work/siyar-alam-nubala", source: "source/siyar-alam-nubala" },
  { dir: "adab-zuhd/zuhd-ahmad", prefix: "zuhd-ahmad", work: "work/kitab-al-zuhd-ahmad-ibn-hanbal", source: "source/zuhd-ahmad-dkim-1983" },
  { dir: "adab-zuhd/zuhd-ibn-mubarak", prefix: "zuhd-ibn-mubarak", work: "work/kitab-al-zuhd-ibn-al-mubarak", source: "source/zuhd-ibn-mubarak-azami-scan" },
  { dir: "adab-zuhd/ihya-ulum-din", prefix: "ihya", work: "work/ihya-ulum-al-din", source: "source/ihya-shamela-dar-al-marifa" },
  { dir: "tareekh/bidaya-nihaya", prefix: "bidaya-nihaya", work: "work/al-bidaya-wal-nihaya", source: "source/al-bidaya-wal-nihaya" },
  { dir: "tareekh/tarikh-tabari", prefix: "tarikh-tabari", work: "work/tarikh-al-rusul-wa-al-muluk", source: "source/tarikh-al-tabari" },
  { dir: "tareekh/tarikh-dimashq", prefix: "tarikh-dimashq", work: "work/tarikh-dimashq", source: "source/tarikh-dimashq-ibn-asakir-fikr-1995" },
  { dir: "fiqh/fiqh-mawsua-noor-doc", prefix: "mawsua-fiqhiyya", work: "work/al-mawsua-al-fiqhiyya-al-kuwaitiyya", source: "source/fiqh-mawsua-noor-doc" },
  { dir: "fiqh/fiqh-sunna", prefix: "fiqh-sunna", work: "work/fiqh-al-sunnah-sabiq", source: "source/sabiq-fiqh-al-sunnah" },
  { dir: "adab-zuhd/hamasa-abu-tammam-1916", prefix: "hamasa-abu-tammam", work: "work/hamasa-abu-tammam", source: "source/hamasa-abu-tammam-ed-1916" },
  { dir: "tareekh/wafayat-ayan", prefix: "wafayat-ayan", work: "work/wafayat-al-ayan", source: "source/wafayat-ayan" },
  { dir: "tareekh/nafh-tib", prefix: "nafh-tib", work: "work/nafh-al-tib", source: "source/nafh-tib-maqqari" },
  { dir: "tareekh/muntazam", prefix: "muntazam", work: "work/al-muntazam-ibn-al-jawzi", source: "source/muntazam-ibn-al-jawzi" },
  { dir: "tareekh/ansab-ashraf", prefix: "ansab-ashraf", work: "work/ansab-al-ashraf", source: "source/ansab-al-ashraf" },
  { dir: "tareekh/tarikh-baghdad", prefix: "tarikh-baghdad", work: "work/tarikh-baghdad-khatib", source: "source/tarikh-baghdad-khatib" },
  { dir: "seerah/uyun-athar", prefix: "uyun-athar", work: "work/uyun-al-athar", source: "source/uyun-al-athar-sharqawi-1993" },
  { dir: "tareekh/tarikh-islam-dhahabi", prefix: "tarikh-islam-dhahabi", work: "work/tarikh-islam-dhahabi", source: "source/tarikh-islam-dhahabi" }
];

const QURAN_MARK = /[﴾﴿{}]|قوله تعالي|قوله تعالى|قال تعالي|قال تعالى|قال الله|عز وجل|قوله سبحانه|قول الله|الآية/;
/** Honorific formulas as the OCR misreads them. Such a window is skipped. */
const LOOSE_HONORIFIC = /ض[يى] ?الل|الله عن(?:ه|ها|هما|هم)(?=$|[\s،.])|عليه و?لم(?=$|[\s،.])|صل[ايى]? ?[ء-ي]{0,4} عليه|سبحانه وتعال|رحم[ةه] الله/;
const norm = (w: string) => rithaFold(w).replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");
const QURAN_4GRAMS = new Set<string>();
const VOCAB = new Set<string>();
for (const f of readdirSync(OUT_DIR)) {
  const isQuran = /^quran-\d+-\d+\.yaml$/.test(f);
  if (!isQuran && !/^(?:bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah|muwatta|riyad|arbaun|poem)-/.test(f)) continue;
  const raw = readFileSync(join(OUT_DIR, f), "utf8");
  const m = raw.match(isQuran ? /^text_search: "(.*)"$/m : /^text: "(.*)"$/m);
  if (!m) continue;
  const ws = m[1].split(/\s+/).map(norm).filter(Boolean);
  for (const w of ws) VOCAB.add(w);
  if (isQuran) for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
/** The istirja' is a verse wording too; it is the run an excerpt may share. */
const ALLOWED = new Set(["انا لله وانا اليه", "لله وانا اليه راجعون"].map((s) => s.split(" ").map(norm).join(" ")));
const known = (w: string) => VOCAB.has(w) || VOCAB.has(w.replace(/^[وفبلك]/, "")) || VOCAB.has(w.replace(/^[وفبلك]?ال/, "")) || VOCAB.has(w.replace(/^[وفبلك]?لل/, ""));
function quotesQuran(ws: string[]): boolean {
  for (let i = 0; i + 4 <= ws.length; i++) { const g = ws.slice(i, i + 4).join(" "); if (QURAN_4GRAMS.has(g) && !ALLOWED.has(g)) return true; }
  return false;
}

/** Clean an OCR page: footnote digits, Latin, brackets and line breaks go; honorific formulas go. */
function pageWords(text: string): string[] {
  return clean(text.replace(/[A-Za-z0-9٠-٩()\[\]«»"*#_=|/\\<>~^`⁦⁩]+/g, " ").replace(/\s+/g, " ")).split(" ").filter(Boolean);
}

interface Win { text: string; signals: string[]; weight: number }
interface Cand extends Win { vol: number; scan: string; page: number }

function bestWindow(words: string[]): Win | null {
  let best: Win | null = null;
  for (let start = 0; start < words.length; start += 8) {
    const slice = words.slice(start, start + 40);
    if (slice.length < 18) break;
    const text = slice.join(" ");
    const folded = rithaFold(text);
    if (!/رث|نع[يىا]|عز[يا]|نياح|نايح|راجعون|ببكاء|الجيوب|ابتاه/.test(folded)) continue; // cheap pre-filter
    if (QURAN_MARK.test(folded) || QURAN_MARK.test(text) || HONORIFIC_LEFT.test(folded)) continue;
    if (/[ٱۖ-ۭ]/.test(text)) continue; // Uthmani letters: a verse set in the page
    const ws = slice.map(norm).filter(Boolean);
    const stray = ws.filter((w) => w.length <= 1).length + (slice.length - ws.length);
    if (stray > slice.length * 0.08) continue;
    if (ws.filter(known).length < ws.length * 0.82) continue;
    if (LOOSE_HONORIFIC.test(folded)) continue;
    if (quotesQuran(ws)) continue;
    const signals = rithaSignalsOfText(folded);
    if (!signals.length || !rithaStrongSignals(signals)) continue;
    // an elegy or a death announcement outranks a condolence, which outranks the wailing reports
    const weight = signals.length + (signals.includes("ritha") ? 3 : 0) + (signals.includes("nay") ? 2 : 0) + (signals.includes("taziya") ? 1 : 0);
    if (!best || weight > best.weight) best = { text: (start > 0 ? "… " : "") + text + (start + 40 < words.length ? " …" : ""), signals, weight };
  }
  return best;
}

const pageFiles = readdirSync(OUT_DIR);
let total = 0;
const perKind: Record<string, number> = {};
for (const book of BOOKS) {
  if (ONLY && book.prefix !== ONLY) continue;
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const base = join(ROOT, book.dir);
  if (!existsSync(base)) { console.error(`skip ${book.prefix}: ${base} missing`); continue; }
  const title = workTitles(book.work);
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
    if (kept.length >= CAP) break;
    if (kept.some((k) => k.vol === c.vol && Math.abs(k.page - c.page) <= 1)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.vol - b.vol || a.page - b.page);
  for (const c of kept) {
    const multi = scans.length > 1;
    const slug = `${book.prefix}-ritha-${multi ? `${c.vol}-` : ""}${c.page}`;
    const file = join(OUT_DIR, `${slug}.yaml`);
    if (existsSync(file)) continue;
    const pageTail = `-${multi ? `${c.vol}-` : ""}${c.page}.yaml`;
    if (pageFiles.some((f) => f.startsWith(`${book.prefix}-`) && f.endsWith(pageTail))) continue; // another harvest excerpted this page
    const kind = rithaKindOfSignals(c.signals)!;
    const says = KIND_SAYS[kind];
    const where: L5 = {
      ar: `${multi ? `المجلد المصوَّر ${c.vol}، ` : ""}ص ${c.page}`, en: `${multi ? `scan volume ${c.vol}, ` : ""}p. ${c.page}`, ur: `${multi ? `اسکین جلد ${c.vol}، ` : ""}ص ${c.page}`,
      fr: `${multi ? `volume numérisé ${c.vol}, ` : ""}p. ${c.page}`, es: `${multi ? `volumen escaneado ${c.vol}, ` : ""}p. ${c.page}`,
    };
    const label = Object.fromEntries(LANGS5.map((l) => [l, `${title[l]}${l === "ar" || l === "ur" ? "،" : ","} ${where[l]} — ${says[l]}`])) as L5;
    const summary: L5 = {
      ar: `مقطع من ${title.ar}، ${where.ar}، فيه ${says.ar}؛ من النسخة المصورة المقروءة آليا، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر ولم يصحَّح. يجمعه ${BROWSER_NAME.ar}.`,
      en: `An excerpt from ${title.en}, ${where.en}, that carries ${says.en}; from the machine-read scan, quoted within forty words per the sources policy and not corrected. ${BROWSER_NAME.en} lists it.`,
      ur: `${title.ur}، ${where.ur} کا اقتباس جس میں ${says.ur} ہے؛ مشینی طور پر پڑھی گئی نقل سے، چالیس الفاظ کی حد میں اور بغیر تصحیح کے۔ ${BROWSER_NAME.ur} اسے درج کرتا ہے۔`,
      fr: `Un extrait de ${title.fr}, ${where.fr}, qui contient ${says.fr}; tiré de la numérisation lue par machine, cité dans la limite de quarante mots selon la politique des sources et non corrigé. ${BROWSER_NAME.fr} le recense.`,
      es: `Un extracto de ${title.es}, ${where.es}, que contiene ${says.es}; tomado del escaneo leído por máquina, citado dentro de cuarenta palabras según la política de fuentes y sin corregir. ${BROWSER_NAME.es} lo recoge.`,
    };
    const src = `[${book.source}]`;
    const yaml = [
      `id: passage/${slug}`,
      `class: passage`,
      `unit: chapter`,
      `work: ${book.work}`,
      `ref: ${q(multi ? `${c.vol}:${c.page}` : String(c.page))}`,
      `label: ${labelYaml(label)}`,
      `text: ${q(c.text)}`,
      `summary:`,
      ...LANGS5.map((l) => `  ${l}: ${q(summary[l])}`),
      `relations:`,
      `  - { type: mentions, target: ${RITHA_ANCHOR_RECORD}, sources: ${src} }`,
      `provenance: { layer: own-research, source: ${q(`Apple Vision OCR of the scan ${book.dir}/${c.scan.replace(/\(([^()]*[\u0600-\u06FF][^()]*)\)/g, "\u2066($1)\u2069")}, page ${c.page}; a window of at most 40 words chosen by the elegy and death-announcement detector (scripts/ritha.ts); OCR text not corrected; label and summary in five languages written from fixed wording per kind`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "ritha-ocr-1" }`,
      `sources: ${src}`,
      `status: { review: published, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the OCR'd book; label and summary are the museum's own words; the excerpt is machine-read and not corrected" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    total++;
    perKind[kind] = (perKind[kind] ?? 0) + 1;
  }
  console.log(book.prefix, `${kept.length} kept of ${cands.length} candidate pages in ${scans.length} scan(s)`);
}
console.log(`${total} passages ${DRY ? "(dry run)" : "written"}`, perKind);
