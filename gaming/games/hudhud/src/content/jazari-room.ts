// Al-Jazari's workshop as data: the second room on the room engine (scenes/room.ts), asked for by the founder on
// 27 November 2026 ("he should go to another complete room with other character"). The elephant clock is played in
// it: its rules, its three puzzles, its words and its history are the page quest's (content/clock.ts, sim/clock.ts),
// unchanged; only where and how it is played is new. Every line of dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the clock quest already says (content/clock.ts, ck_float_1, ck_balls_1,
//                        ck_note_2 to ck_note_4): the float that fills and sinks, the falcon, the dragon, the vessel
//                        with the gong, the balls gathered in the bowl
//   invented for play    the workshop, its window, shelves, workbench and water basin (decoration: it claims nothing),
//                        the frame of five places that holds the parts (the game's own: not the clock's appearance),
//                        the lever that sets it going, the apprentice, the box on the high shelf, every spoken line,
//                        and al-Jazari's figure, a cut-out drawn in code that is not a likeness
//                        (review ledger, HR-HH-47)
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { Room } from "../sim/move";
import { ASSIST } from "./workshop";

/** The same height, floor and view as Ibn al-Haytham's workshop; as wide. */
export const JR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The five places on the clock's frame, in the order the motion passes through them: where each part stands (its
 * middle) and the top of the plinth it stands on. The road climbs to the falcon and steps down to the bowl. */
export const JR_PLACES = [
  { x: 1640, y: 536, plinth: 582 },
  { x: 1760, y: 256, plinth: 302 },
  { x: 1880, y: 346, plinth: 392 },
  { x: 2000, y: 436, plinth: 482 },
  { x: 2120, y: 526, plinth: 572 },
] as const;
/** Where the spare parts stand on the workbench (Explorer and Challenge have two; Story has none). */
export const JR_SPARES = [
  { x: 1200, y: 424 },
  { x: 1340, y: 424 },
] as const;
export const JR_BENCH = { x: 1100, y: 470, w: 380 } as const;
export const JR_HIGH_SHELF = { x: 1120, y: 214, w: 320 } as const;
export const JR_LOW_SHELF = { x: 640, y: 300, w: 220 } as const;
export const JR_BASIN = { x: 860, w: 150, y: 562 } as const;
export const JR_WINDOW = { x: 250, y: 130, w: 200, h: 250 } as const;
export const JR_PLATFORM = { x: 1560, w: 700, y: 600 } as const;
export const JR_LEVER = { x: 2236, y: 560 } as const;
export const JR_START = { hudhud: 250, keeper: 106, jazari: 580, apprentice: 1500 } as const;

export const JR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: JR_WORLD.width - 48, h: JR_WORLD.height },
  floor: JR_WORLD.floor,
  perches: [
    { x: JR_LOW_SHELF.x, y: JR_LOW_SHELF.y, w: JR_LOW_SHELF.w, h: 12 }, // the shelf of gears by the window
    { x: JR_BASIN.x + 6, y: JR_BASIN.y, w: JR_BASIN.w - 12, h: 12 }, // the basin's rim
    { x: JR_BENCH.x, y: JR_BENCH.y, w: JR_BENCH.w, h: 12 }, // the workbench
    { x: JR_HIGH_SHELF.x, y: JR_HIGH_SHELF.y, w: JR_HIGH_SHELF.w, h: 12 }, // the high shelf
    ...JR_PLACES.map((p) => ({ x: p.x - 56, y: p.plinth, w: 112, h: 12 })), // the five plinths
  ],
};

/** The door at the far end: the same door, in the same place, as the workshop's (content/workshop.ts). */
export const JR_DOOR = { x: 2342, y: JR_WORLD.floor - 70, reach: 110 } as const;

export type JrThingKind = "place" | "spare" | "lever" | "jazari" | "apprentice" | "box";
export interface JrThing extends RoomThing {
  kind: JrThingKind;
  /** For a place, its index on the clock (0 to 4); for a spare, its index on the workbench (0 or 1). */
  index?: number;
}
export const JR_THINGS: JrThing[] = [
  { id: "jazari", kind: "jazari", x: JR_START.jazari, y: 500, reach: 170, name: "jr_thing_jazari" },
  { id: "apprentice", kind: "apprentice", x: JR_START.apprentice, y: 520, reach: 140, name: "jr_thing_apprentice" },
  { id: "box", kind: "box", x: 1396, y: 192, reach: 100, name: "jr_thing_box" },
  ...JR_SPARES.map((s, i): JrThing => ({ id: `spare-${i + 1}`, kind: "spare", index: i, x: s.x, y: s.y, reach: 110, name: `jr_thing_spare_${i + 1}` })),
  ...JR_PLACES.map((p, i): JrThing => ({ id: `place-${i + 1}`, kind: "place", index: i, x: p.x, y: p.y, reach: 110, name: `jr_thing_place_${i + 1}` })),
  { id: "lever", kind: "lever", x: JR_LEVER.x, y: JR_LEVER.y, reach: 100, name: "jr_thing_lever" },
];

/** Where the bird stands to touch a thing, across from it: beside a person, on the near edge of a plinth or of a spare
 * part's place on the workbench (so that the part is not hidden behind the bird), and right at the box. */
export const JR_APPROACH: Record<JrThingKind, number> = { jazari: 110, apprentice: -110, box: 0, spare: -44, place: -44, lever: -44 };

export const JR_LAYOUT: RoomLayout = {
  world: JR_WORLD,
  room: JR_ROOM,
  door: JR_DOOR,
  start: { hudhud: JR_START.hudhud, keeper: JR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-jazari-room-cosmetics",
};

export type JrSpeaker = "hudhud" | "keeper" | "jazari" | "apprentice" | "narrator";
/**
 * The room's talk. The lines are the clock quest's own (ck_*), said by the same speakers as on its page; two lines are
 * new and only introduce the room (jr_jazari_hello, jr_jazari_bye). The flags a node sets are the clock's own flags
 * (sim/clock.ts): asking about the float and about the balls is Curiosity, answering the apprentice kindly is Kindness,
 * and the box on the high shelf holds the feather.
 */
export const JR_SCRIPTS: Record<string, Script<JrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ck_intro_1", mood: "alarm" }, { who: "jazari", key: "ck_intro_2", mood: "think" }] } } },
  jazari: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "jazari", key: "jr_jazari_hello", mood: "glad" }], choices: [{ key: "ck_ask_float", to: "float", deeper: true }, { key: "ck_ask_balls", to: "balls", deeper: true }, { key: "jr_thanks", to: "bye" }] },
      float: { lines: [{ who: "narrator", key: "ck_float_1", mood: "think" }], set: ["askedFloat"], choices: [{ key: "ck_ask_balls", to: "balls", deeper: true }, { key: "jr_thanks", to: "bye" }] },
      balls: { lines: [{ who: "narrator", key: "ck_balls_1", mood: "think" }], set: ["askedBalls"], choices: [{ key: "ck_ask_float", to: "float", deeper: true }, { key: "jr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "jazari", key: "jr_jazari_bye", mood: "glad" }] },
    },
  },
  apprentice: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "apprentice", key: "ck_app_1", mood: "think" }], choices: [{ key: "ck_app_kind", to: "kind" }, { key: "ck_app_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "ck_app_kind", mood: "glad" }, { who: "apprentice", key: "ck_app_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "ck_app_blunt", mood: "think" }, { who: "apprentice", key: "ck_app_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the apprentice says again what the answer brought.
  apprenticeKind: { start: "1", nodes: { "1": { lines: [{ who: "apprentice", key: "ck_app_kind_r", mood: "glad" }] } } },
  apprenticeBlunt: { start: "1", nodes: { "1": { lines: [{ who: "apprentice", key: "ck_app_blunt_r", mood: "think" }] } } },
  box: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ck_box_1", mood: "glad" }] } } },
  boxAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ck_box_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ck_done_1", mood: "glad" }] } } },
};
