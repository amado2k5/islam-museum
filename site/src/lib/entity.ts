import { readFileSync } from "node:fs";
import { repoPath } from "./paths";
import { parse } from "yaml";
import { byId, edgesFrom, href, labelOf, summaryOf, SITE } from "./graph";
import type { Node } from "../../../scripts/build-graph";
import type { Lang } from "./i18n";

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
  concept: "DefinedTerm", language: "Language", practice: "Event", exhibit: "CreativeWork", question: "Question", source: "CreativeWork", dataset: "Dataset",
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
    description: summaryOf(n, lang),
    inLanguage: lang,
    ...(sameAs.length ? { sameAs } : {}),
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    isPartOf: { "@type": "WebSite", name: "islam.museum", url: SITE },
  };
  if (n.class === "person") {
    ld.birthDate = iso(d.born); ld.deathDate = iso(d.died);
    const b = edgesFrom(n.id).find((e) => e.type === "born_in" && !e.inverse);
    const dd = edgesFrom(n.id).find((e) => e.type === "died_in" && !e.inverse);
    if (b) ld.birthPlace = { "@type": "Place", name: labelOf(byId.get(b.to)!, lang) };
    if (dd) ld.deathPlace = { "@type": "Place", name: labelOf(byId.get(dd.to)!, lang) };
    if (d.gender && d.gender !== "unknown") ld.gender = d.gender;
  }
  if (n.class === "event") { ld.startDate = iso(d.date?.start); ld.endDate = iso(d.date?.end); }
  if (n.class === "place" && n.coordinates) ld.geo = { "@type": "GeoCoordinates", latitude: n.coordinates[0], longitude: n.coordinates[1] };
  return JSON.parse(JSON.stringify(ld));
}
