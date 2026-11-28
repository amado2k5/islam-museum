// Loads what a daily game needs, all of it built into the release: the shared and the game's strings, and the pack.
import type { PackFile, PackLabels, WordFile } from "./pack";
import { lang, type Strings } from "./ui";

export const sharedStrings = (): Promise<Strings> => import(`../i18n/${lang}.json`).then((m) => m.default as Strings);
export const loadPack = (): Promise<PackFile> => import("../data/pack.v1.json").then((m) => m.default as unknown as PackFile);
export const loadLabels = (): Promise<PackLabels> => import(`../data/labels.v1.${lang}.json`).then((m) => m.default as PackLabels);
/** The names of the word game's own words only: what Kalima needs, without the whole label file. */
export const loadWordLabels = (): Promise<PackLabels> => import(`../data/word-labels.v1.${lang}.json`).then((m) => m.default as PackLabels);
/** The names of the Lantern's own phrases only. */
export const loadPhraseLabels = (): Promise<PackLabels> => import(`../data/phrase-labels.v1.${lang}.json`).then((m) => m.default as PackLabels);
export const loadWords = (): Promise<WordFile> => import(`../data/words.v1.${lang}.json`).then((m) => m.default as WordFile);
/** A record's name in the page's language, with its first sentence when the museum has one in that language. */
export const namer = (labels: PackLabels) => ({
  name: (id: string): string => labels[id]?.[0] ?? id.split("/")[1]!.replace(/-/g, " "),
  line: (id: string): string | null => labels[id]?.[1] ?? null,
});
