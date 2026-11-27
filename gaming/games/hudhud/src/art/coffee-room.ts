// The coffee room, drawn in code in the art bible's style and palette: a quiet room of records in a coffee-trading town
// in the late afternoon, with a latticed window high on the wall near where the bird comes in, a low bench under it with
// a brass coffee pot and small cups on a round tray (decoration only), the long low table the cards wait on, a plain
// brass bell at its far end, and along the back wall a bookcase of three shelves, each marked at the end the page begins
// from by the coffee quest's own shelf sign (the solid seal, the two speech marks, the cloud: art/coffee.ts, shared and
// not copied) and by one, two or three dots, with a box of spare blank cards on top of it. The cards are the quest's own
// small scrolls, each with its plain sign (drawn by the page's own code, art/sort.ts drawCard and art/coffee.ts
// coffeeFace) and its number as dots under it. A trial picture, like every picture in this game.
//
// What it is not. It is no real coffeehouse and no picture of any house or archive. Nothing is written anywhere: the
// window is a plain lattice, the spare cards in the box are blank, the cards carry only their signs, and no goat and no
// face is drawn on any card. Nothing here draws text: a test holds it to that.
import { Rng } from "@im/kernel/prng";
import { CQR_BENCH, CQR_CARD, CQR_CASE, CQR_TABLE, CQR_WINDOW, CQR_WORLD } from "../content/coffee-room";
import { coffeeFace, sign } from "./coffee";
import { INK, PAL, blob, brush, fillStroke, linear, sheet, type Ctx, type Painted } from "./kit";
import { drawCard } from "./sort";

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
const circle = (c: Ctx, x: number, y: number, r: number): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
};

/** A brass coffee pot with a long spout, a lid with a knob and a curved handle, standing on its base at (x, y). */
function pot(c: Ctx, x: number, y: number): void {
  // The spout, behind the body.
  blob(c, [
    [x + 14, y - 30],
    [x + 40, y - 62],
    [x + 46, y - 60],
    [x + 22, y - 20],
  ]);
  fillStroke(c, PAL.brass, INK, 1.8);
  // The body: wide at the foot, narrow at the neck.
  blob(c, [
    [x - 22, y],
    [x - 26, y - 22],
    [x - 12, y - 44],
    [x - 10, y - 58],
    [x + 10, y - 58],
    [x + 12, y - 44],
    [x + 26, y - 22],
    [x + 22, y],
  ]);
  fillStroke(c, linear(c, x - 26, 0, x + 26, 0, [
    [0, "#8a5a1e"],
    [0.4, "#e8c06a"],
    [1, "#9a6a28"],
  ]), INK, 2);
  // The lid and its knob.
  blob(c, [
    [x - 12, y - 58],
    [x - 6, y - 70],
    [x + 6, y - 70],
    [x + 12, y - 58],
  ]);
  fillStroke(c, PAL.brass, INK, 1.8);
  circle(c, x, y - 74, 4);
  fillStroke(c, PAL.goldLight, INK, 1.4);
  // The handle.
  c.strokeStyle = INK;
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(x - 12, y - 52);
  c.bezierCurveTo(x - 44, y - 50, x - 40, y - 14, x - 22, y - 10);
  c.stroke();
  c.strokeStyle = PAL.brass;
  c.lineWidth = 3;
  c.stroke();
  // A band round the belly: plain lines, nothing written.
  c.strokeStyle = "rgba(42,26,18,0.5)";
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(x - 24, y - 16);
  c.lineTo(x + 24, y - 16);
  c.stroke();
}
/** A small handleless cup, as coffee was served, standing at (x, y). */
function smallCup(c: Ctx, x: number, y: number): void {
  blob(c, [
    [x - 9, y - 14],
    [x + 9, y - 14],
    [x + 6, y],
    [x - 6, y],
  ]);
  fillStroke(c, "#f6ecd2", INK, 1.6);
  c.fillStyle = PAL.teal;
  c.fillRect(x - 8, y - 11, 16, 3);
}

/** The whole room behind the cards, the figures and the door, 2400 by 720 game pixels. */
export function coffeeRoom(scale: number): Painted {
  const w = CQR_WORLD.width;
  const h = CQR_WORLD.height;
  const floor = CQR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-coffee-room");

  // The wall: whitewashed plaster gone warm in the late afternoon, darker near the ceiling.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#4a5a5a"],
    [0.32, "#a89a7a"],
    [1, "#e0cfa6"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 150; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(255,240,210,${rng.range(0.03, 0.08)})` : `rgba(60,50,40,${rng.range(0.03, 0.06)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // The ceiling's beams.
  board(ctx, 0, 0, w, 26, "#5a3418", PAL.woodDark);
  for (let x = 40; x < w; x += 160) {
    ctx.fillStyle = "rgba(42,26,18,0.5)";
    ctx.fillRect(x, 26, 20, 10);
  }

  // The window high on the wall: a pointed arch with a plain wooden lattice over the afternoon sky.
  const wi = CQR_WINDOW;
  const arch = () => {
    ctx.beginPath();
    ctx.moveTo(wi.x, wi.y + wi.h);
    ctx.lineTo(wi.x, wi.y + 70);
    ctx.quadraticCurveTo(wi.x, wi.y, wi.x + wi.w / 2, wi.y - 10);
    ctx.quadraticCurveTo(wi.x + wi.w, wi.y, wi.x + wi.w, wi.y + 70);
    ctx.lineTo(wi.x + wi.w, wi.y + wi.h);
    ctx.closePath();
  };
  ctx.save();
  arch();
  ctx.fillStyle = linear(ctx, 0, wi.y, 0, wi.y + wi.h, [
    [0, "#7fb6c8"],
    [0.7, "#f2d49a"],
    [1, "#e8a65a"],
  ]);
  ctx.fill();
  ctx.clip();
  // Flat roofs of the town far off, low in the opening: plain blocks, no sign on any.
  ctx.fillStyle = "rgba(160,120,80,0.8)";
  for (let x = wi.x - 10; x < wi.x + wi.w; x += 46) ctx.fillRect(x, wi.y + wi.h - rng.range(40, 80), 40, 90);
  ctx.strokeStyle = PAL.woodDark;
  ctx.lineWidth = 4;
  for (let x = wi.x + 24; x < wi.x + wi.w; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, wi.y - 20);
    ctx.lineTo(x, wi.y + wi.h);
    ctx.stroke();
  }
  for (let y = wi.y + 20; y < wi.y + wi.h; y += 28) {
    ctx.beginPath();
    ctx.moveTo(wi.x, y);
    ctx.lineTo(wi.x + wi.w, y);
    ctx.stroke();
  }
  ctx.restore();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#c9a06a";
  arch();
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  arch();
  ctx.stroke();
  board(ctx, wi.x - 14, wi.y + wi.h, wi.w + 28, 12);

  // A plain painted band low on the wall: two stripes and a row of small squares set on their points, no writing.
  ctx.fillStyle = "#2f6f6a";
  ctx.fillRect(0, 576, w, 34);
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(0, 572, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 25; x < w; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 582);
    ctx.lineTo(x + 9, 593);
    ctx.lineTo(x, 604);
    ctx.lineTo(x - 9, 593);
    ctx.closePath();
    fillStroke(ctx, x % 100 === 25 ? PAL.ochre : PAL.cream, null);
  }
  // The floor: worn boards and a long plain rug.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#9a7048"],
    [1, "#5a3a22"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(60,36,16,0.35)";
  ctx.lineWidth = 1.6;
  for (const y of [floor + 30, floor + 64]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  rounded(ctx, CQR_TABLE.x - 30, floor + 8, CQR_TABLE.w + 60, 34, 6);
  fillStroke(ctx, "#8a3a2e", INK, 1.6);
  ctx.strokeStyle = "rgba(243,230,200,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(CQR_TABLE.x - 20, floor + 25);
  ctx.lineTo(CQR_TABLE.x + CQR_TABLE.w + 20, floor + 25);
  ctx.stroke();

  // The low bench under the window, with the round brass tray, the coffee pot and two small cups on it.
  const be = CQR_BENCH;
  board(ctx, be.x, be.top, be.w, 14);
  for (const x of [be.x + 16, be.x + be.w - 30]) board(ctx, x, be.top + 14, 14, floor - be.top - 14, "#8a5a30", PAL.woodDark);
  ctx.beginPath();
  ctx.ellipse(be.x + be.w / 2, be.top - 4, 92, 12, 0, 0, Math.PI * 2);
  fillStroke(ctx, PAL.brass, INK, 2);
  pot(ctx, be.x + be.w / 2 - 30, be.top - 6);
  smallCup(ctx, be.x + be.w / 2 + 34, be.top - 6);
  smallCup(ctx, be.x + be.w / 2 + 64, be.top - 6);

  // The long low table: its top is where the cards wait.
  const tb = CQR_TABLE;
  board(ctx, tb.x, tb.top, tb.w, 16, "#9a6232", "#6a3f20");
  for (const x of [tb.x + 20, tb.x + tb.w / 2 - 8, tb.x + tb.w - 36]) board(ctx, x, tb.top + 16, 16, floor - tb.top - 16, "#7a4a26", PAL.woodDark);
  ctx.fillStyle = "rgba(42,26,18,0.25)";
  ctx.fillRect(tb.x + 6, tb.top + 16, tb.w - 12, 6);

  // The bookcase along the back wall: two sides, a back, the three shelves' boards and its top.
  const cs = CQR_CASE;
  ctx.fillStyle = linear(ctx, 0, cs.top, 0, floor, [
    [0, "#5a3a22"],
    [1, "#3a2414"],
  ]);
  ctx.fillRect(cs.x, cs.top, cs.w, floor - cs.top);
  for (let x = cs.x + 40; x < cs.x + cs.w; x += 80) {
    ctx.fillStyle = "rgba(255,220,160,0.05)";
    ctx.fillRect(x, cs.top, 3, floor - cs.top);
  }
  board(ctx, cs.x - 14, cs.top - 2, 14, floor - cs.top + 2, "#8a5a30", PAL.woodDark);
  board(ctx, cs.x + cs.w, cs.top - 2, 14, floor - cs.top + 2, "#8a5a30", PAL.woodDark);
  board(ctx, cs.x - 20, cs.top - 12, cs.w + 40, 14, "#b47a42", PAL.wood);
  for (const y of cs.boards) {
    board(ctx, cs.x - 4, y, cs.w + 8, 12);
    // A soft shadow under each board.
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(cs.x, y + 12, cs.w, 8);
  }
  board(ctx, cs.x - 4, floor - 40, cs.w + 8, 40, "#6a4020", PAL.woodDark);

  brush(ctx, w, h, "coffee-room", { light: [0.18, 0.22], strength: 0.4, strokes: 2000, warm: "rgba(255,220,160,0.15)", cool: "rgba(30,40,50,0.13)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the things
/** A card as the room shows it: the quest's own small scroll with its plain sign (the page's own drawing), and its number as dots under it. No numeral and no word. */
export function cardArt(scale: number, item: string, n: number): Painted {
  const s = CQR_CARD.size;
  const [p, c] = sheet(s + 8, s + 30, scale);
  c.lineJoin = "round";
  c.lineCap = "round";
  drawCard(c, { x: 4, y: 2, w: s, h: s }, coffeeFace(item), "none", "scroll");
  const rows = [Math.min(n, 4), Math.max(n - 4, 0)];
  rows.forEach((k, row) => {
    for (let d = 0; d < k; d++) {
      circle(c, (s + 8) / 2 + (d - (k - 1) / 2) * 11, s + 10 + row * 11, 4);
      fillStroke(c, PAL.goldLight, INK, 1.4);
    }
  });
  return p;
}
/** A shelf's sign: a small wooden plaque with the quest's own sign for that shelf, and one, two or three dots under it. */
export function signArt(scale: number, g: number): Painted {
  const [p, c] = sheet(70, 66, scale);
  rounded(c, 3, 3, 64, 60, 9);
  fillStroke(c, "#0e3c46", PAL.gold, 3);
  sign(c, g, 35, 26, 17);
  for (let d = 0; d <= g; d++) {
    circle(c, 35 - g * 7 + d * 14, 52, 4.5);
    fillStroke(c, PAL.goldLight, null);
  }
  return p;
}
/** The plain brass bell on a small wooden stand at the end of the table. Nothing on it. */
export function bellArt(scale: number): Painted {
  const [p, c] = sheet(70, 80, scale);
  board(c, 8, 68, 54, 10, "#8a5a30", "#5a3418");
  board(c, 31, 16, 8, 52, "#8a5a30", "#5a3418");
  blob(c, [
    [35, 10],
    [48, 18],
    [52, 46],
    [60, 56],
    [10, 56],
    [18, 46],
    [22, 18],
  ]);
  fillStroke(c, linear(c, 10, 0, 60, 0, [
    [0, "#8a5a1e"],
    [0.45, "#f0cf7a"],
    [1, "#9a6a28"],
  ]), INK, 2);
  circle(c, 35, 8, 5);
  fillStroke(c, PAL.brass, INK, 1.6);
  circle(c, 35, 60, 4.5);
  fillStroke(c, PAL.woodDark, INK, 1.4);
  return p;
}
/** The box of spare cards on top of the bookcase: a plain wooden box with blank cards standing in it. Nothing is written on any. */
export function boxArt(scale: number): Painted {
  const [p, c] = sheet(100, 70, scale);
  for (const [x, a] of [[22, -0.12], [40, 0.05], [58, -0.04], [74, 0.14]] as const) {
    c.save();
    c.translate(x, 34);
    c.rotate(a);
    rounded(c, -10, -26, 20, 32, 3);
    fillStroke(c, PAL.cream, INK, 1.6);
    c.restore();
  }
  board(c, 6, 30, 88, 38, "#9a6232", "#6a3f20");
  c.strokeStyle = "rgba(255,220,160,0.35)";
  c.lineWidth = 2;
  c.strokeRect(14, 38, 72, 22);
  return p;
}
/** The frame that shows which card, sign or bell the bird is near enough to touch: lantern gold with a dark edge. */
export function focusArt(scale: number): Painted {
  const [p, c] = sheet(80, 92, scale);
  for (const [lw, colour] of [[8, INK], [5, PAL.goldLight]] as const) {
    c.lineWidth = lw;
    c.strokeStyle = colour;
    rounded(c, 5, 5, 70, 82, 12);
    c.stroke();
  }
  return p;
}
