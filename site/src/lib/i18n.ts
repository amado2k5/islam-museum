import { readFileSync } from "node:fs";
import { repoPath } from "./paths";
import { parse } from "yaml";

// Arabic canonical, English, Urdu, French and Spanish published beside it (docs/language.md): /ar/, /en/, /ur/, /fr/ and /es/ ship together.
export const ALL_LANGS = ["ar", "en", "ur", "fr", "es"] as const;
export type Lang = "ar" | "en" | "ur" | "fr" | "es";
// The languages this build writes pages for: all of them, unless BUILD_LANG names one (the by-language build,
// .github/workflows/build-lang.yml, docs/engineering/06-deployment.md section 9). Page files build their paths from
// LANGS. Whatever a page says about the other languages (hreflang alternates, the language switcher, counts) reads
// ALL_LANGS, so a page built alone is the same page the full build writes.
const only = process.env.BUILD_LANG || "";
if (only && !(ALL_LANGS as readonly string[]).includes(only)) throw new Error(`BUILD_LANG="${only}" is not a language of the site (${ALL_LANGS.join(", ")})`);
export const LANGS: readonly Lang[] = only ? [only as Lang] : ALL_LANGS;
/** The next language in the switcher cycle: ar → en → ur → fr → es → ar. */
export const nextLang = (l: Lang): Lang => ALL_LANGS[(ALL_LANGS.indexOf(l) + 1) % ALL_LANGS.length];
/** Languages whose UI and prose share the Arabic script and the Naskh faces. */
export const ARABIC_SCRIPT: readonly Lang[] = ["ar", "ur"];
/** Open Graph locale per language. */
export const OG_LOCALE: Record<Lang, string> = { ar: "ar_AR", en: "en_US", ur: "ur_PK", fr: "fr_FR", es: "es_ES" };
/** Intl locale for numbers: Western digits everywhere (docs/language.md), grouping per language. */
export const NUM_LOCALE: Record<Lang, string> = { ar: "ar-EG-u-nu-latn", en: "en-GB", ur: "ur-PK-u-nu-latn", fr: "fr-FR", es: "es-ES" };

const cache = new Map<string, any>();
/** Fill keys a language has not translated yet from English, so a page renders instead of crashing. */
const fillMissing = (target: any, base: any): any => {
  for (const k of Object.keys(base)) {
    const v = base[k];
    if (v && typeof v === "object" && !Array.isArray(v)) target[k] = fillMissing(target[k] && typeof target[k] === "object" ? target[k] : {}, v);
    else if (target[k] === undefined) target[k] = v;
  }
  return target;
};
export function ui(lang: Lang): any {
  if (!cache.has(lang)) {
    const data = parse(readFileSync(repoPath("i18n", `${lang}.yaml`), "utf8"));
    cache.set(lang, lang === "en" ? data : fillMissing(data, ui("en")));
  }
  return cache.get(lang);
}

/** Languages whose dataset fields are optional until their lane lands them (docs/agents/lanes/french.md, spanish.md). */
export const OPTIONAL_LANGS: readonly Lang[] = ["fr", "es"];
/**
 * Fill the optional languages of every localized leaf ({ ar, en, ur, … }) of a parsed dataset from English, then Arabic,
 * so a page that reads `field[lang]` renders in the fallback language instead of printing "undefined" or throwing.
 * In memory only: the YAML is untouched, and the loaders' own checks on ar, en and ur still see what was written.
 */
export function backfillLangs<T>(v: T): T {
  if (Array.isArray(v)) v.forEach(backfillLangs);
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const leaf = (x: unknown) => typeof x === "string" || Array.isArray(x);
    if (leaf(o.ar) && (leaf(o.en) || leaf(o.ur))) for (const l of OPTIONAL_LANGS) if (o[l] === undefined) o[l] = o.en ?? o.ar;
    for (const k of Object.keys(o)) backfillLangs(o[k]);
  }
  return v;
}
/** `parse` for the per-language datasets (edu/, kids/, tour/, cards/): the YAML with its optional languages backfilled. */
export const parseLocalized = (text: string): any => backfillLangs(parse(text));

/** Interpolate {name} placeholders. */
export const fmt = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);

export const WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"] as const;
export type Wing = (typeof WINGS)[number];

export const WING_PATH: Record<Wing, string> = { time: "time", place: "place", people: "people", ideas: "ideas", objects: "objects", words: "words", living: "living", today: "today", made: "made" };
export const wingHref = (lang: Lang, w: Wing) => `/${lang}/${WING_PATH[w]}/`;
/** The language the AR | EN switch links to. */
export const other = (l: Lang): Lang => (l === "en" ? "ar" : "en");

export const t = (lang: Lang, path: string): string => path.split(".").reduce((o: any, k) => o?.[k], ui(lang)) ?? path;
