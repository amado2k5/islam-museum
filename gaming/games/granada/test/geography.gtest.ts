// Granada's region, checked against the museum's own coordinates: the city is inland and its two great ports are
// far apart, on either side of it. The concept images are not evidence for any of this.
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { directionTo, metresBetween, onMap, type LatLon } from "../src/world/geography";

const read = (name: string) => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
const PACK = read("museum-records.v1.json") as {
  format: string;
  version: number;
  digest: string;
  places: Record<string, string>;
  context: string[];
  ideas: Record<string, string>;
  records: Record<string, { kind: string; review: string; label: Record<string, string>; coordinates?: [number, number]; precision?: string }>;
};
const SOURCE = read("museum-records.source.json") as { places: Record<string, string>; context: string[]; ideas: Record<string, string> };
const at = (slug: string): LatLon => PACK.records[`place/${slug}`]!.coordinates!;
const km = (a: LatLon, b: LatLon) => Math.round(metresBetween(a, b) / 1000);

describe("distance and direction", () => {
  it("measures a degree of latitude as about 111.2 km, the same in both directions, and nothing as nothing", () => {
    expect(metresBetween([37, -3], [38, -3])).toBe(111_195);
    expect(metresBetween([38, -3], [37, -3])).toBe(111_195);
    expect(metresBetween([37.1882, -3.6067], [37.1882, -3.6067])).toBe(0);
  });

  it("puts east on the right and north at the top", () => {
    const origin: LatLon = [37, -3];
    expect(onMap(origin, [37, -2]).x).toBeGreaterThan(0);
    expect(onMap(origin, [37, -4]).x).toBeLessThan(0);
    expect(onMap(origin, [38, -3]).y).toBeGreaterThan(0);
    expect(directionTo(origin, [38, -3])).toBe("N");
    expect(directionTo(origin, [37, -2])).toBe("E");
    expect(directionTo(origin, [36, -4])).toBe("SW");
  });
});

describe("the pinned museum records", () => {
  it("is the pack its source list asks for, unaltered since it was built", () => {
    expect(PACK.format).toBe("im.granada.records");
    expect({ places: PACK.places, context: PACK.context, ideas: PACK.ideas }).toEqual({ places: SOURCE.places, context: SOURCE.context, ideas: SOURCE.ideas });
    expect(Object.keys(PACK.records).sort()).toEqual([...Object.keys(SOURCE.places), ...SOURCE.context, ...Object.values(SOURCE.ideas)].sort());
    const body = { places: PACK.places, context: PACK.context, ideas: PACK.ideas, records: PACK.records };
    expect(createHash("sha256").update(JSON.stringify(body)).digest("hex")).toBe(PACK.digest);
  });

  it("names every record in the seven languages and places every place", () => {
    for (const [id, r] of Object.entries(PACK.records)) {
      for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) expect(r.label[lang], `${id} in ${lang}`).toBeTruthy();
      if (id in PACK.places) expect(r.coordinates, id).toHaveLength(2);
    }
  });

  it("does not take the mosque opened in 2003 for a building of the Nasrid city", () => {
    expect(Object.keys(PACK.records)).not.toContain("building/granada-mosque");
  });
});

describe("the kingdom's geography", () => {
  const granada = at("granada");

  it("keeps Granada inland: the nearest place on the sea is about 51 km away", () => {
    const shore = Object.entries(PACK.places).filter(([, role]) => role === "port" || role === "coast");
    expect(shore.map(([id]) => id).sort()).toEqual(["place/almeria", "place/almunecar", "place/malaga"]);
    const nearest = Math.min(...shore.map(([id]) => metresBetween(granada, PACK.records[id]!.coordinates!)));
    expect(Math.round(nearest / 1000)).toBe(51);
    // Every shore place lies to the south of the city.
    for (const [id] of shore) expect(onMap(granada, PACK.records[id]!.coordinates!).y, id).toBeLessThan(0);
  });

  it("keeps the two ports apart: Málaga to the south-west, Almería to the east, 175 km between them", () => {
    expect(km(granada, at("malaga"))).toBe(89);
    expect(km(granada, at("almeria"))).toBe(109);
    expect(km(at("malaga"), at("almeria"))).toBe(175);
    expect(directionTo(granada, at("malaga"))).toBe("SW");
    expect(directionTo(granada, at("almeria"))).toBe("E");
    // Granada lies between them from west to east, which no single harbour scene can show.
    expect(onMap(granada, at("malaga")).x).toBeLessThan(0);
    expect(onMap(granada, at("almeria")).x).toBeGreaterThan(0);
    // The straight line from one port to the other is longer than either port's line to the city.
    expect(metresBetween(at("malaga"), at("almeria"))).toBeGreaterThan(Math.max(metresBetween(granada, at("malaga")), metresBetween(granada, at("almeria"))));
  });

  it("puts the snow mountain beside the city and the far towns far", () => {
    expect(km(granada, at("sierra-nevada"))).toBe(21);
    expect(directionTo(granada, at("sierra-nevada"))).toBe("SE");
    expect(km(granada, at("ronda"))).toBe(147);
    expect(directionTo(granada, at("loja"))).toBe("W");
    expect(directionTo(granada, at("guadix"))).toBe("E");
  });
});
