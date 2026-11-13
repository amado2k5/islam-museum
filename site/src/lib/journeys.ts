// The journey records, for the Journeys landing and for the onward links on a journey's own page (audit S29).
import { realNodes, labelOf } from "./graph";
import type { Node } from "../../../scripts/build-graph";
import type { Lang } from "./i18n";

/** Kinds in the order the landing lists them: the travels and pilgrim roads a visitor expects first, campaigns last. */
export const JOURNEY_KINDS = ["migration", "travel", "pilgrimage_route", "trade_route", "diffusion", "military_campaign"] as const;
export const journeys: Node[] = realNodes.filter((n) => n.class === "journey").sort((a, b) => a.id.localeCompare(b.id));
/** A journey's stations in order, as place ids, without repeats in a row. */
export const routeOf = (n: Node): string[] => {
  const out: string[] = [];
  for (const w of (n.data.waypoints ?? []) as { place?: string }[]) if (w.place && out[out.length - 1] !== w.place) out.push(w.place);
  return out;
};
/** Up to `k` other journeys of the same kind, for a journey page's onward links: those sharing a station first. */
export function siblingJourneys(n: Node, k = 6): Node[] {
  const mine = new Set(routeOf(n));
  const same = journeys.filter((m) => m.id !== n.id && (m.data.kind ?? "travel") === (n.data.kind ?? "travel"));
  const shared = (m: Node) => routeOf(m).filter((p) => mine.has(p)).length;
  return same.sort((a, b) => shared(b) - shared(a) || a.id.localeCompare(b.id)).slice(0, k);
}
export const journeyLabel = (n: Node, lang: Lang) => labelOf(n, lang);
