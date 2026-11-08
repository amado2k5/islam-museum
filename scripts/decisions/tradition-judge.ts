#!/usr/bin/env tsx
/**
 * tradition-judge.ts — run tradition-classification packets through the local
 * judge (OpenAI-compatible endpoint, default Ollama) and collect strict-JSON
 * verdicts. Resumable: person_ids already present in the output file are skipped.
 *
 * Judge output is a PROPOSAL only — results feed the decision ledger / review,
 * never write data/person directly.
 *
 * Usage:
 *   DECIDE_JUDGE_URL=http://localhost:11434/v1 DECIDE_JUDGE_MODEL=qwen3.5:27b \
 *     npx tsx scripts/decisions/tradition-judge.ts [--packets FILE] [--out FILE] \
 *     [--limit N] [--ids-file FILE]
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PACKETS = join(ROOT, "docs/decisions/tradition-packets.jsonl");
const OUT = join(ROOT, "docs/decisions/tradition-judge-results.jsonl");

const URL_BASE = process.env.DECIDE_JUDGE_URL ?? "http://localhost:11434/v1";
const MODEL = process.env.DECIDE_JUDGE_MODEL ?? "qwen3.5:27b";
const KEY = process.env.DECIDE_JUDGE_KEY ?? "local";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function parseJsonLoose(text: string): any | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

async function judge(prompt: string): Promise<{ raw: string; ms: number }> {
  const t0 = Date.now();
  const res = await fetch(`${URL_BASE}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL, temperature: 0,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`judge HTTP ${res.status}`);
  const j: any = await res.json();
  const raw = j?.choices?.[0]?.message?.content ?? "";
  return { raw, ms: Date.now() - t0 };
}

async function main() {
  const packetsFile = arg("--packets") ?? PACKETS;
  const outFile = arg("--out") ?? OUT;
  const limit = arg("--limit") ? parseInt(arg("--limit")!) : Infinity;
  const idsFile = arg("--ids-file");
  const idFilter = idsFile ? new Set(readFileSync(idsFile, "utf8").split("\n").map(s => s.trim()).filter(Boolean)) : null;

  const done = new Set<string>();
  if (existsSync(outFile)) {
    for (const line of readFileSync(outFile, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line);
        if (!r.error) done.add(r.person_id);   // errors are retried on resume
      } catch { /* skip */ }
    }
  }

  const packets = readFileSync(packetsFile, "utf8").split("\n").filter(Boolean)
    .map(l => JSON.parse(l))
    .filter(p => !done.has(p.person_id) && (!idFilter || idFilter.has(p.person_id)));

  console.log(`pending: ${packets.length} (already judged: ${done.size})`);
  let n = 0, fails = 0;
  for (const p of packets) {
    if (n >= limit) break;
    try {
      const { raw, ms } = await judge(p.prompt);
      const parsed = parseJsonLoose(raw);
      appendFileSync(outFile, JSON.stringify({
        person_id: p.person_id, model: MODEL, ms,
        verdict: parsed ?? null, raw: parsed ? undefined : raw.slice(0, 2000),
        judged_at: new Date().toISOString(),
      }) + "\n");
      n++;
      if (n % 10 === 0) console.log(`  ...${n} judged (${fails} failed)`);
    } catch (e: any) {
      fails++;
      appendFileSync(outFile, JSON.stringify({
        person_id: p.person_id, model: MODEL, error: String(e?.message ?? e),
        judged_at: new Date().toISOString(),
      }) + "\n");
      if (fails >= 5) { console.error("5 consecutive failures — stopping"); break; }
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.log(`done: ${n} judged, ${fails} errors -> ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
