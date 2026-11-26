// What a running game is costing the browser, counted the same way in every game: frame times, memory where the
// browser tells it, and how many of each thing that can leak is alive. It is evidence for the performance gates,
// so it is installed only when a page is asked to measure itself (?counters=1): an ordinary game is not instrumented.
//
// What it counts, and how exactly:
// - frames: every interval between animation frames, summarized as in framestats.ts, and the longest unbroken
//   stretch in which every frame missed 30 a second;
// - loops: the most animation-frame callbacks asked for in any one frame. A game on three.js shows two when all is
//   well, its own loop and the renderer's; what matters is that the figure does not rise while the game runs;
// - heap: the JavaScript heap in megabytes, in browsers that report it (Chromium); null elsewhere, and said so;
// - contexts: drawing contexts made, by kind, one for each canvas and kind;
// - intervals and workers: alive now; listeners: added less removed, less those on objects the browser has since
//   collected (a listener that removes itself by `once` is still counted, and collection comes when the browser
//   chooses, so read its change over minutes, not its size);
// - audio: audio contexts made and not closed, and nodes made through a context's create… methods;
// - whatever a game registers by name with provide(): its renderer's own triangles, draw calls, geometries, textures.
import { FrameRecorder, summarize, type FrameSummary } from "./framestats";

/** The longest unbroken stretch, in milliseconds, in which every frame took longer than `slowMs`. */
export function longestSlowRun(intervalsMs: ArrayLike<number>, slowMs = 33.4): number {
  let longest = 0;
  let run = 0;
  for (let i = 0; i < intervalsMs.length; i++) {
    const v = intervalsMs[i] as number;
    run = v > slowMs ? run + v : 0;
    if (run > longest) longest = run;
  }
  return Math.round(longest * 10) / 10;
}

export interface CounterSnapshot {
  atMs: number;
  frames: FrameSummary & { longestUnder30FpsMs: number };
  loops: number;
  heapMb: number | null;
  heapNote: string;
  contexts: Record<string, number>;
  intervals: number;
  workers: number;
  listeners: number;
  audio: { contexts: number; nodesMade: number };
  provided: Record<string, unknown>;
}

/** The parts of a window the counters touch. A test passes its own; a page passes `window`. */
export interface CounterHost {
  performance: { now(): number; memory?: { usedJSHeapSize: number } };
  requestAnimationFrame?: (cb: (t: number) => void) => number;
  setInterval?: (...args: never[]) => unknown;
  clearInterval?: (id?: never) => void;
  Worker?: unknown;
  EventTarget?: { prototype: { addEventListener: (...a: never[]) => void; removeEventListener: (...a: never[]) => void } };
  HTMLCanvasElement?: { prototype: { getContext: (...a: never[]) => unknown } };
  AudioContext?: unknown;
}

export class Counters {
  private readonly recorder = new FrameRecorder(600_000);
  private readonly providers = new Map<string, () => unknown>();
  private asked = 0;
  loops = 0;
  intervals = 0;
  workers = 0;
  listeners = 0;
  audioContexts = 0;
  audioNodes = 0;
  readonly contexts: Record<string, number> = {};

  constructor(private readonly host: CounterHost) {}

  /** A game names something of its own to be read with every snapshot. */
  provide(name: string, read: () => unknown): void {
    this.providers.set(name, read);
  }

  /** Called by the wrapped requestAnimationFrame for every callback a page asks for. */
  askedForAFrame(): void {
    this.asked++;
  }

  /** Called once for each frame the browser presents. */
  frame(nowMs: number): void {
    this.recorder.tick(nowMs);
    if (this.asked > this.loops) this.loops = this.asked;
    this.asked = 0;
  }

  /** Forget the frames so far, to measure a stretch of its own. Counts of live things are kept: they are the page's. */
  startOver(): void {
    this.recorder.reset();
    this.loops = 0;
  }

  snapshot(): CounterSnapshot {
    const intervals = this.recorder.intervals();
    const memory = this.host.performance.memory;
    const provided: Record<string, unknown> = {};
    for (const [name, read] of this.providers) {
      try {
        provided[name] = read();
      } catch (e) {
        provided[name] = { error: e instanceof Error ? e.message : String(e) };
      }
    }
    return {
      atMs: Math.round(this.host.performance.now()),
      frames: { ...summarize(intervals), longestUnder30FpsMs: longestSlowRun(intervals) },
      loops: this.loops,
      heapMb: memory ? Math.round((memory.usedJSHeapSize / 1048576) * 10) / 10 : null,
      heapNote: memory ? "performance.memory.usedJSHeapSize: the JavaScript heap only, not the graphics memory" : "this browser does not report its heap to a page",
      contexts: { ...this.contexts },
      intervals: this.intervals,
      workers: this.workers,
      listeners: this.listeners,
      audio: { contexts: this.audioContexts, nodesMade: this.audioNodes },
      provided,
    };
  }
}

/**
 * Wraps the host's own functions so that what a page makes is counted. Call it before the game starts, once.
 * Every wrap passes its call straight through: a page behaves as it did, and a host that lacks a thing is left alone.
 */
export function installCounters(host: CounterHost): Counters {
  const c = new Counters(host);
  const h = host as unknown as Record<string, unknown>;

  const raf = host.requestAnimationFrame?.bind(host);
  if (raf) {
    h.requestAnimationFrame = (cb: (t: number) => void) => {
      c.askedForAFrame();
      return raf(cb);
    };
    const tick = (t: number) => {
      c.frame(t);
      raf(tick);
    };
    raf(tick);
  }

  const setI = host.setInterval?.bind(host) as ((...a: unknown[]) => unknown) | undefined;
  const clearI = host.clearInterval?.bind(host) as ((id?: unknown) => void) | undefined;
  if (setI && clearI) {
    const live = new Set<unknown>();
    h.setInterval = (...a: unknown[]) => {
      const id = setI(...a);
      live.add(id);
      c.intervals = live.size;
      return id;
    };
    h.clearInterval = (id?: unknown) => {
      live.delete(id);
      c.intervals = live.size;
      clearI(id);
    };
  }

  const W = host.Worker as (new (...a: unknown[]) => { terminate(): void }) | undefined;
  if (W) {
    h.Worker = class extends W {
      constructor(...a: unknown[]) {
        super(...a);
        c.workers++;
      }
      override terminate(): void {
        c.workers--;
        super.terminate();
      }
    };
  }

  const ET = host.EventTarget?.prototype as unknown as Record<string, (...a: unknown[]) => void> | undefined;
  if (ET) {
    const add = ET.addEventListener!;
    const remove = ET.removeEventListener!;
    // A page that redraws itself throws elements away with their listeners still on them. Those listeners are gone
    // with the element, and are taken off the count when the browser collects it: without this a page that only
    // redraws would look as if it leaked. The browser collects when it chooses, so the figure lags behind the page.
    const onTarget = new WeakMap<object, { n: number }>();
    const collected =
      typeof FinalizationRegistry === "function"
        ? new FinalizationRegistry<{ n: number }>((held) => {
            c.listeners -= held.n;
            held.n = 0;
          })
        : null;
    ET.addEventListener = function (this: unknown, ...a: unknown[]) {
      c.listeners++;
      if (collected && this !== null && typeof this === "object") {
        let held = onTarget.get(this);
        if (!held) {
          held = { n: 0 };
          onTarget.set(this, held);
          collected.register(this, held);
        }
        held.n++;
      }
      return add.apply(this, a);
    };
    ET.removeEventListener = function (this: unknown, ...a: unknown[]) {
      c.listeners--;
      const held = this !== null && typeof this === "object" ? onTarget.get(this) : undefined;
      if (held && held.n > 0) held.n--;
      return remove.apply(this, a);
    };
  }

  const canvas = host.HTMLCanvasElement?.prototype as unknown as Record<string, (...a: unknown[]) => unknown> | undefined;
  if (canvas) {
    const get = canvas.getContext!;
    const seen = new WeakMap<object, Set<string>>();
    canvas.getContext = function (this: object, ...a: unknown[]) {
      const made = get.apply(this, a);
      const kind = String(a[0]);
      if (made) {
        const kinds = seen.get(this) ?? new Set<string>();
        if (!kinds.has(kind)) {
          kinds.add(kind);
          seen.set(this, kinds);
          c.contexts[kind] = (c.contexts[kind] ?? 0) + 1;
        }
      }
      return made;
    };
  }

  const AC = host.AudioContext as (new (...a: unknown[]) => { close(): Promise<void> }) | undefined;
  if (AC) {
    const proto = AC.prototype as unknown as Record<string, unknown>;
    for (let p: Record<string, unknown> | null = proto; p && p !== Object.prototype; p = Object.getPrototypeOf(p) as Record<string, unknown> | null) {
      for (const name of Object.getOwnPropertyNames(p)) {
        if (!name.startsWith("create")) continue;
        const d = Object.getOwnPropertyDescriptor(p, name);
        if (!d || typeof d.value !== "function") continue;
        const make = d.value as (...a: unknown[]) => unknown;
        p[name] = function (this: unknown, ...a: unknown[]) {
          c.audioNodes++;
          return make.apply(this, a);
        };
      }
    }
    h.AudioContext = class extends AC {
      constructor(...a: unknown[]) {
        super(...a);
        c.audioContexts++;
      }
      override close(): Promise<void> {
        c.audioContexts--;
        return super.close();
      }
    };
  }
  return c;
}
