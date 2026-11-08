#!/usr/bin/env tsx
/**
 * islamlab-match.ts — cross-match islamlab/islamic-scholars (HuggingFace)
 * madhhab labels against museum person records.
 *
 * The dataset is a LABELING ACCELERATOR ONLY (CC BY-NC-SA): matches feed the
 * tradition-attestation pipeline as corroborating signals — never sole
 * evidence, never republished as data.
 *
 * Match channel: normalized Arabic name (label.ar) + death-year sanity check.
 * Latin transliteration in the dataset is too inconsistent to match on.
 *
 * Output: docs/decisions/islamlab-match.jsonl (one row per dataset scholar)
 *         + summary to stdout.
 *
 * Usage: npx tsx scripts/decisions/islamlab-match.ts [--max-pages N]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const ROOT = process.cwd();
const PERSONS = join(ROOT, "data/person");
const OUT = join(ROOT, "docs/decisions/islamlab-match.jsonl");
const API = "https://datasets-server.huggingface.co/rows?dataset=islamlab%2Fislamic-scholars&config=default&split=train";

const MADHHAB_TO_TRADITION: Record<string, string> = {
  hanafi: "sunni-hanafi", maliki: "sunni-maliki",
  shafii: "sunni-shafii", "shafi'i": "sunni-shafii", hanbali: "sunni-hanbali",
  zahiri: "zahiri",
};

function normAr(s: string): string {
  return (s ?? "")
    .replace(/[ً-ْٰـ]/g, "")            // tashkeel + superscript alef + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/\s+/g, " ").trim();
}

function ceYear(doc: any): number | null {
  const edtf = doc?.died?.edtf ?? doc?.died?.ce ?? doc?.died?.year;
  if (typeof edtf === "number") return edtf;
  if (typeof edtf === "string") { const m = edtf.match(/-?\d{3,4}/); return m ? parseInt(m[0]) : null; }
  const h = doc?.died?.hijri;
  if (typeof h === "string") { const m = h.match(/\d{3,4}/); if (m) return Math.round(parseInt(m[0]) * 0.618 + 622); }
  return null;
}

function personTraditions(doc: any): string[] {
  const out: string[] = [];
  for (const t of doc?.traditions ?? []) if (typeof t === "string") out.push(t);
  for (const f of doc?.faith ?? []) {
    const v = String(f?.value ?? "");
    if (v && v !== "unknown" && v !== "other") out.push(v);
  }
  return out;
}

async function fetchRows(offset: number, length: number): Promise<any[]> {
  const res = await fetch(`${API}&offset=${offset}&length=${length}`);
  if (!res.ok) throw new Error(`HF rows HTTP ${res.status}`);
  const j: any = await res.json();
  return (j.rows ?? []).map((r: any) => r.row);
}

async function main() {
  const maxPages = process.argv.includes("--max-pages")
    ? parseInt(process.argv[process.argv.indexOf("--max-pages") + 1]) : Infinity;

  // index persons by normalized Arabic label
  const byName = new Map<string, { id: string; ce: number | null; traditions: string[] }[]>();
  for (const fn of readdirSync(PERSONS).filter(f => f.endsWith(".yaml"))) {
    let doc: any;
    try { doc = parse(readFileSync(join(PERSONS, fn), "utf8")); } catch { continue; }
    const ar = doc?.label?.ar;
    if (!ar) continue;
    const key = normAr(ar);
    const id = fn.replace(/\.yaml$/, "");
    const entry = { id, ce: ceYear(doc), traditions: personTraditions(doc) };
    const arr = byName.get(key) ?? []; arr.push(entry); byName.set(key, arr);
  }
  console.log(`person index: ${byName.size} unique Arabic names`);

  // fetch dataset
  const rows: any[] = [];
  for (let off = 0; off < 100000; off += 100) {
    const batch = await fetchRows(off, 100);
    if (!batch.length) break;
    rows.push(...batch);
    if (rows.length >= 2400 || off / 100 + 1 >= maxPages) break;
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`dataset rows: ${rows.length}`);

  // dedupe scholars by (name_ar, death_year_ce)
  const seen = new Set<string>();
  const scholars: any[] = [];
  for (const r of rows) {
    const k = `${normAr(r.name_ar)}|${r.death_year_ce}`;
    if (seen.has(k)) continue;
    seen.add(k); scholars.push(r);
  }
  console.log(`unique scholars: ${scholars.length}`);

  const out = writeFileSync(OUT, "");
  const stats = { total: 0, matched: 0, agree: 0, compatible: 0, disagree: 0,
    islamlab_empty: 0, ambiguous_name: 0, year_mismatch: 0, unmatched: 0 };
  const FAMILY: Record<string, string[]> = {
    "sunni-hanafi": ["sunni-hanafi", "sunni"], "sunni-maliki": ["sunni-maliki", "sunni"],
    "sunni-shafii": ["sunni-shafii", "sunni"], "sunni-hanbali": ["sunni-hanbali", "sunni"],
    "zahiri": ["zahiri"],
  };

  for (const r of scholars) {
    stats.total++;
    const madhhab = String(r.madhhab ?? "").trim().toLowerCase();
    const want = MADHHAB_TO_TRADITION[madhhab];
    const key = normAr(r.name_ar);
    const cands = byName.get(key) ?? [];
    if (!cands.length) { stats.unmatched++; continue; }
    if (cands.length > 1) {
      // disambiguate by death year when possible
      const dy = r.death_year_ce;
      const narrowed = dy != null ? cands.filter(c => c.ce == null || Math.abs(c.ce - dy) <= 2) : cands;
      if (narrowed.length !== 1) { stats.ambiguous_name++; continue; }
      cands.length = 0; cands.push(...narrowed);
    }
    const p = cands[0];
    stats.matched++;
    let verdict = "unlabeled-match";
    if (!want) { stats.islamlab_empty++; verdict = "islamlab-empty"; }
    else {
      const have = p.traditions.map(normAr);
      const ok = FAMILY[want] ?? [want];
      if (have.some(h => ok.includes(h) || h === want)) { stats.agree++; verdict = "agree"; }
      else if (have.includes("sunni") && want.startsWith("sunni-")) { stats.compatible++; verdict = "compatible"; }
      else if (have.length === 0 || have.every(h => ["unknown", "other"].includes(h))) { verdict = "museum-unlabeled"; }
      else { stats.disagree++; verdict = "disagree"; }
    }
    if (r.death_year_ce != null && p.ce != null && Math.abs(p.ce - r.death_year_ce) > 2) {
      stats.year_mismatch++; verdict += "+year-mismatch";
    }
    const line = JSON.stringify({ scholar_id: r.scholar_id, name_ar: r.name_ar, name_lat: r.name_lat,
      death_ce: r.death_year_ce, madhhab: r.madhhab || null, want_tradition: want ?? null,
      person_id: p.id, person_traditions: p.traditions, person_ce: p.ce, verdict }) + "\n";
    writeFileSync(OUT, line, { flag: "a" });
  }
  console.log(JSON.stringify(stats, null, 1));
  console.log(`-> ${OUT}`);
}
main().catch(e => { console.error(e); process.exit(1); });
