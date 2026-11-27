// A sorting room: the sorting rules (./sort) played by flying, shared by every sorting quest that has a room (the coffee
// room first, 27 November 2026; al-Jahiz's animal cards are the other sorting quest and can use it with its own picture,
// groups and words). A pure function from the room's state and a command to a new state, what happened, and the commands
// of the sorting rules it gave. Those rules are not touched: every act in the room that changes the sorting is exactly
// one command the page quest's own controls give (ui/sortpage.ts), so the moves, the failed showings, the goals, the
// three ways of playing and the messages are the page quest's to the letter.
//
// What the room adds is only what a bird can do with its beak: carry one card. Carrying is not a move, as choosing a
// card on the page's picture is not one. A card is picked up from the table or from a group by touching it; touching a
// group's sign then puts it there (the page's `place`, exactly as pressing a tray on the picture with that card chosen).
// Touching the card's own place puts it back where it was (nothing is counted); touching another card puts the carried
// one back and takes that one instead (as choosing another card on the page). While a card that is in a group is
// carried, its own empty place on the table can be touched to take it out of its group (the page's band of cards not
// placed: `place` with no group). Touching the bell puts back whatever is carried and shows (the page's `show`: refused
// and not counted with a card not placed, counted when wrong). A group's sign touched with nothing carried only says
// what the group is. Nothing here names a card, a group or a person of any one quest: they come in as data.
import { back, choose, forward, open, type Script, type Talk } from "../narrative/dialogue";
import { SORT_FLAGS, applySort, newSort, restoreSort, snapshotSort, sortGoals, type SortCommand, type SortDef, type SortFlag, type SortSlack, type SortSnapshot, type SortState, type SortStyle } from "./sort";

/** The ids of a sorting room's things that are not cards or groups. Cards are `card-<item>`, groups' signs `group-<group>`, and a carried card's own empty place on the table `rest-<item>`. */
export interface SortRoomIds {
  /** The person who speaks for the subject (the keeper of the records; al-Jahiz). */
  voice: string;
  /** The child who has the cards. */
  kid: string;
  /** Where the feather hides. */
  hide: string;
  /** What shows the cards (the bell). */
  bell: string;
}
/**
 * What a sorting room is made of: its talk (scripts named intro, voice, kid, kidKind, kidBlunt, hide, hideAgain and done),
 * its cards and groups for each way of playing (the quest's own), its slack for the Ingenuity goal (the quest's own), and
 * the ids of its things.
 */
export interface SortRoomSpec {
  scripts: Record<string, Script<string>>;
  def(style: SortStyle): SortDef;
  slack: Record<SortStyle, SortSlack | null>;
  ids: SortRoomIds;
}
/** The scripts every sorting room has. */
export const SORT_ROOM_SCRIPTS = ["intro", "voice", "kid", "kidKind", "kidBlunt", "hide", "hideAgain", "done"] as const;

export interface SortRoomState {
  sort: SortState;
  /** The card in Hudhud's beak, or null. It stays where the sorting says it is (on the table or in its group) until it is put somewhere else. */
  carrying: string | null;
  talk: Talk | null;
}
export type SortRoomCommand = { type: "touch"; id: string } | { type: "forward" } | { type: "back" } | { type: "choose"; index: number } | { type: "skip" };
export type SortRoomHappened =
  | { type: "pick"; item: string }
  /** The carried card put back where it lies, with nothing counted. */
  | { type: "drop"; item: string }
  /** The page's `place`: a card put in a group, or taken out of one (null). */
  | { type: "place"; item: string; group: string | null }
  /** A group's sign touched with nothing carried: what the group is, said again. */
  | { type: "look"; group: string }
  /** The page's `show`: refused, wrong (counted) or done; what it found is in the sorting's own `last`. */
  | { type: "show" }
  | { type: "talk"; script: string }
  | { type: "line" }
  | { type: "talk-over" }
  | { type: "feather" };
export interface SortRoomResult {
  state: SortRoomState;
  happened: SortRoomHappened[];
  /** The sorting commands this step gave, in order: the same the page quest gives for the same act. */
  commands: SortCommand[];
}

/** What a thing of a sorting room is, from its id. */
export type SortRoomThing = { kind: "card"; item: string } | { kind: "group"; group: string } | { kind: "rest"; item: string } | { kind: "bell" } | { kind: "voice" } | { kind: "kid" } | { kind: "hide" };
export function thingOf(spec: Pick<SortRoomSpec, "ids">, s: Pick<SortRoomState, "sort" | "carrying">, id: string): SortRoomThing | null {
  const { ids } = spec;
  if (id === ids.bell) return { kind: "bell" };
  if (id === ids.voice) return { kind: "voice" };
  if (id === ids.kid) return { kind: "kid" };
  if (id === ids.hide) return { kind: "hide" };
  if (id.startsWith("card-") && s.sort.items.includes(id.slice(5))) return { kind: "card", item: id.slice(5) };
  if (id.startsWith("group-") && s.sort.groups.includes(id.slice(6))) return { kind: "group", group: id.slice(6) };
  // A card's own place on the table is a thing only while that card is carried and is in a group.
  if (id.startsWith("rest-") && id.slice(5) === s.carrying && s.sort.placed[s.carrying] !== null) return { kind: "rest", item: id.slice(5) };
  return null;
}

/**
 * Where every card is to be drawn and touched: on the table in its own place (its number in the order of the cards), or in
 * its group after the cards before it there (the page's own order, art/sort.ts cardRects); and whether it is in the beak.
 * A carried card keeps its place, so that nothing else moves while it is carried.
 */
export function cardPlaces(s: Pick<SortRoomState, "sort" | "carrying">): { item: string; index: number; group: string | null; slot: number; carried: boolean }[] {
  const inGroup = new Map<string, number>();
  return s.sort.items.map((item, index) => {
    const group = s.sort.placed[item] ?? null;
    let slot = index;
    if (group !== null) {
      slot = inGroup.get(group) ?? 0;
      inGroup.set(group, slot + 1);
    }
    return { item, index, group, slot, carried: s.carrying === item };
  });
}

export function newSortRoom(spec: SortRoomSpec, style: SortStyle): SortRoomState {
  return { sort: newSort(style, spec.def(style)), carrying: null, talk: open(spec.scripts, "intro") };
}

const isFlag = (f: string): f is SortFlag => (SORT_FLAGS as readonly string[]).includes(f);

/**
 * The page's command a thing gives when touched now, or null: a group's sign with a card carried is `place` that card
 * there; the carried card's own empty place on the table is `place` it with no group; the bell is `show`. A card touched
 * is only chosen (picked up), as on the page's picture, and gives no command; nor does a person, nor where the feather hides.
 */
export function commandOf(spec: SortRoomSpec, s: SortRoomState, id: string): SortCommand | null {
  const thing = thingOf(spec, s, id);
  if (!thing) return null;
  if (thing.kind === "group") return s.carrying !== null && s.sort.placed[s.carrying] !== thing.group ? { type: "place", item: s.carrying, group: thing.group } : null;
  if (thing.kind === "rest") return { type: "place", item: thing.item, group: null };
  if (thing.kind === "bell") return { type: "show" };
  return null;
}

export function applySortRoom(spec: SortRoomSpec, s: SortRoomState, c: SortRoomCommand): SortRoomResult {
  const commands: SortCommand[] = [];
  let sort = s.sort;
  const give = (cmd: SortCommand) => {
    const next = applySort(sort, cmd);
    if (next === sort) return;
    sort = next;
    commands.push(cmd);
  };
  const flags = (list: string[]) => list.filter(isFlag).forEach((flag) => give({ type: "flag", flag }));
  const say = (state: SortRoomState, script: string, happened: SortRoomHappened[] = []): SortRoomResult => ({ state: { ...state, sort, talk: open(spec.scripts, script) }, happened: [...happened, { type: "talk", script }], commands });
  const none: SortRoomResult = { state: s, happened: [], commands };

  if (s.talk) {
    if (c.type === "forward") {
      const step = forward(spec.scripts, s.talk);
      return { state: { ...s, talk: step.talk }, happened: [step.talk ? { type: "line" } : { type: "talk-over" }], commands };
    }
    if (c.type === "back") return { state: { ...s, talk: back(s.talk) }, happened: [{ type: "line" }], commands };
    if (c.type === "choose") {
      const step = choose(spec.scripts, s.talk, c.index, new Set<string>(s.sort.flags));
      flags(step.set);
      return { state: { ...s, sort, talk: step.talk }, happened: [{ type: "line" }], commands };
    }
    if (c.type === "skip") return { state: { ...s, talk: null }, happened: [{ type: "talk-over" }], commands };
    // While someone is speaking, nothing in the room is touched.
    return none;
  }
  if (c.type !== "touch" || s.sort.done) return none;
  const thing = thingOf(spec, s, c.id);
  if (!thing) return none;
  const carried = s.carrying;

  if (thing.kind === "card") {
    // The carried card's own place: put back. Another card: the carried one put back, and that one taken.
    if (carried === thing.item) return { state: { ...s, carrying: null }, happened: [{ type: "drop", item: carried }], commands };
    const happened: SortRoomHappened[] = carried ? [{ type: "drop", item: carried }] : [];
    return { state: { ...s, carrying: thing.item }, happened: [...happened, { type: "pick", item: thing.item }], commands };
  }
  if (thing.kind === "group") {
    if (carried === null) return { state: s, happened: [{ type: "look", group: thing.group }], commands };
    // Put on the group it is already in: nothing changes in the sorting, and the card is put back.
    if (s.sort.placed[carried] === thing.group) return { state: { ...s, carrying: null }, happened: [{ type: "drop", item: carried }], commands };
    give({ type: "place", item: carried, group: thing.group });
    return { state: { ...s, sort, carrying: null }, happened: [{ type: "place", item: carried, group: thing.group }], commands };
  }
  if (thing.kind === "rest") {
    give({ type: "place", item: thing.item, group: null });
    return { state: { ...s, sort, carrying: null }, happened: [{ type: "place", item: thing.item, group: null }], commands };
  }
  if (thing.kind === "bell") {
    const happened: SortRoomHappened[] = carried ? [{ type: "drop", item: carried }] : [];
    // A refused showing changes only what the sorting says it did last (nothing is counted): it is still the page's `show`.
    give({ type: "show" });
    return { state: { ...s, sort, carrying: null }, happened: [...happened, { type: "show" }], commands };
  }
  if (thing.kind === "voice") return say(s, "voice");
  if (thing.kind === "kid") {
    const has = (f: SortFlag) => s.sort.flags.includes(f);
    if (has("kind")) return say(s, "kidKind");
    if (has("answered")) return say(s, "kidBlunt");
    return say(s, "kid");
  }
  // Where the feather hides: the feather the first time, nothing more after (the page's own lines).
  if (s.sort.flags.includes("feather")) return say(s, "hideAgain");
  give({ type: "flag", flag: "feather" });
  return say(s, "hide", [{ type: "feather" }]);
}

/** The cards sorted: Hudhud's word that the page is whole (the page's own last line). */
export const afterDone = (spec: SortRoomSpec, s: SortRoomState): SortRoomState => (s.sort.done ? { ...s, talk: open(spec.scripts, "done") } : s);

/** The four goals, exactly as the page quest counts them. */
export const sortRoomGoals = (spec: SortRoomSpec, s: SortRoomState) => sortGoals(s.sort, spec.slack[s.sort.style]);

/** What is kept: the sorting's own snapshot (the page quest can take it up as it is), and what Hudhud carries. */
export type SortRoomSnapshot = SortSnapshot & { carrying: string | null };
export const snapshotSortRoom = (s: SortRoomState): SortRoomSnapshot => ({ ...snapshotSort(s.sort), carrying: s.carrying });
/** Whether there is anything worth keeping: the page's own rule (a card placed, a showing counted, a question asked), or a card in the beak. */
export const worthKeeping = (s: SortRoomState): boolean => !s.sort.done && (s.sort.moves > 0 || s.sort.shows > 0 || s.sort.flags.length > 0 || s.carrying !== null);
/**
 * What the place kept should be after a step: nothing new if neither the sorting nor the beak changed, or the sorting is
 * finished (the host clears its place then); otherwise its snapshot if it is worth keeping, or nothing (null).
 * `undefined` means: leave what is kept.
 */
export function keptAfter(before: SortRoomState, after: SortRoomState): SortRoomSnapshot | null | undefined {
  if ((after.sort === before.sort && after.carrying === before.carrying) || after.sort.done) return undefined;
  return worthKeeping(after) ? snapshotSortRoom(after) : null;
}
/**
 * A room put back from what was saved, or null if the sorting cannot be trusted (sim/sort.ts restoreSort proves it). A
 * card in the beak comes back only if it is a card of this way of playing. A conversation is never restored. A snapshot
 * the page quest kept (no `carrying`) comes back with an empty beak.
 */
export function restoreSortRoom(spec: Pick<SortRoomSpec, "def">, x: unknown): SortRoomState | null {
  const sort = restoreSort(x, spec.def);
  if (!sort) return null;
  const c = (x as Record<string, unknown>).carrying;
  const carrying = typeof c === "string" && sort.items.includes(c) ? c : null;
  return { sort, carrying, talk: null };
}
