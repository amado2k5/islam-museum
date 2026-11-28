// The Alhambra's court as data: the twelfth room on the room engine (scenes/room.ts), after Ibn al-Haytham's workshop and
// the rooms of al-Jazari, al-Tusi, al-Khwarizmi, al-Kindi, al-Idrisi, al-Razi, Karima al-Marwaziyya, Ibn Battuta, the
// coffee room and al-Jahiz, asked for by the founder on 27 November 2026 (every scene a complete room, its puzzle played
// in the room; continue all the remaining work). The channels of the dry fountain are turned in it: their rules, the
// three grids, the three ways of playing, the words and the history are the page quest's (content/channels.ts,
// sim/channels.ts), unchanged; only where and how they are played is new. Every line of dialogue is a key of the string
// tables.
//
// History and invention, kept apart on purpose:
//   from museum records  nothing beyond what the channels' quest already says (ah_water_1, ah_court_1 and the notes
//                        ah_note_1 to ah_note_4): work on the Alhambra began with an aqueduct from the mountains, and the
//                        record's words about two of its courts, the stone lions "probably" from an older palace among them
//   invented for play    the court itself (an open court at evening: plain arches, a low wall, a paved floor), the great
//                        stone panel seen at an angle in which the quest's grid of channel pieces is set, the stone
//                        ledges along its rows the bird stands on, the spout high on the wall with its plain pipe, the
//                        stone ledge under it and the plain sluice lever on it (Challenge), the feather on the rim of the
//                        dry fountain, the keeper of the water and the girl who sweeps the court drawn as cut-outs in
//                        code (both already invented people of the quest), and three new spoken lines (review ledger,
//                        HR-HH-57). The grid is the quest's, and it is not the plan of the Alhambra or of its waterworks.
// On purpose there is no feature that could be taken for the real Alhambra: no muqarnas, no inscription, no stone lion, no
// tower and no named court; the arches are plain, and nothing of any script is drawn. The basins are the page's plain round
// basin and plain long basin, drawn on their own places of the grid.
import type { Script } from "../narrative/dialogue";
import type { RoomLayout, RoomThing } from "../scenes/room";
import type { Room } from "../sim/move";
import type { ChannelsStyle } from "../sim/channels";
import { channelsGrid } from "./channels";
import { ASSIST } from "./workshop";

/** The same height, floor and view as the other eleven rooms; as wide. */
export const AHR_WORLD = { width: 2400, height: 720, floor: 624, view: { width: 1280, height: 720 } } as const;

/**
 * The great stone panel, seen at an angle: its face runs from a back edge high up to a front edge low down, wider at the
 * front, and its middle is at `cx`. The pieces are set in it in rows; along the foot of each row runs a stone ledge, a
 * perch the bird stands on to reach that row.
 */
export const AHR_PANEL = { cx: 1240, back: 112, front: 612, backHalf: 320, frontHalf: 380 } as const;
/**
 * A piece is drawn `AHR_TILE` game pixels square, and the places are `AHR_PITCH` apart across a row and from row to row.
 * The gap between two tiles (12) is the page's own, so that a channel that leaves a place meets the next place's channel
 * in the middle of the gap, as on the page, across a row and from row to row, and on a page read right to left as well.
 */
export const AHR_TILE = 84;
export const AHR_PITCH = 96;
/** The page's gap between tiles, and so how far a groove reaches past its tile's edge (half the gap). */
export const AHR_GAP = AHR_PITCH - AHR_TILE;
/** The five rows the panel has room for, from the back: the middle of each. A grid of fewer rows uses the rows at the front. */
export const AHR_LEVELS = [164, 260, 356, 452, 548] as const;
/** The ledge along the foot of a row: a perch in the gap just below the row's pieces. */
export const ledgeY = (y: number): number => y + AHR_PITCH / 2;
/** How wide a ledge is either side of the panel's middle: room for five pieces and the fountain's rim beyond them. */
export const LEDGE_HALF = Math.round(2.5 * AHR_PITCH + 80);
/** The spout of the aqueduct, high on the wall at the panel's near end (the end of the grid's first column), a plain stone block. */
export const AHR_SPOUT = { x: 800, y: 112 } as const;
/** The stone ledge under the spout (a perch) and the plain sluice lever on it, in Challenge. */
export const AHR_LEDGE = { x: 680, w: 100, y: 236 } as const;
export const AHR_LEVER = { x: 730, y: 206 } as const;
export const AHR_START = { hudhud: 250, keeper: 106, waterkeeper: 560, girl: 1820 } as const;

/** The door at the far end: the same door, in the same place, as the other rooms'. */
export const AHR_DOOR = { x: 2342, y: AHR_WORLD.floor - 70, reach: 110 } as const;

/** A point's x on the court's own plan, mirrored about the panel's middle on a page read right to left. */
export const mirrorX = (x: number, rtl: boolean): number => (rtl ? 2 * AHR_PANEL.cx - x : x);

/** The court's floor, walls and perches: the ledges along the panel's five rows, and the ledge under the spout (at the end the grid's first column is on). */
export function ahrRoom(rtl: boolean): Room {
  const lx = rtl ? 2 * AHR_PANEL.cx - AHR_LEDGE.x - AHR_LEDGE.w : AHR_LEDGE.x;
  return {
    bounds: { x: 24, y: 24, w: AHR_WORLD.width - 48, h: AHR_WORLD.height },
    floor: AHR_WORLD.floor,
    perches: [
      ...AHR_LEVELS.map((y) => ({ x: AHR_PANEL.cx - LEDGE_HALF, y: ledgeY(y), w: 2 * LEDGE_HALF, h: 12 })), // the ledges along the panel's rows
      { x: lx, y: AHR_LEDGE.y, w: AHR_LEDGE.w, h: 12 }, // the ledge under the spout
    ],
  };
}

/** The y of a grid's row on the panel: a grid of fewer than five rows uses the rows at the front. */
export const rowY = (row: number, rows: number): number => AHR_LEVELS[AHR_LEVELS.length - rows + row]!;
/** Where a place's middle lies on the panel: the first column on the left, or on the right on a page read right to left. */
export function placeAt(p: number, rows: number, cols: number, rtl: boolean): { x: number; y: number } {
  const r = Math.floor(p / cols);
  const c = p % cols;
  const cc = rtl ? cols - 1 - c : c;
  return { x: AHR_PANEL.cx + (cc - (cols - 1) / 2) * AHR_PITCH, y: rowY(r, rows) };
}
/** Where the spout's pipe meets the grid: the middle of the gap on the spout's side of its place, as on the page. */
export function spoutMouth(style: ChannelsStyle, rtl: boolean): { x: number; y: number } {
  const g = channelsGrid(style);
  const at = placeAt(g.spout.cell, g.rows, g.cols, rtl);
  const out = AHR_TILE / 2 + AHR_GAP / 2;
  const east = rtl ? -1 : 1;
  const d: Record<string, [number, number]> = { n: [0, -1], e: [east, 0], s: [0, 1], w: [-east, 0] };
  const [dx, dy] = d[g.spout.side]!;
  return { x: at.x + dx * out, y: at.y + dy * out };
}
/** The rim of the dry fountain, where the feather lies: beside the fountain's place, on the side away from the grid (the fountain is in the grid's last column in every way of playing). */
export function rimSpot(style: ChannelsStyle, rtl: boolean): { x: number; y: number } {
  const g = channelsGrid(style);
  const f = g.basins.find((b) => b.kind === "fountain")!;
  const at = placeAt(f.cell, g.rows, g.cols, rtl);
  return { x: at.x + (rtl ? -1 : 1) * (AHR_TILE / 2 + 40), y: at.y };
}

/**
 * How near the bird must come to touch a thing, chosen generous for a child but never so wide that two things' reaches
 * meet where the bird stands to touch them, nor two things' reaches overlap at all. A piece: 44 (standing on the ledge under its row, anywhere within 39 pixels
 * of its middle touches it; the places are 96 apart, so between two pieces is a narrow stretch that touches neither,
 * never both; the rows are 96 apart, so the row above or below is never in reach). The rim of the fountain: 36 (it lies
 * 82 from the fountain's middle, more than the two reaches together). The sluice lever: 40. From the floor nothing on the panel can be touched (the front row's middle is 46 from the bird's touch point
 * on the floor): every piece, the rim and the lever needs at least a hop up onto a ledge. A test proves all of this.
 */
export const REACH = { piece: 44, rim: 36, lever: 40 } as const;

export type AhrThingKind = "waterkeeper" | "girl" | "rim" | "sluice" | "place";
export interface AhrThing extends RoomThing {
  kind: AhrThingKind;
  /** For a place on the panel: its number, counted row by row from the first column (0 is the first). */
  place?: number;
}

/**
 * Every thing in the court, for a way of playing: the keeper of the water, the girl who sweeps the court, the rim of the
 * dry fountain with the feather, the sluice lever (only in Challenge, the one way of playing in which the sluice is
 * opened), and a place on the panel for every piece of the grid. The places lie where the reading direction puts them;
 * their ids are by place ("place-0" is the first), the same either way.
 */
export function ahrThings(style: ChannelsStyle, rtl: boolean): AhrThing[] {
  const g = channelsGrid(style);
  const n = g.rows * g.cols;
  return [
    { id: "waterkeeper", kind: "waterkeeper", x: AHR_START.waterkeeper, y: 500, reach: 170, name: "ahr_thing_keeper" },
    { id: "girl", kind: "girl", x: AHR_START.girl, y: 520, reach: 140, name: "ahr_thing_girl" },
    { id: "rim", kind: "rim", ...rimSpot(style, rtl), reach: REACH.rim, name: "ahr_thing_rim" },
    ...(style === "challenge" ? [{ id: "sluice", kind: "sluice" as const, x: mirrorX(AHR_LEVER.x, rtl), y: AHR_LEVER.y, reach: REACH.lever, name: "ahr_thing_sluice" }] : []),
    ...Array.from({ length: n }, (_, p): AhrThing => ({ id: `place-${p}`, kind: "place", place: p, ...placeAt(p, g.rows, g.cols, rtl), reach: REACH.piece, name: "ahr_thing_piece" })),
  ];
}

/** Where the bird stands to touch a thing: beside a person (on the keeper's far side from the panel), just before a piece (so that the bird does not hide it), right at the rim and the lever. */
export const AHR_APPROACH: Record<AhrThingKind, number> = { waterkeeper: -110, girl: -90, rim: 0, sluice: 0, place: -30 };

/** The layout as the engine takes it; the scene lays the perches out again for the reading direction it is built for. */
export const AHR_LAYOUT: RoomLayout = {
  world: AHR_WORLD,
  room: ahrRoom(false),
  door: AHR_DOOR,
  start: { hudhud: AHR_START.hudhud, keeper: AHR_START.keeper },
  assist: ASSIST,
  seed: "hudhud-alhambra-room-cosmetics",
};

/** The speakers of the court's talk: Hudhud, the keeper of the water (the engine's "keeper" is the explorer, so he is the page's "voice"), the girl who sweeps the court, and the museum's record. */
export type AhrSpeaker = "hudhud" | "voice" | "kid" | "narrator";
/**
 * The court's talk. The lines are the channels' quest's own (ah_*), said by the same speakers as on its page (the keeper of
 * the water says the page's second opening line; the answers to the two questions are the museum's record's, as on the
 * page); three are new and only greet, thank and say goodbye (ahr_keeper_hello, ahr_thanks, ahr_keeper_bye). The flags a
 * node sets are the quest's own (sim/channels.ts): asking about the water and about the courts is Curiosity, answering the
 * girl kindly is Kindness (either answer is `answered`, as on the page), and on the rim of the dry fountain is the feather.
 */
export const AHR_SCRIPTS: Record<string, Script<AhrSpeaker>> = {
  intro: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ah_intro_1", mood: "alarm" }, { who: "voice", key: "ah_intro_2", mood: "think" }] } } },
  voice: {
    start: "hello",
    nodes: {
      hello: { lines: [{ who: "voice", key: "ahr_keeper_hello", mood: "glad" }], choices: [{ key: "ah_ask_water", to: "water", deeper: true }, { key: "ah_ask_courts", to: "courts", deeper: true }, { key: "ahr_thanks", to: "bye" }] },
      water: { lines: [{ who: "narrator", key: "ah_water_1", mood: "think" }], set: ["askedWater"], choices: [{ key: "ah_ask_courts", to: "courts", deeper: true }, { key: "ahr_thanks", to: "bye" }] },
      courts: { lines: [{ who: "narrator", key: "ah_court_1", mood: "think" }], set: ["askedCourts"], choices: [{ key: "ah_ask_water", to: "water", deeper: true }, { key: "ahr_thanks", to: "bye" }] },
      bye: { lines: [{ who: "voice", key: "ahr_keeper_bye", mood: "glad" }] },
    },
  },
  kid: {
    start: "1",
    nodes: {
      "1": { lines: [{ who: "kid", key: "ah_girl_1", mood: "think" }], choices: [{ key: "ah_girl_kind", to: "kind" }, { key: "ah_girl_blunt", to: "blunt" }] },
      kind: { lines: [{ who: "hudhud", key: "ah_girl_kind", mood: "glad" }, { who: "kid", key: "ah_girl_kind_r", mood: "glad" }], set: ["kind", "answered"] },
      blunt: { lines: [{ who: "hudhud", key: "ah_girl_blunt", mood: "think" }, { who: "kid", key: "ah_girl_blunt_r", mood: "think" }], set: ["answered"] },
    },
  },
  // Once answered, the girl says again what the answer brought.
  kidKind: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "ah_girl_kind_r", mood: "glad" }] } } },
  kidBlunt: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "ah_girl_blunt_r", mood: "think" }] } } },
  rim: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ah_feather_1", mood: "glad" }] } } },
  rimAgain: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ah_feather_again", mood: "think" }] } } },
  done: { start: "1", nodes: { "1": { lines: [{ who: "hudhud", key: "ah_done_1", mood: "glad" }] } } },
};
