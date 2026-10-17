import { readFileSync } from "node:fs";
import { repoPath } from "./paths";
import { parse } from "yaml";

// Arabic canonical, English published beside it (docs/language.md): /ar/ and /en/ ship together.
export const LANGS = ["ar", "en", "ur"] as const;
export const ALL_LANGS = ["ar", "en", "ur"] as const;
export type Lang = "ar" | "en" | "ur";
/** The next language in the switcher cycle: ar → en → ur → ar. */
export const nextLang = (l: Lang): Lang => LANGS[(LANGS.indexOf(l) + 1) % LANGS.length];
/** Languages whose UI and prose share the Arabic script and the Naskh faces. */
export const ARABIC_SCRIPT: readonly Lang[] = ["ar", "ur"];

const cache = new Map<string, any>();
export function ui(lang: Lang): any {
  if (!cache.has(lang)) cache.set(lang, parse(readFileSync(repoPath("i18n", `${lang}.yaml`), "utf8")));
  return cache.get(lang);
}

/** Interpolate {name} placeholders. */
export const fmt = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);

export const WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"] as const;
export type Wing = (typeof WINGS)[number];

export const WING_PATH: Record<Wing, string> = { time: "time", place: "place", people: "people", ideas: "ideas", objects: "objects", words: "words", living: "living", today: "today", made: "made" };
export const wingHref = (lang: Lang, w: Wing) => `/${lang}/${WING_PATH[w]}/`;
/** The language the AR | EN switch links to. */
export const other = (l: Lang): Lang => (l === "en" ? "ar" : "en");

export const t = (lang: Lang, path: string): string => path.split(".").reduce((o: any, k) => o?.[k], ui(lang)) ?? path;
