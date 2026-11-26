// The scattered sheets, drawn in code: the sheets of an imagined map lie in a grid, each a parchment tile with the
// lines of its edges running in toward its middle. A coast is a thick line with water ticks on one side, a river a
// blue double line, a road a dotted line: three kinds that differ by shape, not by colour alone. A sheet's number is
// small dots in its corner (five to a row), and there is no text in the picture, so the page's own words (in seven
// languages) say everything it shows. The lines are made from the edge codes only: it is an imagined coast, not
// al-Idrisi's map and not any real place. A seam that does not match, where the way of playing shows it, gets a
// broken red outline (a dashed line, so it is not colour alone). On a right to left page the whole picture is its own
// mirror image, so that the first column is on the right and the lines still meet across every seam.
import { allSeams, decodeEdge, type Feature, type Grid, type Seam, type Side } from "../sim/sheets";
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
export const SHEETS_ART = { w: 1000, h: 480, margin: 30, gap: 14 } as const;
export interface SheetsView {
  grid: Grid;
  /** The page reads right to left: the first column is on the right. */
  rtl: boolean;
  /** The place chosen by a touch or a click, to be exchanged with another; or null. */
  selected: number | null;
  /** Draw a broken red outline on every seam that does not match (not in the Challenge way of playing). */
  showSeams: boolean;
  /** The map is in order. */
  done: boolean;
}

/** Where the places lie in the picture's own 1000 by 480 space, before any mirroring: the pitch from one place to the next, the size of a sheet, and the top left of the first. */
export function sheetsLayout(rows: number, cols: number): { pitch: number; tile: number; x0: number; y0: number } {
  const { w, h, margin, gap } = SHEETS_ART;
  const pitch = Math.floor(Math.min((w - 2 * margin) / cols, (h - 2 * margin) / rows));
  return { pitch, tile: pitch - gap, x0: (w - cols * pitch) / 2, y0: (h - rows * pitch) / 2 };
}
/** The top left of a sheet, in the picture's own space, before any mirroring. */
export function sheetOrigin(p: number, rows: number, cols: number): { x: number; y: number } {
  const { pitch, x0, y0, tile } = sheetsLayout(rows, cols);
  const gap = (pitch - tile) / 2;
  return { x: x0 + (p % cols) * pitch + gap, y: y0 + Math.floor(p / cols) * pitch + gap };
}
/** What lies under a point of the picture, given in its own 1000 by 480 space: a place (0 is the first, counted row by row from the first column, which is on the right when the page reads right to left), or nothing. */
export function sheetsHit(x: number, y: number, rows: number, cols: number, rtl: boolean): number | null {
  const px = rtl ? SHEETS_ART.w - x : x;
  const { tile } = sheetsLayout(rows, cols);
  for (let p = 0; p < rows * cols; p++) {
    const o = sheetOrigin(p, rows, cols);
    if (px >= o.x && px <= o.x + tile && y >= o.y && y <= o.y + tile) return p;
  }
  return null;
}

/** The fractions along an edge where the three places of a feature lie, kept clear of the corner where the number is. */
const AT = [0, 0.34, 0.5, 0.66] as const;
/** Where a feature meets an edge, and the way into the sheet, in the sheet's own space (0 to tile). */
function mark(side: Side, at: 1 | 2 | 3, tile: number): { x: number; y: number; dx: number; dy: number } {
  const f = AT[at] * tile;
  return side === "n" ? { x: f, y: 0, dx: 0, dy: 1 } : side === "s" ? { x: f, y: tile, dx: 0, dy: -1 } : side === "w" ? { x: 0, y: f, dx: 1, dy: 0 } : { x: tile, y: f, dx: -1, dy: 0 };
}
type Curve = { x0: number; y0: number; cx: number; cy: number; x1: number; y1: number };
function curveOf(side: Side, at: 1 | 2 | 3, tile: number): Curve {
  const m = mark(side, at, tile);
  return { x0: m.x, y0: m.y, cx: m.x + m.dx * tile * 0.34, cy: m.y + m.dy * tile * 0.34, x1: tile / 2, y1: tile / 2 };
}
const pointAt = (c: Curve, t: number) => ({
  x: (1 - t) * (1 - t) * c.x0 + 2 * (1 - t) * t * c.cx + t * t * c.x1,
  y: (1 - t) * (1 - t) * c.y0 + 2 * (1 - t) * t * c.cy + t * t * c.y1,
  tx: 2 * (1 - t) * (c.cx - c.x0) + 2 * t * (c.x1 - c.cx),
  ty: 2 * (1 - t) * (c.cy - c.y0) + 2 * t * (c.y1 - c.cy),
});
function path(c: Ctx, k: Curve): void {
  c.beginPath();
  c.moveTo(k.x0, k.y0);
  c.quadraticCurveTo(k.cx, k.cy, k.x1, k.y1);
}
function line(c: Ctx, k: Curve, width: number, colour: string, dash: number[] = []): void {
  c.save();
  c.setLineDash(dash);
  c.lineWidth = width;
  c.strokeStyle = colour;
  path(c, k);
  c.stroke();
  c.restore();
}
function feature(c: Ctx, kind: Feature, k: Curve): void {
  if (kind === "coast") {
    // A thick brown line with short water ticks along one side of it.
    line(c, k, 9, PAL.woodDark);
    line(c, k, 4, PAL.terracotta);
    c.save();
    c.strokeStyle = PAL.lapis;
    c.lineWidth = 2.5;
    for (let t = 0.04; t < 0.9; t += 0.11) {
      const p = pointAt(k, t);
      const len = Math.hypot(p.tx, p.ty) || 1;
      const nx = -p.ty / len;
      const ny = p.tx / len;
      c.beginPath();
      c.moveTo(p.x + nx * 7, p.y + ny * 7);
      c.lineTo(p.x + nx * 15, p.y + ny * 15);
      c.stroke();
    }
    c.restore();
  } else if (kind === "river") {
    // A double line: a wide blue stroke with a parchment stroke inside it.
    line(c, k, 12, PAL.lapis);
    line(c, k, 5, PAL.parchment);
  } else {
    // Dots.
    line(c, k, 6, INK, [0.1, 10]);
  }
}

function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
/** The sheet's number as dots in its corner, five to a row. */
function dots(c: Ctx, id: number): void {
  const rows = Math.ceil(id / 5);
  c.save();
  c.fillStyle = PAL.cream;
  rounded(c, 4, 4, 34, 6.5 * rows + 6, 5);
  c.fill();
  c.fillStyle = INK;
  for (let i = 0; i < id; i++) {
    c.beginPath();
    c.arc(9 + (i % 5) * 6.5, 9 + Math.floor(i / 5) * 6.5 + 2, 2.4, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}
function drawSheet(c: Ctx, sh: Grid["cells"][number], tile: number): void {
  rounded(c, 0, 0, tile, tile, 8);
  c.fillStyle = PAL.parchment;
  c.fill();
  c.save();
  c.clip();
  for (const side of ["n", "e", "s", "w"] as const) {
    const d = decodeEdge(sh[side]);
    if (d) feature(c, d.feature, curveOf(side, d.at, tile));
  }
  c.restore();
  rounded(c, 0, 0, tile, tile, 8);
  c.lineWidth = 3;
  c.strokeStyle = PAL.woodDark;
  c.stroke();
  dots(c, sh.id);
}
/** A broken red outline along a seam that does not match. */
function outline(c: Ctx, sm: Seam, rows: number, cols: number, tile: number): void {
  const o = sheetOrigin(sm.a, rows, cols);
  const out = (SHEETS_ART.gap / 2) | 0;
  let x0 = o.x;
  let y0 = o.y;
  let x1 = o.x;
  let y1 = o.y;
  if (sm.side === "e") ((x0 = x1 = o.x + tile + out), (y1 = o.y + tile));
  else if (sm.side === "s") ((y0 = y1 = o.y + tile + out), (x1 = o.x + tile));
  else if (sm.side === "n") ((y0 = y1 = o.y - out), (x1 = o.x + tile));
  else ((x0 = x1 = o.x - out), (y1 = o.y + tile));
  c.save();
  c.lineWidth = 5;
  c.strokeStyle = "#e0463c";
  c.setLineDash([11, 7]);
  c.lineCap = "butt";
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(x1, y1);
  c.stroke();
  c.restore();
}

export function sheetsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = SHEETS_ART.w * scale;
  canvas.height = SHEETS_ART.h * scale;
  return canvas;
}
export function drawSheets(canvas: HTMLCanvasElement, v: SheetsView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h } = SHEETS_ART;
  const { rows, cols, cells } = v.grid;
  const { tile } = sheetsLayout(rows, cols);
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  c.save();
  // The picture is its own mirror image on a right to left page: no text is in it, so nothing is reversed that should not be.
  if (v.rtl) {
    c.translate(w, 0);
    c.scale(-1, 1);
  }
  cells.forEach((sh, p) => {
    const o = sheetOrigin(p, rows, cols);
    c.save();
    c.translate(o.x, o.y);
    drawSheet(c, sh, tile);
    if (v.selected === p) {
      rounded(c, -4, -4, tile + 8, tile + 8, 11);
      c.lineWidth = 6;
      c.strokeStyle = PAL.gold;
      c.stroke();
    } else if (v.done) {
      rounded(c, -2, -2, tile + 4, tile + 4, 9);
      c.lineWidth = 3;
      c.strokeStyle = PAL.goldLight;
      c.stroke();
    }
    c.restore();
  });
  if (v.showSeams) for (const sm of allSeams(v.grid)) if (!sm.match) outline(c, sm, rows, cols, tile);
  c.restore();
}
