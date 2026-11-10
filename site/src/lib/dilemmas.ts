// Dilemma cards (docs/delegation/education-master-plan.md §5 E4): real decisions from history, two
// or more attributed positions — each with a named holder and at least one source id from the
// graph — and never a verdict, winner or correct field. edu/dilemmas/<slug>.yaml, trilingual.
// This loader is the single integrity gate the pages and the tests share.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { byId } from "./graph";
import type { Tri } from "./edu";

export interface DilemmaPosition {
  holder: Tri;
  stance: Tri;
  evidence: Tri;
  sources: string[];
}
export interface Dilemma {
  id: string;
  band: "scholars" | "researchers";
  decision: Tri;
  context: Tri;
  positions: DilemmaPosition[];
  reflection: Tri;
}

const LANGS = ["ar", "en", "ur"] as const;
const BANNED = ["verdict", "winner", "correct"];
let cache: Dilemma[] | null = null;
export function loadDilemmas(): Dilemma[] {
  if (cache) return cache;
  const dir = repoPath("edu/dilemmas");
  const dilemmas: Dilemma[] = [];
  const seen = new Set<string>();
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".yaml")).sort()) {
    const d = parse(readFileSync(`${dir}/${f}`, "utf8")) as Dilemma & Record<string, unknown>;
    for (const b of BANNED)
      if (b in d) throw new Error(`edu/dilemmas/${f}: banned field ${b}`);
    if (!d.id || seen.has(d.id)) throw new Error(`edu/dilemmas/${f}: duplicate or missing id`);
    seen.add(d.id);
    if (d.band !== "scholars" && d.band !== "researchers")
      throw new Error(`edu/dilemmas/${f}: ${d.id} bad band ${d.band}`);
    for (const l of LANGS) {
      if (!d.decision?.[l]) throw new Error(`edu/dilemmas/${f}: ${d.id} decision lacks ${l}`);
      if (!d.context?.[l]) throw new Error(`edu/dilemmas/${f}: ${d.id} context lacks ${l}`);
      if (!d.reflection?.[l]) throw new Error(`edu/dilemmas/${f}: ${d.id} reflection lacks ${l}`);
    }
    if (!Array.isArray(d.positions) || d.positions.length < 2)
      throw new Error(`edu/dilemmas/${f}: ${d.id} needs at least two positions`);
    for (const [pi, p] of d.positions.entries()) {
      for (const b of BANNED) if (b in p) throw new Error(`edu/dilemmas/${f}: ${d.id} position ${pi} banned field ${b}`);
      for (const l of LANGS) {
        if (!p.holder?.[l]) throw new Error(`edu/dilemmas/${f}: ${d.id} position ${pi} holder lacks ${l}`);
        if (!p.stance?.[l]) throw new Error(`edu/dilemmas/${f}: ${d.id} position ${pi} stance lacks ${l}`);
        if (!p.evidence?.[l]) throw new Error(`edu/dilemmas/${f}: ${d.id} position ${pi} evidence lacks ${l}`);
      }
      if (!Array.isArray(p.sources) || p.sources.length < 1)
        throw new Error(`edu/dilemmas/${f}: ${d.id} position ${pi} needs at least one source`);
      for (const s of p.sources)
        if (!byId.has(s)) throw new Error(`edu/dilemmas/${f}: ${d.id} position ${pi} sources unknown record ${s}`);
    }
    dilemmas.push(d);
  }
  cache = dilemmas;
  return dilemmas;
}
