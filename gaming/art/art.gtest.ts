// The art pipeline's record. The models themselves are media and are not in git, so nothing here can open one; what
// is held is that the manifest describes assets made from the scripts as they are now. Change a script without
// running it again and recording what came out, and this fails.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
interface Asset {
  id: string;
  game: string;
  sources: Array<{ path: string; sha256: string }>;
  objects: string[];
  materials: string[];
  triangles: number;
  bytes: number;
  files: Array<{ path: string; bytes: number; sha256: string }>;
}
const manifest = JSON.parse(readFileSync(resolve(here, "manifest.json"), "utf8")) as { format: string; version: number; tool: string; assets: Asset[]; proofAssets?: Asset[] };
const allAssets = [...manifest.assets, ...(manifest.proofAssets ?? [])];

describe("the art manifest", () => {
  it("says what made the assets", () => {
    expect(manifest.format).toBe("im.play.art");
    expect(manifest.tool).toMatch(/^Blender \d+\.\d+/);
    expect(manifest.assets.length).toBeGreaterThan(0);
  });

  it("records assets made from the scripts as they are in this commit", () => {
    for (const asset of allAssets) {
      for (const source of asset.sources) {
        const now = createHash("sha256").update(readFileSync(resolve(here, "..", source.path))).digest("hex");
        expect(now, `${source.path} has changed since ${asset.id} was built: run the asset again, then npm run art:manifest`).toBe(source.sha256);
      }
    }
  });

  it("records every output with its size and checksum, and a model the game could afford", () => {
    for (const asset of allAssets) {
      expect(asset.files.length).toBeGreaterThan(1);
      expect(asset.files.reduce((n, f) => n + f.bytes, 0)).toBe(asset.bytes);
      for (const f of asset.files) expect(f.sha256).toMatch(/^[0-9a-f]{64}$/);
      // One building is not to cost what a whole valley does.
      expect(asset.triangles).toBeGreaterThan(1000);
      expect(asset.triangles).toBeLessThan(40_000);
      expect(asset.bytes).toBeLessThan(12_000_000);
    }
  });

  it("keeps local proof assets out of the publishable baseline", () => {
    expect(manifest.assets.map((a) => a.id)).not.toContain("granada/town-3");
    expect(manifest.proofAssets?.map((a) => a.id)).toEqual(expect.arrayContaining(["granada/mill-3", "granada/town-3", "granada/landmarks-3"]));
  });

  it("keeps the mill's wheel as a part of its own, so the game can turn it", () => {
    const mill = manifest.assets.find((a) => a.id === "granada/mill");
    expect(mill).toBeDefined();
    expect(mill!.objects).toContain("wheel");
    expect(mill!.materials).toEqual(expect.arrayContaining(["plaster", "rooftile", "stone", "wood"]));
  });
});
