// The 3D valley on the page: a canvas, the renderer, the camera's controls and the frame loop. It knows nothing of
// the rules: the page hands it a "look" and is told when a field is chosen. Dragging moves over the land, dragging
// with the right button or with Shift turns the view, the wheel comes closer; the arrow keys, Q and E, and plus and
// minus do the same from the keyboard. Everything the 3D view can do, the plan and the panels can do without it.
import { FrameRecorder, type FrameSummary } from "@im/kernel/framestats";
import { generateTextures } from "@im/worldkit/textures-async";
import { OVERVIEW, START, approach, clampPose, pan, turn, zoom, type Pose } from "../view/camera";
import { PRESETS, ValleyRenderer, type Quality, type ValleyLook } from "../view/three-valley";
import { FIELDS, heightAt } from "../view/valley";

export interface StageOptions {
  seed: number;
  quality: Quality;
  reducedMotion: boolean;
  /** Whether to fetch the authored models (the page's `models=off` turns it off). */
  models: boolean;
  onField: (id: string) => void;
  /** While the player is choosing where to build: the point of the land being considered, and the point chosen. */
  onSite?: (x: number, z: number) => void;
  /** A click on the land: true if something standing there took it, so that it is not a click on a field. */
  onLand?: (x: number, z: number) => boolean;
  /** Any click on the valley, before anything else is made of it: true if the page has taken it. */
  onTap?: () => boolean;
  onBuild?: (x: number, z: number) => void;
}

export class Stage {
  readonly canvas: HTMLCanvasElement;
  private renderer!: ValleyRenderer;
  private pose: Pose = START;
  private goal: Pose = START;
  private readonly recorder = new FrameRecorder();
  private running = false;
  private visible = true;
  private lastT = 0;
  private slow = 0;
  private eased = 0;
  private readonly ground: (x: number, z: number) => number;
  /** The player is choosing where to build: the pointer names the ground, or the middle of the view where no pointer is. */
  private placing = false;

  private constructor(private readonly host: HTMLElement, private readonly options: StageOptions) {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "scene";
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute("role", "application");
    this.ground = (x, z) => heightAt(x, z, 7);
  }

  static async create(host: HTMLElement, options: StageOptions): Promise<Stage> {
    const s = new Stage(host, options);
    host.prepend(s.canvas);
    const { textures } = await generateTextures(7, PRESETS[options.quality].textures);
    // The valley is one authored place: its shape does not change with the game's seed, only its weather does.
    s.renderer = await ValleyRenderer.create(s.canvas, textures, { quality: options.quality, seed: 7, reducedMotion: options.reducedMotion, maxPixelRatio: PRESETS[options.quality].pixelRatio, models: options.models });
    s.pose = s.goal = clampPose(START, s.ground);
    s.renderer.setCamera(s.pose);
    s.listen();
    new ResizeObserver(() => s.renderer.resize()).observe(s.canvas);
    return s;
  }

  setLook(look: ValleyLook): void {
    this.renderer.setLook(look);
  }
  setVisible(on: boolean): void {
    this.visible = on;
    this.canvas.hidden = !on;
    if (on) this.renderer.resize();
  }
  overview(): void {
    this.goal = clampPose(OVERVIEW, this.ground);
  }
  home(): void {
    this.goal = clampPose(START, this.ground);
  }
  setPose(p: Pose, at_once = false): void {
    this.goal = clampPose(p, this.ground);
    if (at_once) this.pose = this.goal;
  }
  getPose(): Pose {
    return this.pose;
  }
  private move(next: Pose): void {
    this.goal = clampPose(next, this.ground);
  }

  private listen(): void {
    const c = this.canvas;
    let drag: { x: number; y: number; turning: boolean; moved: number } | null = null;
    c.addEventListener("contextmenu", (e) => e.preventDefault());
    c.addEventListener("pointerdown", (e) => {
      c.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, turning: e.button === 2 || e.shiftKey, moved: 0 };
    });
    c.addEventListener("pointermove", (e) => {
      if (!drag && this.placing) {
        const p = this.renderer.landAt(e.clientX, e.clientY);
        if (p) this.options.onSite?.(p[0], p[1]);
      }
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.turning) this.move(turn(this.goal, -dx * 0.005, dy * 0.004));
      else {
        const k = this.goal.distance / 720;
        this.move(pan(this.goal, -dx * k, dy * k * 1.4));
      }
    });
    c.addEventListener("pointerup", (e) => {
      const wasClick = drag !== null && drag.moved < 5 && e.button === 0;
      drag = null;
      if (wasClick && this.options.onTap?.()) return;
      if (wasClick && this.placing) {
        const p = this.renderer.landAt(e.clientX, e.clientY);
        if (p) this.options.onBuild?.(p[0], p[1]);
      } else if (wasClick) {
        const p = this.renderer.landAt(e.clientX, e.clientY);
        if (p && this.options.onLand?.(p[0], p[1])) return;
        const field = this.renderer.fieldAt(e.clientX, e.clientY);
        if (field) this.options.onField(field);
      }
    });
    c.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.move(zoom(this.goal, Math.exp(e.deltaY * 0.0012)));
    }, { passive: false });
    c.addEventListener("keydown", (e) => {
      const step = this.goal.distance * 0.08;
      const act: Record<string, () => Pose> = {
        ArrowLeft: () => pan(this.goal, -step, 0),
        ArrowRight: () => pan(this.goal, step, 0),
        ArrowUp: () => pan(this.goal, 0, step),
        ArrowDown: () => pan(this.goal, 0, -step),
        q: () => turn(this.goal, -0.2, 0),
        e: () => turn(this.goal, 0.2, 0),
        "+": () => zoom(this.goal, 0.85),
        "=": () => zoom(this.goal, 0.85),
        "-": () => zoom(this.goal, 1.18),
        r: () => turn(this.goal, 0, 0.08),
        f: () => turn(this.goal, 0, -0.08),
      };
      const fn = act[e.key] ?? act[e.key.toLowerCase()];
      if (e.key === "o" || e.key === "O") this.overview();
      else if (e.key === "Home") this.home();
      else if (fn) {
        this.move(fn());
        // By keyboard the ground considered is the middle of the view, so moving the view moves it.
        if (this.placing) this.options.onSite?.(this.goal.tx, this.goal.tz);
      } else return;
      e.preventDefault();
      e.stopPropagation();
    });
  }

  /** Starts the frame loop. */
  run(): void {
    if (this.running) return;
    this.running = true;
    const frame = (now: number) => {
      if (!this.running) return;
      requestAnimationFrame(frame);
      if (!this.visible || document.hidden) {
        this.lastT = 0;
        return;
      }
      const dt = this.lastT ? Math.min(0.1, (now - this.lastT) / 1000) : 0.016;
      this.lastT = now;
      // If frames keep coming slower than forty a second, draw fewer pixels, a step at a time. It never goes back up,
      // so the picture does not waver between two sharpnesses.
      this.slow = dt > 0.025 ? this.slow + 1 : Math.max(0, this.slow - 2);
      if (this.slow > 80) {
        this.slow = 0;
        if (this.renderer.easePixels() !== null) this.eased += 1;
      }
      this.pose = approach(this.pose, this.goal, 1 - Math.exp(-dt * 9));
      this.renderer.setCamera(this.pose);
      this.renderer.render(now / 1000);
      this.recorder.tick(now);
    };
    requestAnimationFrame(frame);
  }
  takeFrameStats(): FrameSummary {
    const s = this.recorder.summary();
    this.recorder.reset();
    return s;
  }
  tune(o: Parameters<ValleyRenderer["tune"]>[0]): void {
    this.renderer.tune(o);
  }
  info(): ReturnType<ValleyRenderer["info"]> & { eased: number } {
    return { ...this.renderer.info(), eased: this.eased };
  }
  screenOf(x: number, y: number, z: number): [number, number] | null {
    return this.renderer.screenOf(x, y, z);
  }
  /** A camera key pressed elsewhere on the page, passed on as if the valley had the keyboard. True if it was one. */
  cameraKey(key: string): boolean {
    const e = new KeyboardEvent("keydown", { key, bubbles: false, cancelable: true });
    this.canvas.dispatchEvent(e);
    return e.defaultPrevented;
  }
  /** Tells the valley that the player is choosing where to build (or has stopped); the first ground offered is the middle of the view. */
  setPlacing(on: boolean): void {
    this.placing = on;
    this.canvas.classList.toggle("placing", on);
    if (on) this.options.onSite?.(this.goal.tx, this.goal.tz);
  }
  /** For pictures: a lens, an hour's light, and the view as a PNG. None of them touches the game. */
  setLens(fov: number | null): void {
    this.renderer.setLens(fov);
  }
  previewLight(hour: "morning" | "midday" | "evening" | null): void {
    this.renderer.previewLight(hour);
  }
  capture(): Promise<Blob | null> {
    return this.renderer.capture();
  }
  /** Shows, or takes away, the ring on the ground the player is considering. */
  setGhost(g: { x: number; z: number; r: number; ok: boolean; mark?: boolean } | null): void {
    this.renderer.setGhost(g);
  }
  /** Which field lies under a point of the page, if any. */
  fieldAt(clientX: number, clientY: number): string | null {
    return this.renderer.fieldAt(clientX, clientY);
  }
  /** Where the middle of a field is on the page, or null when it is behind the view. */
  fieldOnScreen(id: string): [number, number] | null {
    const shape = FIELDS[id];
    if (!shape) return null;
    const x = shape.reduce((a, p) => a + p[0], 0) / shape.length;
    const z = shape.reduce((a, p) => a + p[1], 0) / shape.length;
    return this.renderer.screenOf(x, heightAt(x, z, 7) + 3, z);
  }
  dispose(): void {
    this.running = false;
    this.renderer.dispose();
    this.canvas.remove();
    void this.host;
  }
}
