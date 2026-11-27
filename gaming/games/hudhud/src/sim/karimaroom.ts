// Karima al-Marwaziyya's room: the copies compared by flying. A pure function from the room's state and a command to a
// new state, what happened, and the commands of the copies' rules it gave. Those rules (./collate) are not touched: a
// sign touched is exactly the page's press on that sign's button or on the sign in its picture (ui/collate.ts toggle): a
// sign not marked is `mark`ed (refused and counted if it is not a slip), a marked one is `unmark`ed; and a question asked,
// an answer given or the feather found is a `flag`; so the counts, the goals, the three ways of playing and the messages
// are the page quest's to the letter.
import { COLLATE_SLACK, collatePuzzle } from "../content/collate";
import { KRR_SCRIPTS, krrThings, type KrrSpeaker } from "../content/karima-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { COLLATE_FLAGS, applyCollate, collateGoals, isMarked, newCollate, restoreCollate, snapshotCollate, type CollateCommand, type CollateFlag, type CollateSnapshot, type CollateState, type CollateStyle } from "./collate";

export interface KarimaState {
  collate: CollateState;
  talk: Talk | null;
}
export type KarimaCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type KarimaHappened =
  /** A slip marked: the mark stands. */
  | { type: "mark"; copy: number; place: number }
  /** A mark taken away. */
  | { type: "unmark"; copy: number; place: number }
  /** A mark refused, and counted, as on the page. */
  | { type: "refused"; copy: number; place: number }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface KarimaResult {
  state: KarimaState;
  happened: KarimaHappened[];
  /** The copies' commands this step gave, in order: the same the page quest gives for the same act. */
  commands: CollateCommand[];
}

export function newKarimaRoom(style: CollateStyle): KarimaState {
  return { collate: newCollate(style, collatePuzzle(style)), talk: open(KRR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is CollateFlag => (COLLATE_FLAGS as readonly string[]).includes(f);

/**
 * The page's command a thing of the room gives when touched: for a sign, `unmark` if it is marked and `mark` if not, as
 * the page's toggle does; null for a person or the stack of spare copies.
 */
export function commandOf(s: KarimaState, id: string): CollateCommand | null {
  const thing = krrThings(s.collate.style, false).find((t) => t.id === id);
  if (!thing || thing.kind !== "sign") return null;
  const copy = thing.copy!;
  const place = thing.place!;
  return isMarked(s.collate, copy, place) ? { type: "unmark", copy, place } : { type: "mark", copy, place };
}

export function applyKarimaRoom(s: KarimaState, c: KarimaCommand): KarimaResult {
  const commands: CollateCommand[] = [];
  let collate = s.collate;
  const give = (cmd: CollateCommand) => {
    const next = applyCollate(collate, cmd);
    if (next === collate) return;
    collate = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: KarimaState, script: string, happened: KarimaHappened[] = []): KarimaResult => ({ state: { ...state, collate, talk: open(KRR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: KarimaResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<KrrSpeaker>(KRR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<KrrSpeaker>(KRR_SCRIPTS, s.talk, c.index, new Set<string>(s.collate.flags));
      flags(step.set);
      return { state: { ...s, collate, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the room is touched.
    return none;
  }
  if (c.type !== "touch" || s.collate.done) return none;
  const thing = krrThings(s.collate.style, false).find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "sign") {
    const cmd = commandOf(s, c.id)!;
    give(cmd);
    const last = collate.last;
    // A mark refused changes the count of wrong marks (and what the last command did), as on the page.
    const happened: KarimaHappened[] = last && last.copy === thing.copy && last.place === thing.place ? [{ type: last.type, copy: last.copy, place: last.place }] : [];
    return { state: { ...s, collate }, happened, commands };
  }
  if (thing.kind === "karima") return say(s, "karima");
  if (thing.kind === "boy") {
    const has = (f: CollateFlag) => s.collate.flags.includes(f);
    if (has("kind")) return say(s, "boyKind");
    if (has("answered")) return say(s, "boyBlunt");
    return say(s, "boy");
  }
  // Between the spare copies on top of the tall bookcase: the feather the first time, nothing more after (the page's own lines).
  if (s.collate.flags.includes("feather")) return say(s, "stackAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "stack", [{ type: "feather" }]);
}

/** Every slip marked: Hudhud's word that the page is free (the page's own last line). */
export const afterDone = (s: KarimaState): KarimaState => (s.collate.done ? { ...s, talk: open(KRR_SCRIPTS, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const karimaGoals = (s: KarimaState) => collateGoals(s.collate, COLLATE_SLACK[s.collate.style]);

/** What is kept: the copies' own snapshot, nothing more (the page quest can take it up as it is, and the room the page's). */
export const snapshotKarima = (s: KarimaState): CollateSnapshot => snapshotCollate(s.collate);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/collate.ts: after any change of the
 * copies that does not finish them, their snapshot if there is a mark, a wrong mark or a flag, or nothing). A talk that
 * changes nothing keeps nothing new. Copies finished are cleared by the host. `undefined` means: leave what is kept as it is.
 */
export function keptAfter(before: KarimaState, after: KarimaState): CollateSnapshot | null | undefined {
  if (after.collate === before.collate || after.collate.done) return undefined;
  const c = after.collate;
  return c.marks.length > 0 || c.wrong > 0 || c.flags.length > 0 ? snapshotKarima(after) : null;
}
/** A room put back from what was saved, or null if it cannot be trusted (sim/collate.ts proves it). A conversation is never restored. */
export function restoreKarima(x: unknown): KarimaState | null {
  const collate = restoreCollate(x, collatePuzzle);
  return collate ? { collate, talk: null } : null;
}
