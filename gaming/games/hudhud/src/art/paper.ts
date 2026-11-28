// The paper of Samarkand, drawn in code: the papermaker's row of places, each holding the card of a step with a small
// sign of it, and, as a run is shown, the material drawn above each place it has passed, in the state that place left
// it in (scraps, pulp, a sheet). A trial picture, replaceable like every picture in this game; it carries no words and no
// numerals (the places are numbered by dots), so that the page's own text, in seven languages, says everything it shows.
// Since 27 November 2026 a card's box, its ring, its dots, its signs and the material are drawn by exported functions
// (drawCardBox, drawCardRing, drawCardDots, drawCardSigns, drawMaterial) that the paper workshop of Samarkand shares
// (art/samarkand-room.ts); the page's picture is drawn call for call as before.
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
/** The picture's own space. */
export const PAPER_ART = { w: 1000, h: 420, margin: 30, y: 262, boxH: 156, boxMax: 150, matY: 104, dotY: 384 } as const;

export interface PaperView {
  /** The card standing in each place. */
  places: (string | null)[];
  /** The state of the material each place left it in, for the places the run has passed (shown above them). */
  made: string[];
  /** Places the material has passed through so far in a run. */
  lit: number;
  /** The place where a run stopped without doing its work, or null. */
  stopped: number | null;
  done: boolean;
  /** The page reads right to left: the first place is on the right, as the list of places under the picture is. */
  rtl: boolean;
  /** The place chosen by a touch or a click, to be exchanged with another; or null. */
  selected?: number | null;
}

/** The width of a place's slot, and of the box drawn in it, for a row of `n` places. */
export const slotWidth = (n: number): number => (PAPER_ART.w - 2 * PAPER_ART.margin) / n;
export const boxWidth = (n: number): number => Math.min(PAPER_ART.boxMax, slotWidth(n) - 14);
/** The middle of place `i` along the picture, given the way the page reads. */
export function placeX(n: number, i: number, rtl: boolean): number {
  const x = PAPER_ART.margin + slotWidth(n) * (i + 0.5);
  return rtl ? PAPER_ART.w - x : x;
}
/** The box of place `i`, in the picture's own space. */
export function placeRect(n: number, i: number, rtl: boolean): { x: number; y: number; w: number; h: number } {
  const w = boxWidth(n);
  return { x: placeX(n, i, rtl) - w / 2, y: PAPER_ART.y - PAPER_ART.boxH / 2, w, h: PAPER_ART.boxH };
}
/** What lies under a point of the picture, given in its own 1000 by 420 space: the index of a place, or null. */
export function paperHit(x: number, y: number, n: number, rtl: boolean): number | null {
  for (let i = 0; i < n; i++) {
    const r = placeRect(n, i, rtl);
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return null;
}

function fill(c: Ctx, colour: string, line: string | null = INK): void {
  c.fillStyle = colour;
  c.fill();
  if (line) {
    c.strokeStyle = line;
    c.lineWidth = 2.4;
    c.stroke();
  }
}
function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
const circle = (c: Ctx, x: number, y: number, r: number): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
};
const CLOTH = "#e7d6ad";
const WHITE = "#fffbea";
const WATER = "#7fd0e0";

/** A scrap of cloth, turned a little. */
function scrap(c: Ctx, x: number, y: number, w: number, h: number, turn: number, colour: string): void {
  c.save();
  c.translate(x, y);
  c.rotate(turn);
  rounded(c, -w / 2, -h / 2, w, h, 2);
  fill(c, colour);
  c.restore();
}
function sheet(c: Ctx, x: number, y: number, w: number, h: number, colour: string, lines = false): void {
  rounded(c, x - w / 2, y - h / 2, w, h, 3);
  fill(c, colour);
  if (lines) {
    c.strokeStyle = PAL.lapis;
    c.lineWidth = 2;
    for (const dy of [-h / 4, 0, h / 4]) {
      c.beginPath();
      c.moveTo(x - w / 2 + 8, y + dy);
      c.lineTo(x + w / 2 - 8, y + dy);
      c.stroke();
    }
  }
}
const drops = (c: Ctx, xs: [number, number][]): void => {
  for (const [x, y] of xs) {
    c.beginPath();
    c.moveTo(x, y - 7);
    c.quadraticCurveTo(x + 6, y + 1, x, y + 6);
    c.quadraticCurveTo(x - 6, y + 1, x, y - 7);
    fill(c, WATER, INK);
  }
};

// The sign of each step, drawn about (0, 0), roughly 90 units across.
const ICON: Record<string, (c: Ctx) => void> = {
  // Shears over a piece of cloth.
  cut(c) {
    sheet(c, 0, 18, 70, 36, CLOTH);
    c.strokeStyle = INK;
    c.lineWidth = 5;
    for (const k of [-1, 1]) {
      c.beginPath();
      c.moveTo(-4 * k, -2);
      c.lineTo(34 * k, -38);
      c.stroke();
    }
    c.strokeStyle = PAL.stone;
    c.lineWidth = 3;
    for (const k of [-1, 1]) {
      c.beginPath();
      c.moveTo(-4 * k, -2);
      c.lineTo(34 * k, -38);
      c.stroke();
    }
    for (const k of [-1, 1]) {
      circle(c, -10 * k, 14, 9);
      fill(c, PAL.brass);
    }
  },
  // A wash tub with water and bubbles.
  clean(c) {
    c.beginPath();
    c.moveTo(-40, -6);
    c.lineTo(40, -6);
    c.lineTo(32, 40);
    c.lineTo(-32, 40);
    c.closePath();
    fill(c, PAL.wood);
    c.fillStyle = WATER;
    c.fillRect(-36, -6, 72, 9);
    for (const [x, y, r] of [[-14, -22, 7], [6, -32, 5], [18, -16, 6]] as const) {
      circle(c, x, y, r);
      fill(c, "#d7f3f8");
    }
    c.strokeStyle = INK;
    c.lineWidth = 2.4;
    c.beginPath();
    c.moveTo(-40, -6);
    c.lineTo(40, -6);
    c.stroke();
  },
  // A sun over cloth: bleaching.
  bleach(c) {
    circle(c, 0, -22, 15);
    c.strokeStyle = PAL.gold;
    c.lineWidth = 4;
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4;
      c.beginPath();
      c.moveTo(Math.cos(a) * 21, -22 + Math.sin(a) * 21);
      c.lineTo(Math.cos(a) * 31, -22 + Math.sin(a) * 31);
      c.stroke();
    }
    circle(c, 0, -22, 15);
    fill(c, PAL.goldLight);
    sheet(c, 0, 26, 72, 28, WHITE);
  },
  // A mallet over a trough.
  pound(c) {
    c.beginPath();
    c.moveTo(-42, 12);
    c.quadraticCurveTo(0, 62, 42, 12);
    c.closePath();
    fill(c, PAL.wood);
    c.beginPath();
    c.ellipse(0, 12, 42, 7, 0, 0, Math.PI * 2);
    fill(c, "#c9bd9a");
    c.save();
    c.translate(10, -14);
    c.rotate(0.55);
    rounded(c, -3.5, -2, 7, 56, 3);
    fill(c, PAL.woodDark);
    rounded(c, -18, -26, 36, 26, 5);
    fill(c, PAL.wood);
    c.restore();
  },
  // A bowl of starch with a spoon.
  size(c) {
    c.beginPath();
    c.moveTo(-40, 0);
    c.quadraticCurveTo(0, 62, 40, 0);
    c.closePath();
    fill(c, PAL.terracotta);
    c.beginPath();
    c.ellipse(0, 0, 40, 9, 0, 0, Math.PI * 2);
    fill(c, WHITE);
    c.strokeStyle = INK;
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(6, -4);
    c.lineTo(30, -40);
    c.stroke();
    c.strokeStyle = PAL.brass;
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(6, -4);
    c.lineTo(30, -40);
    c.stroke();
  },
  // A mould lifted from a vat.
  lift(c) {
    c.beginPath();
    c.moveTo(-38, 8);
    c.lineTo(38, 8);
    c.lineTo(30, 44);
    c.lineTo(-30, 44);
    c.closePath();
    fill(c, PAL.lapis);
    c.fillStyle = WATER;
    c.fillRect(-34, 8, 68, 8);
    c.save();
    c.translate(0, -18);
    c.rotate(-0.1);
    rounded(c, -34, -12, 68, 24, 3);
    fill(c, "rgba(243,230,200,0.75)", PAL.wood);
    c.strokeStyle = PAL.wood;
    c.lineWidth = 5;
    c.stroke();
    c.restore();
    drops(c, [[-14, 0], [12, -4]]);
  },
  // A sheet on a wall.
  dry(c) {
    c.fillStyle = PAL.stone;
    c.fillRect(-44, -40, 88, 82);
    c.strokeStyle = INK;
    c.lineWidth = 2;
    c.strokeRect(-44, -40, 88, 82);
    for (const y of [-13, 14]) {
      c.beginPath();
      c.moveTo(-44, y);
      c.lineTo(44, y);
      c.stroke();
    }
    for (const [x, y] of [[-14, -40], [14, -13], [-14, 14], [14, 14]] as const) {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, y + 27);
      c.stroke();
    }
    sheet(c, 0, 0, 44, 58, WHITE);
  },
  // A smooth stone on a sheet.
  polish(c) {
    sheet(c, 0, 14, 80, 46, WHITE);
    c.beginPath();
    c.ellipse(6, -8, 26, 15, -0.15, 0, Math.PI * 2);
    fill(c, PAL.stone);
    c.strokeStyle = "rgba(255,255,255,0.8)";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-8, -14);
    c.quadraticCurveTo(2, -20, 14, -17);
    c.stroke();
    c.strokeStyle = PAL.goldLight;
    c.lineWidth = 3;
    for (const [x, y] of [[-34, 6], [38, 2]] as const) {
      c.beginPath();
      c.moveTo(x - 6, y);
      c.lineTo(x + 6, y);
      c.moveTo(x, y - 6);
      c.lineTo(x, y + 6);
      c.stroke();
    }
  },
};
// A joined card carries the signs of both its steps, side by side.
const JOINED: Record<string, [string, string]> = { "clean-bleach": ["clean", "bleach"], "size-lift": ["size", "lift"], "dry-polish": ["dry", "polish"] };

/** The material above a place, in the state a place left it in; drawn about (x, y), roughly 60 units across. Shared with the paper workshop of Samarkand (art/samarkand-room.ts). */
export function drawMaterial(c: Ctx, state: string, x: number, y: number): void {
  c.save();
  c.translate(x, y);
  const scraps = (colour: string) => {
    scrap(c, -16, -8, 22, 14, -0.3, colour);
    scrap(c, 12, -10, 20, 12, 0.35, colour);
    scrap(c, -4, 8, 24, 13, 0.1, colour);
    scrap(c, 20, 10, 16, 10, -0.5, colour);
  };
  const blob = (colour: string) => {
    c.beginPath();
    c.moveTo(-28, 6);
    c.bezierCurveTo(-30, -16, -8, -22, 6, -16);
    c.bezierCurveTo(26, -18, 34, 0, 26, 12);
    c.bezierCurveTo(10, 22, -20, 20, -28, 6);
    c.closePath();
    fill(c, colour);
  };
  switch (state) {
    case "pieces":
      scraps(CLOTH);
      break;
    case "clean":
      scraps(CLOTH);
      drops(c, [[-26, -18], [4, -24], [28, -16]]);
      break;
    case "white":
      scraps(WHITE);
      break;
    case "pulp":
      blob("#e8e2d0");
      break;
    case "sized":
      blob("#efe3b8");
      for (const [dx, dy] of [[-10, -4], [8, 2], [-2, 8]] as const) {
        circle(c, dx, dy, 2.4);
        fill(c, WHITE, null);
      }
      break;
    case "wet-sheet":
      sheet(c, 0, 0, 62, 40, "#dfe7d8");
      drops(c, [[-22, 30], [10, 32]]);
      break;
    case "dry-sheet":
      sheet(c, 0, 0, 62, 40, WHITE);
      break;
    case "paper":
      sheet(c, 0, 0, 62, 44, PAL.parchment, true);
      c.strokeStyle = PAL.goldLight;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(34, -30);
      c.lineTo(34, -18);
      c.moveTo(28, -24);
      c.lineTo(40, -24);
      c.stroke();
      break;
    default:
      break;
  }
  c.restore();
}

/** Makes a canvas for the picture, sharp on the screen it is on. */
export function paperCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = PAPER_ART.w * scale;
  canvas.height = PAPER_ART.h * scale;
  return canvas;
}

export function drawPaper(canvas: HTMLCanvasElement, v: PaperView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, y: cy, matY, dotY } = PAPER_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  c.fillStyle = PAL.wood;
  c.fillRect(0, 346, w, h - 346);
  c.fillStyle = PAL.woodDark;
  c.fillRect(0, 346, w, 8);
  const n = v.places.length;
  // The road the material takes, from place to place.
  const x0 = placeX(n, 0, v.rtl);
  const x1 = placeX(n, n - 1, v.rtl);
  c.strokeStyle = "rgba(255,227,154,0.35)";
  c.lineWidth = 6;
  c.setLineDash([4, 14]);
  c.beginPath();
  c.moveTo(x0 + (v.rtl ? 50 : -50), cy);
  c.lineTo(x1 + (v.rtl ? -50 : 50), cy);
  c.stroke();
  c.setLineDash([]);
  v.places.forEach((id, i) => {
    const r = placeRect(n, i, v.rtl);
    const x = r.x + r.w / 2;
    const moved = i < v.lit;
    drawCardBox(c, r, moved, v.stopped === i);
    if (v.selected === i) drawCardRing(c, r);
    drawCardDots(c, x, dotY, i);
    if (id) drawCardSigns(c, id, x, cy, r);
    // The material, above a place it has passed, in the state that place left it in.
    if (moved && v.made[i]) drawMaterial(c, v.made[i]!, x, matY);
  });
}

// The pieces of a place, drawn here and shared with the paper workshop of Samarkand (art/samarkand-room.ts), which stands
// the same cards in slots on its workbench: the room draws them with these functions, call for call (a test holds it).
type Rect = { x: number; y: number; w: number; h: number };
/** A place's card: its box, gold where the material has passed it, red with a broken outline where the run stopped. */
export function drawCardBox(c: Ctx, r: Rect, moved: boolean, stopped: boolean): void {
  rounded(c, r.x, r.y, r.w, r.h, 16);
  c.fillStyle = stopped ? "rgba(168,53,46,0.55)" : moved ? "rgba(242,185,75,0.4)" : "rgba(16,48,90,0.75)";
  c.fill();
  c.strokeStyle = stopped ? "#ff8f84" : moved ? PAL.goldLight : PAL.tealLight;
  c.lineWidth = stopped || moved ? 5 : 2.5;
  // A place that stopped the run is marked by a broken outline as well as by colour.
  c.setLineDash(stopped ? [12, 8] : []);
  c.stroke();
  c.setLineDash([]);
}
/** The place chosen is ringed outside its own outline, in a solid light line: not colour alone. */
export function drawCardRing(c: Ctx, r: Rect): void {
  rounded(c, r.x - 9, r.y - 9, r.w + 18, r.h + 18, 22);
  c.strokeStyle = PAL.cream;
  c.lineWidth = 7;
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 2;
  c.stroke();
}
/** The place's number, as dots centred on x: no numeral is drawn, so that no language is left out. */
export function drawCardDots(c: Ctx, x: number, y: number, i: number): void {
  for (let d = 0; d <= i; d++) {
    circle(c, x - (i * 12) / 2 + d * 12, y, 4);
    fill(c, PAL.cream, null);
  }
}
/** The sign of a card's step (or the two signs of a joined card, side by side), centred on (x, cy) in a box r. */
export function drawCardSigns(c: Ctx, id: string, x: number, cy: number, r: Rect): void {
  const parts = JOINED[id] ?? [id];
  const sc = Math.min(1, (r.w - 14) / 100) * (parts.length === 2 ? 0.62 : 0.95);
  parts.forEach((part, k) => {
    if (!ICON[part]) return;
    c.save();
    c.translate(parts.length === 2 ? x + (k === 0 ? -1 : 1) * r.w * 0.2 : x, cy + (parts.length === 2 ? (k === 0 ? -r.h * 0.1 : r.h * 0.1) : 0));
    c.scale(sc, sc);
    ICON[part](c);
    c.restore();
  });
}
