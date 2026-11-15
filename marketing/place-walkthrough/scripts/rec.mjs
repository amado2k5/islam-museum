// Frame-exact recorder for the live site.
//
// The demo footage in the walkthrough is the real islam.museum, driven by a real (headless) Chromium: real clicks,
// real typing, the site's own scripts and data. What is not real is the clock. A screen recording made in real time
// drops frames whenever the page is busy, so instead the page's clock is replaced (Playwright's clock: timers,
// requestAnimationFrame, performance.now, Date) and stepped one video frame at a time; CSS transitions and
// animations are paused and seeked to the same clock; then a screenshot is taken. Every frame is therefore exactly
// 1/30 s after the last, however long the browser took to draw it. Loading (network) happens between frames and is
// not shown: the film is about how the map behaves, not about a connection's speed.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export const FPS = 30;
const DT = 1000 / FPS;

// Runs in the page before every frame: bring CSS transitions and animations onto the stepped clock.
function seekAnimations(now) {
  const seen = (window.__recSeen ||= new WeakMap());
  for (const a of document.getAnimations()) {
    let start = seen.get(a);
    if (start === undefined) { start = now; seen.set(a, start); try { a.pause(); } catch (e) {} }
    const t = Math.max(0, now - start);
    let end = Infinity;
    try { end = a.effect.getComputedTiming().endTime; } catch (e) {}
    try { if (t >= end) a.finish(); else a.currentTime = t; } catch (e) {}
  }
}

// Injected into every document: the pointer the viewer follows. An arrow on desktop, a fingertip disc on the phone
// layout. It never receives events, so the page behaves exactly as it does without it.
function pointerInit([kind, seekSrc]) {
  window.__recSeek = (0, eval)("(" + seekSrc + ")");
  const make = () => {
    if (document.getElementById("__rec_pointer")) return;
    const el = document.createElement("div");
    el.id = "__rec_pointer";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;will-change:transform;transform:translate(-200px,-200px)";
    if (kind === "touch") {
      el.innerHTML = '<div id="__rec_tip" style="width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.28);border:2px solid rgba(255,255,255,.85);box-shadow:0 2px 10px rgba(0,0,0,.45)"></div>';
    } else {
      el.innerHTML = '<svg id="__rec_tip" width="30" height="30" viewBox="0 0 24 24" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55))"><path d="M4.5 2.5v17l4.6-4.3 2.9 6.6 2.7-1.2-2.9-6.5h6.2z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    }
    const ring = document.createElement("div");
    ring.id = "__rec_ring";
    ring.style.cssText = "position:absolute;left:0;top:0;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:3px solid #f2d27a;opacity:0;transform:scale(.3)";
    el.appendChild(ring);
    document.documentElement.appendChild(el);
  };
  if (document.documentElement) make();
  document.addEventListener("DOMContentLoaded", make);
}

const ease = {
  inOut: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  out: (u) => 1 - Math.pow(1 - u, 3),
  linear: (u) => u,
};

export class Rec {
  static async open({ width, height, dpr = 1, lang = "en", kind = "mouse", colorScheme = "dark", quality = 92 }) {
    const browser = await chromium.launch({ headless: true, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
    const context = await browser.newContext({
      viewport: { width, height }, deviceScaleFactor: dpr, colorScheme, reducedMotion: "no-preference",
      locale: lang === "ar" ? "ar" : "en-CA", hasTouch: false,
    });
    await context.addInitScript(pointerInit, [kind, seekAnimations.toString()]);
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const r = new Rec();
    Object.assign(r, { browser, context, page, cdp, width, height, dpr, kind, quality, t: 0, x: -200, y: -200, dir: null, n: 0, ring: -1, log: [], speed: 1 });
    await page.clock.install({ time: new Date("2026-11-15T12:00:00Z") });
    return r;
  }

  // Load a page in real time (clock running), then freeze the clock for frame stepping.
  async goto(url, { settle = 1200, waitFor } = {}) {
    await this.page.clock.resume();
    await this.page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    if (waitFor) await this.page.waitForFunction(waitFor, null, { timeout: 60000 });
    await this.page.evaluate(() => document.fonts.ready);
    await this.page.waitForTimeout(settle);
    const nowFake = await this.page.evaluate(() => Date.now());
    await this.page.clock.pauseAt(nowFake + 100);
    await this.page.evaluate(() => { window.__recSeen = new WeakMap(); });
  }

  // A click that opens another page: the load is real time and is not filmed; the film cuts to the loaded page.
  async follow(action, { settle = 900, waitFor } = {}) {
    await this.page.clock.resume();
    await Promise.all([this.page.waitForNavigation({ waitUntil: "networkidle", timeout: 90000 }), action()]);
    if (waitFor) await this.page.waitForFunction(waitFor, null, { timeout: 60000 });
    await this.page.evaluate(() => document.fonts.ready);
    await this.page.waitForTimeout(settle);
    const nowFake = await this.page.evaluate(() => Date.now());
    await this.page.clock.pauseAt(nowFake + 100);
    await this.page.evaluate(() => { window.__recSeen = new WeakMap(); });
  }

  // Wait in real time for something the page fetches, without advancing the film.
  async settle(fn, arg, timeout = 30000) {
    const t0 = Date.now();
    for (;;) {
      if (await this.page.evaluate(fn, arg)) return;
      if (Date.now() - t0 > timeout) throw new Error("settle timed out: " + fn);
      await this.page.clock.runFor(1); // lets promise callbacks that schedule timers move on
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  begin(dir) {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    this.dir = dir; this.n = 0; this.log = []; this.shotT0 = this.t;
  }
  mark(name, extra) { this.log.push({ name, frame: this.n, t: +(this.n / FPS).toFixed(3), ...extra }); }

  async frame() {
    if (this.lift && this.n >= this.lift) { this.lift = 0; this.x = -200; this.y = -200; }
    await this.page.clock.runFor(DT * this.speed);
    this.t += DT * this.speed;
    const ringAge = this.ring < 0 ? -1 : this.n - this.ring;
    await this.page.evaluate(([now, x, y, ringAge]) => {
      if (window.__recSeek) window.__recSeek(now);
      const p = document.getElementById("__rec_pointer");
      if (p) {
        p.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
        const ring = document.getElementById("__rec_ring"), tip = document.getElementById("__rec_tip");
        if (ring) {
          if (ringAge < 0 || ringAge > 12) { ring.style.opacity = "0"; }
          else { const u = ringAge / 12; ring.style.opacity = String(0.9 * (1 - u)); ring.style.transform = "scale(" + (0.3 + 1.0 * (1 - Math.pow(1 - u, 3))).toFixed(3) + ")"; }
        }
        if (tip) tip.style.transform = ringAge >= 0 && ringAge < 4 ? "scale(.86)" : "scale(1)";
      }
    }, [this.t, this.x, this.y, ringAge]);
    if (this.dir) {
      const { data } = await this.cdp.send("Page.captureScreenshot", { format: "jpeg", quality: this.quality, optimizeForSpeed: true, captureBeyondViewport: false });
      writeFileSync(join(this.dir, "f" + String(this.n).padStart(5, "0") + ".jpg"), Buffer.from(data, "base64"));
    }
    this.n++;
  }
  async hold(seconds) { const k = Math.max(0, Math.round(seconds * FPS)); for (let i = 0; i < k; i++) await this.frame(); }
  // Hold until the shot's own clock reaches `seconds` (so beats can be pinned to the voice).
  async until(seconds) { while (this.n < Math.round(seconds * FPS)) await this.frame(); }

  async move(x, y, seconds = 0.7, how = "inOut") {
    const x0 = this.x < -100 ? x + (this.kind === "touch" ? 0 : 160) : this.x, y0 = this.y < -100 ? y + (this.kind === "touch" ? 0 : 120) : this.y;
    const k = Math.max(1, Math.round(seconds * FPS));
    // A slight arc reads as a hand, a straight line as a robot.
    const dx = x - x0, dy = y - y0, bow = Math.min(40, Math.hypot(dx, dy) * 0.08);
    const nx = -dy / (Math.hypot(dx, dy) || 1), ny = dx / (Math.hypot(dx, dy) || 1);
    this.lift = 0;
    for (let i = 1; i <= k; i++) {
      const u = ease[how](i / k), b = Math.sin(Math.PI * u) * bow;
      this.x = x0 + dx * u + nx * b; this.y = y0 + dy * u + ny * b;
      if (this.kind !== "touch") await this.page.mouse.move(this.x, this.y);
      await this.frame();
    }
  }
  async center(sel, { dx = 0, dy = 0, nth = 0 } = {}) {
    const loc = typeof sel === "string" ? this.page.locator(sel).nth(nth) : sel;
    const box = await loc.boundingBox();
    if (!box) throw new Error("no box for " + sel);
    return [box.x + box.width / 2 + dx, box.y + box.height / 2 + dy];
  }
  async moveTo(sel, seconds = 0.8, opt = {}) { const [x, y] = await this.center(sel, opt); await this.move(x, y, seconds); }
  async click({ hold = 0.1 } = {}) {
    this.ring = this.n;
    await this.page.mouse.move(this.x, this.y);
    await this.page.mouse.down();
    await this.hold(hold);
    await this.page.mouse.up();
    if (this.kind === "touch") { await this.page.mouse.move(2, this.height - 2); this.lift = this.n + 7; } // a finger does not hover: it lifts
  }
  async type(text, perChar = 0.09) {
    for (const ch of text) { await this.page.keyboard.type(ch); await this.hold(perChar); }
  }
  // Scroll the page by hand, frame by frame (the browser's own smooth scroll runs on the real clock).
  async scrollTo(y, seconds = 1.2, how = "inOut") {
    const y0 = await this.page.evaluate(() => window.scrollY), k = Math.max(1, Math.round(seconds * FPS));
    for (let i = 1; i <= k; i++) {
      const v = y0 + (y - y0) * ease[how](i / k);
      await this.page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), v);
      await this.frame();
    }
  }

  // Close the shot: encode the frames to an all-intra MP4 (every frame a keyframe, so the film can seek it exactly).
  end(outFile, { keepFrames = false } = {}) {
    const frames = this.n, dir = this.dir;
    const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(dir, "f%05d.jpg"),
      "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-g", "1", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos", outFile], { encoding: "utf8" });
    if (r.status !== 0) throw new Error("ffmpeg failed: " + r.stderr);
    writeFileSync(outFile.replace(/\.mp4$/, ".json"), JSON.stringify({ frames, seconds: +(frames / FPS).toFixed(3), marks: this.log }, null, 1));
    if (!keepFrames) rmSync(dir, { recursive: true, force: true });
    this.dir = null;
    return { frames, seconds: frames / FPS, marks: this.log };
  }
  async close() { await this.browser.close(); }
}
