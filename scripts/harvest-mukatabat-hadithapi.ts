/**
 * Harvest correspondence (mukatabat) hadith passages from the hadith-api Arabic
 * editions (fawazahmed0/hadith-api, Unlicense) into data/passage/.
 *
 * Every candidate is gated by the same detector the browser uses
 * (scripts/mukatabat.ts), so only passages the mukatabat browser will actually
 * show become records. Records follow the established hadith-api harvest
 * convention (matn excerpt ≤ ~55 words, provenance naming edition + hadith).
 *
 * Usage: npx tsx scripts/harvest-mukatabat-hadithapi.ts [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  mukatabatSignalsOf,
  mukatabatKindOf,
  mukatabatSenderOf,
} from "./mukatabat.js";
import type { Node } from "./build-graph.js";

const API_DIR = "/tmp/hadith-api";
const OUT_DIR = "data/passage";
const DRY = process.argv.includes("--dry");

interface HadithApiHadith {
  hadithnumber: number;
  arabicnumber?: number;
  text: string;
  reference?: { book?: number; hadith?: number };
}
interface HadithApiEdition {
  metadata?: { name?: string; sections?: Record<string, string> };
  hadiths: HadithApiHadith[];
}

const BOOKS: Record<
  string,
  { file: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string }
> = {
  bukhari: { file: "ara-bukhari", prefix: "bukhari", work: "work/sahih-al-bukhari", source: "source/sahih-al-bukhari", ar: "صحيح البخاري", en: "Sahih al-Bukhari", ur: "صحیح بخاری" },
  muslim: { file: "ara-muslim", prefix: "muslim", work: "work/sahih-muslim", source: "source/sahih-muslim", ar: "صحيح مسلم", en: "Sahih Muslim", ur: "صحیح مسلم" },
  tirmidhi: { file: "ara-tirmidhi", prefix: "tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi", ar: "جامع الترمذي", en: "Jami' al-Tirmidhi", ur: "جامع ترمذی" },
  nasai: { file: "ara-nasai", prefix: "nasai", work: "work/sunan-al-nasai", source: "source/sunan-al-nasai", ar: "السنن النسائي", en: "Sunan al-Nasa'i", ur: "سنن النسائی" },
  abudawud: { file: "ara-abudawud", prefix: "abudawud", work: "work/sunan-abi-dawud", source: "source/sunan-abi-dawud", ar: "سنن أبي داود", en: "Sunan Abi Dawud", ur: "سنن ابی داؤد" },
  ibnmajah: { file: "ara-ibnmajah", prefix: "ibnmajah", work: "work/sunan-ibn-majah", source: "source/sunan-ibn-majah", ar: "سنن ابن ماجه", en: "Sunan Ibn Majah", ur: "سنن ابن ماجہ" },
  malik: { file: "ara-malik", prefix: "muwatta", work: "work/muwatta-malik", source: "source/muwatta-malik", ar: "موطأ مالك", en: "Muwatta Malik", ur: "موطأ مالک" },
};

// Broad pre-filter: anything that might carry correspondence, before the real detector.
const PREFILTER =
  /كتب\s+(?:إلى|الى)|أرسل\s+(?:إلى|الى)\s+(?:ال)?(?:هرقل|قيصر|كسرى|النجاشي|مقوقس|أبرويز|بلقيس|دحية)|بعث\s+(?:إلى|الى)\s+(?:ال)?(?:هرقل|قيصر|كسرى|النجاشي|مقوقس|بلقيس|دحية|رسول|رجلين|اثنين)|كتاب\s+من\s+|بكتاب\s+من\s+|رسالة\s+من\s+|رقعة\s+من\s+|من\s+محمد\s+(?:رسول\s+الله|عبد\s+الله\s+ورسوله)?\s*إلى|بسم\s+الله\s+الرحمن\s+الرحيم\s+من\s+محمد|شق\s+كتاب|قطع\s+كتاب|تمزق\s+كتاب|خرق\s+كتاب|ختم\s+(?:ال)?كتاب|خاتم\s+(?:ال)?كتاب|كاتب\s|راسل\s|مكاتبات|مراسلات|مكاتب\s+الملوك|ديوان\s+(?:ال)?(?:خاتم|بريد|إنشاء|رسائل)|صاحب\s+(?:ال)?بريد|الخاتم\s+على\s+الكتب|عامل\s+البريد|إلى\s+(?:ال)?(?:هرقل|قيصر|كسرى|النجاشي|مقوقس|أبرويز|بلقيس|دحية)|كتب\s+(?:إليه|له)\s+(?:كتاب|رسالة|رقعة)|أتى\s+بكتاب|جاء\s+بكتاب|حمل\s+كتاب|أحضر\s+كتاب|وجد\s+(?:في\s+)?(?:يد\s+)?(?:رجل\s+)?كتاب|صحيفة|ورقة\s+مكتوب|كتب\s+اليه|إلي[هة]\s+بكتاب|رسالة\s+إلى|إلى\s+رسول|رسول\s+الله\s+إلى/;

const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
const strip = (s: string) =>
  s.replace(/ٰ/g, "ا").replace(/ـ/g, "").replace(DIACRITICS, "");

/** Person mentions we can resolve to graph records (bounded, verified ids). */
const PERSONS: [RegExp, string][] = [
  [/هرقل|قيصر الروم|قيصر/, "person/heraclius"],
  [/بلقيس|ملكة سبأ/, "person/bilqis"],
  [/النجاشي|أصحمة/, "person/negus-of-aksum"],
  [/المقوقس|مقوقس/, "person/al-muqawqis"],
  [/دحية|دحية الكلبي/, "person/dihya-al-kalbi"],
  [/رسول الله|النبي محمد|محمد رسول الله|محمد عبد الله/, "person/muhammad"],
  [/عمر بن الخطاب|عمر بن الخطاب|الخليفة عمر|عمر خليفة/, "person/umar-ibn-al-khattab"],
  [/عثمان بن عفان|عثمان بن عفان|الخليفة عثمان|عثمان خليفة/, "person/uthman-ibn-affan"],
  [/علي بن أبي طالب|علي بن أبي طالب|الخليفة علي|علي خليفة/, "person/ali-ibn-abi-talib"],
  [/أبو بكر الصديق|أبو بكر بن أبي قحافة/, "person/abu-bakr"],
  [/معاوية بن أبي سفيان|معاوية بن أبي سفيان/, "person/muawiya-ibn-abi-sufyan"],
  [/عبد الملك بن مروان|عبد الملك بن مروان/, "person/abd-al-malik-ibn-marwan"],
  [/الوليد بن عبد الملك/, "person/al-walid-ibn-abd-al-malik"],
  [/يزيد بن معاوية|يزيد بن معاوية/, "person/yazid-ibn-muawiya"],
  [/هشام بن عبد الملك/, "person/hisham-ibn-abd-al-malik"],
  [/مروان بن الحكم|مروان بن الحكم/, "person/marwan-ibn-al-hakam"],
  [/عمر بن عبد العزيز/, "person/umar-ibn-abd-al-aziz"],
  [/سليمان بن عبد الملك/, "person/sulayman-ibn-abd-al-malik"],
  [/أبو جعفر المنصور/, "person/al-mansur"],
];

const DIACRITIC_ONLY = /[ً-ٰٟۡ-ۭۨـ]/;

/** Strip diacritics while keeping a map back to raw-text indices. The dagger
 *  alif (ٰ) becomes a real alif so «كِتَـٰبِ» reads «كتاب», never «كتب». */
function stripMap(s: string): { out: string; map: number[] } {
  const out: string[] = [];
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "ٰ") {
      out.push("ا");
      map.push(i);
      continue;
    }
    if (DIACRITIC_ONLY.test(c)) continue;
    // Hamza carriers and alef maksura fold to their base letters so undiacritized
    // link/anchor patterns match regardless of the source's hamza spelling.
    if (c === "أ" || c === "إ" || c === "آ") {
      out.push("ا");
      map.push(i);
      continue;
    }
    if (c === "ؤ") {
      out.push("و");
      map.push(i);
      continue;
    }
    if (c === "ئ" || c === "ى") {
      out.push("ي");
      map.push(i);
      continue;
    }
    out.push(c);
    map.push(i);
  }
  return { out: out.join(""), map };
}

/** Isnad link verbs on undiacritized text — diacritic order in the source varies,
 *  so matching runs on the stripped copy and positions map back to the raw text. */
const ISNAD_LINK =
  /(?:حدثنا|اخبرنا|حدثني|اخبرني|سمعت|انبأني|رويت|قال|اخبر|حدث|سمع|انبأ|روي|قالت|قالوا|فقال|فذكر|فاخبر|فحدث|فسمع|فانبأ|فروي|حدثه|اخبره|سمعه|انبأه|رويه|حدثها|اخبرها|سمعها|انبأها|رويها|حدثهم|اخبرهم|سمعهم|انبأهم|روهم|عن)\s/g;

function matnRange(full: string): { start: number; end: number } {
  // The isnad is the opening chain of link verbs; the matn begins after the last
  // link verb inside the first ~55% of the stripped text. Fallback: everything.
  const { out, map } = stripMap(full);
  const limit = Math.floor(out.length * 0.55);
  let last = -1;
  for (const m of out.matchAll(ISNAD_LINK)) {
    if (m.index! > limit) break;
    last = m.index! + m[0].length;
  }
  if (last <= 0) return { start: 0, end: full.length };
  // Map the stripped index back to a raw index (end of the last link verb).
  const rawStart = map[last] ?? full.length;
  return { start: rawStart, end: full.length };
}

/** Letter-content anchors used to centre the excerpt on the correspondence. */
const ANCHOR =
  /بسم\s+الله\s+الرحمن\s+الرحيم|من\s+محمد|كتاب|رسالة|رقعة|صك|خطاب|جواب|هرقل|قيصر|كسرى|النجاشي|مقوقس|ابرويز|بلقيس|كاتب|راسل|مكاتبات|مراسلات|مكاتب|ديوان|بريد|خاتم|صحيفة|ورقة|مكتوب|اليه|اليها/;

/**
 * A ~55-word excerpt of the (diacritized) matn centred on the first
 * correspondence anchor. Word windows are computed on the stripped copy and
 * mapped back to raw indices, so the excerpt keeps the source vowelling.
 */
function excerptOf(matn: string): string {
  const { out: s, map } = stripMap(matn);
  const spans: { i: number; len: number }[] = [];
  for (const m of s.matchAll(/\S+/g)) spans.push({ i: m.index!, len: m[0].length });
  if (spans.length <= 55) return matn.trim();
  const am = s.match(ANCHOR);
  let startWord = 0;
  if (am && am.index !== undefined) {
    const anchorWord = spans.findIndex((w) => w.i + w.len > am.index);
    startWord = Math.max(0, (anchorWord < 0 ? 0 : anchorWord) - 22);
  }
  const endWord = Math.min(spans.length - 1, startWord + 54);
  const rawStart = map[spans[startWord].i] ?? 0;
  const lastSpan = spans[endWord];
  const rawEnd = (map[lastSpan.i + lastSpan.len - 1] ?? matn.length - 1) + 1;
  const prefix = startWord > 0 ? "… " : "";
  const suffix = endWord < spans.length - 1 ? " …" : "";
  return prefix + matn.slice(rawStart, rawEnd).trim() + suffix;
}

function nodeOf(id: string, work: string, text: string): Node {
  return {
    id,
    class: "passage",
    stub: false,
    tags: [],
    data: { text_search: strip(text), text, work, unit: "hadith", ref: "" },
  } as unknown as Node;
}

function yamlScalar(s: string): string {
  return JSON.stringify(s);
}
function flowMap(obj: Record<string, string>): string {
  return `{ ${Object.entries(obj).map(([k, v]) => `${k}: ${yamlScalar(v)}`).join(", ")} }`;
}

const SUMMARY_BY_SIGNAL: [RegExp, string, string, string][] = [
  [/send_to_royal|send_to_prophet|send_to/, "إرسال كتاب أو رسالة إلى طرف", "sending a letter or message to a party", "کسی فریق کو خط یا پیغام بھیجنا"],
  [/bring_obj|letter_from/, "وصول كتاب منسوب إلى مرسل", "a letter arriving from a named sender", "نامزد بھیجنے والے کا خط پہنچنا"],
  [/found_letter|read_letter|arrive_letter/, "العثور على كتاب أو وصوله وقراءته", "finding, receiving or reading a letter", "خط ملنا، پہنچنا یا پڑھنا"],
  [/open_named|open_sulaiman|basmala_open|reply_open/, "نص كتاب أو جوابه منسوب إلى مرسل", "a letter text or reply attributed to a sender", "بھیجنے والے سے منسوب خط کا متن یا جواب"],
  [/send_obj|kataba_verb|sahifa/, "ذكر كتابة كتاب أو إرساله", "mention of writing or dispatching a letter", "خط لکھنے یا بھیجنے کا ذکر"],
  [/diwan|sahib_barid|barid/, "ذكر ديوان أو بريد المراسلات", "mention of the chancery or the barid post", "دیوآن یا بریڈ کا ذکر"],
  [/khatm_doc/, "ذكر خاتم أو صك موثق", "mention of a seal or certified document", "مہر یا تصدیق شدہ دستاویز کا ذکر"],
  [/mukatabat_noun/, "ذكر المكاتبات أو المراسلات", "mention of correspondence", "مکاتبات کا ذکر"],
];

function summaryFor(signals: string[], book: (typeof BOOKS)[string]): { ar: string; en: string; ur: string } {
  const joined = signals.join(" ");
  const hit = SUMMARY_BY_SIGNAL.find(([re]) => re.test(joined));
  const [ar, en, ur] = hit ? hit.slice(1) : ["ذكر متعلق بالمكاتبات", "a mention related to correspondence", "مکاتبات سے متعلق ذکر"];
  return {
    ar: `في ${book.ar}؛ ${ar}.`,
    en: `In ${book.en}; ${en}.`,
    ur: `${book.ur} میں؛ ${ur}.`,
  };
}

function labelFor(book: (typeof BOOKS)[string], n: number, secEn: string | undefined): { ar: string; en: string; ur: string } {
  return {
    ar: `${book.ar} — حديث ${n}`,
    en: `${book.en} ${n}${secEn ? ` — ${secEn}` : ""}`,
    ur: `${book.ur} — حدیث ${n}`,
  };
}

const results: { id: string; signals: string[]; kind: string; sender: string | null; book: string; n: number }[] = [];
const skipped: string[] = [];

for (const [key, book] of Object.entries(BOOKS)) {
  const path = join(API_DIR, `${book.file}.json`);
  if (!existsSync(path)) {
    console.error(`missing ${path}`);
    continue;
  }
  const edition: HadithApiEdition = JSON.parse(readFileSync(path, "utf8"));
  const sections = edition.metadata?.sections ?? {};
  for (const h of edition.hadiths) {
    const full = h.text ?? "";
    if (!full || !PREFILTER.test(strip(full))) continue;
    const id = `passage/${book.prefix}-api-${h.hadithnumber}`;
    if (existsSync(join(OUT_DIR, `${book.prefix}-api-${h.hadithnumber}.yaml`))) continue;
    const probe = nodeOf(id, book.work, full);
    const signals = mukatabatSignalsOf(probe);
    if (!signals.length) {
      skipped.push(`${id}: no signals`);
      continue;
    }
    const kind = mukatabatKindOf(probe);
    const sender = mukatabatSenderOf(probe);
    // Excerpt must still carry the signal, else widen/centre on the anchor.
    const matn = full.slice(matnRange(full).start);
    let excerpt = excerptOf(matn);
    let probe2 = nodeOf(id, book.work, excerpt);
    if (!mukatabatSignalsOf(probe2).length) {
      // Fall back to a window around the first anchor in the full text.
      const { out: sf, map: mmap } = stripMap(full);
      const spans: { i: number; len: number }[] = [];
      for (const m of sf.matchAll(/\S+/g)) spans.push({ i: m.index!, len: m[0].length });
      const am = sf.match(ANCHOR);
      if (am && am.index !== undefined && spans.length > 10) {
        const anchorWord = spans.findIndex((w) => w.i + w.len > am.index);
        const startWord = Math.max(0, (anchorWord < 0 ? 0 : anchorWord) - 20);
        const endWord = Math.min(spans.length - 1, startWord + 59);
        const rs = mmap[spans[startWord].i] ?? 0;
        const ls = spans[endWord];
        const re = (mmap[ls.i + ls.len - 1] ?? full.length - 1) + 1;
        excerpt = (startWord > 0 ? "… " : "") + full.slice(rs, re).trim() + (endWord < spans.length - 1 ? " …" : "");
        probe2 = nodeOf(id, book.work, excerpt);
      }
      if (!mukatabatSignalsOf(probe2).length) {
        skipped.push(`${id}: excerpt lost signals (${signals.join(",")})`);
        continue;
      }
    }
    results.push({ id, signals, kind, sender, book: key, n: h.hadithnumber });
    if (DRY) continue;
    const secEn = h.reference?.book !== undefined ? sections[String(h.reference.book)] : undefined;
    const label = labelFor(book, h.hadithnumber, secEn);
    const summary = summaryFor(signals, book);
    const persons = new Set<string>();
    const raw = strip(full);
    for (const [re, pid] of PERSONS) if (re.test(raw)) persons.add(pid);
    const rels = [...persons].map(
      (p) => `  - { type: mentions, target: ${p}, sources: [${book.source}, source/hadith-api-fawazahmed0] }`,
    );
    const refBook = h.reference?.book;
    const refHadith = h.reference?.hadith;
    const provSrc = `fawazahmed0/hadith-api (Unlicense), edition ${book.file}, hadith ${h.hadithnumber}${refBook !== undefined ? ` (book ${refBook} hadith ${refHadith})` : ""}; matn excerpt of at most ~55 words`;
    const yaml = [
      `id: ${id}`,
      `class: passage`,
      `unit: hadith`,
      `work: ${book.work}`,
      `ref: "${h.hadithnumber}"`,
      `label: ${flowMap(label)}`,
      `text: ${yamlScalar(excerpt)}`,
      `summary:`,
      `  ar: ${yamlScalar(summary.ar)}`,
      `  en: ${yamlScalar(summary.en)}`,
      `  ur: ${yamlScalar(summary.ur)}`,
      ...(rels.length ? [`relations:`, ...rels] : []),
      `provenance: { layer: own-research, source: ${yamlScalar(provSrc)}, generated_by: "Devin (SWE-2 High)", run: "mukatabat-hadithapi-1" }`,
      `sources: [${book.source}, source/hadith-api-fawazahmed0]`,
      `status: { review: draft, completeness: 1, generated_by: "Devin (SWE-2 High) from the hadith-api Arabic edition; label, summary and excerpt are the museum's own words" }`,
      ``,
    ].join("\n");
    writeFileSync(join(OUT_DIR, `${book.prefix}-api-${h.hadithnumber}.yaml`), yaml);
  }
  console.log(`${book.prefix}: done`);
}

console.log(`\n=== ${results.length} passages ${DRY ? "(dry)" : "written"} ===`);
const byBook = new Map<string, number>();
for (const r of results) byBook.set(r.book, (byBook.get(r.book) ?? 0) + 1);
console.log([...byBook.entries()].map(([b, c]) => `${c}\t${b}`).join("\n"));
console.log(`skipped: ${skipped.length}`);
for (const s of skipped.slice(0, 30)) console.log("  " + s);
