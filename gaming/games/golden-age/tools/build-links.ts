// Builds The Golden Age's museum links: for each piece of research and each tool, the museum record behind the
// idea, with its label in the seven languages, pinned in git. The game never reads the museum's data at run time.
// Usage: npx tsx --tsconfig tsconfig.json games/golden-age/tools/build-links.ts
// A record that does not exist, or lacks a label in any of the seven languages, stops the build.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const here = fileURLToPath(new URL("..", import.meta.url));
const repo = resolve(here, "../../..");
const source = JSON.parse(readFileSync(resolve(here, "data/museum-links.source.json"), "utf8")) as { research: Record<string, string>; tool: Record<string, string>; scenario: Record<string, string[]> };

const records: Record<string, { review: string; label: Record<string, string>; summary?: Record<string, string> }> = {};
/** Records whose summary a chapter's brief shows: the museum's own words, with the citation markers taken out (the link leads to them). */
const told = new Set(Object.values(source.scenario).flat());
const plain = (text: string): string =>
  text
    .replace(/\s*\{cite:[^}]*\}/g, "")
    .replace(/\s+([.,;،؛۔])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
for (const id of [...Object.values(source.research), ...Object.values(source.tool), ...told].sort()) {
  if (records[id]) continue;
  const file = resolve(repo, "data", `${id}.yaml`);
  if (!/^[a-z-]+\/[a-z0-9-]+$/.test(id) || !existsSync(file)) throw new Error(`no museum record ${id}`);
  const record = parse(readFileSync(file, "utf8")) as { label?: Record<string, string>; summary?: Record<string, string>; status?: { review?: string }; sensitivity?: unknown };
  if (record.sensitivity) throw new Error(`${id} is marked sensitive: choose another record`);
  const label: Record<string, string> = {};
  for (const lang of LANGS) {
    const text = record.label?.[lang]?.trim();
    if (!text) throw new Error(`${id} has no label in ${lang}`);
    label[lang] = text;
  }
  records[id] = { review: record.status?.review ?? "unknown", label };
  if (told.has(id)) {
    const summary: Record<string, string> = {};
    for (const lang of LANGS) {
      const text = plain(record.summary?.[lang] ?? "");
      if (!text) throw new Error(`${id} has no summary in ${lang}`);
      if (text.length > 900) throw new Error(`${id}: the ${lang} summary is ${text.length} characters, too long for a brief`);
      summary[lang] = text;
    }
    records[id].summary = summary;
  }
}
const body = { research: source.research, tool: source.tool, scenario: source.scenario, records };
const pack = {
  format: "im.golden-age.links",
  version: 2,
  builtFrom: execFileSync("git", ["-C", repo, "rev-parse", "--short=11", "HEAD"], { encoding: "utf8" }).trim(),
  digest: createHash("sha256").update(JSON.stringify(body)).digest("hex"),
  ...body,
};
writeFileSync(resolve(here, "data/museum-links.v1.json"), `${JSON.stringify(pack, null, 1)}\n`);
console.log(`${Object.keys(records).length} records, ${Object.keys(source.research).length} research links, ${Object.keys(source.tool).length} tool links, ${Object.keys(source.scenario).length} chapters, digest ${pack.digest.slice(0, 12)}`);
for (const [id, r] of Object.entries(records)) console.log(`  ${id}  [${r.review}]  ${r.label.en}${r.summary ? `  (summary shown: ${r.summary.en.length} characters in English)` : ""}`);
