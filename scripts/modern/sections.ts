// Modern Islam Browser (docs/plan/26-modern-islam-browser.md): the derived section of a record.
// A record never types its section. It belongs to the browser when one dated fact falls in the window
// (1 Muharram 1396 / 3 January 1976 onward) or it carries a `horizon` block; its section follows from
// class, kind and fields in the order docs/modern-islam/taxonomy.yaml lists the sections.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { dateRange, p } from "../lib.js";

/**
 * The taxonomy file, found by walking up from this module to the repository root. The site's production bundle places
 * this module under site/.astro/, where the scripts library's root would resolve wrongly; the dev server and the
 * scripts run it from its own folder. Either way the first ancestor holding docs/modern-islam/taxonomy.yaml is the root.
 */
function taxonomyPath(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, "docs", "modern-islam", "taxonomy.yaml");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return p("docs", "modern-islam", "taxonomy.yaml");
}

export const WINDOW_START_YEAR = 1976;

/** The years that get a page under /modern/year/: the window start to the build year, both included. */
export const yearPageYears = (buildYear: number): number[] =>
  Array.from({ length: Math.max(0, buildYear - WINDOW_START_YEAR + 1) }, (_, i) => WINDOW_START_YEAR + i);

/** The year page a year links to, or undefined when that year has none (before the window, or after the build year). */
export const yearPageFor = (y: number | undefined, buildYear: number): number | undefined =>
  y !== undefined && Number.isInteger(y) && y >= WINDOW_START_YEAR && y <= buildYear ? y : undefined;

/** The year page a decade chip links to: the first year of the decade that has a page, or undefined when none has. */
export const decadePageFor = (decade: number, buildYear: number): number | undefined => {
  const first = Math.max(decade, WINDOW_START_YEAR);
  return first <= decade + 9 ? yearPageFor(first, buildYear) : undefined;
};

export interface SectionDef {
  id: string;
  label: Record<string, string>;
  classes: string[];
  kinds: Record<string, string[]>;
  facets: string[];
  fields?: { id: string; label: Record<string, string>; roles: string[] }[];
}
export interface ModernTaxonomy {
  version: number;
  sections: SectionDef[];
  award_kinds: { id: string; label: Record<string, string> }[];
  honour_results: string[];
  certification_levels: string[];
  horizon_stages: string[];
  reach_platforms: string[];
  reach_metrics: string[];
  press_kinds: string[];
  music_genres: { id: string; label: Record<string, string> }[];
  sports: string[];
  firsts_tags: string[];
  reach_index: {
    version: number;
    lists: string[];
    weights: Record<string, any>;
    tie_break: string;
    notice: Record<string, string>;
  };
}

export const taxonomy: ModernTaxonomy = parse(readFileSync(taxonomyPath(), "utf8"));
export const SECTION_IDS: string[] = taxonomy.sections.map((s) => s.id);
const FIRSTS = new Set(taxonomy.firsts_tags);
const FILM_FORMATS = new Set(["film", "short", "tv_film", "documentary", "animation"]);

/** A raw record as the data files hold it (class and fields at the top level). */
export type RecordLike = Record<string, any> & { id?: string; class: string };

const DATE_FIELDS = [
  "born", "died", "floruit", "founded", "dissolved", "built", "composed", "launched", "closed", "released",
  "first_broadcast", "first_held", "since", "until", "made", "start", "end",
];

/**
 * The Gregorian year an EDTF date starts or ends in. The year is read from the string itself ("1976", "1976-05-12",
 * "1976/1980", and the one-to-three-digit years of early records such as "870"), because the edtf library's numeric
 * range is inclusive at the end and would turn 1976 into 1977 and misreads a three-digit year. Uncertain digits ("197X")
 * fall back to the numeric range.
 */
export function edtfYear(edtf: unknown, which: "start" | "end"): number | undefined {
  if (typeof edtf !== "string" || !edtf) return undefined;
  const parts = edtf.split("/");
  const part = which === "start" ? parts[0] : parts[parts.length - 1];
  const m = part.match(/^(-?\d{1,4})(?!\d)/);
  if (m) return Number(m[1]);
  try {
    const r = dateRange({ edtf });
    if (!r) return undefined;
    return which === "start" ? Math.round(r.earliest) : Math.floor(r.latest - 0.01);
  } catch { return undefined; }
}
const yearOf = (d: any): number | undefined => (d ? edtfYear(d.edtf, "end") : undefined);
const yearStart = (d: any): number | undefined => (d ? edtfYear(d.edtf, "start") : undefined);

/** Every Gregorian year a record has a dated fact in: its own dates, editions, honours, reach readings, press and horizon. */
export function yearsOf(entity: RecordLike): number[] {
  const years = new Set<number>();
  const add = (y: number | undefined) => { if (y !== undefined && Number.isFinite(y)) years.add(Math.floor(y)); };
  for (const f of DATE_FIELDS) add(yearOf(entity[f]));
  add(yearOf(entity.date?.start)); add(yearOf(entity.date?.end));
  for (const ed of entity.editions ?? []) if (typeof ed?.year === "number") add(ed.year);
  for (const h of entity.honours ?? []) { if (typeof h?.year === "number") add(h.year); add(yearOf(h?.date)); }
  for (const r of entity.reach ?? []) { const y = Number(String(r?.date ?? "").slice(0, 4)); if (y) add(y); }
  for (const pr of entity.footprint?.press ?? []) add(yearOf(pr?.date));
  add(yearOf(entity.horizon?.expected)); add(yearOf(entity.horizon?.announced));
  return [...years].sort((a, b) => a - b);
}

/** The latest dated fact of a record, as a Gregorian year. */
export function latestYear(entity: RecordLike): number | undefined {
  const years = yearsOf(entity);
  return years.length ? years[years.length - 1] : undefined;
}

/** The year the browser files a record under first: its own main date, else its first fact in the window. */
export function primaryYear(entity: RecordLike): number | undefined {
  const own = [
    entity.released, entity.first_broadcast, entity.launched, entity.composed, entity.founded, entity.built,
    entity.first_held, entity.since, entity.date?.start, entity.made, entity.start, entity.horizon?.expected,
  ].map(yearStart).find((y) => y !== undefined && y >= WINDOW_START_YEAR);
  if (own !== undefined) return Math.floor(own);
  return yearsOf(entity).find((y) => y >= WINDOW_START_YEAR);
}

/** In the browser's window: a horizon, a living person, or any dated fact from 1976 on. */
export function inWindow(entity: RecordLike): boolean {
  if (entity.horizon) return true;
  if (entity.class === "person" && (entity.wings ?? []).includes("living")) return true;
  const latest = latestYear(entity);
  return latest !== undefined && latest >= WINDOW_START_YEAR;
}

const kindOf = (entity: RecordLike): string | undefined => (entity.class === "screen" ? entity.format : entity.kind);

/**
 * The sections of a record, primary first. Persons go to `sports` when they carry `sports[]`, to `achievements`
 * when a firsts tag or a laureate award is sourced, and always to `figures`; any class joins `achievements` on a
 * firsts tag or a laureate honour; a `horizon` adds `upcoming`. Everything else follows the taxonomy's order.
 */
export function sectionsOf(entity: RecordLike, awardsById: ReadonlyMap<string, RecordLike> = new Map()): string[] {
  if (!inWindow(entity)) return [];
  const out: string[] = [];
  const add = (s: string) => { if (!out.includes(s)) out.push(s); };
  const cls = entity.class;
  const kind = kindOf(entity);
  const laureate = (entity.honours ?? []).some((h: any) => awardsById.get(h?.award)?.laureate === true);
  const firsts = (entity.tags ?? []).some((t: string) => FIRSTS.has(t));

  if (cls === "award") {
    add("awards");
  } else if (cls === "person") {
    if ((entity.sports ?? []).length) add("sports");
    if (firsts || laureate) add("achievements");
    add("figures");
  } else {
    for (const section of taxonomy.sections) {
      if (["upcoming", "figures", "achievements"].includes(section.id)) continue;
      if (!section.classes.includes(cls)) continue;
      // a section that names kinds matches a class only through its kinds; a section with none matches its classes outright
      const anyKinds = Object.keys(section.kinds ?? {}).length > 0;
      const kinds = section.kinds?.[cls];
      if (!anyKinds || (kinds !== undefined && kind !== undefined && kinds.includes(kind))) { add(section.id); break; }
    }
    if (cls === "screen" && !out.length) add(FILM_FORMATS.has(String(kind)) ? "film" : "tv");
    if (firsts || laureate) add("achievements");
  }
  if (entity.horizon) add("upcoming");
  return out;
}

/** The record shape of a compiled graph node (scripts/build-graph.ts), for the same functions. */
export function recordOfNode(node: { id: string; class: string; wings: string[]; tags: string[]; data: Record<string, any> }): RecordLike {
  return { id: node.id, class: node.class, wings: node.wings, tags: node.tags, ...node.data };
}

export const sectionLabel = (id: string, lang: string): string =>
  taxonomy.sections.find((s) => s.id === id)?.label[lang] ?? id;
