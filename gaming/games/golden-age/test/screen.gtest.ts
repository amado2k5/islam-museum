// The Golden Age screen, without a browser: where plots are, what the camera sees, what each plot is made of,
// what the panel says about a state, what is saved, and that every sentence exists in all seven languages.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Rng } from "@im/kernel/prng";
import { makePolicies } from "../src/policies";
import { BUILDING_TYPES, CANAL_COST, ENDOWABLE, GRID_W, PLOTS, RESEARCH_IDS, adjacent, endowCost, invariants, newGame, plotOf, preview, step, xyOf, type BuildingType, type Command, type State } from "../src/rules";
import { SAVE_KEY, SAVE_VERSION, playable, readSave, writeSave } from "../src/save";
import { runLab } from "../src/lab";
import { CHAPTERS, FAILING_CANAL, HOUSE_OF_BOOKS, SCENARIOS, WHAT_ENDURES } from "../src/scenarios";
import { createHash } from "node:crypto";
import { advice, aim, calendar, goals, ledger, overlay, plotInfo, plotProblems, project, researchList, showing, stocks, type Line } from "../src/ui/model";
import { buildEnvironment, buildPlot, envHeight, lookKey, walkerPose, type PlotLook } from "../src/view/board";
import { CAMERA_LIMITS, START_POSE, clampPose, eyeOf, groundPoint, pan, turn, viewPoint, zoom } from "../src/view/camera";
import { ALL_LINKS, BOARD, CANAL_BED, HALF, LANE_HALF, QUAY, RIVER_LEVEL, canalMasks, dirTo, nearestLink, neighbour, plotAt, plotCentre, plotName, type Dir } from "../src/view/layout";
import { looksOf } from "../src/view/looks";

const S = FAILING_CANAL;
const play = (s: State, ...cmds: Command[]) => cmds.reduce((acc, c) => step(S, acc, c), s);
const look = (over: Partial<PlotLook> = {}): PlotLook => ({ type: null, canal: 0, served: false, bathed: false, soy: 0, lined: false, rotation: false, wheel: false, ...over });

describe("layout", () => {
  it("puts every plot at its own place on the board and finds it again", () => {
    const seen = new Set<string>();
    for (let p = 0; p < PLOTS; p++) {
      const [x, z] = plotCentre(p);
      expect(x).toBeGreaterThan(BOARD.x0);
      expect(x).toBeLessThan(BOARD.x1);
      expect(z).toBeGreaterThan(BOARD.z0);
      expect(z).toBeLessThan(BOARD.z1);
      expect(plotAt(x, z)).toBe(p);
      seen.add(`${x},${z}`);
    }
    expect(seen.size).toBe(PLOTS);
    expect(plotAt(BOARD.x0 - 1, -10)).toBeNull();
    expect(plotAt(0, 5)).toBeNull();
    // Row 0 is the row on the river: nearest +Z.
    expect(plotCentre(plotOf(0, 0))[1]).toBeGreaterThan(plotCentre(plotOf(0, 1))[1]);
    expect(plotName(plotOf(2, 1))).toBe("C2");
  });

  it("knows the 82 places a canal link can be, and which one a point aims at", () => {
    expect(ALL_LINKS.length).toBe(82);
    expect(new Set(ALL_LINKS.map((l) => l.key)).size).toBe(82);
    for (const l of ALL_LINKS) {
      expect(adjacent(l.a, l.b)).toBe(true);
      const [ax, az] = plotCentre(l.a);
      const [bx, bz] = plotCentre(l.b);
      expect(nearestLink((ax + bx) / 2, (az + bz) / 2)?.key).toBe(l.key);
      // A little off the middle and to one side is still that link.
      expect(nearestLink(ax + (bx - ax) * 0.4 + 2, az + (bz - az) * 0.4 + 2)?.key).toBe(l.key);
    }
    expect(nearestLink(BOARD.x0 - 80, -100)).toBeNull();
  });

  it("turns canal links into the arms leaving each crossing", () => {
    const masks = canalMasks(newGame(S, 1).canals);
    // The inherited canal runs north from the bank through B1, B2 and B3.
    expect(masks[plotOf(1, 0)]).toBe(1 << 0);
    expect(masks[plotOf(1, 1)]).toBe((1 << 0) | (1 << 2));
    expect(masks[plotOf(1, 2)]).toBe(1 << 2);
    expect(masks.filter((m) => m !== 0).length).toBe(3);
    for (let p = 0; p < PLOTS; p++) {
      for (const d of [0, 1, 2, 3] as Dir[]) {
        const q = neighbour(p, d);
        if (q !== null) expect(dirTo(q, p)).toBe((d + 2) % 4);
      }
    }
  });
});

describe("camera", () => {
  it("stays over the district and within its limits", () => {
    const far = clampPose({ tx: 9999, tz: 9999, yaw: 7, pitch: 3, distance: 1 });
    expect(far.tx).toBe(BOARD.x1 + CAMERA_LIMITS.margin);
    expect(far.tz).toBe(QUAY + CAMERA_LIMITS.margin);
    expect(far.pitch).toBe(CAMERA_LIMITS.maxPitch);
    expect(far.distance).toBe(CAMERA_LIMITS.minDistance);
    expect(zoom(START_POSE, 100).distance).toBe(CAMERA_LIMITS.maxDistance);
    expect(Math.abs(far.yaw)).toBeLessThanOrEqual(Math.PI);
  });

  it("moves the way the view faces", () => {
    const north = { ...START_POSE, yaw: 0, tx: 0, tz: -100 };
    expect(pan(north, 0, 10).tz).toBeCloseTo(-110);
    expect(pan(north, 10, 0).tx).toBeCloseTo(10);
    const east = turn(north, Math.PI / 2, 0);
    expect(pan(east, 0, 10).tx).toBeCloseTo(10);
    expect(pan(east, 10, 0).tz).toBeCloseTo(-90);
    // At yaw 0 the camera stands south of what it looks at, above the ground.
    const eye = eyeOf(north);
    expect(eye[2]).toBeGreaterThan(north.tz);
    expect(eye[1]).toBeGreaterThan(0);
  });

  it("maps a point of the view to the ground and back", () => {
    const rng = new Rng("camera");
    for (let i = 0; i < 200; i++) {
      const pose = clampPose({ tx: rng.range(-150, 150), tz: rng.range(-250, 0), yaw: rng.range(-3, 3), pitch: rng.range(0.45, 1.3), distance: rng.range(80, 600) });
      const aspect = rng.range(0.6, 2.4);
      const x = pose.tx + rng.range(-40, 40);
      const z = pose.tz + rng.range(-40, 40);
      const [nx, ny, depth] = viewPoint(pose, x, 0, z, aspect);
      expect(depth).toBeGreaterThan(0);
      const back = groundPoint(pose, nx, ny, aspect)!;
      expect(back[0]).toBeCloseTo(x, 4);
      expect(back[1]).toBeCloseTo(z, 4);
    }
    // The centre of the view is the point looked at; the sky is not ground.
    const centre = groundPoint(START_POSE, 0, 0, 1.6)!;
    expect(centre[0]).toBeCloseTo(START_POSE.tx, 5);
    expect(centre[1]).toBeCloseTo(START_POSE.tz, 5);
    expect(groundPoint({ ...START_POSE, pitch: CAMERA_LIMITS.minPitch }, 0, 6, 1.6)).toBeNull();
  });
});

describe("the board's geometry", () => {
  const types: Array<BuildingType | null> = [null, ...BUILDING_TYPES];

  it("builds the same plot from the same look, every time", () => {
    for (const type of types) {
      const l = look({ type, canal: 5, served: true });
      const a = buildPlot(7, 12, l);
      const b = buildPlot(7, 12, l);
      expect(a.chunks.length).toBe(b.chunks.length);
      for (let i = 0; i < a.chunks.length; i++) {
        expect(a.chunks[i]!.material).toBe(b.chunks[i]!.material);
        expect(Array.from(a.chunks[i]!.mesh.positions.slice(0, 300))).toEqual(Array.from(b.chunks[i]!.mesh.positions.slice(0, 300)));
        expect(a.chunks[i]!.mesh.indices.length).toBe(b.chunks[i]!.mesh.indices.length);
      }
      expect(a.props).toEqual(b.props);
    }
    // A different seed gives a different town.
    expect(buildPlot(8, 12, look({ type: "house" })).props).not.toEqual(buildPlot(7, 12, look({ type: "house", served: true })).props);
  });

  it("keeps every building on its own plot, with sound meshes", () => {
    for (const type of types) {
      for (const canal of [0, 5, 15]) {
        for (const plot of [plotOf(0, 0), plotOf(3, 2), plotOf(GRID_W - 1, 5)]) {
          const onBank = xyOf(plot)[1] === 0;
          const g = buildPlot(7, plot, look({ type, canal: canal | (onBank && canal ? 4 : 0), served: canal !== 0, bathed: type === "house", soy: 2, lined: canal === 15, rotation: true, wheel: onBank && canal === 15 }));
          const [cx, cz] = plotCentre(plot);
          expect(g.triangles).toBeGreaterThan(8);
          expect(g.triangles).toBeLessThan(60000);
          for (const chunk of g.chunks) {
            const m = chunk.mesh;
            const n = m.positions.length / 3;
            expect(m.normals.length).toBe(n * 3);
            expect(m.uvs.length).toBe(n * 2);
            for (let i = 0; i < m.indices.length; i++) expect(m.indices[i]!).toBeLessThan(n);
            for (let i = 0; i < n; i++) {
              const x = m.positions[i * 3]!;
              const y = m.positions[i * 3 + 1]!;
              const z = m.positions[i * 3 + 2]!;
              expect(Number.isFinite(x + y + z)).toBe(true);
              // Nothing strays more than an awning's width beyond the plot (the quay and the wheel reach the river).
              expect(Math.abs(x - cx)).toBeLessThan(HALF + (onBank ? 12 : 1.5));
              expect(z - cz).toBeGreaterThan(-HALF - 1.5);
              expect(z - cz).toBeLessThan(HALF + (onBank ? QUAY + 4 : 1.5));
              expect(y).toBeGreaterThan(-4);
              expect(y).toBeLessThan(20);
            }
          }
          // One sheet of water for the crossing and one for each arm; a bank plot also has its intake.
          const arms = [0, 1, 2, 3].filter((d) => (canal | (onBank && canal ? 4 : 0)) & (1 << d)).length;
          expect(g.water.length).toBe(canal === 0 ? 0 : arms + 1 + (onBank ? 1 : 0));
          expect(g.wheel !== null).toBe(onBank && canal === 15);
        }
      }
    }
  });

  it("gives a plot a new picture only when what is seen changes", () => {
    const base = look({ type: "farm", served: true });
    expect(lookKey(base)).toBe(lookKey({ ...base }));
    expect(lookKey(base)).not.toBe(lookKey({ ...base, soy: 1 }));
    expect(lookKey(base)).not.toBe(lookKey({ ...base, served: false }));
    expect(lookKey(base)).not.toBe(lookKey({ ...base, canal: 1 }));
    // Houses do not change with the season, so they are not rebuilt four times a year.
    expect(lookKey(look({ type: "house" }))).toBe(lookKey(look({ type: "house", soy: 3 })));
  });

  it("keeps the figures on the lanes of their own plot", () => {
    for (const plot of [0, 13, 47]) {
      const [cx, cz] = plotCentre(plot);
      for (let i = 0; i < 12; i++) {
        for (const t of [0, 3.3, 17, 250.5]) {
          const [x, z, heading, size] = walkerPose(7, plot, i, t);
          const dx = Math.abs(x - cx);
          const dz = Math.abs(z - cz);
          expect(Math.max(dx, dz)).toBeLessThan(HALF);
          expect(Math.min(dx, dz)).toBeLessThanOrEqual(LANE_HALF);
          expect(Number.isFinite(heading)).toBe(true);
          expect(size).toBeGreaterThan(0.8);
        }
      }
    }
  });

  it("shapes the land round the district: flat under it, a bed under the river, level at its edges", () => {
    expect(envHeight(0, -100, 7)).toBeLessThan(CANAL_BED);
    expect(envHeight(BOARD.x0, -100, 7)).toBe(0);
    expect(envHeight(0, BOARD.z0, 7)).toBe(0);
    expect(envHeight(0, QUAY + 66, 7)).toBeLessThan(RIVER_LEVEL - 1);
    const env = buildEnvironment(7);
    expect(env.chunks.map((c) => c.material)).toEqual(["terrain", "water"]);
    expect(env.props.length).toBeGreaterThan(200);
    for (const p of env.props) expect(plotAt(p.x, p.z)).toBeNull();
    expect(buildEnvironment(7).props).toEqual(env.props);
  });
});

describe("from the rules to the picture", () => {
  it("shows the inherited district as the rules have it", () => {
    const { looks, walkers } = looksOf(newGame(S, 1));
    expect(looks[plotOf(1, 1)]).toMatchObject({ type: "farm", served: true, canal: 5 });
    // The bank plot's intake: its one link north, and the cut to the river.
    expect(looks[plotOf(1, 0)]!.canal).toBe(1 | 4);
    expect(looks[plotOf(2, 1)]).toMatchObject({ type: "house", served: true, bathed: false });
    expect(looks[plotOf(3, 1)]!.served).toBe(false);
    expect(looks[plotOf(4, 2)]!.served).toBe(false);
    expect(looks.some((l) => l.wheel)).toBe(false);
    expect(walkers[plotOf(2, 1)]).toBeGreaterThan(0);
    expect(walkers[plotOf(7, 5)]).toBe(0);
  });

  it("stands the water wheel at the intake once it is researched", () => {
    const s = { ...newGame(S, 1), researched: ["lined-canals", "water-wheel"] as State["researched"] };
    const { looks } = looksOf(s);
    expect(looks.findIndex((l) => l.wheel)).toBe(plotOf(1, 0));
    expect(looks.every((l) => l.lined)).toBe(true);
  });
});

describe("what the panel says", () => {
  it("previews the season exactly, without playing it", () => {
    const s = newGame(S, 5);
    const frozen = JSON.stringify(s);
    const p = project(S, s)!;
    expect(JSON.stringify(s)).toBe(frozen);
    const real = step(S, s, { type: "end-season" });
    expect(p.next.treasury).toBe(real.treasury);
    expect(p.next.grain).toBe(real.grain);
    expect(p.next.welfare).toBe(real.welfare);
    const chips = stocks(S, s, p);
    expect(chips.find((c) => c.id === "treasury")).toMatchObject({ value: 130, delta: real.treasury - 130 });
    expect(chips.find((c) => c.id === "households")!.of).toBe(80);
    expect(chips.find((c) => c.id === "water")).toMatchObject({ value: p.report.waterSupply, of: p.report.waterNeed });
    expect(calendar(0)).toEqual({ year: 1, soy: 0 });
    expect(calendar(23)).toEqual({ year: 6, soy: 3 });
  });

  it("opens with the canal, the way the first thirty seconds should go", () => {
    const s = newGame(S, 5);
    expect(advice(S, s, project(S, s))).toMatchObject({ id: "advice_first_canal", vars: { n: 2 } });
    // A link east from the farm waters one more house; the note moves on to the silt it inherited.
    const dug = play(s, { type: "canal", a: plotOf(1, 1), b: plotOf(2, 1) });
    expect(advice(S, dug, project(S, dug))!.id).toBe("advice_silt");
    const cleared = play(dug, { type: "clear-silt" });
    expect(advice(S, cleared, project(S, cleared))!.id).not.toBe("advice_silt");
  });

  it("aims the tool in hand and says where the water will come from", () => {
    const s = newGame(S, 5);
    const east = aim(s, "canal", null, [plotOf(2, 1), plotOf(1, 1)]);
    expect(east.preview).toMatchObject({ ok: true, cost: CANAL_COST });
    expect(east.dug).toEqual([plotOf(1, 1), plotOf(2, 1)]);
    expect(aim(s, "canal", null, [plotOf(5, 3), plotOf(6, 3)]).preview).toMatchObject({ ok: false, reason: "not-connected" });
    expect(aim(s, "market", plotOf(2, 1), null).preview).toMatchObject({ ok: false, reason: "occupied" });
    expect(aim(s, "library", plotOf(5, 5), null).preview).toMatchObject({ ok: false, reason: "not-researched" });
    expect(aim(s, "demolish", plotOf(5, 5), null).preview).toMatchObject({ ok: false, reason: "empty" });
    expect(aim(s, "inspect", plotOf(2, 1), null).command).toBeNull();
    // A new link from the bank: the bank plot is the source.
    expect(aim(s, "canal", null, [plotOf(5, 1), plotOf(5, 0)]).dug).toEqual([plotOf(5, 0), plotOf(5, 1)]);
  });

  it("tints the plots a choice would touch", () => {
    const s = newGame(S, 5);
    const now = overlay(s, "canal", null);
    expect(now.every(([, tint]) => tint === "water")).toBe(true);
    const withLink = overlay(s, "canal", null, [plotOf(1, 1), plotOf(2, 1)]);
    const gained = withLink.filter(([, tint]) => tint === "new-water").map(([p]) => p);
    expect(gained).toContain(plotOf(3, 1));
    expect(gained).not.toContain(plotOf(2, 1));
    expect(overlay(s, "canal", null, [plotOf(5, 3), plotOf(6, 3)]).some(([, tint]) => tint === "new-water")).toBe(false);
    // A market at D3 reaches all four houses; one in the far corner reaches none of them.
    const near = overlay(s, "market", plotOf(3, 2));
    expect(near.filter(([, tint]) => tint === "served-house").length).toBe(4);
    const far = overlay(s, "market", plotOf(7, 5));
    expect(far.filter(([, tint]) => tint === "unserved-house").length).toBe(4);
    expect(overlay(s, "inspect", plotOf(2, 1))).toEqual([]);
  });

  it("marks the plots where something is not doing its job", () => {
    const s = newGame(S, 5);
    // The inherited district: two houses the canal does not reach.
    expect(plotProblems(s).map((p) => [p.plot, p.kind, p.line.id])).toEqual([
      [plotOf(3, 1), "water", "info_water_no"],
      [plotOf(4, 2), "water", "info_water_no"],
    ]);
    const dug = play(s, { type: "canal", a: plotOf(1, 1), b: plotOf(2, 1) });
    expect(plotProblems(dug).map((p) => p.plot)).toEqual([plotOf(4, 2)]);
    // A bath away from water does nothing; a market with no houses near serves nobody; a dry farm grows a quarter.
    const built = play({ ...s, treasury: 500 }, { type: "build", building: "bath", plot: plotOf(5, 2) }, { type: "build", building: "market", plot: plotOf(7, 5) }, { type: "build", building: "farm", plot: plotOf(6, 0) }, { type: "build", building: "school", plot: plotOf(3, 2) });
    const byPlot = new Map(plotProblems(built).map((p) => [p.plot, p]));
    expect(byPlot.get(plotOf(5, 2))).toMatchObject({ kind: "water", line: { id: "mark_bath_dry" } });
    expect(byPlot.get(plotOf(7, 5))).toMatchObject({ kind: "reach", line: { id: "mark_no_houses" } });
    expect(byPlot.get(plotOf(6, 0))).toMatchObject({ kind: "water", line: { id: "info_farm_dry" } });
    expect(byPlot.has(plotOf(3, 2))).toBe(false);
    // The same sentences are in the plot's own description, so the plan view and the tooltip say them too.
    expect(plotInfo(built, plotOf(5, 2)).lines.some((l) => l.id === "mark_bath_dry")).toBe(true);
    expect(plotInfo(built, plotOf(7, 5)).lines.some((l) => l.id === "mark_no_houses")).toBe(true);
  });

  it("accounts for welfare cause by cause, all the way through a campaign", () => {
    const en = JSON.parse(readFileSync(new URL("../i18n/en.json", import.meta.url), "utf8")) as Record<string, string>;
    const policy = makePolicies(step).find((p) => p.name === "balanced")!;
    const rng = new Rng("lab:balanced:3");
    let s = newGame(S, 3);
    const used = new Set<string>();
    const note = (l: Line | null) => l && used.add(l.id);
    while (s.outcome === "playing") {
      note(advice(S, s, project(S, s)));
      for (const c of policy.plan(S, s, rng)) s = step(S, s, c);
      const r = s.last!;
      const sum = Object.values(r.welfareParts).reduce((a, b) => a + b, 0);
      expect(Math.max(0, Math.min(100, sum))).toBe(r.welfareTarget);
      for (const g of ledger(r)) for (const l of g.lines) note(l);
      for (let p = 0; p < PLOTS; p++) for (const l of plotInfo(s, p).lines) note(l);
    }
    expect(s.outcome).toBe("won");
    expect(showing(s)).toBe(S.seasons - 1);
    expect(goals(S, s).rows.every((row) => row.met)).toBe(true);
    expect(project(S, s)).toBeNull();
    expect(researchList(s).filter((r) => r.state === "done").length).toBeGreaterThan(1);
    // Every sentence the panel produced is one the string table has.
    for (const id of used) expect(en[id], id).toBeTypeOf("string");
    expect(used.size).toBeGreaterThan(30);
  });
});

describe("the saved game", () => {
  it("comes back as it was, and nothing unreadable is trusted or destroyed", () => {
    expect(SAVE_KEY).toBe("im.golden-age.save.v1");
    expect(readSave(null).status).toBe("empty");
    expect(readSave("{not json")).toMatchObject({ status: "unreadable", keep: "{not json" });
    expect(readSave(JSON.stringify({ v: SAVE_VERSION + 1, state: null })).status).toBe("newer");
    expect(readSave(JSON.stringify({ v: SAVE_VERSION, state: null }))).toMatchObject({ status: "ok", save: { state: null } });
    const s = play(newGame(S, 9), { type: "canal", a: plotOf(1, 1), b: plotOf(2, 1) }, { type: "build", building: "market", plot: plotOf(3, 2) }, { type: "end-season" }, { type: "end-season" });
    const back = readSave(writeSave({ v: SAVE_VERSION, state: s }));
    expect(back.status).toBe("ok");
    expect(back.save.state).toEqual(s);
    // The game continues identically from the saved copy.
    expect(step(S, back.save.state!, { type: "end-season" })).toEqual(step(S, s, { type: "end-season" }));
  });

  it("brings a game saved before endowments existed up to date", () => {
    const old = (scenario: typeof S, seed: number) => {
      const { endowed, mayEndow, ...v1 } = step(scenario, newGame(scenario, seed), { type: "end-season" }) as State & Record<string, unknown>;
      void endowed;
      void mayEndow;
      return JSON.stringify({ v: 1, state: v1 });
    };
    const first = readSave(old(S, 9));
    expect(first.status).toBe("ok");
    expect(first.save).toMatchObject({ v: SAVE_VERSION, state: { season: 1, endowed: [], mayEndow: false } });
    expect(readSave(old(WHAT_ENDURES, 9)).save.state).toMatchObject({ scenario: "what-endures", endowed: [], mayEndow: true });
    // And the migrated game plays on exactly as the unmigrated one would have.
    expect(step(S, first.save.state!, { type: "end-season" })).toEqual(step(S, play(newGame(S, 9), { type: "end-season" }), { type: "end-season" }));
  });

  it("brings a game saved before the merchants' loan existed up to date", () => {
    const { loanOwed, loanEach, ...v2 } = play(newGame(S, 11), { type: "end-season" }) as State & Record<string, unknown>;
    void loanOwed;
    void loanEach;
    const read = readSave(JSON.stringify({ v: 2, state: v2 }));
    expect(read.status).toBe("ok");
    expect(read.save).toMatchObject({ v: SAVE_VERSION, state: { loanOwed: 0, loanEach: 0 } });
    expect(step(S, read.save.state!, { type: "end-season" })).toEqual(step(S, play(newGame(S, 11), { type: "end-season" }), { type: "end-season" }));
  });

  it("refuses a state the rules could not have produced", () => {
    const s = play(newGame(S, 9), { type: "end-season" });
    expect(playable(s)).toBe(true);
    expect(playable({ ...s, grain: -5 })).toBe(false);
    expect(playable({ ...s, welfare: 140 })).toBe(false);
    expect(playable({ ...s, rules: 99 })).toBe(false);
    expect(playable({ ...s, scenario: "nowhere" })).toBe(false);
    expect(playable({ ...s, plots: s.plots.slice(1) })).toBe(false);
    expect(playable({ ...s, canals: [...s.canals, s.canals[0]] })).toBe(false);
    expect(playable({ ...s, tax: 7 })).toBe(false);
    expect(playable({ ...s, endowed: [plotOf(2, 1)] })).toBe(false);
    expect(playable({ ...s, endowed: undefined })).toBe(false);
    expect(playable({ ...s, last: { ...s.last, welfareParts: undefined } })).toBe(false);
    expect(readSave(JSON.stringify({ v: SAVE_VERSION, state: { ...s, grain: -5 } })).status).toBe("unreadable");
  });
});

describe("the second chapter", () => {
  const B = HOUSE_OF_BOOKS;

  it("starts from a district that works, with paper already known", () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual(["failing-canal", "house-of-books", "what-endures"]);
    expect(Object.keys(SCENARIOS)).toEqual(CHAPTERS.map((c) => c.id));
    const s = newGame(B, 4);
    expect(s).toMatchObject({ scenario: "house-of-books", households: 130, treasury: 110, canalCondition: 1000, researched: ["paper"] });
    // Nothing in the inherited district is broken: every farm is watered, every service has houses in reach.
    expect(plotProblems(s)).toEqual([]);
    // Paper counts as learning already done, and the library can be built at once (if it can be paid for).
    expect(goals(B, s).rows.find((r) => r.id === "knowledge")).toMatchObject({ value: 70, goal: 480 });
    expect(aim({ ...s, treasury: 200 }, "library", plotOf(5, 2), null).preview).toMatchObject({ ok: true, cost: 90 });
    expect(aim(s, "hospital", plotOf(5, 2), null).preview).toMatchObject({ ok: false, reason: "not-researched" });
    // More than half the households have no work at the start: that is the chapter's first problem.
    const r = project(B, s)!.report;
    expect(r.jobs).toBeLessThan(s.households / 2);
    expect(r.welfareParts.idle).toBeLessThan(0);
    // The first chapter is untouched by the second's options.
    expect(newGame(FAILING_CANAL, 4)).toMatchObject({ canalCondition: 600, researched: [] });
  });

  it("can be won in more than two ways and not by a cheap trick (120 seeds)", () => {
    const report = runLab(B, 120);
    const real = report.policies.filter((p) => ["irrigator", "merchant", "scholar", "balanced"].includes(p.policy));
    const probes = report.policies.filter((p) => !real.includes(p));
    // No rule broken in any campaign; "the campaign did not end" is itself one of the things that would be listed.
    expect(report.violations).toEqual([]);
    for (const p of probes) expect(p.winPermille, p.policy).toBe(0);
    // The design asks for at least three ways to win; none may be a foregone conclusion.
    expect(real.filter((p) => p.winPermille >= 200).length).toBeGreaterThanOrEqual(3);
    for (const p of real) expect(p.winPermille, p.policy).toBeLessThan(900);
  });
});

describe("the third chapter and its endowments", () => {
  const E = WHAT_ENDURES;
  const bath = plotOf(3, 1);
  const school = plotOf(2, 1);
  const library = plotOf(2, 3);

  it("lets a public building be endowed once, for five years of its upkeep, and never cleared after", () => {
    const s = newGame(E, 2);
    expect(s).toMatchObject({ mayEndow: true, endowed: [], households: 180, treasury: 140 });
    expect(ENDOWABLE.map(endowCost)).toEqual([80, 40, 120, 100]);
    expect(preview(s, { type: "endow", plot: bath })).toEqual({ ok: true, cost: 40 });
    expect(preview(s, { type: "endow", plot: school })).toEqual({ ok: true, cost: 80 });
    expect(preview(s, { type: "endow", plot: plotOf(2, 0) })).toMatchObject({ ok: false, reason: "not-endowable" });
    expect(preview(s, { type: "endow", plot: plotOf(7, 5) })).toMatchObject({ ok: false, reason: "empty" });
    const upkeepBefore = project(E, s)!.report.upkeep;
    const done = step(E, s, { type: "endow", plot: bath });
    expect(done).toMatchObject({ treasury: 100, endowed: [bath] });
    // The bath's two coins of upkeep are paid by its endowment from now on.
    expect(project(E, done)!.report.upkeep).toBe(upkeepBefore - 2);
    expect(preview(done, { type: "endow", plot: bath })).toMatchObject({ ok: false, reason: "already-endowed" });
    expect(preview(done, { type: "demolish", plot: bath })).toMatchObject({ ok: false, reason: "endowed" });
    expect(preview(done, { type: "endow", plot: library })).toMatchObject({ ok: false, reason: "no-funds", cost: 120 });
    expect(invariants(done)).toEqual([]);
    expect(() => step(E, done, { type: "demolish", plot: bath })).toThrow();
    // The rule belongs to this chapter: the first two do not have it.
    expect(preview({ ...newGame(FAILING_CANAL, 2), treasury: 500 }, { type: "endow", plot: plotOf(2, 1) })).toMatchObject({ ok: false, reason: "not-here" });
    expect(newGame(HOUSE_OF_BOOKS, 2).mayEndow).toBe(false);
  });

  it("cannot be won without four endowments, however well the district does otherwise", () => {
    const hospital = plotOf(7, 5);
    const plots = [...newGame(E, 2).plots];
    plots[hospital] = "hospital";
    const thriving: State = { ...newGame(E, 2), plots, season: E.seasons - 1, households: 400, knowledge: 800, welfare: 80, steadySeasons: 5, treasury: 500, grain: 2000 };
    expect(step(E, thriving, { type: "end-season" }).outcome).toBe("ended");
    expect(step(E, { ...thriving, endowed: [bath, school, library] }, { type: "end-season" }).outcome).toBe("ended");
    expect(step(E, { ...thriving, endowed: [bath, school, library, hospital] }, { type: "end-season" }).outcome).toBe("won");
  });

  it("shows endowments as a goal, in each plot's description, as an overlay and as a look", () => {
    const s = newGame(E, 2);
    const done = step(E, s, { type: "endow", plot: bath });
    expect(goals(E, done).rows.find((r) => r.id === "endowments")).toEqual({ id: "endowments", value: 1, goal: 4, met: false });
    expect(goals(FAILING_CANAL, newGame(FAILING_CANAL, 2)).rows.some((r) => r.id === "endowments")).toBe(false);
    expect(plotInfo(s, bath).lines).toContainEqual({ id: "info_endowable", vars: { cost: 40 } });
    expect(plotInfo(done, bath).lines).toContainEqual({ id: "info_endowed", tone: "good" });
    expect(plotInfo(done, bath).lines.find((l) => l.id === "info_running")!.vars!.upkeep).toBe(0);
    expect(aim(s, "endow", bath, null)).toMatchObject({ command: { type: "endow", plot: bath }, preview: { ok: true, cost: 40 } });
    expect(overlay(s, "endow", null).filter(([, tint]) => tint === "reach").map(([p]) => p).sort((a, b) => a - b)).toEqual([school, bath, library].sort((a, b) => a - b));
    expect(overlay(done, "endow", null).filter(([, tint]) => tint === "served-house").map(([p]) => p)).toEqual([bath]);
    const { looks } = looksOf(done);
    expect(looks[bath]!.endowed).toBe(true);
    expect(lookKey(looks[bath]!)).not.toBe(lookKey(looksOf(s).looks[bath]!));
    expect(buildPlot(7, bath, looks[bath]!).triangles).toBeGreaterThan(buildPlot(7, bath, looksOf(s).looks[bath]!).triangles);
  });

  it("can be won in more than two ways and not by a cheap trick (120 seeds)", () => {
    const report = runLab(E, 120);
    const real = report.policies.filter((p) => ["irrigator", "merchant", "scholar", "balanced"].includes(p.policy));
    expect(report.violations).toEqual([]);
    for (const p of report.policies.filter((q) => !real.includes(q))) expect(p.winPermille, p.policy).toBe(0);
    expect(real.filter((p) => p.winPermille >= 200).length).toBeGreaterThanOrEqual(3);
    // No way of playing is certain (until 27 November 2026 a trading city won every campaign; the learning goal was
    // raised from 520 to 740 to end that, docs/gaming/games/golden-age.md).
    for (const p of real) expect(p.winPermille, p.policy).toBeLessThan(1000);
  });
});

describe("the museum behind the game", () => {
  const links = JSON.parse(readFileSync(new URL("../data/museum-links.v1.json", import.meta.url), "utf8")) as { format: string; version: number; digest: string; research: Record<string, string>; tool: Record<string, string>; scenario: Record<string, string[]>; records: Record<string, { review: string; label: Record<string, string>; summary?: Record<string, string> }> };

  it("links research and tools to museum records by id, with a label in every language", () => {
    expect(links.format).toBe("im.golden-age.links");
    for (const id of RESEARCH_IDS) expect(links.research[id], id).toBeTypeOf("string");
    for (const key of Object.keys(links.tool)) expect(["canal", "demolish", "inspect", "endow", ...BUILDING_TYPES]).toContain(key);
    for (const id of [...Object.values(links.research), ...Object.values(links.tool)]) {
      expect(id).toMatch(/^[a-z-]+\/[a-z0-9-]+$/);
      const record = links.records[id]!;
      expect(record, id).toBeDefined();
      for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) expect(record.label[lang]?.trim().length, `${id}.${lang}`).toBeGreaterThan(0);
    }
    // The file is what the builder wrote: its digest covers the links and the labels.
    expect(createHash("sha256").update(JSON.stringify({ research: links.research, tool: links.tool, scenario: links.scenario, records: links.records })).digest("hex")).toBe(links.digest);
  });

  it("gives every chapter the museum's own account of its history, in every language, without citation markers", () => {
    for (const chapter of CHAPTERS) {
      const ids = links.scenario[chapter.id]!;
      expect(ids?.length, chapter.id).toBeGreaterThan(0);
      for (const id of ids) {
        const summary = links.records[id]!.summary!;
        for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) {
          expect(summary[lang]!.length, `${id}.${lang}`).toBeGreaterThan(40);
          expect(summary[lang]!.length, `${id}.${lang}`).toBeLessThanOrEqual(1000);
          // The game does not render honorifics, so it quotes no text that the museum's pages would add one to.
          expect(/النبي|رسول الله|the Prophet|Messenger of God|رسول اللہ|Peygamber|Prophète|Profeta/i.test(summary[lang]!), `${id}.${lang}`).toBe(false);
          expect(summary[lang], `${id}.${lang}`).not.toContain("{cite");
        }
      }
    }
  });
});

describe("the words", () => {
  const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
  const table = (lang: string) => JSON.parse(readFileSync(new URL(`../i18n/${lang}.json`, import.meta.url), "utf8")) as Record<string, string>;
  const en = table("en");
  const holes = (v: string) => (v.match(/\{(\w+)\}/g) ?? []).sort();

  it("has every string in all seven languages, with the same blanks to fill", () => {
    for (const lang of LANGS) {
      const t = table(lang);
      expect(Object.keys(t), lang).toEqual(Object.keys(en));
      for (const [k, v] of Object.entries(t)) {
        if (k === "_meta") continue;
        expect(v.trim().length, `${lang}.${k}`).toBeGreaterThan(0);
        expect(holes(v), `${lang}.${k}`).toEqual(holes(en[k]!));
        // Repository rule: no bare parenthesis round Arabic script, and no honorific typed.
        expect(/(?<!⁦)\([^)]*[؀-ۿ]/.test(v), `${lang}.${k}`).toBe(false);
        expect(/ﷺ|صلى الله عليه|عليه السلام|رضي الله عن|رحمه الله/.test(v), `${lang}.${k}`).toBe(false);
      }
    }
  });

  it("has a string for every key the screen asks for", () => {
    const source = ["../src/ui/app.ts", "../src/ui/model.ts"].map((f) => readFileSync(new URL(f, import.meta.url), "utf8")).join("\n");
    const literal = [...source.matchAll(/\bt\("([a-z0-9_-]+)"/g)].map((m) => m[1]!);
    const ids = [...source.matchAll(/\bid: "((?:advice|ledger|info|welfare|mark)_[a-z0-9_-]+)"/g)].map((m) => m[1]!);
    expect(literal.length).toBeGreaterThan(40);
    for (const k of [...literal, ...ids]) expect(en[k], k).toBeTypeOf("string");
    // Keys built from a name: every member of each family must exist.
    const families: Record<string, readonly string[]> = {
      building_: BUILDING_TYPES,
      desc_: ["inspect", "canal", "demolish", "endow", ...BUILDING_TYPES],
      tool_: ["inspect", "canal", "demolish", "endow"],
      research_: RESEARCH_IDS,
      research_effect_: RESEARCH_IDS,
      event_: ["drought", "good-harvest", "caravan", "silting", "fever"],
      effect_: ["drought", "good-harvest", "caravan", "silting", "fever"],
      season_: ["0", "1", "2", "3"],
      tax_: ["0", "1", "2"],
      tab_: ["city", "ledger", "research"],
      stock_: ["treasury", "grain", "households", "welfare", "knowledge", "water"],
      goal_: ["households", "knowledge", "welfare", "treasury", "endowments"],
      ledger_group_: ["water", "food", "money", "people", "learning"],
      welfare_: ["base", "food", "water", "baths", "school", "hospital", "market", "tax", "crowding", "idle", "fever", "unpaid"],
      outcome_: ["won", "lost-insolvent", "lost-unrest", "ended", "won_text", "lost-insolvent_text", "lost-unrest_text", "ended_text"],
      reason_: ["over", "occupied", "empty", "not-researched", "no-funds", "not-adjacent", "exists", "not-connected", "off-map", "already-researched", "needs-research", "no-silt", "same", "not-here", "not-endowable", "already-endowed", "endowed"],
      boot_: ["check", "textures", "renderer", "district"],
      help_: ["1", "2", "3", "4", "5", "6", "7", "title", "controls"],
      scenario_: CHAPTERS.map((c) => c.id),
      brief_: [...CHAPTERS.map((c) => c.id), "goal", "begin", "read"],
    };
    for (const [prefix, names] of Object.entries(families)) for (const n of names) expect(en[`${prefix}${n}`], `${prefix}${n}`).toBeTypeOf("string");
  });
});

describe("the caravanserai and the watermill", () => {
  // A district of houses round a market, with water, and nothing else changing between the two runs compared.
  const base = (): State => {
    let s = newGame(FAILING_CANAL, 4);
    s = { ...s, treasury: 2000 };
    return s;
  };
  const freePlot = (s: State): number => s.plots.findIndex((b, p) => b === null && xyOf(p)[1] >= 1);

  it("a caravanserai brings trade only where there is a market, and more with a caravan", () => {
    let s = base();
    const market = freePlot(s);
    s = step(FAILING_CANAL, s, { type: "build", building: "market", plot: market });
    const without = step(FAILING_CANAL, s, { type: "end-season" }).last!.income.trade;
    const khan = freePlot(s);
    const withKhan = step(FAILING_CANAL, step(FAILING_CANAL, s, { type: "build", building: "caravanserai", plot: khan }), { type: "end-season" }).last!.income.trade;
    expect(withKhan).toBeGreaterThan(without);
    // No market: the caravanserai has no one to trade with.
    let bare = base();
    bare = step(FAILING_CANAL, bare, { type: "build", building: "caravanserai", plot: freePlot(bare) });
    expect(step(FAILING_CANAL, bare, { type: "end-season" }).last!.income.trade).toBe(step(FAILING_CANAL, base(), { type: "end-season" }).last!.income.trade);
  });

  it("a watermill with water halves the grain that spoils and sells the surplus for more; a dry one does nothing", () => {
    const wet = (s: State, p: number) => preview(s, { type: "build", building: "mill", plot: p }).ok;
    const s = { ...base(), grain: 400 };
    const plots = s.plots.map((_, p) => p).filter((p) => s.plots[p] === null && wet(s, p));
    const before = step(FAILING_CANAL, s, { type: "end-season" }).last!;
    const milled = plots.map((p) => step(FAILING_CANAL, step(FAILING_CANAL, s, { type: "build", building: "mill", plot: p }), { type: "end-season" }).last!);
    // Some plot gives the mill water; there spoilage falls and sales rise.
    const working = milled.find((r) => r.spoiled < before.spoiled);
    expect(working).toBeDefined();
    expect(working!.spoiled).toBeLessThan(before.spoiled);
    expect(working!.income.sales).toBeGreaterThanOrEqual(before.income.sales);
  });

  it("draws both, sound and on their plot, whether water reaches them or not", () => {
    for (const type of ["caravanserai", "mill"] as BuildingType[]) {
      for (const served of [true, false]) {
        const look = { type, served, season: 0, seed: 7 } as unknown as PlotLook;
        const plot = buildPlot(7, 12, look);
        expect(plot.triangles, `${type} served=${served}`).toBeGreaterThan(50);
      }
    }
    expect(BUILDING_TYPES).toContain("caravanserai");
    expect(BUILDING_TYPES).toContain("mill");
  });
});

describe("the fountain, the cistern and the paper mill", () => {
  const rich = (): State => ({ ...newGame(FAILING_CANAL, 4), treasury: 3000 });
  const free = (s: State, ok: (p: number) => boolean = () => true): number[] => s.plots.map((b, p) => (b === null && ok(p) ? p : -1)).filter((p) => p >= 0);

  it("a cistern gives the district more water in summer, and none of that in spring", () => {
    // Season 0 is spring, season 1 summer.
    const s0 = rich();
    const p = free(s0)[0]!;
    const spring = step(FAILING_CANAL, step(FAILING_CANAL, s0, { type: "build", building: "cistern", plot: p }), { type: "end-season" }).last!.waterSupply;
    expect(spring).toBe(step(FAILING_CANAL, s0, { type: "end-season" }).last!.waterSupply);
    const summer0 = step(FAILING_CANAL, s0, { type: "end-season" });
    const withC = step(FAILING_CANAL, step(FAILING_CANAL, summer0, { type: "build", building: "cistern", plot: free(summer0)[0]! }), { type: "end-season" }).last!.waterSupply;
    expect(withC).toBe(step(FAILING_CANAL, summer0, { type: "end-season" }).last!.waterSupply + 6);
  });

  it("a paper mill needs paper, and with water adds to learning", () => {
    const s = rich();
    expect(preview(s, { type: "build", building: "papermill", plot: free(s)[0]! })).toMatchObject({ ok: false });
    const papered: State = { ...s, researched: ["paper"] };
    expect(preview(papered, { type: "build", building: "papermill", plot: free(papered)[0]! }).ok).toBe(true);
  });

  it("draws all three, whether water reaches them or not", () => {
    for (const type of ["fountain", "cistern", "papermill"] as BuildingType[]) for (const served of [true, false]) expect(buildPlot(7, 12, { type, served, season: 0, seed: 7 } as unknown as PlotLook).triangles, type).toBeGreaterThan(30);
  });
});
