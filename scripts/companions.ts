// The Companions Browser (docs/plan/29-companions-browser.md): who is a Companion and how the browser groups them, read from
// the compiled graph. Shared by the site pages (site/src/lib/companions.ts) and the API export (scripts/export-api.ts), so
// the pages and /api/v1/companions.json always agree. Nothing here is typed in: every group comes from records and edges.
import type { Edge, Node } from "./build-graph";
import { civilToHijri } from "./hijri/convert";

/** The membership roll opened 5 November 2026 on al-Isaba's definition. */
export const ROLL = "group/sahaba";
/** The circles shown first, in this order. */
export const CIRCLES = ["group/muhajirun", "group/ansar", "group/ahl-al-bayt", "group/mothers-of-the-believers"] as const;
/** The trail whose rooms feature the Ten promised Paradise, and the concept record that explains them. */
export const TEN_TRAIL = "exhibit/path-ashara";
export const TEN_CONCEPT = "concept/ashara-mubashshara";

/** A non-stub person with the companion role, a companion story role, or a place on the roll. */
export function isCompanion(n: Pick<Node, "class" | "stub" | "data">, edges: Pick<Edge, "type" | "to">[] = []): boolean {
  if (n.class !== "person" || n.stub) return false;
  const d = n.data ?? {};
  if ((d.roles ?? []).includes("companion")) return true;
  if ((d.story_roles ?? []).some((r: any) => r?.role === "companion")) return true;
  if ((d.relations ?? []).some((r: any) => r?.type === "member_of" && r?.target === ROLL)) return true;
  return edges.some((e) => e.type === "member_of" && e.to === ROLL);
}

const EDTF_YEAR = /^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?/;

/** The Hijri year of death: the stored `died.hijri`, else converted from `died.edtf` (derived). Years before the Hijra are 0 or less. */
export function deathAH(data: any): { year: number; derived: boolean } | undefined {
  const died = data?.died;
  if (!died) return undefined;
  const h = typeof died.hijri === "string" ? died.hijri.match(EDTF_YEAR) : null;
  if (h) return { year: Number(h[1]), derived: false };
  const g = typeof died.edtf === "string" && !/X/.test(died.edtf) ? died.edtf.match(EDTF_YEAR) : null;
  if (!g) return undefined;
  const y = Number(g[1]);
  const calendar = died.calendar === "gregorian" || (died.calendar !== "julian" && y >= 1583) ? "gregorian" : "julian";
  const r = civilToHijri(calendar, { y, m: g[2] ? Number(g[2]) : 6, d: g[3] ? Number(g[3]) : 15 });
  return { year: r.date.y, derived: true };
}

/** The decade key of a Hijri year: "bh" before the Hijra, else the first year of its decade ("1" for 1–10, "11" for 11–20). */
export const decadeKey = (year: number): string => (year < 1 ? "bh" : String(Math.floor((year - 1) / 10) * 10 + 1));
/** Sort order of decade keys: before the Hijra first. */
export const decadeOrder = (key: string): number => (key === "bh" ? -1 : Number(key));

export interface CompanionIndex {
  ids: string[];
  ten: string[];
  circles: Map<string, string[]>;
  clans: Map<string, string[]>;
  events: Map<string, { id: string; role?: string }[]>;
  decades: Map<string, string[]>;
  women: string[];
  death: Map<string, { year: number; derived: boolean }>;
}

/** Group the Companions of a compiled graph. Lists keep the order of `nodes`; callers sort for display. */
export function companionIndex(nodes: Node[], edges: Edge[]): CompanionIndex {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out = new Map<string, Edge[]>();
  for (const e of edges) if (!e.inverse) { const l = out.get(e.from) ?? []; l.push(e); out.set(e.from, l); }
  const companions = nodes.filter((n) => isCompanion(n, out.get(n.id) ?? []));
  const isSet = new Set(companions.map((n) => n.id));
  const push = <T>(m: Map<string, T[]>, k: string, v: T) => { const l = m.get(k) ?? []; l.push(v); m.set(k, l); };
  const circles = new Map<string, string[]>(CIRCLES.map((c) => [c, []]));
  const clans = new Map<string, string[]>();
  const events = new Map<string, { id: string; role?: string }[]>();
  const decades = new Map<string, string[]>();
  const death = new Map<string, { year: number; derived: boolean }>();
  for (const n of companions) {
    const seenGroup = new Set<string>();
    const seenEvent = new Set<string>();
    for (const e of out.get(n.id) ?? []) {
      const target = byId.get(e.to);
      if (!target || target.stub) continue;
      if (e.type === "member_of" && target.class === "group" && e.to !== ROLL && !seenGroup.has(e.to)) {
        seenGroup.add(e.to);
        if (circles.has(e.to)) circles.get(e.to)!.push(n.id);
        else push(clans, e.to, n.id);
      } else if (e.type === "participated_in" && target.class === "event" && !seenEvent.has(e.to)) {
        seenEvent.add(e.to);
        push(events, e.to, e.role ? { id: n.id, role: e.role } : { id: n.id });
      }
    }
    const d = deathAH(n.data);
    if (d) { death.set(n.id, d); push(decades, decadeKey(d.year), n.id); }
  }
  const trail = byId.get(TEN_TRAIL);
  const ten = [...new Set<string>((trail?.data?.rooms ?? []).flatMap((r: any) => r?.features ?? []))].filter((id) => isSet.has(id));
  return {
    ids: companions.map((n) => n.id), ten, circles, clans, events, decades, death,
    women: companions.filter((n) => n.data?.gender === "female").map((n) => n.id),
  };
}
