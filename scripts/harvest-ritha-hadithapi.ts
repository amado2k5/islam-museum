/**
 * Harvest the hadith reports that carry an elegy or praise of the dead, a death announcement,
 * words of condolence and patience at a loss, or weeping and wailing and their limits, from the
 * hadith-api Arabic editions (fawazahmed0/hadith-api, Unlicense) into data/passage/, for the
 * Elegy and Death-Announcement Browser (docs/plan/72-ritha-browser.md).
 *
 * Every candidate is gated by the same detector the browser uses (scripts/ritha.ts), so only
 * reports the page will show become records. A report already in the graph is skipped, and so is
 * a repeat of the same wording inside one collection. Records follow the hadith-api harvest
 * convention: a matn excerpt of at most 55 words centred on the first wording, honorific formulas
 * left out, and provenance naming the edition and the hadith. A report that quotes six
 * consecutive words of a verse is skipped: Qur'an text is never typed.
 *
 * Usage: npx tsx scripts/harvest-ritha-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { rithaFirstAt, rithaFold, rithaKindOfSignals, rithaSignalsOfText } from "./ritha.js";
import { clean, HONORIFIC_LEFT } from "./arkan-harvest-lib.js";
import { BROWSER_NAME, isolateParens, KIND_SAYS, labelYaml, LANGS5, q, RITHA_ANCHOR_RECORD, workTitles, type L5 } from "./ritha-harvest-lib.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-ritha-hadithapi.ts <dir> [--dry]");

interface Hadith { hadithnumber: number; arabicnumber?: number | string; text: string; reference?: { book?: number; hadith?: number } }
interface Edition { metadata?: { sections?: Record<string, string> }; hadiths: Hadith[] }

const BOOKS: { file: string; prefix: string; work: string; source: string }[] = [
  { file: "ara-bukhari", prefix: "bukhari", work: "work/sahih-al-bukhari", source: "source/sahih-al-bukhari" },
  { file: "ara-muslim", prefix: "muslim", work: "work/sahih-muslim", source: "source/sahih-muslim" },
  { file: "ara-abudawud", prefix: "abudawud", work: "work/sunan-abi-dawud", source: "source/sunan-abi-dawud" },
  { file: "ara-tirmidhi", prefix: "tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi" },
  { file: "ara-nasai", prefix: "nasai", work: "work/sunan-al-nasai", source: "source/sunan-al-nasai" },
  { file: "ara-ibnmajah", prefix: "ibnmajah", work: "work/sunan-ibn-majah", source: "source/sunan-ibn-majah" },
  { file: "ara-malik", prefix: "muwatta", work: "work/muwatta-malik", source: "source/muwatta-malik" },
];

const norm = (w: string) => rithaFold(w).replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");
const QURAN_4GRAMS = new Set<string>();
const siblings = new Set<string>();
for (const f of readdirSync(OUT_DIR)) {
  const m = f.match(/^(bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah)-0*(\d+)[a-z]?\.yaml$/);
  if (m) siblings.add(`${m[1]}-${m[2]}`);
  if (!/^quran-\d+-\d+\.yaml$/.test(f)) continue;
  const t = readFileSync(join(OUT_DIR, f), "utf8").match(/^text_search: "(.*)"$/m);
  if (!t) continue;
  const ws = t[1].split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
/** Six consecutive words shared with a verse mark a quotation; the istirja' formula itself is four words and passes. */
function quotesQuran(text: string): boolean {
  const ws = text.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i + 6 <= ws.length; i++) { let all = true; for (let k = i; k + 4 <= i + 6; k++) if (!QURAN_4GRAMS.has(ws.slice(k, k + 4).join(" "))) { all = false; break; } if (all) return true; }
  return false;
}

/** A window of at most 55 words around the first wording. */
function excerptOf(full: string): string {
  const words = full.split(" ").filter(Boolean);
  if (words.length <= 55) return full;
  const folded = rithaFold(words.join(" "));
  const first = Math.max(0, rithaFirstAt(folded));
  const hitWord = Math.min(words.length - 1, folded.slice(0, first + 1).split(" ").length - 1);
  let start = Math.max(0, hitWord - 18);
  const end = Math.min(words.length, start + 55);
  start = Math.max(0, end - 55);
  return (start > 0 ? "… " : "") + words.slice(start, end).join(" ") + (end < words.length ? " …" : "");
}

let written = 0;
const why: Record<string, number> = {};
const skip = (k: string) => { why[k] = (why[k] ?? 0) + 1; };
const perBook: Record<string, number> = {};
const perKind: Record<string, number> = {};
for (const book of BOOKS) {
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const title = workTitles(book.work);
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    if (!rithaSignalsOfText(rithaFold(h.text)).length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    if (existsSync(file)) { seen.push(rithaFold(excerptOf(clean(h.text)))); skip("an api record of this hadith exists (the detector reads it in place)"); continue; }
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    const text = isolateParens(excerptOf(clean(h.text).replace(/[‏‎]/g, "").replace(/\s+/g, " ").trim()));
    const folded = rithaFold(text);
    const signals = rithaSignalsOfText(folded);
    const kind = rithaKindOfSignals(signals);
    if (!signals.length || !kind) { skip("excerpt lost the signal"); continue; }
    if (HONORIFIC_LEFT.test(folded)) { skip("an honorific formula the cleaner cannot cut"); continue; }
    if (quotesQuran(text)) { skip("quotes a verse (Qur'an text is never typed)"); continue; }
    const at = Math.max(0, rithaFirstAt(folded));
    const key = folded.slice(Math.max(0, at - 30), at + 60);
    if (seen.some((t) => t.includes(key))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const says = KIND_SAYS[kind];
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = Object.fromEntries(LANGS5.map((l) => [l, `${title[l]} ${h.hadithnumber} — ${says[l]}`])) as L5;
    const summary: L5 = {
      ar: `حديث في ${title.ar}، رقم ${h.hadithnumber}، فيه ${says.ar}. يجمعه ${BROWSER_NAME.ar} مع نصوص القرآن والسنة والسيرة وأخبار الصحابة والتابعين وما في الكتب المحصودة في هذا الباب.`,
      en: `A report in ${title.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, that carries ${says.en}. ${BROWSER_NAME.en} lists it with the texts of the Qur'an, the Sunnah, the seerah, the reports of the Companions and the Successors and the harvested books on this subject.`,
      ur: `${title.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.ur} ہے۔ ${BROWSER_NAME.ur} اسے قرآن، سنت، سیرت، صحابہ و تابعین کے آثار اور جمع شدہ کتابوں کی عبارتوں کے ساتھ درج کرتا ہے۔`,
      fr: `Un récit dans ${title.fr}, n° ${h.hadithnumber}, qui contient ${says.fr}. ${BROWSER_NAME.fr} le recense avec les textes du Coran, de la Sunna, de la sîra, les récits des Compagnons et des Successeurs et les livres moissonnés sur ce sujet.`,
      es: `Un relato en ${title.es}, n.º ${h.hadithnumber}, que contiene ${says.es}. ${BROWSER_NAME.es} lo recoge junto con los textos del Corán, la Sunna, la sira, los relatos de los Compañeros y los Sucesores y los libros cosechados sobre este tema.`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const ref = h.reference?.book !== undefined ? ` (book ${h.reference.book} hadith ${h.reference.hadith})` : "";
    const yaml = [
      `id: ${id}`,
      `class: passage`,
      `unit: hadith`,
      `work: ${book.work}`,
      `ref: "${h.hadithnumber}"`,
      `label: ${labelYaml(label)}`,
      `text: ${q(text)}`,
      `summary:`,
      ...LANGS5.map((l) => `  ${l}: ${q(summary[l])}`),
      `relations:`,
      `  - { type: mentions, target: ${RITHA_ANCHOR_RECORD}, sources: ${src} }`,
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words, honorific formulas left out; label and summary in five languages written from fixed wording per kind`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "ritha-hadithapi-1" }`,
      `sources: ${src}`,
      `status: { review: published, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the hadith-api Arabic edition; label and summary are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    written++;
    perBook[book.prefix] = (perBook[book.prefix] ?? 0) + 1;
    perKind[kind] = (perKind[kind] ?? 0) + 1;
  }
}
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook, perKind);
console.log("skipped:", why);
