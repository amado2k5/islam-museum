import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { EARTH_RADIUS_KM, bearingDeg, centuryCE, distanceKm, interpolate, wrapLon } from "../src/geo";
import { LANGS, checkPack, decodePack, digestInput, encodePack, type PackFile, type PackLabels } from "../src/pack";
import { FALLOFF_KM, MAX_ROUND_POINTS, REGION_HINT_COST, ROUNDS_PER_GAME, TOLERANCE_KM, centuryTally, dailyRounds, daysBetween, distancePoints, isOver, maxPoints, newGame, practiceRounds, shareMarks, step, totalPoints } from "../src/rules";
import { SAVE_VERSION, emptySave, readSave, resumable, writeSave } from "../src/save";
import { DAILY_MINIMUM, PLACE_COOLDOWN_DAYS, buildSchedule, checkSchedule } from "../src/schedule";

const data = (name: string) => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
const file = data("pack.v1.json") as PackFile;
const pack = decodePack(file);
const labels = Object.fromEntries(LANGS.map((l) => [l, data(`labels.v1.${l}.json`) as PackLabels]));

describe("great-circle distance", () => {
  it("matches known values", () => {
    const degree = (Math.PI / 180) * EARTH_RADIUS_KM;
    expect(distanceKm(0, 0, 0, 1)).toBeCloseTo(degree, 6);
    expect(distanceKm(0, 0, 1, 0)).toBeCloseTo(degree, 6);
    expect(distanceKm(0, 0, 0, 180)).toBeCloseTo(Math.PI * EARTH_RADIUS_KM, 6);
    expect(distanceKm(21.4225, 39.8262, 21.4225, 39.8262)).toBe(0);
  });

  it("is short across the antimeridian, not the long way round", () => {
    expect(distanceKm(0, 179.5, 0, -179.5)).toBeCloseTo((Math.PI / 180) * EARTH_RADIUS_KM, 6);
    expect(distanceKm(10, 179.9, 10, -179.9)).toBeLessThan(25);
    expect(distanceKm(0, 190, 0, -170)).toBeCloseTo(0, 6);
  });

  it("is right at and near the poles", () => {
    expect(distanceKm(90, 0, 90, 123)).toBeCloseTo(0, 6);
    expect(distanceKm(89, 0, 89, 180)).toBeCloseTo(2 * (Math.PI / 180) * EARTH_RADIUS_KM, 6);
    expect(distanceKm(-90, 50, 90, -20)).toBeCloseTo(Math.PI * EARTH_RADIUS_KM, 6);
  });

  it("is symmetric and obeys the triangle inequality on sample points", () => {
    const pts: Array<[number, number]> = [[21.42, 39.83], [41.01, 28.98], [37.19, -3.61], [39.65, 66.96], [-6.2, 106.8], [33.31, 44.37]];
    for (const a of pts) for (const b of pts) {
      expect(distanceKm(a[0], a[1], b[0], b[1])).toBeCloseTo(distanceKm(b[0], b[1], a[0], a[1]), 9);
      for (const c of pts) expect(distanceKm(a[0], a[1], c[0], c[1])).toBeLessThanOrEqual(distanceKm(a[0], a[1], b[0], b[1]) + distanceKm(b[0], b[1], c[0], c[1]) + 1e-6);
    }
  });

  it("wraps longitudes, takes bearings and interpolates along the arc", () => {
    expect(wrapLon(190)).toBe(-170);
    expect(wrapLon(-180)).toBe(-180);
    expect(wrapLon(540)).toBe(-180);
    expect(bearingDeg(0, 0, 10, 0)).toBeCloseTo(0, 6);
    expect(bearingDeg(0, 0, 0, 10)).toBeCloseTo(90, 6);
    const mid = interpolate(0, 0, 0, 90, 0.5);
    expect(mid[0]).toBeCloseTo(0, 6);
    expect(mid[1]).toBeCloseTo(45, 6);
    const across = interpolate(0, 170, 0, -170, 0.5);
    expect(Math.abs(across[1])).toBeCloseTo(180, 6);
  });
});

describe("centuries", () => {
  it("counts the way historians do: 701 to 800 is the eighth", () => {
    expect(centuryCE(1)).toBe(1);
    expect(centuryCE(100)).toBe(1);
    expect(centuryCE(700)).toBe(7);
    expect(centuryCE(701)).toBe(8);
    expect(centuryCE(2000)).toBe(20);
    expect(centuryCE(2001)).toBe(21);
  });
});

describe("scoring", () => {
  it("gives full marks within the record's own precision and never rises with distance", () => {
    for (const precision of ["site", "locality"] as const) {
      expect(distancePoints(0, precision)).toBe(MAX_ROUND_POINTS);
      expect(distancePoints(TOLERANCE_KM[precision], precision)).toBe(MAX_ROUND_POINTS);
      let prev = MAX_ROUND_POINTS;
      for (let km = 0; km <= 21000; km += 37) {
        const p = distancePoints(km, precision);
        expect(p).toBeLessThanOrEqual(prev);
        expect(p).toBeGreaterThanOrEqual(0);
        prev = p;
      }
      expect(distancePoints(TOLERANCE_KM[precision] + FALLOFF_KM, precision)).toBe(Math.round(MAX_ROUND_POINTS / Math.E));
      expect(distancePoints(5000, precision)).toBe(0);
    }
  });
});

describe("the pinned content pack", () => {
  it("decodes, is well formed, and matches its digest", () => {
    expect(checkPack(pack)).toEqual([]);
    expect(createHash("sha256").update(digestInput(pack)).digest("hex")).toBe(pack.digest);
    expect(encodePack(pack)).toEqual(file);
  });

  it("has a name for every place and every round in all seven languages, and for every region it uses", () => {
    for (const lang of LANGS) {
      const l = labels[lang]!;
      expect(l.lang).toBe(lang);
      for (const p of pack.places) {
        expect(typeof l.labels[p.id], `${lang} ${p.id}`).toBe("string");
        if (p.region) expect(typeof l.regions[p.region], `${lang} region ${p.region}`).toBe("string");
      }
      for (const r of pack.rounds) expect(l.labels[r.id]?.length, `${lang} ${r.id}`).toBeGreaterThan(0);
      for (const id of l.fallback) expect(id in l.labels).toBe(true);
      expect(l.terms.ah.length).toBeGreaterThan(0);
      expect(l.terms.ce.length).toBeGreaterThan(0);
    }
    // Arabic and English are never borrowed: every record in the pack has both.
    expect(labels.ar!.fallback).toEqual([]);
    expect(labels.en!.fallback).toEqual([]);
  });

  it("types no honorific and no Qur'an bracket in any label", () => {
    const banned = /ﷺ|﴿|﴾|صلى الله عليه وسلم|عليه السلام|رضي الله عنه|رحمه الله/;
    for (const lang of LANGS) for (const [id, text] of Object.entries(labels[lang]!.labels)) if (banned.test(text)) throw new Error(`${lang} ${id}: ${text}`);
  });

  it("keeps to the people rule: born 700 to 1900, or died 800 to 1950", () => {
    for (const r of pack.rounds) {
      if (r.type === "birth") expect(r.year >= 700 && r.year <= 1900, r.id).toBe(true);
      if (r.type === "death") expect(r.year >= 800 && r.year <= 1950, r.id).toBe(true);
    }
  });
});

describe("the 365-day schedule", () => {
  const report = checkSchedule(pack);

  it("has a valid game for every one of 365 days", () => {
    expect(report.problems).toEqual([]);
    expect(report.days).toBe(365);
    expect(report.roundsUsed).toBe(365 * ROUNDS_PER_GAME);
    expect(report.reusedRounds).toBe(0);
  });

  it("gives every day five different places, each answerable, with the category minimum", () => {
    for (const day of pack.schedule.days) {
      expect(new Set(day.map((i) => pack.rounds[i]!.place)).size).toBe(ROUNDS_PER_GAME);
      const cats: Record<string, number> = {};
      for (const i of day) {
        const r = pack.rounds[i]!;
        const p = pack.places[r.place]!;
        cats[r.category] = (cats[r.category] ?? 0) + 1;
        expect(Number.isFinite(p.lat) && Number.isFinite(p.lon)).toBe(true);
      }
      for (const c of Object.keys(DAILY_MINIMUM) as Array<keyof typeof DAILY_MINIMUM>) expect(cats[c] ?? 0).toBeGreaterThanOrEqual(DAILY_MINIMUM[c]);
    }
  });

  it("is rebuilt identically from the pack's own rounds", () => {
    const again = buildSchedule(pack.places, pack.rounds, 30, "check");
    expect(buildSchedule(pack.places, pack.rounds, 30, "check")).toEqual(again);
    expect(buildSchedule(pack.places, pack.rounds, 30, "other")).not.toEqual(again);
  });

  it("is caught when it is wrong", () => {
    const broken = structuredClone(pack);
    broken.schedule.days[5] = [...broken.schedule.days[4]!];
    const r = checkSchedule(broken);
    expect(r.problems.length).toBeGreaterThan(0);
    expect(r.reusedRounds).toBe(ROUNDS_PER_GAME);
    const near = structuredClone(pack);
    const place = near.rounds[near.schedule.days[0]![0]!]!.place;
    const other = near.rounds.findIndex((x, i) => x.place === place && !near.schedule.days.flat().includes(i));
    if (other >= 0) {
      near.schedule.days[3]![0] = other;
      expect(checkSchedule(near).problems.some((p) => p.includes("returns after"))).toBe(true);
    }
    expect(PLACE_COOLDOWN_DAYS).toBeGreaterThan(3);
  });
});

describe("the daily challenge", () => {
  it("is the same for a given UTC date, whatever the language, and changes at UTC midnight", () => {
    expect(dailyRounds(pack, "2026-12-01")).toEqual(pack.schedule.days[0]);
    expect(dailyRounds(pack, "2026-12-02")).toEqual(pack.schedule.days[1]);
    expect(dailyRounds(pack, "2026-12-01")).toEqual(dailyRounds(pack, "2026-12-01"));
    expect(dailyRounds(pack, "2026-12-01")).not.toEqual(dailyRounds(pack, "2026-12-02"));
  });

  it("counts days in UTC across month ends, leap days and years", () => {
    expect(daysBetween("2026-12-01", "2026-12-31")).toBe(30);
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(daysBetween("2027-02-28", "2027-03-01")).toBe(1);
    expect(daysBetween("2026-12-01", "2026-11-30")).toBe(-1);
    expect(() => daysBetween("2026-12-01", "tomorrow")).toThrow();
  });

  it("wraps before and after the schedule instead of failing", () => {
    expect(dailyRounds(pack, "2027-12-01")).toEqual(pack.schedule.days[0]);
    expect(dailyRounds(pack, "2026-11-30")).toEqual(pack.schedule.days[364]);
    expect(dailyRounds(pack, "2031-07-19").length).toBe(ROUNDS_PER_GAME);
  });
});

describe("playing a game", () => {
  const rounds = dailyRounds(pack, "2026-12-01");
  const answer = (i: number) => pack.places[pack.rounds[rounds[i]!]!.place]!;

  it("scores a perfect game at the maximum and ends after five rounds", () => {
    let s = newGame(pack, "daily", "2026-12-01", rounds);
    for (let i = 0; i < ROUNDS_PER_GAME; i++) {
      expect(isOver(s)).toBe(false);
      s = step(pack, s, { type: "guess", lat: answer(i).lat, lon: answer(i).lon, century: centuryCE(pack.rounds[rounds[i]!]!.year) });
    }
    expect(isOver(s)).toBe(true);
    expect(totalPoints(s)).toBe(maxPoints(s));
    expect(centuryTally(s)).toEqual({ right: 5, made: 5 });
    expect(() => step(pack, s, { type: "guess", lat: 0, lon: 0, century: null })).toThrow();
  });

  it("charges for the region hint once, on that round only, and never below zero", () => {
    let s = newGame(pack, "daily", "2026-12-01", rounds);
    s = step(pack, s, { type: "hint-region" });
    expect(() => step(pack, s, { type: "hint-region" })).toThrow();
    s = step(pack, s, { type: "guess", lat: answer(0).lat, lon: answer(0).lon, century: null });
    expect(s.results[0]!.points).toBe(MAX_ROUND_POINTS - REGION_HINT_COST);
    expect(s.regionHint).toBe(false);
    s = step(pack, s, { type: "hint-region" });
    s = step(pack, s, { type: "guess", lat: -answer(1).lat, lon: answer(1).lon + 180, century: null });
    expect(s.results[1]!.points).toBe(0);
    expect(centuryTally(s)).toEqual({ right: 0, made: 0 });
  });

  it("does not mutate the state it is given, and refuses a different pack", () => {
    const s0 = newGame(pack, "daily", "2026-12-01", rounds);
    const frozen = JSON.stringify(s0);
    step(pack, s0, { type: "guess", lat: 1, lon: 2, century: 9 });
    expect(JSON.stringify(s0)).toBe(frozen);
    expect(() => step({ ...pack, digest: "x" }, s0, { type: "guess", lat: 1, lon: 2, century: null })).toThrow();
    expect(() => step(pack, s0, { type: "guess", lat: Number.NaN, lon: 2, century: null })).toThrow();
    expect(() => step(pack, s0, { type: "guess", lat: 91, lon: 2, century: null })).toThrow();
  });

  it("shares marks that name nothing", () => {
    let s = newGame(pack, "daily", "2026-12-01", rounds);
    for (let i = 0; i < ROUNDS_PER_GAME; i++) s = step(pack, s, { type: "guess", lat: answer(i).lat + i * 3, lon: answer(i).lon, century: null });
    const marks = shareMarks(s);
    expect(marks.split(" ").length).toBe(ROUNDS_PER_GAME);
    expect(/^[●◐○· ]+$/.test(marks)).toBe(true);
  });

  it("deals a practice game from a seed: five different places, the same every time", () => {
    const a = practiceRounds(pack, "seed-1");
    expect(a).toEqual(practiceRounds(pack, "seed-1"));
    expect(a).not.toEqual(practiceRounds(pack, "seed-2"));
    expect(new Set(a.map((i) => pack.rounds[i]!.place)).size).toBe(ROUNDS_PER_GAME);
    const onlyPeople = practiceRounds(pack, "seed-1", (r) => r.category === "people");
    for (const i of onlyPeople) expect(pack.rounds[i]!.category).toBe("people");
    expect(() => practiceRounds(pack, "x", () => false)).toThrow();
  });
});

describe("saved games", () => {
  const date = "2026-12-01";
  const scheduled = dailyRounds(pack, date);
  const inProgress = () => {
    let s = newGame(pack, "daily", date, scheduled);
    s = step(pack, s, { type: "guess", lat: 10, lon: 20, century: 9 });
    s = step(pack, s, { type: "hint-region" });
    return s;
  };

  it("round-trips a game in progress, hint and all", () => {
    const save = emptySave();
    save.daily[date] = inProgress();
    save.practice = 4;
    const reading = readSave(writeSave(save));
    expect(reading.status).toBe("ok");
    expect(reading.save).toEqual(save);
    const back = resumable(reading.save, pack, date, scheduled)!;
    expect(back.at).toBe(1);
    expect(back.regionHint).toBe(true);
    // The resumed game continues exactly as the original would have.
    const a = step(pack, back, { type: "guess", lat: 1, lon: 2, century: null });
    const b = step(pack, save.daily[date]!, { type: "guess", lat: 1, lon: 2, century: null });
    expect(a).toEqual(b);
  });

  it("starts clean with nothing saved", () => {
    expect(readSave(null)).toEqual({ status: "empty", save: emptySave() });
    expect(readSave("")).toEqual({ status: "empty", save: emptySave() });
  });

  it("sets an unreadable save aside instead of failing or destroying it", () => {
    for (const raw of ["{not json", "null", "[]", '"text"', '{"v":1}', '{"v":1,"daily":[]}', '{"v":0,"daily":{}}', '{"daily":{}}']) {
      const r = readSave(raw);
      expect(r.status, raw).toBe("unreadable");
      expect(r.save).toEqual(emptySave());
      if (r.status === "unreadable") expect(r.keep).toBe(raw);
    }
  });

  it("refuses to overwrite a save written by a newer version", () => {
    const raw = JSON.stringify({ v: SAVE_VERSION + 1, daily: {}, somethingNew: true });
    const r = readSave(raw);
    expect(r.status).toBe("newer");
    if (r.status === "newer") expect(r.keep).toBe(raw);
  });

  it("drops a damaged day and keeps the others", () => {
    const save = emptySave();
    save.daily[date] = inProgress();
    const raw = JSON.parse(writeSave(save));
    raw.daily["2026-12-02"] = { rules: 1, rounds: "oops" };
    raw.daily["not-a-date"] = save.daily[date];
    raw.practice = -3;
    const r = readSave(JSON.stringify(raw));
    expect(r.status).toBe("ok");
    expect(Object.keys(r.save.daily)).toEqual([date]);
    expect(r.save.practice).toBe(0);
  });

  it("does not resume a game from another content pack, another rules version, or a different schedule", () => {
    const save = emptySave();
    save.daily[date] = inProgress();
    expect(resumable(save, { ...pack, digest: "another-pack" }, date, scheduled)).toBeNull();
    expect(resumable(save, pack, "2026-12-02", dailyRounds(pack, "2026-12-02"))).toBeNull();
    expect(resumable(save, pack, date, [...scheduled].reverse())).toBeNull();
    const old = emptySave();
    old.daily[date] = { ...inProgress(), rules: 0 };
    expect(resumable(old, pack, date, scheduled)).toBeNull();
    const torn = emptySave();
    torn.daily[date] = { ...inProgress(), at: 3 };
    expect(resumable(torn, pack, date, scheduled)).toBeNull();
    // The older game is still in the save: it is a record of that day, not garbage.
    expect(save.daily[date]).toBeDefined();
  });
});
