// The lit sphere under the Atlas globe must be the same picture as the globe drawn over it: a pin is drawn by one
// and the coast under it by the other. These tests hold the sphere's arithmetic to Three.js's own sphere on one side
// and to the 2D globe's projection on the other.
import { describe, expect, it } from "vitest";
import { geoOrthographic } from "d3-geo";
import { SphereGeometry } from "three";
import { onScreen, spherePoint, turned, viewTurn, type SphereView } from "../src/ui/sphere";

describe("the sphere under the globe", () => {
  it("places every point where Three.js's own sphere has it, for a world map with Greenwich at its middle", () => {
    const g = new SphereGeometry(1, 48, 24);
    const pos = g.getAttribute("position");
    const uv = g.getAttribute("uv");
    let checked = 0;
    for (let i = 0; i < pos.count; i++) {
      const lon = (uv.getX(i) - 0.5) * 360;
      const lat = (uv.getY(i) - 0.5) * 180;
      const p = spherePoint(lat, lon);
      expect(p[0]).toBeCloseTo(pos.getX(i), 5);
      expect(p[1]).toBeCloseTo(pos.getY(i), 5);
      expect(p[2]).toBeCloseTo(pos.getZ(i), 5);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(1000);
  });

  it("turns the place looked at to face the viewer, with east to the right and north up", () => {
    for (const [lat, lon] of [[0, 0], [37.18, -3.6], [21.42, 39.83], [-33.9, 151.2], [64, -150], [10, 179]] as const) {
      const turn = viewTurn(lat, lon);
      const centre = turned(spherePoint(lat, lon), turn);
      expect(centre[0]).toBeCloseTo(0, 9);
      expect(centre[1]).toBeCloseTo(0, 9);
      expect(centre[2]).toBeCloseTo(1, 9);
      expect(turned(spherePoint(lat, lon + 5), turn)[0]).toBeGreaterThan(0.01);
      expect(turned(spherePoint(lat + 5, lon), turn)[1]).toBeGreaterThan(0.05);
    }
  });

  it("falls on the window exactly where the 2D globe's projection puts it", () => {
    const views: SphereView[] = [
      { lon: 36, lat: 30, radius: 400, cx: 908, cy: 450 },
      { lon: -3.6, lat: 37.2, radius: 1280, cx: 512, cy: 380 },
      { lon: 151, lat: -34, radius: 260, cx: 300, cy: 300 },
      { lon: 179, lat: 70, radius: 800, cx: 700, cy: 500 },
    ];
    let compared = 0;
    for (const view of views) {
      const projection = geoOrthographic().clipAngle(90).translate([view.cx, view.cy]).scale(view.radius).rotate([-view.lon, -view.lat]);
      for (let lat = -80; lat <= 80; lat += 20) {
        for (let lon = -180; lon < 180; lon += 20) {
          const mine = onScreen(lat, lon, view);
          const theirs = projection([lon, lat]);
          if (!theirs) continue;
          expect(mine.x).toBeCloseTo(theirs[0], 6);
          expect(mine.y).toBeCloseTo(theirs[1], 6);
          compared += 1;
        }
      }
    }
    expect(compared).toBeGreaterThan(500);
  });

  it("knows the far side of the globe from the near", () => {
    const view: SphereView = { lon: 36, lat: 30, radius: 400, cx: 0, cy: 0 };
    expect(onScreen(30, 36, view).front).toBe(true);
    expect(onScreen(25, 60, view).front).toBe(true);
    expect(onScreen(-30, -144, view).front).toBe(false);
    expect(onScreen(40, -120, view).front).toBe(false);
  });
});
