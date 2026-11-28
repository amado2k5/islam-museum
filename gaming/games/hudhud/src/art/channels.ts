// The channels, drawn in code: a grid of stone tiles, each with a groove running from its middle to the sides it is
// open on. A dry groove is empty and dark; a groove with water in it is filled with blue and has pale ripple strokes
// along it, so that the two differ by pattern and not by colour alone. A plain round basin is the fountain and a
// plain long basin is the pool; the spout is a plain block with a pipe. A place where the water spills (an opening
// that faces the edge or a closed side) has drops falling from it and a broken red outline across the opening. There is
// no text in the picture, so the page's own words (in seven languages) say everything it shows. It is a game's
// picture: not the plan of the Alhambra, not its waterworks, and no tower, arch or lion. On a right to left page the
// whole picture is its own mirror image, so that the first column is on the right and the channels still meet across
// every seam.
import { flow, opens, type Basin, type Grid, type Leak, type Side } from "../sim/channels";
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
export const CHANNELS_ART = { w: 1000, h: 520, mx: 96, my: 34, gap: 12 } as const;
export interface ChannelsView {
  grid: Grid;
  basins: readonly Basin[];
  /** The page reads right to left: the first column is on the right. */
  rtl: boolean;
  /** Draw the water and the places it spills (not in the Challenge way of playing until the sluice is opened). */
  showWater: boolean;
  /** How far the water has run: places reached by fewer than this many steps are drawn wet. Infinity draws all of it. */
  fill: number;
  /** The grid is done: the page of the Atlas floats up out of the fountain. */
  done: boolean;
  /** The place turned last, drawn with a gold outline; or null. */
  mark: number | null;
}

/** Where the places lie in the picture's own 1000 by 520 space, before any mirroring: the pitch from one place to the next, the size of a tile, and the top left of the first. */
export function channelsLayout(rows: number, cols: number): { pitch: number; tile: number; x0: number; y0: number } {
  const { w, h, mx, my, gap } = CHANNELS_ART;
  const pitch = Math.floor(Math.min((w - 2 * mx) / cols, (h - 2 * my) / rows));
  return { pitch, tile: pitch - gap, x0: (w - cols * pitch) / 2, y0: (h - rows * pitch) / 2 };
}
/** The top left of a tile, in the picture's own space, before any mirroring. */
export function tileOrigin(p: number, rows: number, cols: number): { x: number; y: number } {
  const { pitch, x0, y0, tile } = channelsLayout(rows, cols);
  const gap = (pitch - tile) / 2;
  return { x: x0 + (p % cols) * pitch + gap, y: y0 + Math.floor(p / cols) * pitch + gap };
}
const VEC: Record<Side, [number, number]> = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
/** The point, in the picture as it is shown (mirrored on a right to left page), where the channel that leaves a place by `side` crosses the middle of the gap to the next place: the next place's channel meets it at the same point. */
export function seamPoint(p: number, side: Side, rows: number, cols: number, rtl: boolean): { x: number; y: number } {
  const o = tileOrigin(p, rows, cols);
  const { tile } = channelsLayout(rows, cols);
  const half = (CHANNELS_ART.gap + 0) / 2;
  const [dx, dy] = VEC[side];
  const x = o.x + tile / 2 + dx * (tile / 2 + half);
  const y = o.y + tile / 2 + dy * (tile / 2 + half);
  return { x: rtl ? CHANNELS_ART.w - x : x, y };
}
/** What lies under a point of the picture, given in its own 1000 by 520 space: a place (0 is the first, counted row by row from the first column, which is on the right when the page reads right to left), or nothing. */
export function channelsHit(x: number, y: number, rows: number, cols: number, rtl: boolean): number | null {
  const px = rtl ? CHANNELS_ART.w - x : x;
  const { tile } = channelsLayout(rows, cols);
  for (let p = 0; p < rows * cols; p++) {
    const o = tileOrigin(p, rows, cols);
    if (px >= o.x && px <= o.x + tile && y >= o.y && y <= o.y + tile) return p;
  }
  return null;
}

const STONE = "#b9ae94";
const STONE_DARK = "#8f8470";
const GROOVE_EDGE = "#5d5342";
const GROOVE_DRY = "#2f271d";
const WATER = "#2f6fd0";
const RIPPLE = "#cfe3ff";
const RED = "#e0463c";
/** The channels' own colours, shared with the Alhambra's court (art/alhambra-room.ts) so that its spout and pipe are the page's stone and water. */
export const CHANNEL_INK = { STONE, STONE_DARK, GROOVE_EDGE, GROOVE_DRY, WATER, RIPPLE, RED } as const;
/** How wide a channel's groove is for a tile of a size: the page's rule, shared with the court. */
export const grooveWidth = (tile: number): number => Math.max(10, Math.round(tile * 0.2));

function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
/** The groove of one tile, in the tile's own space: from its middle to each open side and a little beyond (half the gap), so that it meets the next tile's groove. */
function groove(c: Ctx, sides: Side[], tile: number, wet: boolean, cw: number, half: number): void {
  const m = tile / 2;
  const reach = m + half;
  const draw = (width: number, colour: string, dash: number[]) => {
    c.save();
    c.setLineDash(dash);
    c.lineWidth = width;
    c.strokeStyle = colour;
    c.lineCap = "butt";
    for (const s of sides) {
      const [dx, dy] = VEC[s];
      c.beginPath();
      c.moveTo(m, m);
      c.lineTo(m + dx * reach, m + dy * reach);
      c.stroke();
    }
    c.restore();
  };
  draw(cw + 7, GROOVE_EDGE, []);
  draw(cw, wet ? WATER : GROOVE_DRY, []);
  if (wet) draw(3, RIPPLE, [7, 9]);
  if (sides.length > 0) {
    c.beginPath();
    c.arc(m, m, cw / 2 + 3.5, 0, Math.PI * 2);
    c.fillStyle = GROOVE_EDGE;
    c.fill();
    c.beginPath();
    c.arc(m, m, cw / 2, 0, Math.PI * 2);
    c.fillStyle = wet ? WATER : GROOVE_DRY;
    c.fill();
    if (wet) {
      c.beginPath();
      c.arc(m, m, cw / 4, 0, Math.PI * 2);
      c.strokeStyle = RIPPLE;
      c.lineWidth = 2;
      c.stroke();
    }
  }
}
/** A round basin: a rim, an empty hollow if dry, blue with rings if wet. */
function fountain(c: Ctx, tile: number, wet: boolean): void {
  const m = tile / 2;
  const r = tile * 0.34;
  c.beginPath();
  c.arc(m, m, r + 6, 0, Math.PI * 2);
  c.fillStyle = STONE_DARK;
  c.fill();
  c.lineWidth = 3;
  c.strokeStyle = INK;
  c.stroke();
  c.beginPath();
  c.arc(m, m, r, 0, Math.PI * 2);
  c.fillStyle = wet ? WATER : GROOVE_DRY;
  c.fill();
  if (wet) {
    c.strokeStyle = RIPPLE;
    c.lineWidth = 2.5;
    for (const k of [0.62, 0.32]) {
      c.beginPath();
      c.arc(m, m, r * k, 0, Math.PI * 2);
      c.stroke();
    }
  } else {
    // Dry: a crack across the hollow.
    c.strokeStyle = GROOVE_EDGE;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(m - r * 0.55, m - r * 0.2);
    c.lineTo(m - r * 0.1, m + r * 0.05);
    c.lineTo(m + r * 0.5, m - r * 0.1);
    c.stroke();
  }
}
/** A long basin: a rim, an empty hollow if dry, blue with wavy lines if wet. */
function pool(c: Ctx, tile: number, wet: boolean): void {
  const m = tile / 2;
  const w = tile * 0.84;
  const h = tile * 0.42;
  rounded(c, m - w / 2 - 5, m - h / 2 - 5, w + 10, h + 10, 12);
  c.fillStyle = STONE_DARK;
  c.fill();
  c.lineWidth = 3;
  c.strokeStyle = INK;
  c.stroke();
  rounded(c, m - w / 2, m - h / 2, w, h, 8);
  c.fillStyle = wet ? WATER : GROOVE_DRY;
  c.fill();
  c.strokeStyle = wet ? RIPPLE : GROOVE_EDGE;
  c.lineWidth = 2.5;
  if (wet) {
    for (const dy of [-h * 0.18, h * 0.18]) {
      c.beginPath();
      c.moveTo(m - w * 0.36, m + dy);
      for (let i = 1; i <= 6; i++) c.lineTo(m - w * 0.36 + (w * 0.72 * i) / 6, m + dy + (i % 2 ? -4 : 4));
      c.stroke();
    }
  } else {
    c.beginPath();
    c.moveTo(m - w * 0.3, m + h * 0.1);
    c.lineTo(m - w * 0.05, m - h * 0.1);
    c.lineTo(m + w * 0.3, m + h * 0.08);
    c.stroke();
  }
}
/** Three drops falling out of an opening: from the middle of the opening's side outward. */
function drops(c: Ctx, side: Side, tile: number): void {
  const m = tile / 2;
  const [dx, dy] = VEC[side];
  const px = -dy;
  const py = dx;
  c.save();
  c.fillStyle = WATER;
  c.strokeStyle = RIPPLE;
  c.lineWidth = 1.6;
  [
    [10, -7],
    [21, 6],
    [32, -3],
  ].forEach(([d, lat]) => {
    const x = m + dx * (m + d!) + px * lat!;
    const y = m + dy * (m + d!) + py * lat!;
    // A drop: a round bottom and a point towards the opening.
    c.beginPath();
    c.arc(x, y, 4.6, 0, Math.PI * 2);
    c.moveTo(x - dx * 11, y - dy * 11);
    c.lineTo(x + px * 4.2, y + py * 4.2);
    c.lineTo(x - px * 4.2, y - py * 4.2);
    c.closePath();
    c.fill();
    c.stroke();
  });
  // A broken red outline across the opening, on the tile's edge.
  c.setLineDash([6, 5]);
  c.lineWidth = 4;
  c.strokeStyle = RED;
  c.lineCap = "butt";
  c.beginPath();
  c.moveTo(m + dx * m + px * 22, m + dy * m + py * 22);
  c.lineTo(m + dx * m - px * 22, m + dy * m - py * 22);
  c.stroke();
  c.restore();
}
/** The page of the Atlas floating up out of the fountain: a small parchment with three ink lines, tilted, with a glow. */
function page(c: Ctx, tile: number): void {
  const m = tile / 2;
  c.save();
  c.translate(m + 4, m - tile * 0.46);
  c.rotate(-0.14);
  c.shadowColor = PAL.goldLight;
  c.shadowBlur = 16;
  rounded(c, -18, -23, 36, 46, 4);
  c.fillStyle = PAL.parchment;
  c.fill();
  c.shadowBlur = 0;
  c.lineWidth = 2.5;
  c.strokeStyle = PAL.woodDark;
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 2;
  for (const y of [-10, 0, 10]) {
    c.beginPath();
    c.moveTo(-10, y);
    c.lineTo(10, y);
    c.stroke();
  }
  c.restore();
}
/** A plain spout: a stone block outside the tile with a pipe running to it, on `side`, with water in the pipe if the sluice is open. */
function spout(c: Ctx, side: Side, tile: number, cw: number, wet: boolean, half: number): void {
  const m = tile / 2;
  const [dx, dy] = VEC[side];
  const len = CHANNELS_ART.mx - 30;
  c.save();
  c.translate(m + dx * (m + half), m + dy * (m + half));
  // The pipe: from the tile's edge outward.
  c.lineCap = "butt";
  c.lineWidth = cw + 7;
  c.strokeStyle = GROOVE_EDGE;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(dx * len, dy * len);
  c.stroke();
  c.lineWidth = cw;
  c.strokeStyle = wet ? WATER : GROOVE_DRY;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(dx * len, dy * len);
  c.stroke();
  if (wet) {
    c.setLineDash([7, 9]);
    c.lineWidth = 3;
    c.strokeStyle = RIPPLE;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(dx * len, dy * len);
    c.stroke();
    c.setLineDash([]);
  }
  // The block at the far end of the pipe: its length along the pipe is `bw`, across it `bh`.
  const bw = 26;
  const bh = cw + 22;
  const bx = dx * (len + bw / 2);
  const by = dy * (len + bw / 2);
  const rw = dx !== 0 ? bw : bh;
  const rh = dx !== 0 ? bh : bw;
  rounded(c, bx - rw / 2, by - rh / 2, rw, rh, 5);
  c.fillStyle = STONE_DARK;
  c.fill();
  c.lineWidth = 3;
  c.strokeStyle = INK;
  c.stroke();
  c.restore();
}
function drawTile(c: Ctx, v: ChannelsView, p: number, tile: number, wet: boolean, leaks: Leak[], cw: number, half: number): void {
  const piece = v.grid.cells[p]!;
  rounded(c, 0, 0, tile, tile, 9);
  c.fillStyle = STONE;
  c.fill();
  c.save();
  c.clip();
  const sides = opens(piece.kind, piece.turn);
  if (piece.kind === "blank") {
    // A plain stone: two faint chisel marks.
    c.strokeStyle = STONE_DARK;
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(tile * 0.3, tile * 0.34);
    c.lineTo(tile * 0.46, tile * 0.3);
    c.moveTo(tile * 0.58, tile * 0.7);
    c.lineTo(tile * 0.72, tile * 0.66);
    c.stroke();
  } else groove(c, sides, tile, wet, cw, half);
  c.restore();
  const basin = v.basins.find((b) => b.cell === p);
  if (basin) (basin.kind === "fountain" ? fountain : pool)(c, tile, wet);
  else if (piece.kind === "cross") {
    // A cross piece is bolted: a small round bolt in the middle shows it does not turn.
    c.beginPath();
    c.arc(tile / 2, tile / 2, 6, 0, Math.PI * 2);
    c.fillStyle = PAL.brass;
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = INK;
    c.stroke();
  }
  rounded(c, 0, 0, tile, tile, 9);
  c.lineWidth = 3;
  c.strokeStyle = PAL.woodDark;
  c.stroke();
  for (const l of leaks) if (l.cell === p) drops(c, l.side, tile);
}

/**
 * One place of the grid in its own space (its top left at 0, 0): its tile and piece, its basin, the drops where it
 * spills, and the gold outline of the place turned last (or the pale one round every place of a finished grid). The
 * page draws every place with it, and the Alhambra's court (art/alhambra-room.ts) draws each piece on its stone panel
 * with it too, so that a piece looks the same in both: shared code, not a copy.
 */
export function drawPlace(c: Ctx, v: ChannelsView, p: number, tile: number, wet: boolean, leaks: Leak[], cw: number, half: number): void {
  drawTile(c, v, p, tile, wet, leaks, cw, half);
  if (v.mark === p && !v.done) {
    rounded(c, -4, -4, tile + 8, tile + 8, 12);
    c.lineWidth = 5;
    c.strokeStyle = PAL.gold;
    c.stroke();
  } else if (v.done) {
    rounded(c, -2, -2, tile + 4, tile + 4, 10);
    c.lineWidth = 3;
    c.strokeStyle = PAL.goldLight;
    c.stroke();
  }
}

export function channelsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = CHANNELS_ART.w * scale;
  canvas.height = CHANNELS_ART.h * scale;
  return canvas;
}
export function drawChannels(canvas: HTMLCanvasElement, v: ChannelsView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, gap } = CHANNELS_ART;
  const { rows, cols, cells } = v.grid;
  const { tile } = channelsLayout(rows, cols);
  const cw = grooveWidth(tile);
  const half = gap / 2;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  const f = flow(v.grid);
  const leaks = v.showWater ? f.leaks.filter((l) => f.reach[l.cell]! < v.fill) : [];
  c.save();
  // The picture is its own mirror image on a right to left page: no text is in it, so nothing is reversed that should not be.
  if (v.rtl) {
    c.translate(w, 0);
    c.scale(-1, 1);
  }
  // The spout first, so that the tile that it feeds lies over the end of its pipe.
  {
    const o = tileOrigin(v.grid.spout.cell, rows, cols);
    c.save();
    c.translate(o.x, o.y);
    spout(c, v.grid.spout.side, tile, cw, v.showWater, half);
    c.restore();
  }
  cells.forEach((_, p) => {
    const o = tileOrigin(p, rows, cols);
    c.save();
    c.translate(o.x, o.y);
    const wet = v.showWater && f.wet[p]! && f.reach[p]! < v.fill;
    drawPlace(c, v, p, tile, wet, leaks, cw, half);
    c.restore();
  });
  if (v.done) {
    const fountainCell = v.basins.find((b) => b.kind === "fountain")?.cell ?? v.basins[0]!.cell;
    const o = tileOrigin(fountainCell, rows, cols);
    c.save();
    c.translate(o.x, o.y);
    page(c, tile);
    c.restore();
  }
  c.restore();
}
