// The Alhambra's court, drawn in code in the art bible's style and palette: an open court at evening, a row of plain
// round arches with the evening sky and dark garden shapes seen through them, a low wall along their foot and a paved
// floor; in the middle the great stone panel seen at an angle, its face sloping from a high back edge to a low front one,
// with a stone ledge along the foot of each row; high on the wall at the panel's near end a plain stone spout with a plain
// pipe to the grid, a small stone ledge under it and, in Challenge, a plain sluice lever on that ledge. A trial picture,
// like every picture in this game.
//
// What it is not. It is no real court and no picture of the Alhambra: there is no muqarnas, no inscription, no stone lion,
// no tower, no myrtle hedge and no named court, and nothing of any script is drawn. The pieces of the channels, the plain
// round basin (the dry fountain) and the plain long basin are the page quest's own drawing (art/channels.ts, `drawPlace`,
// shared, not copied), placed by the scene (scenes/alhambra.ts) from the quest's own state on the panel's places. The grid
// is the quest's, and is not the plan of the Alhambra or of its waterworks. Nothing here draws text: a test holds it to that.
import { Rng } from "@im/kernel/prng";
import { AHR_GAP, AHR_LEDGE, AHR_LEVELS, AHR_PANEL, AHR_SPOUT, AHR_TILE, AHR_WORLD, LEDGE_HALF, ledgeY, spoutMouth } from "../content/alhambra-room";
import { flow, gridOf, type ChannelsState, type ChannelsStyle, type Leak } from "../sim/channels";
import { waterShown } from "../sim/alhambraroom";
import { CHANNEL_INK, drawPlace, grooveWidth, type ChannelsView } from "./channels";
import { INK, PAL, blob, brush, fillStroke, linear, sheet, type Ctx, type Painted } from "./kit";

function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
/** A plain stone slab: a face shaded from top to bottom, an ink outline. */
function slab(c: Ctx, x: number, y: number, w: number, h: number, top = "#d8c8a4", bottom = "#a8956f"): void {
  c.fillStyle = linear(c, 0, y, 0, y + h + 1, [
    [0, top],
    [1, bottom],
  ]);
  c.fillRect(x, y, w, h);
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.strokeRect(x, y, w, h);
}

/** The panel's half width at a height: from its back edge to its front edge. */
export function panelHalf(y: number): number {
  const f = (y - AHR_PANEL.back) / (AHR_PANEL.front - AHR_PANEL.back);
  return AHR_PANEL.backHalf + (AHR_PANEL.frontHalf - AHR_PANEL.backHalf) * f;
}

/** The arches along the back of the court: where each opening begins and how wide it is. */
const ARCHES = Array.from({ length: 12 }, (_, i) => ({ x: 40 + i * 200, w: 132 }));
const ARCH_TOP = 150;
const LOW_WALL = 548;

/** The whole court behind the figures and the pieces, 2400 by 720 game pixels. */
export function alhambraCourt(scale: number): Painted {
  const w = AHR_WORLD.width;
  const h = AHR_WORLD.height;
  const floor = AHR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-alhambra-court");

  // The evening sky, seen over the arcade and through its arches: deep blue high up, a warm glow low down.
  const sky = linear(ctx, 0, 0, 0, LOW_WALL, [
    [0, "#1c2a5a"],
    [0.45, "#5a3f74"],
    [0.8, "#d9774a"],
    [1, "#f2b96a"],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255,246,214,${rng.range(0.35, 0.8)})`;
    ctx.beginPath();
    ctx.arc(rng.range(0, w), rng.range(4, 60), rng.range(0.8, 1.8), 0, Math.PI * 2);
    ctx.fill();
  }

  // The arcade: a plain plastered wall from the cornice down, with round arches open to the sky and the garden.
  const wallTop = 70;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, wallTop, w, LOW_WALL - wallTop);
  for (const a of ARCHES) {
    // Each opening, cut out of the wall (drawn the other way round, so that it is a hole).
    ctx.moveTo(a.x, LOW_WALL);
    ctx.lineTo(a.x + a.w, LOW_WALL);
    ctx.lineTo(a.x + a.w, ARCH_TOP + a.w / 2);
    ctx.arc(a.x + a.w / 2, ARCH_TOP + a.w / 2, a.w / 2, 0, Math.PI, true);
    ctx.closePath();
  }
  ctx.fillStyle = linear(ctx, 0, wallTop, 0, LOW_WALL, [
    [0, "#b98a68"],
    [0.6, "#a7785a"],
    [1, "#8e6448"],
  ]);
  ctx.fill("evenodd");
  ctx.restore();
  // Dark garden shapes through the arches: plain round trees and a low hedge line, no particular plant.
  for (const a of ARCHES) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, LOW_WALL);
    ctx.lineTo(a.x, ARCH_TOP + a.w / 2);
    ctx.arc(a.x + a.w / 2, ARCH_TOP + a.w / 2, a.w / 2, Math.PI, 0);
    ctx.lineTo(a.x + a.w, LOW_WALL);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "rgba(20,40,46,0.92)";
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.arc(a.x + rng.range(10, a.w - 10), rng.range(380, 450), rng.range(34, 52), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillRect(a.x, 450, a.w, LOW_WALL - 450);
    ctx.restore();
    // The arch's plain edge.
    ctx.beginPath();
    ctx.moveTo(a.x, LOW_WALL);
    ctx.lineTo(a.x, ARCH_TOP + a.w / 2);
    ctx.arc(a.x + a.w / 2, ARCH_TOP + a.w / 2, a.w / 2, Math.PI, 0);
    ctx.lineTo(a.x + a.w, LOW_WALL);
    ctx.strokeStyle = "#5a3a26";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // Soft patches on the plaster, warm where the last light falls.
  for (let i = 0; i < 160; i++) {
    const x = rng.range(0, w);
    const y = rng.range(wallTop, LOW_WALL);
    const r = rng.range(14, 60);
    ctx.fillStyle = rng.chance(0.55) ? `rgba(255,214,160,${rng.range(0.03, 0.08)})` : `rgba(60,30,20,${rng.range(0.03, 0.06)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // The plain cornice along the top of the wall.
  slab(ctx, 0, wallTop - 14, w, 16, "#d6b48c", "#9a7454");

  // The low wall along the foot of the arches, with a plain coping.
  slab(ctx, 0, LOW_WALL, w, floor - LOW_WALL, "#c49a74", "#8a6446");
  slab(ctx, 0, LOW_WALL - 8, w, 10, "#e0c49c", "#b08a66");
  // Two plain clay pots with round shrubs on the low wall's coping.
  for (const x of [360, 2060]) {
    blob(ctx, [
      [x - 26, LOW_WALL - 8],
      [x + 26, LOW_WALL - 8],
      [x + 18, LOW_WALL - 52],
      [x - 18, LOW_WALL - 52],
    ]);
    fillStroke(ctx, PAL.terracotta, INK, 2);
    for (const [dx, dy, r] of [[-14, -66, 20], [10, -72, 22], [0, -88, 18]] as const) {
      ctx.beginPath();
      ctx.arc(x + dx, LOW_WALL + dy, r, 0, Math.PI * 2);
      fillStroke(ctx, "#2f6a4a", INK, 1.6);
    }
  }

  // The floor: plain paving slabs in the evening light, lines running away from the middle.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#cdb48e"],
    [1, "#8c7456"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(80,56,34,0.42)";
  ctx.lineWidth = 1.6;
  for (let x = -300; x < w + 300; x += 110) {
    ctx.beginPath();
    ctx.moveTo(x, floor);
    ctx.lineTo(x + (x - AHR_PANEL.cx) * 0.3, h);
    ctx.stroke();
  }
  for (const y of [floor + 32, floor + 72]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // The great stone panel, seen at an angle: the piers that hold up its back first, then its sloping face, its front edge,
  // and the ledges along its rows.
  const P = AHR_PANEL;
  ctx.fillStyle = "#7c6a52";
  for (const x of [P.cx - P.backHalf + 24, P.cx + P.backHalf - 60]) {
    ctx.fillRect(x, P.back, 36, floor - P.back);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, P.back, 36, floor - P.back);
  }
  ctx.beginPath();
  ctx.moveTo(P.cx - P.backHalf, P.back);
  ctx.lineTo(P.cx + P.backHalf, P.back);
  ctx.lineTo(P.cx + P.frontHalf, P.front);
  ctx.lineTo(P.cx - P.frontHalf, P.front);
  ctx.closePath();
  fillStroke(ctx, linear(ctx, 0, P.back, 0, P.front, [
    [0, "#9c8a6c"],
    [1, "#c8b690"],
  ]), INK, 2.8);
  // The joints of the stone, running from the back to the front, and the last light lying across the face.
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(70,52,30,0.2)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 10; i++) {
    const f = i / 10;
    ctx.beginPath();
    ctx.moveTo(P.cx - P.backHalf + f * 2 * P.backHalf, P.back);
    ctx.lineTo(P.cx - P.frontHalf + f * 2 * P.frontHalf, P.front);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,200,140,0.12)";
  ctx.fillRect(P.cx - P.frontHalf, P.back, 2 * P.frontHalf, (P.front - P.back) * 0.4);
  ctx.restore();
  // The panel's front edge, thick, standing on the floor.
  slab(ctx, P.cx - P.frontHalf - 6, P.front, 2 * P.frontHalf + 12, floor - P.front, "#b6a27c", "#7c6a52");
  // The ledges: low stone lips along the foot of each row, the perches the bird stands on.
  for (const y of AHR_LEVELS) slab(ctx, P.cx - LEDGE_HALF, ledgeY(y), 2 * LEDGE_HALF, 8, "#e4d4b0", "#a8956f");

  brush(ctx, w, h, "alhambra-court", { light: [0.5, 0.25], strength: 0.42, strokes: 2200, warm: "rgba(255,220,170,0.16)", cool: "rgba(40,20,40,0.16)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the spout and the lever
/** The box the spout's picture covers, in the court's own space (left to right; mirrored about the panel's middle on a page read right to left). */
export const SPOUT_BOX = { x: 670, y: 70, w: 440, h: 330 } as const;
/**
 * The spout of the aqueduct high on the wall: a plain stone block with a dark mouth, a plain pipe from it down and across
 * to the place of the grid it feeds (drawn as the page draws its spout's pipe: an empty dark groove when dry, blue with
 * pale ripple strokes when the water runs, so that the two differ by pattern and not by colour alone), and under the block
 * a small stone ledge on a bracket. Drawn left to right; the scene mirrors it on a page read right to left.
 */
export function spoutArt(scale: number, style: ChannelsStyle, wet: boolean): Painted {
  const B = SPOUT_BOX;
  const [p, c] = sheet(B.w, B.h, scale);
  const { GROOVE_EDGE, GROOVE_DRY, WATER, RIPPLE, STONE, STONE_DARK } = CHANNEL_INK;
  const cw = grooveWidth(AHR_TILE);
  const mouth = spoutMouth(style, false);
  const sx = AHR_SPOUT.x - B.x;
  const sy = AHR_SPOUT.y - B.y;
  const mx = mouth.x - B.x;
  const my = mouth.y - B.y;
  // The ledge and its bracket.
  const lx = AHR_LEDGE.x - B.x;
  const ly = AHR_LEDGE.y - B.y;
  blob(c, [
    [lx + 30, ly + 8],
    [lx + 70, ly + 8],
    [lx + 54, ly + 46],
    [lx + 46, ly + 46],
  ]);
  fillStroke(c, STONE_DARK, INK, 1.8);
  rounded(c, lx, ly, AHR_LEDGE.w, 12, 3);
  fillStroke(c, STONE, INK, 2);
  // The pipe: down from the block, then across to the grid, a groove in a stone casing.
  const path = () => {
    c.beginPath();
    c.moveTo(sx, sy + 20);
    c.lineTo(sx, my);
    c.lineTo(mx, my);
  };
  c.lineJoin = "round";
  c.lineCap = "butt";
  path();
  c.lineWidth = cw + 12;
  c.strokeStyle = STONE_DARK;
  c.stroke();
  path();
  c.lineWidth = cw + 7;
  c.strokeStyle = GROOVE_EDGE;
  c.stroke();
  path();
  c.lineWidth = cw;
  c.strokeStyle = wet ? WATER : GROOVE_DRY;
  c.stroke();
  if (wet) {
    c.setLineDash([7, 9]);
    path();
    c.lineWidth = 3;
    c.strokeStyle = RIPPLE;
    c.stroke();
    c.setLineDash([]);
  }
  // The block of the spout, with its dark mouth over the pipe.
  rounded(c, sx - 36, sy - 30, 72, 58, 6);
  fillStroke(c, linear(c, 0, sy - 30, 0, sy + 28, [
    [0, "#d8c8a4"],
    [1, STONE_DARK],
  ]), INK, 2.4);
  c.beginPath();
  c.ellipse(sx, sy + 14, cw * 0.6, 7, 0, 0, Math.PI * 2);
  c.fillStyle = wet ? WATER : GROOVE_DRY;
  c.fill();
  c.lineWidth = 1.6;
  c.strokeStyle = INK;
  c.stroke();
  return p;
}
/** The plain sluice lever on the ledge under the spout: a stone post and a wooden handle, raised when the sluice is shut and lowered when it is open (shape and position change, not only colour). Its foot is at the bottom middle. */
export function leverArt(scale: number, open: boolean): Painted {
  const [p, c] = sheet(80, 80, scale);
  rounded(c, 30, 46, 20, 34, 4);
  fillStroke(c, CHANNEL_INK.STONE_DARK, INK, 2);
  c.save();
  c.translate(40, 52);
  c.rotate(open ? 1.05 : -0.55);
  rounded(c, -4, -44, 8, 46, 3);
  fillStroke(c, "#8a5a30", INK, 2);
  c.beginPath();
  c.arc(0, -46, 7, 0, Math.PI * 2);
  fillStroke(c, PAL.brass, INK, 2);
  c.restore();
  c.beginPath();
  c.arc(40, 52, 5, 0, Math.PI * 2);
  fillStroke(c, PAL.brass, INK, 1.6);
  return p;
}

// ---------------------------------------------------------------------------------------------- the pieces
/** Room round a piece's tile for what the page draws outside it: the drops where it spills, and the gold outline. */
export const PIECE_MARGIN = 40;
/** The groove's width and reach past the tile for a piece on the panel: the page's own rule for a tile of AHR_TILE, and half the page's gap. */
export const PIECE_STROKE = { cw: grooveWidth(AHR_TILE), half: AHR_GAP / 2 } as const;
/** An empty canvas for one place of the panel, its tile AHR_TILE square with PIECE_MARGIN round it. */
export function pieceSheet(scale: number): Painted {
  return sheet(AHR_TILE + 2 * PIECE_MARGIN, AHR_TILE + 2 * PIECE_MARGIN, scale)[0];
}
/**
 * Paints one place of the panel onto its canvas, from nothing: the page quest's own drawing of that place (`drawPlace`,
 * shared, not copied), with the tile's top left at the margin.
 */
export function paintPiece(pic: Painted, v: ChannelsView, place: number, wet: boolean, leaks: Leak[]): void {
  const c = pic.canvas.getContext("2d")!;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, pic.canvas.width, pic.canvas.height);
  c.setTransform(pic.canvas.width / pic.w, 0, 0, pic.canvas.height / pic.h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  c.translate(PIECE_MARGIN, PIECE_MARGIN);
  drawPlace(c, v, place, AHR_TILE, wet, leaks, PIECE_STROKE.cw, PIECE_STROKE.half);
}

/** The page's view of a grid, for a place of the court to be painted from: the same view the page paints its picture from (left to right; the scene mirrors each piece on a page read right to left). */
export function viewOf(c: ChannelsState, fill: number, mark: number | null): ChannelsView {
  return { grid: gridOf(c), basins: c.basins, rtl: false, showWater: waterShown(c), fill, done: c.done, mark };
}
/** What a place looks like now, as a key: its piece and turn, whether it is drawn wet, the sides it spills on, whether it is the piece turned last, and whether the grid is done. The scene paints a place again only when this changes. */
export function placeLook(c: ChannelsState, p: number, fill: number, mark: number | null): string {
  const v = viewOf(c, fill, mark);
  const f = flow(v.grid);
  const wet = v.showWater && f.wet[p]! && f.reach[p]! < fill;
  const leaks = v.showWater ? f.leaks.filter((l) => l.cell === p && f.reach[l.cell]! < fill).map((l) => l.side) : [];
  return JSON.stringify([c.cells[p]!.kind, c.cells[p]!.turn, wet, leaks, mark === p && !c.done, c.done]);
}
