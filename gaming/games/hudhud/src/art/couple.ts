// Al-Tusi's two circles, drawn in code: a large circle, a small circle inside it, a marked point on the small one, and
// after a turning the whole path the point traced, drawn as a clear line. A trial picture, replaceable like every picture
// in this game; it carries no words and no numerals, so that the page's own text, in seven languages, says everything it
// shows.
//
// Nothing in it has a left-to-right order (two circles, a point and a path), so a page that reads right to left does not
// mirror it, and nothing here knows whether the page does. It is flat circles, not the spheres of the record; the page
// says so in its note.
import { INK, PAL } from "./kit";
import type { Pt, Setting } from "../sim/couple";

type Ctx = CanvasRenderingContext2D;
/** The picture's own space: the large circle's middle and radius, in the 1000 by 480 picture. */
export const COUPLE_ART = { w: 1000, h: 480, cx: 500, cy: 240, big: 200 } as const;

export interface CoupleView {
  /** What the small circle is set to, for its size, speed and direction. */
  setting: Setting;
  /** How far the large circle has turned, in radians: 0 at the start, a whole turn at the end. */
  theta: number;
  /** The path to draw, in the rules' own space (the large circle has radius 1), or null. */
  path: Pt[] | null;
  /** Whether the path is a whole turn and so is closed (drawn back to its first point). */
  closed: boolean;
}

/** A point of the rules' space (radius 1, y up) in the picture's space (y down). */
export const toPicture = (p: Pt): Pt => [COUPLE_ART.cx + COUPLE_ART.big * p[0], COUPLE_ART.cy - COUPLE_ART.big * p[1]];

/** Makes a canvas for the picture, sharp on the screen it is on. */
export function coupleCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = COUPLE_ART.w * scale;
  canvas.height = COUPLE_ART.h * scale;
  return canvas;
}

const circle = (c: Ctx, x: number, y: number, r: number): void => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
};

export function drawCouple(canvas: HTMLCanvasElement, v: CoupleView): void {
  const c = canvas.getContext("2d");
  if (!c) return;
  const { w, h, cx, cy, big } = COUPLE_ART;
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, PAL.tealDark);
  wall.addColorStop(1, PAL.night);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  const { r, k, d } = v.setting;
  // The large circle, a heavy cream line round a dark disc, with a small ring at its middle.
  circle(c, cx, cy, big);
  c.fillStyle = "rgba(10,26,54,0.55)";
  c.fill();
  c.strokeStyle = PAL.cream;
  c.lineWidth = 7;
  c.stroke();
  circle(c, cx, cy, 7);
  c.fillStyle = PAL.cream;
  c.fill();
  // The small circle, carried round at distance (1 - r) from the middle; the arm from the middle to its centre is dashed.
  const centre = toPicture([(1 - r) * Math.cos(v.theta), (1 - r) * Math.sin(v.theta)]);
  c.strokeStyle = "rgba(243,230,200,0.55)";
  c.lineWidth = 4;
  c.setLineDash([10, 9]);
  c.beginPath();
  c.moveTo(cx, cy);
  c.lineTo(centre[0], centre[1]);
  c.stroke();
  c.setLineDash([]);
  circle(c, centre[0], centre[1], r * big);
  c.fillStyle = "rgba(29,111,120,0.55)";
  c.fill();
  c.strokeStyle = PAL.goldLight;
  c.lineWidth = 6;
  c.stroke();
  // The path the point traced, a dark line under a gold one, so that it reads on any ground.
  if (v.path && v.path.length > 1) {
    for (const [width, colour] of [[13, INK], [7, PAL.gold]] as const) {
      c.strokeStyle = colour;
      c.lineWidth = width;
      c.beginPath();
      v.path.forEach((p, i) => {
        const q = toPicture(p);
        if (i === 0) c.moveTo(q[0], q[1]);
        else c.lineTo(q[0], q[1]);
      });
      if (v.closed) c.closePath();
      c.stroke();
    }
  }
  // The marked point, on the small circle: a spoke from its centre, then a star set in a ring, so that it is marked by
  // shape as well as by colour.
  const f = 1 + d * k;
  const spot = toPicture([(1 - r) * Math.cos(v.theta) + r * Math.cos(f * v.theta), (1 - r) * Math.sin(v.theta) + r * Math.sin(f * v.theta)]);
  c.strokeStyle = PAL.goldLight;
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(centre[0], centre[1]);
  c.lineTo(spot[0], spot[1]);
  c.stroke();
  circle(c, spot[0], spot[1], 20);
  c.fillStyle = INK;
  c.fill();
  c.strokeStyle = PAL.cream;
  c.lineWidth = 4;
  c.stroke();
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / 5;
    const rad = i % 2 ? 6 : 15;
    const x = spot[0] + rad * Math.cos(a);
    const y = spot[1] + rad * Math.sin(a);
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
  c.fillStyle = PAL.gold;
  c.fill();
}
