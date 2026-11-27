// Al-Khwarizmi's room as data: the fourth room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop,
// al-Jazari's and al-Tusi's observatory, asked for by the founder on 27 November 2026 (every scene a complete room with
// its own figure; continue all the remaining work). The locked box is played in it: its rules, the three ways of
// playing, the words (the sentence that restates the problem after every move included) and the history are the page
// quest's (content/algebra.ts, sim/algebra.ts), unchanged; only where and how it is played is new. Every line of
// dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the locked box's quest already says (ak_words_1, ak_ops_1, ak_note_2 and
//                        ak_note_4): he wrote everything in words, his book is named after two operations
//   invented for play    the room itself (its window, its shelves of books and scrolls with no writing, the low writing
//                        desk with a plain inkpot and reed pens), the long table with its two large trays and the equals
//                        sign between them (the page's own picture, set in a room), the hollow groups on the trays that
//                        are touched to restore, the two plain brass weights on their stand that are touched to balance,
//                        the scoop that is touched to share, the locked box on its plinth, the child who carries the box
//                        (already invented in the quest), three new spoken lines, and al-Khwarizmi's figure, a cut-out
//                        drawn in code that is not a likeness (review ledger, HR-HH-49). The quest's own note already says
//                        that nothing read for the game suggests he used trays or scales: the weights here are only the
//                        game's controls for the move of balancing, and claim nothing.
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { Kind, Place } from "../sim/algebra";
import type { Room } from "../sim/move";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other three rooms; as wide. */
export const AKR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The window on the day, near where the bird comes in. */
export const AKR_WINDOW = { x: 130, y: 110, w: 220, h: 290 } as const;
/** The shelves of books and scrolls: a tall case whose two upper shelves are perches. */
export const AKR_BOOKS = { x: 420, w: 200, top: 170, shelves: [280, 410] } as const;
/** The low writing desk, with a plain inkpot and reed pens on it; its top is a perch. */
export const AKR_DESK = { x: 660, w: 160, y: 548 } as const;
/** The stand by the table on which the two weights stand; its top is a perch. */
export const AKR_STAND = { x: 990, w: 240, y: 540 } as const;
/** The two weights on the stand: the one marked with a box balances the things, the one marked with a coin the numbers. */
export const AKR_WEIGHTS: readonly { kind: Kind; x: number }[] = [
  { kind: "things", x: 1050 },
  { kind: "number", x: 1170 },
];
/** The weights' middles stand this high. */
export const AKR_WEIGHT_Y = 505;
/** The long table (a perch), the scoop lying on its near end, and the two trays standing on it. */
export const AKR_TABLE = { x: 1230, w: 900, y: 470 } as const;
export const AKR_SCOOP = { x: 1262, y: 455 } as const;
/** The two trays, on screen from left to right, and the equals sign between them. Each holds one side of the problem:
 * on a page read right to left the first side is on the right, as on the page's own picture (art/algebra.ts). */
export const AKR_TRAYS = [{ x: 1300 }, { x: 1740 }] as const;
export const AKR_EQUALS = { x: 1705, y: 330 } as const;
/**
 * A tray's size and the places in it, in game pixels from its top left corner. What is there (boxes, then coins) is laid
 * out in rows in the upper part; what is taken away is shown hollow in a strip along the bottom, the hollow boxes in its
 * first part and the hollow coins in its second, so that each taken-away group stands in a place of its own that can be
 * flown to and touched.
 */
export const AKR_TRAY = {
  w: 370,
  top: 236,
  h: 226,
  pad: 14,
  /** The upper part, for what is there. */
  shownH: 136,
  /** The strip for what is taken away: its top, its height, and where its two parts begin and end across the tray. */
  strip: { top: 142, h: 56, boxes: [0, 140] as const, coins: [150, 342] as const },
  box: { size: 44, pitch: 52, row: 52 },
  coin: { size: 24, pitch: 28, row: 28 },
} as const;
/** The locked box on its plinth beside the table (the plinth's top is a perch; the feather is under the box). */
export const AKR_PLINTH = { x: 2150, w: 130, y: 330 } as const;
export const AKR_BOX = { x: 2238, y: 302 } as const;
export const AKR_START = { hudhud: 250, keeper: 106, khwarizmi: 880, child: 2160 } as const;

export const AKR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: AKR_WORLD.width - 48, h: AKR_WORLD.height },
  floor: AKR_WORLD.floor,
  perches: [
    ...AKR_BOOKS.shelves.map((y) => ({ x: AKR_BOOKS.x, y, w: AKR_BOOKS.w, h: 12 })), // the shelves of books
    { x: AKR_DESK.x, y: AKR_DESK.y, w: AKR_DESK.w, h: 12 }, // the writing desk
    { x: AKR_STAND.x, y: AKR_STAND.y, w: AKR_STAND.w, h: 12 }, // the stand of the weights
    { x: AKR_TABLE.x, y: AKR_TABLE.y, w: AKR_TABLE.w, h: 12 }, // the long table
    { x: AKR_PLINTH.x, y: AKR_PLINTH.y, w: AKR_PLINTH.w, h: 12 }, // the plinth of the locked box
  ],
};

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const AKR_DOOR = { x: 2342, y: AKR_WORLD.floor - 70, reach: 110 } as const;

export type AkrThingKind = "khwarizmi" | "child" | "box" | "restore" | "weight" | "scoop";
export interface AkrThing extends RoomThing {
  kind: AkrThingKind;
  /** For a hollow group, the side of the problem it is on; for a hollow group or a weight, the kind it holds. */
  side?: Place;
  of?: Kind;
}

/** The tray (0 on the screen's left, 1 on its right) that holds a side of the problem. */
export const trayOf = (side: Place, rtl: boolean): 0 | 1 => ((side === "left") !== rtl ? 0 : 1);
/** The screen side a tray stands on, for the words. */
const screenSide = (tray: 0 | 1): "left" | "right" => (tray === 0 ? "left" : "right");
/** Where a taken-away group of a side stands: the middle of its part of the strip along the bottom of its tray. */
export function hollowSpot(side: Place, kind: Kind, rtl: boolean): { x: number; y: number } {
  const tray = AKR_TRAYS[trayOf(side, rtl)]!;
  const [a, b] = kind === "things" ? AKR_TRAY.strip.boxes : AKR_TRAY.strip.coins;
  return { x: tray.x + AKR_TRAY.pad + (a + b) / 2, y: AKR_TRAY.top + AKR_TRAY.pad + AKR_TRAY.strip.top + AKR_TRAY.strip.h / 2 };
}

const SIDES: Place[] = ["left", "right"];
const KINDS: Kind[] = ["things", "number"];
/**
 * Every thing in the room. The hollow groups stand where their side's tray is, so they move with the reading direction;
 * their ids are by the side of the problem ("restore-left-number" is the quest's restore of the number on the first
 * side, whatever tray holds it), and their names by the tray seen ("the hollow coins on the right tray").
 */
export function akrThings(rtl: boolean): AkrThing[] {
  return [
    { id: "khwarizmi", kind: "khwarizmi", x: AKR_START.khwarizmi, y: 500, reach: 170, name: "akr_thing_khwarizmi" },
    { id: "child", kind: "child", x: AKR_START.child, y: 520, reach: 140, name: "akr_thing_child" },
    { id: "box", kind: "box", x: AKR_BOX.x, y: AKR_BOX.y, reach: 90, name: "akr_thing_box" },
    ...AKR_WEIGHTS.map((w): AkrThing => ({ id: `weight-${w.kind}`, kind: "weight", of: w.kind, x: w.x, y: AKR_WEIGHT_Y, reach: 90, name: `akr_thing_weight_${w.kind}` })),
    { id: "scoop", kind: "scoop", x: AKR_SCOOP.x, y: AKR_SCOOP.y, reach: 80, name: "akr_thing_scoop" },
    ...SIDES.flatMap((side) =>
      KINDS.map((of): AkrThing => {
        const at = hollowSpot(side, of, rtl);
        return { id: `restore-${side}-${of}`, kind: "restore", side, of, x: at.x, y: at.y, reach: 80, name: `akr_thing_less_${of}_${screenSide(trayOf(side, rtl))}` };
      }),
    ),
  ];
}
/** The ids of every thing, the same in either reading direction. */
export const AKR_IDS: readonly string[] = akrThings(false).map((t) => t.id);

/** Where the bird stands to touch a thing: beside a person, and just before a weight, a hollow group or the locked box
 * on its plinth (so that it is not hidden behind the bird); right at the scoop. */
export const AKR_APPROACH: Record<AkrThingKind, number> = { khwarizmi: -110, child: -110, box: -60, weight: -40, restore: -50, scoop: 0 };

export const AKR_LAYOUT: RoomLayout = {
  world: AKR_WORLD,
  room: AKR_ROOM,
  door: AKR_DOOR,
  start: { hudhud: AKR_START.hudhud, keeper: AKR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-khwarizmi-room-cosmetics",
};

export type AkrSpeaker = "hudhud" | "keeper" | "khwarizmi" | "child" | "narrator";
/**
 * The room's talk. The lines are the locked box's own (ak_*), said by the same speakers as on its page; three are new and
 * only greet, thank and say goodbye (akr_khwarizmi_hello, akr_thanks, akr_khwarizmi_bye). The flags a node sets are the
 * quest's own flags (sim/algebra.ts): asking how he wrote problems and about the two operations is Curiosity, answering
 * the child kindly is Kindness (either answer is `answered`, as on the page), and under the box is the feather.
 */
export const AKR_SCRIPTS: Record<string, Script<AkrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ak_intro_1", mood: "alarm" }, { who: "khwarizmi", key: "ak_intro_2", mood: "think" }] } } },
  khwarizmi: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "khwarizmi", key: "akr_khwarizmi_hello", mood: "glad" }], choices: [{ key: "ak_ask_words", to: "words", deeper: true }, { key: "ak_ask_ops", to: "ops", deeper: true }, { key: "akr_thanks", to: "bye" }] },
      words: { lines: [{ who: "narrator", key: "ak_words_1", mood: "think" }], set: ["askedWords"], choices: [{ key: "ak_ask_ops", to: "ops", deeper: true }, { key: "akr_thanks", to: "bye" }] },
      ops: { lines: [{ who: "narrator", key: "ak_ops_1", mood: "think" }], set: ["askedOps"], choices: [{ key: "ak_ask_words", to: "words", deeper: true }, { key: "akr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "khwarizmi", key: "akr_khwarizmi_bye", mood: "glad" }] },
    },
  },
  child: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "child", key: "ak_child_1", mood: "think" }], choices: [{ key: "ak_child_kind", to: "kind" }, { key: "ak_child_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "ak_child_kind", mood: "glad" }, { who: "child", key: "ak_child_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "ak_child_blunt", mood: "think" }, { who: "child", key: "ak_child_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the child says again what the answer brought.
  childKind: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "ak_child_kind_r", mood: "glad" }] } } },
  childBlunt: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "ak_child_blunt_r", mood: "think" }] } } },
  box: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ak_feather_1", mood: "glad" }] } } },
  boxAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ak_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ak_done_1", mood: "glad" }] } } },
};
