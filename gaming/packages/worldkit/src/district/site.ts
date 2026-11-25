// The lie of the land for the reference district: a river, a canal that leaves it, the ground height, the city
// wall line and the warped street grid. Everything is an analytic function of position, so any generator (and any
// test) can ask "is this point water, street or building land?" without a shared mutable map.
//
// The district is fictional: an original riverside city in the manner of the great irrigated river cities of the
// Abbasid period. It is not a reconstruction of Baghdad or of any real place, and nothing here is a historical claim.

export const WATER_LEVEL = 0;
export const CITY_CENTER = { x: 0, z: -70 } as const;
export const HALF_EXTENT = 640;

/** River centre line: z as a function of x. The river runs west to east along the south of the city. */
export const riverZ = (x: number) => 190 + 64 * Math.sin(x * 0.0058 + 0.5) - 0.17 * x + 22 * Math.sin(x * 0.0131 + 2.1);
const riverSlope = (x: number) => 64 * 0.0058 * Math.cos(x * 0.0058 + 0.5) - 0.17 + 22 * 0.0131 * Math.cos(x * 0.0131 + 2.1);
export const riverHalfWidth = (x: number) => 58 + 12 * Math.sin(x * 0.0043 + 1.2);

/** Signed distance to the river's edge in metres: negative on the water, positive on land. */
export function riverDistance(x: number, z: number): number {
  const d = Math.abs(z - riverZ(x)) / Math.sqrt(1 + riverSlope(x) ** 2);
  return d - riverHalfWidth(x);
}

/** Which bank a point is on: -1 north (the city side), +1 south. */
export const bankSide = (x: number, z: number) => (z < riverZ(x) ? -1 : 1);

/** The canal: taken off the river upstream, led north through the city and out to the fields in the east. */
export const CANAL: ReadonlyArray<readonly [number, number]> = [
  [-250, 196],
  [-244, 120],
  [-232, 40],
  [-214, -60],
  [-176, -170],
  [-110, -252],
  [-10, -284],
  [110, -272],
  [230, -232],
  [340, -196],
  [450, -170],
  [600, -140],
];
export const CANAL_HALF_WIDTH = 3.6;

export function distanceToPolyline(x: number, z: number, line: ReadonlyArray<readonly [number, number]>): number {
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const [ax, az] = line[i]!;
    const [bx, bz] = line[i + 1]!;
    const dx = bx - ax;
    const dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    const d = Math.hypot(x - (ax + t * dx), z - (az + t * dz));
    if (d < best) best = d;
  }
  return best;
}

/** Catmull-Rom resampling of a polyline at roughly `step` metres, so a few control points give a smooth course. */
export function smoothPolyline(points: ReadonlyArray<readonly [number, number]>, step: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(n - 1, i + 2)]!;
    const segs = Math.max(1, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let s = 0; s < segs; s++) {
      const t = s / segs;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push([points[n - 1]![0], points[n - 1]![1]]);
  return out;
}

export const CANAL_COURSE = smoothPolyline(CANAL, 8);
export const canalDistance = (x: number, z: number) => distanceToPolyline(x, z, CANAL_COURSE) - CANAL_HALF_WIDTH;

/** City wall radius in the direction `theta` from the city centre (before the river cuts it). */
export const wallRadius = (theta: number) => 318 + 26 * Math.sin(3 * theta + 1.1) + 14 * Math.sin(5 * theta + 0.3);

/** How far inside the city wall a point is, in metres (negative outside). The river bank closes the south side. */
export function insideCity(x: number, z: number): number {
  const dx = x - CITY_CENTER.x;
  const dz = z - CITY_CENTER.z;
  const radial = wallRadius(Math.atan2(dz, dx)) - Math.hypot(dx, dz);
  if (bankSide(x, z) > 0) return -1;
  return Math.min(radial, riverDistance(x, z) - 6);
}

/**
 * Ground height in metres. Inside the wall the city sits on one gently tilted plane, so paving, canals and
 * buildings meet the ground exactly; outside, the land rolls a little; the river bed drops below the water.
 */
export function groundHeight(x: number, z: number): number {
  const rd = riverDistance(x, z);
  const plane = 3.2 + 0.006 * Math.max(0, Math.min(700, riverZ(x) - z));
  let h = plane;
  const out = -Math.min(0, insideCity(x, z) + 30) / 120;
  if (out > 0 && rd > 0) {
    const k = Math.min(1, out);
    h += k * (2.2 * Math.sin(x * 0.011 + 0.7) * Math.cos(z * 0.009 - 0.4) + 1.3 * Math.sin(x * 0.027 + z * 0.021));
  }
  if (rd < 2) {
    // Bank: the plane runs to within 2 m of the river's edge, then falls to a bed about 4 m under the water.
    const t = Math.max(0, Math.min(1, (2 - rd) / 22));
    const s = t * t * (3 - 2 * t);
    h = h * (1 - s) + -4.2 * s;
  }
  return h;
}

// ---- Street grid -----------------------------------------------------------------------------------------------
// Streets are the lines of a grid laid out in "plan space" (a, b), which is then turned and gently bent into world
// space. A turned, bent grid reads as a planned city that has grown: streets are continuous and mostly parallel,
// but none is straight for long.

export const GRID_YAW = 0.24;
const GC = Math.cos(GRID_YAW);
const GS = Math.sin(GRID_YAW);

export function planToWorld(a: number, b: number): [number, number] {
  const wa = a + 16 * Math.sin(b * 0.0105 + 1.3) + 9 * Math.sin(b * 0.023 + 0.2);
  const wb = b + 13 * Math.sin(a * 0.0125 + 0.4) + 7 * Math.sin(a * 0.027 + 2.0);
  return [CITY_CENTER.x + wa * GC + wb * GS, CITY_CENTER.z - wa * GS + wb * GC];
}

/** Heading (yaw, as used by worldkit frames) of the plan a-axis at a plan point, after bending. */
export function planYaw(a: number, b: number): number {
  const [x0, z0] = planToWorld(a - 1, b);
  const [x1, z1] = planToWorld(a + 1, b);
  return Math.atan2(-(z1 - z0), x1 - x0);
}
