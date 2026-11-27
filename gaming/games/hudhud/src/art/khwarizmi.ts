// Al-Khwarizmi's room, drawn in code in the art bible's style and palette: a quiet scholar's room by day, with a window,
// shelves of books and scrolls, a low writing desk with a plain inkpot and reed pens, and in the middle a long table on
// which two large trays stand side by side with an equals sign between them; two plain brass weights on a stand by the
// table, a scoop on the table, and the locked box on a plinth beside it. A trial picture, like every picture in this game.
//
// What it is not. It is no real room and no picture of where al-Khwarizmi worked, and it has no inscription, no writing
// and no numerals: the books are coloured spines and the scrolls plain rolls, nothing more. The amounts on the trays are
// shown exactly as the page quest's picture shows them (art/algebra.ts): a thing is a small closed box, a unit is a coin,
// and what is taken away is the same shape drawn hollow with a bar through it. The weights, marked only with a box shape
// and a coin shape, and the scoop are the game's own controls for balancing and sharing; nothing read for the game says he
// used trays or scales. The boxes and coins are placed by the scene (scenes/khwarizmi.ts) from the quest's own state.
import { Rng } from "@im/kernel/prng";
import { AKR_BOOKS, AKR_DESK, AKR_EQUALS, AKR_PLINTH, AKR_STAND, AKR_TABLE, AKR_TRAY, AKR_TRAYS, AKR_WINDOW, AKR_WORLD } from "../content/khwarizmi-room";
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
/** A row of books, spines out, and now and then a pile of scrolls: coloured bands and plain rolls with no writing. */
function booksAndScrolls(ctx: Ctx, rng: Rng, x: number, y: number, w: number): void {
  const colours = ["#7a2f2a", "#2b4fa3", "#2f6b4a", "#8a5a2e", "#5a3a6a", "#a8352e", "#1d6f78"];
  for (let bx = x + 8; bx < x + w - 14; ) {
    if (rng.chance(0.22) && bx < x + w - 50) {
      // Scrolls lying on their side, three in a pile: cream rolls with darker ends.
      for (const [dx, dy] of [
        [0, 0],
        [22, 0],
        [11, -18],
      ] as const) {
        ctx.beginPath();
        ctx.ellipse(bx + dx + 10, y - 9 + dy, 10, 9, 0, 0, Math.PI * 2);
        fillStroke(ctx, PAL.cream, INK, 1.4);
        ctx.beginPath();
        ctx.ellipse(bx + dx + 10, y - 9 + dy, 4, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#b89a6a";
        ctx.fill();
      }
      bx += 48;
      continue;
    }
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
/** One tray standing on the table, leaning back a little: a parchment board in a wooden frame, with the strip along its
 * bottom where what is taken away stands marked off by a plain line. Its boxes and coins are placed by the scene. */
function tray(ctx: Ctx, x: number): void {
  const T = AKR_TRAY;
  // Two small feet under it, on the table.
  ctx.fillStyle = PAL.woodDark;
  for (const fx of [x + 30, x + T.w - 54]) ctx.fillRect(fx, T.top + T.h, 24, AKR_TABLE.y - (T.top + T.h));
  rounded(ctx, x, T.top, T.w, T.h, 16);
  ctx.fillStyle = PAL.parchment;
  ctx.fill();
  ctx.strokeStyle = PAL.woodDark;
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  // The strip for what is taken away: a slightly darker band, set off by a line.
  const sy = T.top + T.pad + T.strip.top - 4;
  ctx.fillStyle = "rgba(122,74,38,0.12)";
  ctx.fillRect(x + 8, sy, T.w - 16, T.strip.h + 8);
  ctx.strokeStyle = "rgba(74,42,20,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 12, sy);
  ctx.lineTo(x + T.w - 12, sy);
  ctx.stroke();
  // The rim of the tray.
  ctx.fillStyle = PAL.woodDark;
  ctx.fillRect(x + 18, T.top + T.h - 6, T.w - 36, 10);
}

/** The whole room behind the figures and the trays' contents, 2400 by 720 game pixels. */
export function khwarizmiRoom(scale: number): Painted {
  const w = AKR_WORLD.width;
  const h = AKR_WORLD.height;
  const floor = AKR_WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-khwarizmi-room");

  // The wall: warm plaster by day, sand above and ochre low down.
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#d9c39a"],
    [0.6, "#e6d2a8"],
    [1, "#c9a873"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  for (let i = 0; i < 300; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(255,245,220,${rng.range(0.03, 0.07)})` : `rgba(120,80,40,${rng.range(0.02, 0.05)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // Plain rounded arches along the wall, without writing.
  ctx.strokeStyle = "rgba(122,74,38,0.28)";
  ctx.lineWidth = 4;
  for (let x = 900; x < w - 300; x += 280) {
    ctx.beginPath();
    ctx.moveTo(x, 540);
    ctx.lineTo(x, 200);
    ctx.arc(x + 110, 200, 110, Math.PI, 0);
    ctx.lineTo(x + 220, 540);
    ctx.stroke();
  }
  // A band of star tiles along the wall, terracotta and teal.
  ctx.fillStyle = "#6a4a2a";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? PAL.terracotta : PAL.teal, "#f3e6c8");
  // The floor: stone slabs, as in the other rooms, warm in the day.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#b8a888"],
    [1, "#6a5e4a"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(40,30,20,0.4)";
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

  // The window on the day: a pale sky, a palm far away, and a wooden lattice.
  const o = AKR_WINDOW;
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
    [0, "#9fd0ea"],
    [0.75, "#d8ecf2"],
    [1, "#f2e6c4"],
  ]);
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = "#c8b48a";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y + o.h);
  ctx.quadraticCurveTo(o.x + o.w * 0.4, o.y + o.h - 50, o.x + o.w, o.y + o.h - 24);
  ctx.lineTo(o.x + o.w, o.y + o.h);
  ctx.closePath();
  ctx.fill();
  // A palm: a curved trunk and a few fronds.
  ctx.strokeStyle = "#6a5a3a";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(o.x + o.w * 0.7, o.y + o.h - 30);
  ctx.quadraticCurveTo(o.x + o.w * 0.62, o.y + o.h - 120, o.x + o.w * 0.66, o.y + o.h - 170);
  ctx.stroke();
  ctx.strokeStyle = "#4f7a4a";
  ctx.lineWidth = 5;
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i - 2.5) * 0.5;
    const cx = o.x + o.w * 0.66;
    const cy = o.y + o.h - 170;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 30 - 10, cx + Math.cos(a) * 64, cy + Math.sin(a) * 40 + 16);
    ctx.stroke();
  }
  ctx.restore();
  // The lattice and the frame.
  ctx.save();
  open();
  ctx.clip();
  ctx.strokeStyle = "rgba(90,58,30,0.75)";
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
  ctx.strokeStyle = "#8a5a2e";
  open();
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  open();
  ctx.stroke();
  ctx.fillStyle = "#8a5a2e";
  ctx.fillRect(o.x - 18, o.y + o.h, o.w + 36, 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(o.x - 18, o.y + o.h, o.w + 36, 14);
  // Daylight from the window on the floor and the wall beside it.
  ctx.fillStyle = radial(ctx, o.x + o.w / 2, floor - 10, 20, 380, [
    [0, "rgba(255,240,190,0.35)"],
    [1, "rgba(255,240,190,0)"],
  ]);
  ctx.fillRect(0, floor - 300, 900, 400);

  // The shelves of books and scrolls: a tall case, its two upper shelves perches.
  const bk = AKR_BOOKS;
  ctx.fillStyle = linear(ctx, bk.x, 0, bk.x + bk.w, 0, [
    [0, "#5a3820"],
    [1, "#442814"],
  ]);
  ctx.fillRect(bk.x - 10, bk.top - 20, bk.w + 20, floor - bk.top + 20);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(bk.x - 10, bk.top - 20, bk.w + 20, floor - bk.top + 20);
  for (const y of [...bk.shelves, 540]) {
    booksAndScrolls(ctx, rng, bk.x, y, bk.w);
    shelfBoard(ctx, bk.x, y, bk.w);
  }
  shelfBoard(ctx, bk.x - 10, bk.top - 24, bk.w + 20);

  // The low writing desk: a plain board on short legs, a plain inkpot and two reed pens on it, and a cushion before it.
  const d = AKR_DESK;
  ctx.fillStyle = PAL.woodDark;
  for (const lx of [d.x + 10, d.x + d.w - 26]) {
    ctx.fillRect(lx, d.y + 12, 16, floor - d.y - 12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(lx, d.y + 12, 16, floor - d.y - 12);
  }
  ctx.fillStyle = linear(ctx, 0, d.y, 0, d.y + 16, [
    [0, "#b97a40"],
    [1, PAL.wood],
  ]);
  ctx.fillRect(d.x - 6, d.y, d.w + 12, 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(d.x - 6, d.y, d.w + 12, 14);
  // The inkpot: a dark round pot with a narrow neck.
  blob(ctx, [
    [d.x + 30, d.y],
    [d.x + 24, d.y - 14],
    [d.x + 32, d.y - 24],
    [d.x + 44, d.y - 24],
    [d.x + 52, d.y - 14],
    [d.x + 46, d.y],
  ]);
  fillStroke(ctx, "#2a2a3a", INK, 1.6);
  ctx.fillStyle = "#3a3a4e";
  ctx.fillRect(d.x + 33, d.y - 30, 10, 7);
  ctx.strokeRect(d.x + 33, d.y - 30, 10, 7);
  // Two reed pens, one in the pot and one lying on the desk.
  for (const [x0, y0, x1, y1] of [
    [d.x + 40, d.y - 28, d.x + 60, d.y - 74],
    [d.x + 74, d.y - 3, d.x + 140, d.y - 9],
  ] as const) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = "#d8b878";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // A blank sheet on the desk (nothing written on it).
  ctx.fillStyle = "#f6ecd2";
  ctx.fillRect(d.x + 90, d.y - 4, 46, 4);
  // A cushion on the floor before the desk.
  blob(ctx, [
    [d.x - 70, floor],
    [d.x - 66, floor - 18],
    [d.x - 10, floor - 20],
    [d.x - 4, floor],
  ]);
  fillStroke(ctx, PAL.terracotta, INK, 1.6);

  // The stand by the table on which the two weights stand: a low plain bench (a perch).
  const st = AKR_STAND;
  ctx.fillStyle = PAL.woodDark;
  for (const lx of [st.x + 16, st.x + st.w - 36]) {
    ctx.fillRect(lx, st.y + 12, 20, floor - st.y - 12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(lx, st.y + 12, 20, floor - st.y - 12);
  }
  ctx.fillStyle = linear(ctx, 0, st.y, 0, st.y + 16, [
    [0, "#a8703c"],
    [1, PAL.wood],
  ]);
  ctx.fillRect(st.x, st.y, st.w, 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(st.x, st.y, st.w, 14);

  // The long table (a perch) and the two trays standing on it, with the equals sign between them.
  const tb = AKR_TABLE;
  ctx.fillStyle = PAL.woodDark;
  for (const lx of [tb.x + 20, tb.x + tb.w / 2 - 12, tb.x + tb.w - 44]) {
    ctx.fillRect(lx, tb.y + 14, 24, floor - tb.y - 14);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(lx, tb.y + 14, 24, floor - tb.y - 14);
  }
  for (const t of AKR_TRAYS) tray(ctx, t.x);
  ctx.fillStyle = linear(ctx, 0, tb.y, 0, tb.y + 22, [
    [0, "#b97a40"],
    [1, PAL.wood],
  ]);
  ctx.fillRect(tb.x - 10, tb.y, tb.w + 20, 22);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(tb.x - 10, tb.y, tb.w + 20, 22);
  // The equals sign: two gold bars, as on the page's picture.
  for (const dy of [-16, 8]) {
    rounded(ctx, AKR_EQUALS.x - 28, AKR_EQUALS.y + dy, 56, 10, 4);
    fillStroke(ctx, PAL.goldLight, INK, 2);
  }

  // The plinth of the locked box: a plain stone pillar (its top a perch).
  const pl = AKR_PLINTH;
  ctx.fillStyle = linear(ctx, pl.x, 0, pl.x + pl.w, 0, [
    [0, "#b8ab8e"],
    [1, "#8a7e66"],
  ]);
  ctx.fillRect(pl.x + 8, pl.y + 14, pl.w - 16, floor - pl.y - 14);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(pl.x + 8, pl.y + 14, pl.w - 16, floor - pl.y - 14);
  ctx.fillStyle = "#c8bc9e";
  ctx.fillRect(pl.x - 4, pl.y, pl.w + 8, 14);
  ctx.strokeRect(pl.x - 4, pl.y, pl.w + 8, 14);
  ctx.fillRect(pl.x, floor - 16, pl.w, 16);
  ctx.strokeRect(pl.x, floor - 16, pl.w, 16);

  brush(ctx, w, h, "khwarizmi-room", { light: [0.08, 0.25], strength: 0.6, strokes: 2400, warm: "rgba(255,220,160,0.18)", cool: "rgba(60,40,20,0.25)" });
  // The room is a little darker towards its ceiling and its far corner.
  ctx.fillStyle = linear(ctx, 0, 0, 0, 200, [
    [0, "rgba(60,40,20,0.35)"],
    [1, "rgba(60,40,20,0)"],
  ]);
  ctx.fillRect(0, 0, w, 200);
  ctx.fillStyle = linear(ctx, w - 500, 0, w, 0, [
    [0, "rgba(60,40,20,0)"],
    [1, "rgba(60,40,20,0.25)"],
  ]);
  ctx.fillRect(w - 500, 0, 500, h);
  return p;
}

// ---------------------------------------------------------------------------------------------- the pieces
/** The bar through a hollow shape: the sign for "taken away". */
function bar(c: Ctx, cx: number, cy: number, half: number): void {
  c.setLineDash([]);
  c.strokeStyle = INK;
  c.lineWidth = 8;
  c.beginPath();
  c.moveTo(cx - half, cy);
  c.lineTo(cx + half, cy);
  c.stroke();
  c.strokeStyle = PAL.cream;
  c.lineWidth = 3.5;
  c.stroke();
}
/** A thing on a tray: a small closed box with its lid and clasp; or, taken away, its dashed outline with a bar through it. */
export function trayBox(scale: number, hollow: boolean): Painted {
  const s = AKR_TRAY.box.size;
  const [p, c] = sheet(s + 8, s + 8, scale);
  const x = (s + 8) / 2;
  const y = (s + 8) / 2;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.lineWidth = 3;
  rounded(c, x - s / 2, y - s / 2 + 4, s, s - 8, 7);
  if (hollow) {
    c.setLineDash([6, 5]);
    c.strokeStyle = INK;
    c.stroke();
    bar(c, x, y, s / 2 - 4);
  } else {
    c.fillStyle = PAL.wood;
    c.fill();
    c.strokeStyle = INK;
    c.stroke();
    c.beginPath();
    c.moveTo(x - s / 2 + 2, y - 5);
    c.lineTo(x + s / 2 - 2, y - 5);
    c.stroke();
    c.fillStyle = PAL.brass;
    c.fillRect(x - 5, y - 9, 10, 12);
    c.strokeRect(x - 5, y - 9, 10, 12);
  }
  return p;
}
/** A unit on a tray: a gold coin; or, taken away, its dashed outline with a bar through it. */
export function trayCoin(scale: number, hollow: boolean): Painted {
  const s = AKR_TRAY.coin.size;
  const [p, c] = sheet(s + 8, s + 8, scale);
  const x = (s + 8) / 2;
  const r = s / 2;
  c.lineCap = "round";
  c.lineWidth = 3;
  c.beginPath();
  c.arc(x, x, r, 0, Math.PI * 2);
  if (hollow) {
    c.setLineDash([5, 4]);
    c.strokeStyle = INK;
    c.stroke();
    bar(c, x, x, r - 2);
  } else {
    c.fillStyle = PAL.gold;
    c.fill();
    c.strokeStyle = INK;
    c.stroke();
    c.beginPath();
    c.arc(x, x, r - 6, 0, Math.PI * 2);
    c.lineWidth = 2;
    c.strokeStyle = PAL.amber;
    c.stroke();
  }
  return p;
}
/** A plain brass weight with a handle, marked on its face with a box shape or a coin shape (no numeral, no writing). */
export function weight(scale: number, mark: "box" | "coin"): Painted {
  const [p, c] = sheet(84, 84, scale);
  c.lineJoin = "round";
  // The handle.
  c.beginPath();
  c.arc(42, 20, 13, Math.PI, 0);
  c.strokeStyle = INK;
  c.lineWidth = 8;
  c.stroke();
  c.strokeStyle = PAL.brass;
  c.lineWidth = 4;
  c.stroke();
  // The body: a squat bell.
  blob(c, [
    [16, 80],
    [20, 40],
    [30, 22],
    [54, 22],
    [64, 40],
    [68, 80],
  ]);
  fillStroke(c, linear(c, 16, 0, 68, 0, [
    [0, "#e0b45a"],
    [1, "#8f6420"],
  ]), INK, 2.4);
  // The mark on its face, in the shapes of the trays.
  if (mark === "box") {
    rounded(c, 30, 46, 24, 20, 4);
    fillStroke(c, PAL.wood, INK, 2);
    c.fillStyle = PAL.goldLight;
    c.fillRect(39, 50, 6, 7);
  } else {
    c.beginPath();
    c.arc(42, 56, 11, 0, Math.PI * 2);
    fillStroke(c, PAL.gold, INK, 2);
    c.beginPath();
    c.arc(42, 56, 6, 0, Math.PI * 2);
    c.strokeStyle = PAL.amber;
    c.lineWidth = 1.6;
    c.stroke();
  }
  return p;
}
/** A wooden scoop lying on its side: a shallow bowl and a handle. */
export function scoop(scale: number): Painted {
  const [p, c] = sheet(90, 40, scale);
  c.lineJoin = "round";
  c.strokeStyle = INK;
  c.lineWidth = 9;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(46, 26);
  c.lineTo(84, 14);
  c.stroke();
  c.strokeStyle = "#a8703c";
  c.lineWidth = 5;
  c.stroke();
  c.beginPath();
  c.ellipse(26, 26, 22, 12, 0, 0, Math.PI * 2);
  fillStroke(c, "#b97a40", INK, 2.2);
  c.beginPath();
  c.ellipse(26, 24, 15, 6, 0, 0, Math.PI * 2);
  c.fillStyle = PAL.woodDark;
  c.fill();
  return p;
}
/** The locked box: a wooden chest with brass corners and a padlock (closed), or with its lid thrown back and the lock
 * open (open). Drawn with its bottom middle at (60, 84). */
export function lockedBox(scale: number, opened: boolean): Painted {
  const [p, c] = sheet(120, 90, scale);
  c.lineJoin = "round";
  // The body.
  rounded(c, 14, 44, 92, 40, 6);
  fillStroke(c, linear(c, 0, 44, 0, 84, [
    [0, "#9a5e2c"],
    [1, "#6a3a18"],
  ]), INK, 2.4);
  c.fillStyle = PAL.brass;
  for (const x of [14, 96]) {
    c.fillRect(x, 44, 10, 10);
    c.fillRect(x, 74, 10, 10);
  }
  if (opened) {
    // The lid thrown back, its inside showing.
    blob(c, [
      [16, 44],
      [24, 12],
      [100, 6],
      [104, 44],
    ]);
    fillStroke(c, "#5a3018", INK, 2.4);
    c.fillStyle = "rgba(255,230,160,0.35)";
    c.fillRect(20, 40, 80, 6);
    // The lock, hanging open.
    c.beginPath();
    c.arc(74, 58, 7, Math.PI, 0);
    c.strokeStyle = PAL.brass;
    c.lineWidth = 3.5;
    c.stroke();
    rounded(c, 62, 58, 14, 14, 3);
    fillStroke(c, PAL.gold, INK, 1.6);
  } else {
    // The lid, shut.
    rounded(c, 10, 26, 100, 22, 8);
    fillStroke(c, linear(c, 0, 26, 0, 48, [
      [0, "#b06c34"],
      [1, "#7a4420"],
    ]), INK, 2.4);
    // The padlock on the front.
    c.beginPath();
    c.arc(60, 54, 8, Math.PI, 0);
    c.strokeStyle = PAL.brass;
    c.lineWidth = 4;
    c.stroke();
    rounded(c, 48, 54, 24, 20, 4);
    fillStroke(c, PAL.gold, INK, 2);
    c.fillStyle = INK;
    c.beginPath();
    c.arc(60, 63, 3, 0, Math.PI * 2);
    c.fill();
  }
  return p;
}
