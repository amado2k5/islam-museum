// Source Detective units for the teen wing (E4 step 5). Every unit: a claim,
// exactly three evidence cards (a chained passage, a chronicle excerpt rewritten
// with citation, an object/record), and a historians' note the student compares
// their own grading against.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { byId } from "./graph";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";

const DIR = repoPath("edu/detective");
const KINDS = ["passage", "chronicle", "object"] as const;
export type EvidenceKind = (typeof KINDS)[number];
type Tri = Record<Lang, string>;

export interface DetectiveUnit {
  id: string;
  band: string;
  claim: Tri;
  historians: Tri;
  evidence: { kind: EvidenceKind; id: string; caption: Tri; chain?: string[] }[];
}

function tri(v: unknown, where: string): Tri {
  const t = v as Tri;
  for (const l of ["ar", "en", "ur"] as Lang[])
    if (typeof t?.[l] !== "string" || !t[l]) throw new Error(`${where}: missing ${l}`);
  return t;
}

export function loadDetective(): DetectiveUnit[] {
  const out: DetectiveUnit[] = [];
  const seen = new Set<string>();
  for (const f of readdirSync(DIR).filter((x) => x.endsWith(".yaml"))) {
    const d = parse(readFileSync(`${DIR}/${f}`, "utf8"));
    const where = `${DIR}/${f}`;
    if (!d.id || typeof d.id !== "string") throw new Error(`${where}: missing id`);
    if (seen.has(d.id)) throw new Error(`${where}: duplicate id ${d.id}`);
    seen.add(d.id);
    const ev = d.evidence as { kind: EvidenceKind; id: string; caption: Tri }[];
    if (!Array.isArray(ev) || ev.length !== 3) throw new Error(`${where}: evidence must be exactly 3`);
    let chained = false;
    for (const e of ev) {
      if (!KINDS.includes(e.kind)) throw new Error(`${where}: bad kind ${e.kind}`);
      if (!byId.has(e.id)) throw new Error(`${where}: unknown evidence id ${e.id}`);
      tri(e.caption, `${where} evidence ${e.id}`);
      if (e.kind === "passage") {
        const slug = e.id.split("/")[1];
        const p = parse(readFileSync(repoPath(`data/passage/${slug}.yaml`), "utf8"));
        if (Array.isArray(p.chain) && p.chain.length) {
          chained = true;
          (e as { chain?: string[] }).chain = p.chain;
        }
      }
    }
    if (!chained) throw new Error(`${where}: at least one evidence must be a passage with a chain`);
    out.push({
      id: d.id,
      band: d.band,
      claim: tri(d.claim, `${where} claim`),
      historians: tri(d.historians, `${where} historians`),
      evidence: ev,
    });
  }
  return out;
}
