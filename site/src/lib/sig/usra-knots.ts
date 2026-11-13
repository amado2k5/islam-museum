// The knot diagram of the Usra browser (site/src/components/sig/UsraKnots.astro): the graph's `spouse_of` edges form
// connected households. A household of three or more people is laid out radially (the person with most recorded marriages at
// the centre, partners on a ring around them, partners of partners further out, each in the sector of the person they
// follow); a household of two is a pair, drawn in a grid by the component. Deterministic: ties are broken by id.

export interface Pair { a: string; b: string }
export interface Household {
  ids: string[];
  root: string;
  pos: Map<string, { x: number; y: number }>; // relative to the centre
  tree: Pair[]; // the edges the layout follows (child to parent order a=parent, b=child)
  extra: Pair[]; // the remaining edges (a marriage that closes a loop)
  edges: number;
}

export const SX = 1.4; // the rings are ellipses: wider than tall, so labels under neighbouring nodes do not meet
const RING_STEP = 96;

export function households(pairs: Pair[]): { big: Household[]; pairs: Pair[] } {
  const adj = new Map<string, Set<string>>();
  for (const p of pairs) {
    (adj.get(p.a) ?? adj.set(p.a, new Set()).get(p.a)!).add(p.b);
    (adj.get(p.b) ?? adj.set(p.b, new Set()).get(p.b)!).add(p.a);
  }
  const seen = new Set<string>();
  const comps: string[][] = [];
  for (const id of [...adj.keys()].sort()) {
    if (seen.has(id)) continue;
    const comp: string[] = [];
    const stack = [id];
    seen.add(id);
    while (stack.length) {
      const x = stack.pop()!;
      comp.push(x);
      for (const y of adj.get(x)!) if (!seen.has(y)) { seen.add(y); stack.push(y); }
    }
    comps.push(comp.sort());
  }
  const edgeCount = (c: string[]) => pairs.filter((p) => c.includes(p.a)).length;
  comps.sort((a, b) => b.length - a.length || edgeCount(b) - edgeCount(a) || a[0].localeCompare(b[0]));
  const big: Household[] = [];
  const small: Pair[] = [];
  for (const c of comps) {
    if (c.length === 2) { small.push(pairs.find((p) => p.a === c[0] || p.b === c[0])!); continue; }
    big.push(layout(c, adj, pairs));
  }
  small.sort((p, q) => p.a.localeCompare(q.a) || p.b.localeCompare(q.b));
  return { big, pairs: small };
}

function layout(ids: string[], adj: Map<string, Set<string>>, pairs: Pair[]): Household {
  const root = [...ids].sort((a, b) => adj.get(b)!.size - adj.get(a)!.size || a.localeCompare(b))[0];
  const parent = new Map<string, string>();
  const depth = new Map<string, number>([[root, 0]]);
  const kids = new Map<string, string[]>();
  const queue = [root];
  while (queue.length) {
    const x = queue.shift()!;
    for (const y of [...adj.get(x)!].sort()) {
      if (depth.has(y)) continue;
      depth.set(y, depth.get(x)! + 1);
      parent.set(y, x);
      (kids.get(x) ?? kids.set(x, []).get(x)!).push(y);
      queue.push(y);
    }
  }
  const weight = new Map<string, number>();
  const w = (x: string): number => {
    if (weight.has(x)) return weight.get(x)!;
    const k = kids.get(x) ?? [];
    const v = k.length ? k.reduce((s, c) => s + w(c), 0) : 1;
    weight.set(x, v);
    return v;
  };
  w(root);
  // angles: each node takes the centre of its sector, children split the parent's sector by weight
  const angle = new Map<string, number>();
  const place = (x: string, a0: number, a1: number) => {
    const k = kids.get(x) ?? [];
    const total = k.reduce((s, c) => s + w(c), 0);
    let a = a0;
    for (const c of k) {
      const span = ((a1 - a0) * w(c)) / total;
      angle.set(c, a + span / 2);
      place(c, a, a + span);
      a += span;
    }
  };
  const start = -Math.PI / 2; // two partners then sit left and right of the centre; with more, none sits exactly on the vertical
  place(root, start, start + 2 * Math.PI);
  const ring1 = (kids.get(root) ?? []).map((c) => angle.get(c)!).sort((a, b) => a - b);
  let dmin = Math.PI;
  for (let i = 0; i < ring1.length; i++) {
    const d = i === ring1.length - 1 ? ring1[0] + 2 * Math.PI - ring1[i] : ring1[i + 1] - ring1[i];
    if (ring1.length > 1) dmin = Math.min(dmin, d);
  }
  const sinTop = Math.sin(Math.min(dmin, Math.PI / 2));
  const r1 = ring1.length <= 2 ? 120 : Math.max(100, Math.ceil(104 / (SX * sinTop)), Math.ceil(48 / dmin));
  const pos = new Map<string, { x: number; y: number }>([[root, { x: 0, y: 0 }]]);
  for (const id of ids) {
    if (id === root) continue;
    const r = r1 + (depth.get(id)! - 1) * RING_STEP;
    const th = angle.get(id)!;
    pos.set(id, { x: SX * r * Math.cos(th), y: r * Math.sin(th) });
  }
  const mine = pairs.filter((p) => ids.includes(p.a));
  const tree: Pair[] = [], extra: Pair[] = [];
  for (const p of mine) {
    if (parent.get(p.b) === p.a) tree.push({ a: p.a, b: p.b });
    else if (parent.get(p.a) === p.b) tree.push({ a: p.b, b: p.a });
    else extra.push(p);
  }
  return { ids, root, pos, tree, extra, edges: mine.length };
}
