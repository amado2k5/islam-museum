// The Centuries, Years and Months Browser's shared reads (docs/plan/54-qurun-browser.md):
// every mention of the centuries/generations (القرون), the years and the named years
// (السنين والأعوام), the important months (الشهور الهامة) and the sacred months
// (الأشهر الحرم) in the museum's sources — the Qur'an, the Sunnah, the seerah and every
// harvested book — plus the curated records about them, all over the one graph. Passages
// are found by the shared detector in scripts/qurun.ts at build time and joined to the
// canonical `mentions` edges already in the graph, so a month or a named year mentioned
// in a book harvested later appears here the day its passage record lands; curated
// records join through the `qurun-browser` tag. There is no side list.
import { byId, graph, realNodes, edgesFrom } from "./graph";
import {
  QURUN_TAG, QURUN_SECTIONS, QURUN_SUBJECTS, QURUN_SUBJECT_SET,
  QURUN_TOPICS, QURUN_TOPIC_KIND, QURUN_TOPIC_SUBJECTS,
  qurunTopicsOf, qurunCorpusOf, qurunTagSection,
  type QurunSection, type QurunTopic, type QurunKind,
} from "../../../scripts/qurun";
import type { Node } from "../../../scripts/build-graph";

export {
  QURUN_TAG, QURUN_SECTIONS, QURUN_SUBJECTS, QURUN_TOPICS,
  QURUN_TOPIC_KIND, QURUN_TOPIC_SUBJECTS,
  type QurunSection, type QurunTopic, type QurunKind,
} from "../../../scripts/qurun";

export interface QurunItem {
  node: Node;
  section: QurunSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** The time topics and subject chips shown on the card. */
  topics: QurunTopic[];
  kind: QurunKind;
}

export interface QurunSubject {
  node: Node;
  /** Passages that mention this subject, grouped for the subject page. */
  passages: QurunItem[];
  counts: Record<"quran" | "sunnah" | "seerah" | "books", number>;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
const passageSection = (n: Node): QurunSection =>
  qurunCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined);

// Canonical mention edges already in the graph: passage -> subject `mentions`.
const edgeSubjects = new Map<string, Set<string>>();
for (const e of graph.edges) {
  if (e.type !== "mentions" || !e.from.startsWith("passage/") || !QURUN_SUBJECT_SET.has(e.to)) continue;
  const set = edgeSubjects.get(e.from) ?? new Set<string>();
  set.add(e.to);
  edgeSubjects.set(e.from, set);
}

const dedup = (xs: Iterable<string>) => [...new Set(xs)];
const feedItems: QurunItem[] = [];
const subjectPassages = new Map<string, QurunItem[]>();
const bump = (m: Map<string, QurunItem[]>, key: string, item: QurunItem) => {
  const list = m.get(key) ?? [];
  list.push(item);
  m.set(key, list);
};

for (const n of realNodes) {
  if (n.class === "passage") {
    const corpus = passageSection(n);
    const detected = qurunTopicsOf(n, corpus);
    const edges = edgeSubjects.get(n.id) ?? new Set<string>();
    const include = detected.length > 0 || edges.size > 0;
    if (!include) continue;
    const allSubjects = dedup([...detected.flatMap((t) => QURUN_TOPIC_SUBJECTS[t] ?? []), ...edges]) as string[];
    const kinds = detected.map((t) => QURUN_TOPIC_KIND[t]);
    const kind: QurunKind = kinds.includes("period") ? "period" : "mention";
    const item: QurunItem = { node: n, section: corpus, work: byId.get(n.data.work as string), topics: detected, kind };
    feedItems.push(item);
    for (const s of allSubjects) if (QURUN_SUBJECT_SET.has(s)) bump(subjectPassages, s, item);
    continue;
  }
  if (n.tags.includes(QURUN_TAG)) {
    feedItems.push({ node: n, section: qurunTagSection(n), topics: [], kind: "mention" });
  }
}

const bySectionThenId = (a: QurunItem, b: QurunItem) =>
  QURUN_SECTIONS.indexOf(a.section) - QURUN_SECTIONS.indexOf(b.section) || a.node.id.localeCompare(b.node.id);

export const qurunItems: QurunItem[] = feedItems.sort(bySectionThenId);

export const qurunSubjects: QurunSubject[] = QURUN_SUBJECTS
  .map((id) => byId.get(id))
  .filter((n): n is Node => !!n && !n.stub)
  .map((node) => {
    const passages = (subjectPassages.get(node.id) ?? []).sort(bySectionThenId);
    const counts = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of passages) counts[p.section as "quran" | "sunnah" | "seerah" | "books"]++;
    return { node, passages, counts };
  });

export const qurunSubjectsById = new Map(qurunSubjects.map((s) => [s.node.id, s]));

/** Passages that mention this subject, from the same build-time index the feed uses. */
export function passagesOf(id: string): QurunItem[] {
  return qurunSubjectsById.get(id)?.passages ?? [];
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
