// Ibn Battuta's inn as data: the ninth room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop and the
// rooms of al-Jazari, al-Tusi, al-Khwarizmi, al-Kindi, al-Idrisi, al-Razi and Karima al-Marwaziyya, asked for by the
// founder on 27 November 2026 (every scene a complete room with its own figure; continue all the remaining work). The
// road is threaded in it: its rules, the three stages, the three ways of playing, the words and the history are the page
// quest's (content/route.ts, sim/route.ts), unchanged; only where and how they are played is new. Every line of dialogue
// is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the road's quest already says (ib_left_1, ib_written_1, ib_stage_*,
//                        ib_note_2 and ib_note_3): when he set out, who wrote his journey down, and the three stages
//   invented for play    the inn itself (the arcade of a travellers' inn at evening, its arches, the saddlebags and the
//                        rolled carpets along the wall, the lantern, the bales and the high ledge), the camel resting in
//                        an arch (the child's camel; the child is already invented in the quest), the great ring on its
//                        wooden stand with the stage's beads on it and a small wooden peg under each bead for the bird to
//                        stand on, the scroll on the lectern where the stage's sentence is read again, the saddlebag on
//                        the high ledge the feather hides in, three new spoken lines, and Ibn Battuta's figure, a cut-out
//                        drawn in code that is not a likeness (review ledger, HR-HH-54).
// The quest's own rule stands absolutely: the ring is not a map. The beads sit on it in the ring's order, which is never
// the road's (content/route.ts), with no direction and no distance meant; nothing in the inn draws a coast, a compass, a
// place or a scale, and nothing in the inn is written: the scroll is plain, with no writing of any script on it.
import { routeStage } from "./route";
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { RouteStyle } from "../sim/route";
import type { Room } from "../sim/move";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other eight rooms; as wide. */
export const IBR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The arches of the inn's arcade along the back wall: where each opening begins, how wide it is and where its arch springs. */
export const IBR_ARCHES = { first: 40, step: 300, w: 230, spring: 250, top: 150 } as const;
/** The saddlebags and rolled carpets along the wall near where the bird comes in. */
export const IBR_BAGS = { x: 330, w: 220 } as const;
/** The lantern, hung from the ceiling between Ibn Battuta and the ring's stand. */
export const IBR_LANTERN = { x: 800, y: 150 } as const;
/**
 * The great ring on its wooden stand: the ring's middle and radius, the stand's two posts and its beam. The beads sit on
 * the ring; under each bead is a small wooden peg the bird stands on to reach it (`peg` below the bead's middle, `pegW`
 * wide). The ring hangs from the beam by two cords.
 */
export const IBR_RING = { cx: 1180, cy: 330, r: 190, bead: 30, peg: 32, pegW: 56, postL: 930, postR: 1430, beam: 96 } as const;
/** The lectern with the plain scroll on it, beside the ring's stand: where it stands, and the height of the scroll on its top. */
export const IBR_LECTERN = { x: 1500, scroll: 540 } as const;
/** The camel resting in the last arch, lying on the floor: where its middle is. */
export const IBR_CAMEL = { x: 1955 } as const;
/** The bales piled against the wall by the far end (their top is a step), and the high ledge above them with the saddlebag on it. */
export const IBR_BALES = { x: 2090, w: 120, top: 470 } as const;
export const IBR_LEDGE = { x: 1990, w: 200, y: 250 } as const;
export const IBR_SADDLEBAG = { x: 2090, y: 214 } as const;
export const IBR_START = { hudhud: 250, keeper: 106, ibn: 640, child: 1760 } as const;

/** Where bead `i` of `n` sits on the ring: the first at the top, the rest clockwise, mirrored on a page read right to left (the page's own ring, art/route.ts beadPos). */
export function beadAt(n: number, i: number, rtl: boolean): { x: number; y: number } {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
  const x = IBR_RING.cx + IBR_RING.r * Math.cos(a);
  return { x: rtl ? 2 * IBR_RING.cx - x : x, y: IBR_RING.cy + IBR_RING.r * Math.sin(a) };
}
/** The peg under a bead, as a perch. */
export const pegOf = (b: { x: number; y: number }) => ({ x: b.x - IBR_RING.pegW / 2, y: b.y + IBR_RING.peg, w: IBR_RING.pegW, h: 10 });

/** The inn's floor, walls and perches for a stage of `n` beads: the peg under every bead, the bales' top and the high ledge. */
export function ibrRoom(n: number, rtl = false): Room {
  return {
    bounds: { x: 24, y: 24, w: IBR_WORLD.width - 48, h: IBR_WORLD.height },
    floor: IBR_WORLD.floor,
    perches: [
      { x: IBR_LEDGE.x, y: IBR_LEDGE.y, w: IBR_LEDGE.w, h: 12 }, // the high ledge with the saddlebag on it
      { x: IBR_BALES.x, y: IBR_BALES.top, w: IBR_BALES.w, h: 12 }, // the top of the bales, a step up to it
      ...Array.from({ length: n }, (_, i) => pegOf(beadAt(n, i, rtl))), // a peg under every bead
    ],
  };
}

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const IBR_DOOR = { x: 2342, y: IBR_WORLD.floor - 70, reach: 110 } as const;

/**
 * How near the bird must come to a bead to touch it. Generous on purpose, for a child: standing on a bead's peg the bird
 * is two pixels from it, and 60 is far more than that, so a landing a little off the peg still reaches it; yet beads
 * stand about 130 game pixels apart at the closest (nine on the ring, the most), so no two beads' reaches meet, and from
 * the floor no bead can be reached (the lowest is at least 74 above the bird's reach point): every bead needs flight.
 */
export const BEAD_REACH = 60;

export type IbrThingKind = "ibn" | "child" | "saddlebag" | "scroll" | "bead";
export interface IbrThing extends RoomThing {
  kind: IbrThingKind;
  /** For a bead: the stop it stands for, and its place in the ring's order, from 0. */
  stop?: string;
  index?: number;
}

/**
 * Every thing in the inn for a way of playing: Ibn Battuta, the child with the camel, the saddlebag on the high ledge,
 * the scroll on the lectern, and every bead of the stage in the ring's order. A bead's id is its stop ("bead-tangier"),
 * the same either way round.
 */
export function ibrThings(style: RouteStyle, rtl: boolean): IbrThing[] {
  const stops = routeStage(style).stops;
  return [
    { id: "ibn", kind: "ibn", x: IBR_START.ibn, y: 500, reach: 170, name: "ibr_thing_ibn" },
    { id: "child", kind: "child", x: IBR_START.child, y: 520, reach: 140, name: "ibr_thing_child" },
    { id: "saddlebag", kind: "saddlebag", x: IBR_SADDLEBAG.x, y: IBR_SADDLEBAG.y, reach: 70, name: "ibr_thing_saddlebag" },
    { id: "scroll", kind: "scroll", x: IBR_LECTERN.x, y: IBR_LECTERN.scroll, reach: 100, name: "ibr_thing_scroll" },
    ...stops.map((stop, index): IbrThing => {
      const at = beadAt(stops.length, index, rtl);
      return { id: `bead-${stop}`, kind: "bead", stop, index, x: at.x, y: at.y, reach: BEAD_REACH, name: "ib_bead" };
    }),
  ];
}

/** Where the bird stands to touch a thing: beside a person, before the saddlebag and the lectern, and on a bead's own peg right under it. */
export const IBR_APPROACH: Record<IbrThingKind, number> = { ibn: -110, child: -90, saddlebag: -40, scroll: -40, bead: 0 };

/** The layout as the engine takes it. The perches are those of the explorer's stage; the scene keeps only the pegs of its own stage (ibrRoom). */
export const IBR_LAYOUT: RoomLayout = {
  world: IBR_WORLD,
  room: ibrRoom(8),
  door: IBR_DOOR,
  start: { hudhud: IBR_START.hudhud, keeper: IBR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-battuta-room-cosmetics",
};

export type IbrSpeaker = "hudhud" | "keeper" | "ibn" | "child" | "narrator";
/**
 * The inn's talk. The lines are the road's quest's own (ib_*), said by the same speakers as on its page; three are new
 * and only greet, thank and say goodbye (ibr_ibn_hello, ibr_thanks, ibr_ibn_bye). The flags a node sets are the quest's
 * own (sim/route.ts): asking when he set out and who wrote his journey down is Curiosity, answering the child kindly is
 * Kindness (either answer is `answered`, as on the page), and in the saddlebag is the feather.
 */
export const IBR_SCRIPTS: Record<string, Script<IbrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ib_intro_1", mood: "alarm" }, { who: "ibn", key: "ib_intro_2", mood: "think" }] } } },
  ibn: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "ibn", key: "ibr_ibn_hello", mood: "glad" }], choices: [{ key: "ib_ask_left", to: "left", deeper: true }, { key: "ib_ask_written", to: "written", deeper: true }, { key: "ibr_thanks", to: "bye" }] },
      left: { lines: [{ who: "narrator", key: "ib_left_1", mood: "think" }], set: ["askedLeft"], choices: [{ key: "ib_ask_written", to: "written", deeper: true }, { key: "ibr_thanks", to: "bye" }] },
      written: { lines: [{ who: "narrator", key: "ib_written_1", mood: "think" }], set: ["askedWritten"], choices: [{ key: "ib_ask_left", to: "left", deeper: true }, { key: "ibr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "ibn", key: "ibr_ibn_bye", mood: "glad" }] },
    },
  },
  child: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "child", key: "ib_child_1", mood: "think" }], choices: [{ key: "ib_child_kind", to: "kind" }, { key: "ib_child_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "ib_child_kind", mood: "glad" }, { who: "child", key: "ib_child_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "ib_child_blunt", mood: "think" }, { who: "child", key: "ib_child_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the child says again what the answer brought.
  childKind: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "ib_child_kind_r", mood: "glad" }] } } },
  childBlunt: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "ib_child_blunt_r", mood: "think" }] } } },
  saddlebag: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ib_feather_1", mood: "glad" }] } } },
  saddlebagAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ib_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ib_done_1", mood: "glad" }] } } },
};
