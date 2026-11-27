// How the model loader shares surfaces. The glTF fixtures here are only the parts the loader reads: the material's
// own description, the texture index, and the image URI it resolves. No model file is opened.
import { afterEach, describe, expect, it } from "vitest";
import type { Object3D } from "three/webgpu";
import { canonicalTexturePath, disposeModel, disposeSharedMaterials, materialSignature, shareLoadedMaterials } from "../src/view/models";

function fixture(materialProperties: Record<string, unknown> = {}) {
  const calls = { texture: 0, material: 0 };
  const texture = { dispose: () => { calls.texture++; }, userData: {} as Record<string, unknown> };
  const material = { name: "stone", map: texture, dispose: () => { calls.material++; }, userData: {} as Record<string, unknown> };
  const mesh = { isMesh: true, castShadow: false, receiveShadow: false, material, geometry: { dispose: () => {} } };
  const root = { traverse: (cb: (o: unknown) => void) => cb(mesh) } as unknown as Object3D;
  const json = {
    images: [{ uri: "textures/stone_base.jpg" }],
    textures: [{ source: 0 }],
    materials: [{ name: "stone", pbrMetallicRoughness: { baseColorTexture: { index: 0 }, ...materialProperties } }],
  };
  const associations = new Map<object, { materials?: number; textures?: number }>();
  associations.set(texture, { textures: 0 });
  associations.set(material, { materials: 0 });
  return { calls, texture, material, mesh, root, gltf: { parser: { json, associations } } };
}

describe("model texture sharing", () => {
  afterEach(() => disposeSharedMaterials());
  it("resolves an image in a parent folder to the same path as the first model's own copy", () => {
    expect(canonicalTexturePath("granada/p1/palace.gltf", "../2/textures/stone_base.jpg")).toBe("granada/2/textures/stone_base.jpg");
    expect(canonicalTexturePath("granada/2/landmarks.gltf", "textures/stone_base.jpg")).toBe("granada/2/textures/stone_base.jpg");
  });

  it("gives the same material description the same signature across those two folders", () => {
    const json = { images: [{ uri: "../2/textures/stone_base.jpg" }], textures: [{ source: 0 }], materials: [{ name: "stone", pbrMetallicRoughness: { baseColorTexture: { index: 0 } } }] };
    expect(materialSignature("granada/p1/palace.gltf", json, 0)).toContain("granada/2/textures/stone_base.jpg");
  });

  it("shares one texture across models when both image addresses resolve alike, even if the materials differ", () => {
    const a = fixture();
    shareLoadedMaterials(a.root, a.gltf, "granada/2/landmarks.gltf");
    const b = fixture({ baseColorFactor: [0.8, 0.7, 0.6, 1] });
    // The second file points at the same image through its own relative path.
    b.gltf.parser.json.images[0]!.uri = "../2/textures/stone_base.jpg";
    shareLoadedMaterials(b.root, b.gltf, "granada/p1/palace.gltf");
    expect(b.mesh.material).not.toBe(a.material);
    expect(b.material.map).toBe(a.texture);
    expect(b.calls.texture).toBe(1);
  });

  it("keeps a shared texture alive until the shared surfaces are taken down", () => {
    const a = fixture();
    shareLoadedMaterials(a.root, a.gltf, "granada/2/landmarks.gltf");
    const b = fixture();
    b.gltf.parser.json.images[0]!.uri = "../2/textures/stone_base.jpg";
    shareLoadedMaterials(b.root, b.gltf, "granada/p1/palace.gltf");
    const sharedTexture = a.texture;
    const textureCalls = sharedTexture.dispose;
    let disposedTextures = 0;
    sharedTexture.dispose = () => {
      disposedTextures++;
      textureCalls();
    };
    disposeModel(b.root);
    expect(disposedTextures).toBe(0);
    disposeSharedMaterials();
    expect(disposedTextures).toBe(1);
  });
});
