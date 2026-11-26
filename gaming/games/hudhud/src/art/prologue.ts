// The opening story's five pictures, drawn in code: a closed book in a dim hall, a window thrown open in a storm, the
// hoopoe on a shelf, the hoopoe and the explorer beside the empty book, and a page gliding home. A trial look, simple
// on purpose and replaceable like every picture in this game. Nothing is written inside a picture: the page's own text
// (in seven languages) says what each one shows. The hoopoe and the explorer are the game's own, drawn by art/cast.ts.
import { HAIRS, hudhud, keeper, type HudhudArt, type KeeperArt } from "./cast";
import { INK, PAL, glow, linear, radial, starTile, type Ctx, type Painted } from "./kit";

export const PROLOGUE = { w: 1000, h: 420, panels: 5 } as const;
export interface PrologueView {
  /** The page reads right to left: whatever has a direction is laid out the other way round. */
  rtl: boolean;
  /** The explorer's look, as the player chose it. */
  look: { kind: number; skin: number; outfit: number; hair: number };
}

export function prologueCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = PROLOGUE.w * scale;
  canvas.height = PROLOGUE.h * scale;
  return canvas;
}

// ------------------------------------------------------------------------------------------------ small helpers
const { w: W, h: H } = PROLOGUE;
/** A repeatable stream of numbers from 0 to 1, so that the same picture is drawn every time. */
const stream = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
};
function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function paint(c: Ctx, fill: string | CanvasGradient, line: string | null = INK, width = 2.4): void {
  c.fillStyle = fill;
  c.fill();
  if (line) {
    c.strokeStyle = line;
    c.lineWidth = width;
    c.stroke();
  }
}
const img = (c: Ctx, p: Painted, x: number, y: number, ox = 0.5, oy = 0.5) => c.drawImage(p.canvas, x - ox * p.w, y - oy * p.h, p.w, p.h);

// The game's own figures, painted once for a look. The same parts and the same places as in the scene (scenes/workshop.ts).
let cast: { key: string; bird: HudhudArt; child: KeeperArt } | null = null;
function figures(look: PrologueView["look"]): { bird: HudhudArt; child: KeeperArt } {
  const key = JSON.stringify(look);
  if (!cast || cast.key !== key) cast = { key, bird: hudhud(2), child: keeper(2, { ...look, hair: look.hair % HAIRS }) };
  return cast;
}
/** The hoopoe, standing with its feet at (x, y). It faces right; `flip` turns it to face left. */
function bird(c: Ctx, a: HudhudArt, x: number, y: number, s: number, flip: boolean): void {
  c.save();
  c.translate(x, y);
  c.scale(flip ? -s : s, s);
  img(c, a.legs, 2, 2, 0.5, 1);
  c.save();
  c.translate(-24, -36);
  c.rotate((-8 * Math.PI) / 180);
  img(c, a.tail, 0, 0, 1, 0.5);
  c.restore();
  img(c, a.body, 0, -40);
  img(c, a.wing, -6, -42);
  img(c, a.crest, 18, -80, 0.5, 0.96);
  img(c, a.head, 22, -68, 24 / 92, 26 / 50);
  c.restore();
}
/** The explorer, standing with the feet at (x, y). Faces right; `flip` turns the figure to face left. */
function explorer(c: Ctx, a: KeeperArt, x: number, y: number, s: number, flip: boolean): void {
  c.save();
  c.translate(x, y);
  c.scale(flip ? -s : s, s);
  img(c, a.leg, -14, -68, 0.5, 0);
  img(c, a.leg, 14, -68, 0.5, 0);
  img(c, a.satchel, -30, -118);
  img(c, a.body, 0, -180, 0.5, 0);
  img(c, a.arm, 18, -170, 0.5, 0.06);
  img(c, a.head, 2, -212, 0.5, 0.54);
  c.restore();
}

// ------------------------------------------------------------------------------------------------ the parts
function wall(c: Ctx, top: string, bottom: string): void {
  c.fillStyle = linear(c, 0, 0, 0, H, [[0, top], [1, bottom]]);
  c.fillRect(0, 0, W, H);
}
function floor(c: Ctx, y: number): void {
  c.fillStyle = PAL.woodDark;
  c.fillRect(0, y, W, H - y);
  c.fillStyle = PAL.wood;
  c.fillRect(0, y, W, 6);
  c.strokeStyle = "rgba(0,0,0,0.25)";
  c.lineWidth = 2;
  for (let x = -40; x < W + 80; x += 90) {
    c.beginPath();
    c.moveTo(x, y + 6);
    c.lineTo(x - 30, H);
    c.stroke();
  }
}
const SPINES = [PAL.lapis, PAL.terracotta, PAL.emerald, PAL.red, PAL.ochre, PAL.tealLight, PAL.deep, PAL.brass];
/** A bookcase: boards and rows of spines. The books are plain coloured blocks, so no title is invented. */
function shelves(c: Ctx, x0: number, x1: number, boards: number[], seed: number, dim: number): void {
  const r = stream(seed);
  for (const y of boards) {
    let x = x0;
    while (x < x1 - 16) {
      const w = 14 + Math.floor(r() * 16);
      const h = 46 + Math.floor(r() * 34);
      const gap = r() < 0.12;
      if (!gap) {
        c.beginPath();
        c.rect(x, y - h, Math.min(w, x1 - x), h);
        paint(c, SPINES[Math.floor(r() * SPINES.length)]!, INK, 1.6);
        c.fillStyle = `rgba(0,10,30,${dim})`;
        c.fillRect(x, y - h, Math.min(w, x1 - x), h);
        c.fillStyle = "rgba(255,227,154,0.5)";
        c.fillRect(x + 3, y - h + 8, Math.min(w, x1 - x) - 6, 3);
      }
      x += gap ? 20 : w;
    }
    c.fillStyle = PAL.woodDark;
    c.fillRect(x0 - 8, y, x1 - x0 + 16, 12);
    c.strokeStyle = INK;
    c.lineWidth = 2;
    c.strokeRect(x0 - 8, y, x1 - x0 + 16, 12);
  }
  // The uprights of the case.
  c.fillStyle = PAL.woodDark;
  c.fillRect(x0 - 12, boards[0]! - 96, 8, boards[boards.length - 1]! + 12 - boards[0]! + 96);
  c.fillRect(x1 + 4, boards[0]! - 96, 8, boards[boards.length - 1]! + 12 - boards[0]! + 96);
}
/** One loose page of the Atlas: parchment, a lapis edge and three lines of "writing" that are only strokes. */
function loosePage(c: Ctx, x: number, y: number, turn: number, size: number, lines = true): void {
  c.save();
  c.translate(x, y);
  c.rotate(turn);
  c.scale(size, size);
  c.beginPath();
  c.moveTo(-30, -38);
  c.quadraticCurveTo(0, -44, 30, -38);
  c.lineTo(32, 38);
  c.quadraticCurveTo(0, 44, -32, 38);
  c.closePath();
  paint(c, PAL.parchment, PAL.lapis, 3 / size);
  if (lines) {
    c.strokeStyle = "rgba(43,79,163,0.6)";
    c.lineWidth = 2.4 / size;
    for (const ly of [-18, -4, 10, 24]) {
      c.beginPath();
      c.moveTo(-20, ly);
      c.lineTo(ly === 24 ? 6 : 20, ly);
      c.stroke();
    }
  }
  c.restore();
}
/** A book lying open, seen from the front, its centre at (x, y). Empty pages have no lines. */
function openBook(c: Ctx, x: number, y: number, s: number, empty: boolean): void {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  rounded(c, -186, -6, 372, 100, 10);
  paint(c, PAL.lapis);
  for (const side of [-1, 1]) {
    c.beginPath();
    c.moveTo(0, -2);
    c.bezierCurveTo(side * 60, -30, side * 130, -28, side * 176, -8);
    c.lineTo(side * 176, 72);
    c.bezierCurveTo(side * 130, 52, side * 60, 54, 0, 78);
    c.closePath();
    paint(c, linear(c, 0, 0, side * 176, 0, [[0, "#d9c48f"], [0.25, PAL.cream], [1, PAL.parchment]]));
    if (!empty) {
      c.strokeStyle = "rgba(43,79,163,0.5)";
      c.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.moveTo(side * 24, 8 + i * 12);
        c.lineTo(side * (150 - (i === 4 ? 60 : 0)), 8 + i * 12);
        c.stroke();
      }
    }
  }
  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  c.beginPath();
  c.moveTo(0, -2);
  c.lineTo(0, 78);
  c.stroke();
  c.restore();
}

// ------------------------------------------------------------------------------------------------ the five panels
function panel1(c: Ctx, v: PrologueView): void {
  const ax = (x: number) => (v.rtl ? W - x : x);
  wall(c, "#0b2342", "#071226");
  shelves(c, ax(40) - (v.rtl ? 200 : 0), ax(40) + (v.rtl ? 0 : 200), [140, 250], 11, 0.45);
  shelves(c, ax(760) - (v.rtl ? 200 : 0), ax(760) + (v.rtl ? 0 : 200), [140, 250], 29, 0.45);
  floor(c, 360);
  // The one lamp in the hall: a soft pool of light on the book and the floor.
  c.fillStyle = radial(c, 500, 250, 10, 300, [[0, "rgba(255,214,130,0.42)"], [1, "rgba(255,214,130,0)"]]);
  c.fillRect(0, 0, W, H);
  // The stand.
  c.beginPath();
  c.moveTo(440, 360);
  c.lineTo(470, 300);
  c.lineTo(530, 300);
  c.lineTo(560, 360);
  c.closePath();
  paint(c, PAL.wood);
  rounded(c, 400, 284, 200, 22, 6);
  paint(c, PAL.woodDark);
  // The great closed book, standing a little tilted against the stand.
  c.save();
  c.translate(500, 180);
  c.rotate(-0.04);
  rounded(c, -112, -110, 224, 226, 12);
  paint(c, PAL.lapis);
  c.fillStyle = "rgba(255,255,255,0.1)";
  c.fillRect(-112, -110, 22, 226);
  rounded(c, -90, -88, 188, 182, 8);
  c.strokeStyle = PAL.gold;
  c.lineWidth = 4;
  c.stroke();
  starTile(c, 5, 3, 64, PAL.gold, INK);
  c.restore();
  // A little dust in the lamplight.
  const r = stream(5);
  c.fillStyle = "rgba(255,227,154,0.55)";
  for (let i = 0; i < 26; i++) {
    c.beginPath();
    c.arc(330 + r() * 340, 70 + r() * 260, 1 + r() * 1.8, 0, Math.PI * 2);
    c.fill();
  }
}

function panel2(c: Ctx, v: PrologueView): void {
  const ax = (x: number) => (v.rtl ? W - x : x);
  const r = stream(23);
  // A night sky in a storm, seen through the window.
  c.fillStyle = linear(c, 0, 0, 0, H, [[0, "#0c1030"], [0.6, "#1b2a56"], [1, "#2a3a63"]]);
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) {
    const cx = ax(60 + i * 150 + r() * 40);
    const cy = 70 + r() * 120;
    c.fillStyle = `rgba(20,28,60,${0.55 + r() * 0.3})`;
    for (const [dx, dy, rad] of [[-40, 10, 46], [0, -8, 58], [46, 8, 44], [10, 26, 40]] as const) {
      c.beginPath();
      c.arc(cx + dx, cy + dy, rad, 0, Math.PI * 2);
      c.fill();
    }
  }
  // One bolt of light, a plain zigzag.
  c.beginPath();
  c.moveTo(ax(740), 40);
  c.lineTo(ax(712), 120);
  c.lineTo(ax(738), 124);
  c.lineTo(ax(700), 210);
  c.lineTo(ax(752), 132);
  c.lineTo(ax(726), 128);
  c.closePath();
  paint(c, "#fff3b8", null);
  // Rain, slanting.
  c.strokeStyle = "rgba(190,215,235,0.55)";
  c.lineWidth = 2;
  for (let i = 0; i < 90; i++) {
    const x = r() * (W + 100);
    const y = r() * H;
    c.beginPath();
    c.moveTo(ax(x), y);
    c.lineTo(ax(x - 22), y + 46);
    c.stroke();
  }
  // Pages of the Atlas blown out of the window, drifting and turning away from it.
  const pages: [number, number, number, number][] = [
    [300, 300, -0.3, 0.8], [400, 230, 0.5, 0.75], [500, 280, -0.9, 0.7], [590, 170, 0.3, 0.8], [680, 250, 1.1, 0.65],
    [770, 120, -0.5, 0.7], [820, 230, 0.8, 0.6], [900, 160, -0.2, 0.55],
  ];
  for (const [x, y, turn, size] of pages) loosePage(c, ax(x), y, v.rtl ? -turn : turn, size);
  // The window frame, and its two leaves flung back against the wall.
  c.lineJoin = "round";
  c.fillStyle = PAL.woodDark;
  c.fillRect(0, 0, W, 26);
  c.fillRect(0, H - 40, W, 40);
  c.fillRect(0, 0, 26, H);
  c.fillRect(W - 26, 0, 26, H);
  for (const side of [0, 1]) {
    const x = side === 0 ? 26 : W - 26;
    const dir = side === 0 ? 1 : -1;
    c.beginPath();
    c.moveTo(x, 26);
    c.lineTo(x + dir * 70, 46);
    c.lineTo(x + dir * 70, H - 70);
    c.lineTo(x, H - 40);
    c.closePath();
    paint(c, PAL.wood);
    c.strokeStyle = "rgba(0,0,0,0.35)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(x + dir * 35, 36);
    c.lineTo(x + dir * 35, H - 55);
    c.stroke();
  }
  c.strokeStyle = INK;
  c.lineWidth = 3;
  c.strokeRect(26, 26, W - 52, H - 66);
}

function panel3(c: Ctx, v: PrologueView): void {
  const ax = (x: number) => (v.rtl ? W - x : x);
  wall(c, "#0d2a4a", "#081a30");
  shelves(c, 60, 940, [150, 262], 41, 0.4);
  // The hoopoe's shelf, lit; the hoopoe stands on it.
  c.fillStyle = radial(c, 500, 250, 20, 330, [[0, "rgba(255,214,130,0.38)"], [1, "rgba(255,214,130,0)"]]);
  c.fillRect(0, 0, W, H);
  rounded(c, 120, 366, 760, 26, 6);
  paint(c, PAL.wood);
  rounded(c, 120, 392, 760, 10, 4);
  paint(c, PAL.woodDark);
  bird(c, figures(v.look).bird, ax(500), 368, 1.9, v.rtl);
  // A small open book on the shelf beside it, and a lamp's glow.
  openBook(c, ax(780), 340, 0.22, false);
}

function panel4(c: Ctx, v: PrologueView): void {
  const ax = (x: number) => (v.rtl ? W - x : x);
  const { bird: b, child } = figures(v.look);
  // Morning: a pale warm wall, light falling from a window on the far side.
  wall(c, "#2d5f78", "#17384f");
  c.fillStyle = radial(c, ax(860), 90, 20, 520, [[0, "rgba(255,236,170,0.55)"], [1, "rgba(255,236,170,0)"]]);
  c.fillRect(0, 0, W, H);
  c.beginPath();
  c.moveTo(ax(860) - 70, 330);
  c.lineTo(ax(860) - 70, 90);
  c.arc(ax(860), 90, 70, Math.PI, 0, false);
  c.lineTo(ax(860) + 70, 330);
  c.closePath();
  paint(c, linear(c, 0, 20, 0, 330, [[0, "#ffe9a8"], [1, "#9fd4dc"]]), PAL.woodDark, 6);
  shelves(c, v.rtl ? 760 : 60, v.rtl ? 940 : 240, [150, 262], 17, 0.25);
  floor(c, 372);
  // A table, and the Atlas on it, its pages empty.
  rounded(c, 290, 330, 420, 22, 6);
  paint(c, PAL.wood);
  c.fillStyle = PAL.woodDark;
  c.fillRect(310, 352, 18, 46);
  c.fillRect(672, 352, 18, 46);
  openBook(c, 500, 238, 0.95, true);
  explorer(c, child, ax(190), 392, 0.8, v.rtl);
  bird(c, b, ax(668), 332, 1.0, !v.rtl);
}

function panel5(c: Ctx, v: PrologueView): void {
  const ax = (x: number) => (v.rtl ? W - x : x);
  wall(c, "#0b2342", "#10305a");
  floor(c, 372);
  // The book's glow, and the path the page takes to it.
  c.fillStyle = radial(c, 500, 300, 10, 360, [[0, "rgba(255,214,130,0.6)"], [0.5, "rgba(255,214,130,0.2)"], [1, "rgba(255,214,130,0)"]]);
  c.fillRect(0, 0, W, H);
  rounded(c, 280, 346, 440, 22, 6);
  paint(c, PAL.wood);
  openBook(c, 500, 262, 1.0, true);
  const path = (t: number): [number, number] => {
    const u = 1 - t;
    // A gentle curve from high on one side down to the open page.
    const x = u * u * u * 120 + 3 * u * u * t * 260 + 3 * u * t * t * 330 + t * t * t * 440;
    const y = u * u * u * 70 + 3 * u * u * t * 40 + 3 * u * t * t * 190 + t * t * t * 232;
    return [ax(x), y];
  };
  c.setLineDash([3, 14]);
  c.strokeStyle = "rgba(255,227,154,0.55)";
  c.lineWidth = 5;
  c.beginPath();
  for (let i = 0; i <= 40; i++) {
    const [x, y] = path(i / 40);
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();
  c.setLineDash([]);
  // Little lights along the way, then the page itself, just above the book.
  for (let i = 1; i < 6; i++) {
    const [x, y] = path(0.12 + i * 0.13);
    const g: Painted = glow(40, 1);
    c.drawImage(g.canvas, x - 20, y - 20, 40, 40);
  }
  const [px, py] = path(0.96);
  loosePage(c, px, py, v.rtl ? 0.18 : -0.18, 0.95);
  const g: Painted = glow(120, 1);
  c.drawImage(g.canvas, px - 60, py - 60, 120, 120);
}

const PANELS = [panel1, panel2, panel3, panel4, panel5];

/** Draws panel `n` (1 to 5) of the opening into its canvas, which was made by prologueCanvas(). */
export function drawPrologue(canvas: HTMLCanvasElement, n: number, v: PrologueView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  c.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  c.clearRect(0, 0, W, H);
  PANELS[Math.min(PANELS.length, Math.max(1, n)) - 1]!(c, v);
}
