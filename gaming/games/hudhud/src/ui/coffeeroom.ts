// The coffee room: the journey of coffee sorted in a room, by carrying each card in Hudhud's beak to a shelf (asked for
// by the founder, 27 November 2026: every scene a complete room, its puzzle played in the room). It is the shared page of
// the sorting rooms (ui/sortroom.ts) with the coffee room's scene, things, strings, notes and records; the rules are the
// quest's (sim/sort.ts) through the shared sorting room's (sim/sortroom.ts), and every sentence about the cards, the
// shelves and a showing is the page quest's own (cq_*). The game does not choose between the traditions, and the third
// shelf does not call the tale a lie: the notes say so, as on the page.
import { COFFEE_RECORDS } from "../content/coffee";
import { CQR_DOOR, CQR_SPEC, cqrThings } from "../content/coffee-room";
import { CoffeeScene } from "../scenes/coffee";
import { sortRoom, type SortRoom, type SortRoomHost, type SortRoomPage } from "./sortroom";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export type CoffeeRoom = SortRoom;
export type CoffeeRoomHost = SortRoomHost;

export const COFFEE_ROOM: SortRoomPage = {
  rules: CQR_SPEC,
  things: cqrThings,
  scene: { key: "coffee", make: CoffeeScene },
  door: CQR_DOOR,
  kinds: { bell: "bell", voice: "keeper", kid: "child", hide: "box" },
  name: (c) => `cq_n_${c}` as Key,
  sentence: (c) => `cq_c_${c}` as Key,
  group: (g) => (g === "stated" ? "cq_g_stated" : g === "tradition" ? "cq_g_tradition" : "cq_g_legend"),
  who: { hudhud: "cq_who_hudhud", voice: "cq_who_keeper", kid: "cq_who_child", narrator: "cq_who_narrator" },
  k: {
    canvas: "cqr_canvas_label",
    objective: "cqr_objective",
    objectiveDoor: "cqr_objective_door",
    cardsGroup: "cqr_cards_group",
    groupsGroup: "cqr_shelves_group",
    carrying: "cqr_carrying",
    carryingNone: "cqr_carrying_none",
    picked: "cqr_picked",
    putBack: "cqr_put_back",
    cardTable: "cqr_card_table",
    cardGroup: "cqr_card_shelf",
    cardBeak: "cqr_card_beak",
    thingGroup: "cqr_thing_shelf",
    thingRest: "cqr_thing_rest",
    groupLine: "cq_shelf_line",
    progress: "cq_progress",
    progressShows: "cq_progress_shows",
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
    review: "cq_review",
    noteRoom: "cqr_note_room",
  },
  notes: ["cq_note_1", "cq_note_2", "cq_note_3", "cq_note_4"],
  records: COFFEE_RECORDS,
  recNames: ["cq_rec_coffee", "cq_rec_house"],
  panelId: "cqr-panel-title",
};

export const coffeeRoom = (host: CoffeeRoomHost): CoffeeRoom => sortRoom(host, COFFEE_ROOM);
