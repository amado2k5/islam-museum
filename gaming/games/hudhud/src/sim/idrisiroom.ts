// Al-Idrisi's hall: the scattered sheets played by flying. A pure function from the hall's state and a command to a new
// state, what happened, and the commands of the scattered sheets' rules it gave. Those rules (./sheets) are not touched:
// a sheet touched while another is lifted is exactly the page's second press, the exchange of the two (`exchange`, one
// move); the lamp is the page's "Check the map" (`check`); and a question asked, an answer given or the feather found is
// a `flag`; so the counts, the goals, the three ways of playing and the messages are the page quest's (ui/sheets.ts) to
// the letter.
//
// What the hall adds is only the page's first press, made by a bird: lifting a sheet. Lifting is not a move. A sheet
// touched with none lifted is lifted; touched again it is put down; touching another sheet exchanges the two, and
// neither stays lifted, as on the page, where the place chosen is let go after an exchange.
import { SHEETS_SLACK, sheetsMap } from "../content/sheets";
import { ISR_SCRIPTS, isrThings, type IsrSpeaker } from "../content/idrisi-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { SHEETS_FLAGS, applySheets, newSheets, restoreSheets, sheetsGoals, snapshotSheets, type SheetsCommand, type SheetsFlag, type SheetsSnapshot, type SheetsState, type SheetsStyle } from "./sheets";

export interface IdrisiState {
  sheets: SheetsState;
  /** The place whose sheet is lifted, or null. */
  lifted: number | null;
  talk: Talk | null;
}
export type IdrisiCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type IdrisiHappened =
  | { type: "lift"; place: number }
  | { type: "put"; place: number }
  /** Two sheets exchanged: one move. */
  | { type: "exchange"; a: number; b: number }
  /** The map checked by the lamp: how many seams match, of how many. */
  | { type: "check"; matched: number; total: number }
  /** Every seam matches and the map is done. */
  | { type: "opened" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface IdrisiResult {
  state: IdrisiState;
  happened: IdrisiHappened[];
  /** The scattered sheets' commands this step gave, in order: the same the page quest gives for the same act. */
  commands: SheetsCommand[];
}

export function newIdrisiRoom(style: SheetsStyle): IdrisiState {
  return { sheets: newSheets(style, sheetsMap(style)), lifted: null, talk: open(ISR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is SheetsFlag => (SHEETS_FLAGS as readonly string[]).includes(f);

/** The page's command a thing of the hall gives when touched, given which sheet is lifted; null for a person, the stack, or a sheet that is only lifted or put down. */
export function commandOf(s: IdrisiState, id: string): SheetsCommand | null {
  const thing = isrThings(s.sheets.style, false).find((t) => t.id === id);
  if (!thing) return null;
  if (thing.kind === "lamp") return { type: "check" };
  if (thing.kind === "place") return s.lifted !== null && s.lifted !== thing.place ? { type: "exchange", a: s.lifted, b: thing.place! } : null;
  return null;
}

export function applyIdrisiRoom(s: IdrisiState, c: IdrisiCommand): IdrisiResult {
  const commands: SheetsCommand[] = [];
  let sheets = s.sheets;
  const give = (cmd: SheetsCommand) => {
    const next = applySheets(sheets, cmd);
    if (next === sheets) return;
    sheets = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: IdrisiState, script: string, happened: IdrisiHappened[] = []): IdrisiResult => ({ state: { ...state, sheets, talk: open(ISR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: IdrisiResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<IsrSpeaker>(ISR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<IsrSpeaker>(ISR_SCRIPTS, s.talk, c.index, new Set<string>(s.sheets.flags));
      flags(step.set);
      return { state: { ...s, sheets, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the hall is touched.
    return none;
  }
  if (c.type !== "touch" || s.sheets.done) return none;
  const thing = isrThings(s.sheets.style, false).find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "place") {
    const p = thing.place!;
    if (s.lifted === null) return { state: { ...s, lifted: p }, happened: [{ type: "lift", place: p }], commands };
    if (s.lifted === p) return { state: { ...s, lifted: null }, happened: [{ type: "put", place: p }], commands };
    const a = s.lifted;
    give({ type: "exchange", a, b: p });
    const happened: IdrisiHappened[] = [{ type: "exchange", a, b: p }];
    if (sheets.done) return say({ ...s, lifted: null }, "done", [...happened, { type: "opened" }]);
    return { state: { ...s, sheets, lifted: null }, happened, commands };
  }
  if (thing.kind === "lamp") {
    give({ type: "check" });
    const last = sheets.last;
    const happened: IdrisiHappened[] = last?.type === "check" ? [{ type: "check", matched: last.matched, total: last.total }] : [];
    if (sheets.done) return say({ ...s, lifted: null }, "done", [...happened, { type: "opened" }]);
    return { state: { ...s, sheets }, happened, commands };
  }
  if (thing.kind === "idrisi") return say(s, "idrisi");
  if (thing.kind === "helper") {
    const has = (f: SheetsFlag) => s.sheets.flags.includes(f);
    if (has("kind")) return say(s, "helperKind");
    if (has("answered")) return say(s, "helperBlunt");
    return say(s, "helper");
  }
  // Under the stack of loose sheets on the tall shelf: the feather the first time, nothing more after (the page's own lines).
  if (s.sheets.flags.includes("feather")) return say(s, "stackAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "stack", [{ type: "feather" }]);
}

/** The four goals, exactly as the page quest counts them. */
export const idrisiGoals = (s: IdrisiState) => sheetsGoals(s.sheets, SHEETS_SLACK[s.sheets.style]);

/** What is kept: the scattered sheets' own snapshot (the page quest can take it up as it is), and which sheet is lifted. */
export type IdrisiSnapshot = SheetsSnapshot & { lifted: number | null };
export const snapshotIdrisi = (s: IdrisiState): IdrisiSnapshot => ({ ...snapshotSheets(s.sheets), lifted: s.lifted });
/** Whether there is anything worth keeping: an exchange, a check, a question or an answer, or a sheet lifted. */
export const worthKeeping = (s: IdrisiState): boolean => !s.sheets.done && (s.sheets.moves > 0 || s.sheets.checks > 0 || s.sheets.flags.length > 0 || s.lifted !== null);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/sheets.ts), with the lifted sheet added:
 * after an exchange, a check, a flag, or a sheet lifted or put down, the hall as it now stands if there is anything
 * worth keeping, or nothing (null) if there is not; a talk changes nothing kept, and the map in order is finished (the
 * host clears its place). `undefined` means: leave what is kept as it is.
 */
export function keptAfter(before: IdrisiState, after: IdrisiState, cmds: readonly SheetsCommand[]): IdrisiSnapshot | null | undefined {
  if (after.sheets.done) return undefined;
  if (before.lifted === after.lifted && cmds.length === 0) return undefined;
  return worthKeeping(after) ? snapshotIdrisi(after) : null;
}
/**
 * A hall put back from what was saved, or null if the map cannot be trusted (sim/sheets.ts proves it). A lifted sheet
 * comes back only if its place is on this way of playing's map. A conversation is never restored. A snapshot the page
 * quest kept (no `lifted`) comes back with no sheet lifted.
 */
export function restoreIdrisi(x: unknown): IdrisiState | null {
  const sheets = restoreSheets(x, sheetsMap);
  if (!sheets) return null;
  const l = (x as Record<string, unknown>).lifted;
  const lifted = typeof l === "number" && Number.isInteger(l) && l >= 0 && l < sheets.grid.length ? l : null;
  return { sheets, lifted, talk: null };
}
