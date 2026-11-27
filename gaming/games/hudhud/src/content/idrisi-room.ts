// Al-Idrisi's hall as data: the sixth room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop and the
// rooms of al-Jazari, al-Tusi, al-Khwarizmi and al-Kindi, asked for by the founder on 27 November 2026 (every scene a
// complete room with its own figure; continue all the remaining work). The scattered sheets are played in it: their
// rules, the three ways of playing, the words and the history are the page quest's (content/sheets.ts, sim/sheets.ts),
// unchanged; only where and how they are played is new. Every line of dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the scattered sheets' quest already says (id_book_1, id_maps_1, id_note_2):
//                        he wrote Nuzhat al-Mushtaq for Roger II, king of Sicily, the book went with a silver disc of
//                        the seven climes, and each clime was divided into ten sections, which made seventy maps
//   invented for play    the hall itself (a bright hall with tall windows, a tall shelf of rolled sheets and books), the
//                        great table seen at an angle on which the map's sheets lie in their grid, the rails along it
//                        the bird stands on, the stack of loose sheets on top of the tall shelf the feather hides under,
//                        the lamp on its stand by the table that is touched to check the map, the young helper (already
//                        invented in the quest), three new spoken lines, and al-Idrisi's figure, a cut-out drawn in code
//                        that is not a likeness (review ledger, HR-HH-51). The quest's own rule stands: the drawing on
//                        the sheets is an imagined coast made from the edge codes, not al-Idrisi's map and not any real
//                        place, and there is no globe, no disc and no writing in the hall.
import { sheetsMap } from "./sheets";
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { Room } from "../sim/move";
import type { SheetsStyle } from "../sim/sheets";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other five rooms; as wide. */
export const ISR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The tall windows of the hall: one where the bird comes in, one behind al-Idrisi, and one near the far end. */
export const ISR_WINDOWS = [
  { x: 80, y: 60, w: 150, h: 340 },
  { x: 640, y: 60, w: 150, h: 340 },
  { x: 1940, y: 60, w: 150, h: 340 },
] as const;
/** The tall shelf of rolled sheets and books: its two shelves and its top are perches; the stack of loose sheets lies on its top. */
export const ISR_SHELF = { x: 330, w: 190, top: 150, shelves: [290, 420] } as const;
/** The stack of loose sheets on top of the tall shelf, with the feather under it. */
export const ISR_STACK = { x: 425, y: 120 } as const;
/**
 * The great table, seen at an angle: its top runs from a back edge high up to a front edge low down, wider at the front.
 * The sheets lie on it in rows; along the front of each row runs a low rail, a perch the bird stands on to reach that row.
 */
export const ISR_TABLE = { cx: 1280, back: 196, front: 576, backW: 640, frontW: 800 } as const;
/** How far apart the sheets lie in a row at the front of the table, and how big a sheet is drawn there. Rows further back are drawn smaller. */
export const ISR_PITCH = 120;
export const ISR_TILE = 100;
/** The three rows the table has room for, from the back: where each row's middle lies and how much smaller it is drawn. A map of two rows uses the two at the front. */
export const ISR_LEVELS = [
  { y: 262, k: 0.86 },
  { y: 377, k: 0.93 },
  { y: 500, k: 1 },
] as const;
/** The rail along the front of a row: a perch just below the row's sheets. */
export const railY = (level: { y: number; k: number }): number => Math.round(level.y + (ISR_TILE * level.k) / 2 + 8);
/** How wide a rail is either side of the table's middle: room for five sheets and a little more. */
export const railHalf = (level: { k: number }): number => Math.round(2.5 * ISR_PITCH * level.k + 10);
/** The lamp by the table, on a low stand whose top is a perch. */
export const ISR_LAMP = { x: 1820, y: 468 } as const;
export const ISR_LAMP_STAND = { x: 1770, w: 100, y: 500 } as const;
export const ISR_START = { hudhud: 250, keeper: 106, idrisi: 770, helper: 2170 } as const;

export const ISR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: ISR_WORLD.width - 48, h: ISR_WORLD.height },
  floor: ISR_WORLD.floor,
  perches: [
    { x: ISR_SHELF.x - 10, y: ISR_SHELF.top, w: ISR_SHELF.w + 20, h: 12 }, // the top of the tall shelf
    ...ISR_SHELF.shelves.map((y) => ({ x: ISR_SHELF.x, y, w: ISR_SHELF.w, h: 12 })), // its shelves
    ...ISR_LEVELS.map((l) => ({ x: ISR_TABLE.cx - railHalf(l), y: railY(l), w: 2 * railHalf(l), h: 12 })), // the rails along the table's rows
    { x: ISR_LAMP_STAND.x, y: ISR_LAMP_STAND.y, w: ISR_LAMP_STAND.w, h: 12 }, // the lamp's stand
  ],
};

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const ISR_DOOR = { x: 2342, y: ISR_WORLD.floor - 70, reach: 110 } as const;

export type IsrThingKind = "idrisi" | "helper" | "stack" | "lamp" | "place";
export interface IsrThing extends RoomThing {
  kind: IsrThingKind;
  /** For a place on the table: its number, counted row by row from the first column (0 is the first). */
  place?: number;
}

/** The row of the table a map's row lies in: a map of two rows uses the two rows at the front. */
export const levelOf = (row: number, rows: number) => ISR_LEVELS[ISR_LEVELS.length - rows + row]!;
/** Where a place lies on the table: the first column on the left, or on the right on a page read right to left. */
export function placeAt(p: number, rows: number, cols: number, rtl: boolean): { x: number; y: number; k: number } {
  const r = Math.floor(p / cols);
  const c = p % cols;
  const l = levelOf(r, rows);
  const cc = rtl ? cols - 1 - c : c;
  return { x: ISR_TABLE.cx + (cc - (cols - 1) / 2) * ISR_PITCH * l.k, y: l.y, k: l.k };
}

/**
 * Every thing in the hall, for a way of playing: al-Idrisi, the helper, the stack of loose sheets, the lamp (only in
 * Challenge, the one way of playing in which the map is checked), and a place on the table for every sheet of the map.
 * The places lie where the reading direction puts them; their ids are by place ("place-0" is the first), the same either way.
 */
export function isrThings(style: SheetsStyle, rtl: boolean): IsrThing[] {
  const def = sheetsMap(style);
  const n = def.rows * def.cols;
  return [
    { id: "idrisi", kind: "idrisi", x: ISR_START.idrisi, y: 500, reach: 170, name: "isr_thing_idrisi" },
    { id: "helper", kind: "helper", x: ISR_START.helper, y: 520, reach: 140, name: "isr_thing_helper" },
    { id: "stack", kind: "stack", x: ISR_STACK.x, y: ISR_STACK.y, reach: 80, name: "isr_thing_stack" },
    ...(style === "challenge" ? [{ id: "lamp", kind: "lamp" as const, x: ISR_LAMP.x, y: ISR_LAMP.y, reach: 70, name: "isr_thing_lamp" }] : []),
    ...Array.from({ length: n }, (_, p): IsrThing => {
      const at = placeAt(p, def.rows, def.cols, rtl);
      return { id: `place-${p}`, kind: "place", place: p, x: at.x, y: at.y, reach: 60, name: "isr_thing_sheet" };
    }),
  ];
}

/** Where the bird stands to touch a thing: beside a person, and just before the lamp, a sheet or the stack (so that it is not hidden behind the bird). */
export const ISR_APPROACH: Record<IsrThingKind, number> = { idrisi: -110, helper: -90, stack: -50, lamp: -40, place: -36 };

export const ISR_LAYOUT: RoomLayout = {
  world: ISR_WORLD,
  room: ISR_ROOM,
  door: ISR_DOOR,
  start: { hudhud: ISR_START.hudhud, keeper: ISR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-idrisi-room-cosmetics",
};

export type IsrSpeaker = "hudhud" | "keeper" | "idrisi" | "helper" | "narrator";
/**
 * The hall's talk. The lines are the scattered sheets' own (id_*), said by the same speakers as on their page; three are
 * new and only greet, thank and say goodbye (isr_idrisi_hello, isr_thanks, isr_idrisi_bye). The flags a node sets are
 * the quest's own (sim/sheets.ts): asking about his book and about the maps is Curiosity, answering the helper kindly is
 * Kindness (either answer is `answered`, as on the page), and under the stack of loose sheets is the feather.
 */
export const ISR_SCRIPTS: Record<string, Script<IsrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "id_intro_1", mood: "alarm" }, { who: "idrisi", key: "id_intro_2", mood: "think" }] } } },
  idrisi: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "idrisi", key: "isr_idrisi_hello", mood: "glad" }], choices: [{ key: "id_ask_book", to: "book", deeper: true }, { key: "id_ask_maps", to: "maps", deeper: true }, { key: "isr_thanks", to: "bye" }] },
      book: { lines: [{ who: "narrator", key: "id_book_1", mood: "think" }], set: ["askedBook"], choices: [{ key: "id_ask_maps", to: "maps", deeper: true }, { key: "isr_thanks", to: "bye" }] },
      maps: { lines: [{ who: "narrator", key: "id_maps_1", mood: "think" }], set: ["askedMaps"], choices: [{ key: "id_ask_book", to: "book", deeper: true }, { key: "isr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "idrisi", key: "isr_idrisi_bye", mood: "glad" }] },
    },
  },
  helper: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "helper", key: "id_helper_1", mood: "think" }], choices: [{ key: "id_helper_kind", to: "kind" }, { key: "id_helper_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "id_helper_kind", mood: "glad" }, { who: "helper", key: "id_helper_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "id_helper_blunt", mood: "think" }, { who: "helper", key: "id_helper_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the helper says again what the answer brought.
  helperKind: { start: "1", nodes: { "1": { lines: [{ who: "helper", key: "id_helper_kind_r", mood: "glad" }] } } },
  helperBlunt: { start: "1", nodes: { "1": { lines: [{ who: "helper", key: "id_helper_blunt_r", mood: "think" }] } } },
  stack: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "id_feather_1", mood: "glad" }] } } },
  stackAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "id_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "id_done_1", mood: "glad" }] } } },
};
