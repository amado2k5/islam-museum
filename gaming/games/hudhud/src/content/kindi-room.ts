// Al-Kindi's room as data: the fifth room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop,
// al-Jazari's, al-Tusi's observatory and al-Khwarizmi's, asked for by the founder on 27 November 2026 (every scene a
// complete room with its own figure; continue all the remaining work). The secret page is played in it: its rules, the
// three ways of playing, the words and the history are the page quest's (content/cipher.ts, sim/cipher.ts), unchanged;
// only where and how it is played is new. Every line of dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the secret page's quest already says (cf_count_1, cf_short_1, cf_note_2 to
//                        cf_note_4): he counts, ranks and compares, warns that a short message can mislead, and tests a
//                        guess by neighbouring letters and by usual openings
//   invented for play    the room itself (a scholar's study by lamplight: shelves of books, a reading desk with a lamp, a
//                        window on a night sky), the large board on the wall that holds the secret page (a strip of its
//                        marks, and each mark of the message as a plain hung tile with a place beneath it for the sign
//                        given to it), the shelf of sign tokens below the board, the two count boards on stands (bars of
//                        dots, one dot for each time a sign or a mark occurs: the page's two tables, drawn), the bell that
//                        is rung to read the page, the torn page on top of the bookcase the feather hides under, the young
//                        messenger (already invented in the quest), three new spoken lines, and al-Kindi's figure, a
//                        cut-out drawn in code that is not a likeness (review ledger, HR-HH-50). The quest's own rule
//                        stands: the room shows drawn signs and marks, never letters, and no writing of any script.
import { cipherPuzzle } from "./cipher";
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import { used, type CipherPuzzle, type CipherStyle } from "../sim/cipher";
import type { Room } from "../sim/move";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other four rooms; as wide. */
export const KDR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The window on the night sky, near where the bird comes in. */
export const KDR_WINDOW = { x: 110, y: 100, w: 200, h: 290 } as const;
/** The bookcase: its two shelves and its top are perches; the torn page lies on its top. */
export const KDR_BOOKS = { x: 360, w: 180, top: 150, shelves: [290, 420] } as const;
/** The reading desk, with the lamp on it; its top is a perch. */
export const KDR_DESK = { x: 600, w: 150, y: 548 } as const;
export const KDR_LAMP = { x: 650, y: 548 } as const;
/** The two count boards on their stands: the signs of the whole page (first), the marks of the message (second). */
export const KDR_COUNTS = { xs: [905, 1065], w: 150, top: 290, h: 236 } as const;
/**
 * The large board on the wall. Along its top, a strip of the secret message, mark after mark; under it a plain tile hung
 * for each mark the message uses (from the commonest, as the page's lists are), and under each tile the place for the
 * sign given to it. A ledge along its foot is a perch, from which those places are touched.
 */
export const KDR_BOARD = { x: 1240, w: 740, top: 120, bottom: 392, pad: 30, stripY: 160, tileY: 245, slotY: 338, ledge: 368 } as const;
/** The long shelf below the board on which the sign tokens stand (a perch); the tokens' middles stand this high. */
export const KDR_SHELF = { x: 1250, w: 720, y: 548, tokenY: 518 } as const;
/** The bell by the board, hung on a low stand whose top is a perch. */
export const KDR_BELL = { x: 2060, y: 470 } as const;
export const KDR_BELL_STAND = { x: 2010, w: 100, y: 500 } as const;
/** The torn page on top of the bookcase, with the feather under it. */
export const KDR_PAGE = { x: 450, y: 120 } as const;
export const KDR_START = { hudhud: 250, keeper: 170, kindi: 820, messenger: 2190 } as const;

export const KDR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: KDR_WORLD.width - 48, h: KDR_WORLD.height },
  floor: KDR_WORLD.floor,
  perches: [
    { x: KDR_BOOKS.x - 10, y: KDR_BOOKS.top, w: KDR_BOOKS.w + 20, h: 12 }, // the top of the bookcase
    ...KDR_BOOKS.shelves.map((y) => ({ x: KDR_BOOKS.x, y, w: KDR_BOOKS.w, h: 12 })), // its shelves
    { x: KDR_DESK.x, y: KDR_DESK.y, w: KDR_DESK.w, h: 12 }, // the reading desk
    { x: KDR_BOARD.x, y: KDR_BOARD.ledge, w: KDR_BOARD.w, h: 12 }, // the ledge along the board's foot
    { x: KDR_SHELF.x, y: KDR_SHELF.y, w: KDR_SHELF.w, h: 12 }, // the shelf of tokens
    { x: KDR_BELL_STAND.x, y: KDR_BELL_STAND.y, w: KDR_BELL_STAND.w, h: 12 }, // the bell's stand
  ],
};

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const KDR_DOOR = { x: 2342, y: KDR_WORLD.floor - 70, reach: 110 } as const;

export type KdrThingKind = "kindi" | "messenger" | "page" | "bell" | "slot" | "token";
export interface KdrThing extends RoomThing {
  kind: KdrThingKind;
  /** For a place on the board, its mark; for a token, its sign. */
  mark?: string;
  sign?: string;
}

/** The marks on the board, in the order they hang: from the commonest in the message, as the page's lists are. */
export const boardMarks = (p: CipherPuzzle): string[] => used(p);
/** Where the i-th of n tiles hangs across the board; on a page read right to left the first is on the right. */
export function tileX(i: number, n: number, rtl: boolean): number {
  const inner = KDR_BOARD.w - 2 * KDR_BOARD.pad;
  const step = inner / n;
  const x = KDR_BOARD.pad + step * (i + 0.5);
  return KDR_BOARD.x + (rtl ? KDR_BOARD.w - x : x);
}
/** Where the i-th of n tokens stands on the shelf; on a page read right to left the first is on the right. */
export function tokenX(i: number, n: number, rtl: boolean): number {
  const step = KDR_SHELF.w / n;
  const x = step * (i + 0.5);
  return KDR_SHELF.x + (rtl ? KDR_SHELF.w - x : x);
}
/** Where the i-th mark of the message stands in the strip along the board's top. */
export function stripX(i: number, n: number, rtl: boolean): number {
  const inner = KDR_BOARD.w - 2 * KDR_BOARD.pad;
  const step = Math.min(26, inner / n);
  const x = KDR_BOARD.w / 2 - ((n - 1) * step) / 2 + i * step;
  return KDR_BOARD.x + (rtl ? KDR_BOARD.w - x : x);
}

/**
 * Every thing in the room, for a way of playing: al-Kindi, the messenger, the torn page, the bell, a place on the board
 * for each mark the message uses, and a token for each sign of the page. The places and the tokens stand where the
 * reading direction puts them; their ids are by mark and by sign ("slot-m3", "token-sun"), the same either way.
 */
export function kdrThings(style: CipherStyle, rtl: boolean): KdrThing[] {
  const p = cipherPuzzle(style);
  const marks = boardMarks(p);
  return [
    { id: "kindi", kind: "kindi", x: KDR_START.kindi, y: 500, reach: 170, name: "kdr_thing_kindi" },
    { id: "messenger", kind: "messenger", x: KDR_START.messenger, y: 520, reach: 140, name: "kdr_thing_messenger" },
    { id: "page", kind: "page", x: KDR_PAGE.x, y: KDR_PAGE.y, reach: 80, name: "kdr_thing_page" },
    { id: "bell", kind: "bell", x: KDR_BELL.x, y: KDR_BELL.y, reach: 70, name: "kdr_thing_bell" },
    ...marks.map((mark, i): KdrThing => ({ id: `slot-${mark}`, kind: "slot", mark, x: tileX(i, marks.length, rtl), y: KDR_BOARD.slotY, reach: 70, name: "kdr_thing_slot" })),
    ...p.signs.map((sign, i): KdrThing => ({ id: `token-${sign}`, kind: "token", sign, x: tokenX(i, p.signs.length, rtl), y: KDR_SHELF.tokenY, reach: 60, name: "kdr_thing_token" })),
  ];
}

/** Where the bird stands to touch a thing: beside a person, and just before the bell, a place, a token or the torn page
 * (so that it is not hidden behind the bird). */
export const KDR_APPROACH: Record<KdrThingKind, number> = { kindi: -110, messenger: -90, page: -50, bell: -40, slot: -40, token: -36 };

export const KDR_LAYOUT: RoomLayout = {
  world: KDR_WORLD,
  room: KDR_ROOM,
  door: KDR_DOOR,
  start: { hudhud: KDR_START.hudhud, keeper: KDR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-kindi-room-cosmetics",
};

export type KdrSpeaker = "hudhud" | "keeper" | "kindi" | "messenger" | "narrator";
/**
 * The room's talk. The lines are the secret page's own (cf_*), said by the same speakers as on its page; three are new
 * and only greet, thank and say goodbye (kdr_kindi_hello, kdr_thanks, kdr_kindi_bye). The flags a node sets are the
 * quest's own (sim/cipher.ts): asking how to begin and about short messages is Curiosity, answering the messenger
 * kindly is Kindness (either answer is `answered`, as on the page), and under the torn page is the feather.
 */
export const KDR_SCRIPTS: Record<string, Script<KdrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cf_intro_1", mood: "alarm" }, { who: "kindi", key: "cf_intro_2", mood: "think" }] } } },
  kindi: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "kindi", key: "kdr_kindi_hello", mood: "glad" }], choices: [{ key: "cf_ask_count", to: "count", deeper: true }, { key: "cf_ask_short", to: "short", deeper: true }, { key: "kdr_thanks", to: "bye" }] },
      count: { lines: [{ who: "narrator", key: "cf_count_1", mood: "think" }], set: ["askedCount"], choices: [{ key: "cf_ask_short", to: "short", deeper: true }, { key: "kdr_thanks", to: "bye" }] },
      short: { lines: [{ who: "narrator", key: "cf_short_1", mood: "think" }], set: ["askedShort"], choices: [{ key: "cf_ask_count", to: "count", deeper: true }, { key: "kdr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "kindi", key: "kdr_kindi_bye", mood: "glad" }] },
    },
  },
  messenger: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "messenger", key: "cf_msg_1", mood: "think" }], choices: [{ key: "cf_msg_kind", to: "kind" }, { key: "cf_msg_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "cf_msg_kind", mood: "glad" }, { who: "messenger", key: "cf_msg_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "cf_msg_blunt", mood: "think" }, { who: "messenger", key: "cf_msg_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the messenger says again what the answer brought.
  messengerKind: { start: "1", nodes: { "1": { lines: [{ who: "messenger", key: "cf_msg_kind_r", mood: "glad" }] } } },
  messengerBlunt: { start: "1", nodes: { "1": { lines: [{ who: "messenger", key: "cf_msg_blunt_r", mood: "think" }] } } },
  page: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cf_feather_1", mood: "glad" }] } } },
  pageAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cf_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "cf_done_1", mood: "glad" }] } } },
};
