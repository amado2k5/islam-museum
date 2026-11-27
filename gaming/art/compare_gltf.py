#!/usr/bin/env python3
"""Compare two glTF files as meshes, not as bytes.

Blender can write the same palace with the same vertex positions but with vertices or triangles in another order;
occasionally a planar face can even be triangulated about another corner. A SHA-256 of the `.bin` therefore answers
only whether the bytes are identical, not whether the model changed. This tool compares, per material:

- exact vertex positions as multisets;
- exact triangles as multisets of their three positions, cyclically rotated to one canonical order but never reversed;
- exact vertices as multisets of every attribute byte (position, normal, texture coordinate, tangent and colour);
- exact triangles as multisets of those whole-attribute vertices.

Usage: python3 art/compare_gltf.py <first.gltf> <second.gltf> [--json <report.json>]
The exit is 0 when the whole-attribute triangle multisets are the same, 1 when they differ, and 2 for a read or format error.
"""
import argparse
import collections
import hashlib
import json
import math
import struct
import sys
from pathlib import Path

COMPONENT = {5120: ("b", 1), 5121: ("B", 1), 5122: ("h", 2), 5123: ("H", 2), 5125: ("I", 4), 5126: ("f", 4)}
WIDTH = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT2": 4, "MAT3": 9, "MAT4": 16}


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


class Gltf:
    def __init__(self, path):
        self.path = Path(path)
        self.gltf = json.loads(self.path.read_text())
        if len(self.gltf.get("buffers", [])) != 1:
            raise ValueError(f"{self.path}: expected one binary buffer, found {len(self.gltf.get('buffers', []))}")
        self.bin_path = self.path.parent / self.gltf["buffers"][0]["uri"]
        self.bin = self.bin_path.read_bytes()

    def accessor(self, index):
        acc = self.gltf["accessors"][index]
        if "sparse" in acc:
            raise ValueError(f"{self.path}: sparse accessor {index} is not supported")
        fmt, size = COMPONENT[acc["componentType"]]
        count = WIDTH[acc["type"]]
        view = self.gltf["bufferViews"][acc["bufferView"]]
        start = view.get("byteOffset", 0) + acc.get("byteOffset", 0)
        stride = view.get("byteStride") or size * count
        raw = [bytes(self.bin[start + i * stride:start + i * stride + size * count]) for i in range(acc["count"])]
        values = []
        for element in raw:
            unpacked = struct.unpack("<" + fmt * count, element)
            values.append(unpacked[0] if count == 1 else unpacked)
        return acc, raw, values

    def primitives(self):
        for mesh_index, mesh in enumerate(self.gltf.get("meshes", [])):
            for primitive_index, primitive in enumerate(mesh.get("primitives", [])):
                if primitive.get("mode", 4) != 4:
                    continue
                material = "(none)"
                if "material" in primitive:
                    material = self.gltf["materials"][primitive["material"]].get("name", f"material-{primitive['material']}")
                yield mesh_index, primitive_index, primitive, material

    def measure(self):
        materials = {}
        total_triangles = 0
        total_vertices = 0
        primitive_count = 0
        for _mesh_index, _primitive_index, primitive, material in self.primitives():
            primitive_count += 1
            attribute_raw = {}
            attribute_values = {}
            vertex_count = None
            for name, accessor_index in primitive.get("attributes", {}).items():
                acc, raw, values = self.accessor(accessor_index)
                if vertex_count is None:
                    vertex_count = acc["count"]
                elif vertex_count != acc["count"]:
                    raise ValueError(f"{self.path}: attributes of {material} do not have the same count")
                attribute_raw[name] = raw
                attribute_values[name] = values
            if vertex_count is None or "POSITION" not in attribute_values:
                continue
            positions = attribute_values["POSITION"]
            names = sorted(attribute_raw, key=lambda name: (name != "POSITION", name))
            vertices = collections.Counter(tuple(attribute_raw[name][i] for name in names) for i in range(vertex_count))
            position_counter = collections.Counter(positions)
            triangles = collections.Counter()
            triangle_positions = collections.Counter()
            zero_area = 0
            indices = []
            if "indices" in primitive:
                _acc, _raw, indices = self.accessor(primitive["indices"])
            else:
                indices = list(range(vertex_count))
            for i in range(0, len(indices) - 2, 3):
                whole = tuple(tuple(attribute_raw[name][index] for name in names) for index in indices[i:i + 3])
                rotations = (whole, (whole[1], whole[2], whole[0]), (whole[2], whole[0], whole[1]))
                triangles[min(rotations)] += 1
                pts = tuple(positions[index] for index in indices[i:i + 3])
                rotations = (pts, (pts[1], pts[2], pts[0]), (pts[2], pts[0], pts[1]))
                triangle_positions[min(rotations)] += 1
                a, b, c = pts
                ab = [b[j] - a[j] for j in range(3)]
                ac = [c[j] - a[j] for j in range(3)]
                cross = (ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0])
                if math.sqrt(sum(v * v for v in cross)) == 0:
                    zero_area += 1
            triangle_count = len(indices) // 3
            total_triangles += triangle_count
            total_vertices += vertex_count
            entry = materials.setdefault(material, {"vertices": collections.Counter(), "positions": collections.Counter(), "triangles": collections.Counter(), "trianglePositions": collections.Counter(), "triangleCount": 0, "vertexCount": 0, "zeroArea": 0})
            entry["vertices"].update(vertices)
            entry["positions"].update(position_counter)
            entry["triangles"].update(triangles)
            entry["trianglePositions"].update(triangle_positions)
            entry["triangleCount"] += triangle_count
            entry["vertexCount"] += vertex_count
            entry["zeroArea"] += zero_area
        return {
            "path": str(self.path),
            "gltfSha256": sha256(self.path),
            "binSha256": sha256(self.bin_path),
            "binBytes": self.bin_path.stat().st_size,
            "materials": materials,
            "triangles": total_triangles,
            "vertices": total_vertices,
            "primitives": primitive_count,
        }


def counter_diff(first, second):
    return sum((first - second).values()), sum((second - first).values())


def compare(first_path, second_path):
    first = Gltf(first_path).measure()
    second = Gltf(second_path).measure()
    names = sorted(set(first["materials"]) | set(second["materials"]))
    rows = []
    same = True
    for name in names:
        a = first["materials"].get(name)
        b = second["materials"].get(name)
        empty = {"vertices": collections.Counter(), "positions": collections.Counter(), "triangles": collections.Counter(), "trianglePositions": collections.Counter(), "triangleCount": 0, "vertexCount": 0, "zeroArea": 0}
        a = a or empty
        b = b or empty
        position_a, position_b = counter_diff(a["positions"], b["positions"])
        shape_a, shape_b = counter_diff(a["trianglePositions"], b["trianglePositions"])
        vertex_a, vertex_b = counter_diff(a["vertices"], b["vertices"])
        triangle_a, triangle_b = counter_diff(a["triangles"], b["triangles"])
        row = {
            "material": name,
            "vertices": [a["vertexCount"], b["vertexCount"]],
            "triangles": [a["triangleCount"], b["triangleCount"]],
            "zeroArea": [a["zeroArea"], b["zeroArea"]],
            "positionInstancesOnly": [position_a, position_b],
            "trianglePositionInstancesOnly": [shape_a, shape_b],
            "attributeVertexInstancesOnly": [vertex_a, vertex_b],
            "wholeTriangleInstancesOnly": [triangle_a, triangle_b],
        }
        rows.append(row)
        if triangle_a or triangle_b:
            same = False
    return {
        "first": {k: v for k, v in first.items() if k != "materials"},
        "second": {k: v for k, v in second.items() if k != "materials"},
        "byteIdentical": first["binSha256"] == second["binSha256"] and first["gltfSha256"] == second["gltfSha256"],
        "sameWholeAttributeTriangles": same,
        "materials": rows,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("first")
    parser.add_argument("second")
    parser.add_argument("--json")
    args = parser.parse_args()
    try:
        report = compare(args.first, args.second)
    except Exception as exc:
        print(f"compare_gltf: {exc}", file=sys.stderr)
        return 2
    if args.json:
        Path(args.json).parent.mkdir(parents=True, exist_ok=True)
        Path(args.json).write_text(json.dumps(report, indent=1) + "\n")
    print(f"byte identical: {'yes' if report['byteIdentical'] else 'no'}")
    print(f"same whole-attribute triangles: {'yes' if report['sameWholeAttributeTriangles'] else 'no'}")
    print("material | vertices | triangles | positions only in first/second | triangle positions only in first/second | whole triangles only in first/second | exact zero-area")
    for row in report["materials"]:
        print(f"{row['material']} | {row['vertices'][0]}/{row['vertices'][1]} | {row['triangles'][0]}/{row['triangles'][1]} | {row['positionInstancesOnly'][0]}/{row['positionInstancesOnly'][1]} | {row['trianglePositionInstancesOnly'][0]}/{row['trianglePositionInstancesOnly'][1]} | {row['wholeTriangleInstancesOnly'][0]}/{row['wholeTriangleInstancesOnly'][1]} | {row['zeroArea'][0]}/{row['zeroArea'][1]}")
    return 0 if report["sameWholeAttributeTriangles"] else 1


if __name__ == "__main__":
    sys.exit(main())
