// The place: an evening sky, a town in two depths, a garden terrace, and the dark workshop in front of them with an
// arch that opens on the garden. A composite invented for the game: it stands for no real house and no real skyline,
// and the museum note says so.
import { Rng } from "@im/kernel/prng";
import { WORLD } from "../content/workshop";
import { INK, PAL, blob, brush, fillStroke, linear, radial, sheet, starTile, type Ctx, type Painted } from "./kit";

export function sky(scale: number): Painted {
  const w = WORLD.view.width;
  const h = WORLD.view.height;
  const [p, ctx] = sheet(w, h, scale);
  ctx.fillStyle = linear(ctx, 0, 0, 0, h, [
    [0, "#081530"],
    [0.2, "#0f3560"],
    [0.38, "#1f6f7d"],
    [0.52, "#e39a4c"],
    [0.64, "#f6c874"],
    [1, "#f9dea0"],
  ]);
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = radial(ctx, w * 0.62, h * 0.62, 0, 460, [
    [0, "rgba(255,236,170,0.95)"],
    [0.3, "rgba(255,196,110,0.5)"],
    [1, "rgba(255,170,90,0)"],
  ]);
  ctx.fillRect(0, 0, w, h);
  const rng = new Rng("hudhud-sky");
  for (let i = 0; i < 120; i++) {
    const y = rng.range(0, h * 0.34);
    const r = rng.range(0.5, 1.7);
    ctx.fillStyle = `rgba(255,246,220,${rng.range(0.35, 0.95) * (1 - y / (h * 0.5))})`;
    ctx.beginPath();
    ctx.arc(rng.range(0, w), y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Long evening clouds, lit from below.
  for (let i = 0; i < 7; i++) {
    const cx = rng.range(0, w);
    const cy = rng.range(h * 0.22, h * 0.5);
    const cw = rng.range(180, 420);
    ctx.fillStyle = linear(ctx, 0, cy - 14, 0, cy + 16, [
      [0, "rgba(60,80,130,0.35)"],
      [1, "rgba(255,180,120,0.5)"],
    ]);
    blob(ctx, [
      [cx - cw / 2, cy],
      [cx - cw / 4, cy - 16],
      [cx + cw / 5, cy - 10],
      [cx + cw / 2, cy + 2],
      [cx + cw / 6, cy + 12],
      [cx - cw / 3, cy + 10],
    ]);
    ctx.fill();
  }
  return p;
}

function dome(ctx: Ctx, cx: number, base: number, r: number, bulb: number): void {
  ctx.beginPath();
  ctx.moveTo(cx - r, base);
  ctx.bezierCurveTo(cx - r * bulb, base - r * 1.2, cx - r * 0.4, base - r * 1.45, cx, base - r * 1.6);
  ctx.bezierCurveTo(cx + r * 0.4, base - r * 1.45, cx + r * bulb, base - r * 1.2, cx + r, base);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(cx - 1, base - r * 1.6 - r * 0.35, 2, r * 0.35);
}
function tower(ctx: Ctx, x: number, base: number, w: number, h: number): void {
  ctx.fillRect(x - w / 2, base - h, w, h);
  ctx.fillRect(x - w * 0.8, base - h * 0.72, w * 1.6, 4);
  ctx.fillRect(x - w * 0.35, base - h - h * 0.14, w * 0.7, h * 0.14);
  dome(ctx, x, base - h - h * 0.14, w * 0.45, 1.1);
}

/** A band of rooftops. `near` is darker and has lit windows; the far one is hazed towards the sky's colour. */
export function town(scale: number, near: boolean): Painted {
  const w = near ? 2000 : 1700;
  const h = near ? 380 : 300;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng(near ? "hudhud-town-near" : "hudhud-town-far");
  const body = near ? "#24466a" : "#5d7f9c";
  const windows: [number, number][] = [];
  ctx.fillStyle = body;
  for (let x = -20; x < w; ) {
    const bw = rng.range(near ? 70 : 50, near ? 170 : 120);
    const bh = rng.range(h * 0.28, h * 0.62);
    ctx.fillRect(x, h - bh, bw, bh);
    const kind = rng.next();
    if (kind < 0.3) dome(ctx, x + bw / 2, h - bh, bw * rng.range(0.25, 0.38), rng.range(1, 1.25));
    else if (kind < 0.42) tower(ctx, x + bw * 0.5, h - bh, near ? 20 : 13, bh * rng.range(0.55, 0.9));
    else if (kind < 0.6) for (let m = 0; m < bw - 8; m += 14) ctx.fillRect(x + m, h - bh - 7, 8, 7); // a crenellated edge
    if (near) for (let i = 0; i < 4; i++) if (rng.chance(0.55)) windows.push([x + rng.range(8, bw - 14), h - bh + rng.range(14, bh * 0.6)]);
    x += bw + rng.range(-6, 14);
  }
  // Haze: the bottom of the band melts into the evening.
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = linear(ctx, 0, 0, 0, h, near ? [[0, "rgba(255,190,120,0.38)"], [0.45, "rgba(255,170,110,0.08)"], [1, "rgba(10,20,45,0.45)"]] : [[0, "rgba(255,215,150,0.45)"], [1, "rgba(245,180,120,0.5)"]]);
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  for (const [x, y] of windows) {
    ctx.fillStyle = "rgba(255,206,110,0.9)";
    ctx.beginPath();
    ctx.moveTo(x, y + 12);
    ctx.lineTo(x, y + 4);
    ctx.quadraticCurveTo(x + 3.5, y - 2, x + 7, y + 4);
    ctx.lineTo(x + 7, y + 12);
    ctx.closePath();
    ctx.fill();
  }
  return p;
}

function cypress(ctx: Ctx, x: number, base: number, h: number): void {
  blob(ctx, [
    [x, base - h],
    [x + h * 0.11, base - h * 0.55],
    [x + h * 0.13, base - h * 0.12],
    [x, base],
    [x - h * 0.13, base - h * 0.12],
    [x - h * 0.11, base - h * 0.55],
  ]);
  ctx.fillStyle = linear(ctx, x - h * 0.13, 0, x + h * 0.13, 0, [
    [0, "#1e5a44"],
    [0.6, "#174536"],
    [1, "#0f2e2a"],
  ]);
  ctx.fill();
}
function palm(ctx: Ctx, x: number, base: number, h: number, rng: Rng): void {
  ctx.strokeStyle = "#5a3b22";
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.quadraticCurveTo(x + 18, base - h * 0.5, x + 6, base - h);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.42 + rng.range(-0.08, 0.08);
    const len = h * rng.range(0.42, 0.56);
    const tx = x + 6 + Math.cos(a) * len;
    const ty = base - h + Math.sin(a) * len * 0.62 + len * 0.3;
    const mx = x + 6 + Math.cos(a) * len * 0.6;
    const my = base - h + Math.sin(a) * len * 0.75;
    ctx.fillStyle = i % 2 ? "#2c7a4c" : "#1f6040";
    ctx.beginPath();
    ctx.moveTo(x + 6, base - h);
    ctx.quadraticCurveTo(mx, my - 16, tx, ty);
    ctx.quadraticCurveTo(mx, my + 22, x + 6, base - h);
    ctx.fill();
    // Leaflets along the lower edge of the blade.
    ctx.strokeStyle = i % 2 ? "#1f6040" : "#184c34";
    ctx.lineWidth = 3;
    for (let k = 2; k < 9; k++) {
      const u = k / 9;
      const px = (1 - u) * (1 - u) * (x + 6) + 2 * u * (1 - u) * mx + u * u * tx;
      const py = (1 - u) * (1 - u) * (base - h) + 2 * u * (1 - u) * (my + 6) + u * u * ty;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(a) * 6, py + 20 * (1 - u * 0.5));
      ctx.stroke();
    }
  }
}

/** The terrace outside the arch. Local x 0 is world x 1400. */
export const GARDEN_X = 1400;
export function garden(scale: number): Painted {
  const w = WORLD.width - GARDEN_X;
  const h = WORLD.height;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-garden");
  const floor = WORLD.floor;
  // Trees first, so the wall stands in front of them.
  cypress(ctx, 250, floor - 40, 330);
  cypress(ctx, 330, floor - 40, 260);
  palm(ctx, 660, floor - 30, 380, rng);
  cypress(ctx, 905, floor - 40, 300);
  palm(ctx, 120, floor - 30, 300, rng);
  // A low garden wall with a tiled coping.
  ctx.fillStyle = linear(ctx, 0, floor - 92, 0, floor, [
    [0, "#d9a55c"],
    [1, "#a86b3a"],
  ]);
  ctx.fillRect(0, floor - 92, w, 92);
  for (let x = 14; x < w; x += 46) starTile(ctx, x, floor - 46, 15, "#2b6f9a", "#f1d28a");
  ctx.fillStyle = "#2f8f7a";
  ctx.fillRect(0, floor - 100, w, 10);
  // Bushes with flowers.
  for (let i = 0; i < 12; i++) {
    const x = rng.range(0, w);
    const r = rng.range(26, 46);
    ctx.fillStyle = rng.chance(0.5) ? "#22694a" : "#2c7d52";
    blob(ctx, [
      [x - r, floor - 2],
      [x - r * 0.9, floor - r * 0.9],
      [x, floor - r * 1.25],
      [x + r * 0.9, floor - r * 0.85],
      [x + r, floor - 2],
    ]);
    ctx.fill();
    for (let f = 0; f < 6; f++) {
      ctx.fillStyle = rng.pick(["#f6c0c8", "#ffd27a", "#f08a8a", "#fff3d6"]);
      ctx.beginPath();
      ctx.arc(x + rng.range(-r * 0.7, r * 0.7), floor - rng.range(r * 0.3, r), 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // The terrace floor.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#c9824a"],
    [1, "#7c4526"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(60,25,10,0.35)";
  ctx.lineWidth = 1.5;
  for (let x = -200; x < w + 200; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, floor);
    ctx.lineTo(x + (x - w / 2) * 0.35, h);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, floor + 34);
  ctx.lineTo(w, floor + 34);
  ctx.stroke();
  // The fountain: a stone basin, world x 2130 to 2280, its rim a perch at y 520.
  const fx = 2130 - GARDEN_X;
  ctx.fillStyle = linear(ctx, fx, 520, fx + 150, 624, [
    [0, "#e8d7b4"],
    [1, "#9f8a68"],
  ]);
  blob(ctx, [
    [fx - 6, 520],
    [fx + 156, 520],
    [fx + 140, 600],
    [fx + 110, floor + 2],
    [fx + 40, floor + 2],
    [fx + 10, 600],
  ]);
  fillStroke(ctx, ctx.fillStyle, INK, 2.2);
  ctx.fillStyle = "#3fb7c4";
  ctx.beginPath();
  ctx.ellipse(fx + 75, 524, 70, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.ellipse(fx + 60, 522, 26, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let x = fx + 22; x < fx + 140; x += 28) starTile(ctx, x, 566, 10, "#2b6f9a", "#f6e3ae");
  // The lantern post: world x 1945, its top a perch at y 470.
  const lx = 1945 - GARDEN_X;
  ctx.fillStyle = "#3a2a1c";
  ctx.fillRect(lx - 4, 470, 8, floor - 470);
  ctx.fillRect(lx - 55, 470, 110, 8);
  ctx.fillStyle = PAL.brass;
  blob(ctx, [
    [lx - 16, 478],
    [lx + 16, 478],
    [lx + 20, 512],
    [lx, 528],
    [lx - 20, 512],
  ]);
  fillStroke(ctx, PAL.brass, INK, 2);
  ctx.fillStyle = "#ffe7a3";
  ctx.fillRect(lx - 10, 486, 20, 24);
  brush(ctx, w, h, "garden", { light: [0.75, 0.05], strength: 0.8, strokes: 1400 });
  return p;
}

/** The arch between the room and the garden, in world pixels. */
export const ARCH = { left: 1430, right: 1690, spring: 340, apex: 176, ledge: 150 } as const;
function archPath(ctx: Ctx, grow: number): void {
  const { left, right, spring, apex } = ARCH;
  const cx = (left + right) / 2;
  ctx.beginPath();
  ctx.moveTo(left - grow, WORLD.floor + 2);
  ctx.lineTo(left - grow, spring);
  ctx.quadraticCurveTo(left - grow, apex + 30 - grow, cx, apex - grow * 1.3);
  ctx.quadraticCurveTo(right + grow, apex + 30 - grow, right + grow, spring);
  ctx.lineTo(right + grow, WORLD.floor + 2);
  ctx.closePath();
}

function shelf(ctx: Ctx, x: number, y: number, w: number): void {
  ctx.fillStyle = linear(ctx, 0, y, 0, y + 14, [
    [0, "#a8703c"],
    [1, PAL.woodDark],
  ]);
  ctx.fillRect(x, y, w, 12);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x, y, w, 12);
  for (const bx of [x + 18, x + w - 18]) {
    ctx.beginPath();
    ctx.moveTo(bx - 8, y + 12);
    ctx.quadraticCurveTo(bx - 6, y + 34, bx + 8, y + 40);
    ctx.lineTo(bx + 8, y + 12);
    ctx.closePath();
    fillStroke(ctx, PAL.wood, INK, 1.6);
  }
}
function book(ctx: Ctx, x: number, y: number, w: number, h: number, colour: string): void {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "rgba(255,220,140,0.75)";
  if (w > h) ctx.fillRect(x + w * 0.12, y + h * 0.4, w * 0.12, h * 0.2);
  else ctx.fillRect(x + w * 0.25, y + h * 0.15, w * 0.5, h * 0.06);
}

/** The workshop: wall, floor, shelves, the shutter with its small hole, and the arch cut clean through. */
export const INTERIOR_W = 1760;
export function interior(scale: number): Painted {
  const w = INTERIOR_W;
  const h = WORLD.height;
  const floor = WORLD.floor;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-room");
  ctx.fillStyle = linear(ctx, 0, 0, 0, floor, [
    [0, "#0f3d48"],
    [0.55, "#1a6168"],
    [1, "#1f6f72"],
  ]);
  ctx.fillRect(0, 0, w, floor);
  // Old plaster: blotches of lighter and darker teal.
  for (let i = 0; i < 260; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, floor);
    const r = rng.range(18, 80);
    ctx.fillStyle = rng.chance(0.5) ? `rgba(90,190,180,${rng.range(0.02, 0.06)})` : `rgba(4,24,40,${rng.range(0.03, 0.08)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rng.range(0.4, 0.9), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  // A band of star tiles along the wall.
  ctx.fillStyle = "#12414c";
  ctx.fillRect(0, 556, w, 54);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(0, 552, w, 4);
  ctx.fillRect(0, 610, w, 4);
  for (let x = 20; x < w; x += 50) starTile(ctx, x, 583, 17, x % 100 === 20 ? "#b8683c" : "#256f8f", "#e7c57c");
  // The floor: worn stone slabs.
  ctx.fillStyle = linear(ctx, 0, floor, 0, h, [
    [0, "#a59679"],
    [1, "#5d5444"],
  ]);
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = "rgba(40,30,20,0.45)";
  ctx.lineWidth = 1.6;
  for (let x = -300; x < w + 300; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, floor);
    ctx.lineTo(x + (x - 700) * 0.3, h);
    ctx.stroke();
  }
  for (const y of [floor + 30, floor + 70]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // A carpet under the scholar.
  ctx.fillStyle = "#8f2f2c";
  blob(ctx, [
    [380, floor + 14],
    [800, floor + 14],
    [840, floor + 76],
    [340, floor + 76],
  ]);
  fillStroke(ctx, "#8f2f2c", "#e0b25a", 3);
  for (let x = 420; x < 800; x += 60) starTile(ctx, x, floor + 45, 13, "#d9a441", "#3a1512");

  // The shutter on the west wall, with the small hole the beam comes through (world 40, 270).
  ctx.fillStyle = "#0b2a33";
  ctx.fillRect(0, 170, 96, 200);
  ctx.fillStyle = linear(ctx, 0, 0, 90, 0, [
    [0, "#3b2413"],
    [1, "#6b4222"],
  ]);
  ctx.fillRect(4, 178, 84, 184);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  for (let y = 178; y < 362; y += 23) ctx.strokeRect(4, y, 84, 23);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(40, 178, 6, 184);
  ctx.fillStyle = "#fff4c8";
  ctx.beginPath();
  ctx.arc(62, 270, 4, 0, Math.PI * 2);
  ctx.fill();

  // A niche with an ewer and a brass ring-sphere.
  const nx = 770;
  ctx.beginPath();
  ctx.moveTo(nx, 480);
  ctx.lineTo(nx, 380);
  ctx.quadraticCurveTo(nx, 330, nx + 55, 318);
  ctx.quadraticCurveTo(nx + 110, 330, nx + 110, 380);
  ctx.lineTo(nx + 110, 480);
  ctx.closePath();
  fillStroke(ctx, "#0c2f3a", "#d7b46a", 3);
  ctx.strokeStyle = PAL.brass;
  ctx.lineWidth = 3;
  for (const [rx, ry, rot] of [[26, 26, 0], [26, 10, 0.5], [10, 26, 0.3]] as const) {
    ctx.beginPath();
    ctx.ellipse(nx + 38, 432, rx, ry, rot, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(nx + 34, 458, 8, 22);
  blob(ctx, [
    [nx + 72, 480],
    [nx + 66, 452],
    [nx + 76, 430],
    [nx + 74, 412],
    [nx + 88, 412],
    [nx + 86, 430],
    [nx + 98, 452],
    [nx + 92, 480],
  ]);
  fillStroke(ctx, "#b98a35", INK, 1.8);

  // Shelves: every one is a perch (content/workshop.ts ROOM.perches).
  shelf(ctx, 300, 338, 140);
  shelf(ctx, 632, 338, 140);
  shelf(ctx, 850, 238, 140);
  shelf(ctx, 1180, 238, 140);
  // The tower of books that stops the beam (grid 5,1: world 700, 270).
  const colours = ["#8f2f2c", "#2b4fa3", "#2f8f5b", "#b8742f", "#5a2f6b", "#1d6f78"];
  for (let i = 0, y = 338; i < 6; i++) {
    const bh = 15 + (i % 3) * 3;
    y -= bh;
    book(ctx, 650 + ((i * 7) % 16), y, 92 - ((i * 5) % 18), bh, colours[i]!);
  }
  // Books standing on the first high shelf.
  for (let i = 0; i < 4; i++) book(ctx, 860 + i * 15, 238 - 46 - (i % 2) * 6, 13, 46 + (i % 2) * 6, colours[(i + 2) % 6]!);

  // The reading stand that holds the page (world 1180 to 1330, top 540).
  ctx.fillStyle = PAL.wood;
  blob(ctx, [
    [1196, 540],
    [1314, 540],
    [1300, 560],
    [1284, floor],
    [1266, floor],
    [1256, 566],
    [1244, floor],
    [1226, floor],
    [1210, 560],
  ]);
  fillStroke(ctx, PAL.wood, INK, 2.2);
  ctx.fillStyle = "#a8703c";
  ctx.fillRect(1180, 536, 150, 10);
  ctx.strokeRect(1180, 536, 150, 10);
  // The chest the cat sleeps on (world 1000 to 1120, top 568) and its cushion.
  ctx.fillStyle = linear(ctx, 0, 568, 0, floor, [
    [0, "#8a5a2e"],
    [1, "#4f3018"],
  ]);
  ctx.fillRect(1000, 572, 120, floor - 572);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(1000, 572, 120, floor - 572);
  ctx.fillStyle = PAL.brass;
  ctx.fillRect(1054, 584, 12, 14);
  blob(ctx, [
    [998, 574],
    [1004, 560],
    [1116, 560],
    [1122, 574],
  ]);
  fillStroke(ctx, "#b8443c", INK, 2);

  // The ledge over the arch (a perch at y 150) and the stone surround.
  ctx.fillStyle = "#c79a55";
  archPath(ctx, 26);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = ARCH.left - 13 + t * (ARCH.right - ARCH.left + 26);
    const y = ARCH.spring - Math.sin(t * Math.PI) * (ARCH.spring - ARCH.apex + 12);
    starTile(ctx, x, y, 8, i % 2 ? "#256f8f" : "#b8683c", "#f3dfa8");
  }
  ctx.fillStyle = "#8a5a2e";
  ctx.fillRect(1470, ARCH.ledge, 180, 12);
  ctx.strokeRect(1470, ARCH.ledge, 180, 12);

  // The outer corner of the house, where the wall ends and the garden begins.
  ctx.fillStyle = linear(ctx, w - 34, 0, w, 0, [
    [0, "#d2a660"],
    [1, "#8f6a36"],
  ]);
  ctx.fillRect(w - 34, 0, 34, floor);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(w - 34, -4, 36, floor + 4);
  for (let y = 40; y < floor; y += 62) {
    ctx.beginPath();
    ctx.moveTo(w - 34, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  brush(ctx, w, h, "room", { light: [0.85, 0.3], strength: 0.7, strokes: 1800, warm: "rgba(255,200,120,0.2)", cool: "rgba(2,10,30,0.5)" });
  // The room is dark towards its corners and its ceiling.
  ctx.fillStyle = linear(ctx, 0, 0, 0, 260, [
    [0, "rgba(2,10,24,0.7)"],
    [1, "rgba(2,10,24,0)"],
  ]);
  ctx.fillRect(0, 0, w, 260);
  ctx.fillStyle = linear(ctx, 0, 0, 500, 0, [
    [0, "rgba(2,10,24,0.45)"],
    [1, "rgba(2,10,24,0)"],
  ]);
  ctx.fillRect(0, 0, 500, h);
  // Cut the arch clean through the wall.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  archPath(ctx, 0);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();
  return p;
}

/** Dark shapes in front of everything: a column and a hanging lamp at the left, leaves at the lower right. */
export function foreground(scale: number): Painted {
  const w = 520;
  const h = WORLD.height;
  const [p, ctx] = sheet(w, h, scale);
  ctx.fillStyle = "#06121f";
  ctx.fillRect(0, 0, 54, h);
  ctx.fillRect(0, 0, 150, 30);
  blob(ctx, [
    [54, 30],
    [150, 30],
    [70, 120],
    [54, 220],
  ]);
  ctx.fill();
  ctx.strokeStyle = "#06121f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(190, 0);
  ctx.lineTo(190, 96);
  ctx.stroke();
  blob(ctx, [
    [172, 96],
    [208, 96],
    [216, 138],
    [190, 160],
    [164, 138],
  ]);
  ctx.fillStyle = "#0a1a28";
  ctx.fill();
  ctx.strokeStyle = "#8a6a2c";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = "#ffd98a";
  blob(ctx, [
    [180, 104],
    [200, 104],
    [205, 134],
    [190, 146],
    [175, 134],
  ]);
  ctx.fill();
  ctx.strokeStyle = "#8a6a2c";
  ctx.lineWidth = 2;
  for (const x of [184, 190, 196]) {
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, 146);
    ctx.stroke();
  }
  return p;
}
export function leaves(scale: number): Painted {
  const w = 460;
  const h = 300;
  const [p, ctx] = sheet(w, h, scale);
  const rng = new Rng("hudhud-leaves");
  for (let i = 0; i < 16; i++) {
    const x = rng.range(40, w - 20);
    const len = rng.range(120, 250);
    const a = -Math.PI / 2 + rng.range(-0.9, 0.9);
    ctx.fillStyle = rng.chance(0.5) ? "#0c2a22" : "#123a2c";
    const tx = x + Math.cos(a) * len;
    const ty = h + Math.sin(a) * len;
    ctx.beginPath();
    ctx.moveTo(x - 12, h);
    ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 - 22, h + Math.sin(a) * len * 0.5, tx, ty);
    ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + 22, h + Math.sin(a) * len * 0.5, x + 12, h);
    ctx.closePath();
    ctx.fill();
  }
  return p;
}

/** What the dark room shows on its wall when the curtain is drawn: the town outside, turned over, as the record of
 * the dark-room tests describes a picture carried by light through a small hole. */
export function wallPicture(scale: number, skyP: Painted, townP: Painted): Painted {
  const w = 290;
  const h = 170;
  const [p, ctx] = sheet(w, h, scale);
  ctx.save();
  ctx.translate(w, h);
  ctx.rotate(Math.PI);
  ctx.drawImage(skyP.canvas, 0, 0, skyP.canvas.width, skyP.canvas.height * 0.86, 0, 0, w, h);
  ctx.drawImage(townP.canvas, townP.canvas.width * 0.2, 0, townP.canvas.width * 0.4, townP.canvas.height, 0, h * 0.42, w, h * 0.58);
  ctx.restore();
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = radial(ctx, w / 2, h / 2, h * 0.2, w * 0.56, [
    [0, "rgba(0,0,0,1)"],
    [0.75, "rgba(0,0,0,0.85)"],
    [1, "rgba(0,0,0,0)"],
  ]);
  ctx.fillRect(0, 0, w, h);
  return p;
}
