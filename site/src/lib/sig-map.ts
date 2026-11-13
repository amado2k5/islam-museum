// A small equirectangular frame for the signature views (battles' campaign map, journeys' route map): the extent comes
// from the points the view draws, the land from the same self-hosted Natural Earth extract MiniMap uses
// (src/data/basemap-mena.json, scripts/map/build_basemap.py). Nothing is added to the data; the ring simplification
// is MiniMap's (clip to the frame, then Ramer-Douglas-Peucker in screen space).
import basemap from "../data/basemap-mena.json";

export interface Frame {
  width: number; height: number;
  X: (lon: number) => number; Y: (lat: number) => number;
  landD: string;
  /** the rectangle the land is drawn over: the frame, or `world` when given (a view can ease out to it) */
  world: { x: number; y: number; w: number; h: number };
}

const rdp = (pts: number[][], eps: number) => {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack: number[][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let dmax = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (dmax > eps && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};

/** points: [lat, lon] pairs. The frame is `width` units wide; its height follows the extent, kept between minAspect and maxAspect of the width. */
export function makeFrame(points: [number, number][], opts: { width?: number; pad?: number; minAspect?: number; maxAspect?: number; minSpan?: number; world?: [number, number][]; eps?: number } = {}): Frame {
  const width = opts.width ?? 1000, pad = opts.pad ?? 0.08, minAspect = opts.minAspect ?? 0.5, maxAspect = opts.maxAspect ?? 0.9, minSpan = opts.minSpan ?? 8;
  const lats = points.map((p) => p[0]), lons = points.map((p) => p[1]);
  let minLat = Math.min(...lats), maxLat = Math.max(...lats), minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const grow = (lo: number, hi: number, span: number): [number, number] => (hi - lo < span ? [(lo + hi) / 2 - span / 2, (lo + hi) / 2 + span / 2] : [lo, hi]);
  [minLat, maxLat] = grow(minLat, maxLat, minSpan);
  [minLon, maxLon] = grow(minLon, maxLon, minSpan);
  const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  let dLon = (maxLon - minLon) * (1 + 2 * pad), dLat = (maxLat - minLat) * (1 + 2 * pad);
  const cLon = (minLon + maxLon) / 2, cLat = (minLat + maxLat) / 2;
  // keep the aspect inside the bounds by widening the shorter side
  if (dLat / (dLon * kx) > maxAspect) dLon = dLat / (maxAspect * kx);
  if (dLat / (dLon * kx) < minAspect) dLat = dLon * kx * minAspect;
  const x0 = cLon - dLon / 2, y1 = cLat + dLat / 2;
  const s = width / (dLon * kx);
  const height = Math.round(dLat * s);
  const X = (lon: number) => (lon - x0) * kx * s;
  const Y = (lat: number) => (y1 - lat) * s;
  // Sutherland-Hodgman clip of each ring to the frame (a little beyond it, so no clipped edge shows), then RDP in screen space.
  const margin = width * (opts.world ? 0.25 : 0.05);
  const wp = (opts.world ?? []).map(([lat, lon]) => [X(lon), Y(lat)]);
  const R = wp.length
    ? { x0: Math.min(0, ...wp.map((p) => p[0])) - margin, x1: Math.max(width, ...wp.map((p) => p[0])) + margin, y0: Math.min(0, ...wp.map((p) => p[1])) - margin, y1: Math.max(height, ...wp.map((p) => p[1])) + margin }
    : { x0: -margin, x1: width + margin, y0: -margin, y1: height + margin };
  const clip = (poly: number[][]) => {
    const edges: [(p: number[]) => boolean, (a: number[], b: number[]) => number[]][] = [
      [(p) => p[0] >= R.x0, (a, b) => { const t = (R.x0 - a[0]) / (b[0] - a[0]); return [R.x0, a[1] + t * (b[1] - a[1])]; }],
      [(p) => p[0] <= R.x1, (a, b) => { const t = (R.x1 - a[0]) / (b[0] - a[0]); return [R.x1, a[1] + t * (b[1] - a[1])]; }],
      [(p) => p[1] >= R.y0, (a, b) => { const t = (R.y0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), R.y0]; }],
      [(p) => p[1] <= R.y1, (a, b) => { const t = (R.y1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), R.y1]; }],
    ];
    let out = poly;
    for (const [inside, cut] of edges) {
      const input = out; out = [];
      for (let i = 0; i < input.length; i++) {
        const a = input[i], b = input[(i + 1) % input.length];
        if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b); } else if (inside(a)) out.push(cut(a, b));
      }
      if (!out.length) break;
    }
    return out;
  };
  const rings = (basemap.rings as number[][][]).map((ring) => {
    const projected = ring.map(([lon, lat]) => [X(lon), Y(lat)]);
    const clipped = clip(projected);
    return clipped.length > 2 ? rdp(clipped, opts.eps ?? width / 900) : [];
  });
  const landD = rings.filter((r) => r.length > 2).map((r) => "M" + r.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z").join("");
  return { width, height, X, Y, landD, world: { x: R.x0, y: R.y0, w: R.x1 - R.x0, h: R.y1 - R.y0 } };
}
