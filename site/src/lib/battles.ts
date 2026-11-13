// The Battles, Wars and Conquests Browser's shared reads (docs/plan/31-battles-browser.md): the
// military-kind event records, the ghazwa/sariyya split of the prophetic era, and the kind and era
// groupings — every list is computed from the compiled graph at build time, never a side table.
import { realNodes, edgesFrom, byId } from "./graph";
import { timelineKey } from "./dates";
import { isGhazwaNode, MUHAMMAD } from "../../../scripts/ghazwa";
import type { Node } from "../../../scripts/build-graph";

/** The eleven engagement kinds the browser lists (schema/enums/kinds.yaml, event). Atrocities and
 *  acts — massacre, expulsion, persecution, attack — stay out: they are not engagements (plan 31 §9). */
export const MILITARY_KINDS = [
  "battle", "siege", "conquest", "war", "campaign", "raid",
  "revolt", "civil-war", "skirmish", "naval-battle", "mutiny",
] as const;
export type MilitaryKind = (typeof MILITARY_KINDS)[number];

const byTimeline = (a: Node, b: Node) => {
  const ka = timelineKey(a), kb = timelineKey(b);
  return ka.key - kb.key || ka.ord - kb.ord || a.slug.localeCompare(b.slug);
};

export const battleNodes: Node[] = realNodes
  .filter((n) => n.class === "event" && (MILITARY_KINDS as readonly string[]).includes(n.data.kind))
  .sort(byTimeline);

export const battlesBySlug = new Map(battleNodes.map((n) => [n.slug, n]));

const ghazwaCache = new Map<string, boolean>();
/** A prophetic-era engagement is a ghazwa when person/muhammad is among its participants or
 *  commanders — in its sides block or its had_participant edges; otherwise a sariyya (plan 31 §2.3). */
export function isGhazwa(n: Node): boolean {
  const hit = ghazwaCache.get(n.id);
  if (hit !== undefined) return hit;
  const found = isGhazwaNode(n, edgesFrom(n.id).some((e) => e.type === "had_participant" && e.to === MUHAMMAD));
  ghazwaCache.set(n.id, found);
  return found;
}

/** All prophetic-era military events in chronological order — the ghazawat and saraya together. */
export const propheticNodes = battleNodes.filter((n) => n.periods.includes("period/prophetic-era"));
export const ghazawat: Node[] = propheticNodes.filter(isGhazwa);
export const saraya: Node[] = propheticNodes.filter((n) => !isGhazwa(n));

/** Kind -> its events, chronological. */
export const byKind = new Map<MilitaryKind, Node[]>();
for (const k of MILITARY_KINDS) byKind.set(k, []);
for (const n of battleNodes) byKind.get(n.data.kind as MilitaryKind)!.push(n);

/** Period id -> its military events, chronological (an event in two periods appears in both). */
export const byPeriod = new Map<string, Node[]>();
for (const n of battleNodes) for (const p of n.periods) {
  const list = byPeriod.get(p) ?? [];
  list.push(n);
  byPeriod.set(p, list);
}
/** The period records that have military events, earliest era first. */
export const battlePeriods: Node[] = [...byPeriod.keys()]
  .map((id) => byId.get(id))
  .filter((n): n is Node => Boolean(n))
  .sort((a, b) => (a.span?.earliest ?? Infinity) - (b.span?.earliest ?? Infinity));

/** The first occurred_at target that resolves to a real node — the card's "where". */
export function placeOf(id: string): Node | undefined {
  for (const e of edgesFrom(id)) {
    if (e.type !== "occurred_at") continue;
    const t = byId.get(e.to);
    if (t && !t.stub) return t;
  }
  return undefined;
}

/** Commanders across all sides, deduplicated, resolved to nodes (persons or groups). */
export function commandersOf(n: Node): Node[] {
  const seen = new Set<string>();
  const out: Node[] = [];
  for (const s of n.data.sides ?? []) {
    for (const c of s.commanders ?? []) {
      if (seen.has(c)) continue;
      seen.add(c);
      const t = byId.get(c);
      if (t && !t.stub) out.push(t);
    }
  }
  return out;
}

/** The engagement's parent war/campaign, via a part_of edge or the part_of data field. */
export function parentOf(n: Node): Node | undefined {
  for (const e of edgesFrom(n.id)) {
    if (e.type !== "part_of") continue;
    const t = byId.get(e.to);
    if (t && !t.stub && t.class === "event") return t;
  }
  if (typeof n.data.part_of === "string") {
    const t = byId.get(n.data.part_of);
    if (t && !t.stub && t.class === "event") return t;
  }
  return undefined;
}

/** Cards on one page of a kind or era listing (audit of 13 November 2026, S18). */
export const BATTLE_PAGE = 200;
