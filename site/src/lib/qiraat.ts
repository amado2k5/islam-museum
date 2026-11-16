// The Qira'at, Rasm, Scripts and Dotting Browser's shared reads (docs/plan/60-qiraat-browser.md): every mention of
// the readings of the Qur'an and the seven ahruf, the readers, the collection and the codices, the orthography of
// the mushaf, its dotting and vowel marks and the scripts it was written in — plus the curated records about them,
// all over the one graph. Qur'an verses come from the reviewed table in scripts/qiraat.ts; every other passage is
// found by the guarded lexicon in that file at build time, so a mention in a book harvested later appears here the
// day its passage record lands; curated records and hand-checked passages join through the `qiraat-browser` tag
// (and `qiraat-<section>` / `qiraat-<topic>` tags). There is no side list.
import { byId, realNodes } from "./graph";
import { qiraatCorpusOf, qiraatTagSection, qiraatTagTopics, QIRAAT_SECTIONS, QIRAAT_TAG, qiraatTopicsOf, type QiraatSection, type QiraatTopic } from "../../../scripts/qiraat";
import type { Node } from "../../../scripts/build-graph";

export { QIRAAT_SECTIONS, QIRAAT_TOPICS, type QiraatSection, type QiraatTopic } from "../../../scripts/qiraat";

export interface QiraatItem {
  node: Node;
  section: QiraatSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages (plus any `qiraat-<topic>` tag), `qiraat-<topic>` tags on curated records. */
  topics: QiraatTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

/** Detected topics of a passage joined with any `qiraat-<topic>` tag it carries (the escape hatch for wording the lexicon cannot see). */
const topicsOf = (n: Node): QiraatTopic[] =>
  n.class === "passage" ? [...new Set([...qiraatTopicsOf(n), ...qiraatTagTopics(n)])] : qiraatTagTopics(n);

export const qiraatItems: QiraatItem[] = realNodes
  .filter((n) => n.tags.includes(QIRAAT_TAG) || qiraatTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? qiraatCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : qiraatTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: topicsOf(n),
  }))
  .sort((a, b) => {
    const r = QIRAAT_SECTIONS.indexOf(a.section) - QIRAAT_SECTIONS.indexOf(b.section);
    // verses in mushaf order, everything else by id with numbers compared as numbers (page 9 before page 10)
    return r || (Number(a.node.data.sura ?? 0) - Number(b.node.data.sura ?? 0)) || (Number(a.node.data.aya ?? 0) - Number(b.node.data.aya ?? 0))
      || a.node.id.localeCompare(b.node.id, "en", { numeric: true });
  });

// ---------- the gallery and the timeline (docs/plan/60-qiraat-browser.md §4): both read the same records
/** depicts[] target id -> the remote, url-bearing media records that show it. */
const DEPICTS = new Map<string, Node[]>();
for (const m of realNodes) {
  if (m.class !== "media" || m.data.kind !== "image" || !m.data.url) continue;
  for (const t of (m.data.depicts as string[] | undefined) ?? []) DEPICTS.set(t, [...(DEPICTS.get(t) ?? []), m]);
}
/** The images that show a record, in id order (a stable order across builds). */
export const qiraatImagesOf = (id: string): Node[] => [...(DEPICTS.get(id) ?? [])].sort((a, b) => a.id.localeCompare(b.id));

export interface QiraatShown { node: Node; images: Node[] }
const shown = (section: QiraatSection): QiraatShown[] =>
  qiraatItems.filter((i) => i.section === section).map((i) => ({ node: i.node, images: qiraatImagesOf(i.node.id) })).filter((x) => x.images.length > 0);
/** The scripts that have at least one image, and the mushafs and calligraphers that have one: the gallery's three rooms. */
/** A page in a master's hand, never a likeness: only images that also show a script, a work or a mushaf are taken for a person. */
const ofAHand = (m: Node) => ((m.data.depicts as string[] | undefined) ?? []).some((t) => /^(concept|object|work)\//.test(t));
export const qiraatGallery = {
  scripts: shown("scripts"), mushafs: shown("mushafs"),
  hands: shown("people").map((x) => ({ ...x, images: x.images.filter(ofAHand) })).filter((x) => x.images.length > 0),
};

// ---------- the chains of reading: who read the Qur'an to whom, from the `student_of` edges between the browser's people
import { edgesFrom } from "./graph";
/** The ten imams in the order of al-Nashr; the build fails if one has no record, so the chart never drops an imam silently. */
export const QIRAAT_IMAMS = [
  "person/nafi-al-madani", "person/abdallah-ibn-kathir", "person/abu-amr-ibn-al-ala", "person/abdallah-ibn-amir-al-yahsibi",
  "person/asim-ibn-abi-al-najud", "person/hamza-al-zayyat", "person/al-kisai", "person/abu-jafar-al-qari",
  "person/yaqub-al-hadrami", "person/khalaf-ibn-hisham",
] as const;
const inBrowser = new Set(qiraatItems.filter((i) => i.section === "people").map((i) => i.node.id));
export interface QiraatChain { imam: Node; teachers: Node[]; students: Node[] }
export const qiraatChains: QiraatChain[] = QIRAAT_IMAMS.map((id) => {
  const imam = byId.get(id);
  if (!imam || imam.stub) throw new Error(`qiraat chains: ${id} has no record`);
  const out = edgesFrom(id).filter((e) => e.type === "student_of" && !e.inverse && inBrowser.has(e.to)).map((e) => byId.get(e.to)!);
  const students = realNodes.filter((n) => inBrowser.has(n.id) && edgesFrom(n.id).some((e) => e.type === "student_of" && !e.inverse && e.to === id));
  return { imam, teachers: out, students };
});

/** The date a curated record is placed at on the timeline: a person's death, else the record's own start date. */
const placedDate = (n: Node): any => n.data.died ?? n.data.date?.start ?? n.data.date ?? n.data.start ?? n.data.composed ?? n.data.made ?? n.data.born ?? n.data.floruit;
/** The year of an EDTF date; an unspecified decade or century ("06XX") is placed at its start. A year before the common era is not placed. */
const yearOfEdtf = (d: any): number | undefined => { const m = typeof d?.edtf === "string" ? d.edtf.match(/^(\d{2}[\dX]{2})/) : null; return m ? Number(m[1].replace(/X/g, "0")) || undefined : undefined; };
export interface QiraatDated { node: Node; section: QiraatSection; year: number; date: any }
/** Curated records with a date, oldest first; undated ones are counted by the timeline, not placed. */
export const qiraatDated: QiraatDated[] = qiraatItems
  .filter((i) => i.node.class !== "passage")
  .map((i) => ({ node: i.node, section: i.section, date: placedDate(i.node), year: yearOfEdtf(placedDate(i.node)) }))
  .filter((x): x is QiraatDated => typeof x.year === "number" && x.year > 0)
  .sort((a, b) => a.year - b.year || a.node.id.localeCompare(b.node.id));
export const qiraatUndated = qiraatItems.filter((i) => i.node.class !== "passage").length - qiraatDated.length;
