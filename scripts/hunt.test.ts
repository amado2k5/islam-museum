// The treasure hunt accepts each stop's own name in every language and no other stop's (docs/site/viewpoints.md, phase 2).
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { HUNT_ID, HUNT_KEYS } from "../site/src/lib/hunt";
const js = readFileSync("site/public/shell/hunt.js", "utf8");
const ok = new Function(js.slice(js.indexOf("  function fold"), js.indexOf("  function paint")) + ";return ok")() as (t: string, keys: string[]) => boolean;
const rooms = parse(readFileSync(`data/${HUNT_ID}.yaml`, "utf8")).rooms as { features: string[] }[];
const labels = rooms.map((r) => parse(readFileSync(`data/${r.features[0]}.yaml`, "utf8")).label as Record<string, string>);

describe("treasure hunt answers", () => {
  it("has one answer list per room", () => expect(HUNT_KEYS.length).toBe(rooms.length));
  it("accepts the stop's own name in every language, and only there", () => {
    labels.forEach((l, i) => HUNT_KEYS.forEach(({ keys }, j) => {
      for (const [lang, name] of Object.entries(l)) expect(ok(name, keys), `${lang}: ${name} for riddle ${j + 1}`).toBe(i === j);
    }));
  });
  it("never names the answer in a hint", () => HUNT_KEYS.forEach(({ hint, keys }, i) => {
    for (const [lang, name] of Object.entries(parse(readFileSync(`data/${hint}.yaml`, "utf8")).label as Record<string, string>)) expect(ok(name, keys), `${lang}: ${name} gives away riddle ${i + 1}`).toBe(false);
  }));
  it("forgives one slip and refuses empty or generic answers", () => {
    expect(ok("Kairuoan", HUNT_KEYS[5].keys) || ok("Kairouam", HUNT_KEYS[5].keys)).toBe(true);
    for (const t of ["", "a", "cave", "الغار", "mosque"]) for (const { keys } of HUNT_KEYS) expect(ok(t, keys)).toBe(false);
  });
});
