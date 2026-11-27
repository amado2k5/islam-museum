// Al-Idrisi's hall, drawn in code in the art bible's style and palette: a bright hall by day with tall arched windows,
// a tall shelf of rolled sheets and books, a basket of rolled sheets, and in the middle a great table seen at an angle,
// its top sloping from a high back edge to a low front one, with a low rail along the front of each row of sheets; by
// the table a plain lamp on a low stand. A trial picture, like every picture in this game.
//
// What it is not. It is no real hall and no picture of where al-Idrisi worked, and it has no inscription, no writing,
// no globe and no disc: the books are coloured spines, the rolled sheets are plain, and the loose sheets on the shelf are
// blank parchment. The sheets on the table are the page quest's own drawing (art/sheets.ts, `drawSheet`, shared, not
// copied): an imagined coast, river and road made from the edge codes, not al-Idrisi's map and not any real place.
// Nothing here draws text: a test holds it to that. The sheets, the lifted sheet's shadow and frame, the marks on the
// seams that do not match, the stack and the lamp are placed by the scene (scenes/idrisi.ts) from the quest's own state.
import { Rng } from "@im/kernel/prng";
import { ISR_LAMP_STAND, ISR_LEVELS, ISR_SHELF, ISR_TABLE, ISR_TILE, ISR_WINDOWS, ISR_WORLD, railHalf, railY } from "../content/idrisi-room";
import type { Sheet } from "../sim/sheets";
import { drawSheet } from "./sheets";
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
/** Rolled sheets lying on a shelf, their ends towards us: plain parchment rolls tied with a cord, no writing. */
function rolls(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  for (let rx = x + 14; rx < x + w - 12; rx += rng.range(22, 28)) {
    const r = rng.range(9, 12);
    const cy = y - r - rng.range(0, 4);
    ctx.beginPath();
    ctx.ellipse(rx, cy, r * 0.8, r, 0, 0, Math.PI * 2);
    fillStroke(ctx, PAL.parchment, PAL.woodDark, 1.6);
    ctx.beginPath();
    ctx.ellipse(rx, cy, r * 0.32, r * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(122,74,38,0.6)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  // A second layer of rolls lying across, seen from the side.
  for (let rx = x + 20; rx < x + w - 60; rx += rng.range(70, 90)) {
    rounded(ctx, rx, y - 34, rng.range(44, 58), 12, 6);
    fillStroke(ctx, "#f3e6c8", PAL.woodDark, 1.4);
    ctx.fillStyle = PAL.terracotta;
    ctx.fillRect(rx + 18, y - 34, 3, 12);
  }
}

/** The tall window of a bright hall: an arch of pale sky with soft clouds and a wooden lattice. */
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
    [0, "#8cc4e8"],
    [0.7, "#cfe6f2"],
    [1, "#f2ead2"],
  ]);
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < 3; i++) {
    const cx = o.x + rng.range(20, o.w - 20);
    const cy = o.y + rng.range(60, o.h - 80);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    for (const [dx, dy, r] of [[-14, 4, 12], [0, 0, 16], [16, 4, 12]] as const) {
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
  ctx.strokeStyle = "#8a5a30";
  open();
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  open();
  ctx.stroke();
  board(ctx, o.x - 16, o.y + o.h, o.w + 32, 14, "#c08a52", "#8a5a30");
}

/** The whole hall behind the figures and the sheets, 2400 by 720 game pixels. */
export function idrisiHall(scale: number): Painted {
  const w = ISR_WORLD.width;
  const h = ISR_WORLD.height;
  const floor = ISR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-idrisi-hall");

  // The wall by day: warm sand, paler high up where the light from the windows falls.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#f1e4c6"],
    [0.6, "#e4cfa4"],
    [1, "#cfb27e"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 220; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.6) ? `rgba(255,248,226,${rng.range(0.04, 0.1)})` : `rgba(120,80,40,${rng.range(0.02, 0.05)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // A band of star tiles along the wall, as in the other rooms, bright by day.
  ctx.fillStyle = "#7a4a26";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? PAL.terracotta : PAL.teal, PAL.cream);
  // The floor: pale stone slabs.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#d6c49e"],
    [1, "#9c8a66"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(90,70,40,0.4)";
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

  // The tall windows, and the sunlight they let fall across the wall and the floor.
  for (const o of ISR_WINDOWS) {
    windowOf(ctx, rng, o);
    ctx.fillStyle = "rgba(255,246,214,0.16)";
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.lineTo(o.x + o.w + 150, floor + 60);
    ctx.lineTo(o.x + 110, floor + 60);
    ctx.closePath();
    ctx.fill();
  }

  // The tall shelf: its top and its two shelves are perches; the stack of loose sheets is placed on its top by the scene.
  const sh = ISR_SHELF;
  ctx.fillStyle = linear(ctx, sh.x, 0, sh.x + sh.w, 0, [
    [0, "#8a5a30"],
    [1, "#6a4020"],
  ]);
  ctx.fillRect(sh.x - 10, sh.top, sh.w + 20, floor - sh.top);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(sh.x - 10, sh.top, sh.w + 20, floor - sh.top);
  rolls(ctx, rng, sh.x, sh.shelves[0], sh.w);
  books(ctx, rng, sh.x, sh.shelves[1], sh.w);
  rolls(ctx, rng, sh.x, 540, sh.w);
  for (const y of [...sh.shelves, 540]) board(ctx, sh.x, y, sh.w, 12);
  board(ctx, sh.x - 14, sh.top, sh.w + 28, 12);

  // The great table, seen at an angle. Its back legs first, then the sloping top, then its front and the rails.
  const t = ISR_TABLE;
  const bl = t.cx - t.backW / 2;
  const br = t.cx + t.backW / 2;
  const fl = t.cx - t.frontW / 2;
  const fr = t.cx + t.frontW / 2;
  ctx.fillStyle = "#5a3418";
  for (const x of [bl + 20, br - 36]) {
    ctx.fillRect(x, t.back, 16, floor - t.back);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, t.back, 16, floor - t.back);
  }
  // A crossbar low down between the back legs.
  board(ctx, bl + 20, floor - 70, t.backW - 40, 12, "#6a4020", "#4a2a14");
  ctx.beginPath();
  ctx.moveTo(bl, t.back);
  ctx.lineTo(br, t.back);
  ctx.lineTo(fr, t.front);
  ctx.lineTo(fl, t.front);
  ctx.closePath();
  fillStroke(ctx, linear(ctx, 0, t.back, 0, t.front, [
    [0, "#9a6232"],
    [1, "#c08a52"],
  ]), INK, 2.6);
  // The wood's grain, running from the back to the front.
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(74,42,20,0.18)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 14; i++) {
    const f = i / 14;
    ctx.beginPath();
    ctx.moveTo(bl + f * t.backW, t.back);
    ctx.lineTo(fl + f * t.frontW, t.front);
    ctx.stroke();
  }
  // Sunlight lying across the table.
  ctx.fillStyle = radial(ctx, t.cx - 120, t.back + 120, 20, 520, [
    [0, "rgba(255,246,214,0.28)"],
    [1, "rgba(255,246,214,0)"],
  ]);
  ctx.fillRect(fl, t.back, t.frontW, t.front - t.back);
  ctx.restore();
  // The table's front edge and short front legs.
  board(ctx, fl - 6, t.front, t.frontW + 12, 20, "#b47a42", "#7a4a26");
  ctx.fillStyle = PAL.wood;
  for (const x of [fl + 6, fr - 28]) {
    ctx.fillRect(x, t.front + 20, 22, floor - t.front - 20);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, t.front + 20, 22, floor - t.front - 20);
  }
  // The rails along the front of each row: low wooden lips the sheets rest against, and the perches the bird stands on.
  for (const l of ISR_LEVELS) board(ctx, t.cx - railHalf(l), railY(l), 2 * railHalf(l), 8, "#d49a5a", "#8a5a30");

  // The lamp's low stand: a step on two posts (a perch); the lamp itself is placed on it by the scene.
  const ls = ISR_LAMP_STAND;
  board(ctx, ls.x, ls.y, ls.w, 14);
  ctx.fillStyle = PAL.woodDark;
  for (const x of [ls.x + 14, ls.x + ls.w - 28]) {
    ctx.fillRect(x, ls.y + 14, 14, floor - ls.y - 14);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, ls.y + 14, 14, floor - ls.y - 14);
  }

  // A basket of rolled sheets on the floor near the far end.
  const bx = 2010;
  for (let i = 0; i < 6; i++) {
    const x = bx + 12 + i * 11;
    rounded(ctx, x, floor - 92 + (i % 2) * 8, 10, 60, 5);
    fillStroke(ctx, PAL.parchment, PAL.woodDark, 1.4);
  }
  blob(ctx, [
    [bx, floor - 44],
    [bx + 90, floor - 44],
    [bx + 82, floor],
    [bx + 8, floor],
  ]);
  fillStroke(ctx, "#b48a4a", INK, 2);
  ctx.strokeStyle = "rgba(74,42,20,0.5)";
  ctx.lineWidth = 1.6;
  for (const y of [floor - 32, floor - 18]) {
    ctx.beginPath();
    ctx.moveTo(bx + 4, y);
    ctx.lineTo(bx + 86, y);
    ctx.stroke();
  }

  brush(ctx, w, h, "idrisi-hall", { light: [0.3, 0.1], strength: 0.45, strokes: 2200, warm: "rgba(255,240,200,0.16)", cool: "rgba(60,40,20,0.16)" });
  return p;
}

// ---------------------------------------------------------------------------------------------- the pieces
/** One sheet of the map, the page quest's own drawing (`drawSheet`), ISR_TILE game pixels square, on nothing. */
export function sheetArt(scale: number, sh: Sheet): Painted {
  const [p, c] = sheet(ISR_TILE, ISR_TILE, scale);
  drawSheet(c, sh, ISR_TILE);
  return p;
}
/** The soft shadow a lifted sheet casts on the table. */
export function sheetShadow(scale: number): Painted {
  const s = ISR_TILE + 24;
  const [p, c] = sheet(s, s, scale);
  for (let i = 0; i < 6; i++) {
    rounded(c, 12 - i * 2, 12 - i * 2, ISR_TILE + i * 4, ISR_TILE + i * 4, 10 + i * 2);
    c.fillStyle = `rgba(40,20,8,${0.09 - i * 0.012})`;
    c.fill();
  }
  return p;
}
/** The gold frame round a lifted sheet: shape and colour both, a thick line set apart from the sheet. */
export function liftFrame(scale: number): Painted {
  const s = ISR_TILE + 16;
  const [p, c] = sheet(s, s, scale);
  rounded(c, 4, 4, s - 8, s - 8, 11);
  c.lineWidth = 6;
  c.strokeStyle = PAL.gold;
  c.stroke();
  return p;
}
/** A seam that does not match: a broken red line as long as a sheet's edge, as the page's picture draws it (a dashed line, so it is not colour alone). Upright for a seam between two sheets of a row, lying for one between rows. */
export function seamMark(scale: number, upright: boolean): Painted {
  const [p, c] = sheet(upright ? 8 : ISR_TILE, upright ? ISR_TILE : 8, scale);
  c.lineWidth = 5;
  c.strokeStyle = "#e0463c";
  c.setLineDash([11, 7]);
  c.lineCap = "butt";
  c.beginPath();
  if (upright) {
    c.moveTo(4, 0);
    c.lineTo(4, ISR_TILE);
  } else {
    c.moveTo(0, 4);
    c.lineTo(ISR_TILE, 4);
  }
  c.stroke();
  return p;
}
/** The stack of loose sheets on top of the tall shelf: blank parchment sheets, a little askew, with nothing drawn on them. */
export function looseStack(scale: number): Painted {
  const [p, c] = sheet(120, 44, scale);
  const tilts = [-0.06, 0.05, -0.02, 0.08];
  tilts.forEach((a, i) => {
    c.save();
    c.translate(60, 36 - i * 7);
    c.rotate(a);
    rounded(c, -48, -6, 96, 12, 2);
    fillStroke(c, i % 2 ? "#f3e6c8" : PAL.parchment, PAL.woodDark, 1.6);
    c.restore();
  });
  return p;
}
/** A plain oil lamp: a brass dish with a spout and a small flame, on a short foot. */
export function lamp(scale: number): Painted {
  const [p, c] = sheet(80, 64, scale);
  blob(c, [
    [30, 62],
    [50, 62],
    [46, 50],
    [34, 50],
  ]);
  fillStroke(c, PAL.brass, INK, 1.8);
  blob(c, [
    [10, 46],
    [14, 34],
    [52, 34],
    [70, 28],
    [64, 42],
    [54, 50],
    [20, 52],
  ]);
  fillStroke(c, linear(c, 10, 0, 70, 0, [
    [0, "#f0c868"],
    [0.6, PAL.brass],
    [1, "#8f6420"],
  ]), INK, 2);
  blob(c, [
    [66, 26],
    [62, 14],
    [68, 2],
    [74, 14],
  ]);
  fillStroke(c, PAL.amber, null);
  blob(c, [
    [67, 22],
    [66, 14],
    [68, 8],
    [71, 14],
  ]);
  fillStroke(c, PAL.goldLight, null);
  return p;
}
