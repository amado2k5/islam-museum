// The scattered sheets' rules: the sheets of a map lie in a grid, out of order, and a page of the Atlas is among them.
// Each sheet has four edges, and an edge carries nothing or one feature (a coast, a river or a road) at one of three
// places along it. A feature that reaches an edge must go on at the same place on the next sheet. The player
// exchanges two sheets at a time until every seam matches. Pure rules over plain data: nothing here draws and nothing
// here is left to chance. The al-Idrisi quest (content/sheets, ui/sheets) is built on it.
//
// What it is for first: the museum's records say that al-Idrisi wrote Nuzhat al-Mushtaq for Roger II, king of Sicily,
// that the book went with a silver disc of the seven climes, and that he divided each clime into ten sections with
// seventy sectional maps. Nothing else about his maps is claimed: the scattered sheets, the way of putting them in
// order by their edges, the imagined coast and the young helper are the game's own (review ledger, HR-HH-20 to
// HR-HH-22).
export type SheetsStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the helper was answered kindly. `answered` is only that he or she was answered at all, so that the
// question is not asked again after a resume (the same arrangement as the secret page's messenger).
export const SHEETS_FLAGS = ["askedBook", "askedMaps", "kind", "feather", "answered"] as const;
export type SheetsFlag = (typeof SHEETS_FLAGS)[number];

export const FEATURES = ["coast", "river", "road"] as const;
export type Feature = (typeof FEATURES)[number];
/** An edge code: 0 is nothing; otherwise the tens digit is the feature (1 coast, 2 river, 3 road) and the units digit is the place along the edge (1, 2 or 3). */
export const edgeCode = (feature: Feature, at: 1 | 2 | 3): number => (FEATURES.indexOf(feature) + 1) * 10 + at;
export function decodeEdge(code: number): { feature: Feature; at: 1 | 2 | 3 } | null {
  const f = Math.floor(code / 10);
  const at = code % 10;
  if (!Number.isInteger(code) || f < 1 || f > 3 || at < 1 || at > 3) return null;
  return { feature: FEATURES[f - 1]!, at: at as 1 | 2 | 3 };
}
export const isEdgeCode = (code: unknown): boolean => code === 0 || (typeof code === "number" && decodeEdge(code) !== null);

/** One sheet: its number, and what each edge carries (north is the top of the picture, east its right). */
export interface Sheet {
  id: number;
  n: number;
  e: number;
  s: number;
  w: number;
}
export type Side = "n" | "e" | "s" | "w";
export const SIDES: readonly Side[] = ["n", "e", "s", "w"];

/** What a map is made of: its size, its sheets (numbered 1 and up, in order) and the order they lie in at the start. */
export interface SheetsDef {
  rows: number;
  cols: number;
  sheets: readonly Sheet[];
  /** The sheet number at each place, row by row, as the sheets lie to begin with. */
  start: readonly number[];
}

/** The sheets as laid out: `cells` are the sheets in place order, row by row. */
export interface Grid {
  rows: number;
  cols: number;
  cells: readonly Sheet[];
}
/** A seam between two places: `across` is "row" when `b` is the place to the right of `a`, "column" when it is the place below. A border seam has no `b`: the edge of the map, which matches only if nothing is carried there. */
export interface Seam {
  a: number;
  b: number | null;
  across: "row" | "column";
  /** The side of `a` that meets the seam. */
  side: Side;
  match: boolean;
}

/** Every inner seam, between two sheets that lie side by side, with whether the features meet. */
export function seams(g: Grid): Seam[] {
  const out: Seam[] = [];
  for (let p = 0; p < g.cells.length; p++) {
    const r = Math.floor(p / g.cols);
    const c = p % g.cols;
    if (c + 1 < g.cols) out.push({ a: p, b: p + 1, across: "row", side: "e", match: g.cells[p]!.e === g.cells[p + 1]!.w });
    if (r + 1 < g.rows) out.push({ a: p, b: p + g.cols, across: "column", side: "s", match: g.cells[p]!.s === g.cells[p + g.cols]!.n });
  }
  return out;
}
/** The edges on the outer border of the whole map: each meets nothing, so it matches only if the sheet carries nothing there. */
export function borderSeams(g: Grid): Seam[] {
  const out: Seam[] = [];
  for (let p = 0; p < g.cells.length; p++) {
    const r = Math.floor(p / g.cols);
    const c = p % g.cols;
    const sh = g.cells[p]!;
    if (r === 0) out.push({ a: p, b: null, across: "column", side: "n", match: sh.n === 0 });
    if (r === g.rows - 1) out.push({ a: p, b: null, across: "column", side: "s", match: sh.s === 0 });
    if (c === 0) out.push({ a: p, b: null, across: "row", side: "w", match: sh.w === 0 });
    if (c === g.cols - 1) out.push({ a: p, b: null, across: "row", side: "e", match: sh.e === 0 });
  }
  return out;
}
/** Every seam the map has, inner and border. All of them match exactly when the sheets are in order. */
export const allSeams = (g: Grid): Seam[] => [...seams(g), ...borderSeams(g)];

/** Every arrangement that makes every seam match, found by backtracking in place order: for a good map, exactly one. */
export function solutions(sheets: readonly Sheet[], rows: number, cols: number): number[][] {
  const n = rows * cols;
  const found: number[][] = [];
  const grid: number[] = [];
  const used = new Set<number>();
  const by = (id: number) => sheets[id - 1]!;
  const place = (p: number): void => {
    if (p === n) {
      found.push([...grid]);
      return;
    }
    const r = Math.floor(p / cols);
    const c = p % cols;
    for (const sh of sheets) {
      if (used.has(sh.id)) continue;
      if (r === 0 && sh.n !== 0) continue;
      if (r === rows - 1 && sh.s !== 0) continue;
      if (c === 0 && sh.w !== 0) continue;
      if (c === cols - 1 && sh.e !== 0) continue;
      if (c > 0 && by(grid[p - 1]!).e !== sh.w) continue;
      if (r > 0 && by(grid[p - cols]!).s !== sh.n) continue;
      used.add(sh.id);
      grid.push(sh.id);
      place(p + 1);
      grid.pop();
      used.delete(sh.id);
    }
  };
  place(0);
  return found;
}

/** The fewest exchanges of two sheets that turn one arrangement into another: the places that differ, less the cycles they fall into. */
export function distance(from: readonly number[], to: readonly number[]): number {
  const at = new Map<number, number>(to.map((id, p) => [id, p]));
  const seen = new Array<boolean>(from.length).fill(false);
  let moves = 0;
  for (let p = 0; p < from.length; p++) {
    if (seen[p]) continue;
    let q = p;
    let len = 0;
    while (!seen[q]) {
      seen[q] = true;
      q = at.get(from[q]!) ?? q;
      len++;
    }
    moves += len - 1;
  }
  return moves;
}

/** What the last command did; null before the first. */
export type Last = { type: "exchange"; a: number; b: number } | { type: "check"; matched: number; total: number };
export interface SheetsState {
  style: SheetsStyle;
  rows: number;
  cols: number;
  /** The style's own sheets, numbered 1 and up. */
  sheets: readonly Sheet[];
  /** How the sheets lay at the start, and the one arrangement that makes every seam match. */
  start: readonly number[];
  solution: readonly number[];
  /** The sheet number at each place now. */
  grid: readonly number[];
  /** Exchanges made, and checks that found the map not yet in order. */
  moves: number;
  checks: number;
  flags: SheetsFlag[];
  last: Last | null;
  done: boolean;
}
export type SheetsCommand = { type: "exchange"; a: number; b: number } | { type: "check" } | { type: "flag"; flag: SheetsFlag };

const answers = new WeakMap<SheetsDef, readonly number[]>();
/** The one arrangement of a map's sheets; proved, not assumed: a map with none or with more than one is refused. */
export function answerOf(def: SheetsDef): readonly number[] {
  const hit = answers.get(def);
  if (hit) return hit;
  def.sheets.forEach((sh, i) => {
    if (sh.id !== i + 1) throw new Error(`sheet ${i + 1} is numbered ${sh.id}`);
  });
  const all = solutions(def.sheets, def.rows, def.cols);
  if (all.length !== 1) throw new Error(`a map of ${def.rows} by ${def.cols} has ${all.length} arrangements, not one`);
  answers.set(def, all[0]!);
  return all[0]!;
}

export const gridOf = (s: Pick<SheetsState, "rows" | "cols" | "sheets" | "grid">): Grid => ({ rows: s.rows, cols: s.cols, cells: s.grid.map((id) => s.sheets[id - 1]!) });
/** How many seams match, of how many, inner and border together. */
export function tally(s: SheetsState): { matched: number; total: number } {
  const all = allSeams(gridOf(s));
  return { matched: all.filter((x) => x.match).length, total: all.length };
}
export const inOrder = (s: Pick<SheetsState, "rows" | "cols" | "sheets" | "grid">): boolean => allSeams(gridOf(s)).every((x) => x.match);

export function newSheets(style: SheetsStyle, def: SheetsDef): SheetsState {
  const solution = answerOf(def);
  return { style, rows: def.rows, cols: def.cols, sheets: def.sheets, start: def.start, solution, grid: def.start, moves: 0, checks: 0, flags: [], last: null, done: false };
}

/** The fewest exchanges from the sheets as they lie now to the answer. */
export const fewest = (s: SheetsState): number => distance(s.grid, s.solution);
/** The fewest exchanges from the start to the answer. */
export const fewestFromStart = (s: SheetsState): number => distance(s.start, s.solution);
/** The places that are not where the answer has them. */
export const wrongPlaces = (s: SheetsState): number => s.grid.filter((id, p) => id !== s.solution[p]).length;

/**
 * Exchanges the sheets at two places and counts a move. The same place twice, or a place that is not on the map, changes nothing. In Story and
 * Explorer the map is done the moment every seam matches; in Challenge it is done only on a check (nothing is shown until then).
 */
export function exchange(s: SheetsState, a: number, b: number): SheetsState {
  const n = s.grid.length;
  if (s.done || a === b || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= n || b >= n) return s;
  const grid = [...s.grid];
  [grid[a], grid[b]] = [grid[b]!, grid[a]!];
  const next = { ...s, grid, moves: s.moves + 1, last: { type: "exchange", a, b } as Last };
  return { ...next, done: s.style !== "challenge" && inOrder(next) };
}
/** "Check the map": counts the seams that match; if every one does the map is done, and if not the check is counted as a failed one. */
export function check(s: SheetsState): SheetsState {
  if (s.done) return s;
  const { matched, total } = tally(s);
  const ok = matched === total;
  return { ...s, checks: ok ? s.checks : s.checks + 1, last: { type: "check", matched, total }, done: ok };
}
export function applySheets(s: SheetsState, c: SheetsCommand): SheetsState {
  if (s.done) return s;
  if (c.type === "flag") return !SHEETS_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  return c.type === "exchange" ? exchange(s, c.a, c.b) : check(s);
}

/** What counts for the Ingenuity goal: exchanges beyond the fewest, and failed checks, allowed; null for the way of playing is no count. */
export interface Slack {
  extra: number;
  /** Failed checks allowed; null when the way of playing has no use for them. */
  checks: number | null;
}
/** The four goals, in the shape every quest's record has. */
export function sheetsGoals(s: SheetsState, slack: Slack | null): { turns: number; slips: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: SheetsFlag) => s.flags.includes(f);
  const best = fewestFromStart(s);
  return {
    turns: s.moves,
    slips: s.checks,
    curiosity: has("askedBook") && has("askedMaps"),
    ingenuity: slack === null || (s.moves <= best + slack.extra && (slack.checks === null || s.checks <= slack.checks)),
    kindness: has("kind"),
    feather: has("feather"),
  };
}

/** What is kept of a map in progress: enough to put the sheets back, and nothing that cannot be checked. */
export interface SheetsSnapshot {
  style: SheetsStyle;
  grid: number[];
  moves: number;
  checks: number;
  flags: SheetsFlag[];
}
export function snapshotSheets(s: SheetsState): SheetsSnapshot {
  return { style: s.style, grid: [...s.grid], moves: s.moves, checks: s.checks, flags: [...s.flags] };
}
/**
 * A map put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the map
 * is built afresh for the style (`defOf`), and the saved arrangement is accepted only if it is a permutation of that
 * style's own sheets, is not already in order (a map is never restored as done, except in Challenge, where a map put
 * in order is not done until it is checked), and the count of exchanges is not fewer than the fewest that reach it from
 * the start. What the last command did is not kept.
 */
export function restoreSheets(x: unknown, defOf: (style: SheetsStyle) => SheetsDef): SheetsState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newSheets(o.style, defOf(o.style));
  if (!Array.isArray(o.grid) || o.grid.length !== base.start.length) return null;
  const grid = o.grid as unknown[];
  const ids = new Set(base.sheets.map((sh) => sh.id));
  const seen = new Set<number>();
  for (const id of grid) {
    if (typeof id !== "number" || !ids.has(id) || seen.has(id)) return null;
    seen.add(id);
  }
  const placed = grid as number[];
  const d = distance(base.start, placed);
  if (typeof o.moves !== "number" || !Number.isInteger(o.moves) || o.moves < d || o.moves > 100000) return null;
  if (typeof o.checks !== "number" || !Number.isInteger(o.checks) || o.checks < 0 || o.checks > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  if (o.style !== "challenge" && inOrder({ ...base, grid: placed })) return null;
  const flags = SHEETS_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, grid: [...placed], moves: o.moves, checks: o.checks, flags: [...flags] };
}
