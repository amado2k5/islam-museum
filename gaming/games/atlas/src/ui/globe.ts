// The Atlas globe: an orthographic view of the Earth on a 2D canvas. Drag or use the arrow keys to turn it, scroll
// or press + and − to zoom, click or press Enter to drop the pin. It draws coastlines only. Modern political borders
// are left out on purpose: they would put the present day into a question about the past, and often give the answer away.
//
// The globe is never mirrored for right-to-left languages: east is always to the right of a north-up view.
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";
import land50 from "world-atlas/land-50m.json";
import { clampLat, wrapLon } from "../geo";

const coarse = feature(land110 as unknown as Topology, (land110 as unknown as Topology).objects.land as GeometryObject);
const fine = feature(land50 as unknown as Topology, (land50 as unknown as Topology).objects.land as GeometryObject);
const graticule = geoGraticule10();

export interface GlobeOptions {
  onPin(lat: number, lon: number): void;
  reducedMotion: boolean;
  /** Pixels to move the globe's centre sideways, so it sits in the space the panel leaves (negative is left). */
  offsetX(): number;
}

const COLORS = {
  space: "#070d18",
  oceanCentre: "#17406b",
  oceanEdge: "#0a1c33",
  land: "#e7dcc3",
  coast: "#a9976c",
  graticule: "rgba(255, 255, 255, 0.07)",
  rim: "rgba(120, 180, 255, 0.35)",
  guess: "#ffb21a",
  answer: "#2fd39d",
  arc: "#ffe0a3",
};

export class Globe {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly projection = geoOrthographic().clipAngle(90).precision(0.4);
  private centre: [number, number] = [36, 30]; // lon, lat the view looks at
  private zoom = 1.25;
  private pin: [number, number] | null = null; // lat, lon
  private answer: [number, number] | null = null;
  private arc = 0;
  private locked = false;
  private moving = false;
  private raf = 0;
  private anim = 0;
  private width = 0;
  private height = 0;
  private idleTimer = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: GlobeOptions,
  ) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("this browser gave no 2D canvas context");
    this.ctx = ctx;
    this.bind();
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.resize();
  }

  /** The pin as [lat, lon], or null. */
  getPin(): [number, number] | null {
    return this.pin;
  }

  setPin(lat: number, lon: number, announce = true): void {
    if (this.locked) return;
    this.pin = [clampLat(lat), wrapLon(lon)];
    if (announce) this.options.onPin(this.pin[0], this.pin[1]);
    this.request();
  }

  /** Clears pins and unlocks the globe for a new round. */
  reset(): void {
    this.pin = null;
    this.answer = null;
    this.arc = 0;
    this.locked = false;
    this.request();
  }

  /** Shows the answer, draws the arc from the guess to it, and frames both. */
  reveal(answerLat: number, answerLon: number): void {
    this.locked = true;
    this.answer = [answerLat, answerLon];
    const guess = this.pin ?? this.answer;
    const mid = geoInterpolate([guess[1], guess[0]], [answerLon, answerLat])(0.5);
    const spread = geoDistance([guess[1], guess[0]], [answerLon, answerLat]); // radians
    const zoom = Math.max(1, Math.min(9, 0.9 / Math.max(spread, 0.08)));
    this.flyTo(mid[1], mid[0], zoom, () => this.animate(900, (t) => (this.arc = t)));
  }

  flyTo(lat: number, lon: number, zoom: number, then?: () => void): void {
    const from: [number, number] = [...this.centre];
    const z0 = this.zoom;
    const path = geoInterpolate(from, [lon, lat]);
    this.animate(700, (t) => {
      const e = t * t * (3 - 2 * t);
      const p = path(e);
      this.centre = [p[0], p[1]];
      this.zoom = z0 + (zoom - z0) * e;
    }, then);
  }

  zoomBy(factor: number): void {
    this.zoom = Math.max(0.8, Math.min(40, this.zoom * factor));
    this.touch();
  }

  private animate(ms: number, frame: (t: number) => void, then?: () => void): void {
    cancelAnimationFrame(this.anim);
    if (this.options.reducedMotion) {
      frame(1);
      this.draw(true);
      then?.();
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      frame(t);
      this.moving = t < 1;
      this.draw(t >= 1);
      if (t < 1) this.anim = requestAnimationFrame(tick);
      else then?.();
    };
    this.anim = requestAnimationFrame(tick);
  }

  private bind(): void {
    const c = this.canvas;
    let down: { x: number; y: number; lon: number; lat: number; moved: boolean } | null = null;
    c.addEventListener("pointerdown", (e) => {
      c.setPointerCapture(e.pointerId);
      down = { x: e.clientX, y: e.clientY, lon: this.centre[0], lat: this.centre[1], moved: false };
    });
    c.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) down.moved = true;
      if (!down.moved) return;
      const degPerPx = 180 / (Math.PI * this.radius());
      this.centre = [wrapLon(down.lon - dx * degPerPx), clampLat(down.lat + dy * degPerPx)];
      this.touch();
    });
    const up = (e: PointerEvent) => {
      if (!down) return;
      const wasClick = !down.moved;
      down = null;
      if (wasClick) {
        const r = c.getBoundingClientRect();
        this.configure();
        const p = this.projection.invert?.([e.clientX - r.left, e.clientY - r.top]);
        // invert() answers for points off the disc too; accept only points on the visible hemisphere.
        if (p && geoDistance(p, this.centre) < Math.PI / 2 && Math.hypot(e.clientX - r.left - this.cx(), e.clientY - r.top - this.height / 2) <= this.radius()) this.setPin(p[1], p[0]);
      }
    };
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", () => (down = null));
    c.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.zoomBy(Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });
    c.addEventListener("keydown", (e) => {
      const stepDeg = 6 / this.zoom;
      const moves: Record<string, [number, number]> = { ArrowLeft: [-stepDeg, 0], ArrowRight: [stepDeg, 0], ArrowUp: [0, stepDeg], ArrowDown: [0, -stepDeg] };
      const m = moves[e.key];
      if (m) {
        this.centre = [wrapLon(this.centre[0] + m[0]), clampLat(this.centre[1] + m[1])];
        this.touch();
      } else if (e.key === "+" || e.key === "=") this.zoomBy(1.25);
      else if (e.key === "-" || e.key === "_") this.zoomBy(0.8);
      else if (e.key === "Enter" || e.key === " ") this.setPin(this.centre[1], this.centre[0]);
      else return;
      e.preventDefault();
    });
  }

  /** Marks the view as changing: draw now with the light coastline, then once more in full when it settles. */
  private touch(): void {
    this.moving = true;
    this.request();
    clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => {
      this.moving = false;
      this.request();
    }, 140);
  }

  private request(): void {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.draw(!this.moving));
  }

  private resize(): void {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, r.width);
    this.height = Math.max(1, r.height);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw(true);
  }

  private radius(): number {
    return Math.min(this.width - 2 * Math.abs(this.options.offsetX()), this.height) * 0.46 * this.zoom;
  }

  private cx(): number {
    return this.width / 2 + this.options.offsetX();
  }

  private configure(): void {
    this.projection.translate([this.cx(), this.height / 2]).scale(this.radius()).rotate([-this.centre[0], -this.centre[1]]);
  }

  private draw(full: boolean): void {
    const { ctx, width: w, height: h } = this;
    this.configure();
    const R = this.radius();
    const path = geoPath(this.projection, ctx);
    ctx.fillStyle = COLORS.space;
    ctx.fillRect(0, 0, w, h);
    // Ocean, lit from the upper left.
    const ocean = ctx.createRadialGradient(this.cx() - R * 0.35, h / 2 - R * 0.4, R * 0.1, this.cx(), h / 2, R);
    ocean.addColorStop(0, COLORS.oceanCentre);
    ocean.addColorStop(1, COLORS.oceanEdge);
    ctx.beginPath();
    path({ type: "Sphere" });
    ctx.fillStyle = ocean;
    ctx.fill();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = COLORS.graticule;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    path(full && this.zoom > 1.6 ? fine : coarse);
    ctx.fillStyle = COLORS.land;
    ctx.fill();
    ctx.strokeStyle = COLORS.coast;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.beginPath();
    path({ type: "Sphere" });
    ctx.strokeStyle = COLORS.rim;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (this.pin && this.answer && this.arc > 0) {
      const along = geoInterpolate([this.pin[1], this.pin[0]], [this.answer[1], this.answer[0]]);
      const pts: Array<[number, number]> = [];
      for (let i = 0; i <= 48; i++) pts.push(along((i / 48) * this.arc));
      ctx.beginPath();
      path({ type: "LineString", coordinates: pts });
      ctx.strokeStyle = COLORS.arc;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([7, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (this.answer && this.arc >= 1) this.marker(this.answer, COLORS.answer, true);
    if (this.pin) this.marker(this.pin, COLORS.guess, false);
  }

  /** A pin: a ring and a dot. The answer is a square, the guess a circle, so they differ by shape as well as colour. */
  private marker(at: [number, number], color: string, square: boolean): void {
    if (geoDistance([at[1], at[0]], this.centre) > Math.PI / 2) return;
    const p = this.projection([at[1], at[0]]);
    if (!p) return;
    const { ctx } = this;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0b1626";
    ctx.fillStyle = color;
    ctx.beginPath();
    if (square) ctx.rect(p[0] - 7, p[1] - 7, 14, 14);
    else ctx.arc(p[0], p[1], 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p[0], p[1], 15, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
