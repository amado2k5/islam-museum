// The animal cards and their trays, drawn in code: a row of trays across the top, each marked with one to five dots
// (its number: there is no text in the picture, so the page's own words, in seven languages, say what each tray is),
// and the cards standing in the trays, or, not yet placed, in a row along the bottom. Each card is a simple, friendly
// drawing of its animal, made by shape, not by colour alone: the eagle has spread wings and yellow talons, the vulture a
// bare neck and a ruff, the crow a straight black beak, the bat a wing skin and big ears, the ostrich a long neck and
// long legs, the locust a bent hind leg, the bee stripes, and the fly red eyes and two clear wings. They are drawn for
// play and make no claim to be exact. On a right to left page the layout is mirrored (the first tray and the first
// card are on the right), but the animals themselves are not turned round.
import { INK, PAL } from "./kit";

export type Ctx = CanvasRenderingContext2D;
export const SORT_ART = { w: 1000, h: 460, margin: 30, trayGap: 14, trayY: 14, trayH: 290, head: 34, pad: 10, card: 72, gap: 8, restY: 326, restH: 110 } as const;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
const mirror = (r: Rect, rtl: boolean): Rect => (rtl ? { ...r, x: SORT_ART.w - r.x - r.w } : r);

/** Where the trays lie (before any mirroring they run left to right in the order of the groups; the first is on the right on a right to left page). */
export function trayRects(groups: number, rtl: boolean): Rect[] {
  const { w, margin, trayGap, trayY, trayH } = SORT_ART;
  const tw = Math.floor((w - 2 * margin - (groups - 1) * trayGap) / groups);
  return Array.from({ length: groups }, (_, i) => mirror({ x: margin + i * (tw + trayGap), y: trayY, w: tw, h: trayH }, rtl));
}
/** How many cards a tray holds across, and down. */
export function trayGrid(groups: number): { cols: number; rows: number } {
  const { w, margin, trayGap, pad, card, gap, trayH, head } = SORT_ART;
  const tw = Math.floor((w - 2 * margin - (groups - 1) * trayGap) / groups);
  return { cols: Math.max(1, Math.floor((tw - 2 * pad + gap) / (card + gap))), rows: Math.max(1, Math.floor((trayH - head - 2 * pad + gap) / (card + gap))) };
}
/** The place of the nth card (counting from 0) in a tray. */
export function slotRect(groups: number, group: number, n: number, rtl: boolean): Rect {
  const { w, margin, trayGap, trayY, pad, card, gap, head } = SORT_ART;
  const tw = Math.floor((w - 2 * margin - (groups - 1) * trayGap) / groups);
  const { cols } = trayGrid(groups);
  const across = cols * (card + gap) - gap;
  const left = margin + group * (tw + trayGap) + (tw - across) / 2;
  return mirror({ x: left + (n % cols) * (card + gap), y: trayY + head + pad + Math.floor(n / cols) * (card + gap), w: card, h: card }, rtl);
}
/** The place of a card that is not placed: each has its own, along the bottom, in the order of the cards. */
export function restRect(items: number, index: number, rtl: boolean): Rect {
  const { w, card, gap, restY, restH } = SORT_ART;
  const across = items * (card + gap) - gap;
  return mirror({ x: (w - across) / 2 + index * (card + gap), y: restY + (restH - card) / 2, w: card, h: card }, rtl);
}
/** The band along the bottom where cards that are not placed lie. */
export const restBand = (rtl: boolean): Rect => mirror({ x: SORT_ART.margin, y: SORT_ART.restY, w: SORT_ART.w - 2 * SORT_ART.margin, h: SORT_ART.restH }, rtl);

/** What a view of the cards is made of: the cards in order, the tray each is in (its number from 0, or null), and how many trays there are. */
export interface SortView {
  items: readonly string[];
  placed: readonly (number | null)[];
  groups: number;
  rtl: boolean;
  /** The card chosen by a touch or a click, to be put in a tray; or null. */
  selected: number | null;
  /** The sorting is done. */
  done: boolean;
}
/** Where every card lies: in its tray, in the order of the cards among those in the same tray, or in its own place along the bottom. */
export function cardRects(v: Pick<SortView, "items" | "placed" | "groups" | "rtl">): Rect[] {
  const inTray = new Array<number>(v.groups).fill(0);
  return v.items.map((_, i) => {
    const g = v.placed[i] ?? null;
    if (g === null) return restRect(v.items.length, i, v.rtl);
    return slotRect(v.groups, g, inTray[g]!++, v.rtl);
  });
}
/** What lies under a point of the picture, given in its own 1000 by 460 space: a card (its number in the order of the cards), a tray (its number), the band of cards not placed, or nothing. A card wins over the tray it stands in. */
export type SortSpot = { type: "card"; item: number } | { type: "tray"; group: number } | { type: "rest" };
export function sortHit(x: number, y: number, v: Pick<SortView, "items" | "placed" | "groups" | "rtl">): SortSpot | null {
  const inside = (r: Rect) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  const cards = cardRects(v);
  for (let i = cards.length - 1; i >= 0; i--) if (inside(cards[i]!)) return { type: "card", item: i };
  const trays = trayRects(v.groups, v.rtl);
  for (let g = 0; g < trays.length; g++) if (inside(trays[g]!)) return { type: "tray", group: g };
  return inside(restBand(v.rtl)) ? { type: "rest" } : null;
}

export function rounded(c: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
export const ell = (c: Ctx, x: number, y: number, rx: number, ry: number, fill: string, rot = 0, line = true): void => {
  c.beginPath();
  c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
  if (line) c.stroke();
};
export const poly = (c: Ctx, pts: [number, number][], fill: string, line = true): void => {
  c.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (line) c.stroke();
};
export const seg = (c: Ctx, pts: [number, number][], width = 2, colour: string = INK): void => {
  c.save();
  c.lineWidth = width;
  c.strokeStyle = colour;
  c.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
  c.stroke();
  c.restore();
};
export const dot = (c: Ctx, x: number, y: number, r: number, fill: string): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
};

/** The eight creatures, each drawn in a 72 by 72 box. */
const CREATURES: Record<string, (c: Ctx) => void> = {
  // Spread wings with feathered tips, a white head, a yellow hooked beak and yellow talons.
  eagle(c) {
    const wing = (s: 1 | -1) => {
      const X = (x: number) => 36 + s * (x - 36);
      poly(c, [[X(36), 33], [X(22), 26], [X(7), 27], [X(3), 36], [X(9), 35], [X(5), 43], [X(13), 40], [X(11), 48], [X(20), 43], [X(36), 45]], "#7a4a26");
    };
    wing(1);
    wing(-1);
    poly(c, [[29, 45], [43, 45], [40, 58], [32, 58]], "#6a3f20"); // tail
    ell(c, 36, 38, 7, 11, "#8a5630");
    dot(c, 36, 25, 7, "#fbf3df");
    c.beginPath();
    c.arc(36, 25, 7, 0, Math.PI * 2);
    c.stroke();
    poly(c, [[32, 26], [40, 26], [38, 31], [36, 36], [35, 31]], "#f2b94b"); // hooked beak
    dot(c, 33, 23, 1.5, INK);
    dot(c, 39, 23, 1.5, INK);
    for (const s of [-1, 1]) {
      seg(c, [[36 + s * 4, 49], [36 + s * 5, 62]], 2.2, "#d49a1a");
      seg(c, [[36 + s * 5, 62], [36 + s * 9, 66]], 2.2, "#d49a1a");
      seg(c, [[36 + s * 5, 62], [36 + s * 5, 67]], 2.2, "#d49a1a");
      seg(c, [[36 + s * 5, 62], [36 + s * 1, 66]], 2.2, "#d49a1a");
    }
  },
  // Hunched and dark, a bare pink neck and head, a pale ruff and a heavy hooked beak.
  vulture(c) {
    ell(c, 38, 50, 21, 15, "#4a3326", -0.1);
    seg(c, [[26, 47], [44, 60]], 1.6);
    seg(c, [[32, 44], [50, 56]], 1.6);
    seg(c, [[32, 63], [32, 69]], 3);
    seg(c, [[44, 64], [44, 69]], 3);
    ell(c, 29, 38, 11, 6, "#f3e6c8", 0.5); // ruff
    seg(c, [[28, 35], [21, 19]], 7, "#d9908a");
    seg(c, [[28, 35], [21, 19]], 1, INK);
    dot(c, 20, 16, 7, "#d9908a");
    c.beginPath();
    c.arc(20, 16, 7, 0, Math.PI * 2);
    c.stroke();
    poly(c, [[14, 13], [14, 21], [8, 20], [5, 24], [6, 17]], "#c9c2b0"); // heavy hooked beak
    dot(c, 18, 14, 1.4, INK);
  },
  // Small, glossy black, a straight pointed beak, a long tail and thin legs.
  crow(c) {
    poly(c, [[22, 38], [4, 52], [8, 44], [2, 46], [20, 46]], "#1b1b22"); // tail
    ell(c, 36, 40, 17, 11, "#1b1b22", -0.2);
    dot(c, 51, 27, 8, "#1b1b22");
    c.beginPath();
    c.arc(51, 27, 8, 0, Math.PI * 2);
    c.stroke();
    poly(c, [[57, 24], [69, 28], [57, 32]], "#5b5b66"); // straight beak
    dot(c, 53, 24, 2, "#f3e6c8");
    dot(c, 53.5, 24, 0.9, INK);
    seg(c, [[26, 36], [40, 44]], 1.6, "#4b5a8a");
    seg(c, [[34, 50], [33, 62], [30, 64]], 2.4);
    seg(c, [[41, 50], [42, 62], [45, 64]], 2.4);
  },
  // Wings of skin with scalloped edges and finger bones, a small furry body, big pointed ears.
  bat(c) {
    const wing = (s: 1 | -1) => {
      const X = (x: number) => 36 + s * (x - 36);
      poly(c, [[X(32), 36], [X(18), 24], [X(3), 24], [X(9), 34], [X(5), 46], [X(15), 40], [X(16), 54], [X(25), 45], [X(33), 52]], "#5a3f78");
      seg(c, [[X(32), 36], [X(3), 24]], 1.5);
      seg(c, [[X(32), 38], [X(9), 34]], 1.2);
      seg(c, [[X(32), 40], [X(15), 40]], 1.2);
      seg(c, [[X(33), 42], [X(25), 45]], 1.2);
    };
    wing(1);
    wing(-1);
    ell(c, 36, 42, 6, 12, "#3b2a4f");
    dot(c, 36, 29, 7, "#3b2a4f");
    c.beginPath();
    c.arc(36, 29, 7, 0, Math.PI * 2);
    c.stroke();
    poly(c, [[30, 27], [30, 14], [36, 23]], "#3b2a4f"); // ears
    poly(c, [[42, 27], [42, 14], [36, 23]], "#3b2a4f");
    dot(c, 33.5, 29, 1.5, "#f2b94b");
    dot(c, 38.5, 29, 1.5, "#f2b94b");
  },
  // A big dark body with a pale tail plume, a very long bare neck, a small head and two long legs.
  ostrich(c) {
    ell(c, 30, 40, 18, 13, "#2d2a35", -0.1);
    ell(c, 14, 36, 8, 10, "#f3e6c8", 0.4); // plume
    seg(c, [[42, 34], [49, 12]], 6, "#d9a89a");
    seg(c, [[42, 34], [49, 12]], 1, INK);
    dot(c, 50, 9, 5, "#d9a89a");
    c.beginPath();
    c.arc(50, 9, 5, 0, Math.PI * 2);
    c.stroke();
    poly(c, [[54, 8], [61, 10], [54, 12]], "#f2b94b");
    dot(c, 50.5, 7.5, 1.2, INK);
    seg(c, [[27, 52], [26, 66], [20, 68]], 3.4, "#d9a89a");
    seg(c, [[36, 52], [37, 66], [43, 68]], 3.4, "#d9a89a");
  },
  // Long green body, a head with feelers, a big bent hind leg and a folded wing along the back.
  locust(c) {
    ell(c, 34, 40, 22, 6.5, "#6c9a2e", -0.05);
    ell(c, 32, 35, 18, 3.4, "#a9c25a", -0.05);
    dot(c, 58, 36, 7, "#6c9a2e");
    c.beginPath();
    c.arc(58, 36, 7, 0, Math.PI * 2);
    c.stroke();
    dot(c, 61, 33, 2.2, "#f3e6c8");
    dot(c, 61.5, 33, 1, INK);
    seg(c, [[62, 30], [68, 18]], 1.4);
    seg(c, [[60, 29], [63, 16]], 1.4);
    seg(c, [[28, 42], [15, 24], [8, 54]], 3.6, "#4f7a22"); // big bent hind leg
    seg(c, [[8, 54], [4, 58]], 2.4, "#4f7a22");
    seg(c, [[40, 45], [38, 58]], 2, INK);
    seg(c, [[48, 44], [50, 58]], 2, INK);
  },
  // A round striped body, a fuzzy thorax, a small head, clear wings and a sting.
  bee(c) {
    c.save();
    ell(c, 30, 42, 16, 12, "#f2b94b");
    c.beginPath();
    c.ellipse(30, 42, 16, 12, 0, 0, Math.PI * 2);
    c.clip();
    for (const x of [24, 32, 40]) {
      c.fillStyle = "#2a1a12";
      c.fillRect(x - 3, 28, 5, 28);
    }
    c.restore();
    c.beginPath();
    c.ellipse(30, 42, 16, 12, 0, 0, Math.PI * 2);
    c.stroke();
    poly(c, [[14, 42], [7, 44], [14, 46]], "#2a1a12");
    ell(c, 48, 38, 8, 8, "#c98a2a");
    dot(c, 58, 36, 5, "#2a1a12");
    c.save();
    c.globalAlpha = 0.8;
    ell(c, 40, 24, 14, 6.5, "#e8f4ff", -0.45);
    ell(c, 28, 26, 12, 6, "#e8f4ff", 0.3);
    c.restore();
    seg(c, [[40, 47], [42, 58]], 1.6);
    seg(c, [[28, 52], [28, 60]], 1.6);
    seg(c, [[60, 32], [66, 24]], 1.3);
  },
  // Seen from above: a dark body, a head with two big red eyes, two clear veined wings and six legs.
  fly(c) {
    for (const s of [-1, 1]) {
      const X = (x: number) => 36 + s * (x - 36);
      seg(c, [[X(33), 38], [X(20), 32], [X(14), 36]], 1.6);
      seg(c, [[X(33), 42], [X(18), 46], [X(12), 52]], 1.6);
      seg(c, [[X(34), 48], [X(24), 60], [X(22), 66]], 1.6);
    }
    c.save();
    c.globalAlpha = 0.75;
    ell(c, 18, 46, 17, 7, "#dfe9f0", -0.55);
    ell(c, 54, 46, 17, 7, "#dfe9f0", 0.55);
    c.restore();
    seg(c, [[28, 52], [10, 38]], 1, "#8a9aa8");
    seg(c, [[44, 52], [62, 38]], 1, "#8a9aa8");
    ell(c, 36, 46, 8, 14, "#2d3138");
    dot(c, 36, 28, 6, "#2d3138");
    c.beginPath();
    c.arc(36, 28, 6, 0, Math.PI * 2);
    c.stroke();
    dot(c, 31, 26, 4.2, "#c03a2e");
    dot(c, 41, 26, 4.2, "#c03a2e");
    seg(c, [[34, 22], [32, 15]], 1.2);
    seg(c, [[38, 22], [40, 15]], 1.2);
  },
};

/** How a card is framed: a plain card, or a small scroll (a body with a rolled end at the top and at the bottom). */
export type CardFrame = "card" | "scroll";
function drawCard(c: Ctx, r: Rect, face: (c: Ctx) => void, mark: "none" | "chosen" | "done", frame: CardFrame): void {
  c.save();
  c.translate(r.x, r.y);
  if (frame === "card") {
    rounded(c, 0, 0, r.w, r.h, 9);
    c.fillStyle = PAL.cream;
    c.fill();
    c.lineWidth = 3;
    c.strokeStyle = PAL.woodDark;
    c.stroke();
    c.save();
    rounded(c, 1, 1, r.w - 2, r.h - 2, 8);
    c.clip();
  } else {
    // The body of the scroll, and a roll at each end (the rolls are a little wider than the body).
    c.lineWidth = 3;
    c.strokeStyle = PAL.woodDark;
    rounded(c, 5, 6, r.w - 10, r.h - 12, 3);
    c.fillStyle = PAL.cream;
    c.fill();
    c.stroke();
    for (const y of [0, r.h - 12]) {
      rounded(c, 0, y, r.w, 12, 6);
      c.fillStyle = PAL.goldLight;
      c.fill();
      c.stroke();
    }
    c.save();
    rounded(c, 6, 13, r.w - 12, r.h - 26, 2);
    c.clip();
  }
  c.strokeStyle = INK;
  c.lineWidth = 2;
  face(c);
  c.restore();
  if (mark !== "none") {
    rounded(c, -4, -4, r.w + 8, r.h + 8, 12);
    c.lineWidth = mark === "chosen" ? 6 : 3;
    c.strokeStyle = mark === "chosen" ? PAL.gold : PAL.goldLight;
    c.stroke();
  }
  c.restore();
}

/** What a page of cards and trays is drawn with: the mark on each tray's header, what is on each card, how a card is framed. The animal cards of al-Jahiz are the first skin; the shelves of coffee are another (art/coffee.ts). */
export interface SortSkin {
  /** The mark of the tray with number `g` (from 0) on its mat `t`: its dots, and whatever else tells it from the others by shape. */
  trayMark(c: Ctx, t: Rect, g: number, rtl: boolean): void;
  /** What is drawn on a card, in a 72 by 72 box. */
  face(item: string): (c: Ctx) => void;
  frame: CardFrame;
  /** A board of wood along the foot of each tray, so that the trays read as shelves. */
  board?: boolean;
}
/** Dots for a tray's number: one for the first, two for the second and so on, centred on `cx` (the middle of the tray by default). On a right to left page the dots are laid from the right. */
export function trayDots(c: Ctx, t: Rect, g: number, rtl: boolean, cx = t.x + t.w / 2): void {
  c.fillStyle = PAL.goldLight;
  const across = (g + 1) * 16 - 6;
  for (let d = 0; d <= g; d++) {
    c.beginPath();
    c.arc(cx - across / 2 + 5 + (rtl ? g - d : d) * 16, t.y + 17, 5, 0, Math.PI * 2);
    c.fill();
  }
}
const ANIMALS: SortSkin = {
  trayMark: (c, t, g, rtl) => trayDots(c, t, g, rtl),
  face: (item) => CREATURES[item] ?? (() => undefined),
  frame: "card",
};

export function sortCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = SORT_ART.w * scale;
  canvas.height = SORT_ART.h * scale;
  return canvas;
}
export function drawSort(canvas: HTMLCanvasElement, v: SortView, skin: SortSkin = ANIMALS): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h } = SORT_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  // The trays: a darker mat, a gold rim, and the mark of the tray's number (and, for the shelves of coffee, a sign).
  trayRects(v.groups, v.rtl).forEach((t, g) => {
    rounded(c, t.x, t.y, t.w, t.h, 14);
    c.fillStyle = "#0e3c46";
    c.fill();
    c.lineWidth = 3;
    c.strokeStyle = PAL.gold;
    c.stroke();
    if (skin.board) {
      rounded(c, t.x + 6, t.y + t.h - 14, t.w - 12, 10, 4);
      c.fillStyle = PAL.woodDark;
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = PAL.gold;
      c.stroke();
    }
    c.save();
    skin.trayMark(c, t, g, v.rtl);
    c.restore();
  });
  // The band along the bottom, where cards not yet placed lie.
  const band = restBand(v.rtl);
  c.save();
  c.setLineDash([10, 8]);
  c.lineWidth = 2;
  c.strokeStyle = "rgba(255,255,255,0.35)";
  rounded(c, band.x, band.y, band.w, band.h, 14);
  c.stroke();
  c.restore();
  cardRects(v).forEach((r, i) => drawCard(c, r, skin.face(v.items[i]!), v.selected === i ? "chosen" : v.done ? "done" : "none", skin.frame));
}
