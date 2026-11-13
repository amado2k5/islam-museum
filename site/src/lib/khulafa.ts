// The Khulafa Browser's shared reads (docs/plan/30-khulafa-browser.md): caliphs are person
// records whose story_roles carry a reign (role: ruler or rival-claimant) toward a caliphate
// polity. Chains are ordered by reign start; reign events come from the computed reign_saw
// inverse of during_reign. Counts are read at build time on the browser's pages only.
import { realNodes, edgesFrom, byId } from "./graph";
import type { Node } from "../../../scripts/build-graph";
import { civilToHijri } from "../../../scripts/hijri/convert";

/** Caliphates in display order; the three claim polities come last. */
export const CALIPHATES = [
  "polity/rashidun-caliphate",
  "polity/umayyad-caliphate",
  "polity/umayyads-of-cordoba",
  "polity/abbasid-caliphate",
  "polity/abbasid-caliphate-cairo",
  "polity/fatimid-caliphate",
  "polity/almohad-caliphate",
  "polity/ottoman-empire",
  "polity/sokoto-caliphate",
] as const;

export const CLAIM_POLITIES = [
  "polity/zubayrid-caliphate",
  "polity/hammudid-caliphate",
  "polity/sharifian-caliphate",
] as const;

const CALIPHATE_SET = new Set<string>([...CALIPHATES, ...CLAIM_POLITIES]);

export interface Reign { role: string; toward: string; start?: string; end?: string }

/** The reign story_role of a person record, or null when it rules no caliphate. */
export function reignOf(n: Node): Reign | null {
  const roles = (n.data.story_roles ?? []) as any[];
  const r = roles.find((x) => ["ruler", "rival-claimant"].includes(x.role) && CALIPHATE_SET.has(x.toward));
  if (!r) return null;
  return { role: r.role, toward: r.toward, start: r.start?.edtf, end: r.end?.edtf };
}

/** The year (and month) of an EDTF start or end ("0632", "661", "0661-08~"): a number, so unpadded years sort with padded ones. */
const edtfParts = (s?: string) => { const m = String(s ?? "").match(/^(-?\d{1,4})(?:-(\d{2}))?/); return m ? { y: Number(m[1]), m: m[2] ? Number(m[2]) : undefined } : null; };
const startYearOf = (n: Node) => edtfParts(reignOf(n)!.start)?.y ?? Infinity;

export const khulafaNodes: Node[] = realNodes
  .filter((n) => n.class === "person" && reignOf(n))
  .sort((a, b) => startYearOf(a) - startYearOf(b));

export const khulafaBySlug = new Map(khulafaNodes.map((n) => [n.slug, n]));

/** Caliphs of one polity in chain order (reign start). */
export function chainOf(polityId: string): Node[] {
  return khulafaNodes.filter((n) => reignOf(n)!.toward === polityId);
}

/** The polity nodes in display order that currently carry caliphs. */
export const politySections: { polity: Node; caliphs: Node[] }[] = CALIPHATES
  .map((id) => ({ polity: byId.get(id)!, caliphs: chainOf(id) }))
  .filter((s) => s.polity && s.caliphs.length > 0);

export const claimSections: { polity: Node; caliphs: Node[] }[] = CLAIM_POLITIES
  .map((id) => ({ polity: byId.get(id)!, caliphs: chainOf(id) }))
  .filter((s) => s.polity && s.caliphs.length > 0);

const caliphIds = new Set(khulafaNodes.map((n) => n.id));

/** predecessor/successor inside the same caliphate, from successor_of edges. */
export function neighboursOf(personId: string): { prev?: Node; next?: Node } {
  const out: { prev?: Node; next?: Node } = {};
  for (const e of edgesFrom(personId)) {
    const t = byId.get(e.to);
    if (!t || !caliphIds.has(t.id)) continue;
    if (e.type === "successor_of") out.prev = t;
    else if (e.type === "predecessor_of") out.next = t;
  }
  return out;
}

/** Events, buildings, works and inventions recorded during this caliph's reign (reign_saw inverses). */
export function reignEventsOf(personId: string): Node[] {
  const out: Node[] = [];
  for (const e of edgesFrom(personId)) {
    if (e.type !== "reign_saw") continue;
    const t = byId.get(e.to);
    if (t) out.push(t);
  }
  return out;
}

/** Places a reign touched (born/died/buried + capitals of the polity) for the map panel. */
export function realmPlacesOf(personId: string): Node[] {
  const out: Node[] = [];
  for (const e of edgesFrom(personId)) {
    if (!["born_in", "died_in", "occurred_at"].includes(e.type)) continue;
    const t = byId.get(e.to);
    if (t?.class === "place" && (t.data as any).lat != null) out.push(t);
  }
  return out;
}

// ---- The river of reigns (site/src/components/sig/KhulafaRiver.astro): every reign as a span on one Hijri axis.
/** A CE year (and month, when the record gives one) as a decimal Hijri year, by the museum's own converter. A year-only date is read at mid-year. */
export function ceToAH(y: number, m?: number): number {
  const cal = y < 1582 ? "julian" : "gregorian";
  const h = civilToHijri(cal, { y, m: m ?? 7, d: m ? 15 : 1 }).date;
  return h.y + (h.m - 1) / 12 + (h.d - 1) / 354;
}

export interface ReignSpan {
  node: Node; polity: string; claim: boolean;
  /** CE years as recorded; the end is the next caliph's accession when the record has none ("next"), or missing ("none"). */
  startCE: number; endCE: number | null; endBasis: "recorded" | "next" | "none";
  /** Decimal Hijri years, derived from the CE years. */
  s: number; e: number | null;
  lengthYears: number | null;
}
export interface ReignLane { polity: Node; claim: boolean; spans: ReignSpan[] }

/** One lane per caliphate (the lib's order, claims last) with its reigns on the Hijri axis. Throws when a chain member has no reign start. */
export function reignLanes(): ReignLane[] {
  const lanes: ReignLane[] = [];
  for (const [list, claim] of [[politySections, false], [claimSections, true]] as const) {
    for (const { polity, caliphs } of list) {
      const starts = caliphs.map((n) => {
        const p = edtfParts(reignOf(n)!.start);
        if (!p) throw new Error(`The river of reigns: ${n.id} has no reign start in the ${polity.id} chain`);
        return p;
      });
      const spans = caliphs.map((n, i): ReignSpan => {
        const r = reignOf(n)!;
        const endP = edtfParts(r.end);
        let endCE: number | null = endP ? endP.y : null;
        let endBasis: ReignSpan["endBasis"] = endP ? "recorded" : "none";
        let endM = endP?.m;
        if (!endP && starts[i + 1]) { endCE = starts[i + 1].y; endM = starts[i + 1].m; endBasis = "next"; }
        const s = ceToAH(starts[i].y, starts[i].m);
        const e = endCE != null ? Math.max(s, ceToAH(endCE, endM)) : null;
        return { node: n, polity: polity.id, claim, startCE: starts[i].y, endCE, endBasis, s, e, lengthYears: endCE != null ? Math.max(0, endCE - starts[i].y) : null };
      });
      lanes.push({ polity, claim, spans });
    }
  }
  return lanes;
}
