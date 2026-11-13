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
  /** How many names the source list of the Ten carries; a page or feed that shows another number is wrong. */
  tenListed: number;
  circles: Map<string, string[]>;
  clans: Map<string, string[]>;
  events: Map<string, { id: string; role?: string }[]>;
  decades: Map<string, string[]>;
  women: string[];
  death: Map<string, { year: number; derived: boolean }>;
}

/**
 * A membership list kept in a record's own prose: the first section that is nothing but a bullet list of person
 * links (`- [[person/slug|label]]`). Returns the ids as written, in order, or null when the record has no such list.
 * The Arabic prose is read first: it is the canonical text and its translations carry the same list.
 */
export function proseNameList(n: Node | undefined): string[] | null {
  const doc = n?.prose?.ar ?? Object.values(n?.prose ?? {})[0];
  for (const s of doc?.sections ?? []) {
    const lines = s.markdown.split("\n").map((l) => l.trim()).filter(Boolean);
    const ids = lines.map((l) => l.match(/^[-*]\s+\[\[(person\/[a-z0-9-]+)(?:\|[^\]]*)?\]\]\.?$/)?.[1]);
    if (lines.length >= 2 && ids.every(Boolean)) return ids as string[];
  }
  return null;
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
  // The Ten are the names the concept record itself lists, each cited there (audit of 13 November 2026: a hand-kept
  // trail listed nine and the section showed nine). An id written under an alias resolves to its record. A name that
  // resolves to no person record fails the build here, and the page and the feed compare `ten` with `tenListed`.
  // A graph without the concept's list (a fixture, an early build) falls back to the trail's Companions.
  const listed = proseNameList(byId.get(TEN_CONCEPT));
  let ten: string[];
  if (listed) {
    const aliasOf = new Map<string, string>();
    for (const n of nodes) for (const a of n.aliases ?? []) aliasOf.set(a, n.id);
    ten = [...new Set(listed.map((id) => {
      // an alias wins over a node of the same id: a retired id may still stand in the graph as a stub
      const t = byId.get(aliasOf.get(id) ?? id);
      if (!t || t.stub || t.class !== "person") throw new Error(`${TEN_CONCEPT} lists ${id}, which is not a person record: the Ten cannot be derived`);
      return t.id;
    }))];
  } else {
    const trail = byId.get(TEN_TRAIL);
    ten = [...new Set<string>((trail?.data?.rooms ?? []).flatMap((r: any) => r?.features ?? []))].filter((id) => isSet.has(id));
  }
  return {
    ids: companions.map((n) => n.id), ten, tenListed: listed ? listed.length : ten.length, circles, clans, events, decades, death,
    women: companions.filter((n) => n.data?.gender === "female").map((n) => n.id),
  };
}
