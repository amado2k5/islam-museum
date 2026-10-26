// 3D Virtual Tour data helpers: time-journeys (tour/journeys.yaml) and Objects-hall exhibits (tour/exhibits.yaml).
// Follows site/src/lib/kids.ts conventions: data files hold bilingual strings,
// the loader validates shape/count, view*() selects the page language.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";

export interface Bilingual { ar: string; en: string; ur?: string }

export interface Journey {
  id: string;
  kind: string;
  build: string;
  title: Bilingual;
  sub: Bilingual;
  lines: { ar: string[]; en: string[] };
}

/** View model for Tour3D.astro: lang-selected title/sub, narration lines as plain strings. */
export interface JourneyView {
  id: string;
  kind: string;
  build: string;
  title: string;
  sub: string;
  lines: string[];
}

export function loadJourneys(): Journey[] {
  const raw = parse(readFileSync(repoPath("tour/journeys.yaml"), "utf8")) as {
    journeys?: Journey[];
  };
  const journeys = raw?.journeys;
  if (!journeys || journeys.length !== 7)
    throw new Error("tour/journeys.yaml: expected exactly 7 journeys");
  const ids = new Set(journeys.map((j) => j.id));
  if (ids.size !== 7) throw new Error("tour/journeys.yaml: journey ids must be unique");
  for (const j of journeys) {
    if (
      !j.id ||
      !j.kind ||
      !j.build ||
      !j.title?.ar ||
      !j.title?.en ||
      !j.sub?.ar ||
      !j.sub?.en ||
      !Array.isArray(j.lines?.ar) ||
      j.lines.ar.length === 0 ||
      !Array.isArray(j.lines?.en) ||
      j.lines.en.length !== j.lines.ar.length ||
      j.lines.ar.some((l) => !l) ||
      j.lines.en.some((l) => !l)
    )
      throw new Error(`tour/journeys.yaml: journey ${j.id || "?"} has a missing field or empty line`);
  }
  return journeys;
}

/** Select the page language for each journey; narration lines stay plain text.
 *  A language the data has not been translated into yet (ur) falls back to English, as i18n/ui() does for UI strings. */
export function viewJourneys(journeys: Journey[], lang: Lang): JourneyView[] {
  const pick = <T,>(b: Record<string, T>): T => b[lang] ?? b.en;
  return journeys.map((j) => ({
    id: j.id,
    kind: j.kind,
    build: j.build,
    title: pick(j.title),
    sub: pick(j.sub),
    lines: pick(j.lines),
  }));
}

export interface Trilingual { ar: string; en: string; ur: string }

/** One Objects-hall stop: a procedural mesh (`build`) labelled from an object record. */
export interface Exhibit {
  id: string;
  build: string;
  record: string;
  sources: string[];
  label: Trilingual;
  desc: Trilingual;
  material?: Trilingual;
  museum?: Trilingual;
}

export interface ExhibitView {
  id: string;
  build: string;
  record: string;
  label: string;
  desc: string;
  material: string;
  museum: string;
}

export const EXHIBIT_BUILDS = ["astrolabe", "manuscript", "vase", "dirham", "lamp"];
const LANGS3 = ["ar", "en", "ur"] as const;
const full = (b: unknown): b is Trilingual =>
  !!b && LANGS3.every((l) => typeof (b as any)[l] === "string" && (b as any)[l].length > 0);

export function loadExhibits(): Exhibit[] {
  const raw = parse(readFileSync(repoPath("tour/exhibits.yaml"), "utf8")) as { exhibits?: Exhibit[] };
  const list = raw?.exhibits;
  if (!list || list.length !== EXHIBIT_BUILDS.length)
    throw new Error(`tour/exhibits.yaml: expected exactly ${EXHIBIT_BUILDS.length} exhibits`);
  if (new Set(list.map((e) => e.id)).size !== list.length) throw new Error("tour/exhibits.yaml: exhibit ids must be unique");
  for (const e of list) {
    const where = `tour/exhibits.yaml: exhibit ${e.id || "?"}`;
    if (!e.id || !EXHIBIT_BUILDS.includes(e.build)) throw new Error(`${where} has a missing id or unknown build`);
    if (!/^object\/[a-z0-9-]+$/.test(e.record || "")) throw new Error(`${where} needs an object/<slug> record`);
    if (!Array.isArray(e.sources) || !e.sources.length || e.sources.some((x) => !/^source\/[a-z0-9-]+$/.test(x)))
      throw new Error(`${where} needs sources: [source/<slug>, ...]`);
    if (!full(e.label) || !full(e.desc)) throw new Error(`${where} needs label and desc in ar, en and ur`);
    for (const k of ["material", "museum"] as const)
      if (e[k] !== undefined && !full(e[k])) throw new Error(`${where}: ${k} must have ar, en and ur`);
  }
  return list;
}

export function viewExhibits(list: Exhibit[], lang: Lang): ExhibitView[] {
  return list.map((e) => ({
    id: e.id,
    build: e.build,
    record: e.record,
    label: e.label[lang],
    desc: e.desc[lang],
    material: e.material?.[lang] ?? "",
    museum: e.museum?.[lang] ?? "",
  }));
}
