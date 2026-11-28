// How the explorer follows the bird, and how a room's movement waits for keys let go: two small rules shared by every
// room on the room engine (scenes/room.ts), kept here as plain functions so that they can be tested without a canvas.
//
// Why. The explorer walks along the floor about 96 game pixels behind the bird. Before 27 November 2026 that was all,
// so it could stop in front of a room's figure and hide part of it (the lead agent saw it in al-Idrisi's hall during
// play, test plan D48). Now, when the place it would stop at overlaps a person, it stops short of that person instead,
// on the side it is coming from, or steps to the other side when that one is the only clear one; and it never stands
// overlapping a person when the bird is still. Since later the same day the same holds for every thing that can be touched
// and comes down to the explorer's height (the lead agent saw it stop in front of the coffee room's bottom shelf and hide
// its sign): the frame drawn round such a thing is kept clear as a person is. And a room entered with a direction key still held (walking through the
// last room's door) used to carry the bird and the explorer straight on; now a room's movement starts only once every
// movement key has been let go (the rule chosen over a timed settle: it does not depend on how long the key is held).
import { EXPLORER, drawnBox, type Figure } from "../content/people";
import type { Intent } from "./move";

/** A person standing in a room: where its box stands on the floor, and its figure (content/people.ts). */
export interface Standing {
  x: number;
  figure: Figure;
}

/** How far behind the bird the explorer walks, how near its goal it stops, and how fast it walks (game pixels, seconds). */
export const FOLLOW = { behind: 96, slack: 50, speed: 230, margin: 6, left: 80, right: 90 } as const;

/** The explorer's drawn reach to either side of its feet, either way round (it turns to face the bird). */
const EXPLORER_SPAN = (() => {
  const b = drawnBox(EXPLORER, 0, 0, "either");
  return { left: b.left, right: b.right };
})();
/** A person's drawn reach to either side of its feet, either way round (the figures turn to the bird). Worked out once a figure. */
const spans = new WeakMap<Figure, { left: number; right: number }>();
const spanOf = (f: Figure): { left: number; right: number } => {
  let s = spans.get(f);
  if (!s) {
    const b = drawnBox(f, 0, 0, "either");
    s = { left: b.left, right: b.right };
    spans.set(f, s);
  }
  return s;
};

/**
 * A thing that can be touched, as the explorer keeps clear of it: the frame the rooms draw round a thing within reach (80
 * by 92 game pixels about the thing, a little lower; art/coffee-room.ts focusArt), whatever the thing's own picture.
 */
export const THING_FRAME = { half: 40, up: 40, down: 52 } as const;
/** A touchable thing of a room, where it is (content: each room's things). */
export interface Spot {
  x: number;
  y: number;
}
/** The explorer's drawn height above the floor and below it (it is drawn 8 pixels lower than its box's floor). */
const EXPLORER_HEIGHT = (() => {
  const b = drawnBox(EXPLORER, 0, 0, "either");
  return { top: b.top, bottom: b.bottom + 8 };
})();

/**
 * The stretches of floor where the explorer, standing there, would overlap someone or something (with a few pixels to
 * spare), joined where they meet and in order: every person's drawn width, and the frame of every touchable thing that
 * comes down to the explorer's height (a thing high on a shelf is over its head). A thing inside a person's drawn box is
 * that person (the figure's own touch point), and is kept clear of as the person. Each stretch is open at both ends: the
 * explorer may stand at an end.
 */
export function blocked(people: readonly Standing[], things: readonly Spot[] = [], floor = 0): [number, number][] {
  const out: [number, number][] = [];
  const boxes = people.map((p) => ({ p, s: spanOf(p.figure), box: drawnBox(p.figure, p.x, floor, "either") }));
  for (const { p, s } of boxes) out.push([p.x + s.left - EXPLORER_SPAN.right - FOLLOW.margin, p.x + s.right - EXPLORER_SPAN.left + FOLLOW.margin]);
  for (const t of things) {
    if (boxes.some(({ box }) => t.x >= box.left && t.x <= box.right && t.y >= box.top && t.y <= box.bottom)) continue;
    if (t.y + THING_FRAME.down <= floor + EXPLORER_HEIGHT.top || t.y - THING_FRAME.up >= floor + EXPLORER_HEIGHT.bottom) continue;
    out.push([t.x - THING_FRAME.half - EXPLORER_SPAN.right - FOLLOW.margin, t.x + THING_FRAME.half - EXPLORER_SPAN.left + FOLLOW.margin]);
  }
  out.sort((a, b) => a[0] - b[0]);
  const joined: [number, number][] = [];
  for (const [lo, hi] of out) {
    const last = joined[joined.length - 1];
    if (last && lo < last[1]) last[1] = Math.max(last[1], hi);
    else joined.push([lo, hi]);
  }
  return joined;
}
/** The stretch the explorer, standing at x, would be in the way in, or undefined. */
const stretchAt = (x: number, ways: readonly [number, number][]): [number, number] | undefined => ways.find(([lo, hi]) => x > lo && x < hi);

/** Whether the explorer, standing at x, overlaps any person (with a few pixels to spare). */
export function overlapsPerson(x: number, people: readonly Standing[]): boolean {
  return stretchAt(x, blocked(people)) !== undefined;
}
/** Whether the explorer, standing at x, overlaps any person or any touchable thing at its height. */
export function inTheWay(x: number, people: readonly Standing[], things: readonly Spot[] = [], floor = 0): boolean {
  return stretchAt(x, blocked(people, things, floor)) !== undefined;
}

/**
 * Where the explorer walks to: about 96 pixels behind the bird, kept inside the room; but if it would stand overlapping a
 * person or a touchable thing there (since 27 November 2026 a thing too: the lead agent saw the explorer stop in front of
 * the coffee room's bottom shelf and hide its sign), just short of what is in the way on the side the explorer is coming
 * from, or, if that side is outside the room, just past it on the other side. Things and people that stand close together
 * are one stretch, so the explorer stops before the whole of it or after it, never between two of them.
 */
export function followGoal(bird: { x: number; facing: -1 | 1 }, from: number, people: readonly Standing[], width: number, things: readonly Spot[] = [], floor = 0): number {
  const clamp = (x: number) => Math.min(width - FOLLOW.right, Math.max(FOLLOW.left, x));
  const inside = (x: number) => x >= FOLLOW.left && x <= width - FOLLOW.right;
  const goal = clamp(bird.x - FOLLOW.behind * bird.facing);
  const ways = blocked(people, things, floor);
  const hit = stretchAt(goal, ways);
  if (!hit) return goal;
  const [lo, hi] = hit;
  const before = lo - 1;
  const after = hi + 1;
  const near = from <= (lo + hi) / 2 ? before : after;
  const far = near === before ? after : before;
  return inside(near) ? near : inside(far) ? far : clamp(near);
}

/**
 * One frame of the explorer's walk. It walks to its goal while it is more than 50 pixels from it, and always while it
 * overlaps a person or a touchable thing (even while the world waits for a talk, so that it never stops in front of
 * someone or something). It stops within
 * 50 pixels of its goal otherwise.
 */
export function followStep(x: number, bird: { x: number; facing: -1 | 1 }, people: readonly Standing[], width: number, dt: number, frozen: boolean, things: readonly Spot[] = [], floor = 0): { x: number; walking: boolean; goal: number } {
  const goal = followGoal(bird, x, people, width, things, floor);
  const gap = goal - x;
  const blocking = inTheWay(x, people, things, floor);
  const walking = gap !== 0 && (blocking || (Math.abs(gap) > FOLLOW.slack && !frozen));
  return { x: walking ? x + Math.sign(gap) * Math.min(Math.abs(gap), FOLLOW.speed * dt) : x, walking, goal };
}

/**
 * The movement keys as a room hands them to the bird: nothing at all until every movement key has been let go once since
 * the room began (so that a key still held from the last room's door does not carry the bird on), then the keys as they
 * are. `armed` is whether they have been let go.
 */
export function settleIntent(armed: boolean, intent: Intent): { armed: boolean; intent: Intent } {
  const still = intent.dir === 0 && !intent.jump && !intent.down;
  const now = armed || still;
  return { armed: now, intent: now ? intent : { dir: 0, jump: false, down: false } };
}
