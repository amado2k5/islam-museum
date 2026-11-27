// Al-Khwarizmi's room: the locked box played by flying. A pure function from the room's state and a command to a new
// state, what happened, and the commands of the locked box's rules it gave. Those rules (./algebra) are not touched: a
// hollow group touched is exactly the page's restore button for that side and kind, a weight touched is the page's
// "Balance the things" or "Balance the numbers", the scoop is "Share the number among the things", and a question asked,
// an answer given or the feather found is a `flag`; so the counts, the slips, the goals, the three ways of playing and
// the sentence in words are the page quest's (ui/algebra.ts) to the letter.
//
// A hollow group is there only while something of its kind is taken away on its side, as the page shows a restore
// button only then; the weights and the scoop are always there, so that a move that does not apply is a slip, as on
// the page.
import { algebraStart, ALGEBRA_SLACK } from "../content/algebra";
import { AKR_SCRIPTS, AKR_TRAY, akrThings, type AkrSpeaker } from "../content/khwarizmi-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { ALGEBRA_FLAGS, algebraGoals, applyAlgebra, newAlgebra, restoreAlgebra, snapshotAlgebra, type AlgebraCommand, type AlgebraFlag, type AlgebraSnapshot, type AlgebraState, type AlgebraStyle, type Kind, type Move, type Place, type Side } from "./algebra";

export interface KhwarizmiState {
  algebra: AlgebraState;
  talk: Talk | null;
}
export type KhwarizmiCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type KhwarizmiHappened =
  | { type: "move"; move: Move; applied: boolean }
  | { type: "opened" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface KhwarizmiResult {
  state: KhwarizmiState;
  happened: KhwarizmiHappened[];
  /** The locked box's commands this step gave, in order: the same the page quest gives for the same act. */
  commands: AlgebraCommand[];
}

export function newKhwarizmiRoom(style: AlgebraStyle): KhwarizmiState {
  return { algebra: newAlgebra(style, algebraStart(style)), talk: open(AKR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is AlgebraFlag => (ALGEBRA_FLAGS as readonly string[]).includes(f);
const lessOf = (kind: Kind): "lessThings" | "lessNumber" => (kind === "things" ? "lessThings" : "lessNumber");
/** Whether a hollow group is on its tray now: something of its kind is taken away on its side. */
export const hollowThere = (s: AlgebraState, side: Place, kind: Kind): boolean => s.eq[side][lessOf(kind)] > 0;
/** The move a thing of the room makes, or null for a person or the box. The same in either reading direction. */
export function moveOf(id: string): Move | null {
  const t = akrThings(false).find((k) => k.id === id);
  if (!t) return null;
  if (t.kind === "restore") return { type: "restore", side: t.side!, kind: t.of! };
  if (t.kind === "weight") return { type: "balance", kind: t.of! };
  if (t.kind === "scoop") return { type: "share" };
  return null;
}
/** Whether a thing can be touched now: a hollow group only while it is there. */
export function touchableNow(s: AlgebraState, id: string): boolean {
  const m = moveOf(id);
  return !(m && m.type === "restore") || hollowThere(s, m.side, m.kind);
}

export function applyKhwarizmiRoom(s: KhwarizmiState, c: KhwarizmiCommand): KhwarizmiResult {
  const commands: AlgebraCommand[] = [];
  let algebra = s.algebra;
  const give = (cmd: AlgebraCommand) => {
    const next = applyAlgebra(algebra, cmd);
    if (next === algebra) return;
    algebra = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (script: string, happened: KhwarizmiHappened[] = []): KhwarizmiResult => ({ state: { algebra, talk: open(AKR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: KhwarizmiResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<AkrSpeaker>(AKR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<AkrSpeaker>(AKR_SCRIPTS, s.talk, c.index, new Set<string>(s.algebra.flags));
      flags(step.set);
      return { state: { algebra, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the room is touched.
    return none;
  }
  if (c.type !== "touch" || s.algebra.done) return none;
  const thing = akrThings(false).find((t) => t.id === c.id);
  if (!thing) return none;

  const move = moveOf(thing.id);
  if (move) {
    if (!touchableNow(s.algebra, thing.id)) return none;
    give(move);
    const applied = algebra.last?.applied ?? false;
    const happened: KhwarizmiHappened[] = [{ type: "move", move, applied }];
    // One thing equals a number: the box opens, and Hudhud says that the page is home (the page's own last line).
    if (algebra.done) return say("done", [...happened, { type: "opened" }]);
    return { state: { ...s, algebra }, happened, commands };
  }
  if (thing.kind === "khwarizmi") return say("khwarizmi");
  if (thing.kind === "child") {
    const has = (f: AlgebraFlag) => s.algebra.flags.includes(f);
    if (has("kind")) return say("childKind");
    if (has("answered")) return say("childBlunt");
    return say("child");
  }
  // Under the locked box: the feather the first time, nothing more after (the page's own lines).
  if (s.algebra.flags.includes("feather")) return say("boxAgain");
  give({ type: "flag", flag: "feather" });
  return say("box", [{ type: "feather" }]);
}

/** The four goals, exactly as the page quest counts them. */
export const khwarizmiGoals = (s: KhwarizmiState) => algebraGoals(s.algebra, ALGEBRA_SLACK[s.algebra.style]);

/** What is kept: the quest's own snapshot, so that the page quest and the room take up each other's place. */
export const snapshotKhwarizmi = (s: KhwarizmiState): AlgebraSnapshot => snapshotAlgebra(s.algebra);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/algebra.ts): after any change, the quest
 * as it now stands if the box is not open and a move, a slip or a flag has been made; nothing new otherwise (the opened
 * box is written into the save as finished). `undefined` means: leave what is kept as it is.
 */
export function keptAfter(s: KhwarizmiState, cmds: readonly AlgebraCommand[]): AlgebraSnapshot | undefined {
  if (cmds.length === 0 || s.algebra.done) return undefined;
  const a = s.algebra;
  return a.moves > 0 || a.slips > 0 || a.flags.length > 0 ? snapshotKhwarizmi(s) : undefined;
}
/** A room put back from what was saved, or null if it cannot be trusted (sim/algebra.ts proves it). A talk is never restored. */
export function restoreKhwarizmi(x: unknown): KhwarizmiState | null {
  const algebra = restoreAlgebra(x, algebraStart);
  return algebra ? { algebra, talk: null } : null;
}

// ------------------------------------------------------------------------------------------- the trays as drawn
export interface TrayItem {
  kind: "box" | "coin";
  /** Taken away: drawn hollow, with a bar through it, in the strip along the bottom of the tray. */
  hollow: boolean;
  /** The middle, in game pixels from the top left of the tray's inside. */
  x: number;
  y: number;
}
/**
 * Where the boxes and the coins of one side stand in a tray: what is there in rows in the upper part (things, then
 * number), what is taken away in the strip along the bottom (hollow boxes in its first part, hollow coins in its second),
 * as the page's picture shows them (art/algebra.ts): a closed box is a thing, a coin a unit, a hollow shape with a bar
 * through it something taken away. `fits` is false if anything would stand outside its part of the tray.
 */
export function trayLayout(s: Side): { items: TrayItem[]; fits: boolean } {
  const T = AKR_TRAY;
  const inner = T.w - 2 * T.pad;
  const items: TrayItem[] = [];
  let fits = true;
  const rows = (kind: "box" | "coin", count: number, hollow: boolean, x0: number, x1: number, y0: number, y1: number): number => {
    if (count === 0) return y0;
    const g = kind === "box" ? T.box : T.coin;
    const perRow = Math.max(1, Math.floor((x1 - x0 - g.size) / g.pitch) + 1);
    const nRows = Math.ceil(count / perRow);
    // A strip holds its rows packed closer if it must, so that what is taken away always shows whole.
    const row = hollow && nRows > 1 ? Math.min(g.row, (y1 - y0 - g.size) / (nRows - 1)) : g.row;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / perRow);
      const inRow = Math.min(perRow, count - r * perRow);
      // A group is centred in its part of the strip; what is there starts at the left, as on the page.
      const start = hollow ? (x0 + x1) / 2 - ((inRow - 1) * g.pitch) / 2 : x0 + g.size / 2;
      items.push({ kind, hollow, x: start + (i % perRow) * g.pitch, y: y0 + g.size / 2 + r * row });
    }
    const bottom = y0 + g.size + (nRows - 1) * row;
    if (bottom > y1 + 0.001 || row < g.size * 0.6) fits = false;
    return y0 + nRows * g.row;
  };
  let y = rows("box", s.things, false, 0, inner, 0, T.shownH);
  y = rows("coin", s.number, false, 0, inner, y, T.shownH);
  if (y > T.shownH) fits = false;
  const st = T.strip.top;
  rows("box", s.lessThings, true, T.strip.boxes[0], T.strip.boxes[1], st, st + T.strip.h);
  rows("coin", s.lessNumber, true, T.strip.coins[0], T.strip.coins[1], st, st + T.strip.h);
  return { items, fits };
}
