// Hudhud's texture-atlas pipeline, proven on synthetic coloured rectangles. The founder's reference pictures are
// deliberately not used here: they are direction only, not game art.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const gaming = resolve(here, "..", "..");
const packer = resolve(here, "pack.py");

function syntheticParts() {
  const root = mkdtempSync(join(tmpdir(), "hudhud-atlas-"));
  const parts = join(root, "parts");
  const out = join(root, "out");
  execFileSync("python3", ["-c", `
from pathlib import Path
from PIL import Image, ImageDraw
import json
p=Path(${JSON.stringify(parts)});p.mkdir()
for name,w,h,color,pivot in [
 ('bird-body',120,90,(240,120,40,255),{'x':0.5,'y':0.55}),
 ('bird-crest',80,110,(250,190,40,255),{'x':0.5,'y':1.0}),
 ('wing-spread',180,140,(30,20,15,255),{'x':0.1,'y':0.3}),
]:
 im=Image.new('RGBA',(w,h),(0,0,0,0));d=ImageDraw.Draw(im);d.rounded_rectangle((2,2,w-3,h-3),radius=12,fill=color)
 im.save(p/(name+'.png'))
 (p/(name+'.part.json')).write_text(json.dumps({'pivot':pivot,'maker':'pipeline test','licence':'synthetic test part'}))
`]);
  return { root, parts, out };
}

function run(args: string[], expectFailure = false) {
  try {
    return execFileSync("python3", [packer, ...args], { cwd: gaming, encoding: "utf8" });
  } catch (error) {
    if (expectFailure) return String((error as { stderr?: unknown }).stderr || (error as Error).message);
    throw error;
  }
}

describe("the Hudhud atlas pipeline", () => {
  it("packs synthetic PNG parts into a 2048 WebP atlas, a Phaser frame map and a provenance manifest", () => {
    const { parts, out } = syntheticParts();
    const text = run([parts, out, "--name", "test-atlas"]);
    expect(text).toContain("wrote 1 atlas");

    const image = readFileSync(join(out, "test-atlas.webp"));
    expect(image.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(image.subarray(8, 12).toString("ascii")).toBe("WEBP");

    const frames = JSON.parse(readFileSync(join(out, "test-atlas.json"), "utf8"));
    expect(frames.meta.size).toEqual({ w: 2048, h: 2048 });
    expect(frames.meta.image).toBe("test-atlas.webp");
    expect(Object.keys(frames.frames).sort()).toEqual(["bird-body", "bird-crest", "wing-spread"]);
    expect(frames.frames["bird-body"].frame.w).toBe(120);
    expect(frames.frames["bird-body"].pivot).toEqual({ x: 0.5, y: 0.55 });

    const manifest = JSON.parse(readFileSync(join(out, "test-atlas.manifest.json"), "utf8"));
    expect(manifest.format).toBe("im.hudhud.texture-atlases");
    expect(manifest.atlasSize).toBe(2048);
    expect(manifest.atlases).toHaveLength(1);
    const body = manifest.atlases[0].parts.find((p: { frame: string }) => p.frame === "bird-body");
    expect(body.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(body.dimensions).toEqual({ w: 120, h: 90 });
    expect(body.decodedBytes).toBe(120 * 90 * 4);
    expect(body.pivot.pixels).toEqual({ x: 60, y: 49.5 });
    expect(body.provenance).toMatchObject({ maker: "pipeline test", licence: "synthetic test part" });
    expect(body.provenance.transformations).toContain("lossless WebP");
  });

  it("passes its own check after packing", () => {
    const { parts, out } = syntheticParts();
    run([parts, out, "--name", "test-atlas"]);
    expect(run([parts, out, "--name", "test-atlas", "--check"])).toContain("atlas check passed");
  });

  it("fails the check when a source changes before the manifest is renewed", () => {
    const { parts, out } = syntheticParts();
    run([parts, out, "--name", "test-atlas"]);
    execFileSync("python3", ["-c", `
from pathlib import Path
from PIL import Image
p=Path(${JSON.stringify(parts)})/'bird-body.png'
im=Image.open(p).convert('RGBA');im.putpixel((5,5),(255,255,255,255));im.save(p)
`]);
    const failure = run([parts, out, "--name", "test-atlas", "--check"], true);
    expect(failure).toContain("source changed without renewing the manifest: bird-body.png");
  });

  it("never writes a 4096 atlas silently: overflow becomes another 2048 atlas and says why", () => {
    const root = mkdtempSync(join(tmpdir(), "hudhud-atlas-large-"));
    const parts = join(root, "parts");
    const out = join(root, "out");
    execFileSync("python3", ["-c", `
from pathlib import Path
from PIL import Image
p=Path(${JSON.stringify(parts)});p.mkdir()
for i in range(3): Image.new('RGBA',(1200,1200),(i*40,20,20,255)).save(p/f'large-{i}.png')
`]);
    const text = run([parts, out, "--name", "large"]);
    expect(text).toContain("needed 3 atlases at 2048×2048; no larger atlas was written");
    const manifest = JSON.parse(readFileSync(join(out, "large.manifest.json"), "utf8"));
    expect(manifest.atlases).toHaveLength(3);
    expect(manifest.atlases.every((a: { image: { width: number; height: number } }) => a.image.width === 2048 && a.image.height === 2048)).toBe(true);
  });
});
