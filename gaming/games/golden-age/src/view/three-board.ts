// Draws the Golden Age board with Three.js on WebGPU. It is given geometry (view/board.ts) and a camera pose
// (view/camera.ts) and holds no game state: a plot is replaced when the screen layer says its look has changed.
//
// The materials and the post-processing chain follow the graphics lab's Three.js renderer (docs/gaming/adr/G-0002).
// That renderer is left exactly as it was measured; this one is the game's and will grow away from it.
import * as THREE from "three/webgpu";
import { builtinAOContext, mix, mrt, normalMap, normalView, pass, positionWorld, screenUV, texture, uniform, vec2, vec3 } from "three/tsl";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { Rng } from "@im/kernel/prng";
import { instanceMatrix, limbMatrix, type MeshData, type Rgb } from "@im/worldkit/mesh";
import { MATERIALS, type MaterialSpec, type SceneMaterialId } from "@im/worldkit/district/generate";
import { awningMesh, boatMesh, cypressMesh, jarMesh, palmMesh, personBodyMesh, personHeadMesh, stallMesh, treeMesh, wheelMesh } from "@im/worldkit/district/kit";
import { skyDome, type Atmosphere } from "@im/worldkit/atmosphere";
import type { TextureData, TextureKind } from "@im/worldkit/textures";
import { PLOTS } from "../rules";
import { CART_OX_JOINTS, WALKER_LEG_JOINTS, cartBedMesh, cartOxLegMesh, cartOxMesh, grazingDonkeyMesh, grazingSpots, walkerBodyMesh, walkerLegMesh, walkerPose, walkerTint, type Environment, type PlotGeometry, type PropInstance, type PropKind, type WaterRect } from "./board";
import { CAMERA_FOV, eyeOf, groundPoint, viewPoint, type CameraPose } from "./camera";
import { BOARD, CHANNEL_HALF, PLOT, RIVER_LEVEL, plotCentre } from "./layout";

export type Quality = "low" | "high";
export interface BoardRendererOptions {
  quality: Quality;
  seed: number;
  reducedMotion: boolean;
  /** Upper limit on backing-store pixels per CSS pixel. */
  maxPixelRatio: number;
}

/** The light of each season: 0 spring, 1 summer, 2 autumn, 3 winter. Art direction, not a sky model. */
const sunFrom = (azimuthDeg: number, elevationDeg: number): [number, number, number] => {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
};
export const SEASON_LIGHT: Atmosphere[] = [
  { id: "golden", sunDirection: sunFrom(242, 36), sunColor: [1.0, 0.88, 0.7], sunIntensity: 5.4, skyZenith: [0.1, 0.28, 0.66], skyHorizon: [0.92, 0.88, 0.8], ambientSky: [0.5, 0.62, 0.9], ambientGround: [0.52, 0.44, 0.32], ambientIntensity: 0.8, fogColor: [0.86, 0.86, 0.82], fogDensity: 0.00034, exposure: 0.66, emissive: 0.05 },
  { id: "noon", sunDirection: sunFrom(218, 56), sunColor: [1.0, 0.95, 0.85], sunIntensity: 5.0, skyZenith: [0.14, 0.34, 0.74], skyHorizon: [0.8, 0.86, 0.92], ambientSky: [0.55, 0.7, 1.0], ambientGround: [0.6, 0.52, 0.4], ambientIntensity: 0.9, fogColor: [0.84, 0.86, 0.86], fogDensity: 0.00048, exposure: 0.7, emissive: 0 },
  { id: "golden", sunDirection: sunFrom(250, 24), sunColor: [1.0, 0.72, 0.42], sunIntensity: 6.0, skyZenith: [0.07, 0.2, 0.56], skyHorizon: [1.25, 0.86, 0.5], ambientSky: [0.42, 0.52, 0.8], ambientGround: [0.5, 0.36, 0.24], ambientIntensity: 0.6, fogColor: [1.0, 0.72, 0.46], fogDensity: 0.00044, exposure: 0.62, emissive: 0.15 },
  { id: "noon", sunDirection: sunFrom(226, 21), sunColor: [0.96, 0.84, 0.72], sunIntensity: 4.2, skyZenith: [0.16, 0.26, 0.5], skyHorizon: [0.82, 0.8, 0.8], ambientSky: [0.5, 0.56, 0.74], ambientGround: [0.4, 0.38, 0.36], ambientIntensity: 0.85, fogColor: [0.78, 0.8, 0.84], fogDensity: 0.00066, exposure: 0.72, emissive: 0.1 },
];

const color = (c: readonly [number, number, number]) => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.LinearSRGBColorSpace);

function geometryOf(m: MeshData): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(m.positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(m.normals, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(m.uvs, 2));
  g.setAttribute("color", new THREE.BufferAttribute(m.colors, 3));
  g.setIndex(new THREE.BufferAttribute(m.indices, 1));
  return g;
}

const PROP_CAPACITY: Record<PropKind, number> = { "palm-a": 900, "palm-b": 900, tree: 900, cypress: 300, awning: 500, stall: 400, jar: 1600 };
const PROP_MATERIAL: Record<PropKind, SceneMaterialId> = { "palm-a": "foliage", "palm-b": "foliage", tree: "foliage", cypress: "foliage", awning: "fabric", stall: "prop", jar: "prop" };
const WALKER_CAPACITY = 720;
const FILL_SECONDS = 0.7;
/** How many canal sheets the board can hold: a stretch a plot and its arms, with room to spare. */
const WATER_CAP = 512;
/** Chimneys the smoke table can hold, eight puffs to each. */
const SMOKE_SOURCES_CAP = 40;
const SMOKE_PUFFS = 8;
const SMOKE_CAP = SMOKE_SOURCES_CAP * SMOKE_PUFFS;
/** The most carts the lanes carry: one to a market plot at most, and never more than this. */
const CART_CAP = 3;
const DONKEY_CAP = 3;
/** The most lamp flames the markets light: one over every stall of the first market plots. */
const LAMP_CAP = 160;

export interface Highlight {
  /** Tinted plots: [plot, r, g, b] in linear colour. */
  tiles: Array<[number, number, number, number]>;
  /** The plot under the pointer or the keyboard cursor, and whether the action there is allowed. */
  cursor: { plot: number; ok: boolean | null } | null;
  /** A canal link being aimed at. */
  link: { a: number; b: number; ok: boolean } | null;
}

interface WaterMesh {
  /** Which instance of the shared water mesh this sheet is, once the table is rebuilt. */
  instance: number;
  rect: WaterRect;
  grow: { from: "x0" | "x1" | "z0" | "z1"; start: number } | null;
}

/** Concatenates engine-neutral meshes into one, offsets moving with the parts. Empty input is an empty mesh. */
export function mergeMeshData(parts: MeshData[]): MeshData {
  let nv = 0;
  let ni = 0;
  for (const p of parts) {
    nv += p.positions.length / 3;
    ni += p.indices.length;
  }
  const positions = new Float32Array(nv * 3);
  const normals = new Float32Array(nv * 3);
  const uvs = new Float32Array(nv * 2);
  const colors = new Float32Array(nv * 3);
  const indices = new Uint32Array(ni);
  let v = 0;
  let i = 0;
  for (const p of parts) {
    positions.set(p.positions, v * 3);
    normals.set(p.normals, v * 3);
    uvs.set(p.uvs, v * 2);
    colors.set(p.colors, v * 3);
    for (let k = 0; k < p.indices.length; k++) indices[i + k] = p.indices[k]! + v;
    v += p.positions.length / 3;
    i += p.indices.length;
  }
  return { positions, normals, uvs, colors, indices };
}

export class BoardRenderer {
  private renderer!: THREE.WebGPURenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 4, 7000);
  private pipeline: THREE.RenderPipeline | null = null;
  private readonly materials = new Map<SceneMaterialId, THREE.Material>();
  private waterMaterial!: THREE.Material;
  private readonly waterTime = uniform(0);
  private readonly disposables: Array<{ dispose(): void }> = [];
  private sky!: THREE.Mesh;
  private skies: THREE.BufferGeometry[] = [];
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private season = -1;
  private pose!: CameraPose;
  private aspect = 1;
  private readonly plots: Array<{ water: WaterMesh[]; geometry: PlotGeometry | null }> = Array.from({ length: PLOTS }, () => ({ water: [], geometry: null }));
  /**
   * The district's still geometry is drawn as one mesh a material for the whole board, not a mesh a plot: what
   * fifty plots cost in draw calls, a handful of materials pays once. When a plot changes, the materials it
   * touches are marked dirty here and merged again from the plots' geometry, at most two a frame, so a new
   * building stands within a few ordinary frames and costs no slow one.
   */
  private readonly merged = new Map<SceneMaterialId, THREE.Mesh>();
  private readonly dirtyMaterials = new Set<SceneMaterialId>();
  /** Canal water sheets, one instance each of a single mesh: the record of each is in its plot's slot. */
  private waterInstances!: THREE.InstancedMesh;
  private waterDirty = false;
  private frame = 0;
  /** 0 clear water to 1 thick with silt; and how far a drought has dropped the canals. */
  private readonly silt = uniform(0);
  private canalDrop = 0;
  private river: THREE.Mesh | null = null;
  private envProps: PropInstance[] = [];
  private readonly propMeshes = new Map<PropKind, THREE.InstancedMesh>();
  private bodies!: THREE.InstancedMesh;
  private heads!: THREE.InstancedMesh;
  private walkerLegs!: THREE.InstancedMesh;
  /** Puffs of smoke over the workshops' kilns and the baths' furnaces, eight to a chimney. */
  private smokeMesh!: THREE.InstancedMesh;
  private smokeSources: Array<{ x: number; y: number; z: number; scale: number }> = [];
  /** Ox-carts on the lanes: the ox, the cart it draws, and the ox's four legs, one instanced mesh each. */
  private cartOx!: THREE.InstancedMesh;
  private cartBeds!: THREE.InstancedMesh;
  private cartOxLegs!: THREE.InstancedMesh;
  private cartCount = 0;
  private donkeysPlaced = false;
  private cartRoutes: Array<{ z: number; speed: number; x0: number; phase: number }> = [];
  /** Donkeys at grass on the river side. */
  private donkeys!: THREE.InstancedMesh;
  /** Lamp flames over the market stalls: small warm unlit beads, which the bloom carries into a glow. */
  private lamps!: THREE.InstancedMesh;
  private walkerPlots: Array<[number, number]> = [];
  private walkerCounts: number[] = new Array<number>(PLOTS).fill(0);
  private boats!: THREE.InstancedMesh;
  private boatPaths: Environment["boats"] = [];
  private envHalfWidth = 1000;
  private wheel!: THREE.Mesh;
  private wheelAt: PlotGeometry["wheel"] = null;
  private waterPlane!: THREE.PlaneGeometry;
  private tiles!: THREE.InstancedMesh;
  private cursor!: THREE.Mesh;
  private link!: THREE.Mesh;
  private cpuMs = 0;
  private now = 0;
  private options!: BoardRendererOptions;
  private canvas!: HTMLCanvasElement;

  static async create(canvas: HTMLCanvasElement, textures: Map<TextureKind, TextureData>, options: BoardRendererOptions): Promise<BoardRenderer> {
    const r = new BoardRenderer();
    await r.init(canvas, textures, options);
    return r;
  }

  private async init(canvas: HTMLCanvasElement, textures: Map<TextureKind, TextureData>, options: BoardRendererOptions): Promise<void> {
    this.canvas = canvas;
    this.options = options;
    const high = options.quality === "high";
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, powerPreference: "high-performance", forceWebGL: false });
    await renderer.init();
    if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error("no-webgpu-backend");
    this.renderer = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = this.scene;

    // ---- Lights (set for the season in setSeason) ----
    this.hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.castShadow = true;
    const size = high ? 4096 : 2048;
    sun.shadow.mapSize.set(size, size);
    const sc = sun.shadow.camera;
    const R = 250;
    sc.left = -R;
    sc.right = R;
    sc.top = R;
    sc.bottom = -R;
    sc.near = 80;
    sc.far = 1500;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.3;
    sun.shadow.radius = 2.4;
    sun.target.position.set(0, 0, BOARD.z0 / 2);
    scene.add(sun, sun.target);
    this.sun = sun;
    scene.fog = new THREE.FogExp2(0xffffff, 0.0004);

    // ---- Sky: one dome per season, and one prefiltered environment for all of them ----
    // Changing the environment map makes the engine rebuild every material's bindings, which measured as a
    // 50 ms stall at each season's end. The seasons differ in sun, sky, haze and exposure; the light the scene
    // takes from the sky itself is spring's throughout.
    const skyMat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, depthWrite: false });
    this.disposables.push(skyMat);
    for (const atm of SEASON_LIGHT) {
      const g = geometryOf(skyDome(atm, 3200));
      this.skies.push(g);
      this.disposables.push(g);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(this.skies[0]!, skyMat));
    const environment = pmrem.fromScene(envScene, 0, 1, 8000);
    this.disposables.push(pmrem, environment);
    this.sky = new THREE.Mesh(this.skies[0]!, skyMat);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -10;
    scene.add(this.sky);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.55;

    // ---- Materials ----
    const maps = new Map<TextureKind, { map: THREE.DataTexture; normal: THREE.DataTexture }>();
    for (const [kind, t] of textures) {
      const mk = (data: Uint8Array, srgb: boolean) => {
        const tex = new THREE.DataTexture(data, t.size, t.size, THREE.RGBAFormat, THREE.UnsignedByteType);
        tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 8;
        tex.repeat.set(1 / t.tileMeters, 1 / t.tileMeters);
        tex.needsUpdate = true;
        this.disposables.push(tex);
        return tex;
      };
      maps.set(kind, { map: mk(t.albedo, true), normal: mk(t.normal, false) });
    }
    const waterNormal = maps.get("water")?.normal;
    if (!waterNormal) throw new Error("the water texture is missing");
    for (const spec of MATERIALS) {
      const m = spec.id === "water" || spec.id === "canalwater" ? this.makeWater(spec, waterNormal) : this.makeStandard(spec, maps);
      this.materials.set(spec.id, m);
      this.disposables.push(m);
    }
    this.waterMaterial = this.materials.get("canalwater")!;

    // ---- Things drawn many times ----
    const propRng = new Rng(options.seed);
    const propMesh: Record<PropKind, MeshData> = { "palm-a": palmMesh(propRng.fork("palm-a")), "palm-b": palmMesh(propRng.fork("palm-b")), tree: treeMesh(propRng.fork("tree")), cypress: cypressMesh(), awning: awningMesh(), stall: stallMesh(propRng.fork("stall")), jar: jarMesh() };
    const instanced = (mesh: MeshData, material: SceneMaterialId, capacity: number, shadow: boolean, dynamic: boolean): THREE.InstancedMesh => {
      const g = geometryOf(mesh);
      this.disposables.push(g);
      const im = new THREE.InstancedMesh(g, this.materials.get(material)!, capacity);
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3);
      im.count = 0;
      im.castShadow = shadow;
      im.receiveShadow = true;
      im.frustumCulled = false;
      if (dynamic) im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(im);
      return im;
    };
    for (const kind of Object.keys(PROP_CAPACITY) as PropKind[]) this.propMeshes.set(kind, instanced(propMesh[kind], PROP_MATERIAL[kind], PROP_CAPACITY[kind], true, false));
    this.bodies = instanced(walkerBodyMesh(), "prop", WALKER_CAPACITY, true, true);
    this.heads = instanced(personHeadMesh(), "prop", WALKER_CAPACITY, false, true);
    this.walkerLegs = instanced(walkerLegMesh(), "prop", WALKER_CAPACITY * 2, true, true);
    // Smoke is a soft round puff, instanced: eight rise out of every chimney in turn, swelling and paling as they go.
    const puff = new THREE.MeshStandardMaterial({ color: [0.62, 0.6, 0.58] as unknown as THREE.Color, transparent: true, opacity: 0.34, depthWrite: false, roughness: 1 });
    this.smokeMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.5, 1), puff, SMOKE_CAP);
    this.smokeMesh.count = 0;
    this.smokeMesh.castShadow = false;
    this.smokeMesh.receiveShadow = false;
    this.smokeMesh.frustumCulled = false;
    this.smokeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.disposables.push(this.smokeMesh.geometry, puff);
    scene.add(this.smokeMesh);
    this.cartOx = instanced(cartOxMesh(), "prop", CART_CAP, true, true);
    this.cartBeds = instanced(cartBedMesh(), "prop", CART_CAP, true, true);
    this.cartOxLegs = instanced(cartOxLegMesh(), "prop", CART_CAP * 4, true, true);
    this.donkeys = instanced(grazingDonkeyMesh(), "prop", DONKEY_CAP, true, true);
    this.cartOx.count = 0;
    this.cartBeds.count = 0;
    this.cartOxLegs.count = 0;
    // Donkey coats, grey and brown and dark, once at the start.
    const coats: Rgb[] = [[0.62, 0.6, 0.58], [0.5, 0.4, 0.3], [0.35, 0.32, 0.3]];
    for (let i = 0; i < DONKEY_CAP; i++) (this.donkeys.instanceColor!.array as Float32Array).set(coats[i % 3]!, i * 3);
    this.donkeys.instanceColor!.needsUpdate = true;
    const flame = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.45, 0.5) });
    this.lamps = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.09, 1), flame, LAMP_CAP);
    this.lamps.count = 0;
    this.lamps.castShadow = false;
    this.lamps.receiveShadow = false;
    this.lamps.frustumCulled = false;
    this.disposables.push(this.lamps.geometry, flame);
    scene.add(this.lamps);
    this.boats = instanced(boatMesh(true), "prop", 4, true, true);
    const wg = geometryOf(wheelMesh());
    this.disposables.push(wg);
    this.wheel = new THREE.Mesh(wg, this.materials.get("wood")!);
    this.wheel.castShadow = true;
    this.wheel.visible = false;
    scene.add(this.wheel);

    // Canal water is flat sheets, one per stretch, so a newly dug stretch can be seen to fill. They are instances
    // of one mesh: a sheet is a metre of flat water exactly like the next, so a hundred of them draw as one call.
    this.waterPlane = new THREE.PlaneGeometry(1, 1);
    this.waterPlane.rotateX(-Math.PI / 2);
    this.disposables.push(this.waterPlane);
    this.waterInstances = new THREE.InstancedMesh(this.waterPlane, this.waterMaterial, WATER_CAP);
    this.waterInstances.count = 0;
    this.waterInstances.receiveShadow = true;
    this.waterInstances.frustumCulled = false;
    this.waterInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.waterInstances);

    // ---- Planning overlay: tinted plots, the cursor and the link being aimed at ----
    const tileGeo = new THREE.PlaneGeometry(PLOT - 1.2, PLOT - 1.2);
    tileGeo.rotateX(-Math.PI / 2);
    const tileMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.34, depthWrite: false, fog: false });
    this.tiles = new THREE.InstancedMesh(tileGeo, tileMat, PLOTS);
    this.tiles.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(PLOTS * 3).fill(1), 3);
    this.tiles.count = 0;
    this.tiles.frustumCulled = false;
    this.tiles.renderOrder = 5;
    scene.add(this.tiles);
    const ring = new THREE.RingGeometry(0.455 * Math.SQRT2 * PLOT, 0.5 * Math.SQRT2 * PLOT, 4, 1, Math.PI / 4);
    ring.rotateX(-Math.PI / 2);
    const cursorMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, depthWrite: false, depthTest: false, fog: false });
    this.cursor = new THREE.Mesh(ring, cursorMat);
    this.cursor.renderOrder = 7;
    this.cursor.visible = false;
    scene.add(this.cursor);
    const linkGeo = new THREE.BoxGeometry(1, 1, 1);
    const linkMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.72, depthWrite: false, fog: false });
    this.link = new THREE.Mesh(linkGeo, linkMat);
    this.link.renderOrder = 6;
    this.link.visible = false;
    scene.add(this.link);
    this.disposables.push(tileGeo, tileMat, ring, cursorMat, linkGeo, linkMat);

    // ---- Post-processing: ambient occlusion and a little bloom (High only) ----
    if (high) {
      const pipeline = new THREE.RenderPipeline(renderer);
      const prePass = pass(scene, this.camera, { samples: 1 });
      prePass.setMRT(mrt({ output: normalView }));
      const aoPass = ao(prePass.getTextureNode("depth"), prePass.getTextureNode(), this.camera);
      aoPass.resolutionScale = 0.5;
      aoPass.radius.value = 2.4;
      aoPass.thickness.value = 1.5;
      aoPass.distanceExponent.value = 1.2;
      aoPass.samples.value = 12;
      const scenePass = pass(scene, this.camera, { samples: 4 });
      scenePass.contextNode = builtinAOContext(aoPass.getTextureNode().sample(screenUV).r);
      const lit = scenePass.getTextureNode("output");
      pipeline.outputNode = lit.add(bloom(lit, 0.18, 0.6, 1.0));
      this.pipeline = pipeline;
    }
    this.setSeason(0);
    this.resize();
  }

  private makeStandard(spec: MaterialSpec, maps: Map<TextureKind, { map: THREE.DataTexture; normal: THREE.DataTexture }>): THREE.Material {
    const tex = spec.texture ? maps.get(spec.texture) : undefined;
    const m = new THREE.MeshStandardMaterial({ color: color(spec.color), roughness: spec.roughness, metalness: spec.metalness, vertexColors: true, map: tex?.map ?? null, normalMap: tex?.normal ?? null });
    if (spec.emissive) {
      m.emissive = color(spec.emissive);
      m.emissiveIntensity = 0.4;
      if (tex) m.emissiveMap = tex.map;
    }
    return m;
  }

  /** Two wave trains crossing at different scales and speeds, in world space, so the river and the canals are one surface. */
  private makeWater(spec: MaterialSpec, normal: THREE.DataTexture): THREE.Material {
    const m = new THREE.MeshPhysicalNodeMaterial({ roughness: spec.roughness, metalness: 0 });
    const p = positionWorld.xz;
    const t = this.waterTime;
    const canal = spec.id === "canalwater";
    const n1 = texture(normal, p.mul(1 / (canal ? 6 : 14)).add(vec2(t.mul(0.018), t.mul(0.009))));
    const n2 = texture(normal, p.mul(1 / (canal ? 2.3 : 4.3)).add(vec2(t.mul(-0.031), t.mul(0.04))));
    const n3 = texture(normal, p.mul(1 / (canal ? 17 : 47)).add(vec2(t.mul(0.006), t.mul(-0.004))));
    const blended = n1.rgb.add(n2.rgb).add(n3.rgb).div(3);
    m.normalNode = normalMap(blended, vec2(canal ? 1.2 : 2.1, canal ? 1.2 : 2.1));
    // A darker, greener water than the lab's: seen from above there is little sky in it, so the body colour carries.
    const base: Rgb = canal ? [0.012, 0.115, 0.12] : [0.008, 0.07, 0.085];
    const deep = vec3(base[0] * 0.6, base[1] * 0.62, base[2] * 0.75);
    const shallow = vec3(base[0] * 1.5, base[1] * 1.5, base[2] * 1.35);
    const clear = mix(deep, shallow, n3.r.sub(0.5).mul(4).add(blended.b.sub(0.55).mul(2.2)).clamp(0, 1));
    // Silt shows: a canal that needs clearing runs brown.
    m.colorNode = canal ? mix(clear, vec3(0.2, 0.13, 0.055), this.silt.mul(0.85)) : clear;
    m.ior = 1.33;
    // The sky is in the water: the scene's prefiltered environment answers at grazing angles, as in Granada,
    // where the same making measured well. Flat calm water would mirror it whole; the wave trains break it up.
    m.envMapIntensity = 3.2;
    return m;
  }

  /** Light, sky and haze for a season of the year. */
  setSeason(soy: number): void {
    if (soy === this.season) return;
    this.season = soy;
    const atm = SEASON_LIGHT[soy] ?? SEASON_LIGHT[0]!;
    this.renderer.toneMappingExposure = atm.exposure;
    this.hemi.color = color(atm.ambientSky);
    this.hemi.groundColor = color(atm.ambientGround);
    this.hemi.intensity = atm.ambientIntensity * 0.3;
    this.sun.color = color(atm.sunColor);
    this.sun.intensity = atm.sunIntensity;
    const t = this.sun.target.position;
    this.sun.position.set(t.x + atm.sunDirection[0] * 700, atm.sunDirection[1] * 700, t.z + atm.sunDirection[2] * 700);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color = color(atm.fogColor);
    fog.density = atm.fogDensity;
    this.sky.geometry = this.skies[soy] ?? this.skies[0]!;
    for (const id of ["litwindow", "lantern"] as const) {
      const m = this.materials.get(id) as THREE.MeshStandardMaterial | undefined;
      if (m) m.emissiveIntensity = atm.emissive * 3.2;
    }
  }

  setEnvironment(env: Environment): void {
    for (const chunk of env.chunks) {
      const g = geometryOf(chunk.mesh);
      this.disposables.push(g);
      const mesh = new THREE.Mesh(g, this.materials.get(chunk.material)!);
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      this.scene.add(mesh);
      if (chunk.material === "water") this.river = mesh;
    }
    this.envProps = env.props;
    this.boatPaths = env.boats;
    this.envHalfWidth = env.halfWidth;
    this.boats.count = Math.min(4, env.boats.length);
  }

  /**
   * Replaces what stands on a plot. `filling` names water sheets that should be seen to fill, with the edge the
   * water comes from and a delay in seconds (ignored under reduced motion).
   *
   * The plot's still geometry is not drawn on its own: it joins the board's merged meshes, one a material, which
   * are made again from the plots' geometry a few at a time (see rebuildMaterials). What a plot change costs is
   * the copying of its materials' arrays, spread over ordinary frames — never a cluster of new meshes in one.
   */
  setPlot(plot: number, g: PlotGeometry, filling: Array<{ id: string; from: "x0" | "x1" | "z0" | "z1"; delay: number }> = [], immediate = false): void {
    const slot = this.plots[plot]!;
    const old = slot.geometry;
    if (old) for (const c of old.chunks) this.dirtyMaterials.add(c.material);
    for (const c of g.chunks) this.dirtyMaterials.add(c.material);
    slot.geometry = g;
    slot.water = g.water.map((rect) => {
      const fill = this.options.reducedMotion ? undefined : filling.find((f) => f.id === rect.id);
      const w: WaterMesh = { instance: -1, rect, grow: fill ? { from: fill.from, start: this.now + fill.delay } : null };
      return w;
    });
    this.waterDirty = true;
    if (immediate) this.rebuildMaterials(Infinity);
  }

  /**
   * Merges the board's dirty materials again from the plots' geometry, `budget` at most. Each material is one
   * mesh for the whole district: concatenating the plots' arrays costs a copy, and the mesh itself — the thing
   * the engine prepares for its passes — is made once and only ever written into.
   */
  private rebuildMaterials(budget: number): void {
    let done = 0;
    for (const id of [...this.dirtyMaterials]) {
      if (done >= budget) break;
      this.dirtyMaterials.delete(id);
      done++;
      const parts: MeshData[] = [];
      for (const slot of this.plots) {
        if (!slot.geometry) continue;
        for (const c of slot.geometry.chunks) if (c.material === id) parts.push(c.mesh);
      }
      const merged = mergeMeshData(parts);
      const g = geometryOf(merged);
      let mesh = this.merged.get(id);
      if (!mesh) {
        mesh = new THREE.Mesh(g, this.materials.get(id)!);
        const flat = id === "canalwater" || id === "earth" || id === "paving" || id === "grass";
        mesh.castShadow = !flat;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.merged.set(id, mesh);
      } else {
        mesh.geometry.dispose();
        mesh.geometry = g;
      }
    }
  }

  /** Assigns every canal sheet its instance of the shared water mesh and writes the still ones' matrices. */
  private rebuildWater(): void {
    this.waterDirty = false;
    const a = this.waterInstances.instanceMatrix.array as Float32Array;
    let n = 0;
    for (const slot of this.plots) {
      for (const w of slot.water) {
        if (n >= WATER_CAP) break;
        w.instance = n;
        this.placeWater(w, w.grow ? 0 : 1);
        n++;
      }
    }
    // Any instance beyond the table is shrunk away.
    for (let i = n; i < this.waterInstances.count; i++) instanceMatrix(a, i * 16, 0, -100, 0, 0, 1e-5, 1e-5, 1e-5);
    this.waterInstances.count = n;
    this.waterInstances.instanceMatrix.needsUpdate = true;
  }

  /** Finishes every waiting merge now (captures and tests). */
  settle(): void {
    this.rebuildMaterials(Infinity);
    if (this.waterDirty) this.rebuildWater();
  }

  /** How the water looks: `silt` 0 to 1, and whether a drought has lowered the river and the canals. */
  setConditions(silt: number, drought: boolean): void {
    this.silt.value = Math.max(0, Math.min(1, silt));
    const drop = drought ? 0.3 : 0;
    if (this.river) this.river.position.y = drought ? -0.4 : 0;
    if (drop === this.canalDrop) return;
    this.canalDrop = drop;
    for (const slot of this.plots) for (const w of slot.water) if (!w.grow) this.placeWater(w, 1);
  }

  private placeWater(w: WaterMesh, k: number): void {
    let { x0, x1, z0, z1 } = w.rect;
    const e = Math.max(0.001, k);
    if (w.grow) {
      if (w.grow.from === "x0") x1 = x0 + (x1 - x0) * e;
      else if (w.grow.from === "x1") x0 = x1 - (x1 - x0) * e;
      else if (w.grow.from === "z0") z1 = z0 + (z1 - z0) * e;
      else z0 = z1 - (z1 - z0) * e;
    }
    if (w.instance < 0) return;
    const a = this.waterInstances.instanceMatrix.array as Float32Array;
    const shrink = k <= 0 ? 1e-5 : 1;
    instanceMatrix(a, w.instance * 16, (x0 + x1) / 2, w.rect.y - this.canalDrop, (z0 + z1) / 2, 0, (x1 - x0) * shrink, 1, (z1 - z0) * shrink);
    this.waterInstances.instanceMatrix.needsUpdate = true;
  }

  /** How many figures each plot shows. Takes effect at the next commit. */
  setWalkers(counts: readonly number[]): void {
    this.walkerCounts = [...counts];
  }

  /** Call after setPlot or setWalkers: rebuilds the lists of trees, stalls, jars and figures. */
  commit(): void {
    const counts = new Map<PropKind, number>();
    const put = (p: PropInstance) => {
      const im = this.propMeshes.get(p.kind)!;
      const i = counts.get(p.kind) ?? 0;
      if (i >= PROP_CAPACITY[p.kind]) return;
      instanceMatrix(im.instanceMatrix.array as Float32Array, i * 16, p.x, p.y, p.z, p.yaw, p.scale, p.scale, p.scale);
      (im.instanceColor!.array as Float32Array).set(p.color, i * 3);
      counts.set(p.kind, i + 1);
    };
    for (const p of this.envProps) put(p);
    this.walkerPlots = [];
    this.wheelAt = null;
    let walkers = 0;
    for (let plot = 0; plot < PLOTS; plot++) {
      const g = this.plots[plot]!.geometry;
      if (!g) continue;
      for (const p of g.props) put(p);
      if (g.wheel) this.wheelAt = g.wheel;
      const n = Math.min(this.walkerCounts[plot] ?? 0, WALKER_CAPACITY - walkers);
      if (n > 0) {
        this.walkerPlots.push([plot, n]);
        for (let i = 0; i < n; i++) {
          const tint = walkerTint(this.options.seed, plot, i) as Rgb;
          (this.bodies.instanceColor!.array as Float32Array).set(tint, (walkers + i) * 3);
          const lc = this.walkerLegs.instanceColor!.array as Float32Array;
          lc.set(tint, (walkers + i) * 6);
          lc.set(tint, (walkers + i) * 6 + 3);
        }
        walkers += n;
      }
    }
    for (const [kind, im] of this.propMeshes) {
      im.count = counts.get(kind) ?? 0;
      im.instanceMatrix.needsUpdate = true;
      im.instanceColor!.needsUpdate = true;
    }
    // Smoke follows the buildings as they stand now: a rebuilt plot brings its chimneys, a ruined one takes them away.
    this.smokeSources = [];
    for (const slot of this.plots) {
      if (!slot.geometry) continue;
      for (const sm of slot.geometry.smoke) {
        if (this.smokeSources.length < SMOKE_SOURCES_CAP) this.smokeSources.push(sm);
      }
    }
    this.smokeMesh.count = this.smokeSources.length * SMOKE_PUFFS;
    // Carts serve the markets: a plot with stalls in it sends one out, up to the lanes' capacity. No market, no cart.
    let markets = 0;
    for (const slot of this.plots) {
      if (!slot.geometry) continue;
      if (slot.geometry.props.some((pr) => pr.kind === "stall")) markets++;
    }
    this.cartCount = Math.min(CART_CAP, markets);
    this.cartOx.count = this.cartCount;
    this.cartBeds.count = this.cartCount;
    this.cartOxLegs.count = this.cartCount * 4;
    if (this.cartRoutes.length === 0) {
      const lanes = [-66, -110, -154];
      for (let i = 0; i < CART_CAP; i++) this.cartRoutes.push({ z: lanes[i % lanes.length]!, speed: 1.5 + 0.35 * latticeHashboard(i, 3), x0: latticeHashboard(i, 11) * 300 - 150, phase: latticeHashboard(i, 23) });
    }
    if (!this.donkeysPlaced) {
      this.donkeysPlaced = true;
      const a = this.donkeys.instanceMatrix.array as Float32Array;
      grazingSpots(this.options.seed).forEach(([x, y, z, yaw], i) => instanceMatrix(a, i * 16, x, y, z, yaw, 1, 1, 1));
      this.donkeys.count = Math.min(DONKEY_CAP, 3);
      this.donkeys.instanceMatrix.needsUpdate = true;
    }
    // A lamp burns over every market stall: neither game has nightfall, so they burn at all hours and read
    // strongest in the dim seasons, as a bazaar's lamps do under the awnings in the afternoon.
    const la = this.lamps.instanceMatrix.array as Float32Array;
    let ln = 0;
    for (const slot of this.plots) {
      if (!slot.geometry) continue;
      for (const pr of slot.geometry.props) {
        if (pr.kind !== "stall" || ln >= LAMP_CAP) continue;
        instanceMatrix(la, ln * 16, pr.x - 0.9 * Math.sin(pr.yaw), pr.y + 2.1, pr.z - 0.9 * Math.cos(pr.yaw), 0, 1, 1.5, 1);
        ln++;
      }
    }
    this.lamps.count = ln;
    this.lamps.instanceMatrix.needsUpdate = true;
    this.bodies.count = walkers;
    this.heads.count = walkers;
    this.walkerLegs.count = walkers * 2;
    this.walkerLegs.instanceColor!.needsUpdate = true;
    this.bodies.instanceColor!.needsUpdate = true;
    this.wheel.visible = this.wheelAt !== null;
    if (this.wheelAt) {
      this.wheel.position.set(this.wheelAt.x, this.wheelAt.y, this.wheelAt.z);
      this.wheel.scale.setScalar(this.wheelAt.radius);
    }
  }

  setHighlight(h: Highlight): void {
    const m = new THREE.Matrix4();
    const colors = this.tiles.instanceColor!.array as Float32Array;
    let n = 0;
    for (const [plot, r, g, b] of h.tiles) {
      const [x, z] = plotCentre(plot);
      m.makeTranslation(x, 0.35, z);
      this.tiles.setMatrixAt(n, m);
      colors.set([r, g, b], n * 3);
      n++;
    }
    this.tiles.count = n;
    this.tiles.instanceMatrix.needsUpdate = true;
    this.tiles.instanceColor!.needsUpdate = true;
    this.cursor.visible = h.cursor !== null;
    if (h.cursor) {
      const [x, z] = plotCentre(h.cursor.plot);
      this.cursor.position.set(x, 0.5, z);
      (this.cursor.material as THREE.MeshBasicMaterial).color = h.cursor.ok === null ? color([1, 0.92, 0.7]) : h.cursor.ok ? color([0.3, 1, 0.75]) : color([1, 0.3, 0.2]);
    }
    this.link.visible = h.link !== null;
    if (h.link) {
      const [ax, az] = plotCentre(h.link.a);
      const [bx, bz] = plotCentre(h.link.b);
      this.link.position.set((ax + bx) / 2, 0.3, (az + bz) / 2);
      this.link.scale.set(Math.abs(bx - ax) + 2 * CHANNEL_HALF, 0.5, Math.abs(bz - az) + 2 * CHANNEL_HALF);
      (this.link.material as THREE.MeshBasicMaterial).color = h.link.ok ? color([0.2, 0.95, 0.9]) : color([1, 0.3, 0.2]);
    }
  }

  setCamera(pose: CameraPose): void {
    this.pose = pose;
    const [x, y, z] = eyeOf(pose);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(pose.tx, 0, pose.tz);
    this.sky.position.copy(this.camera.position);
  }

  /** The ground point under a place in the window (CSS pixels), or null above the horizon. */
  groundAt(clientX: number, clientY: number): [number, number] | null {
    const r = this.canvas.getBoundingClientRect();
    return groundPoint(this.pose, ((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2, this.aspect);
  }

  /** Where a world point is in the window (CSS pixels), or null if it is behind the camera. */
  screenOf(x: number, y: number, z: number): [number, number] | null {
    const r = this.canvas.getBoundingClientRect();
    const [nx, ny, depth] = viewPoint(this.pose, x, y, z, this.aspect);
    if (depth <= 0) return null;
    return [r.left + ((nx + 1) / 2) * r.width, r.top + ((1 - ny) / 2) * r.height];
  }

  render(timeSeconds: number): void {
    const t0 = performance.now();
    this.now = timeSeconds;
    this.frame++;
    this.rebuildMaterials(2);
    if (this.waterDirty) this.rebuildWater();
    this.waterTime.value = timeSeconds;
    // Water that is still filling.
    for (const slot of this.plots) {
      for (const w of slot.water) {
        if (!w.grow) continue;
        const k = (timeSeconds - w.grow.start) / FILL_SECONDS;
        if (k >= 1) {
          w.grow = null;
          this.placeWater(w, 1);
        } else this.placeWater(w, Math.max(0, k));
      }
    }
    // Figures on the lanes.
    const body = this.bodies.instanceMatrix.array as Float32Array;
    const walkTime = this.options.reducedMotion ? 0 : timeSeconds;
    let n = 0;
    for (const [plot, count] of this.walkerPlots) {
      for (let i = 0; i < count; i++) {
        const [x, z, heading, s] = walkerPose(this.options.seed, plot, i, walkTime);
        const bob = this.options.reducedMotion ? 0 : 0.03 * Math.abs(Math.sin(timeSeconds * 6 + i));
        instanceMatrix(body, n * 16, x, 0.04 + bob, z, heading, s, s, s);
        n++;
      }
    }
    (this.heads.instanceMatrix.array as Float32Array).set(body.subarray(0, n * 16));
    this.bodies.instanceMatrix.needsUpdate = true;
    this.heads.instanceMatrix.needsUpdate = true;
    // Two legs to a figure, swinging opposite ways in step with the bob; frozen when the motion is reduced.
    const legs = this.walkerLegs.instanceMatrix.array as Float32Array;
    let li = 0;
    for (const [plot, count] of this.walkerPlots) {
      for (let i = 0; i < count; i++) {
        const swing = this.options.reducedMotion ? 0 : 0.5 * Math.sin(timeSeconds * 6 + li * 0.5);
        const b = (li) * 16;
        WALKER_LEG_JOINTS.forEach((j, side) => limbMatrix(legs, (li * 2 + side) * 16, body, b, j[0], j[1], j[2], side ? -swing : swing));
        li++;
      }
    }
    this.walkerLegs.instanceMatrix.needsUpdate = true;
    // Smoke: each puff climbs out of its chimney, swelling and paling, and is carried a little downwind as it goes.
    if (this.smokeMesh.count > 0) {
      const arr = this.smokeMesh.instanceMatrix.array as Float32Array;
      const colArr = this.smokeMesh.instanceColor?.array as Float32Array | undefined;
      let w = 0;
      const wind = this.options.reducedMotion ? 0 : 1;
      for (let s = 0; s < this.smokeSources.length; s++) {
        const src = this.smokeSources[s]!;
        const hs = latticeHashboard(s, 7);
        for (let i = 0; i < SMOKE_PUFFS; i++) {
          const phase = this.options.reducedMotion ? i / SMOKE_PUFFS : (timeSeconds * 0.16 + i / SMOKE_PUFFS + hs) % 1;
          const rise = phase * 7.5 * src.scale;
          const drift = phase * phase * 3.2 * wind;
          const wobble = 0.3 * Math.sin(timeSeconds * 0.9 + i * 2.1 + s);
          const size = (0.55 + phase * 2.6) * src.scale;
          instanceMatrix(arr, w * 16, src.x + drift + wobble * phase, src.y + rise, src.z + drift * 0.4, 0, size, size * 1.15, size);
          if (colArr) {
            const shade = 0.35 + phase * 0.55;
            colArr.set([shade, shade, shade * 1.02], w * 3);
          }
          w++;
        }
      }
      this.smokeMesh.instanceMatrix.needsUpdate = true;
      if (this.smokeMesh.instanceColor) this.smokeMesh.instanceColor.needsUpdate = true;
    }
    // Ox-carts on the lanes: out along one side of the lane and back along the other, legs stepping as they go.
    if (this.cartCount > 0) {
      const oxA = this.cartOx.instanceMatrix.array as Float32Array;
      const bedA = this.cartBeds.instanceMatrix.array as Float32Array;
      const legA = this.cartOxLegs.instanceMatrix.array as Float32Array;
      const span = (BOARD.x1 - BOARD.x0) - 30;
      for (let i = 0; i < this.cartCount; i++) {
        const r = this.cartRoutes[i]!;
        const t = this.options.reducedMotion ? r.phase : ((timeSeconds * r.speed + r.x0) / span) % 2;
        const tt = t < 0 ? t + 2 : t;
        const out = tt < 1;
        const k = out ? tt : 2 - tt;
        const x = BOARD.x0 + 15 + span * k;
        const side = out ? CHANNEL_HALF + 0.9 : -(CHANNEL_HALF + 0.9);
        const heading = out ? Math.PI / 2 : -Math.PI / 2;
        const y = 0.02;
        instanceMatrix(oxA, i * 16, x, y, r.z + side, heading, 1, 1, 1);
        instanceMatrix(bedA, i * 16, x, y, r.z + side, heading, 1, 1, 1);
        const swing = this.options.reducedMotion ? 0 : 0.3 * Math.sin(timeSeconds * 3.4 + i * 1.9);
        CART_OX_JOINTS.forEach((j, q) => limbMatrix(legA, (i * 4 + q) * 16, oxA, i * 16, j[0], j[1], j[2], q === 0 || q === 3 ? swing : -swing));
      }
      this.cartOx.instanceMatrix.needsUpdate = true;
      this.cartBeds.instanceMatrix.needsUpdate = true;
      this.cartOxLegs.instanceMatrix.needsUpdate = true;
    }
    // Boats on the river.
    const boat = this.boats.instanceMatrix.array as Float32Array;
    const span = this.envHalfWidth * 2 - 200;
    for (let i = 0; i < this.boats.count; i++) {
      const b = this.boatPaths[i]!;
      const x = ((((b.x0 + b.speed * walkTime + span / 2) % span) + span) % span) - span / 2;
      const heave = this.options.reducedMotion ? 0 : 0.1 * Math.sin(timeSeconds * 0.9 + b.phase);
      instanceMatrix(boat, i * 16, x, RIVER_LEVEL + 0.3 + heave, b.z, b.speed < 0 ? Math.PI : 0, 1, 1, 1);
    }
    this.boats.instanceMatrix.needsUpdate = true;
    if (this.wheelAt) this.wheel.rotation.set(0, 0, this.options.reducedMotion ? 0 : -timeSeconds * 0.35);
    if (this.pipeline) this.pipeline.render();
    else this.renderer.render(this.scene, this.camera);
    this.cpuMs = performance.now() - t0;
  }

  /** Matches the backing store to the canvas's size on the page. */
  resize(): void {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.options.maxPixelRatio));
    this.renderer.setSize(w, h, false);
    this.aspect = w / h;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  info(): { drawCalls: number; triangles: number; cpuRenderMs: number; engine: string; pixels: [number, number]; walkers: number } {
    const r = this.renderer.info.render as unknown as { drawCalls: number; triangles: number };
    return { drawCalls: r.drawCalls, triangles: r.triangles, cpuRenderMs: this.cpuMs, engine: `three r${THREE.REVISION} webgpu`, pixels: [this.canvas.width, this.canvas.height], walkers: this.bodies.count };
  }

  dispose(): void {
    for (const mesh of this.merged.values()) mesh.geometry.dispose();
    for (const d of this.disposables) d.dispose();
    this.pipeline?.dispose();
    this.renderer.dispose();
  }
}


/** A small deterministic hash for smoke phases, so no two chimneys breathe in step. */
function latticeHashboard(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) >>> 0;
  h = ((h ^ (h >> 13)) * 1274126177) >>> 0;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}
