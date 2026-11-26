"""Pieces a building of the kit is put together from: a tiled roof, gables, a shuttered opening, a door, a chimney,
a line of merlons. Shared by the scripts that make Granada's buildings. Each takes the part it adds to.

In every one x runs along the building's front, y from the front (negative) to the back, and z is up.
"""
import math

PITCH = math.radians(24)


def roof(part, w, d, eave, overhang=0.35, pitch=PITCH, material="rooftile"):
    """Two slopes of tile over a block w along the ridge and d across it, with the ridge along x."""
    half = d / 2 + overhang
    run = half / math.cos(pitch)
    rise = math.tan(pitch) * (d / 2)
    for sy in (-1, 1):
        # A slab whose own y runs down the slope, so the tiles run down it too.
        part.box((w + 2 * overhang, run, 0.14), (0, sy * half / 2, eave + rise / 2 - math.tan(pitch) * overhang / 2 + 0.07), (sy * -pitch, 0, 0), material=material, bevel=0.02, grain=1)
    # The ridge: a line of capping tiles.
    part.box((w + 2 * overhang, 0.3, 0.16), (0, 0, eave + rise + 0.08), material=material, bevel=0.05)
    return rise


def gables(part, w, d, eave, material, pitch=PITCH):
    rise = math.tan(pitch) * (d / 2)
    for sx in (-1, 1):
        part.prism([(-d / 2, 0), (d / 2, 0), (0, rise)], 0.3, (sx * (w / 2 - 0.15), 0, eave), (0, 0, math.pi / 2), material=material)


def opening(part, x, y_face, z, w, h, facing=-1, shutters=True, sill=True):
    """A window on a wall that faces -y (or +y): a dark reveal, a frame of the wall's own stone, boards for shutters."""
    y = y_face + facing * 0.02
    part.box((w, 0.06, h), (x, y, z), material="dark", bevel=0)
    part.box((w + 0.24, 0.12, 0.14), (x, y + facing * 0.03, z + h / 2 + 0.07), material="wood", bevel=0.015, grain=0)
    if sill:
        part.box((w + 0.3, 0.2, 0.1), (x, y + facing * 0.06, z - h / 2 - 0.05), material="stone", bevel=0.02)
    if shutters:
        for sx in (-1, 1):
            part.box((w / 2, 0.05, h), (x + sx * (w / 2 + w / 4 + 0.02), y + facing * 0.04, z), material="wood", bevel=0.01, grain=2)


def door(part, x, y_face, w, h, facing=-1, arch=False):
    y = y_face + facing * 0.03
    part.box((w, 0.08, h), (x, y, h / 2), material="wood", bevel=0.01, grain=2)
    for sx in (-1, 1):
        part.box((0.2, 0.22, h + 0.1), (x + sx * (w / 2 + 0.1), y + facing * 0.04, (h + 0.1) / 2), material="stone", bevel=0.03)
    if arch:
        for k in range(7):
            a = math.pi * (k + 0.5) / 7
            r = w / 2 + 0.1
            part.box((0.34, 0.22, 0.36), (x + math.cos(a) * r, y + facing * 0.04, h + math.sin(a) * r), (0, -(a - math.pi / 2), 0), material="stone", bevel=0.03)
        part.prism([(-w / 2, 0)] + [(math.cos(math.pi * (1 - k / 8)) * w / 2, math.sin(math.pi * k / 8) * w / 2) for k in range(1, 8)] + [(w / 2, 0)], 0.08, (x, y, h), material="wood")
    else:
        part.box((w + 0.5, 0.24, 0.22), (x, y + facing * 0.04, h + 0.11), material="wood", bevel=0.02, grain=0)


def chimney(part, x, y, base, top):
    part.box((0.6, 0.6, top - base), (x, y, (base + top) / 2), material="plaster", bevel=0.03)
    part.box((0.8, 0.8, 0.1), (x, y, top + 0.05), material="rooftile", bevel=0.02)
    part.box((0.5, 0.5, 0.26), (x, y, top + 0.23), material="plaster", bevel=0.03)
    part.box((0.74, 0.74, 0.08), (x, y, top + 0.4), material="rooftile", bevel=0.02)


def roof_y(part, w, d, eave, x=0.0, y=0.0, overhang=0.35, pitch=PITCH, material="rooftile"):
    """Two slopes over a block w across the ridge (along x) and d along it: the ridge runs along y."""
    half = w / 2 + overhang
    run = half / math.cos(pitch)
    rise = math.tan(pitch) * (w / 2)
    for sx in (-1, 1):
        part.box((run, d + 2 * overhang, 0.14), (x + sx * half / 2, y, eave + rise / 2 - math.tan(pitch) * overhang / 2 + 0.07), (0, sx * pitch, 0), material=material, bevel=0.02, grain=0)
    part.box((0.3, d + 2 * overhang, 0.16), (x, y, eave + rise + 0.08), material=material, bevel=0.05)
    return rise


def roof_at(part, w, d, eave, x=0.0, y=0.0, overhang=0.35, pitch=PITCH, material="rooftile"):
    """As roof(), over a block that does not stand at the middle: the ridge runs along x."""
    half = d / 2 + overhang
    run = half / math.cos(pitch)
    rise = math.tan(pitch) * (d / 2)
    for sy in (-1, 1):
        part.box((w + 2 * overhang, run, 0.14), (x, y + sy * half / 2, eave + rise / 2 - math.tan(pitch) * overhang / 2 + 0.07), (sy * -pitch, 0, 0), material=material, bevel=0.02, grain=1)
    part.box((w + 2 * overhang, 0.3, 0.16), (x, y, eave + rise + 0.08), material=material, bevel=0.05)
    return rise


def gable_ends(part, w, d, eave, x=0.0, y=0.0, material="plaster", pitch=PITCH, along="x"):
    """The triangles of wall under a roof's two ends, for a block anywhere; `along` is the ridge's axis."""
    span = d if along == "x" else w
    rise = math.tan(pitch) * (span / 2)
    for s in (-1, 1):
        if along == "x":
            part.prism([(-d / 2, 0), (d / 2, 0), (0, rise)], 0.3, (x + s * (w / 2 - 0.15), y, eave), (0, 0, math.pi / 2), material=material)
        else:
            part.prism([(-w / 2, 0), (w / 2, 0), (0, rise)], 0.3, (x, y + s * (d / 2 - 0.15), eave), material=material)
    return rise


def merlons(part, length, at, along="x", material="stone", size=(1.0, 0.45, 0.8), gap=2.0):
    """A line of merlons `length` long, centred on `at` (x, y, z of their feet), standing along x or along y."""
    n = max(2, int(length // gap))
    for i in range(n):
        off = -length / 2 + (i + 0.5) * length / n
        dims = size if along == "x" else (size[1], size[0], size[2])
        where = (at[0] + off, at[1], at[2] + size[2] / 2) if along == "x" else (at[0], at[1] + off, at[2] + size[2] / 2)
        part.box(dims, where, material=material, bevel=0)


def pyramid(part, side, height, at, material="rooftile"):
    """A four-sided tiled roof over a square block: its foot at `at`."""
    part.cylinder(side / math.sqrt(2) + 0.3, height, (at[0], at[1], at[2] + height / 2), (0, 0, math.pi / 4), material=material, segments=4, radius_top=0.05)
