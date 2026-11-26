"""Tools for a building authored piece by piece (Candidate C), on top of the shared kit in common.py.

Sets A and B drew every building from one kit of boxes. A hero building here is written as its own script, and
these are the things such a script reaches for: a frame that lets a façade be described once and stood on any
side of a building; arches cut as shapes and not stacked from blocks; columns, twin windows, lattices, tiled hip
roofs, merlons with caps; and a pass that paints wear into the mesh itself (damp at the foot of a wall, uneven
render, weathered tile) as vertex colours, which the export carries and the game multiplies into the surface.

In a frame, x runs along the wall, the wall's outer side is -y, and z is up.
"""
import math

import bmesh
import bpy
from mathutils import Vector, noise

from common import TILE, make_materials

PLAIN = {
    # name: (colour, roughness)
    "marble": ((0.78, 0.74, 0.66, 1), 0.45),
    "green": ((0.09, 0.17, 0.05, 1), 0.85),
    "green_dark": ((0.035, 0.085, 0.04, 1), 0.9),
    "green_olive": ((0.2, 0.24, 0.12, 1), 0.85),
    "tile_blue": ((0.05, 0.16, 0.26, 1), 0.3),
    "tile_green": ((0.06, 0.22, 0.14, 1), 0.3),
    "cloth_red": ((0.42, 0.04, 0.03, 1), 0.8),
    "cloth": ((0.62, 0.55, 0.4, 1), 0.85),
    "clay": ((0.46, 0.22, 0.12, 1), 0.7),
}
WEATHERED = ("plaster", "plaster_warm", "plaster_red", "stone", "cobble", "rooftile", "earth", "wood", "marble", "green", "green_dark", "green_olive")

FULL_LEVELS = (0.55, 1.5, 3.2, 6.0, 9.5, 14.0, 19.0, 25.0)
DETAIL_PRESETS = {
    "full": {
        "arch_steps": 14, "column_segments": 10, "window_arch": True, "window_colonette": True,
        "window_trim": "full", "window_bevel": True, "lattice_bars": 4, "lattice_frame": True, "door_arch": True,
        "tree_subdivisions": 2, "tree_balls": 3, "cypress_segments": 8, "putlogs": True,
        "merlon_gap_scale": 1.0, "merlon_caps": True, "column_trim": True, "rafter_spacing": 0.9,
        "weather_grid": 3.1, "weather_levels": FULL_LEVELS, "decimate": 1.0,
    },
    "lod1": {
        "arch_steps": 6, "column_segments": 5, "window_arch": False, "window_colonette": False,
        "window_trim": "simple", "window_bevel": False, "lattice_bars": 1, "lattice_frame": False, "door_arch": True,
        "tree_subdivisions": 1, "tree_balls": 1, "cypress_segments": 5, "putlogs": False,
        "merlon_gap_scale": 2.5, "merlon_caps": True, "column_trim": True, "rafter_spacing": 2.0,
        "weather_grid": 999.0, "weather_levels": (0.55,), "decimate": 1.0,
    },
    "lod2": {
        "arch_steps": 4, "column_segments": 5, "window_arch": False, "window_colonette": False,
        "window_trim": "none", "window_bevel": False, "lattice_bars": 1, "lattice_frame": False, "door_arch": False,
        "tree_subdivisions": 1, "tree_balls": 0, "cypress_segments": 5, "putlogs": False,
        "merlon_gap_scale": 3.2, "merlon_caps": False, "column_trim": False, "rafter_spacing": 2.2,
        "weather_grid": 999.0, "weather_levels": (0.55,), "decimate": 0.45,
    },
}
DETAIL = dict(DETAIL_PRESETS["full"])


def set_detail(level):
    if level not in DETAIL_PRESETS:
        raise ValueError(f"unknown detail level {level!r}")
    DETAIL.clear()
    DETAIL.update(DETAIL_PRESETS[level])


def materials_with_wear(texture_sets):
    """The kit's materials and the plain ones above, each multiplied by the mesh's own colour layer."""
    materials = make_materials(texture_sets)
    for name, (colour, rough) in PLAIN.items():
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = colour
        bsdf.inputs["Roughness"].default_value = rough
        materials[name] = m
    for name, m in materials.items():
        if name not in WEATHERED:
            continue
        nodes, links = m.node_tree.nodes, m.node_tree.links
        bsdf = nodes["Principled BSDF"]
        socket = bsdf.inputs["Base Color"]
        mix = nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs[0].default_value = 1.0
        if socket.is_linked:
            source = socket.links[0].from_socket
            links.remove(socket.links[0])
            links.new(source, mix.inputs[6])
        else:
            mix.inputs[6].default_value = socket.default_value
        layer = nodes.new("ShaderNodeVertexColor")
        layer.layer_name = "Col"
        links.new(layer.outputs["Color"], mix.inputs[7])
        links.new(mix.outputs[2], socket)
    for name in PLAIN:
        TILE.setdefault(name, 1.0)
    return materials


class Frame:
    """A place and a turn about the vertical: what is described in it is stood there."""

    def __init__(self, part, origin=(0.0, 0.0, 0.0), yaw=0.0):
        self.part, self.origin, self.yaw = part, Vector(origin), yaw
        self.cos, self.sin = math.cos(yaw), math.sin(yaw)

    def at(self, loc):
        x, y, z = loc
        return (self.origin.x + x * self.cos - y * self.sin, self.origin.y + x * self.sin + y * self.cos, self.origin.z + z)

    def sub(self, loc=(0, 0, 0), yaw=0.0):
        return Frame(self.part, self.at(loc), self.yaw + yaw)

    def _rot(self, rot):
        return (rot[0], rot[1], rot[2] + self.yaw)

    def box(self, size, loc=(0, 0, 0), rot=(0, 0, 0), material="plaster", bevel=0.0, grain=None):
        self.part.box(size, self.at(loc), self._rot(rot), material=material, bevel=bevel, grain=grain)

    def cylinder(self, radius, depth, loc=(0, 0, 0), rot=(0, 0, 0), material="wood", segments=12, radius_top=None, grain=None):
        self.part.cylinder(radius, depth, self.at(loc), self._rot(rot), material=material, segments=segments, radius_top=radius_top, grain=grain)

    def prism(self, outline, depth, loc=(0, 0, 0), rot=(0, 0, 0), material="plaster", grain=None):
        self.part.prism(outline, depth, self.at(loc), self._rot(rot), material=material, grain=grain)

    def slab(self, points, thickness, loc=(0, 0, 0), rot=(0, 0, 0), material="rooftile", grain=None):
        """A flat shape given as (x, y) points, counter-clockwise from above, `thickness` deep."""
        bm = self.part.bm
        low = [bm.verts.new((x, y, 0.0)) for x, y in points]
        high = [bm.verts.new((x, y, thickness)) for x, y in points]
        n = len(points)
        bm.faces.new(high)
        bm.faces.new(list(reversed(low)))
        for i in range(n):
            bm.faces.new([low[i], low[(i + 1) % n], high[(i + 1) % n], high[i]])
        self.part._finish(low + high, material, self.at(loc), self._rot(rot), grain)

    def ball(self, radius, loc, material="green", squash=1.0, subdivisions=1):
        made = bmesh.ops.create_icosphere(self.part.bm, subdivisions=subdivisions, radius=radius)["verts"]
        where = Vector(self.at(loc))
        for v in made:
            lump = 1.0 + 0.22 * noise.noise((v.co + where) * (1.6 / max(radius, 0.4)))
            v.co = Vector((v.co.x * lump, v.co.y * lump, v.co.z * lump * squash))
        self.part._finish(made, material, self.at(loc), self._rot((0, 0, 0)), None)


# ------------------------------------------------------------------ arches ----
def horseshoe(width, spring, turn=math.radians(24), steps=None):
    """The line of a horseshoe arch's opening from its left foot to its right: it closes in again below its widest."""
    if steps is None:
        steps = DETAIL["arch_steps"]
    r = (width / 2) / math.cos(turn)
    centre = spring + r * math.sin(turn)
    points = [(-width / 2, 0.0)]
    for k in range(steps + 1):
        a = math.pi + turn - (math.pi + 2 * turn) * k / steps
        points.append((r * math.cos(a), centre + r * math.sin(a)))
    points.append((width / 2, 0.0))
    return points, centre + r


def arch_panel(frame, width, height, opening, spring, loc, depth=0.3, material="plaster", turn=math.radians(24)):
    """A piece of wall `width` by `height` with a horseshoe opening through it, standing on loc."""
    line, top = horseshoe(opening, spring, turn)
    if top > height - 0.05:
        raise ValueError(f"an arch {top:.2f} m high does not fit a panel of {height:.2f} m")
    outline = [(-width / 2, 0.0)] + line + [(width / 2, 0.0), (width / 2, height), (-width / 2, height)]
    frame.prism(outline, depth, loc, material=material)
    return top


def column(frame, x, y, z, height, radius=0.13, material="marble"):
    if not DETAIL["column_trim"]:
        frame.cylinder(radius, height, (x, y, z + height / 2), material=material, segments=DETAIL["column_segments"], radius_top=radius * 0.86)
        return
    frame.box((radius * 3.2, radius * 3.2, 0.14), (x, y, z + 0.07), material=material, bevel=0.02)
    frame.cylinder(radius, height - 0.48, (x, y, z + 0.14 + (height - 0.48) / 2), material=material, segments=DETAIL["column_segments"], radius_top=radius * 0.86)
    frame.cylinder(radius * 1.25, 0.06, (x, y, z + height - 0.31), material=material, segments=DETAIL["column_segments"])
    frame.box((radius * 3.4, radius * 3.4, 0.28), (x, y, z + height - 0.14), material=material, bevel=0.04)


def arcade(frame, bays, bay, height, x0=0.0, y=0.0, z=0.0, band="tile_blue", roof_depth=0.0, material="plaster", middle_wider=0.0):
    """A row of horseshoe arches on slender columns, with a framed band over them and, if asked, a tiled lean-to
    roof running back (toward +y) `roof_depth` metres. Its outer face is at y, looking toward -y. Returns its top."""
    widths = [bay + (middle_wider if bays % 2 == 1 and i == bays // 2 else 0.0) for i in range(bays)]
    total = sum(widths)
    edge = x0 - total / 2
    shaft = height * 0.56
    panel_h = height - shaft
    for i, w in enumerate(widths):
        centre = edge + w / 2
        arch_panel(frame, w, panel_h, w - 0.42, panel_h * 0.16, (centre, y + 0.15, z + shaft), depth=0.3, material=material, turn=math.radians(20))
        # The thin frame round each arch, proud of the wall.
        frame.box((w - 0.1, 0.05, 0.07), (centre, y - 0.02, z + height - 0.3), material="stone")
        if i:
            column(frame, edge, y + 0.15, z, shaft)
        edge += w
    for end in (x0 - total / 2, x0 + total / 2):
        frame.box((0.5, 0.5, shaft + 0.02), (end, y + 0.15, z + shaft / 2), material=material, bevel=0.02)
        frame.box((0.62, 0.62, 0.16), (end, y + 0.15, z + shaft - 0.08), material="stone", bevel=0.02)
    frame.box((total + 0.5, 0.36, 0.2), (x0, y + 0.15, z + height + 0.1), material="stone", bevel=0.02)
    if band:
        frame.box((total + 0.1, 0.04, 0.22), (x0, y - 0.02, z + height - 0.12), material=band)
    if roof_depth:
        pitch = math.radians(20)
        run = (roof_depth + 0.45) / math.cos(pitch)
        frame.slab([(-total / 2 - 0.3, 0), (total / 2 + 0.3, 0), (total / 2 + 0.3, run), (-total / 2 - 0.3, run)], 0.12, (x0, y - 0.3, z + height + 0.16), (pitch, 0, 0))
        spacing = DETAIL["rafter_spacing"]
        for k in range(int(total // spacing) + 1):
            frame.box((0.09, 0.5, 0.11), (x0 - total / 2 + 0.2 + k * spacing, y - 0.12, z + height + 0.14), material="wood")
    return z + height + 0.2


def twin_window(frame, x, z, width=1.5, height=1.9, y=0.0, frame_material="stone", inner="plaster", band=None):
    """Two small horseshoe lights with a colonette between them, in a square frame: a window to look out of."""
    frame.box((width, 0.1, height), (x, y - 0.01, z + height / 2), material="dark")
    half = width / 2
    if DETAIL["window_arch"]:
        for s in (-1, 1):
            arch_panel(frame, half, height, half - 0.2, height * 0.5, (x + s * half / 2, y - 0.08, z), depth=0.1, material=inner, turn=math.radians(22))
    if DETAIL["window_colonette"]:
        frame.cylinder(0.05, height * 0.56, (x, y - 0.1, z + height * 0.28), material="marble", segments=8)
        frame.box((0.16, 0.14, 0.1), (x, y - 0.1, z + height * 0.59), material="marble")
    if DETAIL["window_trim"] in ("full", "simple"):
        bevel = 0.015 if DETAIL["window_bevel"] else 0.0
        frame.box((width + 0.36, 0.1, 0.16), (x, y - 0.1, z + height + 0.08), material=frame_material, bevel=bevel)
        frame.box((width + 0.44, 0.22, 0.12), (x, y - 0.13, z - 0.06), material=frame_material, bevel=bevel)
    if DETAIL["window_trim"] == "full":
        for s in (-1, 1):
            frame.box((0.14, 0.1, height), (x + s * (half + 0.07), y - 0.1, z + height / 2), material=frame_material)
    if band:
        frame.box((width + 0.36, 0.03, 0.14), (x, y - 0.045, z + height + 0.25), material=band)


def lattice(frame, x, z, width=1.0, height=1.4, y=0.0, bars=None):
    """A window closed by a wooden lattice in a wooden frame, on a stone sill."""
    if bars is None:
        bars = DETAIL["lattice_bars"]
    frame.box((width, 0.08, height), (x, y - 0.01, z + height / 2), material="dark")
    for k in range(1, bars):
        frame.box((0.04, 0.04, height), (x - width / 2 + k * width / bars, y - 0.07, z + height / 2), material="wood")
        frame.box((width, 0.04, 0.04), (x, y - 0.075, z + k * height / bars), material="wood")
    if DETAIL["lattice_frame"]:
        for s in (-1, 1):
            frame.box((0.09, 0.1, height + 0.18), (x + s * (width / 2 + 0.045), y - 0.08, z + height / 2), material="wood", grain=2)
        frame.box((width + 0.18, 0.1, 0.09), (x, y - 0.08, z + height + 0.045), material="wood", grain=0)
        frame.box((width + 0.3, 0.2, 0.09), (x, y - 0.1, z - 0.045), material="stone", bevel=0.015)


def arched_door(frame, x, width=1.8, height=2.5, y=0.0, z=0.0, surround="stone", band="tile_green"):
    """A door in a horseshoe arch, the arch set in a square frame of stone with a band of tile over it."""
    panel_w, panel_h = width + 1.1, height + width * 0.75 + 0.5
    frame.box((panel_w - 0.1, 0.1, panel_h - 0.1), (x, y + 0.02, z + panel_h / 2), material="dark")
    frame.box((width * 0.98, 0.07, height + width * 0.5), (x, y - 0.02, z + (height + width * 0.5) / 2), material="wood", grain=2)
    if DETAIL["door_arch"]:
        for k in range(1, 4):
            frame.box((width * 0.98, 0.03, 0.07), (x, y - 0.065, z + k * height / 3.4), material="iron")
        arch_panel(frame, panel_w, panel_h, width, height, (x, y - 0.1, z), depth=0.16, material=surround)
        frame.box((panel_w + 0.3, 0.12, 0.18), (x, y - 0.14, z + panel_h + 0.09), material=surround, bevel=0.02)
        for s in (-1, 1):
            frame.box((0.16, 0.12, panel_h), (x + s * (panel_w / 2 + 0.08), y - 0.14, z + panel_h / 2), material=surround)
        frame.box((panel_w - 0.2, 0.03, 0.3), (x, y - 0.19, z + panel_h - 0.3), material=band)
    else:
        frame.box((width + 0.3, 0.1, 0.14), (x, y - 0.08, z + height + 0.07), material=surround, bevel=0.015)
    return panel_h


# ------------------------------------------------------------------- roofs ----
def hip_roof(frame, w, d, eave, x=0.0, y=0.0, overhang=0.45, pitch=math.radians(24), material="rooftile"):
    """A tiled roof of four slopes over a block w by d, each slope laid so that its tiles run down it."""
    along_x = w >= d
    long, short = (w, d) if along_x else (d, w)
    ridge = long - short
    run = (short / 2 + overhang) / math.cos(pitch)
    drop = math.tan(pitch) * overhang
    rise = math.tan(pitch) * short / 2
    f = frame.sub((x, y, 0), 0.0 if along_x else math.pi / 2)
    long_o, short_o = long + 2 * overhang, short + 2 * overhang
    for turn, off in ((0.0, (0, -short / 2 - overhang)), (math.pi, (0, short / 2 + overhang))):
        f.sub((off[0], off[1], eave - drop), turn).slab([(-long_o / 2, 0), (long_o / 2, 0), (ridge / 2, run), (-ridge / 2, run)], 0.13, rot=(pitch, 0, 0), material=material)
    for turn, off in ((math.pi / 2, (long / 2 + overhang, 0)), (-math.pi / 2, (-long / 2 - overhang, 0))):
        f.sub((off[0], off[1], eave - drop), turn).slab([(-short_o / 2, 0), (short_o / 2, 0), (0, run)], 0.13, rot=(pitch, 0, 0), material=material)
    if ridge > 0.3:
        f.box((ridge + 0.3, 0.3, 0.18), (0, 0, eave + rise + 0.1), material=material, bevel=0.05)
    else:
        f.cylinder(0.16, 0.5, (0, 0, eave + rise + 0.3), material="clay", segments=8, radius_top=0.04)
    # The line of the eave: a board under the tiles and the rafters' ends.
    f.box((long + 0.3, short + 0.3, 0.12), (0, 0, eave - 0.02), material="wood")
    return rise


def gable_roof(frame, w, d, eave, x=0.0, y=0.0, overhang=0.4, pitch=math.radians(24), material="rooftile", wall="plaster"):
    """Two slopes with the ridge along x, and the triangles of wall under its ends."""
    run = (d / 2 + overhang) / math.cos(pitch)
    drop = math.tan(pitch) * overhang
    rise = math.tan(pitch) * d / 2
    f = frame.sub((x, y, 0))
    wide = w + 2 * overhang
    for turn, off in ((0.0, -d / 2 - overhang), (math.pi, d / 2 + overhang)):
        f.sub((0, off, eave - drop), turn).slab([(-wide / 2, 0), (wide / 2, 0), (wide / 2, run), (-wide / 2, run)], 0.13, rot=(pitch, 0, 0), material=material)
    f.box((wide, 0.3, 0.18), (0, 0, eave + rise + 0.1), material=material, bevel=0.05)
    for s in (-1, 1):
        f.prism([(-d / 2, 0), (d / 2, 0), (0, rise)], 0.3, (s * (w / 2 - 0.15), 0, eave), (0, 0, math.pi / 2), material=wall)
    return rise


def capped_merlons(frame, length, y, z, material="plaster_red", size=(0.9, 0.5, 0.95), gap=1.75, x0=0.0):
    """Merlons with the small four-sided caps of the western Islamic lands, in a line along x."""
    n = max(2, int(length // (gap * DETAIL["merlon_gap_scale"])))
    for i in range(n):
        x = x0 - length / 2 + (i + 0.5) * length / n
        frame.box(size, (x, y, z + size[2] / 2), material=material)
        if DETAIL["merlon_caps"]:
            frame.cylinder(size[0] * 0.72, 0.4, (x, y, z + size[2] + 0.2), (0, 0, math.pi / 4), material=material, segments=4, radius_top=0.03)


def putlog_holes(frame, length, bottom, top, y=0.0, x0=0.0, every=1.7, course=1.85, skip=()):
    """The rows of small square holes a wall of rammed earth keeps from the timbers of its shuttering."""
    if not DETAIL["putlogs"]:
        return
    rows = int((top - bottom) // course) + 1
    for r in range(rows):
        z = bottom + r * course
        n = int(length // every)
        for i in range(n):
            x = x0 - length / 2 + (i + 0.5 + (0.5 if r % 2 else 0.0)) * length / n
            if x > x0 + length / 2 - 0.3 or any(a < x < b for a, b in skip):
                continue
            frame.box((0.15, 0.06, 0.15), (x, y - 0.01, z), material="dark")


def cypress(frame, x, y, z=0.0, height=9.0, seed=0):
    h = height * (0.85 + 0.3 * ((seed * 37) % 10) / 10.0)
    frame.cylinder(0.12, 1.2, (x, y, z + 0.6), material="wood", segments=6)
    lean = 0.12 * math.sin(seed * 2.3)
    frame.cylinder(0.5, h * 0.16, (x, y, z + 0.9 + h * 0.08), material="green_dark", segments=DETAIL["cypress_segments"], radius_top=0.82)
    frame.cylinder(0.82, h * 0.42, (x + lean * 0.3, y, z + 0.9 + h * 0.37), material="green_dark", segments=DETAIL["cypress_segments"], radius_top=0.56)
    frame.cylinder(0.56, h * 0.42, (x + lean, y + lean * 0.5, z + 0.9 + h * 0.79), material="green_dark", segments=DETAIL["cypress_segments"], radius_top=0.03)


def round_tree(frame, x, y, z=0.0, radius=1.5, material="green", trunk=1.6):
    if DETAIL["tree_balls"] == 0:
        return
    frame.cylinder(0.11, trunk, (x, y, z + trunk / 2), material="wood", segments=6)
    frame.ball(radius, (x, y, z + trunk + radius * 0.6), material=material, squash=0.78, subdivisions=DETAIL["tree_subdivisions"])
    if DETAIL["tree_balls"] > 1:
        frame.ball(radius * 0.72, (x + radius * 0.55, y + radius * 0.3, z + trunk + radius * 0.4), material=material, squash=0.8, subdivisions=DETAIL["tree_subdivisions"])
    if DETAIL["tree_balls"] > 2:
        frame.ball(radius * 0.66, (x - radius * 0.5, y - radius * 0.35, z + trunk + radius * 0.8), material=material, squash=0.8, subdivisions=DETAIL["tree_subdivisions"])


# --------------------------------------------------------------------- wear ----
def weather(obj, ground=0.0, grid=None, levels=None, seed=0.0):
    """Paints wear into the mesh as a colour layer the materials multiply by: damp and dirt at the foot of every
    wall, render that is not one even tone across a face, tiles that have weathered unevenly, darker where a
    wall meets a roof. Large faces are first cut on a grid so that there are points to carry the variation."""
    if grid is None:
        grid = DETAIL["weather_grid"]
    if levels is None:
        levels = DETAIL["weather_levels"]
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.normal_update()
    lo = Vector((min(v.co.x for v in bm.verts), min(v.co.y for v in bm.verts), min(v.co.z for v in bm.verts)))
    hi = Vector((max(v.co.x for v in bm.verts), max(v.co.y for v in bm.verts), max(v.co.z for v in bm.verts)))
    planes = [(Vector((0, 0, ground + z)), Vector((0, 0, 1))) for z in levels if ground + z < hi.z]
    for axis in (0, 1):
        k = math.ceil(lo[axis] / grid)
        while k * grid < hi[axis]:
            co, no = Vector((0, 0, 0)), Vector((0, 0, 0))
            co[axis], no[axis] = k * grid + 0.37, 1.0
            planes.append((co, no))
            k += 1
    for co, no in planes:
        big = [f for f in bm.faces if f.calc_area() > 3.0]
        geom = list({e for f in big for e in f.edges} | {v for f in big for v in f.verts} | set(big))
        if geom:
            bmesh.ops.bisect_plane(bm, geom=geom, dist=0.0005, plane_co=co, plane_no=no)
    layer = bm.loops.layers.color.new("Col")
    names = [m.name for m in mesh.materials]
    for f in bm.faces:
        name = names[f.material_index] if names else ""
        n = f.normal
        for loop in f.loops:
            p = loop.vert.co
            h = max(0.0, p.z - ground)
            blotch = noise.noise(Vector((p.x * 0.11 + seed, p.y * 0.11, p.z * 0.16)))
            fine = noise.noise(Vector((p.x * 0.45, p.y * 0.45 + seed, p.z * 0.5)))
            under = 0.62 + 0.38 * min(1.0, max(0.0, n.z + 1.0))          # what looks at the ground is in shade
            if name.startswith("plaster") or name in ("stone", "marble"):
                drift = noise.noise(Vector((p.x * 0.045 - seed, p.y * 0.045, p.z * 0.07 + 3.0)))
                damp = math.exp(-h / 2.1) * (0.7 + 0.6 * fine)
                tone = 0.8 + 0.15 * blotch + 0.07 * fine
                streak = 0.0
                if abs(n.z) < 0.3:
                    streak = max(0.0, noise.noise(Vector((p.x * 1.1 + p.y * 1.1, seed, 0.3))) - 0.08) * 0.34 * min(1.0, h / 2.5)
                tint = (0.9, 1.0, 0.88) if name == "plaster_red" else (1.0, 1.0, 1.0)
                # A wall of rammed earth is not one colour: here redder, there paler and more yellow.
                warm = (1.0, 0.93 + 0.07 * drift, 0.84 + 0.16 * drift) if name == "plaster_red" else (1.0, 0.985 + 0.015 * drift, 0.95 + 0.05 * drift)
                r = tint[0] * warm[0] * tone * (1 - 0.36 * damp) - streak
                g = tint[1] * warm[1] * tone * (1 - 0.40 * damp) - streak
                b = tint[2] * warm[2] * tone * (1 - 0.50 * damp) - streak * 0.9
                if n.z > 0.7:
                    r, g, b = r * 0.86, g * 0.84, b * 0.8
                r, g, b = r * under, g * under, b * under
            elif name == "rooftile":
                tone = 0.8 + 0.2 * blotch + 0.1 * fine
                moss = max(0.0, fine) * 0.12 if n.y > 0.1 else 0.0
                r, g, b = tone - moss, tone * 0.97, tone * 0.92 - moss
            elif name in ("cobble", "earth"):
                tone = 0.84 + 0.16 * blotch
                r, g, b = tone, tone * 0.98, tone * 0.94
            elif name.startswith("green"):
                light = 0.5 + 0.5 * min(1.0, max(0.0, n.z * 0.7 + 0.5))
                tone = (0.62 + 0.3 * (0.5 + 0.5 * fine)) * light
                r, g, b = tone * (1.0 + 0.25 * blotch), tone, tone * 0.85
            elif name == "wood":
                tone = 0.84 + 0.16 * fine
                r, g, b = tone, tone, tone
            else:
                r = g = b = 1.0
            loop[layer] = (min(1.0, max(0.0, r)), min(1.0, max(0.0, g)), min(1.0, max(0.0, b)), 1.0)
    bm.to_mesh(mesh)
    bm.free()
    mesh.color_attributes.active_color = mesh.color_attributes["Col"]
    mesh.color_attributes.render_color_index = mesh.color_attributes.find("Col")


def export_with_wear(path, objects):
    """As common.export_gltf, and the colour layer goes with the mesh."""
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for obj in bpy.context.scene.objects:
        obj.select_set(obj in objects)
    bpy.context.view_layer.objects.active = objects[0]
    wanted = dict(filepath=path, export_format="GLTF_SEPARATE", use_selection=True, export_apply=True, export_yup=True, export_tangents=True, export_texture_dir="textures", export_image_format="JPEG", export_image_quality=90, export_jpeg_quality=90, export_materials="EXPORT", export_cameras=False, export_lights=False, export_extras=True, export_vertex_color="ACTIVE", export_all_vertex_colors=False, export_active_vertex_color_when_no_material=True)
    known = set(bpy.ops.export_scene.gltf.get_rna_type().properties.keys())
    # A setting this Blender does not know is left out, as in common.export_gltf; but not the one that carries the
    # wear, without which the model would be exported clean and nothing would say so.
    if "export_vertex_color" not in known:
        raise RuntimeError("this Blender's glTF export has no export_vertex_color setting: the wear's colour layer would be lost")
    bpy.ops.export_scene.gltf(**{k: v for k, v in wanted.items() if k in known})
