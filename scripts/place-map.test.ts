// The Place wing map (docs/site/dates-timeline-maps.md, "The Place wing map"): the pure helpers behind its data, the
// plain browser script's copies of them, and the promises the page makes about what the script does on a reader's device.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { ACTIVE, activityState, EARLIER, mergeIntervals, NOT_YET, searchKey, shardName, shardOf, SHARDS, tierOf, UNDATED, wholeYears, yearBounds } from "../site/src/lib/place-map-core";

const script = readFileSync(new URL("../site/public/shell/place-map.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../site/public/shell/place-map.css", import.meta.url), "utf8");

/** The source of a named function inside the browser script, found by matching braces. */
function source(name: string): string {
  const start = script.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`place-map.js has no function ${name}`);
  let depth = 0;
  for (let i = script.indexOf("{", start); i < script.length; i++) {
    if (script[i] === "{") depth++;
    else if (script[i] === "}" && --depth === 0) return script.slice(start, i + 1);
  }
  throw new Error(`unbalanced braces in ${name}`);
}
/** The browser script's own copy of a helper, runnable here. `C` stands for the page's configuration. */
const browser = <T extends (...a: any[]) => any>(name: string): T => new Function("C", `${source(name)}; return ${name};`)({ shards: SHARDS }) as T;

describe("place map: spans of years", () => {
  it("merges spans that overlap, touch or lie within the gap, and keeps the rest apart", () => {
    expect(mergeIntervals([[610, 632], [570, 632], [634, 644], [900, 910]])).toEqual([570, 644, 900, 910]);
    expect(mergeIntervals([[900, 910], [100, 120]], 5)).toEqual([100, 120, 900, 910]);
    expect(mergeIntervals([])).toEqual([]);
  });
  it("never returns more spans than the cap, closing the smallest gaps first", () => {
    const many = Array.from({ length: 12 }, (_, i) => [i * 100, i * 100 + 10] as [number, number]);
    many[5] = [480, 495]; // 15 years before the next span: the first gap to close
    const out = mergeIntervals(many, 5, 6);
    expect(out.length).toBe(12);
    expect(out[0]).toBe(0);
    expect(out[out.length - 1]).toBe(1110);
  });
  it("drops spans that are not numbers or run backwards", () => {
    expect(mergeIntervals([[Number.NaN, 5], [10, 2], [7, 9]])).toEqual([7, 9]);
  });
  it("reads the graph's decimal years as whole years", () => {
    expect(wholeYears({ earliest: 761.9998357255795, latest: 762.9991717830987 })).toEqual([762, 763]);
    expect(wholeYears({ earliest: 570.0004, latest: 632.4968 })).toEqual([570, 633]);
  });
});

describe("place map: what a place is in a given year", () => {
  const baghdad = [762, 1258, 1300, 1400];
  it("is active inside a span, earlier between and after spans, not yet before the first", () => {
    expect(activityState(baghdad, 800)).toBe(ACTIVE);
    expect(activityState(baghdad, 762)).toBe(ACTIVE);
    expect(activityState(baghdad, 1280)).toBe(EARLIER);
    expect(activityState(baghdad, 2000)).toBe(EARLIER);
    expect(activityState(baghdad, 632)).toBe(NOT_YET);
  });
  it("is undated when nothing tied to it carries a date", () => {
    expect(activityState([], 800)).toBe(UNDATED);
  });
  it("sizes a marker by the records tied to the place", () => {
    expect([0, 2, 3, 29, 30, 979].map(tierOf)).toEqual([0, 0, 1, 1, 2, 2]);
  });
  it("takes the slider's range from the data: first percentile of the starts, latest end", () => {
    const starts = [-2000, ...Array.from({ length: 199 }, (_, i) => 553 + i * 7)];
    const b = yearBounds(starts, [2027, 1900]);
    expect(b.min).toBe(560); // the lone 2000 BCE record does not stretch the bar; the bound is rounded down to a decade
    expect(b.max).toBe(2027);
    expect(yearBounds([], [])).toEqual({ min: 570, max: 2000 });
  });
});

describe("place map: search and file names", () => {
  it("matches a name however its hamzas, marks and final letters are typed", () => {
    expect(searchKey("مكّة المكرّمة")).toBe(searchKey("مكه المكرمه"));
    expect(searchKey("الإسكندرية")).toBe(searchKey("الاسكندريه"));
    expect(searchKey("Córdoba")).toBe("cordoba");
    expect(searchKey("al-Qāhira")).toBe("alqahira");
    expect(searchKey("⁦(مصر)⁩")).toBe("(مصر)");
  });
  it("spreads names over the files evenly enough and names them with two hexadecimal digits", () => {
    const hits = new Array(SHARDS).fill(0);
    for (let i = 0; i < 4000; i++) hits[shardOf(`place-${i}`)]++;
    expect(Math.min(...hits)).toBeGreaterThan(8);
    expect(Math.max(...hits)).toBeLessThan(70);
    expect(shardName(0)).toBe("00");
    expect(shardName(SHARDS - 1)).toBe("7f");
  });
});

describe("place map: the browser script agrees with the build", () => {
  it("activityState and tierOf give the same answers", () => {
    const js = browser<typeof activityState>("activityState"), jsTier = browser<typeof tierOf>("tierOf");
    const spans = [[], [762, 1258], [570, 632, 800, 900], [1900, 2027]];
    for (const iv of spans) for (const y of [550, 570, 632, 700, 850, 1258, 1300, 1950, 2027]) expect(js(iv, y)).toBe(activityState(iv, y));
    for (const n of [0, 1, 2, 3, 29, 30, 500]) expect(jsTier(n)).toBe(tierOf(n));
  });
  it("searchKey gives the same key", () => {
    const js = browser<typeof searchKey>("searchKey");
    for (const s of ["مكّة المكرّمة", "الإسكندرية", "Córdoba", "al-Qāhira", "دہلی", "Samarkand  (Uzbekistan)", "أُحُد"]) expect(js(s)).toBe(searchKey(s));
  });
  it("shardOf points at the same file", () => {
    const js = browser<(k: string) => string>("shardOf");
    for (const k of ["mecca", "baghdad", "person/muhammad", "event/hijra", "a", ""]) expect(js(k)).toBe(shardName(shardOf(k)));
  });
});

describe("place map: what the script does on a reader's device", () => {
  it("fetches only the page's own static JSON files", () => {
    const calls = [...script.matchAll(/\bfetch\(([^)]*)\)/g)].map((m) => m[1]);
    expect(calls).toEqual(['C.base + name + ".json"']);
    // the only address in the file is the SVG namespace, which names a format and is never requested
    expect(script.replaceAll("http://www.w3.org/2000/svg", "")).not.toMatch(/XMLHttpRequest|WebSocket|EventSource|sendBeacon|https?:\/\//);
  });
  it("stores nothing: no cookie, no local or session storage", () => {
    expect(script).not.toMatch(/localStorage|sessionStorage|document\.cookie|indexedDB/);
  });
  it("is a plain file that needs no bundler", () => {
    expect(script).not.toMatch(/^\s*(import|export)\s/m);
    expect(styles).not.toMatch(/@import|url\(\s*["']?https?:/);
  });
  it("honours reduced motion and both themes without a script", () => {
    expect(script).toContain("prefers-reduced-motion");
    expect(styles).toMatch(/:root\[data-theme="dark"\] \.pm/);
    expect(styles).toMatch(/@media \(prefers-color-scheme: dark\)/);
  });
});

describe("place map: strings", () => {
  const langs = ["ar", "en", "ur"].map((l) => parse(readFileSync(new URL(`../i18n/${l}.yaml`, import.meta.url), "utf8")).map.viewer);
  it("names the twelve regions and the ten kinds of place in every language", () => {
    for (const v of langs) {
      expect(Object.keys(v.regions)).toHaveLength(12);
      expect(Object.keys(v.kind).sort()).toEqual(["city", "island", "mountain", "oasis", "province", "region", "river", "sea", "site", "town"]);
    }
  });
  it("uses every string the script asks for", () => {
    const asked = new Set([...script.matchAll(/\bT\.([a-z_]+)\b/g)].map((m) => m[1]));
    for (const v of langs) for (const k of asked) expect(v[k], `map.viewer.${k}`).toBeDefined();
  });
  it("keeps placeholders the same across languages", () => {
    const holes = (s: unknown) => (typeof s === "string" ? (s.match(/\{\w+\}/g) ?? []).sort().join() : "");
    for (const k of Object.keys(langs[0])) for (const v of langs.slice(1)) expect(holes(v[k]), `map.viewer.${k}`).toBe(holes(langs[0][k]));
  });
});
