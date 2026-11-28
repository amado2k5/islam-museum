// The paper workshop of Samarkand as data: the thirteenth and last room of the journey on the room engine
// (scenes/room.ts), asked for by the founder on 27 November 2026 (every scene a complete room; continue all the remaining
// work). The paper of Samarkand is played in it: its rules, the three ways of playing, the words and the history are the
// page quest's (content/paper.ts, sim/paper.ts over sim/chainquest.ts), unchanged; only where and how it is played is new.
// Every line of dialogue is a key of the string tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the paper quest already says (pp_story_1, pp_how_1, pp_note_2 and
//                        pp_note_3): an old report, handed down and not a proved beginning, of Chinese craftsmen taken
//                        in a battle near the Talas in 751 who taught the people of Samarkand to make paper from rags; the
//                        recipe from rags to a polished sheet; the Chinese invented paper, and the Islamic world received
//                        the craft, adapted it and spread it
//   invented for play    the workshop itself (a papermaker's workshop by day with one window, a tall rack of plain moulds
//                        and stacked blank sheets, a basket of rags, a stone vat of water, and sheets drying on a wall), the
//                        long workbench on which the places of the row stand (plain wooden slots numbered by dots, each
//                        holding a card drawn by the page quest's own code), the plain bell at the end of the bench that
//                        is touched to make a sheet, the spare mould on top of the rack the feather is caught in, the
//                        papermaker and the child who helps (both already invented in the quest), and three new spoken
//                        lines (review ledger, HR-HH-58). No historical figure is in this scene. Nothing in it is
//                        written in any script, and no building in it is claimed to be a real mill.
import { paperPuzzle } from "./paper";
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { PaperStyle } from "../sim/paper";
import type { Room } from "../sim/move";
import { boxWidth, PAPER_ART } from "../art/paper";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other rooms; as wide. */
export const SMR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/** The one window of the workshop, behind the papermaker: daylight. */
export const SMR_WINDOW = { x: 640, y: 80, w: 160, h: 280 } as const;
/** The tall rack of plain moulds and stacked blank sheets: its two shelves and its top are perches; the spare mould lies on its top. */
export const SMR_RACK = { x: 330, w: 190, top: 150, shelves: [290, 420] } as const;
/** The spare mould on top of the tall rack, with the feather caught in it. */
export const SMR_MOULD = { x: 425, y: 120 } as const;
/** The stone vat of water and the basket of rags: things to look at, not to touch. */
export const SMR_VAT = { x: 548, w: 150, h: 104 } as const;
export const SMR_BASKET = { x: 846, w: 64, h: 52 } as const;
/** The wall where sheets hang to dry, by the far end. */
export const SMR_DRYING = { x: 1960, y: 110, w: 250, h: 230 } as const;
/** The long workbench: its top is a perch, the one the bird stands on to reach the cards. */
export const SMR_BENCH = { x: 920, w: 1000, top: 500 } as const;
/** The cards stand upright in their slots on the bench, drawn at this size of the page's own card, their middles this high. */
export const SMR_CARD = { k: 0.72, y: 420, cx: 1380, gap: 32 } as const;
/** The slots stand on the bench's top, this tall; a card's foot sits in its slot's groove. */
export const SMR_SLOT_H = 30;
/** How high above a card's middle the material is drawn once the work has passed it: the page's own distance, at the cards' size. */
export const SMR_MATERIAL_UP = (PAPER_ART.y - PAPER_ART.matY) * SMR_CARD.k;
/** The plain bell at the end of the bench: a thing on the bench, touched to make a sheet. */
export const SMR_BELL = { x: 1856, y: 420 } as const;
export const SMR_START = { hudhud: 250, keeper: 106, maker: 760, child: 2190 } as const;

export const SMR_ROOM: Room = {
  bounds: { x: 24, y: 24, w: SMR_WORLD.width - 48, h: SMR_WORLD.height },
  floor: SMR_WORLD.floor,
  perches: [
    { x: SMR_RACK.x - 10, y: SMR_RACK.top, w: SMR_RACK.w + 20, h: 12 }, // the top of the tall rack
    ...SMR_RACK.shelves.map((y) => ({ x: SMR_RACK.x, y, w: SMR_RACK.w, h: 12 })), // its shelves
    { x: SMR_BENCH.x, y: SMR_BENCH.top, w: SMR_BENCH.w, h: 12 }, // the bench's top
  ],
};

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const SMR_DOOR = { x: 2342, y: SMR_WORLD.floor - 70, reach: 110 } as const;

/** A card's size on the bench, for a row of n cards: the page's own card (its width depends on how many there are), drawn at SMR_CARD.k. */
export const cardSize = (n: number): { w: number; h: number } => ({ w: boxWidth(n) * SMR_CARD.k, h: PAPER_ART.boxH * SMR_CARD.k });
/** How far apart the places stand for a row of n cards. */
export const pitchOf = (n: number): number => cardSize(n).w + SMR_CARD.gap;
/** Where place p of n stands on the bench: the first on the left, or on the right on a page read right to left, as on the page. */
export function placeAt(p: number, n: number, rtl: boolean): { x: number; y: number } {
  const c = rtl ? n - 1 - p : p;
  return { x: SMR_CARD.cx + (c - (n - 1) / 2) * pitchOf(n), y: SMR_CARD.y };
}

export type SmrThingKind = "maker" | "child" | "mould" | "bell" | "place";
export interface SmrThing extends RoomThing {
  kind: SmrThingKind;
  /** For a place on the bench: its number, from 0. */
  place?: number;
}

/**
 * Every thing in the workshop, for a way of playing: the papermaker, the child, the spare mould, the bell, and a place on
 * the bench for every card of the row. The places lie where the reading direction puts them; their ids are by place
 * ("place-0" is the first), the same either way.
 */
export function smrThings(style: PaperStyle, rtl: boolean): SmrThing[] {
  const n = paperPuzzle(style).places.length;
  return [
    { id: "maker", kind: "maker", x: SMR_START.maker, y: 500, reach: 170, name: "smr_thing_maker" },
    { id: "child", kind: "child", x: SMR_START.child, y: 520, reach: 140, name: "smr_thing_child" },
    { id: "mould", kind: "mould", x: SMR_MOULD.x, y: SMR_MOULD.y, reach: 80, name: "smr_thing_mould" },
    { id: "bell", kind: "bell", x: SMR_BELL.x, y: SMR_BELL.y, reach: 70, name: "smr_thing_bell" },
    ...Array.from({ length: n }, (_, p): SmrThing => {
      const at = placeAt(p, n, rtl);
      return { id: `place-${p}`, kind: "place", place: p, x: at.x, y: at.y, reach: 70, name: "smr_thing_place" };
    }),
  ];
}

/** Where the bird stands to touch a thing: beside a person, and just before a card, the bell or the spare mould. */
export const SMR_APPROACH: Record<SmrThingKind, number> = { maker: -110, child: -90, mould: -50, bell: -40, place: -40 };

export const SMR_LAYOUT: RoomLayout = {
  world: SMR_WORLD,
  room: SMR_ROOM,
  door: SMR_DOOR,
  start: { hudhud: SMR_START.hudhud, keeper: SMR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-samarkand-room-cosmetics",
};

export type SmrSpeaker = "hudhud" | "keeper" | "maker" | "child" | "narrator";
/**
 * The workshop's talk. The lines are the paper quest's own (pp_*), said by the same speakers as on its page; three are
 * new and only greet, thank and say goodbye (smr_maker_hello, smr_thanks, smr_maker_bye). The flags a node sets are the
 * quest's own (sim/paper.ts): asking about the old report and about how paper was made is Curiosity (the narrator reads
 * the museum's record, as on the page), answering the child kindly is Kindness (either answer is `answered`, as on the
 * page), and caught in the spare mould is the feather.
 */
export const SMR_SCRIPTS: Record<string, Script<SmrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "pp_intro_1", mood: "alarm" }, { who: "maker", key: "pp_intro_2", mood: "think" }] } } },
  maker: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "maker", key: "smr_maker_hello", mood: "glad" }], choices: [{ key: "pp_ask_story", to: "story", deeper: true }, { key: "pp_ask_how", to: "how", deeper: true }, { key: "smr_thanks", to: "bye" }] },
      story: { lines: [{ who: "narrator", key: "pp_story_1", mood: "think" }], set: ["askedStory"], choices: [{ key: "pp_ask_how", to: "how", deeper: true }, { key: "smr_thanks", to: "bye" }] },
      how: { lines: [{ who: "narrator", key: "pp_how_1", mood: "think" }], set: ["askedHow"], choices: [{ key: "pp_ask_story", to: "story", deeper: true }, { key: "smr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "maker", key: "smr_maker_bye", mood: "glad" }] },
    },
  },
  child: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "child", key: "pp_child_1", mood: "think" }], choices: [{ key: "pp_child_kind", to: "kind" }, { key: "pp_child_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "pp_child_kind", mood: "glad" }, { who: "child", key: "pp_child_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "pp_child_blunt", mood: "think" }, { who: "child", key: "pp_child_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the child says again what the answer brought.
  childKind: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "pp_child_kind_r", mood: "glad" }] } } },
  childBlunt: { start: "1", nodes: { "1": { lines: [{ who: "child", key: "pp_child_blunt_r", mood: "think" }] } } },
  mould: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "pp_feather_1", mood: "glad" }] } } },
  mouldAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "pp_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "pp_done_1", mood: "glad" }] } } },
};
