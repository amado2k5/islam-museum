// Seeds `mentions` edges for the Islamic Economy Browser (docs/plan/44): every
// passage the detector in scripts/islamic-economy.ts matches gains a `mentions`
// edge to each of its topic anchor concepts — money -> concept/mal-fiqh,
// sukuk -> concept/al-sakk-wal-hawala, waqf -> concept/waqf — citing the
// passage's own first source, the same convention as the madhhab and dua
// browsers. Idempotent: a target already mentioned is skipped.
//
//   tsx scripts/ie-mentions.ts          # report only
//   tsx scripts/ie-mentions.ts --apply  # write the edges
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { ieTopicsOf, type IeTopic } from "./islamic-economy.js";
import type { Node } from "./build-graph.js";
import { p } from "./lib.js";

const ANCHOR: Record<IeTopic, string> = {
  money: "concept/mal-fiqh",
  sukuk: "concept/al-sakk-wal-hawala",
  waqf: "concept/waqf",
};

const apply = process.argv.includes("--apply");
const graph = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
const nodes = graph.nodes as Node[];
const byId = new Map(nodes.map((n) => [n.id, n]));

interface Job { file: string; targets: string[]; cite: string }
const jobs = new Map<string, Job>();
let noSource = 0;

for (const n of nodes) {
  if (n.class !== "passage" || n.stub) continue;
  const topics = ieTopicsOf(n);
  if (!topics.length) continue;
  const cite = (n.data.sources as string[] | undefined)?.[0];
  if (!cite) { noSource++; continue; }
  const slug = n.id.split("/")[1];
  const file = p("data", "passage", `${slug}.yaml`);
  if (!existsSync(file)) continue;
  const targets = [...new Set(topics.map((t) => ANCHOR[t]))];
  const job = jobs.get(file) ?? { file, targets: [], cite };
  for (const t of targets) if (!job.targets.includes(t)) job.targets.push(t);
  jobs.set(file, job);
}

// --- YAML relations editing (mirrors scripts/add-madhahib-mentions.py) ---
function firstSource(text: string): string | null {
  const inline = text.match(/^sources:\s*\[([^\]]*)\]/m);
  if (inline) {
    const first = inline[1].split(",")[0].trim().replace(/^['"]|['"]$/g, "");
    return first || null;
  }
  const block = text.match(/^sources:\s*\n((?:\s*-\s*source\/[\w.-]+\s*\n?)+)/m);
  if (block) {
    const first = block[1].match(/-\s*(source\/[\w.-]+)/);
    return first?.[1] ?? null;
  }
  return null;
}

function addMentions(text: string, targets: string[], cite: string): { text: string; added: string[] } {
  const lines = text.split("\n");
  const existing = new Set<string>();
  for (const m of text.matchAll(/type:\s*mentions,\s*target:\s*([\w/-]+)/g)) existing.add(m[1]);
  const fresh = targets.filter((t) => !existing.has(t));
  if (!fresh.length) return { text, added: [] };
  const items = fresh.map((t) => `  - { type: mentions, target: ${t}, sources: [${cite}] }`).join("\n") + "\n";
  const relIdx = lines.findIndex((l) => l === "relations:");
  if (relIdx !== -1) {
    lines.splice(relIdx + 1, 0, ...items.trimEnd().split("\n"));
    return { text: lines.join("\n"), added: fresh };
  }
  const block = "relations:\n" + items.trimEnd();
  const ins = lines.findIndex((l) => /^(provenance|status):/.test(l));
  if (ins !== -1) lines.splice(ins, 0, block, "");
  else lines.push("", block);
  return { text: lines.join("\n"), added: fresh };
}

let changed = 0, skipped = 0, edges = 0;
for (const job of [...jobs.values()].sort((a, b) => a.file.localeCompare(b.file))) {
  const text = readFileSync(job.file, "utf8");
  const cite = job.cite || firstSource(text);
  if (!cite) { console.log(`NO SOURCE ${job.file}`); continue; }
  const { text: next, added } = addMentions(text, job.targets, cite);
  if (!added.length) { skipped++; continue; }
  changed++;
  edges += added.length;
  console.log(`${apply ? "APPLY" : "WOULD"} ${job.file}: +${added.join(", ")} [${cite}]`);
  if (apply) writeFileSync(job.file, next);
}
console.log(`\n${jobs.size} passages matched, ${noSource} without a source, ${changed} files ${apply ? "updated" : "would update"}, ${edges} edges, ${skipped} already complete`);
