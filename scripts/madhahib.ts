// The Four Madhhabs Browser's shared reads (docs/plan/38-madhahib-browser.md): which records belong
// to each section of «متصفح المذاهب الأربعة». Membership is tag-driven (`madhahib-browser` plus
// `mh-<section>` tags) and edge-driven: any work, passage, event, exhibit or question whose `mentions`
// edge names a madhhab group or the madhhab concept joins `dhikr` — and the school section when it
// names one of the four — so a book harvested later appears here the day its mentions edge lands,
// with no code change and no tagging step. A `source` record (outside the mentions domain) joins
// through its `mh-*` tags instead. There is no side list.
import type { Node } from "./build-graph.js";

export const MADHABIB_TAG = "madhahib-browser";
/** Page sections in display order; a `mh-<id>` tag outside this list is ignored. */
export const MADHABIB_SECTIONS = [
  "aima", "hanafi", "maliki", "shafii", "hanbali", "ukhra", "salaf", "kutub", "mafahim", "dhikr",
] as const;
export type MadhahibSection = (typeof MADHABIB_SECTIONS)[number];
export const MH_PREFIX = "mh-";

/**
 * What a forward `mentions` edge contributes, by target: every madhhab target puts the record in
 * `dhikr` (the corpus of what the sources say about the schools); the four Sunni groups also add
 * their school section, and the other schools add `ukhra`.
 */
const MENTION_SECTIONS: Record<string, readonly string[]> = {
  "concept/madhhab": ["dhikr"],
  "group/hanafi-madhhab": ["dhikr", "hanafi"],
  "group/maliki-madhhab": ["dhikr", "maliki"],
  "group/shafii-madhhab": ["dhikr", "shafii"],
  "group/hanbali-madhhab": ["dhikr", "hanbali"],
  "group/zahiri-madhhab": ["dhikr", "ukhra"],
  "group/jafari-madhhab": ["dhikr", "ukhra"],
  "group/ibadiyya": ["dhikr", "ukhra"],
};

/** The sections a record's `mh-<section>` tags place it in. */
export function madhahibTagSections(n: Node): string[] {
  return [...new Set(
    n.tags.filter((t) => t.startsWith(MH_PREFIX)).map((t) => t.slice(MH_PREFIX.length)),
  )].filter((s) => (MADHABIB_SECTIONS as readonly string[]).includes(s));
}

export interface MadhahibEdge { from: string; to: string; type: string; inverse: boolean }
export interface MadhahibMember { node: Node; sections: string[] }

/**
 * Every browser member over the whole node/edge set: tagged records (any `mh-*` section) union
 * records whose forward `mentions` edges name a madhhab target. `sections` comes back in
 * MADHABIB_SECTIONS order so pages and exports agree.
 */
export function madhahibMembers(nodes: Node[], edges: MadhahibEdge[]): MadhahibMember[] {
  const edgeSections = new Map<string, Set<string>>();
  for (const e of edges) {
    if (e.inverse || e.type !== "mentions") continue;
    const secs = MENTION_SECTIONS[e.to];
    if (!secs) continue;
    const set = edgeSections.get(e.from) ?? new Set<string>();
    for (const s of secs) set.add(s);
    edgeSections.set(e.from, set);
  }
  const rank = new Map<string, number>(MADHABIB_SECTIONS.map((s, i) => [s, i]));
  const out: MadhahibMember[] = [];
  for (const n of nodes) {
    if (n.stub) continue;
    const tagSecs = n.tags.includes(MADHABIB_TAG) ? madhahibTagSections(n) : [];
    const mentioned = edgeSections.get(n.id);
    if (!tagSecs.length && !mentioned?.size) continue;
    const sections = [...new Set([...tagSecs, ...(mentioned ? [...mentioned] : [])])]
      .sort((a, b) => (rank.get(a) ?? 99) - (rank.get(b) ?? 99));
    if (sections.length) out.push({ node: n, sections });
  }
  return out;
}
