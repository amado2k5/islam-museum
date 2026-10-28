// Timeline Explorer helpers (correction prompt §5). Reads the build output of scripts/time-browser-explorer.ts
// (.cache/time-browser/explorer.json). A missing file fails the build. Dates are formatted here, per locale,
// with the museum's own date rules (lib/dates.ts): raw EDTF strings never reach a page.
import { readFileSync } from "node:fs";
import { repoPath } from "./paths";
import { formatDate, yearOf } from "./dates";
import type { Lang } from "./i18n";

type Text = Partial<Record<Lang, string>>;
export interface DateObj { edtf?: string; hijri?: string; calendar?: string; precision?: string; status?: string; derived?: boolean }
export interface ExplorerNode {
  id: string; role: "birth" | "event" | "death"; entity: string; title: Text; summary: Text; kids: Text | null;
  date: DateObj; key: number; sources: string[];
  place: { id: string; label: Text; coordinates: [number, number] | null } | null;
}
export interface Subject {
  id: string; kind: "person" | "era" | "place"; title: Text; summary: Text; sources: string[]; journey: boolean;
  nodes: ExplorerNode[]; persons: { id: string; label: Text }[];
  places: { id: string; label: Text; coordinates: [number, number] | null }[]; sourceLabels: Record<string, string>;
}

let cache: Subject[] | null = null;
export function subjects(): Subject[] {
  if (!cache) cache = (JSON.parse(readFileSync(repoPath(".cache", "time-browser", "explorer.json"), "utf8")) as { subjects: Subject[] }).subjects;
  return cache;
}
export const subjectIds = () => new Set(subjects().map((s) => s.id));

/** The subject's stage page: /<lang>/time-browser/s/<class>/<slug>/ (the id is "class/slug"). */
export const subjectHref = (lang: Lang, id: string) => `/${lang}/time-browser/s/${id}/`;
/** An entity's own museum page. */
export const entityHref = (lang: Lang, id: string) => `/${lang}/${id}/`;

/** Text in the page's language, or Arabic with lang="ar" when there is no translation (DESIGN §3). */
export const pick = (t: Text, lang: Lang) => t[lang] ?? t.ar ?? t.en ?? "";
export const langOf = (t: Text, lang: Lang): Lang => (t[lang] ? lang : t.ar ? "ar" : "en");

/** A node's date for visitors: Hijri and Gregorian in the museum's format, plus status flags for the chips. */
export function nodeDate(d: DateObj, lang: Lang) {
  const { text } = formatDate(d, lang);
  const y = yearOf(d);
  return {
    text,
    year: y,
    approx: /[~?]/.test(d.edtf ?? "") || /[~?]/.test(d.hijri ?? "") || d.status === "tradition",
    debated: d.status === "debated" || d.status === "legend",
    preHijra: y !== undefined && y < 622,
  };
}
