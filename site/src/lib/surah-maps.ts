// Surah thematic maps: the researched YAML files under <repo>/surah-maps/<nn>-<slug>.yaml.
// Loaded at build time only (never shipped to the client except through page payloads).
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";

export interface MapTitle { ar: string; en: string }
export interface MapKid { title: MapTitle; range: [number, number] }
export interface MapSection { title: MapTitle; range: [number, number]; family: string; summary: MapTitle; children: MapKid[] }
export interface SurahMapFile { surah: number; slug: string; map: MapSection[] }

const dir = () => repoPath("surah-maps");

/** All available maps, sorted by surah number. */
export function listSurahMaps(): { n: number; slug: string }[] {
  return readdirSync(dir())
    .filter((f) => /^\d{3}-.*\.yaml$/.test(f))
    .map((f) => { const m = f.match(/^(\d{3})-(.*)\.yaml$/)!; return { n: parseInt(m[1], 10), slug: m[2] }; })
    .sort((a, b) => a.n - b.n);
}

const cache = new Map<string, SurahMapFile>();
export function loadSurahMap(slug: string): SurahMapFile {
  const hit = cache.get(slug);
  if (hit) return hit;
  const entry = listSurahMaps().find((e) => e.slug === slug);
  if (!entry) throw new Error(`surah-maps: no map for slug ${slug}`);
  const raw = parse(readFileSync(`${dir()}/${String(entry.n).padStart(3, "0")}-${slug}.yaml`, "utf8"));
  const file: SurahMapFile = { surah: raw.surah, slug: raw.slug, map: raw.map };
  // Build assertion: sections must partition [1, N] exactly.
  let v = 1;
  for (const s of file.map) {
    const [a, b] = s.range;
    if (a !== v || b < a) throw new Error(`surah-maps/${slug}: sections do not partition (expected ${v}, got ${a})`);
    v = b + 1;
  }
  cache.set(slug, file);
  return file;
}

export function surahSlug(n: number): string | undefined {
  return listSurahMaps().find((e) => e.n === n)?.slug;
}
