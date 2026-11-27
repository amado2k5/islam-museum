// How the authored animals are read into instanced shapes. The files themselves are media and not in git, so the
// models here are built the way the Blender export builds them: a body object placed above the ground, made of parts
// in more than one material, and leg objects whose origins are the joints.
import { describe, expect, it } from "vitest";
import * as THREE from "three/webgpu";
import { extractAnimal } from "../src/view/animals";
import { donkey, oxBody, oxCart } from "../src/view/buildings";
import type { MeshData } from "@im/worldkit/mesh";

function part(material: THREE.Material, x0: number, x1: number): THREE.Mesh {
  const g = new THREE.BoxGeometry(x1 - x0, 0.2, 0.2);
  g.translate((x0 + x1) / 2, 0, 0);
  return new THREE.Mesh(g, material);
}

function fixture(): THREE.Group {
  const hide = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.4, 0.3, 0.2) });
  hide.name = "hide";
  const hoof = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.08, 0.06, 0.05) });
  hoof.name = "hoof";
  const root = new THREE.Group();
  // The body: two parts in the object's frame, the object itself standing at its height.
  const body = new THREE.Group();
  body.name = "horse_body";
  body.add(part(hide, -1, 0.5));
  body.add(part(hoof, 0.5, 1));
  body.position.set(0, 1.1, 0.3);
  root.add(body);
  // Four legs, each its own object at its joint; the leg hangs below the joint.
  for (const [side, x, z] of [["fl", -0.2, 0.6], ["fr", 0.2, 0.6], ["rl", -0.2, -0.6], ["rr", 0.2, -0.6]] as const) {
    const leg = new THREE.Group();
    leg.name = `horse_leg_${side}`;
    leg.add(part(hide, -0.05, 0.05));
    leg.children[0]!.position.set(0, -0.4, 0);
    leg.position.set(x, 0.9, z);
    root.add(leg);
  }
  return root;
}

describe("reading an authored animal", () => {
  it("bakes the body's own placement into its vertices, so instancing at ground level places it whole", () => {
    const { body } = extractAnimal(fixture(), "horse");
    body.computeBoundingBox();
    expect(body.boundingBox!.min.y).toBeCloseTo(1.0, 3);
    expect(body.boundingBox!.max.z).toBeCloseTo(0.4, 3);
    expect(body.boundingBox!.min.x).toBeCloseTo(-1, 3);
    expect(body.boundingBox!.max.x).toBeCloseTo(1, 3);
  });

  it("colours the body parts against the main hide, so an instance's tint takes the hide's place", () => {
    const { body } = extractAnimal(fixture(), "horse");
    const colors = body.getAttribute("color");
    // The first part is hide: its colour is the whole of it, white, so the instance's own colour shows.
    expect(colors.getX(0)).toBeCloseTo(1, 3);
    expect(colors.getY(0)).toBeCloseTo(1, 3);
    expect(colors.getZ(0)).toBeCloseTo(1, 3);
    // The second part is the dark hoof material: it keeps only its share of the hide.
    const last = colors.count - 1;
    expect(colors.getX(last)).toBeCloseTo(0.2, 2);
    expect(colors.getX(last)).toBeLessThan(0.5);
  });

  it("leaves a leg about its joint, however the file places it", () => {
    const { leg } = extractAnimal(fixture(), "horse");
    leg.computeBoundingBox();
    // The joint stays the origin: nothing of the leg's own placement in the file is baked in.
    expect(leg.boundingBox!.min.x).toBeCloseTo(-0.05, 3);
    expect(leg.boundingBox!.max.y).toBeCloseTo(-0.3, 3);
    expect(Math.abs(leg.boundingBox!.min.z)).toBeLessThan(0.2);
  });

  it("refuses a file short of a part, so the code-made shape stays", () => {
    const broken = fixture();
    broken.remove(broken.children[4]!);
    expect(() => extractAnimal(broken, "horse")).toThrow(/horse_leg_rr/);
    const nobody = new THREE.Group();
    expect(() => extractAnimal(nobody, "horse")).toThrow(/horse_body/);
  });

  it("writes sound geometry: indices in range, attributes in step", () => {
    const { body, leg } = extractAnimal(fixture(), "horse");
    for (const g of [body, leg]) {
      const n = g.getAttribute("position").count;
      expect(g.getAttribute("normal").count).toBe(n);
      expect(g.getAttribute("color").count).toBe(n);
      expect(g.getAttribute("uv").count).toBe(n);
      for (let i = 0; i < g.index!.count; i++) expect(g.index!.getX(i)).toBeLessThan(n);
    }
  });
});

describe("the code-made shapes the animals fall back to", () => {
  const sound = (m: MeshData) => {
    const n = m.positions.length / 3;
    expect(m.normals.length).toBe(n * 3);
    expect(m.indices.length % 3).toBe(0);
    expect(m.indices.length).toBeGreaterThan(0);
  };
  it("keeps the cart a cart and the ox a beast of its own, the two together what the one was", () => {
    const cart = oxCart();
    const ox = oxBody();
    sound(cart);
    sound(ox);
    // The ox stands in the cart's frame ahead of the shafts: body and head beyond them, nothing of it in the cart.
    let cartMaxZ = -Infinity;
    for (let i = 2; i < cart.positions.length; i += 3) cartMaxZ = Math.max(cartMaxZ, cart.positions[i]!);
    let oxMinZ = Infinity;
    for (let i = 2; i < ox.positions.length; i += 3) oxMinZ = Math.min(oxMinZ, ox.positions[i]!);
    expect(oxMinZ).toBeGreaterThan(0.5);
    expect(oxMinZ).toBeLessThan(cartMaxZ);
  });
  it("makes the donkey smaller than a horse and sound", () => {
    const d = donkey();
    sound(d);
    let maxY = -Infinity;
    for (let i = 1; i < d.positions.length; i += 3) maxY = Math.max(maxY, d.positions[i]!);
    expect(maxY).toBeLessThan(2.3);
    expect(maxY).toBeGreaterThan(1.5);
  });
});
