// The Messengers Browser's shared reads (docs/plan/39-messengers-browser.md): every mention of
// the prophets and messengers in the museum's sources — the Qur'an, the Sunnah, the seerah and
// every harvested book — plus the curated records about them, all over the one graph. Passages
// are found by the shared detector in scripts/messengers.ts at build time and joined to the
// canonical `mentions` edges already in the graph, so a prophet mention in a book harvested
// later appears here the day its passage record lands; curated records join through the
// `messengers-browser` tag. There is no side list.
import { byId, graph, realNodes, edgesFrom } from "./graph";
import {
  MESSENGERS_TAG, MESSENGER_SECTIONS, MESSENGER_SUBJECTS, MESSENGER_SUBJECT_SET,
  messengerTopicsOf, messengerCorpusOf, messengerTagSection,
  type MessengerSection, type MessengerTopic,
} from "../../../scripts/messengers";
import type { Node } from "../../../scripts/build-graph";

export {
  MESSENGERS_TAG, MESSENGER_SECTIONS, MESSENGER_SUBJECTS, MESSENGER_GENERIC_TOPICS,
  type MessengerSection, type MessengerTopic,
} from "../../../scripts/messengers";

export interface MessengerItem {
  node: Node;
  section: MessengerSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Subject ids and class chips shown on the card. */
  topics: MessengerTopic[];
}

export interface MessengerSubject {
  node: Node;
  /** Passages that mention this subject, grouped for the subject page. */
  passages: MessengerItem[];
  counts: Record<"quran" | "sunnah" | "seerah" | "books", number>;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
const isGeneric = (t: MessengerTopic) => !t.startsWith("person/");
const passageSection = (n: Node): MessengerSection =>
  messengerCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined);

// Canonical mention edges already in the graph: passage -> person/… `mentions`.
const edgeSubjects = new Map<string, Set<string>>();
for (const e of graph.edges) {
  if (e.type !== "mentions" || !e.from.startsWith("passage/") || !MESSENGER_SUBJECT_SET.has(e.to)) continue;
  const set = edgeSubjects.get(e.from) ?? new Set<string>();
  set.add(e.to);
  edgeSubjects.set(e.from, set);
}

const dedup = (xs: Iterable<MessengerTopic>) => [...new Set(xs)];
const feedItems: MessengerItem[] = [];
const subjectPassages = new Map<string, MessengerItem[]>();
const bump = (m: Map<string, MessengerItem[]>, key: string, item: MessengerItem) => {
  const list = m.get(key) ?? [];
  list.push(item);
  m.set(key, list);
};

for (const n of realNodes) {
  if (n.class === "passage") {
    const detected = messengerTopicsOf(n);
    const detectedSubjects = detected.filter((t): t is Extract<MessengerTopic, `person/${string}`> => t.startsWith("person/"));
    const generic = detected.filter(isGeneric);
    const edges = edgeSubjects.get(n.id) ?? new Set<string>();
    const edgeNonMuhammad = [...edges].filter((s) => s !== "person/muhammad");
    // A bare `mentions → person/muhammad` edge marks the hadith's narrator, not a mention of the
    // prophets as a subject; it enters the feed only beside a named/class hit in the matn.
    const include =
      detected.length > 0 ||
      edgeNonMuhammad.length > 0 ||
      (edges.has("person/muhammad") && (generic.length > 0 || detectedSubjects.includes("person/muhammad")));
    if (!include) continue;
    const allSubjects = dedup([...detectedSubjects, ...edges]) as MessengerTopic[];
    const displayTopics = dedup([...detectedSubjects, ...edgeNonMuhammad, ...generic]) as MessengerTopic[];
    const item: MessengerItem = { node: n, section: passageSection(n), work: byId.get(n.data.work as string), topics: displayTopics };
    feedItems.push(item);
    for (const s of allSubjects) if (MESSENGER_SUBJECT_SET.has(s)) bump(subjectPassages, s, item);
    continue;
  }
  if (n.tags.includes(MESSENGERS_TAG)) {
    feedItems.push({ node: n, section: messengerTagSection(n), topics: [] });
  }
}

const bySectionThenId = (a: MessengerItem, b: MessengerItem) =>
  MESSENGER_SECTIONS.indexOf(a.section) - MESSENGER_SECTIONS.indexOf(b.section) || a.node.id.localeCompare(b.node.id);

export const messengerItems: MessengerItem[] = feedItems.sort(bySectionThenId);

export const messengerSubjects: MessengerSubject[] = MESSENGER_SUBJECTS
  .map((id) => byId.get(id))
  .filter((n): n is Node => !!n && !n.stub)
  .map((node) => {
    const passages = (subjectPassages.get(node.id) ?? []).sort(bySectionThenId);
    const counts = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
    for (const p of passages) counts[p.section as "quran" | "sunnah" | "seerah" | "books"]++;
    return { node, passages, counts };
  });

export const messengerSubjectsById = new Map(messengerSubjects.map((s) => [s.node.id, s]));

/** Passages that mention this subject, from the same build-time index the feed uses. */
export function passagesOf(id: string): MessengerItem[] {
  return messengerSubjectsById.get(id)?.passages ?? [];
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
