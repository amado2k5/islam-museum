// The Juha and Islamic Folklore Browser's shared reads (docs/plan/72-juha-browser.md):
// which passage records carry Juha, a named wit or fool, an anecdote (نادرة), a jest
// (مزاح، دعابة), laughter (ضحك، تبسّم) or the ethics of jesting — in the Qur'an, the
// hadith collections, the seerah books and every other harvested work. Detection runs
// at build time over the compiled graph, so a book harvested later appears here the
// day its passage records land, with no tagging step. Curated records (Juha himself,
// the wits, the nawadir books, the genre concepts) join through the `juha-browser` tag.
//
// Scope (founder's brief, 20 November 2026): «جحا والفلكلور الإسلامي عبر العصور
// والكوميديا والنكت والطرائف والنوادر» — everything said and written about them in
// the Qur'an, the Sunnah, the seerah, the reports of the Companions and Successors,
// and the harvested Sunni books. Out of scope by design: «نادر» the rare legal case
// and the book title «النوادر والزيادات» / «نوادر الأصول» (fiqh and hadith genres, not
// humour), «ملح» salt, «رجح/أرجح» (never «جحا»), «الظرف» the adverb of grammar, and
// mockery of the prophets by their opponents (istihza'), which is not humour.
import type { Node } from "./build-graph.js";

export const JUHA_TAG = "juha-browser";
/** Page sections: the curated records, Juha's own shelf, then the four passage corpora. */
/** `juha` is the shelf of Juha's own anecdote books (Nawadir Juha al-Kubra and any later one in JUHA_WORKS). */
export const JUHA_SECTIONS = ["curated", "juha", "quran", "sunnah", "seerah", "books"] as const;
/** Works whose passages are Juha anecdotes: a newly harvested Juha collection is added here by one line. */
export const JUHA_WORKS = new Set<string>(["work/nawadir-juha-al-kubra"]);
export type JuhaSection = (typeof JUHA_SECTIONS)[number];
export type JuhaCorpus = Exclude<JuhaSection, "curated">;
/**
 * What kind of humour a record carries — the browser's own facet:
 * `juha` names Juha (or Nasreddin); `wits` names a famous wit, fool, miser or
 * party-crasher (أشعب، نعيمان، مزبّد، هبنّقة، ظريف، مغفّل، طفيلي); `anecdote` is a
 * told funny story (نادرة، طرفة، ملحة، نكتة مضحكة); `jest` is joking and playfulness
 * (مزاح، دعابة، هزل، ملاعبة); `laughter` is laughing and smiling (ضحك، تبسّم);
 * `ethics` is the rule of jesting (لا يسخر قوم، ويل للذي يحدث فيكذب ليضحك).
 */
export const JUHA_KINDS = ["juha", "wits", "anecdote", "jest", "laughter", "ethics"] as const;
export type JuhaKind = (typeof JUHA_KINDS)[number];

const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ…]`;
const BL = String.raw`(?:^|${B})`;
const BR = String.raw`(?=$|${B})`;
/** Optional one-letter proclitics (و ف ب ل ك) and the article, in the usual orders. */
const P = String.raw`(?:[وف])?(?:[بلك])?(?:ال|لل)?`;
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/** Fold a text for matching: dagger alif to alif, diacritics and tatweel out, alef forms united. */
export function juhaFold(s: string): string {
  return s.replace(/ٰ/g, "ا").replace(/ـ/g, "").replace(DIACRITICS, "").replace(/[أإآٱ]/g, "ا");
}

const re = (body: string) => new RegExp(`${BL}(?:${body})${BR}`);

// --- Juha ------------------------------------------------------------------
/** «جحا» as a whole word (never inside أرجحا/رجحان), and the Turkish Nasreddin. */
const RE_JUHA = re(`[وفبلك]?جحا|[وفبلك]?جحي|نصر الدين خوج[هةا]|[وف]?(?:ال)?خوج[هة] نصر الدين`);

// --- The wits, fools, misers and party-crashers -----------------------------
/** Named figures of the nawadir books. Each needs its distinguishing second word where the bare name is common. */
const RE_WITS_NAMED = re(
  [
    `[وفبل]?اشعب(?: الطامع| الطماع| بن جبير)?`, `[وفبل]?نعيمان`, `[وفبل]?النعيمان`, `سويبط`,
    `مزبد(?: المدني| المديني)?`, `هبنقة`, `بهلول المجنون`, `البهلول`, `ابو دلامة`, `ابي دلامة`, `ابا دلامة`,
    `ابو العيناء`, `ابي العيناء`, `ابا العيناء`, `ابو الشمقمق`, `الجماز`, `ابو العبر`, `ابن الجصاص`,
    `ابو علقمة النحوي`, `عيناوة`, `دغة`, `باقل`, `عجل بن لجيم`, `طفيل العرائس`, `بنان الطفيلي`, `ابن دراج الطفيلي`,
  ].join("|"),
);
/** The types: the witty, the fool, the heedless, the party-crasher, the buffoon. */
const RE_WITS_TYPE = re(
  `(?:${P}(?:ظريف|ظريفا|ظريفة|ظرفاء|ظراف|متماجن|متماجنين|ماجن|مجون|مغفلين|مغفلون|حمقي|حمقى|نوكي|نوكى|طفيلي|طفيليين|طفيليون|تطفيل|متطفل|مضحك|مضحكين|مضحكون|بخلاء)|احمق من|اخبار الحمق[يى]|(?:كان|رجل|شيخ|اعرابي) مغفل(?:ا)?)`,
);
const ZARF_GRAMMAR = /ظرف (?:زمان|مكان)|الظرفية|ظرفا? ل|منصوب علي الظرف/;

// --- The anecdote ------------------------------------------------------------
const RE_NADIRA = re(
  `${P}(?:نوادر|نوادره|نوادرهم|نادرة من|طرفة|طرائف|مستطرف|مستطرفة|املوحة|اضحوكة|اضاحيك|مضحكة|مضحكات|فكاهة|فكاهات|فكاهي|مفاكهة|نكتة مضحكة|نكت مضحكة|ملح ونوادر|نوادر وملح)`,
);
/** «نادرة/نوادر» as the fiqh or hadith term, never the funny story. */
const NADIRA_FIQH = /النوادر والزيادات|نوادر الاصول|مسال[هة] نادرة|صورة نادرة|حال[هة] نادرة|نادرة الوقوع|نادرة الوجود|كتب النوادر|رواي[هة] النوادر|ظاهر الرواي[هة]|في النوادر عن|ذكر في النوادر|نوادر (?:هشام|ابن سماعة|ابي يوسف|محمد|المعلي|ابن رستم|الصلاة|الصوم|الفقهاء|بشر)/;
const TURFA_EYE = /(?:بن|ابن) طرف[هة]|طرف[هة] بن|طرف[هة] عين|طرف العين|طرف الثوب|طرف الردا|طرف من|طرف (?:الحبل|السيف|الرمح|اللسان|الارض|النهار|المدين[هة]|البلد)|بطرف|طرفي|طرفا من/;

// --- Jesting -----------------------------------------------------------------
const RE_MUZAH = re(
  `${P}(?:مزاح|مزاحا|مزاحه|مزح|مزحة|يمزح|تمزح|امزح|نمزح|يمزحون|تمازح|يمازح|مازح|مازحه|مازحته|مازحني|يمازحه|مزاحة|ممازحة|دعابة|دعابته|داعب|يداعب|تداعب|يداعبه|مداعبة|مداعبته|الهزل|هزل|هزلا|هازل|هازلا|يهزل|هزلهن|ملاعبة|يلاعبه|تلاعبها|تلاعبك|يتمازحون|يتبادحون|المفاكهة)`,
);

// --- Laughter ----------------------------------------------------------------
const RE_DAHIK = re(
  `${P}(?:ضحك|ضحكا|ضحكت|ضحكوا|ضحكنا|يضحك|تضحك|اضحك|نضحك|يضحكون|تضحكون|ضاحك|ضاحكا|ضاحكة|ضحوك|ضحاك|ضحكه|ضحكك|ضحكة|استضحك|فاستضحك|اضحكه|اضحكني|اضحكك|يضحكه|يضحكني|يضحكك|يضحكهم|اضحكهم|ليضحك|تبسم|تبسما|فتبسم|يتبسم|متبسما|التبسم|تبسمه|تبسمت|نواجذه|قهقه|قهقهة)`,
);
/** «الضحاك» the personal name (al-Dahhak ibn Muzahim, ibn Qays…), never laughter. */
const DAHHAK_NAME = /الضحاك(?: بن| ابن|،| عن| قال|:)|عن الضحاك|ضحاك بن|ابو الضحاك|ابي الضحاك/;

// --- The ethics of jesting -----------------------------------------------------
const RE_ETHICS = /لا يسخر قوم|ليضحك به القوم|فيكذب ليضحك|ولا امزح الا|لا اقول الا حقا|كثرة الضحك|تميت القلب|جدهن جد|ولو كان مازحا|لاعبا ولا جادا|لا تمار اخاك ولا تمازحه/;

/** Passages whose only hit is a verified false positive. Add by id, never by deleting a rule. */
export const JUHA_EXCLUDE = new Set<string>([]);

function rawTextOf(n: Node): string {
  return juhaFold([n.data.text_search, n.data.text].filter(Boolean).join(" "));
}

/** The matched signal names of an already folded text, or [] when it carries no humour. */
export function juhaSignalsOfText(raw: string): string[] {
  const hits: string[] = [];
  if (RE_JUHA.test(raw)) hits.push("juha");
  if (RE_WITS_NAMED.test(raw)) hits.push("wits_named");
  if (RE_WITS_TYPE.test(raw.replace(new RegExp(ZARF_GRAMMAR.source, "g"), " "))) hits.push("wits_type");
  const nadiraText = raw.replace(new RegExp(NADIRA_FIQH.source, "g"), " ").replace(new RegExp(TURFA_EYE.source, "g"), " ");
  if (RE_NADIRA.test(nadiraText)) hits.push("nadira");
  if (RE_MUZAH.test(raw)) hits.push("muzah");
  if (RE_DAHIK.test(raw.replace(new RegExp(DAHHAK_NAME.source, "g"), " "))) hits.push("dahik");
  if (RE_ETHICS.test(raw)) hits.push("ethics");
  return hits;
}

/** The matched signal names for a passage, or [] when it is not about humour. */
export function juhaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub || JUHA_EXCLUDE.has(n.id)) return [];
  const raw = rawTextOf(n);
  const hits = raw ? juhaSignalsOfText(raw) : [];
  // An anecdote of a Juha collection is Juha's even where the excerpt does not spell his name.
  if (JUHA_WORKS.has(String(n.data.work ?? "")) && !hits.includes("juha")) hits.unshift("juha");
  return hits;
}

export function isJuhaPassage(n: Node): boolean {
  return juhaSignalsOf(n).length > 0;
}

/** One kind per record, the most specific signal first. */
export function juhaKindOfSignals(signals: string[]): JuhaKind | null {
  if (signals.includes("juha")) return "juha";
  if (signals.includes("wits_named")) return "wits";
  if (signals.includes("ethics")) return "ethics";
  if (signals.includes("nadira")) return "anecdote";
  if (signals.includes("wits_type")) return "wits";
  if (signals.includes("muzah")) return "jest";
  if (signals.includes("dahik")) return "laughter";
  return null;
}
export function juhaKindOf(n: Node): JuhaKind | null {
  return juhaKindOfSignals(juhaSignalsOf(n));
}

/** Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith collections, the seerah books, every other harvested work. */
export function juhaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): JuhaCorpus {
  if (workId === "work/quran") return "quran";
  if (workId && JUHA_WORKS.has(workId)) return "juha";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `juha-<section>` when present, else `curated`. */
export function juhaTagSection(n: Node): JuhaSection {
  for (const t of n.tags) {
    if (!t.startsWith("juha-") || t === JUHA_TAG) continue;
    const id = t.slice(5);
    if ((JUHA_SECTIONS as readonly string[]).includes(id)) return id as JuhaSection;
  }
  return "curated";
}

/** The kind tag of a curated record: `juha-kind-<kind>` when present. */
export function juhaTagKind(n: Node): JuhaKind | null {
  for (const t of n.tags) {
    if (!t.startsWith("juha-kind-")) continue;
    const id = t.slice(10);
    if ((JUHA_KINDS as readonly string[]).includes(id)) return id as JuhaKind;
  }
  return null;
}
