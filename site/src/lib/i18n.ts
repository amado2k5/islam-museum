import { readFileSync } from "node:fs";
import { repoPath } from "./paths";
import { parse } from "yaml";

export const LANGS = ["en", "ar"] as const;
export type Lang = (typeof LANGS)[number];
export const other = (l: Lang): Lang => (l === "en" ? "ar" : "en");

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

export const t = (lang: Lang, path: string): string => path.split(".").reduce((o: any, k) => o?.[k], ui(lang)) ?? path;
