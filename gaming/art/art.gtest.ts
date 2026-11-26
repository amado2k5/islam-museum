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
  /** Under evaluation, and not the game's art: drawn only when the page's address asks for it. */
  evaluation?: boolean;
  sources: Array<{ path: string; sha256: string }>;
  objects: string[];
  materials: string[];
  triangles: number;
  bytes: number;
  files: Array<{ path: string; bytes: number; sha256: string }>;
}
const manifest = JSON.parse(readFileSync(resolve(here, "manifest.json"), "utf8")) as { format: string; version: number; tool: string; assets: Asset[] };

describe("the art manifest", () => {
  it("says what made the assets", () => {
    expect(manifest.format).toBe("im.play.art");
    expect(manifest.tool).toMatch(/^Blender \d+\.\d+/);
    expect(manifest.assets.length).toBeGreaterThan(0);
  });

  it("records assets made from the scripts as they are in this commit", () => {
    for (const asset of manifest.assets) {
      for (const source of asset.sources) {
        const now = createHash("sha256").update(readFileSync(resolve(here, "..", source.path))).digest("hex");
        expect(now, `${source.path} has changed since ${asset.id} was built: run the asset again, then npm run art:manifest`).toBe(source.sha256);
      }
    }
  });

  it("records every output with its size and checksum, and a model the game could afford", () => {
    for (const asset of manifest.assets) {
      expect(asset.files.length).toBeGreaterThan(1);
      expect(asset.files.reduce((n, f) => n + f.bytes, 0)).toBe(asset.bytes);
      for (const f of asset.files) expect(f.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(asset.triangles).toBeGreaterThan(1000);
      // One building is not to cost what a whole valley does. This holds for everything the game draws as its own.
      // An asset under evaluation is recorded with what it costs and is held to no budget here, because it is there
      // to be judged, cost included; the test below keeps it out of the game unless it is asked for.
      if (asset.evaluation) continue;
      expect(asset.triangles).toBeLessThan(40_000);
      expect(asset.bytes).toBeLessThan(12_000_000);
    }
  });

  it("keeps what is under evaluation out of the game unless the page's address asks for it", () => {
    const evaluated = manifest.assets.filter((a) => a.evaluation);
    const own = manifest.assets.filter((a) => !a.evaluation);
    expect(own.map((a) => a.id)).toEqual(["granada/mill", "granada/town", "granada/landmarks"]);
    // Everything under evaluation lives in its own folder, apart from the game's set.
    for (const a of evaluated) for (const f of a.files) expect(f.path.startsWith("granada/c/"), f.path).toBe(true);
    for (const a of own) for (const f of a.files) expect(f.path.startsWith("granada/c/"), f.path).toBe(false);
    const view = readFileSync(resolve(here, "../games/granada/src/view/three-valley.ts"), "utf8");
    // The game's own set is the folder it has always been, and the other folder is named only in the table of candidates.
    expect(view).toContain('const MODEL_SET = "granada/2/";');
    const outside = view.replace(/const CANDIDATE_C[\s\S]*?\n};\n/, "");
    expect(outside).not.toContain("granada/c/");
    // That table is reached only through the art the page was asked for, which is nothing unless the address says so.
    expect(view).toContain("if (art) {");
    const page = readFileSync(resolve(here, "../games/granada/src/ui/app.ts"), "utf8");
    expect(page).toContain('art: (["c", "c1", "c2"] as const).find((a) => a === query.get("art")) ?? null,');
  });

  it("keeps the mill's wheel as a part of its own, so the game can turn it", () => {
    const mill = manifest.assets.find((a) => a.id === "granada/mill");
    expect(mill).toBeDefined();
    expect(mill!.objects).toContain("wheel");
    expect(mill!.materials).toEqual(expect.arrayContaining(["plaster", "rooftile", "stone", "wood"]));
  });
});
