// Reads the authored animals (gaming/art/blender/granada_animals.py) into the shapes the valley's instanced meshes
// draw. Each file holds a body object and four leg objects; a leg's origin is its joint, so the geometry is taken as
// it is, while the body's own placement in the file is baked into its vertices. Every part keeps the colour its
// material carries as a vertex colour, measured against the animal's main hide or wool so the game's per-instance
// tinting works the way it does on the code-made shapes: the body shows the instance's colour, the accents keep
// their share of it.
import * as THREE from "three/webgpu";

export type AnimalKind = "sheep" | "goat" | "horse" | "ox" | "donkey" | "camel";
export const ANIMAL_KINDS: readonly AnimalKind[] = ["sheep", "goat", "horse", "ox", "donkey", "camel"];

/** The material each animal is mostly made of: the instance's own colour is measured against it. */
const BASE_MATERIAL: Record<AnimalKind, string> = { sheep: "wool", goat: "darkwool", horse: "hide", ox: "hide", donkey: "hide", camel: "hide" };

export interface AnimalParts {
  /** The body with the object's own placement baked in, ready to instance at ground level. */
  body: THREE.BufferGeometry;
  /** One leg, its joint at the origin, hanging down: the four are alike by construction. */
  leg: THREE.BufferGeometry;
}

function meshesOf(node: THREE.Object3D): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  node.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) meshes.push(m);
  });
  return meshes;
}

/**
 * Merges the meshes under a node into one geometry. `frameOf` gives the matrix each mesh is baked with. Every
 * primitive's material colour becomes the vertex colour of its vertices, so the game's plain "prop" surface draws
 * the parts in their own colours.
 */
function mergeMeshes(meshes: THREE.Mesh[], frameOf: (mesh: THREE.Mesh) => THREE.Matrix4, tint: (material: THREE.Material) => [number, number, number]): THREE.BufferGeometry {
  let vertexCount = 0;
  let indexCount = 0;
  for (const mesh of meshes) {
    vertexCount += mesh.geometry.getAttribute("position").count;
    indexCount += mesh.geometry.index ? mesh.geometry.index.count : mesh.geometry.getAttribute("position").count;
  }
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const colors = new Float32Array(vertexCount * 3);
  const indices = new Uint32Array(indexCount);
  let v = 0;
  let i = 0;
  const point = new THREE.Vector3();
  for (const mesh of meshes) {
    const geometry = mesh.geometry;
    const matrix = frameOf(mesh);
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
    const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    const [cr, cg, cb] = tint(material);
    const p = geometry.getAttribute("position") as THREE.BufferAttribute;
    const n = geometry.getAttribute("normal") as THREE.BufferAttribute | undefined;
    const u = geometry.getAttribute("uv") as THREE.BufferAttribute | undefined;
    for (let k = 0; k < p.count; k++) {
      point.fromBufferAttribute(p, k).applyMatrix4(matrix);
      positions[(v + k) * 3] = point.x;
      positions[(v + k) * 3 + 1] = point.y;
      positions[(v + k) * 3 + 2] = point.z;
      if (n) {
        point.fromBufferAttribute(n, k).applyMatrix3(normalMatrix).normalize();
        normals[(v + k) * 3] = point.x;
        normals[(v + k) * 3 + 1] = point.y;
        normals[(v + k) * 3 + 2] = point.z;
      } else {
        normals[(v + k) * 3 + 1] = 1;
      }
      if (u) {
        uvs[(v + k) * 2] = u.getX(k);
        uvs[(v + k) * 2 + 1] = u.getY(k);
      }
      colors[(v + k) * 3] = cr;
      colors[(v + k) * 3 + 1] = cg;
      colors[(v + k) * 3 + 2] = cb;
    }
    const index = geometry.index;
    if (index) for (let k = 0; k < index.count; k++) indices[i + k] = index.getX(k) + v;
    else for (let k = 0; k < p.count; k++) indices[i + k] = v + k;
    i += index ? index.count : p.count;
    v += p.count;
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  merged.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  merged.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  return merged;
}

/**
 * The animal's body and one leg as the valley draws them. Throws if the file does not carry the whole animal, so
 * the caller keeps the code-made shape instead. Nothing here is disposed: what it returns is the caller's.
 */
export function extractAnimal(model: THREE.Object3D, kind: AnimalKind): AnimalParts {
  model.updateMatrixWorld(true);
  const bodyNode = model.getObjectByName(`${kind}_body`);
  if (!bodyNode) throw new Error(`the file has no ${kind}_body`);
  for (const side of ["fl", "fr", "rl", "rr"]) if (!model.getObjectByName(`${kind}_leg_${side}`)) throw new Error(`the file has no ${kind}_leg_${side}`);
  const legNode = model.getObjectByName(`${kind}_leg_fl`)!;
  // The colour of the animal's main hide or wool: the body's parts are measured against it, so an instance's own
  // tint takes the place of the hide and every accent keeps its share, as on the code-made shapes.
  const baseName = BASE_MATERIAL[kind];
  let base: THREE.Color | null = null;
  for (const mesh of meshesOf(bodyNode)) {
    const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    if (material.name === baseName && !base) base = (material as unknown as { color: THREE.Color }).color?.clone() ?? null;
  }
  if (!base) throw new Error(`the file has no ${baseName} material`);
  const tint = (material: THREE.Material): [number, number, number] => {
    const c = (material as unknown as { color?: THREE.Color }).color;
    if (!c) return [1, 1, 1];
    const ratio = (x: number, y: number) => Math.min(1.6, y > 0.001 ? x / y : 1);
    return [ratio(c.r, base!.r), ratio(c.g, base!.g), ratio(c.b, base!.b)];
  };
  // The body is baked where the file stands it, so an instance matrix at ground level places it whole.
  const body = mergeMeshes(meshesOf(bodyNode), (mesh) => mesh.matrixWorld, tint);
  // A leg's vertices are already about its joint: only what lies between the joint's node and the mesh is baked.
  const undo = legNode.matrixWorld.clone().invert();
  const leg = mergeMeshes(meshesOf(legNode), (mesh) => undo.clone().multiply(mesh.matrixWorld), tint);
  return { body, leg };
}
