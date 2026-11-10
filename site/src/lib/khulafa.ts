// The Khulafa Browser's shared reads (docs/plan/30-khulafa-browser.md): caliphs are person
// records whose story_roles carry a reign (role: ruler or rival-claimant) toward a caliphate
// polity. Chains are ordered by reign start; reign events come from the computed reign_saw
// inverse of during_reign. Counts are read at build time on the browser's pages only.
import { realNodes, edgesFrom, byId } from "./graph";
import type { Node } from "../../../scripts/build-graph";

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

export const khulafaNodes: Node[] = realNodes
  .filter((n) => n.class === "person" && reignOf(n))
  .sort((a, b) => String(reignOf(a)!.start ?? "").localeCompare(String(reignOf(b)!.start ?? "")));

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
