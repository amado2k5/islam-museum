# Hudhud texture and atlas pipeline

This folder contains a small, dependency-free-in-repo pipeline for turning transparent PNG parts into WebP texture atlases that Phaser can read. It uses TypeScript plus the gaming workspace's existing `playwright-core` dependency and system Chrome for standards-compliant WebP encoding. It adds no dependency and downloads no browser binary.

**The founder's reference pictures must not be used as input.** They are direction only. The automated proof uses synthetic coloured rectangles generated inside the test.

## Input

A flat folder of `.png` parts. Each part may have a sidecar named `<part>.part.json`:

```json
{
  "pivot": { "x": 0.5, "y": 1.0 },
  "maker": "artist or approved tool name",
  "licence": "licence or rights state"
}
```

Pivot coordinates are normalized within the part: `0,0` is top-left and `1,1` is bottom-right. The pipeline does not scale, rotate, trim or repaint art. WebP encoding is Chrome canvas encoding at quality 1; do not describe it as lossless.

## Pack

From `gaming/`:

```sh
npx tsx --tsconfig tsconfig.json art/hudhud/pack.ts /path/to/parts /path/to/out --name hudhud-golden-scene
```

Outputs per atlas:

- `hudhud-golden-scene.webp` — a 2048×2048 WebP atlas;
- `hudhud-golden-scene.json` — a Phaser JSON-hash frame map;
- `hudhud-golden-scene.manifest.json` — checksums, dimensions, pivots, decoded byte sizes and provenance for every source part.

If the parts need more than one atlas the tool writes `-0`, `-1`, ... atlases and prints that more than one 2048 atlas was needed. It never silently writes a 4096 atlas; a larger atlas would require a separate measured decision.

## Check after source edits

```sh
npx tsx --tsconfig tsconfig.json art/hudhud/pack.ts /path/to/parts /path/to/out --name hudhud-golden-scene --check
```

The check fails if any input PNG changed, was added or removed without renewing the manifest, or if an output atlas/frame map no longer matches the manifest. Renew by running the pack command again.

## Test

The pipeline test creates its own synthetic PNG parts in a temporary directory:

```sh
npm test -- art/hudhud/atlas-pipeline.gtest.ts
```

## Notes for production

- Source PNGs should be transparent RGBA cut-outs, painted large enough for the game's High preset.
- Sidecars should carry real provenance before production art is accepted. Missing maker/licence values are recorded as `unspecified`, which is acceptable for synthetic tests but not for release art.
- The frame map is standard Phaser JSON hash data. Normalized pivot metadata is carried in each frame and recorded again in the manifest in pixels.
- Packing is deterministic shelf packing with two pixels of padding. The packing positions and frame maps are deterministic; WebP encoder bytes are produced by Chrome and may vary if the browser changes. It is intentionally simple; if later measurements show wasted space, improve the packer rather than hand-editing manifests.
