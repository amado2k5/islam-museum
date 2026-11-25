// The reference district in Babylon.js on its WebGPU engine: the same meshes, textures, lights and camera as the
// Three.js renderer, drawn with this engine's own PBR material, thin instances and shadow generator.
// Only the "parity" feature set is implemented here; that is the set the engine comparison measures.
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { TargetCamera } from "@babylonjs/core/Cameras/targetCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/thinInstanceMesh";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Material } from "@babylonjs/core/Materials/material";
import { RawTexture } from "@babylonjs/core/Materials/Textures/rawTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { Constants } from "@babylonjs/core/Engines/constants";
import { SceneInstrumentation } from "@babylonjs/core/Instrumentation/sceneInstrumentation";
import type { DistrictScene, MaterialSpec, SceneMaterialId } from "@im/worldkit/district/generate";
import type { MeshData, Vec3 } from "@im/worldkit/mesh";
import type { TextureData, TextureKind } from "@im/worldkit/textures";
import { skyDome, type Atmosphere } from "@im/worldkit/atmosphere";
import type { DistrictRenderer, RendererInfo, RendererOptions } from "./api";

const c3 = (c: readonly [number, number, number], k = 1) => new Color3(c[0] * k, c[1] * k, c[2] * k);

// Measured on 25 November 2026: with exposure matched (see the ACES note in init), the same light numbers give the
// same image brightness in both engines (mean luminance within 1% on the riverfront view), so the scale is 1.
// The URL parameter stays for re-checking that calibration after an engine upgrade.
const LIGHT_SCALE = Number(new URLSearchParams(location.search).get("lightScale") ?? 1);

function meshOf(name: string, m: MeshData, scene: Scene): Mesh {
  const mesh = new Mesh(name, scene);
  mesh.setVerticesData(VertexBuffer.PositionKind, m.positions, false, 3);
  mesh.setVerticesData(VertexBuffer.NormalKind, m.normals, false, 3);
  mesh.setVerticesData(VertexBuffer.UVKind, m.uvs, false, 2);
  mesh.setVerticesData(VertexBuffer.ColorKind, m.colors, false, 3);
  mesh.setIndices(m.indices, m.positions.length / 3);
  mesh.hasVertexAlpha = false;
  mesh.useVertexColors = true;
  return mesh;
}

export class BabylonDistrictRenderer implements DistrictRenderer {
  private engine!: WebGPUEngine;
  private scene!: Scene;
  private camera!: TargetCamera;
  private district!: DistrictScene;
  private sky!: Mesh;
  private wheel!: Mesh;
  private dynamic: Mesh[] = [];
  private waterMaps: Texture[] = [];
  private instrumentation!: SceneInstrumentation;
  private cpuMs = 0;
  private options!: RendererOptions;

  async init(canvas: HTMLCanvasElement, district: DistrictScene, textures: Map<TextureKind, TextureData>, atm: Atmosphere, options: RendererOptions): Promise<void> {
    if (options.preset !== "parity") throw new Error("The Babylon.js renderer implements the parity preset only.");
    this.district = district;
    this.options = options;
    canvas.width = options.width;
    canvas.height = options.height;
    const engine = new WebGPUEngine(canvas, { antialias: options.msaa === 4, adaptToDeviceRatio: false, powerPreference: "high-performance", stencil: false });
    await engine.initAsync();
    this.engine = engine;
    engine.setSize(options.width, options.height);

    const scene = new Scene(engine);
    this.scene = scene;
    scene.useRightHandedSystem = true;
    scene.clearColor = new Color4(atm.fogColor[0], atm.fogColor[1], atm.fogColor[2], 1);
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.fogDensity = atm.fogDensity;
    scene.fogColor = c3(atm.fogColor);
    scene.skipPointerMovePicking = true;
    scene.autoClear = true;
    const ip = scene.imageProcessingConfiguration;
    ip.toneMappingEnabled = true;
    ip.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
    // Three.js's ACES operator multiplies exposure by 1/0.6 before the curve; Babylon's does not. Match it here.
    ip.exposure = atm.exposure / 0.6;

    this.camera = new TargetCamera("camera", new Vector3(0, 100, 300), scene);
    this.camera.minZ = 1.5;
    this.camera.maxZ = 6000;

    // ---- Lights ----
    const hemi = new HemisphericLight("sky", new Vector3(0, 1, 0), scene);
    hemi.diffuse = c3(atm.ambientSky);
    hemi.groundColor = c3(atm.ambientGround);
    hemi.specular = Color3.Black();
    hemi.intensity = atm.ambientIntensity * LIGHT_SCALE;
    const d = atm.sunDirection;
    const sun = new DirectionalLight("sun", new Vector3(-d[0], -d[1], -d[2]), scene);
    sun.position = new Vector3(d[0] * 900, d[1] * 900, d[2] * 900 - 40);
    sun.diffuse = c3(atm.sunColor);
    sun.specular = c3(atm.sunColor);
    sun.intensity = atm.sunIntensity * LIGHT_SCALE;
    const R = 470;
    sun.autoUpdateExtends = false;
    sun.autoCalcShadowZBounds = false;
    sun.orthoLeft = -R;
    sun.orthoRight = R;
    sun.orthoTop = R;
    sun.orthoBottom = -R;
    sun.shadowMinZ = 100;
    sun.shadowMaxZ = 1900;
    const shadows = new ShadowGenerator(options.shadowMapSize, sun);
    shadows.usePercentageCloserFiltering = true;
    shadows.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
    shadows.bias = 0.0004;
    shadows.normalBias = 0.012;
    shadows.transparencyShadow = false;

    // ---- Sky ----
    this.sky = meshOf("sky", skyDome(atm, 2600), scene);
    const skyMat = new StandardMaterial("sky", scene);
    skyMat.disableLighting = true;
    skyMat.emissiveColor = Color3.White();
    skyMat.fogEnabled = false;
    skyMat.disableDepthWrite = true;
    skyMat.backFaceCulling = false;
    this.sky.material = skyMat;
    this.sky.alwaysSelectAsActiveMesh = true;
    this.sky.receiveShadows = false;

    // ---- Materials ----
    const maps = new Map<TextureKind, { map: RawTexture; normal: RawTexture; tile: number }>();
    const mk = (t: TextureData, data: Uint8Array, srgb: boolean) => {
      const tex = RawTexture.CreateRGBATexture(data, t.size, t.size, scene, true, false, Texture.TRILINEAR_SAMPLINGMODE, Constants.TEXTURETYPE_UNSIGNED_BYTE, 0, srgb);
      tex.wrapU = Texture.WRAP_ADDRESSMODE;
      tex.wrapV = Texture.WRAP_ADDRESSMODE;
      tex.anisotropicFilteringLevel = 8;
      tex.uScale = 1 / t.tileMeters;
      tex.vScale = 1 / t.tileMeters;
      return tex;
    };
    for (const [kind, t] of textures) maps.set(kind, { map: mk(t, t.albedo, true), normal: mk(t, t.normal, false), tile: t.tileMeters });

    const materials = new Map<SceneMaterialId, Material>();
    const makeMaterial = (spec: MaterialSpec): Material => {
      const tex = spec.texture ? maps.get(spec.texture) : undefined;
      const m = new PBRMaterial(spec.id, scene);
      m.albedoColor = c3(spec.color);
      m.roughness = spec.roughness;
      m.metallic = spec.metalness;
      m.usePhysicalLightFalloff = false;
      m.environmentIntensity = 0;
      m.backFaceCulling = true;
      // The kit's triangles are counter-clockwise seen from outside, in a right-handed scene.
      m.sideOrientation = Material.CounterClockWiseSideOrientation;
      if (spec.id === "water" || spec.id === "canalwater") {
        if (!tex) throw new Error("water needs its normal map");
        const src = textures.get("water")!;
        const n = mk(src, src.normal, false);
        n.level = 1.2;
        n.uScale = 1 / 8;
        n.vScale = 1 / 8;
        this.waterMaps.push(n);
        m.bumpTexture = n;
        return m;
      }
      if (tex) {
        m.albedoTexture = tex.map;
        m.bumpTexture = tex.normal;
      }
      if (spec.emissive) {
        m.emissiveColor = c3(spec.emissive, atm.emissive * (spec.id === "lantern" ? 9 : 3.2));
        if (tex) m.emissiveTexture = tex.map;
      }
      return m;
    };
    for (const spec of district.materials) materials.set(spec.id, makeMaterial(spec));

    // ---- Static geometry, by map cell ----
    for (const chunk of district.chunks) {
      const mesh = meshOf(`${chunk.material}:${chunk.cell[0]}:${chunk.cell[1]}`, chunk.mesh, scene);
      mesh.material = materials.get(chunk.material)!;
      const isWater = chunk.material === "water" || chunk.material === "canalwater";
      const casts = !isWater && chunk.material !== "terrain" && chunk.material !== "field" && chunk.material !== "grass" && chunk.material !== "paving";
      if (casts) shadows.addShadowCaster(mesh, false);
      mesh.receiveShadows = true;
      mesh.isPickable = false;
      mesh.freezeWorldMatrix();
    }

    // ---- Instanced props ----
    for (const batch of district.instances) {
      const mesh = meshOf(batch.id, batch.mesh, scene);
      mesh.material = materials.get(batch.material)!;
      mesh.thinInstanceSetBuffer("matrix", batch.matrices, 16, !batch.dynamic);
      const rgba = new Float32Array(batch.count * 4);
      for (let i = 0; i < batch.count; i++) {
        rgba[i * 4] = batch.colors[i * 3]!;
        rgba[i * 4 + 1] = batch.colors[i * 3 + 1]!;
        rgba[i * 4 + 2] = batch.colors[i * 3 + 2]!;
        rgba[i * 4 + 3] = 1;
      }
      mesh.thinInstanceSetBuffer("color", rgba, 4, true);
      mesh.alwaysSelectAsActiveMesh = true;
      mesh.isPickable = false;
      mesh.receiveShadows = true;
      if (batch.castShadow) shadows.addShadowCaster(mesh, false);
      if (batch.dynamic) this.dynamic.push(mesh);
    }

    // ---- The noria ----
    this.wheel = meshOf("wheel", district.wheel.mesh, scene);
    this.wheel.material = materials.get("wood")!;
    this.wheel.position = new Vector3(...district.wheel.position);
    this.wheel.scaling = new Vector3(district.wheel.radius, district.wheel.radius, district.wheel.radius);
    shadows.addShadowCaster(this.wheel, false);

    this.instrumentation = new SceneInstrumentation(scene);
    await scene.whenReadyAsync();
  }

  setCamera(position: Vec3, target: Vec3, fovDegrees: number): void {
    this.camera.position.set(position[0], position[1], position[2]);
    this.camera.setTarget(new Vector3(target[0], target[1], target[2]));
    this.camera.fov = (fovDegrees * Math.PI) / 180;
    this.sky.position.copyFrom(this.camera.position);
  }

  render(timeSeconds: number, wheelAngle: number): void {
    const t0 = performance.now();
    for (const mesh of this.dynamic) mesh.thinInstanceBufferUpdated("matrix");
    this.wheel.rotation.set(0, this.district.wheel.yaw, wheelAngle);
    for (const n of this.waterMaps) {
      n.uOffset = timeSeconds * 0.03;
      n.vOffset = timeSeconds * 0.018;
    }
    // The lab drives its own frame loop, so the frame has to be opened and submitted explicitly.
    this.engine.beginFrame();
    this.scene.render();
    this.engine.endFrame();
    this.cpuMs = performance.now() - t0;
  }

  resize(width: number, height: number): void {
    this.engine.setSize(width, height);
  }

  info(): RendererInfo {
    return {
      engine: "babylon",
      engineVersion: WebGPUEngine.Version,
      backend: this.engine.isWebGPU ? "webgpu" : "other",
      drawCalls: this.instrumentation.drawCallsCounter.current,
      triangles: Math.round(this.scene.getActiveIndices() / 3),
      cpuRenderMs: this.cpuMs,
      extra: { preset: this.options.preset, shadowMap: this.options.shadowMapSize, msaa: this.engine.currentSampleCount, activeMeshes: this.scene.getActiveMeshes().length },
    };
  }

  dispose(): void {
    this.scene.dispose();
    this.engine.dispose();
  }
}
