import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { listFiles, loadEntities, p, rel } from "../lib.js";

type RecordData = {
  id: string;
  class: string;
  kind?: string;
  label?: Record<string, string>;
  roles?: string[];
  story_roles?: { role: string }[];
  authors?: string[];
  disciplines?: string[];
  genre?: string[];
  relations?: { target?: string }[];
  sources?: string[];
  domain?: string;
  era?: { origins?: string };
  attribution?: { status?: string };
  media?: Partial<Record<"image" | "diagram" | "map", string>>;
  provenance?: { image_step?: string };
};

const SCIENTIFIC_ROLES = [
  "physician",
  "scientist",
  "astronomer",
  "mathematician",
  "engineer",
  "geographer",
  "physicist",
  "chemist",
  "inventor",
  "cartographer",
  "biochemist",
  "astrophysicist",
];

function countBy(values: string[]): Record<string, number> {
  return Object.fromEntries(
    [...new Set(values)].sort().map((key) => [key, values.filter((value) => value === key).length]),
  );
}

function readInventionRecords(): RecordData[] {
  return listFiles(p("data", "invention"), ".yaml").map(
    (file) => parse(readFileSync(file, "utf8")) as RecordData,
  );
}

function readDomains(): string[] {
  const taxonomy = parse(
    readFileSync(p("docs", "inventions", "taxonomy.yaml"), "utf8"),
  ) as { domains?: { id: string }[] };
  if (
    !Array.isArray(taxonomy.domains) ||
    taxonomy.domains.some((domain) => typeof domain.id !== "string" || !domain.id)
  ) {
    throw new Error("docs/inventions/taxonomy.yaml must define domains with ids");
  }
  return taxonomy.domains.map(({ id }) => id);
}

function recordedRoles(person: RecordData): string[] {
  return [
    ...(person.roles ?? []),
    ...(person.story_roles ?? []).map(({ role }) => role),
  ];
}

function collectProseHits(): { id: string; lang: string; file: string }[] {
  const hits: { id: string; lang: string; file: string }[] = [];
  const match = /invent|اختر|ابتكر/iu;
  for (const lang of ["ar", "en"]) {
    for (const file of listFiles(p("content", lang), ".md")) {
      const path = rel(file).split("/");
      if (path.length !== 4 || path[2] === "_pages") continue;
      if (match.test(readFileSync(file, "utf8"))) {
        hits.push({ id: `${path[2]}/${path[3].replace(/\.md$/, "")}`, lang, file: rel(file) });
      }
    }
  }
  return hits.sort((a, b) => a.id.localeCompare(b.id) || a.lang.localeCompare(b.lang));
}

function buildCensus() {
  const records = loadEntities().map(({ entity }) => entity as RecordData);
  const domains = readDomains();
  const persons = records.filter((record) => record.class === "person");
  const concepts = records.filter((record) => record.class === "concept" && record.kind === "scientific");
  const discoveries = records.filter((record) => record.class === "event" && record.kind === "discovery");
  const instruments = records.filter(
    (record) =>
      record.class === "object" && ["astrolabe", "instrument", "globe"].includes(record.kind ?? ""),
  );
  const treatises = records.filter((record) => record.class === "work" && record.kind === "treatise");
  const sources = records.filter((record) => record.class === "source");
  const proseHits = collectProseHits();
  const roleCounts: Record<string, number> = {};

  for (const role of SCIENTIFIC_ROLES) {
    roleCounts[role] = persons.filter((person) => recordedRoles(person).includes(role)).length;
  }

  const scientistPool = persons
    .filter((person) => recordedRoles(person).some((role) => SCIENTIFIC_ROLES.includes(role)))
    .map((person) => person.id)
    .sort();
  const scientistIds = new Set(scientistPool);
  const scientificConceptIds = new Set(concepts.map((record) => record.id));
  const scientificWorkLeads = records
    .filter(
      (record) =>
        record.class === "work" &&
        (record.authors?.some((author) => scientistIds.has(author)) ||
          record.disciplines?.some((discipline) => scientificConceptIds.has(discipline)) ||
          record.relations?.some(
            ({ target }) => target && (scientistIds.has(target) || scientificConceptIds.has(target)),
          ) ||
          record.genre?.includes("zij")),
    )
    .map((record) => record.id)
    .sort();
  const inventionRecords = readInventionRecords();
  const inventionProse = listFiles(p("content"), ".md").filter((file) => {
    const parts = rel(file).split("/");
    return parts.length === 4 && parts[2] === "invention";
  });
  const inventionByDomain = countBy(inventionRecords.map((record) => record.domain ?? "unassigned"));
  const inventionByEra = countBy(inventionRecords.map((record) => record.era?.origins ?? "unassigned"));
  const inventionByAttribution = countBy(
    inventionRecords.map((record) => record.attribution?.status ?? "unassigned"),
  );
  const inventionArticlesByLanguage = Object.fromEntries(
    ["ar", "en", "ur"].map((lang) => [
      lang,
      inventionProse.filter((file) => rel(file).split("/")[1] === lang).length,
    ]),
  );
  const inventionAssets = Object.fromEntries(
    (["image", "diagram", "map"] as const).map((asset) => [
      asset,
      inventionRecords.filter((record) => record.media?.[asset]).length,
    ]),
  );
  const recordsById = new Map(records.map((record) => [record.id, record]));
  const sourcesByFamily = {
    encyclopaediaOfIslam: sources.filter((source) => source.id === "source/encyclopaedia-of-islam-2").length,
    tdv: sources.filter((source) => source.id.startsWith("source/tdv-")).length,
    iranica: sources.filter((source) => source.id.startsWith("source/iranica-")).length,
    wikipedia: sources.filter((source) => source.id.startsWith("source/wikipedia-")).length,
    wikidata: sources.filter((source) => source.id.startsWith("source/wikidata-")).length,
  };
  const queuePath = p("docs", "inventions", "queue.yaml");
  const queue = parse(readFileSync(queuePath, "utf8")) as { candidates?: unknown[] };
  if (!Array.isArray(queue.candidates)) {
    throw new Error("docs/inventions/queue.yaml must define candidates as a list");
  }
  const domainsWithCounts = Object.fromEntries(
    [...new Set([...domains, ...Object.keys(inventionByDomain)])].map((domain) => [
      domain,
      inventionByDomain[domain] ?? 0,
    ]),
  );
  const result = {
    domains,
    existingRecords: {
      persons: persons.length,
      scientistPool: scientistPool.length,
      scientificRoles: roleCounts,
      scientificConcepts: concepts.map((record) => record.id).sort(),
      discoveryEvents: discoveries.map((record) => record.id).sort(),
      instrumentObjects: instruments.map((record) => record.id).sort(),
      treatiseWorks: treatises.map((record) => record.id).sort(),
      scientificWorkLeads,
      proseHits,
      sourcesByFamily,
    },
    queue: { candidates: queue.candidates.length },
    inventions: {
      records: inventionRecords.length,
      articlesByLanguage: inventionArticlesByLanguage,
      byDomain: domainsWithCounts,
      byEra: inventionByEra,
      byAttribution: inventionByAttribution,
      assets: inventionAssets,
      imageSteps: countBy(inventionRecords.map((record) => {
        const imageId = record.media?.image;
        if (!imageId) return "no-image";
        const media = recordsById.get(imageId);
        if (!media) return "media-record-missing";
        return media.provenance?.image_step ?? "not-recorded";
      })),
    },
  };

  return result;
}

function renderCoverage(census: ReturnType<typeof buildCensus>): string {
  const { existingRecords, queue, inventions } = census;
  const table = (title: string, rows: Record<string, number>) =>
    `### ${title}\n\n| Key | Count |\n|---|---:|\n${Object.entries(rows)
      .map(([key, count]) => `| ${key} | ${count} |`)
      .join("\n") || "| none | 0 |"}\n`;

  return [
    "# Inventions Browser coverage",
    "",
    "_Generated by `npm run inventions:census`; candidate signals are leads, not verified claims._",
    "",
    `Candidates in queue: **${queue.candidates}** · invention records: **${inventions.records}** · ` +
      `scientist/person leads: **${existingRecords.scientistPool}** · scientific concepts: **${existingRecords.scientificConcepts.length}** · ` +
      `discovery events: **${existingRecords.discoveryEvents.length}** · instrument objects: **${existingRecords.instrumentObjects.length}**.`,
    "",
    table("Published invention records by domain", inventions.byDomain),
    table("Published invention records by era", inventions.byEra),
    table("Attribution status", inventions.byAttribution),
    table("Prose by language", inventions.articlesByLanguage),
    table("Structured assets", inventions.assets),
    table("Hero-image provenance step", inventions.imageSteps),
    "## Existing research leads",
    "",
    `- Scientist/person records: ${existingRecords.scientistPool}`,
    `- Scientific work leads (linked to scientific people/concepts or tagged as a zij): ${existingRecords.scientificWorkLeads.length}`,
    `- Treatise-kind works, all subjects: ${existingRecords.treatiseWorks.length}`,
    `- English/Arabic prose-hit files: ${existingRecords.proseHits.length}`,
    "",
    "## Existing source families",
    "",
    ...Object.entries(existingRecords.sourcesByFamily).map(([family, count]) => `- ${family}: ${count}`),
    "",
  ].join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const census = buildCensus();
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(census, null, 2));
  } else {
    mkdirSync(p(".cache"), { recursive: true });
    writeFileSync(p(".cache", "inventions-census.json"), `${JSON.stringify(census, null, 2)}\n`);
    writeFileSync(p("docs", "inventions", "coverage.md"), renderCoverage(census));
    console.log(
      `inventions census: ${census.queue.candidates} candidates, ${census.inventions.records} invention records; ` +
        `${census.existingRecords.scientistPool} scientist/person leads, ` +
        `${census.existingRecords.proseHits.length} prose-hit files`,
    );
  }
}
