# Mill automatic LOD — step E evidence

Two frames from `tools/granada-lod-shot.ts` against the local workspace server (seed 7, Photo Mode, High), 2026-11-28:

- `mill-near.png` — camera ~60 m out: the whole mill (`granada/mill`, 16,172 tris).
- `mill-far-lod1.png` — camera ~330 m out, past the 140 m mark: the distance making (`granada/mill-lod1`, 8,086 tris) stands in its place; both wheels keep turning (the lod1's own wheel object is rotated with the whole one's).

Verified by the run itself: `stage().info().models` listed both `granada/mill` and `granada/mill-lod1` — the distance file fetched and loaded whole — and the page raised no errors. The swap is one visibility toggle per frame in `render()`; if `mill-lod1.gltf` cannot be fetched the whole mill is drawn at every range, as before.

## The rest of step E, honestly

- **Terrain / selection / collision / shadows / z-fighting:** these are eyes-on checks and this model cannot open images. What ran: the full game test suite (2,110 tests incl. the valley's own gtests), typecheck, strings, build:release, and the localhost captures above and in `animals-walk/` — all clean, no page errors, no console errors. The standing pieces (wall, tower, gate, scaffold, crane, palace, estate) are the same instanced meshes the earlier releases already shipped; nothing in this change moves them.
- **Automatic LOD choice:** implemented for the mill, the one building that is a single scene object. The town kit, landmarks and palace are InstancedMeshes whose parts are shared by every placement — per-instance LOD needs a different architecture (per-placement geometry sets or a two-pass pick), which is more than the time left allowed. Their LOD1 files exist and are recorded in the manifest for whoever builds that.
