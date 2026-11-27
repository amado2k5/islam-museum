// Al-Razi and the loose leaves as a quest: the leaves of a physician's notebook in a row, each taking the notebook as
// far as the leaf before it and handing it on one leaf further. The rules are the shared ones of a quest made of a row
// (./chainquest, over ./chain), exactly as the elephant clock and the paper of Samarkand have them; this adds only what
// is the notebook's own: its flags.
import { chainRules, type ChainCommand, type ChainSnapshot, type ChainState, type ChainStyle } from "./chainquest";

export type LeavesStyle = ChainStyle;
// `kind` is a goal: the child was answered kindly. `answered` is only that the child was answered at all, kindly or not,
// so that the question is not asked again after a resume (the same arrangement as the paper's child).
export const LEAVES_FLAGS = ["askedNotes", "askedOwn", "kind", "feather", "answered"] as const;
export type LeavesFlag = (typeof LEAVES_FLAGS)[number];

export type LeavesState = ChainState<LeavesFlag>;
export type LeavesCommand = ChainCommand<LeavesFlag>;
export type LeavesSnapshot = ChainSnapshot<LeavesFlag>;

// Curiosity here is asking both questions: about how his notebooks were kept, and about what he saw himself.
const rules = chainRules("al-Razi's loose leaves", LEAVES_FLAGS, ["askedNotes", "askedOwn"]);
export const newLeaves = rules.newState;
export const applyLeaves = rules.apply;
export const leavesGoals = rules.goals;
export const snapshotLeaves = rules.snapshot;
export const restoreLeaves = rules.restore;
