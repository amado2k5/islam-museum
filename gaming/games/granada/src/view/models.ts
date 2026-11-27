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

const TEXTURES = ["map", "normalMap", "roughnessMap", "metalnessMap"];
type Texture = { anisotropy?: number; colorSpace?: unknown; wrapS?: unknown; wrapT?: unknown; magFilter?: unknown; minFilter?: unknown; channel?: unknown; dispose?: () => void; userData?: Record<string, unknown> };
type Held = Record<string, Texture | null | undefined> & { name?: string; dispose?: () => void; userData: Record<string, unknown> };
type GltfJson = { images?: Array<{ uri?: string }>; textures?: Array<{ source?: number; sampler?: number; extensions?: Record<string, { source?: number }> }>; samplers?: unknown[]; materials?: unknown[] };
type GltfParser = { json?: GltfJson; associations?: Map<object, { materials?: number; textures?: number }> };
type GltfRead = { parser?: GltfParser };

/**
 * The models of one game are made from one set of surfaces (one plaster, one roof tile, one stone), and each file
 * carries its own copy of them. Held here by their material description, the first copy to arrive serves every model
 * after it, so a surface is on the graphics card once however many files use it.
 */
const sharedMaterials = new Map<string, Held>();
/** Textures are shared by the address their image resolves to, even where two materials cannot themselves be shared. */
const sharedTextures = new Map<string, Texture>();
const disposed = new WeakSet<object>();

function disposeOnce(thing: { dispose?: () => void }): void {
  if (disposed.has(thing)) return;
  disposed.add(thing);
  thing.dispose?.();
}

/** The path an image URI in a model resolves to, with the model's own folder taking care of `..` segments. */
export function canonicalTexturePath(modelPath: string, uri: string): string {
  if (/^(?:data|blob|https?):/i.test(uri)) return uri;
  const suffix = uri.match(/[?#].*$/)?.[0] ?? "";
  const bare = uri.slice(0, uri.length - suffix.length);
  const rooted = bare.startsWith("/");
  const folder = modelPath.slice(0, modelPath.lastIndexOf("/") + 1);
  const parts: string[] = [];
  for (const part of `${rooted ? "" : folder}${bare}`.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return `${rooted ? "/" : ""}${parts.join("/")}${suffix}`;
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable((value as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(value);
}

function textureUri(json: GltfJson | undefined, modelPath: string, textureIndex: number): string | null {
  const texture = json?.textures?.[textureIndex];
  if (!texture) return null;
  let source = texture.source;
  if (source === undefined) for (const extension of Object.values(texture.extensions ?? {})) if (extension.source !== undefined) source = extension.source;
  if (source === undefined) return null;
  const uri = json?.images?.[source]?.uri;
  // An embedded image cannot be shared by address across files; its key is its own model and image index.
  return uri ? canonicalTexturePath(modelPath, uri) : `${modelPath}#image-${source}`;
}

function textureDescription(json: GltfJson | undefined, modelPath: string, textureIndex: number): unknown {
  const texture = json?.textures?.[textureIndex];
  if (!texture) return null;
  return { image: textureUri(json, modelPath, textureIndex) ?? `${modelPath}#texture-${textureIndex}`, sampler: texture.sampler === undefined ? null : json?.samplers?.[texture.sampler] ?? texture.sampler };
}

function normalizeMaterial(value: unknown, key: string, json: GltfJson | undefined, modelPath: string): unknown {
  if (Array.isArray(value)) return value.map((v) => normalizeMaterial(v, key, json, modelPath));
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.index === "number" && key.toLowerCase().endsWith("texture")) return { texture: textureDescription(json, modelPath, record.index) };
    return Object.fromEntries(Object.entries(record).map(([k, v]) => [k, normalizeMaterial(v, k, json, modelPath)]));
  }
  return value;
}

/** A material's whole glTF description, with texture references resolved to the image addresses they fetch. */
export function materialSignature(modelPath: string, json: GltfJson | undefined, materialIndex: number): string | null {
  const material = json?.materials?.[materialIndex];
  return material ? stable(normalizeMaterial(material, "", json, modelPath)) : null;
}

function textureKey(texture: Texture, parser: GltfParser | undefined, modelPath: string): string | null {
  const index = parser?.associations?.get(texture as object)?.textures;
  if (index === undefined) return null;
  const uri = textureUri(parser?.json, modelPath, index);
  // A file can be sampled in more than one way. Only the same image in the same interpretation is the same texture.
  return uri ? `${uri}|${stable({ colorSpace: texture.colorSpace, wrapS: texture.wrapS, wrapT: texture.wrapT, magFilter: texture.magFilter, minFilter: texture.minFilter, channel: texture.channel })}` : null;
}

function shareTextures(material: Held, parser: GltfParser | undefined, modelPath: string, anisotropy: number): void {
  const replacements = new Map<Texture, Texture>();
  for (const slot of TEXTURES) {
    const texture = material[slot];
    if (!texture) continue;
    const key = textureKey(texture, parser, modelPath);
    if (!key) {
      texture.anisotropy = anisotropy;
      continue;
    }
    const first = sharedTextures.get(key);
    if (first && first !== texture) replacements.set(texture, first);
    else {
      texture.anisotropy = anisotropy;
      texture.userData = { ...(texture.userData ?? {}), sharedTexture: true };
      sharedTextures.set(key, texture);
    }
  }
  if (!replacements.size) return;
  for (const slot of TEXTURES) {
    const texture = material[slot];
    const replacement = texture ? replacements.get(texture) : undefined;
    if (replacement) material[slot] = replacement;
  }
  for (const duplicate of replacements.keys()) disposeOnce(duplicate);
}

function materialKey(material: Held, parser: GltfParser | undefined, modelPath: string, folder: string): string | null {
  if (!material.name) return null;
  const index = parser?.associations?.get(material as object)?.materials;
  const signature = index === undefined ? null : materialSignature(modelPath, parser?.json, index);
  // Where the glTF cannot say what images the material uses, keep the older and narrower sharing within one folder.
  return signature ? `images:${material.name}:${signature}` : `folder:${folder}${material.name}`;
}

/** Gives one material and texture ownership to a loaded model. Exported so the sharing and disposal rules can be tested without a browser. */
export function shareLoadedMaterials(model: Object3D, gltf: GltfRead, path: string, anisotropy = 8): void {
  const folder = path.slice(0, path.lastIndexOf("/") + 1);
  model.traverse((o) => {
    const mesh = o as unknown as { isMesh?: boolean; castShadow: boolean; receiveShadow: boolean; material: unknown };
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const own = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as Held[];
    const use = own.map((m) => {
      shareTextures(m, gltf.parser, path, anisotropy);
      const key = materialKey(m, gltf.parser, path, folder);
      const first = key ? sharedMaterials.get(key) : undefined;
      if (first && first !== m) {
        // This file's material copy is never drawn. A texture it still owns is let go; one already shared is not.
        for (const k of TEXTURES) {
          const texture = m[k];
          if (texture && !texture.userData?.sharedTexture) disposeOnce(texture);
        }
        disposeOnce(m);
        return first;
      }
      if (key) {
        m.userData.shared = true;
        sharedMaterials.set(key, m);
      }
      return m;
    });
    mesh.material = Array.isArray(mesh.material) ? use : use[0];
  });
}

/** Fetches a model and its textures, and makes every mesh of it cast and take shadow. Rejects if any part is missing. */
export async function loadModel(path: string, anisotropy = 8): Promise<Object3D> {
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
  const gltf = await new GLTFLoader().loadAsync(modelUrl(path));
  shareLoadedMaterials(gltf.scene as unknown as Object3D, gltf as unknown as GltfRead, path, anisotropy);
  return gltf.scene as unknown as Object3D;
}

/** Frees the surfaces every model shared. Call it when the game's 3D view is taken down, after its models. */
export function disposeSharedMaterials(): void {
  for (const m of sharedMaterials.values()) {
    for (const k of TEXTURES) if (m[k]) disposeOnce(m[k]!);
    disposeOnce(m);
  }
  for (const texture of sharedTextures.values()) disposeOnce(texture);
  sharedMaterials.clear();
  sharedTextures.clear();
}

/** Frees what a loaded model holds on the graphics card. */
export function disposeModel(model: Object3D): void {
  model.traverse((o) => {
    const mesh = o as unknown as { isMesh?: boolean; geometry?: { dispose(): void }; material?: unknown };
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const m = material as Held;
      // A surface other models share outlives this one: disposeSharedMaterials() frees it.
      if (m.userData?.shared) continue;
      for (const key of TEXTURES) {
        const texture = m[key];
        // A texture other materials share outlives this material: disposeSharedMaterials() frees it.
        if (texture && !texture.userData?.sharedTexture) disposeOnce(texture);
      }
      disposeOnce(m);
    }
  });
}
