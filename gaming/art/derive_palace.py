#!/usr/bin/env python3
"""Makes the palace the game shows from the lighter export of the palace script.

The export (media/models/granada/c/palace-lod1.gltf) carries its own copies of textures the first set already has.
This copies the model into a folder of its own, media/models/granada/p1/, and points its textures at the first set's,
after checking that each is byte for byte the same file, so that a player fetches them once.

Usage, from gaming/, after `npm run art:palace-c -- --detail=lod1`:  python3 art/derive_palace.py
"""
import hashlib
import json
import pathlib
import shutil

MODELS = pathlib.Path(__file__).resolve().parent.parent / "media" / "models" / "granada"
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
src, dst = MODELS / "c", MODELS / "p1"
dst.mkdir(parents=True, exist_ok=True)
gltf = json.loads((src / "palace-lod1.gltf").read_text())
(buffer,) = gltf["buffers"]
shutil.copy(src / buffer["uri"], dst / "palace.bin")
buffer["uri"] = "palace.bin"
for image in gltf["images"]:
    name = pathlib.Path(image["uri"]).name
    shared = MODELS / "2" / "textures" / name
    if not shared.exists() or sha(shared) != sha(src / image["uri"]):
        raise SystemExit(f"{name} is not the first set's file: the palace cannot borrow it")
    image["uri"] = "../2/textures/" + name
(dst / "palace.gltf").write_text(json.dumps(gltf, separators=(",", ":")))
(dst / "palace.kit.json").write_text(json.dumps(json.loads((src / "palace-lod1.kit.json").read_text()), indent=1) + "\n")
print(f"granada/p1/palace.gltf: {len(gltf['images'])} textures borrowed from the first set")
