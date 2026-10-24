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
const themes = ids("themes");
const storyRoles = ids("story-roles");
const faith = ids("faith");

export const CLASSES = [
  "person", "group", "polity", "event", "period", "journey", "place", "building", "object",
  "media", "work", "passage", "concept", "language", "practice", "exhibit", "question", "source", "dataset", "listing", "screen",
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
      properties: {
        tradition: enm(traditions), summary: ref("localized"), sources: strs,
        // docs/plan/20-opinions.md: a named opinion within a disagreement
        id: { type: "string", pattern: "^[a-z0-9][a-z0-9-]*$" },
        stance: ref("localized"),
        // docs/scope.md addendum: the museum's main reference is Sunni Islam and its wasatiyya; other opinions are tagged secondary or other
        standing: enm(["main", "secondary", "other"]),
        holders: entityRefs,
        evidence: { type: "array", items: { type: "object", additionalProperties: false, required: ["ref"], properties: { ref: entityRef, note: ref("localized") } } },
      },
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
    issue: ref("localized"),
    perspectives: { type: "array", items: ref("perspective") },
    sources: entityRefs,
    media: {
      type: "object", additionalProperties: false,
      properties: { hero: entityRef, gallery: entityRefs, map: entityRef },
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
    themes: { type: "array", items: enm(themes), uniqueItems: true },
    // Leveled reading (docs/delegation/education-master-plan.md §5 E2): which levels the prose carries (the validator
    // checks they match the sections in content/) and whether the record is opted into the kids' routes.
    education: {
      type: "object", additionalProperties: false,
      properties: {
        levels: { type: "array", uniqueItems: true, items: { enum: ["sprouts", "explorers", "scholars"] } },
        flagged_for_kids: { type: "boolean" },
        exclude: { type: "boolean" },
        provenance: { type: "object", additionalProperties: true, properties: { generated_by: str, model: str, run: str } },
      },
    },
    provenance: {
      type: "object", additionalProperties: true,
      properties: { layer: enm(kinds["provenance-layer"]), source: str, harvested: { type: "string" }, submitted_via: str, generated_by: str },
    },
  },
  required: ["id", "class", "label", "summary", "status"],
};


const dated = { type: "object", additionalProperties: false, properties: { start: ref("date"), end: ref("date") } };
const storyRole = {
  type: "object", additionalProperties: false, required: ["role"],
  properties: { role: enm(storyRoles), toward: entityRef, start: ref("date"), end: ref("date"), status: enm(claimStatus),
    perspective: enm(traditions), note: str, sources: strs },
};
const faithEntry = {
  type: "object", additionalProperties: false, required: ["value", "basis"],
  properties: { value: enm(faith), basis: enm(["self-identified", "documented", "tradition", "debated", "unknown"]),
    start: ref("date"), end: ref("date"), note: str, sources: strs },
};
const labelled = {
  type: "object", additionalProperties: false, required: ["label", "by"],
  properties: { label: ref("localized"), by: str, status: enm(claimStatus), sources: strs },
};
const actorExtras = { story_roles: { type: "array", items: storyRole }, faith: { type: "array", items: faithEntry }, labelled: { type: "array", items: labelled } };
const rangeNum = { type: "object", additionalProperties: false, properties: { value: { type: "number" }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 }, sources: strs, status: enm(claimStatus), note: str } };
const tension = {
  type: "object", additionalProperties: false, required: ["id", "kind", "statement", "responses"],
  properties: {
    id: str, kind: enm(kinds.tension), statement: ref("localized"), status: enm(claimStatus),
    raised_by: { type: "array", items: { type: "object", required: ["who"], properties: { who: str, sources: strs } } },
    passages: entityRefs,
    responses: { type: "array", items: { type: "object", additionalProperties: false, required: ["tradition", "summary"],
      properties: { tradition: enm(traditions), summary: str, sources: strs } } },
  },
};

const mapFeature = {
  type: "object", additionalProperties: false, required: ["type", "role"],
  properties: {
    type: enm(["point", "line", "polygon"]), role: enm(kinds["map-feature-role"]), subkind: str, side: { type: "integer", minimum: 0 },
    label: ref("localized"), at: ref("coordinates"), from: ref("coordinates"), to: ref("coordinates"),
    path: { type: "array", items: ref("coordinates"), minItems: 2 }, geometry: str,
    precision: enm(kinds["map-precision"]), source: str, note: str,
  },
};
const eventMap = {
  type: "object", additionalProperties: false, required: ["kind", "precision"],
  properties: {
    kind: enm(kinds["map-kind"]), precision: enm(kinds["map-precision"]), center: ref("coordinates"), extent_km: { type: "number", exclusiveMinimum: 0 },
    basemap: enm(["terrain", "plain", "sea"]), date_for_borders: str, features: { type: "array", items: mapFeature },
    legend: { type: "boolean" }, sources: strs, note: ref("localized"),
  },
};

const kind = (c: string) => ({ kind: enm(kinds[c]) });
const D = ref("date");
const L = ref("localized");

const classProps: Record<string, { properties: any; required?: string[] }> = {
  person: {
    properties: {
      names: { type: "array", items: ref("name") }, gender: enm(["male", "female", "unknown"]),
      born: D, died: D, floruit: D, roles: strs, traditions: { type: "array", items: enm(traditions) },
      disciplines: entityRefs, languages: entityRefs, ...actorExtras,
    },
  },
  group: {
    properties: { ...kind("group"), made: madeBlock, founded: D, dissolved: D, founder: entityRef, headquarters: entityRef,
      members_estimate: intStr, active_regions: { type: "array", items: enm(regions) }, story_roles: actorExtras.story_roles, labelled: actorExtras.labelled },
    required: ["kind"],
  },
  polity: {
    properties: { ...kind("polity"), start: D, end: D,
      capitals: { type: "array", items: { type: "object", required: ["place"], properties: { place: entityRef, start: D, end: D } } },
      extent: { type: "array", items: { type: "object", required: ["geojson", "precision"],
        properties: { at: D, geojson: str, precision: enm(["schematic", "approximate", "documented"]), source: str } } },
      predecessor: entityRef, successor: entityRef, official_languages: entityRefs, religious_policy: L, story_roles: actorExtras.story_roles, labelled: actorExtras.labelled },
    required: ["kind"],
  },
  event: {
    properties: { ...kind("event"), date: ref("dateRange"), places: entityRefs,
      participants: { type: "array", items: { type: "object", required: ["target"], properties: { target: entityRef, role: str } } },
      outcome: L, part_of: entityRef, casualties: { oneOf: [str, rangeNum] }, significance: L,
      sides: { type: "array", items: { type: "object", additionalProperties: false, required: ["label"], properties: { label: L, participants: entityRefs, commanders: entityRefs, strength: rangeNum, note: str } } },
      laws_of_war: entityRefs, map: eventMap, recurs: str, first_held: D,
      editions: { type: "array", items: { type: "object", properties: { year: { type: "integer" }, attendance: rangeNum, note: str } } } },
    required: ["kind"],
  },
  period: {
    properties: { ...kind("period"), start: D, end: D, parent_period: entityRef, defining_events: entityRefs },
    required: ["start"],
  },
  journey: {
    properties: { ...kind("journey"), travelers: entityRefs, distance_km: { type: "number" }, geometry: str,
      legs: { type: "array", items: { type: "object", required: ["from", "to"],
        properties: { from: entityRef, to: entityRef, start: D, end: D, mode: str, events: entityRefs, note: str } } },
      // day-by-day stations for the journey player (docs/plan/21 §C.4): ordered, each at a place, with a day number and a narrative
      waypoints: { type: "array", items: { type: "object", additionalProperties: false, required: ["place", "day", "title", "narrative"],
        properties: { place: entityRef, day: intStr, day_status: enm(claimStatus), day_note: str, date: D, title: ref("localized"), narrative: ref("localized"),
          events: entityRefs, sources: strs, coordinates_note: str } } } },
    required: ["kind"],
  },
  place: {
    properties: { ...kind("place"), coordinates: ref("coordinates"), coordinate_precision: enm(["site", "locality", "approx"]), coordinate_note: str, geometry: str,
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
      thumbnail: str, license: enm(licenses), attribution: str, creator: str, depicts: entityRefs, alt: L,
      generated: { type: "object", properties: { tool: str, version: str, inputs_hash: str, date: str, model: str, seed: intStr, prompt_hash: str } },
      precision: enm(kinds["map-precision"]), basemap_sources: strs, files: { type: "object", additionalProperties: str } },
    required: ["kind", "license", "alt"],
  },
  work: {
    properties: { ...kind("work"), made: madeBlock, genre: strs, disciplines: strs, authors: entityRefs, language: entityRef, composed: D,
      structure: str, editions: strs, translations: strs, openiti_uri: str, commentaries: entityRefs, manuscripts: entityRefs,
      text_source: { type: "object" }, url: { type: "string", format: "uri" }, launched: D, closed: D, languages: strs, publisher: entityRef, archive_url: { type: "string", format: "uri" },
      orientation: { type: "object", additionalProperties: false, properties: { value: str, basis: enm(["self-described", "documented"]) } },
      content_type: enm(["scripture", "hadith", "fatwa", "library", "education", "news", "community", "children", "academic", "apologetics", "criticism"]) },
    required: ["kind"],
  },
  passage: {
    properties: { work: entityRef, ref: str, unit: enm(["sura", "ayah", "hadith", "poem-line", "chapter", "other"]), sura: intStr, aya: intStr, text: str, text_search: str,
      // sura chronology (docs/plan/21 §C.6): the Cairo-edition order of revelation and its Meccan/Medinan classification
      revelation_order: intStr, revelation_place: enm(["meccan", "medinan"]),
      translations: { type: "object", additionalProperties: { type: "object", required: ["text"],
        properties: { text: str, translator: str, license: enm(licenses) } } },
      audio: entityRefs,
      // ordered isnad (commit 4d20f6f17): person refs only; the validator checks each one resolves
      chain: { type: "array", description: "ordered isnad as stated in the source: first narrator nearest the work; person/muhammad is the terminal when the report reaches him (marfu'), otherwise the last element is the Companion the report stops at",
        items: { type: "string", pattern: "^person/[a-z0-9][a-z0-9-]*$" }, minItems: 1 },
      context: L },
    required: ["work", "ref"],
  },
  concept: {
    properties: { ...kind("concept"), term: { type: "object", additionalProperties: str },
      definitions: { type: "array", items: { type: "object", required: ["text"], properties: { tradition: enm(traditions), text: L, sources: strs } } },
      parent_concept: entityRef, etymology: L, tensions: { type: "array", items: tension } },
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
      obligation: enm(["obligatory", "recommended", "cultural"]), scriptural_basis: entityRefs,
      basis: { type: "array", items: { type: "object", additionalProperties: false, required: ["value"], properties: { tradition: enm(traditions), value: enm(kinds["practice-basis"]), school: str, regions: { type: "array", items: enm(regions) }, sources: strs, note: str } } } },
    required: ["kind"],
  },
  exhibit: {
    properties: { ...kind("exhibit"), audience: strs, duration_minutes: intStr, curator: str, opened: { type: "string", format: "date" },
      prerequisites: entityRefs,
      goal: L, path_kind: enm(["era", "personalities", "events", "ideas", "places", "texts", "art", "culture", "hard-question", "starter"]),
      level: enm(["intro", "standard", "deep"]),
      outcomes: { type: "array", items: { type: "object", required: ["text"], properties: { text: L, steps: { type: "array", items: intStr } } } },
      next: entityRefs,
      rooms: { type: "array", items: { type: "object", required: ["title"], properties: { title: L, body: L, features: entityRefs, media: entityRefs,
        depth: enm(["brief", "standard", "deep"]), optional: { type: "boolean" }, why_next: L, branch_of: intStr } } },
      // Curriculum pathways (docs/delegation/education-master-plan.md §5 E2): the mapping a teacher reads, in the museum's own
      // words, never copied from the Ministry document; `course` is the Ministry code (CHW3M) or "G4-SS" where none exists.
      curriculum: { type: "object", additionalProperties: false, required: ["jurisdiction", "course", "grade", "strand", "expectation"],
        properties: { jurisdiction: enm(["on-ca"]), course: { type: "string", pattern: "^(G[1-8]-[A-Z]{2,4}|[A-Z]{3}[1-4][A-Z])$" }, course_title: L, grade: { type: "string", pattern: "^([1-9]|1[0-2])$" },
          strand: { type: "string", pattern: "^[A-F]$" }, strand_title: L, expectations: { type: "array", items: { type: "string", pattern: "^[A-F][1-4]$" }, minItems: 1 },
          expectation: L, document: str, verified: { type: "string", format: "date" } } },
      // Mastery check (plan §5 E2): five questions, four options each, the index of the right one, and the step that teaches it.
      quiz: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", required: ["q", "options", "answer", "teaches"], additionalProperties: false,
        properties: { q: L, options: { type: "array", minItems: 4, maxItems: 4, items: L }, answer: { type: "integer", minimum: 0, maximum: 3 }, teaches: intStr } } },
      // The student worksheet of a lesson pathway (one prompt per line, printed with writing lines).
      worksheet: { type: "array", minItems: 1, items: { type: "object", required: ["prompt"], properties: { prompt: L, steps: { type: "array", items: intStr } } } } },
    required: ["kind"],
  },
  question: {
    properties: { question: L, short_answer: L, long_answer: L, related: entityRefs, audience: strs, tensions: { type: "array", items: tension } },
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
  screen: {
    properties: {
      format: enm(kinds["screen-format"]), relevance: enm(kinds["screen-relevance"]),
      titles: { type: "array", items: { type: "object", required: ["lang", "value"], additionalProperties: false,
        properties: { lang: str, value: str, kind: enm(["original", "transliteration", "dubbed", "release", "broadcast", "working", "alternate"]), note: str } } },
      released: D, first_broadcast: D, ramadan_season: { type: "integer" },
      countries: { type: "array", items: { type: "string", pattern: "^[a-z]{2}$" } },
      languages: { type: "object", additionalProperties: false, properties: { original: strs, dubbed: strs, subtitled: strs } },
      seasons: intStr, episodes: intStr, runtime_min: { type: "number" }, broadcaster: entityRef, part_of: entityRef,
      versions: { type: "array", items: { type: "object", properties: { lang: str, runtime_min: { type: ["number", "null"] }, note: str } } },
      depiction: { type: "object", additionalProperties: false, properties: {
        prophet: enm(["not-shown", "voice", "point-of-view", "figure-without-face", "face", "not-applicable"]),
        companions: enm(["none", "some-shown", "shown", "not-applicable"]),
        imams: enm(["not-shown", "voice", "light", "shown", "not-applicable"]), note: str } },
      approach: enm(kinds["screen-approach"]),
      reception: { type: "array", items: { type: "object", required: ["kind"], properties: {
        kind: enm(["approval", "objection", "fatwa", "ban", "cut", "award", "protest", "release", "withdrawal", "other"]),
        by: str, where: strs, date: D, status: enm(claimStatus), note: str, sources: strs } } },
      watch: { type: "array", items: { type: "object", required: ["kind", "url"], properties: {
        kind: enm(["official-free", "official-paid", "archive"]), url: { type: "string", format: "uri" }, region: strs, checked: { type: "string", format: "date" } } } },
    },
    required: ["format", "relevance", "titles"],
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
