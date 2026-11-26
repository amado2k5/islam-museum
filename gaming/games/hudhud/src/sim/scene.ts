// The golden scene's state and the only way it changes. A pure function from a state and a command to a new state
// and a list of things that happened; the page plays sounds and moves pictures from that list and decides nothing.
import { SCRIPTS, THINGS, TURN_SLACK, workshopPuzzle, type PlayStyle, type Speaker } from "../content/workshop";
import { back, choose, forward, open, openingFlags, type Talk } from "../narrative/dialogue";
import { solve, trace, turnMirror, type Lean, type LightPuzzle, type Mirror, type Trace } from "./light";

export interface SceneState {
  v: 1;
  style: PlayStyle;
  puzzle: LightPuzzle;
  /** Mirrors turned so far. */
  turns: number;
  /** The fewest turns that light the page from the start of this style. */
  par: number;
  flags: string[];
  talk: Talk | null;
  /** The page has had its light and the ink is back. */
  restored: boolean;
  /** The curtain is drawn and the room is dark. */
  dark: boolean;
  /** The player has ended the quest at the page. */
  done: boolean;
}
export type Command =
  | { type: "touch"; id: string }
  | { type: "forward" }
  | { type: "back" }
  | { type: "choose"; index: number }
  | { type: "skip" };
export type Happened =
  | { type: "mirror"; id: string; lit: boolean }
  | { type: "restored" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "purr" }
  | { type: "dark"; on: boolean }
  | { type: "secret" }
  | { type: "feather" }
  | { type: "done" };
export interface Result {
  state: SceneState;
  happened: Happened[];
}

export function newScene(style: PlayStyle): SceneState {
  const puzzle = workshopPuzzle(style);
  const par = solve(puzzle).turns;
  if (par === null) throw new Error("the workshop's puzzle cannot be solved");
  return { v: 1, style, puzzle, turns: 0, par, flags: [], talk: open(SCRIPTS, "intro"), restored: false, dark: false, done: false };
}

export const beam = (s: SceneState): Trace => trace(s.puzzle);
const has = (s: SceneState, f: string) => s.flags.includes(f);
const withFlags = (s: SceneState, add: string[]): SceneState => (add.every((f) => s.flags.includes(f)) ? s : { ...s, flags: [...new Set([...s.flags, ...add])] });
const say = (s: SceneState, script: string): Result => ({ state: withFlags({ ...s, talk: open(SCRIPTS, script) }, openingFlags(SCRIPTS, script)), happened: [{ type: "talk", script }] });

export function apply(s: SceneState, c: Command): Result {
  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<Speaker>(SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }] };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }] };
    if (c.type === "choose") {
      const step = choose<Speaker>(SCRIPTS, s.talk, c.index, new Set(s.flags));
      return { state: withFlags({ ...s, talk: step.talk }, step.set), happened: [{ type: "line" }] };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }] };
    // While someone is speaking, nothing in the room is touched.
    return { state: s, happened: [] };
  }
  if (c.type !== "touch" || s.done) return { state: s, happened: [] };
  const thing = THINGS.find((t) => t.id === c.id);
  if (!thing) return { state: s, happened: [] };

  if (thing.kind === "mirror") {
    const puzzle = turnMirror(s.puzzle, thing.id.slice("mirror-".length));
    const lit = trace(puzzle).lit;
    let state: SceneState = { ...s, puzzle, turns: s.turns + 1 };
    const happened: Happened[] = [{ type: "mirror", id: thing.id, lit }];
    if (lit && !s.restored) {
      const r = say({ ...state, restored: true }, "solved");
      state = r.state;
      happened.push({ type: "restored" }, ...r.happened);
    }
    return { state, happened };
  }
  if (thing.kind === "person") return say(withFlags(s, ["metScholar"]), s.restored ? "scholarAfter" : "scholar");
  if (thing.kind === "animal") {
    const r = say(s, "cat");
    return { state: r.state, happened: [{ type: "purr" }, ...r.happened] };
  }
  if (thing.kind === "cord") {
    const dark = !s.dark;
    const first = dark && !has(s, "secret");
    const state = withFlags({ ...s, dark }, first ? ["secret"] : []);
    if (!first) return { state, happened: [{ type: "dark", on: dark }] };
    const r = say(state, "secret");
    return { state: r.state, happened: [{ type: "dark", on: true }, { type: "secret" }, ...r.happened] };
  }
  if (thing.kind === "feather") {
    if (has(s, "feather")) return { state: s, happened: [] };
    const r = say(withFlags(s, ["feather"]), "feather");
    return { state: r.state, happened: [{ type: "feather" }, ...r.happened] };
  }
  // The page: a word about it while it is pale, the end of the quest once it has its ink.
  if (!s.restored) return say(s, "pageDark");
  return { state: { ...s, done: true }, happened: [{ type: "done" }] };
}

export interface Goals {
  /** Found the dark room's picture, or asked the scholar for more. */
  curiosity: boolean;
  /** Lit the page within the turns this style allows. */
  ingenuity: boolean;
  /** Stopped to greet the cat. */
  kindness: boolean;
  feather: boolean;
  turns: number;
  par: number;
}
/** The three goals of the quest. They are about what the player did, and never grade a person from history. */
export function goals(s: SceneState): Goals {
  const slack = TURN_SLACK[s.style];
  return {
    curiosity: has(s, "secret") || has(s, "askedMore"),
    ingenuity: s.restored && (slack === null || s.turns <= s.par + slack),
    kindness: has(s, "metCat"),
    feather: has(s, "feather"),
    turns: s.turns,
    par: s.par,
  };
}

/** What is kept of a quest in progress: enough to put the room back, and nothing that cannot be checked. */
export interface Snapshot {
  style: PlayStyle;
  leans: Record<string, Lean>;
  turns: number;
  flags: string[];
  restored: boolean;
  dark: boolean;
}
export const FLAGS = ["metScholar", "askedMore", "metCat", "secret", "feather"] as const;
export function snapshot(s: SceneState): Snapshot {
  return { style: s.style, leans: Object.fromEntries(s.puzzle.mirrors.map((m) => [m.id, m.lean])), turns: s.turns, flags: [...s.flags], restored: s.restored, dark: s.dark };
}
/**
 * A quest put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * room is built afresh for the style and only the leans, the count, known flags and two switches are laid over it.
 * A conversation is never restored: the player comes back with control.
 */
export function restore(x: unknown): SceneState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newScene(o.style);
  const leans = o.leans;
  if (typeof leans !== "object" || leans === null) return null;
  const mirrors: Mirror[] = [];
  for (const m of base.puzzle.mirrors) {
    const lean = (leans as Record<string, unknown>)[m.id];
    if (lean !== "/" && lean !== "\\") return null;
    mirrors.push({ ...m, lean });
  }
  if (typeof o.turns !== "number" || !Number.isInteger(o.turns) || o.turns < 0 || o.turns > 100000) return null;
  if (!Array.isArray(o.flags) || typeof o.restored !== "boolean" || typeof o.dark !== "boolean") return null;
  const flags = FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  const puzzle = { ...base.puzzle, mirrors };
  // The ink cannot be back unless the page was lit at some time; a lit page always has its ink.
  const restored = o.restored || trace(puzzle).lit;
  if (restored && o.turns < base.par) return null;
  return { ...base, puzzle, turns: o.turns, flags: [...flags], talk: null, restored, dark: o.dark };
}

/** A whole play as a list of commands gives the same end every time: used by the tests and the browser tool. */
export function replay(style: PlayStyle, commands: Command[]): SceneState {
  let s = newScene(style);
  for (const c of commands) s = apply(s, c).state;
  return s;
}
