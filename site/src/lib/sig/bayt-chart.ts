// The household chart of the Bayt browser (site/src/components/sig/BaytHousehold.astro): the layout is computed from the
// graph's own kinship edges, never placed by hand. Generations are the longest path over `child_of`; siblings share a
// generation; a person who has no recorded parent is brought down next to the lowest of their children; a spouse with no
// other kin in the chart stands beside the partner. The order within a generation is a barycentre sweep.

export type FamType = "child_of" | "spouse_of" | "sibling_of";
export interface FamEdge { type: FamType; from: string; to: string; start?: any; sources?: string[]; note?: string }

export interface ChartInput {
  anchor: string;
  ids: string[];
  edges: FamEdge[]; // only edges with both ends in ids
  w: number; // pill width
  gap: number; // horizontal gap between pills
}
export interface ChartLayout {
  level: Map<string, number>; // 0 is the anchor's generation
  rows: Map<number, string[]>; // ordered, block members excluded
  x: Map<string, number>; // left edge of each non-block pill (logical, inline-start based)
  block: string[]; // spouses of the anchor, in the order they are to be drawn
  blockLevel: number;
  levels: number[]; // generation numbers present, ascending
}

export function layoutChart(inp: ChartInput): ChartLayout {
  const { anchor, ids, edges, w, gap } = inp;
  const inSet = new Set(ids);
  const ch = edges.filter((e) => e.type === "child_of");
  const sib = edges.filter((e) => e.type === "sibling_of");
  const sp = edges.filter((e) => e.type === "spouse_of");
  const parentsOf = new Map<string, string[]>();
  const kidsOf = new Map<string, string[]>();
  for (const e of ch) {
    (parentsOf.get(e.from) ?? parentsOf.set(e.from, []).get(e.from)!).push(e.to);
    (kidsOf.get(e.to) ?? kidsOf.set(e.to, []).get(e.to)!).push(e.from);
  }
  const hasSib = new Set(sib.flatMap((e) => [e.from, e.to]));
  const spouses = new Map<string, string[]>();
  for (const e of sp) {
    (spouses.get(e.from) ?? spouses.set(e.from, []).get(e.from)!).push(e.to);
    (spouses.get(e.to) ?? spouses.set(e.to, []).get(e.to)!).push(e.from);
  }
  // spouse-only: no parent, child or sibling edge in the chart
  const spouseOnly = new Set(ids.filter((i) => !parentsOf.has(i) && !kidsOf.has(i) && !hasSib.has(i) && spouses.has(i)));

  // ---- generations
  const level = new Map(ids.map((i) => [i, 0]));
  const relax = () => {
    let changed = false;
    for (const e of ch) if (level.get(e.from)! < level.get(e.to)! + 1) { level.set(e.from, level.get(e.to)! + 1); changed = true; }
    for (const e of sib) { const m = Math.max(level.get(e.from)!, level.get(e.to)!); if (level.get(e.from) !== m || level.get(e.to) !== m) { level.set(e.from, m); level.set(e.to, m); changed = true; } }
    return changed;
  };
  const settle = () => { for (let k = 0; k < 400 && relax(); k++) if (k === 399) throw new Error("Household chart: the generations do not settle (a cycle in child_of or sibling_of edges)"); };
  settle();
  // bring a person with no sibling edge down next to the lowest of their children (a grandparent line stays tight)
  for (let k = 0; k < 400; k++) {
    let changed = false;
    for (const id of ids) {
      if (hasSib.has(id) || spouseOnly.has(id)) continue;
      const kids = kidsOf.get(id);
      if (!kids?.length) continue;
      const t = Math.min(...kids.map((c) => level.get(c)!)) - 1;
      if (t > level.get(id)!) { level.set(id, t); changed = true; }
    }
    if (!changed) break;
    settle();
  }
  for (const id of spouseOnly) level.set(id, Math.max(...spouses.get(id)!.filter((s) => !spouseOnly.has(s) || s === anchor).map((s) => level.get(s) ?? 0), 0));
  const base = level.get(anchor)!;
  for (const [k, v] of level) level.set(k, v - base);

  // ---- the anchor's wives stand as a block beside him
  const block = [...new Set(spouses.get(anchor) ?? [])];
  const blockSet = new Set(block);
  const flow = ids.filter((i) => !blockSet.has(i));
  const rows = new Map<number, string[]>();
  for (const id of flow.sort()) { const l = level.get(id)!; (rows.get(l) ?? rows.set(l, []).get(l)!).push(id); }
  const levels = [...rows.keys()].sort((a, b) => a - b);

  // ---- order inside each generation: barycentre sweeps, spouses kept side by side, the anchor last in his row
  const step = w + gap;
  const x = new Map<string, number>();
  for (const l of levels) rows.get(l)!.forEach((id, i) => x.set(id, i * step));
  const neighbours = (id: string) => {
    const out: string[] = [];
    for (const p of parentsOf.get(id) ?? []) if (!blockSet.has(p)) out.push(p);
    for (const c of kidsOf.get(id) ?? []) if (!blockSet.has(c)) out.push(c);
    for (const s of spouses.get(id) ?? []) if (!blockSet.has(s) && level.get(s) !== level.get(id)) out.push(s);
    return out.filter((n) => inSet.has(n) && level.get(n) !== level.get(id));
  };
  const place = (l: number, useLevels: (n: string) => boolean) => {
    const row = rows.get(l)!;
    const tgt = new Map<string, number>();
    for (const id of row) {
      const ns = neighbours(id).filter(useLevels);
      tgt.set(id, ns.length ? ns.reduce((s, n) => s + x.get(n)!, 0) / ns.length : x.get(id)!);
    }
    row.sort((a, b) => (a === anchor ? 1 : 0) - (b === anchor ? 1 : 0) || tgt.get(a)! - tgt.get(b)! || a.localeCompare(b));
    // spouses of one generation side by side
    for (let i = 0; i < row.length; i++) {
      for (const s of spouses.get(row[i]) ?? []) {
        const j = row.indexOf(s);
        if (j >= 0 && Math.abs(j - i) > 1 && row[i] !== anchor && s !== anchor) { row.splice(j, 1); row.splice(i + 1, 0, s); }
      }
    }
    if (l === 0) { row.forEach((id, i) => x.set(id, i * step)); return; } // the anchor's own generation is the fixed left edge: his wives stand beside him
    const want = row.map((id) => tgt.get(id)!);
    const pos: number[] = [];
    row.forEach((_, i) => pos.push(i === 0 ? want[0] : Math.max(want[i], pos[i - 1] + step)));
    const shift = row.reduce((s, _, i) => s + (want[i] - pos[i]), 0) / row.length;
    row.forEach((id, i) => x.set(id, pos[i] + shift));
  };
  for (let sweep = 0; sweep < 8; sweep++) {
    const down = sweep % 2 === 0;
    const order = down ? levels : [...levels].reverse();
    for (const l of order) place(l, (n) => (down ? level.get(n)! < l : level.get(n)! > l) || sweep > 5);
  }
  let min = Infinity;
  for (const l of levels) for (const id of rows.get(l)!) min = Math.min(min, x.get(id)!);
  for (const [k, v] of x) x.set(k, v - min);

  // ---- the block's order: dated marriages first, in date order, then the undated; the mothers of children in the chart last
  const yearOf = (e: FamEdge | undefined): number | null => { const m = String(e?.start?.edtf ?? "").match(/^(-?\d{4})/); return m ? Number(m[1]) : null; };
  const marriage = (id: string) => sp.find((e) => (e.from === anchor && e.to === id) || (e.to === anchor && e.from === id));
  const mothers = new Set(block.filter((b) => (kidsOf.get(b) ?? []).some((c) => inSet.has(c))));
  const sorted = [...block].sort((a, b) => {
    const ya = yearOf(marriage(a)), yb = yearOf(marriage(b));
    return (ya === null ? 1 : 0) - (yb === null ? 1 : 0) || (ya ?? 0) - (yb ?? 0) || a.localeCompare(b);
  });
  const ordered = [...sorted.filter((b) => !mothers.has(b)), ...sorted.filter((b) => mothers.has(b))];
  return { level, rows, x, block: ordered, blockLevel: 0, levels };
}
