// Al-Razi's study, drawn in code in the art bible's style and palette: a quiet room of books and notebooks with three tall
// windows on a late afternoon sky, a tall bookcase of books and bound notebooks, a low cupboard of bound notebooks by the
// far end, and along the middle a long desk on which the places of the notebook stand in a row (plain wooden slots,
// numbered by dots), with a plain binding frame and its spool of thread at the end of the desk. A trial picture, like
// every picture in this game.
//
// What it is not. It is no real room and no picture of the hospital of Rayy or of where al-Razi worked, and it has no
// inscription and no writing: the books are coloured spines and the notebooks plain covers. Nothing medical is drawn:
// no bottle, no jar, no instrument, no patient and no bed; the loose leaves' quest carries no medical content, and its
// room keeps that rule. The leaves are the page quest's own drawing (art/leaves.ts: drawLeafPaper, drawLeafSigns,
// drawChosenRing and drawPlaceDots, shared and not copied): a sign for a part of the body with no face, and a closed book
// or an open eye for its kind. Nothing here draws text: a test holds it to that. The leaves, their slots, the ring round a
// lifted leaf, the thread and its knot, the frame and the bundle are placed by the scene (scenes/razi.ts) from the
// quest's own state.
import { Rng } from "@im/kernel/prng";
import { RZR_DESK, RZR_LEAF, RZR_SHELF, RZR_SLOT_H, RZR_WINDOWS, RZR_WORLD } from "../content/razi-room";
import { boxWidth, PAPER_ART } from "./paper";
import { THREAD, drawChosenRing, drawLeafPaper, drawLeafSigns, drawPlaceDots } from "./leaves";
import { INK, PAL, blob, brush, fillStroke, linear, sheet, starTile, type Ctx, type Painted } from "./kit";

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
/** A row of books, spines out, plain coloured bands with no writing. */
function books(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  const colours = ["#8a2e28", "#22407e", "#2a6a4a", "#9a6232", "#4a3a70", "#1d6f78"];
  for (let bx = x + 6; bx < x + w - 14; ) {
    const bw = rng.range(10, 17);
    const bh = rng.range(50, 84);
    ctx.fillStyle = colours[Math.floor(rng.range(0, colours.length))]!;
    ctx.fillRect(bx, y - bh, bw, bh);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(bx, y - bh, bw, bh);
    ctx.fillStyle = "rgba(242,185,75,0.55)";
    ctx.fillRect(bx + 1, y - bh + 8, bw - 2, 3);
    bx += bw + 1;
  }
}
/** Bound notebooks lying flat in stacks: plain covers with a cord round them, nothing written. */
function notebooks(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  const covers = ["#6b4222", "#8a5a30", "#3d4f6b", "#5a3a52", "#2f5a48"];
  for (let sx = x + 8; sx < x + w - 50; sx += rng.range(58, 70)) {
    const n = 2 + Math.floor(rng.range(0, 3));
    let top = y;
    for (let i = 0; i < n; i++) {
      const bw = rng.range(42, 52);
      const bh = rng.range(9, 13);
      const dx = rng.range(-3, 3);
      top -= bh;
      rounded(ctx, sx + dx, top, bw, bh, 2);
      fillStroke(ctx, covers[Math.floor(rng.range(0, covers.length))]!, INK, 1.2);
      ctx.fillStyle = "#efe2c2";
      ctx.fillRect(sx + dx + bw - 4, top + 2, 3, bh - 4);
    }
    ctx.strokeStyle = THREAD;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sx + 22, top);
    ctx.lineTo(sx + 22, y);
    ctx.stroke();
  }
}
/** The tall window of a quiet study: an arch of late afternoon sky with a wooden lattice. */
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
    [0, "#7fb0d4"],
    [0.6, "#e9d6a8"],
    [1, "#f2c48a"],
  ]);
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < 2; i++) {
    const cx = o.x + rng.range(24, o.w - 24);
    const cy = o.y + rng.range(70, o.h - 100);
    ctx.fillStyle = "rgba(255,246,226,0.7)";
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

/** The whole study behind the figures and the leaves, 2400 by 720 game pixels. */
export function raziStudy(scale: number): Painted {
  const w = RZR_WORLD.width;
  const h = RZR_WORLD.height;
  const floor = RZR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-razi-study");

  // The wall: warm plaster, a little darker low down, lit by the windows.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#e9d6b0"],
    [0.6, "#d8bd8c"],
    [1, "#c2a070"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 200; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.55) ? `rgba(255,244,220,${rng.range(0.04, 0.1)})` : `rgba(110,70,36,${rng.range(0.02, 0.05)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // A band of star tiles along the wall, as in the other rooms.
  ctx.fillStyle = "#6b4222";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? PAL.ochre : PAL.teal, PAL.cream);
  // The floor: warm wooden boards.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#a87a4c"],
    [1, "#6e4a2a"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(60,36,16,0.4)";
  ctx.lineWidth = 1.6;
  for (const y of [floor + 22, floor + 52, floor + 86]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 0; x < w; x += rng.range(120, 220)) {
    ctx.beginPath();
    ctx.moveTo(x, floor + 22);
    ctx.lineTo(x, floor + 52);
    ctx.stroke();
  }

  // The windows, and the light they let fall across the wall and the floor.
  for (const o of RZR_WINDOWS) {
    windowOf(ctx, rng, o);
    ctx.fillStyle = "rgba(255,236,200,0.14)";
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.lineTo(o.x + o.w + 140, floor + 60);
    ctx.lineTo(o.x + 100, floor + 60);
    ctx.closePath();
    ctx.fill();
  }

  // The tall bookcase: its top and its two shelves are perches; the bundle of loose leaves is placed on its top by the scene.
  const sh = RZR_SHELF;
  ctx.fillStyle = linear(ctx, sh.x, 0, sh.x + sh.w, 0, [
    [0, "#7a4a26"],
    [1, "#5a3418"],
  ]);
  ctx.fillRect(sh.x - 10, sh.top, sh.w + 20, floor - sh.top);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(sh.x - 10, sh.top, sh.w + 20, floor - sh.top);
  books(ctx, rng, sh.x, sh.shelves[0], sh.w);
  notebooks(ctx, rng, sh.x, sh.shelves[1], sh.w);
  books(ctx, rng, sh.x, 540, sh.w);
  for (const y of [...sh.shelves, 540]) board(ctx, sh.x, y, sh.w, 12);
  board(ctx, sh.x - 14, sh.top, sh.w + 28, 12);

  // The long desk: a thick top (a perch), an apron, legs, and a low shelf of bound notebooks under it.
  const d = RZR_DESK;
  ctx.fillStyle = PAL.woodDark;
  for (const x of [d.x + 12, d.x + d.w / 2 - 11, d.x + d.w - 34]) {
    ctx.fillRect(x, d.top + 18, 22, floor - d.top - 18);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, d.top + 18, 22, floor - d.top - 18);
  }
  board(ctx, d.x + 20, floor - 36, d.w - 40, 10, "#7a4a26", "#4a2a14");
  notebooks(ctx, rng, d.x + 40, floor - 36, d.w / 2 - 70);
  notebooks(ctx, rng, d.x + d.w / 2 + 20, floor - 36, d.w / 2 - 70);
  board(ctx, d.x, d.top, d.w, 18, "#c08a52", "#8a5a30");
  board(ctx, d.x + 8, d.top + 18, d.w - 16, 16, "#8a5a30", "#5a3418");

  // A low cupboard of bound notebooks by the far end, its doors open on its shelves.
  const cx = 1960;
  board(ctx, cx, floor - 110, 170, 110, "#8a5a30", "#5a3418");
  board(ctx, cx - 6, floor - 116, 182, 10, "#c08a52", "#8a5a30");
  ctx.fillStyle = "#3a2210";
  ctx.fillRect(cx + 10, floor - 100, 150, 86);
  notebooks(ctx, rng, cx + 10, floor - 58, 150);
  notebooks(ctx, rng, cx + 10, floor - 16, 150);
  board(ctx, cx + 10, floor - 58, 150, 6, "#8a5a30", "#5a3418");

  brush(ctx, w, h, "razi-study", { light: [0.3, 0.1], strength: 0.45, strokes: 2200, warm: "rgba(255,236,200,0.16)", cool: "rgba(60,40,20,0.16)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the pieces
/** The space round a leaf in its texture: room for the ring round a lifted leaf. */
export const LEAF_PAD = 14;
export type LeafMode = "plain" | "held" | "stopped";
/** The page's own size of a leaf in a row of n, in the page picture's units (the scene draws it at RZR_LEAF.k). */
export const leafRect = (n: number) => ({ x: LEAF_PAD, y: LEAF_PAD, w: boxWidth(n), h: PAPER_ART.boxH });
/**
 * One leaf of a row of n, drawn by the page quest's own code: its paper (marked when the binding held through it, or
 * where it stopped), its hole, and its two signs. In the page picture's units, LEAF_PAD round it.
 */
export function leafArt(scale: number, id: string, n: number, mode: LeafMode): Painted {
  const r = leafRect(n);
  const [p, c] = sheet(r.w + 2 * LEAF_PAD, r.h + 2 * LEAF_PAD, scale);
  drawLeafPaper(c, r, r.x + r.w / 2, r.y + 16, mode === "held", mode === "stopped");
  drawLeafSigns(c, id, r.x + r.w / 2, r.y + r.h / 2, r);
  return p;
}
/** The ring round a lifted leaf: the page's own ring round the place chosen. */
export function liftRing(scale: number, n: number): Painted {
  const r = leafRect(n);
  const [p, c] = sheet(r.w + 2 * LEAF_PAD, r.h + 2 * LEAF_PAD, scale);
  drawChosenRing(c, r);
  return p;
}
/** The soft shadow a lifted leaf casts on the wall behind it. */
export function leafShadow(scale: number, n: number): Painted {
  const r = leafRect(n);
  const [p, c] = sheet(r.w + 2 * LEAF_PAD, r.h + 2 * LEAF_PAD, scale);
  for (let i = 0; i < 6; i++) {
    rounded(c, r.x - i * 2, r.y - i * 2, r.w + i * 4, r.h + i * 4, 6 + i * 2);
    c.fillStyle = `rgba(40,20,8,${0.09 - i * 0.012})`;
    c.fill();
  }
  return p;
}
/** The plain wooden slot place i stands in on the desk, numbered by the page's own dots on its front; in game pixels, for a row of n. */
export function slotArt(scale: number, n: number, i: number): Painted {
  const w = Math.round(boxWidth(n) * RZR_LEAF.k + 22);
  const [p, c] = sheet(w, RZR_SLOT_H, scale);
  board(c, 1, 1, w - 2, 10, "#c08a52", "#8a5a30");
  c.fillStyle = "#4a2a14";
  c.fillRect(8, 3, w - 16, 4);
  board(c, 4, 11, w - 8, RZR_SLOT_H - 12, "#8a5a30", "#5a3418");
  drawPlaceDots(c, w / 2, 20, i);
  return p;
}
/** A length of the binding thread, the page's own colour and width; the scene stretches it between two holes. */
export function threadArt(scale: number): Painted {
  const [p, c] = sheet(64, 8, scale);
  c.lineCap = "butt";
  c.strokeStyle = THREAD;
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(0, 4);
  c.lineTo(64, 4);
  c.stroke();
  return p;
}
/** The knot at the end of the thread once the notebook is bound, as on the page. */
export function knotArt(scale: number): Painted {
  const [p, c] = sheet(16, 16, scale);
  c.beginPath();
  c.arc(8, 8, 6, 0, Math.PI * 2);
  fillStroke(c, THREAD, INK, 1.5);
  return p;
}
/** The plain binding frame, taller than the bird so that it shows over it: a base, two uprights and a crossbar, three cords, and a spool of thread on a peg near the top. No tool of any other craft. */
export function bindingFrame(scale: number): Painted {
  const [p, c] = sheet(100, 170, scale);
  board(c, 2, 154, 96, 14, "#c08a52", "#8a5a30");
  board(c, 10, 22, 12, 134, "#b47a42", "#7a4a26");
  board(c, 74, 22, 12, 134, "#b47a42", "#7a4a26");
  board(c, 4, 12, 88, 12, "#c08a52", "#8a5a30");
  // Three cords hang from the crossbar to the base, as a frame for sewing a binding has.
  c.strokeStyle = "#efe2c2";
  c.lineWidth = 1.6;
  for (const x of [36, 48, 60]) {
    c.beginPath();
    c.moveTo(x, 24);
    c.lineTo(x, 154);
    c.stroke();
  }
  // The spool on its peg near the top, wound with the red thread.
  c.fillStyle = PAL.woodDark;
  c.fillRect(84, 44, 12, 4);
  rounded(c, 86, 30, 12, 32, 3);
  fillStroke(c, "#d49a5a", INK, 1.4);
  c.fillStyle = THREAD;
  c.fillRect(87, 36, 10, 20);
  c.strokeStyle = "rgba(255,220,200,0.5)";
  c.lineWidth = 1;
  for (let y = 38; y < 56; y += 4) {
    c.beginPath();
    c.moveTo(87, y);
    c.lineTo(97, y);
    c.stroke();
  }
  return p;
}
/** The bundle of loose leaves on top of the tall bookcase: blank leaves, a little askew, held by a loose turn of thread. Nothing is written on them. */
export function leafBundle(scale: number): Painted {
  const [p, c] = sheet(120, 48, scale);
  const tilts = [-0.05, 0.06, -0.03, 0.07, -0.01];
  tilts.forEach((a, i) => {
    c.save();
    c.translate(60, 40 - i * 6);
    c.rotate(a);
    rounded(c, -46, -5, 92, 10, 2);
    fillStroke(c, i % 2 ? "#f6ecd2" : "#efe2c2", PAL.woodDark, 1.4);
    c.restore();
  });
  c.strokeStyle = THREAD;
  c.lineWidth = 2;
  blob(c, [
    [52, 46],
    [50, 12],
    [70, 12],
    [68, 46],
  ]);
  c.stroke();
  return p;
}
