// One-off audit: list every passage the cosmos detector catches, with matched snippets.
import { compile } from "./build-graph.js";
import { cosmosTopicsOf, cosmosMatches } from "./cosmos.js";

const c = compile();
const rows: { id: string; work?: string; topics: string[]; ar: string }[] = [];
for (const n of c.nodes) {
  if (n.class !== "passage" || n.stub) continue;
  const topics = cosmosTopicsOf(n);
  if (!topics.length) continue;
  const hit = Object.entries(cosmosMatches(n)).map(([k, v]) => `${k}=${(v ?? []).join("|")}`).join(" ");
  const ar = hit + " :: " + String(n.data.text_search ?? n.data.text ?? n.summary?.ar ?? "").replace(/\s+/g, " ").slice(0, 160);
  rows.push({ id: n.id, work: n.data.work as string | undefined, topics, ar });
}
console.log(`TOTAL ${rows.length}`);
const byTopic = new Map<string, number>();
for (const r of rows) for (const t of r.topics) byTopic.set(t, (byTopic.get(t) ?? 0) + 1);
console.log([...byTopic.entries()].map(([t, k]) => `${t}:${k}`).join(" "));
for (const r of rows) console.log(`${r.id}\t${r.work ?? ""}\t${r.topics.join("+")}\t${r.ar}`);
