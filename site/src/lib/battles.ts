// The Battles, Wars and Conquests Browser's shared reads (docs/plan/31-battles-browser.md): the
// military-kind event records, the ghazwa/sariyya split of the prophetic era, and the kind and era
// groupings — every list is computed from the compiled graph at build time, never a side table.
import { realNodes, edgesFrom, byId } from "./graph";
import { timelineKey, startOf, hijriParts } from "./dates";
import { civilToHijri, hijriToCivil } from "../../../scripts/hijri/convert";
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

// ---- the signature views (components/sig/BattlesCenturies.astro, BattlesCampaignMap.astro) ----

/** The eleven kinds in five families for the century histogram. Presentation only: the legend names the kinds. */
export const KIND_FAMILIES: { id: string; kinds: MilitaryKind[] }[] = [
  { id: "f1", kinds: ["battle", "skirmish", "naval-battle"] },
  { id: "f2", kinds: ["siege"] },
  { id: "f3", kinds: ["conquest", "campaign", "raid"] },
  { id: "f4", kinds: ["war", "civil-war"] },
  { id: "f5", kinds: ["revolt", "mutiny"] },
];
{
  const seen = KIND_FAMILIES.flatMap((f) => f.kinds);
  if (seen.length !== MILITARY_KINDS.length || MILITARY_KINDS.some((k) => !seen.includes(k)))
    throw new Error("battles: KIND_FAMILIES must place every military kind in exactly one family");
}
const familyOfKind = new Map(KIND_FAMILIES.flatMap((f) => f.kinds.map((k) => [k, f.id] as const)));

/** The Hijri year a record's start date falls in: the stored Hijri date, else the CE date converted. Undefined before the Hijra or when undated. */
export function hijriYearOf(n: Node): number | undefined {
  const s = startOf(n.data);
  const h = hijriParts(s?.hijri);
  if (h) return h[0] >= 1 ? h[0] : undefined;
  const m = typeof s?.edtf === "string" ? s.edtf.match(/^(-?\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/) : null;
  if (!m || Number(m[1]) < 622) return undefined;
  const y = Number(m[1]);
  return civilToHijri(s.calendar ?? (y < 1583 ? "julian" : "gregorian"), { y, m: Number(m[2] ?? 6), d: Number(m[3] ?? 15) }).date.y;
}

export interface CenturyBin { century: number; startAH: number; startCE: number; total: number; byFamily: Record<string, number> }
/** One bin per Hijri century from the first to the last that holds a record, and the count of records that fall in none (undated or before the Hijra). */
export function centuryHistogram(): { bins: CenturyBin[]; unplaced: number; placed: number } {
  const counts = new Map<number, Record<string, number>>();
  let unplaced = 0, placed = 0;
  for (const n of battleNodes) {
    const y = hijriYearOf(n);
    if (y === undefined) { unplaced++; continue; }
    placed++;
    const c = Math.ceil(y / 100);
    const row = counts.get(c) ?? Object.fromEntries(KIND_FAMILIES.map((f) => [f.id, 0]));
    row[familyOfKind.get(n.data.kind as MilitaryKind)!]++;
    counts.set(c, row);
  }
  const last = Math.max(...counts.keys());
  const bins: CenturyBin[] = [];
  for (let c = 1; c <= last; c++) {
    const byFamily = counts.get(c) ?? Object.fromEntries(KIND_FAMILIES.map((f) => [f.id, 0]));
    const startAH = (c - 1) * 100 + 1;
    bins.push({ century: c, startAH, startCE: hijriToCivil({ y: startAH, m: 1, d: 1 }).date.y, total: Object.values(byFamily).reduce((a, b) => a + b, 0), byFamily });
  }
  return { bins, unplaced, placed };
}

/** The Prophet's campaigns (ghazawat and saraya) in chronological order, each with its place's coordinates when it has them. */
export function propheticCampaignPoints() {
  return propheticNodes.map((n) => {
    const place = placeOf(n.id);
    const c = place?.coordinates;
    return { node: n, ghazwa: isGhazwa(n), place, at: c ? ([c[0], c[1]] as [number, number]) : undefined };
  });
}
