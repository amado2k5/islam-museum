"""Simple box blockouts of Granada's pieces for an artist, using the game's own kit footprints.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_blockouts.py -- <models out> <renders out>

Makes four glTF files: the estate, an eight-house street cluster, a gate with one wall bay and a tower, and the
construction site. These are not game art and nothing in the game loads them. Every block is a box whose object origin
is on the ground at the middle of its footprint, x by y by z as the kit records it; repeated houses carry the exact
piece in a `game_piece` custom property because Blender cannot give two objects the same name.
"""
import json
import math
import os
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_models = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/blockouts")
out_renders = os.path.abspath(argv[1]) if len(argv) > 1 else os.path.abspath("gaming/media/renders/granada-blockouts")
os.makedirs(out_models, exist_ok=True)
os.makedirs(out_renders, exist_ok=True)
root = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
kit = {}
for file in ("town.kit.json", "landmarks.kit.json"):
    with open(os.path.join(root, "media", "models", "granada", "2", file)) as f:
        kit.update(json.load(f)["pieces"])

COLOURS = {
    "house": (0.72, 0.48, 0.24, 1), "estate": (0.45, 0.58, 0.28, 1), "wall": (0.55, 0.42, 0.3, 1),
    "tower": (0.48, 0.34, 0.24, 1), "gate": (0.62, 0.45, 0.28, 1), "scaffold": (0.5, 0.34, 0.17, 1), "crane": (0.36, 0.24, 0.13, 1),
}


def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def material(name, colour):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = colour
    m.use_nodes = True
    m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = colour
    m.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.86
    return m


def box(piece, loc=(0, 0, 0), yaw=0.0, colour=None, name=None):
    w, d, h = kit[piece]["footprint"]
    x, y = w / 2, d / 2
    verts = [(-x, -y, 0), (x, -y, 0), (x, y, 0), (-x, y, 0), (-x, -y, h), (x, -y, h), (x, y, h), (-x, y, h)]
    faces = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    mesh = bpy.data.meshes.new((name or piece) + "-mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name or piece, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler[2] = yaw
    obj["game_piece"] = piece
    obj["footprint_m"] = list(kit[piece]["footprint"])
    obj["origin_rule"] = "ground centre, as the game's kit piece"
    mat_name = "house" if piece.startswith("house") else piece
    mesh.materials.append(material(mat_name, colour or COLOURS.get(mat_name, (0.5, 0.5, 0.5, 1))))
    return obj


def finish(name, camera_target, distance, azimuth=35, elevation=24):
    # A neutral ground plane is only in the render scene, never exported.
    exportables = list(bpy.context.scene.objects)
    for obj in exportables:
        obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(out_models, name + ".gltf"), export_format="GLTF_SEPARATE", use_selection=True, export_yup=True, export_apply=True, export_cameras=False, export_lights=False, export_extras=True)
    for obj in exportables:
        obj.select_set(False)

    mesh = bpy.data.meshes.new("render-ground-mesh")
    s = 90
    mesh.from_pydata([(-s, -s, -0.02), (s, -s, -0.02), (s, s, -0.02), (-s, s, -0.02)], [], [(0, 1, 2, 3)])
    ground = bpy.data.objects.new("render-ground", mesh)
    bpy.context.scene.collection.objects.link(ground)
    mesh.materials.append(material("ground", (0.22, 0.25, 0.18, 1)))
    sun_data = bpy.data.lights.new("sun", "SUN")
    sun_data.energy = 4
    sun_data.angle = math.radians(3)
    sun = bpy.data.objects.new("sun", sun_data)
    sun.rotation_euler = (math.radians(50), 0, math.radians(-35))
    bpy.context.scene.collection.objects.link(sun)
    world = bpy.data.worlds.new("sky")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.35, 0.52, 0.78, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.75
    bpy.context.scene.world = world
    cam_data = bpy.data.cameras.new("camera")
    cam_data.lens = 42
    cam = bpy.data.objects.new("camera", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    az, el = math.radians(azimuth), math.radians(elevation)
    target = Vector(camera_target)
    cam.location = target + Vector((math.cos(el) * math.sin(az), -math.cos(el) * math.cos(az), math.sin(el))) * distance
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene = bpy.context.scene
    scene.camera = cam
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 1280, 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = os.path.join(out_renders, name + ".png")
    bpy.ops.render.render(write_still=True)
    print("BLOCKOUT", name, "exported and rendered", flush=True)


clear()
box("estate")
finish("estate-blockout", (0, 0, 4), 52)

clear()
# Eight houses in two close rows along a lane, alternating the four real house pieces. First use of each kind keeps
# the exact object name; the repeated row carries the same piece in game_piece and a numeric suffix in Blender.
spots = [(-18, -5), (-7, -5.6), (5, -5.2), (16, -4.8), (-17, 6.2), (-5, 6.5), (7, 6.0), (18, 6.4)]
pieces = ["house-a", "house-b", "house-c", "house-d", "house-c", "house-a", "house-d", "house-b"]
seen = set()
for i, (piece, at) in enumerate(zip(pieces, spots)):
    name = piece if piece not in seen else f"{piece}-{i + 1}"
    seen.add(piece)
    box(piece, (at[0], at[1], 0), math.radians((-6, 4, -3, 5)[i % 4]), name=name)
finish("street-cluster-blockout", (0, 0, 4), 55)

clear()
box("gate", (0, 0, 0))
box("wall", (9.5, 0, 0))
box("tower", (17.7, 0, 0))
finish("gate-wall-tower-blockout", (8, 0, 5), 45)

clear()
box("scaffold", (0, 0, 0))
box("crane", (7.0, 2.0, 0), math.radians(-18))
finish("construction-site-blockout", (3, 1, 4.5), 32)
print("BLOCKOUTS complete", out_models, out_renders, flush=True)
