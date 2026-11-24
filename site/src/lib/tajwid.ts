// The Tajwid and Tilawah Browser's shared reads (docs/plan/76-tajwid-tilawah-browser.md): every
// mention of tajwid and tilawah — the verses on measured recitation and its etiquette, the hadith
// and the reports of the Companions and Successors, the seerah, the tafsir and every other
// harvested book — plus the curated records on the rules, the etiquette, the teaching, the
// reciters, the teaching texts and the melodies, all over the one graph. Passages are found at
// build time by the shared detector in scripts/tajwid.ts, so a mention in a book harvested later
// appears here the day its passage record lands; curated records join through the
// `tajwid-browser` tag (and `tajwid-<section>` / `tajwid-<topic>` tags). There is no side list.
import { byId, realNodes } from "./graph";
import {
  TAJWID_TAG, TAJWID_SECTIONS, TAJWID_TOPICS, tajwidCorpusOf, tajwidTagSection, tajwidTagTopics, tajwidTopicsOf,
  type TajwidSection, type TajwidTopic,
} from "../../../scripts/tajwid";
import type { Node } from "../../../scripts/build-graph";

export { TAJWID_SECTIONS, TAJWID_TOPICS, type TajwidSection, type TajwidTopic } from "../../../scripts/tajwid";

export interface TajwidItem {
  node: Node;
  section: TajwidSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages (plus any `tajwid-<topic>` tag), `tajwid-<topic>` tags on curated records. */
  topics: TajwidTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

/** Detected topics of a passage joined with any `tajwid-<topic>` tag it carries (the escape hatch for wording the lexicon cannot see). */
const topicsOf = (n: Node): TajwidTopic[] =>
  n.class === "passage" ? [...new Set([...tajwidTopicsOf(n), ...tajwidTagTopics(n)])] : tajwidTagTopics(n);

export const tajwidItems: TajwidItem[] = realNodes
  .filter((n) => n.tags.includes(TAJWID_TAG) || tajwidTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? tajwidCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : tajwidTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: topicsOf(n),
  }))
  .sort((a, b) => {
    const r = TAJWID_SECTIONS.indexOf(a.section) - TAJWID_SECTIONS.indexOf(b.section);
    // verses in mushaf order, everything else by id with numbers compared as numbers (page 9 before page 10)
    return r || (Number(a.node.data.sura ?? 0) - Number(b.node.data.sura ?? 0)) || (Number(a.node.data.aya ?? 0) - Number(b.node.data.aya ?? 0))
      || a.node.id.localeCompare(b.node.id, "en", { numeric: true });
  });

// ---------- the articulation map (the signature view): the seventeen makharij of the letters
/**
 * The seventeen points of articulation (makharij) as Ibn al-Jazari counts them in the Jazariyya —
 * «مخارج الحروف سبعة عشر» — grouped in the five regions of the classical books: the empty space of
 * the mouth and throat (jawf), the throat (halq), the back of the tongue (lahat), the middle of the
 * tongue (shajriyya), the tip and the teeth (asala, nat'iyya, litha, dhalq), the two lips
 * (shafatayn) and the nasal passage (khayshum). `at` is a rough position along the profile from
 * the chest to the lips for the signature view's axis; `hue` one colour per region.
 */
export const MAKHRAJ_REGIONS = [
  { id: "jawf", makhraj: "الجوف", letters: "ء ا و ي", at: 0.06, hue: "#8f5d8f",
    desc: { ar: "الجوف: الخلاء الممتد في الحلق والفم؛ تخرج منه المدد الثلاثة.", en: "The empty space of the throat and mouth; the three madd letters rise from it." } },
  { id: "halq-aqsa", makhraj: "أقصى الحلق", letters: "ء ه", at: 0.18, hue: "#9a4f68",
    desc: { ar: "أقصى الحلق: تخرج منه الهمزة والهاء.", en: "The deepest part of the throat; the hamza and the ha'." } },
  { id: "halq-wasat", makhraj: "وسط الحلق", letters: "ع ح", at: 0.27, hue: "#9a4f68",
    desc: { ar: "وسط الحلق: تخرج منه العين والحاء.", en: "The middle of the throat; the 'ayn and the ha'." } },
  { id: "halq-adna", makhraj: "أدنى الحلق", letters: "غ خ", at: 0.36, hue: "#9a4f68",
    desc: { ar: "أدنى الحلق: تخرج منه الغين والخاء.", en: "The nearest part of the throat; the ghayn and the kha'." } },
  { id: "lahat", makhraj: "اللهاة", letters: "ق", at: 0.45, hue: "#7a3a5e",
    desc: { ar: "اللهاة: أقصى اللسان مع أعلى الحنك؛ تخرج منه القاف.", en: "The uvula region; the deepest tongue with the upper palate; the qaf." } },
  { id: "lahat-kaf", makhraj: "أقصى اللسان", letters: "ك", at: 0.52, hue: "#7a3a5e",
    desc: { ar: "أقصى اللسان تحت اللهاة بقليل؛ تخرج منه الكاف.", en: "The deepest tongue just below the uvula; the kaf." } },
  { id: "shajr", makhraj: "الشجري", letters: "ج ش ي", at: 0.60, hue: "#b27b42",
    desc: { ar: "الشجري: وسط اللسان مع الحنك الأعلى؛ تخرج منه الجيم والشين والياء.", en: "The middle tongue with the upper palate; the jim, shin and ya'." } },
  { id: "asala", makhraj: "الأسلة", letters: "ض", at: 0.67, hue: "#c5a059",
    desc: { ar: "الأسلة: حافة اللسان مع الأضراس؛ تخرج منه الضاد.", en: "The side of the tongue against the molars; the dad — the hardest makhraj." } },
  { id: "nat", makhraj: "النطع", letters: "ط د ت", at: 0.73, hue: "#4d8a4f",
    desc: { ar: "النطع: طرف اللسان مع أصول الثنايا العليا؛ تخرج منه الطاء والدال والتاء.", en: "The tip of the tongue with the roots of the upper incisors; ta', dal and ta'." } },
  { id: "litha", makhraj: "اللثة", letters: "ظ ذ ث", at: 0.79, hue: "#2e7d52",
    desc: { ar: "اللثة: طرف اللسان مع أطراف الثنايا العليا؛ تخرج منه الظاء والذال والثاء.", en: "The tip of the tongue with the edges of the upper incisors; za', dhal and tha'." } },
  { id: "dhalq", makhraj: "الذلق", letters: "ر ل ن", at: 0.85, hue: "#2a7b88",
    desc: { ar: "الذلق: طرف اللسان قرب طرف النطع؛ تخرج منه الراء واللام والنون.", en: "The tip of the tongue near the nat'; the ra', lam and nun." } },
  { id: "shafa", makhraj: "الشفتان", letters: "ف ب م و", at: 0.93, hue: "#4a6e8a",
    desc: { ar: "الشفتان: تخرج منهما الفاء من بطن الشفة السفلى، والباء والميم والواو منهما معاً.", en: "The lips; fa' from the inner lower lip, ba', mim and waw from both." } },
  { id: "khayshum", makhraj: "الخيشوم", letters: "غـ", at: 0.99, hue: "#6b6b8f",
    desc: { ar: "الخيشوم: تخرج منه الغنة.", en: "The nasal passage; the ghunna." } },
] as const;
