// The paper workshop of Samarkand, drawn in code in the art bible's style and palette: a papermaker's workshop by day,
// with one window of morning sky, a tall rack of plain moulds and stacked blank sheets, a stone vat of water and a basket
// of rags on the floor, sheets pressed flat to dry on the wall by the far end, and along the middle a long workbench on
// which the places of the row stand (plain wooden slots, numbered by dots), with a plain bell on a post at the end of the
// bench. A trial picture, like every picture in this game.
//
// What it is not. It is no real mill and no picture of a paper mill in Samarkand or anywhere else, and it has no
// inscription and no writing in any script: the sheets are blank, the moulds plain frames. The cards are the page quest's
// own drawing (art/paper.ts: drawCardBox, drawCardSigns, drawCardRing, drawCardDots and drawMaterial, shared and not
// copied): the sign of each step, shears over cloth, a wash tub, a sun over cloth, a mallet over a trough, a bowl of
// starch, a mould lifted from a vat, a sheet on a wall, a smooth stone on a sheet. Nothing here draws text: a test holds it
// to that. The cards, their slots, the ring round a lifted card, the material above the places the work has passed, the
// bell and the spare mould are placed by the scene (scenes/samarkand.ts) from the quest's own state.
import { Rng } from "@im/kernel/prng";
import { SMR_BASKET, SMR_BENCH, SMR_CARD, SMR_DRYING, SMR_RACK, SMR_SLOT_H, SMR_VAT, SMR_WINDOW, SMR_WORLD } from "../content/samarkand-room";
import { boxWidth, drawCardBox, drawCardDots, drawCardRing, drawCardSigns, drawMaterial, PAPER_ART } from "./paper";
import { INK, PAL, blob, brush, fillStroke, linear, sheet, starTile, type Ctx, type Painted } from "./kit";

const CLOTH = ["#e7d6ad", "#c9b48a", "#b8443c", "#3f6f8f", "#8a7a5a", "#efe2c2"];
const BLANK = "#f6eed8";

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
/** A plain mould: a wooden frame with a fine mesh across it, seen from the front, standing on edge. Nothing written. */
function mouldOnEdge(ctx: Ctx, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = "rgba(240,228,200,0.35)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(90,58,30,0.55)";
  ctx.lineWidth = 0.8;
  for (let mx = x + 4; mx < x + w - 2; mx += 4) {
    ctx.beginPath();
    ctx.moveTo(mx, y + 2);
    ctx.lineTo(mx, y + h - 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#8a5a30";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
}
/** Blank sheets lying flat in stacks: plain edges, nothing written. */
function stacks(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  for (let sx = x + 8; sx < x + w - 50; sx += rng.range(58, 72)) {
    const n = 4 + Math.floor(rng.range(0, 5));
    let top = y;
    for (let i = 0; i < n; i++) {
      const bw = rng.range(44, 52);
      const dx = rng.range(-2, 2);
      top -= 3;
      ctx.fillStyle = i % 2 ? BLANK : "#ece2c6";
      ctx.fillRect(sx + dx, top, bw, 3);
    }
    ctx.strokeStyle = "rgba(42,26,18,0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx - 2, top, 54, y - top);
  }
}
/** The workshop's one window: an arch of morning sky with a wooden lattice. */
function windowOf(ctx: Ctx, rng: Rng, o: { x: number; y: number; w: number; h: number }): void {
  const open = () => {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x, o.y + o.w / 2);
    ctx.arc(o.x + o.w / 2, o.y + o.w / 2, o.w / 2, Math.PI, 0);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.closePath();
  };
  ctx.save();
  open();
  ctx.fillStyle = linear(ctx, 0, o.y, 0, o.y + o.h, [
    [0, "#6fb1e0"],
    [0.7, "#b9dcef"],
    [1, "#e8efe0"],
  ]);
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < 2; i++) {
    const cx = o.x + rng.range(24, o.w - 24);
    const cy = o.y + rng.range(70, o.h - 110);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (const [dx, dy, r] of [[-12, 4, 10], [0, 0, 14], [14, 4, 10]] as const) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.strokeStyle = "rgba(90,58,30,0.85)";
  ctx.lineWidth = 3;
  for (let x = o.x + o.w / 3; x < o.x + o.w - 4; x += o.w / 3) {
    ctx.beginPath();
    ctx.moveTo(x, o.y);
    ctx.lineTo(x, o.y + o.h);
    ctx.stroke();
  }
  for (let y = o.y + 110; y < o.y + o.h; y += 70) {
    ctx.beginPath();
    ctx.moveTo(o.x, y);
    ctx.lineTo(o.x + o.w, y);
    ctx.stroke();
  }
  ctx.restore();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#7a4a26";
  open();
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  open();
  ctx.stroke();
  board(ctx, o.x - 16, o.y + o.h, o.w + 32, 14, "#b47a42", "#7a4a26");
}
/** The stone vat of water on the floor: dressed stone, a rim, and the water's surface. Decoration: it is not touched. */
function vat(ctx: Ctx, floor: number): void {
  const { x, w, h } = SMR_VAT;
  const top = floor - h;
  rounded(ctx, x, top + 10, w, h - 10, 8);
  fillStroke(ctx, linear(ctx, 0, top, 0, floor, [
    [0, "#b9b2a2"],
    [1, "#857e70"],
  ]), INK, 2);
  ctx.strokeStyle = "rgba(42,26,18,0.35)";
  ctx.lineWidth = 1.4;
  for (const y of [top + 44, top + 74]) {
    ctx.beginPath();
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + w - 4, y);
    ctx.stroke();
  }
  for (const [y0, xs] of [[top + 10, [x + 50, x + 104]], [top + 44, [x + 30, x + 84, x + 128]], [top + 74, [x + 56, x + 110]]] as const) {
    for (const bx of xs) {
      ctx.beginPath();
      ctx.moveTo(bx, y0);
      ctx.lineTo(bx, y0 + 30);
      ctx.stroke();
    }
  }
  ctx.beginPath();
  ctx.ellipse(x + w / 2, top + 10, w / 2 + 4, 12, 0, 0, Math.PI * 2);
  fillStroke(ctx, "#a9a291", INK, 2);
  ctx.beginPath();
  ctx.ellipse(x + w / 2, top + 11, w / 2 - 8, 7, 0, 0, Math.PI * 2);
  fillStroke(ctx, "#7fc6d6", null);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 40, top + 10);
  ctx.quadraticCurveTo(x + 60, top + 7, x + 80, top + 10);
  ctx.stroke();
}
/** A woven basket of rags on the floor, bits of worn cloth spilling over its rim. Decoration: it is not touched. */
function basket(ctx: Ctx, rng: Rng, floor: number): void {
  const { x, w, h } = SMR_BASKET;
  const top = floor - h;
  for (let i = 0; i < 7; i++) {
    const cx = x + 8 + rng.range(0, w - 16);
    blob(ctx, [
      [cx - 12, top + 6],
      [cx - 4, top - 10 - rng.range(0, 8)],
      [cx + 10, top - 6],
      [cx + 12, top + 8],
    ]);
    fillStroke(ctx, CLOTH[i % CLOTH.length]!, INK, 1.4);
  }
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x + w, top);
  ctx.lineTo(x + w - 6, floor);
  ctx.lineTo(x + 6, floor);
  ctx.closePath();
  fillStroke(ctx, "#b8894a", INK, 2);
  ctx.strokeStyle = "rgba(90,58,30,0.7)";
  ctx.lineWidth = 1.4;
  for (let y = top + 8; y < floor; y += 9) {
    ctx.beginPath();
    ctx.moveTo(x + 3, y);
    ctx.lineTo(x + w - 3, y);
    ctx.stroke();
  }
  for (let bx = x + 8; bx < x + w - 4; bx += 10) {
    ctx.beginPath();
    ctx.moveTo(bx, top);
    ctx.lineTo(bx + 2, floor);
    ctx.stroke();
  }
}
/** Sheets pressed flat to dry on the wall: blank, a little askew, the newest still grey with water. */
function drying(ctx: Ctx, rng: Rng): void {
  const d = SMR_DRYING;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = d.x + 12 + col * 60 + rng.range(-4, 4);
      const y = d.y + 10 + row * 74 + rng.range(-4, 4);
      ctx.save();
      ctx.translate(x + 24, y + 30);
      ctx.rotate(rng.range(-0.05, 0.05));
      ctx.fillStyle = "rgba(60,40,20,0.15)";
      ctx.fillRect(-21, -27, 48, 60);
      rounded(ctx, -24, -30, 48, 60, 2);
      fillStroke(ctx, row === 2 && col > 1 ? "#dfe4d6" : BLANK, "rgba(42,26,18,0.6)", 1.2);
      ctx.restore();
    }
  }
}

/** The whole workshop behind the figures and the cards, 2400 by 720 game pixels. */
export function samarkandWorkshop(scale: number): Painted {
  const w = SMR_WORLD.width;
  const h = SMR_WORLD.height;
  const floor = SMR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-samarkand-workshop");

  // The wall: limewashed plaster in daylight, a little darker low down.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#f1e4c6"],
    [0.6, "#e0c99c"],
    [1, "#c9ab7a"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 200; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.55) ? `rgba(255,250,232,${rng.range(0.04, 0.1)})` : `rgba(110,80,40,${rng.range(0.02, 0.05)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // Roof beams across the top.
  for (let x = 60; x < w; x += 260) board(ctx, x, 0, 26, 40, "#8a5a30", "#5a3418");
  board(ctx, 0, 34, w, 12, "#8a5a30", "#5a3418");
  // A band of star tiles along the wall, as in the other rooms.
  ctx.fillStyle = "#6b4222";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? PAL.ochre : PAL.teal, PAL.cream);
  // The floor: beaten earth and flags of stone, wet in places by the vat.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#b39066"],
    [1, "#7a5c3c"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(60,36,16,0.35)";
  ctx.lineWidth = 1.6;
  for (const y of [floor + 26, floor + 60]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 0; x < w; x += rng.range(90, 170)) {
    ctx.beginPath();
    ctx.moveTo(x, floor + 26);
    ctx.lineTo(x + rng.range(-8, 8), floor + 60);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(90,130,150,0.18)";
  ctx.beginPath();
  ctx.ellipse(SMR_VAT.x + SMR_VAT.w / 2, floor + 16, 120, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // The window, and the light it lets fall across the wall and the floor.
  const o = SMR_WINDOW;
  windowOf(ctx, rng, o);
  ctx.fillStyle = "rgba(255,246,220,0.16)";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y + o.h);
  ctx.lineTo(o.x + o.w, o.y + o.h);
  ctx.lineTo(o.x + o.w + 160, floor + 60);
  ctx.lineTo(o.x + 110, floor + 60);
  ctx.closePath();
  ctx.fill();

  // The tall rack: its top and its two shelves are perches; the spare mould is placed on its top by the scene.
  const r = SMR_RACK;
  ctx.fillStyle = linear(ctx, r.x, 0, r.x + r.w, 0, [
    [0, "#7a4a26"],
    [1, "#5a3418"],
  ]);
  ctx.fillRect(r.x - 10, r.top, r.w + 20, floor - r.top);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(r.x - 10, r.top, r.w + 20, floor - r.top);
  // Plain moulds standing on edge on the upper shelf, stacks of blank sheets on the others.
  for (let i = 0; i < 4; i++) mouldOnEdge(ctx, r.x + 12 + i * 44, r.shelves[0] - 96, 36, 92);
  stacks(ctx, rng, r.x, r.shelves[1], r.w);
  stacks(ctx, rng, r.x, 540, r.w);
  for (const y of [...r.shelves, 540]) board(ctx, r.x, y, r.w, 12);
  board(ctx, r.x - 14, r.top, r.w + 28, 12);

  // The stone vat of water and the basket of rags.
  vat(ctx, floor);
  basket(ctx, rng, floor);

  // Sheets drying on the wall by the far end, and a low stack of finished sheets under them.
  drying(ctx, rng);
  board(ctx, 1980, floor - 70, 180, 70, "#8a5a30", "#5a3418");
  stacks(ctx, rng, 1990, floor - 70, 170);

  // The long workbench: a thick top (a perch), an apron, legs, and a low shelf of blank sheets under it.
  const d = SMR_BENCH;
  ctx.fillStyle = PAL.woodDark;
  for (const x of [d.x + 12, d.x + d.w / 2 - 11, d.x + d.w - 34]) {
    ctx.fillRect(x, d.top + 18, 22, floor - d.top - 18);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, d.top + 18, 22, floor - d.top - 18);
  }
  board(ctx, d.x + 20, floor - 36, d.w - 40, 10, "#7a4a26", "#4a2a14");
  stacks(ctx, rng, d.x + 40, floor - 36, d.w / 2 - 70);
  stacks(ctx, rng, d.x + d.w / 2 + 20, floor - 36, d.w / 2 - 70);
  board(ctx, d.x, d.top, d.w, 18, "#c08a52", "#8a5a30");
  board(ctx, d.x + 8, d.top + 18, d.w - 16, 16, "#8a5a30", "#5a3418");

  brush(ctx, w, h, "samarkand-workshop", { light: [0.28, 0.1], strength: 0.45, strokes: 2200, warm: "rgba(255,244,214,0.16)", cool: "rgba(60,40,20,0.14)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the pieces
/** The space round a card in its texture: room for the ring round a lifted card. */
export const CARD_PAD = 14;
export type CardMode = "plain" | "held" | "stopped";
/** The page's own size of a card in a row of n, in the page picture's units (the scene draws it at SMR_CARD.k). */
export const cardRect = (n: number) => ({ x: CARD_PAD, y: CARD_PAD, w: boxWidth(n), h: PAPER_ART.boxH });
/** The plain backing a card is painted on in the room, so that it reads as a card standing on the bench (the page draws it on its own dark wall). */
export function drawCardBacking(c: Ctx, r: { x: number; y: number; w: number; h: number }): void {
  rounded(c, r.x - 3, r.y - 3, r.w + 6, r.h + 6, 18);
  fillStroke(c, "#1d3550", "#5a3418", 2);
}
/**
 * One card of a row of n, drawn by the page quest's own code: its box (gold where the work has passed it, red with a
 * broken outline where the work stopped) and the sign of its step, on a plain backing. In the page picture's units,
 * CARD_PAD round it.
 */
export function cardArt(scale: number, id: string, n: number, mode: CardMode): Painted {
  const r = cardRect(n);
  const [p, c] = sheet(r.w + 2 * CARD_PAD, r.h + 2 * CARD_PAD, scale);
  drawCardBacking(c, r);
  drawCardBox(c, r, mode === "held", mode === "stopped");
  drawCardSigns(c, id, r.x + r.w / 2, r.y + r.h / 2, r);
  return p;
}
/** The ring round a lifted card: the page's own ring round the place chosen. */
export function cardRing(scale: number, n: number): Painted {
  const r = cardRect(n);
  const [p, c] = sheet(r.w + 2 * CARD_PAD, r.h + 2 * CARD_PAD, scale);
  drawCardRing(c, r);
  return p;
}
/** The soft shadow a lifted card casts on the wall behind it. */
export function cardShadow(scale: number, n: number): Painted {
  const r = cardRect(n);
  const [p, c] = sheet(r.w + 2 * CARD_PAD, r.h + 2 * CARD_PAD, scale);
  for (let i = 0; i < 6; i++) {
    rounded(c, r.x - i * 2, r.y - i * 2, r.w + i * 4, r.h + i * 4, 16 + i * 2);
    c.fillStyle = `rgba(40,20,8,${0.09 - i * 0.012})`;
    c.fill();
  }
  return p;
}
/** The plain wooden slot place i stands in on the bench, numbered by the page's own dots on its front; in game pixels, for a row of n. */
export function slotArt(scale: number, n: number, i: number): Painted {
  const w = Math.round(boxWidth(n) * SMR_CARD.k + 22);
  const [p, c] = sheet(w, SMR_SLOT_H, scale);
  board(c, 1, 1, w - 2, 10, "#c08a52", "#8a5a30");
  c.fillStyle = "#4a2a14";
  c.fillRect(8, 3, w - 16, 4);
  board(c, 4, 11, w - 8, SMR_SLOT_H - 12, "#8a5a30", "#5a3418");
  drawCardDots(c, w / 2, 20, i);
  return p;
}
/** The material in one state (scraps, pulp, a sheet), drawn by the page's own code, in the page picture's units, 90 by 80 round its middle. */
export function materialArt(scale: number, state: string): Painted {
  const [p, c] = sheet(90, 80, scale);
  drawMaterial(c, state, 45, 40);
  return p;
}
/** The plain bell on its post at the end of the bench, taller than the bird so that it shows over it: a base, an upright, an arm, and a brass bell on a cord. Nothing written on it. */
export function bellArt(scale: number): Painted {
  const [p, c] = sheet(100, 170, scale);
  board(c, 8, 154, 84, 14, "#c08a52", "#8a5a30");
  board(c, 14, 20, 12, 136, "#b47a42", "#7a4a26");
  board(c, 10, 16, 72, 10, "#c08a52", "#8a5a30");
  c.strokeStyle = "#6b4222";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(64, 26);
  c.lineTo(64, 46);
  c.stroke();
  // The bell: a plain brass dome flaring to a lip, with its clapper below.
  c.beginPath();
  c.moveTo(64, 44);
  c.bezierCurveTo(48, 44, 46, 62, 44, 84);
  c.quadraticCurveTo(40, 90, 38, 94);
  c.lineTo(90, 94);
  c.quadraticCurveTo(88, 90, 84, 84);
  c.bezierCurveTo(82, 62, 80, 44, 64, 44);
  c.closePath();
  fillStroke(c, linear(c, 40, 0, 90, 0, [
    [0, "#c99a3a"],
    [0.4, "#f2d27a"],
    [1, "#9a6a22"],
  ]), INK, 2);
  c.beginPath();
  c.arc(64, 100, 5, 0, Math.PI * 2);
  fillStroke(c, "#8a6a2a", INK, 1.4);
  c.strokeStyle = "rgba(255,240,200,0.7)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(56, 52);
  c.quadraticCurveTo(52, 66, 51, 82);
  c.stroke();
  return p;
}
/** The spare mould lying on top of the tall rack, a little askew: a plain wooden frame with its fine mesh. Nothing written. */
export function spareMould(scale: number): Painted {
  const [p, c] = sheet(120, 48, scale);
  c.save();
  c.translate(60, 30);
  c.rotate(-0.04);
  rounded(c, -50, -12, 100, 24, 3);
  fillStroke(c, "rgba(240,228,200,0.6)", null);
  c.strokeStyle = "rgba(90,58,30,0.55)";
  c.lineWidth = 0.8;
  for (let x = -46; x < 48; x += 4) {
    c.beginPath();
    c.moveTo(x, -10);
    c.lineTo(x, 10);
    c.stroke();
  }
  rounded(c, -50, -12, 100, 24, 3);
  c.strokeStyle = "#8a5a30";
  c.lineWidth = 5;
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 1.4;
  rounded(c, -53, -15, 106, 30, 4);
  c.stroke();
  c.restore();
  return p;
}
