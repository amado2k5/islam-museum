// The Muslim Media-Makers Browser's shared reads (docs/plan/67-i3lam-browser.md):
// every mention of the media-makers — muezzin, herald, khatib, state spokesman,
// katib, journalist, media person, influencer, reformer and revolutionary — in the
// museum's sources, plus the persons who held the roles. Passages join through the
// canonical `mentions` edges already in the graph (a passage that mentions a holder
// or a media job appears here the day its record lands) and through the
// `i3lam-browser` tag, so a book harvested later surfaces with no site edit.
import { realNodes, edgesFrom, byId } from "./graph";
import { ansabCorpusOf, ANSAB_CORPORA, type AnsabCorpus } from "../../../scripts/ansab";
import { holdersOf } from "./jobs";
import type { Node } from "../../../scripts/build-graph";

export const I3LAM_TAG = "i3lam-browser";
export const I3LAM_CORPORA = ANSAB_CORPORA;

/** The media chain, in the founder's order, with the added state and reform voices. */
export interface MediaRole { id: string; wing: "voice" | "pen" | "signal" | "state" }
export const MEDIA_CHAIN: MediaRole[] = [
  { id: "job/muezzin", wing: "voice" },
  { id: "job/munadi", wing: "voice" },
  { id: "job/khatib", wing: "voice" },
  { id: "job/natiq-rasmi", wing: "state" },
  { id: "job/diplomat", wing: "state" },
  { id: "job/katib", wing: "pen" },
  { id: "job/sahafi", wing: "pen" },
  { id: "job/ilami", wing: "signal" },
  { id: "job/muaththir", wing: "signal" },
  { id: "job/muslih", wing: "signal" },
  { id: "job/thair", wing: "signal" },
];
/** The offices the chain answers to — holders shown under "the state speaks". */
export const STATE_JOBS: string[] = [
  "job/caliph", "job/sultan", "job/king", "job/vizier", "job/grand-vizier",
  "job/qadi", "job/qadi-al-qudat", "job/emir", "job/wali", "job/sahib-al-barid",
];

export const i3lamJobs: Node[] = realNodes.filter((n) => n.class === "job" && [...MEDIA_CHAIN.map((r) => r.id), ...STATE_JOBS].includes(n.id));
export const i3lamJobById = new Map(i3lamJobs.map((j) => [j.id, j]));
export const i3lamHolders = (jobId: string): Node[] => holdersOf(jobId);

/** Persons who hold at least one media-chain job. */
const mediaPersonIds = new Set<string>();
for (const r of MEDIA_CHAIN) for (const p of holdersOf(r.id)) mediaPersonIds.add(p.id);
export const i3lamPeople: Node[] = [...mediaPersonIds].map((id) => byId.get(id)!).filter(Boolean);

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
const corpusOf = (p: Node): AnsabCorpus =>
  ansabCorpusOf(p.data.work as string | undefined, genreOf(p.data.work as string | undefined), p.data.unit as string | undefined);

// Passage -> the media subjects it mentions (holders or media job records).
const subjectPassages = new Map<string, Node[]>();
export interface I3lamItem { node: Node; corpus: AnsabCorpus; work?: Node; subjects: string[] }
const feedItems: I3lamItem[] = [];
for (const p of realNodes) {
  if (p.class !== "passage") continue;
  const subjects = new Set<string>();
  for (const e of edgesFrom(p.id)) {
    if (e.type !== "mentions") continue;
    if (mediaPersonIds.has(e.to) || i3lamJobById.has(e.to)) {
      subjects.add(e.to);
      const list = subjectPassages.get(e.to) ?? [];
      list.push(p);
      subjectPassages.set(e.to, list);
    }
  }
  if (subjects.size === 0 && !((p.data.tags ?? []) as string[]).includes(I3LAM_TAG)) continue;
  feedItems.push({ node: p, corpus: corpusOf(p), work: byId.get(p.data.work as string), subjects: [...subjects] });
}
export const i3lamFeed: I3lamItem[] = feedItems;
/** Any record (of any class) carrying the i3lam-browser tag joins the browser automatically. */
export const i3lamTagged: Node[] = realNodes.filter((n) => ((n.data.tags ?? []) as string[]).includes(I3LAM_TAG));

/** Passages mentioning a media subject (holder or job), keyed by the subject's id. */
export const i3lamMentionsOf = (id: string): Node[] => subjectPassages.get(id) ?? [];

/** Curated Qur'an anchors — passages where the media roles themselves are named, kept frozen. */
export const I3LAM_QURAN: { id: string; k: string }[] = [
  { id: "passage/quran-26-224", k: "poets" },
  { id: "passage/quran-4-83", k: "news" },
  { id: "passage/quran-5-58", k: "adhan" },
  { id: "passage/quran-62-9", k: "jumua" },
  { id: "passage/quran-33-45", k: "herald" },
  { id: "passage/quran-9-3", k: "proclamation" },
  { id: "passage/quran-34-13", k: "caller" },
];
