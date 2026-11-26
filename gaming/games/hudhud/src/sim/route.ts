// Ibn Battuta's road as a quest: a stage of a traveller's journeys, a list of stops, to be threaded in the order the
// museum's record gives them, one stop at a time. A stage is `stops` (distinct ids, the beads) and `road` (the order to
// thread them; an id may come twice, as Baghdad does in the second stage). Pure rules over plain data: nothing here
// draws, nothing is left to chance, and nothing here knows a stop by name (what a stop is called is in its content file).
//
// What the rules are for first: following a route is remembering its order. The thread moves on only when the next stop
// is touched; a wrong stop is a slip. How much a slip costs, and how much of the stage's sentence the player can see,
// is what the three ways of playing change (review ledger, HR-HH-29 to HR-HH-31).
export type RouteStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the child was answered kindly. `answered` is only that the child was answered at all, kindly or not,
// so that the question is not asked again after a resume (the same arrangement as the paper's child).
export const ROUTE_FLAGS = ["askedLeft", "askedWritten", "kind", "feather", "answered"] as const;
export type RouteFlag = (typeof ROUTE_FLAGS)[number];

export interface Stage {
  /** The beads: distinct ids. Their order is the ring's, and is never the road's. */
  stops: string[];
  /** The order to thread them. An id may come twice. */
  road: string[];
}
export type RouteCommand = { type: "go"; stop: string } | { type: "peek" } | { type: "flag"; flag: RouteFlag };
/** What the last press did: which stop, and whether it was the next one. */
export interface Outcome {
  stop: string;
  right: boolean;
}
export interface RouteState {
  style: RouteStyle;
  stage: Stage;
  /** How far along the road the thread has come: stops threaded so far, 0 to `road.length`. */
  at: number;
  /** Wrong stops, and in Challenge each time the stage's sentence was shown again. */
  slips: number;
  /** Whether the stage's sentence is on the page now. */
  showing: boolean;
  flags: RouteFlag[];
  /** What the last stop pressed did; null before the first, and after the sentence was shown again. */
  last: Outcome | null;
  done: boolean;
}

/** Moves allowed for the Ingenuity goal: slips at most this many. Story has no count. */
export const ROUTE_SLACK: Record<RouteStyle, number | null> = { story: null, explorer: 2, challenge: 1 };

/** A stage that makes sense: beads that are distinct, a road that is not empty and uses only those beads. */
export function checkStage(s: Stage): string | null {
  if (s.stops.length < 2) return "fewer than two stops";
  if (new Set(s.stops).size !== s.stops.length) return "a stop comes twice among the beads";
  if (s.road.length < 2) return "a road of fewer than two steps";
  if (s.road.some((id) => !s.stops.includes(id))) return "the road uses a stop that is not a bead";
  if (s.stops.some((id) => !s.road.includes(id))) return "a bead is not on the road";
  return null;
}

/** Whether the sentence is on the page when a place is put back (a resume), given how far the thread has come. */
function showsAt(style: RouteStyle, at: number, slips: number): boolean {
  if (style === "story") return true;
  if (style === "explorer") return at === 0;
  return at === 0 && slips === 0;
}

export function newRoute(style: RouteStyle, stage: Stage): RouteState {
  const bad = checkStage(stage);
  if (bad) throw new Error(`the ${style} stage cannot be played: ${bad}`);
  return { style, stage, at: 0, slips: 0, showing: true, flags: [], last: null, done: false };
}

/** The stop the thread needs next, or null when the road is done. */
export const nextStop = (s: RouteState): string | null => (s.at < s.stage.road.length ? s.stage.road[s.at]! : null);

/** The beads whose stops are on the thread so far. */
export const threaded = (s: RouteState): string[] => s.stage.road.slice(0, s.at);

/**
 * A bead is pressed. The next stop moves the thread on (and ends the stage at the last). Any other stop is a slip; in
 * Challenge the thread goes back to the start as well. What is not a bead of the stage changes nothing. Once the thread
 * has begun, Explorer and Challenge hide the stage's sentence; Story never does.
 */
export function go(s: RouteState, stop: string): RouteState {
  if (s.done || !s.stage.stops.includes(stop)) return s;
  if (stop === nextStop(s)) {
    const at = s.at + 1;
    return { ...s, at, showing: s.style === "story", last: { stop, right: true }, done: at === s.stage.road.length };
  }
  return { ...s, slips: s.slips + 1, at: s.style === "challenge" ? 0 : s.at, last: { stop, right: false } };
}

/** The stage's sentence is shown again. Free in Story (it never leaves) and in Explorer; a slip in Challenge. Nothing if it is showing. */
export function peek(s: RouteState): RouteState {
  if (s.done || s.showing) return s;
  return { ...s, showing: true, slips: s.slips + (s.style === "challenge" ? 1 : 0), last: null };
}

export function applyRoute(s: RouteState, c: RouteCommand): RouteState {
  if (s.done) return s;
  if (c.type === "go") return go(s, c.stop);
  if (c.type === "peek") return peek(s);
  return !(ROUTE_FLAGS as readonly string[]).includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
}

/** The four goals, in the shape every quest's record has. `turns` is the stops threaded and the slips made, which is the same for any order of the same play. */
export interface RouteGoals {
  turns: number;
  curiosity: boolean;
  ingenuity: boolean;
  kindness: boolean;
  feather: boolean;
}
export function routeGoals(s: RouteState, slack: number | null): RouteGoals {
  const has = (f: RouteFlag) => s.flags.includes(f);
  return { turns: s.at + s.slips, curiosity: has("askedLeft") && has("askedWritten"), ingenuity: slack === null || s.slips <= slack, kindness: has("kind"), feather: has("feather") };
}

/** What is kept of a quest in progress: how far, the slips, and the flags. Nothing that cannot be checked. */
export interface RouteSnapshot {
  style: RouteStyle;
  at: number;
  slips: number;
  flags: RouteFlag[];
}
export function snapshotRoute(s: RouteState): RouteSnapshot {
  return { style: s.style, at: s.at, slips: s.slips, flags: [...s.flags] };
}

/**
 * A quest put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the stage
 * is built afresh for the style (`stageOf`) and only how far, the slips and the known flags are laid over it. How far is a
 * whole number from nothing to one short of the road's end (a finished stage is not a place to come back to); the slips
 * are a whole number, not negative. Whether the sentence shows is worked out again from those, never read from the file.
 */
export function restoreRoute(x: unknown, stageOf: (style: RouteStyle) => Stage): RouteState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newRoute(o.style, stageOf(o.style));
  const whole = (n: unknown, max: number): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= max;
  if (!whole(o.at, base.stage.road.length - 1)) return null;
  if (!whole(o.slips, 100000)) return null;
  if (!Array.isArray(o.flags)) return null;
  const flags = ROUTE_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, at: o.at, slips: o.slips, flags: [...flags], showing: showsAt(o.style, o.at, o.slips) };
}
