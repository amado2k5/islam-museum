// How Hudhud moves: run, hop, flap, glide. A fixed-step integrator over plain numbers, so that the same inputs give
// the same path at 30 frames a second and at 144, in Node and in the browser. The renderer only draws what this says.
//
// The forgiving parts the founder's instruction asks for are here and are tested: a hop still works a moment after
// walking off an edge (coyote time), a press just before landing is remembered (jump buffering), and holding the
// button in the air turns a fall into a glide.

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
/** A perch: solid from above only, so that a bird can fly up through it and land on it. */
export type Perch = Box;
export interface Room {
  /** The walls and the ceiling. */
  bounds: Box;
  /** The y of the floor's surface. */
  floor: number;
  perches: Perch[];
}
export interface Intent {
  /** -1 left, 0 still, 1 right. */
  dir: -1 | 0 | 1;
  /** The jump button is down. */
  jump: boolean;
  /** Down is held: drop through a perch. */
  down: boolean;
}
export interface Mover {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: -1 | 1;
  grounded: boolean;
  /** Seconds left in which a hop from thin air still counts as a hop from the ground. */
  coyote: number;
  /** Seconds left in which a remembered press will become a hop on landing. */
  buffer: number;
  /** Flaps left before the next landing. */
  flaps: number;
  gliding: boolean;
  /** The jump button as it was on the step before, to find the moment it is pressed. */
  held: boolean;
  /** Counts hops and flaps, so that the page can play a sound for each. */
  hops: number;
  flapsMade: number;
  landings: number;
}

export const MOVE = {
  step: 1 / 120,
  run: 300,
  accel: 2600,
  airAccel: 1700,
  friction: 3400,
  /** How fast a bird in the air loses its sideways speed once the direction is let go. */
  airStop: 1500,
  gravity: 1700,
  hop: 560,
  flap: 470,
  flaps: 4,
  maxFall: 900,
  glideFall: 95,
  coyote: 0.1,
  buffer: 0.12,
  /** Half the bird's width and its height, for landing. */
  half: 22,
  tall: 56,
} as const;

export function newMover(x: number, floor: number): Mover {
  return { x, y: floor, vx: 0, vy: 0, facing: 1, grounded: true, coyote: MOVE.coyote, buffer: 0, flaps: MOVE.flaps, gliding: false, held: false, hops: 0, flapsMade: 0, landings: 0 };
}

const toward = (v: number, goal: number, by: number) => (v < goal ? Math.min(goal, v + by) : Math.max(goal, v - by));

/** One fixed step. `y` is the bird's feet. */
export function stepMover(m: Mover, room: Room, input: Intent, assist = { extraFlaps: 0, slowFall: 1 }): Mover {
  const dt = MOVE.step;
  const n: Mover = { ...m };
  const pressed = input.jump && !m.held;
  n.held = input.jump;
  if (pressed) n.buffer = MOVE.buffer;
  else n.buffer = Math.max(0, n.buffer - dt);
  n.coyote = n.grounded ? MOVE.coyote : Math.max(0, n.coyote - dt);

  const goal = input.dir * MOVE.run;
  n.vx = toward(n.vx, goal, (input.dir !== 0 ? (n.grounded ? MOVE.accel : MOVE.airAccel) : n.grounded ? MOVE.friction : MOVE.airStop) * dt);
  if (input.dir !== 0) n.facing = input.dir;

  if (n.buffer > 0 && n.coyote > 0) {
    n.vy = -MOVE.hop;
    n.grounded = false;
    n.coyote = 0;
    n.buffer = 0;
    n.hops++;
  } else if (pressed && !n.grounded && n.flaps > 0) {
    n.vy = -MOVE.flap;
    n.flaps--;
    n.buffer = 0;
    n.flapsMade++;
  }

  // A press that is still being remembered is a wish to hop on landing, not yet a wish to glide: the fall is not
  // slowed until that moment has passed, or the landing would come too late for the hop.
  n.gliding = !n.grounded && input.jump && n.vy > 0 && n.buffer === 0;
  n.vy = Math.min(n.vy + MOVE.gravity * dt, n.gliding ? MOVE.glideFall * assist.slowFall : MOVE.maxFall);

  const b = room.bounds;
  n.x = Math.min(b.x + b.w - MOVE.half, Math.max(b.x + MOVE.half, n.x + n.vx * dt));
  if (n.x === b.x + MOVE.half || n.x === b.x + b.w - MOVE.half) n.vx = 0;
  const before = m.y;
  let y = n.y + n.vy * dt;
  if (y - MOVE.tall < b.y) {
    y = b.y + MOVE.tall;
    n.vy = Math.max(0, n.vy);
  }
  let landed = false;
  if (n.vy >= 0) {
    if (y >= room.floor) {
      y = room.floor;
      landed = true;
    } else if (!input.down) {
      for (const p of room.perches) {
        if (n.x + MOVE.half * 0.6 < p.x || n.x - MOVE.half * 0.6 > p.x + p.w) continue;
        if (before <= p.y + 0.5 && y >= p.y) {
          y = p.y;
          landed = true;
          break;
        }
      }
    }
  }
  n.y = y;
  if (landed) {
    if (!m.grounded) n.landings++;
    n.vy = 0;
    n.grounded = true;
    n.gliding = false;
    n.flaps = MOVE.flaps + assist.extraFlaps;
  } else {
    n.grounded = false;
  }
  return n;
}

/** Advances by real time in whole fixed steps and hands back what is left over, so that frame rate changes nothing. */
export function advance(m: Mover, room: Room, input: Intent, seconds: number, carry: number, assist?: { extraFlaps: number; slowFall: number }): { mover: Mover; carry: number } {
  let left = Math.min(seconds, 0.25) + carry;
  let mover = m;
  while (left >= MOVE.step) {
    mover = stepMover(mover, room, input, assist);
    left -= MOVE.step;
  }
  return { mover, carry: left };
}
