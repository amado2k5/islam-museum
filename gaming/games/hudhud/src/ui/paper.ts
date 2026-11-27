// The paper of Samarkand's page: a seventh trial quest. It is the shared page of the row quests (ui/rowpage.ts) with the
// strings, the picture, the steps and the two questions of the papermaker; al-Razi's loose leaves are the other one
// (ui/leaves.ts). A picture of the papermaker's row, one choice for each place, a button that makes a sheet, and words
// for everything that happens. The rules are in sim/chainquest.ts, shared with the elephant clock; the steps and the
// states of the material are in content/paper.ts.
import { PAPER_ART, drawPaper, paperCanvas, paperHit } from "../art/paper";
import { PAPER_RECORDS, PAPER_SLACK, paperPuzzle } from "../content/paper";
import { applyPaper, newPaper, paperGoals, snapshotPaper, type PaperFlag } from "../sim/paper";
import { rowPage, type Key, type RowHost, type RowQuest, type RowSpec } from "./rowpage";

export type PaperHost = RowHost<PaperFlag>;
export type PaperQuest = RowQuest<PaperFlag>;

/** A card's or a state's id as the tail of a string key: `clean-bleach` is `clean_bleach`. */
const tail = (id: string): string => id.replace(/-/g, "_");

const SPEC: RowSpec<PaperFlag> = {
  art: { canvas: paperCanvas, draw: drawPaper, hit: paperHit, w: PAPER_ART.w, h: PAPER_ART.h, cls: "paper-art" },
  placesCls: "paper-places",
  puzzle: paperPuzzle,
  rules: { newState: newPaper, apply: applyPaper, goals: paperGoals, snapshot: snapshotPaper },
  slack: PAPER_SLACK,
  records: PAPER_RECORDS,
  recNames: ["pp_rec_paper", "pp_rec_place"],
  part: (id) => `pp_part_${tail(id)}` as Key,
  did: (id) => `pp_did_${tail(id)}` as Key,
  // The paper says what the place needs, and what reached it, in the same words: the state of the material.
  needs: (carrying) => `pp_kind_${tail(carrying)}` as Key,
  reached: (carrying) => `pp_kind_${tail(carrying)}` as Key,
  asks: [
    { flag: "askedStory", button: "pp_ask_story", answer: "pp_story_1" },
    { flag: "askedHow", button: "pp_ask_how", answer: "pp_how_1" },
  ],
  cls: { voice: "maker", kid: "child" },
  who: { hudhud: "pp_who_hudhud", voice: "pp_who_maker", kid: "pp_who_child", narrator: "pp_who_narrator" },
  k: {
    trial: "pp_trial",
    objective: "pp_objective",
    moves: "pp_moves",
    picture: "pp_picture",
    place: "pp_place",
    go: "pp_go",
    tapHint: "pp_tap_hint",
    chosen: "pp_chosen",
    endDone: "pp_end_done",
    endIdle: "pp_end_idle",
    needs: "pp_needs",
    reached: "pp_reached",
    talk: "pp_talk_child",
    kid1: "pp_child_1",
    kidKind: "pp_child_kind",
    kidBlunt: "pp_child_blunt",
    kidKindR: "pp_child_kind_r",
    kidBluntR: "pp_child_blunt_r",
    look: "pp_look_feather",
    feather1: "pp_feather_1",
    featherAgain: "pp_feather_again",
    intro1: "pp_intro_1",
    intro2: "pp_intro_2",
    done1: "pp_done_1",
    review: "pp_review",
    goalCuriosityHow: "pp_goal_curiosity_how",
    goalIngenuityHow: "pp_goal_ingenuity_how",
    goalIngenuityStory: "pp_goal_ingenuity_story",
    goalKindnessHow: "pp_goal_kindness_how",
    goalFeatherHow: "pp_goal_feather_how",
  },
  notes: ["pp_note_1", "pp_note_2", "pp_note_3"],
};

export const paperQuest = (host: PaperHost): PaperQuest => rowPage(host, SPEC);
