// Validates docs/library/enrichment/claims.yaml (see docs/library/enrichment/README.md). Build-time only, no graph load.
import { readFileSync, existsSync } from "node:fs";
import { parse } from "yaml";

const FILE = "docs/library/enrichment/claims.yaml";
const STATES = new Set(["open", "claimed", "in_progress", "done", "blocked", "wontfix"]);
const LIVE = new Set(["claimed", "in_progress", "blocked"]); // states that hold an item against a second claimant
const BLOCK_REASONS = /needs founder|needs gemini|needs a source|needs source|held for the founder/i;
const errors: string[] = [];
const warnings: string[] = [];

type C = { id: string; gap: string; class?: string; slugs?: string[]; range?: string; agent?: string; state: string; date?: string; prs?: number[]; reason?: string };
const raw = existsSync(FILE) ? readFileSync(FILE, "utf8") : "claims: []\n";
if (/(^|[\s"'(=:])\/(Users|home)\/|\/Volumes\//m.test(raw)) errors.push("absolute home or volume path found");
const doc = parse(raw) as { claims?: C[] } | null;
const claims: C[] = doc?.claims ?? [];
if (!Array.isArray(claims)) { console.error("error: claims must be a list"); process.exit(1); }

const gapOverlap = (a: string, b: string) => a === b || a.startsWith(b + ".") || b.startsWith(a + ".");
const clsOverlap = (a?: string, b?: string) => !a || !b || a === "*" || b === "*" || a === b;
const rng = (c: C): [string, string] | null => (c.range ? (c.range.split("..") as [string, string]) : null);
function itemsOverlap(a: C, b: C): boolean {
  if (a.slugs && b.slugs) return a.slugs.some((s) => b.slugs!.includes(s));
  const within = (s: string, r: [string, string]) => s >= r[0] && s <= r[1];
  if (a.slugs && b.range) return a.slugs.some((s) => within(s, rng(b)!));
  if (a.range && b.slugs) return b.slugs.some((s) => within(s, rng(a)!));
  if (a.range && b.range) { const x = rng(a)!, y = rng(b)!; return x[0] <= y[1] && y[0] <= x[1]; }
  return true; // a whole-shard claim overlaps anything in that shard
}

const ids = new Set<string>();
for (const c of claims) {
  if (!c.id) { errors.push("claim without id"); continue; }
  if (ids.has(c.id)) errors.push(`duplicate claim id ${c.id}`);
  ids.add(c.id);
  if (!c.gap) errors.push(`${c.id}: no gap`);
  if (!STATES.has(c.state)) errors.push(`${c.id}: bad state ${c.state}`);
  if (!c.agent) errors.push(`${c.id}: no agent`);
  if (!c.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(c.date))) errors.push(`${c.id}: date must be YYYY-MM-DD`);
  if (c.range && !/^[^.]+\.\.[^.]+$/.test(c.range)) errors.push(`${c.id}: range must be "first..last" (slugs, inclusive, alphabetical)`);
  if (c.range && c.slugs) errors.push(`${c.id}: give slugs or range, not both`);
  if ((c.state === "blocked" || c.state === "wontfix") && !c.reason) errors.push(`${c.id}: ${c.state} needs a reason`);
  if (c.state === "blocked" && c.reason && !BLOCK_REASONS.test(c.reason)) warnings.push(`${c.id}: blocked reason should say needs founder, needs Gemini or needs a source`);
  if (c.state === "done" && !(c.prs && c.prs.length)) warnings.push(`${c.id}: done without a PR number`);
}
for (let i = 0; i < claims.length; i++)
  for (let j = i + 1; j < claims.length; j++) {
    const a = claims[i], b = claims[j];
    if (!LIVE.has(a.state) || !LIVE.has(b.state)) continue;
    if (gapOverlap(a.gap, b.gap) && clsOverlap(a.class, b.class) && itemsOverlap(a, b)) errors.push(`${a.id} and ${b.id} claim the same items (${a.gap}/${a.class ?? "*"} vs ${b.gap}/${b.class ?? "*"})`);
  }

for (const w of warnings) console.warn("warn:", w);
for (const e of errors) console.error("error:", e);
console.log(`enrichment register: ${claims.length} claims, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
