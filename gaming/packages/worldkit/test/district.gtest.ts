import { describe, expect, it } from "vitest";
import { hash32 } from "@im/kernel/prng";
import { generateDistrict, updateDynamics } from "../src/district/generate";
import { canalDistance, groundHeight, insideCity, riverDistance } from "../src/district/site";
import { bounds, type MeshData } from "../src/mesh";
import { TEXTURE_KINDS, makeTexture } from "../src/textures";

const digest = (m: MeshData) => {
  let h = 0x811c9dc5;
  const mix = (a: ArrayLike<number>) => {
    for (let i = 0; i < a.length; i += 7) h = hash32(String(Math.round((a[i] as number) * 1000)), h);
  };
  mix(m.positions);
  mix(m.indices);
  return h >>> 0;
};

const checkMesh = (name: string, m: MeshData) => {
  const n = m.positions.length / 3;
  expect(m.normals.length, name).toBe(n * 3);
  expect(m.colors.length, name).toBe(n * 3);
  expect(m.uvs.length, name).toBe(n * 2);
  expect(m.indices.length % 3, name).toBe(0);
  for (let i = 0; i < m.indices.length; i++) if (m.indices[i]! >= n) throw new Error(`${name}: index ${m.indices[i]} out of range ${n}`);
  for (const arr of [m.positions, m.normals, m.colors, m.uvs]) for (let i = 0; i < arr.length; i++) if (!Number.isFinite(arr[i]!)) throw new Error(`${name}: non-finite value at ${i}`);
  for (let i = 0; i < m.normals.length; i += 3) {
    const l = Math.hypot(m.normals[i]!, m.normals[i + 1]!, m.normals[i + 2]!);
    if (l < 0.98 || l > 1.02) throw new Error(`${name}: normal ${i / 3} has length ${l}`);
  }
};

describe("reference district", () => {
  const scene = generateDistrict(7);

  it("is the same scene every time for the same seed", () => {
    const again = generateDistrict(7);
    expect(again.stats).toEqual(scene.stats);
    expect(again.chunks.length).toBe(scene.chunks.length);
    for (let i = 0; i < scene.chunks.length; i++) expect(digest(again.chunks[i]!.mesh)).toBe(digest(scene.chunks[i]!.mesh));
    for (let i = 0; i < scene.instances.length; i++) expect([...again.instances[i]!.matrices.slice(0, 64)]).toEqual([...scene.instances[i]!.matrices.slice(0, 64)]);
  });

  it("differs for a different seed", () => {
    const other = generateDistrict(8);
    expect(other.stats.vertices).not.toBe(scene.stats.vertices);
  });

  it("meets the spike's content budget", () => {
    // docs/gaming/spec-v2/04-GRAPHICS-ENGINE.md: 500 to 1500 visible buildings, 200 to 800 agent proxies.
    expect(scene.stats.buildings).toBeGreaterThanOrEqual(500);
    expect(scene.stats.buildings).toBeLessThanOrEqual(1500);
    expect(scene.stats.walkers).toBeGreaterThanOrEqual(200);
    expect(scene.stats.walkers).toBeLessThanOrEqual(800);
  });

  it("has well-formed geometry in every chunk and prop", () => {
    for (const c of scene.chunks) checkMesh(`${c.material}:${c.cell}`, c.mesh);
    for (const b of scene.instances) {
      checkMesh(b.id, b.mesh);
      expect(b.matrices.length).toBe(b.count * 16);
      expect(b.colors.length).toBe(b.count * 3);
      for (let i = 0; i < b.matrices.length; i++) if (!Number.isFinite(b.matrices[i]!)) throw new Error(`${b.id}: bad matrix`);
    }
    checkMesh("wheel", scene.wheel.mesh);
  });

  it("uses only materials it declares", () => {
    const ids = new Set(scene.materials.map((m) => m.id));
    for (const c of scene.chunks) expect(ids.has(c.material), c.material).toBe(true);
    for (const b of scene.instances) expect(ids.has(b.material), b.material).toBe(true);
  });

  it("keeps people on dry ground inside the wall, at any time", () => {
    const body = scene.instances.find((b) => b.id === "person-body")!;
    for (const t of [0, 13.7, 120, 3600]) {
      updateDynamics(scene, t);
      for (let i = 0; i < body.count; i++) {
        const x = body.matrices[i * 16 + 12]!;
        const y = body.matrices[i * 16 + 13]!;
        const z = body.matrices[i * 16 + 14]!;
        expect(riverDistance(x, z), `walker ${i} at t=${t}`).toBeGreaterThan(0);
        expect(insideCity(x, z), `walker ${i} at t=${t}`).toBeGreaterThan(0);
        expect(Math.abs(y - groundHeight(x, z))).toBeLessThan(1);
      }
    }
    updateDynamics(scene, 0);
  });

  it("keeps sailing boats on the river", () => {
    const sail = scene.instances.find((b) => b.id === "boat-sail")!;
    for (const t of [0, 55, 900]) {
      updateDynamics(scene, t);
      for (let i = 0; i < sail.count; i++) expect(riverDistance(sail.matrices[i * 16 + 12]!, sail.matrices[i * 16 + 14]!)).toBeLessThan(-8);
    }
    updateDynamics(scene, 0);
  });

  it("places the landmarks on land, clear of the canal", () => {
    for (const name of ["libraryDome", "market", "khan", "hammam", "garden"]) {
      const p = scene.landmarks[name]!;
      expect(riverDistance(p[0], p[2]), name).toBeGreaterThan(10);
      expect(canalDistance(p[0], p[2]), name).toBeGreaterThan(5);
    }
  });

  it("stays inside its declared extent, apart from the far ground and water", () => {
    for (const c of scene.chunks) {
      if (c.material === "terrain" || c.material === "water") continue;
      const b = bounds(c.mesh);
      expect(Math.max(Math.abs(b[0]), Math.abs(b[2]), Math.abs(b[3]), Math.abs(b[5])), c.material).toBeLessThan(scene.halfExtent + 40);
    }
  });
});

describe("procedural textures", () => {
  it("are deterministic, opaque and tile without a seam", () => {
    for (const kind of TEXTURE_KINDS) {
      const a = makeTexture(kind, 3, 64);
      const b = makeTexture(kind, 3, 64);
      expect(Buffer.from(a.albedo).equals(Buffer.from(b.albedo)), kind).toBe(true);
      expect(a.albedo.length).toBe(64 * 64 * 4);
      for (let i = 3; i < a.albedo.length; i += 4) if (a.albedo[i] !== 255) throw new Error(`${kind}: transparent texel`);
      // A tiling texture's first and last columns are neighbours: they should differ no more than adjacent columns do.
      let seam = 0;
      let inner = 0;
      for (let y = 0; y < 64; y++) {
        seam += Math.abs(a.albedo[(y * 64) * 4]! - a.albedo[(y * 64 + 63) * 4]!);
        inner += Math.abs(a.albedo[(y * 64 + 31) * 4]! - a.albedo[(y * 64 + 32) * 4]!);
      }
      expect(seam, kind).toBeLessThan(inner * 4 + 64 * 24);
    }
  });
});
