// Enrichment register: derives every enrichment gap live from data/ and content/, prints a summary,
// writes docs/library/enrichment/queue/<gap>.<class>.txt shards and status.yaml, and answers
// filtered queries for agents. Build-time only. See docs/library/enrichment/README.md.
//
//   npm run enrichment-queue                       regenerate shards + status.yaml + README counts
//   npm run enrichment-queue -- --gap wikidata --class person --limit 50     print the next items (no writes)
//   flags: --gap <prefix>  --class <c>  --limit <n>  --all (include claimed items)  --write (force writes with filters)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";

export const ROOT = process.cwd();
export const OUT = "docs/library/enrichment";
const QUEUE = `${OUT}/queue`;
const SHARD_MAX = 1_400_000; // bytes, under the 1.5 MB cap
const LANGS = ["ar", "en", "ur"] as const;

// ---------- gap catalogue (the README documents each; keep in step) ----------
const WD_CLASSES = ["person", "place", "building", "group", "polity", "work", "object", "event", "concept", "award", "language", "period", "invention"];
const PROSE_CLASSES = ["award", "building", "concept", "course", "event", "exhibit", "group", "invention", "job", "journey", "language", "listing", "object", "period", "person", "place", "polity", "practice", "question", "screen", "work"];
// secondary identifiers: id name -> classes where the museum normally records it (registered in schema/external-id-patterns.yaml)
const ID_GAPS: Record<string, string[]> = {
  viaf: ["person", "work"],
  openiti: ["work", "person"],
  biblissima: ["work"],
  geonames: ["place"],
  pleiades: ["place"],
  idai: ["place"],
};
// Not queued: archnet and unesco (a record either has one or the site has no such entry; the graph cannot tell which, so a gap list would be noise).
// viaf and openiti on persons are limited to persons who authored a work; on works to kind book.
// partial-prose thresholds (characters of body text without frontmatter, headings and citation tokens)
export const PARTIAL = { minChars: 500, minCharsOneSection: 1500 };

type Ent = {
  id: string; cls: string; slug: string; label: string; labelAr: string; kind: string;
  ext: Record<string, any>; sources: string[]; out: number; wd: string; review: string;
  hasBorn: boolean; hasDied: boolean; hasCoords: boolean; hasDate: boolean; hasComposed: boolean; hasAuthor: boolean; summaryLangs: number;
};
type Prose = { chars: number; heads: number; draft: boolean };

const walk = (dir: string, ext: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(ext) && !f.startsWith("_")).map((f) => join(dir, f));
};
const slugOf = (f: string) => f.replace(/^.*\//, "").replace(/\.(yaml|md)$/, "");

function loadProse(lang: string, cls: string): Map<string, Prose> {
  const m = new Map<string, Prose>();
  for (const f of walk(`content/${lang}/${cls}`, ".md")) {
    const raw = readFileSync(f, "utf8");
    const fm = raw.startsWith("---") ? raw.indexOf("\n---", 3) : -1;
    const head = fm > 0 ? raw.slice(0, fm) : "";
    let body = fm > 0 ? raw.slice(fm + 4) : raw;
    const heads = (body.match(/^#{2,3} /gm) || []).length;
    body = body.replace(/^#+ .*$/gm, "").replace(/\{cite:[^}]*\}/g, "").replace(/\[\[[^|\]]*\|?([^\]]*)\]\]/g, "$1").replace(/\s+/g, " ").trim();
    m.set(slugOf(f), { chars: [...body].length, heads, draft: /review:\s*draft/.test(head) });
  }
  return m;
}

export type Item = { gap: string; cls: string; slug: string; score: number; text: string };

export function build(): { items: Item[]; stats: Record<string, any>; seconds: number } {
  const t0 = Date.now();
  const classes = readdirSync("data").filter((d) => statSync(`data/${d}`).isDirectory());
  const ents: Ent[] = [];
  const inbound = new Map<string, number>();
  const authored = new Set<string>(); // works targeted by an `authored` edge
  const authorIds = new Set<string>(); // persons who wrote at least one work
  const inc = (id: string) => inbound.set(id, (inbound.get(id) || 0) + 1);

  for (const cls of classes) {
    if (cls === "passage") continue; // text records from frozen sources; never an enrichment target here
    for (const f of walk(`data/${cls}`, ".yaml")) {
      let d: any;
      try { d = parse(readFileSync(f, "utf8")); } catch { continue; }
      if (!d?.id) continue;
      const rel = Array.isArray(d.relations) ? d.relations : [];
      for (const r of rel) { if (r?.target) inc(r.target); if (r?.type === "authored" && r.target) { authored.add(r.target); authorIds.add(d.id); } if (r?.type === "written_by" && r.target) authorIds.add(r.target); }
      if (Array.isArray(d.authors)) for (const a of d.authors) { const t = typeof a === "string" ? a : a?.id || a?.person; if (t) { inc(t); authorIds.add(t); } }
      const src: string[] = Array.isArray(d.sources) ? d.sources.map((s: any) => (typeof s === "string" ? s : s?.id || "")).filter(Boolean) : [];
      const sm = d.summary || {};
      ents.push({
        id: d.id, cls, slug: slugOf(f), label: d.label?.en || d.label?.ar || slugOf(f), labelAr: d.label?.ar || "", kind: d.kind || "",
        ext: d.external_ids || {}, sources: src, out: rel.length, wd: d.external_ids?.wikidata || "",
        review: d.status?.review || "",
        hasBorn: !!d.born, hasDied: !!d.died, hasCoords: Array.isArray(d.coordinates) && d.coordinates.length === 2,
        hasDate: !!d.date, hasComposed: !!d.composed || !!d.date, hasAuthor: (Array.isArray(d.authors) && d.authors.length > 0) || rel.some((r: any) => r?.type === "written_by"),
        summaryLangs: LANGS.filter((l) => sm[l]).length,
      });
    }
  }

  const prose: Record<string, Map<string, Prose>> = {};
  for (const l of LANGS) for (const c of PROSE_CLASSES) prose[`${l}/${c}`] = loadProse(l, c);

  const items: Item[] = [];
  const ids = new Set(ents.map((e) => e.id));
  const sc = (e: Ent) => 3 * (inbound.get(e.id) || 0) + Math.min(e.out, 20) + Math.min(e.sources.length, 5) + (prose[`ar/${e.cls}`]?.has(e.slug) ? 2 : 0);
  const info = (e: Ent, extra = "") => `${e.label}${e.labelAr && e.labelAr !== e.label ? " | " + e.labelAr : ""}\t${[e.kind && `kind=${e.kind}`, e.wd && `wd=${e.wd}`, `in=${inbound.get(e.id) || 0}`, `rel=${e.out}`, `src=${e.sources.length}`, extra].filter(Boolean).join(" ")}`;
  const push = (gap: string, e: Ent, extra = "") => items.push({ gap, cls: e.cls, slug: e.slug, score: sc(e), text: info(e, extra) });

  for (const e of ents) {
    if (WD_CLASSES.includes(e.cls) && !e.wd) push("wikidata", e);
    for (const [idn, cl] of Object.entries(ID_GAPS)) {
      if (!cl.includes(e.cls) || e.ext[idn]) continue;
      if ((idn === "viaf" || idn === "openiti") && e.cls === "person" && !authorIds.has(e.id)) continue;
      if (e.cls === "work" && e.kind !== "book") continue;
      push(`id.${idn}`, e);
    }
    if (PROSE_CLASSES.includes(e.cls)) {
      for (const l of LANGS) {
        const p = prose[`${l}/${e.cls}`].get(e.slug);
        if (!p) push(`prose.missing.${l}`, e);
        else {
          if (p.chars < PARTIAL.minChars || (p.heads < 2 && p.chars < PARTIAL.minCharsOneSection)) push(`prose.partial.${l}`, e, `chars=${p.chars} sections=${p.heads}`);
          if (p.draft) push(`review.draft.${l}`, e, `chars=${p.chars}`);
        }
      }
    }
    if (e.cls !== "source" && e.cls !== "media") {
      if (e.sources.length === 0) push("sources.none", e);
      else if (e.sources.length === 1 && /^source\/(wikipedia|wikidata)-/.test(e.sources[0])) push("sources.weak", e, `only=${e.sources[0]}`);
    }
    if (e.cls === "person") { if (!e.hasBorn) push("fact.born", e); if (!e.hasDied) push("fact.died", e); }
    if (e.cls === "place" && !e.hasCoords) push("fact.coordinates", e);
    if (e.cls === "event" && !e.hasDate) push("fact.date", e);
    if (e.cls === "work") {
      if (!e.hasAuthor && !authored.has(e.id)) push("fact.author", e);
      if (!e.hasComposed) push("fact.composed", e);
    }
  }

  // wanted stubs: referenced-but-missing records
  const stubFiles = ["data/_stubs.yaml", ...walk("data/_stubs.d", ".yaml")];
  const seen = new Set<string>();
  for (const f of stubFiles) {
    let arr: any;
    try { arr = parse(readFileSync(f, "utf8")); } catch { continue; }
    if (!Array.isArray(arr)) continue;
    for (const s of arr) {
      const id: string = s?.id;
      if (!id || ids.has(id) || seen.has(id)) continue;
      seen.add(id);
      const [cls, slug] = id.split("/");
      items.push({ gap: "stub", cls, slug, score: 3 * (inbound.get(id) || 0), text: `${s.label?.en || s.label?.ar || slug}${s.label?.ar ? " | " + s.label.ar : ""}\tin=${inbound.get(id) || 0} stub=${f.replace("data/", "")}${s.note ? " note=" + String(s.note).replace(/\s+/g, " ").slice(0, 80) : ""}` });
    }
  }

  items.push(...ledgerItems());
  const stats: Record<string, any> = { entities: ents.length, stubs_wanted: seen.size };
  return { items, stats, seconds: (Date.now() - t0) / 1000 };
}


// ---------- ledger items: GEMINI lines, flagged links and mismatches, open lane items (text-derived, nothing invented) ----------
function walkMd(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walkMd(p, out); else if (n.endsWith(".md")) out.push(p);
  }
  return out;
}
export function ledgerItems(): Item[] {
  const items: Item[] = [];
  const done = /\b(resolved|answered|fixed|done|merged|closed)\b/i;
  const flagFiles = [...walkMd("docs/delegation/lane-ledgers"), "docs/delegation/web-sources-progress.md", ...walkMd("docs/delegation/library")].filter((f) => existsSync(f));
  const mk = (gap: string, f: string, n: number, line: string, score: number) =>
    items.push({ gap, cls: "ledger", slug: `${slugOf(f)}-L${n}`, score, text: `${line.trim().replace(/\s+/g, " ").slice(0, 220)}\tfile=${f}:${n}` });
  for (const f of walkMd("docs/delegation")) {
    const lines = readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => { if (l.includes("GEMINI:") && !done.test(l)) mk("ledger.gemini", f, i + 1, l, 10); });
  }
  for (const f of flagFiles) {
    const lines = readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => { if (/unlinked|mismatch|identity|unmatched|needs link/i.test(l) && !done.test(l) && !l.includes("GEMINI:") && !l.startsWith("#")) mk("ledger.flagged", f, i + 1, l, 5); });
  }
  for (const f of walkMd("docs/delegation/lane-ledgers")) {
    const lines = readFileSync(f, "utf8").split("\n");
    let on = false, founder = false;
    lines.forEach((l, i) => {
      if (/^#{1,3} /.test(l)) { on = /resume point|^#+ next|open|pending|held|not decided|todo/i.test(l); founder = /not decided/i.test(l); return; }
      if (on && /^\s*[-*] /.test(l) && !done.test(l)) mk("ledger.open", f, i + 1, (founder ? "HELD FOR THE FOUNDER (skip): " : "") + l, founder ? 1 : 3);
    });
  }
  return items;
}

// ---------- claims ----------
export type Claim = { id: string; gap: string; class?: string; slugs?: string[]; range?: string; agent: string; state: string; date: string; prs?: number[]; reason?: string; note?: string };
export function loadClaims(): Claim[] {
  const f = `${OUT}/claims.yaml`;
  if (!existsSync(f)) return [];
  const d = parse(readFileSync(f, "utf8"));
  return Array.isArray(d?.claims) ? d.claims : Array.isArray(d) ? d : [];
}
export const gapMatch = (claimGap: string, gap: string) => gap === claimGap || gap.startsWith(claimGap + ".");
export function claimCovers(c: Claim, it: Item): boolean {
  if (c.state === "open" || c.state === "done") return false; // done: the gap itself disappears once the fix is merged
  if (!gapMatch(c.gap, it.gap)) return false;
  if (c.class && c.class !== "*" && c.class !== it.cls) return false;
  if (c.slugs) return c.slugs.includes(it.slug);
  if (c.range) { const [a, b] = c.range.split(".."); return it.slug >= a && it.slug <= b; }
  return true;
}

// ---------- output ----------
const fmtLine = (i: Item) => `${i.score}\t${i.slug}\t${i.text}`;
function writeShards(items: Item[]) {
  if (existsSync(QUEUE)) rmSync(QUEUE, { recursive: true });
  mkdirSync(QUEUE, { recursive: true });
  const by = new Map<string, Item[]>();
  for (const i of items) { const k = `${i.gap}.${i.cls}`; (by.get(k) || by.set(k, []).get(k)!).push(i); }
  let files = 0;
  for (const [k, arr] of [...by].sort()) {
    arr.sort((a, b) => b.score - a.score || (a.slug < b.slug ? -1 : 1));
    const lines = arr.map(fmtLine);
    const header = (n: number, part?: number) => `# gap=${k.slice(0, k.lastIndexOf("."))} class=${k.slice(k.lastIndexOf(".") + 1)} items=${n}${part ? ` part=${part}` : ""}\n# score<TAB>slug<TAB>label<TAB>facts (highest score first; see docs/library/enrichment/README.md)\n`;
    let part = 1, buf: string[] = [], size = 0;
    const total = lines.length;
    const flush = (last: boolean) => {
      const name = part === 1 && last ? `${k}.txt` : `${k}.part${part}.txt`;
      writeFileSync(`${QUEUE}/${name}`, header(total, part === 1 && last ? undefined : part) + buf.join("\n") + "\n");
      files++; part++; buf = []; size = 0;
    };
    for (const l of lines) { if (size + l.length + 1 > SHARD_MAX) flush(false); buf.push(l); size += l.length + 1; }
    flush(true);
  }
  return files;
}

function counts(items: Item[], claims: Claim[]) {
  const t: Record<string, Record<string, { open: number; claimed: number }>> = {};
  for (const i of items) {
    const claimed = claims.some((c) => claimCovers(c, i));
    const g = (t[i.gap] ||= {});
    const c = (g[i.cls] ||= { open: 0, claimed: 0 });
    claimed ? c.claimed++ : c.open++;
  }
  return t;
}

function arg(n: string) { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : undefined; }
const flag = (n: string) => process.argv.includes(`--${n}`);

export function main() {
  const { items, stats, seconds } = build();
  const claims = loadClaims();
  const gapF = arg("gap"), clsF = arg("class"), limit = Number(arg("limit") || 0);
  const filtered = !!(gapF || clsF || limit);
  if (filtered) {
    let sel = items.filter((i) => (!gapF || gapMatch(gapF, i.gap)) && (!clsF || i.cls === clsF));
    if (!flag("all")) sel = sel.filter((i) => !claims.some((c) => claimCovers(c, i)));
    sel.sort((a, b) => b.score - a.score || (a.slug < b.slug ? -1 : 1));
    const n = limit || 50;
    console.log(`# ${sel.length} open items match; showing ${Math.min(n, sel.length)} (score, gap, class/slug, label, facts)`);
    for (const i of sel.slice(0, n)) console.log(`${i.score}\t${i.gap}\t${i.cls}/${i.slug}\t${i.text}`);
    console.error(`(${seconds.toFixed(1)}s)`);
    if (!flag("write")) return;
  }
  const files = writeShards(items);
  const table = counts(items, claims);
  const today = new Date().toISOString().slice(0, 10);
  const status = { generated: today, seconds: Math.round(seconds), entities: stats.entities, shard_files: files, partial_thresholds: PARTIAL, gaps: table };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/status.yaml`, "# Generated by npm run enrichment-queue. Do not edit.\n" + stringify(status));
  // README counts block
  const rd = `${OUT}/README.md`;
  if (existsSync(rd)) {
    const lines: string[] = ["| Gap | Total open | Claimed or closed | By class (open) |", "|---|---|---|---|"];
    for (const g of Object.keys(table).sort()) {
      const o = Object.values(table[g]).reduce((a, b) => a + b.open, 0), c = Object.values(table[g]).reduce((a, b) => a + b.claimed, 0);
      const by = Object.entries(table[g]).filter(([, v]) => v.open).sort((a, b) => b[1].open - a[1].open).map(([k, v]) => `${k} ${v.open}`).join(", ");
      lines.push(`| \`${g}\` | ${o} | ${c} | ${by} |`);
    }
    const md = readFileSync(rd, "utf8");
    const a = "<!-- COUNTS:START -->", b = "<!-- COUNTS:END -->";
    if (md.includes(a)) writeFileSync(rd, md.replace(new RegExp(`${a}[\\s\\S]*${b}`), `${a}\n${lines.join("\n")}\n${b}`));
  }
  console.log(`enrichment queue: ${items.length} gap items over ${stats.entities} entities, ${files} shard files, ${seconds.toFixed(1)}s`);
  for (const g of Object.keys(table).sort()) console.log(`  ${g.padEnd(24)} ${Object.values(table[g]).reduce((a, b) => a + b.open, 0)}`);
}

if (process.argv[1] && /enrichment-queue\.ts$/.test(process.argv[1])) main();
