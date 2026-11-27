// The golden scene as data: the room, the puzzle in it, the things that can be touched and the words that are said.
// Everything here is authored; nothing is generated at run time. The lines of dialogue are keys of the string tables
// (i18n/<lang>.json), never text.
//
// History and invention, kept apart on purpose:
//   from museum records  the dark room and the small hole, light going straight and being cut by a solid body
//                        (invention/camera-obscura); light going from the thing to the eye, the book on optics, Basra
//                        and Cairo (person/ibn-al-haytham, work/kitab-al-manazir)
//   invented for play    the workshop itself, its cat, the page of the Atlas, the mirrors on stands, every spoken line,
//                        the view through the arch. There is no prism: the founder's pictures show one and no record
//                        read for this scene supports it, so it was taken out (review ledger, HR-HH-03)
import type { Script } from "../narrative/dialogue";
import type { Lean, LightPuzzle } from "../sim/light";
import type { Room } from "../sim/move";

export const WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;
export const GRID = { x0: 150, y0: 170, dx: 110, dy: 100 } as const;
export const cellX = (col: number) => GRID.x0 + col * GRID.dx;
export const cellY = (row: number) => GRID.y0 + row * GRID.dy;

export type PlayStyle = "story" | "explorer" | "challenge";

/** The positions that light the page. Mirrors f and g stand in the beam's road and must be laid flat. */
const SOLVED: Record<string, Lean> = { a: "\\", b: "\\", c: "/", d: "/", e: "\\", f: "-", g: "-" };
/**
 * How each way of playing finds the room.
 *   Story      five mirrors with two positions each; three need a turn, and they glow.
 *   Explorer   six mirrors with three positions each (two leans, and laid flat so that the beam passes). Three need
 *              one turn each; the sixth stands in the beam's road, already flat, and turning it is a mistake to
 *              understand and undo.
 *   Challenge  seven mirrors, all wrong, ten turns at the least, and the page in words says only where the beam ends:
 *              the road has to be reasoned out, not read off.
 */
const START: Record<PlayStyle, Record<string, Lean>> = {
  story: { a: "/", b: "\\", c: "\\", d: "/", e: "/" },
  explorer: { a: "/", b: "\\", c: "-", d: "/", e: "/", f: "-" },
  challenge: { a: "/", b: "/", c: "\\", d: "\\", e: "/", f: "/", g: "\\" },
};
const MIRROR_CELLS: [string, number, number][] = [
  ["a", 2, 1],
  ["b", 2, 3],
  ["c", 7, 3],
  ["d", 7, 0],
  ["e", 10, 0],
  ["f", 5, 3], // on the beam's road along the floor, under the books
  ["g", 9, 0], // on its road along the ceiling, hung between the high shelves
];

/** The cell of the tall jar that keeps the beam from the short road along the floor. */
export const JAR = { col: 9, row: 3 } as const;

export function workshopPuzzle(style: PlayStyle): LightPuzzle {
  return {
    cols: 12,
    rows: 4,
    source: { col: 0, row: 1, dir: "E" },
    mirrors: MIRROR_CELLS.filter(([id]) => id in START[style]).map(([id, col, row]) => ({ id, col, row, lean: START[style][id]! })),
    leans: style === "story" ? ["/", "\\"] : ["/", "\\", "-"],
    // A tower of books on a shelf: the beam cannot simply cross the room. And a tall jar on the floor before the
    // reading stand: with mirrors that can be laid flat, the beam could otherwise run along the floor straight to the
    // page, and the road by the ceiling would never be needed.
    blocks: [{ col: 5, row: 1 }, JAR],
    // No prism. The founder's pictures of this story show one; no museum record read for the scene says Ibn al-Haytham
    // worked with one, and his directive of 26 November 2026 has it out until a reviewer approves an honest use.
    prisms: [],
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
/** Whether a thing is in the room in this way of playing: every thing but a mirror the puzzle does not have. */
/**
 * The door at the garden's far end (the journey, content/journey.ts): on the floor near the right edge of the world,
 * clear of the fountain (x 2130 to 2286) and the lantern (x 1945): drawn 110 pixels wide (art/corridor.ts), from x 2287
 * to 2397. Closed until the quest is done, then lit; the bird reaches it by the same nearness test as a thing
 * (sim/door.ts), from about x 2240 on the floor.
 */
export const DOOR = { x: 2342, y: WORLD.floor - 70, reach: 110 } as const;
export const inPlay = (t: Thing, puzzle: LightPuzzle): boolean => t.kind !== "mirror" || puzzle.mirrors.some((m) => `mirror-${m.id}` === t.id);
export const START_AT = { hudhud: { x: 250, y: WORLD.floor }, keeper: { x: 106, y: WORLD.floor }, scholar: { x: 560, y: WORLD.floor }, cat: { x: 1060, y: 568 } } as const;

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
      see: { lines: [{ who: "narrator", key: "d_scholar_see_1", mood: "think" }, { who: "keeper", key: "d_scholar_see_2", mood: "glad" }], set: ["askedMore"], choices: [{ key: "c_ask_dark", to: "dark", deeper: true }, { key: "c_thanks", to: "bye" }] },
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
