// Kalima and The Lantern: the day's word or name, and how a guess is judged. Each language has its own list, drawn
// from the museum's own names in that language, and walks through it in a fixed shuffled order, so no word comes
// back until the whole list has been played.
import type { Lang, WordFile } from "./pack";
import { dayNumber, rng, shuffle } from "./seed";
import { fold, letters } from "./text";

export const KALIMA_TRIES = 6;
export const LANTERN_DROPS = 7;

function nth<T>(list: T[], key: string, n: number): T {
  const order = shuffle(rng(key), list);
  return order[((n % order.length) + order.length) % order.length]!;
}
export const dailyWord = (f: WordFile, lang: Lang, date: string) => nth(f.words, `kalima:v1:${lang}`, dayNumber(date));
export const dailyPhrase = (f: WordFile, lang: Lang, date: string) => nth(f.phrases, `lantern:v1:${lang}`, dayNumber(date));
export const practiceWord = (f: WordFile, seed: string) => nth(f.words, `kalima-practice:${seed}`, 0);
export const practicePhrase = (f: WordFile, seed: string) => nth(f.phrases, `lantern-practice:${seed}`, 0);

export type Mark = "hit" | "near" | "miss";
/** Judges a guess against the answer, letter by letter; a repeated letter is marked only as often as the answer has it. */
export function judge(guess: string[], answer: string[], lang: Lang): Mark[] {
  const g = guess.map((c) => fold(c, lang)), a = answer.map((c) => fold(c, lang));
  const marks: Mark[] = g.map(() => "miss");
  const left = new Map<string, number>();
  a.forEach((c, i) => {
    if (g[i] === c) marks[i] = "hit";
    else left.set(c, (left.get(c) ?? 0) + 1);
  });
  g.forEach((c, i) => {
    if (marks[i] === "hit") return;
    const n = left.get(c) ?? 0;
    if (n > 0) { marks[i] = "near"; left.set(c, n - 1); }
  });
  return marks;
}
export const wordLetters = (w: string): string[] => letters(w);

/** The Lantern: which letters of the name are still hidden after the given guesses. */
export function hidden(phrase: string, guessed: Set<string>, lang: Lang): number {
  return letters(phrase).filter((c) => !guessed.has(fold(c, lang))).length;
}
export function misses(phrase: string, guessed: Set<string>, lang: Lang): number {
  const inName = new Set(letters(phrase).map((c) => fold(c, lang)));
  return [...guessed].filter((c) => !inName.has(c)).length;
}
