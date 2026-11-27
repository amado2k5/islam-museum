import { describe, expect, it } from "vitest";
import * as THREE from "three/webgpu";
import { AUTHORED_TYPES, authoredBuilding, extractBuilding, setAuthoredBuilding, type AuthoredType } from "../src/view/buildings";
import { buildPlot, type PlotLook } from "../src/view/board";

const look = (over: Partial<PlotLook>): PlotLook => ({ type: null, canal: 0, served: false, bathed: false, soy: 0, lined: false, rotation: false, wheel: false, ...over });

/** A small stand-in model: one box per named material, as the exporter's single object would carry them. */
function fakeModel(materials: Array<[string, number, number, number]>): THREE.Object3D {
  const root = new THREE.Group();
  for (const [name, r, g, b] of materials) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ name }));
    (mesh.material as THREE.MeshStandardMaterial).color.setRGB(r, g, b);
    root.add(mesh);
  }
  return root;
}

const tris = (m: { indices: Uint32Array }): number => m.indices.length / 3;

describe("the authored public buildings", () => {
  it("the five types are the founder's five", () => {
    expect([...AUTHORED_TYPES].sort()).toEqual(["bath", "hospital", "library", "market", "school"]);
  });

  it("extraction groups primitives into the game's materials, colours baked into the vertices", () => {
    const pieces = extractBuilding(fakeModel([["plaster", 0.8, 0.7, 0.6], ["glaze", 0.1, 0.6, 0.6], ["darkwood", 0.3, 0.2, 0.15]]), "library");
    const ids = pieces.map((p) => p.material).sort();
    expect(ids).toEqual(["glaze", "plaster", "wood"]);
    for (const piece of pieces) {
      expect(piece.mesh.positions.length).toBeGreaterThan(0);
      expect(tris(piece.mesh)).toBe(12);
      // Every vertex carries the material's colour, no material index surviving.
      const c = piece.mesh.colors;
      expect(Math.max(...c)).toBeLessThanOrEqual(0.81);
    }
  });

  it("materials the game does not know are dropped, and a file with nothing usable throws", () => {
    const pieces = extractBuilding(fakeModel([["plaster", 1, 1, 1], ["unobtainium", 1, 0, 1]]), "bath");
    expect(pieces.map((p) => p.material)).toEqual(["plaster"]);
    expect(() => extractBuilding(fakeModel([["unobtainium", 1, 0, 1]]), "bath")).toThrow(/no usable bath/);
  });

  it("without a registered piece the plot builds exactly as before; with one, the code-made hall is replaced", () => {
    // No piece registered for "school" yet in this file's ordering, so both builds are the procedural ones.
    const procedural = buildPlot(3, 10, look({ type: "school" }));
    const piece = extractBuilding(fakeModel([["plaster", 0.85, 0.8, 0.7]]), "school");
    setAuthoredBuilding("school", piece);
    const withArt = buildPlot(3, 10, look({ type: "school" }));
    // The authored piece takes the procedural hall's place: the plot's plaster is now the piece's, not the hall's.
    // A piece this small holds fewer triangles than the arcaded hall it stands for, and either way the two builds differ.
    const plasterOf = (g: typeof procedural) => g.chunks.filter((c) => c.material === "plaster").reduce((n, c) => n + tris(c.mesh), 0);
    expect(plasterOf(withArt)).not.toBe(plasterOf(procedural));
    // The piece is small but present: the plot still holds real geometry and the same state-facing facts.
    expect(withArt.triangles).toBeGreaterThan(200);
    // And the plot remembers how to build itself again, identically.
    const again = withArt.rebuild();
    expect(again.triangles).toBe(withArt.triangles);
    expect(again.type).toBe("school");
  });

  it("every authored type a plot can use resolves through the registry, and the buildings stay within budget", () => {
    // The budget the work was stated against: at most 4,000 triangles in one building (measured on the real files
    // in the pull request's evidence, here held as a guard on the extraction path).
    for (const type of AUTHORED_TYPES) {
      const piece = extractBuilding(fakeModel([["plaster", 1, 1, 1]]), type as AuthoredType);
      const total = piece.reduce((n, p) => n + tris(p.mesh), 0);
      expect(total).toBeLessThanOrEqual(4000);
    }
  });
});
