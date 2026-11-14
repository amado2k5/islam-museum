// The record each Medicine Browser topic's harvested passages point to with a `mentions` edge
// (docs/plan/57-tibb-browser.md); shared by the hadith-api and the OCR harvest scripts.
import type { TibbTopic } from "./tibb.js";

/** The record each topic's passages point to with a `mentions` edge. */
export const TOPIC_ANCHOR: Record<TibbTopic, string> = {
  nabawi: "concept/al-tibb-al-nabawi",
  tibb: "concept/medicine",
  tashrih: "concept/anatomy",
  jiraha: "concept/al-jiraha",
  dawa: "concept/al-adwiya-al-mufrada",
  tadawi: "concept/tadawi",
};
