// Karima al-Marwaziyya's room as data: the eighth room on the room engine (scenes/room.ts), after Ibn al-Haytham's
// workshop and the rooms of al-Jazari, al-Tusi, al-Khwarizmi, al-Kindi, al-Idrisi and al-Razi, asked for by the founder
// on 27 November 2026 (every scene a complete room with its own figure; continue all the remaining work). The copies are
// compared in it: their rules, the three ways of playing, the words and the history are the page quest's
// (content/collate.ts, sim/collate.ts), unchanged; only where and how they are played is new. Every line of dialogue is a
// key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the copies' quest already says (kr_who_1, kr_book_1, kr_note_2 and
//                        kr_note_3): she transmitted hadith, lived as a neighbour of the sanctuary at Mecca, kept her
//                        book carefully and checked it against other copies; leading scholars read hadith with her
//   invented for play    the room itself (a plain, quiet room of a house with one window of light, low cushions on the
//                        floor and a tall bookcase of books with plain covers), the reading stands in the middle, each
//                        holding one copy of the page as a row of the quest's own drawn signs (three stands, two in
//                        Story), the stack of spare copies on top of the bookcase the feather hides between, the boy who
//                        carries the copies (already invented in the quest), three new spoken lines, and Karima's figure,
//                        a cut-out drawn in code that is not a likeness (review ledger, HR-HH-53).
// The quest's own rule stands absolutely: no religious text of any kind is shown. The copies carry only the quest's plain
// drawn signs, never a letter, a word or a stroke like script; nothing in the room is written; and the room is an
// ordinary room: no sanctuary, no Kaaba, no mosque and no sacred place is drawn, though the record says she lived near
// the sanctuary.
import { collatePuzzle } from "./collate";
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { CollateStyle } from "../sim/collate";
import type { Room } from "../sim/move";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other seven rooms; as wide. */
export const KRR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The one window of light, near where the bird comes in; the low cushions lie on the floor under it. */
export const KRR_WINDOW = { x: 200, y: 96, w: 220, h: 256 } as const;
export const KRR_CUSHIONS = { x: 110, w: 430 } as const;
/** The tall bookcase of books with plain covers by the far end: its two shelves and its top are perches; the stack of spare copies lies on its top. */
export const KRR_SHELF = { x: 2000, w: 170, top: 190, shelves: [320, 450] } as const;
/** The stack of spare copies on top of the bookcase, with the feather between them. */
export const KRR_STACK = { x: 2085, y: 160 } as const;
/**
 * The reading stands: one long stand for each copy, one above another as the page's picture lays them out, her copy on
 * the top one. Each holds its copy as a row of cells standing on the stand's ledge; the ledge is a perch, the one the bird
 * stands on to reach the signs of that copy. The cells are centred on `cx`; their pitch depends on how many signs a copy
 * has. Each stand reaches from `left` to `right`.
 */
export const KRR_STANDS = { cx: 1340, left: 750, right: 1930, span: 1040, maxPitch: 64, cellH: 56, ledge: 30, mark: 34 } as const;
/** The middles of the rows of signs, from the top: three copies on three stands, or two (Story) on the lower two. */
export const rowsOf = (copies: number): readonly number[] => (copies === 2 ? [372, 482] : [262, 372, 482]);
/** How far apart the signs of a copy of n signs stand. */
export const pitchOf = (n: number): number => Math.min(KRR_STANDS.maxPitch, KRR_STANDS.span / n);
/** A sign's cell, in game pixels: a little narrower than the pitch, as on the page. */
export const cellOf = (n: number): { w: number; h: number } => ({ w: pitchOf(n) - 6, h: KRR_STANDS.cellH });
/** Where the sign at `place` of copy `copy` stands: place 0 on the left, or on the right on a page read right to left, as on the page. */
export function signAt(copy: number, place: number, copies: number, n: number, rtl: boolean): { x: number; y: number } {
  const off = (place - (n - 1) / 2) * pitchOf(n);
  return { x: KRR_STANDS.cx + (rtl ? -off : off), y: rowsOf(copies)[copy]! };
}
/** Where a copy's mark stands (her seal, or the other copies' dots): before its first sign, on the side the row begins. */
export function markAt(copy: number, copies: number, n: number, rtl: boolean): { x: number; y: number } {
  const off = (n / 2) * pitchOf(n) + KRR_STANDS.mark;
  return { x: KRR_STANDS.cx + (rtl ? off : -off), y: rowsOf(copies)[copy]! };
}
export const KRR_START = { hudhud: 250, keeper: 106, karima: 640, boy: 2240 } as const;

/** The room's floor, walls and perches for a puzzle of so many copies: the bookcase, and the ledge of every stand. */
export function krrRoom(copies: number): Room {
  return {
    bounds: { x: 24, y: 24, w: KRR_WORLD.width - 48, h: KRR_WORLD.height },
    floor: KRR_WORLD.floor,
    perches: [
      { x: KRR_SHELF.x - 10, y: KRR_SHELF.top, w: KRR_SHELF.w + 20, h: 12 }, // the top of the tall bookcase
      ...KRR_SHELF.shelves.map((y) => ({ x: KRR_SHELF.x, y, w: KRR_SHELF.w, h: 12 })), // its shelves
      ...rowsOf(copies).map((y) => ({ x: KRR_STANDS.left, y: y + KRR_STANDS.ledge, w: KRR_STANDS.right - KRR_STANDS.left, h: 12 })), // the stands' ledges
    ],
  };
}

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const KRR_DOOR = { x: 2342, y: KRR_WORLD.floor - 70, reach: 110 } as const;

/**
 * How near the bird must come to a sign to touch it. Generous on purpose: a sign is small (52 to 64 game pixels apart),
 * so its reach (46) is more than half the distance to the next, and wherever the bird stands on a stand's ledge some sign
 * is in reach; the nearest is the one touched, and the ring shows which.
 */
export const SIGN_REACH = 46;

export type KrrThingKind = "karima" | "boy" | "stack" | "sign";
export interface KrrThing extends RoomThing {
  kind: KrrThingKind;
  /** For a sign: its copy and place, from 0. */
  copy?: number;
  place?: number;
}

/**
 * Every thing in the room, for a way of playing: Karima, the boy, the stack of spare copies, and every sign of every
 * copy. The signs lie where the reading direction puts them; their ids are by copy and place ("sign-0-0" is the first
 * sign of her copy), the same either way.
 */
export function krrThings(style: CollateStyle, rtl: boolean): KrrThing[] {
  const p = collatePuzzle(style);
  const copies = p.copies.length;
  const n = p.copies[0]!.length;
  return [
    { id: "karima", kind: "karima", x: KRR_START.karima, y: 500, reach: 170, name: "krr_thing_karima" },
    { id: "boy", kind: "boy", x: KRR_START.boy, y: 520, reach: 140, name: "krr_thing_boy" },
    { id: "stack", kind: "stack", x: KRR_STACK.x, y: KRR_STACK.y, reach: 70, name: "krr_thing_stack" },
    ...p.copies.flatMap((_, copy) =>
      Array.from({ length: n }, (_x, place): KrrThing => {
        const at = signAt(copy, place, copies, n, rtl);
        return { id: `sign-${copy}-${place}`, kind: "sign", copy, place, x: at.x, y: at.y, reach: SIGN_REACH, name: "kr_cell" };
      }),
    ),
  ];
}

/** Where the bird stands to touch a thing: beside a person, just before the stack, and on a stand's ledge right under a sign. */
export const KRR_APPROACH: Record<KrrThingKind, number> = { karima: -110, boy: -90, stack: -40, sign: 0 };

/** The layout as the engine takes it. The perches are those of three stands; the scene keeps only the stands of its way of playing (krrRoom). */
export const KRR_LAYOUT: RoomLayout = {
  world: KRR_WORLD,
  room: krrRoom(3),
  door: KRR_DOOR,
  start: { hudhud: KRR_START.hudhud, keeper: KRR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-karima-room-cosmetics",
};

export type KrrSpeaker = "hudhud" | "keeper" | "karima" | "boy" | "narrator";
/**
 * The room's talk. The lines are the copies' quest's own (kr_*), said by the same speakers as on its page; three are new
 * and only greet, thank and say goodbye (krr_karima_hello, krr_thanks, krr_karima_bye). The flags a node sets are the
 * quest's own (sim/collate.ts): asking who she was and about her book is Curiosity, answering the boy kindly is Kindness
 * (either answer is `answered`, as on the page), and between the spare copies is the feather.
 */
export const KRR_SCRIPTS: Record<string, Script<KrrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "kr_intro_1", mood: "alarm" }, { who: "karima", key: "kr_intro_2", mood: "think" }] } } },
  karima: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "karima", key: "krr_karima_hello", mood: "glad" }], choices: [{ key: "kr_ask_who", to: "who", deeper: true }, { key: "kr_ask_book", to: "book", deeper: true }, { key: "krr_thanks", to: "bye" }] },
      who: { lines: [{ who: "narrator", key: "kr_who_1", mood: "think" }], set: ["askedWho"], choices: [{ key: "kr_ask_book", to: "book", deeper: true }, { key: "krr_thanks", to: "bye" }] },
      book: { lines: [{ who: "narrator", key: "kr_book_1", mood: "think" }], set: ["askedBook"], choices: [{ key: "kr_ask_who", to: "who", deeper: true }, { key: "krr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "karima", key: "krr_karima_bye", mood: "glad" }] },
    },
  },
  boy: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "boy", key: "kr_boy_1", mood: "think" }], choices: [{ key: "kr_boy_kind", to: "kind" }, { key: "kr_boy_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "kr_boy_kind", mood: "glad" }, { who: "boy", key: "kr_boy_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "kr_boy_blunt", mood: "think" }, { who: "boy", key: "kr_boy_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the boy says again what the answer brought.
  boyKind: { start: "1", nodes: { "1": { lines: [{ who: "boy", key: "kr_boy_kind_r", mood: "glad" }] } } },
  boyBlunt: { start: "1", nodes: { "1": { lines: [{ who: "boy", key: "kr_boy_blunt_r", mood: "think" }] } } },
  stack: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "kr_feather_1", mood: "glad" }] } } },
  stackAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "kr_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "kr_done_1", mood: "glad" }] } } },
};
