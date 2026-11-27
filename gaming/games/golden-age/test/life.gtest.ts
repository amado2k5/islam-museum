import { describe, expect, it } from "vitest";
import { buildPlot, cartOxMesh, grazingDonkeyMesh, grazingSpots, walkerBodyMesh, walkerLegMesh, type PlotLook } from "../src/view/board";
import { RIVER_WIDTH } from "../src/view/layout";

const look = (over: Partial<PlotLook>): PlotLook => ({ type: null, canal: 0, served: false, bathed: false, soy: 0, lined: false, rotation: false, wheel: false, ...over });

describe("the district's life", () => {
  it("a served workshop's kiln smokes; a dry one does not", () => {
    const served = buildPlot(3, 10, look({ type: "workshop", served: true }));
    const dry = buildPlot(3, 10, look({ type: "workshop", served: false }));
    expect(served.smoke.length).toBeGreaterThan(0);
    expect(dry.smoke.length).toBe(0);
  });

  it("a served bath's furnace smokes; a dry one does not", () => {
    const served = buildPlot(3, 10, look({ type: "bath", served: true }));
    const dry = buildPlot(3, 10, look({ type: "bath", served: false }));
    expect(served.smoke.length).toBeGreaterThan(0);
    expect(dry.smoke.length).toBe(0);
  });

  it("smoke sources sit above the rooftops, inside the plot's own measure", () => {
    const g = buildPlot(3, 10, look({ type: "workshop", served: true }));
    for (const sm of g.smoke) {
      expect(sm.y).toBeGreaterThan(3);
      expect(Math.abs(sm.x)).toBeLessThan(200);
      expect(sm.z).toBeLessThan(0);
    }
  });

  it("the grazing donkeys stand on the south bank, out of the river's channel", () => {
    for (const [, y, z] of grazingSpots(3)) {
      expect(z).toBeGreaterThan(11 + RIVER_WIDTH + 5);
      expect(y).toBeGreaterThan(-1);
    }
  });

  it("the cart and animal shapes are within their small budgets", () => {
    const tris = (m: { indices: Uint32Array }) => m.indices.length / 3;
    expect(tris(cartOxMesh())).toBeLessThan(200);
    expect(tris(grazingDonkeyMesh())).toBeLessThan(300);
    expect(tris(walkerLegMesh())).toBeLessThan(60);
    expect(tris(walkerBodyMesh())).toBeLessThan(400);
  });
});
