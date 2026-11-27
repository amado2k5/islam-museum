// Ibn Battuta's thread, drawn in code: beads set round a ring, each with a small plain sign and a few dots that tell it
// from the others, and the thread drawn from bead to bead as it grows. A trial picture, replaceable like every picture in
// this game; it carries no words and no numerals (the beads are numbered by dots), so that the page's own text, in seven
// languages, says everything it shows.
//
// It is NOT a map. The beads sit on a ring in an order that is never the road's, no direction is drawn, no distance is
// meant, and nothing here draws a coast, a compass, a place or a scale. The thread's straight lines cross the ring
// wherever the road happens to jump, and mean nothing but "next".
import { INK, PAL } from "./kit";

type Ctx = CanvasRenderingContext2D;
/** The picture's own space: the ring's centre and radius, and the bead's radius, all in the 1000 by 480 picture. */
export const ROUTE_ART = { w: 1000, h: 480, cx: 500, cy: 250, ring: 160, bead: 38 } as const;

export interface RouteView {
  /** The beads' stops in the ring's own order. */
  stops: string[];
  /** The thread's stops so far, in the order they were threaded. */
  thread: string[];
  /** The bead of the last slip, or null. */
  wrong: string | null;
  /** The page reads right to left: the ring is mirrored, as the list of beads under the picture is not (it stays in the ring's order). */
  rtl: boolean;
}

/** The middle of bead `i` of `n` in the picture's own space: the first at the top, the rest clockwise, mirrored on a page that reads right to left. */
export function beadPos(n: number, i: number, rtl: boolean): { x: number; y: number } {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
  const x = ROUTE_ART.cx + ROUTE_ART.ring * Math.cos(a);
  return { x: rtl ? ROUTE_ART.w - x : x, y: ROUTE_ART.cy + ROUTE_ART.ring * Math.sin(a) };
}
/** What lies under a point of the picture, given in its own 1000 by 480 space: the index of a bead, or null. */
export function routeHit(x: number, y: number, n: number, rtl: boolean): number | null {
  for (let i = 0; i < n; i++) {
    const p = beadPos(n, i, rtl);
    if (Math.hypot(x - p.x, y - p.y) <= ROUTE_ART.bead) return i;
  }
  return null;
}

const circle = (c: Ctx, x: number, y: number, r: number): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
};
const poly = (c: Ctx, pts: [number, number][]): void => {
  c.beginPath();
  pts.forEach(([x, y], k) => (k === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
  c.closePath();
};
const ngon = (n: number, r: number, turn: number): [number, number][] => Array.from({ length: n }, (_, k) => [r * Math.cos(turn + (2 * Math.PI * k) / n), r * Math.sin(turn + (2 * Math.PI * k) / n)]);
const star = (r: number): [number, number][] => Array.from({ length: 10 }, (_, k) => [(k % 2 ? r * 0.45 : r) * Math.cos(-Math.PI / 2 + (Math.PI * k) / 5), (k % 2 ? r * 0.45 : r) * Math.sin(-Math.PI / 2 + (Math.PI * k) / 5)]);

/** Nine plain signs, one for each place in the ring, drawn about (0, 0), 15 units from the middle: told apart by shape alone. */
export const SIGNS = ["disc", "square", "triangle", "diamond", "cross", "star", "hexagon", "crescent", "donut"] as const;
const SIGN: Record<(typeof SIGNS)[number], (c: Ctx) => void> = {
  disc: (c) => circle(c, 0, 0, 14),
  square: (c) => poly(c, [[-13, -13], [13, -13], [13, 13], [-13, 13]]),
  triangle: (c) => poly(c, [[0, -16], [16, 12], [-16, 12]]),
  diamond: (c) => poly(c, [[0, -18], [14, 0], [0, 18], [-14, 0]]),
  cross: (c) => poly(c, [[-5, -16], [5, -16], [5, -5], [16, -5], [16, 5], [5, 5], [5, 16], [-5, 16], [-5, 5], [-16, 5], [-16, -5], [-5, -5]]),
  star: (c) => poly(c, star(17)),
  hexagon: (c) => poly(c, ngon(6, 16, 0)),
  crescent: (c) => {
    c.beginPath();
    c.arc(0, 0, 15, Math.PI * 0.35, Math.PI * 1.65, false);
    c.arc(6, 0, 12, Math.PI * 1.55, Math.PI * 0.45, true);
    c.closePath();
  },
  donut: (c) => {
    c.beginPath();
    c.arc(0, 0, 15, 0, Math.PI * 2, false);
    c.arc(0, 0, 7, 0, Math.PI * 2, true);
  },
};

/** Traces the sign of the bead at place `i` of the ring about (0, 0), ready to fill: the same sign this picture draws for that
 * place. Shared with Ibn Battuta's inn (art/battuta.ts), so that a bead looks the same on the page and in the room. */
export function traceSign(c: Ctx, i: number): void {
  SIGN[SIGNS[i % SIGNS.length]!](c);
}

/** Makes a canvas for the picture, sharp on the screen it is on. */
export function routeCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = ROUTE_ART.w * scale;
  canvas.height = ROUTE_ART.h * scale;
  return canvas;
}

export function drawRoute(canvas: HTMLCanvasElement, v: RouteView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, cx, cy, ring, bead } = ROUTE_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  const n = v.stops.length;
  const pos = (id: string) => beadPos(n, v.stops.indexOf(id), v.rtl);
  // The ring the beads sit on: a dashed circle, the same all round, so that it says no way from one bead to the next.
  c.strokeStyle = "rgba(255,227,154,0.3)";
  c.lineWidth = 5;
  c.setLineDash([3, 15]);
  circle(c, v.rtl ? w - cx : cx, cy, ring);
  c.stroke();
  c.setLineDash([]);
  // The thread, from bead to bead, in the order it was threaded: a dark line under a gold one.
  for (const [width, colour] of [[11, INK], [6, PAL.goldLight]] as const) {
    c.strokeStyle = colour;
    c.lineWidth = width;
    for (let k = 0; k + 1 < v.thread.length; k++) {
      const a = pos(v.thread[k]!);
      const b = pos(v.thread[k + 1]!);
      c.beginPath();
      c.moveTo(a.x, a.y);
      c.lineTo(b.x, b.y);
      c.stroke();
    }
  }
  const last = v.thread.length > 0 ? v.thread[v.thread.length - 1]! : null;
  v.stops.forEach((id, i) => {
    const p = pos(id);
    const on = v.thread.includes(id);
    // The bead reached last is marked by a ring and eight rays as well as by colour; a bead on the thread has a heavy outline.
    if (id === last) {
      c.strokeStyle = PAL.cream;
      c.lineWidth = 6;
      circle(c, p.x, p.y, bead + 9);
      c.stroke();
      for (let k = 0; k < 8; k++) {
        const a = (Math.PI * 2 * k) / 8;
        c.beginPath();
        c.moveTo(p.x + Math.cos(a) * (bead + 16), p.y + Math.sin(a) * (bead + 16));
        c.lineTo(p.x + Math.cos(a) * (bead + 28), p.y + Math.sin(a) * (bead + 28));
        c.stroke();
      }
    }
    circle(c, p.x, p.y, bead);
    c.fillStyle = on ? PAL.gold : PAL.deep;
    c.fill();
    c.strokeStyle = on ? INK : PAL.tealLight;
    c.lineWidth = on ? 6 : 2.5;
    c.stroke();
    // The last slip: a broken red outline, so that it is not colour alone.
    if (v.wrong === id) {
      c.strokeStyle = "#ff8f84";
      c.lineWidth = 5;
      c.setLineDash([10, 7]);
      circle(c, p.x, p.y, bead + 5);
      c.stroke();
      c.setLineDash([]);
    }
    c.save();
    c.translate(p.x, p.y);
    traceSign(c, i);
    c.fillStyle = on ? INK : PAL.cream;
    c.fill("evenodd");
    c.restore();
    // The bead's number, as dots set outside it, away from the middle of the ring: no numeral is drawn, so that no language is left out.
    const away = Math.atan2(p.y - cy, p.x - (v.rtl ? w - cx : cx));
    const ox = p.x + Math.cos(away) * (bead + 18);
    const oy = p.y + Math.sin(away) * (bead + 18);
    const rows = [Math.min(i + 1, 5), Math.max(i + 1 - 5, 0)];
    rows.forEach((count, row) => {
      for (let d = 0; d < count; d++) {
        circle(c, ox + (d - (count - 1) / 2) * 12, oy + (row === 0 ? 0 : (Math.sin(away) >= 0 ? 12 : -12)), 4);
        c.fillStyle = PAL.cream;
        c.fill();
      }
    });
  });
}
