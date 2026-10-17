// Kids' Wing data helpers: quest stops + programmatic honorifics (never typed by hand).
// Honorific policy mirrors lib/markdown.ts honorify(): the strings live only in code,
// appended at render time to plain names that come from data files.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";

export interface Bilingual { ar: string; en: string }

export interface QuestStop {
  slug: string;
  icon: string;
  name: Bilingual;
  title: Bilingual;
  story: Bilingual;
  value: Bilingual;
  value_icon: string;
  question: Bilingual;
  choices: Bilingual[];
  feedback: Bilingual;
}

/** View model for ProphetQuest.astro: lang-selected fields, story already honorified + HTML-escaped. */
export interface QuestStopView {
  slug: string;
  icon: string;
  name: string;
  title: string;
  storyHtml: string;
  value: string;
  valueIcon: string;
  question: string;
  choices: string[];
  feedback: string;
}

export function loadQuestStops(): QuestStop[] {
  const raw = parse(readFileSync(repoPath("kids/quest-stops.yaml"), "utf8")) as { stops?: QuestStop[] };
  if (!raw?.stops?.length) throw new Error("kids/quest-stops.yaml: no stops found");
  return raw.stops;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Appends «عليه السلام» (ar) / "(peace be upon him)" (en) after the FIRST mention
 * of each name in `names`. HTML-escapes first; names come from data, never typed here.
 */
export function kidsHonorify(text: string, lang: Lang, names: string[]): string {
  let t = esc(text);
  const suffix = lang === "ar" ? "عليه السلام" : "(peace be upon him)";
  for (const name of names) {
    if (!name) continue;
    const i = t.indexOf(name);
    if (i < 0) continue;
    t = t.slice(0, i + name.length) + " " + suffix + t.slice(i + name.length);
  }
  return t;
}

/** Select the page language and honorify each stop's story with that stop's prophet name. */
export function viewQuestStops(stops: QuestStop[], lang: Lang): QuestStopView[] {
  return stops.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    name: s.name[lang],
    title: s.title[lang],
    storyHtml: kidsHonorify(s.story[lang], lang, [s.name[lang]]),
    value: s.value[lang],
    valueIcon: s.value_icon,
    question: s.question[lang],
    choices: s.choices.map((c) => c[lang]),
    feedback: s.feedback[lang],
  }));
}
