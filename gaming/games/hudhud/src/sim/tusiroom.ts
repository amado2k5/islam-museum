// Al-Tusi's room: the two circles played by flying. A pure function from the room's state and a command to a new state,
// what happened, and the commands of the two circles' rules it gave. Those rules (./couple) are not touched: a lever
// touched is exactly one `set` of the choice it holds to the next value the way of playing offers (as choosing that
// radio button on the page does), the crank is `turn` (the page's "Turn the circles"), and a question asked, an answer
// given or the feather found is a `flag`; so the counts, the goals, the three ways of playing and the shapes are the
// page quest's (ui/couple.ts) to the letter.
//
// A lever is there only for a choice the way of playing offers (Story: the direction; Explorer: the direction and the
// speed; Challenge: all three), as the page shows only the groups with more than one value. A lever's settings go round:
// after the last value the way of playing offers comes the first again.
import { coupleOffer } from "../content/couple";
import { TSR_SCRIPTS, TSR_THINGS, type TsrSpeaker } from "../content/tusi-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { COUPLE_FLAGS, COUPLE_SLACK, applyCouple, coupleGoals, newCouple, restoreCouple, snapshotCouple, type CoupleCommand, type CoupleField, type CoupleFlag, type CoupleGoals, type CoupleSnapshot, type CoupleState, type CoupleStyle, type Offer, type Pt, type Setting, trace } from "./couple";

export interface TusiState {
  couple: CoupleState;
  talk: Talk | null;
}
export type TusiCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type TusiHappened =
  | { type: "lever"; field: CoupleField; value: number }
  | { type: "turn" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface TusiResult {
  state: TusiState;
  happened: TusiHappened[];
  /** The two circles' commands this step gave, in order: the same the page quest gives for the same act. */
  commands: CoupleCommand[];
}

export function newTusiRoom(style: CoupleStyle): TusiState {
  return { couple: newCouple(style, coupleOffer(style)), talk: open(TSR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is CoupleFlag => (COUPLE_FLAGS as readonly string[]).includes(f);
/** The values a choice offers in a way of playing. */
export const valuesOf = (o: Offer, field: CoupleField): number[] => (field === "size" ? o.sizes : field === "speed" ? o.speeds : o.dirs) as number[];
/** Whether the way of playing has a lever for a choice: only when there is more than one value to choose. */
export const hasLever = (o: Offer, field: CoupleField): boolean => valuesOf(o, field).length > 1;
/** What a choice is set to now. */
export const valueNow = (s: CoupleState, field: CoupleField): number => (field === "size" ? s.setting.r : field === "speed" ? s.setting.k : s.setting.d);
/** The value a lever moves to: the next one the way of playing offers, after the last the first again. */
export function nextValue(s: CoupleState, field: CoupleField): number {
  const list = valuesOf(s.offer, field);
  const at = list.indexOf(valueNow(s, field));
  return list[(at + 1) % list.length]!;
}

export function applyTusiRoom(s: TusiState, c: TusiCommand): TusiResult {
  const commands: CoupleCommand[] = [];
  let couple = s.couple;
  const give = (cmd: CoupleCommand) => {
    const next = applyCouple(couple, cmd);
    if (next === couple) return;
    couple = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (script: string, happened: TusiHappened[] = []): TusiResult => ({ state: { couple, talk: open(TSR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: TusiResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<TsrSpeaker>(TSR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<TsrSpeaker>(TSR_SCRIPTS, s.talk, c.index, new Set<string>(s.couple.flags));
      flags(step.set);
      return { state: { couple, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the room is touched.
    return none;
  }
  if (c.type !== "touch" || s.couple.done) return none;
  const thing = TSR_THINGS.find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "lever") {
    const field = thing.field!;
    if (!hasLever(s.couple.offer, field)) return none;
    const value = nextValue(s.couple, field);
    give({ type: "set", field, value });
    return { state: { ...s, couple }, happened: [{ type: "lever", field, value }], commands };
  }
  if (thing.kind === "crank") {
    give({ type: "turn" });
    return { state: { ...s, couple }, happened: [{ type: "turn" }], commands };
  }
  if (thing.kind === "tusi") return say("tusi");
  if (thing.kind === "girl") {
    const has = (f: CoupleFlag) => s.couple.flags.includes(f);
    if (has("kind")) return say("girlKind");
    if (has("answered")) return say("girlBlunt");
    return say("girl");
  }
  // The instruments on the high shelf: the feather the first time, nothing more after (the page's own lines).
  if (s.couple.flags.includes("feather")) return say("shelfAgain");
  give({ type: "flag", flag: "feather" });
  return say("shelf", [{ type: "feather" }]);
}

/** After a turning that drew the line has been shown: Hudhud's word that the page can rest. */
export const afterTurn = (s: TusiState): TusiState => (s.couple.done ? { ...s, talk: open(TSR_SCRIPTS, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const tusiGoals = (s: TusiState): CoupleGoals => coupleGoals(s.couple, COUPLE_SLACK[s.couple.style]);

/** What is kept: the quest's own snapshot, so that the page quest and the room take up each other's place. */
export const snapshotTusi = (s: TusiState): CoupleSnapshot => snapshotCouple(s.couple);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/couple.ts): after a turning that did not
 * find the line, the quest as it now stands; after a turning that found it, nothing new (the finished quest is written
 * into the save when its turning has been shown); after any other change, the quest if it has a turning or a flag,
 * and nothing otherwise. `undefined` means: leave what is kept as it is.
 */
export function keptAfter(s: TusiState, cmds: readonly CoupleCommand[]): CoupleSnapshot | null | undefined {
  if (cmds.length === 0) return undefined;
  if (cmds.some((c) => c.type === "turn")) return s.couple.done ? undefined : snapshotTusi(s);
  return s.couple.turned > 0 || s.couple.flags.length > 0 ? snapshotTusi(s) : null;
}
/** A room put back from what was saved, or null if it cannot be trusted (sim/couple.ts proves it). A talk is never restored. */
export function restoreTusi(x: unknown): TusiState | null {
  const couple = restoreCouple(x, coupleOffer);
  return couple ? { couple, talk: null } : null;
}

/** Points traced for the picture, as on the page (ui/couple.ts); the rules measure the same path with their own count. */
export const POINTS = 360;
/** How long a turning is shown, in milliseconds, when motion is allowed: as long as on the page. */
export const TURNING_MS = 2400;
/**
 * What the model in the room shows: the circles as they are set (or as they were set for the path shown), how far the
 * large circle has turned, and how much of the path is drawn. At rest after a turning the whole path, closed; while a
 * turning is shown, the path so far; before any turning, or once a lever has been moved, no path at all (the rules clear
 * `last`), so that a path is never shown beside circles that did not draw it.
 */
export function modelOf(s: TusiState, turning: boolean, progress: number): { setting: Setting; theta: number; path: Pt[] | null; closed: boolean } {
  const last = s.couple.last;
  if (!last) return { setting: s.couple.setting, theta: 0, path: null, closed: false };
  const all = trace(last.setting, POINTS);
  if (!turning) return { setting: last.setting, theta: 0, path: all, closed: true };
  const p = Math.max(0, Math.min(1, progress));
  return { setting: last.setting, theta: 2 * Math.PI * p, path: all.slice(0, Math.max(2, Math.floor(p * POINTS) + 1)), closed: false };
}
/** The angle a lever leans at for the value it is set to: spread from -30 to 30 degrees over the values offered. */
export function leverAngle(values: number[], value: number): number {
  if (values.length < 2) return 0;
  return -30 + (60 * Math.max(0, values.indexOf(value))) / (values.length - 1);
}
