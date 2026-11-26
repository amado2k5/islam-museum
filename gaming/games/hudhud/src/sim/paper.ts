// The paper of Samarkand as a quest: a papermaker's steps in a row, each taking the material in one state and handing it
// on in the next. The rules are the shared ones of a quest made of a row (./chainquest, over ./chain), exactly as the
// elephant clock has them; this adds only what is the paper's own: its flags.
import { chainRules, type ChainCommand, type ChainSnapshot, type ChainState, type ChainStyle } from "./chainquest";

export type PaperStyle = ChainStyle;
// `kind` is a goal: the child was answered kindly. `answered` is only that the child was answered at all, kindly or not,
// so that the question is not asked again after a resume (the same arrangement as the clock's apprentice).
export const PAPER_FLAGS = ["askedStory", "askedHow", "kind", "feather", "answered"] as const;
export type PaperFlag = (typeof PAPER_FLAGS)[number];

export type PaperState = ChainState<PaperFlag>;
export type PaperCommand = ChainCommand<PaperFlag>;
export type PaperSnapshot = ChainSnapshot<PaperFlag>;

// Curiosity here is asking both questions: about the old report, and about how paper was made.
const rules = chainRules("the paper of Samarkand", PAPER_FLAGS, ["askedStory", "askedHow"]);
export const newPaper = rules.newState;
export const applyPaper = rules.apply;
export const paperGoals = rules.goals;
export const snapshotPaper = rules.snapshot;
export const restorePaper = rules.restore;
