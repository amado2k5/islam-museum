import { describe, expect, it } from "vitest";
import { installCounters, longestSlowRun, type CounterHost } from "../src/counters";

describe("the longest slow stretch", () => {
  it("is nothing when every frame is on time", () => {
    expect(longestSlowRun([16, 17, 16, 33])).toBe(0);
  });
  it("adds up frames that miss 30 a second only while they follow one another", () => {
    expect(longestSlowRun([16, 40, 50, 16, 60, 16])).toBe(90);
    expect(longestSlowRun([40, 16, 100])).toBe(100);
  });
});

/** A window that is nothing but what the counters touch, with a clock the test moves. */
function fakeHost() {
  let now = 0;
  const frames: ((t: number) => void)[] = [];
  let nextId = 1;
  const terminated: number[] = [];
  class FakeWorker {
    terminate(): void {
      terminated.push(1);
    }
  }
  class FakeTarget {
    addEventListener(): void {}
    removeEventListener(): void {}
  }
  class FakeCanvas {
    getContext(kind: string): unknown {
      return kind === "nothing" ? null : { kind };
    }
  }
  class FakeAudio {
    closed = 0;
    createGain(): object {
      return {};
    }
    close(): Promise<void> {
      this.closed++;
      return Promise.resolve();
    }
  }
  const host = {
    performance: { now: () => now, memory: { usedJSHeapSize: 50 * 1048576 } },
    requestAnimationFrame: (cb: (t: number) => void) => frames.push(cb),
    setInterval: () => nextId++,
    clearInterval: () => {},
    Worker: FakeWorker,
    EventTarget: FakeTarget,
    HTMLCanvasElement: FakeCanvas,
    AudioContext: FakeAudio,
  };
  /** Presents one frame `ms` later: every callback asked for since the last one runs. */
  const present = (ms: number) => {
    now += ms;
    for (const cb of frames.splice(0)) cb(now);
  };
  return { host, present, terminated, FakeTarget, FakeCanvas };
}

describe("the counters", () => {
  it("time the frames and find a second loop", () => {
    const f = fakeHost();
    const c = installCounters(f.host as unknown as CounterHost);
    const loop = () => void (f.host.requestAnimationFrame as (cb: () => void) => number)(loop);
    loop();
    f.present(16);
    f.present(16);
    f.present(50);
    expect(c.snapshot().loops).toBe(1);
    expect(c.snapshot().frames.frames).toBe(2);
    expect(c.snapshot().frames.over33_3).toBe(1);
    expect(c.snapshot().frames.longestUnder30FpsMs).toBe(50);
    loop();
    f.present(16);
    f.present(16);
    expect(c.snapshot().loops).toBe(2);
    c.startOver();
    expect(c.snapshot().frames.frames).toBe(0);
  });

  it("count what is alive: intervals, workers, listeners, contexts, sound", () => {
    const f = fakeHost();
    const c = installCounters(f.host as unknown as CounterHost);
    const h = f.host as unknown as { setInterval(): number; clearInterval(id: number): void; Worker: new () => { terminate(): void }; AudioContext: new () => { createGain(): object; close(): Promise<void> } };
    const a = h.setInterval();
    h.setInterval();
    h.clearInterval(a);
    const w = new h.Worker();
    new h.Worker();
    w.terminate();
    const t = new f.FakeTarget() as unknown as { addEventListener(n: string, l: () => void): void; removeEventListener(n: string, l: () => void): void };
    t.addEventListener("x", () => {});
    t.addEventListener("y", () => {});
    t.removeEventListener("x", () => {});
    const canvas = new f.FakeCanvas();
    canvas.getContext("webgpu");
    canvas.getContext("webgpu");
    canvas.getContext("nothing");
    new f.FakeCanvas().getContext("2d");
    const audio = new h.AudioContext();
    audio.createGain();
    audio.createGain();
    new h.AudioContext();
    void audio.close();
    const s = c.snapshot();
    expect(s.intervals).toBe(1);
    expect(s.workers).toBe(1);
    expect(f.terminated.length).toBe(1);
    expect(s.listeners).toBe(1);
    expect(s.contexts).toEqual({ webgpu: 1, "2d": 1 });
    expect(s.audio).toEqual({ contexts: 1, nodesMade: 2 });
    expect(s.heapMb).toBe(50);
  });

  it("read what a game provides, and say so when the browser reports no heap or a reading fails", () => {
    const f = fakeHost();
    delete (f.host.performance as { memory?: unknown }).memory;
    const c = installCounters(f.host as unknown as CounterHost);
    c.provide("renderer", () => ({ triangles: 12 }));
    c.provide("broken", () => {
      throw new Error("not ready");
    });
    const s = c.snapshot();
    expect(s.provided).toEqual({ renderer: { triangles: 12 }, broken: { error: "not ready" } });
    expect(s.heapMb).toBeNull();
    expect(s.heapNote).toContain("does not report");
  });
});
