// Al-Razi's study as data: the seventh room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop and the
// rooms of al-Jazari, al-Tusi, al-Khwarizmi, al-Kindi and al-Idrisi, asked for by the founder on 27 November 2026 (every
// scene a complete room with its own figure; continue all the remaining work). The loose leaves are played in it: their
// rules, the three ways of playing, the words and the history are the page quest's (content/leaves.ts, sim/leaves.ts over
// sim/chainquest.ts), unchanged; only where and how they are played is new. Every line of dialogue is a key of the string
// tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the loose leaves' quest already says (rz_notes_1, rz_own_1, rz_note_2 and
//                        rz_note_3): his notebooks were edited as al-Hawi, arranged from head to toe, with what he observed
//                        himself usually closing the sections; he headed the hospital of Rayy and then held the same post
//                        in Baghdad
//   invented for play    the study itself (a quiet room with tall windows, a tall bookcase of books and bound notebooks, a
//                        low cupboard of bound notebooks), the long desk on which the places of the notebook stand in a row
//                        (plain wooden slots numbered by dots, each holding a leaf drawn by the page quest's own code), the
//                        plain binding frame with a spool of thread at the end of the desk that is touched to bind the
//                        notebook, the bundle of loose leaves on top of the bookcase the feather hides between, the child
//                        who helps (already invented in the quest), three new spoken lines, and al-Razi's figure, a
//                        cut-out drawn in code that is not a likeness (review ledger, HR-HH-52). The quest's own rule
//                        stands absolutely: nothing medical is drawn or said. No bottle, jar, instrument, patient or bed is
//                        in the room; it is a place of books and notebooks, and nothing in it is written.
import { leavesPuzzle } from "./leaves";
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { LeavesStyle } from "../sim/leaves";
import type { Room } from "../sim/move";
import { boxWidth, PAPER_ART } from "../art/paper";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other six rooms; as wide. */
export const RZR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The tall windows of the study: one where the bird comes in, one behind al-Razi, and one near the far end. */
export const RZR_WINDOWS = [
  { x: 80, y: 80, w: 150, h: 300 },
  { x: 680, y: 80, w: 150, h: 300 },
  { x: 1990, y: 80, w: 150, h: 300 },
] as const;
/** The tall bookcase of books and bound notebooks: its two shelves and its top are perches; the bundle of loose leaves lies on its top. */
export const RZR_SHELF = { x: 330, w: 190, top: 150, shelves: [290, 420] } as const;
/** The bundle of loose leaves on top of the tall bookcase, with the feather between its leaves. */
export const RZR_BUNDLE = { x: 425, y: 120 } as const;
/** The long desk: its top is a perch, the one the bird stands on to reach the leaves. */
export const RZR_DESK = { x: 920, w: 1000, top: 500 } as const;
/** The leaves stand upright in their slots on the desk, drawn at this size of the page's own leaf, their middles this high. */
export const RZR_LEAF = { k: 0.72, y: 420, cx: 1380, gap: 32 } as const;
/** The slots stand on the desk's top, this tall; a leaf's foot sits in its slot's groove. */
export const RZR_SLOT_H = 30;
/** The binding frame at the end of the desk, with its spool of thread: a thing on the desk, touched to bind the notebook. */
export const RZR_FRAME = { x: 1856, y: 420 } as const;
export const RZR_START = { hudhud: 250, keeper: 106, razi: 760, child: 2190 } as const;

export const RZR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: RZR_WORLD.width - 48, h: RZR_WORLD.height },
  floor: RZR_WORLD.floor,
  perches: [
    { x: RZR_SHELF.x - 10, y: RZR_SHELF.top, w: RZR_SHELF.w + 20, h: 12 }, // the top of the tall bookcase
    ...RZR_SHELF.shelves.map((y) => ({ x: RZR_SHELF.x, y, w: RZR_SHELF.w, h: 12 })), // its shelves
    { x: RZR_DESK.x, y: RZR_DESK.top, w: RZR_DESK.w, h: 12 }, // the desk's top
  ],
};

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const RZR_DOOR = { x: 2342, y: RZR_WORLD.floor - 70, reach: 110 } as const;

/** A leaf's size on the desk, for a row of n leaves: the page's own leaf (its width depends on how many there are), drawn at RZR_LEAF.k. */
export const leafSize = (n: number): { w: number; h: number } => ({ w: boxWidth(n) * RZR_LEAF.k, h: PAPER_ART.boxH * RZR_LEAF.k });
/** How far apart the places stand for a row of n leaves. */
export const pitchOf = (n: number): number => leafSize(n).w + RZR_LEAF.gap;
/** Where place p of n stands on the desk: the first on the left, or on the right on a page read right to left, as on the page. */
export function placeAt(p: number, n: number, rtl: boolean): { x: number; y: number } {
  const c = rtl ? n - 1 - p : p;
  return { x: RZR_LEAF.cx + (c - (n - 1) / 2) * pitchOf(n), y: RZR_LEAF.y };
}

export type RzrThingKind = "razi" | "child" | "bundle" | "frame" | "place";
export interface RzrThing extends RoomThing {
  kind: RzrThingKind;
  /** For a place on the desk: its number, from 0. */
  place?: number;
}

/**
 * Every thing in the study, for a way of playing: al-Razi, the child, the bundle of loose leaves, the binding frame, and a
 * place on the desk for every leaf of the row. The places lie where the reading direction puts them; their ids are by
 * place ("place-0" is the first), the same either way.
 */
export function rzrThings(style: LeavesStyle, rtl: boolean): RzrThing[] {
  const n = leavesPuzzle(style).places.length;
  return [
    { id: "razi", kind: "razi", x: RZR_START.razi, y: 500, reach: 170, name: "rzr_thing_razi" },
    { id: "child", kind: "child", x: RZR_START.child, y: 520, reach: 140, name: "rzr_thing_child" },
    { id: "bundle", kind: "bundle", x: RZR_BUNDLE.x, y: RZR_BUNDLE.y, reach: 80, name: "rzr_thing_bundle" },
    { id: "frame", kind: "frame", x: RZR_FRAME.x, y: RZR_FRAME.y, reach: 70, name: "rzr_thing_frame" },
    ...Array.from({ length: n }, (_, p): RzrThing => {
      const at = placeAt(p, n, rtl);
      return { id: `place-${p}`, kind: "place", place: p, x: at.x, y: at.y, reach: 70, name: "rzr_thing_place" };
    }),
  ];
}

/** Where the bird stands to touch a thing: beside a person, and just before a leaf, the frame or the bundle. */
export const RZR_APPROACH: Record<RzrThingKind, number> = { razi: -110, child: -90, bundle: -50, frame: -40, place: -40 };

export const RZR_LAYOUT: RoomLayout = {
  world: RZR_WORLD,
  room: RZR_ROOM,
  door: RZR_DOOR,
  start: { hudhud: RZR_START.hudhud, keeper: RZR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-razi-room-cosmetics",
};

export type RzrSpeaker = "hudhud" | "keeper" | "razi" | "child" | "narrator";
/**
 * The study's talk. The lines are the loose leaves' own (rz_*), said by the same speakers as on their page; three are new
 * and only greet, thank and say goodbye (rzr_razi_hello, rzr_thanks, rzr_razi_bye). The flags a node sets are the quest's
 * own (sim/leaves.ts): asking about his notebooks and about what he saw himself is Curiosity, answering the child kindly
 * is Kindness (either answer is `answered`, as on the page), and between the leaves of the bundle is the feather.
 */
export const RZR_SCRIPTS: Record<string, Script<RzrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "rz_intro_1", mood: "alarm" }, { who: "razi", key: "rz_intro_2", mood: "think" }] } } },
  razi: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "razi", key: "rzr_razi_hello", mood: "glad" }], choices: [{ key: "rz_ask_notes", to: "notes", deeper: true }, { key: "rz_ask_own", to: "own", deeper: true }, { key: "rzr_thanks", to: "bye" }] },
      notes: { lines: [{ who: "narrator", key: "rz_notes_1", mood: "think" }], set: ["askedNotes"], choices: [{ key: "rz_ask_own", to: "own", deeper: true }, { key: "rzr_thanks", to: "bye" }] },
      own: { lines: [{ who: "narrator", key: "rz_own_1", mood: "think" }], set: ["askedOwn"], choices: [{ key: "rz_ask_notes", to: "notes", deeper: true }, { key: "rzr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "razi", key: "rzr_razi_bye", mood: "glad" }] },
    },
  },
  child: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "child", key: "rz_child_1", mood: "think" }], choices: [{ key: "rz_child_kind", to: "kind" }, { key: "rz_child_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "rz_child_kind", mood: "glad" }, { who: "child", key: "rz_child_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "rz_child_blunt", mood: "think" }, { who: "child", key: "rz_child_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the child says again what the answer brought.
  childKind: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "rz_child_kind_r", mood: "glad" }] } } },
  childBlunt: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "rz_child_blunt_r", mood: "think" }] } } },
  bundle: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "rz_feather_1", mood: "glad" }] } } },
  bundleAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "rz_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "rz_done_1", mood: "glad" }] } } },
};
