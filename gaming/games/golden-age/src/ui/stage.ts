// The 3D stage: the canvas, the renderer, the camera and the pointer. It turns a state into a picture and pointer
// movement into "this ground point", and knows nothing about tools, money or strings.
import { FrameRecorder, type FrameSummary } from "@im/kernel/framestats";
import { generateTextures } from "@im/worldkit/textures-async";
import { PLOTS, seasonOfYear, xyOf, type State } from "../rules";
import { buildEnvironment, buildPlot, lookKey, type PlotLook } from "../view/board";
import { OVERVIEW_POSE, START_POSE, approach, clampPose, closeTo, pan, turn, zoom, type CameraPose } from "../view/camera";
import { dirTo, plotCentre, type Dir } from "../view/layout";
import { looksOf } from "../view/looks";
import { BoardRenderer, type Highlight, type Quality } from "../view/three-board";

export interface StageOptions {
  quality: Quality;
  seed: number;
  reducedMotion: boolean;
  /** The pointer moved over the ground (or left it). */
  onPoint: (ground: [number, number] | null, clientX: number, clientY: number) => void;
  /** A click or tap that was not a drag. */
  onClick: (ground: [number, number] | null) => void;
  onStatus?: (step: "textures" | "renderer" | "district") => void;
}

/** The edge of an arm's water sheet nearest the crossing, and the one at the plot's edge, by direction. */
const INNER = ["z1", "x0", "z0", "x1"] as const;
const OUTER = ["z0", "x1", "z1", "x0"] as const;
type Fill = { id: string; from: "x0" | "x1" | "z0" | "z1"; delay: number };
/** The canal mask recorded in a plot's look key ("" before the first sync). */
const maskOf = (key: string): number => (key === "" ? 0 : Number(key.split("|")[1]));

export class Stage {
  private renderer!: BoardRenderer;
  private keys: string[] = new Array<string>(PLOTS).fill("");
  private looks: PlotLook[] = [];
  /** Plots whose look has changed and that are waiting to be rebuilt, a few each frame, so a season's end never stalls the picture. */
  private queue: number[] = [];
  private pose: CameraPose = START_POSE;
  private goal: CameraPose = START_POSE;
  private readonly held = new Set<string>();
  private readonly recorder = new FrameRecorder(30000);
  private running = false;
  private last = 0;
  private start = 0;
  private frames = 0;
  private options!: StageOptions;
  private canvas!: HTMLCanvasElement;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private drag: { id: number; x: number; y: number; moved: boolean; mode: "pan" | "turn"; grab: [number, number] | null } | null = null;
  private pinch: { distance: number; angle: number } | null = null;

  static async create(canvas: HTMLCanvasElement, options: StageOptions): Promise<Stage> {
    const s = new Stage();
    s.canvas = canvas;
    s.options = options;
    options.onStatus?.("textures");
    const { textures } = await generateTextures(options.seed, 512);
    options.onStatus?.("renderer");
    s.renderer = await BoardRenderer.create(canvas, textures, { quality: options.quality, seed: options.seed, reducedMotion: options.reducedMotion, maxPixelRatio: options.quality === "high" ? 2 : 1 });
    options.onStatus?.("district");
    s.renderer.setEnvironment(buildEnvironment(options.seed));
    s.renderer.setCamera(s.pose);
    s.bind();
    return s;
  }

  /** Brings the picture up to date with a state. `dug` is a link just dug, source plot first: its water is seen to arrive. */
  sync(state: State, dug: [number, number] | null = null): void {
    const { looks, walkers } = looksOf(state);
    const before = this.keys;
    const fills = new Map<number, Fill[]>();
    if (dug) {
      const [a, b] = dug;
      const d = dirTo(a, b);
      if (d !== null) {
        const fa: Fill[] = [];
        let t = 0;
        // A first link from a bank plot also opens its intake: quay, then the arm from the river, then the crossing.
        if (maskOf(before[a]!) === 0 && xyOf(a)[1] === 0) {
          fa.push({ id: "q", from: "z1", delay: 0 }, { id: "2", from: "z1", delay: 0.6 }, { id: "c", from: "z1", delay: 1.2 });
          t = 1.5;
        }
        fa.push({ id: String(d), from: INNER[d], delay: t });
        fills.set(a, fa);
        const back = ((d + 2) % 4) as Dir;
        const fb: Fill[] = [{ id: String(back), from: OUTER[back], delay: t + 0.6 }];
        if (maskOf(before[b]!) === 0) fb.push({ id: "c", from: OUTER[back], delay: t + 1.2 });
        fills.set(b, fb);
      }
    }
    const next: string[] = [];
    const first = before.every((k) => k === "");
    for (let p = 0; p < PLOTS; p++) {
      const key = lookKey(looks[p]!);
      next.push(key);
      if (key === before[p]) continue;
      // The first picture, and the plots of a link just dug, are built at once; everything else takes its turn.
      if (first || fills.has(p)) {
        this.queue = this.queue.filter((q) => q !== p);
        this.renderer.setPlot(p, buildPlot(this.options.seed, p, looks[p]!), fills.get(p) ?? []);
      } else if (!this.queue.includes(p)) this.queue.push(p);
    }
    this.keys = next;
    this.looks = looks;
    this.renderer.setWalkers(walkers);
    this.renderer.commit();
    this.renderer.setSeason(seasonOfYear(state.season));
  }

  /** Rebuilds up to `limit` waiting plots. Returns how many are still waiting. */
  private drain(limit: number): number {
    if (this.queue.length === 0) return 0;
    for (let i = 0; i < limit && this.queue.length > 0; i++) {
      const p = this.queue.shift()!;
      this.renderer.setPlot(p, buildPlot(this.options.seed, p, this.looks[p]!));
    }
    this.renderer.commit();
    return this.queue.length;
  }
  /** Finishes every waiting rebuild now (captures and tests). */
  flush(): void {
    this.drain(PLOTS);
  }

  setHighlight(h: Highlight): void {
    this.renderer.setHighlight(h);
  }

  groundAt(clientX: number, clientY: number): [number, number] | null {
    return this.renderer.groundAt(clientX, clientY);
  }
  screenOf(x: number, y: number, z: number): [number, number] | null {
    return this.renderer.screenOf(x, y, z);
  }
  /** Where a plot's crossing is in the window, in CSS pixels. */
  screenOfPlot(plot: number): [number, number] | null {
    const [x, z] = plotCentre(plot);
    return this.renderer.screenOf(x, 0, z);
  }

  /** Brings a plot into view if it is far from the middle of the screen. */
  lookAt(plot: number): void {
    const [x, z] = plotCentre(plot);
    const at = this.renderer.screenOf(x, 0, z);
    const r = this.canvas.getBoundingClientRect();
    const inside = at && at[0] > r.left + r.width * 0.2 && at[0] < r.right - r.width * 0.2 && at[1] > r.top + r.height * 0.22 && at[1] < r.bottom - r.height * 0.25;
    if (!inside) this.goal = clampPose({ ...this.goal, tx: x, tz: z });
  }
  overview(): void {
    this.goal = closeTo(this.goal, OVERVIEW_POSE) ? START_POSE : OVERVIEW_POSE;
  }
  zoomBy(factor: number): void {
    this.goal = zoom(this.goal, factor);
  }
  turnBy(dYaw: number): void {
    this.goal = turn(this.goal, dYaw, 0);
  }
  /** Sets the camera at once (tests and captures). */
  setPose(p: CameraPose): void {
    this.goal = clampPose(p);
    this.pose = this.goal;
    this.renderer.setCamera(this.pose);
  }
  getPose(): CameraPose {
    return this.pose;
  }

  private bind(): void {
    const c = this.canvas;
    c.addEventListener("contextmenu", (e) => e.preventDefault());
    c.addEventListener("pointerdown", (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 1) {
        const mode = e.button === 2 || e.button === 1 || e.ctrlKey || e.altKey ? "turn" : "pan";
        this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, mode, grab: this.renderer.groundAt(e.clientX, e.clientY) };
      } else {
        this.drag = null;
        this.pinch = this.pinchOf();
      }
    });
    c.addEventListener("pointermove", (e) => {
      const p = this.pointers.get(e.pointerId);
      if (p) {
        p.x = e.clientX;
        p.y = e.clientY;
      }
      if (this.pointers.size >= 2 && this.pinch) {
        const now = this.pinchOf();
        if (now) {
          this.goal = turn(zoom(this.goal, this.pinch.distance / Math.max(1, now.distance)), now.angle - this.pinch.angle, 0);
          this.pose = this.goal;
          this.pinch = now;
        }
        return;
      }
      const d = this.drag;
      if (d && d.id === e.pointerId) {
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (!d.moved && Math.hypot(dx, dy) < 6) return;
        if (!d.moved) {
          d.moved = true;
          c.classList.add("dragging");
        }
        if (d.mode === "turn") {
          this.goal = turn(this.goal, -(e.movementX || 0) * 0.006, (e.movementY || 0) * 0.005);
        } else if (d.grab) {
          // Hold on to the ground: the point first grabbed stays under the pointer.
          const under = this.renderer.groundAt(e.clientX, e.clientY);
          if (under) this.goal = clampPose({ ...this.pose, tx: this.pose.tx + d.grab[0] - under[0], tz: this.pose.tz + d.grab[1] - under[1] });
        }
        this.pose = this.goal;
        this.renderer.setCamera(this.pose);
        return;
      }
      if (this.pointers.size === 0) this.options.onPoint(this.renderer.groundAt(e.clientX, e.clientY), e.clientX, e.clientY);
    });
    const end = (e: PointerEvent) => {
      const d = this.drag;
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (d && d.id === e.pointerId) {
        this.drag = null;
        c.classList.remove("dragging");
        if (!d.moved && e.type === "pointerup" && d.mode === "pan") this.options.onClick(this.renderer.groundAt(e.clientX, e.clientY));
      }
    };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
    c.addEventListener("pointerleave", (e) => {
      if (this.pointers.size === 0) this.options.onPoint(null, e.clientX, e.clientY);
    });
    c.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        // Zoom toward what is under the pointer.
        const before = this.renderer.groundAt(e.clientX, e.clientY);
        const next = zoom(this.goal, Math.exp(Math.max(-1, Math.min(1, e.deltaY / 240)) * 0.5));
        if (before) {
          this.renderer.setCamera(next);
          const after = this.renderer.groundAt(e.clientX, e.clientY);
          this.renderer.setCamera(this.pose);
          this.goal = after ? clampPose({ ...next, tx: next.tx + before[0] - after[0], tz: next.tz + before[1] - after[1] }) : next;
        } else this.goal = next;
      },
      { passive: false },
    );
    c.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if ("wasdqerf".includes(k) && k.length === 1) this.held.add(k);
    });
    c.addEventListener("keyup", (e) => this.held.delete(e.key.toLowerCase()));
    c.addEventListener("blur", () => this.held.clear());
    new ResizeObserver(() => this.renderer.resize()).observe(c);
  }

  private pinchOf(): { distance: number; angle: number } | null {
    const [a, b] = [...this.pointers.values()];
    if (!a || !b) return null;
    return { distance: Math.hypot(b.x - a.x, b.y - a.y), angle: Math.atan2(b.y - a.y, b.x - a.x) };
  }

  /** Starts drawing. `onFrame` runs after each frame is submitted. */
  run(onFrame?: (seconds: number) => void): void {
    if (this.running) return;
    this.running = true;
    this.start = performance.now();
    this.last = this.start;
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      // Held keys move the camera at a speed that suits the height it is at.
      if (this.held.size) {
        const speed = this.goal.distance * 0.9 * dt;
        const x = (this.held.has("d") ? 1 : 0) - (this.held.has("a") ? 1 : 0);
        const y = (this.held.has("w") ? 1 : 0) - (this.held.has("s") ? 1 : 0);
        if (x || y) this.goal = pan(this.goal, x * speed, y * speed);
        const q = (this.held.has("e") ? 1 : 0) - (this.held.has("q") ? 1 : 0);
        if (q) this.goal = turn(this.goal, q * 1.2 * dt, 0);
        const z = (this.held.has("f") ? 1 : 0) - (this.held.has("r") ? 1 : 0);
        if (z) this.goal = zoom(this.goal, Math.exp(z * 1.2 * dt));
      }
      if (!closeTo(this.pose, this.goal)) {
        this.pose = this.options.reducedMotion ? this.goal : approach(this.pose, this.goal, 1 - Math.exp(-dt * 9));
        this.renderer.setCamera(this.pose);
      }
      this.drain(2);
      const t = (now - this.start) / 1000;
      this.renderer.render(t);
      this.recorder.tick(now);
      this.frames++;
      onFrame?.(t);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** Frame intervals since the last call, then starts a new measurement. */
  takeFrameStats(): FrameSummary {
    const s = this.recorder.summary();
    this.recorder.reset();
    return s;
  }
  info(): ReturnType<BoardRenderer["info"]> & { frames: number } {
    return { ...this.renderer.info(), frames: this.frames };
  }
}

