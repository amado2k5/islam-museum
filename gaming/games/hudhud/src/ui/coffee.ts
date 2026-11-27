// The page of coffee, the tenth trial quest: cards about coffee put on three shelves by how sure the museum's record is.
// It is the shared page of the sorting quests (ui/sortpage.ts) with the strings, the picture, the cards and the two
// questions of this quest; the animal cards of al-Jahiz are the other one (ui/sort.ts). Ordinary page from top to bottom:
// a picture of the shelves and the cards, a key in words that says which shelf is which, a numbered list that gives
// every card's full sentence with its own list of choices (so that the puzzle can be played without the picture), a
// button that shows the record, and words for everything that happens. The rules are in sim/sort.ts.
import { COFFEE_ART, coffeeCanvas, drawCoffee } from "../art/coffee";
import { sortHit } from "../art/sort";
import { COFFEE_RECORDS, COFFEE_SLACK, coffeeDef } from "../content/coffee";
import { sortPage, type Key, type SortHost, type SortQuest, type SortSpec } from "./sortpage";

export type CoffeeHost = SortHost;
export type CoffeeQuest = SortQuest;

const SPEC: SortSpec = {
  art: { canvas: coffeeCanvas, draw: drawCoffee, hit: sortHit, w: COFFEE_ART.w, h: COFFEE_ART.h },
  def: coffeeDef,
  slack: COFFEE_SLACK,
  records: COFFEE_RECORDS,
  recNames: ["cq_rec_coffee", "cq_rec_house"],
  // The short name of a card is for the messages; the full sentence is the label of the card's list of choices.
  name: (c) => `cq_n_${c}` as Key,
  group: (g) => (g === "stated" ? "cq_g_stated" : g === "tradition" ? "cq_g_tradition" : "cq_g_legend"),
  label: (c, n, t, num) => t("cq_where", { n: num(n), card: t(`cq_c_${c}` as Key) }),
  numbered: true,
  listTitle: "cq_list_title",
  cls: { voice: "keeper", kid: "child" },
  who: { hudhud: "cq_who_hudhud", voice: "cq_who_keeper", kid: "cq_who_child", narrator: "cq_who_narrator" },
  k: {
    trial: "cq_trial",
    objective: "cq_objective",
    picture: "cq_picture",
    cardsGroup: "cq_cards_group",
    notPlaced: "cq_not_placed",
    keyTitle: "cq_key_title",
    groupLine: "cq_shelf_line",
    tapHint: "cq_tap_hint",
    chosen: "cq_chosen",
    letGo: "cq_let_go",
    progress: "cq_progress",
    progressShows: "cq_progress_shows",
    show: "cq_show",
    didPlace: "cq_did_place",
    didUnplace: "cq_did_unplace",
    refused: "cq_refused",
    wrongStory: "cq_wrong_story",
    wrongExplorer: "cq_wrong_explorer",
    wrongChallenge: "cq_wrong_challenge",
    didSolved: "cq_did_solved",
    goalCuriosityHow: "cq_goal_curiosity_how",
    goalIngenuityStory: "cq_goal_ingenuity_story",
    goalIngenuityShows: "cq_goal_ingenuity_shows",
    goalKindnessHow: "cq_goal_kindness_how",
    goalFeatherHow: "cq_goal_feather_how",
    askA: "cq_ask_names",
    askB: "cq_ask_word",
    answerA: "cq_names_1",
    answerB: "cq_word_1",
    talk: "cq_talk_child",
    kid1: "cq_child_1",
    kidKind: "cq_child_kind",
    kidBlunt: "cq_child_blunt",
    kidKindR: "cq_child_kind_r",
    kidBluntR: "cq_child_blunt_r",
    look: "cq_look_feather",
    feather1: "cq_feather_1",
    featherAgain: "cq_feather_again",
    intro1: "cq_intro_1",
    intro2: "cq_intro_2",
    done1: "cq_done_1",
    review: "cq_review",
  },
  notes: ["cq_note_1", "cq_note_2", "cq_note_3", "cq_note_4"],
};

export const coffeeQuest = (host: CoffeeHost): CoffeeQuest => sortPage(host, SPEC);
