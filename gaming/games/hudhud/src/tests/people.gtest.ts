// No two people overlap where a room begins (the founder saw the explorer standing in front of a figure and hiding part
// of it, 27 November 2026). For every room on the room engine, Hudhud, the explorer, the room's figure and its helper are
// drawn where the room places them at its start, and their drawn boxes are compared: none may overlap another. The boxes
// are made from content/people.ts, which this test first holds to the painters' own sizes (art/cast.ts) and to the
// placements the scenes themselves use, so that a figure moved or redrawn cannot slip past it.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BIRD, EXPLORER, HELPER, SCHOLAR, drawnBox, overlaps, type Box, type Figure } from "../content/people";
import { START_AT, WORLD } from "../content/workshop";
import { JR_START, JR_WORLD } from "../content/jazari-room";
import { TSR_START, TSR_WORLD } from "../content/tusi-room";
import { AKR_START, AKR_WORLD } from "../content/khwarizmi-room";
import { KDR_START, KDR_WORLD } from "../content/kindi-room";
import { ISR_START, ISR_WORLD } from "../content/idrisi-room";
import { RZR_START, RZR_WORLD } from "../content/razi-room";

const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");

/** Every room's people where it begins: the bird and the explorer from its layout, its figure and its helper (the workshop has no helper; its cat is not a person). */
const ROOMS: { room: string; scene: string; floor: number; hudhud: number; keeper: number; figure: { name: string; x: number }; helper: { name: string; x: number } | null }[] = [
  { room: "Ibn al-Haytham's workshop", scene: "scenes/workshop.ts", floor: WORLD.floor, hudhud: START_AT.hudhud.x, keeper: START_AT.keeper.x, figure: { name: "sage", x: START_AT.scholar.x }, helper: null },
  { room: "al-Jazari's workshop", scene: "scenes/jazari.ts", floor: JR_WORLD.floor, hudhud: JR_START.hudhud, keeper: JR_START.keeper, figure: { name: "jazari", x: JR_START.jazari }, helper: { name: "app", x: JR_START.apprentice } },
  { room: "al-Tusi's observatory", scene: "scenes/tusi.ts", floor: TSR_WORLD.floor, hudhud: TSR_START.hudhud, keeper: TSR_START.keeper, figure: { name: "tusi", x: TSR_START.tusi }, helper: { name: "girl", x: TSR_START.girl } },
  { room: "al-Khwarizmi's room", scene: "scenes/khwarizmi.ts", floor: AKR_WORLD.floor, hudhud: AKR_START.hudhud, keeper: AKR_START.keeper, figure: { name: "khwarizmi", x: AKR_START.khwarizmi }, helper: { name: "child", x: AKR_START.child } },
  { room: "al-Kindi's room", scene: "scenes/kindi.ts", floor: KDR_WORLD.floor, hudhud: KDR_START.hudhud, keeper: KDR_START.keeper, figure: { name: "kindi", x: KDR_START.kindi }, helper: { name: "messenger", x: KDR_START.messenger } },
  { room: "al-Idrisi's hall", scene: "scenes/idrisi.ts", floor: ISR_WORLD.floor, hudhud: ISR_START.hudhud, keeper: ISR_START.keeper, figure: { name: "idrisi", x: ISR_START.idrisi }, helper: { name: "helper", x: ISR_START.helper } },
  { room: "al-Razi's study", scene: "scenes/razi.ts", floor: RZR_WORLD.floor, hudhud: RZR_START.hudhud, keeper: RZR_START.keeper, figure: { name: "razi", x: RZR_START.razi }, helper: { name: "child", x: RZR_START.child } },
];

/** Every `this.put(<box>, "<key>", x, y, ox, oy)` in a source file, its numbers worked out (an origin left out is the middle). */
function placements(text: string): { box: string; key: string; at: number[] }[] {
  const num = (a: string) => (/^[-\d.\s/*+]+$/.test(a) ? Number(Function(`"use strict"; return (${a});`)()) : Number.NaN);
  return [...text.matchAll(/this\.put\((\w+), "([\w-]+)", ([^()]*)\)/g)].map((m) => {
    const args = m[3]!.split(",").map((a) => num(a.trim()));
    return { box: m[1]!, key: m[2]!, at: [args[0]!, args[1]!, args[2] ?? 0.5, args[3] ?? 0.5] };
  });
}
/** That a figure's parts are placed in a source file exactly as content/people.ts has them, in its box, under its name. */
function placedAs(text: string, box: string, name: string, f: Figure, who: string): void {
  const found = placements(text).filter((p) => p.box === box && p.key.startsWith(`${name}-`));
  for (const part of f.parts) {
    const want = [part.x, part.y, part.ox, part.oy];
    const hit = found.filter((p) => p.key === `${name}-${part.part}`).some((p) => p.at.every((v, i) => Math.abs(v - want[i]!) < 1e-9));
    expect(hit, `${who}: ${name}-${part.part} at ${want.join(", ")}`).toBe(true);
  }
}

describe("the people of a room, as boxes", () => {
  it("are the sizes the painters give each part (Hudhud, the explorer, every room's figure and every helper)", async () => {
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    const ctx = new Proxy({} as Record<string | symbol, unknown>, {
      get: (o, k) => (k in o ? o[k] : (..._a: unknown[]) => (String(k).startsWith("create") ? { addColorStop: () => undefined } : undefined)),
      set: (o, k, v) => ((o[k] = v), true),
    });
    g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, toDataURL: () => "" }) };
    try {
      const cast = await import("../art/cast");
      const size = (f: Figure, part: string) => f.parts.find((p) => p.part === part)!;
      const same = (f: Figure, art: Record<string, { w: number; h: number }>, who: string) => {
        for (const p of f.parts) expect([art[p.part]!.w, art[p.part]!.h], `${who} ${p.part}`).toEqual([size(f, p.part).w, size(f, p.part).h]);
      };
      same(BIRD, cast.hudhud(1) as unknown as Record<string, { w: number; h: number }>, "Hudhud");
      same(EXPLORER, cast.keeper(1, { kind: 0, skin: 0, outfit: 0, hair: 0 }) as unknown as Record<string, { w: number; h: number }>, "the explorer");
      same(EXPLORER, cast.keeper(1, { kind: 1, skin: 2, outfit: 1, hair: 3 }) as unknown as Record<string, { w: number; h: number }>, "the explorer, the other kind");
      for (const look of [cast.SCHOLAR_LOOK, cast.JAZARI_LOOK, cast.TUSI_LOOK, cast.KHWARIZMI_LOOK, cast.KINDI_LOOK, cast.IDRISI_LOOK, cast.RAZI_LOOK]) same(SCHOLAR, cast.scholar(1, look) as unknown as Record<string, { w: number; h: number }>, look.seed);
      for (const [who, art] of [["apprentice", cast.apprentice(1)], ["cleaner", cast.cleaner(1)], ["box carrier", cast.boxCarrier(1)], ["messenger", cast.messenger(1)], ["map helper", cast.mapHelper(1)], ["leaf child", cast.leafChild(1)]] as const) same(HELPER, art as unknown as Record<string, { w: number; h: number }>, who);
    } finally {
      g.document = had;
    }
  });
  it("are placed as the room engine places Hudhud and the explorer", () => {
    const room = source("scenes/room.ts");
    placedAs(room, "inner", "bird", BIRD, "Hudhud");
    expect(room).toContain("const box = this.layer(m).setScale(1.2);");
    placedAs(room, "kBox", "keeper", EXPLORER, "the explorer");
    expect(room).toContain("setPosition(x, this.layout.world.floor).setScale(0.8)");
  });
  it.each(ROOMS.map((r) => [r.room, r] as const))("are placed in %s as its scene places its figure and its helper", (_name, r) => {
    const scene = source(r.scene);
    placedAs(scene, "sageBox", r.figure.name, SCHOLAR, `${r.room}, the figure`);
    expect(scene).toMatch(/const sageBox = this\.layer\(m\)\.setPosition\([^)]*\)\.setScale\(0\.86\);/);
    if (!r.helper) return;
    const box = /const (\w+) = this\.layer\(m\)\.setPosition\([^)]*floor \+ 8\)\.setScale\(0\.74\);/.exec(scene)?.[1];
    expect(box, r.room).toBeTruthy();
    placedAs(scene, box!, r.helper.name, HELPER, `${r.room}, the helper`);
  });
});

describe("where every room begins", () => {
  it.each(ROOMS.map((r) => [r.room, r] as const))("in %s no two people's drawn boxes overlap: Hudhud, the explorer, the figure and the helper", (_name, r) => {
    const people: [string, Box][] = [
      // The bird begins facing right, and the explorer faces the bird; the figure and the helper turn to the bird, so either way is allowed for them.
      ["Hudhud", drawnBox(BIRD, r.hudhud, r.floor, 1)],
      ["the explorer", drawnBox(EXPLORER, r.keeper, r.floor, r.hudhud >= r.keeper ? 1 : -1)],
      ["the figure", drawnBox(SCHOLAR, r.figure.x, r.floor, "either")],
      ...(r.helper ? [["the helper", drawnBox(HELPER, r.helper.x, r.floor, "either")] as [string, Box]] : []),
    ];
    for (let i = 0; i < people.length; i++) for (let j = i + 1; j < people.length; j++) expect(overlaps(people[i]![1], people[j]![1]), `${r.room}: ${people[i]![0]} and ${people[j]![0]}`).toBe(false);
  });
  it.each(ROOMS.map((r) => [r.room, r] as const))("in %s the explorer stands still at the start: it is already as near the bird as it walks to (scenes/room.ts follows only beyond fifty pixels)", (_name, r) => {
    const goal = Math.max(80, r.hudhud - 96);
    expect(Math.abs(goal - r.keeper)).toBeLessThanOrEqual(50);
  });
  it("tells an overlap when there is one: the explorer where every room used to start it overlaps Hudhud", () => {
    expect(overlaps(drawnBox(EXPLORER, 170, 624, 1), drawnBox(BIRD, 250, 624, 1))).toBe(true);
    expect(overlaps(drawnBox(EXPLORER, 106, 624, 1), drawnBox(BIRD, 250, 624, 1))).toBe(false);
  });
});
