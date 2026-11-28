// The four small daily games: every day's puzzle can be solved, is the same for everyone that day, and every answer is
// a museum record that carries a source. The pack is checked against the museum's records as they are in this checkout.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { findBlocked } from "../../../../scripts/lib/extremism";
import { LANGS, type PackFile, type PackLabels, type WordFile } from "../src/pack";
import { QUESTIONS_PER_DAY, dailyQuiz } from "../src/questions";
import { dayNumber, puzzleNumber } from "../src/seed";
import { HONORIFIC, letters } from "../src/text";
import { THREAD_GAP, THREAD_LENGTH, dailyThread, rightPlaces } from "../src/thread";
import { KALIMA_TRIES, LANTERN_DROPS, dailyPhrase, dailyWord, hidden, judge, misses } from "../src/words";

const ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
const data = <T>(name: string): T => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")) as T;
const pack = data<PackFile>("pack.v1.json");
const labels = Object.fromEntries(LANGS.map((l) => [l, data<PackLabels>(`labels.v1.${l}.json`)])) as Record<string, PackLabels>;
const words = Object.fromEntries(LANGS.map((l) => [l, data<WordFile>(`words.v1.${l}.json`)])) as Record<string, WordFile>;
const DAYS = Array.from({ length: 400 }, (_, i) => new Date(Date.UTC(2026, 10, 26) + i * 86_400_000).toISOString().slice(0, 10));
const record = (id: string) => {
  const [cls, slug] = id.split("/");
  const path = `${ROOT}data/${cls}/${slug}.yaml`;
  return existsSync(path) ? (parse(readFileSync(path, "utf8")) as { sources?: unknown[] }) : null;
};

describe("the pack", () => {
  it("names only museum records that exist and carry a source", () => {
    const ids = new Set([...pack.places, ...pack.events.map((e) => e.id), ...pack.persons.map((p) => p.id), ...LANGS.flatMap((l) => [...words[l]!.words.map((w) => w.id), ...words[l]!.phrases.map((p) => p.id)])]);
    for (const id of ids) {
      const r = record(id);
      expect(r, id).not.toBeNull();
      expect(Array.isArray(r!.sources) && r!.sources.length > 0, `${id} has a source`).toBe(true);
    }
  });

  it("shows no honorific, no Qur'an bracket and no blocked name, in any language", () => {
    for (const l of LANGS) {
      for (const [id, v] of Object.entries(labels[l]!)) for (const text of v) {
        expect(HONORIFIC.test(text), `${l} ${id}: ${text}`).toBe(false);
        expect(/[﴿﴾]/.test(text), `${l} ${id}`).toBe(false);
        expect(findBlocked(text), `${l} ${id}`).toEqual([]);
      }
      for (const p of words[l]!.phrases) expect(findBlocked(p.p)).toEqual([]);
    }
  });

  it("has a name in every language for every record a puzzle can show", () => {
    const ids = [...pack.places, ...pack.events.map((e) => e.id), ...pack.persons.map((p) => p.id)];
    for (const l of LANGS) for (const id of ids) expect(labels[l]![id]?.[0], `${l} ${id}`).toBeTruthy();
  });

  it("has words and names enough for a year in every language, all typeable on the language's keyboard", () => {
    for (const l of LANGS) {
      const f = words[l]!;
      expect(f.words.length, `${l} words`).toBeGreaterThanOrEqual(100);
      expect(f.phrases.length, `${l} names`).toBeGreaterThanOrEqual(200);
      for (const w of f.words) {
        expect(letters(w.w).length).toBeGreaterThanOrEqual(4);
        expect(letters(w.w).length).toBeLessThanOrEqual(6);
        for (const c of w.w) expect(f.alphabet.includes(c), `${l} ${w.w}: ${c}`).toBe(true);
      }
      for (const p of f.phrases) for (const c of letters(p.p)) expect(f.alphabet.includes(c), `${l} ${p.p}: ${c}`).toBe(true);
    }
  });

  it("writes Arabic words in Arabic letters, not transliteration", () => {
    for (const w of words.ar!.words) expect(/^[ء-ي]+$/.test(w.w), w.w).toBe(true);
  });
});

describe("Five Questions", () => {
  it("is the same quiz for everyone on a day, and a different one the next day", () => {
    expect(dailyQuiz(pack, "2026-12-01")).toEqual(dailyQuiz(pack, "2026-12-01"));
    expect(dailyQuiz(pack, "2026-12-01")).not.toEqual(dailyQuiz(pack, "2026-12-02"));
  });

  it("has, every day for 400 days, five questions with one right answer each, traceable to museum records", () => {
    const events = new Map(pack.events.map((e) => [e.id, e]));
    const persons = new Map(pack.persons.map((p) => [p.id, p]));
    for (const day of DAYS) {
      const q = dailyQuiz(pack, day);
      expect(q).toHaveLength(QUESTIONS_PER_DAY);
      expect(new Set(q.map((x) => x.subject)).size).toBe(QUESTIONS_PER_DAY);
      for (const x of q) {
        expect(new Set(x.options).size).toBe(4);
        expect(x.answer).toBeGreaterThanOrEqual(0);
        const right = x.options[x.answer]!;
        if (x.kind === "event-year") {
          expect(right).toBe(events.get(x.subject)!.y);
          expect(x.options.filter((o) => o === right)).toHaveLength(1);
        } else if (x.kind === "event-place") expect(right).toBe(events.get(x.subject)!.place);
        else if (x.kind === "born-place") expect(right).toBe(persons.get(x.subject)!.place);
        else {
          const born = (x.options as string[]).map((id) => persons.get(id)!.born);
          expect(persons.get(right as string)!.born).toBe(Math.min(...born));
          expect(born.filter((b) => b === Math.min(...born))).toHaveLength(1);
        }
        for (const id of x.records) expect(labels.en![id], id).toBeTruthy();
      }
    }
  });
});

describe("Kalima", () => {
  it("judges letters, with a repeated letter marked no more often than the word has it", () => {
    expect(judge([..."bassa"], [..."basra"], "en")).toEqual(["hit", "hit", "hit", "miss", "hit"]);
    expect(judge([..."aabbb"], [..."baaxx"], "en")).toEqual(["near", "hit", "near", "miss", "miss"]);
    expect(judge([..."قرطبة"], [..."قرطبة"], "ar").every((m) => m === "hit")).toBe(true);
  });

  it("gives every language a word every day, the same for everyone, solvable by typing it", () => {
    for (const l of LANGS) for (const day of DAYS) {
      const w = dailyWord(words[l]!, l, day);
      expect(w).toEqual(dailyWord(words[l]!, l, day));
      const a = letters(w.w);
      expect(judge(a, a, l).every((m) => m === "hit")).toBe(true);
      expect(labels[l]![w.id]).toBeTruthy();
    }
    expect(KALIMA_TRIES).toBe(6);
  });

  it("does not repeat a word until the language's whole list has been played", () => {
    for (const l of LANGS) {
      const n = Math.min(words[l]!.words.length, 365);
      const seen = new Set(DAYS.slice(0, n).map((d) => dailyWord(words[l]!, l, d).w));
      expect(seen.size, l).toBe(n);
    }
  });
});

describe("The Lantern", () => {
  it("can be solved every day in every language, within the drops, by guessing the name's letters", () => {
    for (const l of LANGS) for (const day of DAYS) {
      const p = dailyPhrase(words[l]!, l, day);
      const guessed = new Set(letters(p.p));
      expect(hidden(p.p, guessed, l)).toBe(0);
      expect(misses(p.p, guessed, l)).toBe(0);
      expect(labels[l]![p.id]).toBeTruthy();
    }
    expect(LANTERN_DROPS).toBe(7);
  });

  it("counts a wrong letter as a lost drop and a right one as none", () => {
    expect(misses("cordoba", new Set(["c", "z"]), "en")).toBe(1);
    expect(hidden("cordoba", new Set(["o"]), "en")).toBe(5);
  });
});

describe("The Thread of Time", () => {
  it("is, every day, five events with distinct years far enough apart, shown out of order, and one right order", () => {
    for (const day of DAYS) {
      const { shown, order } = dailyThread(pack, day);
      expect(shown).toHaveLength(THREAD_LENGTH);
      const years = shown.map((e) => e.y).sort((a, b) => a - b);
      for (let i = 1; i < years.length; i++) expect(years[i]! - years[i - 1]!).toBeGreaterThanOrEqual(THREAD_GAP);
      expect(shown.map((e) => e.id)).not.toEqual(order);
      expect(rightPlaces(order, order).every(Boolean)).toBe(true);
      expect(dailyThread(pack, day)).toEqual({ shown, order });
      for (const id of order) expect(labels.en![id]).toBeTruthy();
    }
  });
});

describe("the day", () => {
  it("numbers puzzles from the first day", () => {
    expect(puzzleNumber("2026-11-26")).toBe(1);
    expect(dayNumber("2026-11-27") - dayNumber("2026-11-26")).toBe(1);
  });
});

describe("Kalima's own name file", () => {
  it("holds exactly the names of Kalima's words, copied from the language's label file", () => {
    for (const l of LANGS) {
      const own = data<PackLabels>(`word-labels.v1.${l}.json`);
      const ids = [...new Set(words[l]!.words.map((w) => w.id))].sort();
      expect(Object.keys(own), l).toEqual(ids.filter((id) => labels[l]![id]));
      for (const id of ids) expect(own[id], `${l} ${id}`).toEqual(labels[l]![id]);
    }
  });
});
