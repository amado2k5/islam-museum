// The Dictionaries Browser's shared reads (docs/plan/72-dictionaries-browser.md): every record tagged
// `maajim-browser`, grouped by its `maajim-<section>` tag. Everything comes from the compiled graph at
// build time; there is no side list.
import { realNodes } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export const MAAJIM_TAG = "maajim-browser";
/** Section order of the browser; a `maajim-<id>` tag not listed here sorts last. */
export const MAAJIM_SECTIONS = ["general", "thematic", "quran", "hadith", "terminology", "geographic"];
/** The source records of the readable-text pilot (Bulaq 1282/1865 printing of al-Sihah, Internet Archive scans). */
export const MAAJIM_PILOT_SOURCES = ["source/sihah-bulaq-1865-v1", "source/sihah-bulaq-1865-v2"];

export interface MaajimItem { node: Node; section: string }

export const maajimItems: MaajimItem[] = realNodes
  .filter((n) => n.tags.includes(MAAJIM_TAG))
  .map((n) => ({ node: n, section: (n.tags.find((t) => t.startsWith("maajim-") && t !== MAAJIM_TAG) ?? "maajim-").slice(7) }))
  .sort((a, b) => {
    const r = MAAJIM_SECTIONS.indexOf(a.section) - MAAJIM_SECTIONS.indexOf(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
