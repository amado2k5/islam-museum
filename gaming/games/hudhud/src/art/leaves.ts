// Al-Razi's loose leaves, drawn in code: a row of paper leaves on a desk, each with a plain sign for its part of the body
// (a head outline with no face, a ribcage, a rounded belly, a footprint) and a mark for its kind that differs in shape
// (a closed book for what the books say, an open eye for what he saw himself), and, as a binding is shown, a thread
// through the holes of the leaves that held. A trial picture, replaceable like every picture in this game; it carries no
// words and no numerals (the places are numbered by dots), so that the page's own text, in seven languages, says
// everything it shows. The row's layout and its hit-test are the paper quest's (art/paper.ts), shared and not copied.
import { INK, PAL } from "./kit";
import { PAPER_ART, paperHit, placeRect, placeX, type PaperView } from "./paper";

type Ctx = CanvasRenderingContext2D;
/** The picture's own space: the same row as the paper quest's. */
export const LEAVES_ART = PAPER_ART;
/** What lies under a point of the picture: the shared hit-test of a row of places. */
export const leavesHit = paperHit;
/** What the picture is given: the same as the paper's row (`made` is not used: the thread says how far a binding held). */
export type LeavesView = PaperView;

const LEAF = "#f6ecd2";
const LEAF_EDGE = "#c9b48a";
/** The colour of the binding thread, on the page and in al-Razi's study. */
export const THREAD = "#b8322a";

function fill(c: Ctx, colour: string, line: string | null = INK, width = 2.4): void {
  c.fillStyle = colour;
  c.fill();
  if (line) {
    c.strokeStyle = line;
    c.lineWidth = width;
    c.stroke();
  }
}
const circle = (c: Ctx, x: number, y: number, r: number): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
};
function line(c: Ctx, pts: [number, number][], colour = INK, width = 3): void {
  c.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
  c.strokeStyle = colour;
  c.lineWidth = width;
  c.stroke();
}

// The sign of each part of the body, drawn about (0, 0), roughly 80 units across. Plain outlines only.
const BODY_SIGN: Record<string, (c: Ctx) => void> = {
  /** A head and shoulders in outline, with no face. */
  head(c) {
    circle(c, 0, -12, 22);
    fill(c, PAL.cream);
    c.beginPath();
    c.moveTo(-34, 36);
    c.quadraticCurveTo(-30, 14, -8, 12);
    c.lineTo(8, 12);
    c.quadraticCurveTo(30, 14, 34, 36);
    c.strokeStyle = INK;
    c.lineWidth = 3;
    c.stroke();
  },
  /** A ribcage: a spine and curved ribs on either side. */
  chest(c) {
    line(c, [[0, -34], [0, 34]], INK, 4);
    for (const y of [-24, -10, 4, 18]) {
      for (const k of [-1, 1]) {
        c.beginPath();
        c.moveTo(0, y);
        c.quadraticCurveTo(30 * k, y - 6, 28 * k, y + 10);
        c.strokeStyle = INK;
        c.lineWidth = 3;
        c.stroke();
      }
    }
  },
  /** A rounded belly in outline, under a short waist line. */
  belly(c) {
    line(c, [[-20, -30], [20, -30]], INK, 3);
    c.beginPath();
    c.moveTo(-20, -30);
    c.bezierCurveTo(-40, -10, -38, 30, 0, 32);
    c.bezierCurveTo(38, 30, 40, -10, 20, -30);
    fill(c, PAL.cream, INK, 3);
  },
  /** A footprint: a sole and five toes. */
  foot(c) {
    c.beginPath();
    c.ellipse(0, 10, 16, 26, 0.12, 0, Math.PI * 2);
    fill(c, PAL.stone, INK, 2.4);
    for (const [x, y, r] of [[-12, -24, 6], [-1, -28, 5], [8, -26, 4.5], [15, -21, 4], [20, -14, 3.5]] as const) {
      circle(c, x, y, r);
      fill(c, PAL.stone, INK, 2);
    }
  },
};
// The mark of each kind of leaf, drawn about (0, 0), roughly 34 units across. They differ in shape, not only in colour.
const KIND_MARK: Record<string, (c: Ctx) => void> = {
  /** A closed book: a cover with a spine. */
  books(c) {
    c.beginPath();
    c.rect(-16, -12, 32, 24);
    fill(c, PAL.lapis, INK, 2);
    c.beginPath();
    c.rect(-16, -12, 6, 24);
    fill(c, PAL.brass, INK, 2);
  },
  /** An open eye: an almond outline with a round iris. */
  own(c) {
    c.beginPath();
    c.moveTo(-18, 0);
    c.quadraticCurveTo(0, -18, 18, 0);
    c.quadraticCurveTo(0, 18, -18, 0);
    fill(c, "#ffffff", INK, 2.4);
    circle(c, 0, 0, 6.5);
    fill(c, PAL.emerald, INK, 1.6);
    circle(c, 0, 0, 2.4);
    fill(c, INK, null);
  },
};

/** Makes a canvas for the picture, sharp on the screen it is on. */
export function leavesCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = LEAVES_ART.w * scale;
  canvas.height = LEAVES_ART.h * scale;
  return canvas;
}

/** The hole at the top of leaf `i`, where the thread passes. */
const hole = (n: number, i: number, rtl: boolean): [number, number] => [placeX(n, i, rtl), placeRect(n, i, rtl).y + 16];

/**
 * One leaf's paper: the page with its folded corner (marked when the binding held through it, or when it stopped there:
 * the second by a broken outline as well as by colour) and the hole the thread passes through at (hx, hy). Shared by the
 * page's picture (drawLeaves) and al-Razi's room (art/razi.ts), which draws each leaf with this same code.
 */
export function drawLeafPaper(c: Ctx, r: { x: number; y: number; w: number; h: number }, hx: number, hy: number, held: boolean, stopped: boolean): void {
  // The leaf, with a folded corner.
  const fold = 18;
  c.beginPath();
  c.moveTo(r.x, r.y);
  c.lineTo(r.x + r.w - fold, r.y);
  c.lineTo(r.x + r.w, r.y + fold);
  c.lineTo(r.x + r.w, r.y + r.h);
  c.lineTo(r.x, r.y + r.h);
  c.closePath();
  c.fillStyle = stopped ? "#f1c9bf" : LEAF;
  c.fill();
  c.strokeStyle = stopped ? PAL.red : held ? PAL.gold : LEAF_EDGE;
  c.lineWidth = stopped || held ? 5 : 2.5;
  // A leaf that stopped the binding is marked by a broken outline as well as by colour.
  c.setLineDash(stopped ? [12, 8] : []);
  c.stroke();
  c.setLineDash([]);
  c.beginPath();
  c.moveTo(r.x + r.w - fold, r.y);
  c.lineTo(r.x + r.w - fold, r.y + fold);
  c.lineTo(r.x + r.w, r.y + fold);
  fill(c, LEAF_EDGE, INK, 1.5);
  // The hole the thread passes through.
  circle(c, hx, hy, 5);
  fill(c, PAL.woodDark, null);
}
/** The ring round the place chosen, outside its own outline, in a solid light line: not colour alone. Shared with al-Razi's room, where it rings the leaf lifted. */
export function drawChosenRing(c: Ctx, r: { x: number; y: number; w: number; h: number }): void {
  c.beginPath();
  c.rect(r.x - 9, r.y - 9, r.w + 18, r.h + 18);
  c.strokeStyle = PAL.cream;
  c.lineWidth = 7;
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 2;
  c.stroke();
}
/** A place's number, as dots centred on x: place i (from 0) has i + 1 dots. No numeral is drawn, so that no language is left out. */
export function drawPlaceDots(c: Ctx, x: number, y: number, i: number): void {
  for (let d = 0; d <= i; d++) {
    circle(c, x - (i * 12) / 2 + d * 12, y, 4);
    fill(c, PAL.cream, null);
  }
}
/** A leaf's two signs, its part of the body (about x, cy - 10) and its kind (near the leaf's foot), for a leaf id such as "books-head". */
export function drawLeafSigns(c: Ctx, id: string, x: number, cy: number, r: { x: number; y: number; w: number; h: number }): void {
  const [kind, body] = id.split("-") as [string, string];
  const sc = Math.min(1, (r.w - 20) / 90);
  c.save();
  c.translate(x, cy - 10);
  c.scale(sc, sc);
  BODY_SIGN[body]?.(c);
  c.restore();
  c.save();
  c.translate(x, r.y + r.h - 24);
  c.scale(Math.max(0.7, sc), Math.max(0.7, sc));
  KIND_MARK[kind]?.(c);
  c.restore();
}

export function drawLeaves(canvas: HTMLCanvasElement, v: LeavesView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, y: cy, dotY } = LEAVES_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  // A wall behind, and the desk the leaves lie on.
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  c.fillStyle = PAL.wood;
  c.fillRect(0, 150, w, h - 150);
  c.fillStyle = PAL.woodDark;
  c.fillRect(0, 150, w, 8);
  c.fillStyle = "rgba(0,0,0,0.12)";
  for (let y = 190; y < h; y += 44) c.fillRect(0, y, w, 3);
  const n = v.places.length;
  v.places.forEach((id, i) => {
    const r = placeRect(n, i, v.rtl);
    const x = r.x + r.w / 2;
    const [hx, hy] = hole(n, i, v.rtl);
    drawLeafPaper(c, r, hx, hy, i < v.lit, v.stopped === i);
    if (v.selected === i) drawChosenRing(c, r);
    drawPlaceDots(c, x, dotY, i);
    if (!id) return;
    drawLeafSigns(c, id, x, cy, r);
  });
  // The thread, through the leaves that held, in the order of the row; when the notebook is bound, through them all,
  // with a knot at the end.
  const through = v.done ? n : Math.min(v.lit, n);
  if (through > 0) {
    const pts = Array.from({ length: through }, (_, i) => hole(n, i, v.rtl));
    const [sx, sy] = pts[0]!;
    const out: [number, number][] = [[sx + (v.rtl ? 30 : -30), sy - 10], ...pts];
    line(c, out, THREAD, 4);
    if (v.done) {
      const [ex, ey] = pts[pts.length - 1]!;
      circle(c, ex + (v.rtl ? -14 : 14), ey, 6);
      fill(c, THREAD, INK, 1.5);
    }
  }
}
