// Al-Jazari's workshop, drawn in code in the art bible's style and palette: a workshop of an engineer at a court,
// with a window of evening light, shelves of tools and gears, a water basin, a long workbench, and at the far end a
// low platform with the frame that holds the clock's five places. A trial picture, like every picture in this game.
//
// What it is not. It is no real building, and it has no inscription or writing. The basin is decoration: the clock
// quest says only that the clock's float sits in water, and the basin claims nothing more. The frame of five places
// is the game's own way of holding the parts; it is not the elephant clock's appearance, and no elephant is drawn.
// The parts on it are the same pictures as on the clock quest's bench (art/bench.ts).
import { Rng } from "@im/kernel/prng";
import { JR_BASIN, JR_BENCH, JR_HIGH_SHELF, JR_LOW_SHELF, JR_PLACES, JR_PLATFORM, JR_WINDOW, JR_WORLD } from "../content/jazari-room";
import { drawPart } from "./bench";
import { INK, PAL, blob, brush, fillStroke, linear, radial, sheet, starTile, type Ctx, type Painted } from "./kit";

function shelf(ctx: Ctx, x: number, y: number, w: number): void {
  ctx.fillStyle = linear(ctx, 0, y, 0, y + 14, [
    [0, "#a8703c"],
    [1, PAL.woodDark],
  ]);
  ctx.fillRect(x, y, w, 12);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x, y, w, 12);
  for (const bx of [x + 18, x + w - 18]) {
    ctx.beginPath();
    ctx.moveTo(bx - 8, y + 12);
    ctx.quadraticCurveTo(bx - 6, y + 34, bx + 8, y + 40);
    ctx.lineTo(bx + 8, y + 12);
    ctx.closePath();
    fillStroke(ctx, PAL.wood, INK, 1.6);
  }
}
/** A toothed wheel. */
function gear(ctx: Ctx, cx: number, cy: number, r: number, teeth: number, colour: string): void {
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.8;
    const a2 = a + Math.PI / (teeth * 2);
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    ctx.lineTo(cx + Math.cos(a2) * rr, cy + Math.sin(a2) * rr);
  }
  ctx.closePath();
  fillStroke(ctx, colour, INK, 1.8);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
  fillStroke(ctx, PAL.woodDark, INK, 1.4);
}
/** A pair of dividers hanging from a peg. */
function dividers(ctx: Ctx, x: number, y: number, len: number): void {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s * len * 0.22, y + len);
    ctx.stroke();
  }
  ctx.strokeStyle = PAL.brass;
  ctx.lineWidth = 3;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s * len * 0.22, y + len);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  fillStroke(ctx, PAL.gold, INK, 1.4);
}
/** A saw with a wooden handle. */
function saw(ctx: Ctx, x: number, y: number): void {
  blob(ctx, [
    [x, y],
    [x + 90, y + 4],
    [x + 90, y + 18],
    [x, y + 26],
  ]);
  fillStroke(ctx, "#b9c2c4", INK, 1.6);
  ctx.strokeStyle = "rgba(40,40,40,0.6)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 4 + i * 7, y + 24 - i * 0.6);
    ctx.lineTo(x + 8 + i * 7, y + 19 - i * 0.6);
    ctx.stroke();
  }
  blob(ctx, [
    [x - 30, y - 2],
    [x + 2, y - 2],
    [x + 4, y + 28],
    [x - 30, y + 26],
  ]);
  fillStroke(ctx, PAL.wood, INK, 1.6);
}
/** A glazed pot. */
function pot(ctx: Ctx, x: number, base: number, w: number, h: number, colour: string): void {
  blob(ctx, [
    [x - w * 0.3, base],
    [x - w * 0.5, base - h * 0.45],
    [x - w * 0.25, base - h * 0.9],
    [x - w * 0.2, base - h],
    [x + w * 0.2, base - h],
    [x + w * 0.25, base - h * 0.9],
    [x + w * 0.5, base - h * 0.45],
    [x + w * 0.3, base],
  ]);
  fillStroke(ctx, colour, INK, 1.8);
  ctx.strokeStyle = "rgba(255,230,170,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.38, base - h * 0.5);
  ctx.lineTo(x + w * 0.38, base - h * 0.5);
  ctx.stroke();
}

/** The whole room behind the figures and the parts, 2400 by 720 game pixels. */
export function jazariRoom(scale: number): Painted {
  const w = JR_WORLD.width;
  const h = JR_WORLD.height;
  const floor = JR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-jazari-room");

  // The wall: warm plaster, terracotta below and dusk-blue above.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#2a2a4a"],
    [0.45, "#6b3a2a"],
    [1, "#8a4f34"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 340; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(240,180,120,${rng.range(0.02, 0.05)})` : `rgba(30,10,20,${rng.range(0.03, 0.08)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // A band of star tiles along the wall, lapis and gold.
  ctx.fillStyle = "#3a1f22";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? "#2b4fa3" : "#c2643a", "#e7c57c");
  // The floor: worn stone slabs, as in the other workshop.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#a59679"],
    [1, "#5d5444"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(40,30,20,0.45)";
  ctx.lineWidth = 1.6;
  for (let x = -300; x < w + 300; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, floor);
    ctx.lineTo(x + (x - 1200) * 0.3, h);
    ctx.stroke();
  }
  for (const y of [floor + 30, floor + 70]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // The window, with evening outside: a pointed arch with a lattice of plain lines.
  const win = JR_WINDOW;
  const winPath = () => {
    ctx.beginPath();
    ctx.moveTo(win.x, win.y + win.h);
    ctx.lineTo(win.x, win.y + 80);
    ctx.quadraticCurveTo(win.x, win.y + 10, win.x + win.w / 2, win.y);
    ctx.quadraticCurveTo(win.x + win.w, win.y + 10, win.x + win.w, win.y + 80);
    ctx.lineTo(win.x + win.w, win.y + win.h);
    ctx.closePath();
  };
  ctx.save();
  winPath();
  ctx.fillStyle = linear(ctx, 0, win.y, 0, win.y + win.h, [
    [0, "#3b3a78"],
    [0.5, "#c96a5a"],
    [1, "#f5b25a"],
  ]);
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = "rgba(255,236,170,0.9)";
  ctx.beginPath();
  ctx.arc(win.x + win.w * 0.62, win.y + win.h * 0.72, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a2a48";
  for (let i = 0; i < 6; i++) {
    const bx = win.x + 10 + i * 34;
    const bh = 30 + ((i * 37) % 50);
    ctx.fillRect(bx, win.y + win.h - bh, 28, bh);
  }
  ctx.restore();
  ctx.strokeStyle = "#e7c57c";
  ctx.lineWidth = 3;
  for (let x = win.x + 40; x < win.x + win.w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, win.y + 10);
    ctx.lineTo(x, win.y + win.h);
    ctx.stroke();
  }
  for (let y = win.y + 60; y < win.y + win.h; y += 48) {
    ctx.beginPath();
    ctx.moveTo(win.x, y);
    ctx.lineTo(win.x + win.w, y);
    ctx.stroke();
  }
  winPath();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#c79a55";
  winPath();
  ctx.stroke();
  ctx.fillStyle = "#c79a55";
  ctx.fillRect(win.x - 18, win.y + win.h, win.w + 36, 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(win.x - 18, win.y + win.h, win.w + 36, 14);

  // The shelf of gears by the window (a perch), and a saw and dividers on pegs under it.
  shelf(ctx, JR_LOW_SHELF.x, JR_LOW_SHELF.y, JR_LOW_SHELF.w);
  gear(ctx, JR_LOW_SHELF.x + 50, JR_LOW_SHELF.y - 32, 30, 10, PAL.brass);
  gear(ctx, JR_LOW_SHELF.x + 104, JR_LOW_SHELF.y - 22, 20, 8, "#b8742f");
  gear(ctx, JR_LOW_SHELF.x + 160, JR_LOW_SHELF.y - 36, 34, 12, PAL.brass);
  dividers(ctx, 700, 360, 70);
  saw(ctx, 760, 390);

  // The water basin: stone, with water in it. Decoration only.
  const b = JR_BASIN;
  ctx.fillStyle = linear(ctx, 0, b.y, 0, floor, [
    [0, "#b5a88c"],
    [1, "#7d7262"],
  ]);
  blob(ctx, [
    [b.x, b.y],
    [b.x + b.w, b.y],
    [b.x + b.w - 12, floor],
    [b.x + 12, floor],
  ]);
  fillStroke(ctx, linear(ctx, 0, b.y, 0, floor, [[0, "#b5a88c"], [1, "#7d7262"]]), INK, 2.2);
  ctx.beginPath();
  ctx.ellipse(b.x + b.w / 2, b.y + 4, b.w / 2 - 10, 9, 0, 0, Math.PI * 2);
  fillStroke(ctx, linear(ctx, b.x, 0, b.x + b.w, 0, [[0, "#3f8fa6"], [0.5, "#9fe0ec"], [1, "#3f8fa6"]]), INK, 1.6);

  // The long workbench (a perch), with tools on it.
  const wb = JR_BENCH;
  ctx.fillStyle = PAL.woodDark;
  for (const lx of [wb.x + 20, wb.x + wb.w - 44]) {
    ctx.fillRect(lx, wb.y + 12, 24, floor - wb.y - 12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(lx, wb.y + 12, 24, floor - wb.y - 12);
  }
  ctx.fillRect(wb.x + 30, 560, wb.w - 60, 12);
  ctx.strokeRect(wb.x + 30, 560, wb.w - 60, 12);
  ctx.fillStyle = linear(ctx, 0, wb.y, 0, wb.y + 22, [
    [0, "#b97a40"],
    [1, PAL.wood],
  ]);
  ctx.fillRect(wb.x - 10, wb.y, wb.w + 20, 22);
  ctx.strokeRect(wb.x - 10, wb.y, wb.w + 20, 22);
  gear(ctx, wb.x + 40, wb.y - 8, 12, 8, PAL.brass);
  ctx.fillStyle = "#e9dcc0";
  ctx.fillRect(wb.x + 64, wb.y - 6, 44, 6);
  ctx.strokeRect(wb.x + 64, wb.y - 6, 44, 6);

  // The high shelf (a perch), with pots, gears and the box of odd parts the feather hides in.
  const hs = JR_HIGH_SHELF;
  shelf(ctx, hs.x, hs.y, hs.w);
  pot(ctx, hs.x + 40, hs.y, 40, 56, "#2b4fa3");
  pot(ctx, hs.x + 92, hs.y, 32, 44, "#2f8f5b");
  gear(ctx, hs.x + 156, hs.y - 28, 26, 10, PAL.brass);
  gear(ctx, hs.x + 204, hs.y - 18, 16, 8, "#b8742f");
  // The box: open at the top, a few odd bits showing.
  ctx.fillStyle = linear(ctx, 0, hs.y - 40, 0, hs.y, [
    [0, "#8a5a2e"],
    [1, "#4f3018"],
  ]);
  ctx.fillRect(hs.x + 240, hs.y - 38, 72, 38);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(hs.x + 240, hs.y - 38, 72, 38);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(hs.x + 270, hs.y - 26, 12, 12);
  gear(ctx, hs.x + 256, hs.y - 40, 9, 6, PAL.brass);

  // Hanging tools between the bench and the platform.
  dividers(ctx, 1520, 300, 60);

  // The low platform and the frame that holds the clock's five places: the game's own frame, not the clock's look.
  const pf = JR_PLATFORM;
  ctx.fillStyle = linear(ctx, 0, pf.y, 0, floor, [
    [0, "#9a6230"],
    [1, PAL.woodDark],
  ]);
  ctx.fillRect(pf.x, pf.y, pf.w, floor - pf.y + 4);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(pf.x, pf.y, pf.w, floor - pf.y + 4);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(pf.x, pf.y, pf.w, 4);
  const top = 180;
  const left = pf.x + 26;
  const right = pf.x + pf.w - 80;
  // Two posts and an arched beam.
  for (const x of [left, right]) {
    ctx.fillStyle = linear(ctx, x, 0, x + 22, 0, [
      [0, "#a8703c"],
      [1, PAL.woodDark],
    ]);
    ctx.fillRect(x, top, 22, pf.y - top);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x, top, 22, pf.y - top);
  }
  ctx.beginPath();
  ctx.moveTo(left, top + 20);
  ctx.quadraticCurveTo((left + right + 22) / 2, top - 60, right + 22, top + 20);
  ctx.lineTo(right + 22, top + 4);
  ctx.quadraticCurveTo((left + right + 22) / 2, top - 78, left, top + 4);
  ctx.closePath();
  fillStroke(ctx, PAL.brass, INK, 2);
  for (let i = 0; i < 7; i++) {
    const t = (i + 0.5) / 7;
    const x = left + t * (right + 22 - left);
    const y = top + 12 - Math.sin(t * Math.PI) * 64;
    starTile(ctx, x, y, 6, i % 2 ? "#2b4fa3" : "#c2643a", "#f3dfa8");
  }
  // The road the motion takes, from place to place, as a dotted line.
  ctx.strokeStyle = "rgba(255,227,154,0.45)";
  ctx.lineWidth = 6;
  ctx.setLineDash([4, 14]);
  ctx.beginPath();
  JR_PLACES.forEach((pl, i) => (i ? ctx.lineTo(pl.x, pl.y) : ctx.moveTo(pl.x, pl.y)));
  ctx.stroke();
  ctx.setLineDash([]);
  // Each place: a plinth on a strut, its number as dots on its front (no numeral, so no language is left out).
  JR_PLACES.forEach((pl, i) => {
    ctx.fillStyle = PAL.woodDark;
    ctx.fillRect(pl.x - 6, pl.plinth + 14, 12, pf.y - pl.plinth - 14);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(pl.x - 6, pl.plinth + 14, 12, pf.y - pl.plinth - 14);
    ctx.fillStyle = linear(ctx, 0, pl.plinth, 0, pl.plinth + 26, [
      [0, "#c79a55"],
      [1, "#8a5a2e"],
    ]);
    ctx.fillRect(pl.x - 56, pl.plinth, 112, 26);
    ctx.lineWidth = 2;
    ctx.strokeRect(pl.x - 56, pl.plinth, 112, 26);
    for (let d = 0; d <= i; d++) {
      ctx.beginPath();
      ctx.arc(pl.x - (i * 14) / 2 + d * 14, pl.plinth + 13, 4.5, 0, Math.PI * 2);
      fillStroke(ctx, PAL.cream, INK, 1);
    }
  });

  brush(ctx, w, h, "jazari-room", { light: [0.12, 0.3], strength: 0.7, strokes: 2400, warm: "rgba(255,190,120,0.22)", cool: "rgba(2,10,30,0.45)" });
  // The room is dark towards its ceiling and its far corner.
  ctx.fillStyle = linear(ctx, 0, 0, 0, 240, [
    [0, "rgba(2,10,24,0.65)"],
    [1, "rgba(2,10,24,0)"],
  ]);
  ctx.fillRect(0, 0, w, 240);
  ctx.fillStyle = linear(ctx, w - 500, 0, w, 0, [
    [0, "rgba(2,10,24,0)"],
    [1, "rgba(2,10,24,0.4)"],
  ]);
  ctx.fillRect(w - 500, 0, 500, h);
  // The window's light lies warm on the wall around it.
  ctx.fillStyle = radial(ctx, win.x + win.w / 2, win.y + win.h * 0.6, 20, 420, [
    [0, "rgba(255,190,110,0.28)"],
    [1, "rgba(255,190,110,0)"],
  ]);
  ctx.fillRect(0, 0, 900, floor);
  return p;
}

/** One part of the clock, 120 by 120, the same picture as on the bench. */
export function partArt(scale: number, id: string): Painted {
  const [p, ctx] = sheet(120, 120, scale);
  ctx.translate(60, 60);
  drawPart(ctx, id);
  return p;
}

/** The clock's lever: a wooden handle with a brass knob, on a pivot block. Drawn upright; the scene leans it. */
export function lever(scale: number): Painted {
  const [p, ctx] = sheet(60, 120, scale);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(30, 112);
  ctx.lineTo(30, 22);
  ctx.stroke();
  ctx.strokeStyle = PAL.wood;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(30, 112);
  ctx.lineTo(30, 22);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(30, 18, 13, 0, Math.PI * 2);
  fillStroke(ctx, PAL.gold, INK, 2);
  return p;
}
/** The lever's pivot block on the platform. */
export function leverBase(scale: number): Painted {
  const [p, ctx] = sheet(70, 34, scale);
  blob(ctx, [
    [6, 32],
    [10, 6],
    [60, 6],
    [64, 32],
  ]);
  fillStroke(ctx, PAL.brass, INK, 2);
  ctx.beginPath();
  ctx.arc(35, 12, 6, 0, Math.PI * 2);
  fillStroke(ctx, PAL.woodDark, INK, 1.4);
  return p;
}
/** A ball of the clock, as it passes along the road. */
export function ballArt(scale: number): Painted {
  const [p, ctx] = sheet(28, 28, scale);
  ctx.beginPath();
  ctx.arc(14, 14, 10, 0, Math.PI * 2);
  fillStroke(ctx, PAL.goldLight, INK, 2);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.arc(10, 10, 3, 0, Math.PI * 2);
  ctx.fill();
  return p;
}
