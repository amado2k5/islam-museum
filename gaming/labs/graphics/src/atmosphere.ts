// Time-of-day lighting shared by every renderer in the lab, so a comparison shows the same sun, sky and haze.
// Values are linear-light. They are art direction, not a physical sky model.
import { MeshBuilder, type MeshData, type Rgb, type Vec3 } from "@im/worldkit/mesh";

export type TimeOfDay = "golden" | "noon" | "dusk" | "night";

export interface Atmosphere {
  id: TimeOfDay;
  /** Unit vector pointing from the scene toward the sun (or the moon at night). */
  sunDirection: Vec3;
  sunColor: Rgb;
  sunIntensity: number;
  skyZenith: Rgb;
  skyHorizon: Rgb;
  /** Hemisphere light: colour from above and from below, and its strength. */
  ambientSky: Rgb;
  ambientGround: Rgb;
  ambientIntensity: number;
  fogColor: Rgb;
  /** Exponential-squared fog density per metre. */
  fogDensity: number;
  exposure: number;
  /** 0..1 strength of lamps and lit windows. */
  emissive: number;
}

const dir = (azimuthDeg: number, elevationDeg: number): Vec3 => {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  // Azimuth is measured from north (-Z) clockwise seen from above: 90 = east (+X), 180 = south (+Z).
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
};

export const ATMOSPHERES: Record<TimeOfDay, Atmosphere> = {
  golden: {
    id: "golden",
    sunDirection: dir(206, 21),
    sunColor: [1.0, 0.72, 0.42],
    sunIntensity: 6.2,
    skyZenith: [0.07, 0.2, 0.56],
    skyHorizon: [1.25, 0.86, 0.5],
    ambientSky: [0.42, 0.52, 0.8],
    ambientGround: [0.5, 0.36, 0.24],
    ambientIntensity: 0.6,
    fogColor: [1.0, 0.72, 0.46],
    fogDensity: 0.0005,
    exposure: 0.62,
    emissive: 0.15,
  },
  noon: {
    id: "noon",
    sunDirection: dir(170, 62),
    sunColor: [1.0, 0.96, 0.88],
    sunIntensity: 4.6,
    skyZenith: [0.14, 0.34, 0.74],
    skyHorizon: [0.62, 0.78, 0.95],
    ambientSky: [0.55, 0.7, 1.0],
    ambientGround: [0.6, 0.52, 0.4],
    ambientIntensity: 1.0,
    fogColor: [0.7, 0.8, 0.92],
    fogDensity: 0.0006,
    exposure: 0.8,
    emissive: 0,
  },
  dusk: {
    id: "dusk",
    sunDirection: dir(262, 4),
    sunColor: [1.0, 0.5, 0.28],
    sunIntensity: 2.2,
    skyZenith: [0.07, 0.11, 0.3],
    skyHorizon: [0.95, 0.46, 0.3],
    ambientSky: [0.3, 0.34, 0.6],
    ambientGround: [0.32, 0.24, 0.22],
    ambientIntensity: 0.7,
    fogColor: [0.6, 0.38, 0.36],
    fogDensity: 0.00055,
    exposure: 0.85,
    emissive: 0.8,
  },
  night: {
    id: "night",
    sunDirection: dir(120, 48),
    sunColor: [0.55, 0.66, 1.0],
    sunIntensity: 0.38,
    skyZenith: [0.006, 0.012, 0.04],
    skyHorizon: [0.03, 0.045, 0.1],
    ambientSky: [0.12, 0.16, 0.34],
    ambientGround: [0.05, 0.05, 0.07],
    ambientIntensity: 0.5,
    fogColor: [0.02, 0.03, 0.07],
    fogDensity: 0.0012,
    exposure: 1.15,
    emissive: 1,
  },
};

/**
 * An inward-facing sky dome with the gradient and the sun's glow baked into vertex colours (HDR, linear).
 * Renderers draw it unlit, behind everything, and it is the same mesh in each of them.
 */
export function skyDome(atm: Atmosphere, radius = 5200): MeshData {
  const b = new MeshBuilder();
  const segs = 64;
  const rings = 48;
  const sd = atm.sunDirection;
  for (let j = 0; j <= rings; j++) {
    // A full sphere: the lower half is haze, so a high camera never sees past the edge of the sky.
    const el = -Math.PI / 2 + Math.PI * (j / rings);
    for (let i = 0; i <= segs; i++) {
      const az = (i / segs) * Math.PI * 2;
      const d: Vec3 = [Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)];
      const up = Math.max(0, d[1]);
      const k = Math.pow(1 - up, 4.5);
      const cosSun = Math.max(0, d[0] * sd[0] + d[1] * sd[1] + d[2] * sd[2]);
      const halo = Math.pow(cosSun, 6) * 0.55 + Math.pow(cosSun, 90) * 2.6 + Math.pow(cosSun, 900) * 12;
      // Below the horizon the dome is the haze colour, which is what distant ground fades to.
      const g = d[1] < 0 ? Math.min(1, -d[1] * 6) : 0;
      const sky = (ch: 0 | 1 | 2) => atm.skyZenith[ch] + (atm.skyHorizon[ch] - atm.skyZenith[ch]) * k + atm.sunColor[ch] * halo * atm.sunIntensity * 0.28;
      const c: Rgb = [sky(0) + (atm.fogColor[0] - sky(0)) * g, sky(1) + (atm.fogColor[1] - sky(1)) * g, sky(2) + (atm.fogColor[2] - sky(2)) * g];
      b.vertex([d[0] * radius, d[1] * radius, d[2] * radius], [-d[0], -d[1], -d[2]], i / segs, j / rings, c);
    }
  }
  const row = segs + 1;
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segs; i++) {
      const a = j * row + i;
      // Wound to face inward.
      b.tri(a, a + 1, a + row + 1);
      b.tri(a, a + row + 1, a + row);
    }
  }
  return b.build();
}
