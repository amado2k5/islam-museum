// The Ulama Browser's shared reads (docs/plan/70-ulama-browser.md): «متصفح المفكرون والعلماء والأدباء
// والمحدثون والكتاب» — every person of knowledge and the pen in the graph, and every passage that
// mentions them. Membership is computed at build time by the shared detector in scripts/ulama.ts:
// persons qualify by role/job, passages by `mentions` edges, the reviewed Qur'an table or the guarded
// name lexicon, so a book harvested later appears here the day its records land; curated records join
// through the `ulama-browser` tag. There is no side list.
import { graph, realNodes, byId } from "./graph";
import {
  ULAMA_TAG, ULAMA_SECTIONS, ULAMA_TOPICS,
  isUlamaPerson, isUlamaPassage, ulamaCategoriesOf, ulamaPersonSection,
  ulamaCorpusOf, ulamaTagSection, ulamaTagTopics, ulamaNameMatches, ulamaQuranTopics,
  type UlamaSection, type UlamaCorpus, type UlamaTopic,
} from "../../../scripts/ulama";
import type { Node } from "../../../scripts/build-graph";

export { ULAMA_SECTIONS, ULAMA_TOPICS, type UlamaSection, type UlamaCorpus, type UlamaTopic } from "../../../scripts/ulama";

/** Every person id the detector qualifies — the set `mentions` edges are tested against. */
export const ULAMA_PERSON_SET = new Set(realNodes.filter(isUlamaPerson).map((n) => n.id));

/** passage id → the qualifying persons its `mentions` edges name. */
const mentionMap = new Map<string, string[]>();
for (const e of graph.edges) {
  if (e.inverse || e.type !== "mentions" || !e.from.startsWith("passage/") || !ULAMA_PERSON_SET.has(e.to)) continue;
  const list = mentionMap.get(e.from) ?? [];
  list.push(e.to);
  mentionMap.set(e.from, list);
}
export const ulamaMentionsOf = (passageId: string): string[] => mentionMap.get(passageId) ?? [];

export interface UlamaItem {
  node: Node;
  section: UlamaSection;
  /** Category chips: the person's own categories, the Qur'an table's topics on verses, tags on curated records. */
  topics: UlamaTopic[];
  /** Passage cards: the scholars its edges or text name. */
  mentioned: string[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

const topicsOf = (n: Node): UlamaTopic[] => {
  if (n.class === "person") return [...new Set([...ulamaCategoriesOf(n), ...ulamaTagTopics(n)])];
  if (n.class === "passage" && n.data.work === "work/quran") return ulamaQuranTopics(n.data.sura, n.data.aya);
  return ulamaTagTopics(n);
};

export const ulamaItems: UlamaItem[] = realNodes
  .filter((n) =>
    n.tags.includes(ULAMA_TAG) ||
    isUlamaPerson(n) ||
    isUlamaPassage(n, mentionMap.get(n.id) ?? []))
  .map((n): UlamaItem => ({
    node: n,
    section: n.class === "passage"
      ? ulamaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : n.class === "person" && !n.tags.includes(ULAMA_TAG)
        ? ulamaPersonSection(n)
        : ulamaTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: topicsOf(n),
    mentioned: n.class === "passage" ? mentionMap.get(n.id) ?? [] : [],
  }))
  .sort((a, b) => {
    const r = ULAMA_SECTIONS.indexOf(a.section) - ULAMA_SECTIONS.indexOf(b.section);
    return r || (Number(a.node.data.sura ?? 0) - Number(b.node.data.sura ?? 0)) || (Number(a.node.data.aya ?? 0) - Number(b.node.data.aya ?? 0))
      || a.node.id.localeCompare(b.node.id, "en", { numeric: true });
  });

/** person id → the passages that mention him (the "said of him in the sources" strip on person cards). */
export const ulamaMentionedByIndex = mentionMap;

/** The leading figures for the signature view: people with the most passage mentions, ties by id. */
export const ulamaLeadMentioned = (limit = 10): { node: Node; count: number }[] => {
  const counts = new Map<string, number>();
  for (const ids of mentionMap.values()) for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, count]) => ({ node: byId.get(id)!, count }))
    .filter((x) => x.node)
    .sort((a, b) => b.count - a.count || a.node.id.localeCompare(b.node.id))
    .slice(0, limit);
};

/** A person's authored works: `author_of`/`wrote` edges in either direction, resolved once. */
export const worksOf = (personId: string): Node[] => {
  const out: Node[] = [];
  for (const e of graph.edges) {
    if (e.inverse) continue;
    if ((e.type === "authored" || e.type === "composed") && e.from === personId) {
      const w = byId.get(e.to); if (w) out.push(w);
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
};

// ---------- chronology for the signature view and section ordering inside people sections:
// a person's death year (CE, Hijri shown by the card), else floruit, else undated.
const placedDate = (n: Node): any => n.data.died ?? n.data.date?.end ?? n.data.floruit ?? n.data.date;
export const yearOf = (n: Node): number | undefined => {
  const d = placedDate(n);
  const m = typeof d?.edtf === "string" ? d.edtf.match(/^(-?\d{2}[\dX]{2})/) : null;
  return m ? Number(m[1].replace(/X/g, "0")) || undefined : undefined;
};
export const ulamaDated: { node: Node; year: number }[] = ulamaItems
  .filter((i) => i.node.class === "person")
  .map((i) => ({ node: i.node, year: yearOf(i.node) ?? -1 }))
  .filter((x) => x.year > 0)
  .sort((a, b) => a.year - b.year || a.node.id.localeCompare(b.node.id));
