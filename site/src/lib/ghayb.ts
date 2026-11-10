// The Ghayb Browser's shared reads (docs/plan/33-ghayb-browser.md): every record tagged
// `ghayb-browser`, grouped by its `ghayb-<section>` tag into the browser's seven sections.
// Everything comes from the compiled graph at build time; there is no side list.
import { realNodes } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export const GHAYB_TAG = "ghayb-browser";
/** Section order of the browser; a `ghayb-<id>` tag not listed here sorts last. */
export const GHAYB_SECTIONS = [
  "perception", "daily", "time", "heavens", "creations", "barzakh", "signs",
];

export interface GhaybItem { node: Node; section: string }

export const ghaybItems: GhaybItem[] = realNodes
  .filter((n) => n.tags.includes(GHAYB_TAG))
  .map((n) => ({ node: n, section: (n.tags.find((t) => t.startsWith("ghayb-") && t !== GHAYB_TAG) ?? "ghayb-").slice(6) }))
  .sort((a, b) => {
    const r = GHAYB_SECTIONS.indexOf(a.section) - GHAYB_SECTIONS.indexOf(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Canonical order of the ten major signs (hadith of Hudhayfa ibn Usayd, Sahih Muslim). */
export const GHAYB_SIGNS_ORDER = [
  "al-dukhan","dajjal","dabbat-al-ard","tulu-al-shams-min-al-maghrib",
  "nuzul-isa-ibn-maryam","yajuj-majuj","al-khusufat-al-thalatha","al-khusufat-al-thalatha","al-khusufat-al-thalatha","al-nar-al-yaman",
];
/** The Miraj route shown on the browser: journey waypoints then the heavens-section records. */
export const ghaybSignItems = ghaybItems.filter((i) => i.section === "signs");
