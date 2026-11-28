// Al-Jahiz's room as data: the eleventh room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop and the
// rooms of al-Jazari, al-Tusi, al-Khwarizmi, al-Kindi, al-Idrisi, al-Razi, Karima al-Marwaziyya, Ibn Battuta and the
// coffee room, asked for by the founder on 27 November 2026 (every scene a complete room, its puzzle played in the room;
// continue all the remaining work). The animal cards are sorted in it: their rules, the eight creatures, the trays, the
// three ways of playing, the words and the history are the page quest's (content/sort.ts, sim/sort.ts), unchanged; only
// where and how they are played is new. The parts any sorting room shares (carrying a card, putting it in a group,
// showing, the words list of cards and groups) are in sim/sortroom.ts and ui/sortroom.ts, made for the coffee room and
// used here as they are; this file is only al-Jahiz's room's own picture in numbers, its things and its talk. Every line
// of dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the animal cards' quest already says (jz_divide_1, jz_birds_1, jz_hoopoe_1
//                        and the notes jz_note_2 to jz_note_4), and the quest's own note that his division is not how
//                        science sorts animals today
//   invented for play    the room itself (a scholar's room in a garden house: a window on trees and sky, shelves of
//                        books with no title on any, a basket of spare blank cards on the lower shelf, all decoration but
//                        the basket), the long low bench the cards wait on, the trays standing side by side at the same
//                        height on low tables, each marked by its dots and by a plain sign of its own shape, the plain
//                        brass bell that shows the cards to al-Jahiz, al-Jahiz and the girl who carries the cards drawn
//                        as cut-outs in code (al-Jahiz not a likeness; the girl already an invented person of the
//                        quest), and three new spoken lines (review ledger, HR-HH-56).
// The trays stand side by side and level so that no group reads as higher or better than another. Nothing in the room is
// written: the cards carry only their creatures and their number as dots, the trays only their dots and their shapes, the
// books no title, and no writing of any script is drawn.
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import { cardPlaces, type SortRoomIds, type SortRoomSpec, type SortRoomState } from "../sim/sortroom";
import { SORT_SLACK, sortDef } from "./sort";
import { ASSIST } from "./workshop";
import type { Room } from "../sim/move";

/** The same height, floor and view as the other ten rooms; as wide. */
export const JZR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The window on the garden, high on the wall near where the bird comes in (decoration only). */
export const JZR_WINDOW = { x: 290, y: 96, w: 230, h: 240 } as const;
/** The long low bench the cards wait on (its top is a perch): the cards stand on it in a row, the bell at its far end. */
export const JZR_BENCH = { x: 780, w: 590, top: 540 } as const;
/** Where the cards stand on the bench: the middle of the row, and the step from one card's place to the next. */
export const JZR_ROW = { mid: 1040, step: 64 } as const;
export const JZR_BELL = { x: 1338, y: 508 } as const;
/** The shelves of books on the wall over the bench (both are perches); the basket of spare cards stands at the right end of the lower one. */
export const JZR_SHELVES = { x: 830, w: 440, boards: [236, 136] } as const;
export const JZR_BASKET = { x: 1230, y: 208 } as const;
/**
 * The trays, side by side at the same height along the room, each on a low table of its own: where the row of trays
 * begins and ends, how wide a tray is, the gap between two trays (wider when there are only two), the boards of its three
 * tiers from the lowest, its top (where its sign stands), and where the cards stand in it: three across, the first at
 * `first` from the tray's start, `step` apart. A tray's cards stand after the cards before them there, across the lowest
 * tier first, from the end the page begins from (the left, or the right on a page read right to left).
 */
export const JZR_TRAYS = { x: 1390, end: 2250, w: 156, gap: { many: 18, two: 200 }, boards: [548, 472, 396], top: 330, table: 560, first: 28, step: 50, across: 3 } as const;
export const JZR_START = { hudhud: 250, keeper: 106, girl: 430, jahiz: 640 } as const;
/** A card's picture in the room: the quest's card, 72 game pixels square, drawn at this scale, with its dots under it. */
export const JZR_CARD = { scale: 0.6, size: 72 } as const;

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const JZR_DOOR = { x: 2342, y: JZR_WORLD.floor - 70, reach: 110 } as const;

/** Where tray `g` of `n` begins (its left edge), before any mirroring. */
function trayLeft(n: number, g: number): number {
  const gap = n > 2 ? JZR_TRAYS.gap.many : JZR_TRAYS.gap.two;
  const across = n * JZR_TRAYS.w + (n - 1) * gap;
  return (JZR_TRAYS.x + JZR_TRAYS.end) / 2 - across / 2 + g * (JZR_TRAYS.w + gap);
}
/** Where tray `g` of `n` stands: its left edge and width, mirrored on a page read right to left (the first tray on the right). */
export function trayBox(n: number, g: number, rtl: boolean): { x: number; w: number } {
  const left = trayLeft(n, rtl ? n - 1 - g : g);
  return { x: left, w: JZR_TRAYS.w };
}

/** The room's floor, walls and perches: the bench's top, the two shelves of books, and every tray's tiers and top. The trays that stand depend on the way of playing. */
export function jzrRoom(groups: number): Room {
  const trays = Array.from({ length: groups }, (_, g) => trayBox(groups, g, false));
  return {
    bounds: { x: 24, y: 24, w: JZR_WORLD.width - 48, h: JZR_WORLD.height },
    floor: JZR_WORLD.floor,
    perches: [
      { x: JZR_BENCH.x, y: JZR_BENCH.top, w: JZR_BENCH.w, h: 12 }, // the long low bench
      ...JZR_SHELVES.boards.map((y) => ({ x: JZR_SHELVES.x, y, w: JZR_SHELVES.w, h: 12 })), // the shelves of books
      ...trays.flatMap((t) => [...JZR_TRAYS.boards, JZR_TRAYS.top].map((y) => ({ x: t.x, y, w: t.w, h: 12 }))), // each tray's tiers and top
    ],
  };
}

/**
 * How near the bird must come to touch a thing, chosen generous for a child but never so wide that two things' reaches
 * meet where the bird stands to touch them. A card on the bench: 32 (cards stand 64 apart there, so standing anywhere on
 * the bench between two cards' middles touches the nearer); a card in a tray: 25 (cards stand 50 apart in a tier, so
 * anywhere along a tier one is in reach, and the tiers are 76 apart); a tray's sign: 40 (it stands on the tray's top, 66
 * above the highest tier's cards); the bell: 40. From the floor none of them can be touched: every card, every sign and
 * the bell needs at least a hop up onto the bench or a flight up to a tray. A test proves all of this, for two trays and
 * for five.
 */
export const REACH = { bench: 32, tray: 25, sign: 40, bell: 40 } as const;

/** The ids the shared sorting room's rules know al-Jahiz's room's things by. */
export const JZR_IDS: SortRoomIds = { voice: "jahiz", kid: "girl", hide: "basket", bell: "bell" };

export type JzrThingKind = "jahiz" | "girl" | "basket" | "bell" | "card" | "group" | "rest";
export interface JzrThing extends RoomThing {
  kind: JzrThingKind;
  /** For a card, or the empty place on the bench of the card Hudhud carries: the card. */
  item?: string;
  /** For a tray's sign: the group, and its number from 0. */
  group?: string;
  index?: number;
}

/** Where card `i` of `n` waits on the bench: in a row about the middle, the first on the left (on the right on a page read right to left). */
export function benchSpot(n: number, i: number, rtl: boolean): { x: number; y: number } {
  const k = rtl ? n - 1 - i : i;
  return { x: JZR_ROW.mid + (k - (n - 1) / 2) * JZR_ROW.step, y: JZR_BENCH.top - 30 };
}
/** Where the sign of tray `g` (from 0) of `n` stands: on the tray's top, in its middle. */
export function signSpot(n: number, g: number, rtl: boolean): { x: number; y: number } {
  const t = trayBox(n, g, rtl);
  return { x: t.x + t.w / 2, y: JZR_TRAYS.top - 32 };
}
/** Where the card in place `slot` (from 0) of tray `g` of `n` stands: across the lowest tier first, from the end the page begins from. */
export function traySpot(n: number, g: number, slot: number, rtl: boolean): { x: number; y: number } {
  const t = trayBox(n, g, rtl);
  const col = slot % JZR_TRAYS.across;
  const tier = Math.floor(slot / JZR_TRAYS.across);
  const fromStart = JZR_TRAYS.first + col * JZR_TRAYS.step;
  return { x: rtl ? t.x + t.w - fromStart : t.x + fromStart, y: JZR_TRAYS.boards[tier]! - 30 };
}

/**
 * Where every tray stands, as the explorer keeps clear of it (scenes/room.ts standClear): the three places of each tray's
 * lowest tier, whether a card stands there or not. An empty tray is not a thing to touch (its sign, high on its top, is),
 * so before 27 November 2026 the explorer could stop in front of one and hide it (the lead agent saw it).
 */
export function jzrMarkers(groups: number, rtl: boolean): { x: number; y: number }[] {
  return Array.from({ length: groups }, (_, g) => Array.from({ length: JZR_TRAYS.across }, (_, col) => traySpot(groups, g, col, rtl))).flat();
}

/**
 * Every thing in the room now: al-Jahiz, the girl, the basket of spare cards, the bell, the sign of each tray, every card
 * where it stands (on the bench in its own place, or in its tray after the cards before it there), and, while Hudhud
 * carries a card that is in a tray, that card's own empty place on the bench (touched, it takes the card out of its tray,
 * as the page's choice "not placed yet" does). A card in the beak keeps its place: touched, it is put back there.
 */
export function jzrThings(s: Pick<SortRoomState, "sort" | "carrying">, rtl: boolean): JzrThing[] {
  const n = s.sort.items.length;
  const g = s.sort.groups.length;
  const things: JzrThing[] = [
    { id: "jahiz", kind: "jahiz", x: JZR_START.jahiz, y: 500, reach: 170, name: "jzr_thing_jahiz" },
    { id: "girl", kind: "girl", x: JZR_START.girl, y: 520, reach: 140, name: "jzr_thing_girl" },
    { id: "basket", kind: "basket", x: JZR_BASKET.x, y: JZR_BASKET.y, reach: 50, name: "jzr_thing_basket" },
    { id: "bell", kind: "bell", x: JZR_BELL.x, y: JZR_BELL.y, reach: REACH.bell, name: "jzr_thing_bell" },
    ...s.sort.groups.map((group, index): JzrThing => ({ id: `group-${group}`, kind: "group", group, index, ...signSpot(g, index, rtl), reach: REACH.sign, name: "jzr_thing_tray" })),
  ];
  for (const p of cardPlaces(s)) {
    const at = p.group === null ? benchSpot(n, p.index, rtl) : traySpot(g, s.sort.groups.indexOf(p.group), p.slot, rtl);
    things.push({ id: `card-${p.item}`, kind: "card", item: p.item, index: p.index, ...at, reach: p.group === null ? REACH.bench : REACH.tray, name: "jz_where" });
    if (p.carried && p.group !== null) things.push({ id: `rest-${p.item}`, kind: "rest", item: p.item, index: p.index, ...benchSpot(n, p.index, rtl), reach: REACH.bench, name: "jzr_thing_rest" });
  }
  return things;
}

/** Where the bird stands to touch a thing: beside a person (on al-Jahiz's far side from the girl, so that he is the nearer), a little before the basket, and right at a card, a sign or the bell. */
export const JZR_APPROACH: Record<JzrThingKind, number> = { jahiz: 110, girl: -90, basket: -40, bell: 0, card: 0, group: 0, rest: 0 };

/** The layout as the engine takes it, for a way of playing with `groups` trays. */
export const jzrLayout = (groups: number): RoomLayout => ({
  world: JZR_WORLD,
  room: jzrRoom(groups),
  door: JZR_DOOR,
  start: { hudhud: JZR_START.hudhud, keeper: JZR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-jahiz-room-cosmetics",
});

export type JzrSpeaker = "hudhud" | "voice" | "kid" | "narrator";
/**
 * The room's talk. The lines are the animal cards' quest's own (jz_*), said by the same speakers as on its page (al-Jahiz
 * is the page's "voice", in imagined words, the girl its "kid"); three are new and only greet, thank and say goodbye
 * (jzr_jahiz_hello, jzr_thanks, jzr_jahiz_bye). Asking about his division of animals and about the birds is Curiosity
 * (`askedDivision` and `askedBirds`, the page's own flags); after the second of the two questions, the record's line
 * about the hoopoe and Hudhud's answer come once, as the page says them; answering the girl kindly is Kindness (either
 * answer is `answered`, as on the page), and in the basket of spare cards is the feather. The script names are the ones
 * the shared sorting room's rules open (sim/sortroom.ts).
 */
const DIVISION = { lines: [{ who: "narrator", key: "jz_divide_1", mood: "think" }], set: ["askedDivision"] } as const;
const BIRDS = { lines: [{ who: "narrator", key: "jz_birds_1", mood: "think" }], set: ["askedBirds"] } as const;
const HOOPOE = [{ who: "narrator", key: "jz_hoopoe_1", mood: "think" }, { who: "hudhud", key: "jz_hoopoe_2", mood: "glad" }] as const;
const THANKS = { key: "jzr_thanks", to: "bye" } as const;
export const JZR_SCRIPTS: Record<string, Script<JzrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "jz_intro_1", mood: "alarm" }, { who: "voice", key: "jz_intro_2", mood: "think" }] } } },
  voice: {
    start: "hello",
    nodes: {
      // Each question leads to its answer; the second of the two to its answer with the hoopoe's lines after it, once.
      hello: {
        lines: [{ who: "voice", key: "jzr_jahiz_hello", mood: "glad" }],
        choices: [
          { key: "jz_ask_division", to: "division", deeper: true, unless: ["askedBirds"] },
          { key: "jz_ask_division", to: "divisionThen", deeper: true, needs: ["askedBirds"], unless: ["askedDivision"] },
          { key: "jz_ask_division", to: "division", deeper: true, needs: ["askedBirds", "askedDivision"] },
          { key: "jz_ask_birds", to: "birds", deeper: true, unless: ["askedDivision"] },
          { key: "jz_ask_birds", to: "birdsThen", deeper: true, needs: ["askedDivision"], unless: ["askedBirds"] },
          { key: "jz_ask_birds", to: "birds", deeper: true, needs: ["askedDivision", "askedBirds"] },
          { ...THANKS },
        ],
      },
      division: { lines: [...DIVISION.lines], set: [...DIVISION.set], choices: [{ key: "jz_ask_birds", to: "birdsThen", deeper: true, unless: ["askedBirds"] }, { key: "jz_ask_birds", to: "birds", deeper: true, needs: ["askedBirds"] }, { ...THANKS }] },
      birds: { lines: [...BIRDS.lines], set: [...BIRDS.set], choices: [{ key: "jz_ask_division", to: "divisionThen", deeper: true, unless: ["askedDivision"] }, { key: "jz_ask_division", to: "division", deeper: true, needs: ["askedDivision"] }, { ...THANKS }] },
      divisionThen: { lines: [...DIVISION.lines, ...HOOPOE], set: [...DIVISION.set], choices: [{ key: "jz_ask_birds", to: "birds", deeper: true }, { ...THANKS }] },
      birdsThen: { lines: [...BIRDS.lines, ...HOOPOE], set: [...BIRDS.set], choices: [{ key: "jz_ask_division", to: "division", deeper: true }, { ...THANKS }] },
      bye: { lines: [{ who: "voice", key: "jzr_jahiz_bye", mood: "glad" }] },
    },
  },
  kid: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "kid", key: "jz_girl_1", mood: "think" }], choices: [{ key: "jz_girl_kind", to: "kind" }, { key: "jz_girl_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "jz_girl_kind", mood: "glad" }, { who: "kid", key: "jz_girl_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "jz_girl_blunt", mood: "think" }, { who: "kid", key: "jz_girl_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the girl says again what the answer brought.
  kidKind: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "jz_girl_kind_r", mood: "glad" }] } } },
  kidBlunt: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "jz_girl_blunt_r", mood: "think" }] } } },
  hide: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "jz_feather_1", mood: "glad" }] } } },
  hideAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "jz_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "jz_done_1", mood: "glad" }] } } },
};

/** Al-Jahiz's room as the shared sorting room's rules take it: its talk, and the quest's own cards, trays and slack. */
export const JZR_SPEC: SortRoomSpec = { scripts: JZR_SCRIPTS, def: sortDef, slack: SORT_SLACK, ids: JZR_IDS };
