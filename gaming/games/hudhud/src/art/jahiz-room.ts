// Al-Jahiz's room, drawn in code in the art bible's style and palette: a scholar's room in a garden house in the morning,
// with a tall window on trees and sky near where the bird comes in, two shelves of books on the wall over a long low
// bench where the animal cards wait (a basket of spare blank cards at the end of the lower shelf), a plain brass bell at
// the bench's far end, and the trays: small three-tier tray stands, each on a low table of its own, standing side by side
// at the same height along the room, each marked on its top by a plaque with one to five dots and a plain sign of its own
// shape (a circle, a square, a triangle, a diamond, a star). The cards are the quest's own cards, each with its creature
// drawn by the page's own code (art/sort.ts drawCard and animalFace) and its number as dots under it. A trial picture,
// like every picture in this game.
//
// What it is not. It is no picture of where al-Jahiz worked, nor of any house. Nothing is written anywhere: the books have
// no title, the spare cards in the basket are blank, the cards carry only their creatures, and the trays only dots and
// shapes. Nothing here draws text: a test holds it to that.
import { Rng } from "@im/kernel/prng";
import { JZR_BENCH, JZR_CARD, JZR_SHELVES, JZR_TRAYS, JZR_WINDOW, JZR_WORLD } from "../content/jahiz-room";
import { INK, PAL, blob, brush, fillStroke, linear, sheet, type Ctx, type Painted } from "./kit";
import { animalFace, drawCard } from "./sort";

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

/** A tree seen through the window: a trunk and a round crown of leaves in three greens. */
function tree(c: Ctx, rng: Rng, x: number, ground: number, size: number): void {
  c.fillStyle = "#6a4a2a";
  c.fillRect(x - size * 0.08, ground - size * 0.9, size * 0.16, size * 0.9);
  for (const [dx, dy, r, colour] of [[-0.3, -1.1, 0.42, "#3f7a3a"], [0.3, -1.05, 0.4, "#4f8f3f"], [0, -1.4, 0.5, "#5ea24a"], [0.05, -1.05, 0.34, "#6fb456"]] as const) {
    c.fillStyle = colour;
    c.beginPath();
    c.ellipse(x + dx * size, ground + dy * size, r * size * rng.range(0.92, 1.08), r * size * 0.85, 0, 0, Math.PI * 2);
    c.fill();
  }
}

/** A row of books standing on a shelf from x to x + w, their feet on y: plain spines in the palette, with bands and no title. */
function books(c: Ctx, rng: Rng, x: number, w: number, y: number): void {
  const colours = [PAL.red, PAL.lapis, PAL.emerald, PAL.ochre, "#6a3f6a", PAL.teal, "#8a5a30"];
  let at = x + 8;
  while (at < x + w - 22) {
    const bw = rng.range(12, 22);
    const bh = rng.range(54, 80);
    if (rng.chance(0.12)) {
      // Now and then a book lies flat.
      c.fillStyle = colours[Math.floor(rng.range(0, colours.length))]!;
      c.fillRect(at, y - 14, 60, 14);
      c.strokeStyle = INK;
      c.lineWidth = 1.4;
      c.strokeRect(at, y - 14, 60, 14);
      at += 64;
      continue;
    }
    c.fillStyle = colours[Math.floor(rng.range(0, colours.length))]!;
    c.fillRect(at, y - bh, bw, bh);
    c.strokeStyle = INK;
    c.lineWidth = 1.4;
    c.strokeRect(at, y - bh, bw, bh);
    // Two plain bands across the spine: lines only, nothing written.
    c.fillStyle = "rgba(255,227,154,0.55)";
    c.fillRect(at + 2, y - bh + 10, bw - 4, 3);
    c.fillRect(at + 2, y - 14, bw - 4, 3);
    at += bw + rng.range(1, 4);
  }
}

/** The whole room behind the trays, the cards, the figures and the door, 2400 by 720 game pixels. */
export function jahizRoom(scale: number): Painted {
  const w = JZR_WORLD.width;
  const h = JZR_WORLD.height;
  const floor = JZR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-jahiz-room");

  // The wall: pale plaster in the morning light, a little cooler near the ceiling.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#5a6a62"],
    [0.3, "#b7b08e"],
    [1, "#ead9b0"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 150; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(255,248,220,${rng.range(0.03, 0.08)})` : `rgba(60,60,40,${rng.range(0.03, 0.06)})`;
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

  // The tall window on the garden: a rounded arch, the morning sky, and trees.
  const wi = JZR_WINDOW;
  const arch = () => {
    ctx.beginPath();
    ctx.moveTo(wi.x, wi.y + wi.h);
    ctx.lineTo(wi.x, wi.y + wi.w / 2);
    ctx.arc(wi.x + wi.w / 2, wi.y + wi.w / 2, wi.w / 2, Math.PI, 0);
    ctx.lineTo(wi.x + wi.w, wi.y + wi.h);
    ctx.closePath();
  };
  ctx.save();
  arch();
  ctx.fillStyle = linear(ctx, 0, wi.y, 0, wi.y + wi.h, [
    [0, "#6fb2d8"],
    [0.65, "#bfe0ea"],
    [1, "#e8f0d8"],
  ]);
  ctx.fill();
  ctx.clip();
  // Two soft clouds, then the trees of the garden and the grass.
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  for (const [cx, cy] of [[wi.x + 60, wi.y + 60], [wi.x + 160, wi.y + 92]] as const) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 18, cy - 8, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const ground = wi.y + wi.h - 18;
  tree(ctx, rng, wi.x + 50, ground, 90);
  tree(ctx, rng, wi.x + 150, ground + 6, 120);
  tree(ctx, rng, wi.x + 215, ground, 80);
  ctx.fillStyle = "#7ab05a";
  ctx.fillRect(wi.x, ground, wi.w, 30);
  ctx.restore();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#c9a06a";
  arch();
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  arch();
  ctx.stroke();
  // A single plain upright and crossbar in the opening.
  ctx.strokeStyle = PAL.woodDark;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(wi.x + wi.w / 2, wi.y);
  ctx.lineTo(wi.x + wi.w / 2, wi.y + wi.h);
  ctx.moveTo(wi.x, wi.y + wi.h * 0.55);
  ctx.lineTo(wi.x + wi.w, wi.y + wi.h * 0.55);
  ctx.stroke();
  board(ctx, wi.x - 14, wi.y + wi.h, wi.w + 28, 12);

  // A plain painted band low on the wall: two stripes and a row of small circles, no writing.
  ctx.fillStyle = "#3a6a8a";
  ctx.fillRect(0, 576, w, 34);
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(0, 572, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 25; x < w; x += 50) {
    circle(ctx, x, 593, 7);
    fillStroke(ctx, x % 100 === 25 ? PAL.ochre : PAL.cream, null);
  }
  // The floor: worn boards and a long plain rug under the bench.
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
  rounded(ctx, JZR_BENCH.x - 30, floor + 8, JZR_BENCH.w + 60, 34, 6);
  fillStroke(ctx, "#2f5a7a", INK, 1.6);
  ctx.strokeStyle = "rgba(243,230,200,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(JZR_BENCH.x - 20, floor + 25);
  ctx.lineTo(JZR_BENCH.x + JZR_BENCH.w + 20, floor + 25);
  ctx.stroke();

  // The two shelves of books on the wall over the bench, on brackets; the basket of spare cards is its own picture.
  const sh = JZR_SHELVES;
  for (const y of sh.boards) {
    books(ctx, rng, sh.x, y === sh.boards[0] ? sh.w - 90 : sh.w, y);
    board(ctx, sh.x - 6, y, sh.w + 12, 12);
    for (const x of [sh.x + 20, sh.x + sh.w - 32]) {
      blob(ctx, [
        [x, y + 12],
        [x + 12, y + 12],
        [x + 12, y + 40],
      ]);
      fillStroke(ctx, PAL.woodDark, INK, 1.4);
    }
  }

  // The long low bench: its top is where the cards wait.
  const be = JZR_BENCH;
  board(ctx, be.x, be.top, be.w, 16, "#9a6232", "#6a3f20");
  for (const x of [be.x + 20, be.x + be.w / 2 - 8, be.x + be.w - 36]) board(ctx, x, be.top + 16, 16, floor - be.top - 16, "#7a4a26", PAL.woodDark);
  ctx.fillStyle = "rgba(42,26,18,0.25)";
  ctx.fillRect(be.x + 6, be.top + 16, be.w - 12, 6);

  brush(ctx, w, h, "jahiz-room", { light: [0.16, 0.2], strength: 0.4, strokes: 2000, warm: "rgba(255,236,190,0.14)", cool: "rgba(30,50,60,0.12)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the things
/** A tray as the room shows it: a small three-tier tray stand on a low table of its own, as wide as a tray, from its top board down to the floor. Every tray is the same picture: none is higher or finer than another. */
export const TRAY_ART = { w: JZR_TRAYS.w + 24, h: JZR_WORLD.floor - JZR_TRAYS.top + 14 } as const;
export function trayArt(scale: number): Painted {
  const { w, h } = TRAY_ART;
  const [p, c] = sheet(w, h, scale);
  const y = (worldY: number) => worldY - JZR_TRAYS.top + 2;
  const x0 = 12;
  const tw = JZR_TRAYS.w;
  // The low table: a top and two legs.
  board(c, 2, y(JZR_TRAYS.table), w - 4, 14, "#8a5a30", "#5a3418");
  for (const x of [10, w - 26]) board(c, x, y(JZR_TRAYS.table) + 14, 16, y(JZR_WORLD.floor) - y(JZR_TRAYS.table) - 14, "#7a4a26", PAL.woodDark);
  // The stand: a back of dark wood, two side posts, the tiers' boards and the top.
  c.fillStyle = linear(c, 0, y(JZR_TRAYS.top), 0, y(JZR_TRAYS.table), [
    [0, "#4a3220"],
    [1, "#3a2414"],
  ]);
  c.fillRect(x0, y(JZR_TRAYS.top), tw, y(JZR_TRAYS.table) - y(JZR_TRAYS.top));
  for (const x of [x0 - 6, x0 + tw - 2]) board(c, x, y(JZR_TRAYS.top) - 2, 8, y(JZR_TRAYS.table) - y(JZR_TRAYS.top) + 2, "#8a5a30", PAL.woodDark);
  for (const b of JZR_TRAYS.boards) {
    board(c, x0 - 4, y(b), tw + 8, 12);
    c.fillStyle = "rgba(0,0,0,0.25)";
    c.fillRect(x0, y(b) + 12, tw, 6);
  }
  board(c, x0 - 10, y(JZR_TRAYS.top), tw + 20, 12, "#b47a42", PAL.wood);
  return p;
}

/** The plain sign of tray `g` (from 0), about 2 r across: a circle, a square, a triangle, a diamond or a star. A sign of its own shape, so that no tray is told from another by colour alone. */
function shape(c: Ctx, g: number, x: number, y: number, r: number): void {
  c.beginPath();
  if (g === 0) c.arc(x, y, r * 0.9, 0, Math.PI * 2);
  else if (g === 1) c.rect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6);
  else if (g === 2) {
    c.moveTo(x, y - r);
    c.lineTo(x + r, y + r * 0.8);
    c.lineTo(x - r, y + r * 0.8);
    c.closePath();
  } else if (g === 3) {
    c.moveTo(x, y - r);
    c.lineTo(x + r, y);
    c.lineTo(x, y + r);
    c.lineTo(x - r, y);
    c.closePath();
  } else {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 === 0 ? r : r * 0.45;
      if (i === 0) c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      else c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath();
  }
  fillStroke(c, PAL.goldLight, INK, 2);
}
/** A tray's sign: a small wooden plaque with the tray's own shape and one to five dots under it. Every plaque is the same size and colour. */
export function signArt(scale: number, g: number): Painted {
  const [p, c] = sheet(70, 66, scale);
  rounded(c, 3, 3, 64, 60, 9);
  fillStroke(c, "#0e3c46", PAL.gold, 3);
  shape(c, g, 35, 25, 15);
  const across = g * 12;
  for (let d = 0; d <= g; d++) {
    circle(c, 35 - across / 2 + d * 12, 52, 4.2);
    fillStroke(c, PAL.goldLight, null);
  }
  return p;
}
/** A card as the room shows it: the quest's own card with its creature (the page's own drawing), and its number as dots under it. No numeral and no word. */
export function cardArt(scale: number, item: string, n: number): Painted {
  const s = JZR_CARD.size;
  const [p, c] = sheet(s + 8, s + 30, scale);
  c.lineJoin = "round";
  c.lineCap = "round";
  drawCard(c, { x: 4, y: 2, w: s, h: s }, animalFace(item), "none", "card");
  const rows = [Math.min(n, 4), Math.max(n - 4, 0)];
  rows.forEach((k, row) => {
    for (let d = 0; d < k; d++) {
      circle(c, (s + 8) / 2 + (d - (k - 1) / 2) * 11, s + 10 + row * 11, 4);
      fillStroke(c, PAL.goldLight, INK, 1.4);
    }
  });
  return p;
}
/** The basket of spare cards on the lower shelf of books: a plain woven basket with blank cards standing in it. Nothing is written on any. */
export function basketArt(scale: number): Painted {
  const [p, c] = sheet(90, 64, scale);
  for (const [x, a] of [[28, -0.14], [44, 0.04], [60, 0.16]] as const) {
    c.save();
    c.translate(x, 30);
    c.rotate(a);
    rounded(c, -10, -24, 20, 30, 3);
    fillStroke(c, PAL.cream, INK, 1.6);
    c.restore();
  }
  blob(c, [
    [8, 28],
    [82, 28],
    [74, 62],
    [16, 62],
  ]);
  fillStroke(c, "#c9a060", INK, 2);
  c.strokeStyle = "rgba(90,60,30,0.55)";
  c.lineWidth = 2;
  for (const y of [38, 48]) {
    c.beginPath();
    c.moveTo(12, y);
    c.lineTo(78, y);
    c.stroke();
  }
  for (let x = 20; x < 76; x += 10) {
    c.beginPath();
    c.moveTo(x, 30);
    c.lineTo(x + 2, 60);
    c.stroke();
  }
  return p;
}
