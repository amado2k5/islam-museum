// Runs the texture generator on a small pool of workers and resolves when every texture is ready.
import { TEXTURE_KINDS, type TextureData, type TextureKind } from "./textures";

export async function generateTextures(seed: number, size: number): Promise<{ textures: Map<TextureKind, TextureData>; ms: number; workers: number; timeline: Array<[string, number]> }> {
  const started = performance.now();
  const workers = Math.max(1, Math.min(TEXTURE_KINDS.length, (navigator.hardwareConcurrency || 4) - 1, 8));
  const queue = [...TEXTURE_KINDS];
  const out = new Map<TextureKind, TextureData>();
  const timeline: Array<[string, number]> = [];
  await Promise.all(
    Array.from({ length: workers }, () => {
      const w = new Worker(new URL("./texture-worker.ts", import.meta.url), { type: "module" });
      return new Promise<void>((resolve, reject) => {
        const next = () => {
          const kind = queue.shift();
          if (!kind) {
            w.terminate();
            resolve();
            return;
          }
          w.postMessage({ kind, seed, size });
        };
        w.onmessage = (e: MessageEvent<TextureData>) => {
          out.set(e.data.kind, e.data);
          timeline.push([e.data.kind, Math.round(performance.now() - started)]);
          next();
        };
        w.onerror = (e) => {
          w.terminate();
          reject(new Error(`texture worker failed: ${e.message}`));
        };
        next();
      });
    }),
  );
  return { textures: out, ms: performance.now() - started, workers, timeline };
}
