// The Prophets' Tree of the Messengers Browser (docs/plan/41-messengers-browser.md, "The tree"):
// where each prophet stands on the drawn tree, and on what basis. The tree is an application of
// the graph, never a second source of lineage: a solid branch is drawn only where the graph holds
// a `child_of` edge, the vine from Ismail to Muhammad is the Ansab Browser's chain
// (ANSAB_PROPHET_CHAIN, with its disputed segment), a "progeny" twig is drawn only for a prophet
// the detector finds named in the ayah cited for it, and everything else is marked as order only —
// a place in the sequence, not a claim of parentage. `checkMessengersTree` verifies each of those
// against the graph at build time and the build fails on a mismatch, so a branch can never outlive
// the edge it stands for.
import { MESSENGER_SUBJECTS } from "./messengers.js";
import { ANSAB_PROPHET_CHAIN } from "./ansab.js";

/**
 * - `root`: the foot of the tree.
 * - `child`: father and son, a `child_of` edge in the graph.
 * - `lineage`: descent across many generations along the Ansab chain.
 * - `progeny`: counted among the progeny in the cited ayah; no chain of fathers is recorded.
 * - `order`: placed by the order of the browser's list only.
 * - `kin`: joined to the tree only through a recorded kinship or companionship edge.
 */
export type TreeKind = "root" | "child" | "lineage" | "progeny" | "order" | "kin";

export interface TreeSpec {
  id: string;
  /** Horizontal position in the drawing's own units (0..TREE_WIDTH). */
  x: number;
  /** Row above the root; the root is row 0 and the tree grows upward. */
  r: number;
  kind: TreeKind;
  /** The node this one hangs from. Stem nodes hang from Ibrahim through the central stem. */
  parent?: string;
  /** Drawn from the central stem above Ibrahim rather than from the parent's own node. */
  stem?: boolean;
  /** The ayah that counts this prophet among the progeny (`progeny` only). */
  basis?: string;
  size?: "major" | "crown";
}

export const TREE_WIDTH = 560;
export const TREE_STEP = 96;
export const TREE_STEM_X = 280;
export const TREE_ROOT = "person/adam";
export const TREE_STEM_FOOT = "person/ibrahim";

const P = (s: string) => `person/${s}`;
const AYA = (n: number) => `passage/quran-6-${n}`;

export const MESSENGERS_TREE: TreeSpec[] = [
  { id: P("adam"), x: 280, r: 0, kind: "root", size: "major" },
  { id: P("idris"), x: 280, r: 1, kind: "order", parent: P("adam") },
  { id: P("nuh"), x: 280, r: 2, kind: "order", parent: P("idris"), size: "major" },
  { id: P("hud"), x: 110, r: 2.85, kind: "order", parent: P("nuh") },
  { id: P("salih"), x: 450, r: 2.85, kind: "order", parent: P("nuh") },
  { id: P("ibrahim"), x: 280, r: 3.8, kind: "order", parent: P("nuh"), size: "major" },
  { id: P("lut"), x: 486, r: 4.02, kind: "kin", parent: P("ibrahim") },
  { id: P("ishaq"), x: 120, r: 4.9, kind: "child", parent: P("ibrahim") },
  { id: P("ismail"), x: 440, r: 4.9, kind: "child", parent: P("ibrahim") },
  { id: P("yaqub"), x: 90, r: 5.9, kind: "child", parent: P("ishaq") },
  { id: P("yusuf"), x: 62, r: 6.88, kind: "child", parent: P("yaqub") },
  // the central stem above Ibrahim, in the order of the browser's list
  { id: P("shuayb"), x: 350, r: 5.5, kind: "order", parent: P("ibrahim"), stem: true },
  { id: P("ayyub"), x: 212, r: 6.25, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(84) },
  { id: P("musa"), x: 280, r: 7.3, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(84) },
  { id: P("harun"), x: 166, r: 6.98, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(84) },
  { id: P("al-khidr"), x: 412, r: 7.3, kind: "kin", parent: P("musa") },
  { id: P("dawud"), x: 212, r: 8.3, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(84) },
  { id: P("sulayman"), x: 150, r: 9.25, kind: "child", parent: P("dawud") },
  { id: P("ilyas"), x: 350, r: 8.3, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(85) },
  { id: P("al-yasa"), x: 398, r: 9.25, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(86) },
  { id: P("yunus"), x: 280, r: 10.1, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(86) },
  { id: P("zakariyya"), x: 196, r: 11.0, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(85) },
  { id: P("yahya"), x: 120, r: 11.95, kind: "child", parent: P("zakariyya") },
  { id: P("dhu-l-kifl"), x: 384, r: 11.0, kind: "order", parent: P("ibrahim"), stem: true },
  { id: P("isa-ibn-maryam"), x: 280, r: 12.05, kind: "progeny", parent: P("ibrahim"), stem: true, basis: AYA(85) },
  // the vine of the Prophet's lineage, from the Ansab Browser's chain
  { id: P("adnan"), x: 492, r: 10.0, kind: "lineage", parent: P("ismail") },
  { id: P("muhammad"), x: 280, r: 13.4, kind: "lineage", parent: P("adnan"), size: "crown" },
];

/** Kinship and companionship drawn as a dotted tie; each is an edge in the graph (either direction). */
export interface TreeTie { a: string; b: string; type: "sibling_of" | "related_to" }
export const MESSENGERS_TREE_TIES: TreeTie[] = [
  { a: P("lut"), b: P("ibrahim"), type: "related_to" },
  { a: P("harun"), b: P("musa"), type: "sibling_of" },
  { a: P("al-khidr"), b: P("musa"), type: "related_to" },
  { a: P("ilyas"), b: P("al-yasa"), type: "related_to" },
];

export const TREE_HEIGHT = 70 + Math.max(...MESSENGERS_TREE.map((n) => n.r)) * TREE_STEP + 78;
export const treeY = (r: number) => TREE_HEIGHT - 70 - r * TREE_STEP;

const specById = new Map(MESSENGERS_TREE.map((n) => [n.id, n]));

/** The nodes from this one down to the root, itself first. */
export function treePath(id: string): string[] {
  const out: string[] = [];
  for (let n = specById.get(id); n; n = n.parent ? specById.get(n.parent) : undefined) out.push(n.id);
  return out;
}

/** Stem nodes from the lowest attach point upward; a node's segment index is its place here. */
export const TREE_STEM: TreeSpec[] = MESSENGERS_TREE.filter((n) => n.stem).sort((a, b) => a.r - b.r);

/** How many names of the Ansab chain lie strictly between two of its members, and how many of those are disputed. */
export function chainBetween(from: string, to: string): { ids: string[]; disputed: number } {
  const i = ANSAB_PROPHET_CHAIN.findIndex((l) => l.id === from);
  const j = ANSAB_PROPHET_CHAIN.findIndex((l) => l.id === to);
  if (i < 0 || j < 0 || j <= i) return { ids: [], disputed: 0 };
  const between = ANSAB_PROPHET_CHAIN.slice(i + 1, j);
  return { ids: between.map((l) => l.id), disputed: between.filter((l) => !l.agreed).length };
}

export interface TreeGraphView {
  /** True when the record exists and is not a stub. */
  has(id: string): boolean;
  /** True when the graph holds this edge as written (not its computed inverse). */
  edge(from: string, type: string, to: string): boolean;
  /** True when the detector finds this prophet named in the passage. */
  names(passage: string, person: string): boolean;
}

/** Every way the drawn tree could disagree with the graph; an empty list means the tree is sound. */
export function checkMessengersTree(g: TreeGraphView): string[] {
  const problems: string[] = [];
  const drawn = new Set(MESSENGERS_TREE.map((n) => n.id));
  for (const id of MESSENGER_SUBJECTS) if (!drawn.has(id)) problems.push(`${id} is a browser subject but is not on the tree`);
  if (drawn.size !== MESSENGERS_TREE.length) problems.push("a record is drawn twice");
  const tied = (a: string, b: string, type: string) => g.edge(a, type, b) || g.edge(b, type, a);
  for (const n of MESSENGERS_TREE) {
    if (!g.has(n.id)) problems.push(`${n.id} has no record`);
    if (n.kind === "root") { if (n.parent) problems.push(`${n.id} is the root and has a parent`); continue; }
    if (!n.parent || !specById.has(n.parent)) { problems.push(`${n.id} hangs from nothing`); continue; }
    if (n.kind === "child" && !g.edge(n.id, "child_of", n.parent)) problems.push(`${n.id} child_of ${n.parent} is not in the graph`);
    if (n.kind === "lineage" && chainBetween(n.parent, n.id).ids.length === 0) problems.push(`${n.id} is not below ${n.parent} on the Ansab chain`);
    if (n.kind === "progeny" && !(n.basis && g.names(n.basis, n.id))) problems.push(`${n.id} is not named in ${n.basis ?? "its basis"}`);
    if (n.kind === "kin" && !MESSENGERS_TREE_TIES.some((t) => (t.a === n.id && t.b === n.parent) || (t.b === n.id && t.a === n.parent))) problems.push(`${n.id} has no tie to ${n.parent}`);
    if (n.stem && n.parent !== TREE_STEM_FOOT) problems.push(`${n.id} is on the stem but does not hang from ${TREE_STEM_FOOT}`);
  }
  for (const t of MESSENGERS_TREE_TIES) {
    if (!drawn.has(t.a) || !drawn.has(t.b)) problems.push(`tie ${t.a} – ${t.b} names a record that is not drawn`);
    else if (!tied(t.a, t.b, t.type)) problems.push(`${t.a} ${t.type} ${t.b} is not in the graph`);
  }
  return problems;
}

/** Width of a node's pill for a label, in drawing units: an estimate good enough to keep pills apart. */
export function pillWidth(label: string, size?: TreeSpec["size"]): number {
  const fs = size === "crown" ? 25 : size === "major" ? 23 : 20;
  const letters = [...label.normalize("NFC")].filter((c) => !/\p{M}/u.test(c)).length;
  return Math.round(Math.min(210, Math.max(76, letters * 0.56 * fs + 34)));
}
export const pillHeight = (size?: TreeSpec["size"]) => (size === "crown" ? 54 : size === "major" ? 48 : 42);
