#!/usr/bin/env tsx
/**
 * tradition-score.ts — score judge verdicts against recorded attestations.
 *
 * Reads packets (recorded labels) + judge results, normalizes tradition
 * labels into a hierarchy, and reports agreement tiers:
 *   exact       — identical normalized label
 *   compatible  — one side is a strict generalization of the other
 *   abstain     — judge answered unknown/other or errored
 *   disagree    — conflicting labels (needs human review)
 *
 * Usage: npx tsx scripts/decisions/tradition-score.ts \
 *   [--packets FILE] [--results FILE] [--json]
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PACKETS = join(ROOT, "docs/decisions/tradition-golden-packets.jsonl");
const RESULTS = join(ROOT, "docs/decisions/tradition-golden-results.jsonl");

// generalization tree: child -> parent (longest-prefix style)
const PARENT: Record<string, string> = {
  "sunni-hanafi": "sunni", "sunni-maliki": "sunni", "sunni-shafii": "sunni",
  "sunni-hanbali": "sunni", "sunni-ashari": "sunni", "sunni-maturidi": "sunni",
  "sunni-athari": "sunni",
  "shia-twelver": "shia", "shia-ismaili": "shia", "shia-zaydi": "shia",
};
const ALIASES: Record<string, string> = {
  "sunni": "sunni", "ahlu-sunnah": "sunni", "ahl-al-sunnah": "sunni",
  "shia": "shia", "shi'a": "shia", "shii": "shia",
  "sunni-hanafi": "sunni-hanafi", "hanafi": "sunni-hanafi",
  "sunni-maliki": "sunni-maliki", "maliki": "sunni-maliki",
  "sunni-shafii": "sunni-shafii", "shafii": "sunni-shafii", "shafi'i": "sunni-shafii",
  "sunni-hanbali": "sunni-hanbali", "hanbali": "sunni-hanbali",
  "shia-twelver": "shia-twelver", "twelver": "shia-twelver", "imami": "shia-twelver",
  "shia-ismaili": "shia-ismaili", "ismaili": "shia-ismaili",
  "shia-zaydi": "shia-zaydi", "zaydi": "shia-zaydi",
  "ibadi": "ibadi", "ibadiyya": "ibadi",
  "sufi": "sufi", "unknown": "unknown", "other": "other",
};

function norm(v: any): string {
  const s = String(v ?? "").toLowerCase().trim();
  return ALIASES[s] ?? s;
}

function compatible(a: string, b: string): boolean {
  if (a === b) return true;
  // walk up parents
  let x = a;
  while (PARENT[x]) { x = PARENT[x]; if (x === b) return true; }
  let y = b;
  while (PARENT[y]) { y = PARENT[y]; if (y === a) return true; }
  return false;
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function main() {
  const packetsFile = arg("--packets") ?? PACKETS;
  const resultsFile = arg("--results") ?? RESULTS;
  const packets = new Map<string, any>();
  for (const l of readFileSync(packetsFile, "utf8").split("\n")) {
    if (!l.trim()) continue;
    const p = JSON.parse(l); packets.set(p.person_id, p);
  }
  const results = existsSync(resultsFile)
    ? readFileSync(resultsFile, "utf8").split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean)
    : [];

  const tiers: Record<string, any[]> = { exact: [], compatible: [], abstain: [], disagree: [], pending: [] };
  for (const [id, p] of packets) {
    const recorded = (p.existing_faith ?? []).map((f: string) => norm(f.split(" ")[0]));
    const recPrimary = recorded.find(r => r !== "unknown" && r !== "other") ?? recorded[0] ?? "unknown";
    const r = results.filter(x => x.person_id === id).pop();
    if (!r || !r.verdict) { tiers.pending.push({ id, recorded: recPrimary }); continue; }
    const j = norm(r.verdict?.tradition);
    if (j === "unknown" || j === "other" || j === "") { tiers.abstain.push({ id, recorded: recPrimary, judge: j }); continue; }
    if (j === recPrimary) tiers.exact.push({ id, label: j });
    else if (compatible(j, recPrimary)) tiers.compatible.push({ id, recorded: recPrimary, judge: j });
    else tiers.disagree.push({ id, recorded: recPrimary, judge: j, conf: r.verdict?.confidence });
  }

  const done = tiers.exact.length + tiers.compatible.length + tiers.abstain.length + tiers.disagree.length;
  const summary = {
    packets: packets.size, judged: done, pending: tiers.pending.length,
    exact: tiers.exact.length, compatible: tiers.compatible.length,
    abstain: tiers.abstain.length, disagree: tiers.disagree.length,
    agreement_rate: done ? +(((tiers.exact.length + tiers.compatible.length) / done) * 100).toFixed(1) : null,
    disagree_rate: done ? +((tiers.disagree.length / done) * 100).toFixed(1) : null,
  };
  if (process.argv.includes("--json")) { console.log(JSON.stringify({ summary, disagree: tiers.disagree, abstain: tiers.abstain.slice(0, 50) }, null, 1)); return; }
  console.log(JSON.stringify(summary, null, 1));
  if (tiers.disagree.length) {
    console.log("\nDISAGREE (needs review):");
    for (const d of tiers.disagree) console.log(`  ${d.id}: recorded=${d.recorded} judge=${d.judge} conf=${d.conf}`);
  }
}
main();
