// Draws Granada's valley with Three.js on WebGPU. It is given the geometry of view/valley.ts and a "look" worked out
// from the state of the game (which crop stands where and how much of it, which branches carry water, how full the
// pool is, how many houses stand), and holds no game state of its own.
//
// The materials, the water and the post-processing follow The Golden Age's renderer (docs/gaming/adr/G-0002). One
// lesson from it is kept here: the environment map is made once and never swapped during play.
import * as THREE from "three/webgpu";
import { attribute, builtinAOContext, float, floor, fract, fwidth, min, mix, mrt, normalMap, normalView, pass, positionWorld, screenUV, sin, smoothstep, texture, uniform, uv, vec2, vec3, vec4 } from "three/tsl";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { SkyMesh } from "three/addons/objects/SkyMesh.js";
import { Rng } from "@im/kernel/prng";
import { instanceMatrix, type MeshData, type Rgb } from "@im/worldkit/mesh";
import { MATERIALS, type MaterialSpec, type SceneMaterialId } from "@im/worldkit/district/generate";
import { ROBE_TINTS, awningMesh, palmMesh, personBodyMesh, personHeadMesh, stallMesh } from "@im/worldkit/district/kit";
import type { Atmosphere } from "@im/worldkit/atmosphere";
import type { TextureData, TextureKind } from "@im/worldkit/textures";
import { FOV, eyeOf, type Pose } from "./camera";
import { CHANNELS, FIELDS, GRANARY, HOUSE_LOTS, MARKET, PLOT_GRID, POOL, STORE, VILLAGE, broadTree, buildLand, buildRange, buildRiver, buildScenery, channelWater, cropSpots, cypressTree, fieldAt, fieldGround, heightAt, oliveTree, orchardTree, plotTable, poolWater, poplarTree, vegetablePlant, wheatTuft, type Chunk } from "./valley";

export type Quality = "low" | "high";
export interface ValleyOptions {
  quality: Quality;
  seed: number;
  reducedMotion: boolean;
  maxPixelRatio: number;
}
export interface FieldLook {
  crop: "wheat" | "olives" | "vegetables" | null;
  /** 0 to 1. */
  growth: number;
  /** Share of the crop still standing in the field: 1 while it grows, falling as it is brought in, 0 when gathered. */
  standing: number;
  ripe: boolean;
}
export interface ValleyLook {
  season: number;
  rain: boolean;
  /** 0 to 1. */
  pool: number;
  branches: Record<string, "flowing" | "weak" | "none">;
  fields: Record<string, FieldLook>;
  houses: number;
  housesUnderWay: number;
  granary: "none" | "under-way" | "built";
  /** People out at work, drawn walking between the village and the places where there is work. */
  busy: number;
  selected: string | null;
}

const sunFrom = (azimuthDeg: number, elevationDeg: number): [number, number, number] => {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
};
/**
 * The light of each season. The sun stands in the south, to the right of the valley as it is first seen, so that
 * walls, trees and furrows are modelled by light from the side. Art direction, not a sky model.
 */
export const SEASON_LIGHT: Atmosphere[] = [
  { id: "golden", sunDirection: sunFrom(152, 34), sunColor: [1.0, 0.92, 0.78], sunIntensity: 4.6, skyZenith: [0.12, 0.3, 0.68], skyHorizon: [0.86, 0.88, 0.86], ambientSky: [0.5, 0.64, 0.95], ambientGround: [0.42, 0.38, 0.26], ambientIntensity: 1, fogColor: [0.6, 0.72, 0.86], fogDensity: 0.00006, exposure: 0.9, emissive: 0.1 },
  { id: "noon", sunDirection: sunFrom(196, 52), sunColor: [1.0, 0.95, 0.84], sunIntensity: 4.2, skyZenith: [0.13, 0.33, 0.76], skyHorizon: [0.82, 0.86, 0.9], ambientSky: [0.55, 0.7, 1.0], ambientGround: [0.5, 0.44, 0.3], ambientIntensity: 1, fogColor: [0.62, 0.74, 0.88], fogDensity: 0.00007, exposure: 0.84, emissive: 0 },
  { id: "golden", sunDirection: sunFrom(214, 21), sunColor: [1.0, 0.76, 0.48], sunIntensity: 5.4, skyZenith: [0.08, 0.22, 0.58], skyHorizon: [1.2, 0.84, 0.52], ambientSky: [0.44, 0.52, 0.8], ambientGround: [0.44, 0.32, 0.2], ambientIntensity: 1, fogColor: [0.82, 0.7, 0.6], fogDensity: 0.00009, exposure: 0.92, emissive: 0.3 },
  { id: "noon", sunDirection: sunFrom(164, 22), sunColor: [0.96, 0.88, 0.8], sunIntensity: 3.6, skyZenith: [0.18, 0.28, 0.5], skyHorizon: [0.8, 0.8, 0.82], ambientSky: [0.5, 0.56, 0.72], ambientGround: [0.36, 0.34, 0.32], ambientIntensity: 1.1, fogColor: [0.66, 0.7, 0.76], fogDensity: 0.00012, exposure: 0.95, emissive: 0.2 },
];
/** The sky model is far brighter than the scene's lights are set for; it is drawn at this share of itself. */
const SKY_GAIN = 0.55;

type TreeKind = "broad" | "citrus" | "almond" | "poplar" | "cypress" | "scrub";
/** The colour of each kind of tree in spring, summer, autumn and winter. */
const TREE_TINT: Record<TreeKind, Rgb[]> = {
  broad: [[0.2, 0.4, 0.1], [0.13, 0.3, 0.07], [0.5, 0.34, 0.07], [0.27, 0.23, 0.16]],
  citrus: [[0.07, 0.2, 0.06], [0.06, 0.18, 0.05], [0.07, 0.19, 0.055], [0.06, 0.16, 0.055]],
  almond: [[0.86, 0.6, 0.66], [0.17, 0.33, 0.09], [0.45, 0.31, 0.08], [0.26, 0.21, 0.16]],
  poplar: [[0.27, 0.45, 0.12], [0.17, 0.36, 0.09], [0.72, 0.52, 0.08], [0.3, 0.26, 0.19]],
  cypress: [[0.05, 0.13, 0.06], [0.05, 0.13, 0.06], [0.05, 0.125, 0.06], [0.045, 0.115, 0.06]],
  scrub: [[0.12, 0.19, 0.075], [0.11, 0.17, 0.07], [0.12, 0.17, 0.07], [0.1, 0.15, 0.07]],
};
interface Grove {
  kind: TreeKind;
  spots: number[][];
  near: THREE.InstancedMesh;
  far: THREE.InstancedMesh;
  tints: Float32Array;
}

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
const WHEAT_SPACING = 1.9;
const VEG_SPACING = 2.6;
const WALKERS = 64;
const GREEN: Rgb = [0.3, 0.56, 0.16];
const GOLD: Rgb = [1.0, 0.78, 0.3];

interface Soil {
  material: THREE.Material;
  ground: { value: THREE.Color };
  rows: { value: THREE.Color };
}

export class ValleyRenderer {
  private renderer!: THREE.WebGPURenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 3, 14000);
  private pipeline: THREE.RenderPipeline | null = null;
  private readonly materials = new Map<SceneMaterialId, THREE.Material>();
  private readonly waterTime = uniform(0);
  private readonly disposables: Array<{ dispose(): void }> = [];
  private sky!: SkyMesh;
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private season = -1;
  private raining = false;
  private skyCover = 0.5;
  private sunDirection: readonly [number, number, number] = [0, 1, 0];
  private shadowAt = "";
  private readonly groves: Grove[] = [];
  private lod: [number, number, number] = [1e9, 1e9, 0];
  private pose: Pose | null = null;
  private pixelRatioCap = 2;
  private aspect = 1;
  private canvas!: HTMLCanvasElement;
  private options!: ValleyOptions;
  private cpuMs = 0;
  private poolMesh!: THREE.Mesh;
  private poolFloor = 0;
  private readonly channels = new Map<string, { head: THREE.Mesh; tail: THREE.Mesh }>();
  private meadowStone: THREE.Mesh[] = [];
  private houses: THREE.Mesh[][] = [];
  private granary: THREE.Mesh[] = [];
  private scaffold!: THREE.InstancedMesh;
  private readonly crops = new Map<string, { wheat: THREE.InstancedMesh; veg: THREE.InstancedMesh; wheatSpots: Float32Array; vegSpots: Float32Array; soil: Soil; shown: string }>();
  private olives!: THREE.InstancedMesh;
  private oliveSpots: number[][] = [];
  private bodies!: THREE.InstancedMesh;
  private heads!: THREE.InstancedMesh;
  private walkers = 0;
  private walkTargets: Array<[number, number]> = [];
  private ring!: THREE.Mesh;
  private rain!: THREE.LineSegments;
  private readonly raycaster = new THREE.Raycaster();

  static async create(canvas: HTMLCanvasElement, textures: Map<TextureKind, TextureData>, options: ValleyOptions): Promise<ValleyRenderer> {
    const r = new ValleyRenderer();
    await r.init(canvas, textures, options);
    return r;
  }

  private async init(canvas: HTMLCanvasElement, textures: Map<TextureKind, TextureData>, options: ValleyOptions): Promise<void> {
    this.canvas = canvas;
    this.options = options;
    this.pixelRatioCap = options.maxPixelRatio;
    const high = options.quality === "high";
    const seed = options.seed;
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, powerPreference: "high-performance", forceWebGL: false });
    await renderer.init();
    if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error("no-webgpu-backend");
    this.renderer = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = this.scene;

    // ---- Light ----
    this.hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.castShadow = true;
    const size = high ? 4096 : 2048;
    sun.shadow.mapSize.set(size, size);
    const sc = sun.shadow.camera;
    const R = 430;
    sc.left = -R;
    sc.right = R;
    sc.top = R;
    sc.bottom = -R;
    sc.near = 100;
    sc.far = 2600;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.6;
    sun.shadow.radius = 1.6;
    sun.target.position.set(40, 0, 40);
    scene.add(sun, sun.target);
    this.sun = sun;
    scene.fog = new THREE.FogExp2(0xffffff, 0.00015);

    // ---- Sky: a physical sky with drifting cloud, and one prefiltered environment made from it for every season ----
    const sky = new SkyMesh();
    sky.scale.setScalar(20000);
    sky.frustumCulled = false;
    sky.mieCoefficient.value = 0.004;
    sky.mieDirectionalG.value = 0.82;
    sky.turbidity.value = 3;
    sky.rayleigh.value = 1.5;
    sky.sunPosition.value.set(...SEASON_LIGHT[0]!.sunDirection);
    const skyMaterial = sky.material as THREE.NodeMaterial;
    const skyColour = skyMaterial.colorNode as unknown as ReturnType<typeof vec4>;
    skyMaterial.colorNode = vec4(skyColour.rgb.mul(SKY_GAIN), 1);
    // The sun's disc is left out of the environment, where it would become a blot of light on everything.
    sky.showSunDisc.value = false;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(sky);
    const environment = pmrem.fromScene(envScene, 0, 1, 30000);
    sky.showSunDisc.value = true;
    this.disposables.push(pmrem, environment, sky.geometry, skyMaterial);
    this.sky = sky;
    scene.add(sky);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.18;

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
    const mat = (id: SceneMaterialId) => this.materials.get(id)!;
    const add = (mesh: MeshData, material: SceneMaterialId, cast: boolean, receive = true): THREE.Mesh => {
      const g = geometryOf(mesh);
      this.disposables.push(g);
      const m = new THREE.Mesh(g, mat(material));
      m.castShadow = cast;
      m.receiveShadow = receive;
      scene.add(m);
      return m;
    };
    const addChunks = (chunks: Chunk[]): THREE.Mesh[] => chunks.map((c) => add(c.mesh, c.material, true));

    // ---- The land, the range, the water ----
    const earth = maps.get("earth");
    const earthData = textures.get("earth");
    if (!earth || !earthData) throw new Error("the earth texture is missing");
    const detail = this.detailOf(earth, earthData);
    const land = new THREE.Mesh(geometryOf(buildLand(seed)), this.makeLand(detail, seed));
    land.receiveShadow = true;
    this.disposables.push(land.geometry, land.material as THREE.Material);
    scene.add(land);
    const range = add(buildRange(seed), "prop", false, false);
    range.frustumCulled = false;
    add(buildRiver(), "water", false);
    this.poolMesh = add(poolWater(), "canalwater", false);
    this.poolFloor = heightAt(POOL.x, POOL.z, seed);
    for (const id of Object.keys(CHANNELS)) {
      const w = channelWater(id, seed);
      this.channels.set(id, { head: add(w.head, "canalwater", false), tail: add(w.tail, "canalwater", false) });
    }

    // ---- What is built ----
    const scenery = buildScenery(seed);
    addChunks(scenery.chunks);
    this.meadowStone = addChunks(scenery.meadowChannel);
    this.houses = scenery.houses.map((h) => addChunks(h));
    this.granary = addChunks(scenery.granary);

    // ---- Things drawn many times ----
    const rng = new Rng(seed);
    const instanced = (mesh: MeshData, material: SceneMaterialId, capacity: number, shadow: boolean, dynamic = false): THREE.InstancedMesh => {
      const g = geometryOf(mesh);
      this.disposables.push(g);
      const im = new THREE.InstancedMesh(g, mat(material), capacity);
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3);
      im.count = 0;
      im.castShadow = shadow;
      im.receiveShadow = true;
      im.frustumCulled = false;
      if (dynamic) im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(im);
      return im;
    };
    const fill = (im: THREE.InstancedMesh, spots: number[][], yScale = 1, tint?: (i: number) => Rgb) => {
      const a = im.instanceMatrix.array as Float32Array;
      const c = im.instanceColor!.array as Float32Array;
      spots.forEach((s, i) => {
        instanceMatrix(a, i * 16, s[0]!, s[1]!, s[2]!, s[3]!, s[4]!, s[4]! * yScale, s[4]!);
        const t = tint?.(i) ?? [1, 1, 1];
        c.set(t, i * 3);
      });
      im.count = spots.length;
      im.instanceMatrix.needsUpdate = true;
      im.instanceColor!.needsUpdate = true;
    };
    const grove = (kind: TreeKind, spots: number[][], near: MeshData, far: MeshData) => {
      if (!spots.length) return;
      this.groves.push({ kind, spots, near: instanced(near, "foliage", spots.length, true, true), far: instanced(far, "foliage", spots.length, false, true), tints: new Float32Array(spots.length * 3) });
    };
    const halfOf = (spots: number[][], which: number) => spots.filter((_, i) => i % 2 === which);
    for (const which of [0, 1]) {
      grove("broad", halfOf(scenery.trees, which), broadTree(seed + which, false), broadTree(seed, true));
      grove("citrus", halfOf(scenery.citrus, which), orchardTree(seed + which, false), orchardTree(seed, true));
      grove("almond", halfOf(scenery.almonds, which), orchardTree(seed + 2 + which, false), orchardTree(seed, true));
    }
    grove("scrub", scenery.scrub, orchardTree(seed + 5, false), orchardTree(seed, true));
    grove("poplar", scenery.poplars, poplarTree(false), poplarTree(true));
    grove("cypress", scenery.cypresses, cypressTree(false), cypressTree(true));
    fill(instanced(palmMesh(rng.fork("palm")), "foliage", scenery.palms.length + 1, true), scenery.palms, 1, () => [0.62, 0.7, 0.5]);
    fill(instanced(stallMesh(rng.fork("stall")), "prop", scenery.stalls.length + 1, true), scenery.stalls);
    fill(instanced(awningMesh(), "fabric", scenery.stalls.length + 1, true), scenery.stalls, 1, (i) => (i % 3 === 0 ? [0.75, 0.2, 0.16] : i % 3 === 1 ? [0.16, 0.42, 0.5] : [0.86, 0.66, 0.24]));
    this.oliveSpots = scenery.olives;
    this.olives = instanced(oliveTree(seed), "foliage", scenery.olives.length + 1, true);
    fill(this.olives, scenery.olives);

    // Crops: places for wheat and for vegetables in each field that can be sown.
    const wheatGeo = wheatTuft();
    const vegGeo = vegetablePlant();
    for (const id of Object.keys(FIELDS)) {
      const wheatSpots = id === "olive-terrace" ? new Float32Array(0) : cropSpots(id, WHEAT_SPACING, seed);
      const vegSpots = id === "olive-terrace" ? new Float32Array(0) : cropSpots(id, VEG_SPACING, seed + 1);
      const wheat = instanced(wheatGeo, "foliage", wheatSpots.length / 5 + 1, false);
      const veg = instanced(vegGeo, "foliage", vegSpots.length / 5 + 1, false);
      // Each field's soil has a material of its own, so that it can darken when sown and pale to stubble.
      const soil = this.makeSoil(detail);
      this.disposables.push(soil.material);
      const g = geometryOf(fieldGround(id, seed));
      this.disposables.push(g);
      const ground = new THREE.Mesh(g, soil.material);
      ground.receiveShadow = true;
      scene.add(ground);
      this.crops.set(id, { wheat, veg, wheatSpots, vegSpots, soil, shown: "" });
    }
    (mat("foliage") as THREE.MeshStandardMaterial).side = THREE.DoubleSide;

    // Scaffolding for what is being built: poles round a house lot or the granary.
    const pole = new THREE.BoxGeometry(0.22, 1, 0.22);
    pole.translate(0, 0.5, 0);
    this.disposables.push(pole);
    this.scaffold = new THREE.InstancedMesh(pole, mat("wood"), 80);
    this.scaffold.count = 0;
    this.scaffold.castShadow = true;
    scene.add(this.scaffold);

    // People.
    this.bodies = instanced(personBodyMesh(), "prop", WALKERS, true, true);
    this.heads = instanced(personHeadMesh(), "prop", WALKERS, false, true);
    const tint = this.bodies.instanceColor!.array as Float32Array;
    for (let i = 0; i < WALKERS; i++) tint.set(ROBE_TINTS[i % ROBE_TINTS.length]!, i * 3);
    this.bodies.instanceColor!.needsUpdate = true;

    // The ring round a chosen field, and the rain.
    const ringGeo = new THREE.RingGeometry(0.982, 1, 96);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false, fog: false });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.renderOrder = 6;
    this.ring.visible = false;
    scene.add(this.ring);
    const drops = new Float32Array(2600 * 6);
    for (let i = 0; i < 2600; i++) {
      const x = rng.range(-520, 620);
      const y = rng.range(0, 260);
      const z = rng.range(-300, 380);
      drops.set([x, y, z, x - 0.9, y - 4.5, z + 0.4], i * 6);
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(drops, 3));
    const rainMat = new THREE.LineBasicMaterial({ color: 0xcfe6f2, transparent: true, opacity: 0.22, fog: false });
    this.rain = new THREE.LineSegments(rainGeo, rainMat);
    this.rain.visible = false;
    this.rain.frustumCulled = false;
    scene.add(this.rain);
    this.disposables.push(ringGeo, ringMat, rainGeo, rainMat);

    // ---- Post-processing: ambient occlusion and a little bloom (High only) ----
    if (high) {
      const pipeline = new THREE.RenderPipeline(renderer);
      const prePass = pass(scene, this.camera, { samples: 1 });
      prePass.setMRT(mrt({ output: normalView }));
      const aoPass = ao(prePass.getTextureNode("depth"), prePass.getTextureNode(), this.camera);
      aoPass.resolutionScale = 0.5;
      aoPass.radius.value = 3.2;
      aoPass.thickness.value = 1.6;
      aoPass.distanceExponent.value = 1.2;
      aoPass.samples.value = 12;
      const scenePass = pass(scene, this.camera, { samples: 4 });
      scenePass.contextNode = builtinAOContext(aoPass.getTextureNode().sample(screenUV).r);
      const lit = scenePass.getTextureNode("output");
      pipeline.outputNode = lit.add(bloom(lit, 0.1, 0.5, 1.5));
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

  /** The earth texture as fine grain and as broad patches, both about 1, to multiply a colour by. */
  private detailOf(earth: { map: THREE.DataTexture; normal: THREE.DataTexture }, data: TextureData) {
    // Mean of the tile, in linear light, so that multiplying by it does not darken or tint the land.
    const mean = [0, 0, 0];
    const lin = (v: number) => Math.pow(v / 255, 2.2);
    for (let i = 0; i < data.albedo.length; i += 4 * 97) for (let c = 0; c < 3; c++) mean[c]! += lin(data.albedo[i + c]!);
    const n = Math.ceil(data.albedo.length / (4 * 97));
    const p = positionWorld.xz;
    const grain = texture(earth.map, p.div(data.tileMeters)).rgb.div(vec3(mean[0]! / n, mean[1]! / n, mean[2]! / n));
    const patches = texture(earth.map, p.div(data.tileMeters * 19)).g.div(mean[1]! / n);
    return { colour: mix(vec3(1, 1, 1), grain, 0.5).mul(mix(float(0.86), float(1.14), patches.clamp(0, 2).mul(0.5))), normal: normalMap(texture(earth.normal, p.div(data.tileMeters)), vec2(0.7, 0.7)) };
  }

  /**
   * The land. Its plots are drawn by the material from a table of one texel per plot, so their borders and their
   * rows stay sharp however near the camera comes; off the plain the land takes the colour its points carry.
   */
  private makeLand(detail: ReturnType<ValleyRenderer["detailOf"]>, seed: number): THREE.Material {
    const table = plotTable(seed);
    const lookup = (data: Uint8Array, srgb: boolean) => {
      const t = new THREE.DataTexture(data, table.width, table.height, THREE.RGBAFormat, THREE.UnsignedByteType);
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.magFilter = t.minFilter = THREE.NearestFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
      this.disposables.push(t);
      return t;
    };
    const G = PLOT_GRID;
    const p = positionWorld.xz;
    const u = p.x.mul(G.ax).add(p.y.mul(G.az)).div(G.du);
    const v = p.y.mul(G.ax).sub(p.x.mul(G.az)).div(G.dv);
    const st = vec2(floor(u), floor(v)).sub(vec2(G.u0, G.v0)).add(0.5).div(vec2(G.w, G.h));
    const ground = texture(lookup(table.base, true), st).rgb;
    const rowColour = texture(lookup(table.row, true), st).rgb;
    const params = texture(lookup(table.params, false), st);
    const fu = fract(u);
    const fv = fract(v);
    // Metres to the plot's border, and metres across its rows.
    const edge = min(min(fu, fu.oneMinus()).mul(G.du), min(fv, fv.oneMinus()).mul(G.dv));
    const phase = mix(fu.mul(G.du), fv.mul(G.dv), params.b).div(params.g.mul(12).max(0.5));
    // Far off, where a row is narrower than a pixel, the rows give way to their average.
    const sharp = smoothstep(0.2, 0.7, fwidth(phase)).oneMinus();
    const rows = mix(float(0.5), smoothstep(0.3, 0.7, sin(phase.mul(Math.PI * 2)).mul(0.5).add(0.5)), sharp).mul(params.r);
    const hedge = smoothstep(0.7, 2.1, edge).oneMinus().mul(0.8);
    const plot = mix(mix(ground, rowColour, rows), vec3(0.05, 0.085, 0.035), hedge);
    const m = new THREE.MeshStandardNodeMaterial({ roughness: 1, metalness: 0 });
    m.colorNode = mix(attribute("color", "vec3"), plot, uv().x).mul(detail.colour);
    m.normalNode = detail.normal;
    return m;
  }

  /** The tilled ground of a field: its soil, and rows along its length in a second colour. */
  private makeSoil(detail: ReturnType<ValleyRenderer["detailOf"]>): Soil {
    const ground = uniform(new THREE.Color(0.3, 0.22, 0.14));
    const rowColour = uniform(new THREE.Color(0.2, 0.14, 0.09));
    const p = positionWorld.xz;
    const phase = p.y.add(p.x.mul(0.056)).div(WHEAT_SPACING);
    const sharp = smoothstep(0.2, 0.7, fwidth(phase)).oneMinus();
    const rows = mix(float(0.5), smoothstep(0.3, 0.7, sin(phase.mul(Math.PI * 2)).mul(0.5).add(0.5)), sharp);
    const m = new THREE.MeshStandardNodeMaterial({ roughness: 1, metalness: 0 });
    m.colorNode = mix(ground, rowColour, rows).mul(detail.colour);
    m.normalNode = detail.normal;
    return { material: m, ground, rows: rowColour };
  }

  /** Two wave trains crossing at different scales and speeds, in world space. */
  private makeWater(spec: MaterialSpec, normal: THREE.DataTexture): THREE.Material {
    const m = new THREE.MeshPhysicalNodeMaterial({ roughness: spec.roughness, metalness: 0 });
    const p = positionWorld.xz;
    const t = this.waterTime;
    const canal = spec.id === "canalwater";
    const n1 = texture(normal, p.mul(1 / (canal ? 5 : 16)).add(vec2(t.mul(-0.05), t.mul(0.012))));
    const n2 = texture(normal, p.mul(1 / (canal ? 2.1 : 5.2)).add(vec2(t.mul(-0.09), t.mul(-0.03))));
    const n3 = texture(normal, p.mul(1 / (canal ? 15 : 52)).add(vec2(t.mul(-0.012), t.mul(0.005))));
    const blended = n1.rgb.add(n2.rgb).add(n3.rgb).div(3);
    m.normalNode = normalMap(blended, vec2(canal ? 1.1 : 1.9, canal ? 1.1 : 1.9));
    const base: Rgb = canal ? [0.02, 0.16, 0.17] : [0.014, 0.1, 0.12];
    const deep = vec3(base[0] * 0.6, base[1] * 0.62, base[2] * 0.75);
    const shallow = vec3(base[0] * 1.6, base[1] * 1.6, base[2] * 1.4);
    m.colorNode = mix(deep, shallow, n3.r.sub(0.5).mul(4).add(blended.b.sub(0.55).mul(2.2)).clamp(0, 1));
    m.ior = 1.33;
    return m;
  }

  /** Light, sky and haze for a season of the year. */
  setSeason(season: number): void {
    if (season === this.season) return;
    this.season = season;
    const atm = SEASON_LIGHT[season] ?? SEASON_LIGHT[0]!;
    this.renderer.toneMappingExposure = atm.exposure;
    this.hemi.color = color(atm.ambientSky);
    this.hemi.groundColor = color(atm.ambientGround);
    this.hemi.intensity = atm.ambientIntensity * (this.raining ? 0.2 : 0.06);
    this.sun.color = color(atm.sunColor);
    this.sun.intensity = atm.sunIntensity * (this.raining ? 0.42 : 1);
    this.sunDirection = atm.sunDirection;
    this.shadowAt = "";
    if (this.pose) this.fitShadow(this.pose);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color = color(atm.fogColor);
    fog.density = atm.fogDensity;
    // The sky itself: clear in summer, hazier and lower-lit in autumn, heavier with cloud in winter.
    const skyOf = [
      { turbidity: 2.2, rayleigh: 2.3, cover: 0.52, density: 0.5 },
      { turbidity: 2, rayleigh: 1.9, cover: 0.2, density: 0.3 },
      { turbidity: 5.5, rayleigh: 2.4, cover: 0.34, density: 0.5 },
      { turbidity: 6.5, rayleigh: 1.6, cover: 0.66, density: 0.62 },
    ][season] ?? { turbidity: 3, rayleigh: 1.5, cover: 0.4, density: 0.4 };
    this.sky.turbidity.value = skyOf.turbidity;
    this.sky.rayleigh.value = skyOf.rayleigh;
    this.skyCover = skyOf.cover;
    this.sky.cloudCoverage.value = this.raining ? 0.9 : skyOf.cover;
    this.sky.cloudDensity.value = skyOf.density;
    this.sky.sunPosition.value.set(...atm.sunDirection);
    // The trees take the season's colours.
    for (const g of this.groves) {
      const base = TREE_TINT[g.kind][season] ?? TREE_TINT[g.kind][0]!;
      for (let i = 0; i < g.spots.length; i++) {
        const k = 0.8 + 0.4 * (((i * 2654435761) >>> 0) / 4294967296);
        // In a flowering orchard one tree in four is already in leaf.
        const c: Rgb = g.kind === "almond" && season === 0 && i % 4 === 0 ? [0.3, 0.5, 0.15] : base;
        g.tints[i * 3] = c[0] * k;
        g.tints[i * 3 + 1] = c[1] * k;
        g.tints[i * 3 + 2] = c[2] * k;
      }
    }
    this.lod[2] = 0;
    if (this.pose) this.fitDetail(this.pose);
  }

  /** The shadow map follows the place looked at, and covers less ground the nearer the camera is. */
  private fitShadow(pose: Pose): void {
    const r = pose.distance < 190 ? 230 : pose.distance < 380 ? 340 : pose.distance < 660 ? 480 : 620;
    const cx = Math.round(pose.tx / 24) * 24;
    const cz = Math.round(pose.tz / 24) * 24;
    const key = `${cx}:${cz}:${r}`;
    if (key === this.shadowAt) return;
    this.shadowAt = key;
    const sc = this.sun.shadow.camera;
    sc.left = -r;
    sc.right = r;
    sc.top = r;
    sc.bottom = -r;
    sc.updateProjectionMatrix();
    const d = this.sunDirection;
    this.sun.target.position.set(cx, 0, cz);
    this.sun.target.updateMatrixWorld();
    this.sun.position.set(cx + d[0] * 1300, d[1] * 1300, cz + d[2] * 1300);
  }

  /** Trees near the camera are drawn in full and cast shadows; the rest are drawn as light shapes. */
  private fitDetail(pose: Pose): void {
    const cx = pose.tx - Math.sin(pose.yaw) * pose.distance * 0.45;
    const cz = pose.tz + Math.cos(pose.yaw) * pose.distance * 0.45;
    const r = pose.distance * 0.62 + 90;
    if (this.lod[2] > 0 && Math.hypot(cx - this.lod[0], cz - this.lod[1]) < 0.12 * r && Math.abs(r - this.lod[2]) < 0.1 * r) return;
    this.lod = [cx, cz, r];
    for (const g of this.groves) {
      const tiers = [g.near, g.far] as const;
      const counts = [0, 0];
      for (let i = 0; i < g.spots.length; i++) {
        const s = g.spots[i]!;
        const tier = (s[0]! - cx) ** 2 + (s[2]! - cz) ** 2 < r * r ? 0 : 1;
        const im = tiers[tier];
        const n = counts[tier]!;
        instanceMatrix(im.instanceMatrix.array as Float32Array, n * 16, s[0]!, s[1]!, s[2]!, s[3]!, s[4]!, s[4]!, s[4]!);
        (im.instanceColor!.array as Float32Array).set(g.tints.subarray(i * 3, i * 3 + 3), n * 3);
        counts[tier] = n + 1;
      }
      tiers.forEach((im, t) => {
        im.count = counts[t]!;
        im.instanceMatrix.needsUpdate = true;
        im.instanceColor!.needsUpdate = true;
      });
    }
  }

  /** Shows the valley as the game's state has it. */
  setLook(look: ValleyLook): void {
    this.setSeason(look.season);
    if (look.rain !== this.raining) {
      // A day of rain is overcast: the sun is dimmed, the sky closes over, and the light comes more from all round.
      this.raining = look.rain;
      const atm = SEASON_LIGHT[this.season] ?? SEASON_LIGHT[0]!;
      this.sun.intensity = atm.sunIntensity * (look.rain ? 0.42 : 1);
      this.hemi.intensity = atm.ambientIntensity * (look.rain ? 0.2 : 0.06);
      this.sky.cloudCoverage.value = look.rain ? 0.9 : this.skyCover;
    }
    this.rain.visible = look.rain;
    // The pool rises and falls between its floor and its brim.
    this.poolMesh.position.y = this.poolFloor + 0.5 + 2.6 * Math.max(0, Math.min(1, look.pool));
    this.poolMesh.visible = look.pool > 0.02;
    const flowing = look.pool > 0.02;
    for (const [id, w] of this.channels) {
      const state = id === "intake" || id === "main" ? "flowing" : (look.branches[id] ?? "none");
      w.head.visible = flowing && state !== "none";
      w.tail.visible = flowing && state === "flowing";
    }
    for (const m of this.meadowStone) m.visible = (look.branches.meadow ?? "none") !== "none";
    this.houses.forEach((meshes, i) => {
      for (const m of meshes) m.visible = i < look.houses;
    });
    for (const m of this.granary) m.visible = look.granary === "built";

    // Scaffolding where something is going up.
    const sites: Array<[number, number, number, number]> = [];
    for (let i = look.houses; i < Math.min(HOUSE_LOTS.length, look.houses + look.housesUnderWay); i++) sites.push([HOUSE_LOTS[i]!.x, HOUSE_LOTS[i]!.z, 8, 7]);
    if (look.granary === "under-way") sites.push([GRANARY[0], GRANARY[1], 13, 7]);
    const sa = this.scaffold.instanceMatrix.array as Float32Array;
    let n = 0;
    for (const [x, z, hw, hd] of sites) {
      for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]] as const) {
        if (n >= 80) break;
        const px = x + dx * hw;
        const pz = z + dz * hd;
        instanceMatrix(sa, n * 16, px, heightAt(px, pz, this.options.seed), pz, 0, 1, 6.5, 1);
        n++;
      }
    }
    this.scaffold.count = n;
    this.scaffold.instanceMatrix.needsUpdate = true;

    // Crops.
    for (const [id, c] of this.crops) {
      const f = look.fields[id];
      const key = f ? `${f.crop}:${Math.round(f.growth * 40)}:${Math.round(f.standing * 60)}:${f.ripe}` : "none";
      if (key === c.shown) continue;
      c.shown = key;
      const place = (im: THREE.InstancedMesh, spots: Float32Array, count: number, yScale: number, tint: Rgb) => {
        const a = im.instanceMatrix.array as Float32Array;
        const col = im.instanceColor!.array as Float32Array;
        const total = spots.length / 5;
        const shown = Math.max(0, Math.min(total, count));
        for (let i = 0; i < shown; i++) {
          const o = i * 5;
          const s = spots[o + 4]!;
          instanceMatrix(a, i * 16, spots[o]!, spots[o + 1]!, spots[o + 2]!, spots[o + 3]!, s, s * yScale, s);
          const v = 0.85 + 0.3 * ((i * 29) % 13) / 13;
          col[i * 3] = tint[0] * v;
          col[i * 3 + 1] = tint[1] * v;
          col[i * 3 + 2] = tint[2] * v;
        }
        im.count = shown;
        im.instanceMatrix.needsUpdate = true;
        im.instanceColor!.needsUpdate = true;
      };
      const g = f?.growth ?? 0;
      const mixed: Rgb = f?.ripe ? GOLD : [GREEN[0] + (GOLD[0] - GREEN[0]) * g * g, GREEN[1] + (GOLD[1] - GREEN[1]) * g * g, GREEN[2] + (GOLD[2] - GREEN[2]) * g * g];
      place(c.wheat, c.wheatSpots, f?.crop === "wheat" ? Math.round((c.wheatSpots.length / 5) * f.standing) : 0, 0.25 + 0.85 * g, mixed);
      place(c.veg, c.vegSpots, f?.crop === "vegetables" ? Math.round((c.vegSpots.length / 5) * f.standing) : 0, 0.3 + 0.9 * g, [0.36, 0.74, 0.26]);
      // The soil: pale stubble where a crop has just been cut, dark and green-rowed where one is growing, plain earth when fallow.
      const [ground, rows]: [Rgb, Rgb] = id === "olive-terrace" ? [[0.4, 0.31, 0.19], [0.46, 0.36, 0.22]] : !f?.crop ? [[0.3, 0.22, 0.14], [0.21, 0.15, 0.1]] : f.ripe || f.standing === 0 ? [[0.56, 0.45, 0.22], [0.68, 0.57, 0.3]] : [[0.24, 0.17, 0.11], [0.16 + 0.04 * g, 0.2 + 0.14 * g, 0.08]];
      c.soil.ground.value.setRGB(ground[0], ground[1], ground[2], THREE.LinearSRGBColorSpace);
      c.soil.rows.value.setRGB(rows[0], rows[1], rows[2], THREE.LinearSRGBColorSpace);
    }
    // Olives stay on their trees: the crown greys a little as the fruit ripens and darkens once it is gathered.
    const ol = look.fields["olive-terrace"];
    if (ol) {
      const col = this.olives.instanceColor!.array as Float32Array;
      const laden = ol.ripe && ol.standing > 0;
      for (let i = 0; i < this.oliveSpots.length; i++) col.set(laden ? [0.56, 0.62, 0.42] : [0.6 + 0.08 * ((i * 7) % 5) / 5, 0.68, 0.52], i * 3);
      this.olives.instanceColor!.needsUpdate = true;
    }

    // People walk between the village and wherever there is work.
    this.walkers = Math.max(6, Math.min(WALKERS, look.busy + 6));
    const targets: Array<[number, number]> = [[STORE[0], STORE[1] + 12], [MARKET[0], MARKET[1]], [POOL.x - 44, POOL.z + 30]];
    for (const [id, f] of Object.entries(look.fields)) {
      if (!f.crop) continue;
      const poly = FIELDS[id]!;
      targets.push([(poly[0]![0] + poly[2]![0]) / 2, (poly[0]![1] + poly[2]![1]) / 2]);
      if (f.ripe && f.standing > 0) for (const p of poly) targets.push([(p[0] * 2 + poly[2]![0]) / 3, (p[1] * 2 + poly[2]![1]) / 3]);
    }
    this.walkTargets = targets;

    // The ring round the chosen field.
    const sel = look.selected ? FIELDS[look.selected] : undefined;
    this.ring.visible = Boolean(sel);
    if (sel) {
      const cx = sel.reduce((a, p) => a + p[0], 0) / sel.length;
      const cz = sel.reduce((a, p) => a + p[1], 0) / sel.length;
      const r = Math.max(...sel.map((p) => Math.hypot(p[0] - cx, p[1] - cz)));
      this.ring.position.set(cx, heightAt(cx, cz, this.options.seed) + 4, cz);
      this.ring.scale.set(r, 1, r * 0.72);
    }
  }

  setCamera(pose: Pose): void {
    const [x, y, z] = eyeOf(pose);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(pose.tx, pose.ty, pose.tz);
    this.sky.position.copy(this.camera.position);
    this.pose = pose;
    this.fitShadow(pose);
    this.fitDetail(pose);
  }

  /** The point of the land under a place in the window (CSS pixels), or null if the ray leaves the valley. */
  landAt(clientX: number, clientY: number): [number, number] | null {
    const r = this.canvas.getBoundingClientRect();
    this.raycaster.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2), this.camera);
    const o = this.raycaster.ray.origin;
    const d = this.raycaster.ray.direction;
    if (d.y > -0.01) return null;
    // March down the ray until it goes under the land, then step back by halves.
    let t = 0;
    for (let i = 0; i < 400; i++) {
      t += 6;
      const x = o.x + d.x * t;
      const z = o.z + d.z * t;
      if (o.y + d.y * t <= heightAt(x, z, this.options.seed)) {
        let lo = t - 6;
        let hi = t;
        for (let k = 0; k < 8; k++) {
          const mid = (lo + hi) / 2;
          if (o.y + d.y * mid <= heightAt(o.x + d.x * mid, o.z + d.z * mid, this.options.seed)) hi = mid;
          else lo = mid;
        }
        return [o.x + d.x * hi, o.z + d.z * hi];
      }
    }
    return null;
  }
  /** The field under a place in the window, or null. */
  fieldAt(clientX: number, clientY: number): string | null {
    const p = this.landAt(clientX, clientY);
    return p ? fieldAt(p[0], p[1]) : null;
  }
  /** Where a point of the valley is in the window (CSS pixels), or null if it is behind the camera. */
  screenOf(x: number, y: number, z: number): [number, number] | null {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    if (v.z > 1) return null;
    const r = this.canvas.getBoundingClientRect();
    return [r.left + ((v.x + 1) / 2) * r.width, r.top + ((1 - v.y) / 2) * r.height];
  }

  render(timeSeconds: number): void {
    const t0 = performance.now();
    const still = this.options.reducedMotion;
    this.waterTime.value = still ? 0 : timeSeconds;
    if (this.rain.visible && !still) this.rain.position.y = -((timeSeconds * 160) % 60);
    // People: each goes out from the village to a place of work and back, at a walking pace.
    const body = this.bodies.instanceMatrix.array as Float32Array;
    const seed = this.options.seed;
    const n = this.walkers;
    for (let i = 0; i < n; i++) {
      const target = this.walkTargets[i % Math.max(1, this.walkTargets.length)] ?? [VILLAGE[0], VILLAGE[1]];
      const hx = VILLAGE[0] + ((i * 37) % 90) - 30;
      const hz = VILLAGE[1] + ((i * 53) % 40) - 6;
      const dist = Math.hypot(target[0] - hx, target[1] - hz) || 1;
      const phase = ((still ? 0 : timeSeconds) * 1.5) / dist + (i * 0.37) % 1;
      const k = Math.abs(((phase % 2) + 2) % 2 - 1);
      const x = hx + (target[0] - hx) * k + Math.sin(i * 1.7) * 2;
      const z = hz + (target[1] - hz) * k + Math.cos(i * 2.3) * 2;
      const back = ((phase % 2) + 2) % 2 > 1;
      const heading = Math.atan2(target[0] - hx, -(target[1] - hz)) + (back ? 0 : Math.PI);
      const bob = still ? 0 : 0.04 * Math.abs(Math.sin(timeSeconds * 6 + i));
      instanceMatrix(body, i * 16, x, heightAt(x, z, seed) + 0.05 + bob, z, heading, 1.15, 1.15, 1.15);
    }
    (this.heads.instanceMatrix.array as Float32Array).set(body.subarray(0, n * 16));
    this.bodies.count = n;
    this.heads.count = n;
    this.bodies.instanceMatrix.needsUpdate = true;
    this.heads.instanceMatrix.needsUpdate = true;
    if (this.pipeline) this.pipeline.render();
    else this.renderer.render(this.scene, this.camera);
    this.cpuMs = performance.now() - t0;
  }

  resize(): void {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.pixelRatioCap));
    this.renderer.setSize(w, h, false);
    this.aspect = w / h;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Sets the light by hand, over the season's own. For the capture tool, to compare settings side by side. */
  tune(o: { environment?: number; ambient?: number; sun?: number; exposure?: number; fog?: number }): void {
    if (o.environment !== undefined) this.scene.environmentIntensity = o.environment;
    if (o.ambient !== undefined) this.hemi.intensity = o.ambient;
    if (o.sun !== undefined) this.sun.intensity = o.sun;
    if (o.exposure !== undefined) this.renderer.toneMappingExposure = o.exposure;
    if (o.fog !== undefined) (this.scene.fog as THREE.FogExp2).density = o.fog;
  }

  /** Draws fewer pixels: used when frames come too slowly. Returns the new limit, or null if it is already at its lowest. */
  easePixels(): number | null {
    if (this.pixelRatioCap <= 1) return null;
    this.pixelRatioCap = Math.max(1, this.pixelRatioCap - 0.25);
    this.resize();
    return this.pixelRatioCap;
  }

  info(): { drawCalls: number; triangles: number; cpuRenderMs: number; engine: string; pixels: [number, number]; walkers: number } {
    const r = this.renderer.info.render as unknown as { drawCalls: number; triangles: number };
    return { drawCalls: r.drawCalls, triangles: r.triangles, cpuRenderMs: this.cpuMs, engine: `three r${THREE.REVISION} webgpu`, pixels: [this.canvas.width, this.canvas.height], walkers: this.walkers };
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
    this.pipeline?.dispose();
    this.renderer.dispose();
  }
}
