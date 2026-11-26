"""Renders each Granada piece, set 2 at the left and set 3 at the right, for human comparison.

Run: blender --background --factory-startup --python gaming/art/blender/render_granada_compare.py -- <models root> <out dir> [piece]
The renders are evidence only; nothing here is loaded by the game.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from common import render_preview  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
root = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada")
out_dir = os.path.abspath(argv[1]) if len(argv) > 1 else os.path.abspath("gaming/media/renders/granada-3")
only = argv[2] if len(argv) > 2 else None
os.makedirs(out_dir, exist_ok=True)

MILL = ["mill-walls", "mill-woodwork", "mill-roof", "mill-stonework", "mill-extras", "wheel"]
SPECS = {
    "house-a": ("town.gltf", ["house-a"], 10.5, 20, 3.4),
    "house-b": ("town.gltf", ["house-b"], 13.5, 24, 3.6),
    "house-c": ("town.gltf", ["house-c"], 8.5, 22, 4.4),
    "house-d": ("town.gltf", ["house-d"], 11.5, 20, 3.0),
    "wall": ("town.gltf", ["wall"], 13.0, 24, 3.8),
    "tower": ("town.gltf", ["tower"], 10.0, 28, 6.0),
    "gate": ("town.gltf", ["gate"], 12.5, 24, 4.3),
    "scaffold": ("town.gltf", ["scaffold"], 11.0, 24, 4.0),
    "stall": ("town.gltf", ["stall"], 6.0, 11, 1.3),
    "palace": ("landmarks.gltf", ["palace"], 88.0, 130, 13.0),
    "estate": ("landmarks.gltf", ["estate"], 34.0, 48, 4.0),
    "crane": ("landmarks.gltf", ["crane"], 8.0, 22, 4.5),
    "mill": ("mill.gltf", MILL, 18.0, 30, 3.4),
}


def base_name(name):
    return name.rsplit(".", 1)[0] if "." in name and name.rsplit(".", 1)[1].isdigit() else name


def import_piece(path, wanted, prefix, shift):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    imported = [obj for obj in bpy.data.objects if obj not in before]
    kept = []
    for obj in list(imported):
        if base_name(obj.name) in wanted and not base_name(obj.name).endswith("-lod1"):
            obj.name = prefix + base_name(obj.name)
            obj.location.x += shift
            kept.append(obj)
        else:
            bpy.data.objects.remove(obj, do_unlink=True)
    return kept


def ground_material():
    material = bpy.data.materials.get("render-ground")
    if material:
        return material
    material = bpy.data.materials.new("render-ground")
    material.use_nodes = True
    bsdf = material.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.32, 0.25, 0.16, 1)
    bsdf.inputs["Roughness"].default_value = 0.9
    return material


def remove_scene_objects():
    for obj in list(bpy.context.scene.objects):
        bpy.data.objects.remove(obj, do_unlink=True)


failed = []
for piece, (filename, wanted, spacing, distance, look_z) in SPECS.items():
    if only and piece != only:
        continue
    remove_scene_objects()
    old = import_piece(os.path.join(root, "2", filename), wanted, "old-", -spacing / 2)
    new = import_piece(os.path.join(root, "3", filename), wanted, "new-", spacing / 2)
    if len(old) != len(wanted) or len(new) != len(wanted):
        failed.append((piece, len(old), len(new), len(wanted)))
        print(f"ART compare-render: {piece}: missing objects old {len(old)} new {len(new)} wanted {len(wanted)}", flush=True)
        continue
    path = os.path.join(out_dir, f"{piece}.png")
    render_preview(path, look_at=(0, 0, look_z), distance=max(distance, spacing * 2.15), azimuth_deg=-32, elevation_deg=18, ground_material=ground_material(), size=(1600, 1000), samples=40, lens=32)
    print(f"ART compare-render: {piece}: {path}", flush=True)

if failed:
    raise SystemExit("missing objects: " + ", ".join(f"{p} old {a} new {b} wanted {w}" for p, a, b, w in failed))
print("ART compare-render: finished", flush=True)
