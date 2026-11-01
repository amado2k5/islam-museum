// Shared navigation data (Part 3, A): wing counts for the menus and the landing cards, and the Explore pages with their readiness.
import { realNodes } from "./graph";
import { fmt, ui, NUM_LOCALE, type Lang, type Wing } from "./i18n";
import { wingCounts } from "../../../scripts/wings";

// What each counted wing holds, by class (scripts/wings.ts; the three uncounted wings show a phrase instead of a number).
const counts = wingCounts(realNodes);
export const wingCount = (w: Wing | string) => counts[w] ?? 0;
export const num = (n: number, lang: Lang) => new Intl.NumberFormat(NUM_LOCALE[lang]).format(n);
/** "764 حدثًا" / "Worship and practice": the counted thing for the six counted wings, a phrase for the other three.
 *  Only for pages that change with the content anyway (the landing page). Shared layouts must not bake a count into every
 *  page: they use wingCountTemplate and let the client fill the number from /api/v1/meta/counts.json (docs/site/README.md). */
export const wingCountLabel = (lang: Lang, w: Wing | string) => fmt(ui(lang).wings.counts[w] ?? "{n}", { n: num(wingCount(w), lang) });
/** The "{n} events" template of a counted wing, or null for a wing that shows a phrase (rendered as static text). */
export const wingCountTemplate = (lang: Lang, w: Wing | string): string | null => { const t = ui(lang).wings.counts[w]; return typeof t === "string" && t.includes("{n}") ? t : null; };

export interface ExplorePage { key: "quran" | "hadith" | "timeline" | "journeys" | "graph" | "revelation" | "surahmaps" | "cards" | "sighar" | "calendar" | "khutab" | "timeexplorer" | "poetry"; href: string; ready: boolean }
/** The interactive explorers; `ready` flips as each phase ships, and an unfinished one links to the nearest page that exists. */
export const explorePages = (lang: Lang): ExplorePage[] => [
  { key: "quran", href: `/${lang}/words/quran/`, ready: true },
  { key: "hadith", href: `/${lang}/words/hadith/`, ready: true },
  { key: "timeline", href: `/${lang}/time/`, ready: true },
  { key: "calendar", href: `/${lang}/calendar/`, ready: true },
  { key: "journeys", href: `/${lang}/journey/hijra-route/`, ready: true },
  { key: "graph", href: `/${lang}/graph/`, ready: true },
  { key: "revelation", href: `/${lang}/words/revelation/`, ready: true },
  { key: "surahmaps", href: `/${lang}/surah/`, ready: true },
  { key: "cards", href: `/${lang}/cards/`, ready: true },
  { key: "sighar", href: `/${lang}/sighar/`, ready: true },
  { key: "timeexplorer", href: `/${lang}/time-browser/`, ready: true },
  { key: "khutab", href: `/${lang}/khutab/`, ready: true },
  { key: "poetry", href: `/${lang}/words/poetry/`, ready: true },
];
