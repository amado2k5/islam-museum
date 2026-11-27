// Al-Tusi's observatory, drawn in code in the art bible's style and palette: a hall at night with a tall opening on the
// stars, shelves of books (the record names a large library), a long table and a high shelf of plain instruments, and in
// the middle the stand that holds the model of the two circles. A trial picture, like every picture in this game.
//
// What it is not. It is no real building and no picture of the observatory at Maragha, and it has no inscription and no
// writing: the books are coloured spines, nothing more. The instruments are simple shapes (rings on small stands, rods,
// boxes) and none is drawn as, or claims to be, a named historical instrument. The model's stand, its levers and its
// crank are the game's own way of setting and turning the two circles. The circles themselves, the point and the path
// are drawn each frame by the scene (scenes/tusi.ts) from the quest's own arithmetic, not painted here.
import { Rng } from "@im/kernel/prng";
import { TSR_BASE, TSR_BOOKS, TSR_CRANK, TSR_HIGH_SHELF, TSR_MODEL, TSR_OPENING, TSR_TABLE, TSR_WORLD } from "../content/tusi-room";
import { INK, PAL, blob, brush, fillStroke, linear, radial, sheet, starTile, type Ctx, type Painted } from "./kit";

function shelfBoard(ctx: Ctx, x: number, y: number, w: number): void {
  ctx.fillStyle = linear(ctx, 0, y, 0, y + 14, [
    [0, "#a8703c"],
    [1, PAL.woodDark],
  ]);
  ctx.fillRect(x, y, w, 12);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x, y, w, 12);
}
/** A ring standing on a small foot: a plain shape, no named instrument. */
function ringOnFoot(ctx: Ctx, x: number, base: number, r: number, colour: string): void {
  ctx.fillStyle = PAL.woodDark;
  ctx.fillRect(x - 3, base - r * 0.9, 6, r * 0.9);
  blob(ctx, [
    [x - r * 0.5, base],
    [x - r * 0.3, base - 8],
    [x + r * 0.3, base - 8],
    [x + r * 0.5, base],
  ]);
  fillStroke(ctx, PAL.wood, INK, 1.4);
  ctx.beginPath();
  ctx.arc(x, base - r * 0.9 - r, r, 0, Math.PI * 2);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3.5;
  ctx.stroke();
}
/** A rod lying on a surface. */
function rod(ctx: Ctx, x: number, y: number, len: number): void {
  blob(ctx, [
    [x, y - 5],
    [x + len, y - 7],
    [x + len, y],
    [x, y],
  ]);
  fillStroke(ctx, PAL.brass, INK, 1.4);
}
/** A small closed box. */
function box(ctx: Ctx, x: number, y: number, w: number, h: number, colour: string): void {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y - h, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x, y - h, w, h);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(x + w / 2 - 4, y - h / 2 - 3, 8, 6);
}
/** A row of books, spines out: coloured bands with no writing. */
function books(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  const colours = ["#7a2f2a", "#2b4fa3", "#2f6b4a", "#8a5a2e", "#5a3a6a", "#a8352e", "#1d6f78"];
  for (let bx = x + 8; bx < x + w - 14; ) {
    const bw = rng.range(10, 18);
    const bh = rng.range(54, 92);
    const lean = rng.chance(0.1);
    ctx.save();
    ctx.translate(bx, y);
    if (lean) ctx.rotate(-0.18);
    ctx.fillStyle = colours[Math.floor(rng.range(0, colours.length))]!;
    ctx.fillRect(0, -bh, bw, bh);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(0, -bh, bw, bh);
    ctx.fillStyle = "rgba(242,185,75,0.55)";
    ctx.fillRect(1, -bh + 8, bw - 2, 3);
    ctx.fillRect(1, -14, bw - 2, 3);
    ctx.restore();
    bx += bw + (lean ? 8 : 1);
  }
}

/** The whole hall behind the figures and the model, 2400 by 720 game pixels. */
export function tusiRoom(scale: number): Painted {
  const w = TSR_WORLD.width;
  const h = TSR_WORLD.height;
  const floor = TSR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-tusi-room");

  // The wall: night blue above, warm stone low down.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#0c1a3a"],
    [0.55, "#22305a"],
    [1, "#4a4058"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 300; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(180,200,255,${rng.range(0.015, 0.04)})` : `rgba(4,8,24,${rng.range(0.03, 0.08)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // Pointed arches along the wall, plain, without writing.
  ctx.strokeStyle = "rgba(201,151,58,0.35)";
  ctx.lineWidth = 4;
  for (let x = 560; x < w - 200; x += 260) {
    ctx.beginPath();
    ctx.moveTo(x, 540);
    ctx.lineTo(x, 200);
    ctx.quadraticCurveTo(x, 120, x + 110, 100);
    ctx.quadraticCurveTo(x + 220, 120, x + 220, 200);
    ctx.lineTo(x + 220, 540);
    ctx.stroke();
  }
  // A band of star tiles along the wall, lapis and gold.
  ctx.fillStyle = "#1a1a34";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? "#2b4fa3" : "#1d6f78", "#e7c57c");
  // The floor: stone slabs, as in the other rooms, cooler under the night.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#8f8a7c"],
    [1, "#4a4740"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(20,20,30,0.45)";
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

  // The tall opening on the night sky, with its stars (the scene adds a few that twinkle).
  const o = TSR_OPENING;
  const open = () => {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x, o.y + 90);
    ctx.quadraticCurveTo(o.x, o.y + 10, o.x + o.w / 2, o.y);
    ctx.quadraticCurveTo(o.x + o.w, o.y + 10, o.x + o.w, o.y + 90);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.closePath();
  };
  ctx.save();
  open();
  ctx.fillStyle = linear(ctx, 0, o.y, 0, o.y + o.h, [
    [0, "#020818"],
    [0.7, "#0e2350"],
    [1, "#2a3c6e"],
  ]);
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < 90; i++) {
    const x = rng.range(o.x, o.x + o.w);
    const y = rng.range(o.y, o.y + o.h * 0.85);
    const r = rng.chance(0.15) ? rng.range(1.6, 2.6) : rng.range(0.6, 1.4);
    ctx.fillStyle = `rgba(255,250,225,${rng.range(0.5, 1)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Low hills far away under the sky.
  ctx.fillStyle = "#0a1428";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y + o.h);
  ctx.quadraticCurveTo(o.x + o.w * 0.3, o.y + o.h - 60, o.x + o.w * 0.6, o.y + o.h - 30);
  ctx.quadraticCurveTo(o.x + o.w * 0.85, o.y + o.h - 10, o.x + o.w, o.y + o.h - 40);
  ctx.lineTo(o.x + o.w, o.y + o.h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  open();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#b8955a";
  open();
  ctx.stroke();
  ctx.fillStyle = "#b8955a";
  ctx.fillRect(o.x - 18, o.y + o.h, o.w + 36, 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(o.x - 18, o.y + o.h, o.w + 36, 14);

  // The shelves of books: a tall case, its two upper shelves perches.
  const bk = TSR_BOOKS;
  ctx.fillStyle = linear(ctx, bk.x, 0, bk.x + bk.w, 0, [
    [0, "#3a2414"],
    [1, "#2a180c"],
  ]);
  ctx.fillRect(bk.x - 10, bk.top - 20, bk.w + 20, floor - bk.top + 20);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(bk.x - 10, bk.top - 20, bk.w + 20, floor - bk.top + 20);
  for (const y of [...bk.shelves, 530]) {
    books(ctx, rng, bk.x, y, bk.w);
    shelfBoard(ctx, bk.x, y, bk.w);
  }
  shelfBoard(ctx, bk.x - 10, bk.top - 24, bk.w + 20);

  // The stand of the model: a broad base (a perch), a column, and a fork that holds the large circle.
  const base = TSR_BASE;
  const m = TSR_MODEL;
  ctx.fillStyle = linear(ctx, 0, base.y, 0, floor, [
    [0, "#9a7a4a"],
    [1, "#5a4428"],
  ]);
  ctx.fillRect(base.x, base.y, base.w, floor - base.y + 4);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(base.x, base.y, base.w, floor - base.y + 4);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(base.x, base.y, base.w, 4);
  ctx.fillStyle = linear(ctx, m.x - 16, 0, m.x + 16, 0, [
    [0, "#b88a40"],
    [1, "#6a4a1e"],
  ]);
  ctx.fillRect(m.x - 14, m.y + m.r + 10, 28, base.y - (m.y + m.r + 10));
  ctx.strokeRect(m.x - 14, m.y + m.r + 10, 28, base.y - (m.y + m.r + 10));
  ctx.beginPath();
  ctx.moveTo(m.x - m.r - 18, m.y);
  ctx.quadraticCurveTo(m.x - m.r - 18, m.y + m.r + 26, m.x, m.y + m.r + 26);
  ctx.quadraticCurveTo(m.x + m.r + 18, m.y + m.r + 26, m.x + m.r + 18, m.y);
  ctx.lineTo(m.x + m.r + 8, m.y);
  ctx.quadraticCurveTo(m.x + m.r + 8, m.y + m.r + 14, m.x, m.y + m.r + 14);
  ctx.quadraticCurveTo(m.x - m.r - 8, m.y + m.r + 14, m.x - m.r - 8, m.y);
  ctx.closePath();
  fillStroke(ctx, PAL.brass, INK, 2);
  // The post on the base that holds the crank's axle.
  ctx.fillStyle = linear(ctx, TSR_CRANK.x - 9, 0, TSR_CRANK.x + 9, 0, [
    [0, "#b88a40"],
    [1, "#6a4a1e"],
  ]);
  ctx.fillRect(TSR_CRANK.x - 8, TSR_CRANK.y, 16, base.y - TSR_CRANK.y);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(TSR_CRANK.x - 8, TSR_CRANK.y, 16, base.y - TSR_CRANK.y);
  // The dark disc behind the circles, so that the moving parts read on it.
  ctx.beginPath();
  ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(6,14,34,0.7)";
  ctx.fill();

  // The long table of instruments (a perch): rings on small feet, rods and boxes.
  const tb = TSR_TABLE;
  ctx.fillStyle = PAL.woodDark;
  for (const lx of [tb.x + 20, tb.x + tb.w - 44]) {
    ctx.fillRect(lx, tb.y + 12, 24, floor - tb.y - 12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(lx, tb.y + 12, 24, floor - tb.y - 12);
  }
  ctx.fillStyle = linear(ctx, 0, tb.y, 0, tb.y + 22, [
    [0, "#b97a40"],
    [1, PAL.wood],
  ]);
  ctx.fillRect(tb.x - 10, tb.y, tb.w + 20, 22);
  ctx.strokeRect(tb.x - 10, tb.y, tb.w + 20, 22);
  ringOnFoot(ctx, tb.x + 50, tb.y, 26, PAL.brass);
  ringOnFoot(ctx, tb.x + 130, tb.y, 18, PAL.goldLight);
  rod(ctx, tb.x + 170, tb.y, 90);
  box(ctx, tb.x + 280, tb.y, 60, 30, "#5a3a6a");
  ringOnFoot(ctx, tb.x + 360, tb.y, 14, PAL.brass);

  // The high shelf (a perch), with more instruments; the feather has fallen among them.
  const hs = TSR_HIGH_SHELF;
  shelfBoard(ctx, hs.x, hs.y, hs.w);
  for (const bx of [hs.x + 18, hs.x + hs.w - 18]) {
    ctx.beginPath();
    ctx.moveTo(bx - 8, hs.y + 12);
    ctx.quadraticCurveTo(bx - 6, hs.y + 34, bx + 8, hs.y + 40);
    ctx.lineTo(bx + 8, hs.y + 12);
    ctx.closePath();
    fillStroke(ctx, PAL.wood, INK, 1.6);
  }
  ringOnFoot(ctx, hs.x + 40, hs.y, 20, PAL.brass);
  box(ctx, hs.x + 80, hs.y, 50, 26, "#2f6b4a");
  ringOnFoot(ctx, hs.x + 170, hs.y, 16, PAL.goldLight);
  rod(ctx, hs.x + 196, hs.y, 30);
  ringOnFoot(ctx, hs.x + 270, hs.y, 18, PAL.brass);

  brush(ctx, w, h, "tusi-room", { light: [0.08, 0.25], strength: 0.6, strokes: 2400, warm: "rgba(255,210,150,0.16)", cool: "rgba(2,8,30,0.5)" });
  // The hall is dark towards its ceiling and its far corner.
  ctx.fillStyle = linear(ctx, 0, 0, 0, 240, [
    [0, "rgba(2,6,20,0.7)"],
    [1, "rgba(2,6,20,0)"],
  ]);
  ctx.fillRect(0, 0, w, 240);
  ctx.fillStyle = linear(ctx, w - 500, 0, w, 0, [
    [0, "rgba(2,6,20,0)"],
    [1, "rgba(2,6,20,0.4)"],
  ]);
  ctx.fillRect(w - 500, 0, 500, h);
  // Cool starlight from the opening lies on the wall beside it.
  ctx.fillStyle = radial(ctx, o.x + o.w / 2, o.y + o.h * 0.6, 20, 420, [
    [0, "rgba(160,190,255,0.16)"],
    [1, "rgba(160,190,255,0)"],
  ]);
  ctx.fillRect(0, 0, 900, floor);
  return p;
}

/** The knob that tells one lever from another by its shape: round for the direction, square for the speed, a ring for
 * the size. */
export type Knob = "round" | "square" | "ring";
/** A plain lever: a wooden handle with a brass knob of its own shape. Drawn upright; the scene leans it. */
export function tusiLever(scale: number, knob: Knob): Painted {
  const [p, ctx] = sheet(60, 120, scale);
  for (const [width, colour] of [[12, INK], [8, PAL.wood]] as const) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(30, 112);
    ctx.lineTo(30, 26);
    ctx.stroke();
  }
  ctx.beginPath();
  if (knob === "square") ctx.rect(16, 6, 28, 26);
  else ctx.arc(30, 18, 14, 0, Math.PI * 2);
  fillStroke(ctx, PAL.gold, INK, 2);
  if (knob === "ring") {
    ctx.beginPath();
    ctx.arc(30, 18, 6, 0, Math.PI * 2);
    fillStroke(ctx, PAL.woodDark, INK, 1.6);
  }
  return p;
}
/** A lever's pivot block, with a mark for each place the lever can stand in. */
export function tusiLeverBase(scale: number, places: number): Painted {
  const [p, ctx] = sheet(80, 40, scale);
  blob(ctx, [
    [6, 38],
    [12, 10],
    [68, 10],
    [74, 38],
  ]);
  fillStroke(ctx, PAL.brass, INK, 2);
  for (let i = 0; i < places; i++) {
    const a = places === 1 ? 0 : -0.5 + i / (places - 1);
    ctx.beginPath();
    ctx.arc(40 + Math.sin(a) * 26, 30 - Math.cos(a) * 14, 3, 0, Math.PI * 2);
    fillStroke(ctx, PAL.cream, INK, 1);
  }
  ctx.beginPath();
  ctx.arc(40, 18, 6, 0, Math.PI * 2);
  fillStroke(ctx, PAL.woodDark, INK, 1.4);
  return p;
}
/** The crank: a spoked wheel with a handle, drawn centred; the scene turns it. */
export function tusiCrank(scale: number): Painted {
  const [p, ctx] = sheet(110, 110, scale);
  const c = 55;
  ctx.beginPath();
  ctx.arc(c, c, 38, 0, Math.PI * 2);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.strokeStyle = PAL.brass;
  ctx.lineWidth = 6;
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.cos(a) * 36, c + Math.sin(a) * 36);
    ctx.stroke();
    ctx.strokeStyle = PAL.wood;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(c, c, 8, 0, Math.PI * 2);
  fillStroke(ctx, PAL.gold, INK, 1.6);
  // The handle, on the rim.
  ctx.beginPath();
  ctx.arc(c + 38, c, 9, 0, Math.PI * 2);
  fillStroke(ctx, PAL.wood, INK, 2);
  return p;
}
