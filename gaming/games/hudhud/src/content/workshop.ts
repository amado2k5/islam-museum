// The golden scene as data: the room, the puzzle in it, the things that can be touched and the words that are said.
// Everything here is authored; nothing is generated at run time. The lines of dialogue are keys of the string tables
// (i18n/<lang>.json), never text.
//
// History and invention, kept apart on purpose:
//   from museum records  the dark room and the small hole, light going straight and being cut by a solid body
//                        (invention/camera-obscura); light going from the thing to the eye, the book on optics, Basra
//                        and Cairo (person/ibn-al-haytham, work/kitab-al-manazir)
//   invented for play    the workshop itself, its cat, the page of the Atlas, the mirrors on stands, every spoken line,
//                        the view through the arch, and the prism (which the founder's pictures show and no record
//                        read for this scene supports; see the review ledger, HR-HH-03)
import type { Script } from "../narrative/dialogue";
import type { Lean, LightPuzzle } from "../sim/light";
import type { Room } from "../sim/move";

export const WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;
export const GRID = { x0: 150, y0: 170, dx: 110, dy: 100 } as const;
export const cellX = (col: number) => GRID.x0 + col * GRID.dx;
export const cellY = (row: number) => GRID.y0 + row * GRID.dy;

export type PlayStyle = "story" | "explorer" | "challenge";

/** The leans that light the page. */
const SOLVED: Record<string, Lean> = { a: "\\", b: "\\", c: "/", d: "/", e: "\\" };
/** How each play style finds the mirrors: Story and Explorer need three turns, Challenge all five. */
const START: Record<PlayStyle, Record<string, Lean>> = {
  story: { a: "/", b: "\\", c: "\\", d: "/", e: "/" },
  explorer: { a: "/", b: "\\", c: "\\", d: "/", e: "/" },
  challenge: { a: "/", b: "/", c: "\\", d: "\\", e: "/" },
};
const MIRROR_CELLS: [string, number, number][] = [
  ["a", 2, 1],
  ["b", 2, 3],
  ["c", 7, 3],
  ["d", 7, 0],
  ["e", 10, 0],
];

export function workshopPuzzle(style: PlayStyle): LightPuzzle {
  return {
    cols: 12,
    rows: 4,
    source: { col: 0, row: 1, dir: "E" },
    mirrors: MIRROR_CELLS.map(([id, col, row]) => ({ id, col, row, lean: START[style][id]! })),
    // A tower of books on a shelf: the beam cannot simply cross the room.
    blocks: [{ col: 5, row: 1 }],
    prisms: [{ col: 10, row: 1 }],
    target: { col: 10, row: 3 },
  };
}
export const solvedLean = (id: string): Lean => SOLVED[id]!;

/** Turns allowed for the Ingenuity goal, over the fewest possible: Story has no count. */
export const TURN_SLACK: Record<PlayStyle, number | null> = { story: null, explorer: 2, challenge: 0 };
/** What Story adds to the bird: more flaps and a slower glide. The rules of the puzzle are the same for everyone. */
export const ASSIST: Record<PlayStyle, { extraFlaps: number; slowFall: number }> = {
  story: { extraFlaps: 4, slowFall: 0.6 },
  explorer: { extraFlaps: 0, slowFall: 1 },
  challenge: { extraFlaps: 0, slowFall: 1 },
};

export const ROOM: Room = {
  bounds: { x: 24, y: 24, w: WORLD.width - 48, h: WORLD.height },
  floor: WORLD.floor,
  perches: [
    { x: 300, y: 338, w: 140, h: 12 }, // under mirror a
    { x: 632, y: 338, w: 140, h: 12 }, // the books
    { x: 850, y: 238, w: 140, h: 12 }, // under mirror d
    { x: 1180, y: 238, w: 140, h: 12 }, // under mirror e
    { x: 1180, y: 540, w: 150, h: 12 }, // the reading stand
    { x: 1000, y: 568, w: 120, h: 12 }, // the cat's chest
    { x: 1470, y: 150, w: 180, h: 12 }, // the top of the arch
    { x: 1890, y: 470, w: 110, h: 12 }, // the garden lantern
    { x: 2130, y: 520, w: 150, h: 12 }, // the fountain's rim
  ],
};

export type ThingKind = "mirror" | "person" | "animal" | "cord" | "page" | "feather";
export interface Thing {
  id: string;
  kind: ThingKind;
  x: number;
  y: number;
  /** How near the bird must be, in world pixels. */
  reach: number;
  /** The string that names it, for the list a screen reader reads. */
  name: string;
}
export const THINGS: Thing[] = [
  ...MIRROR_CELLS.map(([id, col, row], i): Thing => ({ id: `mirror-${id}`, kind: "mirror", x: cellX(col), y: cellY(row), reach: 150, name: `thing_mirror_${i + 1}` })),
  { id: "scholar", kind: "person", x: 560, y: 500, reach: 170, name: "thing_scholar" },
  { id: "cat", kind: "animal", x: 1060, y: 548, reach: 130, name: "thing_cat" },
  { id: "page", kind: "page", x: cellX(10), y: cellY(3), reach: 150, name: "thing_page" },
  { id: "cord", kind: "cord", x: 1560, y: 120, reach: 120, name: "thing_cord" },
  { id: "feather", kind: "feather", x: 2205, y: 470, reach: 110, name: "thing_feather" },
];
export const START_AT = { hudhud: { x: 250, y: WORLD.floor }, keeper: { x: 170, y: WORLD.floor }, scholar: { x: 560, y: WORLD.floor }, cat: { x: 1060, y: 568 } } as const;

export type Speaker = "hudhud" | "keeper" | "scholar" | "cat" | "narrator";
export const SCRIPTS: Record<string, Script<Speaker>> = {
  intro: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "hudhud", key: "d_intro_1", mood: "alarm" }, { who: "keeper", key: "d_intro_2", mood: "think" }, { who: "hudhud", key: "d_intro_3", mood: "glad" }] },
    },
  },
  scholar: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "scholar", key: "d_scholar_1", mood: "glad" }, { who: "scholar", key: "d_scholar_2", mood: "think" }], choices: [{ key: "c_ask_dark", to: "dark", deeper: true }, { key: "c_ask_see", to: "see", deeper: true }, { key: "c_thanks", to: "bye" }] },
      dark: { lines: [{ who: "scholar", key: "d_scholar_dark_1", mood: "think" }, { who: "hudhud", key: "d_scholar_dark_2", mood: "glad" }], set: ["askedMore"], choices: [{ key: "c_ask_see", to: "see", deeper: true }, { key: "c_thanks", to: "bye" }] },
      see: { lines: [{ who: "scholar", key: "d_scholar_see_1", mood: "think" }, { who: "keeper", key: "d_scholar_see_2", mood: "glad" }], set: ["askedMore"], choices: [{ key: "c_ask_dark", to: "dark", deeper: true }, { key: "c_thanks", to: "bye" }] },
      bye: { lines: [{ who: "scholar", key: "d_scholar_bye", mood: "glad" }] },
    },
  },
  scholarAfter: { start: "1", nodes: { "1": { lines: [{ who: "scholar", key: "d_scholar_after", mood: "glad" }] } } },
  cat: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "d_cat_1", mood: "glad" }, { who: "cat", key: "d_cat_2", mood: "glad" }, { who: "keeper", key: "d_cat_3", mood: "glad" }], set: ["metCat"] } } },
  pageDark: { start: "1", nodes: { "1": { lines: [{ who: "keeper", key: "d_page_dark", mood: "think" }] } } },
  solved: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "d_solved_1", mood: "glad" }, { who: "scholar", key: "d_solved_2", mood: "glad" }, { who: "keeper", key: "d_solved_3", mood: "glad" }] } } },
  secret: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "d_secret_1", mood: "alarm" }, { who: "scholar", key: "d_secret_2", mood: "think" }, { who: "keeper", key: "d_secret_3", mood: "glad" }] } } },
  feather: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "d_feather_1", mood: "glad" }] } } },
};

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const RECORDS = ["person/ibn-al-haytham", "invention/camera-obscura", "work/kitab-al-manazir"] as const;
