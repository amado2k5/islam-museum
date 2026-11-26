// Builds Granada's pinned pack of museum records: the places of the kingdom with the museum's coordinates, and the
// records that give the setting its context, each with its label in the seven languages and its review state.
// The game never reads the museum's data at run time; this file is the only bridge, and it is checked into git.
// Usage: npx tsx --tsconfig tsconfig.json games/granada/tools/build-records.ts
// A record that does not exist, lacks a label in any of the seven languages, is marked sensitive, or (for a place)
// has no coordinates stops the build.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const here = fileURLToPath(new URL("..", import.meta.url));
const repo = resolve(here, "../../..");
const source = JSON.parse(readFileSync(resolve(here, "data/museum-records.source.json"), "utf8")) as { places: Record<string, string>; context: string[]; ideas: Record<string, string> };

interface Pinned {
  kind: string;
  review: string;
  label: Record<string, string>;
  coordinates?: [number, number];
  precision?: string;
}
const records: Record<string, Pinned> = {};
for (const id of [...Object.keys(source.places), ...source.context, ...Object.values(source.ideas)]) {
  const file = resolve(repo, "data", `${id}.yaml`);
  if (!/^[a-z-]+\/[a-z0-9-]+$/.test(id) || !existsSync(file)) throw new Error(`no museum record ${id}`);
  const record = parse(readFileSync(file, "utf8")) as { kind?: string; label?: Record<string, string>; status?: { review?: string }; sensitivity?: unknown; coordinates?: number[]; coordinate_precision?: string };
  if (record.sensitivity) throw new Error(`${id} is marked sensitive: choose another record`);
  const label: Record<string, string> = {};
  for (const lang of LANGS) {
    const text = record.label?.[lang]?.trim();
    if (!text) throw new Error(`${id} has no label in ${lang}`);
    label[lang] = text;
  }
  records[id] = { kind: record.kind ?? "", review: record.status?.review ?? "unknown", label };
  if (id in source.places) {
    const [lat, lon] = record.coordinates ?? [];
    if (typeof lat !== "number" || typeof lon !== "number" || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error(`${id} has no usable coordinates`);
    records[id].coordinates = [lat, lon];
    records[id].precision = record.coordinate_precision ?? "unknown";
  }
}
const body = { places: source.places, context: source.context, ideas: source.ideas, records };
const pack = {
  format: "im.granada.records",
  version: 1,
  builtFrom: execFileSync("git", ["-C", repo, "rev-parse", "--short=11", "HEAD"], { encoding: "utf8" }).trim(),
  digest: createHash("sha256").update(JSON.stringify(body)).digest("hex"),
  ...body,
};
writeFileSync(resolve(here, "data/museum-records.v1.json"), `${JSON.stringify(pack, null, 1)}\n`);
console.log(`${Object.keys(records).length} records (${Object.keys(source.places).length} places), digest ${pack.digest.slice(0, 12)}`);
for (const [id, r] of Object.entries(records)) console.log(`  ${id}  [${r.review}]  ${r.label.en}${r.coordinates ? `  ${r.coordinates[0]}, ${r.coordinates[1]} (${r.precision})` : ""}`);
