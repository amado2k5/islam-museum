"""The art pipeline's shared kit, run inside Blender (5.x) from the command line.

It makes three things, all from this source and nothing else:
  1. tiling texture sets (base colour, tangent-space normal, roughness) painted by arithmetic, the same every run;
  2. meshes built from bevelled parts in real metres, with texture coordinates laid by each part's own axes, so that
     a plank's grain runs along the plank and a metre of wall is a metre of plaster wherever it stands;
  3. a glTF export for the game and a lit preview render for a person to judge.

Nothing is downloaded and no photograph is used. Standards: 1 unit = 1 metre; Z up here and Y up in the export; an
asset's origin is on the ground at its centre; a moving part is its own object, with its origin on its axle.
"""
import hashlib
import math
import os
import struct

import bmesh
import bpy
import numpy as np
from mathutils import Euler, Matrix, Vector

TEXTURE_SIZE = 1024
# How many metres one repeat of each texture covers.
TILE = {"plaster": 3.0, "rooftile": 2.0, "stone": 2.4, "wood": 1.5, "iron": 1.0, "earth": 4.0}


# ---------------------------------------------------------------- textures ----
def _noise(n, beta, seed):
    """Tiling noise in 0..1 with a 1/f^beta spectrum (it tiles because it is made in the frequency domain)."""
    rng = np.random.default_rng(seed)
    fx = np.fft.fftfreq(n)[:, None]
    fy = np.fft.fftfreq(n)[None, :]
    f = np.sqrt(fx * fx + fy * fy)
    f[0, 0] = 1.0
    spectrum = (rng.normal(size=(n, n)) + 1j * rng.normal(size=(n, n))) / np.power(f, beta)
    spectrum[0, 0] = 0
    field = np.real(np.fft.ifft2(spectrum))
    lo, hi = np.percentile(field, 1), np.percentile(field, 99)
    return np.clip((field - lo) / (hi - lo), 0, 1)


def _streaks(n, seed):
    """Tiling vertical streaks, as rain leaves on a wall."""
    rng = np.random.default_rng(seed)
    columns = np.real(np.fft.ifft(np.fft.fft(rng.normal(size=n)) / np.maximum(np.abs(np.fft.fftfreq(n)) * n, 1.0) ** 0.9))
    columns = (columns - columns.min()) / (columns.max() - columns.min())
    return np.tile(columns[None, :], (n, 1)) * (0.5 + 0.5 * _noise(n, 1.6, seed + 1))


def _normal_from_height(height, strength):
    dx = (np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)) * strength
    dy = (np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)) * strength
    nz = np.ones_like(height)
    length = np.sqrt(dx * dx + dy * dy + nz * nz)
    return np.stack([0.5 - 0.5 * dx / length, 0.5 - 0.5 * dy / length, 0.5 + 0.5 * nz / length], axis=-1)


def _plaster(n):
    low, mid, fine = _noise(n, 2.2, 11), _noise(n, 1.4, 12), _noise(n, 0.6, 13)
    stain = _streaks(n, 14)
    tone = 0.9 + 0.1 * low - 0.07 * stain * (0.4 + 0.6 * mid)
    base = np.stack([0.93 * tone, 0.9 * tone, 0.83 * tone - 0.02 * stain], axis=-1)
    height = 0.55 * mid + 0.3 * low + 0.15 * fine
    rough = 0.86 + 0.1 * fine
    return base, height, rough, 5.0


def _rooftile(n):
    """Barrel tiles: eight courses across the repeat, five rows up it, each row lapping the one below."""
    yy, xx = np.mgrid[0:n, 0:n] / n
    cols, rows = 8, 5
    cx = (xx * cols) % 1.0
    col = np.floor(xx * cols)
    row = np.floor(yy * rows)
    along = (yy * rows) % 1.0
    # Covers and pans alternate: a ridge, then a channel.
    cover = np.sqrt(np.clip(1 - (2 * cx - 1) ** 2, 0, 1))
    lap = 1 - along
    height = 0.62 * cover + 0.3 * lap * (0.6 + 0.4 * cover)
    rng = np.random.default_rng(21)
    per_tile = rng.uniform(0.82, 1.12, size=(rows, cols))[row.astype(int) % rows, col.astype(int) % cols]
    warm = rng.uniform(-0.04, 0.05, size=(rows, cols))[row.astype(int) % rows, col.astype(int) % cols]
    grime = _noise(n, 1.8, 22)
    lichen = np.clip(_noise(n, 1.2, 23) - 0.72, 0, 1) * 2.4
    tone = per_tile * (0.86 + 0.14 * cover) * (0.92 + 0.08 * grime) * (0.82 + 0.18 * np.clip(along * 4, 0, 1))
    base = np.stack([(0.7 + warm) * tone, (0.36 + warm * 0.4) * tone, 0.22 * tone], axis=-1)
    base = base * (1 - 0.5 * lichen[..., None]) + np.array([0.42, 0.44, 0.3]) * 0.5 * lichen[..., None]
    rough = 0.82 + 0.12 * grime
    return base, height, rough, 16.0


def _stone(n):
    """Coursed rubble: six courses up the repeat, stones of uneven length, lime mortar between."""
    yy, xx = np.mgrid[0:n, 0:n] / n
    rng = np.random.default_rng(31)
    courses = 6
    row = np.floor(yy * courses).astype(int)
    height = np.zeros((n, n))
    tone = np.ones((n, n))
    warm = np.zeros((n, n))
    v = (yy * courses) % 1.0
    for r in range(courses):
        cuts = np.sort(np.concatenate([[0.0], rng.uniform(0.08, 0.92, size=rng.integers(3, 6)), [1.0]]))
        shift = rng.uniform(0, 1)
        u = (xx + shift) % 1.0
        index = np.clip(np.searchsorted(cuts, u, side="right") - 1, 0, len(cuts) - 2)
        left, right = cuts[index], cuts[index + 1]
        edge = np.minimum(np.minimum(u - left, right - u) * courses * 1.6, np.minimum(v, 1 - v))
        stone_tone = rng.uniform(0.78, 1.1, size=len(cuts))[index]
        stone_warm = rng.uniform(-0.03, 0.04, size=len(cuts))[index]
        mask = row == r
        height[mask] = np.clip(edge[mask] / 0.11, 0, 1)
        tone[mask] = stone_tone[mask]
        warm[mask] = stone_warm[mask]
    surface = _noise(n, 1.3, 32)
    fine = _noise(n, 0.5, 33)
    face = height > 0.55
    body = tone * (0.88 + 0.12 * surface)
    stone_colour = np.stack([(0.66 + warm) * body, (0.6 + warm * 0.6) * body, 0.5 * body], axis=-1)
    mortar = np.stack([0.8 + 0.06 * fine, 0.76 + 0.06 * fine, 0.66 + 0.05 * fine], axis=-1)
    blend = np.clip(height / 0.55, 0, 1)[..., None]
    base = mortar * (1 - blend) + stone_colour * blend
    relief = np.where(face, 0.7 + 0.3 * surface, height * 1.1)
    rough = 0.84 + 0.1 * fine
    return base, relief, rough, 14.0


def _wood(n):
    """Six weathered planks across the repeat, their grain running up it."""
    yy, xx = np.mgrid[0:n, 0:n] / n
    planks = 6
    px = (xx * planks) % 1.0
    plank = np.floor(xx * planks).astype(int)
    rng = np.random.default_rng(41)
    tone = rng.uniform(0.8, 1.12, size=planks)[plank % planks]
    grain_src = _noise(n, 1.5, 42)
    # Stretch the noise along the plank by sampling a narrow band of it.
    grain = grain_src[:, (np.arange(n) * 9) % n][(np.arange(n) // 7) % n, :]
    fine = _noise(n, 0.4, 43)
    gap = np.clip(np.minimum(px, 1 - px) / 0.035, 0, 1)
    body = tone * (0.78 + 0.22 * grain)
    base = np.stack([0.4 * body, 0.28 * body, 0.17 * body], axis=-1) * (0.35 + 0.65 * gap[..., None])
    height = 0.6 * gap + 0.3 * grain + 0.1 * fine
    rough = 0.72 + 0.2 * fine
    return base, height, rough, 9.0


def _earth(n):
    low, mid, fine = _noise(n, 2.0, 51), _noise(n, 1.2, 52), _noise(n, 0.5, 53)
    tone = 0.8 + 0.25 * low
    base = np.stack([0.5 * tone, 0.41 * tone, 0.28 * tone], axis=-1) * (0.9 + 0.1 * mid)[..., None]
    return base, 0.6 * mid + 0.4 * fine, 0.92 + 0.06 * fine, 6.0


PAINTERS = {"plaster": _plaster, "rooftile": _rooftile, "stone": _stone, "wood": _wood, "earth": _earth}


def _save(name, pixels, path, srgb):
    h, w = pixels.shape[:2]
    rgba = np.concatenate([np.clip(pixels, 0, 1), np.ones((h, w, 1))], axis=-1).astype(np.float32)
    image = bpy.data.images.new(name, w, h, alpha=False, float_buffer=False)
    image.colorspace_settings.name = "sRGB" if srgb else "Non-Color"
    image.pixels.foreach_set(rgba.ravel())
    image.filepath_raw = path
    image.file_format = "PNG"
    image.save()
    return image


def paint_textures(directory, size=TEXTURE_SIZE):
    """Paints every texture set into `directory` and returns {material: {base, normal, orm}} as Blender images."""
    os.makedirs(directory, exist_ok=True)
    sets = {}
    for name, painter in PAINTERS.items():
        base, height, rough, strength = painter(size)
        # Blender paints sRGB images from linear floats itself when saving 8-bit: hand it the colour as seen.
        seen = np.where(base <= 0.0031308, base * 12.92, 1.055 * np.power(np.clip(base, 1e-6, 1), 1 / 2.4) - 0.055)
        normal = _normal_from_height(height, strength)
        orm = np.stack([np.ones_like(rough), np.clip(rough, 0, 1), np.zeros_like(rough)], axis=-1)
        sets[name] = {
            "base": _save(f"{name}_base", seen if False else base, os.path.join(directory, f"{name}_base.png"), True),
            "normal": _save(f"{name}_normal", normal, os.path.join(directory, f"{name}_normal.png"), False),
            "orm": _save(f"{name}_orm", orm, os.path.join(directory, f"{name}_orm.png"), False),
        }
    return sets


# ------------------------------------------------- photographed materials ----
# Surfaces photographed by others and given to the public domain (CC0) by Poly Haven: gaming/art/sources.json says
# which, by whom, and the checksum of every file. They are media and are not in git; a machine without them gets the
# painted sets above, so every script still runs. Each line: the kit's name for the surface, the source, how many
# metres one repeat covers, a tint laid over the colour, and whether the picture must be turned so that its grain
# runs up the texture as the kit expects.
PHOTO_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "media", "textures", "polyhaven"))
PHOTO = {
    "plaster": ("white_stucco_02", 1.8, (1.17, 1.15, 1.09), False),       # lime wash: lifted toward white
    "plaster_warm": ("white_stucco_02", 1.8, (1.12, 0.99, 0.80), False),  # an ochre wash
    "plaster_red": ("white_stucco_02", 1.8, (0.99, 0.70, 0.50), False),   # a red-earth render
    "rooftile": ("clay_roof_tiles_02", 2.5, (1.0, 1.0, 1.0), False),      # the tiles run down the texture
    "stone": ("rustic_stone_wall_02", 1.5, (1.05, 1.0, 0.93), False),
    "wood": ("weathered_brown_planks", 1.8, (0.92, 0.84, 0.76), True),    # photographed with the boards lying across
    "cobble": ("cobblestone_floor_04", 1.5, (1.0, 0.97, 0.9), False),
}


def photos_available():
    return all(os.path.exists(os.path.join(PHOTO_DIR, slug, f"{slug}_diff_2k.jpg")) for slug, _, _, _ in PHOTO.values())


def _photo(path, size):
    """A photograph as an array, bottom row first, brought down to `size` by averaging whole blocks of pixels."""
    image = bpy.data.images.load(path)
    w, h = image.size
    flat = np.empty(w * h * 4, dtype=np.float32)
    image.pixels.foreach_get(flat)
    bpy.data.images.remove(image)
    pixels = flat.reshape(h, w, 4)[:, :, :3]
    step = w // size
    if step > 1:
        pixels = pixels[: size * step, : size * step].reshape(size, step, size, step, 3).mean(axis=(1, 3))
    return pixels


def photo_textures(directory, size=TEXTURE_SIZE):
    """The photographed sets, written into `directory` in the kit's own form, with the kit's tiling set to theirs."""
    os.makedirs(directory, exist_ok=True)
    sets = {}
    for name, (slug, metres, tint, turn) in PHOTO.items():
        folder = os.path.join(PHOTO_DIR, slug)
        base = np.clip(_photo(os.path.join(folder, f"{slug}_diff_2k.jpg"), size) * np.array(tint, dtype=np.float32), 0, 1)
        normal = _photo(os.path.join(folder, f"{slug}_nor_gl_2k.jpg"), size)
        rough = _photo(os.path.join(folder, f"{slug}_rough_2k.jpg"), size)[:, :, 0]
        if turn:
            # A quarter turn of the picture. The slopes in a normal map are directions, so they turn with it.
            base, rough, normal = np.rot90(base), np.rot90(rough), np.rot90(normal)
            normal = np.stack([normal[:, :, 1], 1.0 - normal[:, :, 0], normal[:, :, 2]], axis=-1)
        orm = np.stack([np.ones_like(rough), np.clip(rough, 0, 1), np.zeros_like(rough)], axis=-1)
        sets[name] = {
            "base": _save(f"{name}_base", np.ascontiguousarray(base), os.path.join(directory, f"{name}_base.png"), True),
            "normal": _save(f"{name}_normal", np.ascontiguousarray(normal), os.path.join(directory, f"{name}_normal.png"), False),
            "orm": _save(f"{name}_orm", np.ascontiguousarray(orm), os.path.join(directory, f"{name}_orm.png"), False),
        }
        TILE[name] = metres
    return sets


def textures(directory, size=TEXTURE_SIZE):
    """Every texture set an asset may use: the photographed ones where this machine has them, the painted ones
    otherwise, and the painted earth always. Says which, so that a build's log tells what it was made from."""
    sets = paint_textures(directory, size)
    if photos_available():
        sets.update(photo_textures(directory, size))
        print("ART textures: photographed (Poly Haven, CC0) for", ", ".join(sorted(PHOTO)), flush=True)
    else:
        # Without the photographs the extra names still exist, as the painted sets they stand in for.
        for name, stands_for in (("plaster_warm", "plaster"), ("plaster_red", "plaster"), ("cobble", "stone")):
            sets[name] = sets[stands_for]
            TILE[name] = TILE[stands_for]
        print("ART textures: painted by the kit (no photographed sets on this machine)", flush=True)
    return sets


# --------------------------------------------------------------- materials ----
def make_materials(texture_sets):
    """One physically based material for each texture set, plus plain iron and water."""
    materials = {}
    for name, images in texture_sets.items():
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nodes, links = m.node_tree.nodes, m.node_tree.links
        bsdf = nodes["Principled BSDF"]
        base = nodes.new("ShaderNodeTexImage")
        base.image = images["base"]
        links.new(base.outputs["Color"], bsdf.inputs["Base Color"])
        orm = nodes.new("ShaderNodeTexImage")
        orm.image = images["orm"]
        split = nodes.new("ShaderNodeSeparateColor")
        links.new(orm.outputs["Color"], split.inputs["Color"])
        links.new(split.outputs["Green"], bsdf.inputs["Roughness"])
        links.new(split.outputs["Blue"], bsdf.inputs["Metallic"])
        normal = nodes.new("ShaderNodeTexImage")
        normal.image = images["normal"]
        bump = nodes.new("ShaderNodeNormalMap")
        links.new(normal.outputs["Color"], bump.inputs["Color"])
        links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
        materials[name] = m
    for name, colour, rough, metal in [("iron", (0.05, 0.05, 0.055, 1), 0.55, 0.9), ("water", (0.03, 0.17, 0.2, 1), 0.08, 0.0), ("dark", (0.02, 0.018, 0.016, 1), 0.9, 0.0), ("cloth", (0.62, 0.47, 0.3, 1), 0.88, 0.0), ("cloth_red", (0.46, 0.12, 0.08, 1), 0.86, 0.0), ("clay", (0.42, 0.2, 0.1, 1), 0.82, 0.0)]:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = colour
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = metal
        materials[name] = m
    return materials


def _ordered_unique(items):
    """Items in first-seen order: deterministic even when Python's hash seed changes between Blender runs."""
    out, seen = [], set()
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


# ------------------------------------------------------------------- parts ----
class Part:
    """One object built of bevelled boxes and cylinders, each mapped in its own frame before it is put in place."""

    def __init__(self, name, materials):
        self.name = name
        self.materials = materials
        self.bm = bmesh.new()
        self.uv = self.bm.loops.layers.uv.verify()
        self.slots = []
        self.count = 0

    def _slot(self, material):
        if material not in self.slots:
            self.slots.append(material)
        return self.slots.index(material)

    def _finish(self, verts, material, loc, rot, grain):
        faces = _ordered_unique(f for v in verts for f in v.link_faces)
        tile = TILE.get(material, 1.0)
        self.count += 1
        # A different place on the texture for every piece, so that no two pieces show the same patch.
        digest = hashlib.sha256(f"{self.name}:{self.count}".encode()).digest()
        du, dv = digest[0] / 255.0, digest[1] / 255.0
        slot = self._slot(material)
        for f in faces:
            f.normal_update()
            n = f.normal
            ax, ay, az = abs(n.x), abs(n.y), abs(n.z)
            for loop in f.loops:
                co = loop.vert.co
                if az >= ax and az >= ay:
                    u, v = co.x, co.y
                elif ax >= ay:
                    u, v = co.y, co.z
                else:
                    u, v = co.x, co.z
                if grain is not None:
                    # The grain runs up the texture: lay the piece's long axis along it.
                    along = (co.x, co.y, co.z)[grain]
                    across = [c for i, c in enumerate((co.x, co.y, co.z)) if i != grain]
                    u, v = (across[0] if abs((n.x, n.y, n.z)[[i for i in range(3) if i != grain][0]]) < 0.7 else across[1]), along
                loop[self.uv].uv = (u / tile + du, v / tile + dv)
            f.material_index = slot
            f.smooth = False
        matrix = Matrix.Translation(Vector(loc)) @ Euler(rot, "XYZ").to_matrix().to_4x4()
        bmesh.ops.transform(self.bm, matrix=matrix, verts=list(verts))

    def box(self, size, loc=(0, 0, 0), rot=(0, 0, 0), material="plaster", bevel=0.03, grain=None):
        made = bmesh.ops.create_cube(self.bm, size=1.0)["verts"]
        for v in made:
            v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
        if bevel > 0 and min(size) > bevel * 3:
            edges = _ordered_unique(e for v in made for e in v.link_edges)
            result = bmesh.ops.bevel(self.bm, geom=edges, offset=bevel, segments=1, affect="EDGES", profile=0.5)
            made = _ordered_unique([v for v in made if v.is_valid] + list(result.get("verts", [])))
        if grain == "long":
            grain = max(range(3), key=lambda i: size[i])
        self._finish(made, material, loc, rot, grain)

    def cylinder(self, radius, depth, loc=(0, 0, 0), rot=(0, 0, 0), material="wood", segments=16, radius_top=None, grain=None):
        made = bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=segments, radius1=radius, radius2=radius if radius_top is None else radius_top, depth=depth)["verts"]
        self._finish(made, material, loc, rot, grain)

    def prism(self, outline, depth, loc=(0, 0, 0), rot=(0, 0, 0), material="plaster", grain=None):
        """A flat shape given as (x, z) points, counter-clockwise, made `depth` thick along y: a gable, an arch stone."""
        front = [self.bm.verts.new((x, -depth / 2, z)) for x, z in outline]
        back = [self.bm.verts.new((x, depth / 2, z)) for x, z in outline]
        n = len(outline)
        self.bm.faces.new(front)
        self.bm.faces.new(list(reversed(back)))
        for i in range(n):
            self.bm.faces.new([front[(i + 1) % n], front[i], back[i], back[(i + 1) % n]])
        self._finish(front + back, material, loc, rot, grain)

    def build(self, location=(0, 0, 0), collection=None):
        mesh = bpy.data.meshes.new(self.name)
        self.bm.normal_update()
        self.bm.to_mesh(mesh)
        self.bm.free()
        obj = bpy.data.objects.new(self.name, mesh)
        for slot in self.slots:
            mesh.materials.append(self.materials[slot])
        obj.location = location
        (collection or bpy.context.scene.collection).objects.link(obj)
        # Every face becomes triangles when the modifiers are applied, so that tangents can be worked out for the
        # normal maps and the game is handed the triangles the preview was lit with.
        triangulate = obj.modifiers.new("triangles", "TRIANGULATE")
        triangulate.quad_method = "FIXED"
        triangulate.ngon_method = "CLIP"
        return obj


def cut(target, cutter):
    """Cuts one object out of another (a window out of a wall). The cutter is kept out of the picture and the export."""
    mod = target.modifiers.new("cut", "BOOLEAN")
    # The cut comes before the triangles.
    while target.modifiers[0] != mod:
        target.modifiers.move(len(target.modifiers) - 1, 0)
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    for solver in ("EXACT", "MANIFOLD", "FLOAT"):
        try:
            mod.solver = solver
            break
        except TypeError:
            continue
    cutter.hide_render = True
    cutter.hide_viewport = True
    cutter["cutter"] = True


def _copy_materials_and_uv(obj, source, mesh, faces, face_materials, vertex_uvs):
    for material in obj.data.materials:
        mesh.materials.append(material)
    uv = mesh.uv_layers.new(name="UVMap")
    for polygon, material_index in zip(mesh.polygons, face_materials):
        polygon.material_index = material_index
        polygon.use_smooth = False
        for loop_index in polygon.loop_indices:
            uv.data[loop_index].uv = vertex_uvs[mesh.loops[loop_index].vertex_index]


def _face_area(vertices, face):
    x = y = z = 0.0
    for index, vertex in enumerate(face):
        a = vertices[vertex]
        b = vertices[face[(index + 1) % len(face)]]
        x += a[1] * b[2] - a[2] * b[1]
        y += a[2] * b[0] - a[0] * b[2]
        z += a[0] * b[1] - a[1] * b[0]
    return 0.5 * math.sqrt(x * x + y * y + z * z)


def _valid_face(vertices, face):
    return len(face) >= 3 and len(set(face)) == len(face) and _face_area(vertices, face) > 1e-12


def canonicalize_faces(obj):
    """Rebuilds the evaluated, still-untriangulated mesh in a fixed face and vertex order.

    Boolean and bevel operations can number the same vertices differently between Blender processes. This keeps
    their polygons but sorts every face's corner cycle by position and UV, then adds back one fixed triangulation
    modifier. Triangulation therefore sees identical input rather than merely identical-looking input.
    """
    triangulating = []
    for modifier in obj.modifiers:
        if modifier.type == "TRIANGULATE":
            triangulating.append((modifier, modifier.show_viewport))
            modifier.show_viewport = False
    bpy.context.view_layer.update()
    graph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(graph)
    source = evaluated.to_mesh()
    uv_layer = source.uv_layers.active

    keys, key_index, raw_faces, face_materials = [], {}, [], []
    for polygon in source.polygons:
        raw = []
        for loop_index in polygon.loop_indices:
            loop = source.loops[loop_index]
            co = source.vertices[loop.vertex_index].co
            uv_loop = uv_layer.data[loop_index].uv if uv_layer else Vector((0.0, 0.0))
            key = (co.x, co.y, co.z, uv_loop.x, uv_loop.y)
            if key not in key_index:
                key_index[key] = len(keys)
                keys.append(key)
            raw.append(key)
        smallest = raw.index(min(raw))
        raw_faces.append(tuple(raw[smallest:] + raw[:smallest]))
        face_materials.append(polygon.material_index)

    ordered_keys = sorted(keys)
    remap = {key: i for i, key in enumerate(ordered_keys)}
    vertices = [key[:3] for key in ordered_keys]
    vertex_uvs = [key[3:] for key in ordered_keys]
    faced = []
    for raw, material_index in zip(raw_faces, face_materials):
        face = tuple(remap[key] for key in raw)
        if _valid_face(vertices, face):
            faced.append((face, material_index))
    faces = [face for face, _ in faced]
    face_materials = [material_index for _, material_index in faced]
    order = sorted(range(len(faces)), key=lambda i: (faces[i], face_materials[i]))
    faces = [faces[i] for i in order]
    face_materials = [face_materials[i] for i in order]

    mesh = bpy.data.meshes.new(obj.data.name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    _copy_materials_and_uv(obj, source, mesh, faces, face_materials, vertex_uvs)
    evaluated.to_mesh_clear()
    for modifier, was in triangulating:
        modifier.show_viewport = was

    old = obj.data
    obj.data = mesh
    for modifier in list(obj.modifiers):
        obj.modifiers.remove(modifier)
    triangulate = obj.modifiers.new("triangles", "TRIANGULATE")
    triangulate.quad_method = "FIXED"
    triangulate.ngon_method = "CLIP"
    if old.users == 0:
        bpy.data.meshes.remove(old)


def canonicalize_object(obj):
    """Rebuilds one object's evaluated triangles in a fixed vertex and triangle order."""
    bpy.context.view_layer.update()
    graph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(graph)
    source = evaluated.to_mesh()
    source.calc_loop_triangles()
    uv_layer = source.uv_layers.active

    keys, triangles = [], []
    key_index = {}
    for tri in source.loop_triangles:
        raw = []
        for loop_index in tri.loops:
            loop = source.loops[loop_index]
            co = source.vertices[loop.vertex_index].co
            uv_loop = uv_layer.data[loop_index].uv if uv_layer else Vector((0.0, 0.0))
            key = (co.x, co.y, co.z, uv_loop.x, uv_loop.y)
            if key not in key_index:
                key_index[key] = len(keys)
                keys.append(key)
            raw.append(key_index[key])
        triangles.append((raw, tri.material_index))

    ordered_keys = sorted(keys)
    remap = {key_index[key]: i for i, key in enumerate(ordered_keys)}
    vertices = [key[:3] for key in ordered_keys]
    vertex_uvs = [key[3:] for key in ordered_keys]
    faces, face_materials = [], []
    for raw, material_index in triangles:
        face = [remap[i] for i in raw]
        smallest = face.index(min(face))
        face = tuple(face[smallest:] + face[:smallest])
        if _valid_face(vertices, face):
            faces.append(face)
            face_materials.append(material_index)
    order = sorted(range(len(faces)), key=lambda i: (faces[i], face_materials[i]))
    faces = [faces[i] for i in order]
    face_materials = [face_materials[i] for i in order]

    mesh = bpy.data.meshes.new(obj.data.name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    _copy_materials_and_uv(obj, source, mesh, faces, face_materials, vertex_uvs)
    evaluated.to_mesh_clear()

    old = obj.data
    obj.data = mesh
    for modifier in list(obj.modifiers):
        obj.modifiers.remove(modifier)
    if old.users == 0:
        bpy.data.meshes.remove(old)


def make_lod(obj, ratio=1.0 / 3.0):
    """A lower level of detail for one exported object: the same origin and outer volume, collapsed by Blender.

    The copy keeps the high object's name with `-lod1` and carries glTF extras naming what it is a detail of, so a
    loader can choose it later. The game is not changed to do so here.
    """
    canonicalize_faces(obj)
    low = obj.copy()
    low.data = obj.data.copy()
    low.name = f"{obj.name}-lod1"
    for mod in list(low.modifiers):
        low.modifiers.remove(mod)
    decimate = low.modifiers.new("lower detail", "DECIMATE")
    decimate.ratio = ratio
    decimate.use_collapse_triangulate = True
    triangulate = low.modifiers.new("triangles", "TRIANGULATE")
    triangulate.quad_method = "FIXED"
    triangulate.ngon_method = "CLIP"
    low["lodOf"] = obj.name
    low["lodLevel"] = 1
    obj["lodLevel"] = 0
    collections = getattr(obj, "users_collection", [])
    (collections[0] if collections else bpy.context.scene.collection).objects.link(low)
    return low


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


# -------------------------------------------------------- export and preview ----
def triangles(objects):
    graph = bpy.context.evaluated_depsgraph_get()
    total = 0
    for obj in objects:
        mesh = obj.evaluated_get(graph).to_mesh()
        mesh.calc_loop_triangles()
        total += len(mesh.loop_triangles)
        obj.evaluated_get(graph).to_mesh_clear()
    return total


# -------------------------------------------------------- stable glTF bytes ----
def _read_gltf_accessor(gltf, data, index):
    import struct
    component_formats = {5120: ("b", 1), 5121: ("B", 1), 5122: ("h", 2), 5123: ("H", 2), 5125: ("I", 4), 5126: ("f", 4)}
    widths = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT2": 4, "MAT3": 9, "MAT4": 16}
    accessor = gltf["accessors"][index]
    view = gltf["bufferViews"][accessor["bufferView"]]
    fmt, size = component_formats[accessor["componentType"]]
    width = widths[accessor["type"]]
    stride = view.get("byteStride") or size * width
    start = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    return [struct.unpack_from("<" + fmt * width, data, start + i * stride) for i in range(accessor["count"])]


def _quantized_tuple(values, places):
    return tuple(struct.unpack("<f", struct.pack("<f", float(v) if places is None else round(float(v), places)))[0] for v in values)


def canonicalize_gltf(path):
    """Rewrites a glTF and its binary buffer in one deterministic order.

    Blender can number the same evaluated vertices differently in different processes. Geometry, UVs, materials,
    object names and transforms are kept; vertices with the same exported attributes are welded, vertices and
    triangles are sorted by their own values, and the buffer is written again with zero padding. This is an export
    determinism pass, not a change to the pieces.
    """
    import json
    import struct

    path = os.path.abspath(path)
    with open(path, "r") as source:
        gltf = json.load(source)
    if not gltf.get("buffers") or "uri" not in gltf["buffers"][0]:
        return
    bin_path = os.path.join(os.path.dirname(path), gltf["buffers"][0]["uri"])
    with open(bin_path, "rb") as source:
        data = source.read()

    # Mesh names are not part of the game's contract, but stable names make the file easier to compare.
    for node in gltf.get("nodes", []):
        if "mesh" in node and node.get("name"):
            gltf["meshes"][node["mesh"]]["name"] = node["name"]

    accessors, views = [], []
    output = bytearray()

    def append_accessor(values, component_type, value_type, minmax=False):
        nonlocal output
        while len(output) % 4:
            output.append(0)
        component_formats = {5125: ("I", 4), 5126: ("f", 4)}
        fmt, _ = component_formats[component_type]
        width = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}[value_type]
        payload = b"".join(struct.pack("<" + fmt * width, *value) for value in values)
        view_index = len(views)
        views.append({"buffer": 0, "byteOffset": len(output), "byteLength": len(payload)})
        output.extend(payload)
        accessor = {"bufferView": view_index, "byteOffset": 0, "componentType": component_type, "count": len(values), "type": value_type}
        if minmax and values:
            accessor["min"] = [min(value[i] for value in values) for i in range(width)]
            accessor["max"] = [max(value[i] for value in values) for i in range(width)]
        accessors.append(accessor)
        return len(accessors) - 1

    for mesh in gltf.get("meshes", []):
        for primitive in mesh.get("primitives", []):
            semantics = sorted(primitive.get("attributes", {}))
            if "POSITION" not in semantics or "indices" not in primitive:
                continue
            raw_attributes = {sem: _read_gltf_accessor(gltf, data, primitive["attributes"][sem]) for sem in semantics}
            raw_indices = [item[0] for item in _read_gltf_accessor(gltf, data, primitive["indices"])]
            count = len(raw_attributes["POSITION"])
            records = []
            for i in range(count):
                parts = []
                for sem in semantics:
                    places = None if sem == "POSITION" else 6 if sem == "TEXCOORD_0" else 5
                    parts.append(_quantized_tuple(raw_attributes[sem][i], places))
                records.append(tuple(parts))
            ordered = sorted(set(records))
            new_index = {record: i for i, record in enumerate(ordered)}
            remap = [new_index[record] for record in records]
            triangles = []
            for at in range(0, len(raw_indices), 3):
                face = [remap[raw_indices[at]], remap[raw_indices[at + 1]], remap[raw_indices[at + 2]]]
                smallest = face.index(min(face))
                face = tuple(face[smallest:] + face[:smallest])
                triangles.append(face)
            triangles.sort()
            flat_indices = [i for face in triangles for i in face]

            new_attributes = {}
            for sem_index, sem in enumerate(semantics):
                values = [record[sem_index] for record in ordered]
                new_attributes[sem] = append_accessor(values, 5126, gltf["accessors"][primitive["attributes"][sem]]["type"], minmax=(sem == "POSITION"))
            primitive["attributes"] = new_attributes
            primitive["indices"] = append_accessor([(i,) for i in flat_indices], 5125, "SCALAR")

    gltf["accessors"] = accessors
    gltf["bufferViews"] = views
    gltf["buffers"][0]["byteLength"] = len(output)
    with open(bin_path, "wb") as target:
        target.write(output)
    with open(path, "w") as target:
        json.dump(gltf, target, sort_keys=True, separators=(",", ":"))
        target.write("\n")


def export_gltf(path, objects):
    """Writes the asset as glTF with its textures beside it, modifiers applied, Y up."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for export_object in objects:
        canonicalize_object(export_object)
    for obj in bpy.context.scene.objects:
        obj.select_set(obj in objects)
    bpy.context.view_layer.objects.active = objects[0]
    wanted = dict(filepath=path, export_format="GLTF_SEPARATE", use_selection=True, export_apply=True, export_yup=True, export_tangents=True, export_texture_dir="textures", export_image_format="JPEG", export_image_quality=90, export_jpeg_quality=90, export_materials="EXPORT", export_cameras=False, export_lights=False, export_extras=True)
    known = set(bpy.ops.export_scene.gltf.get_rna_type().properties.keys())
    bpy.ops.export_scene.gltf(**{k: v for k, v in wanted.items() if k in known})
    canonicalize_gltf(path)


def render_preview(path, look_at, distance, azimuth_deg, elevation_deg, ground_material, size=(1600, 1000), samples=96, lens=42):
    """A lit picture of what is in the scene: a low sun from the front-left, soft sky light, the ground it stands on."""
    scene = bpy.context.scene
    ground = bpy.data.meshes.new("preview-ground")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=90)
    uv = bm.loops.layers.uv.verify()
    for f in bm.faces:
        for loop in f.loops:
            loop[uv].uv = (loop.vert.co.x / TILE["earth"], loop.vert.co.y / TILE["earth"])
    bm.to_mesh(ground)
    bm.free()
    ground.materials.append(ground_material)
    ground_obj = bpy.data.objects.new("preview-ground", ground)
    scene.collection.objects.link(ground_obj)

    sun_data = bpy.data.lights.new("sun", "SUN")
    sun_data.energy = 4.2
    sun_data.angle = math.radians(1.6)
    sun_data.color = (1.0, 0.94, 0.84)
    sun = bpy.data.objects.new("sun", sun_data)
    sun.rotation_euler = Euler((math.radians(58), 0, math.radians(-38)), "XYZ")
    scene.collection.objects.link(sun)
    world = bpy.data.worlds.new("sky")
    world.use_nodes = True
    background = world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = (0.52, 0.68, 0.95, 1)
    background.inputs["Strength"].default_value = 0.85
    scene.world = world

    camera_data = bpy.data.cameras.new("camera")
    camera_data.lens = lens
    camera = bpy.data.objects.new("camera", camera_data)
    az, el = math.radians(azimuth_deg), math.radians(elevation_deg)
    target = Vector(look_at)
    camera.location = target + Vector((math.cos(el) * math.sin(az), -math.cos(el) * math.cos(az), math.sin(el))) * distance
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(camera)
    scene.camera = camera

    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    try:
        preferences = bpy.context.preferences.addons["cycles"].preferences
        preferences.compute_device_type = "METAL"
        preferences.get_devices()
        for device in preferences.devices:
            device.use = True
        scene.cycles.device = "GPU"
    except Exception as error:  # no GPU for rendering: the picture is the same, only slower
        print("preview: rendering on the CPU:", error)
    scene.render.resolution_x, scene.render.resolution_y = size
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    for obj in (ground_obj, sun, camera):
        bpy.data.objects.remove(obj, do_unlink=True)
