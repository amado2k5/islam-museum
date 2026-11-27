// The journey: the quests that are built, played one after another, each scene ending at a door that leads to the next
// (asked for by the founder on 27 November 2026). The Atlas stays the hub and the free choice; the journey is one more
// way through the same quests and changes none of them. The order is the flying scene first (Ibn al-Haytham's
// workshop), then every quest played on a page in the Atlas's own order: by world, then by the quest's code.
//
// A test (journey.gtest.ts) holds this list to every quest that is built: one added later must be added here too.
import { ALGEBRA_QUEST } from "./algebra";
import { CHANNELS_QUEST, CHANNELS_SUBJECT } from "./channels";
import { CIPHER_QUEST } from "./cipher";
import { CLOCK_QUEST } from "./clock";
import { COFFEE_QUEST, COFFEE_SUBJECT } from "./coffee";
import { COLLATE_QUEST, COLLATE_SUBJECT } from "./collate";
import { COUPLE_QUEST, COUPLE_SUBJECT } from "./couple";
import { LEAVES_QUEST, LEAVES_SUBJECT } from "./leaves";
import { PAPER_QUEST, PAPER_SUBJECT } from "./paper";
import { ROUTE_QUEST, ROUTE_SUBJECT } from "./route";
import { SHEETS_QUEST } from "./sheets";
import { SORT_QUEST, SORT_SUBJECT } from "./sort";

/** The flying scene's quest: Ibn al-Haytham's workshop. */
export const WORKSHOP_QUEST = "w03q1-ibn-al-haytham";

/** Every quest that can be played, by the Atlas subject it belongs to. */
export const BUILT: Readonly<Record<string, string>> = {
  "ibn-al-haytham": WORKSHOP_QUEST,
  "al-jazari": CLOCK_QUEST,
  "al-kindi": CIPHER_QUEST,
  "al-khwarizmi": ALGEBRA_QUEST,
  "al-idrisi": SHEETS_QUEST,
  [SORT_SUBJECT]: SORT_QUEST,
  [PAPER_SUBJECT]: PAPER_QUEST,
  [ROUTE_SUBJECT]: ROUTE_QUEST,
  [COUPLE_SUBJECT]: COUPLE_QUEST,
  [COFFEE_SUBJECT]: COFFEE_QUEST,
  [CHANNELS_SUBJECT]: CHANNELS_QUEST,
  [LEAVES_SUBJECT]: LEAVES_QUEST,
  [COLLATE_SUBJECT]: COLLATE_QUEST,
};

/** The order of the journey. */
export const JOURNEY: readonly string[] = [
  WORKSHOP_QUEST,
  COUPLE_QUEST, // w01q3
  CLOCK_QUEST, // w02q1
  ALGEBRA_QUEST, // w02q2
  CIPHER_QUEST, // w02q3
  SHEETS_QUEST, // w03q4
  LEAVES_QUEST, // w04q4
  COLLATE_QUEST, // w05q3
  ROUTE_QUEST, // w06q1
  COFFEE_QUEST, // w07q3
  CHANNELS_QUEST, // w08q2
  SORT_QUEST, // w09q1
  PAPER_QUEST, // w10q5
];

/** The Atlas subject a quest belongs to, or null. */
export const subjectOf = (quest: string): string | null => Object.entries(BUILT).find(([, q]) => q === quest)?.[0] ?? null;
