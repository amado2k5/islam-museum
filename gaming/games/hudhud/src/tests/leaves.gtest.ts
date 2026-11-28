// Al-Razi and the loose leaves, the twelfth quest: a physician's notebook as a row (the chain rules shared with the
// elephant clock and the paper of Samarkand). In each way of playing the row does not bind at the start and exactly one
// order binds, which is the record's order (written again here by hand, with the record's sentence beside it), the fewest
// moves are the numbers stated, the four goals are the shared ones, a saved place is proved and not trusted, a finished
// notebook does not change; the page is the row page shared with the paper (ui/rowpage.ts); and the words, in all seven
// languages, keep the lines written for the quest exactly, rest on the record's own file, carry no medical content (no
// word of illness or remedy in any language), no digit, no «الرسول», and the names the quest uses are checked against
// the museum's labels.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { LEAVES_ART, leavesHit } from "../art/leaves";
import { PAPER_ART, paperHit, placeRect, placeX } from "../art/paper";
import { BODY, LEAVES_IDS, LEAVES_QUEST, LEAVES_RECORDS, LEAVES_SLACK, LEAVES_STATES, LEAVES_SUBJECT, leavesParts, leavesPuzzle } from "../content/leaves";
import { paperPuzzle } from "../content/paper";
import { run, solutions, spare } from "../sim/chain";
import { fewest, put } from "../sim/chainquest";
import { LEAVES_FLAGS, applyLeaves, leavesGoals, newLeaves, restoreLeaves, snapshotLeaves, type LeavesCommand, type LeavesState, type LeavesStyle } from "../sim/leaves";
import { applyPaper, newPaper } from "../sim/paper";

const STYLES: LeavesStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const here = (...p: string[]) => resolve(__dirname, "..", ...p);
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const atlasTable = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n-atlas", `${lang}.json`), "utf8")) as Record<string, string>;
const rz = (lang: string) => Object.entries(table(lang)).filter(([k]) => k.startsWith("rz_"));
/** The quest's strings and those of al-Razi's study (rzr_, 27 November 2026), which keeps the quest's rule of no medical content. */
const rzAll = (lang: string) => Object.entries(table(lang)).filter(([k]) => k.startsWith("rz_") || k.startsWith("rzr_"));
/** The two notes that say there is no medical advice: the quest's and the study's. Only they may say "medical". */
const ADVICE_NOTES = ["rz_note_1", "rzr_note_room"];
const play = (s: LeavesState, cs: LeavesCommand[]) => cs.reduce(applyLeaves, s);
const record = readFileSync(resolve(root, "content", "en", "person", "al-razi-abu-bakr.md"), "utf8").replace(/\s+/g, " ");
const recordAr = readFileSync(resolve(root, "content", "ar", "person", "al-razi-abu-bakr.md"), "utf8").replace(/\s+/g, " ");

// The order the record gives, written down again here and not read from the content file. The record
// (person/al-razi-abu-bakr, after the Encyclopaedia of Islam): his notes are "organised anatomically from head to toe, and
// his own clinical observations, often at variance with received opinion, typically close the sections". The game makes
// "typically" a rule: within each part, what the books say first, then what he saw himself, which closes the part.
const EXPECTED: Record<LeavesStyle, string[]> = {
  // Story: one leaf of what the books say for each part, "from head to toe".
  story: ["books-head", "books-chest", "books-belly", "books-foot"],
  // Explorer: head, chest, foot, each "notes from a wide range of sources" then "his own clinical observations ... close the sections".
  explorer: ["books-head", "own-head", "books-chest", "own-chest", "books-foot", "own-foot"],
  // Challenge: all four parts, each closed by what he saw himself.
  challenge: ["books-head", "own-head", "books-chest", "own-chest", "books-belly", "own-belly", "books-foot", "own-foot"],
};
/** The moves that put the row in order, place by place. */
const fix = (s: LeavesState): LeavesCommand[] => {
  const out: LeavesCommand[] = [];
  let p = s.puzzle;
  EXPECTED[s.style].forEach((part, place) => {
    if (p.places[place] === part) return;
    out.push({ type: "put", place, part });
    p = put(p, place, part);
  });
  return out;
};
const wrongAtStart = (style: LeavesStyle) => leavesPuzzle(style).places.filter((id, i) => id !== EXPECTED[style][i]).length;

describe("al-Razi's loose leaves: the row", () => {
  it.each(STYLES)("does not bind at the start and has one order only that binds, head to foot with what he saw closing each part, in %s", (style) => {
    const p = leavesPuzzle(style);
    expect(run(p).end).not.toBe("done");
    expect(solutions(p)).toEqual([EXPECTED[style]]);
  });
  it("has four, six and eight leaves, with no spare and no decoy, and every place filled", () => {
    expect(STYLES.map((s) => leavesPuzzle(s).places.length)).toEqual([4, 6, 8]);
    for (const style of STYLES) {
      const p = leavesPuzzle(style);
      expect(spare(p), style).toEqual([]);
      expect([...p.parts.map((x) => x.id)].sort(), style).toEqual([...EXPECTED[style]].sort());
      expect(p.places.includes(null as never)).toBe(false);
    }
    // Story is all of what the books say, one leaf for each of the four parts; Explorer has head, chest and foot.
    expect(leavesPuzzle("story").parts.every((x) => x.id.startsWith("books-"))).toBe(true);
    expect([...BODY]).toEqual(["head", "chest", "belly", "foot"]);
    expect(LEAVES_IDS).toHaveLength(8);
  });
  it("needs 2 moves in Story (two pairs exchanged), 3 in Explorer (four places wrong) and 7 in Challenge (every place wrong)", () => {
    const of = (style: LeavesStyle) => ({ par: fewest(leavesPuzzle(style)), wrong: wrongAtStart(style) });
    expect(of("story")).toEqual({ par: 2, wrong: 4 });
    expect(of("explorer")).toEqual({ par: 3, wrong: 4 });
    expect(of("challenge")).toEqual({ par: 7, wrong: 8 });
    expect(LEAVES_SLACK).toEqual({ story: null, explorer: 2, challenge: 1 });
    // Two pairs exchanged at the start of Story.
    const e = EXPECTED.story;
    expect(leavesPuzzle("story").places).toEqual([e[1], e[0], e[3], e[2]]);
    // The fewest is the number of places less the cycles of the arrangement.
    for (const style of STYLES) {
      const to = EXPECTED[style];
      const from = leavesPuzzle(style).places as string[];
      const seen = new Set<number>();
      let cycles = 0;
      for (let i = 0; i < from.length; i++) {
        if (seen.has(i)) continue;
        cycles++;
        for (let j = i; !seen.has(j); j = to.indexOf(from[j]!)) seen.add(j);
      }
      expect(fewest(leavesPuzzle(style)), style).toBe(from.length - cycles);
    }
  });
  it("makes each leaf take the notebook up to here and hand it on up to and including itself; in Story the books leaf takes the part before it straight", () => {
    const by = (style: LeavesStyle) => Object.fromEntries(leavesParts(style).map((p) => [p.id, [p.takes, p.gives]]));
    expect(by("story")).toEqual({ "books-head": ["start", "head-done"], "books-chest": ["head-done", "chest-done"], "books-belly": ["chest-done", "belly-done"], "books-foot": ["belly-done", "notebook"] });
    expect(by("explorer")).toEqual({
      "books-head": ["start", "head-books"], "own-head": ["head-books", "head-done"],
      "books-chest": ["head-done", "chest-books"], "own-chest": ["chest-books", "chest-done"],
      "books-foot": ["chest-done", "foot-books"], "own-foot": ["foot-books", "notebook"],
    });
    expect(by("challenge")).toEqual({
      "books-head": ["start", "head-books"], "own-head": ["head-books", "head-done"],
      "books-chest": ["head-done", "chest-books"], "own-chest": ["chest-books", "chest-done"],
      "books-belly": ["chest-done", "belly-books"], "own-belly": ["belly-books", "belly-done"],
      "books-foot": ["belly-done", "foot-books"], "own-foot": ["foot-books", "notebook"],
    });
    // Every state a binding can stop at has words; the goal never needs them.
    const states = new Set(STYLES.flatMap((s) => leavesParts(s).map((p) => p.takes)));
    expect([...states].sort()).toEqual([...LEAVES_STATES].sort());
  });
  it("lets only the record's order bind, over every order of the leaves, and a failed binding always stops at a leaf that does not follow", () => {
    for (const style of STYLES) {
      const base = leavesPuzzle(style);
      const seen = { done: 0, idle: 0, other: 0 };
      const go = (rest: string[], row: string[]) => {
        if (rest.length === 0) {
          const r = run({ ...base, places: row });
          if (r.end === "done") {
            seen.done++;
            expect(row, style).toEqual(EXPECTED[style]);
          } else if (r.end === "idle") {
            seen.idle++;
            expect(r.moved.length).toBe(r.at);
            expect(row[r.at]).not.toBe(EXPECTED[style][r.at]);
          } else seen.other++;
          return;
        }
        for (let i = 0; i < rest.length; i++) go([...rest.slice(0, i), ...rest.slice(i + 1)], [...row, rest[i]!]);
      };
      go(base.places as string[], []);
      expect(seen.done, style).toBe(1);
      expect(seen.other, style).toBe(0);
    }
  });
  it("says where a binding stops: at the start in Story and Challenge, and after the head's books leaf in Explorer", () => {
    expect(play(newLeaves("story", leavesPuzzle("story")), [{ type: "go" }]).last).toMatchObject({ end: "idle", at: 0, carrying: "start" });
    expect(play(newLeaves("explorer", leavesPuzzle("explorer")), [{ type: "go" }]).last).toMatchObject({ end: "idle", at: 1, carrying: "head-books" });
    expect(play(newLeaves("challenge", leavesPuzzle("challenge")), [{ type: "go" }]).last).toMatchObject({ end: "idle", at: 0, carrying: "start" });
    // The Story's word for what comes next, and the Explorer's word for how far it had come.
    expect(table("en").rz_next_start).toBe("the head");
    expect(table("en").rz_kind_head_books).toBe("the head, what the books say");
  });
  it.each(STYLES)("can be bound in the fewest moves, and then nothing more changes, in %s", (style) => {
    let s = newLeaves(style, leavesPuzzle(style));
    s = play(s, [{ type: "go" }]);
    expect([s.done, s.runs, s.last?.end]).toEqual([false, 1, "idle"]);
    s = play(s, fix(s));
    expect(s.moves).toBe(s.par);
    s = play(s, [{ type: "go" }]);
    expect(s.done).toBe(true);
    expect(s.last!.moved.map((m) => m.part)).toEqual(EXPECTED[style]);
    expect(s.last!.moved.at(-1)!.gave).toBe("notebook");
    expect(play(s, [{ type: "put", place: 0, part: EXPECTED[style][1]! }, { type: "go" }, { type: "flag", flag: "feather" }])).toBe(s);
  });
});

describe("al-Razi's loose leaves: the goals and the flags", () => {
  it("gives the four goals as every row quest does, with two moves over the fewest in Explorer and one in Challenge", () => {
    let s = newLeaves("explorer", leavesPuzzle("explorer"));
    s = play(s, [{ type: "flag", flag: "askedNotes" }, { type: "flag", flag: "askedNotes" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedNotes"]);
    expect(leavesGoals(s, 2)).toEqual({ turns: 0, par: 3, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = play(s, [{ type: "flag", flag: "askedOwn" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
    for (let i = 0; i < 4; i++) s = play(s, [{ type: "put", place: 0, part: s.puzzle.places[1]! }]);
    s = play(s, [...fix(s), { type: "go" }]);
    expect(s.done).toBe(true);
    expect(leavesGoals(s, LEAVES_SLACK.explorer)).toMatchObject({ curiosity: true, ingenuity: false, kindness: true, feather: true });
    const c = play(newLeaves("challenge", leavesPuzzle("challenge")), []);
    const done = play(c, [...fix(c), { type: "go" }]);
    expect(leavesGoals(done, LEAVES_SLACK.challenge)).toMatchObject({ turns: 7, par: 7, ingenuity: true });
  });
  it("does not count a blunt answer as kindness, and keeps its own flags apart from the paper's", () => {
    const blunt = play(newLeaves("story", leavesPuzzle("story")), [{ type: "flag", flag: "answered" }]);
    expect(leavesGoals(blunt, null).kindness).toBe(false);
    expect(leavesGoals(play(blunt, [{ type: "flag", flag: "kind" }]), null).kindness).toBe(true);
    expect([...LEAVES_FLAGS]).toEqual(["askedNotes", "askedOwn", "kind", "feather", "answered"]);
    expect(applyLeaves(newLeaves("story", leavesPuzzle("story")), { type: "flag", flag: "askedStory" as never }).flags).toEqual([]);
    expect(applyPaper(newPaper("story", paperPuzzle("story")), { type: "flag", flag: "askedNotes" as never }).flags).toEqual([]);
  });
});

describe("al-Razi's loose leaves kept in the middle", () => {
  const started = (style: LeavesStyle) => play(newLeaves(style, leavesPuzzle(style)), [{ type: "put", place: 0, part: EXPECTED[style][1]! }, { type: "flag", flag: "askedOwn" }]);
  const snap = (style: LeavesStyle) => JSON.parse(JSON.stringify(snapshotLeaves(started(style)))) as Record<string, unknown>;
  const back = (x: unknown) => restoreLeaves(x, leavesPuzzle);
  it.each(STYLES)("comes back through JSON as it was, with no binding shown and not done, in %s", (style) => {
    const s = started(style);
    const b = back(snap(style))!;
    expect(b).not.toBeNull();
    expect([b.style, b.puzzle.places, b.moves, b.flags, b.par, b.last, b.runs, b.done]).toEqual([style, s.puzzle.places, s.moves, s.flags, s.par, null, 0, false]);
    expect(play(b, [...fix(b), { type: "go" }]).done).toBe(true);
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    expect(back(good)).not.toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }]) expect(back(bad)).toBeNull();
    const row = EXPECTED.explorer;
    expect(back({ ...good, places: [row[0], "nobody", ...row.slice(2)] })).toBeNull();
    expect(back({ ...good, places: [row[0], row[0], ...row.slice(2)] })).toBeNull();
    // A leaf of another way of playing: the belly is not in Explorer, and Story has no leaf of what he saw himself.
    expect(back({ ...good, places: [row[0], "own-belly", ...row.slice(2)] })).toBeNull();
    expect(back({ ...snap("story"), places: ["books-head", "own-head", "books-belly", "books-foot"] })).toBeNull();
    expect(back({ ...good, places: row.slice(1) })).toBeNull();
    for (const moves of [-1, 1.5, "3", null, NaN, 1e9]) expect(back({ ...good, moves })).toBeNull();
    expect(back({ ...good, flags: "feather" })).toBeNull();
    // A notebook that binds in fewer moves than the fewest there are cannot be true; one in enough is ready to bind.
    expect(back({ ...good, places: row, moves: 2 })).toBeNull();
    const ready = back({ ...good, places: row, moves: 3 })!;
    expect([ready.done, ready.moves]).toEqual([false, 3]);
    expect(applyLeaves(ready, { type: "go" }).done).toBe(true);
    // Unknown flags are dropped, and the fewest is worked out again.
    const odd = back({ ...good, flags: ["feather", "askedStory", 7, "askedNotes"], par: 99 })!;
    expect([odd.flags, odd.par]).toEqual([["askedNotes", "feather"], 3]);
  });
});

describe("the picture of the leaves", () => {
  it("uses the paper's row and its hit-test, shared and not copied: the same space, the same places, both ways round", () => {
    expect(leavesHit).toBe(paperHit);
    expect(LEAVES_ART).toBe(PAPER_ART);
    for (const n of [4, 6, 8]) {
      for (let i = 0; i < n; i++) {
        expect(leavesHit(placeX(n, i, false), LEAVES_ART.y, n, false)).toBe(i);
        expect(leavesHit(placeX(n, i, true), LEAVES_ART.y, n, true)).toBe(i);
        const r = placeRect(n, i, true);
        expect(r.x).toBeGreaterThanOrEqual(0);
        expect(r.x + r.w).toBeLessThanOrEqual(LEAVES_ART.w);
      }
      // Right to left, the first leaf is on the right.
      expect(placeX(n, 0, true)).toBeGreaterThan(placeX(n, n - 1, true));
    }
  });
  it("writes no text in the picture, and draws a plain sign for each part of the body and a mark of a different shape for each kind of leaf", () => {
    const art = readFileSync(here("art", "leaves.ts"), "utf8");
    expect(art).not.toMatch(/fillText|strokeText|drawImage/);
    for (const k of ["head(c)", "chest(c)", "belly(c)", "foot(c)", "books(c)", "own(c)"]) expect(art).toContain(k);
    expect(art).toContain("with no face");
  });
});

describe("the page and the registry", () => {
  const app = readFileSync(here("ui", "app.ts"), "utf8");
  const ui = readFileSync(here("ui", "leaves.ts"), "utf8");
  const shared = readFileSync(here("ui", "rowpage.ts"), "utf8");
  it("is the row page shared with the paper of Samarkand: both hand a spec to it, and the shared page names no quest's string", () => {
    for (const f of ["paper.ts", "leaves.ts"]) {
      const src = readFileSync(here("ui", f), "utf8");
      expect(src, f).toMatch(/rowPage\(host, SPEC\)/);
      expect(src, f).not.toMatch(/document\.createElement|addEventListener/);
    }
    expect(shared).not.toMatch(/"(pp|rz)_/);
    expect(shared).toMatch(/host\.reducedMotion\(\)/);
    expect(shared).not.toMatch(/matchMedia|settings\(\)/);
    // The lists of choices are by name, never in the answer's order.
    expect(shared).toContain("localeCompare(card(b.id), host.lang)");
  });
  it("adds the quest through the registry of page quests: its subject, its trial line, what it keeps, how it is made, a button on the Atlas, and the test hook", () => {
    expect(app).toMatch(/\[LEAVES_QUEST\]: \{\s*subject: LEAVES_SUBJECT,\s*trial: "rz_trial",/);
    expect(app).toContain("restoreLeaves(snap, leavesPuzzle)");
    // The table of built quests is content/journey.ts's since the journey (27 November 2026).
    expect(readFileSync(here("content", "journey.ts"), "utf8")).toContain("[LEAVES_SUBJECT]: LEAVES_QUEST");
    // Since al-Razi's study (27 November 2026) the hook opens the quest on its page, the way it is played without WebGL.
    expect(app).toContain("startLeaves: () => openPage(LEAVES_QUEST, null, true)");
    expect(app).toMatch(/leaves: \(\) => \{ const r = pageOf<LeavesQuest>\(LEAVES_QUEST\)/);
    expect(app).toContain("leavesCommand:");
    expect(ui).toMatch(/notes: \["rz_note_1", "rz_note_2", "rz_note_3", "rz_note_4"\]/);
  });
  it("builds the quest's id from the subject's quest code in the Atlas, in world 4, and links only to records that exist", () => {
    const atlas = JSON.parse(readFileSync(here("content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[] };
    const sub = atlas.subjects.find((s) => s.id === LEAVES_SUBJECT)!;
    expect(LEAVES_QUEST).toBe(`${sub.quest}-al-razi`);
    expect(LEAVES_QUEST).toBe("w04q4-al-razi");
    expect(sub.world).toBe("medicine-care");
    expect(sub.records).toContain(LEAVES_RECORDS[0]);
    expect([...LEAVES_RECORDS]).toEqual(["person/al-razi-abu-bakr", "work/al-hawi-fi-al-tibb"]);
    for (const id of LEAVES_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
});

describe("the record behind the lines", () => {
  it("rests each line on the record's own sentences, in English and in Arabic", () => {
    // [key, a phrase of the English record, a phrase of the Arabic record]
    const rests: [string, string, string][] = [
      ["rz_notes_1", "They were edited in some twenty-five volumes as the [[work/al-hawi-fi-al-tibb|Kitab al-Hawi fi al-tibb]]", "وقد حُرّرت في نحو خمسة وعشرين مجلداً باسم [[work/al-hawi-fi-al-tibb|كتاب الحاوي في الطب]]"],
      ["rz_notes_1", "organised anatomically from head to toe", "منظمة تشريحياً من الرأس إلى القدم"],
      ["rz_own_1", "extensive notes from a wide range of sources", "ملاحظات الرازي الواسعة المنقولة عن مصادر متنوعة"],
      ["rz_own_1", "his own clinical observations, often at variance with received opinion, typically close the sections", "وتختتم أقسامَها عادةً ملاحظاته السريرية الخاصة التي كثيراً ما تخالف الآراء المتوارثة"],
      ["rz_note_2", "He headed the hospital of Rayy before taking the corresponding post in [[place/baghdad|Baghdad]]", "تولّى رئاسة مستشفى الري قبل أن يتولى المنصب المماثل في [[place/baghdad|بغداد]]"],
      ["rz_note_3", "arriving patients first saw an outer circle of disciples, then an inner circle, leaving al-Razi himself to treat the hardest cases", "وكان المرضى القادمون يلقون أولاً حلقة خارجية من تلاميذه ثم حلقة داخلية"],
    ];
    for (const [k, en, ar] of rests) {
      expect(table("en")[k], k).toBeTruthy();
      expect(record, `${k} en`).toContain(en);
      expect(recordAr, `${k} ar`).toContain(ar);
    }
    // The notebooks are "his notebooks", and the record says they were edited, not by whom: the lines say "were edited" and name no editor.
    expect(record).toContain("His clinical research was methodical, as his notebooks show.");
    expect(record).toContain("at the instance of Ibn al-Amid");
    for (const l of LANGS) for (const [k, v] of rz(l)) expect(v, `${l}:${k}`).not.toMatch(/Amid|العميد|Hyderabad|حيدر/);
    expect(table("en").rz_notes_1).toContain("were edited in some twenty-five volumes");
    expect(table("en").rz_notes_1).not.toMatch(/\bhe edited\b/);
    // The two hospitals in the record's order: Rayy, then Baghdad.
    const n2 = table("en").rz_note_2;
    expect(n2.indexOf("Rayy")).toBeLessThan(n2.indexOf("Baghdad"));
    expect(record.indexOf("hospital of Rayy")).toBeLessThan(record.indexOf("corresponding post in [[place/baghdad"));
  });
});

describe("the words", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. */
  const WRITTEN: [string, string, string][] = [
    ["rz_intro_1", "صفحة الأطلس محشورة بين أوراق دفتر طبيب، والأوراق انفرط ترتيبها!", "The page of the Atlas is tucked among the leaves of a physician's notebook, and the leaves have come out of order!"],
    ["rz_intro_2", "أرتّب أوراقي من الرأس إلى القدم، وأختم كل باب بما رأيته بعيني.", "I keep my leaves from the head down to the foot, and I close each part with what I saw with my own eyes."],
    ["rz_notes_1", "يقول سجل المتحف إن دفاتر الرازي حُرّرت في نحو خمسة وعشرين مجلدًا باسم كتاب الحاوي في الطب، وإن ما فيها مرتّب بحسب أعضاء الجسم من الرأس إلى القدم.", "The museum's record says al-Razi's notebooks were edited in some twenty-five volumes as the book al-Hawi on medicine, and that what is in them is arranged by the parts of the body, from head to toe."],
    ["rz_own_1", "ويقول إنه كان ينقل عن كتب كثيرة، وإن ما شاهده هو بنفسه يأتي في الغالب في ختام الأبواب، وكثيرًا ما يخالف ما قيل قبله.", "It says he took notes from many books, and that what he observed himself usually closes the sections, and often differs from what was said before him."],
    ["rz_note_1", "هذه لعبة وليست كتاب تاريخ. الأوراق على المكتب والعلامات المرسومة عليها والطفل الذي يساعد في المستشفى وكل كلمة تُقال من خيال اللعب. وليس في اللعبة أي نصيحة طبية.", "This is a game, not a history. The leaves on the desk, the signs drawn on them, the child who helps at the hospital and every spoken line are invented for play. There is no medical advice in this game."],
    ["rz_note_2", "من سجل المتحف: حُرّرت دفاتر الرازي باسم كتاب الحاوي في الطب، مرتّبةً من الرأس إلى القدم، وما شاهده هو بنفسه يأتي في الغالب في ختام الأبواب. وقد ترأّس مستشفى الري ثم تولّى مثل ذلك في بغداد.", "From the museum's record: al-Razi's notebooks were edited as the book al-Hawi on medicine, arranged from head to toe, with what he observed himself usually closing the sections. He headed the hospital of Rayy and then held the same post in Baghdad."],
    ["rz_note_3", "ويقول السجل إن المريض القادم كان يراه أولًا حلقة خارجية من التلاميذ، ثم حلقة داخلية، ويبقى للرازي نفسه أصعب الحالات.", "The record says a patient who arrived was first seen by an outer circle of students, then by an inner circle, and that the hardest cases were left for al-Razi himself."],
    ["rz_note_4", "بُسِّط من أجل اللعب: في اللعبة أربعة أعضاء من الجسم من اختيار اللعبة، وعلى أوراقها علامات لا كلمات. أما الكتاب نفسه فيقع في نحو خمسة وعشرين مجلدًا.", "Made simpler for play: the game has four parts of the body, chosen by the game, and its leaves carry signs, not words. The book itself fills some twenty-five volumes."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' words and record names", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    const en = table("en");
    const ar = table("ar");
    expect(en.rz_who_razi).toBe("Al-Razi, in imagined words");
    expect(ar.rz_who_razi).toBe("الرازي، بكلمات متخيَّلة");
    expect(en.rz_who_child).toBe("The child who helps at the hospital, an invented person");
    expect(ar.rz_who_child).toBe("الطفل المساعد في المستشفى، شخصية من الخيال");
    expect([en.rz_rec_person, en.rz_rec_book, en.rz_go]).toEqual(["al-Razi", "his book al-Hawi", "Bind the notebook"]);
    // Four notes and no fifth.
    expect(Object.keys(en).filter((k) => k.startsWith("rz_note_"))).toEqual(["rz_note_1", "rz_note_2", "rz_note_3", "rz_note_4"]);
  });
  it("carries no medical content, nor does al-Razi's study: no word of illness, pain, fever, remedy, drug, dose or bleeding, in any of the seven languages", () => {
    // Words (or the start of words) that are illness or remedy, in each language. A patient and a hospital are not on
    // the lists: the record's lines speak of both. The only word for medicine allowed is the name of the art in the
    // book's title and the speaker's craft (physician), and "medical" only in the note that says there is no medical
    // advice.
    const BANNED: Record<string, { starts: string[]; exact?: string[] }> = {
      en: { starts: ["fever", "pain", "cure", "curing", "drug", "bleed", "blood", "illness", "disease", "sick", "symptom", "remed", "dose", "dosage", "wound", "heal", "treat", "therap", "diagnos", "prescri", "medicat", "ache", "pill"], exact: ["ill"] },
      fr: { starts: ["fièvre", "douleur", "guéri", "remède", "médicament", "médecine", "drogue", "saign", "maladi", "malade", "symptôm", "dose", "plaie", "blessure", "soign", "traitement", "thérap", "diagnost", "ordonnance"], exact: ["sang", "soin", "soins", "mal"] },
      es: { starts: ["fiebre", "dolor", "curar", "curación", "remedio", "medicament", "medicina", "droga", "sangr", "enferm", "síntoma", "dosis", "herida", "tratamiento", "tratar", "terap", "diagnóst", "receta"], exact: ["cura"] },
      tr: { starts: ["ateş", "ağrı", "tedavi", "ilaç", "hastalı", "kanam", "kanay", "doz", "belirti", "yara", "şifa", "deva", "teşhis", "reçete", "tıp"], exact: ["acı", "kan"] },
      id: { starts: ["demam", "nyeri", "sakit", "obat", "penyakit", "sembuh", "darah", "berdarah", "pendarahan", "dosis", "gejala", "luka", "pengobatan", "terapi", "diagnos", "resep"] },
    };
    // Arabic and Urdu: whole words, with the conjunctions and prepositions joined in front of them (و ف ب ل ك) and the article taken off.
    const BANNED_AR = ["حمى", "ألم", "آلام", "شفاء", "دواء", "أدوية", "عقار", "نزيف", "نزف", "فصد", "دم", "مرض", "أمراض", "علة", "أعراض", "جرعة", "علاج", "جرح", "جروح", "وصفة", "داء", "سم", "تشخيص"];
    const BANNED_UR = ["بخار", "درد", "علاج", "دوا", "دوائی", "ادویہ", "بیماری", "بیماریوں", "مرض", "امراض", "شفا", "زخم", "نسخہ", "خون", "خوراک", "تشخیص"];
    const words = (v: string) => v.toLowerCase().replace(/rumah sakit/g, "").split(/[^\p{L}\p{M}]+/u).filter(Boolean);
    const forms = (w: string) => {
      const plain = w.replace(/[ً-ْٰ]/g, "");
      const out = new Set([plain]);
      for (const x of [...out]) if (/^[وفبلك]/.test(x) && x.length > 3) out.add(x.slice(1));
      for (const x of [...out]) if (x.startsWith("ال")) out.add(x.slice(2));
      return out;
    };
    for (const l of LANGS) {
      for (const [k, v] of rzAll(l)) {
        for (const w of words(v)) {
          if (l === "ar" || l === "ur") {
            const list = l === "ar" ? BANNED_AR : BANNED_UR;
            for (const f of forms(w)) expect(list.includes(f), `${l}:${k}: ${w}`).toBe(false);
            continue;
          }
          const b = BANNED[l]!;
          expect(b.starts.some((s) => w.startsWith(s)) || (b.exact ?? []).includes(w), `${l}:${k}: ${w}`).toBe(false);
        }
      }
    }
    // "medicine" only in the book's title, and the Arabic and Urdu word for it only there, in the physician's name for his
    // craft, and in the note that says there is no medical advice.
    for (const [k, v] of rzAll("en")) for (const m of v.matchAll(/medic\w*/gi)) expect(m[0] === "medicine" ? v.slice(m.index! - 3, m.index!) : ADVICE_NOTES.includes(k) && m[0] === "medical", k).toBe(m[0] === "medicine" ? "on " : true);
    for (const [k, v] of rzAll("ar")) for (const w of words(v)) if (w.includes("طب")) expect(["الطب", "طبيب", "الطبيب", "طبية"], `${k}: ${w}`).toContain(w);
    for (const [k, v] of rzAll("ur")) for (const w of words(v)) if (w.startsWith("طب")) expect(["طب", "طبیب", "طبی"], `${k}: ${w}`).toContain(w);
    // The note says there is no medical advice, in every language.
    const advice: Record<string, string> = { en: "There is no medical advice in this game.", ar: "وليس في اللعبة أي نصيحة طبية.", ur: "کوئی طبی مشورہ نہیں", fr: "aucun conseil médical", es: "ningún consejo médico", tr: "hiçbir tıbbi tavsiye yoktur", id: "Tidak ada nasihat medis" };
    for (const l of LANGS) expect(table(l).rz_note_1, l).toContain(advice[l]!);
    // And so does the study's note.
    for (const l of LANGS) expect(table(l).rzr_note_room, l).toContain(advice[l]!);
    // And "medical" in no other string of the quest.
    const medical: Record<string, RegExp> = { en: /\bmedical\b/i, ar: /طبية/, ur: /طبی(?!ب)/, fr: /médical/, tr: /tıbbi/, id: /medis/ };
    for (const [l, re] of Object.entries(medical)) for (const [k, v] of rzAll(l)) if (!ADVICE_NOTES.includes(k)) expect(v, `${l}:${k}`).not.toMatch(re);
  });
  it("never calls an invented character the Messenger, in any language that has the word", () => {
    for (const l of LANGS) for (const [k, v] of rz(l)) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language", () => {
    for (const l of LANGS) for (const [k, v] of rz(l)) expect(v.replace(/\{\w+\}/g, "").match(/[0-9٠-٩۰-۹]+/g) ?? [], `${l}:${k}`).toEqual([]);
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of rz(l)) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
    for (const l of LANGS) for (const [k, v] of rz(l)) expect(v, `${l}:${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله/);
  });
  it("has every key the page uses, in all seven languages, with no part left empty, the same placeholders, and no key that nothing uses", () => {
    const ui = readFileSync(here("ui", "leaves.ts"), "utf8");
    const keys = new Set([...ui.matchAll(/"(rz_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    const tail = (x: string) => x.replace(/-/g, "_");
    for (const id of LEAVES_IDS) {
      keys.add(`rz_part_${tail(id)}`);
      keys.add(`rz_did_${tail(id)}`);
    }
    // Explorer and Challenge say how far the binding had come; Story says which part is next (Story's states only).
    for (const s of LEAVES_STATES) keys.add(`rz_kind_${tail(s)}`);
    for (const s of leavesParts("story").map((p) => p.takes)) keys.add(`rz_next_${tail(s)}`);
    expect(keys.size).toBeGreaterThan(60);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("rz_")) expect(keys.has(k), k).toBe(true);
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("rz_")), l).toEqual(Object.keys(table("en")).filter((k) => k.startsWith("rz_")));
    for (const l of LANGS) for (const k of keys) expect([...(table(l)[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l}:${k}`).toEqual([...(table("en")[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
  });
  it("names every leaf, every sentence of a leaf and every state differently from the others, in every language", () => {
    const tail = (x: string) => x.replace(/-/g, "_");
    for (const l of LANGS) {
      const t = table(l);
      expect(new Set(LEAVES_IDS.map((id) => t[`rz_part_${tail(id)}`])).size, l).toBe(8);
      expect(new Set(LEAVES_IDS.map((id) => t[`rz_did_${tail(id)}`])).size, l).toBe(8);
      expect(new Set(LEAVES_STATES.map((s) => t[`rz_kind_${tail(s)}`])).size, l).toBe(LEAVES_STATES.length);
    }
  });
  it("is appended at the end of each language's file, after the keys of the eleventh quest, and only the next quest's keys (`kr_`) and the journey's (`jn_`), then al-Jazari's room's (`jr_`), then al-Tusi's room's (`tsr_`), then al-Khwarizmi's room's (`akr_`), then al-Kindi's room's (`kdr_`), then al-Idrisi's hall's (`isr_`), then al-Razi's study's (`rzr_`), then Karima's room's (`krr_`), then Ibn Battuta's inn's (`ibr_`), then the coffee room's (`cqr_`), then al-Jahiz's room's (`jzr_`), then the Alhambra's court's (`ahr_`), then the paper workshop's (`smr_`) come after it", () => {
    for (const l of LANGS) {
      const ks = Object.keys(table(l));
      const first = ks.findIndex((k) => k.startsWith("rz_"));
      const count = ks.filter((k) => k.startsWith("rz_")).length;
      expect(first, l).toBeGreaterThan(0);
      expect(ks.slice(first, first + count).every((k) => k.startsWith("rz_")), l).toBe(true);
      expect(ks.slice(first + count).every((k) => k.startsWith("kr_") || k.startsWith("jn_") || k.startsWith("jr_") || k.startsWith("tsr_") || k.startsWith("akr_") || k.startsWith("kdr_") || k.startsWith("isr_") || k.startsWith("rzr_") || k.startsWith("krr_") || k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_") || k.startsWith("ahr_") || k.startsWith("smr_")), l).toBe(true);
      expect(ks[first - 1]!.startsWith("ah_"), l).toBe(true);
    }
  });
  it("says in the hub that quests are built, in every language, and no longer eleven (the count itself is pinned in collate.gtest.ts)", () => {
    expect(table("en").hub_note).toMatch(/(Twelve|Thirteen) quests are built/);
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bEleven quests|\bOnze quêtes|\bonce misiones|\bon bir görev|\bsebelas misi|إحدى عشرة مهمة|گیارہ مہمیں/i);
  });
  it("takes each name from the Atlas heading and the museum's labels unless it is on a short list of named exceptions, which is exactly this list", () => {
    const label = (path: string) => (parse(readFileSync(resolve(root, "data", path), "utf8")) as { label: Record<string, string | undefined> }).label;
    const bare = (x: string | undefined) => (x ?? "").replace(/[⁦⁩]/g, "").toLowerCase();
    const found: Record<string, string> = {};
    // Al-Razi: the Atlas heading, as the record name and at the head of his speaker's name.
    for (const l of LANGS) {
      const heading = atlasTable(l).s_al_razi!;
      expect(table(l).rz_rec_person, l).toBe(heading);
      expect(bare(table(l).rz_who_razi).startsWith(bare(heading)), l).toBe(true);
    }
    // Rayy, Baghdad and the book's title, as the game writes them in each language, and where each is written.
    const GAME: Record<string, { rayy: string; baghdad: string; book: string }> = {
      ar: { rayy: "الري", baghdad: "بغداد", book: "الحاوي في الطب" },
      en: { rayy: "Rayy", baghdad: "Baghdad", book: "al-Hawi on medicine" },
      ur: { rayy: "رے", baghdad: "بغداد", book: "الحاوی فی الطب" },
      fr: { rayy: "Rayy", baghdad: "Bagdad", book: "Al-Hawi fi al-Tibb" },
      es: { rayy: "Rayy", baghdad: "Bagdad", book: "Al-Hawi fi al-Tibb" },
      tr: { rayy: "Rayy", baghdad: "Bağdat", book: "Al-Hawi fi al-Tibb" },
      id: { rayy: "Rayy", baghdad: "Bagdad", book: "Al-Hawi fi al-Tibb" },
    };
    const labels = { rayy: label("place/rayy.yaml"), baghdad: label("place/baghdad.yaml"), book: label("work/al-hawi-fi-al-tibb.yaml") };
    for (const l of LANGS) {
      const g = GAME[l]!;
      expect(table(l).rz_note_2, `${l} rayy`).toContain(g.rayy);
      expect(table(l).rz_note_2, `${l} baghdad`).toContain(g.baghdad);
      expect(table(l).rz_notes_1, `${l} book`).toContain(g.book);
      expect(table(l).rz_note_2, `${l} book`).toContain(g.book);
      for (const what of ["rayy", "baghdad", "book"] as const) if (bare(g[what]) !== bare(labels[what][l])) found[`${what}:${l}`] = `${labels[what][l]} -> ${g[what]}`;
    }
    // Where the game's form is not the museum's label, and why. Rayy: the Turkish and Indonesian labels are a
    // translation of the word for watering ("Sulama", "Irigasi"), not the city's name; the museum's Turkish and Indonesian
    // pages write "Rayy" far more often than any other form. The book: the English is the brief's own line ("al-Hawi on
    // medicine"); the Urdu label drops a letter ("الحوی"), and the museum's Urdu pages write "الحاوی فی الطب"; the Turkish
    // and Indonesian labels translate the title word by word ("Tıpta kap", "Wadah dalam kedokteran"), and the museum's
    // Turkish and Indonesian pages write "Al-Hawi fi al-Tibb".
    const EXCEPTIONS: Record<string, string> = {
      "rayy:tr": "Sulama -> Rayy",
      "rayy:id": "Irigasi -> Rayy",
      "book:en": "Al-Hawi fi al-Tibb -> al-Hawi on medicine",
      "book:ur": "الحوی فی الطب -> الحاوی فی الطب",
      "book:tr": "Tıpta kap -> Al-Hawi fi al-Tibb",
      "book:id": "Wadah dalam kedokteran -> Al-Hawi fi al-Tibb",
    };
    expect(found).toEqual(EXCEPTIONS);
  });
});
