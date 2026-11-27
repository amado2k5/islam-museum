// Ibn Battuta's inn: the road threaded by flying. A pure function from the inn's state and a command to a new state, what
// happened, and the commands of the road's rules it gave. Those rules (./route) are not touched: a bead touched is
// exactly the page's press on that bead's button (ui/route.ts: `go` that stop), and the scroll on the lectern touched is
// exactly the page's "Show the stage again" (`peek`); a question asked, an answer given or the feather found is a `flag`;
// so the thread, the slips, the sentence shown or hidden, the goals, the three ways of playing and the messages are the
// page quest's to the letter.
import { routeStage } from "../content/route";
import { IBR_SCRIPTS, ibrThings, type IbrSpeaker } from "../content/battuta-room";
import { back, choose, forward, open, type Talk } from "../narrative/dialogue";
import { ROUTE_FLAGS, ROUTE_SLACK, applyRoute, newRoute, restoreRoute, routeGoals, snapshotRoute, type RouteCommand, type RouteFlag, type RouteSnapshot, type RouteState, type RouteStyle } from "./route";

export interface BattutaState {
  route: RouteState;
  talk: Talk | null;
}
export type BattutaCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type BattutaHappened =
  /** The next stop: the thread moves on to it. */
  | { type: "step"; stop: string }
  /** A wrong bead: a slip; in Challenge the thread goes back to the first stop as well. */
  | { type: "slip"; stop: string; reset: boolean }
  /** The stage's sentence shown again from the scroll (a slip in Challenge). */
  | { type: "peek"; slip: boolean }
  /** The scroll touched while the sentence is already showing: nothing changes, and the sentence is read again. */
  | { type: "read" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface BattutaResult {
  state: BattutaState;
  happened: BattutaHappened[];
  /** The road's commands this step gave, in order: the same the page quest gives for the same act. */
  commands: RouteCommand[];
}

export function newBattutaRoom(style: RouteStyle): BattutaState {
  return { route: newRoute(style, routeStage(style)), talk: open(IBR_SCRIPTS, "intro") };
}

const isFlag = (f: string): f is RouteFlag => (ROUTE_FLAGS as readonly string[]).includes(f);

/** The page's command a thing of the inn gives when touched: `go` for a bead, `peek` for the scroll; null for a person or the saddlebag. */
export function commandOf(s: BattutaState, id: string): RouteCommand | null {
  const thing = ibrThings(s.route.style, false).find((t) => t.id === id);
  if (!thing) return null;
  if (thing.kind === "bead") return { type: "go", stop: thing.stop! };
  if (thing.kind === "scroll") return { type: "peek" };
  return null;
}

export function applyBattutaRoom(s: BattutaState, c: BattutaCommand): BattutaResult {
  const commands: RouteCommand[] = [];
  let route = s.route;
  const give = (cmd: RouteCommand) => {
    const next = applyRoute(route, cmd);
    if (next === route) return;
    route = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: BattutaState, script: string, happened: BattutaHappened[] = []): BattutaResult => ({ state: { ...state, route, talk: open(IBR_SCRIPTS, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: BattutaResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward<IbrSpeaker>(IBR_SCRIPTS, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose<IbrSpeaker>(IBR_SCRIPTS, s.talk, c.index, new Set<string>(s.route.flags));
      flags(step.set);
      return { state: { ...s, route, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the inn is touched.
    return none;
  }
  if (c.type !== "touch" || s.route.done) return none;
  const thing = ibrThings(s.route.style, false).find((t) => t.id === c.id);
  if (!thing) return none;

  if (thing.kind === "bead") {
    give(commandOf(s, c.id)!);
    const last = route.last!;
    const happened: BattutaHappened[] = last.right ? [{ type: "step", stop: last.stop }] : [{ type: "slip", stop: last.stop, reset: route.style === "challenge" }];
    return { state: { ...s, route }, happened, commands };
  }
  if (thing.kind === "scroll") {
    give({ type: "peek" });
    // Showing already (always in Story): the page's button is not there or cannot be pressed, and nothing changes.
    if (route === s.route) return { state: s, happened: [{ type: "read" }], commands };
    return { state: { ...s, route }, happened: [{ type: "peek", slip: route.slips > s.route.slips }], commands };
  }
  if (thing.kind === "ibn") return say(s, "ibn");
  if (thing.kind === "child") {
    const has = (f: RouteFlag) => s.route.flags.includes(f);
    if (has("kind")) return say(s, "childKind");
    if (has("answered")) return say(s, "childBlunt");
    return say(s, "child");
  }
  // In the saddlebag on the high ledge: the feather the first time, nothing more after (the page's own lines).
  if (s.route.flags.includes("feather")) return say(s, "saddlebagAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "saddlebag", [{ type: "feather" }]);
}

/** The road threaded: Hudhud's word that the page can rest (the page's own last line). */
export const afterDone = (s: BattutaState): BattutaState => (s.route.done ? { ...s, talk: open(IBR_SCRIPTS, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const battutaGoals = (s: BattutaState) => routeGoals(s.route, ROUTE_SLACK[s.route.style]);

/** What is kept: the road's own snapshot, nothing more (the page quest can take it up as it is, and the inn the page's). */
export const snapshotBattuta = (s: BattutaState): RouteSnapshot => snapshotRoute(s.route);
/**
 * What the place kept should be after a step, by the page quest's own rule (ui/route.ts command: after any change of the
 * road that does not finish it, its snapshot if the thread has begun, a slip was made or a flag set, or nothing). A talk
 * that changes nothing keeps nothing new. A road finished is cleared by the host. `undefined` means: leave what is kept.
 */
export function keptAfter(before: BattutaState, after: BattutaState): RouteSnapshot | null | undefined {
  if (after.route === before.route || after.route.done) return undefined;
  const r = after.route;
  return r.at > 0 || r.slips > 0 || r.flags.length > 0 ? snapshotBattuta(after) : null;
}
/** An inn put back from what was saved, or null if it cannot be trusted (sim/route.ts proves it). A conversation is never restored. */
export function restoreBattuta(x: unknown): BattutaState | null {
  const route = restoreRoute(x, routeStage);
  return route ? { route, talk: null } : null;
}
