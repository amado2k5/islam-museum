// Counts for the Rulings Browser (docs/plan/73-ahkam-browser.md): what the build will show,
// by section and by theme, read from the compiled graph. Run `npm run graph` first.
//   npx tsx scripts/ahkam-audit.ts
import { readBigJson } from "./lib/graph-file.mjs";
import { AHKAM_SECTIONS, AHKAM_TAG, AHKAM_TOPICS, ahkamCorpusOf, ahkamTopicsOf, isAhkamPassage } from "./ahkam.js";
import type { Node } from "./build-graph.js";

const graph = readBigJson(".cache/graph.json") as { nodes: Node[] };
const byId = new Map(graph.nodes.map((n) => [n.id, n]));
const bySection: Record<string, number> = Object.fromEntries(AHKAM_SECTIONS.map((s) => [s, 0]));
const byTopic: Record<string, number> = Object.fromEntries(AHKAM_TOPICS.map((t) => [t, 0]));
const byWork: Record<string, number> = {};
let total = 0;
for (const n of graph.nodes) {
  if (n.stub) continue;
  const curated = n.class !== "passage" && n.tags.includes(AHKAM_TAG);
  if (!curated && !isAhkamPassage(n)) continue;
  total++;
  const work = n.data.work as string | undefined;
  const section = curated ? "curated" : ahkamCorpusOf(work, byId.get(work ?? "")?.data.genre as string[] | undefined, n.data.unit as string | undefined);
  bySection[section]++;
  for (const t of ahkamTopicsOf(n)) byTopic[t]++;
  if (work) byWork[work] = (byWork[work] ?? 0) + 1;
}
console.log(`ahkam: ${total} records`);
console.log("by section:", bySection);
console.log("by theme (a record can carry more than one):", byTopic);
console.log("works:", Object.keys(byWork).length, "— top:", Object.entries(byWork).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w, c]) => `${w.replace("work/", "")} ${c}`).join(", "));
