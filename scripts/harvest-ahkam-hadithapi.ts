/**
 * Harvest the hadith reports that name an obligation, an act of obedience, a recommended, a
 * disliked or a permitted act, or the minor sins, from the hadith-api Arabic editions
 * (fawazahmed0/hadith-api, Unlicense) into data/passage/, for the Rulings Browser
 * (docs/plan/72-ahkam-browser.md).
 *
 * Every candidate is gated by the same detector the browser uses (scripts/ahkam.ts): a strong
 * signal of a theme other than «المحرمات» must fire, because the reports whose only theme is the
 * forbidden were harvested for the Halal and Haram Browser and are read in place. A report
 * already in the graph is skipped, and so is a repeat of the same wording inside one
 * collection. Records follow the hadith-api harvest convention: a matn excerpt of at most 55
 * words centred on the first strong wording, honorific formulas left out, and provenance naming
 * the edition and the hadith. A report that quotes six consecutive words of a verse is skipped:
 * Qur'an text is never typed. Labels and summaries are written in the five languages.
 *
 * Usage: npx tsx scripts/harvest-ahkam-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ahkamFirstStrongAt, ahkamFold, ahkamHitsOfText, AHKAM_TOPICS } from "./ahkam.js";
import { AHKAM_ANCHOR, BROWSER_NAME, clean, five, HONORIFIC_LEFT, q, SAYS, uniq } from "./ahkam-harvest-lib.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-ahkam-hadithapi.ts <dir> [--dry]");

interface Hadith { hadithnumber: number; arabicnumber?: number | string; text: string; reference?: { book?: number; hadith?: number } }
interface Edition { metadata?: { sections?: Record<string, string> }; hadiths: Hadith[] }

const BOOKS: { file: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string; fr: string; es: string }[] = [
  { file: "ara-bukhari", prefix: "bukhari", work: "work/sahih-al-bukhari", source: "source/sahih-al-bukhari", ar: "صحيح البخاري", en: "Sahih al-Bukhari", ur: "صحیح بخاری", fr: "Sahih al-Bukhari", es: "Sahih al-Bujari" },
  { file: "ara-muslim", prefix: "muslim", work: "work/sahih-muslim", source: "source/sahih-muslim", ar: "صحيح مسلم", en: "Sahih Muslim", ur: "صحیح مسلم", fr: "Sahih Muslim", es: "Sahih Muslim" },
  { file: "ara-tirmidhi", prefix: "tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi", ar: "جامع الترمذي", en: "Jami' al-Tirmidhi", ur: "جامع ترمذی", fr: "Jami' al-Tirmidhi", es: "Yami' al-Tirmidhi" },
  { file: "ara-nasai", prefix: "nasai", work: "work/sunan-al-nasai", source: "source/sunan-al-nasai", ar: "سنن النسائي", en: "Sunan al-Nasa'i", ur: "سنن نسائی", fr: "Sunan al-Nasa'i", es: "Sunan al-Nasa'i" },
  { file: "ara-abudawud", prefix: "abudawud", work: "work/sunan-abi-dawud", source: "source/sunan-abi-dawud", ar: "سنن أبي داود", en: "Sunan Abi Dawud", ur: "سنن ابی داؤد", fr: "Sunan Abi Dawud", es: "Sunan Abi Dawud" },
  { file: "ara-ibnmajah", prefix: "ibnmajah", work: "work/sunan-ibn-majah", source: "source/sunan-ibn-majah", ar: "سنن ابن ماجه", en: "Sunan Ibn Majah", ur: "سنن ابن ماجہ", fr: "Sunan Ibn Majah", es: "Sunan Ibn Mayah" },
  { file: "ara-malik", prefix: "muwatta", work: "work/muwatta-malik", source: "source/muwatta-malik", ar: "موطأ مالك", en: "Muwatta Malik", ur: "موطأ مالک", fr: "Muwatta de Malik", es: "Muwatta de Malik" },
];

const norm = (w: string) => ahkamFold(w).replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");
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
/** Six consecutive words shared with a verse mark a quotation; shorter runs are the common wording of the testimony and the prayer-and-zakat pair. */
function quotesQuran(text: string): boolean {
  const ws = text.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i + 6 <= ws.length; i++) { let all = true; for (let k = i; k + 4 <= i + 6; k++) if (!QURAN_4GRAMS.has(ws.slice(k, k + 4).join(" "))) { all = false; break; } if (all) return true; }
  return false;
}

/** A window of at most 55 words around the first strong wording. */
function excerptOf(full: string): string {
  const words = full.split(" ").filter(Boolean);
  if (words.length <= 55) return full;
  const folded = ahkamFold(words.join(" "));
  const first = Math.max(0, ahkamFirstStrongAt(folded));
  const hitWord = Math.min(words.length - 1, folded.slice(0, first + 1).split(" ").length - 1);
  let start = Math.max(0, hitWord - 14);
  const end = Math.min(words.length, start + 55);
  start = Math.max(0, end - 55);
  return (start > 0 ? "… " : "") + words.slice(start, end).join(" ") + (end < words.length ? " …" : "");
}

let written = 0;
const why: Record<string, number> = {};
const skip = (k: string) => { why[k] = (why[k] ?? 0) + 1; };
const perBook: Record<string, number> = {};
const perTopic: Record<string, number> = {};
for (const book of BOOKS) {
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) { console.error(`missing ${path}`); continue; }
  const edition: Edition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    if (!ahkamHitsOfText(ahkamFold(h.text), true).some((x) => x.strong && x.topic !== "haram")) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    if (existsSync(file)) { seen.push(ahkamFold(excerptOf(clean(h.text)))); skip("an api record of this hadith exists (the detector reads it in place)"); continue; }
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    const text = excerptOf(clean(h.text));
    const folded = ahkamFold(text);
    const hits = ahkamHitsOfText(folded, true);
    if (!hits.some((x) => x.strong && x.topic !== "haram")) { skip("excerpt lost the signal"); continue; }
    if (HONORIFIC_LEFT.test(folded)) { skip("an honorific formula the cleaner cannot cut"); continue; }
    if (quotesQuran(text)) { skip("quotes a verse (Qur'an text is never typed)"); continue; }
    const at = Math.max(0, ahkamFirstStrongAt(folded));
    const key = folded.slice(Math.max(0, at - 30), at + 60);
    if (seen.some((t) => t.includes(key))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const topics = AHKAM_TOPICS.filter((t) => hits.some((x) => x.topic === t));
    const says = uniq(hits.map((x) => SAYS[`${x.topic}:${x.signal}`]).filter(Boolean).map((s) => s.join("\u0001"))).map((s) => s.split("\u0001"));
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const lead = says.slice(0, 2);
    const label = {
      ar: `${book.ar} ${h.hadithnumber} — ${lead.map((s) => s[0]).join("، ")}`,
      en: `${book.en} ${h.hadithnumber} — ${lead.map((s) => s[1]).join("; ")}`,
      ur: `${book.ur} ${h.hadithnumber} — ${lead.map((s) => s[2]).join("، ")}`,
      fr: `${book.fr} ${h.hadithnumber} — ${lead.map((s) => s[3]).join(" ; ")}`,
      es: `${book.es} ${h.hadithnumber} — ${lead.map((s) => s[4]).join("; ")}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، يرد فيه ذكر ${says.map((s) => s[0]).join("، و")}. يجمعه ${BROWSER_NAME[0]} مع نصوص القرآن والسنة والسيرة وأخبار الصحابة والتابعين في هذه الأبواب، ويصف المتحف ما في النص ولا يُفتي به.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, whose wording mentions ${says.map((s) => s[1]).join(", ")}. ${BROWSER_NAME[1]} lists it with the texts of the Qur'an, the Sunnah, the seerah and the reports of the Companions and Successors on these themes; the museum describes what the text says and issues no ruling.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس کے الفاظ میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے۔ ${BROWSER_NAME[2]} اسے قرآن، سنت، سیرت اور صحابہ و تابعین کے آثار کے ساتھ جمع کرتا ہے؛ میوزیم متن کا بیان کرتا ہے، فتویٰ نہیں دیتا۔`,
      fr: `Un récit de ${book.fr}, n° ${h.hadithnumber}, dont le texte mentionne ${says.map((s) => s[3]).join(", ")}. ${BROWSER_NAME[3]} le réunit avec les textes du Coran, de la Sunna, de la sîra et les récits des Compagnons et des Suivants sur ces thèmes ; le musée décrit ce que dit le texte et ne rend aucun avis juridique.`,
      es: `Un relato de ${book.es}, n.º ${h.hadithnumber}, cuyo texto menciona ${says.map((s) => s[4]).join(", ")}. ${BROWSER_NAME[4]} lo reúne con los textos del Corán, la Sunna, la sira y los relatos de los Compañeros y los Sucesores sobre estos temas; el museo describe lo que dice el texto y no emite ningún dictamen.`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const ref = h.reference?.book !== undefined ? ` (book ${h.reference.book} hadith ${h.reference.hadith})` : "";
    const yaml = [
      `id: ${id}`,
      `class: passage`,
      `unit: hadith`,
      `work: ${book.work}`,
      `ref: "${h.hadithnumber}"`,
      `label: ${five(label, q)}`,
      `text: ${q(text)}`,
      `summary:`,
      `  ar: ${q(summary.ar)}`,
      `  en: ${q(summary.en)}`,
      `  ur: ${q(summary.ur)}`,
      `  fr: ${q(summary.fr)}`,
      `  es: ${q(summary.es)}`,
      `relations:`,
      ...topics.map((t) => `  - { type: mentions, target: ${AHKAM_ANCHOR[t]}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "ahkam-hadithapi-1" }`,
      `sources: ${src}`,
      `status: { review: published, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the hadith-api Arabic edition; label and summary are the museum's own words in five languages (machine-written, not read by a person)" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    written++;
    perBook[book.prefix] = (perBook[book.prefix] ?? 0) + 1;
    for (const t of topics) perTopic[t] = (perTopic[t] ?? 0) + 1;
  }
}
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook, perTopic);
console.log("skipped:", why);
