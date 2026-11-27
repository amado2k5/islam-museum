// Al-Razi's loose leaves: a twelfth trial quest. It is the shared page of the row quests (ui/rowpage.ts) with the
// strings, the picture, the leaves and the two questions of al-Razi's notebook; the paper of Samarkand is the other one
// (ui/paper.ts). A picture of the leaves on a desk, one choice for each place, a button that binds the notebook, and
// words for everything that happens. The rules are in sim/chainquest.ts, shared with the elephant clock and the paper;
// the leaves are in content/leaves.ts. The quest carries no medical content, and its note says so.
import { LEAVES_ART, drawLeaves, leavesCanvas, leavesHit } from "../art/leaves";
import { LEAVES_RECORDS, LEAVES_SLACK, leavesPuzzle } from "../content/leaves";
import { applyLeaves, leavesGoals, newLeaves, snapshotLeaves, type LeavesFlag } from "../sim/leaves";
import { rowPage, type Key, type RowHost, type RowQuest, type RowSpec } from "./rowpage";

export type LeavesHost = RowHost<LeavesFlag>;
export type LeavesQuest = RowQuest<LeavesFlag>;

/** A leaf's or a state's id as the tail of a string key: `books-head` is `books_head`. */
const tail = (id: string): string => id.replace(/-/g, "_");

const SPEC: RowSpec<LeavesFlag> = {
  art: { canvas: leavesCanvas, draw: drawLeaves, hit: leavesHit, w: LEAVES_ART.w, h: LEAVES_ART.h, cls: "leaves-art" },
  placesCls: "leaves-places",
  puzzle: leavesPuzzle,
  rules: { newState: newLeaves, apply: applyLeaves, goals: leavesGoals, snapshot: snapshotLeaves },
  slack: LEAVES_SLACK,
  records: LEAVES_RECORDS,
  recNames: ["rz_rec_person", "rz_rec_book"],
  part: (id) => `rz_part_${tail(id)}` as Key,
  did: (id) => `rz_did_${tail(id)}` as Key,
  // Story says which part comes next; Explorer says how far the notebook had been bound.
  needs: (carrying) => `rz_next_${tail(carrying)}` as Key,
  reached: (carrying) => `rz_kind_${tail(carrying)}` as Key,
  asks: [
    { flag: "askedNotes", button: "rz_ask_notes", answer: "rz_notes_1" },
    { flag: "askedOwn", button: "rz_ask_own", answer: "rz_own_1" },
  ],
  cls: { voice: "razi", kid: "child" },
  who: { hudhud: "rz_who_hudhud", voice: "rz_who_razi", kid: "rz_who_child", narrator: "rz_who_narrator" },
  k: {
    trial: "rz_trial",
    objective: "rz_objective",
    moves: "rz_moves",
    picture: "rz_picture",
    place: "rz_place",
    go: "rz_go",
    tapHint: "rz_tap_hint",
    chosen: "rz_chosen",
    endDone: "rz_end_done",
    endIdle: "rz_end_idle",
    needs: "rz_needs",
    reached: "rz_reached",
    talk: "rz_talk_child",
    kid1: "rz_child_1",
    kidKind: "rz_child_kind",
    kidBlunt: "rz_child_blunt",
    kidKindR: "rz_child_kind_r",
    kidBluntR: "rz_child_blunt_r",
    look: "rz_look_feather",
    feather1: "rz_feather_1",
    featherAgain: "rz_feather_again",
    intro1: "rz_intro_1",
    intro2: "rz_intro_2",
    done1: "rz_done_1",
    review: "rz_review",
    goalCuriosityHow: "rz_goal_curiosity_how",
    goalIngenuityHow: "rz_goal_ingenuity_how",
    goalIngenuityStory: "rz_goal_ingenuity_story",
    goalKindnessHow: "rz_goal_kindness_how",
    goalFeatherHow: "rz_goal_feather_how",
  },
  notes: ["rz_note_1", "rz_note_2", "rz_note_3", "rz_note_4"],
};

export const leavesQuest = (host: LeavesHost): LeavesQuest => rowPage(host, SPEC);
