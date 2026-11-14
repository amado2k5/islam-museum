/**
 * Harvest medical passages from books already OCR'd on the harvest drive (Apple Vision text in
 * <book>/<scan>/pages.json) into data/passage/, for the Medicine Browser
 * (docs/plan/57-tibb-browser.md): the seerah books, the biographies of the Companions and the
 * Successors, and the medical classics. No PDF, OCR text or page image enters git — only an
 * excerpt of at most 40 words per page, cited to the work and the scan page (docs/sources-policy.md).
 *
 * A page is a candidate when the browser's own detector (scripts/tibb.ts, book-corpus rule) fires
 * on a 40-word window of it; the densest pages of each book are kept, up to the book's cap. Windows
 * that carry a Qur'an quotation marker are skipped (Qur'an text is never typed), and windows the OCR
 * garbled (too many stray single letters or Latin) are skipped.
 *
 * Usage: npx tsx scripts/harvest-tibb-ocr.ts <harvest books dir> [--dry] [--only <prefix>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tibbFold, tibbSignalsOfText, tibbTopicsOfSignals, TIBB_WEAK_IN_BOOKS } from "./tibb.js";
import { TOPIC_ANCHOR } from "./harvest-tibb-anchors.js";

const ROOT = process.argv[2];
const DRY = process.argv.includes("--dry");
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const OUT_DIR = "data/passage";
if (!ROOT || ROOT.startsWith("--")) throw new Error("usage: harvest-tibb-ocr.ts <books dir> [--dry] [--only <prefix>]");

interface Book { dir: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string; cap: number; minSignals?: number }
const BOOKS: Book[] = [
  { dir: "seerah/zad-maad", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad", ar: "زاد المعاد لابن القيم", en: "Ibn al-Qayyim's Zad al-Ma'ad", ur: "زاد المعاد، ابن القیم", cap: 160 },
  { dir: "seerah/dalail-nubuwwa-bayhaqi", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi", ar: "دلائل النبوة للبيهقي", en: "al-Bayhaqi's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، بیہقی", cap: 40, minSignals: 2 },
  { dir: "seerah/dalail-nubuwwa-abu-nuaym", prefix: "dalail-nubuwwa-abu-nuaym", work: "work/dalail-al-nubuwwa-abu-nuaym", source: "source/dalail-al-nubuwwa-abu-nuaym", ar: "دلائل النبوة لأبي نعيم", en: "Abu Nu'aym's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، ابو نعیم", cap: 25, minSignals: 2 },
  { dir: "tabaqat/tabaqat-ibn-saad", prefix: "tabaqat-ibn-saad", work: "work/al-tabaqat-al-kubra-ibn-sad", source: "source/tabaqat-ibn-sad", ar: "الطبقات الكبرى لابن سعد", en: "Ibn Sa'd's al-Tabaqat al-Kubra", ur: "الطبقات الکبریٰ، ابن سعد", cap: 70, minSignals: 2 },
  { dir: "sahaba/hilyat-awliya", prefix: "sahaba-hilyat-awliya", work: "work/hilyat-al-awliya", source: "source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988", ar: "حلية الأولياء لأبي نعيم", en: "Abu Nu'aym's Hilyat al-Awliya'", ur: "حلیۃ الاولیاء، ابو نعیم", cap: 70, minSignals: 2 },
  { dir: "sahaba/isaba", prefix: "sahaba-isaba", work: "work/al-isaba-fi-tamyiz-al-sahaba", source: "source/isaba", ar: "الإصابة لابن حجر", en: "Ibn Hajar's al-Isaba", ur: "الاصابہ، ابن حجر", cap: 40, minSignals: 2 },
  { dir: "sahaba/usd-ghaba", prefix: "sahaba-usd-ghaba", work: "work/usd-al-ghaba", source: "source/usd-al-ghaba", ar: "أسد الغابة لابن الأثير", en: "Ibn al-Athir's Usd al-Ghaba", ur: "اسد الغابہ، ابن الاثیر", cap: 40, minSignals: 2 },
  { dir: "sahaba/isti-ab", prefix: "sahaba-isti-ab", work: "work/al-istiab", source: "source/isti-ab-ibn-abd-al-barr", ar: "الاستيعاب لابن عبد البر", en: "Ibn 'Abd al-Barr's al-Isti'ab", ur: "الاستیعاب، ابن عبد البر", cap: 30, minSignals: 2 },
  { dir: "sahaba/hayat-sahaba", prefix: "sahaba-hayat-sahaba", work: "work/hayat-al-sahaba", source: "source/hayat-al-sahaba-kandahlawi-sabbani", ar: "حياة الصحابة للكاندهلوي", en: "al-Kandahlawi's Hayat al-Sahaba", ur: "حیاۃ الصحابہ، کاندھلوی", cap: 40, minSignals: 2 },
  { dir: "sahaba/safwat-safwa", prefix: "sahaba-safwat-safwa", work: "work/sifat-al-safwa", source: "source/sifat-al-safwa-tartusi-2012", ar: "صفة الصفوة لابن الجوزي", en: "Ibn al-Jawzi's Sifat al-Safwa", ur: "صفۃ الصفوہ، ابن الجوزی", cap: 30, minSignals: 2 },
  { dir: "medicine-science/canon-ibn-sina-print-v1", prefix: "qanun-v1", work: "work/al-qanun-fi-al-tibb", source: "source/canon-ibn-sina-print-v1", ar: "القانون في الطب لابن سينا ج1", en: "Ibn Sina's Canon of Medicine, vol. 1", ur: "القانون فی الطب، ابن سینا ج1", cap: 60, minSignals: 3 },
  { dir: "medicine-science/canon-ibn-sina-print-v2", prefix: "qanun-v2", work: "work/al-qanun-fi-al-tibb", source: "source/canon-ibn-sina-print-v2", ar: "القانون في الطب لابن سينا ج2", en: "Ibn Sina's Canon of Medicine, vol. 2", ur: "القانون فی الطب، ابن سینا ج2", cap: 50, minSignals: 3 },
  { dir: "medicine-science/canon-ibn-sina-print-v3", prefix: "qanun-v3", work: "work/al-qanun-fi-al-tibb", source: "source/canon-ibn-sina-print-v3", ar: "القانون في الطب لابن سينا ج3", en: "Ibn Sina's Canon of Medicine, vol. 3", ur: "القانون فی الطب، ابن سینا ج3", cap: 50, minSignals: 3 },
  { dir: "medicine-science/sharh-tashrih-qanun-ibn-nafis", prefix: "sharh-tashrih-qanun", work: "work/sharh-tashrih-al-qanun", source: "source/sharh-tashrih-qanun-print", ar: "شرح تشريح القانون لابن النفيس", en: "Ibn al-Nafis's Commentary on the Anatomy of the Canon", ur: "شرح تشریح القانون، ابن النفیس", cap: 60, minSignals: 2 },
  { dir: "medicine-science/hawi-razi", prefix: "hawi-razi", work: "work/al-hawi-fi-al-tibb", source: "source/hawi-razi-dar-kutub-ilmiyya", ar: "الحاوي في الطب للرازي", en: "al-Razi's al-Hawi fi al-Tibb", ur: "الحاوی فی الطب، رازی", cap: 60, minSignals: 3 },
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
 "udhra": ["علاج العذرة","treating the throat ailment (al-udhra)","گلے کی بیماری عذرہ کا علاج"],
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

const QURAN_MARK = /[\uFD3E\uFD3F{}]|قوله تعالي|قال تعالي|قال الله|عز وجل|قوله سبحانه|قول الله/;
/** Honorific formulas the OCR spelled in a way the cleaner does not cut: such a window is skipped, not repaired. */
const HONORIFIC_LEFT = /رضي ا?لل?ه عن|رضوان الله|صلي الله|صلي ا?لل?ه عليه|عليه السلام|عليهم السلام|رحمه الله|رحمة الله عليه|قدس الله|كرم الله وجهه/;
const uniq = <T,>(xs: T[]) => [...new Set(xs)];
const q = (s: string) => JSON.stringify(s);

/** Clean an OCR page: footnote digits, Latin, brackets and line breaks go; honorific formulas go. */
function pageWords(text: string): string[] {
  return clean(text.replace(/[A-Za-z0-9\u0660-\u0669()\[\]«»"*#_=|/\\<>~^`]+/g, " ").replace(/\s+/g, " ")).split(" ").filter(Boolean);
}

interface Cand { vol: number; scan: string; page: number; text: string; signals: string[] }

function bestWindow(words: string[], minSignals: number): { text: string; signals: string[] } | null {
  let best: { text: string; signals: string[] } | null = null;
  for (let start = 0; start < words.length; start += 10) {
    const slice = words.slice(start, start + 40);
    if (slice.length < 18) break;
    const text = slice.join(" ");
    const folded = tibbFold(text);
    if (QURAN_MARK.test(folded) || QURAN_MARK.test(text) || HONORIFIC_LEFT.test(folded)) continue;
    const stray = slice.filter((w) => tibbFold(w).length <= 1).length;
    if (stray > slice.length * 0.08) continue;
    const signals = tibbSignalsOfText(folded, true);
    if (signals.filter((s) => !TIBB_WEAK_IN_BOOKS.has(s) && s !== "marad_nabi").length < Math.min(minSignals, 2) || signals.length < minSignals) continue;
    if (!best || signals.length > best.signals.length) best = { text: (start > 0 ? "… " : "") + text + (start + 40 < words.length ? " …" : ""), signals };
  }
  return best;
}

let total = 0;
for (const book of BOOKS) {
  if (ONLY && book.prefix !== ONLY) continue;
  if (!existsSync(`data/${book.work.replace("/", "/")}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const base = join(ROOT, book.dir);
  if (!existsSync(base)) { console.error(`skip ${book.prefix}: ${base} missing`); continue; }
  const scans = readdirSync(base).filter((d) => existsSync(join(base, d, "pages.json"))).sort();
  const cands: Cand[] = [];
  const seenText = new Set<string>();
  scans.forEach((scan, vi) => {
    const pages: { page: number; text?: string }[] = JSON.parse(readFileSync(join(base, scan, "pages.json"), "utf8"));
    for (const p of pages) {
      if (!p.text || p.text.length < 200) continue;
      const w = bestWindow(pageWords(p.text), book.minSignals ?? 1);
      if (!w) continue;
      const key = tibbFold(w.text).slice(20, 90);
      if (seenText.has(key)) continue; // the same edition scanned twice
      seenText.add(key);
      cands.push({ vol: vi + 1, scan, page: p.page, text: w.text, signals: w.signals });
    }
  });
  // densest pages first, then spread: keep at most one of any three neighbouring pages
  cands.sort((a, b) => b.signals.length - a.signals.length || a.vol - b.vol || a.page - b.page);
  const kept: Cand[] = [];
  for (const c of cands) {
    if (kept.length >= book.cap) break;
    if (kept.some((k) => k.vol === c.vol && Math.abs(k.page - c.page) <= 1)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.vol - b.vol || a.page - b.page);
  for (const c of kept) {
    const slug = `${book.prefix}-tibb-${scans.length > 1 ? `${c.vol}-` : ""}${c.page}`;
    const file = join(OUT_DIR, `${slug}.yaml`);
    if (existsSync(file)) continue;
    const topics = tibbTopicsOfSignals(c.signals);
    const says = uniq(c.signals.map((s) => SAYS[s]).filter(Boolean).map((s) => s.join("\u0001"))).map((s) => s.split("\u0001"));
    const where = { ar: `${scans.length > 1 ? `المجلد المصوَّر ${c.vol}، ` : ""}ص ${c.page}`, en: `${scans.length > 1 ? `scan volume ${c.vol}, ` : ""}p. ${c.page}`, ur: `${scans.length > 1 ? `اسکین جلد ${c.vol}، ` : ""}ص ${c.page}` };
    const label = {
      ar: `${book.ar}، ${where.ar} — ${says.slice(0, 2).map((s) => s[0]).join("، ")}`,
      en: `${book.en}, ${where.en} — ${says.slice(0, 2).map((s) => s[1]).join("; ")}`,
      ur: `${book.ur}، ${where.ur} — ${says.slice(0, 2).map((s) => s[2]).join("، ")}`,
    };
    const summary = {
      ar: `مقطع من ${book.ar}، ${where.ar}، يذكر ${says.map((s) => s[0]).join("، و")}؛ من النسخة المصورة المقروءة آليا، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر.`,
      en: `An excerpt from ${book.en}, ${where.en}, that mentions ${says.map((s) => s[1]).join(", ")}; from the machine-read scan, quoted within forty words per the sources policy.`,
      ur: `${book.ur}، ${where.ur} کا اقتباس جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے؛ مشینی طور پر پڑھی گئی نقل سے، چالیس الفاظ کی حد میں۔`,
    };
    const src = `[${book.source}]`;
    const yaml = [
      `id: passage/${slug}`,
      `class: passage`,
      `unit: chapter`,
      `work: ${book.work}`,
      `ref: ${q(scans.length > 1 ? `${c.vol}:${c.page}` : String(c.page))}`,
      `label: { ar: ${q(label.ar)}, en: ${q(label.en)}, ur: ${q(label.ur)} }`,
      `text: ${q(c.text)}`,
      `summary:`,
      `  ar: ${q(summary.ar)}`,
      `  en: ${q(summary.en)}`,
      `  ur: ${q(summary.ur)}`,
      `relations:`,
      ...topics.map((t) => `  - { type: mentions, target: ${TOPIC_ANCHOR[t]}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`Apple Vision OCR of the scan ${book.dir}/${c.scan}, page ${c.page}; a window of at most 40 words chosen by the medicine detector (scripts/tibb.ts); OCR text not corrected`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "tibb-ocr-1" }`,
      `sources: ${src}`,
      `status: { review: draft, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the OCR'd book; label and summary are the museum's own words" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    total++;
  }
  console.log(book.prefix, `${kept.length} kept of ${cands.length} candidate pages in ${scans.length} scan(s)`);
}
console.log(`${total} passages ${DRY ? "(dry run)" : "written"}`);
