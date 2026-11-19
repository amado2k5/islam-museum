import { miracleTopicsOf, MIRACLE_TOPIC_KIND, MIRACLE_TOPIC_SUBJECTS } from "./miracles";
import { readFileSync } from "node:fs";
import { readBigJson } from "./lib/graph-file.mjs";
const g = readBigJson(new URL("../.cache/graph.json", import.meta.url));
const nodes = (g as any).nodes as any[];
const counts: Record<string, number> = {};
const hits: Record<string, string[]> = {};
const kinds: Record<string, number> = {};
for (const n of nodes) {
  if (n.class !== "passage" || n.stub) continue;
  const ts = miracleTopicsOf(n as any);
  if (!ts.length) continue;
  for (const t of ts) {
    counts[t] = (counts[t] ?? 0) + 1;
    (hits[t] ??= []).push(n.id);
    const k = MIRACLE_TOPIC_KIND[t];
    kinds[k] = (kinds[k] ?? 0) + 1;
  }
}
for (const t of Object.keys(counts).sort()) {
  const subs = MIRACLE_TOPIC_SUBJECTS[t as any] ?? [];
  console.log(`${t}: ${counts[t]}  subs=[${subs.join(",")}]`);
}
console.log("kinds:", kinds);
if (process.argv[2]) { const t = process.argv[2]; console.log(hits[t]?.join("\n") ?? "none"); }
