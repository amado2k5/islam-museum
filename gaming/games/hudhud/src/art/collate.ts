// The copies, drawn in code: the copies of a page of the Atlas lie one under another, each a row of parchment cells with
// one plain sign drawn in ink in each cell. The signs are simple shapes (a ring, a drop, a triangle, a crescent open to
// the right or to the left, a star of five or of six points, a square, a wave, a leaf, a key, a lamp): no letter, no
// word, no calligraphy and no stroke made to look like script, and nothing of any religious text. Each row begins with a
// plain mark for its copy: her copy a small round seal, the others a column of dots, two for the second copy and three
// for the third. A marked slip is circled with a broken red ring (dashed, so it is shape as well as colour). There is no
// text in the picture, so the page's own words (in seven languages) say everything it shows. On a right to left page the
// rows read from the right: the places and the copies' marks are laid out from the right, but each sign is drawn the same
// way round as on any other page, so that a crescent open to the right is open to the right on every page.
import type { Spot } from "../sim/collate";
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
export const COLLATE_ART = { w: 1000, h: 520, margin: 20, mark: 70, gap: 14 } as const;
export interface CollateView {
  /** The copies, each a row of sign ids. */
  copies: readonly (readonly string[])[];
  hers: number;
  /** The slips marked so far. */
  marks: readonly Spot[];
  rtl: boolean;
  done: boolean;
}

/** Where the cells lie, before any mirroring: the left of the first place, the pitch from one place to the next, the size of a cell, and the top of the first row. */
export function collateLayout(copies: number, n: number): { x0: number; pitch: number; cellW: number; cellH: number; y0: number; rowPitch: number } {
  const { w, h, margin, mark, gap } = COLLATE_ART;
  const x0 = margin + mark + gap;
  const pitch = (w - margin - x0) / n;
  const rowPitch = Math.min(150, (h - 2 * 40) / copies);
  const cellH = Math.min(rowPitch - 24, 110);
  return { x0, pitch, cellW: pitch - 6, cellH, y0: (h - copies * rowPitch) / 2, rowPitch };
}
/** A cell's rectangle in the picture's own 1000 by 520 space, on a page of either direction: place 0 is the leftmost cell, or the rightmost when the page reads right to left. */
export function cellRect(copy: number, place: number, copies: number, n: number, rtl: boolean): { x: number; y: number; w: number; h: number } {
  const { x0, pitch, cellW, cellH, y0, rowPitch } = collateLayout(copies, n);
  const left = x0 + place * pitch + 3;
  return { x: rtl ? COLLATE_ART.w - left - cellW : left, y: y0 + copy * rowPitch + (rowPitch - cellH) / 2, w: cellW, h: cellH };
}
/** The middle of a cell, in the picture's own space. */
export function cellCentre(copy: number, place: number, copies: number, n: number, rtl: boolean): { x: number; y: number } {
  const r = cellRect(copy, place, copies, n, rtl);
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}
/** What lies under a point of the picture, given in its own 1000 by 520 space: a copy's sign at a place, or nothing (the gaps, the copies' marks and the margins). */
export function collateHit(x: number, y: number, copies: number, n: number, rtl: boolean): Spot | null {
  for (let copy = 0; copy < copies; copy++) {
    for (let place = 0; place < n; place++) {
      const r = cellRect(copy, place, copies, n, rtl);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return { copy, place };
    }
  }
  return null;
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
function starPath(c: Ctx, points: number, r: number, inner: number): void {
  c.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    const k = i % 2 === 0 ? r : r * inner;
    if (i === 0) c.moveTo(Math.cos(a) * k, Math.sin(a) * k);
    else c.lineTo(Math.cos(a) * k, Math.sin(a) * k);
  }
  c.closePath();
}

// The signs, each drawn about the origin within a radius `r`, in ink on parchment. A crescent is a disc with a disc of
// the cell's own colour laid over it, shifted to the side it opens to.
function ring(c: Ctx, r: number): void {
  c.beginPath();
  c.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  c.stroke();
}
function drop(c: Ctx, r: number): void {
  // The ring drawn up to a point at the top: the same round body, so the two are near alike.
  const k = r * 0.78;
  c.beginPath();
  c.moveTo(0, -k * 1.28);
  c.quadraticCurveTo(k * 0.55, -k * 0.75, k * 0.97, -k * 0.2);
  c.arc(0, 0, k, -0.2, Math.PI + 0.2, false);
  c.quadraticCurveTo(-k * 0.55, -k * 0.75, 0, -k * 1.28);
  c.stroke();
}
function triangle(c: Ctx, r: number): void {
  c.beginPath();
  c.moveTo(0, -r * 0.85);
  c.lineTo(r * 0.82, r * 0.62);
  c.lineTo(-r * 0.82, r * 0.62);
  c.closePath();
  c.stroke();
}
function crescent(c: Ctx, r: number, open: 1 | -1, bg: string): void {
  c.beginPath();
  c.arc(0, 0, r * 0.8, 0, Math.PI * 2);
  c.fill();
  c.save();
  c.fillStyle = bg;
  c.beginPath();
  c.arc(open * r * 0.38, 0, r * 0.66, 0, Math.PI * 2);
  c.fill();
  c.restore();
}
function star(c: Ctx, r: number, points: 5 | 6): void {
  starPath(c, points, r * 0.88, points === 5 ? 0.42 : 0.5);
  c.fill();
}
function square(c: Ctx, r: number): void {
  const k = r * 0.66;
  c.beginPath();
  c.rect(-k, -k, k * 2, k * 2);
  c.stroke();
}
function wave(c: Ctx, r: number): void {
  c.beginPath();
  for (let i = 0; i <= 24; i++) {
    const x = -r * 0.9 + (i / 24) * r * 1.8;
    const y = Math.sin((i / 24) * Math.PI * 2) * r * 0.32;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();
}
function leaf(c: Ctx, r: number): void {
  // Two arcs meeting at a point at each end, with a line down the middle.
  c.beginPath();
  c.moveTo(-r * 0.85, r * 0.45);
  c.quadraticCurveTo(-r * 0.2, -r * 0.75, r * 0.85, -r * 0.45);
  c.quadraticCurveTo(r * 0.2, r * 0.75, -r * 0.85, r * 0.45);
  c.closePath();
  c.stroke();
  c.beginPath();
  c.moveTo(-r * 0.6, r * 0.3);
  c.lineTo(r * 0.6, -r * 0.3);
  c.stroke();
}
function key(c: Ctx, r: number): void {
  c.beginPath();
  c.arc(-r * 0.5, 0, r * 0.32, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.moveTo(-r * 0.18, 0);
  c.lineTo(r * 0.85, 0);
  c.moveTo(r * 0.55, 0);
  c.lineTo(r * 0.55, r * 0.32);
  c.moveTo(r * 0.8, 0);
  c.lineTo(r * 0.8, r * 0.32);
  c.stroke();
}
function lamp(c: Ctx, r: number): void {
  // An oil lamp: a low rounded body with a spout, a small handle, and a flame over the spout.
  c.beginPath();
  c.ellipse(-r * 0.1, r * 0.3, r * 0.62, r * 0.3, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.moveTo(r * 0.35, r * 0.2);
  c.lineTo(r * 0.85, r * 0.12);
  c.lineTo(r * 0.5, r * 0.5);
  c.closePath();
  c.fill();
  c.beginPath();
  c.arc(-r * 0.8, r * 0.25, r * 0.16, Math.PI * 0.5, Math.PI * 1.5);
  c.stroke();
  c.save();
  c.fillStyle = PAL.amber;
  c.beginPath();
  c.moveTo(r * 0.82, -r * 0.62);
  c.quadraticCurveTo(r * 1.0, -r * 0.2, r * 0.82, -r * 0.02);
  c.quadraticCurveTo(r * 0.64, -r * 0.2, r * 0.82, -r * 0.62);
  c.fill();
  c.restore();
}
/** Draws one sign about the origin. Unknown ids draw nothing (the content tests prove every sign used is known). */
export function drawSign(c: Ctx, id: string, r: number, bg: string): void {
  c.save();
  c.strokeStyle = INK;
  c.fillStyle = INK;
  c.lineWidth = Math.max(2.2, r * 0.16);
  c.lineCap = "round";
  c.lineJoin = "round";
  if (id === "ring") ring(c, r);
  else if (id === "drop") drop(c, r);
  else if (id === "triangle") triangle(c, r);
  else if (id === "crescent-right") crescent(c, r, 1, bg);
  else if (id === "crescent-left") crescent(c, r, -1, bg);
  else if (id === "star-five") star(c, r, 5);
  else if (id === "star-six") star(c, r, 6);
  else if (id === "square") square(c, r);
  else if (id === "wave") wave(c, r);
  else if (id === "leaf") leaf(c, r);
  else if (id === "key") key(c, r);
  else if (id === "lamp") lamp(c, r);
  c.restore();
}

/** Her copy's mark: a small round seal, a ring within a disc with a ring of dots round it (no letter on it). */
function seal(c: Ctx, x: number, y: number): void {
  c.save();
  c.fillStyle = PAL.terracotta;
  c.beginPath();
  c.arc(x, y, 22, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = PAL.cream;
  c.lineWidth = 2.5;
  c.beginPath();
  c.arc(x, y, 14, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = PAL.cream;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    c.beginPath();
    c.arc(x + Math.cos(a) * 18.5, y + Math.sin(a) * 18.5, 1.8, 0, Math.PI * 2);
    c.fill();
  }
  c.beginPath();
  c.arc(x, y, 4, 0, Math.PI * 2);
  c.fill();
  c.restore();
}
/** Another copy's mark: as many dots as its number, one under another. */
function dots(c: Ctx, x: number, y: number, count: number): void {
  c.save();
  c.fillStyle = PAL.cream;
  for (let i = 0; i < count; i++) {
    c.beginPath();
    c.arc(x, y + (i - (count - 1) / 2) * 16, 5.5, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}
/** A broken red ring round a marked slip. */
function slipRing(c: Ctx, x: number, y: number, r: number): void {
  c.save();
  c.lineWidth = 4;
  c.strokeStyle = "#e0463c";
  c.setLineDash([7, 5]);
  c.lineCap = "butt";
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.stroke();
  c.restore();
}

export function collateCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = COLLATE_ART.w * scale;
  canvas.height = COLLATE_ART.h * scale;
  return canvas;
}
export function drawCollate(canvas: HTMLCanvasElement, v: CollateView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, margin, mark } = COLLATE_ART;
  const copies = v.copies.length;
  const n = v.copies[0]?.length ?? 0;
  if (n === 0) return;
  const { cellW, cellH, y0, rowPitch } = collateLayout(copies, n);
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  const r = Math.min(cellW, cellH) * 0.36;
  for (let copy = 0; copy < copies; copy++) {
    // The copy's mark at the start of its row: on the left, or on the right when the page reads right to left.
    const my = y0 + copy * rowPitch + rowPitch / 2;
    const mx = v.rtl ? w - margin - mark / 2 : margin + mark / 2;
    if (copy === v.hers) seal(c, mx, my);
    else dots(c, mx, my, copy + 1);
    // A strip behind the row, so that each copy reads as one line.
    const first = cellRect(copy, 0, copies, n, v.rtl);
    const last = cellRect(copy, n - 1, copies, n, v.rtl);
    const left = Math.min(first.x, last.x) - 6;
    const right = Math.max(first.x, last.x) + cellW + 6;
    rounded(c, left, first.y - 6, right - left, cellH + 12, 12);
    c.fillStyle = PAL.woodDark;
    c.fill();
    if (v.done) {
      c.lineWidth = 3;
      c.strokeStyle = PAL.goldLight;
      c.stroke();
    }
    for (let place = 0; place < n; place++) {
      const cell = cellRect(copy, place, copies, n, v.rtl);
      // Every other place a shade lighter, so that the eye can run down a column from copy to copy.
      const bg = place % 2 === 0 ? PAL.parchment : PAL.cream;
      rounded(c, cell.x, cell.y, cell.w, cell.h, 6);
      c.fillStyle = bg;
      c.fill();
      c.save();
      c.translate(cell.x + cell.w / 2, cell.y + cell.h / 2);
      drawSign(c, v.copies[copy]![place]!, r, bg);
      c.restore();
    }
  }
  for (const m of v.marks) {
    const at = cellCentre(m.copy, m.place, copies, n, v.rtl);
    slipRing(c, at.x, at.y, Math.min(cellW, cellH) / 2 - 2);
  }
}
