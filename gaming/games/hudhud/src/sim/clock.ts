// The elephant clock as a quest: a row of places, the parts that belong in them, and the motion that must pass from
// one to the next. The rules of the row are in ./chain and what a quest of this kind needs around them (a count of
// moves, the fewest possible, what the player found out on the way, the end, a place kept in the middle) is in
// ./chainquest; this adds only what is the clock's own: its flags. Pure rules over plain data.
import { chainRules, fewest, put, type ChainCommand, type ChainSnapshot, type ChainState, type ChainStyle } from "./chainquest";

export type ClockStyle = ChainStyle;
// `kind` is a goal: the apprentice was answered kindly. `answered` is only that he was answered at all, kindly or not,
// so that the question is not asked again after a resume. A snapshot kept before `answered` existed has none, and is
// still good: an apprentice answered kindly is `kind` alone, and the answer a blunt one got is asked again.
export const CLOCK_FLAGS = ["askedFloat", "askedBalls", "kind", "feather", "answered"] as const;
export type ClockFlag = (typeof CLOCK_FLAGS)[number];

export type ClockState = ChainState<ClockFlag>;
export type ClockCommand = ChainCommand<ClockFlag>;
export type ClockSnapshot = ChainSnapshot<ClockFlag>;

// Everything that is not particular to the clock (a count of moves, the fewest, the goals, a saved place that is proved)
// is in ./chainquest, shared with the paper of Samarkand. Curiosity here is asking about the float and about the balls.
const rules = chainRules("the elephant clock", CLOCK_FLAGS, ["askedFloat", "askedBalls"]);
export { fewest, put };
export const newClock = rules.newState;
export const applyClock = rules.apply;
export const clockGoals = rules.goals;
export const snapshotClock = rules.snapshot;
export const restoreClock = rules.restore;
