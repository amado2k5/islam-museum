// Entry point of the graphics lab. It builds the reference district once, hands it to the chosen engine, and either
// flies the fixed camera loop, holds a named still view, or runs a timed benchmark and publishes the numbers.
//
// URL parameters (all optional):
//   engine=three|babylon   preset=parity|high|ultra|cinematic   tod=golden|noon|dusk|night   seed=<int>
//   view=loop|establishing|riverfront|market|library|bridge|noria|garden   w=<px>&h=<px> (backing size)
//   bench=<seconds>  warmup=<seconds>  hud=0  freeze=<seconds> (render the scene at a fixed time)
import { FrameRecorder, summarize } from "@im/kernel/framestats";
import { probeWebGPU, type GpuCapability } from "@im/kernel/capability";
import { generateDistrict, updateDynamics } from "@im/worldkit/district/generate";
import { ATMOSPHERES, type TimeOfDay } from "@im/worldkit/atmosphere";
import type { DistrictRenderer, QualityPreset, RendererOptions } from "./api";
import { cameraKeys, cameraOnLoop } from "./camera-path";
import { generateTextures } from "@im/worldkit/textures-async";

declare global {
  interface Window {
    __LAB__?: { ready: boolean; error?: string; capability?: GpuCapability; setup?: Record<string, unknown>; bench?: Record<string, unknown>; renderer?: unknown };
  }
}

const q = new URLSearchParams(location.search);
const engine = q.get("engine") === "babylon" ? "babylon" : "three";
const preset = (["parity", "high", "ultra", "cinematic"].includes(q.get("preset") ?? "") ? q.get("preset") : "ultra") as QualityPreset;
const tod = (q.get("tod") && q.get("tod")! in ATMOSPHERES ? q.get("tod") : "golden") as TimeOfDay;
const seed = Number(q.get("seed") ?? 7) | 0;
const view = q.get("view") ?? "loop";
const benchSeconds = Number(q.get("bench") ?? 0);
const warmupSeconds = Number(q.get("warmup") ?? 4);
const loopSeconds = Number(q.get("loop") ?? 70);
const freeze = q.has("freeze") ? Number(q.get("freeze")) : null;
if (q.get("hud") === "0") document.body.classList.add("clean");

const statusEl = document.getElementById("status")!;
const hudEl = document.getElementById("hud")!;
const benchEl = document.getElementById("bench-result")!;
const canvas = document.getElementById("view") as HTMLCanvasElement;
const lab: NonNullable<Window["__LAB__"]> = (window.__LAB__ = { ready: false });
const say = (text: string) => (statusEl.textContent = text);

async function main(): Promise<void> {
  say("Checking WebGPU…");
  const capability = await probeWebGPU();
  lab.capability = capability;
  if (!capability.supported) {
    const why: Record<string, string> = {
      "insecure-context": "This page is not a secure context. Open it over https or on localhost.",
      "no-navigator-gpu": "This browser does not expose WebGPU (navigator.gpu is missing).",
      "no-adapter": "The browser found no GPU adapter it can use for WebGPU.",
      "fallback-adapter": "Only a software (fallback) adapter is available; the lab needs a hardware GPU.",
      "device-request-failed": "The GPU adapter refused to create a device.",
      "pipeline-test-failed": "A one-triangle WebGPU test pipeline failed on this device.",
    };
    throw new Error(`WebGPU is not available: ${why[capability.failure ?? ""] ?? capability.failure}${capability.failureDetail ? `\n${capability.failureDetail}` : ""}`);
  }

  const width = Number(q.get("w") ?? Math.round(window.innerWidth * devicePixelRatio));
  const height = Number(q.get("h") ?? Math.round(window.innerHeight * devicePixelRatio));
  canvas.width = width;
  canvas.height = height;
  canvas.style.aspectRatio = `${width} / ${height}`;
  canvas.style.width = `min(100vw, ${(100 * width) / height}vh)`;

  say("Building the district…");
  const t0 = performance.now();
  const district = generateDistrict(seed);
  const generateMs = performance.now() - t0;
  const tex = await generateTextures(seed, 512);

  say(`Starting ${engine}…`);
  const options: RendererOptions = {
    preset,
    width,
    height,
    shadowMapSize: preset === "high" || preset === "parity" ? 4096 : 8192,
    msaa: 4,
  };
  const atmosphere = ATMOSPHERES[tod];
  const t1 = performance.now();
  const renderer: DistrictRenderer = engine === "babylon" ? new (await import("./babylon-renderer")).BabylonDistrictRenderer() : new (await import("./three-renderer")).ThreeDistrictRenderer();
  await renderer.init(canvas, district, tex.textures, atmosphere, options);
  const initMs = performance.now() - t1;
  lab.renderer = renderer; // for inspection from the console; nothing reads it

  const keys = cameraKeys(district.landmarks);
  const setup = {
    engine,
    preset,
    timeOfDay: tod,
    seed,
    view,
    backing: [width, height],
    devicePixelRatio,
    scene: district.stats,
    generateMs: Math.round(generateMs),
    texturesMs: Math.round(tex.ms),
    textureWorkers: tex.workers,
    textureTimeline: tex.timeline,
    engineInitMs: Math.round(initMs),
    adapter: capability.adapter,
    userAgent: navigator.userAgent,
  };
  lab.setup = setup;
  statusEl.style.display = "none";

  const frames = new FrameRecorder(60000);
  const cpu: number[] = [];
  const started = performance.now();
  let benchStart = -1;
  let benchDone = benchSeconds <= 0;
  let firstFrameMs = -1;
  let hudAt = 0;
  let recent = new FrameRecorder(240);

  const frame = (now: number) => {
    const elapsed = (now - started) / 1000;
    const simTime = freeze ?? elapsed;
    const { wheelAngle } = updateDynamics(district, simTime);
    let u: number;
    if (benchSeconds > 0) u = benchStart < 0 ? 0 : (now - benchStart) / 1000 / benchSeconds;
    else u = elapsed / loopSeconds;
    const cam = view === "loop" ? cameraOnLoop(keys, u) : (keys[view] ?? keys.establishing!);
    renderer.setCamera(cam.position, cam.target, cam.fov);
    renderer.render(simTime, wheelAngle);
    if (firstFrameMs < 0) {
      firstFrameMs = performance.now() - started;
      lab.ready = true;
    }
    recent.tick(now);
    if (!benchDone) {
      if (benchStart < 0 && elapsed >= warmupSeconds) {
        benchStart = now;
        frames.reset();
      }
      if (benchStart >= 0) {
        frames.tick(now);
        cpu.push(renderer.info().cpuRenderMs);
        if ((now - benchStart) / 1000 >= benchSeconds) {
          benchDone = true;
          const info = renderer.info();
          const result = { ...setup, benchSeconds, warmupSeconds, firstFrameMs: Math.round(firstFrameMs), frame: frames.summary(), cpuRender: summarize(cpu), drawCalls: info.drawCalls, trianglesDrawn: info.triangles, engineVersion: info.engineVersion, extra: info.extra, memory: (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? null, finishedAt: new Date().toISOString() };
          lab.bench = result;
          benchEl.style.display = "block";
          benchEl.textContent = JSON.stringify(result, null, 1);
        }
      }
    }
    if (now - hudAt > 400) {
      hudAt = now;
      const s = recent.summary();
      const info = renderer.info();
      hudEl.textContent = `${engine} ${info.engineVersion}  ${preset}  ${tod}  ${width}×${height}\n${s.avgFps.toFixed(1)} fps   p95 ${s.p95Ms.toFixed(1)} ms   cpu ${info.cpuRenderMs.toFixed(2)} ms\n${info.drawCalls} draws   ${(info.triangles / 1e6).toFixed(2)} M tris   ${district.stats.buildings} buildings\n${capability.adapter?.vendor} ${capability.adapter?.architecture}${benchSeconds > 0 ? `\nbench ${benchDone ? "done" : benchStart < 0 ? "warming up" : "recording"}` : ""}`;
      recent = new FrameRecorder(240);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

main().catch((e: unknown) => {
  const message = e instanceof Error ? e.message : String(e);
  lab.error = message;
  statusEl.style.display = "grid";
  say(message);
  console.error(e);
});
