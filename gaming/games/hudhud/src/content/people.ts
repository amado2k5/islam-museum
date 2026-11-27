// The people of a room as boxes: where each figure's parts are drawn, so that a test can tell whether two people overlap
// where a room begins (the founder saw the explorer standing in front of a figure and hiding part of it, 27 November
// 2026). Every figure is a cut-out of parts placed in a box (scenes/room.ts places Hudhud and the explorer; each room's
// scene places its figure and its helper the same way). The numbers here are those placements, part by part: the offset
// in the box, the origin and the part's own size in game pixels (the size the painter in art/cast.ts gives it). A test
// (tests/people.gtest.ts) holds these numbers to the painters' sizes and to the scenes' own placements, and checks every
// room's start against them. Pure data: nothing here draws.

/** A part of a figure as its box places it: offset (x, y), origin (ox, oy), and its size. */
export interface PartPlace {
  part: string;
  x: number;
  y: number;
  ox: number;
  oy: number;
  w: number;
  h: number;
}
/** A figure: its parts, the scale of its box, and how far below the floor its box stands. */
export interface Figure {
  parts: readonly PartPlace[];
  scale: number;
  drop: number;
}
/** Hudhud at rest (scenes/room.ts buildBird; the open wing is hidden while the bird stands). */
export const BIRD: Figure = {
  scale: 1.2,
  drop: 0,
  parts: [
    { part: "legs", x: 2, y: 2, ox: 0.5, oy: 1, w: 34, h: 18 },
    { part: "tail", x: -24, y: -36, ox: 1, oy: 0.5, w: 54, h: 30 },
    { part: "body", x: 0, y: -40, ox: 0.5, oy: 0.5, w: 78, h: 62 },
    { part: "wing", x: -6, y: -42, ox: 0.5, oy: 0.5, w: 56, h: 40 },
    { part: "crest", x: 18, y: -80, ox: 0.5, oy: 0.96, w: 74, h: 56 },
    { part: "head", x: 22, y: -68, ox: 24 / 92, oy: 26 / 50, w: 92, h: 50 },
  ],
};
/** The player's explorer (scenes/room.ts buildKeeper). */
export const EXPLORER: Figure = {
  scale: 0.8,
  drop: 0,
  parts: [
    { part: "leg", x: -14, y: -68, ox: 0.5, oy: 0, w: 30, h: 70 },
    { part: "leg", x: 14, y: -68, ox: 0.5, oy: 0, w: 30, h: 70 },
    { part: "satchel", x: -30, y: -118, ox: 0.5, oy: 0.5, w: 50, h: 56 },
    { part: "body", x: 0, y: -180, ox: 0.5, oy: 0, w: 96, h: 118 },
    { part: "arm", x: 18, y: -170, ox: 0.5, oy: 0.06, w: 28, h: 78 },
    { part: "head", x: 2, y: -212, ox: 0.5, oy: 0.54, w: 96, h: 104 },
  ],
};
/** A room's figure: the scholar's cut-out (each room's scene, the sage's box). */
export const SCHOLAR: Figure = {
  scale: 0.86,
  drop: 0,
  parts: [
    { part: "body", x: 0, y: 2, ox: 0.5, oy: 1, w: 210, h: 270 },
    { part: "arm", x: 62, y: -236, ox: 0.5, oy: 0.05, w: 60, h: 140 },
    { part: "head", x: 4, y: -292, ox: 0.5, oy: 0.58, w: 150, h: 170 },
  ],
};
/** A room's helper: the explorer's cut-out without the satchel, smaller, standing a little lower (each room's scene). */
export const HELPER: Figure = {
  scale: 0.74,
  drop: 8,
  parts: EXPLORER.parts.filter((p) => p.part !== "satchel"),
};

export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
/**
 * Where a figure is drawn when its box stands at x on the floor, facing right (1) or left (-1): the smallest box round all
 * its parts. A figure that may face either way at the start is given both, joined.
 */
export function drawnBox(f: Figure, x: number, floor: number, facing: 1 | -1 | "either"): Box {
  if (facing === "either") {
    const a = drawnBox(f, x, floor, 1);
    const b = drawnBox(f, x, floor, -1);
    return { left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom) };
  }
  const xs: number[] = [];
  const ys: number[] = [];
  for (const p of f.parts) {
    const l = p.x - p.ox * p.w;
    const r = l + p.w;
    xs.push(...(facing === 1 ? [l, r] : [-r, -l]));
    const t = p.y - p.oy * p.h;
    ys.push(t, t + p.h);
  }
  const y0 = floor + f.drop;
  return { left: x + Math.min(...xs) * f.scale, right: x + Math.max(...xs) * f.scale, top: y0 + Math.min(...ys) * f.scale, bottom: y0 + Math.max(...ys) * f.scale };
}
/** Two boxes overlap: they share more than an edge. */
export const overlaps = (a: Box, b: Box): boolean => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
