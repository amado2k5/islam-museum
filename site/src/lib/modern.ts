// The Modern Islam Browser's shared reads (docs/plan/26-modern-islam-browser.md section 4): every record in the
// browser's window with its derived sections, years, countries and languages, all taken from the compiled graph at
// build time. A record never types its section (scripts/modern/sections.ts decides); every count on a browser page is
// computed here and appears on that page only. No shared layout carries a number (docs/site/README.md).
import { realNodes, byId, graph } from "./graph";
import { ui, NUM_LOCALE, type Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";
import {
  SECTION_IDS, sectionsOf, recordOfNode, yearsOf, primaryYear, taxonomy, WINDOW_START_YEAR, yearPageYears, yearPageFor, decadePageFor,
  type RecordLike,
} from "../../../scripts/modern/sections";
import { reachIndex, reachFormula, REACH_LISTS, type ReachItem } from "../../../scripts/modern/reach";
import { civilToHijri } from "../../../scripts/hijri/convert";

export interface ModernEntry {
  node: Node;
  record: RecordLike;
  sections: string[];
  /** The year the browser files the record under first (its main date, else its first fact in the window). */
  year?: number;
  /** Every year the record has a dated fact in, from the window start on. */
  years: number[];
  countries: string[];
  languages: string[];
  kind?: string;
}

export { SECTION_IDS, WINDOW_START_YEAR, taxonomy };
export const buildYear = new Date(graph.generated).getUTCFullYear();
export const buildDate = graph.generated.slice(0, 10);

const awardsById = new Map(realNodes.filter((n) => n.class === "award").map((n) => [n.id, recordOfNode(n)]));

const isCC = (v: unknown): v is string => typeof v === "string" && /^[a-z]{2}$/.test(v);
function countriesOf(d: Record<string, any>): string[] {
  const out = new Set<string>();
  for (const v of d.countries ?? []) if (isCC(v)) out.add(v);
  if (isCC(d.country)) out.add(d.country);
  for (const v of d.location?.serves ?? []) if (isCC(v)) out.add(v);
  for (const s of d.sports ?? []) if (isCC(s?.national_team)) out.add(s.national_team);
  return [...out].sort();
}
const isLang = (v: unknown): v is string => typeof v === "string" && /^[a-z]{2,3}(-[a-z]{2,8})?$/.test(v);
function languagesOf(d: Record<string, any>): string[] {
  const out = new Set<string>();
  const langs = d.languages;
  if (Array.isArray(langs)) for (const v of langs) if (isLang(v)) out.add(v);
  else if (langs && typeof langs === "object") for (const v of langs.original ?? []) if (isLang(v)) out.add(v);
  if (typeof d.language === "string" && d.language.startsWith("language/")) {
    const code = byId.get(d.language)?.data?.iso639_1 ?? byId.get(d.language)?.data?.code;
    if (isLang(code)) out.add(code);
  }
  return [...out].sort();
}

/** Every record of the window with its derived sections, in id order. */
export const modernEntries: ModernEntry[] = realNodes
  .map((node): ModernEntry | null => {
    const record = recordOfNode(node);
    const sections = sectionsOf(record, awardsById);
    if (!sections.length) return null;
    return {
      node, record, sections,
      year: primaryYear(record),
      years: yearsOf(record).filter((y) => y >= WINDOW_START_YEAR && y <= buildYear + 30),
      countries: countriesOf(node.data),
      languages: languagesOf(node.data),
      kind: node.class === "screen" ? node.data.format : node.data.kind,
    };
  })
  .filter((e): e is ModernEntry => e !== null);

const byYearDesc = (a: ModernEntry, b: ModernEntry) => (b.year ?? 0) - (a.year ?? 0) || a.node.id.localeCompare(b.node.id);
export const sortedByYear = (xs: ModernEntry[]) => [...xs].sort(byYearDesc);

export const entriesOf = (section: string): ModernEntry[] => sortedByYear(modernEntries.filter((e) => e.sections.includes(section)));
export const sectionCounts: Record<string, number> = Object.fromEntries(SECTION_IDS.map((s) => [s, modernEntries.filter((e) => e.sections.includes(s)).length]));

export const years: number[] = yearPageYears(buildYear);
/** The link to a year's page, or undefined when the build has no page for that year (render the year as text). */
export const yearHref = (lang: Lang, y: number | undefined): string | undefined => {
  const page = yearPageFor(y, buildYear);
  return page === undefined ? undefined : `/${lang}/modern/year/${page}/`;
};
/** The link for a decade chip: the first year of the decade that has a page, or undefined when none has. */
export const decadeHref = (lang: Lang, decade: number): string | undefined => {
  const page = decadePageFor(decade, buildYear);
  return page === undefined ? undefined : `/${lang}/modern/year/${page}/`;
};
export const yearEntries = (y: number): ModernEntry[] => sortedByYear(modernEntries.filter((e) => e.years.includes(y)));
export const yearCounts: Record<number, number> = Object.fromEntries(years.map((y) => [y, modernEntries.filter((e) => e.years.includes(y)).length]));
/** The Hijri years a Gregorian year spans, as "1396–1397" (from the Umm al-Qura conversion of 1 January and 31 December). */
export const hijriOfYear = (y: number): string => {
  const a = civilToHijri("gregorian", { y, m: 1, d: 1 }).date.y;
  const b = civilToHijri("gregorian", { y, m: 12, d: 31 }).date.y;
  return a === b ? String(a) : `${a}–${b}`;
};

const tally = (pick: (e: ModernEntry) => string[]): [string, number][] => {
  const m = new Map<string, number>();
  for (const e of modernEntries) for (const k of pick(e)) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};
export const countryCounts = tally((e) => e.countries);
export const languageCounts = tally((e) => e.languages);
export const countryEntries = (cc: string) => sortedByYear(modernEntries.filter((e) => e.countries.includes(cc)));
export const languageEntries = (code: string) => sortedByYear(modernEntries.filter((e) => e.languages.includes(code)));

const generatedMs = Date.parse(graph.generated);
/** Records added or changed in the 30 days before the build (git dates of their data files), newest first. */
export const newEntries: ModernEntry[] = modernEntries
  .filter((e) => generatedMs - Date.parse(e.node.updated) <= 30 * 86_400_000)
  .sort((a, b) => b.node.updated.localeCompare(a.node.updated) || a.node.id.localeCompare(b.node.id));

const horizonYear = (e: ModernEntry) => Number(String(e.node.data.horizon?.expected?.edtf ?? e.node.data.horizon?.announced?.edtf ?? "9999").slice(0, 4));
/** Records with a horizon block, soonest first. */
export const upcomingEntries: ModernEntry[] = modernEntries.filter((e) => e.node.data.horizon).sort((a, b) => horizonYear(a) - horizonYear(b) || a.node.id.localeCompare(b.node.id));

export const TOP_LISTS = Object.keys(REACH_LISTS);
const records = modernEntries.map((e) => e.record);
export const topOf = (list: string): ReachItem[] => reachIndex(list, records, awardsById);
export const formula = reachFormula();

export const sectionLabel = (id: string, lang: Lang): string => ui(lang).modernSections?.[id] ?? taxonomy.sections.find((s) => s.id === id)?.label[lang] ?? id;
export const sectionFacets = (id: string): string[] => taxonomy.sections.find((s) => s.id === id)?.facets ?? [];
export const kindLabel = (kind: string | undefined, lang: Lang): string => {
  if (!kind) return "";
  const T = ui(lang);
  return T.modern?.kinds?.[kind] ?? T.inventions?.kinds?.[kind] ?? kind.replace(/[-_]/g, " ");
};
const displayNames = (lang: Lang, type: "region" | "language") => {
  try { return new Intl.DisplayNames([lang === "ar" ? "ar" : lang === "ur" ? "ur" : "en"], { type }); } catch { return undefined; }
};
export const countryName = (cc: string, lang: Lang): string => { try { return displayNames(lang, "region")?.of(cc.toUpperCase()) ?? cc.toUpperCase(); } catch { return cc.toUpperCase(); } };
export const languageName = (code: string, lang: Lang): string => { try { return displayNames(lang, "language")?.of(code) ?? code; } catch { return code; } };

/** The figures section's fields (taxonomy): a person goes to the first field one of their roles belongs to. */
const FIELDS = taxonomy.sections.find((s) => s.id === "figures")?.fields ?? [];
export const FIELD_IDS = FIELDS.map((f) => f.id);
export const fieldOf = (e: ModernEntry): string => {
  const roles: string[] = e.node.data.roles ?? [];
  return FIELDS.find((f) => f.roles.some((r) => roles.includes(r)))?.id ?? "other";
};
export const fieldLabel = (id: string, lang: Lang): string => ui(lang).modernFields?.[id] ?? (id === "other" ? ui(lang).modern.field_other : id);

/** A year as digits without grouping ("2012", not "2,012"), in the language's numbering. */
export const yearText = (y: number, lang: Lang): string => new Intl.NumberFormat(NUM_LOCALE[lang], { useGrouping: false }).format(y);

export const decadeOf = (y: number | undefined): number | undefined => (y === undefined ? undefined : Math.floor(y / 10) * 10);
