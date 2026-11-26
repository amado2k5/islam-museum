// The eighth quest as data: Ibn Battuta and the thread of the road, three stages of his journeys to be threaded in order.
//
// History and invention, kept apart on purpose:
//   from museum records  (person/ibn-battuta-muhammad, after the Encyclopaedia of Islam, vol. 3 pp. 767-768, and the
//                        Rihla's own opening; work/rihla-ibn-battuta)
//                        he left Tangier on Thursday 2 Rajab 725 AH for the pilgrimage, alone, aged twenty-two; the article
//                        sets his journeys out in eight stages. First stage: Tangier, North Africa, Egypt, Upper Egypt,
//                        Syria, leaving Damascus for Mecca. Second: leaving Mecca, Iraq, Khuzistan, Fars and the Jibal, then
//                        Tabriz, Baghdad, Samarra and Mosul, returning to Baghdad. Third: down the Red Sea to Yemen and Aden,
//                        then Zayla, Mogadishu and the trading ports of East Africa, and back by Oman and the Persian Gulf.
//                        He did not write the account himself: Sultan Abu Inan ordered it written down, he dictated it, and
//                        Ibn Juzayy edited it. The article holds that the rearranging of several itineraries comes from the
//                        editor, and that Ibn Battuta admitted losing notes and rewriting them from memory.
//   invented for play    the thread and the beads, the ring they sit on (it is not a map: no direction, no distance), the
//                        signs and dots on the beads, the child with the camel, every spoken line (Ibn Battuta's one line is
//                        imagined), and the choice of three stages out of eight (review ledger, HR-HH-29 to HR-HH-31)
import type { RouteStyle, Stage } from "../sim/route";

export const ROUTE_QUEST = "w06q1-ibn-battuta";
/** The Atlas subject the quest belongs to. */
export const ROUTE_SUBJECT = "ibn-battuta";

/**
 * Which stage of the record each way of playing follows, with its stops in the order of the ring, which is never the
 * order of the road: no stop is where the road has it, and no two stops that are neighbours on the road are neighbours
 * on the ring (nor first and last), so that the ring cannot be read as a way from one place to the next.
 *   Story      the first stage, seven stops; the sentence is always on the page and a slip says which stop is next.
 *   Explorer   the third stage, eight stops; the sentence is hidden once the thread has begun, and may be shown again.
 *   Challenge  the second stage, ten steps over nine beads (Baghdad is threaded twice); showing the sentence again is a
 *              slip, and a wrong stop sends the thread back to the start.
 */
const STAGES: Record<RouteStyle, Stage> = {
  story: {
    // tangier, north-africa, egypt, upper-egypt, syria, damascus, mecca in the road's order
    stops: ["egypt", "mecca", "north-africa", "syria", "tangier", "upper-egypt", "damascus"],
    road: ["tangier", "north-africa", "egypt", "upper-egypt", "syria", "damascus", "mecca"],
  },
  explorer: {
    stops: ["mogadishu", "persian-gulf", "yemen", "oman", "red-sea", "zayla", "east-africa-ports", "aden"],
    road: ["red-sea", "yemen", "aden", "zayla", "mogadishu", "east-africa-ports", "oman", "persian-gulf"],
  },
  challenge: {
    stops: ["fars", "mecca", "tabriz", "mosul", "khuzistan", "baghdad", "iraq", "jibal", "samarra"],
    road: ["mecca", "iraq", "khuzistan", "fars", "jibal", "tabriz", "baghdad", "samarra", "mosul", "baghdad"],
  },
};
/** A fresh copy of the stage for a way of playing. */
export function routeStage(style: RouteStyle): Stage {
  const s = STAGES[style];
  return { stops: [...s.stops], road: [...s.road] };
}
/** Every stop there is across the three stages, for the names. A stop that two stages share (Mecca) is one name. */
export const ROUTE_STOPS: string[] = [...new Set((["story", "explorer", "challenge"] as const).flatMap((s) => STAGES[s].stops))];
/** A stop's id as the tail of a string key: `north-africa` is `north_africa`. */
export const stopKey = (id: string): string => id.replace(/-/g, "_");

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const ROUTE_RECORDS = ["person/ibn-battuta-muhammad", "work/rihla-ibn-battuta", "question/credibility-of-ibn-battuta"] as const;
