// Al-Jahiz's room: the animal cards sorted in a room, by carrying each card in Hudhud's beak to a tray (asked for by the
// founder, 27 November 2026: every scene a complete room, its puzzle played in the room). It is the shared page of the
// sorting rooms (ui/sortroom.ts, made for the coffee room) with al-Jahiz's room's scene, things, strings, notes and
// records; the rules are the quest's (sim/sort.ts) through the shared sorting room's (sim/sortroom.ts), and every sentence
// about the cards, the trays and a showing is the page quest's own (jz_*). His division is not how science sorts animals
// today: the notes say so, as on the page, and the room's own note says it again.
import { SORT_RECORDS } from "../content/sort";
import { JZR_DOOR, JZR_SPEC, jzrThings } from "../content/jahiz-room";
import { JahizScene } from "../scenes/jahiz";
import { sortRoom, type SortRoom, type SortRoomHost, type SortRoomPage } from "./sortroom";
import en from "../../i18n/en.json";

type Key = Exclude<keyof typeof en, "_meta">;
export type JahizRoom = SortRoom;
export type JahizRoomHost = SortRoomHost;

export const JAHIZ_ROOM: SortRoomPage = {
  rules: JZR_SPEC,
  things: jzrThings,
  scene: { key: "jahiz", make: JahizScene },
  door: JZR_DOOR,
  kinds: { bell: "bell", voice: "jahiz", kid: "girl", hide: "basket" },
  name: (c) => `jz_c_${c}` as Key,
  // A creature's card says only its name: its full sentence is its name too.
  sentence: (c) => `jz_c_${c}` as Key,
  group: (g) => `jz_g_${g}` as Key,
  who: { hudhud: "jz_who_hudhud", voice: "jz_who_jahiz", kid: "jz_who_girl", narrator: "jz_who_narrator" },
  k: {
    canvas: "jzr_canvas_label",
    objective: "jzr_objective",
    objectiveDoor: "cqr_objective_door",
    cardsGroup: "jzr_cards_group",
    groupsGroup: "jzr_trays_group",
    carrying: "jzr_carrying",
    carryingNone: "jzr_carrying_none",
    picked: "jzr_picked",
    putBack: "jzr_put_back",
    cardTable: "jzr_card_bench",
    cardGroup: "jzr_card_tray",
    cardBeak: "jzr_card_beak",
    thingGroup: "jzr_thing_tray",
    thingRest: "jzr_thing_rest",
    groupLine: "jz_tray_line",
    progress: "jz_progress",
    progressShows: "jz_progress_shows",
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
    review: "jz_review",
    noteRoom: "jzr_note_room",
  },
  notes: ["jz_note_1", "jz_note_2", "jz_note_3", "jz_note_4"],
  records: SORT_RECORDS,
  recNames: ["jz_rec_person", "jz_rec_book"],
  panelId: "jzr-panel-title",
};

export const jahizRoom = (host: JahizRoomHost): JahizRoom => sortRoom(host, JAHIZ_ROOM);
