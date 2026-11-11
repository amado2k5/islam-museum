// The Miracles Browser's shared reads (docs/plan/44-miracles-browser.md): every mention of the
// divine miracles and the prophets' miracles in the museum's sources — the Qur'an, the Sunnah,
// the seerah and every harvested book — plus the curated records about them, all over the one
// graph. Passages are found by the shared detector in scripts/miracles.ts at build time and
// joined to the canonical `mentions` edges already in the graph, so a miracle mentioned in a
// book harvested later appears here the day its passage record lands; curated records join
// through the `miracles-browser` tag. There is no side list.
import { byId, graph, realNodes, edgesFrom } from "./graph";
import {
  MIRACLES_TAG, MIRACLE_SECTIONS, MIRACLE_SUBJECTS, MIRACLE_SUBJECT_SET,
  MIRACLE_TOPICS, MIRACLE_TOPIC_KIND, MIRACLE_TOPIC_SUBJECTS,
  miracleTopicsOf, miracleCorpusOf, miracleTagSection,
  type MiracleSection, type MiracleTopic, type MiracleKind,
} from "../../../scripts/miracles";
import type { Node } from "../../../scripts/build-graph";

export {
  MIRACLES_TAG, MIRACLE_SECTIONS, MIRACLE_SUBJECTS, MIRACLE_TOPICS,
  MIRACLE_TOPIC_KIND, MIRACLE_TOPIC_SUBJECTS,
  type MiracleSection, type MiracleTopic, type MiracleKind,
} from "../../../scripts/miracles";

export interface MiracleItem {
  node: Node;
  section: MiracleSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Miracle topics and subject chips shown on the card. */
  topics: MiracleTopic[];
  kind: MiracleKind;
}

export interface MiracleSubject {
  node: Node;
  /** Passages that mention this subject, grouped for the subject page. */
  passages: MiracleItem[];
  counts: Record<"quran" | "sunnah" | "seerah" | "books", number>;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
const passageSection = (n: Node): MiracleSection =>
  miracleCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined);

// Canonical mention edges already in the graph: passage -> subject `mentions`.
const edgeSubjects = new Map<string, Set<string>>();
for (const e of graph.edges) {
  // A bare `mentions → person/muhammad` edge marks the hadith's narrator, not a miracle
  // mention; it never enters through edges alone (the topic map assigns Muhammad's signs).
  if (e.type !== "mentions" || !e.from.startsWith("passage/") || e.to === "person/muhammad" || !MIRACLE_SUBJECT_SET.has(e.to)) continue;
  const set = edgeSubjects.get(e.from) ?? new Set<string>();
  set.add(e.to);
  edgeSubjects.set(e.from, set);
}

const dedup = (xs: Iterable<string>) => [...new Set(xs)];
const feedItems: MiracleItem[] = [];
const subjectPassages = new Map<string, MiracleItem[]>();
const bump = (m: Map<string, MiracleItem[]>, key: string, item: MiracleItem) => {
  const list = m.get(key) ?? [];
  list.push(item);
  m.set(key, list);
};

for (const n of realNodes) {
  if (n.class === "passage") {
    const corpus = passageSection(n);
    const detected = miracleTopicsOf(n, corpus);
    const edges = edgeSubjects.get(n.id) ?? new Set<string>();
    // A bare mentions edge into a miracle subject marks the passage as evidence for that subject;
    // the feed always shows it beside its detected miracle topics.
    const include = detected.length > 0 || edges.size > 0;
    if (!include) continue;
    const allSubjects = dedup([...detected.flatMap((t) => MIRACLE_TOPIC_SUBJECTS[t] ?? []), ...edges]) as string[];
    const kinds = detected.map((t) => MIRACLE_TOPIC_KIND[t]);
    const kind: MiracleKind = kinds.includes("event") ? "event" : kinds.includes("sign") ? "sign" : "mention";
    const item: MiracleItem = { node: n, section: corpus, work: byId.get(n.data.work as string), topics: detected, kind };
    feedItems.push(item);
    for (const s of allSubjects) if (MIRACLE_SUBJECT_SET.has(s)) bump(subjectPassages, s, item);
    continue;
  }
  if (n.tags.includes(MIRACLES_TAG)) {
    feedItems.push({ node: n, section: miracleTagSection(n), topics: [], kind: "mention" });
  }
}

const bySectionThenId = (a: MiracleItem, b: MiracleItem) =>
  MIRACLE_SECTIONS.indexOf(a.section) - MIRACLE_SECTIONS.indexOf(b.section) || a.node.id.localeCompare(b.node.id);

export const miracleItems: MiracleItem[] = feedItems.sort(bySectionThenId);

export const miracleSubjects: MiracleSubject[] = MIRACLE_SUBJECTS
  .map((id) => byId.get(id))
  .filter((n): n is Node => !!n && !n.stub)
  .map((node) => {
    const passages = (subjectPassages.get(node.id) ?? []).sort(bySectionThenId);
    const counts = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of passages) counts[p.section as "quran" | "sunnah" | "seerah" | "books"]++;
    return { node, passages, counts };
  });

export const miracleSubjectsById = new Map(miracleSubjects.map((s) => [s.node.id, s]));

/** Passages that mention this subject, from the same build-time index the feed uses. */
export function passagesOf(id: string): MiracleItem[] {
  return miracleSubjectsById.get(id)?.passages ?? [];
}

const RELATED_TYPES = new Set([
  "related_to", "lived_in", "born_in", "died_in", "spouse_of", "parent_of", "child_of",
  "sibling_of", "participated_in", "opposed", "fought", "member_of", "had_participant",
]);

/** Other graph records this subject points at (family, opponents, places, events, concepts). */
export function relatedOf(id: string): Node[] {
  return edgesFrom(id)
    .filter((e) => !e.inverse && RELATED_TYPES.has(e.type))
    .map((e) => byId.get(e.to))
    .filter((n): n is Node => !!n && !n.stub);
}
