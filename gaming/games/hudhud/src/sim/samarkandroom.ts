// The paper workshop of Samarkand: the paper quest played by flying. A pure function from the workshop's state and a
// command to a new state, what happened, and the commands of the paper's rules it gave. Those rules (./paper, over
// ./chainquest) are not touched: a card touched while another is lifted is exactly the page's second press on its
// picture, `put` of the other place's card into the lifted card's place (the two change places, one move); the bell is
// the page's "Make a sheet" (`go`); and a question asked, an answer given or the feather found is a `flag`; so the counts,
// the goals, the three ways of playing and the messages are the page quest's (ui/paper.ts, ui/rowpage.ts) to the letter.
//
// What the workshop adds is only the page's first press on its picture, made by a bird: lifting a card. Lifting is not a
// move. A card touched with none lifted is lifted; touched again it is put down; touching another place exchanges the two
// cards, and neither stays lifted, as on the page, where the place chosen is let go after an exchange. Ringing the bell
// lets go of a lifted card, as the page lets go of its chosen place while a sheet is being made. (The same arrangement as
// al-Razi's study, sim/raziroom.ts, over the same shared rules.)
import { paperPuzzle, PAPER_SLACK } from "../content/paper";
import { SMR_SCRIPTS, smrThings, type SmrSpeaker } from "../content/samarkand-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import type { ChainGoals } from "./chainquest";
import { PAPER_FLAGS, applyPaper, newPaper, paperGoals, restorePaper, snapshotPaper, type PaperCommand, type PaperFlag, type PaperSnapshot, type PaperState, type PaperStyle } from "./paper";

export interface SamarkandState {
  paper: PaperState;
  /** The place whose card is lifted, or null. */
  lifted: number | null;
  talk: Talk | null;
}
export type SamarkandCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type SamarkandHappened =
  | { type: "lift"; place: number }
  | { type: "put"; place: number }
  /** Two cards exchanged: one move. */
  | { type: "exchange"; a: number; b: number }
  /** The bell rung: a sheet is made as far as the row allows (the run is the rules' `last`). */
  | { type: "ring" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface SamarkandResult {
  state: SamarkandState;
  happened: SamarkandHappened[];
  /** The paper's commands this step gave, in order: the same the page quest gives for the same act. */
  commands: PaperCommand[];
}

export function newSamarkandRoom(style: PaperStyle): SamarkandState {
  return { paper: newPaper(style, paperPuzzle(style)), lifted: null, talk: open(SMR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is PaperFlag => (PAPER_FLAGS as readonly string[]).includes(f);

/**
 * The page's command a thing of the workshop gives when touched, given which card is lifted; null for a person, the
 * spare mould, or a card that is only lifted or put down. A card touched while another is lifted is the page's second
 * press on its picture: the card of the place touched put into the lifted card's place.
 */
export function commandOf(s: SamarkandState, id: string): PaperCommand | null {
  const thing = smrThings(s.paper.style, false).find((t) => t.id === id);
  if (!thing) return null;
  if (thing.kind === "bell") return { type: "go" };
  if (thing.kind === "place") {
    const other = s.paper.puzzle.places[thing.place!];
    return s.lifted !== null && s.lifted !== thing.place && other ? { type: "put", place: s.lifted, part: other } : null;
  }
  return null;
}

export function applySamarkandRoom(s: SamarkandState, c: SamarkandCommand): SamarkandResult {
  const commands: PaperCommand[] = [];
  let paper = s.paper;
  const give = (cmd: PaperCommand) => {
    const next = applyPaper(paper, cmd);
    if (next === paper) return;
    paper = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: SamarkandState, script: string, happened: SamarkandHappened[] = []): SamarkandResult => ({ state: { ...state, paper, talk: open(SMR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: SamarkandResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<SmrSpeaker>(SMR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<SmrSpeaker>(SMR_SCRIPTS, s.talk, c.index, new Set<string>(s.paper.flags));
      flags(step.set);
      return { state: { ...s, paper, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the workshop is touched.
    return none;
  }
  if (c.type !== "touch" || s.paper.done) return none;
  const thing = smrThings(s.paper.style, false).find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "place") {
    const p = thing.place!;
    if (s.lifted === null) return { state: { ...s, lifted: p }, happened: [{ type: "lift", place: p }], commands };
    if (s.lifted === p) return { state: { ...s, lifted: null }, happened: [{ type: "put", place: p }], commands };
    const a = s.lifted;
    const cmd = commandOf(s, c.id);
    if (cmd) give(cmd);
    return { state: { ...s, paper, lifted: null }, happened: [{ type: "exchange", a, b: p }], commands };
  }
  if (thing.kind === "bell") {
    give({ type: "go" });
    return { state: { ...s, paper, lifted: null }, happened: [{ type: "ring" }], commands };
  }
  if (thing.kind === "maker") return say(s, "maker");
  if (thing.kind === "child") {
    const has = (f: PaperFlag) => s.paper.flags.includes(f);
    if (has("kind")) return say(s, "childKind");
    if (has("answered")) return say(s, "childBlunt");
    return say(s, "child");
  }
  // Caught in the spare mould on top of the tall rack: the feather the first time, nothing more after (the page's own lines).
  if (s.paper.flags.includes("feather")) return say(s, "mouldAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "mould", [{ type: "feather" }]);
}

/** After a run that made the sheet has been shown: Hudhud's word about the page made whole (the page's own last line). */
export const afterRun = (s: SamarkandState): SamarkandState => (s.paper.done ? { ...s, talk: open(SMR_SCRIPTS, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const samarkandGoals = (s: SamarkandState): ChainGoals => paperGoals(s.paper, PAPER_SLACK[s.paper.style]);

/** What is kept: the paper's own snapshot (the page quest can take it up as it is), and which card is lifted. */
export type SamarkandSnapshot = PaperSnapshot & { lifted: number | null };
export const snapshotSamarkand = (s: SamarkandState): SamarkandSnapshot => ({ ...snapshotPaper(s.paper), lifted: s.lifted });
/** Whether there is anything worth keeping: a move, a question or an answer, or a card lifted (the page's rule, with the lifted card added). */
export const worthKeeping = (s: SamarkandState): boolean => !s.paper.done && (s.paper.moves > 0 || s.paper.flags.length > 0 || s.lifted !== null);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/rowpage.ts: after anything but a run that
 * changed the quest, its snapshot if there is a move or a flag, or nothing), with the lifted card added. Ringing the bell
 * changes nothing that is kept, as on the page (unless it let go of a lifted card); nor does a talk. A sheet made is
 * finished (the host clears its place). `undefined` means: leave what is kept as it is.
 */
export function keptAfter(before: SamarkandState, after: SamarkandState, cmds: readonly PaperCommand[]): SamarkandSnapshot | null | undefined {
  if (after.paper.done) return undefined;
  if (before.lifted === after.lifted && cmds.every((k) => k.type === "go")) return undefined;
  return worthKeeping(after) ? snapshotSamarkand(after) : null;
}
/**
 * A workshop put back from what was saved, or null if the row cannot be trusted (sim/chainquest.ts proves it). A lifted
 * card comes back only if its place is in this way of playing's row. A conversation is never restored. A snapshot the
 * page quest kept (no `lifted`) comes back with no card lifted.
 */
export function restoreSamarkand(x: unknown): SamarkandState | null {
  const paper = restorePaper(x, paperPuzzle);
  if (!paper) return null;
  const l = (x as Record<string, unknown>).lifted;
  const lifted = typeof l === "number" && Number.isInteger(l) && l >= 0 && l < paper.puzzle.places.length ? l : null;
  return { paper, lifted, talk: null };
}
