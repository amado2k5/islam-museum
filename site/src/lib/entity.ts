import { readFileSync } from "node:fs";
import { repoPath } from "./paths";
import { parse } from "yaml";
import { byId, edgesFrom, href, labelOf, summaryOf, SITE } from "./graph";
import type { Node } from "../../../scripts/build-graph";
import { fmt, type Lang, ui } from "./i18n";
import { a11yLd } from "./a11y";

const predicates: Record<string, any> = parse(readFileSync(repoPath("schema", "predicates.yaml"), "utf8"));
const idPatterns: Record<string, { url: string }> = parse(readFileSync(repoPath("schema", "external-id-patterns.yaml"), "utf8"));
const traditions: any[] = parse(readFileSync(repoPath("schema", "enums", "traditions.yaml"), "utf8"));
const regions: any[] = parse(readFileSync(repoPath("schema", "enums", "regions.yaml"), "utf8"));

export const traditionLabel = (id: string, lang: Lang) => traditions.find((t) => t.id === id)?.label[lang] ?? id;
export const regionLabel = (id: string, lang: Lang) => regions.find((r) => r.id === id)?.label[lang] ?? id;
export const externalUrl = (key: string, id: string) => idPatterns[key]?.url.replace("{id}", id);

/** Section role by heading (so the depth dial works in every language). */
const KIDS = ["For young visitors", "للزوار الصغار"];
const SCHOLARS = ["Notes for scholars", "ملاحظات للباحثين"];
const BRIEF = ["Brief", "نبذة"];
export const sectionRole = (h: string): "brief" | "main" | "kids" | "scholars" =>
  BRIEF.includes(h) ? "brief" : KIDS.includes(h) ? "kids" : SCHOLARS.includes(h) ? "scholars" : "main";

// Leveled reading (edu/levels.yaml, docs/delegation/education-master-plan.md §5 E2): the fixed headings per language
// that mark a Sprouts, Explorers or Scholars section inside the prose file; the validator enforces the same file.
export interface Level { id: string; band: string; child: boolean; max_words: number; heading: Record<string, string> }
export const levels: Level[] = parse(readFileSync(repoPath("edu", "levels.yaml"), "utf8")).levels;
if (levels.length !== 3) throw new Error(`edu/levels.yaml: expected 3 levels, found ${levels.length}`);
export const levelOf = (heading: string, lang: string): Level | null => levels.find((l) => l.heading[lang] === heading) ?? null;
/** Child-level markdown for the kids' chrome: links become plain labels (bridge cards are the only doors out), citations go. */
export function plainChildMarkdown(md: string, lang: Lang): string {
  return md
    .replace(/\[\[([a-z]+\/[a-z0-9-]+)\|([^\]]*)\]\]/g, "$2")
    .replace(/\[\[([a-z]+\/[a-z0-9-]+)\]\]/g, (_m, id: string) => { const n = byId.get(id); return n ? labelOf(n, lang) : id.split("/")[1]; })
    .replace(/\{cite:[^}]*\}/g, "");
}

export interface Group { type: string; label: string; items: { node: Node; edge: any }[] }

/** Connections grouped by predicate, labelled from the registry (inverse label for computed edges). */
export function connectionsOf(id: string, lang: Lang): Group[] {
  const groups = new Map<string, Group>();
  for (const e of edgesFrom(id)) {
    const base = predicates[e.type] ?? Object.values(predicates).find((p: any) => p.inverse === e.type);
    const forward = predicates[e.type];
    const label = forward ? forward.label[lang] ?? forward.label.en : base?.inverse_label[lang] ?? base?.inverse_label.en ?? e.type;
    const n = byId.get(e.to);
    if (!n) continue;
    const g = groups.get(e.type) ?? { type: e.type, label, items: [] };
    g.items.push({ node: n, edge: e });
    groups.set(e.type, g);
  }
  return [...groups.values()];
}

/** Places linked to an entity, in life order, for the chips and the mini map. */
export function placesOf(id: string) {
  const order = ["born_in", "lived_in", "traveled_to", "located_in", "occurred_at", "site_of", "died_in", "buried_in"];
  return edgesFrom(id)
    .filter((e) => order.includes(e.type) && byId.get(e.to)?.class === "place")
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
    .map((e) => byId.get(e.to)!)
    .filter((n, i, arr) => arr.findIndex((m) => m.id === n.id) === i);
}

const SCHEMA_TYPE: Record<string, string> = {
  person: "Person", group: "Organization", polity: "Organization", event: "Event", period: "Event", journey: "Event",
  place: "Place", building: "Place", object: "VisualArtwork", media: "MediaObject", work: "CreativeWork", passage: "CreativeWork",
  concept: "DefinedTerm", language: "Language", practice: "Event", exhibit: "CreativeWork", question: "Question", source: "CreativeWork", dataset: "Dataset", listing: "Organization", screen: "CreativeWork",
};

const iso = (d: any): string | undefined => {
  const e: string | undefined = d?.edtf;
  return e && /^-?\d{4}(-\d{2}(-\d{2})?)?$/.test(e) ? e : undefined;
};

export function jsonLd(n: Node, lang: Lang, path: string) {
  const d = n.data;
  const sameAs = Object.entries<string>(d.external_ids ?? {}).map(([k, v]) => externalUrl(k, v)).filter(Boolean);
  const ld: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[n.class] ?? "Thing",
    "@id": `${SITE}${path}`,
    url: `${SITE}${path}`,
    name: labelOf(n, lang),
    alternateName: Object.entries(n.label).filter(([l]) => l !== lang).map(([, v]) => v),
    description: summaryOf(n, lang) || (n.stub ? fmt(ui(lang).entity.stub_desc, { label: labelOf(n, lang) }) : ""),
    inLanguage: lang,
    ...(sameAs.length ? { sameAs } : {}),
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    isPartOf: { "@type": "WebSite", name: "islam.museum", url: SITE },
    ...a11yLd(lang),
  };
  if (n.class === "person") {
    ld.birthDate = iso(d.born); ld.deathDate = iso(d.died);
    const b = edgesFrom(n.id).find((e) => e.type === "born_in" && !e.inverse);
    const dd = edgesFrom(n.id).find((e) => e.type === "died_in" && !e.inverse);
    if (b) ld.birthPlace = { "@type": "Place", name: labelOf(byId.get(b.to)!, lang) };
    if (dd) ld.deathPlace = { "@type": "Place", name: labelOf(byId.get(dd.to)!, lang) };
    if (d.gender && d.gender !== "unknown") ld.gender = d.gender;
  }
  if (n.class === "screen") {
    ld["@type"] = ["series", "miniseries", "documentary_series", "web_series"].includes(d.format) ? "TVSeries" : d.format === "episode" ? "TVEpisode" : "Movie";
    ld.dateCreated = iso(d.released);
    ld.countryOfOrigin = (d.countries ?? []).map((c: string) => c.toUpperCase());
    ld.name = labelOf(n, lang);
    ld.alternateName = (d.titles ?? []).map((t: any) => t.value);
  }
  if (n.class === "event") { ld.startDate = iso(d.date?.start); ld.endDate = iso(d.date?.end); }
  if (n.class === "place" && n.coordinates) ld.geo = { "@type": "GeoCoordinates", latitude: n.coordinates[0], longitude: n.coordinates[1] };
  return JSON.parse(JSON.stringify(ld));
}

// ---- themes (docs/plan/14) ----
export interface Theme { id: string; family: string; label: { en: string; ar: string } }
export interface ThemeFamily { id: string; label: { en: string; ar: string } }
export const themes: Theme[] = parse(readFileSync(repoPath("schema", "enums", "themes.yaml"), "utf8"));
export const themeFamilies: ThemeFamily[] = parse(readFileSync(repoPath("schema", "enums", "theme-families.yaml"), "utf8"));
export const themeById = new Map(themes.map((t) => [t.id, t]));
export const themeLabel = (id: string, lang: Lang) => themeById.get(id)?.label[lang] ?? id;

/** Screen titles about / set in an entity (edges computed as subject_of / setting_of). */
export function onScreen(id: string): { node: Node; how: "about" | "set_in" }[] {
  return edgesFrom(id)
    .filter((e) => (e.type === "subject_of" || e.type === "setting_of") && byId.get(e.to)?.class === "screen")
    .map((e) => ({ node: byId.get(e.to)!, how: e.type === "subject_of" ? ("about" as const) : ("set_in" as const) }));
}
