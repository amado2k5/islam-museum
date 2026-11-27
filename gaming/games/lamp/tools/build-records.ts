// Copies the museum records The Lamp of the Ages shows into data/records.json: label and summary in the seven
// languages (with the {cite:...} markers taken out), the year that sets the time dial, and the coordinates.
// Run: npm --prefix gaming run lamp:records. A test holds the file to a fresh run, so it never drifts from the graph.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { recordIds } from "../src/content";

const ROOT = resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const OUT = resolve(fileURLToPath(new URL("../data/records.json", import.meta.url)));
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;

const clean = (s: string): string => s
  .replace(/\s*\{cit[a-z]*:[^}]*\}/g, "")
  .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1")
  .replace(/\[\[([^\]]+)\]\]/g, "$1")
  .replace(/\s+([.,;:])/g, "$1")
  .replace(/\s{2,}/g, " ")
  .trim();

const yearOf = (edtf: unknown): number | null => {
  const m = typeof edtf === "string" ? /^(-?)(\d{4})/.exec(edtf) : null;
  return m ? (m[1] ? -1 : 1) * Number(m[2]) : null;
};

export interface LampRecord { label: Record<string, string>; summary: Record<string, string>; year: number | null; coords: [number, number] | null }

export function buildRecords(): Record<string, LampRecord> {
  const out: Record<string, LampRecord> = {};
  for (const id of recordIds()) {
    const [cls, slug] = id.split("/");
    const d = parse(readFileSync(resolve(ROOT, `data/${cls}/${slug}.yaml`), "utf8")) as Record<string, any>;
    if (d.id !== id) throw new Error(`${id}: the file says it is ${d.id}`);
    const label: Record<string, string> = {};
    const summary: Record<string, string> = {};
    for (const l of LANGS) {
      const lb = d.label?.[l] ?? d.label?.en ?? d.label?.ar; // a missing label falls back as on the museum's own page
      const sm = d.summary?.[l] ?? d.summary?.en;
      if (typeof lb !== "string" || typeof sm !== "string") throw new Error(`${id}: no label or summary for ${l}`);
      label[l] = clean(lb);
      summary[l] = clean(sm);
    }
    const year = yearOf(d.date?.start?.edtf) ?? yearOf(d.died?.edtf) ?? yearOf(d.born?.edtf);
    const c = d.coordinates;
    out[id] = { label, summary, year, coords: Array.isArray(c) && c.length === 2 ? [Number(c[0]), Number(c[1])] : null };
  }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(OUT, JSON.stringify(buildRecords(), null, 1) + "\n");
  console.log(`wrote ${OUT}`);
}
