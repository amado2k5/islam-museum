// Writes the Hudud Allah and Kaba'ir Browser's `mentions → concept/hudud-allah-wal-kabair`
// edges (docs/plan/52-hudud-browser.md) into every passage record the shared detector in
// scripts/hudud.ts catches, each citing the passage's own first source — the same pattern
// the Sayyi'at Browser used for its umbrella concept. Idempotent: a passage already naming
// the umbrella is skipped.
//   npx tsx scripts/harvest-hudud-edges.ts          # dry run, counts only
//   npx tsx scripts/harvest-hudud-edges.ts --write  # append the edges
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { hududSignalsOf, HUDUD_TAG } from "./hudud.js";

const UMBRELLA = "concept/hudud-allah-wal-kabair";
const dir = "data/passage";
const write = process.argv.includes("--write");
let detected = 0, edged = 0, skipped = 0;
const byKind = new Map<string, number>();

for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()) {
  const p = join(dir, f);
  const raw = readFileSync(p, "utf8");
  const doc = YAML.parse(raw) ?? {};
  const signals = hududSignalsOf({
    id: doc.id ?? `passage/${f.replace(/\.yaml$/, "")}`,
    class: "passage",
    stub: doc.stub === true,
    tags: doc.tags ?? [],
    data: { text_search: doc.text_search, text: doc.text },
  } as any);
  if (!signals.length) continue;
  detected++;
  for (const s of signals) byKind.set(s, (byKind.get(s) ?? 0) + 1);
  if (raw.includes(`target: ${UMBRELLA}`) || raw.includes(`target: "${UMBRELLA}"`)) { skipped++; continue; }
  const src = Array.isArray(doc.sources) && doc.sources.length ? doc.sources[0] : null;
  const rel = `  - { type: mentions, target: ${UMBRELLA}${src ? `, sources: [${src}]` : ""} }`;
  const lines = raw.split("\n");
  const ri = lines.findIndex((l) => /^relations:/.test(l));
  if (ri === -1) {
    // No relations block: append one at the end of the file.
    const tail = raw.endsWith("\n") ? raw : raw + "\n";
    if (write) writeFileSync(p, `${tail}relations:\n${rel}\n`);
  } else {
    let last = ri;
    for (let i = ri + 1; i < lines.length; i++) {
      if (/^  - /.test(lines[i]) || lines[i].trim() === "") { if (/^  - /.test(lines[i])) last = i; continue; }
      break;
    }
    lines.splice(last + 1, 0, rel);
    if (write) writeFileSync(p, lines.join("\n"));
  }
  edged++;
}
console.log(`detected ${detected} passages; ${edged} edges ${write ? "written" : "to write"}; ${skipped} already linked`);
console.log("signals:", Object.fromEntries([...byKind].sort((a, b) => b[1] - a[1])));
