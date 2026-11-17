// The Umam Browser's shared reads (docs/plan/63-umam-browser.md): «متصفح الأمم والأديان والطوائف
// والشعوب غير المسلمة المذكورة في القرآن والحديث وأثر وكتب الصحابة والتابعين» — which records are the
// non-Muslim nations, religions, sects and peoples the sources name, and every passage, work, event
// and question that mentions them. Membership is computed at build time by this one detector, shared
// by the site (site/src/lib/umam.ts), the API export (scripts/export-api.ts), the audit
// (scripts/umam-audit.ts) and the mining tools (scripts/harvest-umam-ocr.ts,
// scripts/harvest-umam-hadithapi.ts). There is no side list.
//
// Three membership paths, because the three kinds of record join differently:
//  1. Curated records (groups, persons, places, concepts, works): the `umam-browser` tag plus one or
//     more `um-<section>` tags. A record without a section tag is filed by class.
//  2. `mentions` edges: any work, passage, media, event, exhibit or question whose forward `mentions`
//     edge names an umam member joins `dhikr` — and every section the target is tagged into — so a
//     book harvested later appears here the day its edges land, with no code change and no tagging
//     step. The frozen Qur'an verses join only this way: the verse text is never searched.
//  3. A guarded name lexicon over the other passages' own text, search text, label and summary
//     (folded: vowel marks dropped, alef forms joined). Only names that cannot be read another way
//     count: «عاد» the verb never matches, «قيصريه» never names Caesar, a bare «السودان» never names
//     a people. A matched name files the passage under the matched people's sections — plus dhikr —
//     so the passages already harvested surface without waiting for edges.
// UMAM_EXCLUDE is the curated escape hatch for verified false positives; a passage can also join
// with a `umam-browser` tag when its wording carries no name.
import type { Node } from "./build-graph.js";

export const UMAM_TAG = "umam-browser";
export const UM_PREFIX = "um-";
/** Page sections in display order; a `um-<id>` tag outside this list is ignored. */
export const UMAM_SECTIONS = [
  "umam", "adyan", "tawaif", "shuub", "mushrikun", "ayan", "sukun", "mafahim", "kutub", "dhikr",
] as const;
export type UmamSection = (typeof UMAM_SECTIONS)[number];
export type UmamCorpus = "quran" | "sunnah" | "seerah" | "books";

/** One spelling for matching: vowel marks, Qur'anic marks and tatweel dropped, alef forms joined, final ya and ta marbuta folded. */
export const umamFold = (s: string): string =>
  s.normalize("NFC").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ");

// ---------- name lexicon for everything that is not the Qur'an, written in the folded spelling.
// B opens a word (an optional one- or two-letter prefix, an optional article); E closes it.
const B = "(?<![ء-ي])[وفبلك]{0,2}(?:ال)?";
const E = "(?![ء-ي])";
const re = (...alts: string[]) => new RegExp(alts.join("|"));

/**
 * The names by which the sources call each people, folded. Every pattern is deliberately strong:
 * a phrase or a proper noun that names the people and nothing else — «قوم عاد» matches, «عاد» the
 * verb does not; «الروم» matches, «روميه» the cloth does not; «قيصر» matches, «قيصريه» does not.
 * Order inside the list does not matter; a passage matching several names gets all their sections.
 */
export const UMAM_NAMES: ReadonlyArray<readonly [string, string]> = [
  // — the nations the Qur'an recounts
  ["group/aad", re(`${B}قوم عاد${E}`, `${B}عاد الاولي${E}`, `${B}عادا الاولي${E}`, `${B}عادا? (?:قوم هود|بني|بنو)`, `${B}ارم${E}`, `${B}الاحقاف${E}`, `اصحاب الاحقاف`)],
  ["group/thamud", re(`${B}ثمود${E}`, `${B}ثمودا${E}`, `قوم صالح`, `${B}الحجر${E}`)],
  ["group/saba", re(`مملكه سبا`, `اهل سبا`, `${B}سبا${E} (?:في|الذين|ملكتهم|قوم)`, `ملكه سبا`, `${B}سبأ${E}`)],
  ["concept/qawm-lut", re(`قوم لوط`, `${B}لوط${E} قومه`, `اهل (?:لوط|سدوم)`, `الموتفكات${E}`, `سدوم`)],
  ["group/qawm-nuh", re(`قوم نوح`, `الطوفان (?:الكبير|عهد نوح)`, `اصحاب السفينه`)],
  ["group/qawm-shuayb", re(`قوم شعيب`, `اصحاب الايكه`, `اصحاب مدين`, `اهل مدين`, `مطففين`)],
  ["concept/ashab-al-rass", re(`اصحاب الرس`, `الرس${E} قوم`)],
  ["group/ashab-al-uhdud", re(`اصحاب الاخدود`, `الاخدود`)],
  ["group/ashab-al-qarya", re(`اصحاب القريه`)],
  ["group/qawm-tubba", re(`قوم تبع`, `${B}تبع${E} (?:و|قومه)`, `التبابعه`, `ملوك حمير`)],
  ["person/firawn", re(`${B}فرعون${E}`, `${B}فرعونه${E}`, `${B}ال فرعون${E}`, `قوم فرعون`, `عمل فرعون`)],
  ["person/namrud", re(`${B}النمرود${E}`, `${B}نمرود${E}`)],
  ["concept/yajuj-majuj", re(`ياجوج`, `ماجوج`, `${B}ياجوج وماجوج`)],
  ["group/banu-israil", re(`بنو اسرائيل`, `بني اسرائيل`, `بنوا اسرائيل`, `الاسرائيليات`, `اولاد اسرائيل`)],
  ["group/amaliq", re(`العمالقه`, `العماليق`, `العمليق`)],
  ["group/assyrians", re(`الاشوريين`, `الاشوريون`, `بني اشور`)],
  ["group/jurhum", re(`جرهم`, `الجرهميون`)],
  ["group/jadis", re(`جديس`, `طسم وجديس`, `طسم`)],
  // — the religions the sources name
  ["group/al-yahud", re(`${B}اليهود${E}`, `${B}يهود${E} (?:بني|بنو|المدينه|يثرب|خيبر|الحجاز|قالوا|قالت|زعموا|يسالونك|يدخلون|لا يدخل|فريق|طائفه|حزب)`, `هادوا`, `الذين هادوا`, `${B}يهودي${E}`)],
  ["group/al-nasara", re(`${B}النصاري${E}`, `${B}النصارى${E}`, `الذين قالوا انا نصاري`, `${B}نصراني${E}`, `${B}النصاريون${E}`)],
  ["group/al-majus", re(`${B}المجوس${E}`, `${B}مجوس${E} (?:فارس|اهل|ملكه)`, `عبده النار`, `عباد النار`)],
  ["group/al-sabiun", re(`${B}الصابئين${E}`, `${B}الصابئه${E}`, `الصابئون`, `صابئو حران`)],
  ["concept/zandaqa", re(`الزنادقه`, `${B}زنديق${E}`, `المانويه`, `الثنويه`)],
  // — the sects and communities inside them, as the books name them
  ["group/banu-qaynuqa", re(`بنو قينقاع`, `قينقاع`)],
  ["group/banu-nadir", re(`بنو النضير`, `بني النضير`, `النضير`)],
  ["group/banu-qurayza", re(`بنو قريظه`, `بني قريظه`, `قريظه`)],
  ["group/jews-of-khaybar", re(`يهود خيبر`, `خيبر`)],
  ["group/christians-of-najran", re(`نصاري نجران`, `اهل نجران`, `${B}نجران${E}`, `اعقب نجران`)],
  ["group/banu-salul", re(`بني سلول`, `بني سوله`, `عبد الله بن ابي بن سلول`)],
  ["group/ghassan", re(`الغساسنه`, `${B}غسان${E}`, `ملوك غسان`)],
  ["group/banu-lakhm", re(`بنو لخم`, `اللخميون`, `المناذره`, `ملوك الحيره`, `الحيره`)],
  ["group/sabia-harraniyyun", re(`صابئه حران`, `الحرانيين`)],
  // — the peoples of the wider world the books record
  ["group/al-rum", re(`${B}الروم${E}`, `${B}روم${E} (?:الشام|بصرى|اهل|ملوك|جيش|بلد)`, `بنو الاصفر`, `الروميه`, `اهل الشام من الروم`, `الرومان`)],
  ["group/persians", re(`${B}فارس${E}`, `${B}الفرس${E}`, `ملوك فارس`, `جيش فارس`, `بني ساسان`, `الساسانيه`, `دوله فارس`)],
  ["group/al-sasan", re(`ساسان`, `الساسانيون`)],
  ["group/al-ajam", re(`الاعاجم`, `${B}العجم${E}`, `اعجمي`, `الاعجمي`)],
  ["group/al-habasha", re(`${B}الحبشه${E}`, `${B}الحبش${E}`, `احباش`, `الحبشان`, `ملك الحبشه`, `بلاد الحبشه`, `ارض الحبشه`, `اكسوم`)],
  ["group/al-qibt", re(`${B}القبط${E}`, `${B}الاقباط${E}`, `قبطي`, `مصريون`, `مصريين`, `اهل مصر من القبط`)],
  ["group/al-turk", re(`${B}الترك${E}`, `الاتراك`, `تركي`, `بلاد الترك`, `ما وراء النهر`)],
  ["group/al-hind", re(`${B}الهند${E}`, `الهنود`, `هندي`, `بلاد الهند`)],
  ["group/al-sin", re(`${B}الصين${E}`, `بلاد الصين`)],
  ["group/saqaliba", re(`الصقالبه`, `صقلبي`)],
  ["group/al-barbar", re(`البربر`, `بربري`, `بلاد البربر`)],
  ["group/al-rus", re(`${B}الروس${E}`, `الروسيه`)],
  ["group/al-zanj", re(`${B}الزنج${E}`, `الزنجي`, `بلاد الزنج`, `زنجبار`)],
  ["group/al-nabt", re(`${B}النبط${E}`, `الانباط`, `النبطيون`)],
  // — the pre-Islamic Arab polytheists, in their own section
  ["group/al-mushrikun", re(`${B}المشركين${E}`, `المشركون`, `مشركو (?:قريش|مكه|العرب|المدينه)`, `مشركي (?:قريش|مكه|العرب)`, `اهل الشرك`, `اهل الاوثان`, `عبده الاوثان`, `عبده الاصنام`, `اهل مكه من المشركين`, `جاهليه`, `الجاهليه`)],
  ["concept/shirk", re(`${B}الشرك${E}`, `${B}اللات${E}`, `${B}العزي${E}`, `${B}مناه${E}`, `${B}هبل${E}`, `${B}ود${E} (?:و|اله|معبود)`, `سواع`, `يغوث`, `يعوق`, `${B}نسر${E} (?:اله|معبود|و|لهم)`, `الاصنام`, `الاوثان`, `طاغوت`)],
  ["group/quraysh", re(`${B}قريش${E}`, `مشركو قريش`, `اهل مكه`, `بني اميه`, `بني مخزوم`, `احلاف قريش`)],
  // — named persons the books record
  ["person/heraclius", re(`${B}قيصر${E}`, `ملك الروم`, `هرقل`, `قيصر الروم`, `عظيم الروم`)],
  ["person/kisra-abrawiz", re(`${B}كسري${E}`, `ابرويز`, `كسرى ابرويز`, `ملك فارس`)],
  ["person/al-najashi", re(`${B}النجاشي${E}`, `ملك الحبشه`, `صاحب الحبشه`, `اصحمه`)],
  ["person/al-muqawqis", re(`الموقق`, `عظيم القبط`, `صاحب الاسكندريه`)],
  ["person/al-mundhir-ibn-sawa", re(`المنذر بن ساوي`)],
  ["person/abu-jahl", re(`ابو جهل`, `عمرو بن هشام`)],
  ["person/abu-lahab", re(`ابو لهب`)],
  ["person/abu-sufyan-ibn-harb", re(`ابو سفيان`, `ابي سفيان صخر`)],
  ["person/utba-ibn-rabia", re(`عتبه بن ربيعه`, `عتبه وشيبه`)],
  ["person/al-walid-ibn-al-mughira", re(`الوليد بن المغيره`)],
  ["person/al-nadr-ibn-al-harith", re(`النضر بن الحارث`)],
  ["person/umayya-ibn-khalaf", re(`اميه بن خلف`)],
  ["person/abdullah-ibn-ubayy", re(`عبد الله بن ابي`, `ابن سلول`, `راس المنافقين`)],
  ["person/waraqa-ibn-nawfal", re(`ورقه بن نوفل`)],
  ["person/zayd-ibn-amr", re(`زيد بن عمرو بن نفيل`)],
  ["person/huyayy-ibn-akhtab", re(`حيي بن اخطب`, `حيي بن الاخطب`)],
  ["person/kaab-ibn-al-ashraf", re(`كعب بن الاشرف`)],
  ["person/marhab-al-yahudi", re(`مرحب`, `مرحب اليهودي`)],
  ["person/sallam-ibn-mishkam", re(`سلام بن مشكم`)],
  ["person/kinana-ibn-al-rabi", re(`كنانه بن الربيع`)],
  // — the concepts and lands, where the books use them as names
  ["concept/ahl-al-kitab", re(`اهل الكتاب`, `الكتابيين`, `الكتابي`, `اولو الكتاب`)],
  ["concept/ahl-al-dhimma", re(`اهل الذمه`, `الذمه`, `ذمي`, `معاهدين`, `اهل العهد`)],
  ["concept/jizya", re(`${B}الجزيه${E}`, `جزيه`)],
  ["concept/munafiq", re(`المنافقين`, `المنافقون`, `نفاق`, `منافق`)],
  ["concept/kufr", re(`${B}الكفار${E}`, `كفار قريش`, `كفار مكه`, `الكافرين`, `الكافرون`)],
];

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch, each
 * verified by reading the passage; empty until an audit flags one.
 */
export const UMAM_EXCLUDE = new Set<string>([]);

/** A passage written by one of the mining tools (`umam-ocr-<n>` or `umam-hadithapi-<n>`): label and summary are the tool's own boilerplate, so only the quoted text is judged. */
const mined = (n: Node): boolean => /-(?:ocr|hadithapi)-\d+$/.test(String((n.data.provenance as { run?: string } | undefined)?.run ?? ""));
const arabicOf = (n: Node): string =>
  umamFold((mined(n) ? [n.data.text, n.data.text_search] : [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar]).filter(Boolean).join(" "));
const englishOf = (n: Node): string =>
  mined(n) ? "" : [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** English names the museum's own translations use, per entity (the Arabic pattern is the primary key). */
const EN_NAMES: ReadonlyArray<readonly [string, RegExp]> = [
  ["group/al-rum", /\b(the Romans?|Byzantines?|sons of the Yellow|Caesar's (people|realm))\b/i],
  ["group/persians", /\b(the Persians?|Sasanians?|Chosroes' (people|realm))\b/i],
  ["group/al-habasha", /\b(the Abyssinians?|Abyssinia|Ethiopians?|Axum)\b/i],
  ["group/al-qibt", /\b(the Copts?|Coptic (people|Christians))\b/i],
  ["group/al-yahud", /\b(the Jews?|Jewish (tribes?|people|of Medina|of Khaybar))\b/i],
  ["group/al-nasara", /\b(the Christians?|Nasara|Christians? of Najran)\b/i],
  ["group/al-majus", /\b(the Magians?|Majus|Zoroastrians?|fire[- ]worshippers?)\b/i],
  ["group/al-sabiun", /\b(the Sabians?|Sabians? of Harran)\b/i],
  ["group/al-mushrikun", /\b(the polytheists?|mushrikun|idolaters?|pagans? of (Makka|Mecca|Quraysh|Arabia))\b/i],
  ["group/banu-israil", /\b(Ban[uo] Isra[ei']?l|Children of Israel)\b/i],
  ["group/thamud", /\bThamud\b/i],
  ["group/aad", /\b(the people of )?'Ad\b|Iram\b/i],
  ["group/saba", /\b(Saba'|Sheba|the Sabaeans?)\b/i],
  ["concept/qawm-lut", /\b(people of (Lut|Lot)|Lut's people)\b/i],
  ["concept/yajuj-majuj", /\b(Ya'?juj|Gog and Magog|Gog|Magog)\b/i],
  ["person/firawn", /\b(Pharaoh|Fir'?awn)\b/i],
  ["person/namrud", /\b(Nimrod|Namrud)\b/i],
  ["person/qayssar", /\b(Caesar|Heraclius|Hiraql)\b/i],
  ["person/kisra", /\b(Chosroes|Kisra|Khosrow)\b/i],
  ["person/al-najashi", /\b(the Negus|al-Najashi|Negus of Abyssinia)\b/i],
  ["concept/ahl-al-kitab", /\b(People of the (Book|Scripture)|ahl al-kitab)\b/i],
];

/** The entity ids whose names appear in a folded Arabic text (and optional English text). */
export function umamMatchesOfText(ar: string, en = ""): string[] {
  const out = new Set<string>();
  for (const [id, rx] of UMAM_NAMES) if (rx.test(ar)) out.add(id);
  for (const [id, rx] of EN_NAMES) if (rx.test(en)) out.add(id);
  return [...out];
}

/** The entity ids whose names a passage's own text carries (the audit prints them; the page never does). The Qur'an is never searched. */
export function umamMatches(n: Node): string[] {
  if (n.class !== "passage" || n.stub || n.data.work === "work/quran") return [];
  return umamMatchesOfText(arabicOf(n), englishOf(n));
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith collections
 * (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and every other
 * harvested work. Works not yet harvested land in the right section by their genre the day
 * their passages arrive.
 */
export function umamCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): UmamCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The sections a record's `um-<section>` tags place it in. */
export function umamTagSections(n: Node): string[] {
  return [...new Set(
    n.tags.filter((t) => t.startsWith(UM_PREFIX)).map((t) => t.slice(UM_PREFIX.length)),
  )].filter((s) => (UMAM_SECTIONS as readonly string[]).includes(s));
}

/** The default section for a curated record that carries `umam-browser` but no `um-<section>` tag: by class. */
export function umamDefaultSection(n: Node): UmamSection {
  if (n.class === "place" || n.class === "building") return "sukun";
  if (n.class === "work" || n.class === "source") return "kutub";
  if (n.class === "person") return "ayan";
  if (n.class === "concept" || n.class === "practice") return "mafahim";
  return "shuub";
}

export interface UmamEdge { from: string; to: string; type: string; inverse: boolean }
export interface UmamMember { node: Node; sections: string[] }

/**
 * Every browser member over the whole node/edge set. Pass one: tagged records, whose sections are
 * their `um-<section>` tags (or the class default). Pass two: `mentions` edges — a source whose
 * forward edge names any member joins `dhikr` plus the target's sections. Pass three: the name
 * lexicon files a non-Qur'an passage under `dhikr` plus every section of each people it names.
 * `sections` comes back in UMAM_SECTIONS order so pages and exports agree.
 */
export function umamMembers(nodes: Node[], edges: UmamEdge[]): UmamMember[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const rank = new Map<string, number>(UMAM_SECTIONS.map((s, i) => [s, i]));
  const out = new Map<string, { node: Node; sections: Set<string> }>();
  const add = (id: string, secs: readonly string[]) => {
    const n = byId.get(id);
    if (!n || n.stub) return;
    const m = out.get(id) ?? { node: n, sections: new Set<string>() };
    for (const s of secs) m.sections.add(s);
    out.set(id, m);
  };
  // pass 1: curated tags
  for (const n of nodes) {
    if (n.stub || !n.tags.includes(UMAM_TAG)) continue;
    const secs = umamTagSections(n);
    add(n.id, secs.length ? secs : [umamDefaultSection(n)]);
  }
  const sectionsOf = (id: string): readonly string[] => out.get(id) ? [...out.get(id)!.sections] : [];
  // pass 2: mentions edges to a member
  for (const e of edges) {
    if (e.inverse || e.type !== "mentions") continue;
    const targetSecs = sectionsOf(e.to);
    if (!targetSecs.length) continue;
    const n = byId.get(e.from);
    if (!n || n.stub) continue;
    add(e.from, ["dhikr", ...targetSecs]);
  }
  // pass 3: the name lexicon over passage texts
  for (const n of nodes) {
    if (n.class !== "passage" || n.stub || UMAM_EXCLUDE.has(n.id)) continue;
    const named = umamMatches(n);
    if (!named.length) continue;
    const secs = new Set<string>(["dhikr"]);
    for (const id of named) for (const s of sectionsOf(id)) secs.add(s);
    add(n.id, [...secs]);
  }
  const rankOf = (s: string) => rank.get(s) ?? 99;
  return [...out.values()]
    .filter((m) => m.sections.size)
    .map((m) => ({ node: m.node, sections: [...m.sections].sort((a, b) => rankOf(a) - rankOf(b)) }));
}

/** Per-corpus mention counts of a member record, for the "mentioned in" strip: passages that `mentions` it, bucketed by their work's corpus. */
export function umamMentionCounts(
  id: string,
  edges: UmamEdge[],
  byId: Map<string, Node>,
): Record<UmamCorpus, number> {
  const counts: Record<UmamCorpus, number> = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
  for (const e of edges) {
    if (e.inverse || e.type !== "mentions" || e.to !== id) continue;
    const src = byId.get(e.from);
    if (!src || src.stub || src.class !== "passage") continue;
    const w = src.data.work as string | undefined;
    counts[umamCorpusOf(w, w ? (byId.get(w)?.data.genre as string[] | undefined) : undefined, src.data.unit as string | undefined)]++;
  }
  return counts;
}
