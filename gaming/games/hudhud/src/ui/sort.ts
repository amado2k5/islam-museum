// The animal cards' page: a sixth trial quest. It is the shared page of the sorting quests (ui/sortpage.ts) with the
// strings, the picture, the cards and the two questions of al-Jahiz; the shelves of coffee are the other one
// (ui/coffee.ts). A picture of the trays and cards, a key in words that says which tray is which group, a list of choices
// for every card, a button that shows the cards to al-Jahiz, and words for everything that happens. The rules are in
// sim/sort.ts.
import { SORT_ART, drawSort, sortCanvas, sortHit } from "../art/sort";
import { SORT_RECORDS, SORT_SLACK, sortDef } from "../content/sort";
import { sortPage, type Key, type SortHost, type SortQuest, type SortSpec } from "./sortpage";

export type { SortHost, SortQuest };

const SPEC: SortSpec = {
  art: { canvas: sortCanvas, draw: drawSort, hit: sortHit, w: SORT_ART.w, h: SORT_ART.h },
  def: sortDef,
  slack: SORT_SLACK,
  records: SORT_RECORDS,
  recNames: ["jz_rec_person", "jz_rec_book"],
  name: (c) => `jz_c_${c}` as Key,
  group: (g) => `jz_g_${g}` as Key,
  label: (c, _n, t) => t("jz_where", { card: t(`jz_c_${c}` as Key) }),
  numbered: false,
  cls: { voice: "jahiz", kid: "girl" },
  afterBoth: [
    { who: "narrator", key: "jz_hoopoe_1" },
    { who: "hudhud", key: "jz_hoopoe_2" },
  ],
  who: { hudhud: "jz_who_hudhud", voice: "jz_who_jahiz", kid: "jz_who_girl", narrator: "jz_who_narrator" },
  k: {
    trial: "jz_trial",
    objective: "jz_objective",
    picture: "jz_picture",
    cardsGroup: "jz_cards_group",
    notPlaced: "jz_not_placed",
    keyTitle: "jz_key_title",
    groupLine: "jz_tray_line",
    tapHint: "jz_tap_hint",
    chosen: "jz_chosen",
    letGo: "jz_let_go",
    progress: "jz_progress",
    progressShows: "jz_progress_shows",
    show: "jz_show",
    didPlace: "jz_did_place",
    didUnplace: "jz_did_unplace",
    refused: "jz_refused",
    wrongStory: "jz_wrong_story",
    wrongExplorer: "jz_wrong_explorer",
    wrongChallenge: "jz_wrong_challenge",
    didSolved: "jz_did_solved",
    goalCuriosityHow: "jz_goal_curiosity_how",
    goalIngenuityStory: "jz_goal_ingenuity_story",
    goalIngenuityShows: "jz_goal_ingenuity_shows",
    goalKindnessHow: "jz_goal_kindness_how",
    goalFeatherHow: "jz_goal_feather_how",
    askA: "jz_ask_division",
    askB: "jz_ask_birds",
    answerA: "jz_divide_1",
    answerB: "jz_birds_1",
    talk: "jz_talk_girl",
    kid1: "jz_girl_1",
    kidKind: "jz_girl_kind",
    kidBlunt: "jz_girl_blunt",
    kidKindR: "jz_girl_kind_r",
    kidBluntR: "jz_girl_blunt_r",
    look: "jz_look_feather",
    feather1: "jz_feather_1",
    featherAgain: "jz_feather_again",
    intro1: "jz_intro_1",
    intro2: "jz_intro_2",
    done1: "jz_done_1",
    review: "jz_review",
  },
  notes: ["jz_note_1", "jz_note_2", "jz_note_3", "jz_note_4"],
};

export const sortQuest = (host: SortHost): SortQuest => sortPage(host, SPEC);
