// The Qiyama Browser's shared reads (docs/plan/56-qiyama-browser.md): which passage records
// mention the Resurrection (البعث), the Day of Judgement (يوم القيامة) and the Reckoning
// (الحساب), and which corpus section each belongs to. Detection runs at build time over the
// compiled graph, so a qiyama mention in any harvested book — and in every book harvested
// later — appears without any tagging step. Curated records join through the
// `qiyama-browser` tag instead.
//
// Scope is the day itself and its stations, from the Trumpet blasts to the crossing of the
// Sirat: the Day's names (يوم القيامة، يوم الدين، يوم الفصل، الحاقة، القارعة، الصاخة…),
// the raising of the dead (البعث، النشور، الخروج من القبور), the gathering (الحشر، أرض
// المحشر), the terrors (أهوال، الفزع، دنو الشمس، العرق), the display and the records
// (العرض، الصحف، أخذ الكتاب باليمين وبالشمال), the reckoning (الحساب، أول ما يحاسب عليه
// العبد), the Scale (الميزان، ثقلت موازينه), the dispute and retaliation among creatures
// (القصاص، اقتصاص الكبش), the Shade, the Hawd, the intercession and the Sirat. Out of
// scope by design: the barzakh and the grave's question (سؤال القبر) — the pre-resurrection
// world belongs to the Signs of the Hour browser — and the signs of the Hour themselves,
// Paradise and Hellfire (own browsers), and worldly حساب arithmetic.
//
// The lexicon is deliberately gated: unvocalized بعث can mean sending a messenger, الساعة a
// clock-hour, حساب an arithmetic account, الصراط the straight path of guidance, شفاعة any
// mediation. Ambiguous lexemes count only beside a resurrection/reckoning collocation.
import type { Node } from "./build-graph.js";

export const QIYAMA_TAG = "qiyama-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const QIYAMA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type QiyamaSection = (typeof QIYAMA_SECTIONS)[number];
export type QiyamaCorpus = Exclude<QiyamaSection, "curated">;
/** `baath` = the raising and gathering; `yawm` = the Day, its names and terrors; `hisab` = reckoning, scale, records and crossing. */
export type QiyamaKind = "baath" | "yawm" | "hisab";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const BL = String.raw`(?:^|${B})`;
const E = String.raw`(?:$|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

const PRE = String.raw`(?:[وبفسلك]){0,2}`;
const ART = String.raw`(?:ال)?`;

/**
 * Strong hits — unambiguous Day-of-Judgement names, compounds and stations, no gate needed.
 * Every «يوم …» entry is a fixed eschatological compound; «الصراط المستقيم» and worldly
 * حساب never appear in these shapes.
 */
const STRONG: [string, RegExp][] = [
  // ---- The Day's names ----
  ["yawm-al-qiyama", new RegExp(`${BL}${PRE}يوم\\s+القيامة(?=${E})`)],
  ["yawm-al-din", new RegExp(`${BL}${PRE}يوم\\s+الدين(?=${E})`)],
  ["yawm-al-hashr", new RegExp(`${BL}${PRE}يوم\\s+الحشر(?=${E})`)],
  ["yawm-al-nushur", new RegExp(`${BL}${PRE}يوم\\s+النشور(?=${E})`)],
  ["yawm-al-bath", new RegExp(`${BL}${PRE}يوم\\s+البعث(?=${E})`)],
  ["yawm-al-fasl", new RegExp(`${BL}${PRE}يوم\\s+الفصل(?=${E})`)],
  ["yawm-al-hisab", new RegExp(`${BL}${PRE}يوم\\s+الحساب(?=${E})`)],
  ["yawm-al-talaq", new RegExp(`${BL}${PRE}يوم\\s+التلاق(?=${E})`)],
  ["yawm-al-taghabun", new RegExp(`${BL}${PRE}يوم\\s+التغابن(?=${E})`)],
  ["yawm-al-hasra", new RegExp(`${BL}${PRE}يوم\\s+الحسرة(?=${E})`)],
  ["yawm-al-waid", new RegExp(`${BL}${PRE}يوم\\s+الوعيد(?=${E})`)],
  ["yawm-al-khuruj", new RegExp(`${BL}${PRE}يوم\\s+الخروج(?=${E})`)],
  ["yawm-al-jam", new RegExp(`${BL}${PRE}يوم\\s+الجمع(?=${E})`)],
  ["yawm-al-qarar", new RegExp(`${BL}${PRE}يوم\\s+القرار(?=${E})`)],
  ["yawm-al-adim", new RegExp(`${BL}${PRE}يوم\\s+عظيم|${BL}${PRE}اليوم\\s+العظيم(?=${E})`)],
  ["al-yawm-al-akhar", new RegExp(`${BL}${PRE}اليوم\\s+الاخر(?=${E})`)],
  ["al-haqqa", new RegExp(`${BL}${PRE}الحاق[ةة](?=${E})`)],
  ["al-qaria", new RegExp(`${BL}${PRE}القارعة(?=${E})`)],
  ["al-sakhkha", new RegExp(`${BL}${PRE}الصاخة(?=${E})`)],
  ["al-ghashiya", new RegExp(`${BL}${PRE}الغاشية(?=${E})`)],
  ["al-azifa", new RegExp(`${BL}${PRE}الازفة(?=${E})`)],
  // ---- Trumpet, raising, gathering ----
  ["nafkha", new RegExp(`${BL}${PRE}نفخة\\s+(?:الصور|البعث|الصعق)|${BL}${PRE}النفختين(?=${E})`)],
  ["nafkh-as-sur", new RegExp(`${BL}${PRE}نفخ\\s+(?:في\\s+)?(?:ال)?صور|${BL}${PRE}ينفخ\\s+في\\s+(?:ال)?صور|${BL}${PRE}فانفخ\\s+في\\s+(?:ال)?صور(?=${E})`)],
  ["al-bath-noun", new RegExp(`${BL}${PRE}البعث\\s+والنشور|${BL}${PRE}بعث\\s+الموتى|${BL}${PRE}يبعث\\s+الموتى|${BL}${PRE}يبعث\\s+من\\s+في\\s+(?:ال)?قبور|${BL}${PRE}يبعث\\s+الله\\s+الموتى|${BL}${PRE}بعثناهم|${BL}${PRE}ان\\s+يبعثوا|${BL}${PRE}ان\\s+نبعث|${BL}${PRE}لنبعثنهم(?=${E})`)],
  ["nushur", new RegExp(`${BL}${PRE}النشور|${BL}${PRE}ينشرون|${BL}${PRE}نشر[اة]?\\s+الموتى|${BL}${PRE}النشر\\s+من\\s+القبور(?=${E})`)],
  ["hashr", new RegExp(`${BL}${PRE}الحشر|${BL}${PRE}يحشرون|${BL}${PRE}حشرناهم|${BL}${PRE}يحشر\\s+الناس|${BL}${PRE}حشرتم|${BL}${PRE}نحشرهم|${BL}${PRE}نحشر\\s+المجرمين|${BL}${PRE}حشروا\\s+الى|${BL}${PRE}احشروا\\s+الذين|${BL}${PRE}ارض\\s+المحشر|${BL}${PRE}المحشر(?=${E})`)],
  ["khuruj-qubur", new RegExp(`${BL}${PRE}يخرجون\\s+من\\s+(?:ال)?اجداث|${BL}${PRE}من\\s+القبور|${BL}${PRE}يخرج\\s+الناس\\s+من\\s+القبور|${BL}${PRE}يوم\\s+يخرجون(?=${E})`)],
  ["saq", new RegExp(`${BL}${PRE}يوم\\s+يكشف\\s+عن\\s+ساق|${BL}${PRE}كشف\\s+عن\\s+ساق(?=${E})`)],
  // ---- The terrors ----
  ["faza-akbar", new RegExp(`${BL}${PRE}الفزع\\s+الاكبر|${BL}${PRE}اهوال\\s+يوم\\s+القيامة|${BL}${PRE}يوم\\s+الفزع(?=${E})`)],
  ["shams-tadnu", new RegExp(`${BL}${PRE}تدنو\\s+(?:ال)?شمس|${BL}${PRE}الشمس\\s+يوم\\s+القيامة|${BL}${PRE}يدنو\\s+من\\s+الخلق|${BL}${PRE}تدنى\\s+الشمس|${BL}${PRE}شمس\\s+يوم\\s+القيامة(?=${E})`)],
  ["araq", new RegExp(`${BL}${PRE}عرق\\s+(?:الناس|الخلق|العباد)\\s+يوم|${BL}${PRE}العرق\\s+يوم\\s+القيامة(?=${E})`)],
  // ---- Display, records, reckoning, scale ----
  ["ard", new RegExp(`${BL}${PRE}يوم\\s+العرض|${BL}${PRE}يعرضون\\s+على\\s+ربك|${BL}${PRE}وقفوا\\s+انهم\\s+مس[ءي]ولون|${BL}${PRE}يوم\\s+تبدل\\s+الارض|${BL}${PRE}وقوف\\s+بين\\s+يدي|${BL}${PRE}الوقوف\\s+بين\\s+يدي\\s+(?:ال)?رب(?=${E})`)],
  ["suhuf", new RegExp(`${BL}${PRE}اخذ\\s+كتابه\\s+(?:با?يمينه|بشماله|وراء\\s+ظهره)|${BL}${PRE}اوتي\\s+كتابه\\s+(?:بيمينه|بشماله|وراء\\s+ظهره)|${BL}${PRE}يؤتى\\s+كتابه|${BL}${PRE}كتاب\\s+لا\\s+يغادر|${BL}${PRE}صحائف\\s+الاعمال|${BL}${PRE}كتاب\\s+الاعمال(?=${E})`)],
  ["hisab-strong", new RegExp(`${BL}${PRE}يوم\\s+الحساب|${BL}${PRE}اول\\s+ما\\s+يحاسب\\s+عليه\\s+العبد|${BL}${PRE}لا\\s+تزول\\s+قدما\\s+عبد|${BL}${PRE}حاسبوا\\s+انفسكم\\s+قبل\\s+ان\\s+تحاسبوا|${BL}${PRE}كفى\\s+بنفسك\\s+اليوم\\s+عليك\\s+حسيبا|${BL}${PRE}قارب\\s+الحساب|${BL}${PRE}اقترب\\s+للناس\\s+حسابهم(?=${E})`)],
  ["mizan-strong", new RegExp(`${BL}${PRE}فثقلت\\s+موازينه|${BL}${PRE}فخفت\\s+موازينه|${BL}${PRE}تثقل\\s+موازينه|${BL}${PRE}تخف\\s+موازينه|${BL}${PRE}الموازين\\s+القسط|${BL}${PRE}نضع\\s+الموازين|${BL}${PRE}الموازين\\s+يوم\\s+القيامة(?=${E})`)],
  ["qisas-akhar", new RegExp(`${BL}${PRE}قصاص\\s+يوم\\s+القيامة|${BL}${PRE}يقتص\\s+للجماء\\s+من\\s+القرناء|${BL}${PRE}اقتصاص\\s+الخلق|${BL}${PRE}اداء\\s+المظالم\\s+يوم\\s+القيامة|${BL}${PRE}تقاض\\s+بين\\s+الخلق(?=${E})`)],
  // ---- Shade, Hawd, intercession, Sirat ----
  ["zill", new RegExp(`${BL}${PRE}لا\\s+ظل\\s+الا\\s+ظله|${BL}${PRE}يظلهم\\s+الله\\s+في\\s+ظله|${BL}${PRE}يوم\\s+لا\\s+ظل(?=${E})`)],
  ["hawd-strong", new RegExp(`${BL}${PRE}الحوض\\s+المورود|${BL}${PRE}حوضي|${BL}${PRE}حوض\\s+النبي|${BL}${PRE}الحوض\\s+يوم\\s+القيامة|${BL}${PRE}يوم\\s+يذوقون(?=${E})`)],
  ["shafaa-strong", new RegExp(`${BL}${PRE}الشفاعة\\s+الكبرى|${BL}${PRE}المقام\\s+المحمود|${BL}${PRE}يشفع\\s+فيه\\s+لاحد|${BL}${PRE}لا\\s+تنفع\\s+الشفاعة|${BL}${PRE}يوميذ\\s+لا\\s+تنفع\\s+الشفاعة(?=${E})`)],
  ["sirat-qiyama", new RegExp(`${BL}${PRE}صراط\\s+(?:على|فوق)\\s+(?:متن\\s+)?(?:ال)?(?:نار|جهنم)|${BL}${PRE}الصراط\\s+على\\s+جهنم|${BL}${PRE}احد\\s+من\\s+السيف|${BL}${PRE}اضيق\\s+من\\s+الشعرة|${BL}${PRE}اضل\\s+من\\s+الشعر|${BL}${PRE}الكلاليب|${BL}${PRE}جواز\\s+الصراط(?=${E})`)],
  // ---- English strong hits ----
  ["en-resurrection", /\b(?:day of (?:resurrection|judg[e]?ment)|the resurrection|resurrection day)\b/i],
  ["en-reckoning", /\b(?:day of reckoning|the reckoning|final reckoning|account(?:ing)? on the day)\b/i],
  ["en-gathering", /\b(?:raised from the (?:graves|dead)|the (?:great )?gathering|gathered before (?:god|allah|their lord))\b/i],
  ["en-scale-sirat", /\b(?:the (?:divine )?scale[s]? of|sirat|as-sirat|the pond|al-hawd|the basin)\b/i],
];

/**
 * Weak hits — ambiguous lexemes that count only beside a resurrection/reckoning
 * collocation in a window around the match.
 *   بعث  — "raising the dead" but also "sending" a messenger or an expedition;
 *   القيامة — the Day but also "getting up";
 *   الساعة — the Hour but also a clock-hour;
 *   حشر/حاسب — crowd/arithmetic senses;
 *   الميزان/يوزن — a merchant's balance;
 *   الصراط — the straight path of guidance;
 *   الشفاعة — any mediation;
 *   نشر — publishing/spreading;
 *   عرض — any display.
 */
const WEAK: [string, RegExp][] = [
  ["bath", new RegExp(`${BL}${PRE}(?:بعث|يبعث|نبعث|بعثوا|مبعوث)(?=${E})`, "g")],
  ["qiyama", new RegExp(`${BL}${PRE}القيامة(?=${E})`, "g")],
  ["saa", new RegExp(`${BL}${PRE}الساعة|${BL}${PRE}اشراط\\s+الساعة|${BL}${PRE}ساعة(?=${E})`, "g")],
  ["hashr-weak", new RegExp(`${BL}${PRE}حشر|${BL}${PRE}يحشر|${BL}${PRE}نحشر(?=${E})`, "g")],
  ["hisab-weak", new RegExp(`${BL}${PRE}الحساب|${BL}${PRE}يحاسب|${BL}${PRE}حاسب|${BL}${PRE}الحسيب|${BL}${PRE}حسيب(?=${E})`, "g")],
  ["mizan-weak", new RegExp(`${BL}${PRE}الميزان|${BL}${PRE}موازين|${BL}${PRE}يوزن|${BL}${PRE}توزن(?=${E})`, "g")],
  ["sirat-weak", new RegExp(`${BL}${PRE}الصراط|${BL}${PRE}صراط(?=${E})`, "g")],
  ["shafaa-weak", new RegExp(`${BL}${PRE}الشفاعة|${BL}${PRE}يشفع|${BL}${PRE}شفعاء|${BL}${PRE}شافع(?=${E})`, "g")],
  ["nashr-weak", new RegExp(`${BL}${PRE}نشر|${BL}${PRE}ينشر|${BL}${PRE}النشر(?=${E})`, "g")],
  ["ard-weak", new RegExp(`${BL}${PRE}يعرضون|${BL}${PRE}العرض(?=${E})`, "g")],
];

/**
 * The window context that upgrades a weak hit: resurrection, grave, death-afterlife,
 * Day and reckoning vocabulary. A «بعث» beside «الموتى» or «القبور» is the raising;
 * beside «رسول/بعث الله رسولا» it never reaches this context check on its own words.
 */
const CONTEXT = new RegExp(
  `قيامة|الساعة|موتى|اموات|قبور|اجداث|نشور|حشر|احياء\\s+الموتى|بعث\\s+الموتى|` +
  `اخرة|الاخرة|دار\\s+ال[اا]خرة|يوم\\s+(?:الدين|الفصل|الحساب|الجمع|التلاق|الوعد|الوعيد)|` +
  `حساب|حسيب|ميزان|موازين|وزن|يوزن|صحف|كتاب\\s+الاعمال|اجر|ثواب|جزاء|` +
  `صراط|جهنم|النار|حوض|كوثر|شفاعة|شفع|مقام\\s+محمود|فزع|اهوال|` +
  `جنة|الجنة|القارعة|الحاقة|الصاخة|الواقعة|الغاشية|نفخ|صور|اسرافيل|` +
  `ملائكة|الملائكة|ربك|الله|عرش|عرصات|شمس|عرق|ظل\\s+الا\\s+ظله`,
);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape
 * hatch: tagging a passage `qiyama-browser` also admits it (see the export pick).
 */
export const QIYAMA_EXCLUDE = new Set<string>([
  // Worldly weighing and accounting — بلال يزن أوقية, ميزان الدنانير, حساب ابن طولون المالي.
  "passage/bukhari-api-2097",
  "passage/bukhari-api-2302",
  "passage/geography-khitat-maqrizi-012",
  // The dispatch sense of بعث — بعث المعتضد في طلبه, أرجو أن يبعث فأتبعه, باب بعث علي إلى اليمن,
  // بعث رسول الله عبد الله بن جحش, بعث دحية بالكتاب إلى قيصر, باب بعث النبي أسامة/خالد (فهارس).
  "passage/dalail-nubuwwa-abu-nuaym-82",
  "passage/geography-khitat-maqrizi-009",
  "passage/hadith-sahih-bukhari-008",
  "passage/hadith-sciences-kifaya-khatib-004",
  "passage/hadith-umdat-qari-004",
  "passage/aqeedah-minhaj-sunna-007",
  "passage/aqeedah-minhaj-sunna-010",
  // «ساعة» الزمنية في شروط الأجل — the clock-hour sense in a fiqh contract passage.
  "passage/fiqh-muhalla-005",
  // «فنشرها» نشر الصحيفة — unfolding a document, not the publishing of the scrolls.
  "passage/bukhari-api-7300",
]);

/** The matched signal names for a passage, or [] when it does not mention the Resurrection, the Day or the Reckoning. */
export function qiyamaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(/[ٰٱ]/g, "ا")
    .replace(DIACRITICS, "")
    // Mask the dispatch sense «بعث بها/به/بهم/إليه/إليها…» (he sent her/him to …) so the
    // weak «بعث» lexeme never counts a courier for a raising of the dead.
    .replace(/بعث\s+(?:بها|به|بهم|بهما|بك|بكم|بنا|بي|اليه|اليها|اليهم|اليك|اليكم|الينا|الى|الي)/g, "ارسل ");
  if (!raw || QIYAMA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  for (const [name, re] of STRONG) if (re.test(raw)) hits.add(name);
  for (const [name, re] of WEAK) {
    for (const m of raw.matchAll(re)) {
      // The window excludes the matched token itself so a weak lexeme that also
      // appears in CONTEXT (الساعة, حساب, ميزان…) cannot satisfy its own gate.
      const end = m.index! + m[0].length;
      const window = raw.slice(Math.max(0, m.index! - 60), m.index) + " " + raw.slice(end, end + 90);
      if (CONTEXT.test(window)) {
        hits.add(name);
        break;
      }
    }
  }
  return [...hits];
}

/** True when the passage mentions the Resurrection, the Day of Judgement or the Reckoning. */
export function isQiyamaPassage(n: Node): boolean {
  return qiyamaSignalsOf(n).length > 0;
}

const BAATH_SIGNALS = new Set(["nafkha", "nafkh-as-sur", "al-bath-noun", "nushur", "hashr", "khuruj-qubur", "saq", "bath", "hashr-weak", "nashr-weak", "en-gathering", "en-resurrection"]);
const HISAB_SIGNALS = new Set(["suhuf", "hisab-strong", "mizan-strong", "qisas-akhar", "sirat-qiyama", "shafaa-strong", "hawd-strong", "ard", "hisab-weak", "mizan-weak", "sirat-weak", "shafaa-weak", "ard-weak", "en-reckoning", "en-scale-sirat"]);

/** The dominant flavour of a detected passage: raising/gathering, the Day itself, or the reckoning and crossing. */
export function qiyamaKindOf(n: Node): QiyamaKind | null {
  const signals = qiyamaSignalsOf(n);
  if (!signals.length) return null;
  if (signals.some((s) => HISAB_SIGNALS.has(s))) return "hisab";
  if (signals.some((s) => BAATH_SIGNALS.has(s))) return "baath";
  return "yawm";
}

/**
 * Which corpus a qiyama passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function qiyamaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): QiyamaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `qiyama-<section>` when present, else `curated`. */
export function qiyamaTagSection(n: Node): QiyamaSection {
  const tag = n.tags.find((t) => t.startsWith("qiyama-") && t !== QIYAMA_TAG);
  const id = tag?.slice(7) ?? "curated";
  return (QIYAMA_SECTIONS as readonly string[]).includes(id) ? (id as QiyamaSection) : "curated";
}
