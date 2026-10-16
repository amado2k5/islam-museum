// Museum Cards: 30-day challenge from cards/challenge/tahaddi-30-yawman.yaml.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";

export interface Habit { ar: string; en: string; weekly: number }
export interface ChallengeFile {
  slug: string;
  title: { ar: string; en: string };
  lede: { ar: string; en: string };
  days: number;
  habits: Habit[];
  note?: { ar: string; en: string };
}

let cache: ChallengeFile | null = null;
export function loadChallenge(): ChallengeFile {
  if (cache) return cache;
  cache = parse(readFileSync(repoPath("cards/challenge/tahaddi-30-yawman.yaml"), "utf8")) as ChallengeFile;
  return cache;
}
