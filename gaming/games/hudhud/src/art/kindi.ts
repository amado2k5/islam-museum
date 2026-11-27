// Al-Kindi's room, drawn in code in the art bible's style and palette: a scholar's study by lamplight, with a window on
// a night sky, a bookcase, a reading desk with an oil lamp on it, two plain count boards on stands, and on the wall a
// large board that holds the secret page, with a long shelf of sign tokens below it and a bell on a low stand beside
// it. A trial picture, like every picture in this game.
//
// What it is not. It is no real room and no picture of where al-Kindi worked, and it has no inscription, no writing and
// no letters of any script: the books are coloured spines, the torn page carries only the quest's drawn marks, and the
// signs and marks are the quest's own drawn pictures and ink shapes (art/cipher.ts). The count boards show the page's
// two tables as bars of dots, one dot for each time a sign or a mark occurs, with no digit. Nothing here draws text: a
// test holds it to that. The marks, the tiles, the places, the tokens and the count boards are placed by the scene
// (scenes/kindi.ts) from the quest's own state.
import { Rng } from "@im/kernel/prng";
import { KDR_BELL_STAND, KDR_BOARD, KDR_BOOKS, KDR_COUNTS, KDR_DESK, KDR_LAMP, KDR_SHELF, KDR_WINDOW, KDR_WORLD } from "../content/kindi-room";
import { drawMark, drawSign } from "./cipher";
import { INK, PAL, blob, brush, fillStroke, linear, radial, sheet, starTile, type Ctx, type Painted } from "./kit";

function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function board(ctx: Ctx, x: number, y: number, w: number, h: number, top = "#a8703c", bottom: string = PAL.woodDark): void {
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h + 2, [
    [0, top],
    [1, bottom],
  ]);
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x, y, w, h);
}
/** A row of books, spines out, plain coloured bands with no writing. */
function books(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  const colours = ["#6a2a26", "#22407e", "#2a5a40", "#7a4e28", "#4a3060", "#8a2e28", "#185a62"];
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
    ctx.fillStyle = "rgba(242,185,75,0.5)";
    ctx.fillRect(1, -bh + 8, bw - 2, 3);
    ctx.fillRect(1, -14, bw - 2, 3);
    ctx.restore();
    bx += bw + (lean ? 8 : 1);
  }
}

/** The whole room behind the figures and the board's pieces, 2400 by 720 game pixels. */
export function kindiRoom(scale: number): Painted {
  const w = KDR_WORLD.width;
  const h = KDR_WORLD.height;
  const floor = KDR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-kindi-room");

  // The wall by night: deep teal above, warm brown low down where the lamplight falls.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#0f2a36"],
    [0.55, "#2a3238"],
    [1, "#4a3424"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 260; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(255,220,160,${rng.range(0.015, 0.04)})` : `rgba(0,10,20,${rng.range(0.03, 0.07)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // A band of star tiles along the wall, as in the other rooms, dimmed by the night.
  ctx.fillStyle = "#3a2a1c";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? "#8a4a2c" : PAL.tealDark, "#c8b896");
  // The floor: stone slabs, darker by night.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#6a5c48"],
    [1, "#2e281e"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(20,14,8,0.5)";
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

  // The window on the night sky: deep blue, stars, a thin crescent, and a wooden lattice.
  const o = KDR_WINDOW;
  const open = () => {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x, o.y + 80);
    ctx.arc(o.x + o.w / 2, o.y + 80, o.w / 2, Math.PI, 0);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.closePath();
  };
  ctx.save();
  open();
  ctx.fillStyle = linear(ctx, 0, o.y, 0, o.y + o.h, [
    [0, PAL.night],
    [0.8, PAL.deep],
    [1, "#2a4a6a"],
  ]);
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < 46; i++) {
    ctx.fillStyle = `rgba(255,240,200,${rng.range(0.4, 0.95)})`;
    ctx.beginPath();
    ctx.arc(o.x + rng.range(6, o.w - 6), o.y + rng.range(6, o.h - 40), rng.range(0.8, 2.2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(o.x + o.w * 0.68, o.y + 70, 22, Math.PI * 0.35, Math.PI * 1.65, false);
  ctx.arc(o.x + o.w * 0.68 + 10, o.y + 70, 19, Math.PI * 1.62, Math.PI * 0.38, true);
  ctx.closePath();
  ctx.fillStyle = PAL.goldLight;
  ctx.fill();
  ctx.fillStyle = "#1a2a3a";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y + o.h);
  ctx.quadraticCurveTo(o.x + o.w * 0.4, o.y + o.h - 46, o.x + o.w, o.y + o.h - 22);
  ctx.lineTo(o.x + o.w, o.y + o.h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(50,34,20,0.85)";
  ctx.lineWidth = 3;
  for (let x = o.x + 36; x < o.x + o.w; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, o.y);
    ctx.lineTo(x, o.y + o.h);
    ctx.stroke();
  }
  for (let y = o.y + 60; y < o.y + o.h; y += 46) {
    ctx.beginPath();
    ctx.moveTo(o.x, y);
    ctx.lineTo(o.x + o.w, y);
    ctx.stroke();
  }
  ctx.restore();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#5a3820";
  open();
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  open();
  ctx.stroke();
  board(ctx, o.x - 18, o.y + o.h, o.w + 36, 14, "#6a4428", "#3a2414");

  // The bookcase: its top and its two shelves are perches; the torn page is placed on its top by the scene.
  const bk = KDR_BOOKS;
  ctx.fillStyle = linear(ctx, bk.x, 0, bk.x + bk.w, 0, [
    [0, "#4a2e1a"],
    [1, "#36200e"],
  ]);
  ctx.fillRect(bk.x - 10, bk.top, bk.w + 20, floor - bk.top);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(bk.x - 10, bk.top, bk.w + 20, floor - bk.top);
  for (const y of [...bk.shelves, 540]) {
    books(ctx, rng, bk.x, y, bk.w);
    board(ctx, bk.x, y, bk.w, 12);
  }
  board(ctx, bk.x - 14, bk.top, bk.w + 28, 12);

  // The reading desk, with a closed book lying on it, and a cushion before it. The lamp on it is drawn here; its light by the scene.
  const d = KDR_DESK;
  ctx.fillStyle = PAL.woodDark;
  for (const lx of [d.x + 10, d.x + d.w - 26]) {
    ctx.fillRect(lx, d.y + 12, 16, floor - d.y - 12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(lx, d.y + 12, 16, floor - d.y - 12);
  }
  board(ctx, d.x - 6, d.y, d.w + 12, 14, "#9a6232", PAL.wood);
  rounded(ctx, d.x + 80, d.y - 12, 56, 12, 3);
  fillStroke(ctx, "#6a2a26", INK, 1.6);
  ctx.fillStyle = "#efe2c0";
  ctx.fillRect(d.x + 82, d.y - 6, 52, 3);
  blob(ctx, [
    [d.x - 70, floor],
    [d.x - 66, floor - 18],
    [d.x - 10, floor - 20],
    [d.x - 4, floor],
  ]);
  fillStroke(ctx, "#7a3a2a", INK, 1.6);
  // The oil lamp: a clay dish with a spout and a small flame.
  const l = KDR_LAMP;
  blob(ctx, [
    [l.x - 26, l.y - 4],
    [l.x - 22, l.y - 18],
    [l.x + 18, l.y - 18],
    [l.x + 34, l.y - 24],
    [l.x + 26, l.y - 10],
    [l.x + 18, l.y - 2],
  ]);
  fillStroke(ctx, PAL.terracotta, INK, 1.8);
  blob(ctx, [
    [l.x + 30, l.y - 26],
    [l.x + 26, l.y - 40],
    [l.x + 32, l.y - 52],
    [l.x + 38, l.y - 40],
  ]);
  fillStroke(ctx, PAL.amber, null);
  // The lamplight on the wall and the floor around the desk.
  ctx.fillStyle = radial(ctx, l.x + 30, l.y - 40, 10, 420, [
    [0, "rgba(255,210,130,0.32)"],
    [0.5, "rgba(255,190,110,0.1)"],
    [1, "rgba(255,190,110,0)"],
  ]);
  ctx.fillRect(l.x - 420, l.y - 460, 840, 600);

  // The two count boards on their stands: plain frames whose bars of dots the scene places (they change with the way of playing).
  for (const x of KDR_COUNTS.xs) {
    const top = KDR_COUNTS.top;
    const bottom = top + KDR_COUNTS.h;
    ctx.fillStyle = PAL.woodDark;
    ctx.fillRect(x + KDR_COUNTS.w / 2 - 8, bottom, 16, floor - bottom);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x + KDR_COUNTS.w / 2 - 8, bottom, 16, floor - bottom);
    board(ctx, x + KDR_COUNTS.w / 2 - 40, floor - 12, 80, 12);
    rounded(ctx, x - 8, top - 8, KDR_COUNTS.w + 16, KDR_COUNTS.h + 16, 8);
    fillStroke(ctx, "#5a3820", INK, 2.2);
  }

  // The large board on the wall: a dark wooden frame around a slate-blue field, a parchment strip along its top for the
  // marks of the message, two cords for the tiles to hang from, and the ledge along its foot (a perch).
  const b = KDR_BOARD;
  rounded(ctx, b.x - 14, b.top - 14, b.w + 28, b.bottom - b.top + 28, 12);
  fillStroke(ctx, "#4a2c16", INK, 2.6);
  rounded(ctx, b.x, b.top, b.w, b.bottom - b.top, 8);
  fillStroke(ctx, linear(ctx, 0, b.top, 0, b.bottom, [
    [0, "#24414e"],
    [1, "#1a2f3a"],
  ]), INK, 1.8);
  rounded(ctx, b.x + 16, b.stripY - 24, b.w - 32, 48, 6);
  fillStroke(ctx, PAL.parchment, PAL.woodDark, 2);
  ctx.strokeStyle = "rgba(201,151,58,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(b.x + 16, b.tileY - 52);
  ctx.lineTo(b.x + b.w - 16, b.tileY - 52);
  ctx.stroke();
  for (const x of [b.x + 16, b.x + b.w - 16]) {
    ctx.beginPath();
    ctx.arc(x, b.tileY - 52, 5, 0, Math.PI * 2);
    fillStroke(ctx, PAL.brass, INK, 1.4);
  }
  board(ctx, b.x - 20, b.ledge, b.w + 40, 14);

  // The long shelf for the tokens, on two brackets.
  const s = KDR_SHELF;
  for (const x of [s.x + 30, s.x + s.w - 50]) {
    blob(ctx, [
      [x, s.y + 12],
      [x + 20, s.y + 12],
      [x + 20, s.y + 52],
    ]);
    fillStroke(ctx, PAL.woodDark, INK, 1.6);
  }
  board(ctx, s.x - 10, s.y, s.w + 20, 14);

  // The bell's low stand: two posts and a crossbar the bell hangs from, on a plain step (a perch).
  const bs = KDR_BELL_STAND;
  board(ctx, bs.x, bs.y, bs.w, 14);
  ctx.fillStyle = PAL.woodDark;
  ctx.fillRect(bs.x + 14, bs.y + 14, 14, floor - bs.y - 14);
  ctx.fillRect(bs.x + bs.w - 28, bs.y + 14, 14, floor - bs.y - 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(bs.x + 14, bs.y + 14, 14, floor - bs.y - 14);
  ctx.strokeRect(bs.x + bs.w - 28, bs.y + 14, 14, floor - bs.y - 14);
  for (const x of [bs.x + 4, bs.x + bs.w - 12]) board(ctx, x, bs.y - 110, 8, 110);
  board(ctx, bs.x - 4, bs.y - 118, bs.w + 8, 10);

  brush(ctx, w, h, "kindi-room", { light: [0.27, 0.7], strength: 0.55, strokes: 2400, warm: "rgba(255,210,150,0.14)", cool: "rgba(0,10,30,0.3)" });
  // Darker towards the ceiling and the far corner.
  ctx.fillStyle = linear(ctx, 0, 0, 0, 200, [
    [0, "rgba(0,8,20,0.45)"],
    [1, "rgba(0,8,20,0)"],
  ]);
  ctx.fillRect(0, 0, w, 200);
  ctx.fillStyle = linear(ctx, w - 500, 0, w, 0, [
    [0, "rgba(0,8,20,0)"],
    [1, "rgba(0,8,20,0.3)"],
  ]);
  ctx.fillRect(w - 500, 0, 500, h);
  return p;
}

// ---------------------------------------------------------------------------------------------- the pieces
/** A plain tile hung by a short cord: a parchment square in a thin wooden edge. The mark is placed on it by the scene. */
export function tile(scale: number): Painted {
  const [p, c] = sheet(84, 104, scale);
  c.strokeStyle = PAL.brass;
  c.lineWidth = 2.4;
  c.beginPath();
  c.moveTo(30, 22);
  c.lineTo(42, 2);
  c.lineTo(54, 22);
  c.stroke();
  rounded(c, 4, 20, 76, 80, 8);
  fillStroke(c, "#6a4428", INK, 2);
  rounded(c, 10, 26, 64, 68, 5);
  fillStroke(c, PAL.parchment, null);
  return p;
}
/** One mark of the quest, in ink, on nothing: for the tiles and the strip. */
export function markArt(scale: number, id: string): Painted {
  const [p, c] = sheet(70, 70, scale);
  drawMark(c, id, 35, 35, 1);
  return p;
}
/** One sign of the quest, its own coloured picture, on nothing: for the tokens, the places and the beak. */
export function signArt(scale: number, id: string): Painted {
  const [p, c] = sheet(80, 80, scale);
  drawSign(c, id, 40, 40, 1);
  return p;
}
/** The opening: a short red line, 40 by 3, drawn under the first two marks of the message, as on the page's picture. */
export function openingLine(scale: number): Painted {
  const [p, c] = sheet(40, 3, scale);
  c.fillStyle = PAL.red;
  c.fillRect(0, 0, 40, 3);
  return p;
}
/** The place under a tile for the sign given to its mark: a dashed frame while it is empty, a solid lapis one once it has a sign. */
export function slotArt(scale: number, given: boolean): Painted {
  const [p, c] = sheet(72, 72, scale);
  rounded(c, 4, 4, 64, 64, 10);
  if (given) {
    c.fillStyle = "rgba(234,217,176,0.9)";
    c.fill();
    c.strokeStyle = PAL.lapis;
    c.lineWidth = 3.4;
    c.stroke();
  } else {
    c.fillStyle = "rgba(234,217,176,0.22)";
    c.fill();
    c.setLineDash([6, 6]);
    c.strokeStyle = PAL.cream;
    c.lineWidth = 2.6;
    c.stroke();
    c.setLineDash([]);
  }
  return p;
}
/** The small round stand a token rests on, on the shelf. */
export function tokenBase(scale: number): Painted {
  const [p, c] = sheet(70, 30, scale);
  c.beginPath();
  c.ellipse(35, 18, 30, 9, 0, 0, Math.PI * 2);
  fillStroke(c, "#8a5a2e", INK, 1.8);
  c.beginPath();
  c.ellipse(35, 15, 22, 5, 0, 0, Math.PI * 2);
  c.fillStyle = "rgba(255,230,170,0.25)";
  c.fill();
  return p;
}
/** The torn page lying on top of the bookcase: parchment with a ragged edge and a few of the quest's ink marks on it. */
export function tornPage(scale: number): Painted {
  const [p, c] = sheet(110, 60, scale);
  blob(c, [
    [6, 52],
    [10, 12],
    [34, 8],
    [42, 16],
    [60, 6],
    [102, 10],
    [96, 30],
    [104, 54],
  ]);
  fillStroke(c, PAL.parchment, PAL.woodDark, 2);
  for (const [id, x, y] of [
    ["m1", 26, 28],
    ["m4", 48, 34],
    ["m2", 70, 26],
    ["m6", 86, 40],
  ] as const)
    drawMark(c, id, x, y, 0.26);
  return p;
}
/** A small brass bell hung from a short strap, with its clapper showing below its lip. */
export function bell(scale: number): Painted {
  const [p, c] = sheet(70, 84, scale);
  c.strokeStyle = "#5a3418";
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(35, 0);
  c.lineTo(35, 18);
  c.stroke();
  blob(c, [
    [10, 66],
    [16, 54],
    [18, 32],
    [26, 20],
    [44, 20],
    [52, 32],
    [54, 54],
    [60, 66],
  ]);
  fillStroke(c, linear(c, 10, 0, 60, 0, [
    [0, "#f0c868"],
    [0.6, PAL.brass],
    [1, "#8f6420"],
  ]), INK, 2.4);
  c.fillStyle = "rgba(255,245,210,0.55)";
  c.fillRect(22, 30, 5, 26);
  c.beginPath();
  c.arc(35, 72, 7, 0, Math.PI * 2);
  fillStroke(c, "#8f6420", INK, 1.8);
  return p;
}

/** One row of a count board: a sign or a mark, and how many times it occurs. */
export interface CountRow {
  kind: "sign" | "mark";
  id: string;
  count: number;
}
/**
 * A count board: the page's table of counts drawn as bars, from most to fewest. Each row is the sign or the mark, then a
 * bar of dots, one dot for each time it occurs; the longest bar is the commonest. No digit and no word: the list under
 * the stage gives the counts in words and numbers. On a page read right to left the board is mirrored, the bars growing
 * from the right. A small picture at its head says which it is: a whole page of signs, or a sealed message of marks.
 */
export function countBoard(scale: number, rows: readonly CountRow[], rtl: boolean, of: "sample" | "message"): Painted {
  const W = KDR_COUNTS.w;
  const H = KDR_COUNTS.h;
  const [p, c] = sheet(W, H, scale);
  rounded(c, 0, 0, W, H, 6);
  fillStroke(c, PAL.parchment, PAL.woodDark, 2);
  const X = (x: number) => (rtl ? W - x : x);
  // The head: a little page with a sun on it (the whole page), or a folded message with a mark on it.
  c.save();
  c.translate(W / 2, 20);
  rounded(c, -16, -12, 32, 24, 3);
  fillStroke(c, of === "sample" ? "#fbf0cf" : "#e0cfa4", PAL.woodDark, 1.6);
  if (of === "sample") drawSign(c, "sun", 0, 0, 0.24);
  else drawMark(c, "m1", 0, 0, 0.24);
  c.restore();
  c.strokeStyle = "rgba(74,42,20,0.5)";
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(8, 38);
  c.lineTo(W - 8, 38);
  c.stroke();
  const rowH = Math.min(24, (H - 48) / Math.max(1, rows.length));
  const most = Math.max(1, ...rows.map((r) => r.count));
  const pitch = Math.min(6.2, (W - 46) / most);
  rows.forEach((r, i) => {
    const y = 48 + rowH * (i + 0.5);
    if (r.kind === "sign") drawSign(c, r.id, X(18), y, 0.24);
    else drawMark(c, r.id, X(18), y, 0.28);
    // The bar: a pale band as long as the count, with one dot for each time.
    const x0 = 34;
    const len = r.count * pitch;
    c.fillStyle = "rgba(43,79,163,0.16)";
    c.fillRect(rtl ? W - x0 - len - 2 : x0 - 2, y - 5, len + 4, 10);
    c.fillStyle = PAL.lapis;
    for (let k = 0; k < r.count; k++) {
      c.beginPath();
      c.arc(X(x0 + pitch * (k + 0.5)), y, Math.min(2.4, pitch * 0.38), 0, Math.PI * 2);
      c.fill();
    }
  });
  return p;
}
