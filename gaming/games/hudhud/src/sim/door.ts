// The door at the end of a scene (the journey, content/journey.ts). One test of nearness for the bird and anything it
// can touch: the same as the workshop has always used for its things, measured from a point a little above the bird's
// feet. Reaching a lit door is what moves the player on.
import { newMover, advance, type Intent, type Mover, type Room } from "./move";

export interface Spot {
  x: number;
  y: number;
  /** How near the bird must come, in game pixels. */
  reach: number;
}
/** How far the bird is from a spot: from a point 30 pixels above its feet. */
export const distance = (spot: { x: number; y: number }, bird: { x: number; y: number }): number => Math.hypot(spot.x - bird.x, spot.y - (bird.y - 30));
/** The bird is near enough to touch the spot. */
export const near = (spot: Spot, bird: { x: number; y: number }): boolean => distance(spot, bird) < spot.reach;

// ---------------------------------------------------------------------------------------- the corridor
/**
 * The corridor shown under a quest played on a page once it is solved: one floor, no perches, the bird at the near end
 * and the lit door at the far end. Logical pixels, 1000 by 260. On a right-to-left page it is mirrored: the bird starts
 * on the right and the door is on the left. The keys always mean the direction seen: Left moves left.
 */
export const CORRIDOR = { w: 1000, h: 260, floor: 222, start: 140, door: 900, doorY: 162, reach: 110 } as const;
export const CORRIDOR_ROOM: Room = { bounds: { x: 0, y: -400, w: CORRIDOR.w, h: 700 }, floor: CORRIDOR.floor, perches: [] };

export interface Corridor {
  rtl: boolean;
  mover: Mover;
  carry: number;
  arrived: boolean;
}
export const corridorDoor = (rtl: boolean): Spot => ({ x: rtl ? CORRIDOR.w - CORRIDOR.door : CORRIDOR.door, y: CORRIDOR.doorY, reach: CORRIDOR.reach });
export function newCorridor(rtl: boolean): Corridor {
  const mover = newMover(rtl ? CORRIDOR.w - CORRIDOR.start : CORRIDOR.start, CORRIDOR.floor);
  return { rtl, mover: { ...mover, facing: rtl ? -1 : 1 }, carry: 0, arrived: false };
}
/** Moves the bird by real time in whole fixed steps (sim/move.ts). The jump and the drop are not used here. Once the
 * door is reached the corridor stands still. */
export function stepCorridor(c: Corridor, intent: Intent, seconds: number): Corridor {
  if (c.arrived) return c;
  const r = advance(c.mover, CORRIDOR_ROOM, { dir: intent.dir, jump: false, down: false }, seconds, c.carry);
  return { ...c, mover: r.mover, carry: r.carry, arrived: near(corridorDoor(c.rtl), r.mover) };
}
