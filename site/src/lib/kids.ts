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

/** The text for a language; the stops are written in Arabic and English only, so Urdu falls back to English. */
const pick = <T>(b: { ar: T; en: T }, lang: Lang): T => (lang === "ar" ? b.ar : b.en);

/** Select the page language and honorify each stop's story with that stop's prophet name. */
export function viewQuestStops(stops: QuestStop[], lang: Lang): QuestStopView[] {
  return stops.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    name: pick(s.name, lang),
    title: pick(s.title, lang),
    storyHtml: kidsHonorify(pick(s.story, lang), lang, [pick(s.name, lang)]),
    value: pick(s.value, lang),
    valueIcon: s.value_icon,
    question: pick(s.question, lang),
    choices: s.choices.map((c) => pick(c, lang)),
    feedback: pick(s.feedback, lang),
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
  return deeds.map((d) => ({ day: d.day, icon: d.icon, deed: pick(d.deed, lang) }));
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
    prophet: pick(s.prophet, lang),
    title: pick(s.title, lang),
    bodyHtml: kidsHonorify(pick(s.body, lang), lang, [pick(s.prophet, lang)]),
    talk: pick(s.talk, lang),
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
      lineHtml: kidsHonorify(line, lang, [pick(s.name, lang)]),
    };
  });
}

/** Bilingual string list: every string has an ar and an en entry. */
export interface BilingualList { ar: string[]; en: string[] }

// ---------- Retell (Phase 4) ----------

/** Guiding prompts for the "retell the story" activity, one entry per quest stop. */
export interface RetellEntry {
  stop_slug: string;
  prompts: BilingualList;
}

export function loadRetell(): RetellEntry[] {
  const raw = parse(readFileSync(repoPath("kids/retell.yaml"), "utf8")) as { retell?: RetellEntry[] };
  const items = raw?.retell;
  if (!items?.length) throw new Error("kids/retell.yaml: no retell entries found");
  // Must cover exactly the quest stop slugs — no more, no fewer, no duplicates.
  const stopSlugs = loadQuestStops().map((s) => s.slug);
  const got = items.map((e) => e.stop_slug);
  if (
    got.length !== stopSlugs.length ||
    new Set(got).size !== stopSlugs.length ||
    !stopSlugs.every((s) => got.includes(s))
  )
    throw new Error("kids/retell.yaml: entries must cover exactly the quest stop slugs");
  for (const e of items) {
    if (e.prompts?.ar?.length !== 3 || e.prompts?.en?.length !== 3)
      throw new Error(
        `kids/retell.yaml: entry ${e.stop_slug || "?"} needs stop_slug + exactly 3 ar and 3 en prompts`
      );
  }
  return items;
}

/** View model for the retell activity: lang-selected prompts per stop slug. */
export interface RetellEntryView {
  stop_slug: string;
  prompts: string[];
}

export function viewRetell(entries: RetellEntry[], lang: Lang): RetellEntryView[] {
  return entries.map((e) => ({ stop_slug: e.stop_slug, prompts: pick(e.prompts, lang) }));
}

// ---------- Bridge cards (Phase 4) ----------

export type BridgeKind = "story" | "explain" | "word";

/** "Ready for the big museum?" card linking kids to a real main-museum cards page. */
export interface BridgeCard {
  slug: string;
  kind: BridgeKind;
  title: Bilingual;
  desc: Bilingual;
}

/** View model for the bridge cards: lang-selected text + full page href. */
export interface BridgeCardView {
  slug: string;
  kind: BridgeKind;
  title: string;
  desc: string;
  href: string;
}

/** The cards data file backing each kind: the linked page must exist in the cards corpus. */
function bridgeSourceFile(kind: BridgeKind, slug: string): string {
  switch (kind) {
    case "story":
      return `cards/stories/${slug}.yaml`;
    case "explain":
      return `cards/explainers/${slug}.yaml`;
    case "word":
      return `cards/wordmap/${slug}.json`;
  }
}

export function loadBridge(): BridgeCard[] {
  const raw = parse(readFileSync(repoPath("kids/bridge.yaml"), "utf8")) as { bridge?: BridgeCard[] };
  const cards = raw?.bridge;
  if (!cards?.length) throw new Error("kids/bridge.yaml: no bridge cards found");
  for (const c of cards) {
    if (!c.slug || (c.kind !== "story" && c.kind !== "explain" && c.kind !== "word"))
      throw new Error(`kids/bridge.yaml: card ${c.slug || "?"} has a bad slug or kind`);
    if (!c.title?.ar || !c.title?.en || !c.desc?.ar || !c.desc?.en)
      throw new Error(`kids/bridge.yaml: card ${c.slug} needs a bilingual title + desc`);
    if (!existsSync(repoPath(bridgeSourceFile(c.kind, c.slug))))
      throw new Error(`kids/bridge.yaml: source data file missing for ${c.kind}/${c.slug}`);
  }
  return cards;
}

/** Build the page href for a bridge card: /{lang}/cards/{kind}/{slug}/ */
export function bridgeHref(card: { kind: BridgeKind; slug: string }, lang: Lang): string {
  return `/${lang}/cards/${card.kind}/${card.slug}/`;
}

/** Select the page language and attach each card's href. */
export function viewBridge(cards: BridgeCard[], lang: Lang): BridgeCardView[] {
  return cards.map((c) => ({
    slug: c.slug,
    kind: c.kind,
    title: pick(c.title, lang),
    desc: pick(c.desc, lang),
    href: bridgeHref(c, lang),
  }));
}

// ---------- Lesson plans (Phase 5) ----------

export interface LessonFlowStep {
  t: string;
  what: string;
}

/** One 40-minute classroom unit. experience_href has no lang prefix; the page adds it. */
export interface LessonUnit {
  unit_slug: string;
  experience_href: string;
  objectives: BilingualList;
  flow_40min: { ar: LessonFlowStep[]; en: LessonFlowStep[] };
  discussion_prompts: BilingualList;
  worksheet: BilingualList;
}

/** View model for a lesson plan: lang-selected fields. */
export interface LessonUnitView {
  unit_slug: string;
  experience_href: string;
  objectives: string[];
  flow_40min: LessonFlowStep[];
  discussion_prompts: string[];
  worksheet: string[];
}

/** Known kids' experience hrefs, by unit. retell/journal pages are Phase 4 builds. */
const KNOWN_EXPERIENCE_HREFS = [
  "/sighar/garden/",
  "/sighar/quest/",
  "/sighar/kindness/",
  "/sighar/stories/",
  "/sighar/retell/",
  "/sighar/journal/",
] as const;

export function loadLessons(): LessonUnit[] {
  const raw = parse(readFileSync(repoPath("kids/lessons.yaml"), "utf8")) as { lessons?: LessonUnit[] };
  const units = raw?.lessons;
  if (!units?.length) throw new Error("kids/lessons.yaml: no lesson units found");
  const slugs = new Set(units.map((u) => u.unit_slug));
  if (slugs.size !== units.length) throw new Error("kids/lessons.yaml: duplicate unit_slug");
  const expected = ["garden", "quest", "kindness", "stories", "retell", "journal"];
  if (slugs.size !== expected.length || !expected.every((s) => slugs.has(s)))
    throw new Error(
      "kids/lessons.yaml: expected exactly the 6 unit slugs: garden, quest, kindness, stories, retell, journal"
    );
  for (const u of units) {
    if (!(KNOWN_EXPERIENCE_HREFS as readonly string[]).includes(u.experience_href))
      throw new Error(
        `kids/lessons.yaml: unit ${u.unit_slug} references unknown experience href ${u.experience_href}`
      );
    const need3 = (name: string, v: BilingualList | undefined) => {
      if (v?.ar?.length !== 3 || v?.en?.length !== 3)
        throw new Error(`kids/lessons.yaml: unit ${u.unit_slug} ${name} needs 3 ar + 3 en`);
    };
    need3("objectives", u.objectives);
    need3("discussion_prompts", u.discussion_prompts);
    if (
      (u.worksheet?.ar?.length ?? 0) < 5 ||
      (u.worksheet?.ar?.length ?? 0) > 6 ||
      (u.worksheet?.en?.length ?? 0) < 5 ||
      (u.worksheet?.en?.length ?? 0) > 6
    )
      throw new Error(`kids/lessons.yaml: unit ${u.unit_slug} worksheet needs 5-6 ar + 5-6 en`);
    const flowAr = u.flow_40min?.ar?.length ?? 0;
    const flowEn = u.flow_40min?.en?.length ?? 0;
    if (![5, 6].includes(flowAr) || ![5, 6].includes(flowEn))
      throw new Error(`kids/lessons.yaml: unit ${u.unit_slug} flow_40min needs 5-6 steps per language`);
    for (const lang of ["ar", "en"] as const)
      for (const s of pick(u.flow_40min, lang))
        if (!s?.t || !s?.what)
          throw new Error(`kids/lessons.yaml: unit ${u.unit_slug} has an empty flow step`);
  }
  return units;
}

export function viewLessons(units: LessonUnit[], lang: Lang): LessonUnitView[] {
  return units.map((u) => ({
    unit_slug: u.unit_slug,
    experience_href: u.experience_href,
    objectives: pick(u.objectives, lang),
    flow_40min: pick(u.flow_40min, lang),
    discussion_prompts: pick(u.discussion_prompts, lang),
    worksheet: pick(u.worksheet, lang),
  }));
}

/** Get one lesson unit by slug; throws when the slug is unknown. */
export function getLesson(slug: string): LessonUnit {
  const found = loadLessons().find((u) => u.unit_slug === slug);
  if (!found) throw new Error(`kids/lessons.yaml: unknown unit_slug ${slug}`);
  return found;
}

// ---------- Curriculum paths (Phase 5) ----------

export interface CurriculumPath {
  path_slug: string;
  title: Bilingual;
  desc: Bilingual;
  units: string[];
}

/** View model for a curriculum path: lang-selected text, unit slugs in order. */
export interface CurriculumPathView {
  path_slug: string;
  title: string;
  desc: string;
  units: string[];
}

export function loadPaths(): CurriculumPath[] {
  const raw = parse(readFileSync(repoPath("kids/paths.yaml"), "utf8")) as { paths?: CurriculumPath[] };
  const paths = raw?.paths;
  if (!paths?.length) throw new Error("kids/paths.yaml: no paths found");
  const slugs = new Set(paths.map((p) => p.path_slug));
  if (slugs.size !== paths.length) throw new Error("kids/paths.yaml: duplicate path_slug");
  const lessonSlugs = loadLessons().map((u) => u.unit_slug);
  for (const p of paths) {
    if (!p.title?.ar || !p.title?.en || !p.desc?.ar || !p.desc?.en)
      throw new Error(`kids/paths.yaml: path ${p.path_slug} needs a bilingual title + desc`);
    if (!p.units?.length) throw new Error(`kids/paths.yaml: path ${p.path_slug} has no units`);
    for (const u of p.units)
      if (!lessonSlugs.includes(u))
        throw new Error(`kids/paths.yaml: path ${p.path_slug} references unknown unit ${u}`);
  }
  return paths;
}

export function viewPaths(paths: CurriculumPath[], lang: Lang): CurriculumPathView[] {
  return paths.map((p) => ({
    path_slug: p.path_slug,
    title: pick(p.title, lang),
    desc: pick(p.desc, lang),
    units: p.units,
  }));
}

/** Get one curriculum path by slug; throws when the slug is unknown. */
export function getPath(slug: string): CurriculumPath {
  const found = loadPaths().find((p) => p.path_slug === slug);
  if (!found) throw new Error(`kids/paths.yaml: unknown path_slug ${slug}`);
  return found;
}

// ---------- Pilot guide (Phase 5) ----------

export interface PilotWeek {
  title: Bilingual;
  points: BilingualList;
}

export interface Pilot {
  prepare: BilingualList;
  weeks: PilotWeek[];
  feedback_questions: BilingualList;
  contact_note: Bilingual;
}

/** View model for the pilot guide: lang-selected fields. */
export interface PilotView {
  prepare: string[];
  weeks: { title: string; points: string[] }[];
  feedback_questions: string[];
  contact_note: string;
}

export function loadPilot(): Pilot {
  const raw = parse(readFileSync(repoPath("kids/pilot.yaml"), "utf8")) as Pilot;
  if (!raw) throw new Error("kids/pilot.yaml: empty");
  const p = raw;
  const prepAr = p.prepare?.ar?.length ?? 0;
  const prepEn = p.prepare?.en?.length ?? 0;
  if (prepAr < 4 || prepAr > 5 || prepEn < 4 || prepEn > 5)
    throw new Error("kids/pilot.yaml: prepare needs 4-5 ar + 4-5 en");
  if (p.weeks?.length !== 4) throw new Error("kids/pilot.yaml: expected exactly 4 weeks");
  for (const w of p.weeks) {
    if (!w?.title?.ar || !w?.title?.en) throw new Error("kids/pilot.yaml: every week needs a bilingual title");
    const ptsAr = w.points?.ar?.length ?? 0;
    const ptsEn = w.points?.en?.length ?? 0;
    if (ptsAr < 2 || ptsAr > 3 || ptsEn < 2 || ptsEn > 3)
      throw new Error("kids/pilot.yaml: every week needs 2-3 ar + 2-3 en points");
  }
  if (p.feedback_questions?.ar?.length !== 3 || p.feedback_questions?.en?.length !== 3)
    throw new Error("kids/pilot.yaml: feedback_questions needs 3 ar + 3 en");
  // The contact note must stay an obvious TODO placeholder — never a real email.
  if (!p.contact_note?.ar?.includes("TODO") || !p.contact_note?.en?.includes("TODO"))
    throw new Error("kids/pilot.yaml: contact_note must keep its TODO placeholder");
  return p;
}

export function viewPilot(pilot: Pilot, lang: Lang): PilotView {
  return {
    prepare: pick(pilot.prepare, lang),
    weeks: pilot.weeks.map((w) => ({ title: pick(w.title, lang), points: pick(w.points, lang) })),
    feedback_questions: pick(pilot.feedback_questions, lang),
    contact_note: pick(pilot.contact_note, lang),
  };
}

// ---------- Mosque parts (Phase 6) ----------

/** One part of a mosque, with a kid-friendly explanation and a real museum building as example. */
export interface MosquePart {
  slug: string;
  icon: string;
  name: Bilingual;
  what: Bilingual;
  example_building: Bilingual;
}

/** View model for the mosque-parts experience: lang-selected fields. */
export interface MosquePartView {
  slug: string;
  icon: string;
  name: string;
  what: string;
  exampleBuilding: string;
}

const EXPECTED_PART_SLUGS = [
  "dome",
  "minaret",
  "courtyard",
  "prayer-hall",
  "mihrab",
  "main-door",
  "fountain",
] as const;

export function loadMosqueParts(): MosquePart[] {
  const raw = parse(readFileSync(repoPath("kids/mosque-parts.yaml"), "utf8")) as {
    parts?: MosquePart[];
  };
  const parts = raw?.parts;
  if (!parts?.length) throw new Error("kids/mosque-parts.yaml: no parts found");
  const got = parts.map((p) => p.slug);
  if (
    got.length !== EXPECTED_PART_SLUGS.length ||
    new Set(got).size !== EXPECTED_PART_SLUGS.length ||
    !EXPECTED_PART_SLUGS.every((s) => got.includes(s))
  )
    throw new Error(
      "kids/mosque-parts.yaml: expected exactly the 7 part slugs: " + EXPECTED_PART_SLUGS.join(", ")
    );
  for (const p of parts) {
    if (
      !p.icon ||
      !p.name?.ar ||
      !p.name?.en ||
      !p.what?.ar ||
      !p.what?.en ||
      !p.example_building?.ar ||
      !p.example_building?.en
    )
      throw new Error(`kids/mosque-parts.yaml: part ${p.slug || "?"} has a missing field`);
  }
  return parts;
}

/** Select the page language for each mosque part. */
export function viewMosqueParts(parts: MosquePart[], lang: Lang): MosquePartView[] {
  return parts.map((p) => ({
    slug: p.slug,
    icon: p.icon,
    name: p.name[lang],
    what: p.what[lang],
    exampleBuilding: p.example_building[lang],
  }));
}

// ---------- Eras (Phase 6) ----------

/** One museum-sourced event inside an era: kid-safe one-liner + the entity it links to. */
export interface EraEvent {
  title: Bilingual;
  one_line: Bilingual;
  source: string;
}

/** One historical era of the time-journey experience. */
export interface Era {
  slug: string;
  title: Bilingual;
  blurb: Bilingual;
  events: EraEvent[];
}

/** View model for an era event: lang-selected fields, source entity id carried through. */
export interface EraEventView {
  title: string;
  oneLine: string;
  source: string;
}

/** View model for the eras experience: lang-selected fields. */
export interface EraView {
  slug: string;
  title: string;
  blurb: string;
  events: EraEventView[];
}

const EXPECTED_ERA_SLUGS = ["makkah", "madinah", "baghdad", "cordoba", "istanbul"] as const;

export function loadEras(): Era[] {
  const raw = parse(readFileSync(repoPath("kids/eras.yaml"), "utf8")) as { eras?: Era[] };
  const eras = raw?.eras;
  if (!eras?.length) throw new Error("kids/eras.yaml: no eras found");
  const got = eras.map((e) => e.slug);
  if (
    got.length !== EXPECTED_ERA_SLUGS.length ||
    new Set(got).size !== EXPECTED_ERA_SLUGS.length ||
    !EXPECTED_ERA_SLUGS.every((s) => got.includes(s))
  )
    throw new Error(
      "kids/eras.yaml: expected exactly the 5 era slugs: " + EXPECTED_ERA_SLUGS.join(", ")
    );
  for (const e of eras) {
    if (!e.title?.ar || !e.title?.en || !e.blurb?.ar || !e.blurb?.en)
      throw new Error(`kids/eras.yaml: era ${e.slug || "?"} needs a bilingual title + blurb`);
    if (e.events?.length !== 4)
      throw new Error(`kids/eras.yaml: era ${e.slug} needs exactly 4 events`);
    for (const ev of e.events) {
      if (!ev.title?.ar || !ev.title?.en || !ev.one_line?.ar || !ev.one_line?.en)
        throw new Error(`kids/eras.yaml: era ${e.slug} has an event with a missing title/one_line`);
      if (!ev.source)
        throw new Error(`kids/eras.yaml: era ${e.slug} has an event with an empty source`);
    }
  }
  return eras;
}

/** Prophet names as they appear in the era prose, per language (for honorific rendering). */
const ERA_PROPHET_NAMES: Record<Lang, string[]> = {
  ar: ["النبي", "إبراهيم", "إسماعيل"],
  en: ["the Prophet", "Ibrahim", "Ismail"],
};

/**
 * Select the page language for each era; honorify prophet names in prose
 * (the UI renders honorifics — authors never type them); source id passes through.
 */
export function viewEras(eras: Era[], lang: Lang): EraView[] {
  const names = ERA_PROPHET_NAMES[lang];
  return eras.map((e) => ({
    slug: e.slug,
    title: kidsHonorify(e.title[lang], lang, names),
    blurb: kidsHonorify(e.blurb[lang], lang, names),
    events: e.events.map((ev) => ({
      title: kidsHonorify(ev.title[lang], lang, names),
      oneLine: kidsHonorify(ev.one_line[lang], lang, names),
      source: ev.source,
    })),
  }));
}

