// Models made ahead of time by the art pipeline (gaming/art/): where the game finds them, and how it loads one.
// They are media, so they are not in git and not in a release: like the music, they are served beside the releases.
// A game must therefore be able to do without any of them. Each has a shape the game draws from its own code, shown
// from the first frame; the model takes its place if and when it arrives, and its absence is not an error.
import type { Object3D } from "three/webgpu";

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
/** Where the models are served from. A release build sets VITE_MODELS_BASE; in development it is the workspace's media folder. */
export const MODELS_BASE: string = env?.VITE_MODELS_BASE ?? "/media/models/";
/** False for a build told there is nowhere to fetch models from ("off", which is what a release is built with unless told otherwise). */
export const modelsAvailable = (base: string): boolean => base !== "off" && base !== "";
export const MODELS_AVAILABLE: boolean = modelsAvailable(MODELS_BASE);
/** The address of a model's entry file, given its path under the models folder. */
export const modelUrl = (path: string, base: string = MODELS_BASE): string => `${base.endsWith("/") ? base : `${base}/`}${path.replace(/^\/+/, "")}`;

/** Fetches a model and its textures, and makes every mesh of it cast and take shadow. Rejects if any part is missing. */
export async function loadModel(path: string, anisotropy = 8): Promise<Object3D> {
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
  const gltf = await new GLTFLoader().loadAsync(modelUrl(path));
  gltf.scene.traverse((o) => {
    const mesh = o as unknown as { isMesh?: boolean; castShadow: boolean; receiveShadow: boolean; material: unknown };
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const m = material as Record<string, { anisotropy?: number } | null | undefined>;
      for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap"]) {
        const texture = m[key];
        if (texture) texture.anisotropy = anisotropy;
      }
    }
  });
  return gltf.scene as unknown as Object3D;
}

/** Frees what a loaded model holds on the graphics card. */
export function disposeModel(model: Object3D): void {
  model.traverse((o) => {
    const mesh = o as unknown as { isMesh?: boolean; geometry?: { dispose(): void }; material?: unknown };
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const m = material as Record<string, { dispose?: () => void } | null | undefined> & { dispose?: () => void };
      for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap"]) m[key]?.dispose?.();
      m.dispose?.();
    }
  });
}
