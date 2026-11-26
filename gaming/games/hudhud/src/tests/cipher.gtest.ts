// The secret page's rules: each way of playing has one answer, the claims about ranking are proved, and the four goals.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CIPHER_RECORDS, CIPHER_SLACK, MARKS, OPENING, SIGNS, cipherPuzzle } from "../content/cipher";
import { CIPHER_FLAGS, applyCipher, assign, cipherGoals, counts, decode, newCipher, plain, rankGuess, ranked, read, restoreCipher, snapshotCipher, tied, used, type CipherCommand, type CipherPuzzle, type CipherState, type CipherStyle } from "../sim/cipher";

const STYLES: CipherStyle[] = ["story", "explorer", "challenge"];
const play = (s: CipherState, cs: CipherCommand[]) => cs.reduce(applyCipher, s);
/** The commands that give every mark in the message its right sign. */
const solve = (p: CipherPuzzle): CipherCommand[] => used(p).map((mark) => ({ type: "assign", mark, sign: p.key[mark]! }));
/** Every way of giving the marks of the message different signs of the page: n marks, m signs, m!/(m-n)! of them. */
function everyGuess(p: CipherPuzzle): Record<string, string>[] {
  const marks = used(p);
  const out: Record<string, string>[] = [];
  const taken = new Set<string>();
  const row: Record<string, string> = {};
  const go = (i: number) => {
    if (i === marks.length) return void out.push({ ...row });
    for (const sign of p.signs) {
      if (taken.has(sign)) continue;
      taken.add(sign);
      row[marks[i]!] = sign;
      go(i + 1);
      taken.delete(sign);
    }
  };
  go(0);
  return out;
}
const wrongMarks = (p: CipherPuzzle, g: Record<string, string>) => used(p).filter((m) => g[m] !== p.key[m]);

describe("the secret page", () => {
  it.each(STYLES)("has a key that is a bijection between the marks and the signs, in %s", (style) => {
    const p = cipherPuzzle(style);
    expect([...p.marks].sort()).toEqual(Object.keys(p.key).sort());
    expect(new Set(Object.values(p.key)).size).toBe(p.signs.length);
    expect([...Object.values(p.key)].sort()).toEqual([...p.signs].sort());
    expect(p.marks.length).toBe(p.signs.length);
    for (const m of p.marks) expect(MARKS).toContain(m);
    for (const x of p.signs) expect(SIGNS).toContain(x);
  });
  it("is deeper in each way of playing: 5, 7 and 8 signs, and messages of 30, 24 and 15 marks", () => {
    const of = (style: CipherStyle) => ({ signs: cipherPuzzle(style).signs.length, message: cipherPuzzle(style).message.length, marks: used(cipherPuzzle(style)).length, ties: tied(cipherPuzzle(style).message).length });
    expect(of("story")).toEqual({ signs: 5, message: 30, marks: 5, ties: 0 });
    expect(of("explorer")).toEqual({ signs: 7, message: 24, marks: 7, ties: 1 });
    expect(of("challenge")).toEqual({ signs: 8, message: 15, marks: 6, ties: 2 });
    expect(CIPHER_SLACK).toEqual({ story: null, explorer: 2, challenge: 1 });
  });
  it.each(STYLES)("has a long sample in which every sign has a different count, in %s", (style) => {
    const p = cipherPuzzle(style);
    expect(p.sample.length).toBeGreaterThanOrEqual(40);
    expect(p.sample.length).toBeLessThanOrEqual(60);
    expect(Object.keys(counts(p.sample)).sort()).toEqual([...p.signs].sort());
    expect(tied(p.sample)).toEqual([]);
    // The message is shorter than the sample, and long enough for the picture's rows (11 or more, for the words that count it).
    expect(p.message.length).toBeLessThan(p.sample.length);
    expect(p.message.length).toBeGreaterThanOrEqual(11);
  });
  it.each(STYLES)("begins, in the sample and in the message, with the opening every page of the Atlas has, in %s", (style) => {
    const p = cipherPuzzle(style);
    expect(p.sample.slice(0, 2)).toEqual([...OPENING]);
    expect(plain(p).slice(0, 2)).toEqual([...OPENING]);
    expect(decode(p.message, p.key).slice(0, 2)).toEqual([...OPENING]);
  });
  it.each(STYLES)("reads with exactly one giving of signs to the marks, in %s", (style) => {
    const p = cipherPuzzle(style);
    const reads = everyGuess(p).filter((g) => decode(p.message, g).join() === plain(p).join());
    expect(reads).toHaveLength(1);
    expect(wrongMarks(p, reads[0]!)).toEqual([]);
    // Every giving of signs that is not that one leaves a mark wrong, so a reading counts it as a failure.
    expect(everyGuess(p).filter((g) => wrongMarks(p, g).length === 0)).toHaveLength(1);
  });
  it("Story: ranking alone gives the whole answer, the message's counts all different and in the sample's order", () => {
    const p = cipherPuzzle("story");
    expect(tied(p.message)).toEqual([]);
    expect(rankGuess(p.sample, p.message)).toEqual(p.key);
    expect(ranked(p.message).map((r) => p.key[r.id])).toEqual(ranked(p.sample).map((r) => r.id));
  });
  it("Explorer: one tie, the sun and the feather; ranking is right for every mark outside it, and wrong for the pair, which the opening settles", () => {
    const p = cipherPuzzle("explorer");
    const ties = tied(p.message);
    expect(ties).toHaveLength(1);
    expect(ties[0]!.map((m) => p.key[m]).sort()).toEqual(["feather", "sun"]);
    const guess = rankGuess(p.sample, p.message);
    const inTie = new Set(ties.flat());
    for (const m of used(p)) if (!inTie.has(m)) expect(guess[m], m).toBe(p.key[m]);
    // The pair comes out the wrong way round by ranking (the sample has the sun above the feather and the marks' ids put the feather's first).
    for (const m of inTie) expect(guess[m], m).not.toBe(p.key[m]);
    // The opening says which is which: the first mark is the feather and the second is the sun.
    expect([p.message[0], p.message[1]]).toEqual([...inTie].sort((a, b) => (p.key[a] === "feather" ? -1 : 1) - (p.key[b] === "feather" ? -1 : 1)));
  });
  it("Challenge: two ties, and ranking alone is wrong for marks outside them (the feather's and the moon's: the short message misleads)", () => {
    const p = cipherPuzzle("challenge");
    const ties = tied(p.message);
    expect(ties).toHaveLength(2);
    const names = ties.map((g) => g.map((m) => p.key[m]).sort().join("+")).sort();
    expect(names).toEqual(["leaf+sun", "star+wave"]);
    const guess = rankGuess(p.sample, p.message);
    const inTie = new Set(ties.flat());
    const wrongOutside = used(p).filter((m) => !inTie.has(m) && guess[m] !== p.key[m]);
    expect(wrongOutside.map((m) => p.key[m]).sort()).toEqual(["feather", "moon"]);
    // The sample ranks the moon above the feather; the message has the feather 5 times and the moon 4.
    expect(ranked(p.sample).map((r) => r.id).slice(0, 2)).toEqual(["moon", "feather"]);
    expect(counts(plain(p))).toMatchObject({ feather: 5, moon: 4 });
    // Two signs of the page are not in the message at all.
    expect(p.signs.filter((x) => !plain(p).includes(x)).sort()).toEqual(["key", "lamp"]);
  });
  it("counts and ranks: most to fewest, equal counts by id, and finds the ties", () => {
    expect(counts(["a", "b", "a"])).toEqual({ a: 2, b: 1 });
    expect(ranked(["b", "a", "b", "c", "a"])).toEqual([{ id: "a", count: 2 }, { id: "b", count: 2 }, { id: "c", count: 1 }]);
    expect(tied(["b", "a", "b", "c", "a"])).toEqual([["a", "b"]]);
    expect(counts([])).toEqual({});
    expect(rankGuess(["x", "x", "y"], ["m", "m", "n"])).toEqual({ m: "x", n: "y" });
  });
});

describe("giving a mark a sign", () => {
  const p = cipherPuzzle("explorer");
  const [m1, m2] = used(p) as [string, string];
  it("gives it, takes it away, and counts nothing", () => {
    let s = newCipher("explorer", p);
    s = assign(s, m1, "moon");
    expect(s.guess).toEqual({ [m1]: "moon" });
    expect([s.reads, s.fails, s.last]).toEqual([0, 0, null]);
    expect(assign(s, m1, "moon")).toBe(s);
    s = assign(s, m1, null);
    expect(s.guess).toEqual({});
    expect(assign(s, m1, null)).toBe(s);
  });
  it("lets a sign stand for one mark only: giving it to another mark frees the first", () => {
    let s = assign(newCipher("explorer", p), m1, "moon");
    s = assign(s, m2, "moon");
    expect(s.guess).toEqual({ [m2]: "moon" });
    // Giving a mark a new sign leaves its old one free for another.
    s = assign(assign(s, m2, "star"), m1, "moon");
    expect(s.guess).toEqual({ [m2]: "star", [m1]: "moon" });
  });
  it("ignores a mark that is not in the message and a sign that is not on the page", () => {
    const s = newCipher("challenge", cipherPuzzle("challenge"));
    expect(assign(s, "m1", "moon")).toBe(s); // m1 is the lamp's mark: not in this message
    expect(assign(s, "m99", "moon")).toBe(s);
    expect(assign(s, used(s.puzzle)[0]!, "nothing")).toBe(s);
    const t = newCipher("story", cipherPuzzle("story"));
    expect(assign(t, used(t.puzzle)[0]!, "lamp")).toBe(t); // the lamp is not on a Story page
  });
  it("clears what the last reading showed", () => {
    let s = play(newCipher("explorer", p), [{ type: "assign", mark: m1, sign: "moon" }]);
    s = play(s, [...solve(p).slice(1), { type: "assign", mark: m1, sign: "star" }, { type: "read" }]);
    expect(s.last).not.toBeNull();
    expect(assign(s, m1, "moon").last).toBeNull();
  });
});

describe("reading the page", () => {
  it.each(STYLES)("finishes with the right marks, and nothing more changes afterwards, in %s", (style) => {
    const p = cipherPuzzle(style);
    let s = play(newCipher(style, p), solve(p));
    expect([s.done, s.reads]).toEqual([false, 0]);
    s = play(s, [{ type: "read" }]);
    expect([s.done, s.reads, s.fails, s.last]).toEqual([true, 1, 0, { complete: true, right: used(p).length, total: used(p).length, wrong: [], ok: true }]);
    expect(play(s, [{ type: "assign", mark: used(p)[0]!, sign: null }, { type: "read" }, { type: "flag", flag: "feather" }])).toBe(s);
  });
  it("says nothing was counted when a mark has no sign yet", () => {
    const p = cipherPuzzle("story");
    let s = play(newCipher("story", p), solve(p).slice(1));
    s = play(s, [{ type: "read" }]);
    expect([s.reads, s.fails, s.done]).toEqual([0, 0, false]);
    expect(s.last).toMatchObject({ complete: false, ok: false });
    expect(s.last!.wrong).toEqual([used(p)[0]]);
  });
  it("counts a failed reading, and says which marks are wrong and how many are right", () => {
    const p = cipherPuzzle("story");
    const [a, b, ...rest] = used(p) as [string, string, ...string[]];
    // Two marks given each other's signs: the others are right.
    let s = play(newCipher("story", p), [{ type: "assign", mark: a, sign: p.key[b]! }, { type: "assign", mark: b, sign: p.key[a]! }, ...rest.map((mark): CipherCommand => ({ type: "assign", mark, sign: p.key[mark]! }))]);
    s = play(s, [{ type: "read" }]);
    expect([s.reads, s.fails, s.done]).toEqual([1, 1, false]);
    expect(s.last).toEqual({ complete: true, right: 3, total: 5, wrong: [a, b], ok: false });
    // Reading again with nothing changed counts again.
    expect(read(s).fails).toBe(2);
    // And putting it right finishes it, with the failure kept.
    s = play(s, [{ type: "assign", mark: a, sign: null }, { type: "assign", mark: b, sign: p.key[b]! }, { type: "assign", mark: a, sign: p.key[a]! }, { type: "read" }]);
    expect([s.done, s.reads, s.fails]).toEqual([true, 2, 1]);
  });
  it("has the Challenge's ranking answer fail a reading, and the Explorer's pair wrong the other way round fail one", () => {
    for (const style of ["explorer", "challenge"] as const) {
      const p = cipherPuzzle(style);
      const s = play(newCipher(style, p), [...Object.entries(rankGuess(p.sample, p.message)).filter(([m]) => used(p).includes(m)).map(([mark, sign]): CipherCommand => ({ type: "assign", mark, sign })), { type: "read" }]);
      expect([style, s.done, s.fails]).toEqual([style, false, 1]);
    }
  });
});

describe("the four goals", () => {
  it("are the same four every quest has, and Ingenuity counts failed readings only where a way of playing has a count", () => {
    const p = cipherPuzzle("explorer");
    let s = newCipher("explorer", p);
    s = play(s, [{ type: "flag", flag: "askedCount" }, { type: "flag", flag: "askedCount" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedCount"]);
    expect(cipherGoals(s, 2)).toEqual({ turns: 0, fails: 0, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = play(s, [{ type: "flag", flag: "askedShort" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
    // Three failed readings (every mark given the sign of the next one), then the right one.
    const [first, ...others] = used(p);
    const shifted = (): CipherCommand[] => [...used(p).map((m, i): CipherCommand => ({ type: "assign", mark: m, sign: p.key[used(p)[(i + 1) % used(p).length]!]! })), { type: "read" }];
    s = play(s, [...shifted(), ...shifted(), ...shifted(), ...used(p).map((m): CipherCommand => ({ type: "assign", mark: m, sign: null })), ...solve(p), { type: "read" }]);
    expect(first).toBeDefined();
    expect(others.length).toBe(6);
    expect([s.done, s.reads, s.fails]).toEqual([true, 4, 3]);
    expect(cipherGoals(s, CIPHER_SLACK.explorer)).toMatchObject({ curiosity: true, ingenuity: false, kindness: true, feather: true, turns: 4, fails: 3 });
    expect(cipherGoals(s, CIPHER_SLACK.story).ingenuity).toBe(true);
    expect(cipherGoals({ ...s, fails: 2 }, 2).ingenuity).toBe(true);
    expect(cipherGoals({ ...s, fails: 2 }, 1).ingenuity).toBe(false);
  });
  it("name the records the results link to, and both are museum records", () => {
    expect([...CIPHER_RECORDS]).toEqual(["person/al-kindi", "invention/frequency-analysis-al-kindi"]);
  });
});

describe("the secret page kept in the middle", () => {
  const through = (s: CipherState) => restoreCipher(JSON.parse(JSON.stringify(snapshotCipher(s))), cipherPuzzle);
  const started = (style: CipherStyle) => {
    const p = cipherPuzzle(style);
    const [a, b] = used(p) as [string, string];
    return play(newCipher(style, p), [{ type: "assign", mark: a, sign: p.key[a]! }, { type: "assign", mark: b, sign: p.key[a]! === "feather" ? "sun" : "feather" }, { type: "flag", flag: "feather" }]);
  };
  const snap = (style: CipherStyle) => JSON.parse(JSON.stringify(snapshotCipher(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restoreCipher(x, cipherPuzzle);

  it.each(STYLES)("comes back through JSON as it was, with no reading shown and not done, in %s", (style) => {
    const s = started(style);
    const back = through(s)!;
    expect(back).not.toBeNull();
    expect(back.guess).toEqual(s.guess);
    expect([back.style, back.flags, back.fails, back.reads, back.last, back.done]).toEqual([style, s.flags, 0, 0, null, false]);
    expect(back.puzzle).toEqual(cipherPuzzle(style));
    // And it can be played on to its end.
    expect(play(back, [...used(back.puzzle).map((m): CipherCommand => ({ type: "assign", mark: m, sign: null })), ...solve(back.puzzle), { type: "read" }]).done).toBe(true);
  });
  it("keeps a page with nothing changed too, and the count of failed readings", () => {
    expect(restoreCipher(snapshotCipher(newCipher("story", cipherPuzzle("story"))), cipherPuzzle)).not.toBeNull();
    expect(refused({ ...snap("explorer"), fails: 3 })!.fails).toBe(3);
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    expect(refused(good)).not.toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }]) expect(refused(bad)).toBeNull();
    const [a, b] = used(cipherPuzzle("explorer")) as [string, string];
    // A mark that is not in the message, a sign that is not on the page, a sign given to two marks, a value that is not a sign.
    expect(refused({ ...good, guess: { m99: "moon" } })).toBeNull();
    expect(refused({ ...good, guess: { [a]: "lamp" } })).toBeNull();
    expect(refused({ ...good, guess: { [a]: "moon", [b]: "moon" } })).toBeNull();
    expect(refused({ ...good, guess: { [a]: 3 } })).toBeNull();
    expect(refused({ ...good, guess: { [a]: null } })).toBeNull();
    expect(refused({ ...good, guess: "moon" })).toBeNull();
    expect(refused({ ...good, guess: ["moon"] })).toBeNull();
    expect(refused({ ...good, guess: null })).toBeNull();
    expect(refused({ ...good, guess: undefined })).toBeNull();
    // A mark of another way of playing: the Challenge's key mark is not in the Story's message.
    expect(refused({ ...snap("story"), guess: { m8: "moon" } })).toBeNull();
    // The count of failed readings.
    for (const fails of [-1, 1.5, "3", null, NaN, Infinity, 1e9]) expect(refused({ ...good, fails })).toBeNull();
    expect(refused({ ...good, fails: undefined })).toBeNull();
    // Flags that are not a list.
    expect(refused({ ...good, flags: "feather" })).toBeNull();
    expect(refused({ ...good, flags: undefined })).toBeNull();
  });
  it("drops flags it does not know, keeps the ones it does, and never takes a reading, a count or a finish from the file", () => {
    const back = refused({ ...snap("explorer"), flags: ["feather", "askedCount", "nonsense", 7, "kind", "kind"], reads: 5, done: true, last: { ok: true }, puzzle: { key: {} } })!;
    expect(back.flags).toEqual(["askedCount", "kind", "feather"]);
    expect([back.reads, back.done, back.last]).toEqual([0, false, null]);
    expect(back.puzzle).toEqual(cipherPuzzle("explorer"));
  });
  it("is restored with every mark right and not yet read, and one press finishes it", () => {
    const p = cipherPuzzle("story");
    const full = refused({ style: "story", guess: Object.fromEntries(used(p).map((m) => [m, p.key[m]!])), fails: 0, flags: [] })!;
    expect(full.done).toBe(false);
    expect(read(full).done).toBe(true);
  });
});

describe("the messenger's answer is kept, whichever answer it was", () => {
  it("keeps `answered` for a blunt answer too, without making it a goal, and a resume still knows", () => {
    const p = cipherPuzzle("explorer");
    const blunt = play(newCipher("explorer", p), [{ type: "flag", flag: "answered" }]);
    expect(blunt.flags).toEqual(["answered"]);
    expect(cipherGoals(blunt, 2).kindness).toBe(false);
    const back = restoreCipher(JSON.parse(JSON.stringify(snapshotCipher(blunt))), cipherPuzzle)!;
    expect(back.flags).toEqual(["answered"]);
    const kind = play(blunt, [{ type: "flag", flag: "kind" }]);
    expect(restoreCipher(JSON.parse(JSON.stringify(snapshotCipher(kind))), cipherPuzzle)!.flags).toEqual(["kind", "answered"]);
    expect([...CIPHER_FLAGS]).toEqual(["askedCount", "askedShort", "kind", "feather", "answered"]);
  });
});

describe("the secret page's words", () => {
  const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
  const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
  it.each(LANGS)("name every sign and every mark in words, and have every line of the quest, in %s", (lang) => {
    const t = table(lang);
    for (const x of SIGNS) expect(t[`cf_sign_${x}`]?.trim().length, x).toBeGreaterThan(1);
    for (const x of MARKS) expect(t[`cf_mark_${x}`]?.trim().length, x).toBeGreaterThan(1);
    // No two signs, and no two marks, share a name, so that a list of choices is never ambiguous.
    expect(new Set(SIGNS.map((x) => t[`cf_sign_${x}`])).size).toBe(SIGNS.length);
    expect(new Set(MARKS.map((x) => t[`cf_mark_${x}`])).size).toBe(MARKS.length);
    const keys = Object.keys(table("en")).filter((k) => k.startsWith("cf_"));
    expect(keys.length).toBeGreaterThan(60);
    for (const k of keys) expect(typeof t[k], k).toBe("string");
  });
  it.each(LANGS)("say the failure of a reading with the placeholders it needs, in %s", (lang) => {
    const t = table(lang);
    expect(t.cf_read_story).toContain("{list}");
    expect(t.cf_read_explorer).toContain("{right}");
    expect(t.cf_read_explorer).toContain("{total}");
    expect(t.cf_read_challenge).not.toContain("{");
    expect(t.cf_for_mark).toContain("{mark}");
    expect(t.cf_set).toContain("{sign}");
  });
});
