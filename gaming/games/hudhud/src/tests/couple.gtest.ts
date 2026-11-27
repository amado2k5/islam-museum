// Al-Tusi and the two circles: a small circle carried round inside a large one, a point on it, and a path that is
// measured and not looked up. The proofs are by measurement: with a half size, twice the speed and the opposite way the
// path is a straight line as long as the large circle is wide, no other setting that any way of playing offers is a
// line, and every setting's class is the same whether the path is measured with 180, 360 or 720 points. The three ways
// of playing offer two, six and eighteen settings; a saved place is proved, not trusted; the words, in all seven
// languages, keep the lines written for the quest exactly and rest on the museum records' own files; and nothing the page
// shows before the line is found gives the answer away.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { COUPLE_QUEST, COUPLE_RECORDS, COUPLE_SUBJECT, coupleOffer } from "../content/couple";
import { COUPLE_ART, toPicture } from "../art/couple";
import { COUPLE_FLAGS, COUPLE_SLACK, DIRS, SIZES, SPEEDS, applyCouple, checkOffer, classify, coupleGoals, isLine, newCouple, point, restoreCouple, setControl, settingsOf, shape, snapshotCouple, startSetting, trace, turn, type CoupleCommand, type CoupleState, type CoupleStyle, type Dir, type Offer, type Pt, type Setting } from "../sim/couple";

const STYLES: CoupleStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const atlasTable = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n-atlas", `${lang}.json`), "utf8")) as Record<string, string>;
const fresh = (style: CoupleStyle) => newCouple(style, coupleOffer(style));
const play = (s: CoupleState, cs: CoupleCommand[]) => cs.reduce(applyCouple, s);
const set = (field: "size" | "speed" | "dir", value: number): CoupleCommand => ({ type: "set", field, value });
/** The record's text with its links and citations written as plain words, on one line. */
const plain = (path: string) => readFileSync(resolve(root, path), "utf8").replace(/\[\[[^|\]]*\|([^\]]*)\]\]/g, "$1").replace(/\s*\{cite:[^}]*\}/g, "").replace(/\s+/g, " ");
const person = plain("content/en/person/nasir-al-din-al-tusi.md");
const observatory = plain("content/en/building/maragha-observatory.md");

const ANSWER: Setting = { r: 1 / 2, k: 2, d: -1 };
const same = (a: Setting, b: Setting) => a.r === b.r && a.k === b.k && a.d === b.d;
const all: Setting[] = SIZES.flatMap((r) => SPEEDS.flatMap((k) => DIRS.map((d) => ({ r, k, d }))));
const label = (s: Setting) => `size ${s.r.toFixed(3)}, ${s.k} times, ${s.d === 1 ? "same way" : "opposite way"}`;

describe("the path of the point, by measurement", () => {
  it("starts on the large circle's rim at the right of the picture, for every setting, and never leaves the large circle", () => {
    for (const s of all) {
      const [x, y] = point(s, 0);
      expect(x, label(s)).toBeCloseTo(1, 12);
      expect(y, label(s)).toBeCloseTo(0, 12);
      for (const [px, py] of trace(s, 360)) expect(Math.hypot(px, py), label(s)).toBeLessThanOrEqual(1 + 1e-9);
    }
    // In the picture's own space the start is the right-hand end of the large circle's width.
    expect(toPicture(point(ANSWER, 0))).toEqual([COUPLE_ART.cx + COUPLE_ART.big, COUPLE_ART.cy]);
    expect(toPicture([0, 0])).toEqual([COUPLE_ART.cx, COUPLE_ART.cy]);
  });
  it("is a straight line as long as the large circle is wide with a half size, twice the speed and the opposite way", () => {
    for (const n of [180, 360, 720]) {
      const pts = trace(ANSWER, n);
      expect(pts).toHaveLength(n);
      const s = classify(pts);
      expect(s.kind, `n=${n}`).toBe("line");
      // The two farthest points are the ends of the large circle's width (the diameter, 2), found by looking at every pair.
      let far = 0;
      for (const a of pts) for (const b of pts) far = Math.max(far, Math.hypot(a[0] - b[0], a[1] - b[1]));
      expect(far, `n=${n}`).toBeCloseTo(2, 6);
      // Every point is on the line through the middle: no point is off it by more than rounding.
      for (const [, y] of pts) expect(Math.abs(y)).toBeLessThan(1e-9);
    }
    expect(isLine(ANSWER)).toBe(true);
    expect(shape(ANSWER)).toEqual({ kind: "line", lobes: 0, crossings: 0 });
  });
  it("gives a straight line for no other setting offered in any way of playing, and for no other of the eighteen", () => {
    expect(all.filter((s) => isLine(s)).map(label)).toEqual([label(ANSWER)]);
    for (const style of STYLES) {
      const lines = settingsOf(coupleOffer(style)).filter((s) => isLine(s));
      expect(lines.length, style).toBe(1);
      expect(same(lines[0]!, ANSWER), style).toBe(true);
    }
    // A near miss is not a line either: the same speed and direction at a size a little off the half.
    for (const r of [0.45, 0.48, 0.52, 0.55]) expect(isLine({ r, k: 2, d: -1 }), String(r)).toBe(false);
  });
  it("gives a circle with the same speed in the opposite way: the point stays still on the small circle, which is carried round", () => {
    for (const r of SIZES) {
      const s: Setting = { r, k: 1, d: -1 };
      const pts = trace(s, 360);
      expect(classify(pts).kind, label(s)).toBe("circle");
      // Measured: every point is the same distance from the middle of the points, and that distance is 1 - r.
      const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      for (const p of pts) expect(Math.hypot(p[0] - mx, p[1] - my), label(s)).toBeCloseTo(1 - r, 9);
      expect(mx).toBeCloseTo(r, 9);
    }
  });
  it("gives an oval with twice the speed in the opposite way at a third or two thirds, as long as the large circle is wide and a third as high", () => {
    for (const r of [1 / 3, 2 / 3]) {
      const pts = trace({ r, k: 2, d: -1 }, 360);
      expect(classify(pts)).toEqual({ kind: "oval", lobes: 2, crossings: 0 });
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(2, 6);
      expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(2 / 3, 3);
    }
  });
  it("classes all eighteen settings as the arithmetic says, and the same at 180, 360 and 720 points", () => {
    // [size, speed, direction] -> [kind, lobes, whether the path crosses itself]
    const EXPECTED: Record<string, [string, number, boolean]> = {};
    for (const r of SIZES) {
      EXPECTED[`${r}:1:-1`] = ["circle", 0, false];
      EXPECTED[`${r}:2:-1`] = r === 1 / 2 ? ["line", 0, false] : ["oval", 2, false];
      // Same way: a path swung out and in as many times as the speed, crossing itself except at a third with speed 1 (a heart-shaped curve with a point).
      EXPECTED[`${r}:1:1`] = ["loops", 1, r !== 1 / 3];
      EXPECTED[`${r}:2:1`] = ["loops", 2, true];
      EXPECTED[`${r}:3:1`] = ["loops", 3, true];
      // Opposite way with speed 3: three lobes, crossing itself except at a third (a three-pointed curve).
      EXPECTED[`${r}:3:-1`] = ["loops", 3, r !== 1 / 3];
    }
    expect(Object.keys(EXPECTED)).toHaveLength(18);
    for (const s of all) {
      const [kind, lobes, crosses] = EXPECTED[`${s.r}:${s.k}:${s.d}`]!;
      for (const n of [180, 360, 720]) {
        const m = shape(s, n);
        expect([m.kind, m.lobes, m.crossings > 0], `${label(s)} at ${n}`).toEqual([kind, lobes, crosses]);
      }
    }
    // The number of lobes is the speed, wherever the path is neither a line nor a circle.
    for (const s of all) if (!isLine(s) && shape(s).kind !== "circle") expect(shape(s).lobes, label(s)).toBe(s.k);
  });
  it("measures a path from its points alone: a segment, a circle, an ellipse, a figure of eight and a square, not a formula", () => {
    const ring = (n: number, f: (t: number) => Pt) => Array.from({ length: n }, (_, i) => f((2 * Math.PI * i) / n));
    expect(classify(ring(200, (t) => [Math.cos(t) * 0.7, Math.cos(t) * 0.7 + 1])).kind).toBe("line");
    expect(classify(ring(200, (t) => [3 * Math.cos(t) + 5, 3 * Math.sin(t) - 2])).kind).toBe("circle");
    expect(classify(ring(200, (t) => [Math.cos(t), 0.4 * Math.sin(t)]))).toEqual({ kind: "oval", lobes: 2, crossings: 0 });
    const eight = classify(ring(200, (t) => [Math.sin(t), Math.sin(2 * t) / 2]));
    expect([eight.kind, eight.crossings]).toEqual(["loops", 1]);
    // A line is found whichever way it lies, and a path that is only nearly a line is not one.
    expect(classify(ring(200, (t) => [Math.cos(t), -Math.cos(t) * 2])).kind).toBe("line");
    expect(classify(ring(200, (t) => [Math.cos(t), 0.05 * Math.sin(t)])).kind).toBe("oval");
  });
  it("is the same every time it is worked out: nothing in the rules is random or timed", () => {
    for (const s of all) expect(trace(s, 360)).toEqual(trace(s, 360));
    expect(shape(ANSWER, 360)).toEqual(shape({ ...ANSWER }, 360));
  });
});

describe("the three ways of playing", () => {
  it("offer two, six and eighteen settings, each a different one, and the later way offers all that the earlier one does", () => {
    const sets = STYLES.map((s) => settingsOf(coupleOffer(s)));
    expect(sets.map((x) => x.length)).toEqual([2, 6, 18]);
    for (const list of sets) expect(new Set(list.map(label)).size).toBe(list.length);
    for (const s of sets[0]!) expect(sets[1]!.some((x) => same(x, s))).toBe(true);
    for (const s of sets[1]!) expect(sets[2]!.some((x) => same(x, s))).toBe(true);
    expect(sets[2]!.every((s) => all.some((x) => same(x, s)))).toBe(true);
    // The size is a half in Story and Explorer; the speed is twice in Story.
    expect(sets[0]!.every((s) => s.r === 1 / 2 && s.k === 2)).toBe(true);
    expect(sets[1]!.every((s) => s.r === 1 / 2)).toBe(true);
    expect(new Set(sets[2]!.map((s) => s.r))).toEqual(new Set(SIZES));
  });
  it("start where the choices are first offered, which is never the answer, and every offer can reach the answer", () => {
    for (const style of STYLES) {
      const o = coupleOffer(style);
      const start = startSetting(o);
      expect(same(start, ANSWER), style).toBe(false);
      expect(start.d, style).toBe(1);
      expect(fresh(style).setting).toEqual(start);
      expect(settingsOf(o).some((s) => same(s, ANSWER)), style).toBe(true);
      expect(checkOffer(o), style).toBeNull();
    }
    expect(startSetting(coupleOffer("story"))).toEqual({ r: 1 / 2, k: 2, d: 1 });
    expect(startSetting(coupleOffer("explorer"))).toEqual({ r: 1 / 2, k: 1, d: 1 });
    expect(startSetting(coupleOffer("challenge"))).toEqual({ r: 1 / 3, k: 1, d: 1 });
  });
  it("refuse a choice that makes no sense", () => {
    const ok: Offer = coupleOffer("challenge");
    expect(checkOffer(ok)).toBeNull();
    expect(checkOffer({ ...ok, sizes: [] })).not.toBeNull();
    expect(checkOffer({ ...ok, speeds: [4] })).not.toBeNull();
    expect(checkOffer({ ...ok, sizes: [0.4] })).not.toBeNull();
    expect(checkOffer({ ...ok, dirs: [0 as Dir] })).not.toBeNull();
    expect(checkOffer({ ...ok, speeds: [2, 2] })).not.toBeNull();
    // An offer in which no setting is a line cannot be played.
    expect(checkOffer({ sizes: [1 / 3], speeds: [1, 3], dirs: [1, -1] })).not.toBeNull();
    expect(() => newCouple("story", { sizes: [1 / 3], speeds: [1], dirs: [1] })).toThrow(/cannot be played/);
  });
  it("turn the circles with the chosen setting: a line is found at once in every way of playing, from the setting that is the answer", () => {
    for (const style of STYLES) {
      const s = play(fresh(style), [set("dir", -1), ...(style === "story" ? [] : [set("speed", 2)]), ...(style === "challenge" ? [set("size", 1 / 2)] : [])]);
      expect(same(s.setting, ANSWER), style).toBe(true);
      const t = turn(s);
      expect([t.done, t.turned, t.misses, t.last?.shape.kind], style).toEqual([true, 1, 0, "line"]);
      expect(t.last?.setting).toEqual(ANSWER);
    }
  });
});

describe("the choices", () => {
  it("change only to a value the way of playing offers, and a value that is already chosen changes nothing", () => {
    const story = fresh("story");
    expect(applyCouple(story, set("speed", 3))).toBe(story);
    expect(applyCouple(story, set("speed", 1))).toBe(story);
    expect(applyCouple(story, set("size", 1 / 3))).toBe(story);
    expect(applyCouple(story, set("dir", 1))).toBe(story);
    expect(applyCouple(story, set("dir", 0))).toBe(story);
    expect(applyCouple(story, set("dir", -1)).setting.d).toBe(-1);
    const explorer = fresh("explorer");
    expect(applyCouple(explorer, set("speed", 3)).setting.k).toBe(3);
    expect(applyCouple(explorer, set("speed", 4))).toBe(explorer);
    expect(applyCouple(explorer, set("size", 2 / 3))).toBe(explorer);
    const challenge = fresh("challenge");
    expect(applyCouple(challenge, set("size", 2 / 3)).setting.r).toBe(2 / 3);
    expect(applyCouple(challenge, set("size", 0.4))).toBe(challenge);
    expect(applyCouple(challenge, { type: "set", field: "nonsense" as never, value: 1 })).toBe(challenge);
  });
  it("clear the picture's path when one is changed, and keep the counts", () => {
    let s = turn(fresh("explorer"));
    expect(s.last).not.toBeNull();
    expect([s.turned, s.misses]).toEqual([1, 1]);
    s = setControl(s, "speed", 2);
    expect(s.last).toBeNull();
    expect([s.turned, s.misses]).toEqual([1, 1]);
    // A change to what is already chosen leaves the path where it is.
    const t = turn(s);
    expect(setControl(t, "speed", 2)).toBe(t);
  });
  it("leave the quest as it is once the line is found", () => {
    const done = turn(play(fresh("story"), [set("dir", -1)]));
    expect(done.done).toBe(true);
    expect(setControl(done, "dir", 1)).toBe(done);
    expect(turn(done)).toBe(done);
    expect(applyCouple(done, set("dir", 1))).toBe(done);
    expect(applyCouple(done, { type: "turn" })).toBe(done);
    expect(applyCouple(done, { type: "flag", flag: "feather" })).toBe(done);
  });
});

describe("turning and counting", () => {
  it("counts a turning that is not a line, and does not stop at it, in every way of playing", () => {
    for (const style of STYLES) {
      let s = fresh(style);
      for (let k = 1; k <= 3; k++) {
        s = turn(s);
        expect([s.turned, s.misses, s.done], `${style} ${k}`).toEqual([k, k, false]);
        expect(s.last?.setting).toEqual(startSetting(coupleOffer(style)));
        expect(s.last?.shape.kind).not.toBe("line");
      }
    }
  });
  it("counts every turning the same way whichever wrong setting it was, and the turning that finds the line counts as a turning but not a miss", () => {
    let s = fresh("challenge");
    for (const [r, k, d] of [[1 / 3, 2, -1], [1 / 2, 3, 1], [2 / 3, 1, -1], [1 / 2, 2, 1]] as [number, number, Dir][]) {
      s = play(s, [set("size", r), set("speed", k), set("dir", d), { type: "turn" }]);
    }
    expect([s.turned, s.misses, s.done]).toEqual([4, 4, false]);
    s = play(s, [set("size", 1 / 2), set("speed", 2), set("dir", -1), { type: "turn" }]);
    expect([s.turned, s.misses, s.done, s.last?.shape.kind]).toEqual([5, 4, true, "line"]);
  });
  it("names the shape that each of the eighteen settings traced, as the last turning", () => {
    for (const s0 of all) {
      const s = turn({ ...fresh("challenge"), setting: s0 });
      expect(s.last?.shape, label(s0)).toEqual(shape(s0));
      expect(s.done, label(s0)).toBe(same(s0, ANSWER));
    }
  });
  it("is the same for the same commands in the same order", () => {
    const run = () => play(fresh("explorer"), [set("speed", 3), { type: "turn" }, set("dir", -1), { type: "turn" }, set("speed", 2), { type: "turn" }]);
    expect(run()).toEqual(run());
    expect(run()).toMatchObject({ turned: 3, misses: 2, done: true });
  });
});

describe("the four goals", () => {
  it("allows no count in Story, two turnings that are not a line in Explorer and four in Challenge", () => {
    expect(COUPLE_SLACK).toEqual({ story: null, explorer: 2, challenge: 4 });
  });
  it("counts Curiosity as both questions asked, and no other flag counts for it", () => {
    let s = fresh("story");
    expect(coupleGoals(s, null).curiosity).toBe(false);
    s = play(s, [{ type: "flag", flag: "askedWhy" }, { type: "flag", flag: "askedWhy" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }, { type: "flag", flag: "answered" }]);
    expect(coupleGoals(s, null)).toMatchObject({ curiosity: false, kindness: true, feather: true });
    s = play(s, [{ type: "flag", flag: "askedObs" }]);
    expect(coupleGoals(s, null).curiosity).toBe(true);
    expect(s.flags).toEqual(["askedWhy", "kind", "feather", "answered", "askedObs"]);
  });
  it("counts Ingenuity as misses at most the allowance: two are allowed in Explorer and a third is not, four in Challenge and a fifth is not, none counted in Story", () => {
    const missed = (style: CoupleStyle, n: number) => {
      let s = fresh(style);
      for (let k = 0; k < n; k++) s = turn(s);
      return turn(play(s, [set("dir", -1), ...(style === "story" ? [] : [set("speed", 2)]), ...(style === "challenge" ? [set("size", 1 / 2)] : [])]));
    };
    expect(coupleGoals(missed("explorer", 2), COUPLE_SLACK.explorer).ingenuity).toBe(true);
    expect(coupleGoals(missed("explorer", 3), COUPLE_SLACK.explorer).ingenuity).toBe(false);
    expect(coupleGoals(missed("challenge", 4), COUPLE_SLACK.challenge).ingenuity).toBe(true);
    expect(coupleGoals(missed("challenge", 5), COUPLE_SLACK.challenge).ingenuity).toBe(false);
    expect(coupleGoals(missed("story", 9), COUPLE_SLACK.story).ingenuity).toBe(true);
    expect(missed("explorer", 3)).toMatchObject({ turned: 4, misses: 3, done: true });
  });
  it("counts the turns as every turning made, and refuses a flag it does not know", () => {
    const s = play(fresh("explorer"), [{ type: "turn" }, set("speed", 2), set("dir", -1), { type: "turn" }]);
    expect(coupleGoals(s, 2)).toMatchObject({ turns: 2, ingenuity: true });
    expect(play(fresh("story"), [{ type: "flag", flag: "nonsense" as never }]).flags).toEqual([]);
    expect([...COUPLE_FLAGS]).toEqual(["askedWhy", "askedObs", "kind", "feather", "answered"]);
  });
  it("can be met in full in every way of playing: the line found, both questions asked, the girl answered kindly, the feather found", () => {
    for (const style of STYLES) {
      let s = play(fresh(style), [{ type: "flag", flag: "askedWhy" }, { type: "flag", flag: "askedObs" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
      s = turn(play(s, [set("dir", -1), ...(style === "story" ? [] : [set("speed", 2)]), ...(style === "challenge" ? [set("size", 1 / 2)] : [])]));
      expect(s.done).toBe(true);
      expect(coupleGoals(s, COUPLE_SLACK[style])).toEqual({ turns: 1, curiosity: true, ingenuity: true, kindness: true, feather: true });
    }
  });
  it("does not count a blunt answer as kindness, and a kind answer carries `kind` and `answered`", () => {
    const blunt = play(fresh("story"), [{ type: "flag", flag: "answered" }]);
    expect(blunt.flags).toEqual(["answered"]);
    expect(coupleGoals(blunt, null).kindness).toBe(false);
    expect(coupleGoals(play(blunt, [{ type: "flag", flag: "kind" }]), null).kindness).toBe(true);
  });
});

describe("the place kept in the middle", () => {
  /** One turning at the start (a miss) and two flags: a place in the middle of a quest. */
  const started = (style: CoupleStyle) => turn(play(fresh(style), [{ type: "flag", flag: "feather" }, { type: "flag", flag: "askedWhy" }]));
  const snap = (style: CoupleStyle) => JSON.parse(JSON.stringify(snapshotCouple(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restoreCouple(x, coupleOffer);
  it.each(STYLES)("comes back through JSON as it was, not finished and with no path, in %s", (style) => {
    const s = started(style);
    expect(s.done).toBe(false);
    const back = refused(JSON.parse(JSON.stringify(snapshotCouple(s))))!;
    expect(back).not.toBeNull();
    expect([back.style, back.setting, back.misses, back.turned, back.flags, back.done, back.last]).toEqual([style, s.setting, 1, 1, ["askedWhy", "feather"], false, null]);
    expect(back.offer).toEqual(coupleOffer(style));
  });
  it("keeps the choices as small whole numbers and nothing else: the style, the size index, the speed, the direction, the counts and the flags", () => {
    expect(Object.keys(snapshotCouple(fresh("challenge"))).sort()).toEqual(["dir", "flags", "misses", "size", "speed", "style", "turned"]);
    expect(snapshotCouple(play(fresh("challenge"), [set("size", 2 / 3), set("speed", 3), set("dir", -1)]))).toMatchObject({ size: 2, speed: 3, dir: -1 });
  });
  it("brings a saved setting that is the answer back set and not yet turned, and it can be turned", () => {
    const set0 = play(fresh("explorer"), [set("speed", 2), set("dir", -1), { type: "flag", flag: "askedObs" }]);
    expect(same(set0.setting, ANSWER)).toBe(true);
    const back = refused(JSON.parse(JSON.stringify(snapshotCouple(set0))))!;
    expect([back.done, back.last, back.turned, back.misses]).toEqual([false, null, 0, 0]);
    expect(same(back.setting, ANSWER)).toBe(true);
    expect(turn(back)).toMatchObject({ done: true, turned: 1, misses: 0 });
    // A file that says it is done, or has a path, does not make it so.
    expect(refused({ ...JSON.parse(JSON.stringify(snapshotCouple(set0))), done: true, last: { shape: { kind: "line" } } })).toMatchObject({ done: false, last: null });
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("challenge");
    expect(refused(good)).not.toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }]) expect(refused(bad)).toBeNull();
    for (const size of [-1, 3, 1.5, "1", null, NaN, undefined]) expect(refused({ ...good, size }), String(size)).toBeNull();
    for (const speed of [0, 4, -1, "2", null, NaN, undefined]) expect(refused({ ...good, speed }), String(speed)).toBeNull();
    for (const dir of [0, 2, "1", null, undefined]) expect(refused({ ...good, dir }), String(dir)).toBeNull();
    for (const misses of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, misses }), String(misses)).toBeNull();
    for (const turned of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, turned }), String(turned)).toBeNull();
    // More misses than turnings is not a thing that happened.
    expect(refused({ ...good, misses: 3, turned: 2 })).toBeNull();
    expect(refused({ ...good, flags: "feather" })).toBeNull();
    expect(refused({ ...good, flags: undefined })).toBeNull();
  });
  it("refuses a setting the way of playing does not offer, even though another way does", () => {
    const base = { misses: 0, turned: 0, flags: [] };
    // Story offers only the half size and twice the speed.
    expect(refused({ style: "story", size: 1, speed: 2, dir: -1, ...base })).not.toBeNull();
    expect(refused({ style: "story", size: 0, speed: 2, dir: -1, ...base })).toBeNull();
    expect(refused({ style: "story", size: 1, speed: 3, dir: -1, ...base })).toBeNull();
    expect(refused({ style: "story", size: 1, speed: 1, dir: 1, ...base })).toBeNull();
    // Explorer offers the half size and every speed.
    expect(refused({ style: "explorer", size: 1, speed: 3, dir: 1, ...base })).not.toBeNull();
    expect(refused({ style: "explorer", size: 2, speed: 3, dir: 1, ...base })).toBeNull();
    expect(refused({ style: "challenge", size: 2, speed: 3, dir: 1, ...base })).not.toBeNull();
  });
  it("drops flags it does not know, keeps the ones it does in their own order, and ignores what a file says about the offer, the path or whether it is done", () => {
    const back = refused({ ...snap("explorer"), flags: ["feather", "askedObs", "nonsense", 7, "kind", "kind", "askedFloat"], offer: { sizes: [9], speeds: [9], dirs: [1] }, done: true, last: { right: true }, par: 99 })!;
    expect(back.flags).toEqual(["askedObs", "kind", "feather"]);
    expect([back.done, back.last]).toEqual([false, null]);
    expect(back.offer).toEqual(coupleOffer("explorer"));
  });
  it("accepts a snapshot with the flag `answered` missing, as one kept before it existed would be", () => {
    const back = refused({ style: "story", size: 1, speed: 2, dir: 1, misses: 0, turned: 0, flags: ["askedObs", "kind"] })!;
    expect(back.flags).toEqual(["askedObs", "kind"]);
  });
  it("is not changed by the commands that change nothing", () => {
    const s = fresh("story");
    expect(applyCouple(s, set("dir", 1))).toBe(s);
    expect(applyCouple(applyCouple(s, { type: "flag", flag: "kind" }), { type: "flag", flag: "kind" }).flags).toEqual(["kind"]);
  });
});

describe("the picture and the page", () => {
  const art = readFileSync(resolve(__dirname, "..", "art", "couple.ts"), "utf8").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
  const ui = readFileSync(resolve(__dirname, "..", "ui", "couple.ts"), "utf8");
  it("draws no word or numeral, and is not mirrored for a page that reads right to left (it has no left-to-right order)", () => {
    expect(art).not.toMatch(/fillText|strokeText/);
    expect(art).not.toMatch(/rtl|mirror/i);
    expect([COUPLE_ART.w, COUPLE_ART.h]).toEqual([1000, 480]);
    // The large circle fits the picture with room to spare, and its middle is the middle of the picture.
    expect(COUPLE_ART.cx).toBe(COUPLE_ART.w / 2);
    expect(COUPLE_ART.cy).toBe(COUPLE_ART.h / 2);
    expect(COUPLE_ART.cy - COUPLE_ART.big).toBeGreaterThanOrEqual(20);
    expect(COUPLE_ART.cy + COUPLE_ART.big).toBeLessThanOrEqual(COUPLE_ART.h - 20);
  });
  it("sets the picture as an image with a description, controls as real radio buttons in labelled groups, and a turn button and a live region", () => {
    expect(ui).toMatch(/setAttribute\("role", "img"\)/);
    expect(ui).toMatch(/aria-label/);
    expect(ui).toMatch(/type: "radio"/);
    expect(ui).toMatch(/h\("fieldset"/);
    expect(ui).toMatch(/h\("legend"/);
    expect(ui).toMatch(/h\("label"/);
    expect(ui).toMatch(/aria-live/);
    expect(ui).toMatch(/ts_turn/);
    // The animation is the page's: the rules are never given a clock, and nothing in the rules or the content reads one.
    for (const f of ["sim/couple.ts", "content/couple.ts"]) {
      const src = readFileSync(resolve(__dirname, "..", f), "utf8").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
      expect(src, f).not.toMatch(/Date\.now|performance\.|setTimeout|requestAnimationFrame|Math\.random|document\.|window\./);
    }
    expect(ui).toMatch(/reducedMotion\(\)/);
  });
});

describe("the record behind the lines", () => {
  const has = (text: string, needle: string) => expect(text, needle).toContain(needle);
  it("rests the written lines on the sentences of the museum's records: the model, why, the most original achievement, the founding, the oversight, the first director, the library and school, about fifty years, China to Europe", () => {
    has(person, "The article calls his most original achievement his planetary theory");
    has(person, "troubled by the departure of the Ptolemaic system from uniform circular motion, he devised a model of two spheres, the smaller rotating twice as fast as the larger and in the opposite direction, so that a point on it moves along a straight line");
    has(person, "oversaw the building of an observatory and its instruments at Maragha in Azerbaijan, the Mongol headquarters, and became its first director");
    has(person, "with its large library and school");
    has(person, "although it lasted only about fifty years its intellectual legacy had repercussions from China to Europe");
    has(observatory, "The observatory at Maragha, in Azerbaijan, was founded by the Mongol ruler Hulagu at the suggestion of Nasir al-Din al-Tusi");
    has(observatory, "a large library and a school");
    has(observatory, "lasting only about fifty years its intellectual legacy had repercussions from China to Europe for centuries");
    // The same facts in the game's English lines.
    const en = table("en");
    has(en.ts_why_1, "troubled that Ptolemy's system departed from steady circular motion");
    has(en.ts_why_1, "devised a model of his own built from turning spheres");
    has(en.ts_obs_1, "founded by the Mongol ruler Hulagu at al-Tusi's suggestion");
    has(en.ts_obs_1, "oversaw its building and its instruments and was its first director");
    has(en.ts_obs_1, "a large library and a school");
    has(en.ts_note_2, "most original achievement");
    has(en.ts_note_2, "the smaller turning twice as fast as the larger and the opposite way");
    has(en.ts_note_4, "lasted only some fifty to sixty years");
    has(en.ts_note_4, "from China to Europe");
  });
  it("leaves the record's astrology out of every line: the game says nothing of astrology, in any language", () => {
    // The record says Hulagu's motives seem to have been astrological and that al-Tusi was his court astrologer.
    has(observatory, "Hulagu's motives, it says, seem to have been astrological");
    has(person, "court astrologer");
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ts_")) expect(v, `${l}:${k}`).not.toMatch(/astrolog|astroloji|التنجيم|المنجم|نجوم/i);
  });
  it("links only to records that exist in the museum's data: the person and the observatory", () => {
    expect([...COUPLE_RECORDS]).toEqual(["person/nasir-al-din-al-tusi", "building/maragha-observatory"]);
    for (const id of COUPLE_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("builds the quest's id from the subject's quest code in the Atlas, and the subject has both records and is in the first world", () => {
    const atlas = JSON.parse(readFileSync(resolve(__dirname, "..", "content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[]; worlds: { id: string; order: number }[] };
    const sub = atlas.subjects.find((s) => s.id === COUPLE_SUBJECT)!;
    expect(COUPLE_SUBJECT).toBe("al-tusi");
    expect(COUPLE_QUEST).toBe(`${sub.quest}-al-tusi`);
    expect(COUPLE_QUEST).toBe("w01q3-al-tusi");
    expect(sub.world).toBe("sky-stars-time");
    expect(atlas.worlds.find((w) => w.id === sub.world)?.order).toBe(1);
    expect([...sub.records].sort()).toEqual([...COUPLE_RECORDS].sort());
  });
});

describe("the words", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. */
  const WRITTEN: [string, string, string][] = [
    ["ts_intro_1", "صفحة الأطلس تدور مع دائرتين في المرصد ولا تستقر. أوقِفها على خط مستقيم!", "The page of the Atlas is going round with two circles in the observatory and will not settle. Bring it onto a straight line!"],
    ["ts_intro_2", "دائرتان تدوران، ومن دورانهما قد يخرج خط مستقيم. جرّب السرعة والاتجاه.", "Two circles turn, and out of their turning a straight line can come. Try the speed and the direction."],
    ["ts_why_1", "يقول سجل المتحف إن الطوسي أقلقه أن نظام بطليموس يخرج عن الحركة الدائرية المنتظمة، فابتكر نموذجًا من عنده مبنيًّا على كرات تدور.", "The museum's record says al-Tusi was troubled that Ptolemy's system departed from steady circular motion, so he devised a model of his own built from turning spheres."],
    ["ts_obs_1", "ويقول إن مرصد مراغة أسّسه الحاكم المغولي هولاكو باقتراح من الطوسي، وإن الطوسي أشرف على بنائه وآلاته وكان أول مدير له، وكانت فيه مكتبة كبيرة ومدرسة.", "It says the observatory at Maragha was founded by the Mongol ruler Hulagu at al-Tusi's suggestion, that al-Tusi oversaw its building and its instruments and was its first director, and that it had a large library and a school."],
    ["ts_note_1", "هذه لعبة وليست كتاب تاريخ. الدائرتان على الصفحة والطفلة التي تنظّف الآلات وكل كلمة تُقال من خيال اللعب.", "This is a game, not a history. The two circles on the page, the girl who cleans the instruments and every spoken line are invented for play."],
    ["ts_note_2", "من سجل المتحف: يُعدّ نموذج الطوسي في حركة الكواكب أبدع ما أنجزه. وهو نموذج من كرتين، الصغرى تدور بضعف سرعة الكبرى وفي الاتجاه المعاكس، فتتحرك نقطة عليها على خط مستقيم.", "From the museum's record: al-Tusi's model of the planets' motion is called his most original achievement. It is a model of two spheres, the smaller turning twice as fast as the larger and the opposite way, so that a point on it moves along a straight line."],
    ["ts_note_3", "بُسِّط من أجل اللعب: يتحدث السجل عن كرات، وترسم اللعبة دوائر مسطّحة. وما قُرئ لهذه اللعبة لا يذكر مقدار الكرتين. ترسم اللعبة الصغرى بنصف عرض الكبرى، وبهذا المقدار يستقيم الخط في الحساب.", "Made simpler for play: the record speaks of spheres, and the game draws flat circles. What was read for this game does not give the sizes of the spheres. The game draws the smaller one half as wide as the larger, which is the size at which the arithmetic gives a straight line."],
    ["ts_note_4", "ويقول السجل إن مرصد مراغة لم يعمّر إلا ما بين خمسين وستين سنة، وإن أثره العلمي امتد قرونًا من الصين إلى أوروبا.", "The record also says the observatory at Maragha lasted only some fifty to sixty years, and that its learning was felt for centuries from China to Europe."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' labels", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    expect(table("en").ts_who_tusi).toBe("Al-Tusi, in imagined words");
    expect(table("ar").ts_who_tusi).toBe("الطوسي، بكلمات متخيَّلة");
    expect(table("en").ts_who_girl).toBe("The girl who cleans the instruments, an invented person");
    expect(table("ar").ts_who_girl).toBe("الطفلة منظّفة الآلات، شخصية من الخيال");
    expect(table("en").ts_rec_person).toBe("Nasir al-Din al-Tusi");
    expect(table("en").ts_rec_obs).toBe("the observatory at Maragha");
    expect(table("en").ts_turn).toBe("Turn the circles");
    // Four notes and no fifth; the one that states the model is the second.
    expect(Object.keys(table("en")).filter((k) => k.startsWith("ts_note_"))).toEqual(["ts_note_1", "ts_note_2", "ts_note_3", "ts_note_4"]);
  });
  it("never calls an invented character the Messenger, in any language that has the word", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ts_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) {
      if (!k.startsWith("ts_")) continue;
      expect(v.replace(/\{\w+\}/g, "").match(/[0-9٠-٩۰-۹]+/g) ?? [], `${l}:${k}`).toEqual([]);
    }
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ts_")) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ts_")) expect(v, `${l}:${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله/);
  });
  const src = readFileSync(resolve(__dirname, "..", "ui", "couple.ts"), "utf8");
  const OPTION_KEYS = ["ts_dir_same", "ts_dir_other", "ts_speed_1", "ts_speed_2", "ts_speed_3", "ts_size_third", "ts_size_half", "ts_size_twothirds"];
  /** Every key the page, the content and the shapes use, in one set. */
  const used = (): Set<string> => {
    const keys = new Set([...src.matchAll(/"(ts_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const w of ["hudhud", "tusi", "girl", "narrator"]) keys.add(`ts_who_${w}`);
    for (const k of OPTION_KEYS) keys.add(k);
    return keys;
  };
  it("has every key the page uses, in all seven languages, with no part left empty, and no key that nothing uses", () => {
    const keys = used();
    expect(keys.size).toBeGreaterThan(55);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("ts_")) expect(keys.has(k), k).toBe(true);
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("ts_")), l).toEqual(Object.keys(table("en")).filter((k) => k.startsWith("ts_")));
    for (const l of LANGS) for (const k of keys) expect([...(table(l)[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l}:${k}`).toEqual([...(table("en")[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
  });
  it("is appended in one block after the keys of the eighth quest, and only the next quests' keys (`cq_`, then `ah_`, then `rz_`) come after it", () => {
    for (const l of LANGS) {
      const ks = Object.keys(table(l));
      const first = ks.findIndex((k) => k.startsWith("ts_"));
      expect(first, l).toBeGreaterThan(0);
      const count = ks.filter((k) => k.startsWith("ts_")).length;
      expect(ks.slice(first, first + count).every((k) => k.startsWith("ts_")), l).toBe(true);
      expect(ks.slice(first + count).every((k) => k.startsWith("cq_") || k.startsWith("ah_") || k.startsWith("rz_")), l).toBe(true);
      expect(ks[first - 1]!.startsWith("ib_"), l).toBe(true);
    }
  });
  it("says in the hub that quests are built, in every language, and no longer eight (the count itself is pinned in leaves.gtest.ts)", () => {
    expect(table("en").hub_note).toMatch(/(Nine|Ten|Eleven|Twelve) quests are built/);
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\beight quests|\bhuit quêtes|\bocho misiones|\bsekiz görev|\bdelapan misi|ثماني مهمات|آٹھ مہمیں/i);
  });
  it("gives the answer away in nothing the page shows before the line is found: not the speed, not the direction, in any language", () => {
    // The words for "twice" and "the opposite way" in each language's own note of the model.
    const WORDS: Record<string, { twice: string; opposite: string }> = {
      ar: { twice: "بضعف", opposite: "المعاكس" },
      en: { twice: "twice", opposite: "opposite" },
      ur: { twice: "دوگنی", opposite: "الٹی" },
      fr: { twice: "deux fois", opposite: "opposé" },
      es: { twice: "al doble", opposite: "opuesto" },
      tr: { twice: "iki katı", opposite: "ters" },
      id: { twice: "dua kali", opposite: "berlawanan" },
    };
    const endAt = src.indexOf("function end_(");
    const againAt = src.indexOf("function again(");
    expect(endAt).toBeGreaterThan(0);
    expect(againAt).toBeGreaterThan(endAt);
    const endKeys = new Set([...src.slice(endAt, againAt).matchAll(/"(ts_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    const elsewhere = new Set([...(src.slice(0, endAt) + src.slice(againAt)).matchAll(/"(ts_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    // The keys used only at the end, once the page is found: the notes, the goals, the links and the review line.
    const endOnly = [...endKeys].filter((k) => !elsewhere.has(k));
    for (const k of ["ts_note_1", "ts_note_2", "ts_note_3", "ts_note_4", "ts_review", "ts_done_1", "ts_goal_curiosity_how", "ts_goal_ingenuity_how", "ts_goal_kindness_how", "ts_goal_feather_how", "ts_rec_person", "ts_rec_obs"]) expect(endOnly, k).toContain(k);
    expect(elsewhere.has("ts_note_2")).toBe(false);
    for (const l of LANGS) {
      const w = WORDS[l]!;
      const note = table(l).ts_note_2!.toLowerCase();
      // The words really are in the note that states the model.
      expect(note, `${l}: twice`).toContain(w.twice);
      expect(note, `${l}: opposite`).toContain(w.opposite);
      // Nothing else the page shows contains either word, except the one choice that names the speed.
      const before = [...used()].filter((k) => !endOnly.includes(k));
      for (const k of before) {
        const v = (table(l)[k] ?? "").toLowerCase();
        if (k === "ts_speed_2") continue;
        expect(v, `${l}:${k} has "twice"`).not.toContain(w.twice);
        expect(v, `${l}:${k} has "opposite"`).not.toContain(w.opposite);
      }
      // The speed that is the answer is named by its choice, as the other speeds are; the direction choices say "the same way" and "the other way", and name neither the answer.
      expect(table(l).ts_speed_2!.toLowerCase(), `${l}: the choice`).toContain(w.twice);
      expect(table(l).ts_dir_other!.toLowerCase(), `${l}: the other way`).not.toContain(w.opposite);
    }
  });
  it("names the shapes with a phrase that takes its count and nothing else, and says them in every language the same way", () => {
    for (const l of LANGS) {
      const t = table(l);
      expect(t.ts_shape_loops, l).toContain("{n}");
      for (const k of ["ts_shape_line", "ts_shape_circle", "ts_shape_oval", "ts_shape_loop", "ts_shape_cusp"]) expect(t[k], `${l}:${k}`).not.toContain("{");
      expect(t.ts_traced, l).toContain("{shape}");
      expect(t.ts_picture_path, l).toContain("{shape}");
      // The sentences for a turning name their shape or say it is not a line: none is the same as another.
      const said = [t.ts_traced, t.ts_traced_line, t.ts_miss_story, t.ts_miss_challenge, t.ts_end_done];
      expect(new Set(said).size, l).toBe(said.length);
    }
  });
  it("takes each name from the museum's records unless it is on a short list of named exceptions, which is exactly this list", () => {
    const label = (path: string) => (parse(readFileSync(resolve(root, "data", path), "utf8")) as { label: Record<string, string | undefined> }).label;
    // The form of each name the lines use, in each language, and the record that has it (or not).
    const USED: Record<string, Record<string, string>> = {
      maragha: { ar: "مراغة", en: "Maragha", ur: "مراغہ", fr: "Maragha", es: "Maragha", tr: "Maragha", id: "Maragha" },
      ptolemy: { ar: "بطليموس", en: "Ptolemy", ur: "بطلیموس", fr: "Ptolémée", es: "Ptolomeo", tr: "Ptolemaios", id: "Ptolemy" },
      hulagu: { ar: "هولاكو", en: "Hulagu", ur: "ہلاکو", fr: "Hulagu", es: "Hulagu", tr: "Hulagu", id: "Hulagu" },
    };
    const RECORD: Record<string, string> = { maragha: "place/maragha.yaml", ptolemy: "person/batlamus.yaml", hulagu: "person/hulagu.yaml" };
    // Where the game's form is not the record's label, and why: the label is missing, has a stray full stop, or is the
    // English name left untranslated, so the form the museum's own pages use most is taken instead.
    const EXCEPTIONS: Record<string, string> = {
      "maragha:ur": "مراگھا۔ -> مراغہ",
      "ptolemy:fr": "Ptolemy -> Ptolémée",
      "ptolemy:es": "Ptolemy -> Ptolomeo",
      "ptolemy:tr": "undefined -> Ptolemaios",
      "ptolemy:id": "undefined -> Ptolemy",
      "hulagu:ar": "هولاكو خان -> هولاكو",
      "hulagu:en": "undefined -> Hulagu",
      "hulagu:ur": "undefined -> ہلاکو",
      "hulagu:fr": "undefined -> Hulagu",
      "hulagu:es": "undefined -> Hulagu",
      "hulagu:tr": "undefined -> Hulagu",
      "hulagu:id": "undefined -> Hulagu",
    };
    const found: Record<string, string> = {};
    for (const [name, path] of Object.entries(RECORD)) {
      const lab = label(path);
      for (const l of LANGS) if (lab[l] !== USED[name]![l]) found[`${name}:${l}`] = `${lab[l]} -> ${USED[name]![l]}`;
    }
    expect(found).toEqual(EXCEPTIONS);
    // The names the lines use are the names in the lines.
    const needs: [string, string][] = [["ts_obs_1", "maragha"], ["ts_obs_1", "hulagu"], ["ts_why_1", "ptolemy"]];
    for (const l of LANGS) for (const [k, name] of needs) expect(table(l)[k], `${l}:${k}:${name}`).toContain(USED[name]![l]);
    // The game's name for the observatory is the museum's label for the building, where it has one, with the article the sentence needs.
    const obs = label("building/maragha-observatory.yaml");
    for (const l of LANGS) expect(table(l).ts_rec_obs.toLowerCase(), l).toContain(USED.maragha![l]!.toLowerCase());
    expect(obs.en).toBe("Maragha Observatory");
    // Al-Tusi's name is the Atlas heading's, in every language.
    for (const l of LANGS.filter((x) => x !== "en")) expect(table(l).ts_rec_person, l).toBe(atlasTable(l).s_al_tusi);
    expect(table("en").ts_rec_person).toBe(atlasTable("en").s_al_tusi);
  });
});
