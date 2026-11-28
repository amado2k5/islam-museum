// The coffee room as data: the tenth room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop and the
// rooms of al-Jazari, al-Tusi, al-Khwarizmi, al-Kindi, al-Idrisi, al-Razi, Karima al-Marwaziyya and Ibn Battuta, asked
// for by the founder on 27 November 2026 (every scene a complete room, its puzzle played in the room; continue all the
// remaining work). The journey of coffee is sorted in it: its rules, its eight cards, its three shelves, the three ways
// of playing, its words and its history are the page quest's (content/coffee.ts, sim/sort.ts), unchanged; only where
// and how they are played is new. The parts any sorting room shares (carrying a card, putting it on a group, showing,
// the words list of cards and groups) are in sim/sortroom.ts and ui/sortroom.ts; this file is only the coffee room's
// own picture in numbers, its things and its talk. Every line of dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the coffee quest already says (cq_names_1, cq_word_1, the eight card
//                        sentences cq_c_* and the notes cq_note_2 and cq_note_3)
//   invented for play    the room itself (a quiet room of records in a coffee-trading town: a window, a low bench, a brass
//                        coffee pot and small cups on a tray, all decoration only), the long low table the cards wait on,
//                        the bookcase along the back wall, three shelves side by side at the same height (three sections
//                        of one case, since the lead agent's review of 27 November 2026: one above another, they read as
//                        a ranking), each marked by the quest's own shelf sign and its dots, the plain brass bell on the
//                        table that shows the record, the box of spare blank cards on top of the shelves where the
//                        feather hides, the keeper of the records and the child who tidies
//                        the cards drawn as cut-outs in code (both already invented people of the quest; neither is a
//                        likeness of anyone), and three new spoken lines (review ledger, HR-HH-55).
// The quest's own rules stand: the game does not choose between the traditions, and the third shelf does not call the
// tale a lie. Nothing in the room is written: the cards carry only their plain signs and their number as dots, the
// spare cards in the box are blank, no goat and no face is drawn on any card, and no writing of any script is drawn.
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import { cardPlaces, type SortRoomIds, type SortRoomSpec, type SortRoomState } from "../sim/sortroom";
import { COFFEE_SLACK, coffeeDef } from "./coffee";
import { ASSIST } from "./workshop";
import type { Room } from "../sim/move";

/** The same height, floor and view as the other nine rooms; as wide. */
export const CQR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The window high on the wall near where the bird comes in, and the low bench under it with the tray on it (decoration only). */
export const CQR_WINDOW = { x: 330, y: 110, w: 190, h: 220 } as const;
export const CQR_BENCH = { x: 300, w: 260, top: 566 } as const;
/** The long low table the cards wait on (its top is a perch): the cards stand on it in a row, the bell at its far end. */
export const CQR_TABLE = { x: 780, w: 740, top: 540 } as const;
/** Where the cards stand on the table: the middle of the row, and the step from one card's place to the next. */
export const CQR_ROW = { mid: 1110, step: 80 } as const;
export const CQR_BELL = { x: 1470, y: 508 } as const;
/**
 * The bookcase along the back wall, holding the three shelves side by side at the same height: one case of three equal
 * sections, shelf 1 (one dot) at the end the page begins from (the left, or the right on a page read right to left), then
 * shelf 2 and shelf 3 (two and three dots). Since 27 November 2026 they stand side by side (the lead agent's review: one
 * above another, with the legend on top, they read as a ranking). Where the case begins, how wide it is, how many
 * sections, the boards of its three tiers from the lowest (each tier runs across all three sections), and its top. A
 * shelf's sign stands on the top of the case over the start of its section, and the box of spare cards on the top at the
 * other end. The cards put on a shelf stand three across in its section, `step` apart from `first`, the lowest tier first,
 * in the order of the cards: up to nine, so that every card of a way of playing fits on any one shelf.
 */
export const CQR_CASE = { x: 1690, w: 560, sections: 3, boards: [520, 420, 320], top: 210, sign: 40, first: 35, step: 58, across: 3, box: 50 } as const;
export const CQR_START = { hudhud: 250, keeper: 106, archivist: 640, child: 1610 } as const;
/** A card's picture in the room: the quest's scroll, 72 game pixels square, drawn at this scale, with its dots under it. */
export const CQR_CARD = { scale: 0.74, size: 72 } as const;

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const CQR_DOOR = { x: 2342, y: CQR_WORLD.floor - 70, reach: 110 } as const;

/** The room's floor, walls and perches: the table's top, the bookcase's three tiers (each across all three shelves) and its top. */
export function cqrRoom(): Room {
  return {
    bounds: { x: 24, y: 24, w: CQR_WORLD.width - 48, h: CQR_WORLD.height },
    floor: CQR_WORLD.floor,
    perches: [
      { x: CQR_TABLE.x, y: CQR_TABLE.top, w: CQR_TABLE.w, h: 12 }, // the long low table
      ...CQR_CASE.boards.map((y) => ({ x: CQR_CASE.x, y, w: CQR_CASE.w, h: 12 })), // the three tiers, across the three shelves
      { x: CQR_CASE.x, y: CQR_CASE.top, w: CQR_CASE.w, h: 12 }, // the top of the bookcase
    ],
  };
}

/**
 * How near the bird must come to touch a thing, chosen generous for a child but never so wide that two things' reaches
 * meet where the bird stands to touch them. A card on the table: 40 (cards stand 80 apart there, so standing anywhere on
 * the table between two cards' middles touches the nearer); a card on a shelf: 29 (cards stand 58 apart in a tier of a
 * shelf, so anywhere along a shelf's tier one is in reach, and the tiers are 100 apart); a shelf's sign: 40 (it stands on
 * the top of the case, 112 above the highest tier's cards); the bell: 40. From the floor none of them can be touched: every card, every sign
 * and the bell needs at least a hop up onto the table or a flight up to a shelf. A test proves all of this.
 */
export const REACH = { table: 40, shelf: 29, sign: 40, bell: 40 } as const;

/** The ids the shared sorting room's rules know the coffee room's things by. */
export const CQR_IDS: SortRoomIds = { voice: "keeper", kid: "child", hide: "box", bell: "bell" };

export type CqrThingKind = "keeper" | "child" | "box" | "bell" | "card" | "group" | "rest";
export interface CqrThing extends RoomThing {
  kind: CqrThingKind;
  /** For a card, or the empty place on the table of the card Hudhud carries: the card. */
  item?: string;
  /** For a shelf's sign: the group (stated, tradition or legend) and its number from 0. */
  group?: string;
  index?: number;
}

/** Where card `i` of `n` waits on the table: in a row about the middle, the first on the left (on the right on a page read right to left). */
export function tableSpot(n: number, i: number, rtl: boolean): { x: number; y: number } {
  const k = rtl ? n - 1 - i : i;
  return { x: CQR_ROW.mid + (k - (n - 1) / 2) * CQR_ROW.step, y: CQR_TABLE.top - 30 };
}
/** The x of a point of the bookcase, mirrored about its middle on a page read right to left. */
const caseX = (fromStart: number, rtl: boolean): number => (rtl ? CQR_CASE.x + CQR_CASE.w - fromStart : CQR_CASE.x + fromStart);
/** How wide one shelf's section of the case is. */
export const SECTION = CQR_CASE.w / CQR_CASE.sections;
/** Where the sign of shelf `g` (from 0, the first from the end the page begins from) stands: on the top of the case, over the start of its section. */
export function signSpot(g: number, rtl: boolean): { x: number; y: number } {
  return { x: caseX(g * SECTION + CQR_CASE.sign, rtl), y: CQR_CASE.top - 32 };
}
/** Where the card in place `slot` (from 0) of shelf `g` stands: three across its section, the lowest tier first. */
export function shelfSpot(g: number, slot: number, rtl: boolean): { x: number; y: number } {
  const col = slot % CQR_CASE.across;
  const tier = Math.floor(slot / CQR_CASE.across);
  return { x: caseX(g * SECTION + CQR_CASE.first + col * CQR_CASE.step, rtl), y: CQR_CASE.boards[tier]! - 30 };
}
/** Where the box of spare cards stands: on the top of the case, at the end the page ends at. */
export function boxSpot(rtl: boolean): { x: number; y: number } {
  return { x: caseX(CQR_CASE.w - CQR_CASE.box, rtl), y: CQR_CASE.top - 28 };
}

/**
 * Where every shelf stands, as the explorer keeps clear of it (scenes/room.ts standClear): the three places of each
 * shelf's lowest tier, whether a card stands there or not. An empty shelf is not a thing to touch (its sign, on the top of
 * the case, is), so the explorer could stop in front of one; since 27 November 2026 every shelf is kept clear.
 */
export function cqrMarkers(groups: number, rtl: boolean): { x: number; y: number }[] {
  return Array.from({ length: groups }, (_, g) => Array.from({ length: CQR_CASE.across }, (_, col) => shelfSpot(g, col, rtl))).flat();
}

/**
 * Every thing in the room now: the keeper of the records, the child, the box of spare cards, the bell, the sign of each
 * shelf, every card where it stands (on the table in its own place, or on its shelf after the cards before it there),
 * and, while Hudhud carries a card that is on a shelf, that card's own empty place on the table (touched, it takes the
 * card off its shelf, as the page's band of cards not placed does). A card in the beak keeps its place: touched, it is
 * put back there.
 */
export function cqrThings(s: Pick<SortRoomState, "sort" | "carrying">, rtl: boolean): CqrThing[] {
  const n = s.sort.items.length;
  const things: CqrThing[] = [
    { id: "keeper", kind: "keeper", x: CQR_START.archivist, y: 500, reach: 170, name: "cqr_thing_keeper" },
    { id: "child", kind: "child", x: CQR_START.child, y: 520, reach: 140, name: "cqr_thing_child" },
    { id: "box", kind: "box", ...boxSpot(rtl), reach: 50, name: "cqr_thing_box" },
    { id: "bell", kind: "bell", x: CQR_BELL.x, y: CQR_BELL.y, reach: REACH.bell, name: "cqr_thing_bell" },
    ...s.sort.groups.map((group, index): CqrThing => ({ id: `group-${group}`, kind: "group", group, index, ...signSpot(index, rtl), reach: REACH.sign, name: "cqr_thing_shelf" })),
  ];
  for (const p of cardPlaces(s)) {
    const at = p.group === null ? tableSpot(n, p.index, rtl) : shelfSpot(s.sort.groups.indexOf(p.group), p.slot, rtl);
    things.push({ id: `card-${p.item}`, kind: "card", item: p.item, index: p.index, ...at, reach: p.group === null ? REACH.table : REACH.shelf, name: "cq_where" });
    if (p.carried && p.group !== null) things.push({ id: `rest-${p.item}`, kind: "rest", item: p.item, index: p.index, ...tableSpot(n, p.index, rtl), reach: REACH.table, name: "cqr_thing_rest" });
  }
  return things;
}

/** Where the bird stands to touch a thing: beside a person, a little before the box, and right at a card, a sign or the bell. */
export const CQR_APPROACH: Record<CqrThingKind, number> = { keeper: -110, child: -90, box: -40, bell: 0, card: 0, group: 0, rest: 0 };

/** The layout as the engine takes it. */
export const CQR_LAYOUT: RoomLayout = {
  world: CQR_WORLD,
  room: cqrRoom(),
  door: CQR_DOOR,
  start: { hudhud: CQR_START.hudhud, keeper: CQR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-coffee-room-cosmetics",
};

export type CqrSpeaker = "hudhud" | "voice" | "kid" | "narrator";
/**
 * The room's talk. The lines are the coffee quest's own (cq_*), said by the same speakers as on its page (the keeper of
 * the records is the page's "voice", the child its "kid"); three are new and only greet, thank and say goodbye
 * (cqr_keeper_hello, cqr_thanks, cqr_keeper_bye). The flags a node sets are the quest's own (sim/sort.ts): asking who
 * brought coffee and about the tree and the name is Curiosity (the page's two questions, `askedDivision` and
 * `askedBirds`, the names the sorting rules give them), answering the child kindly is Kindness (either answer is
 * `answered`, as on the page), and in the box of spare cards is the feather. The script names are the ones the shared
 * sorting room's rules open (sim/sortroom.ts).
 */
export const CQR_SCRIPTS: Record<string, Script<CqrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cq_intro_1", mood: "alarm" }, { who: "voice", key: "cq_intro_2", mood: "think" }] } } },
  voice: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "voice", key: "cqr_keeper_hello", mood: "glad" }], choices: [{ key: "cq_ask_names", to: "names", deeper: true }, { key: "cq_ask_word", to: "word", deeper: true }, { key: "cqr_thanks", to: "bye" }] },
      names: { lines: [{ who: "narrator", key: "cq_names_1", mood: "think" }], set: ["askedDivision"], choices: [{ key: "cq_ask_word", to: "word", deeper: true }, { key: "cqr_thanks", to: "bye" }] },
      word: { lines: [{ who: "narrator", key: "cq_word_1", mood: "think" }], set: ["askedBirds"], choices: [{ key: "cq_ask_names", to: "names", deeper: true }, { key: "cqr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "voice", key: "cqr_keeper_bye", mood: "glad" }] },
    },
  },
  kid: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "kid", key: "cq_child_1", mood: "think" }], choices: [{ key: "cq_child_kind", to: "kind" }, { key: "cq_child_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "cq_child_kind", mood: "glad" }, { who: "kid", key: "cq_child_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "cq_child_blunt", mood: "think" }, { who: "kid", key: "cq_child_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the child says again what the answer brought.
  kidKind: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "cq_child_kind_r", mood: "glad" }] } } },
  kidBlunt: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "cq_child_blunt_r", mood: "think" }] } } },
  hide: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cq_feather_1", mood: "glad" }] } } },
  hideAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cq_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cq_done_1", mood: "glad" }] } } },
};

/** The coffee room as the shared sorting room's rules take it: its talk, and the quest's own cards, shelves and slack. */
export const CQR_SPEC: SortRoomSpec = { scripts: CQR_SCRIPTS, def: coffeeDef, slack: COFFEE_SLACK, ids: CQR_IDS };
