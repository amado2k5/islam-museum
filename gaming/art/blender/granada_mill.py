"""Granada, hero asset 1: the watermill.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_mill.py -- <out dir> [preview.png]

A two-storey mill house in the manner of al-Andalus: a battered base of coursed rubble, lime-washed walls above,
a roof of barrel tiles on timber rafters, a round-headed door, shuttered and barred windows, a stair to the upper
door, a lean-to store, and an undershot wheel on its axle between the house and a stone pier. The wheel is its own
object, with its origin on the axle, so that the game can turn it. It copies no building.

In this file x runs along the house and the channel, y from the wheel side (negative) to the back, z up.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from common import Part, clear_scene, cut, export_gltf, make_lod, make_materials, render_preview, textures, triangles  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_dir = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/2")
preview = os.path.abspath(argv[1]) if len(argv) > 1 else None

clear_scene()
# The textures are prepared, without loss, in a working folder; the export writes the ones the game is given.
materials = make_materials(textures(os.path.join(out_dir, "_work")))

L, D = 11.0, 8.0          # the house, along x and y
BASE_H, WALL_H = 2.6, 4.0  # stone below, lime wash above
EAVE = BASE_H + WALL_H
PITCH = math.radians(27)
RISE = math.tan(PITCH) * (D / 2)
WHEEL_R = 3.3
AXLE = (1.5, -D / 2 - 1.6, 2.5)

# ---- the walls: stone base, lime-washed storey, and the openings cut through them ----
walls = Part("mill-walls", materials)
walls.box((L + 0.5, D + 0.5, BASE_H), (0, 0, BASE_H / 2), material="stone", bevel=0.08)
walls.box((L + 0.2, D + 0.2, 0.18), (0, 0, BASE_H + 0.09), material="stone", bevel=0.04)
walls.box((L, D, WALL_H), (0, 0, BASE_H + WALL_H / 2), material="plaster", bevel=0.05)
# The gables, carried up under the roof: a triangle of wall at each end.
for sx in (-1, 1):
    walls.prism([(-D / 2, 0), (D / 2, 0), (0, RISE)], 0.42, (sx * (L / 2 - 0.21), 0, EAVE), (0, 0, math.pi / 2), material="plaster")
# The door on the wheel side: jambs and a round arch of cut stones standing a little proud of the wall.
DOOR_X, DOOR_W, SPRING = -3.0, 1.5, 1.75
for sx in (-1, 1):
    for k in range(4):
        walls.box((0.42, 0.3, SPRING / 4 - 0.02), (DOOR_X + sx * (DOOR_W / 2 + 0.2), -D / 2 - 0.27, (k + 0.5) * SPRING / 4), material="stone", bevel=0.03)
for k in range(9):
    a = math.pi * (k + 0.5) / 9
    r = DOOR_W / 2 + 0.2
    walls.box((0.42, 0.3, 0.5), (DOOR_X + math.cos(a) * r, -D / 2 - 0.27, SPRING + math.sin(a) * r), (0, -(a - math.pi / 2), 0), material="stone", bevel=0.03)
walls_obj = walls.build()

cutter = Part("mill-openings", materials)
# The upper door on the west gable; windows on both long walls. (The door below is not cut: it stands in its arch.)
cutter.box((1.2, 1.1, 2.0), (-L / 2, 1.2, BASE_H + 1.0), material="plaster", bevel=0)
for x in (-3.4, 0.4, 3.8):
    for sy in (-1, 1):
        cutter.box((0.85, 1.2, 1.15), (x, sy * D / 2, BASE_H + 2.0), material="plaster", bevel=0)
for x in (1.2, 4.2):
    cutter.box((0.55, 1.2, 0.5), (x, D / 2, 1.5), material="plaster", bevel=0)
cut(walls_obj, cutter.build())

# ---- woodwork and iron: doors, frames, shutters, bars, the rafters' ends, the stair's rail ----
wood = Part("mill-woodwork", materials)
# The door's leaf, round-headed, of upright planks with three iron straps, set back inside its arch of stone.
wood.box((DOOR_W, 0.09, SPRING), (DOOR_X, -D / 2 - 0.3, SPRING / 2), material="wood", bevel=0.01, grain=2)
wood.cylinder(DOOR_W / 2, 0.09, (DOOR_X, -D / 2 - 0.3, SPRING), (math.pi / 2, 0, 0), material="wood", segments=24, grain=2)
for z in (0.4, 1.1, 1.8):
    wood.box((DOOR_W - 0.04, 0.03, 0.09), (DOOR_X, -D / 2 - 0.36, z), material="iron", bevel=0)
wood.cylinder(0.05, 0.06, (DOOR_X + 0.5, -D / 2 - 0.38, 1.05), (math.pi / 2, 0, 0), material="iron", segments=10)
wood.box((0.09, 1.14, 1.96), (-L / 2 + 0.22, 1.2, BASE_H + 1.0), material="wood", bevel=0.01, grain=2)
for x in (-3.4, 0.4, 3.8):
    for sy in (-1, 1):
        y = sy * (D / 2 + 0.03)
        # A frame, two shutters folded back against the wall, and three iron bars.
        wood.box((1.0, 0.1, 0.09), (x, y, BASE_H + 1.4), material="wood", bevel=0.01, grain=0)
        wood.box((1.0, 0.1, 0.09), (x, y, BASE_H + 2.6), material="wood", bevel=0.01, grain=0)
        for sx in (-1, 1):
            wood.box((0.4, 0.05, 1.12), (x + sx * 0.66, y + sy * 0.03, BASE_H + 2.0), material="wood", bevel=0.008, grain=2)
        for k in (-0.22, 0, 0.22):
            wood.cylinder(0.014, 1.14, (x + k, sy * (D / 2 - 0.12), BASE_H + 2.0), material="iron", segments=6)
# Rafter ends under each eave.
for i in range(15):
    x = -L / 2 + 0.3 + i * (L - 0.6) / 14
    for sy in (-1, 1):
        wood.box((0.13, 0.75, 0.16), (x, sy * (D / 2 + 0.3), EAVE - 0.04), (sy * -PITCH, 0, 0), material="wood", bevel=0.01, grain=1)
woodwork_obj = wood.build()

# ---- the roof: two tiled slopes, a ridge of half-round caps, and the tile ends along each eave ----
roof = Part("mill-roof", materials)
slope = (D / 2 + 0.75) / math.cos(PITCH)
for sy in (-1, 1):
    mid_y = sy * (D / 2 + 0.75) / 2
    mid_z = EAVE + RISE - math.tan(PITCH) * abs(mid_y) + 0.12
    roof.box((L + 0.9, slope, 0.16), (0, mid_y, mid_z), (sy * -PITCH, 0, 0), material="rooftile", bevel=0.02)
    for i in range(45):
        x = -L / 2 - 0.36 + i * 0.25 + 0.125
        roof.cylinder(0.105, 0.5, (x, sy * (D / 2 + 0.62), EAVE - 0.2 + 0.08), (math.pi / 2 + sy * -PITCH, 0, 0), material="rooftile", segments=10)
for i in range(24):
    x = -L / 2 - 0.3 + i * 0.5
    roof.cylinder(0.17, 0.54, (x, 0, EAVE + RISE + 0.2), (0, math.pi / 2, 0), material="rooftile", segments=12, radius_top=0.15)
# A chimney through the back slope.
roof.box((0.8, 0.8, 2.3), (3.2, 1.6, EAVE + RISE - 0.1), material="plaster", bevel=0.03)
roof.box((1.05, 1.05, 0.12), (3.2, 1.6, EAVE + RISE + 1.1), material="rooftile", bevel=0.02)
roof.box((0.5, 0.5, 0.35), (3.2, 1.6, EAVE + RISE + 0.9), material="dark", bevel=0)
roof_obj = roof.build()

# ---- stonework outside: the stair to the upper door, the pier that carries the axle, the door's step ----
stone = Part("mill-stonework", materials)
steps = 11
for i in range(steps):
    stone.box((1.3, 0.38, 0.24), (-L / 2 - 0.7, 1.2 - 1.0 - (steps - 1 - i) * 0.36, (i + 0.5) * BASE_H / steps), material="stone", bevel=0.02)
    stone.box((1.3, 0.38, (i + 0.5) * BASE_H / steps - 0.12), (-L / 2 - 0.7, 1.2 - 1.0 - (steps - 1 - i) * 0.36, ((i + 0.5) * BASE_H / steps - 0.12) / 2), material="stone", bevel=0)
stone.box((1.3, 1.7, 0.2), (-L / 2 - 0.7, 1.25, BASE_H - 0.1), material="stone", bevel=0.03)
stone.box((1.3, 1.7, BASE_H - 0.2), (-L / 2 - 0.7, 1.25, (BASE_H - 0.2) / 2), material="stone", bevel=0.04)
stone.box((2.6, 1.0, 0.22), (DOOR_X, -D / 2 - 0.7, 0.11), material="stone", bevel=0.03)
pier_y = AXLE[1] - 1.45
stone.box((1.6, 1.0, AXLE[2] - 0.2), (AXLE[0], pier_y, (AXLE[2] - 0.2) / 2), material="stone", bevel=0.06)
stone.box((1.9, 1.3, 0.3), (AXLE[0], pier_y, 0.15), material="stone", bevel=0.04)
stonework_obj = stone.build()

# ---- the lean-to store against the east gable, and what stands about a mill ----
extras = Part("mill-extras", materials)
extras.box((3.4, 5.0, 2.7), (L / 2 + 1.7, 1.0, 1.35), material="plaster", bevel=0.05)
extras.box((3.9, 5.6, 0.14), (L / 2 + 1.75, 1.0, 3.0), (0, math.radians(14), 0), material="rooftile", bevel=0.02)
extras.box((0.07, 1.1, 1.9), (L / 2 + 3.42, 0.2, 0.95), material="wood", bevel=0.01, grain=2)
# Bearing blocks under the axle, on the house wall and on the pier.
extras.box((0.7, 0.5, 0.4), (AXLE[0], -D / 2 - 0.2, AXLE[2] - 0.38), material="wood", bevel=0.03, grain=0)
extras.box((0.7, 0.6, 0.4), (AXLE[0], pier_y, AXLE[2] - 0.1), material="wood", bevel=0.03, grain=0)
# A worn millstone leaning by the door, and sacks.
extras.cylinder(0.72, 0.2, (-4.9, -D / 2 - 0.25, 0.7), (math.radians(78), 0, 0), material="stone", segments=24)
for (x, y, s) in [(-1.2, -D / 2 - 0.5, 1.0), (-0.5, -D / 2 - 0.45, 0.9), (-0.9, -D / 2 - 0.5, 0.8)]:
    extras.box((0.55 * s, 0.4 * s, 0.75 * s), (x, y, 0.38 * s + (0.6 if s < 0.85 else 0)), (0, 0.12, 0.2 * s), material="earth", bevel=0.09)
extras_obj = extras.build()

# ---- the wheel, about its own axle: the axle lies along y, so the wheel stands in the x-z plane ----
wheel = Part("wheel", materials)
half = 0.55
inner = WHEEL_R - 0.5
segments = 24
for i in range(segments):
    a = (i + 0.5) / segments * math.tau
    chord = 2 * WHEEL_R * math.sin(math.pi / segments) + 0.04
    for sy in (-1, 1):
        # Two rims a side, each of straight felloes.
        wheel.box((chord, 0.1, 0.22), (math.cos(a) * (WHEEL_R - 0.11), sy * half, math.sin(a) * (WHEEL_R - 0.11)), (0, -a + math.pi / 2, 0), material="wood", bevel=0.012, grain=0)
        wheel.box((chord * inner / WHEEL_R, 0.1, 0.16), (math.cos(a) * inner, sy * half, math.sin(a) * inner), (0, -a + math.pi / 2, 0), material="wood", bevel=0.012, grain=0)
    # A paddle between the rims, standing out beyond them.
    b = i / segments * math.tau
    wheel.box((0.85, 2 * half + 0.16, 0.05), (math.cos(b) * (WHEEL_R - 0.05), 0, math.sin(b) * (WHEEL_R - 0.05)), (0, -b, 0), material="wood", bevel=0.008, grain=1)
for i in range(8):
    a = i / 8 * math.tau
    for sy in (-1, 1):
        wheel.box((inner, 0.09, 0.14), (math.cos(a) * inner / 2, sy * half, math.sin(a) * inner / 2), (0, -a, 0), material="wood", bevel=0.012, grain=0)
wheel.cylinder(0.24, 4.3, (0, 0, 0), (math.pi / 2, 0, 0), material="wood", segments=8, grain=2)
for y in (-half - 0.12, half + 0.12, -1.9, 1.9):
    wheel.cylinder(0.27, 0.08, (0, y, 0), (math.pi / 2, 0, 0), material="iron", segments=16)
wheel_obj = wheel.build(location=(AXLE[0], AXLE[1] + 0.25, AXLE[2]))

asset = [walls_obj, woodwork_obj, roof_obj, stonework_obj, extras_obj, wheel_obj]
count = triangles(asset)
print(f"ART mill: {count} triangles in {len(asset)} objects", flush=True)
exported = []
for obj in asset:
    exported.append(obj)
    exported.append(make_lod(obj))
export_gltf(os.path.join(out_dir, "mill.gltf"), exported)
for obj in exported:
    if obj.name.endswith("-lod1"):
        obj.hide_render = True
print("ART mill: exported", os.path.join(out_dir, "mill.gltf"))

if preview:
    # For the picture only: the channel the wheel stands in, and its water.
    show = Part("preview-channel", materials)
    for sy in (-1, 1):
        show.box((26, 0.5, 1.0), (AXLE[0], AXLE[1] + 0.25 + sy * 1.15, 0.1), material="stone", bevel=0.04)
    show.box((26, 1.8, 0.04), (AXLE[0], AXLE[1] + 0.25, 0.36), material="water", bevel=0)
    show.build()
    render_preview(preview, look_at=(0.5, -1.0, 3.2), distance=27, azimuth_deg=-32, elevation_deg=16, ground_material=materials["earth"])
    print("ART mill: preview", preview)
