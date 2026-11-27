// Al-Tusi and the two circles as a quest: a small circle is carried round inside a large one, a point rides on the small
// circle, and the player sets how the small circle turns. The path the point traces is worked out here and then measured:
// nothing in this file knows the answer by name, and `shape` classifies from the traced points alone, so that a setting
// that gives a straight line is found by measuring and not by a formula (review ledger, HR-HH-32 to HR-HH-34).
//
// The rules, in one place. The large circle has radius 1 and turns through an angle `theta` from 0 to a whole turn. It
// carries the centre of the small circle (radius `r`) round at distance `1 - r` from the middle. The small circle turns
// relative to the large one by `d * k * theta`, where `k` is its speed (1, 2 or 3 times the large one's) and `d` is +1
// (the same way) or -1 (the opposite way). The point on the small circle starts on the large circle's rim, so that
//   P(theta) = (1 - r) (cos theta, sin theta) + r (cos((1 + d k) theta), sin((1 + d k) theta)).
// Pure and deterministic: no clock, no randomness, nothing here draws.
export type CoupleStyle = "story" | "explorer" | "challenge";
export type Dir = 1 | -1;
export type Pt = [number, number];

/** How the small circle turns: its size against the large one's, its speed, and its direction. */
export interface Setting {
  r: number;
  k: number;
  d: Dir;
}
/** The sizes, speeds and directions a way of playing lets the player choose from; the first of each is where the choice starts. */
export interface Offer {
  sizes: number[];
  speeds: number[];
  dirs: Dir[];
}
export const SIZES = [1 / 3, 1 / 2, 2 / 3] as const;
export const SPEEDS = [1, 2, 3] as const;
export const DIRS: readonly Dir[] = [1, -1];

export const COUPLE_FLAGS = ["askedWhy", "askedObs", "kind", "feather", "answered"] as const;
export type CoupleFlag = (typeof COUPLE_FLAGS)[number];
export type CoupleField = "size" | "speed" | "dir";

/** What measuring a path says. `lobes` is the number of times the path swings out and in from its middle (0 for a line or a circle). */
export interface Shape {
  kind: "line" | "circle" | "oval" | "loops";
  lobes: number;
  /** How many times the path crosses itself. */
  crossings: number;
}
export type CoupleCommand = { type: "set"; field: CoupleField; value: number } | { type: "turn" } | { type: "flag"; flag: CoupleFlag };
export interface CoupleState {
  style: CoupleStyle;
  offer: Offer;
  /** What the small circle is set to now. */
  setting: Setting;
  /** Turnings that did not give a straight line. */
  misses: number;
  /** Every turning, the one that found the line included. */
  turned: number;
  /** The last turning: what it was set to and what its path measured. Null before the first, and once a control is changed. */
  last: { setting: Setting; shape: Shape } | null;
  flags: CoupleFlag[];
  done: boolean;
}

/** Turnings that are not a straight line allowed for the Ingenuity goal. Story has no count. */
export const COUPLE_SLACK: Record<CoupleStyle, number | null> = { story: null, explorer: 2, challenge: 4 };

/** The point on the small circle when the large one has turned through `theta`. */
export function point(s: Setting, theta: number): Pt {
  const f = 1 + s.d * s.k;
  return [(1 - s.r) * Math.cos(theta) + s.r * Math.cos(f * theta), (1 - s.r) * Math.sin(theta) + s.r * Math.sin(f * theta)];
}
/** `n` points of the path over one whole turn of the large circle, the first at the start. */
export function trace(s: Setting, n: number): Pt[] {
  return Array.from({ length: n }, (_, i) => point(s, (2 * Math.PI * i) / n));
}

// Tolerances for measuring, as fractions of the path's own size: a path is a line when it lies within LINE_TOL of one
// straight segment, a circle when its distance from its middle varies by less than CIRCLE_TOL, and a swing out or in is
// counted when it is larger than SWING_TOL. They are far from every setting offered, which the tests show.
const LINE_TOL = 0.005;
const CIRCLE_TOL = 0.01;
const SWING_TOL = 0.02;

const orient = (a: Pt, b: Pt, c: Pt): number => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
/** Whether two segments cross in a point that is an end of neither. */
function cross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const o1 = orient(a, b, c);
  const o2 = orient(a, b, d);
  const o3 = orient(c, d, a);
  const o4 = orient(c, d, b);
  return o1 * o2 < 0 && o3 * o4 < 0;
}

/** Measures a closed path and says what shape it is, from the points alone. */
export function classify(pts: Pt[]): Shape {
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p[0], 0) / n;
  const my = pts.reduce((a, p) => a + p[1], 0) / n;
  // A line: every point within a small distance of one straight segment (the best-fit one, found from the spread of the points).
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const p of pts) {
    sxx += (p[0] - mx) ** 2;
    sxy += (p[0] - mx) * (p[1] - my);
    syy += (p[1] - my) ** 2;
  }
  const a = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const off = Math.max(...pts.map((p) => Math.abs(-(p[0] - mx) * Math.sin(a) + (p[1] - my) * Math.cos(a))));
  const radii = pts.map((p) => Math.hypot(p[0] - mx, p[1] - my));
  const biggest = Math.max(...radii);
  if (off <= LINE_TOL * biggest * 2) return { kind: "line", lobes: 0, crossings: 0 };
  const mean = radii.reduce((s, x) => s + x, 0) / n;
  if (Math.max(...radii) - Math.min(...radii) <= CIRCLE_TOL * mean) return { kind: "circle", lobes: 0, crossings: 0 };
  // Lobes: walk the distance from the middle round the path from its nearest point, counting each swing out and back
  // in that is larger than the tolerance (a hysteresis, so that rounding in the points cannot make a lobe).
  const eps = SWING_TOL * biggest;
  const from = radii.indexOf(Math.min(...radii));
  let rising = true;
  let hi = radii[from]!;
  let lo = radii[from]!;
  let lobes = 0;
  for (let i = 1; i <= n; i++) {
    const v = radii[(from + i) % n]!;
    if (rising) {
      if (v > hi) hi = v;
      else if (hi - v > eps) {
        lobes++;
        rising = false;
        lo = v;
      }
    } else if (v < lo) lo = v;
    else if (v - lo > eps) {
      rising = true;
      hi = v;
    }
  }
  let crossings = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // neighbours round the closed path
      if (cross(pts[i]!, pts[(i + 1) % n]!, pts[j]!, pts[(j + 1) % n]!)) crossings++;
    }
  }
  return { kind: lobes === 2 && crossings === 0 ? "oval" : "loops", lobes, crossings };
}
/** What the path of a setting is, by tracing it and measuring it. */
export const shape = (s: Setting, n = 360): Shape => classify(trace(s, n));
export const isLine = (s: Setting, n = 360): boolean => shape(s, n).kind === "line";

/** Every setting a way of playing offers, in the order of sizes, then speeds, then directions. */
export function settingsOf(o: Offer): Setting[] {
  return o.sizes.flatMap((r) => o.speeds.flatMap((k) => o.dirs.map((d) => ({ r, k, d }))));
}
const offers = (o: Offer, s: Setting): boolean => o.sizes.includes(s.r) && o.speeds.includes(s.k) && o.dirs.includes(s.d);

/** Where the choices start: the first of each offered. Never a setting that gives a line, which the tests prove. */
export const startSetting = (o: Offer): Setting => ({ r: o.sizes[0]!, k: o.speeds[0]!, d: o.dirs[0]! });

export function checkOffer(o: Offer): string | null {
  if (o.sizes.length === 0 || o.speeds.length === 0 || o.dirs.length === 0) return "a choice with nothing to choose";
  if (o.sizes.some((r) => !(SIZES as readonly number[]).includes(r))) return "a size that is not one of the three";
  if (o.speeds.some((k) => !(SPEEDS as readonly number[]).includes(k))) return "a speed that is not 1, 2 or 3";
  if (o.dirs.some((d) => d !== 1 && d !== -1)) return "a direction that is not the same way or the opposite";
  for (const l of [o.sizes, o.speeds, o.dirs] as unknown[][]) if (new Set(l).size !== l.length) return "a choice offered twice";
  if (!settingsOf(o).some((s) => isLine(s))) return "no setting that gives a straight line";
  return null;
}

export function newCouple(style: CoupleStyle, offer: Offer): CoupleState {
  const bad = checkOffer(offer);
  if (bad) throw new Error(`the ${style} choices cannot be played: ${bad}`);
  return { style, offer, setting: startSetting(offer), misses: 0, turned: 0, last: null, flags: [], done: false };
}

/**
 * A control is changed to a value the way of playing offers (anything else changes nothing). The picture then shows the
 * new circles at their start with no path, so that a path is never shown beside circles that did not draw it.
 */
export function setControl(s: CoupleState, field: CoupleField, value: number): CoupleState {
  if (s.done) return s;
  const key = field === "size" ? "r" : field === "speed" ? "k" : "d";
  const list = (field === "size" ? s.offer.sizes : field === "speed" ? s.offer.speeds : s.offer.dirs) as number[];
  if (!list.includes(value) || s.setting[key] === value) return s;
  return { ...s, setting: { ...s.setting, [key]: value } as Setting, last: null };
}

/** The circles are turned: the path is traced and measured. A straight line ends the quest; any other shape is counted. */
export function turn(s: CoupleState): CoupleState {
  if (s.done) return s;
  const sh = shape(s.setting);
  const line = sh.kind === "line";
  return { ...s, turned: s.turned + 1, misses: s.misses + (line ? 0 : 1), last: { setting: s.setting, shape: sh }, done: line };
}

export function applyCouple(s: CoupleState, c: CoupleCommand): CoupleState {
  if (s.done) return s;
  if (c.type === "set") return setControl(s, c.field, c.value);
  if (c.type === "turn") return turn(s);
  return !(COUPLE_FLAGS as readonly string[]).includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
}

/** The four goals, in the shape every quest's record has. `turns` is every turning made. */
export interface CoupleGoals {
  turns: number;
  curiosity: boolean;
  ingenuity: boolean;
  kindness: boolean;
  feather: boolean;
}
export function coupleGoals(s: CoupleState, slack: number | null): CoupleGoals {
  const has = (f: CoupleFlag) => s.flags.includes(f);
  return { turns: s.turned, curiosity: has("askedWhy") && has("askedObs"), ingenuity: slack === null || s.misses <= slack, kindness: has("kind"), feather: has("feather") };
}

/** What is kept of a quest in progress: what the circles are set to, the counts, and the flags. Nothing that cannot be checked. */
export interface CoupleSnapshot {
  style: CoupleStyle;
  /** The size as an index into SIZES, the speed as 1, 2 or 3, and the direction as 1 or -1. */
  size: number;
  speed: number;
  dir: number;
  misses: number;
  turned: number;
  flags: CoupleFlag[];
}
export function snapshotCouple(s: CoupleState): CoupleSnapshot {
  return { style: s.style, size: SIZES.indexOf(s.setting.r as (typeof SIZES)[number]), speed: s.setting.k, dir: s.setting.d, misses: s.misses, turned: s.turned, flags: [...s.flags] };
}

/**
 * A quest put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * choices are built afresh for the way of playing (`offerOf`) and the saved setting must be one it offers; the counts
 * are whole numbers, not negative, with no more misses than turnings; unknown flags are dropped. The quest never comes
 * back finished or with a path: a saved setting that is the answer comes back set and not yet turned.
 */
export function restoreCouple(x: unknown, offerOf: (style: CoupleStyle) => Offer): CoupleState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newCouple(o.style, offerOf(o.style));
  const whole = (n: unknown, max: number): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= max;
  if (!whole(o.size, SIZES.length - 1) || !whole(o.misses, 100000) || !whole(o.turned, 100000)) return null;
  if (typeof o.speed !== "number" || (o.dir !== 1 && o.dir !== -1)) return null;
  if (o.misses > o.turned) return null;
  if (!Array.isArray(o.flags)) return null;
  const setting: Setting = { r: SIZES[o.size]!, k: o.speed, d: o.dir };
  if (!offers(base.offer, setting)) return null;
  const flags = COUPLE_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, setting, misses: o.misses, turned: o.turned, flags: [...flags] };
}
