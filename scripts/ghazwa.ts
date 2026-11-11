// The one ghazwa/sariyya rule (docs/engineering/20-battles-browser-requirements.md §R6): a prophetic-era military
// record is a ghazwa when person/muhammad is among its commanders or participants — in its `sides` block or through a
// had_participant edge — and a sariyya otherwise. The battles pages (site/src/lib/battles.ts) and the API export
// (scripts/export-api.ts) both call this so index, ghazawat page and /api/v1/battles.json can never disagree.
import type { Node } from "./build-graph.js";

export const PROPHETIC_ERA = "period/prophetic-era";
export const MUHAMMAD = "person/muhammad";

/** `participantEdge` reports whether a had_participant edge to MUHAMMAD touches the record (checked by the caller,
 *  which owns the edge list). */
export function isGhazwaNode(n: Node, participantEdge: boolean): boolean {
  if (!n.periods.includes(PROPHETIC_ERA)) return false;
  if ((n.data.sides ?? []).some((s: any) => (s.commanders ?? []).includes(MUHAMMAD) || (s.participants ?? []).includes(MUHAMMAD))) return true;
  return participantEdge;
}
