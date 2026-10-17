// Shared navigation data (Part 3, A): wing counts for the menus and the landing cards, and the Explore pages with their readiness.
import { realNodes } from "./graph";
import { fmt, ui, type Lang, WINGS, type Wing } from "./i18n";

// What each counted wing holds, by class (the three uncounted wings show a phrase instead of a number).
const CLASSES: Partial<Record<Wing, string[]>> = { time: ["event"], place: ["place"], people: ["person"], ideas: ["concept"], objects: ["object", "building"], words: ["passage"] };
const counts = new Map<string, number>();
for (const w of WINGS) counts.set(w, realNodes.filter((n) => (CLASSES[w] ?? []).includes(n.class)).length);
export const wingCount = (w: Wing | string) => counts.get(w) ?? 0;
export const num = (n: number, lang: Lang) => new Intl.NumberFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB").format(n);
/** "764 حدثًا" / "Worship and practice": the counted thing for the six counted wings, a phrase for the other three. */
export const wingCountLabel = (lang: Lang, w: Wing | string) => fmt(ui(lang).wings.counts[w] ?? "{n}", { n: num(wingCount(w), lang) });

export interface ExplorePage { key: "quran" | "hadith" | "timeline" | "journeys" | "graph" | "revelation" | "surahmaps" | "cards" | "sighar"; href: string; ready: boolean }
/** The interactive explorers; `ready` flips as each phase ships, and an unfinished one links to the nearest page that exists. */
export const explorePages = (lang: Lang): ExplorePage[] => [
  { key: "quran", href: `/${lang}/words/quran/`, ready: true },
  { key: "hadith", href: `/${lang}/words/hadith/`, ready: true },
  { key: "timeline", href: `/${lang}/time/`, ready: true },
  { key: "journeys", href: `/${lang}/journey/hijra-route/`, ready: true },
  { key: "graph", href: `/${lang}/graph/`, ready: true },
  { key: "revelation", href: `/${lang}/words/revelation/`, ready: true },
  { key: "surahmaps", href: `/${lang}/surah/`, ready: true },
  { key: "cards", href: `/${lang}/cards/`, ready: true },
  { key: "sighar", href: `/${lang}/sighar/`, ready: true },
];
