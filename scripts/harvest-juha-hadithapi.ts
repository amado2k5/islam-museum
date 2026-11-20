/**
 * Harvest the hadith reports that carry jesting, laughter and smiling, the ethics of the joke and
 * the named wits (Nu'ayman, Suwaybit) from the hadith-api Arabic editions (fawazahmed0/hadith-api,
 * Unlicense) into data/passage/, for the Juha and Islamic Folklore Browser
 * (docs/plan/72-juha-browser.md). Adapted from scripts/harvest-wasaya-hadithapi.ts.
 *
 * Every candidate is gated by the detector the browser uses (scripts/juha.ts). A report already in
 * the graph is skipped, and so is a repeat of the same wording inside one collection. Records
 * follow the hadith-api harvest convention: a matn excerpt of at most 55 words centred on the first
 * hit, honorific formulas left out, provenance naming the edition and the hadith. Qur'an text is
 * never typed: an excerpt with the Qur'an's brackets or Uthmani letters, or sharing four
 * consecutive words with a verse of the frozen Tanzil text, is skipped.
 *
 * Usage: npx tsx scripts/harvest-juha-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { juhaFold, juhaSignalsOfText, juhaKindOfSignals, type JuhaKind } from "./juha.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-juha-hadithapi.ts <dir> [--dry]");
const LANGS = ["ar", "en", "ur", "fr", "es"] as const;
type Lang = (typeof LANGS)[number];
type L5 = Record<Lang, string>;
interface Hadith { hadithnumber: number; arabicnumber?: number | string; text: string; reference?: { book?: number; hadith?: number } }
interface Edition { hadiths: Hadith[] }
const BOOKS: { file: string; prefix: string; work: string; source: string; name: L5 }[] = [
  { file: "ara-bukhari", prefix: "bukhari", work: "work/sahih-al-bukhari", source: "source/sahih-al-bukhari", name: { ar: "صحيح البخاري", en: "Sahih al-Bukhari", ur: "صحیح بخاری", fr: "Sahih al-Bukhari", es: "Sahih al-Bujari" } },
  { file: "ara-muslim", prefix: "muslim", work: "work/sahih-muslim", source: "source/sahih-muslim", name: { ar: "صحيح مسلم", en: "Sahih Muslim", ur: "صحیح مسلم", fr: "Sahih Muslim", es: "Sahih Muslim" } },
  { file: "ara-tirmidhi", prefix: "tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi", name: { ar: "جامع الترمذي", en: "Jami' al-Tirmidhi", ur: "جامع ترمذی", fr: "Jami' al-Tirmidhi", es: "Jami' al-Tirmidhi" } },
  { file: "ara-nasai", prefix: "nasai", work: "work/sunan-al-nasai", source: "source/sunan-al-nasai", name: { ar: "سنن النسائي", en: "Sunan al-Nasa'i", ur: "سنن نسائی", fr: "Sunan al-Nasa'i", es: "Sunan al-Nasa'i" } },
  { file: "ara-abudawud", prefix: "abudawud", work: "work/sunan-abi-dawud", source: "source/sunan-abi-dawud", name: { ar: "سنن أبي داود", en: "Sunan Abi Dawud", ur: "سنن ابی داؤد", fr: "Sunan Abi Dawud", es: "Sunan Abi Dawud" } },
  { file: "ara-ibnmajah", prefix: "ibnmajah", work: "work/sunan-ibn-majah", source: "source/sunan-ibn-majah", name: { ar: "سنن ابن ماجه", en: "Sunan Ibn Majah", ur: "سنن ابن ماجہ", fr: "Sunan Ibn Majah", es: "Sunan Ibn Majah" } },
  { file: "ara-malik", prefix: "muwatta", work: "work/muwatta-malik", source: "source/muwatta-malik", name: { ar: "موطأ مالك", en: "Muwatta Malik", ur: "موطأ مالک", fr: "Muwatta Malik", es: "Muwatta Malik" } },
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
const PROV = `generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "juha-hadithapi-1"`;

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

const HIT = /مزح|مزاح|مازح|داعب|دعاب|هزل|لاعب|يسخر|ليضحك|نعيمان|سويبط|نواجذ|تبسم|ضحك|ضاحك/;
/** At most 55 words of the cleaned matn, centred on the first hit. */
function excerptOf(text: string): string {
  const words = text.replace(/[A-Za-z0-9٠-٩\[\]*#_=|/\\<>~^`]+/g, " ").replace(/"/g, " ").replace(/\s+/g, " ").trim().split(" ");
  if (words.length <= 55) return words.join(" ");
  let at = words.findIndex((w) => HIT.test(juhaFold(w)));
  if (at < 0) at = 0;
  const start = Math.max(0, Math.min(words.length - 55, at - 27));
  return (start > 0 ? "… " : "") + words.slice(start, start + 55).join(" ") + (start + 55 < words.length ? " …" : "");
}
const existing = readdirSync(OUT_DIR);
const siblings = new Set<string>();
for (const f of existing) {
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
  const seen: string[] = [];
  for (const h of edition.hadiths) {
    if (!h.text) continue;
    if (!juhaSignalsOfText(juhaFold(clean(h.text))).length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const slug = `${book.prefix}-api-${slugNo}`;
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    const text = excerptOf(clean(h.text));
    const folded = juhaFold(text);
    if (existsSync(join(OUT_DIR, `${slug}.yaml`))) { seen.push(folded); skip("an api record of this hadith exists"); continue; }
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    if (HONORIFIC_LEFT.test(folded) || HONORIFIC_LEFT.test(text.replace(/[ً-ٰٟۖ-ۭـ]/g, ""))) { skip("honorific formula left in the excerpt"); continue; }
    if (QURAN_MARK.test(folded) || /[ٱۖ-ۭ﴾﴿]/.test(text) || quotesQuran(text.split(" ").map(norm).filter(Boolean))) { skip("the excerpt carries Qur'an text"); continue; }
    const signals = juhaSignalsOfText(folded);
    if (!signals.length) { skip("excerpt lost the signal"); continue; }
    const key = folded.slice(0, 120);
    if (seen.some((t) => t.includes(key.slice(20, 100)))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const kind = juhaKindOfSignals(signals)!;
    const says = SAYS[kind];
    const label = Object.fromEntries(LANGS.map((l) => [l, `${book.name[l]} ${h.hadithnumber} — ${says[l]}`])) as L5;
    const summary: L5 = {
      ar: `حديث في ${book.name.ar}، رقم ${h.hadithnumber}، فيه ${says.ar}. يجمعه متصفح جحا والفلكلور الإسلامي مع نصوص القرآن والسنة والسيرة والكتب في الضحك والمزاح والنوادر.`,
      en: `A report in ${book.name.en}, no. ${h.hadithnumber}, with ${says.en}. The Juha and Islamic Folklore Browser lists it with the texts of the Qur'an, the Sunnah, the seerah and the books on laughter, jesting and anecdotes.`,
      ur: `${book.name.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.ur} ہے۔ جحا اور اسلامی لوک ادب کا براؤزر اسے قرآن، سنت، سیرت اور کتابوں کی متعلقہ نصوص کے ساتھ جمع کرتا ہے۔`,
      fr: `Un récit de ${book.name.fr}, n° ${h.hadithnumber}, avec ${says.fr}. Le Navigateur de Juha et du folklore islamique le recense avec les textes du Coran, de la Sunna, de la sîra et des livres sur le rire, la plaisanterie et les anecdotes.`,
      es: `Un relato de ${book.name.es}, n.º ${h.hadithnumber}, con ${says.es}. El Navegador de Juha y del folclore islámico lo recoge junto a los textos del Corán, la Sunna, la sira y los libros sobre la risa, la broma y las anécdotas.`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const ref = h.reference?.book !== undefined ? ` (book ${h.reference.book} hadith ${h.reference.hadith})` : "";
    const yaml = [
      `id: passage/${slug}`, `class: passage`, `unit: hadith`, `work: ${book.work}`, `ref: "${h.hadithnumber}"`,
      `label: ${l5(label)}`, `text: ${q(text)}`, `summary:`, ...LANGS.map((l) => `  ${l}: ${q(summary[l])}`),
      `relations:`, `  - { type: mentions, target: ${TARGET[kind]}, sources: ${src} }`,
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words chosen by the Juha browser's detector (scripts/juha.ts), honorific formulas left out`)}, ${PROV} }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the hadith-api Arabic edition; label and summary are the museum's own words" }`, ``,
    ].join("\n");
    if (!DRY) writeFileSync(join(OUT_DIR, `${slug}.yaml`), yaml);
    written++;
    perBook[book.prefix] = (perBook[book.prefix] ?? 0) + 1;
  }
}
console.log(`${written} passages ${DRY ? "(dry run)" : "written"}`, perBook);
console.log("skipped", why);
