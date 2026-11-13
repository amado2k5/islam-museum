// The Inventions Browser's shared reads (docs/inventions/README.md): the invention records, their domains and their
// makers, all taken from the compiled graph at build time.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { realNodes } from "./graph";
import { repoPath } from "./paths";
import { ui, type Lang } from "./i18n";
import { hijriParts } from "./dates";
import { civilToHijri } from "../../../scripts/hijri/convert";
import type { Node } from "../../../scripts/build-graph";

/** The domains, in the order of schema/enums/invention-domains.yaml. */
export const INVENTION_DOMAINS: string[] = parse(readFileSync(repoPath("schema", "enums", "invention-domains.yaml"), "utf8"));
export const inventionDomainLabel = (id: string, lang: Lang): string => ui(lang).inventionDomains?.[id] ?? id;

export const inventionNodes: Node[] = realNodes.filter((n) => n.class === "invention");
export const hasInventionArticle = (n: Node): boolean => Object.keys(n.prose ?? {}).length > 0;
export const makerIds = (n: Node): string[] => [...new Set<string>((n.data.makers ?? []).map((m: any) => m.person).filter(Boolean))];
export const inventionMakers: string[] = [...new Set(inventionNodes.flatMap(makerIds))];

// ---- the dates of the workshop timeline (site/src/components/sig/InventionsWorkshop.astro) -------------------------------
/** Today's status of an invention (`era.status_today`), in the order the legend lists them. */
export const INVENTION_STATUS_TODAY = ["living", "transformed", "replaced", "extinct"] as const;

export interface InventionWhen {
  /** The point the mark is drawn at, in Hijri years (a decimal: the month is a fraction). */
  at: number;
  /** The span the record admits, in Hijri years; equal to `at` when the record gives a year. */
  from: number;
  to: number;
  /** The CE bounds as stored (centuries such as "09XX" become 900 to 999). */
  ceFrom: number | null;
  ceTo: number | null;
  /** The record gives only a latest bound ("../0929"): the mark sits at that bound. */
  open: boolean;
  /** The Hijri date is stored in the record (otherwise it is converted from the CE date and flagged derived). */
  hijriStored: boolean;
  approx: boolean;
}
const bound = (s: string): [number, number] | null => {
  if (s === "..") return null;
  const m = s.match(/^(-?\d{1,4})(X{0,3})(?:-\d{2}(?:-\d{2})?)?$/);
  if (!m) return null;
  const x = m[2].length, y = Number(m[1] + "0".repeat(x));
  return [y, y + Math.pow(10, x) - 1];
};
const toHijri = (y: number, cal: "julian" | "gregorian"): number => {
  const h = civilToHijri(cal, { y, m: 6, d: 15 }).date;
  return h.y + (h.m - 1) / 12;
};
/** Where an invention's first attestation falls, from its `era.first_attested`; null when the date cannot be read. */
export function inventionWhen(n: Node): InventionWhen | null {
  const fa = n.data.era?.first_attested;
  const edtf = String(fa?.edtf ?? "");
  if (!edtf) return null;
  const approx = /[~?%]/.test(edtf);
  const parts = edtf.replace(/[~?%]/g, "").split("/");
  const a = bound(parts[0]);
  const b = parts.length > 1 ? bound(parts[1]) : a;
  if (parts.length > 2 || (!a && !b)) return null;
  const open = !a;
  const ceFrom = a ? a[0] : null, ceTo = b ? b[1] : null;
  const cal: "julian" | "gregorian" = fa.calendar === "gregorian" ? "gregorian" : "julian";
  const stored = hijriParts(fa.hijri);
  const hTo = toHijri(ceTo!, cal);
  const hFrom = ceFrom === null ? hTo : toHijri(ceFrom, cal);
  const at = stored ? stored[0] + (stored[1] - 1) / 12 : open ? hTo : (hFrom + hTo) / 2;
  return { at, from: open ? at : Math.min(hFrom, at), to: open ? at : Math.max(hTo, at), ceFrom, ceTo, open, hijriStored: !!stored, approx };
}

/** Pairs [earlier, later] of invention ids where an entry's `precursors` or `dependents` names another invention record. */
export const inventionLinks: [string, string][] = (() => {
  const ids = new Set(inventionNodes.map((n) => n.id));
  const out = new Map<string, [string, string]>();
  for (const n of inventionNodes) {
    for (const p of n.data.precursors ?? []) if (p.invention && ids.has(p.invention) && p.invention !== n.id) out.set(`${p.invention}>${n.id}`, [p.invention, n.id]);
    for (const d of n.data.dependents ?? []) if (d.invention && ids.has(d.invention) && d.invention !== n.id) out.set(`${n.id}>${d.invention}`, [n.id, d.invention]);
  }
  return [...out.values()];
})();
