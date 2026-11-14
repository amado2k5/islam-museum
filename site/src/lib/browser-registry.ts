// The section-style browsers and the records each one lists, in one place, for the whole-list filter index
// (pages/[lang]/list-index/[browser].json.ts). A paginated browser shows a page of rows at a time, so its filter
// box searches this index, which holds every row. Each entry is the same array the browser's own page renders.
import type { Node } from "../../../scripts/build-graph";
import { akhlaqItems } from "./akhlaq";
import { angelsItems } from "./angels";
import { baytItems } from "./bayt";
import { dreamItems } from "./dreams";
import { duaItems } from "./dua";
import { ghaybItems } from "./ghayb";
import { hasanatItems } from "./hasanat";
import { hisabItems } from "./hisab";
import { hududItems } from "./hudud";
import { ibadatItems } from "./ibadat";
import { ieItems } from "./islamic-economy";
import { jannaItems } from "./janna";
import { madhahibItems } from "./madhahib";
import { magicItems } from "./magic";
import { messengerItems } from "./messengers";
import { miracleItems } from "./miracles";
import { mukatabatItems } from "./mukatabat";
import { narItems } from "./nar";
import { natureItems } from "./nature";
import { nubuwatItems } from "./nubuwat";
import { placesItems } from "./places";
import { qiyamaItems } from "./qiyama";
import { qurunItems } from "./qurun";
import { sayyiatItems } from "./sayyiat";
import { eschItems } from "./eschatology";
import { usraItems } from "./usra";
import { tibbItems } from "./tibb";
import { ansabSubjects } from "./ansab";
import { battleNodes } from "./battles";
import { fatwas } from "./fatwa";

import { hallItems } from "./halls";
import { BROWSE_CLASSES, entriesOf, CLASS_WHOLE } from "./browse";
import { WINGS, type Lang } from "./i18n";
type Row = { node: Node };
/** The index rows of a wing hall (slug "hall-<wing>"): the hall's own records in the language asked for. */
export const hallRows = (slug: string, lang: Lang): Row[] | null => {
  const wing = WINGS.find((w) => `hall-${w}` === slug);
  return wing && wing !== "place" ? hallItems(wing, lang).map((node) => ({ node })) : null;
};
export const HALL_SLUGS = WINGS.filter((w) => w !== "place").map((w) => `hall-${w}`);
/** The index rows of a long class listing (slug "class-<class>"). */
export const classRows = (slug: string): Row[] | null => {
  const cls = BROWSE_CLASSES.find((c) => `class-${c}` === slug);
  return cls ? entriesOf(cls).map((node) => ({ node })) : null;
};
export const CLASS_SLUGS = BROWSE_CLASSES.filter((c) => entriesOf(c).length > CLASS_WHOLE).map((c) => `class-${c}`);
/** slug (the browser's folder under /<lang>/, "/" written as "-") -> the rows it lists. */
export const BROWSER_ROWS: Record<string, readonly Row[]> = {
  akhlaq: akhlaqItems, angels: angelsItems, bayt: baytItems, dreams: dreamItems, dua: duaItems, ghayb: ghaybItems,
  hasanat: hasanatItems, hisab: hisabItems, hudud: hududItems, ibadat: ibadatItems, "islamic-economy": ieItems,
  janna: jannaItems, madhahib: madhahibItems, magic: magicItems, messengers: messengerItems, miracles: miracleItems,
  mukatabat: mukatabatItems, nar: narItems, nature: natureItems, nubuwat: nubuwatItems, places: placesItems,
  qiyama: qiyamaItems, qurun: qurunItems, sayyiat: sayyiatItems, "signs-all": eschItems, usra: usraItems, tibb: tibbItems, ansab: ansabSubjects, battles: battleNodes.map((node) => ({ node })), fatwa: fatwas.map((node) => ({ node })),
};
