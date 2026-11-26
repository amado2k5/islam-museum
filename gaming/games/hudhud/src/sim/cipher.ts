// The secret page's rules: a page of the Atlas has had its signs changed into marks, one mark for each sign. The
// player counts the signs of a long sample from an undamaged page, counts the marks of the secret message, and gives
// each mark the sign it stands for. If every mark is right the page reads. Pure rules over plain data: nothing here
// draws and nothing here is left to chance. The al-Kindi quest (content/cipher, ui/cipher) is built on it.
//
// What it is for first: the museum's record (invention/frequency-analysis-al-kindi) says that al-Kindi counts and
// ranks the letters of a sample of a known language, compares that ranking with the symbols of the secret message,
// warns that a short message can mislead, and tests a guess by neighbouring letters and by the usual openings of
// messages. The signs, the marks, the page and the idea of giving each mark a sign are the game's own (review
// ledger, HR-HH-14 to HR-HH-16).
export type CipherStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the messenger was answered kindly. `answered` is only that he or she was answered at all, so that
// the question is not asked again after a resume (the same arrangement as the elephant clock's apprentice).
export const CIPHER_FLAGS = ["askedCount", "askedShort", "kind", "feather", "answered"] as const;
export type CipherFlag = (typeof CIPHER_FLAGS)[number];

export interface CipherPuzzle {
  /** The plain signs, by id. */
  signs: string[];
  /** Every mark there is, by id: one for each sign. Some may not appear in the message. */
  marks: string[];
  /** A long row of signs from an undamaged page. */
  sample: string[];
  /** The secret message: a row of marks. */
  message: string[];
  /** What each mark stands for. A bijection between `marks` and `signs`. */
  key: Record<string, string>;
}
/** What a reading showed. */
export interface Reading {
  /** Every mark in the message had a sign when the page was read. If not, nothing was counted. */
  complete: boolean;
  /** Marks in the message that are right, and how many marks the message has. Counted by mark, not by place. */
  right: number;
  total: number;
  /** The marks that are wrong or have no sign, in order of rank. */
  wrong: string[];
  ok: boolean;
}
export interface CipherState {
  style: CipherStyle;
  puzzle: CipherPuzzle;
  /** The sign given to each mark so far; a mark with no entry has none. */
  guess: Record<string, string>;
  /** How many times the page was read with every mark given a sign, and how many of those failed. */
  reads: number;
  fails: number;
  flags: CipherFlag[];
  /** What the last reading showed; null after any change. */
  last: Reading | null;
  done: boolean;
}
export type CipherCommand = { type: "assign"; mark: string; sign: string | null } | { type: "read" } | { type: "flag"; flag: CipherFlag };

/** How often each id occurs in a row. Ids that do not occur are absent. */
export function counts(seq: readonly string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of seq) out[x] = (out[x] ?? 0) + 1;
  return out;
}
/** The ids of a row from the most frequent to the fewest. Equal counts are put in order of id, so the order never depends on chance. */
export function ranked(seq: readonly string[]): { id: string; count: number }[] {
  return Object.entries(counts(seq))
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
/** Marks that have the same count as another mark: the places where ranking alone cannot tell which is which. */
export function tied(seq: readonly string[]): string[][] {
  const by: Record<number, string[]> = {};
  for (const r of ranked(seq)) (by[r.count] ??= []).push(r.id);
  return Object.values(by).filter((g) => g.length > 1);
}
/** The answer that ranking alone would give: the commonest mark for the commonest sign, and so on down. Ties go by id. */
export function rankGuess(sample: readonly string[], message: readonly string[]): Record<string, string> {
  const signs = ranked(sample);
  const out: Record<string, string> = {};
  ranked(message).forEach((m, i) => {
    if (signs[i]) out[m.id] = signs[i]!.id;
  });
  return out;
}
/** The message read with a guess: a sign for each mark, or null where a mark has none. */
export const decode = (message: readonly string[], guess: Readonly<Record<string, string>>): (string | null)[] => message.map((m) => guess[m] ?? null);
/** The plain text of the message: what it says when every mark is read rightly. */
export const plain = (p: CipherPuzzle): string[] => p.message.map((m) => p.key[m]!);
/** The marks that occur in the message, from the most frequent to the fewest. */
export const used = (p: CipherPuzzle): string[] => ranked(p.message).map((r) => r.id);

export function newCipher(style: CipherStyle, puzzle: CipherPuzzle): CipherState {
  return { style, puzzle, guess: {}, reads: 0, fails: 0, flags: [], last: null, done: false };
}

/**
 * A mark is given a sign, or none (null). A sign can stand for one mark only: giving it to another mark takes it from
 * the first. A mark that is not in the message, or a sign that is not on the page, changes nothing.
 */
export function assign(s: CipherState, mark: string, sign: string | null): CipherState {
  if (s.done || !s.puzzle.message.includes(mark)) return s;
  if (sign !== null && !s.puzzle.signs.includes(sign)) return s;
  if ((s.guess[mark] ?? null) === sign) return s;
  const guess: Record<string, string> = {};
  for (const [m, x] of Object.entries(s.guess)) if (m !== mark && x !== sign) guess[m] = x;
  if (sign !== null) guess[mark] = sign;
  return { ...s, guess, last: null };
}

/**
 * The page is read. If a mark in the message has no sign yet nothing is counted and the reading only says so. Otherwise
 * it is a reading: if every mark is right the page is read and the quest is done; if not, how many marks were right
 * and which were wrong are shown (how much of that is said depends on the way of playing: see ui/cipher).
 */
export function read(s: CipherState): CipherState {
  if (s.done) return s;
  const marks = used(s.puzzle);
  const total = marks.length;
  const right = marks.filter((m) => s.guess[m] === s.puzzle.key[m]).length;
  const wrong = marks.filter((m) => s.guess[m] !== s.puzzle.key[m]);
  if (marks.some((m) => s.guess[m] === undefined)) return { ...s, last: { complete: false, right, total, wrong, ok: false } };
  const ok = wrong.length === 0;
  return { ...s, reads: s.reads + 1, fails: s.fails + (ok ? 0 : 1), last: { complete: true, right, total, wrong, ok }, done: ok };
}

export function applyCipher(s: CipherState, c: CipherCommand): CipherState {
  if (s.done) return s;
  if (c.type === "flag") return !CIPHER_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  if (c.type === "assign") return assign(s, c.mark, c.sign);
  return read(s);
}

/** The four goals, in the shape every quest's record has. `slack` is the failed readings allowed; null is no count. */
export function cipherGoals(s: CipherState, slack: number | null): { turns: number; fails: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: CipherFlag) => s.flags.includes(f);
  return { turns: s.reads, fails: s.fails, curiosity: has("askedCount") && has("askedShort"), ingenuity: slack === null || s.fails <= slack, kindness: has("kind"), feather: has("feather") };
}

/** What is kept of a page in progress: enough to put the bench back, and nothing that cannot be checked. */
export interface CipherSnapshot {
  style: CipherStyle;
  guess: Record<string, string>;
  fails: number;
  flags: CipherFlag[];
}
export function snapshotCipher(s: CipherState): CipherSnapshot {
  return { style: s.style, guess: { ...s.guess }, fails: s.fails, flags: [...s.flags] };
}
/**
 * A page put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * puzzle is built afresh for the style (`puzzleOf`) and only a valid partial guess, the count of failed readings and
 * the known flags are laid over it. What the last reading showed is not kept, and a page is never restored as read.
 */
export function restoreCipher(x: unknown, puzzleOf: (style: CipherStyle) => CipherPuzzle): CipherState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newCipher(o.style, puzzleOf(o.style));
  if (typeof o.guess !== "object" || o.guess === null || Array.isArray(o.guess)) return null;
  const guess: Record<string, string> = {};
  const given = new Set<string>();
  for (const [mark, sign] of Object.entries(o.guess as Record<string, unknown>)) {
    // A mark that is in the message, a sign that is on the page, and a sign that stands for one mark only.
    if (!base.puzzle.message.includes(mark) || typeof sign !== "string" || !base.puzzle.signs.includes(sign) || given.has(sign)) return null;
    given.add(sign);
    guess[mark] = sign;
  }
  if (typeof o.fails !== "number" || !Number.isInteger(o.fails) || o.fails < 0 || o.fails > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  const flags = CIPHER_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, guess, fails: o.fails, flags: [...flags] };
}
