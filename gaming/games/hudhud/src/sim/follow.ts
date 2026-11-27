// How the explorer follows the bird, and how a room's movement waits for keys let go: two small rules shared by every
// room on the room engine (scenes/room.ts), kept here as plain functions so that they can be tested without a canvas.
//
// Why. The explorer walks along the floor about 96 game pixels behind the bird. Before 27 November 2026 that was all,
// so it could stop in front of a room's figure and hide part of it (the lead agent saw it in al-Idrisi's hall during
// play, test plan D48). Now, when the place it would stop at overlaps a person, it stops short of that person instead,
// on the side it is coming from, or steps to the other side when that one is the only clear one; and it never stands
// overlapping a person when the bird is still. And a room entered with a direction key still held (walking through the
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

/** Whether the explorer, standing at x, overlaps any person (with a few pixels to spare). */
export function overlapsPerson(x: number, people: readonly Standing[]): boolean {
  return people.some((p) => {
    const s = spanOf(p.figure);
    return x + EXPLORER_SPAN.right + FOLLOW.margin > p.x + s.left && x + EXPLORER_SPAN.left - FOLLOW.margin < p.x + s.right;
  });
}

/**
 * Where the explorer walks to: about 96 pixels behind the bird, kept inside the room; but if it would stand overlapping a
 * person there, just short of that person on the side the explorer is coming from, or, if that side is blocked by the
 * wall or by another person, just past them on the other side.
 */
export function followGoal(bird: { x: number; facing: -1 | 1 }, from: number, people: readonly Standing[], width: number): number {
  const clamp = (x: number) => Math.min(width - FOLLOW.right, Math.max(FOLLOW.left, x));
  const inside = (x: number) => x >= FOLLOW.left && x <= width - FOLLOW.right;
  let goal = clamp(bird.x - FOLLOW.behind * bird.facing);
  for (let i = 0; i <= people.length && overlapsPerson(goal, people); i++) {
    // The person in the way: the one whose middle is nearest the goal.
    const p = [...people].sort((a, b) => Math.abs(a.x - goal) - Math.abs(b.x - goal))[0]!;
    const s = spanOf(p.figure);
    const before = p.x + s.left - EXPLORER_SPAN.right - FOLLOW.margin - 1;
    const after = p.x + s.right - EXPLORER_SPAN.left + FOLLOW.margin + 1;
    const near = from <= p.x ? before : after;
    const far = from <= p.x ? after : before;
    goal = inside(near) && !overlapsPerson(near, people) ? near : inside(far) && !overlapsPerson(far, people) ? far : clamp(near);
  }
  return goal;
}

/**
 * One frame of the explorer's walk. It walks to its goal while it is more than 50 pixels from it, and always while it
 * overlaps a person (even while the world waits for a talk, so that it never stops in front of someone). It stops within
 * 50 pixels of its goal otherwise.
 */
export function followStep(x: number, bird: { x: number; facing: -1 | 1 }, people: readonly Standing[], width: number, dt: number, frozen: boolean): { x: number; walking: boolean; goal: number } {
  const goal = followGoal(bird, x, people, width);
  const gap = goal - x;
  const inTheWay = overlapsPerson(x, people);
  const walking = gap !== 0 && (inTheWay || (Math.abs(gap) > FOLLOW.slack && !frozen));
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
