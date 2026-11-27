// Al-Razi's study: the loose leaves played by flying. A pure function from the study's state and a command to a new
// state, what happened, and the commands of the loose leaves' rules it gave. Those rules (./leaves, over ./chainquest)
// are not touched: a leaf touched while another is lifted is exactly the page's second press on its picture, `put` of the
// other place's leaf into the lifted leaf's place (the two change places, one move); the binding frame is the page's "Bind
// the notebook" (`go`); and a question asked, an answer given or the feather found is a `flag`; so the counts, the goals,
// the three ways of playing and the messages are the page quest's (ui/leaves.ts, ui/rowpage.ts) to the letter.
//
// What the study adds is only the page's first press on its picture, made by a bird: lifting a leaf. Lifting is not a
// move. A leaf touched with none lifted is lifted; touched again it is put down; touching another place exchanges the two
// leaves, and neither stays lifted, as on the page, where the place chosen is let go after an exchange. Binding lets go of
// a lifted leaf, as the page lets go of its chosen place while a binding runs.
import { leavesPuzzle, LEAVES_SLACK } from "../content/leaves";
import { RZR_SCRIPTS, rzrThings, type RzrSpeaker } from "../content/razi-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import type { ChainGoals } from "./chainquest";
import { LEAVES_FLAGS, applyLeaves, leavesGoals, newLeaves, restoreLeaves, snapshotLeaves, type LeavesCommand, type LeavesFlag, type LeavesSnapshot, type LeavesState, type LeavesStyle } from "./leaves";

export interface RaziState {
  leaves: LeavesState;
  /** The place whose leaf is lifted, or null. */
  lifted: number | null;
  talk: Talk | null;
}
export type RaziCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type RaziHappened =
  | { type: "lift"; place: number }
  | { type: "put"; place: number }
  /** Two leaves exchanged: one move. */
  | { type: "exchange"; a: number; b: number }
  /** The binding frame touched: the notebook is bound as far as it holds (the run is the rules' `last`). */
  | { type: "bind" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface RaziResult {
  state: RaziState;
  happened: RaziHappened[];
  /** The loose leaves' commands this step gave, in order: the same the page quest gives for the same act. */
  commands: LeavesCommand[];
}

export function newRaziRoom(style: LeavesStyle): RaziState {
  return { leaves: newLeaves(style, leavesPuzzle(style)), lifted: null, talk: open(RZR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is LeavesFlag => (LEAVES_FLAGS as readonly string[]).includes(f);

/**
 * The page's command a thing of the study gives when touched, given which leaf is lifted; null for a person, the bundle,
 * or a leaf that is only lifted or put down. A leaf touched while another is lifted is the page's second press on its
 * picture: the leaf of the place touched put into the lifted leaf's place.
 */
export function commandOf(s: RaziState, id: string): LeavesCommand | null {
  const thing = rzrThings(s.leaves.style, false).find((t) => t.id === id);
  if (!thing) return null;
  if (thing.kind === "frame") return { type: "go" };
  if (thing.kind === "place") {
    const other = s.leaves.puzzle.places[thing.place!];
    return s.lifted !== null && s.lifted !== thing.place && other ? { type: "put", place: s.lifted, part: other } : null;
  }
  return null;
}

export function applyRaziRoom(s: RaziState, c: RaziCommand): RaziResult {
  const commands: LeavesCommand[] = [];
  let leaves = s.leaves;
  const give = (cmd: LeavesCommand) => {
    const next = applyLeaves(leaves, cmd);
    if (next === leaves) return;
    leaves = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: RaziState, script: string, happened: RaziHappened[] = []): RaziResult => ({ state: { ...state, leaves, talk: open(RZR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: RaziResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<RzrSpeaker>(RZR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<RzrSpeaker>(RZR_SCRIPTS, s.talk, c.index, new Set<string>(s.leaves.flags));
      flags(step.set);
      return { state: { ...s, leaves, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the study is touched.
    return none;
  }
  if (c.type !== "touch" || s.leaves.done) return none;
  const thing = rzrThings(s.leaves.style, false).find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "place") {
    const p = thing.place!;
    if (s.lifted === null) return { state: { ...s, lifted: p }, happened: [{ type: "lift", place: p }], commands };
    if (s.lifted === p) return { state: { ...s, lifted: null }, happened: [{ type: "put", place: p }], commands };
    const a = s.lifted;
    const cmd = commandOf(s, c.id);
    if (cmd) give(cmd);
    return { state: { ...s, leaves, lifted: null }, happened: [{ type: "exchange", a, b: p }], commands };
  }
  if (thing.kind === "frame") {
    give({ type: "go" });
    return { state: { ...s, leaves, lifted: null }, happened: [{ type: "bind" }], commands };
  }
  if (thing.kind === "razi") return say(s, "razi");
  if (thing.kind === "child") {
    const has = (f: LeavesFlag) => s.leaves.flags.includes(f);
    if (has("kind")) return say(s, "childKind");
    if (has("answered")) return say(s, "childBlunt");
    return say(s, "child");
  }
  // Between the leaves of the bundle on the tall bookcase: the feather the first time, nothing more after (the page's own lines).
  if (s.leaves.flags.includes("feather")) return say(s, "bundleAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "bundle", [{ type: "feather" }]);
}

/** After a binding that held through every leaf has been shown: Hudhud's word about the page come loose (the page's own last line). */
export const afterRun = (s: RaziState): RaziState => (s.leaves.done ? { ...s, talk: open(RZR_SCRIPTS, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const raziGoals = (s: RaziState): ChainGoals => leavesGoals(s.leaves, LEAVES_SLACK[s.leaves.style]);

/** What is kept: the loose leaves' own snapshot (the page quest can take it up as it is), and which leaf is lifted. */
export type RaziSnapshot = LeavesSnapshot & { lifted: number | null };
export const snapshotRazi = (s: RaziState): RaziSnapshot => ({ ...snapshotLeaves(s.leaves), lifted: s.lifted });
/** Whether there is anything worth keeping: a move, a question or an answer, or a leaf lifted (the page's rule, with the lifted leaf added). */
export const worthKeeping = (s: RaziState): boolean => !s.leaves.done && (s.leaves.moves > 0 || s.leaves.flags.length > 0 || s.lifted !== null);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/rowpage.ts: after anything but a binding
 * that changed the quest, its snapshot if there is a move or a flag, or nothing), with the lifted leaf added. A binding
 * changes nothing that is kept, as on the page (unless it let go of a lifted leaf); nor does a talk. A notebook bound is
 * finished (the host clears its place). `undefined` means: leave what is kept as it is.
 */
export function keptAfter(before: RaziState, after: RaziState, cmds: readonly LeavesCommand[]): RaziSnapshot | null | undefined {
  if (after.leaves.done) return undefined;
  if (before.lifted === after.lifted && cmds.every((k) => k.type === "go")) return undefined;
  return worthKeeping(after) ? snapshotRazi(after) : null;
}
/**
 * A study put back from what was saved, or null if the row cannot be trusted (sim/chainquest.ts proves it). A lifted leaf
 * comes back only if its place is in this way of playing's row. A conversation is never restored. A snapshot the page
 * quest kept (no `lifted`) comes back with no leaf lifted.
 */
export function restoreRazi(x: unknown): RaziState | null {
  const leaves = restoreLeaves(x, leavesPuzzle);
  if (!leaves) return null;
  const l = (x as Record<string, unknown>).lifted;
  const lifted = typeof l === "number" && Number.isInteger(l) && l >= 0 && l < leaves.puzzle.places.length ? l : null;
  return { leaves, lifted, talk: null };
}
