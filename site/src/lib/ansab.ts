// The Genealogies, Peoples, Butun and Prophets' Tree Browser's shared reads
// (docs/plan/55-ansab-browser.md): every mention of lineages, tribes, peoples, the tribal
// butun and the prophets' tree in the museum's sources — the Qur'an, the Sunnah, the seerah and
// every harvested book — plus the curated records about them, all over the one graph. Passages
// are found by the shared detector in scripts/ansab.ts at build time and joined to the canonical
// `mentions` edges already in the graph, so a mention in a book harvested later appears here the
// day its passage record lands; curated records join through the `ansab-browser` tag. There is
// no side list.
import { realNodes, edgesFrom, byId } from "./graph";
import {
  ANSAB_TAG, ANSAB_CORPORA, ANSAB_SUBJECTS, ANSAB_SUBJECT_SET, ANSAB_PROPHET_CHAIN,
  ansabTopicsOf, ansabCorpusOf, ansabSectionOf,
  type AnsabSection, type AnsabCorpus, type AnsabTopic,
} from "../../../scripts/ansab";
import type { Node } from "../../../scripts/build-graph";

export {
  ANSAB_TAG, ANSAB_SECTIONS, ANSAB_CORPORA, ANSAB_SUBJECTS, ANSAB_SUBJECT_SET,
  ANSAB_GENERIC_TOPICS, ANSAB_PROPHET_CHAIN,
  type AnsabSection, type AnsabCorpus, type AnsabTopic,
} from "../../../scripts/ansab";

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
const corpusOf = (p: Node): AnsabCorpus =>
  ansabCorpusOf(p.data.work as string | undefined, genreOf(p.data.work as string | undefined), p.data.unit as string | undefined);
const isGeneric = (t: AnsabTopic) => !(t.startsWith("person/") || t.startsWith("group/") || t.startsWith("work/") || t.startsWith("concept/"));

// Canonical mention edges already in the graph: passage -> <subject> `mentions`.
const edgeSubjects = new Map<string, Set<string>>();
// Passage nodes that mention a record, keyed by the mentioned node's id.
export const ansabMentioners = (() => {
  const map = new Map<string, Node[]>();
  for (const p of realNodes) {
    if (p.class !== "passage") continue;
    for (const e of edgesFrom(p.id)) {
      if (e.type !== "mentions") continue;
      const list = map.get(e.to) ?? [];
      list.push(p);
      map.set(e.to, list);
      if (ANSAB_SUBJECT_SET.has(e.to)) {
        const set = edgeSubjects.get(p.id) ?? new Set<string>();
        set.add(e.to);
        edgeSubjects.set(p.id, set);
      }
    }
  }
  return map;
})();

export interface AnsabItem {
  node: Node;
  corpus: AnsabCorpus;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Subject ids and class chips shown on the card. */
  topics: AnsabTopic[];
}

const dedup = <T,>(xs: Iterable<T>) => [...new Set(xs)];
const feedItems: AnsabItem[] = [];
const subjectPassages = new Map<string, AnsabItem[]>();
const bump = (m: Map<string, AnsabItem[]>, key: string, item: AnsabItem) => {
  const list = m.get(key) ?? [];
  list.push(item);
  m.set(key, list);
};

for (const n of realNodes) {
  if (n.class !== "passage") continue;
  const detected = ansabTopicsOf(n);
  const edges = edgeSubjects.get(n.id) ?? new Set<string>();
  if (detected.length === 0 && edges.size === 0) continue;
  const detectedSubjects = detected.filter((t) => !isGeneric(t));
  const allSubjects = dedup([...detectedSubjects, ...edges]) as AnsabTopic[];
  const displayTopics = dedup([...detectedSubjects, ...edges, ...detected.filter(isGeneric)]) as AnsabTopic[];
  const item: AnsabItem = { node: n, corpus: corpusOf(n), work: byId.get(n.data.work as string), topics: displayTopics };
  feedItems.push(item);
  for (const s of allSubjects) if (ANSAB_SUBJECT_SET.has(s)) bump(subjectPassages, s, item);
}

const byCorpusThenId = (a: AnsabItem, b: AnsabItem) =>
  ANSAB_CORPORA.indexOf(a.corpus) - ANSAB_CORPORA.indexOf(b.corpus) || a.node.id.localeCompare(b.node.id);

/** Every detected or edge-joined passage, corpus-sorted — the browser's mention feed. */
export const ansabFeed: AnsabItem[] = feedItems.sort(byCorpusThenId);

export interface AnsabSubject {
  node: Node;
  section: AnsabSection;
  /** Passages that mention this subject, grouped for the subject page. */
  passages: AnsabItem[];
  counts: Record<AnsabCorpus, number>;
}

/** A node is a browser subject when it is in the index and not a stub. */
export const ansabSubjects: AnsabSubject[] = ANSAB_SUBJECTS
  .map((id) => byId.get(id))
  .filter((n): n is Node => !!n && !n.stub)
  .map((node) => {
    // detected-subject passages plus edge-joined passages are merged above; tag-bearing
    // records also count as subjects even when nothing mentions them yet.
    const passages = (subjectPassages.get(node.id) ?? []).sort(byCorpusThenId);
    const counts: Record<AnsabCorpus, number> = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of passages) counts[p.corpus]++;
    return { node, section: ansabSectionOf(node), passages, counts };
  });

export const ansabSubjectsById = new Map(ansabSubjects.map((s) => [s.node.id, s]));

/** The passages that mention this subject, from the same build-time index the feed uses. */
export function passagesOf(id: string): AnsabItem[] {
  return ansabSubjectsById.get(id)?.passages ?? [];
}

/** Passages of one corpus for a subject, sorted: ayahs by sura/aya, the rest by id. */
export function passagesOfCorpus(id: string, corpus: AnsabCorpus): Node[] {
  const list = (passagesOf(id) ?? []).filter((i) => i.corpus === corpus).map((i) => i.node);
  const order = (a: Node, b: Node) => ((a.data.sura ?? 0) - (b.data.sura ?? 0)) || ((a.data.aya ?? 0) - (b.data.aya ?? 0)) || a.id.localeCompare(b.id);
  return corpus === "quran" ? list.sort(order) : list.sort((a, b) => a.id.localeCompare(b.id));
}

const RELATED_TYPES = new Set([
  "related_to", "lived_in", "born_in", "died_in", "spouse_of", "parent_of", "child_of",
  "sibling_of", "participated_in", "opposed", "fought", "member_of", "had_participant", "part_of",
]);

/** Other graph records this subject points at (family, opponents, places, events, concepts). */
export function relatedOf(id: string): Node[] {
  return edgesFrom(id)
    .filter((e) => !e.inverse && RELATED_TYPES.has(e.type))
    .map((e) => byId.get(e.to))
    .filter((n): n is Node => !!n && !n.stub);
}

/** The parent edge of a chain link, when the graph has it. */
export function parentOf(id: string): Node | undefined {
  const e = edgesFrom(id).find((e) => !e.inverse && e.type === "child_of");
  return e ? byId.get(e.to) : undefined;
}
