// The reference district in Three.js on WebGPURenderer.
// "parity" draws with the plain feature set both engines share (one shadow map, hemisphere + sun, fog, tone map),
// which is what the engine comparison measures. The other presets add what this engine would ship with:
// image-based sky lighting, ambient occlusion and bloom through the node render pipeline, and a node water surface.
import * as THREE from "three/webgpu";
import { builtinAOContext, mix, mrt, normalMap, normalView, pass, positionWorld, screenUV, texture, uniform, uv, vec2, vec3 } from "three/tsl";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import type { DistrictScene, MaterialSpec, SceneMaterialId } from "@im/worldkit/district/generate";
import type { MeshData, Vec3 } from "@im/worldkit/mesh";
import type { TextureData, TextureKind } from "@im/worldkit/textures";
import { skyDome, type Atmosphere } from "@im/worldkit/atmosphere";
import type { DistrictRenderer, RendererInfo, RendererOptions } from "./api";

const color = (c: readonly [number, number, number]) => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.LinearSRGBColorSpace);

function geometryOf(m: MeshData, withColor = true): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(m.positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(m.normals, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(m.uvs, 2));
  if (withColor) g.setAttribute("color", new THREE.BufferAttribute(m.colors, 3));
  g.setIndex(new THREE.BufferAttribute(m.indices, 1));
  return g;
}

export class ThreeDistrictRenderer implements DistrictRenderer {
  private renderer!: THREE.WebGPURenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 1.5, 6000);
  private pipeline: THREE.RenderPipeline | null = null;
  private district!: DistrictScene;
  private sky!: THREE.Mesh;
  private wheel!: THREE.Mesh;
  private sun!: THREE.DirectionalLight;
  private dynamic: Array<{ mesh: THREE.InstancedMesh; source: Float32Array }> = [];
  private waterMaps: THREE.Texture[] = [];
  private waterTime = uniform(0);
  private cpuMs = 0;
  private options!: RendererOptions;
  private disposables: Array<{ dispose(): void }> = [];

  async init(canvas: HTMLCanvasElement, district: DistrictScene, textures: Map<TextureKind, TextureData>, atm: Atmosphere, options: RendererOptions): Promise<void> {
    this.district = district;
    this.options = options;
    const flagship = options.preset !== "parity";
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: options.msaa === 4, powerPreference: "high-performance", forceWebGL: false });
    await renderer.init();
    if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error("Three.js did not get a WebGPU backend (it fell back to WebGL). The lab measures WebGPU only.");
    this.renderer = renderer;
    renderer.setPixelRatio(1);
    renderer.setSize(options.width, options.height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = atm.exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = this.scene;
    scene.fog = new THREE.FogExp2(color(atm.fogColor), atm.fogDensity);

    // ---- Lights ----
    const hemi = new THREE.HemisphereLight(color(atm.ambientSky), color(atm.ambientGround), atm.ambientIntensity * (flagship ? 0.3 : 1));
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(color(atm.sunColor), atm.sunIntensity);
    const R = 470;
    sun.position.set(atm.sunDirection[0] * 900, atm.sunDirection[1] * 900, atm.sunDirection[2] * 900 - 40);
    sun.target.position.set(0, 0, -40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(options.shadowMapSize, options.shadowMapSize);
    const sc = sun.shadow.camera;
    sc.left = -R;
    sc.right = R;
    sc.top = R;
    sc.bottom = -R;
    sc.near = 100;
    sc.far = 1900;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.25;
    sun.shadow.radius = 2.2;
    scene.add(sun, sun.target);
    this.sun = sun;

    // ---- Sky ----
    const skyGeo = geometryOf(skyDome(atm, 2600));
    const skyMat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, depthWrite: false });
    this.sky = new THREE.Mesh(skyGeo, skyMat);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -10;
    scene.add(this.sky);
    this.disposables.push(skyGeo, skyMat);

    if (flagship) {
      // Light the scene from the sky itself: prefilter the dome into an environment map once.
      const envScene = new THREE.Scene();
      const envSky = new THREE.Mesh(skyGeo, skyMat);
      envScene.add(envSky);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const rt = pmrem.fromScene(envScene, 0, 1, 6000);
      scene.environment = rt.texture;
      scene.environmentIntensity = 0.55;
      this.disposables.push(pmrem, rt);
    }

    // ---- Materials ----
    const maps = new Map<TextureKind, { map: THREE.DataTexture; normal: THREE.DataTexture; tile: number }>();
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
      maps.set(kind, { map: mk(t.albedo, true), normal: mk(t.normal, false), tile: t.tileMeters });
    }
    const materials = new Map<SceneMaterialId, THREE.Material>();
    const makeMaterial = (spec: MaterialSpec): THREE.Material => {
      const tex = spec.texture ? maps.get(spec.texture) : undefined;
      if (spec.id === "water" || spec.id === "canalwater") return this.waterMaterial(spec, tex, atm, flagship);
      const m = new THREE.MeshStandardMaterial({
        color: color(spec.color),
        roughness: spec.roughness,
        metalness: spec.metalness,
        vertexColors: true,
        map: tex?.map ?? null,
        normalMap: tex?.normal ?? null,
      });
      if (spec.emissive) {
        m.emissive = color(spec.emissive);
        m.emissiveIntensity = atm.emissive * (spec.id === "lantern" ? 9 : 3.2);
        if (tex) m.emissiveMap = tex.map;
      }
      return m;
    };
    for (const spec of district.materials) {
      const m = makeMaterial(spec);
      materials.set(spec.id, m);
      this.disposables.push(m);
    }

    // ---- Static geometry, by map cell ----
    for (const chunk of district.chunks) {
      const g = geometryOf(chunk.mesh);
      const mesh = new THREE.Mesh(g, materials.get(chunk.material)!);
      const isWater = chunk.material === "water" || chunk.material === "canalwater";
      mesh.castShadow = !isWater && chunk.material !== "terrain" && chunk.material !== "field" && chunk.material !== "grass" && chunk.material !== "paving";
      mesh.receiveShadow = true;
      scene.add(mesh);
      this.disposables.push(g);
    }

    // ---- Instanced props ----
    for (const batch of district.instances) {
      const g = geometryOf(batch.mesh);
      const mesh = new THREE.InstancedMesh(g, materials.get(batch.material)!, batch.count);
      mesh.instanceMatrix.array.set(batch.matrices);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(batch.colors, 3);
      mesh.castShadow = batch.castShadow;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      if (batch.dynamic) {
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.dynamic.push({ mesh, source: batch.matrices });
      }
      scene.add(mesh);
      this.disposables.push(g);
    }

    // ---- The noria ----
    const wg = geometryOf(district.wheel.mesh);
    this.wheel = new THREE.Mesh(wg, materials.get("wood")!);
    this.wheel.position.set(...district.wheel.position);
    this.wheel.scale.setScalar(district.wheel.radius);
    this.wheel.castShadow = true;
    scene.add(this.wheel);
    this.disposables.push(wg);

    // ---- Post-processing (not in parity) ----
    if (flagship) {
      const pipeline = new THREE.RenderPipeline(renderer);
      const prePass = pass(scene, this.camera, { samples: 1 });
      prePass.setMRT(mrt({ output: normalView }));
      const aoPass = ao(prePass.getTextureNode("depth"), prePass.getTextureNode(), this.camera);
      aoPass.resolutionScale = options.preset === "high" ? 0.5 : 1;
      aoPass.radius.value = 2.2;
      aoPass.thickness.value = 1.5;
      aoPass.distanceExponent.value = 1.2;
      aoPass.samples.value = options.preset === "cinematic" ? 24 : 12;
      const scenePass = pass(scene, this.camera, { samples: options.msaa });
      scenePass.contextNode = builtinAOContext(aoPass.getTextureNode().sample(screenUV).r);
      const lit = scenePass.getTextureNode("output");
      const glow = bloom(lit, 0.22, 0.6, 1.0);
      pipeline.outputNode = lit.add(glow);
      this.pipeline = pipeline;
    }
    this.camera.aspect = options.width / options.height;
    this.camera.updateProjectionMatrix();
  }

  private waterMaterial(spec: MaterialSpec, tex: { map: THREE.DataTexture; normal: THREE.DataTexture; tile: number } | undefined, atm: Atmosphere, flagship: boolean): THREE.Material {
    if (!tex) throw new Error("water needs its normal map");
    if (!flagship) {
      // Parity water: a smooth dielectric with one scrolling normal map (the scroll is a texture offset).
      const n = tex.normal.clone();
      n.needsUpdate = true;
      this.waterMaps.push(n);
      this.disposables.push(n);
      n.repeat.set(1 / 8, 1 / 8);
      return new THREE.MeshStandardMaterial({ color: color(spec.color), roughness: spec.roughness, metalness: 0, normalMap: n, normalScale: new THREE.Vector2(1.2, 1.2) });
    }
    // Flagship water: two wave trains crossing at different scales and speeds, in world space so the river and the
    // canals share one continuous surface; colour deepens toward the middle of a wave slope.
    const m = new THREE.MeshPhysicalNodeMaterial({ roughness: spec.roughness, metalness: 0 });
    const p = positionWorld.xz;
    const t = this.waterTime;
    const n1 = texture(tex.normal, p.mul(1 / 14).add(vec2(t.mul(0.018), t.mul(0.009))));
    const n2 = texture(tex.normal, p.mul(1 / 4.3).add(vec2(t.mul(-0.031), t.mul(0.04))));
    const n3 = texture(tex.normal, p.mul(1 / 47).add(vec2(t.mul(0.006), t.mul(-0.004))));
    const blended = n1.rgb.add(n2.rgb).add(n3.rgb).div(3);
    m.normalNode = normalMap(blended, vec2(2.1, 2.1));
    const deep = vec3(spec.color[0] * 0.55, spec.color[1] * 0.6, spec.color[2] * 0.7);
    const shallow = vec3(spec.color[0] * 1.5, spec.color[1] * 1.55, spec.color[2] * 1.4);
    m.colorNode = mix(deep, shallow, blended.b.sub(0.55).mul(2.2).clamp(0, 1));
    m.ior = 1.33;
    m.envMapIntensity = 1.0;
    void uv;
    void atm;
    return m;
  }

  setCamera(position: Vec3, target: Vec3, fovDegrees: number): void {
    this.camera.position.set(position[0], position[1], position[2]);
    this.camera.lookAt(target[0], target[1], target[2]);
    if (this.camera.fov !== fovDegrees) {
      this.camera.fov = fovDegrees;
      this.camera.updateProjectionMatrix();
    }
    this.sky.position.copy(this.camera.position);
  }

  render(timeSeconds: number, wheelAngle: number): void {
    const t0 = performance.now();
    for (const d of this.dynamic) {
      d.mesh.instanceMatrix.array.set(d.source);
      d.mesh.instanceMatrix.needsUpdate = true;
    }
    this.wheel.rotation.set(0, this.district.wheel.yaw, wheelAngle, "YXZ");
    for (const n of this.waterMaps) n.offset.set(timeSeconds * 0.03, timeSeconds * 0.018);
    this.waterTime.value = timeSeconds;
    if (this.pipeline) this.pipeline.render();
    else this.renderer.render(this.scene, this.camera);
    this.cpuMs = performance.now() - t0;
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  info(): RendererInfo {
    const r = this.renderer.info.render as unknown as { drawCalls: number; triangles: number };
    return {
      engine: "three",
      engineVersion: THREE.REVISION,
      backend: "webgpu",
      drawCalls: r.drawCalls,
      triangles: r.triangles,
      cpuRenderMs: this.cpuMs,
      extra: { preset: this.options.preset, shadowMap: this.options.shadowMapSize, msaa: this.options.msaa, geometries: this.renderer.info.memory.geometries, textures: this.renderer.info.memory.textures },
    };
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    for (const d of this.disposables) d.dispose();
    this.pipeline?.dispose();
    this.renderer.dispose();
  }
}
