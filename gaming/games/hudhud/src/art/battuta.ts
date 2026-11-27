// Ibn Battuta's inn, drawn in code in the art bible's style and palette: the arcade of a travellers' inn at evening, with
// its arches along the back wall, saddlebags and rolled carpets against the wall near where the bird comes in, a lantern,
// bales piled by the far end under a high ledge with a saddlebag on it, a camel resting in the last arch (the child's
// camel, a simple friendly shape), and in the middle the great ring hung on a wooden stand, with the stage's beads on it
// in the quest's ring order, a small wooden peg under each, and the thread drawn from bead to bead as it grows; a plain
// scroll on a lectern beside it. A trial picture, like every picture in this game.
//
// What it is not. It is no real inn and no picture of any place Ibn Battuta stayed. It is NOT a map: the beads sit on a
// ring in an order that is never the road's, no direction is drawn, no distance is meant, and nothing here draws a coast,
// a compass, a place or a scale. Nothing is written anywhere: the scroll is plain parchment with no mark on it, the
// carpets carry stripes and diamonds, and each bead carries the page quest's own plain sign (art/route.ts traceSign,
// shared and not copied) and its number as dots. Nothing here draws text: a test holds it to that.
import { Rng } from "@im/kernel/prng";
import { IBR_ARCHES, IBR_BAGS, IBR_BALES, IBR_LEDGE, IBR_RING, IBR_WORLD, beadAt, pegOf } from "../content/battuta-room";
import { traceSign } from "./route";
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
const circle = (c: Ctx, x: number, y: number, r: number): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
};

/** A rolled carpet lying on its side, seen from its end: a striped roll. */
function carpetRoll(ctx: Ctx, x: number, y: number, len: number, r: number, colour: string): void {
  rounded(ctx, x, y - r * 2, len, r * 2, r);
  fillStroke(ctx, colour, INK, 2);
  ctx.strokeStyle = "rgba(243,230,200,0.6)";
  ctx.lineWidth = 3;
  for (let s = x + 18; s < x + len - 10; s += 22) {
    ctx.beginPath();
    ctx.moveTo(s, y - r * 2 + 3);
    ctx.lineTo(s, y - 3);
    ctx.stroke();
  }
  circle(ctx, x + len, y - r, r);
  fillStroke(ctx, colour, INK, 2);
  ctx.strokeStyle = "rgba(42,26,18,0.6)";
  ctx.lineWidth = 1.6;
  for (let k = r - 5; k > 2; k -= 5) {
    circle(ctx, x + len, y - r, k);
    ctx.stroke();
  }
}
/** A saddlebag: two pouches joined by a band, with a flap and tassels, and a band of plain diamonds. No writing. */
function bag(ctx: Ctx, x: number, y: number, w: number, h: number, colour: string): void {
  blob(ctx, [
    [x, y - h * 0.2],
    [x + w * 0.5, y - h],
    [x + w, y - h * 0.2],
    [x + w * 0.95, y],
    [x + w * 0.05, y],
  ]);
  fillStroke(ctx, colour, INK, 2);
  ctx.fillStyle = PAL.cream;
  for (let d = x + w * 0.2; d < x + w * 0.85; d += w * 0.2) {
    ctx.beginPath();
    ctx.moveTo(d, y - h * 0.45);
    ctx.lineTo(d + 6, y - h * 0.35);
    ctx.lineTo(d, y - h * 0.25);
    ctx.lineTo(d - 6, y - h * 0.35);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = PAL.ochre;
  ctx.lineWidth = 2.4;
  for (let t = x + 8; t < x + w - 4; t += 12) {
    ctx.beginPath();
    ctx.moveTo(t, y);
    ctx.lineTo(t, y + 8);
    ctx.stroke();
  }
}

/** The whole inn behind the ring, the figures and the door, 2400 by 720 game pixels. */
export function battutaRoom(scale: number): Painted {
  const w = IBR_WORLD.width;
  const h = IBR_WORLD.height;
  const floor = IBR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-battuta-room");

  // The wall: warm lime plaster in the evening light, darker near the ceiling.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#6a4a3a"],
    [0.3, "#b8875a"],
    [1, "#d9b583"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 160; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(255,236,200,${rng.range(0.03, 0.08)})` : `rgba(80,48,24,${rng.range(0.03, 0.07)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // The ceiling's beams.
  board(ctx, 0, 0, w, 26, "#5a3418", PAL.woodDark);
  for (let x = 60; x < w; x += 180) {
    ctx.fillStyle = "rgba(42,26,18,0.5)";
    ctx.fillRect(x, 26, 22, 10);
  }

  // The arcade: plain round arches along the back wall, each opening onto the evening sky over the courtyard.
  const a = IBR_ARCHES;
  for (let x = a.first; x + a.w < w - 300; x += a.step) {
    const arch = () => {
      ctx.beginPath();
      ctx.moveTo(x, floor);
      ctx.lineTo(x, a.spring);
      ctx.arc(x + a.w / 2, a.spring, a.w / 2, Math.PI, 0);
      ctx.lineTo(x + a.w, floor);
      ctx.closePath();
    };
    ctx.save();
    arch();
    ctx.fillStyle = linear(ctx, 0, a.top, 0, floor, [
      [0, "#2b3f6b"],
      [0.45, "#c2643a"],
      [0.7, "#e8a65a"],
      [1, "#7a5432"],
    ]);
    ctx.fill();
    ctx.clip();
    // A few early stars, and the courtyard's far wall low in the opening.
    for (let s = 0; s < 4; s++) {
      ctx.fillStyle = "rgba(255,240,200,0.8)";
      circle(ctx, x + rng.range(20, a.w - 20), rng.range(a.top + 10, a.spring + 20), rng.range(1.2, 2.2));
      ctx.fill();
    }
    ctx.fillStyle = "rgba(90,58,30,0.85)";
    ctx.fillRect(x, floor - 120, a.w, 120);
    ctx.restore();
    ctx.lineWidth = 16;
    ctx.strokeStyle = "#c9a06a";
    arch();
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = INK;
    arch();
    ctx.stroke();
  }
  // A plain band low on the wall: two stripes and a row of small diamonds, no writing.
  ctx.fillStyle = "#8a5a3a";
  ctx.fillRect(0, 570, w, 40);
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(0, 566, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 25; x < w; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 578);
    ctx.lineTo(x + 10, 590);
    ctx.lineTo(x, 602);
    ctx.lineTo(x - 10, 590);
    ctx.closePath();
    fillStroke(ctx, x % 100 === 25 ? PAL.teal : PAL.ochre, null);
  }
  // The floor: beaten earth and worn flagstones.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#a8835a"],
    [1, "#6a4a2e"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(60,36,16,0.35)";
  ctx.lineWidth = 1.6;
  for (const y of [floor + 32, floor + 68]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 0; x < w; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x + rng.range(-8, 8), floor);
    ctx.lineTo(x - 14, h);
    ctx.stroke();
  }

  // Saddlebags and rolled carpets along the wall near where the bird comes in.
  const b = IBR_BAGS;
  carpetRoll(ctx, b.x, floor, 150, 18, "#9a3a2e");
  carpetRoll(ctx, b.x + 20, floor - 36, 130, 16, "#2f6f6a");
  bag(ctx, b.x + 160, floor, 70, 64, "#7a4a2a");
  bag(ctx, b.x - 70, floor, 64, 56, "#5a6a3a");

  // The bales piled against the wall by the far end (their top is a step), and the high ledge above them.
  const bl = IBR_BALES;
  for (const [dy, dx, ww] of [[0, 0, bl.w], [-52, 8, bl.w - 16], [-104, 18, bl.w - 36]] as const) {
    rounded(ctx, bl.x + dx, floor + dy - 52, ww, 52, 10);
    fillStroke(ctx, "#c9a86a", INK, 2);
    ctx.strokeStyle = "#7a5a2a";
    ctx.lineWidth = 3;
    for (const t of [0.3, 0.7]) {
      ctx.beginPath();
      ctx.moveTo(bl.x + dx + ww * t, floor + dy - 52);
      ctx.lineTo(bl.x + dx + ww * t, floor + dy);
      ctx.stroke();
    }
  }
  board(ctx, bl.x + 18, bl.top, bl.w - 36, 10, "#d9b77a", "#a8834a");
  const le = IBR_LEDGE;
  board(ctx, le.x, le.y, le.w, 14);
  for (const x of [le.x + 20, le.x + le.w - 30]) {
    blob(ctx, [
      [x, le.y + 14],
      [x + 10, le.y + 14],
      [x + 10, le.y + 50],
    ]);
    fillStroke(ctx, PAL.wood, INK, 1.6);
  }

  brush(ctx, w, h, "battuta-room", { light: [0.36, 0.2], strength: 0.42, strokes: 2000, warm: "rgba(255,214,150,0.16)", cool: "rgba(40,30,50,0.14)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the ring
/** Where the stand's picture begins in the inn, and its size: from a little left of its left post to a little right of its right one, from above the beam to the floor. */
export function standBox(): { x: number; y: number; w: number; h: number } {
  const top = IBR_RING.beam - 24;
  return { x: IBR_RING.postL - 30, y: top, w: IBR_RING.postR - IBR_RING.postL + 60, h: IBR_WORLD.floor + 6 - top };
}
/**
 * The great ring on its wooden stand for a stage of `n` beads: two posts and a beam, two cords from the beam to the ring,
 * the ring itself (a plain wooden hoop, the same all round, so that it says no way from one bead to the next), and a small
 * peg under each bead's place for the bird to stand on. The beads and the thread are separate pictures, placed by the scene.
 */
export function standArt(scale: number, n: number): Painted {
  const box = standBox();
  const [p, ctx] = sheet(box.w, box.h, scale);
  const X = (x: number) => x - box.x;
  const Y = (y: number) => y - box.y;
  const R = IBR_RING;
  // The posts and the beam.
  for (const x of [R.postL, R.postR]) {
    board(ctx, X(x - 12), Y(R.beam), 24, IBR_WORLD.floor - R.beam, "#8a5a30", "#5a3418");
    board(ctx, X(x - 30), Y(IBR_WORLD.floor - 14), 60, 16, "#8a5a30", "#5a3418");
  }
  board(ctx, X(R.postL - 24), Y(R.beam - 18), R.postR - R.postL + 48, 20, "#b47a42", PAL.wood);
  // The cords the ring hangs by.
  ctx.strokeStyle = "#e8d6a8";
  ctx.lineWidth = 3;
  for (const dx of [-90, 90]) {
    ctx.beginPath();
    ctx.moveTo(X(R.cx + dx * 1.6), Y(R.beam));
    ctx.lineTo(X(R.cx + dx), Y(R.cy - Math.sqrt(R.r * R.r - dx * dx)));
    ctx.stroke();
  }
  // The ring: a plain wooden hoop, the same all round.
  for (const [lw, colour] of [[16, INK], [11, "#9a6232"], [3, "rgba(255,220,160,0.45)"]] as const) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = lw;
    circle(ctx, X(R.cx), Y(R.cy), R.r);
    ctx.stroke();
  }
  // A peg under every bead's place.
  for (let i = 0; i < n; i++) {
    const g = pegOf(beadAt(n, i, false));
    ctx.strokeStyle = "#6b4222";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(X(g.x + g.w / 2), Y(g.y - IBR_RING.peg + IBR_RING.bead - 6));
    ctx.lineTo(X(g.x + g.w / 2), Y(g.y));
    ctx.stroke();
    board(ctx, X(g.x), Y(g.y), g.w, 10, "#c08a52", "#8a5a30");
  }
  brush(ctx, box.w, box.h, `battuta-stand-${n}`, { strokes: 220, strength: 0.5 });
  return p;
}

/** A bead with its sign, as the page draws it: dark with a cream sign, or gold with a dark sign and a heavy outline once on the thread. */
export function beadArt(scale: number, i: number, on: boolean): Painted {
  const r = IBR_RING.bead;
  const size = 2 * r + 10;
  const [p, c] = sheet(size, size, scale);
  circle(c, size / 2, size / 2, r);
  c.fillStyle = on ? PAL.gold : PAL.deep;
  c.fill();
  c.strokeStyle = on ? INK : PAL.tealLight;
  c.lineWidth = on ? 5 : 2.5;
  c.stroke();
  c.save();
  c.translate(size / 2, size / 2);
  // The page's sign is drawn for a bead of 38; this one is 30.
  c.scale(r / 38, r / 38);
  traceSign(c, i);
  c.fillStyle = on ? INK : PAL.cream;
  c.fill("evenodd");
  c.restore();
  return p;
}
/** A bead's number as dots, as on the page: up to five in a row, the rest in a second row. No numeral is drawn. */
export function dotsArt(scale: number, count: number): Painted {
  const [p, c] = sheet(64, 28, scale);
  const rows = [Math.min(count, 5), Math.max(count - 5, 0)];
  rows.forEach((k, row) => {
    for (let d = 0; d < k; d++) {
      circle(c, 32 + (d - (k - 1) / 2) * 11, 8 + row * 12, 3.6);
      fillStroke(c, PAL.cream, INK, 1.2);
    }
  });
  return p;
}
/** The bead reached last: a cream ring and eight short rays round it, as on the page (shape as well as colour). */
export function lastArt(scale: number): Painted {
  const r = IBR_RING.bead;
  const size = 2 * (r + 24);
  const [p, c] = sheet(size, size, scale);
  c.strokeStyle = PAL.cream;
  c.lineWidth = 5;
  circle(c, size / 2, size / 2, r + 7);
  c.stroke();
  for (let k = 0; k < 8; k++) {
    const a = (Math.PI * 2 * k) / 8;
    c.beginPath();
    c.moveTo(size / 2 + Math.cos(a) * (r + 13), size / 2 + Math.sin(a) * (r + 13));
    c.lineTo(size / 2 + Math.cos(a) * (r + 22), size / 2 + Math.sin(a) * (r + 22));
    c.stroke();
  }
  return p;
}
/** The bead of the last slip: a broken red ring, as on the page, so that it is not colour alone. */
export function wrongArt(scale: number): Painted {
  const r = IBR_RING.bead + 5;
  const size = 2 * r + 12;
  const [p, c] = sheet(size, size, scale);
  c.strokeStyle = "#ff8f84";
  c.lineWidth = 5;
  c.setLineDash([10, 7]);
  circle(c, size / 2, size / 2, r);
  c.stroke();
  c.setLineDash([]);
  return p;
}
/** The ring that shows which bead the bird is near enough to touch: solid lantern gold with a dark edge, wider than the page's marks. */
export function focusArt(scale: number): Painted {
  const r = IBR_RING.bead + 12;
  const size = 2 * r + 12;
  const [p, c] = sheet(size, size, scale);
  for (const [lw, colour] of [[8, INK], [5, PAL.goldLight]] as const) {
    c.lineWidth = lw;
    c.strokeStyle = colour;
    circle(c, size / 2, size / 2, r);
    c.stroke();
  }
  return p;
}
/** A piece of the thread, 64 long, laid from bead to bead and stretched to fit: a dark line under a gold one, as on the page. */
export function threadArt(scale: number): Painted {
  const [p, c] = sheet(64, 14, scale);
  c.fillStyle = INK;
  rounded(c, 0, 1.5, 64, 11, 5);
  c.fill();
  c.fillStyle = PAL.goldLight;
  rounded(c, 0, 4, 64, 6, 3);
  c.fill();
  return p;
}

// ---------------------------------------------------------------------------------------------- the things
/** The lectern with the plain scroll on it: a slanted wooden top on a post, and a rolled parchment with nothing on it. */
export function lecternArt(scale: number): Painted {
  const [p, c] = sheet(120, 110, scale);
  board(c, 54, 30, 12, 72, "#8a5a30", "#5a3418");
  board(c, 30, 98, 60, 10, "#8a5a30", "#5a3418");
  blob(c, [
    [10, 38],
    [110, 22],
    [112, 34],
    [12, 50],
  ]);
  fillStroke(c, "#9a6232", INK, 2);
  // The scroll: a sheet partly unrolled, with a roll at each end. Plain: no line, no mark, no letter on it.
  blob(c, [
    [24, 28],
    [96, 16],
    [98, 28],
    [26, 40],
  ]);
  fillStroke(c, PAL.parchment, INK, 1.6);
  for (const [x, y] of [[22, 34], [98, 22]] as const) {
    c.beginPath();
    c.ellipse(x, y, 6, 9, -0.2, 0, Math.PI * 2);
    fillStroke(c, "#f6ecd2", INK, 1.6);
  }
  return p;
}
/** The camel resting, lying on the floor with its legs folded: one hump, a long neck, a kind face. A simple, friendly shape. */
export function camelArt(scale: number): Painted {
  const [p, c] = sheet(260, 170, scale);
  const hide = "#c9945a";
  // The body, lying, with its folded legs under it.
  blob(c, [
    [30, 150],
    [26, 112],
    [60, 86],
    [96, 60],
    [130, 58],
    [162, 84],
    [196, 100],
    [206, 140],
    [190, 160],
    [40, 162],
  ]);
  fillStroke(c, linear(c, 0, 58, 0, 162, [[0, "#d9a868"], [1, "#a8743e"]]), INK, 2.4);
  for (const x of [60, 150]) {
    rounded(c, x, 146, 46, 18, 8);
    fillStroke(c, "#b9824a", INK, 2);
  }
  // A saddle blanket over the hump: stripes, no writing.
  blob(c, [
    [84, 74],
    [150, 70],
    [158, 108],
    [80, 112],
  ]);
  fillStroke(c, "#2f6f6a", INK, 2);
  c.fillStyle = PAL.ochre;
  c.fillRect(84, 98, 72, 6);
  // The neck and the head, turned toward the room.
  blob(c, [
    [190, 104],
    [214, 70],
    [222, 40],
    [236, 26],
    [254, 34],
    [252, 50],
    [236, 56],
    [226, 92],
    [206, 124],
  ]);
  fillStroke(c, hide, INK, 2.4);
  c.fillStyle = INK;
  circle(c, 240, 36, 3.2);
  c.fill();
  c.strokeStyle = "rgba(42,26,18,0.7)";
  c.lineWidth = 2;
  c.beginPath();
  c.arc(246, 46, 5, 0.2, 1.6);
  c.stroke();
  blob(c, [
    [226, 24],
    [230, 14],
    [236, 22],
  ]);
  fillStroke(c, hide, INK, 1.6);
  // The tail.
  c.strokeStyle = INK;
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(30, 120);
  c.quadraticCurveTo(14, 126, 16, 146);
  c.stroke();
  brush(c, 260, 170, "battuta-camel", { strokes: 160, strength: 0.7 });
  return p;
}
/** The saddlebag on the high ledge, where the feather hides: one pouch with a flap and tassels, a band of plain diamonds. */
export function saddlebagArt(scale: number): Painted {
  const [p, c] = sheet(100, 70, scale);
  bag(c, 10, 58, 80, 54, "#8a3a2a");
  blob(c, [
    [18, 24],
    [82, 24],
    [76, 40],
    [24, 40],
  ]);
  fillStroke(c, "#6a2a20", INK, 1.8);
  return p;
}
/** The lantern, hung by a chain: a brass frame round a warm light. */
export function lanternArt(scale: number): Painted {
  const [p, c] = sheet(60, 170, scale);
  c.strokeStyle = PAL.brass;
  c.lineWidth = 2.4;
  c.beginPath();
  c.moveTo(30, 0);
  c.lineTo(30, 92);
  c.stroke();
  blob(c, [
    [30, 88],
    [48, 104],
    [44, 150],
    [16, 150],
    [12, 104],
  ]);
  fillStroke(c, linear(c, 0, 92, 0, 150, [[0, "#fff1c4"], [1, "#f2b94b"]]), INK, 2);
  c.strokeStyle = PAL.brass;
  c.lineWidth = 2;
  for (const x of [22, 30, 38]) {
    c.beginPath();
    c.moveTo(x, 96);
    c.lineTo(x, 150);
    c.stroke();
  }
  rounded(c, 12, 148, 36, 10, 3);
  fillStroke(c, PAL.brass, INK, 1.6);
  return p;
}
