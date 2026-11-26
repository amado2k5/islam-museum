#!/usr/bin/env npx tsx
// Pack transparent PNG parts into 2048×2048 WebP atlases for Hudhud.
// Uses only the gaming workspace's existing playwright-core dependency and the system Chrome already used by the
// game's browser tools. No image library or browser binary is downloaded.
// Usage: npx tsx --tsconfig tsconfig.json art/hudhud/pack.ts <parts-folder> <out-folder> [--name NAME] [--check]
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { chromium } from "playwright-core";

const SIZE = 2048;
const PAD = 2;

interface Part {
  path: string;
  file: string;
  name: string;
  width: number;
  height: number;
  pivot: { x: number; y: number };
  maker: string;
  licence: string;
}
interface Placement { part: Part; x: number; y: number }

function sha(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function pngSize(path: string) {
  const b = readFileSync(path);
  if (b.length < 24 || b.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || b.subarray(12, 16).toString("ascii") !== "IHDR") throw new Error(`${path} is not a PNG with an IHDR`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function loadParts(folder: string): Part[] {
  const files = readdirSync(folder).filter((f) => f.toLowerCase().endsWith(".png") && !f.startsWith(".")).sort();
  if (!files.length) throw new Error(`no PNG parts in ${folder}`);
  return files.map((file) => {
    const path = join(folder, file);
    const sidecar = join(folder, file.replace(/\.png$/i, ".part.json"));
    const meta = existsSync(sidecar) ? JSON.parse(readFileSync(sidecar, "utf8")) : {};
    const pivot = { x: Number(meta.pivot?.x ?? 0.5), y: Number(meta.pivot?.y ?? 0.5) };
    if (!Number.isFinite(pivot.x) || !Number.isFinite(pivot.y) || pivot.x < 0 || pivot.x > 1 || pivot.y < 0 || pivot.y > 1) throw new Error(`${basename(sidecar)}: pivot x/y must be normalized between 0 and 1`);
    const size = pngSize(path);
    if (size.width > SIZE - PAD * 2 || size.height > SIZE - PAD * 2) throw new Error(`${file}: ${size.width}×${size.height} cannot fit a ${SIZE} atlas with padding`);
    return { path, file, name: file.replace(/\.png$/i, ""), ...size, pivot, maker: String(meta.maker ?? "unspecified"), licence: String(meta.licence ?? "unspecified") };
  });
}

function pack(parts: Part[]): Placement[][] {
  const ordered = [...parts].sort((a, b) => b.height - a.height || b.width - a.width || a.name.localeCompare(b.name));
  const atlases: Placement[][] = [];
  let current: Placement[] = [];
  let x = PAD, y = PAD, shelf = 0;
  for (const part of ordered) {
    if (x + part.width + PAD > SIZE) {
      x = PAD;
      y += shelf + PAD;
      shelf = 0;
    }
    if (y + part.height + PAD > SIZE) {
      atlases.push(current);
      current = [];
      x = y = PAD;
      shelf = 0;
    }
    current.push({ part, x, y });
    x += part.width + PAD;
    shelf = Math.max(shelf, part.height);
  }
  if (current.length) atlases.push(current);
  return atlases;
}

function frameMap(placed: Placement[], image: string) {
  const frames: Record<string, unknown> = {};
  for (const { part, x, y } of placed) frames[part.name] = {
    frame: { x, y, w: part.width, h: part.height },
    rotated: false,
    trimmed: false,
    spriteSourceSize: { x: 0, y: 0, w: part.width, h: part.height },
    sourceSize: { w: part.width, h: part.height },
    pivot: part.pivot,
  };
  return { frames, meta: { app: "islam.museum hudhud atlas pipeline", version: "1.0", image, format: "RGBA8888", size: { w: SIZE, h: SIZE }, scale: "1" } };
}

async function renderAtlas(placed: Placement[], imagePath: string) {
  const browser = await chromium.launch({ channel: process.env.BROWSER ?? "chrome", headless: true }).catch((error) => {
    throw new Error(`Chrome is required for WebP encoding through playwright-core, but could not start. No browser is downloaded. ${String(error).split("\n")[0]}`);
  });
  try {
    const page = await browser.newPage();
    const inputs = placed.map(({ part, x, y }) => ({ data: readFileSync(part.path).toString("base64"), x, y }));
    const dataUrl = await page.evaluate(async (rows) => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d")!;
      for (const row of rows) {
        const image = new Image();
        image.src = `data:image/png;base64,${row.data}`;
        await image.decode();
        ctx.drawImage(image, row.x, row.y);
      }
      return canvas.toDataURL("image/webp", 1);
    }, inputs as Array<{ data: string; x: number; y: number }>);
    const encoded = dataUrl.match(/^data:image\/webp;base64,(.+)$/)?.[1];
    if (!encoded) throw new Error("Chrome did not return a WebP image from canvas.toDataURL");
    writeFileSync(imagePath, Buffer.from(encoded, "base64"));
  } finally {
    await browser.close();
  }
}

async function write(partsFolder: string, outFolder: string, name: string) {
  const parts = loadParts(partsFolder);
  const atlases = pack(parts);
  mkdirSync(outFolder, { recursive: true });
  const manifestAtlases = [];
  for (const [index, placed] of atlases.entries()) {
    const suffix = atlases.length > 1 ? String(index) : "";
    const atlasName = `${name}${suffix}`;
    const imageFile = `${atlasName}.webp`;
    const imagePath = join(outFolder, imageFile);
    await renderAtlas(placed, imagePath);
    const frames = frameMap(placed, imageFile);
    const frameFile = `${atlasName}.json`;
    writeFileSync(join(outFolder, frameFile), `${JSON.stringify(frames, null, 2)}\n`);
    const framePath = join(outFolder, frameFile);
    manifestAtlases.push({
      id: atlasName,
      image: { path: imageFile, width: SIZE, height: SIZE, bytes: statSync(imagePath).size, sha256: sha(imagePath) },
      frameMap: { path: frameFile, bytes: statSync(framePath).size, sha256: sha(framePath), format: "phaser-json-hash" },
      parts: placed.map(({ part, x, y }) => ({
        frame: part.name,
        sourceFile: part.file,
        sha256: sha(part.path),
        dimensions: { w: part.width, h: part.height },
        atlasPosition: { x, y },
        pivot: { normalized: part.pivot, pixels: { x: Math.round(part.pivot.x * part.width * 10000) / 10000, y: Math.round(part.pivot.y * part.height * 10000) / 10000 } },
        decodedBytes: part.width * part.height * 4,
        provenance: { maker: part.maker, licence: part.licence, transformations: ["packed without scaling or rotation", "Chrome canvas WebP encoding at quality 1"] },
      })),
    });
  }
  const manifest = { format: "im.hudhud.texture-atlases", version: 1, atlasSize: SIZE, padding: PAD, input: resolve(partsFolder), atlases: manifestAtlases };
  writeFileSync(join(outFolder, `${name}.manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`);
  if (atlases.length > 1) console.log(`needed ${atlases.length} atlases at 2048×2048; no larger atlas was written`);
  console.log(`wrote ${atlases.length} atlas(es); manifest ${join(outFolder, `${name}.manifest.json`)}`);
}

function check(partsFolder: string, outFolder: string, name: string) {
  const parts = loadParts(partsFolder);
  const manifestPath = join(outFolder, `${name}.manifest.json`);
  if (!existsSync(manifestPath)) throw new Error(`missing manifest: run without --check first (${manifestPath})`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.format !== "im.hudhud.texture-atlases") throw new Error("manifest format is not im.hudhud.texture-atlases");
  const errors: string[] = [];
  const recorded: Record<string, { sha256?: string }> = {};
  for (const atlas of manifest.atlases ?? []) {
    for (const kind of ["image", "frameMap"] as const) {
      const item = atlas[kind];
      const path = join(outFolder, item?.path ?? "");
      if (!existsSync(path)) errors.push(`missing ${item?.path}`);
      else if (sha(path) !== item.sha256) errors.push(`${basename(path)} changed since the manifest was renewed`);
    }
    for (const part of atlas.parts ?? []) recorded[part.sourceFile] = part;
  }
  const current = Object.fromEntries(parts.map((p) => [p.file, p]));
  const extra = Object.keys(current).filter((x) => !recorded[x]);
  const missing = Object.keys(recorded).filter((x) => !current[x]);
  if (extra.length || missing.length) errors.push(`input files differ: current ${extra.length ? extra : "none extra"}; missing ${missing.length ? missing : "none"}`);
  for (const [file, part] of Object.entries(current)) {
    const old = recorded[file];
    if (old && sha(part.path) !== old.sha256) errors.push(`source changed without renewing the manifest: ${file}`);
  }
  if (errors.length) throw new Error(`atlas check failed:\n- ${errors.join("\n- ")}`);
  console.log(`atlas check passed: ${parts.length} parts, ${(manifest.atlases ?? []).length} atlas(es)`);
}

async function main() {
  const args = process.argv.slice(2);
  const positional = args.filter((x, i) => !x.startsWith("--") && args[i - 1] !== "--name");
  const name = args.includes("--name") ? args[args.indexOf("--name") + 1] : "hudhud";
  if (positional.length !== 2) throw new Error("usage: pack.ts <parts-folder> <out-folder> [--name NAME] [--check]");
  const [partsFolder, outFolder] = positional;
  if (args.includes("--check")) check(partsFolder, outFolder, name);
  else await write(partsFolder, outFolder, name);
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
