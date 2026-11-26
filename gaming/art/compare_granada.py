#!/usr/bin/env python3
"""Compares Granada's model set 3 with set 2: same piece names, origins and outer sizes, plus one LOD each.

The comparison is deliberately small and dependency-free so it can run in the repository's checks without opening
Blender. Sizes are read from the glTF POSITION accessors in the export's own axes (x, y-up, z).
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
MODELS = HERE.parent / "media" / "models" / "granada"
TOLERANCE_M = 0.0


def load(path):
    gltf = json.loads(path.read_text())
    objects = {}
    for node in gltf["nodes"]:
        if "mesh" not in node:
            continue
        mesh = gltf["meshes"][node["mesh"]]
        mins, maxs, triangles = [], [], 0
        for primitive in mesh["primitives"]:
            accessor = gltf["accessors"][primitive["attributes"]["POSITION"]]
            mins.append(accessor["min"])
            maxs.append(accessor["max"])
            triangles += gltf["accessors"][primitive["indices"]]["count"] // 3
        low = [min(v[i] for v in mins) for i in range(3)]
        high = [max(v[i] for v in maxs) for i in range(3)]
        objects[node["name"]] = {
            "translation": node.get("translation", [0, 0, 0]),
            "min": low,
            "max": high,
            "size": [high[i] - low[i] for i in range(3)],
            "triangles": triangles,
            "extras": node.get("extras", {}),
        }
    return objects


def compare_file(label, old_path, new_path, errors):
    old, new = load(old_path), load(new_path)
    print(f"{label}: {len(old)} objects in set 2")
    for name, before in old.items():
        if name not in new:
            errors.append(f"{label}: {name} is missing from set 3")
            continue
        after = new[name]
        for axis in range(3):
            dt = abs(after["translation"][axis] - before["translation"][axis])
            ds = abs(after["size"][axis] - before["size"][axis])
            if dt > TOLERANCE_M:
                errors.append(f"{label}: {name} origin axis {axis} differs by {dt:.6g} m")
            if ds > TOLERANCE_M:
                errors.append(f"{label}: {name} size axis {axis} differs by {ds:.4f} m ({before['size'][axis]:.4f} to {after['size'][axis]:.4f})")
        lod_name = f"{name}-lod1"
        if lod_name not in new:
            errors.append(f"{label}: {name} has no {lod_name}")
            continue
        lod = new[lod_name]
        if lod["extras"].get("lodOf") != name or lod["extras"].get("lodLevel") != 1:
            errors.append(f"{label}: {lod_name} lacks its lodOf/lodLevel extras")
        ratio = lod["triangles"] / after["triangles"] if after["triangles"] else 0
        if not 0.2 <= ratio <= 0.45:
            errors.append(f"{label}: {lod_name} is {ratio:.2f} of the high piece, not about a third")
        print(f"  {name}: high {before['triangles']} -> {after['triangles']} triangles; LOD {lod['triangles']} ({ratio:.2f}); size delta {max(abs(after['size'][i] - before['size'][i]) for i in range(3)):.6g} m")
    for name in new:
        if name not in old and not name.endswith("-lod1"):
            errors.append(f"{label}: unexpected new object {name}")
        if name.endswith("-lod1") and name[:-5] not in old:
            errors.append(f"{label}: LOD object {name} has no high piece in set 2")


def compare_kit(label, old_path, new_path, errors):
    old = json.loads(old_path.read_text())["pieces"]
    new = json.loads(new_path.read_text())["pieces"]
    if set(old) != set(new):
        errors.append(f"{label}: piece names differ: {sorted(set(old) ^ set(new))}")
    for name in sorted(set(old) & set(new)):
        if set(old[name]) != set(new[name]):
            errors.append(f"{label}: {name} fields differ: {sorted(set(old[name]) ^ set(new[name]))}")
        if old[name]["footprint"] != new[name]["footprint"]:
            errors.append(f"{label}: {name} footprint changed from {old[name]['footprint']} to {new[name]['footprint']}")
        if not isinstance(new[name].get("triangles"), int):
            errors.append(f"{label}: {name} has no integer triangle count")
    print(f"{label}: kit piece names, fields and footprints agree")


def main():
    errors = []
    for label, entry, kit in (("town", "town.gltf", "town.kit.json"), ("landmarks", "landmarks.gltf", "landmarks.kit.json"), ("mill", "mill.gltf", None)):
        compare_file(label, MODELS / "2" / entry, MODELS / "3" / entry, errors)
        if kit:
            compare_kit(kit, MODELS / "2" / kit, MODELS / "3" / kit, errors)
    if errors:
        for error in errors:
            print("ERROR:", error)
        return 1
    print("granada/3 keeps every set-2 object name, origin, exact outer size and kit footprint, with one LOD for each object")
    return 0


if __name__ == "__main__":
    sys.exit(main())
