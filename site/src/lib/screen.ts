// The Screening Room's shared reads (docs/plan/12-screen-index.md): the title records, their release years and the groups the
// reel of decades (site/src/components/sig/ScreenReel.astro) draws. Read at build time by the browser's own page only.
import { realNodes } from "./graph";
import type { Node } from "../../../scripts/build-graph";

/** Every title record, in the order of the page's card list (earliest first). */
export const screenItems: Node[] = realNodes
  .filter((n) => n.class === "screen")
  .sort((a, b) => (a.span?.earliest ?? 0) - (b.span?.earliest ?? 0));

/** The release year of a title (the four digits an EDTF release date starts with), or undefined when it has none. */
export const releasedYear = (n: Node): number | undefined => {
  const m = String(n.data.released?.edtf ?? "").match(/^(\d{4})/);
  return m ? Number(m[1]) : undefined;
};
export const decadeOf = (year: number): number => Math.floor(year / 10) * 10;

/** The four families the reel tones its tiles by, in legend order. */
export const SCREEN_FAMILIES = ["film", "series", "documentary", "animation"] as const;
export type ScreenFamily = (typeof SCREEN_FAMILIES)[number];
/** Every format the museum defines (i18n `screen.format_values`) belongs to one family; the reel stops the build when a record carries a format that is not listed. */
export const FORMAT_FAMILY: Record<string, ScreenFamily> = {
  film: "film",
  short: "film",
  tv_film: "film",
  recorded_performance: "film",
  series: "series",
  miniseries: "series",
  web_series: "series",
  programme: "series",
  episode: "series",
  documentary: "documentary",
  documentary_series: "documentary",
  animation: "animation",
  children: "animation",
};

export const formatsOf = (items: Node[]): string[] => [...new Set(items.map((n) => n.data.format as string))];
export const relevancesOf = (items: Node[]): string[] => ["primary", "substantial", "setting"].filter((r) => items.some((n) => n.data.relevance === r));
/** The countries of a title as upper-case ISO codes, the way the card list shows them. */
export const countriesText = (n: Node): string => (n.data.countries ?? []).map((c: string) => c.toUpperCase()).join(" ");
