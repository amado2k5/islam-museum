// Generates schema/<class>.schema.json and schema/_base.schema.json from the YAML enums.
// Run: npm run schema   (the enums in schema/enums/*.yaml are the source of truth)
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";

const root = new URL("../schema/", import.meta.url);
const enumFile = (n: string) => parse(readFileSync(new URL(`enums/${n}.yaml`, root), "utf8"));
const ids = (n: string): string[] => enumFile(n).map((x: any) => (typeof x === "string" ? x : x.id));

const kinds: Record<string, string[]> = enumFile("kinds");
const regions = ids("regions");
const wings = ids("wings");
const traditions = ids("traditions");
const claimStatus = ids("claim-status");
const sensitivity = ids("sensitivity");
const review = ids("review");
const licenses = ids("licenses");
const listingCategories = ids("listing-categories");

export const CLASSES = [
  "person", "group", "polity", "event", "period", "journey", "place", "building", "object",
  "media", "work", "passage", "concept", "language", "practice", "exhibit", "question", "source", "dataset", "listing",
] as const;

const ref = (name: string) => ({ $ref: `_base.schema.json#/$defs/${name}` });
const entityRef = { type: "string", pattern: "^[a-z]+/[a-z0-9][a-z0-9-]*$" };
const entityRefs = { type: "array", items: entityRef };
const str = { type: "string" };
const strs = { type: "array", items: str };
const intStr = { type: "integer" };
const enm = (v: string[]) => ({ enum: v });
const madeBlock = {
  type: "object", additionalProperties: false, required: ["by_muslims", "basis"],
  properties: { by_muslims: { type: "boolean" }, basis: enm(["self-identified", "documented", "unverified"]), sources: strs },
};

const base = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "_base.schema.json",
  title: "Museum entity base",
  type: "object",
  $defs: {
    localized: {
      type: "object",
      propertyNames: { pattern: "^[a-z]{2,3}(-[A-Za-z]{2,4})?$" },
      additionalProperties: { type: "string", minLength: 1 },
    },
    entityRef,
    date: {
      type: "object",
      additionalProperties: false,
      properties: {
        edtf: str, hijri: str,
        calendar: enm(["julian", "gregorian"]),
        precision: enm(["day", "month", "year", "decade", "century"]),
        status: enm(claimStatus),
        derived: { type: "boolean" },
        note: str,
        sources: strs,
      },
      anyOf: [{ required: ["edtf"] }, { required: ["hijri"] }],
    },
    dateRange: {
      type: "object",
      additionalProperties: false,
      properties: { start: ref("date"), end: ref("date") },
    },
    relation: {
      type: "object",
      additionalProperties: false,
      required: ["type", "target"],
      properties: {
        type: str, target: str, start: ref("date"), end: ref("date"), role: str, note: str,
        sources: strs, confidence: enm(["high", "medium", "low"]), perspective: enm(traditions),
      },
    },
    perspective: {
      type: "object",
      additionalProperties: false,
      required: ["tradition", "summary"],
      properties: { tradition: enm(traditions), summary: ref("localized"), sources: strs },
    },
    name: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "value"],
      properties: {
        kind: enm(["full", "given", "kunya", "nasab", "nisba", "laqab", "regnal", "pen", "latinized", "alternate"]),
        lang: str, value: str,
      },
    },
    coordinates: {
      type: "array", minItems: 2, maxItems: 2, items: { type: "number" },
    },
  },
  properties: {
    id: { type: "string", pattern: "^[a-z]+/[a-z0-9][a-z0-9-]*$" },
    class: enm([...CLASSES]),
    aliases: { type: "array", items: entityRef },
    label: ref("localized"),
    summary: ref("localized"),
    wings: { type: "array", items: enm(wings), uniqueItems: true },
    tags: strs,
    periods: entityRefs,
    regions: { type: "array", items: enm(regions), uniqueItems: true },
    external_ids: { type: "object", additionalProperties: { type: "string" } },
    relations: { type: "array", items: ref("relation") },
    perspectives: { type: "array", items: ref("perspective") },
    sources: entityRefs,
    media: {
      type: "object", additionalProperties: false,
      properties: { hero: entityRef, gallery: entityRefs },
    },
    status: {
      type: "object", additionalProperties: false, required: ["review"],
      properties: {
        review: enm(review), completeness: { type: "integer", minimum: 0, maximum: 5 },
        last_reviewed: { type: "string", format: "date" }, reviewers: strs,
        generated_by: str,
      },
    },
    sensitivity: enm(sensitivity),
  },
  required: ["id", "class", "label", "summary", "status"],
};

const kind = (c: string) => ({ kind: enm(kinds[c]) });
const D = ref("date");
const L = ref("localized");

const classProps: Record<string, { properties: any; required?: string[] }> = {
  person: {
    properties: {
      names: { type: "array", items: ref("name") }, gender: enm(["male", "female", "unknown"]),
      born: D, died: D, floruit: D, roles: strs, traditions: { type: "array", items: enm(traditions) },
      disciplines: entityRefs, languages: entityRefs,
    },
  },
  group: {
    properties: { ...kind("group"), made: madeBlock, founded: D, dissolved: D, founder: entityRef, headquarters: entityRef,
      members_estimate: intStr, active_regions: { type: "array", items: enm(regions) } },
    required: ["kind"],
  },
  polity: {
    properties: { ...kind("polity"), start: D, end: D,
      capitals: { type: "array", items: { type: "object", required: ["place"], properties: { place: entityRef, start: D, end: D } } },
      extent: { type: "array", items: { type: "object", required: ["geojson", "precision"],
        properties: { at: D, geojson: str, precision: enm(["schematic", "approximate", "documented"]), source: str } } },
      predecessor: entityRef, successor: entityRef, official_languages: entityRefs, religious_policy: L },
    required: ["kind"],
  },
  event: {
    properties: { ...kind("event"), date: ref("dateRange"), places: entityRefs,
      participants: { type: "array", items: { type: "object", required: ["target"], properties: { target: entityRef, role: str } } },
      outcome: L, part_of: entityRef, casualties: str, significance: L },
    required: ["kind"],
  },
  period: {
    properties: { ...kind("period"), start: D, end: D, parent_period: entityRef, defining_events: entityRefs },
    required: ["start"],
  },
  journey: {
    properties: { ...kind("journey"), travelers: entityRefs, distance_km: { type: "number" }, geometry: str,
      legs: { type: "array", items: { type: "object", required: ["from", "to"],
        properties: { from: entityRef, to: entityRef, start: D, end: D, mode: str, events: entityRefs, note: str } } } },
    required: ["kind"],
  },
  place: {
    properties: { ...kind("place"), coordinates: ref("coordinates"), geometry: str,
      historical_names: { type: "array", items: { type: "object", required: ["name"],
        properties: { name: str, lang: str, from: D, until: D } } },
      modern_country: entityRef, part_of: entityRef, founded: D },
    required: ["kind"],
  },
  building: {
    properties: { ...kind("building"), style: str, built: D, patron: entityRef, architect: entityRef, location: entityRef,
      coordinates: ref("coordinates"),
      status_now: enm(["standing", "ruined", "destroyed", "rebuilt", "converted"]),
      unesco_id: str, archnet_id: str, materials: strs, dimensions: str },
    required: ["kind"],
  },
  object: {
    properties: { ...kind("object"), made: D, made_in: entityRef, maker: entityRef, materials: strs, dimensions: str,
      inscriptions: { type: "array", items: { type: "object", properties: { text: str, lang: str, translation: L } } },
      holding_institution: str, accession_number: str, iiif_manifest: { type: "string", format: "uri" },
      provenance: strs },
    required: ["kind"],
  },
  media: {
    properties: { ...kind("media"), url: { type: "string", format: "uri" }, iiif_image: { type: "string", format: "uri" },
      thumbnail: str, license: enm(licenses), attribution: str, creator: str, depicts: entityRefs, alt: L },
    required: ["kind", "license", "attribution", "alt"],
  },
  work: {
    properties: { ...kind("work"), made: madeBlock, genre: strs, disciplines: strs, authors: entityRefs, language: entityRef, composed: D,
      structure: str, editions: strs, translations: strs, openiti_uri: str, commentaries: entityRefs, manuscripts: entityRefs },
    required: ["kind"],
  },
  passage: {
    properties: { work: entityRef, ref: str, text: str,
      translations: { type: "object", additionalProperties: { type: "object", required: ["text"],
        properties: { text: str, translator: str, license: enm(licenses) } } },
      audio: entityRefs, context: L },
    required: ["work", "ref"],
  },
  concept: {
    properties: { ...kind("concept"), term: { type: "object", additionalProperties: str },
      definitions: { type: "array", items: { type: "object", required: ["text"], properties: { tradition: enm(traditions), text: L, sources: strs } } },
      parent_concept: entityRef, etymology: L },
    required: ["kind"],
  },
  language: {
    properties: { ...kind("language"), scripts: strs, speakers_estimate: intStr, literary_tradition_from: D, iso639: str,
      sample_media: entityRefs },
    required: ["kind"],
  },
  practice: {
    properties: { ...kind("practice"), when: L, who: L,
      where_variations: { type: "array", items: { type: "object", required: ["region", "description"], properties: { region: enm(regions), description: L } } },
      obligation: enm(["obligatory", "recommended", "cultural"]), scriptural_basis: entityRefs },
    required: ["kind"],
  },
  exhibit: {
    properties: { ...kind("exhibit"), audience: strs, duration_minutes: intStr, curator: str, opened: { type: "string", format: "date" },
      prerequisites: entityRefs,
      rooms: { type: "array", items: { type: "object", required: ["title"], properties: { title: L, body: L, features: entityRefs, media: entityRefs } } } },
    required: ["kind"],
  },
  question: {
    properties: { question: L, short_answer: L, long_answer: L, related: entityRefs, audience: strs },
    required: ["question"],
  },
  source: {
    properties: { ...kind("source"), type: str, title: str, author: { type: "array", items: { type: "object" } }, issued: { type: "object" },
      edition: { type: ["string", "integer"] }, publisher: str, URL: { type: "string", format: "uri" }, DOI: str, ISBN: str,
      language: str, reliability_note: str, open_access: { type: "boolean" } },
    required: ["kind", "type", "title"],
  },
  listing: {
    properties: { ...kind("listing"), categories: { type: "array", items: enm(listingCategories), uniqueItems: true }, made: madeBlock,
      founded: D, status_business: enm(["active", "closed", "unknown"]),
      location: { type: "object", additionalProperties: false, properties: { place: entityRef, address: L, coordinates: ref("coordinates"),
        online_only: { type: "boolean" }, serves: { type: "array", items: { type: "string", pattern: "^([a-z]{2}|global)$" } } } },
      links: { type: "object", additionalProperties: true }, languages: strs,
      certifications: { type: "array", items: { type: "object", required: ["body"], properties: { body: str, ref: str, source: str, checked: { type: "string", format: "date" } } } },
      owner_contact_on_file: { type: "boolean" }, provenance: { type: "object" } },
    required: ["kind", "categories", "made"],
  },
  dataset: {
    properties: { columns: strs, rows_file: str, source: entityRef, license: enm(licenses),
      coverage: { type: "object" }, method_note: str },
    required: ["rows_file", "license"],
  },
};

writeFileSync(new URL("_base.schema.json", root), JSON.stringify(base, null, 2) + "\n");

for (const c of CLASSES) {
  const spec = classProps[c];
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${c}.schema.json`,
    title: `Museum entity: ${c}`,
    allOf: [{ $ref: "_base.schema.json" }],
    type: "object",
    properties: { class: { const: c }, ...spec.properties },
    ...(spec.required ? { required: spec.required } : {}),
    // base properties are allowed through the allOf; class-specific typos are caught here:
    unevaluatedProperties: false,
  };
  writeFileSync(new URL(`${c}.schema.json`, root), JSON.stringify(schema, null, 2) + "\n");
}
console.log(`wrote _base + ${CLASSES.length} class schemas`);
