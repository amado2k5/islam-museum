// The shared content pack of the museum's small daily games (Five Questions, Kalima, The Thread of Time, The Lantern).
// It is built from the museum's own records by packages/daily/tools/build-pack.ts and pinned in git (packages/daily/
// data/), so a day's puzzle does not change when the museum's data does. Nothing here is fetched at run time.
export const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
export type Lang = (typeof LANGS)[number];
export const RTL: readonly Lang[] = ["ar", "ur"];
export const PACK_VERSION = 1;

/** A dated event joined to the one place where it happened. Years are CE; `h` is the Hijri year when recorded. */
export interface PackEvent { id: string; y: number; h: number; place: string }
/** A person with a recorded year of birth and death and, when recorded, the place of birth. */
export interface PackPerson { id: string; born: number; died: number; place: string | null }
export interface PackFile {
  format: "im.daily.pack";
  version: number;
  /** The commit of the museum's data the pack was built from. */
  from: string;
  places: string[];
  events: PackEvent[];
  persons: PackPerson[];
}
/** Per language (words.v1.<lang>.json): the keyboard's letters, Kalima's words (4 to 6 letters) and The Lantern's names. */
export interface WordFile {
  alphabet: string;
  words: Array<{ id: string; w: string }>;
  phrases: Array<{ id: string; p: string }>;
}
/** Per language: a record id's name and, when the record has one in this language, its first sentence. */
export type PackLabels = Record<string, [string] | [string, string]>;

/** The museum page of a record. */
export const recordUrl = (lang: Lang, id: string): string => `https://islam.museum/${lang}/${id}/`;
