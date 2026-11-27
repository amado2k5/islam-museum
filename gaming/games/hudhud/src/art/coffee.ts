// The shelves and the cards of coffee, drawn in code: three shelves across the top, each marked by dots (one, two and
// three) and by a sign that differs in shape, not in colour alone: a solid seal for what the record states plainly, two
// speech marks facing each other for the tellings that do not agree, a cloud for the legend. Each card is a small scroll
// with its own plain sign: a tree, a husk and a cup, a lamp at night, three dots joined by a road, a crossed-out cup, an
// anchor (Aden), a ship (Mocha) and a goat's horn. There are no people and no faces in the picture, and no text: the
// page's own words, in seven languages, say what each shelf and each card is. The layout is the same as the animal
// cards' (art/sort.ts: the same shelves, the same places, the same hit-test), so that on a right to left page the first
// shelf and the first card are on the right; the signs themselves are not turned round. Drawn for play, and making no
// claim to be exact.
import { PAL } from "./kit";
import { SORT_ART, drawSort, ell, poly, rounded, seg, sortCanvas, trayDots, type Ctx, type Rect, type SortSkin, type SortView } from "./sort";

export { SORT_ART as COFFEE_ART, sortCanvas as coffeeCanvas };

const GREEN = "#3f8f4a";
const RED = "#c9432f";
const BROWN = "#7a4a26";
const GOLD = "#f2b94b";

const at = (c: Ctx, x: number, y: number, draw: () => void): void => {
  c.save();
  c.translate(x, y);
  draw();
  c.restore();
};

/** A cup with a handle, drawn in a box about 40 wide: its top edge at y = 0 and its foot at y = 16. */
function cup(c: Ctx, scale = 1): void {
  c.save();
  c.scale(scale, scale);
  poly(c, [[-14, 0], [14, 0], [10, 16], [-10, 16]], "#fbf3df");
  c.beginPath();
  c.arc(15, 7, 6, -Math.PI / 2, Math.PI / 2);
  c.lineWidth = 3;
  c.stroke();
  c.lineWidth = 2;
  ell(c, 0, 0, 14, 3.5, BROWN);
  c.restore();
}

/** What is drawn on each card, in a 72 by 72 box; the scroll leaves about 60 by 46 of it clear. */
const SIGNS: Record<string, (c: Ctx) => void> = {
  // A tree with a round crown and berries.
  ethiopia(c) {
    at(c, 36, 36, () => {
      poly(c, [[-3, 4], [3, 4], [4, 20], [-4, 20]], BROWN);
      ell(c, 0, -5, 18, 14, GREEN);
      for (const [x, y] of [[-8, -8], [4, -12], [9, -3], [-3, 0], [-11, 0]] as [number, number][]) {
        c.beginPath();
        c.arc(x, y, 2.6, 0, Math.PI * 2);
        c.fillStyle = RED;
        c.fill();
        c.stroke();
      }
    });
  },
  // A curled piece of husk beside a cup, with a thread of steam.
  husk(c) {
    at(c, 36, 36, () => {
      at(c, -8, 2, () => cup(c));
      seg(c, [[-12, -4], [-9, -9], [-12, -14], [-9, -19]], 2);
      ell(c, 14, 14, 11, 5, BROWN, -0.55);
      seg(c, [[6, 19], [14, 12], [22, 8]], 1.5, "#d9b27a");
    });
  },
  // An oil lamp with a flame, and two stars: a lamp at night.
  sufis(c) {
    at(c, 36, 36, () => {
      const star = (x: number, y: number, r: number) => poly(c, [[x, y - r], [x + r / 3, y - r / 3], [x + r, y], [x + r / 3, y + r / 3], [x, y + r], [x - r / 3, y + r / 3], [x - r, y], [x - r / 3, y - r / 3]], GOLD);
      star(-19, -13, 5);
      star(19, -16, 4);
      ell(c, -1, 11, 13, 6, "#d9a033");
      poly(c, [[10, 8], [20, 5], [14, 13]], "#d9a033");
      c.beginPath();
      c.arc(-14, 10, 5, Math.PI / 2, (3 * Math.PI) / 2);
      c.lineWidth = 3;
      c.stroke();
      c.lineWidth = 2;
      poly(c, [[0, 3], [-4, -3], [0, -13], [4, -3]], "#ffe39a");
      poly(c, [[0, 1], [-2, -3], [0, -7], [2, -3]], RED);
    });
  },
  // Three dots joined by a road.
  spread(c) {
    at(c, 36, 36, () => {
      c.save();
      c.lineWidth = 6;
      c.strokeStyle = "#a88a5a";
      c.beginPath();
      c.moveTo(-19, 10);
      c.bezierCurveTo(-8, 10, -6, -9, 0, -9);
      c.bezierCurveTo(8, -9, 8, 8, 19, 7);
      c.stroke();
      c.lineWidth = 1.5;
      c.setLineDash([4, 4]);
      c.strokeStyle = "#fbf3df";
      c.stroke();
      c.restore();
      for (const [x, y] of [[-19, 10], [0, -9], [19, 7]] as [number, number][]) {
        c.beginPath();
        c.arc(x, y, 5.5, 0, Math.PI * 2);
        c.fillStyle = RED;
        c.fill();
        c.stroke();
      }
    });
  },
  // A cup with a red ring and bar across it: a ban.
  ban(c) {
    at(c, 36, 36, () => {
      at(c, 0, -8, () => cup(c, 0.95));
      c.save();
      c.lineWidth = 4;
      c.strokeStyle = RED;
      c.beginPath();
      c.arc(0, 1, 19, 0, Math.PI * 2);
      c.moveTo(-13, -12);
      c.lineTo(13, 14);
      c.stroke();
      c.restore();
    });
  },
  // An anchor: Aden, a port.
  dhabhani(c) {
    at(c, 36, 36, () => {
      c.save();
      c.lineWidth = 3.4;
      c.strokeStyle = "#2a2a3a";
      c.beginPath();
      c.arc(0, -15, 4, 0, Math.PI * 2);
      c.moveTo(0, -11);
      c.lineTo(0, 15);
      c.moveTo(-8, -6);
      c.lineTo(8, -6);
      c.moveTo(-15, 4);
      c.arc(0, 4, 15, Math.PI, 0, true);
      c.stroke();
      c.restore();
      poly(c, [[-18, 3], [-12, 3], [-15, -2]], "#2a2a3a", false);
      poly(c, [[18, 3], [12, 3], [15, -2]], "#2a2a3a", false);
    });
  },
  // A ship with one sail on the waves: Mocha, a port.
  shadhili(c) {
    at(c, 36, 36, () => {
      poly(c, [[-18, 6], [18, 6], [12, 15], [-12, 15]], BROWN);
      seg(c, [[0, 6], [0, -18]], 2.4);
      poly(c, [[2, -17], [2, 3], [17, 3]], "#fbf3df");
      poly(c, [[-2, -14], [-2, 3], [-12, 3]], "#f1d9a6");
      seg(c, [[-21, 19], [-16, 16], [-11, 19], [-6, 16], [-1, 19], [4, 16], [9, 19], [14, 16], [19, 19]], 1.8, "#3b8fa0");
    });
  },
  // A goat's horn: a ridged, curved horn.
  goats(c) {
    at(c, 36, 36, () => {
      c.beginPath();
      c.moveTo(-13, 19);
      c.bezierCurveTo(-21, -4, 4, -19, 16, -15);
      c.bezierCurveTo(6, -10, -3, 0, -2, 19);
      c.closePath();
      c.fillStyle = "#e3d3a6";
      c.fill();
      c.stroke();
      for (const [x1, y1, x2, y2] of [[-14, 12, -5, 12], [-14, 4, -4, 5], [-11, -4, -2, -1], [-4, -11, 3, -6]] as [number, number, number, number][]) seg(c, [[x1, y1], [x2, y2]], 1.4, "#8a6a30");
    });
  },
};

/** The three shelf signs, each drawn about its own middle, in a box about 2 r across. */
const SHELF_SIGNS: ((c: Ctx, r: number) => void)[] = [
  // A solid seal: a filled disc with a scalloped rim.
  (c, r) => {
    c.fillStyle = PAL.goldLight;
    for (let i = 0; i < 10; i++) {
      c.beginPath();
      c.arc(Math.cos((i * 2 * Math.PI) / 10) * r * 0.84, Math.sin((i * 2 * Math.PI) / 10) * r * 0.84, r * 0.2, 0, Math.PI * 2);
      c.fill();
    }
    c.beginPath();
    c.arc(0, 0, r * 0.84, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    c.lineWidth = Math.max(1.5, r * 0.12);
    c.strokeStyle = "#0e3c46";
    c.stroke();
  },
  // Two speech marks facing each other: each a small bubble with its tail towards the other.
  (c, r) => {
    c.fillStyle = PAL.goldLight;
    for (const s of [-1, 1]) {
      const x = s * r * 0.58;
      rounded(c, x - r * 0.42, -r * 0.62, r * 0.84, r * 0.8, r * 0.2);
      c.fill();
      c.beginPath();
      c.moveTo(x - s * r * 0.02, r * 0.14);
      c.lineTo(x - s * r * 0.4, r * 0.62);
      c.lineTo(x - s * r * 0.3, r * 0.14);
      c.closePath();
      c.fill();
    }
  },
  // A cloud: three round tops on a flat base.
  (c, r) => {
    c.fillStyle = PAL.goldLight;
    c.beginPath();
    c.arc(-r * 0.5, r * 0.12, r * 0.38, 0, Math.PI * 2);
    c.arc(-r * 0.08, -r * 0.22, r * 0.5, 0, Math.PI * 2);
    c.arc(r * 0.46, 0, r * 0.42, 0, Math.PI * 2);
    c.fill();
    c.fillRect(-r * 0.5, r * 0.1, r * 1.0, r * 0.4);
  },
];

const sign = (c: Ctx, g: number, x: number, y: number, r: number, alpha = 1): void => {
  c.save();
  c.globalAlpha = alpha;
  c.translate(x, y);
  SHELF_SIGNS[g]!(c, r);
  c.restore();
};

const COFFEE: SortSkin = {
  trayMark: (c: Ctx, t: Rect, g: number, rtl: boolean) => {
    // The dots stay in the middle of the header; the sign is at the end the page begins from, and a larger, fainter copy lies on the mat behind the cards.
    trayDots(c, t, g, rtl);
    sign(c, g, rtl ? t.x + t.w - 28 : t.x + 28, t.y + 17, 12);
    sign(c, g, t.x + t.w / 2, t.y + 34 + (t.h - 34 - 14) / 2, 62, 0.13);
  },
  face: (item) => SIGNS[item] ?? (() => undefined),
  frame: "scroll",
  board: true,
};

export function drawCoffee(canvas: HTMLCanvasElement, v: SortView): void {
  drawSort(canvas, v, COFFEE);
}
