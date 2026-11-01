// Shared loaders and helpers for the build pipeline.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import edtf from "edtf";
import { parse } from "yaml";

export const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const p = (...parts: string[]) => join(ROOT, ...parts);
export const rel = (f: string) => relative(ROOT, f);

export const CLASSES = [
  "person", "group", "polity", "event", "period", "journey", "place", "building", "object",
  "media", "work", "passage", "concept", "language", "practice", "exhibit", "question", "source", "dataset", "listing", "screen", "job",
] as const;
export type EntityClass = (typeof CLASSES)[number];
// Languages that have UI strings (i18n/<lang>.yaml); prose may exist in any of them.
export const LANGS = ["en", "ar", "ur"] as const;
// Languages the site publishes now (docs/language.md): Arabic canonical, English published as its Phase-4 translation.
export const PUBLISHED_LANGS = ["ar", "en", "ur"] as const;

export type Localized = Record<string, string>;
export interface Entity {
  id: string; class: EntityClass; label: Localized; summary: Localized;
  relations?: any[]; sources?: string[]; [k: string]: any;
}
export interface Prose { id: string; lang: string; file: string; frontmatter: Record<string, any>; body: string }

export function readYaml<T = any>(file: string): T {
  return parse(readFileSync(file, "utf8")) as T;
}

export function listFiles(dir: string, ext: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(f, ext));
    else if (e.name.endsWith(ext)) out.push(f);
  }
  return out.sort();
}

export function loadEnumIds(name: string): string[] {
  return readYaml<any[]>(p("schema", "enums", `${name}.yaml`)).map((x) => (typeof x === "string" ? x : x.id));
}

export interface Stub { id: string; label?: Localized; note?: string }
// Parsing ~17,000 entity files takes seconds, and the pipeline tests load them once per test. The parsed
// result is kept for the life of the process and handed out as a fresh deep copy, so a caller that mutates
// its copy cannot change what the next caller sees. A test that edits a data file on disk must call
// clearRepoCache() before it reads the repository again.
let entityCache: { entity: Entity; file: string }[] | null = null;
let stubCache: Stub[] | null = null;

export function clearRepoCache(): void {
  entityCache = null;
  stubCache = null;
}

export function loadStubs(): Stub[] {
  // data/_stubs.yaml plus any data/_stubs.d/*.yaml, so parallel contributors never edit the same file
  if (!stubCache) {
    const files = [p("data", "_stubs.yaml"), ...listFiles(p("data", "_stubs.d"), ".yaml")];
    stubCache = files.filter((f) => existsSync(f)).flatMap((f) => readYaml<Stub[]>(f) ?? []);
  }
  return structuredClone(stubCache);
}

export function loadEntities(): { entity: Entity; file: string }[] {
  if (!entityCache) {
    const out: { entity: Entity; file: string }[] = [];
    for (const cls of CLASSES) {
      for (const file of listFiles(p("data", cls), ".yaml")) out.push({ entity: readYaml<Entity>(file), file });
    }
    entityCache = out;
  }
  return structuredClone(entityCache);
}

export function loadProse(): Prose[] {
  const out: Prose[] = [];
  for (const file of listFiles(p("content"), ".md")) {
    const r = rel(file).split("/"); // content/<lang>/<class>/<slug>.md
    if (r.length !== 4) continue; // skips content/<lang>/_pages/*
    const raw = readFileSync(file, "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const fm = m ? (parse(m[1]) ?? {}) : {};
    out.push({ id: `${r[2]}/${r[3].replace(/\.md$/, "")}`, lang: r[1], file, frontmatter: fm, body: m ? m[2] : raw });
  }
  return out;
}

// ---------- dates ----------
/** Decimal year (CE, astronomical; proleptic-Gregorian arithmetic) from epoch ms. */
export function msToYear(ms: number): number {
  return 1970 + ms / (365.2425 * 86_400_000);
}
export interface Range { earliest: number; latest: number }

/** Parse an EDTF string into a numeric year range; throws on invalid input. */
export function edtfRange(s: string): Range {
  const d: any = edtf(s);
  return { earliest: msToYear(d.min), latest: msToYear(d.max) };
}

export function dateRange(d: any): Range | undefined {
  if (!d) return undefined;
  if (d.edtf) return edtfRange(d.edtf);
  return undefined;
}

export function parseRef(ref: string): { cls: string; slug: string } {
  const [cls, slug] = ref.split("/");
  return { cls, slug };
}

// ---------- predicates ----------
export interface Predicate { inverse: string; domain: string[]; range: string[]; label: Localized; inverse_label: Localized; temporal: boolean }
export interface ResolvedPredicate { canonical: string; reversed: boolean; pred: Predicate }

export function loadPredicates(): Record<string, Predicate> {
  return readYaml<Record<string, Predicate>>(p("schema", "predicates.yaml"));
}

/** Resolve a written predicate (forward or inverse name) to its canonical forward form. */
export function resolvePredicates(preds: Record<string, Predicate>): Map<string, ResolvedPredicate> {
  const m = new Map<string, ResolvedPredicate>();
  for (const [name, pred] of Object.entries(preds)) m.set(name, { canonical: name, reversed: false, pred });
  for (const [name, pred] of Object.entries(preds)) {
    if (!m.has(pred.inverse)) m.set(pred.inverse, { canonical: name, reversed: true, pred });
  }
  return m;
}
