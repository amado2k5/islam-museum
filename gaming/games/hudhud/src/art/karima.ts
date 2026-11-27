// Karima al-Marwaziyya's room, drawn in code in the art bible's style and palette: a plain, quiet room of a house with one
// window of light, low cushions on the floor, a tall bookcase of books with plain covers by the far end (a stack of spare
// copies on its top), and in the middle the reading stands, one long stand for each copy, one above another, each holding
// its copy as a row of cells with one of the quest's drawn signs in each. A trial picture, like every picture in this game.
//
// What it is not. It is no real room and no picture of Karima al-Marwaziyya's home. The record says she lived near the
// sanctuary at Mecca, and the game shows only an ordinary room: no sanctuary, no Kaaba, no mosque and no sacred place is
// drawn, and there is no inscription and no writing of any script anywhere: the books are plain covers, the spare copies
// plain folded sheets, the band on the wall plain stripes and diamonds. The copies are the page quest's own drawing
// (art/collate.ts: drawSign, seal, dots and slipRing, shared and not copied): plain shapes, never a letter, a word or a
// stroke made to look like script, and nothing of any religious text. Nothing here draws text: a test holds it to that.
import { Rng } from "@im/kernel/prng";
import { KRR_CUSHIONS, KRR_SHELF, KRR_STANDS, KRR_WINDOW, KRR_WORLD, cellOf, rowsOf } from "../content/karima-room";
import { drawSign, dots, seal, slipRing } from "./collate";
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
function board(ctx: Ctx, x: number, y: number, w: number, h: number, top = "#b47a42", bottom: string = PAL.wood): void {
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h + 2, [
    [0, top],
    [1, bottom],
  ]);
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x, y, w, h);
}
/** Books with plain covers, spines out: coloured bands with no writing and no mark on them. */
function books(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  const colours = ["#7a4a2a", "#2f5a6a", "#5a6a3a", "#8a6a4a", "#4a4a6a", "#6a3a3a"];
  for (let bx = x + 6; bx < x + w - 14; ) {
    const bw = rng.range(11, 18);
    const bh = rng.range(54, 86);
    ctx.fillStyle = colours[Math.floor(rng.range(0, colours.length))]!;
    ctx.fillRect(bx, y - bh, bw, bh);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(bx, y - bh, bw, bh);
    bx += bw + 1;
  }
}

/** The whole room behind the stands and the figures, 2400 by 720 game pixels. */
export function karimaRoom(scale: number): Painted {
  const w = KRR_WORLD.width;
  const h = KRR_WORLD.height;
  const floor = KRR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-karima-room");

  // The wall: pale lime plaster, a little warmer near the window.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#efe4cc"],
    [0.65, "#e2d2b0"],
    [1, "#cdb68c"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 180; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.55) ? `rgba(255,248,230,${rng.range(0.04, 0.1)})` : `rgba(110,80,40,${rng.range(0.02, 0.05)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // A plain painted band low on the wall: two stripes and a row of small diamonds, no writing.
  ctx.fillStyle = "#8a6a4a";
  ctx.fillRect(0, 560, w, 50);
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(0, 556, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 25; x < w; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 572);
    ctx.lineTo(x + 12, 585);
    ctx.lineTo(x, 598);
    ctx.lineTo(x - 12, 585);
    ctx.closePath();
    fillStroke(ctx, x % 100 === 25 ? PAL.teal : PAL.ochre, null);
  }
  // The floor: plain fired tiles, warm and worn.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#b58a5c"],
    [1, "#7a5432"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(60,36,16,0.35)";
  ctx.lineWidth = 1.6;
  for (const y of [floor + 30, floor + 66]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 0; x < w; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, floor);
    ctx.lineTo(x - 10, h);
    ctx.stroke();
  }

  // The one window of light: a plain arch with a wooden lattice, and the light it lets fall across the wall and the floor.
  const o = KRR_WINDOW;
  const arch = () => {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x, o.y + o.w / 2);
    ctx.arc(o.x + o.w / 2, o.y + o.w / 2, o.w / 2, Math.PI, 0);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.closePath();
  };
  ctx.fillStyle = "rgba(255,240,205,0.18)";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y + o.h);
  ctx.lineTo(o.x + o.w, o.y + o.h);
  ctx.lineTo(o.x + o.w + 220, floor + 70);
  ctx.lineTo(o.x + 120, floor + 70);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  arch();
  ctx.fillStyle = linear(ctx, 0, o.y, 0, o.y + o.h, [
    [0, "#a9d2ea"],
    [0.7, "#f3e7c6"],
    [1, "#fff4d8"],
  ]);
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = "rgba(110,72,36,0.85)";
  ctx.lineWidth = 3;
  for (let x = o.x + o.w / 4; x < o.x + o.w - 4; x += o.w / 4) {
    ctx.beginPath();
    ctx.moveTo(x, o.y);
    ctx.lineTo(x, o.y + o.h);
    ctx.stroke();
  }
  for (let y = o.y + 100; y < o.y + o.h; y += 60) {
    ctx.beginPath();
    ctx.moveTo(o.x, y);
    ctx.lineTo(o.x + o.w, y);
    ctx.stroke();
  }
  ctx.restore();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#8a5a30";
  arch();
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  arch();
  ctx.stroke();
  board(ctx, o.x - 16, o.y + o.h, o.w + 32, 14, "#c08a52", "#8a5a30");

  // A plain rug and the low cushions on the floor under the window.
  const cu = KRR_CUSHIONS;
  rounded(ctx, cu.x - 20, floor - 6, cu.w + 40, 16, 6);
  fillStroke(ctx, "#9a4a3a", INK, 1.6);
  ctx.strokeStyle = "rgba(243,230,200,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cu.x - 10, floor + 2);
  ctx.lineTo(cu.x + cu.w + 10, floor + 2);
  ctx.stroke();
  const cushions = ["#2f6f6a", "#c2643a", "#d49a45", "#3d4f6b"];
  for (let i = 0; i < 4; i++) {
    const cx = cu.x + 20 + i * ((cu.w - 40) / 3);
    blob(ctx, [
      [cx - 48, floor - 6],
      [cx - 44, floor - 40],
      [cx, floor - 48],
      [cx + 44, floor - 40],
      [cx + 48, floor - 6],
    ]);
    fillStroke(ctx, cushions[i]!, INK, 2);
    ctx.strokeStyle = "rgba(243,230,200,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 36, floor - 26);
    ctx.lineTo(cx + 36, floor - 26);
    ctx.stroke();
  }

  // The tall bookcase by the far end: its top and its two shelves are perches; the stack of spare copies is placed on its top by the scene.
  const sh = KRR_SHELF;
  ctx.fillStyle = linear(ctx, sh.x, 0, sh.x + sh.w, 0, [
    [0, "#7a4a26"],
    [1, "#5a3418"],
  ]);
  ctx.fillRect(sh.x - 10, sh.top, sh.w + 20, floor - sh.top);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(sh.x - 10, sh.top, sh.w + 20, floor - sh.top);
  books(ctx, rng, sh.x, sh.shelves[0], sh.w);
  books(ctx, rng, sh.x, sh.shelves[1], sh.w);
  books(ctx, rng, sh.x, 580, sh.w);
  for (const y of [...sh.shelves, 580]) board(ctx, sh.x, y, sh.w, 12);
  board(ctx, sh.x - 14, sh.top, sh.w + 28, 12);

  brush(ctx, w, h, "karima-room", { light: [0.12, 0.15], strength: 0.42, strokes: 2000, warm: "rgba(255,240,205,0.16)", cool: "rgba(60,44,24,0.14)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the stands
/** Where the stands' picture begins in the room, and its size: from a little left of the stands to a little right, from above the top row to the floor. */
export function standsBox(copies: number): { x: number; y: number; w: number; h: number } {
  const top = rowsOf(copies)[0]! - KRR_STANDS.cellH / 2 - 22;
  return { x: KRR_STANDS.left - 20, y: top, w: KRR_STANDS.right - KRR_STANDS.left + 40, h: KRR_WORLD.floor + 4 - top };
}
/**
 * The reading stands for so many copies, one above another: for each, a long board sloping a little back behind its row,
 * and a ledge at its foot on which the row's cells stand (the ledge is the perch). The back stands' legs go down behind
 * the front ones. Plain wood; nothing written.
 */
export function standsArt(scale: number, copies: number): Painted {
  const box = standsBox(copies);
  const [p, ctx] = sheet(box.w, box.h, scale);
  const X = (x: number) => x - box.x;
  const Y = (y: number) => y - box.y;
  const rows = rowsOf(copies);
  const half = KRR_STANDS.cellH / 2;
  rows.forEach((y, i) => {
    // The legs, down to the floor, behind the stands in front of this one.
    const ledge = y + KRR_STANDS.ledge;
    for (const x of [KRR_STANDS.left + 24, (KRR_STANDS.left + KRR_STANDS.right) / 2 - 8, KRR_STANDS.right - 40]) {
      ctx.fillStyle = i === 0 ? "#5a3418" : i === 1 ? "#6b4222" : PAL.wood;
      ctx.fillRect(X(x + i * 6), Y(ledge + 12), 16, KRR_WORLD.floor - ledge - 12);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(X(x + i * 6), Y(ledge + 12), 16, KRR_WORLD.floor - ledge - 12);
    }
    // The board, sloping a little back: wider at its foot than at its top.
    ctx.beginPath();
    ctx.moveTo(X(KRR_STANDS.left + 10), Y(y - half - 14));
    ctx.lineTo(X(KRR_STANDS.right - 10), Y(y - half - 14));
    ctx.lineTo(X(KRR_STANDS.right), Y(ledge));
    ctx.lineTo(X(KRR_STANDS.left), Y(ledge));
    ctx.closePath();
    fillStroke(ctx, linear(ctx, 0, Y(y - half - 14), 0, Y(ledge), [[0, "#9a6232"], [1, "#6b4222"]]), INK, 2);
    // The ledge at its foot.
    board(ctx, X(KRR_STANDS.left - 6), Y(ledge), KRR_STANDS.right - KRR_STANDS.left + 12, 12, "#c08a52", "#8a5a30");
  });
  brush(ctx, box.w, box.h, `karima-stands-${copies}`, { strokes: 260, strength: 0.5 });
  return p;
}

/** One cell of a copy of n signs with its sign drawn by the page quest's own code, on the page's lighter or darker parchment. */
export function cellArt(scale: number, sign: string, n: number, light: boolean): Painted {
  const { w, h } = cellOf(n);
  const [p, c] = sheet(w, h, scale);
  const bg = light ? PAL.parchment : PAL.cream;
  rounded(c, 1, 1, w - 2, h - 2, 6);
  c.fillStyle = bg;
  c.fill();
  c.strokeStyle = "rgba(74,42,20,0.7)";
  c.lineWidth = 1.4;
  c.stroke();
  c.save();
  c.translate(w / 2, h / 2);
  // The page draws a sign at 0.36 of its cell's smaller side.
  drawSign(c, sign, Math.min(w, h) * 0.36, bg);
  c.restore();
  return p;
}
/** The page's broken red ring round a marked slip, for a cell of a copy of n signs. */
export function slipArt(scale: number, n: number): Painted {
  const { w, h } = cellOf(n);
  const r = Math.min(w, h) / 2 - 2;
  const size = Math.ceil(2 * r + 10);
  const [p, c] = sheet(size, size, scale);
  slipRing(c, size / 2, size / 2, r);
  return p;
}
/**
 * The ring that shows which sign the bird is near enough to touch: a solid ring of lantern gold with a dark edge, wider
 * than a cell, so that it is told from the page's broken red ring of a marked slip by shape as well as by colour.
 */
export function focusArt(scale: number, n: number): Painted {
  const { w, h } = cellOf(n);
  const r = Math.max(w, h) / 2 + 8;
  const size = Math.ceil(2 * r + 12);
  const [p, c] = sheet(size, size, scale);
  for (const [lw, colour] of [[8, INK], [5, PAL.goldLight]] as const) {
    c.lineWidth = lw;
    c.strokeStyle = colour;
    c.beginPath();
    c.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    c.stroke();
  }
  return p;
}
/** A copy's mark at the start of its row, on the stand's wood: her copy's small seal, or the other copies' dots (the page's own marks). */
export function markArt(scale: number, copy: number, hers: boolean): Painted {
  const [p, c] = sheet(56, 64, scale);
  rounded(c, 2, 2, 52, 60, 8);
  fillStroke(c, "#5a3418", INK, 1.4);
  if (hers) seal(c, 28, 32);
  else dots(c, 28, 32, copy + 1);
  return p;
}
/** The stack of spare copies on top of the tall bookcase: plain folded sheets, a little askew, tied with a cord. Nothing is drawn or written on them. */
export function stackArt(scale: number): Painted {
  const [p, c] = sheet(120, 48, scale);
  const tilts = [-0.04, 0.05, -0.02, 0.06, -0.01];
  tilts.forEach((a, i) => {
    c.save();
    c.translate(60, 40 - i * 6);
    c.rotate(a);
    rounded(c, -46, -5, 92, 10, 2);
    fillStroke(c, i % 2 ? "#f6ecd2" : PAL.parchment, PAL.woodDark, 1.4);
    c.restore();
  });
  c.strokeStyle = "#9a6232";
  c.lineWidth = 2;
  blob(c, [
    [56, 46],
    [54, 12],
    [66, 12],
    [64, 46],
  ]);
  c.stroke();
  return p;
}
