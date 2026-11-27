// Letters and names: how the word games compare a guess with the answer, in every script the museum writes.
import type { Lang } from "./pack";

/** Honorifics are rendered by the museum's interface and never typed (AGENTS.md); text that types one is not shown. */
export const HONORIFIC = /ﷺ|ﷻ|صلى الله|صلي الله|عليه السلام|عليهم السلام|رضي الله|رحمه الله|صلی اللہ|علیہ السلام|رضی اللہ|رحمۃ اللہ|\b(?:SAW|SAWS|PBUH|SWT|RA|AS)\b|\((?:s|as|ra|saw|pbuh)\)/u;

const ARABIC_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
/** A name made comparable: marks and the elongation stroke removed, alef forms unified, lower case in the language. */
export function normalizeWord(s: string, lang: Lang): string {
  let t = s.normalize("NFC").replace(/[⁦-⁩‌‍‎‏]/g, "").trim();
  if (lang === "ar" || lang === "ur") t = t.replace(ARABIC_MARKS, "").replace(/[أإآٱ]/g, "ا");
  else t = t.toLocaleLowerCase(lang === "tr" ? "tr" : lang).replace(/[’`]/g, "'");
  return t.replace(/\s+/g, " ");
}
/** The letters of a word or name, without spaces, hyphens or apostrophes. */
export const letters = (s: string): string[] => [...s].filter((c) => /\p{L}/u.test(c));
/** Folds a Latin letter to its plain form, for matching a keyboard key with an accented letter (é is played as e). */
export function fold(c: string, lang: Lang): string {
  if (lang === "ar" || lang === "ur" || lang === "tr") return c;
  if (lang === "es" && c === "ñ") return c;
  return c.normalize("NFD").replace(/\p{M}/gu, "");
}
