// Al-Jazari's room: the elephant clock played by flying. A pure function from the room's state and a command to a new
// state, what happened, and the clock commands it gave. The clock's own rules (./clock, ./chainquest) are not touched:
// every placement in the room is exactly one `put` of those rules, the lever is `go`, and a question asked or an
// answer given is a `flag`, so the moves, the fewest, the goals, the three ways of playing and the run's messages are
// the page quest's (ui/clock.ts) to the letter.
//
// What the room adds is only what a bird can do with its beak: carry one part. Carrying is not a move. A part is
// picked up from a place on the clock or from the workbench; touching a place then puts it there. The part that stood
// in that place goes to where the carried part came from (the other place, or the workbench): the clock's own `put`,
// which exchanges the two. Touching the place or the workbench slot it came from puts it back, and touching another
// spare part on the workbench puts the carried one back and takes that one instead. Pulling the lever puts back
// whatever is carried and sets the clock going.
import { CLOCK_SLACK, clockPuzzle } from "../content/clock";
import { JR_SCRIPTS, JR_THINGS, type JrSpeaker } from "../content/jazari-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { spare } from "./chain";
import type { ChainGoals } from "./chainquest";
import { CLOCK_FLAGS, applyClock, clockGoals, newClock, restoreClock, snapshotClock, type ClockCommand, type ClockFlag, type ClockSnapshot, type ClockState, type ClockStyle } from "./clock";

export interface RoomState {
  clock: ClockState;
  /** The part in Hudhud's beak, or null. */
  carrying: string | null;
  talk: Talk | null;
}
export type RoomCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type RoomHappened =
  | { type: "pick"; part: string }
  | { type: "drop"; part: string }
  | { type: "put"; place: number; part: string }
  | { type: "go" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface RoomResult {
  state: RoomState;
  happened: RoomHappened[];
  /** The clock commands this step gave, in order: the same the page quest gives for the same act. */
  commands: ClockCommand[];
}

export function newRoom(style: ClockStyle): RoomState {
  return { clock: newClock(style, clockPuzzle(style)), carrying: null, talk: open(JR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is ClockFlag => (CLOCK_FLAGS as readonly string[]).includes(f);

/** Where a part is now: in a place on the clock, on the workbench (its index among the spare parts), or nowhere. */
export function whereIs(s: RoomState, part: string): { place: number } | { spare: number } | null {
  const place = s.clock.puzzle.places.indexOf(part);
  if (place >= 0) return { place };
  const k = spare(s.clock.puzzle).findIndex((p) => p.id === part);
  return k >= 0 ? { spare: k } : null;
}

export function applyRoom(s: RoomState, c: RoomCommand): RoomResult {
  const commands: ClockCommand[] = [];
  let clock = s.clock;
  const give = (cmd: ClockCommand) => {
    const next = applyClock(clock, cmd);
    if (next === clock) return;
    clock = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: RoomState, script: string, happened: RoomHappened[] = []): RoomResult => ({ state: { ...state, clock, talk: open(JR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: RoomResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<JrSpeaker>(JR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<JrSpeaker>(JR_SCRIPTS, s.talk, c.index, new Set<string>(s.clock.flags));
      flags(step.set);
      return { state: { ...s, clock, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the room is touched.
    return none;
  }
  if (c.type !== "touch" || s.clock.done) return none;
  const thing = JR_THINGS.find((t) => t.id === c.id);
  if (!thing) return none;
  const p = s.clock.puzzle;
  const carried = s.carrying;

  if (thing.kind === "place") {
    const i = thing.index!;
    const here = p.places[i] ?? null;
    if (carried === null) return here ? { state: { ...s, carrying: here }, happened: [{ type: "pick", part: here }], commands } : none;
    if (carried === here) return { state: { ...s, carrying: null }, happened: [{ type: "drop", part: carried }], commands };
    give({ type: "put", place: i, part: carried });
    return { state: { ...s, clock, carrying: null }, happened: [{ type: "put", place: i, part: carried }], commands };
  }
  if (thing.kind === "spare") {
    const part = spare(p)[thing.index!]?.id;
    if (!part) return none;
    if (carried === part) return { state: { ...s, carrying: null }, happened: [{ type: "drop", part }], commands };
    const happened: RoomHappened[] = carried ? [{ type: "drop", part: carried }] : [];
    return { state: { ...s, carrying: part }, happened: [...happened, { type: "pick", part }], commands };
  }
  if (thing.kind === "lever") {
    const happened: RoomHappened[] = carried ? [{ type: "drop", part: carried }] : [];
    give({ type: "go" });
    return { state: { ...s, clock, carrying: null }, happened: [...happened, { type: "go" }], commands };
  }
  if (thing.kind === "jazari") return say(s, "jazari");
  if (thing.kind === "apprentice") {
    const has = (f: ClockFlag) => s.clock.flags.includes(f);
    if (has("kind")) return say(s, "apprenticeKind");
    if (has("answered")) return say(s, "apprenticeBlunt");
    return say(s, "apprentice");
  }
  // The box on the high shelf: the feather the first time, nothing more after.
  if (s.clock.flags.includes("feather")) return say(s, "boxAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "box", [{ type: "feather" }]);
}

/** After a run that made the clock work has been shown: Hudhud's word about the page come loose. */
export const afterRun = (s: RoomState): RoomState => (s.clock.done ? { ...s, talk: open(JR_SCRIPTS, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const roomGoals = (s: RoomState): ChainGoals => clockGoals(s.clock, CLOCK_SLACK[s.clock.style]);

/** What is kept: the clock's own snapshot (the page quest can take it up as it is), and what Hudhud carries. */
export type RoomSnapshot = ClockSnapshot & { carrying: string | null };
export const snapshotRoom = (s: RoomState): RoomSnapshot => ({ ...snapshotClock(s.clock), carrying: s.carrying });
/** Whether there is anything worth keeping: a move, a question or an answer, or a part in the beak. */
export const worthKeeping = (s: RoomState): boolean => !s.clock.done && (s.clock.moves > 0 || s.clock.flags.length > 0 || s.carrying !== null);
/**
 * A room put back from what was saved, or null if the clock cannot be trusted (sim/chainquest.ts proves it). A part
 * in the beak comes back only if it is a part of this way of playing. A conversation is never restored. A snapshot the
 * page quest kept (no `carrying`) comes back with an empty beak.
 */
export function restoreRoom(x: unknown): RoomState | null {
  const clock = restoreClock(x, clockPuzzle);
  if (!clock) return null;
  const c = (x as Record<string, unknown>).carrying;
  const carrying = typeof c === "string" && clock.puzzle.parts.some((p) => p.id === c) ? c : null;
  return { clock, carrying, talk: null };
}
