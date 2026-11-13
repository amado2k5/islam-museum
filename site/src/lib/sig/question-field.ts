// Layout helpers for "What people ask about" (site/src/components/sig/QuestionField.astro): a deterministic packing of
// circles (no randomness: the same counts always give the same coordinates, so the page bytes do not change between
// builds) and a label fitter. No dependency.
import { textWidth } from "./four-schools";

export interface Circle { x: number; y: number; r: number }

/**
 * Pack circles of the given radii, in the given order, around the origin: the first (the biggest) stands at the centre,
 * every next one takes, among the places where it touches two circles already placed without overlapping any, the one
 * nearest the centre. `aspect` widens the field (distance is measured as x / aspect), so a wide screen gets a wide field.
 */
export function packCircles(radii: number[], gap: number, aspect = 1.3): Circle[] {
  const out: Circle[] = [];
  const free = (x: number, y: number, r: number) => out.every((c) => Math.hypot(c.x - x, c.y - y) >= c.r + r + gap - 1e-6);
  const key = (x: number, y: number) => (x / aspect) ** 2 + y ** 2;
  for (const r of radii) {
    if (!out.length) { out.push({ x: 0, y: 0, r }); continue; }
    const cands: [number, number][] = [];
    if (out.length === 1) cands.push([out[0].r + r + gap, 0], [-(out[0].r + r + gap), 0]);
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i], b = out[j];
        const ra = a.r + r + gap, rb = b.r + r + gap;
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (d > ra + rb || d < Math.abs(ra - rb) || d === 0) continue;
        const l = (ra * ra - rb * rb + d * d) / (2 * d);
        const h2 = ra * ra - l * l;
        if (h2 < 0) continue;
        const h = Math.sqrt(h2);
        const mx = a.x + (l * dx) / d, my = a.y + (l * dy) / d;
        cands.push([mx + (h * dy) / d, my - (h * dx) / d], [mx - (h * dy) / d, my + (h * dx) / d]);
      }
    }
    let best: [number, number] | null = null;
    for (const [x, y] of cands) {
      if (!free(x, y, r)) continue;
      if (!best || key(x, y) < key(best[0], best[1]) - 1e-9 || (Math.abs(key(x, y) - key(best[0], best[1])) <= 1e-9 && (x < best[0] || (x === best[0] && y < best[1])))) best = [x, y];
    }
    if (!best) throw new Error("packCircles: no place found for a circle");
    out.push({ x: best[0], y: best[1], r });
  }
  return out;
}

export interface Fit { lines: string[]; fs: number }
/**
 * The largest font size (minFs..maxFs, whole units) at which `text` wraps into at most three lines inside a circle of
 * radius `r`, or null when it does not fit: the name is then on hover, in the readout and in the list.
 */
export function fitLabel(text: string, r: number, minFs: number, maxFs: number, extraOf: (fs: number) => number = () => 0): Fit | null {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  for (let fs = Math.floor(maxFs); fs >= minFs; fs--) {
    for (let L = 1; L <= 3; L++) {
      const h = L * fs * 1.2 + extraOf(fs);
      if (h / 2 >= r) continue;
      const maxW = 2 * Math.sqrt(r * r - (h / 2) ** 2) * 0.94;
      const lines: string[] = [];
      let cur = "";
      let ok = true;
      for (const w of words) {
        if (textWidth(w, fs) > maxW) { ok = false; break; }
        const t = cur ? `${cur} ${w}` : w;
        if (textWidth(t, fs) <= maxW) cur = t; else { lines.push(cur); cur = w; }
      }
      if (!ok) continue;
      lines.push(cur);
      if (lines.length <= L) return { lines, fs };
    }
  }
  return null;
}
