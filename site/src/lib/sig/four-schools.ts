// Layout helpers for "Four schools, side by side in time" (site/src/components/sig/FourSchools.astro). Pure and
// deterministic: the same records always give the same coordinates, so the page bytes do not change between builds.
import { civilToHijri, hijriToCivil } from "../../../../scripts/hijri/convert";

/** The school sections of the Four Madhhabs Browser and the group record each school's imam is `founder_of`. */
export const SCHOOL_GROUPS: Record<string, string> = {
  hanafi: "group/hanafi-madhhab",
  maliki: "group/maliki-madhhab",
  shafii: "group/shafii-madhhab",
  hanbali: "group/hanbali-madhhab",
};

const yearOf = (s: unknown): number | null => {
  const m = typeof s === "string" ? s.match(/^(-?\d{1,4})/) : null;
  return m ? Number(m[1]) : null;
};

export interface LifeDate { ah: number; ce: number }
/** One date object of a record (`born` / `died`): Hijri and Gregorian-or-Julian years, either read or converted. */
export function lifeDate(d: any): LifeDate | null {
  if (!d) return null;
  const h = yearOf(d.hijri), c = yearOf(d.edtf);
  if (h !== null && c !== null) return { ah: h, ce: c };
  if (h !== null) return { ah: h, ce: hijriToCivil({ y: h, m: 7, d: 1 }).date.y };
  if (c !== null) {
    const cal = d.calendar === "gregorian" || d.calendar === "julian" ? d.calendar : c < 1583 ? "julian" : "gregorian";
    return { ah: civilToHijri(cal, { y: c, m: 7, d: 1 }).date.y, ce: c };
  }
  return null;
}

export interface Box { x: number; y: number; w: number; h: number }
const hits = (a: Box, b: Box, pad = 1.5) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;

export interface PackItem {
  id: string;
  kind: "bar" | "dia";
  y1: number; y2: number; // vertical extent of a bar; for a diamond y1 === y2 is its centre
  bw: number; // bar width, or diamond size
  labelWs: number[]; // widths to try for the label, widest first (the caller clips the text to the one chosen); empty for no label
  near?: string; // diamonds: the item whose bar they prefer to sit beside
}
export interface Packed { id: string; x: number; label: number | null /* label centre y */; lw: number /* the label width chosen */; side: "end" | "start" /* the label's side of the bar, in the reading direction */ }

export const LABEL_H = 13;
/**
 * Greedy rectangle packing inside one column: every item takes the leftmost free offset (3 px steps), a bar carrying its
 * label to the inline-end side, the label as high on the bar as it will go. Items come in the order they are given
 * (the caller puts the imam first, then the rest from the earliest). A label that cannot be placed anywhere is dropped
 * (the bar keeps its link and its tooltip); a diamond looks beside its author's bar first.
 */
export function packColumn(items: PackItem[], width: number): Packed[] {
  const placed: Box[] = [];
  const out = new Map<string, Packed>();
  const barOf = new Map<string, Box>();
  const free = (b: Box[]) => b.every((r) => placed.every((p) => !hits(r, p)));
  for (const it of items.filter((i) => i.kind === "bar")) {
    const h = it.y2 - it.y1;
    let done: Packed | null = null;
    const tops: number[] = [];
    if (it.labelWs.length) {
      for (let ly = it.y1 + LABEL_H / 2; ly <= it.y2 - LABEL_H / 2 + 0.01; ly += 7) tops.push(ly);
      // a short bar (a death-year tick) may carry its label a little above or below its middle
      if (it.y2 - it.y1 < 30) { const m = (it.y1 + it.y2) / 2; tops.length = 0; tops.push(m, m - 8, m + 8, m - 16, m + 16); }
    }
    search: for (const lw of it.labelWs) {
      for (let x = 0; x + it.bw <= width; x += 3) {
        const bar: Box = { x, y: it.y1, w: it.bw, h };
        for (const ly of tops) {
          const lab: Box = { x: x + it.bw + 4, y: ly - LABEL_H / 2, w: lw, h: LABEL_H };
          if (lab.x + lab.w > width) continue;
          if (free([bar, lab])) { placed.push(bar, lab); barOf.set(it.id, bar); done = { id: it.id, x, label: ly, lw, side: "end" }; break search; }
        }
      }
    }
    // no room at the inline-end side: the label may stand on the other side of the bar
    if (!done) {
      back: for (const lw of it.labelWs) {
        for (let x = 0; x + it.bw <= width; x += 3) {
          const bar: Box = { x, y: it.y1, w: it.bw, h };
          for (const ly of tops) {
            const lab: Box = { x: x - 4 - lw, y: ly - LABEL_H / 2, w: lw, h: LABEL_H };
            if (lab.x < 0) continue;
            // only where no other bar stands right beside it: a label across a neighbouring bar would read as that bar's
            if ([...barOf.values()].some((b) => hits(b, { x: x - 9, y: it.y1, w: 9, h }, 0))) continue;
            if (free([bar, lab])) { placed.push(bar, lab); barOf.set(it.id, bar); done = { id: it.id, x, label: ly, lw, side: "start" }; break back; }
          }
        }
      }
    }
    if (!done) {
      for (let x = 0; x + it.bw <= width; x += 3) {
        const bar: Box = { x, y: it.y1, w: it.bw, h };
        if (free([bar])) { placed.push(bar); barOf.set(it.id, bar); done = { id: it.id, x, label: null, lw: 0, side: "end" }; break; }
      }
    }
    if (!done) { const bar: Box = { x: 0, y: it.y1, w: it.bw, h }; placed.push(bar); barOf.set(it.id, bar); done = { id: it.id, x: 0, label: null, lw: 0, side: "end" }; }
    out.set(it.id, done);
  }
  for (const it of items.filter((i) => i.kind === "dia")) {
    const s = it.bw;
    const tryAt = (x: number): boolean => {
      if (x < 0 || x + s > width) return false;
      const r: Box = { x, y: it.y1 - s / 2, w: s, h: s };
      if (!free([r])) return false;
      placed.push(r); out.set(it.id, { id: it.id, x, label: null, lw: 0, side: "end" });
      return true;
    };
    const nb = it.near ? barOf.get(it.near) : undefined;
    if (nb && (tryAt(nb.x + nb.w + 3) || tryAt(nb.x - s - 3))) continue;
    let ok = false;
    for (let x = 0; x + s <= width && !ok; x += 3) ok = tryAt(x);
    if (!ok) { placed.push({ x: 0, y: it.y1 - s / 2, w: s, h: s }); out.set(it.id, { id: it.id, x: 0, label: null, lw: 0, side: "end" }); }
  }
  return items.map((i) => out.get(i.id)!);
}

/** Rough text width at 12 px: Arabic-script letters are narrower than Latin ones. Used only to keep labels from colliding. */
export const textWidth = (s: string, fs = 12): number => {
  let w = 0;
  for (const ch of s) w += /\s/.test(ch) ? 0.28 : /[؀-ۿݐ-ݿ]/.test(ch) ? 0.47 : /[A-Z]/.test(ch) ? 0.66 : 0.55;
  return w * fs;
};
/** Shorten a label to a width, with an ellipsis; the full name is always in the tooltip and the list. */
export function clip(s: string, maxW: number, fs = 12): string {
  if (textWidth(s, fs) <= maxW) return s;
  const chars = [...s];
  while (chars.length > 1 && textWidth(chars.join("") + "…", fs) > maxW) chars.pop();
  return chars.join("").trimEnd() + "…";
}
