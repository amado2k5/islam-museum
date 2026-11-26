// The second quest as data: al-Jazari's elephant clock as a row of parts to be put in order.
//
// History and invention, kept apart on purpose:
//   from museum records  every half hour figures move, a ball passes from the falcon to the dragon to a vessel with a
//                        gong and comes to rest in a bowl, and the balls gathered tell the time elapsed; inside is a
//                        float that fills and sinks in the time wanted; the bird's whistle is air pushed out by the
//                        sinking float; a ball's weight moves the rider's arms (invention/elephant-clock, after the
//                        Metropolitan Museum's catalogue entry and Hill's translation of al-Jazari)
//   invented for play    the workbench and its five places, the apprentice and every spoken line, the muddle, the
//                        feather, and the idea that each part "answers to" one motion and "hands on" another. How
//                        the falcon is made to let its ball go is not in what was read: the row simplifies it
//                        (review ledger, HR-HH-10 to HR-HH-12)
import type { ChainPuzzle, Part } from "../sim/chain";
import type { ClockStyle } from "../sim/clock";

export const CLOCK_QUEST = "w02q1-al-jazari";

/** The ball's road, in order, and the two parts of the clock that are not on it. */
export const CLOCK_PARTS: Part[] = [
  { id: "float", takes: "half", gives: "sink" },
  { id: "falcon", takes: "sink", gives: "ball" },
  { id: "dragon", takes: "ball", gives: "lowered" },
  { id: "vessel", takes: "lowered", gives: "gong" },
  { id: "bowl", takes: "gong", gives: "counted" },
  // Not on the ball's road: the bird answers to the sinking float and whistles; the rider answers to a ball and strikes.
  { id: "bird", takes: "sink", gives: "whistle" },
  { id: "rider", takes: "ball", gives: "strike" },
];
export const CLOCK_ROAD = ["float", "falcon", "dragon", "vessel", "bowl"] as const;

/**
 * How each way of playing finds the bench.
 *   Story      the five parts of the road only, two pairs changed over; a failed run says what the place needs.
 *   Explorer   the bird and the rider stand in the row and two parts of the road lie spare; a failed run says what
 *              reached the place where it stopped.
 *   Challenge  every place wrong, both decoys standing, and a failed run says only where it stopped.
 */
const START: Record<ClockStyle, { places: string[]; parts: string[] }> = {
  story: { places: ["falcon", "float", "dragon", "bowl", "vessel"], parts: [...CLOCK_ROAD] },
  explorer: { places: ["float", "bird", "rider", "bowl", "vessel"], parts: CLOCK_PARTS.map((p) => p.id) },
  challenge: { places: ["vessel", "bird", "rider", "float", "falcon"], parts: CLOCK_PARTS.map((p) => p.id) },
};
export function clockPuzzle(style: ClockStyle): ChainPuzzle {
  const s = START[style];
  return { start: "half", goal: "counted", places: [...s.places], parts: CLOCK_PARTS.filter((p) => s.parts.includes(p.id)) };
}
/** Moves allowed for the Ingenuity goal, over the fewest possible: Story has no count. */
export const CLOCK_SLACK: Record<ClockStyle, number | null> = { story: null, explorer: 2, challenge: 0 };

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const CLOCK_RECORDS = ["person/al-jazari-engineer", "invention/elephant-clock"] as const;
