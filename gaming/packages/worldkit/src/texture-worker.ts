// Generates procedural textures off the main thread. One request, one reply; the pixel buffers are transferred, not copied.
import { makeTexture, type TextureKind } from "./textures";

self.onmessage = (e: MessageEvent<{ kind: TextureKind; seed: number; size: number }>) => {
  const t = makeTexture(e.data.kind, e.data.seed, e.data.size);
  (self as unknown as Worker).postMessage(t, [t.albedo.buffer, t.normal.buffer]);
};
