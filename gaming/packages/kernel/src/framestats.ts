// Frame-time statistics for benchmarks and the in-game performance overlay.
// A benchmark result is evidence, so the summary is computed the same way everywhere: nearest-rank percentiles
// over the recorded frame intervals, with long frames counted against explicit thresholds.

export interface FrameSummary {
  frames: number;
  durationMs: number;
  meanMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  minMs: number;
  /** Frames slower than 16.7 ms (misses a 60 Hz deadline). */
  over16_7: number;
  /** Frames slower than 33.3 ms (misses a 30 Hz deadline). */
  over33_3: number;
  /** Frames slower than 50 ms: a visible stall. */
  over50: number;
  avgFps: number;
}

/** Nearest-rank percentile of an ascending-sorted array; p in (0, 100]. */
export function percentile(sortedAscending: ArrayLike<number>, p: number): number {
  const n = sortedAscending.length;
  if (n === 0) return Number.NaN;
  const rank = Math.min(n, Math.max(1, Math.ceil((p / 100) * n)));
  return sortedAscending[rank - 1] as number;
}

export function summarize(intervalsMs: ArrayLike<number>): FrameSummary {
  const n = intervalsMs.length;
  const sorted = Float64Array.from(intervalsMs as ArrayLike<number>).sort();
  let total = 0;
  let over16 = 0;
  let over33 = 0;
  let over50 = 0;
  for (let i = 0; i < n; i++) {
    const v = intervalsMs[i] as number;
    total += v;
    if (v > 16.7) over16++;
    if (v > 33.3) over33++;
    if (v > 50) over50++;
  }
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return {
    frames: n,
    durationMs: round(total),
    meanMs: round(n ? total / n : Number.NaN),
    p50Ms: round(percentile(sorted, 50)),
    p95Ms: round(percentile(sorted, 95)),
    p99Ms: round(percentile(sorted, 99)),
    maxMs: round(n ? (sorted[n - 1] as number) : Number.NaN),
    minMs: round(n ? (sorted[0] as number) : Number.NaN),
    over16_7: over16,
    over33_3: over33,
    over50,
    avgFps: round(total > 0 ? (n * 1000) / total : Number.NaN),
  };
}

/** Fixed-capacity recorder: no allocation while frames are being measured. */
export class FrameRecorder {
  private readonly buf: Float32Array;
  private count = 0;
  private last = -1;

  constructor(capacity = 20000) {
    this.buf = new Float32Array(capacity);
  }

  /** Call once per presented frame with a monotonic timestamp in milliseconds. */
  tick(nowMs: number): void {
    if (this.last >= 0 && this.count < this.buf.length) this.buf[this.count++] = nowMs - this.last;
    this.last = nowMs;
  }

  reset(): void {
    this.count = 0;
    this.last = -1;
  }

  get length(): number {
    return this.count;
  }

  intervals(): Float32Array {
    return this.buf.slice(0, this.count);
  }

  summary(): FrameSummary {
    return summarize(this.buf.subarray(0, this.count));
  }
}
