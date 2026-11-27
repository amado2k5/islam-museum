// Al-Tusi's observatory as data: the third room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop
// and al-Jazari's, asked for by the founder on 27 November 2026 (every scene a complete room with its own figure). The
// two circles are played in it: their rules, the three ways of playing, the words and the history are the page quest's
// (content/couple.ts, sim/couple.ts), unchanged; only where and how they are played is new. Every line of dialogue is a
// key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the two circles' quest already says (ts_why_1, ts_obs_1, ts_note_2 to
//                        ts_note_4): the model of two spheres, the observatory at Maragha with its large library
//   invented for play    the observatory hall itself (its opening on the night sky, its shelves of books, its long table
//                        of plain instruments drawn as simple shapes, none of them a named historical instrument), the
//                        model of the two circles standing on a stand, the three levers and the crank on that stand, the
//                        girl who cleans the instruments (already invented in the quest), the instruments on the high
//                        shelf the feather hides among, three new spoken lines, and al-Tusi's figure, a cut-out drawn in
//                        code that is not a likeness (review ledger, HR-HH-48)
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { CoupleField } from "../sim/couple";
import type { Room } from "../sim/move";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other two rooms; as wide. */
export const TSR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The tall opening on the night sky, near where the bird comes in. */
export const TSR_OPENING = { x: 200, y: 80, w: 230, h: 400 } as const;
/** The shelves of books: a tall case whose two upper shelves are perches. */
export const TSR_BOOKS = { x: 720, w: 240, top: 150, shelves: [250, 390] } as const;
/** The model of the two circles on its stand: the large circle's middle and radius, in game pixels. */
export const TSR_MODEL = { x: 1100, y: 290, r: 150 } as const;
/** Where the traced path is drawn in the air beside the model: the same size as the model, so that the two read together. */
export const TSR_AIR = { x: 1490, y: 290, r: 150 } as const;
/** The stand's broad base, a perch in front of which the levers and the crank stand. */
export const TSR_BASE = { x: 940, w: 440, y: 570 } as const;
/** The three levers on the base, in the page's order of its groups (the direction, the speed, the size). */
export const TSR_LEVERS: readonly { field: CoupleField; x: number }[] = [
  { field: "dir", x: 990 },
  { field: "speed", x: 1090 },
  { field: "size", x: 1190 },
];
/** The levers' knobs stand this high. */
export const TSR_LEVER_Y = 528;
/** The crank on the side of the stand. */
export const TSR_CRANK = { x: 1330, y: 500 } as const;
/** The long table of instruments, and the high shelf above it among whose instruments the feather has fallen. */
export const TSR_TABLE = { x: 1850, y: 470, w: 380 } as const;
export const TSR_HIGH_SHELF = { x: 1880, y: 214, w: 300 } as const;
export const TSR_START = { hudhud: 250, keeper: 170, tusi: 600, girl: 1760 } as const;

export const TSR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: TSR_WORLD.width - 48, h: TSR_WORLD.height },
  floor: TSR_WORLD.floor,
  perches: [
    ...TSR_BOOKS.shelves.map((y) => ({ x: TSR_BOOKS.x, y, w: TSR_BOOKS.w, h: 12 })), // the shelves of books
    { x: TSR_BASE.x, y: TSR_BASE.y, w: TSR_BASE.w, h: 12 }, // the stand's base
    { x: TSR_TABLE.x, y: TSR_TABLE.y, w: TSR_TABLE.w, h: 12 }, // the long table
    { x: TSR_HIGH_SHELF.x, y: TSR_HIGH_SHELF.y, w: TSR_HIGH_SHELF.w, h: 12 }, // the high shelf
  ],
};

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const TSR_DOOR = { x: 2342, y: TSR_WORLD.floor - 70, reach: 110 } as const;

export type TsrThingKind = "tusi" | "girl" | "shelf" | "lever" | "crank";
export interface TsrThing extends RoomThing {
  kind: TsrThingKind;
  /** For a lever, the choice it sets. */
  field?: CoupleField;
}
export const TSR_THINGS: TsrThing[] = [
  { id: "tusi", kind: "tusi", x: TSR_START.tusi, y: 500, reach: 170, name: "tsr_thing_tusi" },
  { id: "girl", kind: "girl", x: TSR_START.girl, y: 520, reach: 140, name: "tsr_thing_girl" },
  { id: "shelf", kind: "shelf", x: 2120, y: 192, reach: 100, name: "tsr_thing_shelf" },
  ...TSR_LEVERS.map((l): TsrThing => ({ id: `lever-${l.field}`, kind: "lever", field: l.field, x: l.x, y: TSR_LEVER_Y, reach: 90, name: `tsr_thing_lever_${l.field}` })),
  { id: "crank", kind: "crank", x: TSR_CRANK.x, y: TSR_CRANK.y, reach: 100, name: "tsr_thing_crank" },
];

/** Where the bird stands to touch a thing: beside a person, on the base just before a lever or the crank (so that it
 * is not hidden behind the bird), and right at the high shelf. */
export const TSR_APPROACH: Record<TsrThingKind, number> = { tusi: 110, girl: -110, shelf: 0, lever: -40, crank: -40 };

export const TSR_LAYOUT: RoomLayout = {
  world: TSR_WORLD,
  room: TSR_ROOM,
  door: TSR_DOOR,
  start: { hudhud: TSR_START.hudhud, keeper: TSR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-tusi-room-cosmetics",
};

export type TsrSpeaker = "hudhud" | "keeper" | "tusi" | "girl" | "narrator";
/**
 * The room's talk. The lines are the two circles' own (ts_*), said by the same speakers as on its page; three are new
 * and only greet, thank and say goodbye (tsr_tusi_hello, tsr_thanks, tsr_tusi_bye). The flags a node sets are the
 * quest's own flags (sim/couple.ts): asking why and about the observatory is Curiosity, answering the girl kindly is
 * Kindness (either answer is `answered`, as on the page), and the high shelf holds the feather.
 */
export const TSR_SCRIPTS: Record<string, Script<TsrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ts_intro_1", mood: "alarm" }, { who: "tusi", key: "ts_intro_2", mood: "think" }] } } },
  tusi: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "tusi", key: "tsr_tusi_hello", mood: "glad" }], choices: [{ key: "ts_ask_why", to: "why", deeper: true }, { key: "ts_ask_obs", to: "obs", deeper: true }, { key: "tsr_thanks", to: "bye" }] },
      why: { lines: [{ who: "narrator", key: "ts_why_1", mood: "think" }], set: ["askedWhy"], choices: [{ key: "ts_ask_obs", to: "obs", deeper: true }, { key: "tsr_thanks", to: "bye" }] },
      obs: { lines: [{ who: "narrator", key: "ts_obs_1", mood: "think" }], set: ["askedObs"], choices: [{ key: "ts_ask_why", to: "why", deeper: true }, { key: "tsr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "tusi", key: "tsr_tusi_bye", mood: "glad" }] },
    },
  },
  girl: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "girl", key: "ts_girl_1", mood: "think" }], choices: [{ key: "ts_girl_kind", to: "kind" }, { key: "ts_girl_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "ts_girl_kind", mood: "glad" }, { who: "girl", key: "ts_girl_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "ts_girl_blunt", mood: "think" }, { who: "girl", key: "ts_girl_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the girl says again what the answer brought.
  girlKind: { start: "1", nodes: { "1": { lines: [{ who: "girl", key: "ts_girl_kind_r", mood: "glad" }] } } },
  girlBlunt: { start: "1", nodes: { "1": { lines: [{ who: "girl", key: "ts_girl_blunt_r", mood: "think" }] } } },
  shelf: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ts_feather_1", mood: "glad" }] } } },
  shelfAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ts_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ts_done_1", mood: "glad" }] } } },
};
