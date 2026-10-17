// 3D Virtual Tour data helpers: time-journeys loaded from tour/journeys.yaml.
// Follows site/src/lib/kids.ts conventions: data files hold bilingual strings,
// the loader validates shape/count, view*() selects the page language.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";

export interface Bilingual { ar: string; en: string }

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

/** Select the page language for each journey; narration lines stay plain text. */
export function viewJourneys(journeys: Journey[], lang: Lang): JourneyView[] {
  return journeys.map((j) => ({
    id: j.id,
    kind: j.kind,
    build: j.build,
    title: j.title[lang],
    sub: j.sub[lang],
    lines: j.lines[lang],
  }));
}
