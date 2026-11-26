// The Atlas laid open, drawn in code: a book across the picture, ten round medallions on its two pages (five to a
// page, one for each world, in the order of the Atlas), five small page marks round each medallion (filled and gold
// for a page that is home, hollow for the rest), and a plain ring round a world that has a quest which can be
// played. Each medallion carries a plain sign: a star, a gear, a sun, a heart, an open book, a compass needle, waves,
// bricks, a leaf, a speech bubble. They are signs for play, not pictures of anything: no person, no face, no building
// that claims to be a real place, and nothing here says anything about history. A trial picture, replaceable like
// every picture in this game; it carries no words, so that the page's own text (in seven languages) says everything
// it shows, and every medallion is also a button on the page.
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
/**
 * The picture's own space is 1000 by 460. Each page holds five medallions: three in the upper row, two in the lower.
 * `pageX` is the middle of each page, `rowY` the middle of each row, `gap` the distance between neighbours in a row.
 */
export const ATLASBOOK = { w: 1000, h: 460, worlds: 10, pagesPerWorld: 5, pageX: [270, 730], rowY: [135, 312], gap: 138, radius: 54, ring: 63, marks: 76, reach: 66 } as const;
export interface AtlasBookView {
  /** For each world in order, how many of its five pages are home. */
  home: number[];
  /** The orders (1 to 10) of the worlds that have a quest which can be played. */
  open: number[];
  /** The page reads right to left: the worlds run from the right, and world 1 is at the top right. */
  rtl: boolean;
}

/** Where the middle of a world's medallion is, in the picture's own space; null for a number that is not a world. */
export function worldCentre(order: number, rtl: boolean): { x: number; y: number } | null {
  if (!Number.isInteger(order) || order < 1 || order > ATLASBOOK.worlds) return null;
  const i = order - 1;
  const page = i < 5 ? 0 : 1;
  const k = i % 5;
  const row = k < 3 ? 0 : 1;
  const dx = row === 0 ? (k - 1) * ATLASBOOK.gap : (k === 3 ? -0.5 : 0.5) * ATLASBOOK.gap;
  const x = ATLASBOOK.pageX[page]! + dx;
  return { x: rtl ? ATLASBOOK.w - x : x, y: ATLASBOOK.rowY[row]! };
}
/** The world under a point of the picture (given in its own 1000 by 460 space): its order from 1 to 10, or null. */
export function atlasHit(x: number, y: number, rtl: boolean): number | null {
  for (let order = 1; order <= ATLASBOOK.worlds; order++) {
    const c = worldCentre(order, rtl)!;
    if (Math.hypot(x - c.x, y - c.y) <= ATLASBOOK.reach) return order;
  }
  return null;
}

/** Makes a canvas for the book, sharp on the screen it is on. */
export function atlasCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = ATLASBOOK.w * scale;
  canvas.height = ATLASBOOK.h * scale;
  return canvas;
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
/** Fills the current path as a sticker: a light edge, the colour, and a dark outline, so that it reads on any ground. */
function sticker(c: Ctx, colour: string): void {
  c.lineWidth = 7;
  c.strokeStyle = PAL.cream;
  c.stroke();
  c.fillStyle = colour;
  c.fill();
  c.lineWidth = 2.2;
  c.strokeStyle = INK;
  c.stroke();
}
/** A line drawn as a sticker too. */
function stroked(c: Ctx, colour: string, width: number): void {
  c.strokeStyle = INK;
  c.lineWidth = width + 4;
  c.stroke();
  c.strokeStyle = colour;
  c.lineWidth = width;
  c.stroke();
}

/** The ten signs, in the order of the Atlas. Each is drawn about its own middle, inside a circle of radius 36. */
const SIGN: ((c: Ctx) => void)[] = [
  // 1. Sky, Stars and Time: a four-pointed star.
  (c) => {
    c.beginPath();
    c.moveTo(0, -36);
    c.lineTo(9, -9);
    c.lineTo(36, 0);
    c.lineTo(9, 9);
    c.lineTo(0, 36);
    c.lineTo(-9, 9);
    c.lineTo(-36, 0);
    c.lineTo(-9, -9);
    c.closePath();
    sticker(c, PAL.gold);
  },
  // 2. Machines, Numbers and Codes: a gear with eight teeth and a round hole.
  (c) => {
    c.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      for (const [r, d] of [[26, -0.34], [35, -0.2], [35, 0.2], [26, 0.34]] as const) {
        const x = Math.cos(a + d) * r;
        const y = Math.sin(a + d) * r;
        if (i === 0 && d === -0.34) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
    }
    c.closePath();
    sticker(c, PAL.brass);
    c.beginPath();
    c.arc(0, 0, 10, 0, Math.PI * 2);
    c.fillStyle = PAL.tealDark;
    c.fill();
    c.lineWidth = 2.2;
    c.strokeStyle = INK;
    c.stroke();
  },
  // 3. Light, Earth, Water and Maps: a sun, a round face-less disk with twelve rays.
  (c) => {
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      c.beginPath();
      c.moveTo(Math.cos(a) * 22, Math.sin(a) * 22);
      c.lineTo(Math.cos(a) * 35, Math.sin(a) * 35);
      stroked(c, PAL.goldLight, 4);
    }
    c.beginPath();
    c.arc(0, 0, 16, 0, Math.PI * 2);
    sticker(c, PAL.gold);
  },
  // 4. Medicine and Care: a heart.
  (c) => {
    c.beginPath();
    c.moveTo(0, 30);
    c.bezierCurveTo(-44, 2, -30, -34, 0, -14);
    c.bezierCurveTo(30, -34, 44, 2, 0, 30);
    c.closePath();
    sticker(c, PAL.terracotta);
  },
  // 5. Books, Schools and Language: an open book.
  (c) => {
    c.beginPath();
    c.moveTo(0, -16);
    c.lineTo(-34, -26);
    c.lineTo(-34, 20);
    c.lineTo(0, 30);
    c.lineTo(34, 20);
    c.lineTo(34, -26);
    c.closePath();
    sticker(c, PAL.parchment);
    c.beginPath();
    c.moveTo(0, -16);
    c.lineTo(0, 30);
    stroked(c, PAL.lapis, 2.5);
    for (const side of [-1, 1]) {
      for (const y of [-10, 0, 10]) {
        c.beginPath();
        c.moveTo(side * 6, y - 4 + 0);
        c.lineTo(side * 26, y - 9);
        c.strokeStyle = PAL.lapis;
        c.lineWidth = 2.5;
        c.stroke();
      }
    }
  },
  // 6. Journeys and Maps: a compass needle in a ring.
  (c) => {
    c.beginPath();
    c.arc(0, 0, 33, 0, Math.PI * 2);
    stroked(c, PAL.cream, 3);
    c.beginPath();
    c.moveTo(0, -30);
    c.lineTo(9, 0);
    c.lineTo(-9, 0);
    c.closePath();
    sticker(c, PAL.terracotta);
    c.beginPath();
    c.moveTo(0, 30);
    c.lineTo(9, 0);
    c.lineTo(-9, 0);
    c.closePath();
    sticker(c, PAL.cream);
    c.beginPath();
    c.arc(0, 0, 4, 0, Math.PI * 2);
    c.fillStyle = INK;
    c.fill();
  },
  // 7. Seas, Trade and Golden Books: three waves.
  (c) => {
    for (const y of [-16, 0, 16]) {
      c.beginPath();
      c.moveTo(-34, y);
      c.bezierCurveTo(-24, y - 14, -12, y - 14, -2, y);
      c.bezierCurveTo(8, y + 14, 20, y + 14, 34, y - 4);
      stroked(c, "#7fd0e0", 5);
    }
  },
  // 8. Cities, Builders and Civic Care: a short wall of bricks.
  (c) => {
    c.save();
    c.beginPath();
    c.rect(-34, -27, 68, 54);
    c.clip();
    for (let row = 0; row < 3; row++) {
      for (let k = -1; k < 4; k++) {
        const x = -34 + (row % 2 ? -11 : 0) + k * 22;
        c.beginPath();
        c.rect(x, -27 + row * 19, 22, 17);
        c.lineWidth = 2.2;
        c.fillStyle = PAL.terracotta;
        c.fill();
        c.strokeStyle = INK;
        c.stroke();
      }
    }
    c.restore();
    c.beginPath();
    c.rect(-34, -27, 68, 54);
    c.lineWidth = 3;
    c.strokeStyle = PAL.cream;
    c.stroke();
  },
  // 9. Nature, Animals and Wonders: a leaf with its vein.
  (c) => {
    c.beginPath();
    c.moveTo(-28, 28);
    c.bezierCurveTo(-42, -10, 0, -40, 32, -32);
    c.bezierCurveTo(38, 2, 10, 36, -28, 28);
    c.closePath();
    sticker(c, PAL.emerald);
    c.beginPath();
    c.moveTo(-28, 28);
    c.lineTo(18, -18);
    stroked(c, PAL.cream, 2.5);
  },
  // 10. Voices, Wisdom and Society: a speech bubble with three dots.
  (c) => {
    rounded(c, -34, -28, 68, 46, 14);
    sticker(c, PAL.cream);
    c.beginPath();
    c.moveTo(-14, 16);
    c.lineTo(-22, 34);
    c.lineTo(4, 16);
    c.closePath();
    sticker(c, PAL.cream);
    c.fillStyle = INK;
    for (const x of [-14, 0, 14]) {
      c.beginPath();
      c.arc(x, -5, 3.8, 0, Math.PI * 2);
      c.fill();
    }
  },
];

export function drawAtlasBook(canvas: HTMLCanvasElement, v: AtlasBookView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h } = ATLASBOOK;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  // The table the book lies on.
  const table = c.createLinearGradient(0, 0, 0, h);
  table.addColorStop(0, PAL.night);
  table.addColorStop(1, PAL.deep);
  c.fillStyle = table;
  c.fillRect(0, 0, w, h);
  // The cover, then the two pages with the edge of the leaves under them.
  rounded(c, 14, 12, 972, 436, 22);
  c.fillStyle = PAL.woodDark;
  c.fill();
  c.strokeStyle = PAL.brass;
  c.lineWidth = 4;
  c.stroke();
  for (const [x, flip] of [[44, false], [506, true]] as const) {
    for (const off of [10, 6, 3]) {
      rounded(c, x + (flip ? off : -off) * 0.5, 36 + off * 0.7, 450, 384, 12);
      c.fillStyle = PAL.cream;
      c.fill();
      c.strokeStyle = PAL.ochre;
      c.lineWidth = 1.5;
      c.stroke();
    }
    rounded(c, x, 36, 450, 384, 12);
    const page = c.createLinearGradient(flip ? x : x + 450, 0, flip ? x + 450 : x, 0);
    page.addColorStop(0, PAL.parchment);
    page.addColorStop(0.82, PAL.parchment);
    page.addColorStop(1, "#c9b585");
    c.fillStyle = page;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 2.4;
    c.stroke();
  }
  // The spine, and a ribbon hanging from it.
  c.fillStyle = "rgba(42,26,18,0.55)";
  c.fillRect(496, 36, 8, 384);
  c.beginPath();
  c.moveTo(514, 418);
  c.lineTo(514, 452);
  c.lineTo(522, 444);
  c.lineTo(530, 452);
  c.lineTo(530, 418);
  c.closePath();
  c.fillStyle = PAL.red;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 2;
  c.stroke();

  for (let order = 1; order <= ATLASBOOK.worlds; order++) {
    const at = worldCentre(order, v.rtl)!;
    const home = Math.max(0, Math.min(ATLASBOOK.pagesPerWorld, v.home[order - 1] ?? 0));
    // The medallion.
    c.save();
    c.translate(at.x, at.y);
    c.beginPath();
    c.arc(0, 0, ATLASBOOK.radius, 0, Math.PI * 2);
    const disk = c.createRadialGradient(0, -14, 6, 0, 0, ATLASBOOK.radius);
    disk.addColorStop(0, PAL.tealLight);
    disk.addColorStop(1, PAL.tealDark);
    c.fillStyle = disk;
    c.fill();
    c.strokeStyle = PAL.brass;
    c.lineWidth = 5;
    c.stroke();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    SIGN[order - 1]!(c);
    // A world with a quest that can be played has a plain ring round its medallion: a shape, not a colour alone.
    if (v.open.includes(order)) {
      c.beginPath();
      c.arc(0, 0, ATLASBOOK.ring, 0, Math.PI * 2);
      c.strokeStyle = INK;
      c.lineWidth = 9;
      c.stroke();
      c.strokeStyle = PAL.goldLight;
      c.lineWidth = 5;
      c.stroke();
    }
    // Five page marks on an arc below it: gold and filled for each page that is home, hollow for the rest.
    for (let k = 0; k < ATLASBOOK.pagesPerWorld; k++) {
      const a = ((140 - 25 * k) * Math.PI) / 180;
      const x = Math.cos(a) * ATLASBOOK.marks * (v.rtl ? -1 : 1);
      const y = Math.sin(a) * ATLASBOOK.marks;
      c.beginPath();
      c.arc(x, y, 6.5, 0, Math.PI * 2);
      if (k < home) {
        c.fillStyle = PAL.gold;
        c.fill();
        c.strokeStyle = INK;
        c.lineWidth = 2;
      } else {
        c.strokeStyle = PAL.woodDark;
        c.lineWidth = 2.6;
      }
      c.stroke();
    }
    c.restore();
  }
}
