// Authored conversation: typed scripts and the small machine that walks them. No text lives here, only keys of the
// string tables, so that a line can never exist in one language and not in the other six. Nothing is generated.
//
// Three layers, as the founder's instruction asks: the lines of a node are the essential ones (never more than three
// before the player has control or a choice), a choice marked `deeper` is an optional "ask more", and the museum's
// note comes after the quest, outside any script.

export type Mood = "glad" | "think" | "alarm";
export interface Line<S extends string> {
  who: S;
  key: string;
  mood: Mood;
}
export interface Choice {
  key: string;
  to: string;
  /** An optional branch with more to learn; never needed to go on. */
  deeper?: boolean;
  /** Shown only while every one of these flags is set. */
  needs?: string[];
}
export interface Node<S extends string> {
  lines: Line<S>[];
  choices?: Choice[];
  /** Flags the node sets when it is entered. */
  set?: string[];
}
export interface Script<S extends string> {
  start: string;
  nodes: Record<string, Node<S>>;
}
/** Where a conversation stands. `line` is the index of the line on screen. */
export interface Talk {
  script: string;
  node: string;
  line: number;
}

export const MAX_ESSENTIAL_LINES = 3;

export function open<S extends string>(scripts: Record<string, Script<S>>, script: string): Talk {
  const s = scripts[script];
  if (!s) throw new Error(`no script called ${script}`);
  return { script, node: s.start, line: 0 };
}
export const nodeOf = <S extends string>(scripts: Record<string, Script<S>>, t: Talk): Node<S> => scripts[t.script]!.nodes[t.node]!;
export const lineOf = <S extends string>(scripts: Record<string, Script<S>>, t: Talk): Line<S> => nodeOf(scripts, t).lines[t.line]!;
/** The choices on offer once the node's last line is showing. */
export function choicesOf<S extends string>(scripts: Record<string, Script<S>>, t: Talk, flags: ReadonlySet<string>): Choice[] {
  const n = nodeOf(scripts, t);
  if (t.line < n.lines.length - 1) return [];
  return (n.choices ?? []).filter((c) => (c.needs ?? []).every((f) => flags.has(f)));
}

export type Step = { talk: Talk | null; set: string[] };

/** Forward one line. At the end of a node with choices it waits; at the end of one without, the talk is over. */
export function forward<S extends string>(scripts: Record<string, Script<S>>, t: Talk): Step {
  const n = nodeOf(scripts, t);
  if (t.line < n.lines.length - 1) return { talk: { ...t, line: t.line + 1 }, set: [] };
  if (n.choices?.length) return { talk: t, set: [] };
  return { talk: null, set: [] };
}
/** Back one line within the node; the first line stays. */
export const back = (t: Talk): Talk => (t.line > 0 ? { ...t, line: t.line - 1 } : t);
export function choose<S extends string>(scripts: Record<string, Script<S>>, t: Talk, index: number, flags: ReadonlySet<string>): Step {
  const c = choicesOf(scripts, t, flags)[index];
  if (!c) return { talk: t, set: [] };
  const next = scripts[t.script]!.nodes[c.to];
  if (!next) throw new Error(`${t.script}: the choice ${c.key} leads to a node that does not exist, ${c.to}`);
  return { talk: { script: t.script, node: c.to, line: 0 }, set: next.set ?? [] };
}
/** The flags a script's first node sets. */
export const openingFlags = <S extends string>(scripts: Record<string, Script<S>>, script: string): string[] => scripts[script]!.nodes[scripts[script]!.start]!.set ?? [];

/** Every fault in a set of scripts: a missing node, a wall of text, a dead end, a string that is not in the table. */
export function faults<S extends string>(scripts: Record<string, Script<S>>, strings: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [name, s] of Object.entries(scripts)) {
    if (!s.nodes[s.start]) out.push(`${name}: no start node ${s.start}`);
    const reached = new Set<string>([s.start]);
    const queue = [s.start];
    while (queue.length) {
      const n = s.nodes[queue.pop()!];
      for (const c of n?.choices ?? []) if (!reached.has(c.to)) (reached.add(c.to), queue.push(c.to));
    }
    for (const [id, n] of Object.entries(s.nodes)) {
      if (!reached.has(id)) out.push(`${name}.${id}: never reached`);
      if (n.lines.length === 0) out.push(`${name}.${id}: no lines`);
      if (n.lines.length > MAX_ESSENTIAL_LINES) out.push(`${name}.${id}: ${n.lines.length} lines before the player has a say`);
      for (const l of n.lines) if (typeof strings[l.key] !== "string") out.push(`${name}.${id}: no string ${l.key}`);
      for (const c of n.choices ?? []) {
        if (!s.nodes[c.to]) out.push(`${name}.${id}: choice ${c.key} leads nowhere`);
        if (typeof strings[c.key] !== "string") out.push(`${name}.${id}: no string ${c.key}`);
      }
      // A node with choices must offer a way on that is not an "ask more".
      if (n.choices?.length && n.choices.every((c) => c.deeper)) out.push(`${name}.${id}: every way on is an optional one`);
    }
  }
  return out;
}
