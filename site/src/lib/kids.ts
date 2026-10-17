// Kids' Wing data helpers: quest stops + programmatic honorifics (never typed by hand).
// Honorific policy mirrors lib/markdown.ts honorify(): the strings live only in code,
// appended at render time to plain names that come from data files.
import { existsSync, readFileSync } from "node:fs";
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
  /** Optional one-sentence warm line for the 4–6 (Buds) lane; UI honorifies it. */
  sprout?: Bilingual;
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

/** View model for KindnessQuest.astro: lang-selected deed text. */
export interface DeedView {
  day: number;
  icon: string;
  deed: string;
}

/** Select the page language for each deed (plain text, no honorifics needed). */
export function viewDeeds(deeds: Deed[], lang: Lang): DeedView[] {
  return deeds.map((d) => ({ day: d.day, icon: d.icon, deed: d.deed[lang] }));
}

export interface Deed { day: number; icon: string; deed: Bilingual }

export function loadDeeds(): Deed[] {
  const raw = parse(readFileSync(repoPath("kids/deeds.yaml"), "utf8")) as { deeds?: Deed[] };
  if (!raw?.deeds || raw.deeds.length !== 30)
    throw new Error("kids/deeds.yaml: expected exactly 30 deeds");
  const days = new Set(raw.deeds.map((d) => d.day));
  if (days.size !== 30 || ![...days].every((d) => d >= 1 && d <= 30))
    throw new Error("kids/deeds.yaml: days must be unique and cover 1..30");
  return raw.deeds;
}

export interface BedtimeStory {
  slug: string;
  icon: string;
  prophet: Bilingual;
  title: Bilingual;
  body: Bilingual;
  talk: Bilingual;
}

/** View model for the bedtime-story page: lang-selected fields, body honorified + HTML-escaped. */
export interface BedtimeStoryView {
  slug: string;
  icon: string;
  prophet: string;
  title: string;
  bodyHtml: string;
  talk: string;
  audio: boolean;
}

export function loadStories(): BedtimeStory[] {
  const raw = parse(readFileSync(repoPath("kids/stories.yaml"), "utf8")) as { stories?: BedtimeStory[] };
  if (!raw?.stories?.length) throw new Error("kids/stories.yaml: no stories found");
  return raw.stories;
}

/** True when a narration audio file has been published for this story. */
export function storyAudioExists(slug: string, lang: Lang): boolean {
  return existsSync(repoPath(`site/public/audio/kids/${slug}-${lang}.mp3`));
}

/** Select the page language; honorify each story body with that story's prophet name. */
export function viewStories(stories: BedtimeStory[], lang: Lang): BedtimeStoryView[] {
  return stories.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    prophet: s.prophet[lang],
    title: s.title[lang],
    bodyHtml: kidsHonorify(s.body[lang], lang, [s.prophet[lang]]),
    talk: s.talk[lang],
    audio: storyAudioExists(s.slug, lang),
  }));
}

export interface SproutLine { slug: string; icon: string; line: string; lineHtml: string }

/** Buds-lane (4–6) one-liners: lang-selected sprout, honorified with that stop's prophet name. */
export function viewSproutLines(stops: QuestStop[], lang: Lang): SproutLine[] {
  return stops.map((s) => {
    const line = s.sprout?.[lang] ?? "";
    return {
      slug: s.slug,
      icon: s.icon,
      line,
      lineHtml: kidsHonorify(line, lang, [s.name[lang]]),
    };
  });
}
