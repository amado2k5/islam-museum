// The fixed camera move used for captures and benchmarks: a closed loop of keyframes through the district, so every
// run and every engine looks at exactly the same views for exactly the same share of the time.
import type { Vec3 } from "@im/worldkit/mesh";

export interface CameraKey {
  position: Vec3;
  target: Vec3;
  fov: number;
}

const catmull = (a: number, b: number, c: number, d: number, t: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);

/** Named still views (shot list in docs/gaming/visual-atlas) and the loop that links them. */
export function cameraKeys(landmarks: Record<string, Vec3>): Record<string, CameraKey> {
  const dome = landmarks.libraryDome ?? [0, 20, -120];
  const bridge = landmarks.bridge ?? [0, 6, 190];
  const market = landmarks.market ?? [0, 5, 10];
  const noria = landmarks.noria ?? [-240, 5, 100];
  const garden = landmarks.garden ?? [140, 5, -120];
  return {
    // Shot 1: isometric riverside district.
    establishing: { position: [bridge[0] + 330, 250, bridge[2] + 250], target: [market[0] - 10, 0, market[2] - 40], fov: 34 },
    // High three-quarter view over the river toward the library.
    riverfront: { position: [bridge[0] - 210, 110, bridge[2] + 150], target: [dome[0], 14, dome[2] + 40], fov: 40 },
    // Shot 2: street level in the market.
    // Landmark heights are 2 m above the ground there, so eye level is a little below them.
    market: { position: [market[0] + 2, market[1] - 0.2, market[2] + 30], target: [market[0] - 5, market[1] + 1.4, market[2] - 40], fov: 58 },
    // The library portal and dome from the plaza.
    library: { position: [dome[0] + 60, 30, dome[2] + 150], target: [dome[0], 16, dome[2] + 10], fov: 42 },
    // Low over the water toward the bridge.
    bridge: { position: [bridge[0] - 120, 7, bridge[2] + 26], target: [bridge[0] + 10, 6, bridge[2] - 40], fov: 46 },
    noria: { position: [noria[0] + 48, 14, noria[2] + 44], target: [noria[0], 5, noria[2] - 4], fov: 44 },
    garden: { position: [garden[0] + 70, 46, garden[2] + 90], target: [garden[0], 4, garden[2]], fov: 44 },
  };
}

const LOOP = ["establishing", "riverfront", "bridge", "market", "library", "garden", "noria"] as const;

/** Camera on the benchmark loop at phase u in [0, 1). */
export function cameraOnLoop(keys: Record<string, CameraKey>, u: number): CameraKey {
  const n = LOOP.length;
  const f = (((u % 1) + 1) % 1) * n;
  const i = Math.floor(f);
  const t = f - i;
  // Ease within each leg so the camera lingers on the keyed views.
  const e = t * t * (3 - 2 * t);
  const k = (o: number) => keys[LOOP[(i + o + n) % n]!]!;
  const k0 = k(-1);
  const k1 = k(0);
  const k2 = k(1);
  const k3 = k(2);
  const v = (sel: (c: CameraKey) => Vec3): Vec3 => [0, 1, 2].map((ax) => catmull(sel(k0)[ax]!, sel(k1)[ax]!, sel(k2)[ax]!, sel(k3)[ax]!, e)) as unknown as Vec3;
  const pos = v((c) => c.position);
  return { position: [pos[0], Math.max(7.5, pos[1]), pos[2]], target: v((c) => c.target), fov: k1.fov + (k2.fov - k1.fov) * e };
}
