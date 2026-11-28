// The Alhambra's court: the channels of the dry fountain turned by flying. A pure function from the court's state and a
// command to a new state, what happened, and the commands of the channels' rules it gave. Those rules (./channels) are
// not touched: a piece touched is exactly the page's press on that piece, a quarter turn (`turn`, one move); the sluice
// lever is the page's "Open the sluice" (`open`); and a question asked, an answer given or the feather found is a `flag`;
// so the counts, the goals, the three ways of playing and the messages are the page quest's (ui/channels.ts) to the
// letter. A piece that looks the same turned (a crossing, a plain stone) is told so and nothing is counted, as on the page.
import { CHANNELS_SLACK, channelsGrid } from "../content/channels";
import { AHR_SCRIPTS, ahrThings, type AhrSpeaker } from "../content/alhambra-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { CHANNELS_FLAGS, applyChannels, channelsGoals, flow, gridOf, newChannels, restoreChannels, snapshotChannels, turnable, type ChannelsCommand, type ChannelsFlag, type ChannelsSnapshot, type ChannelsState, type ChannelsStyle } from "./channels";

/** The Challenge way of playing shows the water only after the sluice is opened, and until the next turn (the page's rule, ui/channels.ts). */
export const waterShown = (c: ChannelsState): boolean => c.style !== "challenge" || c.last?.type === "open";
/** How the page lets the water run (ui/channels.ts runWater): one step of the channel more every `delay` milliseconds, until it has run its whole way (`far` steps). */
export function runOf(c: ChannelsState): { far: number; delay: number } {
  const far = flow(gridOf(c)).reach.reduce((a, b) => Math.max(a, b), 0) + 1;
  return { far, delay: Math.max(25, Math.min(70, Math.floor(700 / far))) };
}

export interface AlhambraState {
  channels: ChannelsState;
  talk: Talk | null;
}
export type AlhambraCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type AlhambraHappened =
  /** A piece given a quarter turn: one move. */
  | { type: "turn"; place: number }
  /** A piece that looks the same turned: nothing counted. */
  | { type: "fixed"; place: number }
  /** The sluice opened (Challenge): how many basins have water, of how many, and how many places spill. */
  | { type: "open"; wet: number; basins: number; leaks: number }
  /** The water reaches every basin (and, where asked, spills nowhere): the grid is done. */
  | { type: "opened" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface AlhambraResult {
  state: AlhambraState;
  happened: AlhambraHappened[];
  /** The channels' commands this step gave, in order: the same the page quest gives for the same act. */
  commands: ChannelsCommand[];
}

export function newAlhambraRoom(style: ChannelsStyle): AlhambraState {
  return { channels: newChannels(style, channelsGrid(style)), talk: open(AHR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is ChannelsFlag => (CHANNELS_FLAGS as readonly string[]).includes(f);

/** The page's command a thing of the court gives when touched; null for a person, the rim, or a piece that cannot be turned. */
export function commandOf(s: AlhambraState, id: string): ChannelsCommand | null {
  const thing = ahrThings(s.channels.style, false).find((t) => t.id === id);
  if (!thing) return null;
  if (thing.kind === "sluice") return { type: "open" };
  if (thing.kind === "place") return turnable(s.channels.cells[thing.place!]!.kind) ? { type: "turn", cell: thing.place! } : null;
  return null;
}

export function applyAlhambraRoom(s: AlhambraState, c: AlhambraCommand): AlhambraResult {
  const commands: ChannelsCommand[] = [];
  let channels = s.channels;
  const give = (cmd: ChannelsCommand) => {
    const next = applyChannels(channels, cmd);
    if (next === channels) return;
    channels = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: AlhambraState, script: string, happened: AlhambraHappened[] = []): AlhambraResult => ({ state: { ...state, channels, talk: open(AHR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: AlhambraResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<AhrSpeaker>(AHR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<AhrSpeaker>(AHR_SCRIPTS, s.talk, c.index, new Set<string>(s.channels.flags));
      flags(step.set);
      return { state: { ...s, channels, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the court is touched.
    return none;
  }
  if (c.type !== "touch" || s.channels.done) return none;
  const thing = ahrThings(s.channels.style, false).find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "place") {
    const p = thing.place!;
    if (!turnable(s.channels.cells[p]!.kind)) return { state: s, happened: [{ type: "fixed", place: p }], commands };
    give({ type: "turn", cell: p });
    const happened: AlhambraHappened[] = [{ type: "turn", place: p }];
    if (channels.done) return say(s, "done", [...happened, { type: "opened" }]);
    return { state: { ...s, channels }, happened, commands };
  }
  if (thing.kind === "sluice") {
    give({ type: "open" });
    const last = channels.last;
    const happened: AlhambraHappened[] = last?.type === "open" ? [{ type: "open", wet: last.wet, basins: last.basins, leaks: last.leaks }] : [];
    if (channels.done) return say(s, "done", [...happened, { type: "opened" }]);
    return { state: { ...s, channels }, happened, commands };
  }
  if (thing.kind === "waterkeeper") return say(s, "voice");
  if (thing.kind === "girl") {
    const has = (f: ChannelsFlag) => s.channels.flags.includes(f);
    if (has("kind")) return say(s, "kidKind");
    if (has("answered")) return say(s, "kidBlunt");
    return say(s, "kid");
  }
  // On the rim of the dry fountain: the feather the first time, nothing more after (the page's own lines).
  if (s.channels.flags.includes("feather")) return say(s, "rimAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "rim", [{ type: "feather" }]);
}

/** The four goals, exactly as the page quest counts them. */
export const alhambraGoals = (s: AlhambraState) => channelsGoals(s.channels, CHANNELS_SLACK[s.channels.style]);

/** What is kept: the channels' own snapshot, as the page keeps it (the page quest can take it up as it is, and the court the page's). */
export type AlhambraSnapshot = ChannelsSnapshot;
export const snapshotAlhambra = (s: AlhambraState): AlhambraSnapshot => snapshotChannels(s.channels);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/channels.ts): after a turn, an opening of
 * the sluice or a flag, the court as it now stands if anything is worth keeping (a turn, an opening, a flag); a talk or a
 * piece that cannot be turned changes nothing kept; the grid done is finished (the host clears its place). `undefined`
 * means: leave what is kept as it is.
 */
export function keptAfter(after: AlhambraState, cmds: readonly ChannelsCommand[]): AlhambraSnapshot | undefined {
  const c = after.channels;
  if (cmds.length === 0 || c.done) return undefined;
  return c.moves > 0 || c.openings > 0 || c.flags.length > 0 ? snapshotAlhambra(after) : undefined;
}
/** A court put back from what was saved, or null if the grid cannot be trusted (sim/channels.ts proves it). A conversation is never restored. */
export function restoreAlhambra(x: unknown): AlhambraState | null {
  const channels = restoreChannels(x, channelsGrid);
  return channels ? { channels, talk: null } : null;
}
