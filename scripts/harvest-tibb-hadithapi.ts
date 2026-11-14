/**
 * Harvest the hadith reports about medicine — prophetic medicine, medicine and illness, anatomy,
 * surgery, drugs and the seeking of treatment — from the hadith-api Arabic editions
 * (fawazahmed0/hadith-api, Unlicense) into data/passage/, for the Medicine Browser
 * (docs/plan/57-tibb-browser.md).
 *
 * Every candidate is gated by the same detector the browser uses (scripts/tibb.ts), under the
 * book-corpus rule (a bare «مرض» or «شفاء» alone is not enough), so only reports the page will
 * show become records. A report already in the graph is skipped. Records follow the hadith-api
 * harvest convention: a matn excerpt of at most 55 words centred on the medical words, honorific
 * formulas left out, and provenance naming the edition and the hadith.
 *
 * Usage: npx tsx scripts/harvest-tibb-hadithapi.ts <dir with ara-*.json> [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tibbFold, tibbMatchesOfText, tibbSignalsOfText, tibbTopicsOfSignals } from "./tibb.js";
import { TOPIC_ANCHOR } from "./harvest-tibb-anchors.js";

const API_DIR = process.argv[2];
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");
if (!API_DIR || API_DIR.startsWith("--")) throw new Error("usage: harvest-tibb-hadithapi.ts <dir> [--dry]");

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
  "hijama": [
    "الحجامة",
    "cupping",
    "حجامہ"
  ],
  "kayy": [
    "الكي",
    "cautery",
    "داغنا"
  ],
  "ruqya": [
    "الرقية",
    "ruqya recited over the sick",
    "رقیہ"
  ],
  "ruqya_weak": [
    "الرقية",
    "ruqya recited over the sick",
    "رقیہ"
  ],
  "asal": [
    "التداوي بالعسل",
    "honey as a remedy",
    "شہد سے علاج"
  ],
  "habba_sawda": [
    "الحبة السوداء",
    "the black seed",
    "کلونجی"
  ],
  "qust": [
    "القسط والعود الهندي",
    "costus (Indian aloeswood)",
    "قسط ہندی"
  ],
  "qust_weak": [
    "القسط",
    "costus",
    "قسط"
  ],
  "sana": [
    "السنا والسنوت",
    "senna and sannut",
    "سنا اور سنوت"
  ],
  "talbina": [
    "التلبينة",
    "talbina (barley gruel)",
    "تلبینہ"
  ],
  "kamaa": [
    "الكمأة",
    "truffles and their water for the eye",
    "کھمبی"
  ],
  "ajwa": [
    "تمر العجوة",
    "'ajwa dates",
    "عجوہ کھجور"
  ],
  "abwal": [
    "ألبان الإبل وأبوالها",
    "camel milk and urine as treatment",
    "اونٹنی کا دودھ اور پیشاب"
  ],
  "ithmid": [
    "الإثمد",
    "ithmid (antimony kohl)",
    "اثمد سرمہ"
  ],
  "kuhl": [
    "الكحل",
    "kohl for the eye",
    "سرمہ"
  ],
  "ladud": [
    "اللدود والسعوط",
    "medicine given by the mouth-side or the nose",
    "لدود اور سعوط"
  ],
  "zamzam_shifa": [
    "ماء زمزم",
    "Zamzam water",
    "آبِ زمزم"
  ],
  "tibb": [
    "الطب والطبيب",
    "medicine and the physician",
    "طب اور طبیب"
  ],
  "marad_nabi": [
    "مرض النبي",
    "the Prophet's illness",
    "نبی کی بیماری"
  ],
  "marad": [
    "المرض والمريض",
    "illness and the sick",
    "بیماری اور بیمار"
  ],
  "suqm": [
    "السقم",
    "sickness",
    "سقم"
  ],
  "waja": [
    "الوجع",
    "pain",
    "درد"
  ],
  "shakwa": [
    "الشكوى من العلة",
    "a complaint of an ailment",
    "بیماری کی شکایت"
  ],
  "humma": [
    "الحمى والوعك",
    "fever",
    "بخار"
  ],
  "humma_weak": [
    "الحمى",
    "fever",
    "بخار"
  ],
  "waba": [
    "الطاعون والوباء",
    "plague and epidemic",
    "طاعون اور وبا"
  ],
  "adwa": [
    "العدوى",
    "contagion",
    "چھوت"
  ],
  "adwa_weak": [
    "العدوى",
    "contagion",
    "چھوت"
  ],
  "judham": [
    "الجذام والبرص",
    "leprosy and vitiligo",
    "جذام اور برص"
  ],
  "amrad": [
    "أسماء الأمراض",
    "named diseases",
    "بیماریوں کے نام"
  ],
  "sar": [
    "الصرع",
    "epilepsy",
    "مرگی"
  ],
  "iyada": [
    "عيادة المريض",
    "visiting the sick",
    "بیمار کی عیادت"
  ],
  "iyada_weak": [
    "عيادة المريض",
    "visiting the sick",
    "بیمار کی عیادت"
  ],
  "bimaristan": [
    "البيمارستان وصناعة الطب",
    "the hospital and the medical craft",
    "بیمارستان"
  ],
  "ilaj": [
    "العلاج",
    "treatment",
    "علاج"
  ],
  "bur": [
    "البرء من العلة",
    "recovery from an ailment",
    "بیماری سے شفایابی"
  ],
  "sihha": [
    "الصحة",
    "health",
    "صحت"
  ],
  "himya": [
    "الحمية",
    "diet as treatment",
    "پرہیز"
  ],
  "janin": [
    "أطوار خلق الجنين",
    "the stages of the embryo",
    "جنین کے مراحل"
  ],
  "aada": [
    "أعضاء البدن",
    "the organs of the body",
    "اعضائے بدن"
  ],
  "janin_weak": ["أطوار خلق الجنين","the stages of the embryo","جنین کے مراحل"],
 "udhra": ["علاج العذرة","treating the throat ailment (al-udhra)","گلے کی بیماری (عذرہ) کا علاج"],
 "uruq": [
    "العروق",
    "the vessels",
    "رگیں"
  ],
  "sulama": [
    "مفاصل البدن",
    "the joints of the body",
    "بدن کے جوڑ"
  ],
  "izam": [
    "العظام",
    "the bones",
    "ہڈیاں"
  ],
  "jiraha": [
    "الجراحة والختان والجبائر",
    "surgery, circumcision and splints",
    "جراحت، ختنہ اور پٹیاں"
  ],
  "hasm": [
    "حسم الجرح",
    "cauterising a wound",
    "زخم داغنا"
  ],
  "jurh": [
    "مداواة الجراح",
    "the treatment of wounds",
    "زخموں کا علاج"
  ],
  "nisa_jarha": [
    "مداواة النساء للجرحى",
    "women treating the wounded",
    "خواتین کا زخمیوں کا علاج"
  ],
  "shaqq_sadr": [
    "شق الصدر",
    "the opening of the chest",
    "شقِّ صدر"
  ],
  "jabr": [
    "جبر الكسر",
    "bone-setting",
    "ہڈی جوڑنا"
  ],
  "dawa": [
    "الدواء",
    "the drug",
    "دوا"
  ],
  "daa": [
    "الداء",
    "the disease and its remedy",
    "بیماری"
  ],
  "samm": [
    "السم والترياق",
    "poison and antidote",
    "زہر اور تریاق"
  ],
  "samm_weak": [
    "السم",
    "poison",
    "زہر"
  ],
  "aqaqir": [
    "العقاقير والصيدلة",
    "drugs and pharmacy",
    "ادویہ اور دواسازی"
  ],
  "hinna": [
    "الحناء دواء",
    "henna as a remedy",
    "مہندی بطور دوا"
  ],
  "tadawi": [
    "التداوي",
    "seeking treatment",
    "علاج کرانا"
  ],
  "shifa": [
    "الشفاء",
    "healing",
    "شفا"
  ],
  "shifa_verb": [
    "الشفاء",
    "healing",
    "شفا"
  ],
  "haram_dawa": [
    "التداوي بالمحرم",
    "treatment with what is forbidden",
    "حرام سے علاج"
  ]
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

/** A window of at most 55 raw words around the first matched medical words. */
function excerptOf(full: string): string {
  const words = full.split(/\s+/).filter(Boolean);
  if (words.length <= 55) return full;
  const folded: string[] = [];
  const at: number[] = [];
  words.forEach((w, i) => { const f = tibbFold(w); if (f) for (const part of f.split(" ")) { folded.push(part); at.push(i); } });
  const text = folded.join(" ");
  const ms = tibbMatchesOfText(text);
  const first = ms.length ? Math.min(...ms.map((m) => m.index)) : 0;
  const tokenIdx = text.slice(0, first).split(" ").length - 1;
  const hitWord = at[Math.min(tokenIdx, at.length - 1)] ?? 0;
  let start = Math.max(0, hitWord - 16);
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
    if (!tibbSignalsOfText(tibbFold(h.text), true).length) continue;
    const slugNo = String(h.hadithnumber).replace(/\./g, "-");
    const file = join(OUT_DIR, `${book.prefix}-api-${slugNo}.yaml`);
    const id = `passage/${book.prefix}-api-${slugNo}`;
    if (existsSync(file)) { skip("an api record of this hadith exists"); continue; }
    const std = book.prefix === "muslim" ? parseInt(String(h.arabicnumber ?? ""), 10) : h.hadithnumber;
    if (book.prefix !== "muwatta" && siblings.has(`${book.prefix}-${std}`)) { skip("already in the graph under the plain id"); continue; }
    const text = excerptOf(clean(h.text));
    const folded = tibbFold(text);
    const signals = tibbSignalsOfText(folded, true);
    if (!signals.length) { skip("excerpt lost the signal"); continue; }
    const probe = tibbMatchesOfText(folded)[0];
    const key = folded.slice(Math.max(0, probe.index - 45), probe.index + probe.match.length + 25);
    if (seen.some((t) => t.includes(key))) { skip("a repeat of the same wording in this collection"); continue; }
    seen.push(folded);
    const topics = tibbTopicsOfSignals(signals);
    const says = uniq(signals.map((s) => SAYS[s]).filter(Boolean).map((s) => s.join("\u0001"))).map((s) => s.split("\u0001"));
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = {
      ar: `${book.ar} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur} ${h.hadithnumber} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `حديث في ${book.ar}، رقم ${h.hadithnumber}، يذكر ${says.map((s) => s[0]).join("، و")}. يجمعه متصفح الطب مع نصوص الطب النبوي والطب والتشريح والجراحة والدواء والتداوي.`,
      en: `A report in ${book.en}, no. ${h.hadithnumber}${secEn ? ` (${secEn.trim()})` : ""}, that mentions ${says.map((s) => s[1]).join(", ")}. The Medicine Browser lists it with the texts on prophetic medicine, medicine, anatomy, surgery, drugs and treatment.`,
      ur: `${book.ur} کی حدیث نمبر ${h.hadithnumber}، جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے۔ طب براؤزر اسے طبِ نبوی، طب، تشریح، جراحت، دوا اور علاج کی نصوص کے ساتھ جمع کرتا ہے۔`,
    };
    const src = `[${book.source}, source/hadith-api-fawazahmed0]`;
    const rels = topics.map((t) => `  - { type: mentions, target: ${TOPIC_ANCHOR[t]}, sources: ${src} }`);
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
      `provenance: { layer: own-research, source: ${q(`fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${ref}; matn excerpt of at most 55 words, honorific formulas left out`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "tibb-hadithapi-1" }`,
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
