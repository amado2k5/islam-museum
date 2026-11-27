// The channel rules: the pieces of a channel lie in a grid, each turned some way, and water comes in at a spout on the
// edge. The player turns pieces a quarter turn at a time until the water runs from the spout to every basin. Pure rules
// over plain data: nothing here draws and nothing is left to chance. The Alhambra quest (content/channels,
// ui/channels) is built on it.
//
// What it is for first: the museum's record says that work on the Alhambra began with an aqueduct from the mountains,
// so that water ran through the town and the palaces, and that in two of its courts a very long pool and a fountain at
// the crossing of two paths stand. Nothing in the record says how water was led from the aqueduct to each court: the
// grid of turning channel pieces, the spout and the basins are the game's own (review ledger, HR-HH-38 to HR-HH-40).
export type ChannelsStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the girl was answered kindly. `answered` is only that she was answered at all, so that the question
// is not asked again after a resume (the same arrangement as the helper of the scattered sheets).
export const CHANNELS_FLAGS = ["askedWater", "askedCourts", "kind", "feather", "answered"] as const;
export type ChannelsFlag = (typeof CHANNELS_FLAGS)[number];

/** The six pieces: how many openings, and where. */
export const KINDS = ["straight", "bend", "tee", "cross", "end", "blank"] as const;
export type Kind = (typeof KINDS)[number];
/** The four sides of a place: north is the top of the picture, east its right, and west is the side of the first column. */
export type Side = "n" | "e" | "s" | "w";
export const SIDES: readonly Side[] = ["n", "e", "s", "w"];
/** The side that faces: the water that leaves a place by its east side comes in by the west side of the next. */
export const opposite = (s: Side): Side => SIDES[(SIDES.indexOf(s) + 2) % 4]!;
const STEP: Record<Side, [number, number]> = { n: [-1, 0], e: [0, 1], s: [1, 0], w: [0, -1] };

/** The openings of each piece when it is not turned, as indexes into SIDES (0 north, 1 east, 2 south, 3 west). */
const BASE: Record<Kind, readonly number[]> = { straight: [0, 2], bend: [0, 1], tee: [3, 0, 1], cross: [0, 1, 2, 3], end: [0], blank: [] };
/** After how many quarter turns a piece looks as it did: a straight piece after two, a cross or a plain stone at once, the others after four. */
export const period = (k: Kind): 1 | 2 | 4 => (k === "cross" || k === "blank" ? 1 : k === "straight" ? 2 : 4);
/** A piece can be turned if turning it changes anything. */
export const turnable = (k: Kind): boolean => period(k) > 1;
/** The sides a piece is open on, after `turn` quarter turns clockwise (0 to 3). */
export function opens(k: Kind, turn: number): Side[] {
  return BASE[k].map((i) => SIDES[(i + turn) % 4]!);
}
export const isOpen = (k: Kind, turn: number, side: Side): boolean => opens(k, turn).includes(side);
export const isKind = (x: unknown): x is Kind => typeof x === "string" && (KINDS as readonly string[]).includes(x);
/** The kind and the turn that give a set of open sides, or null if no piece has them. A straight piece's turn is 0 or 1, the others' 0 to 3. */
export function pieceFor(mask: readonly Side[]): { kind: Kind; turn: number } | null {
  const want = [...mask].sort().join("");
  for (const kind of KINDS) for (let turn = 0; turn < period(kind); turn++) if ([...opens(kind, turn)].sort().join("") === want) return { kind, turn };
  return null;
}

export interface Piece {
  kind: Kind;
  /** Quarter turns clockwise from the piece as it is drawn unturned, 0 to 3. */
  turn: number;
}
/** A basin: a place that must have water, and what it is (a round fountain, or a long pool). */
export interface Basin {
  cell: number;
  kind: "fountain" | "pool";
}
/** The spout: the place it feeds, and the side of that place the water comes in by (a side that is on the edge of the grid). */
export interface Spout {
  cell: number;
  side: Side;
}

/** What a grid is made of: its size, its pieces as they lie to begin with, its spout, its basins, and whether a leak means it is not done. */
export interface ChannelsDef {
  rows: number;
  cols: number;
  start: readonly Piece[];
  spout: Spout;
  basins: readonly Basin[];
  /** True where an opening that faces nothing counts against the player (Challenge). */
  noLeaks: boolean;
}
/** The pieces as laid out, for the flow. */
export interface Grid {
  rows: number;
  cols: number;
  cells: readonly Piece[];
  spout: Spout;
}

/** An opening of a wet place that faces the edge of the grid or a side that is closed: the water spills there. */
export interface Leak {
  cell: number;
  side: Side;
}
/** The place a side of a place faces, or null at the edge of the grid. */
export function neighbour(cell: number, side: Side, rows: number, cols: number): number | null {
  const r = Math.floor(cell / cols) + STEP[side][0];
  const c = (cell % cols) + STEP[side][1];
  return r < 0 || c < 0 || r >= rows || c >= cols ? null : r * cols + c;
}
/** Where the water goes: it comes in at the spout and follows every opening that meets an opening. The wet places in the order the water reaches them (nearest first), their distance from the spout, and the leaks (listed row by row). */
export interface Flow {
  wet: boolean[];
  /** The number of places the water has run through before it reaches each wet place (0 at the spout); -1 where it is dry. */
  reach: number[];
  leaks: Leak[];
  /** The places a wet opening faces that do not open back (not the edge): the water stops against them. */
  blocked: number[];
}
export function flow(g: Grid): Flow {
  const n = g.rows * g.cols;
  const wet = new Array<boolean>(n).fill(false);
  const reach = new Array<number>(n).fill(-1);
  const at = g.spout.cell;
  if (at >= 0 && at < n && isOpen(g.cells[at]!.kind, g.cells[at]!.turn, g.spout.side)) {
    wet[at] = true;
    reach[at] = 0;
    const queue = [at];
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i]!;
      const piece = g.cells[p]!;
      for (const s of opens(piece.kind, piece.turn)) {
        const q = neighbour(p, s, g.rows, g.cols);
        if (q === null || wet[q] || !isOpen(g.cells[q]!.kind, g.cells[q]!.turn, opposite(s))) continue;
        wet[q] = true;
        reach[q] = reach[p]! + 1;
        queue.push(q);
      }
    }
  }
  const leaks: Leak[] = [];
  const blocked = new Set<number>();
  for (let p = 0; p < n; p++) {
    if (!wet[p]) continue;
    const piece = g.cells[p]!;
    for (const s of SIDES) {
      if (!isOpen(piece.kind, piece.turn, s)) continue;
      // The side the spout feeds faces the spout, not the edge: nothing spills there.
      if (p === g.spout.cell && s === g.spout.side) continue;
      const q = neighbour(p, s, g.rows, g.cols);
      if (q === null) leaks.push({ cell: p, side: s });
      else if (!isOpen(g.cells[q]!.kind, g.cells[q]!.turn, opposite(s))) {
        leaks.push({ cell: p, side: s });
        blocked.add(q);
      }
    }
  }
  return { wet, reach, leaks, blocked: [...blocked].sort((a, b) => a - b) };
}

/** The wet basins: how many, of how many. */
export const basinsWet = (basins: readonly Basin[], f: Flow): number => basins.filter((b) => f.wet[b.cell]).length;

// ------------------------------------------------------------------------------------------------ the answer, by search

/** One way to finish a grid, as far as it matters: which places are wet and how each is turned (as the piece looks, so a straight piece's turn is 0 or 1), and which sides of the dry places must stay closed. */
export interface Answer {
  /** The turn of every wet place, modulo that piece's period. */
  wet: ReadonlyMap<number, number>;
  /** The sides of each dry place that a wet opening faces: that place must not be open on them. */
  closed: ReadonlyMap<number, ReadonlySet<Side>>;
}
const sig = (wet: ReadonlyMap<number, number>): string =>
  [...wet.entries()]
    .sort((x, y) => x[0] - y[0])
    .map(([p, t]) => `${p}:${t}`)
    .join(",");

/**
 * Every way to turn the pieces so that the water reaches every basin (and, if `noLeaks`, spills nowhere), found by
 * growing the water outward from the spout and trying each turn of each place it reaches. Two ways that wet the same
 * places with the same look are one way: a piece that stays dry may lie any way that does not touch the water, and a
 * straight piece turned twice looks as it did. For a good grid, exactly one.
 */
export function answers(def: ChannelsDef, noLeaks: boolean): Answer[] {
  const { rows, cols } = def;
  const kind = (p: number) => def.start[p]!.kind;
  const found = new Map<string, Answer>();
  // The search state: the turn chosen for every place the water has reached so far, and a queue of those whose
  // openings are still to be followed. A place an opening faces that does not open back is left dry for now.
  const wet = new Map<number, number>();
  const queue: number[] = [];
  const turnsOf = (p: number) => Array.from({ length: period(kind(p)) }, (_, t) => t);

  /** The water has stopped growing: the places it reached are checked against everything it faces. */
  const finish = (): void => {
    for (const b of def.basins) if (!wet.has(b.cell)) return;
    const closed = new Map<number, Set<Side>>();
    for (const [p, t] of wet) {
      for (const s of opens(kind(p), t)) {
        const q = neighbour(p, s, rows, cols);
        if (p === def.spout.cell && s === def.spout.side) continue;
        if (q === null) {
          if (noLeaks) return;
        } else if (wet.has(q)) {
          if (noLeaks && !isOpen(kind(q), wet.get(q)!, opposite(s))) return;
        } else {
          if (noLeaks) return;
          if (!closed.has(q)) closed.set(q, new Set());
          closed.get(q)!.add(opposite(s));
        }
      }
    }
    // A dry place must have some turn that keeps every side the water faces closed.
    for (const [q, sides] of closed) if (!turnsOf(q).some((t) => !opens(kind(q), t).some((s) => sides.has(s)))) return;
    const key = sig(wet);
    if (!found.has(key)) found.set(key, { wet: new Map(wet), closed });
  };
  const step = (i: number): void => {
    if (i === queue.length) return finish();
    const p = queue[i]!;
    follow(i, p, opens(kind(p), wet.get(p)!), 0);
  };
  /** Goes through the opening `k` of place `p`: what it faces is the edge, a place that is wet already, or a place not yet reached. */
  const follow = (i: number, p: number, sides: Side[], k: number): void => {
    if (k === sides.length) return step(i + 1);
    const s = sides[k]!;
    const q = neighbour(p, s, rows, cols);
    if (q === null || wet.has(q)) return follow(i, p, sides, k + 1);
    // Not yet reached: each turn open back makes it wet; and one branch stands for every turn that leaves it dry.
    let dry = false;
    for (const t of turnsOf(q)) {
      if (isOpen(kind(q), t, opposite(s))) {
        wet.set(q, t);
        queue.push(q);
        follow(i, p, sides, k + 1);
        queue.pop();
        wet.delete(q);
      } else if (!dry && !noLeaks) {
        dry = true;
        follow(i, p, sides, k + 1);
      }
    }
  };

  const sp = def.spout;
  for (const t of turnsOf(sp.cell)) {
    if (!isOpen(kind(sp.cell), t, sp.side)) continue;
    wet.set(sp.cell, t);
    queue.length = 0;
    queue.push(sp.cell);
    step(0);
    wet.delete(sp.cell);
  }
  return [...found.values()];
}

const proved = new WeakMap<ChannelsDef, Answer>();
/** The one answer of a grid; proved, not assumed: a grid with none or with more than one is refused. Whether leaks count is the grid's own rule. */
export function answerOf(def: ChannelsDef): Answer {
  const hit = proved.get(def);
  if (hit) return hit;
  const all = answers(def, def.noLeaks);
  if (all.length !== 1) throw new Error(`a grid of ${def.rows} by ${def.cols} has ${all.length} answers, not one`);
  proved.set(def, all[0]!);
  return all[0]!;
}

/** The fewest quarter turns from a turn to one that looks as the answer wants: forward only, one at a time. */
function cost(k: Kind, from: number, want: number): number {
  const per = period(k);
  return (((want - from) % per) + per) % per;
}
/** The fewest quarter turns, over all the pieces, from the pieces as they are now to the answer. Pieces that stay dry cost what it takes to turn them clear of the water, if they are not already. */
export function fewestTurns(cells: readonly Piece[], a: Answer): number {
  let sum = 0;
  cells.forEach((piece, p) => {
    if (a.wet.has(p)) sum += cost(piece.kind, piece.turn, a.wet.get(p)!);
    else {
      const sides = a.closed.get(p);
      if (!sides || sides.size === 0) return;
      let best = Infinity;
      for (let k = 0; k < period(piece.kind); k++) {
        const t = (piece.turn + k) % 4;
        if (!opens(piece.kind, t).some((s) => sides.has(s))) best = Math.min(best, k);
      }
      sum += best;
    }
  });
  return sum;
}

// ------------------------------------------------------------------------------------------------ playing

/** What the last command did; null before the first. */
export type Last = { type: "turn"; cell: number } | { type: "open"; wet: number; basins: number; leaks: number };
export interface ChannelsState {
  style: ChannelsStyle;
  rows: number;
  cols: number;
  /** The pieces as they lay at the start, and as they lie now. */
  start: readonly Piece[];
  cells: readonly Piece[];
  spout: Spout;
  basins: readonly Basin[];
  noLeaks: boolean;
  /** The one answer of the grid. */
  answer: Answer;
  /** Quarter turns made, and times the sluice was opened that did not finish the grid (Challenge). */
  moves: number;
  openings: number;
  flags: ChannelsFlag[];
  last: Last | null;
  done: boolean;
}
export type ChannelsCommand = { type: "turn"; cell: number } | { type: "open" } | { type: "flag"; flag: ChannelsFlag };

export const gridOf = (s: Pick<ChannelsState, "rows" | "cols" | "cells" | "spout">): Grid => ({ rows: s.rows, cols: s.cols, cells: s.cells, spout: s.spout });
/** Whether the water now reaches every basin and, where the grid says so, spills nowhere. */
export function finished(s: Pick<ChannelsState, "rows" | "cols" | "cells" | "spout" | "basins" | "noLeaks">): boolean {
  const f = flow(gridOf(s));
  return s.basins.every((b) => f.wet[b.cell]) && (!s.noLeaks || f.leaks.length === 0);
}

/** A grid is well made if its places are all pieces, its spout is on an edge, its basins are channel ends on distinct places, and it has one answer (thrown, not assumed). */
export function checkChannels(def: ChannelsDef): void {
  const n = def.rows * def.cols;
  if (def.start.length !== n) throw new Error(`a grid of ${def.rows} by ${def.cols} has ${def.start.length} pieces`);
  for (const p of def.start) if (!isKind(p.kind) || !Number.isInteger(p.turn) || p.turn < 0 || p.turn > 3) throw new Error("a piece is not a piece");
  const sp = def.spout;
  if (!Number.isInteger(sp.cell) || sp.cell < 0 || sp.cell >= n || neighbour(sp.cell, sp.side, def.rows, def.cols) !== null) throw new Error("the spout is not on an edge of the grid");
  const seen = new Set<number>();
  for (const b of def.basins) {
    if (!Number.isInteger(b.cell) || b.cell < 0 || b.cell >= n || seen.has(b.cell) || def.start[b.cell]!.kind !== "end") throw new Error("a basin is not on its own channel end");
    seen.add(b.cell);
  }
  if (def.basins.length === 0) throw new Error("a grid needs a basin");
  answerOf(def);
}
export function newChannels(style: ChannelsStyle, def: ChannelsDef): ChannelsState {
  checkChannels(def);
  return { style, rows: def.rows, cols: def.cols, start: def.start, cells: def.start, spout: def.spout, basins: def.basins, noLeaks: def.noLeaks, answer: answerOf(def), moves: 0, openings: 0, flags: [], last: null, done: false };
}

/** The fewest quarter turns from the pieces as they lie now to the answer, and from the start. */
export const fewest = (s: ChannelsState): number => fewestTurns(s.cells, s.answer);
export const fewestFromStart = (s: ChannelsState): number => fewestTurns(s.start, s.answer);

/**
 * Gives a piece a quarter turn and counts a move. A place that is not on the grid, or a piece that looks the same turned
 * (a cross, a plain stone), changes nothing and is not counted. In Story and Explorer the grid is done the moment the
 * water reaches every basin; in Challenge it is done only when the sluice is opened (nothing is shown until then).
 */
export function turn(s: ChannelsState, cell: number): ChannelsState {
  if (s.done || !Number.isInteger(cell) || cell < 0 || cell >= s.cells.length || !turnable(s.cells[cell]!.kind)) return s;
  const cells = s.cells.map((p, i) => (i === cell ? { ...p, turn: (p.turn + 1) % 4 } : p));
  const next = { ...s, cells, moves: s.moves + 1, last: { type: "turn", cell } as Last };
  return { ...next, done: s.style !== "challenge" && finished(next) };
}
/** "Open the sluice": the water runs; if it reaches every basin and spills nowhere the grid is done, and if not the opening is counted as one that did not finish it. */
export function openSluice(s: ChannelsState): ChannelsState {
  if (s.done) return s;
  const f = flow(gridOf(s));
  const ok = finished(s);
  return { ...s, openings: ok ? s.openings : s.openings + 1, last: { type: "open", wet: basinsWet(s.basins, f), basins: s.basins.length, leaks: f.leaks.length }, done: ok };
}
export function applyChannels(s: ChannelsState, c: ChannelsCommand): ChannelsState {
  if (s.done) return s;
  if (c.type === "flag") return !CHANNELS_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  return c.type === "turn" ? turn(s, c.cell) : openSluice(s);
}

/** What counts for the Ingenuity goal: turns beyond the fewest, and openings of the sluice that did not finish it, allowed; null for a way of playing with no count. */
export interface Slack {
  extra: number;
  /** Openings that did not finish it allowed; null when the way of playing has no use for them. */
  openings: number | null;
}
/** The four goals, in the shape every quest's record has. */
export function channelsGoals(s: ChannelsState, slack: Slack | null): { turns: number; slips: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: ChannelsFlag) => s.flags.includes(f);
  const best = fewestFromStart(s);
  return {
    turns: s.moves,
    slips: s.openings,
    curiosity: has("askedWater") && has("askedCourts"),
    ingenuity: slack === null || (s.moves <= best + slack.extra && (slack.openings === null || s.openings <= slack.openings)),
    kindness: has("kind"),
    feather: has("feather"),
  };
}

/** What is kept of a grid in progress: enough to put the pieces back, and nothing that cannot be checked. */
export interface ChannelsSnapshot {
  style: ChannelsStyle;
  turns: number[];
  moves: number;
  openings: number;
  flags: ChannelsFlag[];
}
export function snapshotChannels(s: ChannelsState): ChannelsSnapshot {
  return { style: s.style, turns: s.cells.map((p) => p.turn), moves: s.moves, openings: s.openings, flags: [...s.flags] };
}
/**
 * A grid put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the grid
 * is built afresh for the style (`defOf`), and the saved turns are accepted only if there is one for each piece, each a
 * whole number from 0 to 3, a piece that cannot be turned is as it was, the count of turns is not fewer than the fewest
 * that reach them from the start, and (except in Challenge, where a grid is done only when the sluice is opened) the
 * grid is not already finished. What the last command did is not kept.
 */
export function restoreChannels(x: unknown, defOf: (style: ChannelsStyle) => ChannelsDef): ChannelsState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newChannels(o.style, defOf(o.style));
  if (!Array.isArray(o.turns) || o.turns.length !== base.start.length) return null;
  const turns = o.turns as unknown[];
  let least = 0;
  for (let p = 0; p < turns.length; p++) {
    const t = turns[p];
    if (typeof t !== "number" || !Number.isInteger(t) || t < 0 || t > 3) return null;
    const from = base.start[p]!;
    if (!turnable(from.kind) && t !== from.turn) return null;
    least += (t - from.turn + 4) % 4;
  }
  if (typeof o.moves !== "number" || !Number.isInteger(o.moves) || o.moves < least || o.moves > 100000) return null;
  if (typeof o.openings !== "number" || !Number.isInteger(o.openings) || o.openings < 0 || o.openings > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  const cells = base.start.map((p, i) => ({ ...p, turn: turns[i] as number }));
  if (o.style !== "challenge" && finished({ ...base, cells })) return null;
  const flags = CHANNELS_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, cells, moves: o.moves, openings: o.openings, flags: [...flags] };
}
