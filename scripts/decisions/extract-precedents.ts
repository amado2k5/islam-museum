#!/usr/bin/env tsx
/**
 * extract-precedents — POC for the autonomous-decision ledger.
 *
 * Mines the repository's own decision history into docs/decisions/precedents.yaml:
 *   - "## D-NNN — title" / "### D-NNN — title" decision records in docs/**
 *   - "FLAG:" lines and explicit founder rulings in lane progress files
 *
 * Usage: npx tsx scripts/decisions/extract-precedents.ts [--write]
 *   default: prints a summary and the YAML to stdout
 *   --write: writes docs/decisions/precedents.yaml
 *
 * This is a build-time tool only; nothing on the published site calls it.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "docs/decisions/precedents.yaml");
const SCAN_DIRS = ["docs"];
const EXCLUDE = /node_modules|\.git|docs[/\\]decisions/; // never mine our own ledger — self-referential pollution

interface Precedent {
  id: string;
  kind: "decision-record" | "flag" | "ruling";
  title: string;
  date?: string;
  source_file: string;
  summary: string;
  /** Muse §2: a proposal is not a precedent. Only founder-ruled* entries may
   *  decide; proposals/rejected/reverted are context at best. */
  provenance_status?: "founder-ruled" | "founder-ruled-ai-assisted" | "agent-ruled-delegated" | "agent-proposed-pending" | "agent-proposed-rejected" | "reverted";
  supersedes?: string;
}

/** Classify how much authority a mined entry carries. Fail-closed: anything we
 *  cannot prove was ruled on is a proposal, never authority.
 *  - founder-ruled*: the founder's own decision, citable to a ruling act.
 *  - agent-ruled-delegated: decided by an agent under standing delegation
 *    (the repo's "Approved non-impacting" vocabulary) — authority within its
 *    delegated scope, below founder doctrine.
 *  - agent-proposed-*: drafted, never ruled — context only, never decides.
 *  NOTE: `reverted`/`agent-proposed-rejected` are deliberately NOT auto-detected
 *  from keywords — a ruling *about* a revert is itself authority, and keyword
 *  matching cannot tell the two apart. Supersession chains carry that signal. */
function classifyStatus(kind: string, text: string): Precedent["provenance_status"] {
  const t = text.toLowerCase();
  const aiAssisted = /ai[- ]assist|drafted by|prepared by (an? )?(ai|gemini|agent|model)|agent-drafted|ai-generated/.test(t);
  const founderRuled =
    kind === "ruling" || // RULING_LINE already requires founder + ruling verb
    /\bfounder\b[^.]{0,60}\b(approved|ruled|decided|authorized|accepted|said|confirmed|ordered|instructed)\b/.test(t) ||
    /\b(approved|ruled|decided|authorized|accepted|confirmed|ordered)\b[^.]{0,40}\bfounder\b/.test(t) ||
    /\bfounder'?s (decision|ruling|instruction|standing|word|authori[sz]ation)\b/.test(t);
  if (founderRuled) return aiAssisted ? "founder-ruled-ai-assisted" : "founder-ruled";
  if (/\bapproved\b|\bauthori[sz]ed under\b|\bnon-impacting scope\b/.test(t)) return "agent-ruled-delegated";
  return "agent-proposed-pending";
}

/** "supersedes D-042" / "reverts D-042a" in the text → chain link. */
function findSupersedes(text: string): string | undefined {
  const m = text.match(/\b(?:supersedes?|reverts?|replaces?|overrides?)\s+(?:decision\s+)?D-(\d+[a-z]?)\b/i);
  return m ? `D-${m[1]}` : undefined;
}

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (EXCLUDE.test(p)) continue;
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (name.endsWith(".md")) yield p;
  }
}

const D_HEADING = /^#{2,3}\s+D-(\d+[a-z]?)\s*[—–-]\s*(.+?)\s*$/;
const DATE_IN_HEADING = /\((\d{1,2}\s+\w+\s+\d{4})\)\s*$/;
const FLAG_LINE = /^\s*[-*]?\s*FLAG:\s*(.+)$/;
const RULING_LINE = /founder[^.\n]{0,80}(approved|ruled|decided|said|authorized|accepted)[^.\n]{0,160}/i;

function firstParagraph(lines: string[], start: number): string {
  const out: string[] = [];
  for (let i = start; i < Math.min(start + 12, lines.length); i++) {
    const l = lines[i].trim();
    if (!l) { if (out.length) break; continue; }
    if (/^#{1,4}\s/.test(l) || /^[-*]\s+\*\*/.test(l) && out.length) break;
    out.push(l.replace(/\*\*/g, ""));
    if (out.join(" ").length > 400) break;
  }
  return out.join(" ").slice(0, 400);
}

function yamlEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const precedents: Precedent[] = [];
let scanned = 0;

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    scanned++;
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(D_HEADING);
      if (m) {
        const dateM = m[2].match(DATE_IN_HEADING);
        const title = m[2].replace(DATE_IN_HEADING, "").trim();
        const summary = firstParagraph(lines, i + 1);
        precedents.push({
          id: `D-${m[1]}`,
          kind: "decision-record",
          title,
          date: dateM?.[1],
          source_file: rel,
          summary,
          provenance_status: classifyStatus("decision-record", `${title} ${summary}`),
          supersedes: findSupersedes(`${title} ${summary}`),
        });
        continue;
      }
      const f = lines[i].match(FLAG_LINE);
      if (f && /progress|status|delegation|modern-islam|inventions/.test(rel)) {
        precedents.push({
          id: `flag-${rel.replace(/[^a-z0-9]+/gi, "-").slice(0, 60)}-${i}`,
          kind: "flag",
          title: f[1].slice(0, 120),
          source_file: rel,
          summary: f[1].slice(0, 400),
        });
        continue;
      }
      // Skip table rows: a status.md lane table is not a ruling, and its truncated
      // row becomes a garbage "title" that wins bogus precedent matches.
      // Rulings are mined from ALL docs — lane README/progress/plan files all carry them.
      if (!lines[i].trim().startsWith("|") && RULING_LINE.test(lines[i])) {
        const t = lines[i].trim().slice(0, 300);
        // Title = the founder-ruling clause itself, not the line's head — a status
        // header or table intro makes a garbage title that wins bogus matches.
        const clause = t.match(/founder[^.\n]{0,140}/i)?.[0]?.trim() ?? t.slice(0, 120);
        precedents.push({
          id: `ruling-${rel.replace(/[^a-z0-9]+/gi, "-").slice(0, 50)}-${i}`,
          kind: "ruling",
          title: clause.slice(0, 140),
          source_file: rel,
          summary: t,
          provenance_status: classifyStatus("ruling", t),
          supersedes: findSupersedes(t),
        });
      }
    }
  }
}

const byKind = precedents.reduce<Record<string, number>>((a, p) => {
  a[p.kind] = (a[p.kind] ?? 0) + 1;
  return a;
}, {});

const yaml = [
  "# Generated by scripts/decisions/extract-precedents.ts — do not hand-edit; re-run the script.",
  `# Scanned ${scanned} markdown files under docs/ on ${new Date().toISOString().slice(0, 10)}.`,
  "# Each entry is a precedent an autonomous decision may cite: a founder or lane ruling already on record.",
  "precedents:",
  ...precedents.map((p) => [
    `  - id: "${p.id}"`,
    `    kind: ${p.kind}`,
    p.provenance_status ? `    provenance_status: ${p.provenance_status}` : null,
    p.supersedes ? `    supersedes: "${p.supersedes}"` : null,
    p.title ? `    title: "${yamlEscape(p.title)}"` : null,
    p.date ? `    date: "${p.date}"` : null,
    `    source_file: "${p.source_file}"`,
    `    summary: "${yamlEscape(p.summary)}"`,
  ].filter(Boolean).join("\n")),
].join("\n") + "\n";

if (process.argv.includes("--write")) {
  writeFileSync(OUT, yaml);
  console.log(`wrote ${OUT}: ${precedents.length} precedents (${JSON.stringify(byKind)}) from ${scanned} files`);
} else {
  console.log(`would write ${OUT}: ${precedents.length} precedents (${JSON.stringify(byKind)}) from ${scanned} files`);
  console.log(yaml.split("\n").slice(0, 40).join("\n"));
}
