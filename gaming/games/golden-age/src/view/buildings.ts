// Reads the authored public buildings (gaming/art/blender/golden_age_buildings.py) into the engine-neutral meshes
// the district is built from. Each file holds one object whose primitives carry materials named for the game's own
// material kinds; the primitives are read apart by that name and returned as one MeshData a material, the material's
// colour baked into the vertices, so the plot builders can append them into the same merged district meshes the
// code-made geometry feeds. An authored building therefore costs no draw call of its own.
import * as THREE from "three/webgpu";
import type { MeshData } from "@im/worldkit/mesh";
import type { MaterialId } from "@im/worldkit/district/kit";
import type { BuildingType } from "../rules";

export type AuthoredType = Extract<BuildingType, "market" | "bath" | "library" | "school" | "hospital">;
export const AUTHORED_TYPES: readonly AuthoredType[] = ["market", "bath", "library", "school", "hospital"];

/** The Blender material names that share one of the game's materials; their colours keep their differences in the vertices. */
const MATERIAL_MAP: Record<string, MaterialId> = {
  plaster: "plaster",
  plaster_dark: "plaster",
  glaze: "glaze",
  startile: "startile",
  cobalt: "startile",
  wood: "wood",
  darkwood: "wood",
  gold: "wood",
  brick: "brick",
  ashlar: "ashlar",
  roof: "roof",
  fabric: "fabric",
  lattice: "lattice",
};

export interface AuthoredPiece {
  material: MaterialId;
  mesh: MeshData;
}

/**
 * The building's primitives as one mesh a game material, in the file's own frame (the building centred on the
 * ground, its front towards +Z). Throws if the file carries no primitive the game can use, so the caller keeps
 * the code-made building instead.
 */
export function extractBuilding(model: THREE.Object3D, type: AuthoredType): AuthoredPiece[] {
  model.updateMatrixWorld(true);
  const buckets = new Map<MaterialId, { positions: number[]; normals: number[]; uvs: number[]; colors: number[]; indices: number[] }>();
  const point = new THREE.Vector3();
  model.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const geometry = mesh.geometry;
    // One geometry group a material, or the single material of the whole.
    const groups = geometry.groups.length ? geometry.groups : [{ start: 0, count: geometry.index ? geometry.index.count : geometry.getAttribute("position").count, materialIndex: 0 }];
    for (const group of groups) {
      const material = materials[Math.min(group.materialIndex ?? 0, materials.length - 1)] as THREE.Material;
      const id = MATERIAL_MAP[material?.name ?? ""];
      if (!id) continue;
      let bucket = buckets.get(id);
      if (!bucket) {
        bucket = { positions: [], normals: [], uvs: [], colors: [], indices: [] };
        buckets.set(id, bucket);
      }
      const base = bucket.positions.length / 3;
      const c = (material as unknown as { color?: THREE.Color }).color ?? new THREE.Color(1, 1, 1);
      const p = geometry.getAttribute("position") as THREE.BufferAttribute;
      const n = geometry.getAttribute("normal") as THREE.BufferAttribute | undefined;
      const u = geometry.getAttribute("uv") as THREE.BufferAttribute | undefined;
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
      const index = geometry.index;
      const first = index ? index.getX(group.start) : group.start;
      const last = index ? index.getX(group.start + group.count - 1) : group.start + group.count - 1;
      const lo = Math.min(first, last);
      const hi = Math.max(first, last);
      // Copy the vertices the group spans (the exporter packs each primitive contiguously) and remap its indices.
      const remap = new Map<number, number>();
      for (let k = lo; k <= hi; k++) {
        remap.set(k, base + k - lo);
        point.fromBufferAttribute(p, k).applyMatrix4(mesh.matrixWorld);
        bucket.positions.push(point.x, point.y, point.z);
        if (n) {
          point.fromBufferAttribute(n, k).applyMatrix3(normalMatrix).normalize();
          bucket.normals.push(point.x, point.y, point.z);
        } else bucket.normals.push(0, 1, 0);
        bucket.uvs.push(u ? u.getX(k) : 0, u ? u.getY(k) : 0);
        bucket.colors.push(c.r, c.g, c.b);
      }
      for (let k = 0; k < group.count; k++) {
        const vi = index ? index.getX(group.start + k) : group.start + k;
        bucket.indices.push(remap.get(vi)!);
      }
    }
  });
  const out: AuthoredPiece[] = [];
  for (const [material, b] of buckets) {
    if (!b.indices.length) continue;
    out.push({
      material,
      mesh: {
        positions: Float32Array.from(b.positions),
        normals: Float32Array.from(b.normals),
        uvs: Float32Array.from(b.uvs),
        colors: Float32Array.from(b.colors),
        indices: Uint32Array.from(b.indices),
      },
    });
  }
  if (!out.length) throw new Error(`the file has no usable ${type}`);
  return out;
}

// ---- The registry the plot builders consult -----------------------------------------------------------------------------
// The pieces live in module state because the plot builders are pure functions of seed and look: what they build is
// still deterministic given the same registry, and the renderer rebuilds the plots the day a piece arrives.

const registry = new Map<AuthoredType, AuthoredPiece[]>();

/** The authored pieces of a building type, or null while they are not here (the code-made building stands then). */
export function authoredBuilding(type: AuthoredType): AuthoredPiece[] | null {
  return registry.get(type) ?? null;
}

/** Registers a building's authored pieces. The renderer calls this when the model arrives. */
export function setAuthoredBuilding(type: AuthoredType, pieces: AuthoredPiece[]): void {
  registry.set(type, pieces);
}
