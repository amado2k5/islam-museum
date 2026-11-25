// The small contract both lab renderers implement. It is deliberately not a general engine wrapper: it is exactly
// what the reference scene needs, so the benchmark exercises each engine's own idioms behind the same inputs.
import type { DistrictScene } from "@im/worldkit/district/generate";
import type { TextureData, TextureKind } from "@im/worldkit/textures";
import type { Vec3 } from "@im/worldkit/mesh";
import type { Atmosphere } from "./atmosphere";

export type QualityPreset = "parity" | "high" | "ultra" | "cinematic";

export interface RendererOptions {
  preset: QualityPreset;
  /** Canvas backing-store size in physical pixels. */
  width: number;
  height: number;
  shadowMapSize: number;
  msaa: 1 | 4;
}

export interface RendererInfo {
  engine: string;
  engineVersion: string;
  backend: string;
  drawCalls: number;
  triangles: number;
  /** CPU milliseconds spent inside the last render call (submission, not GPU completion). */
  cpuRenderMs: number;
  extra?: Record<string, unknown>;
}

export interface DistrictRenderer {
  init(canvas: HTMLCanvasElement, scene: DistrictScene, textures: Map<TextureKind, TextureData>, atmosphere: Atmosphere, options: RendererOptions): Promise<void>;
  setCamera(position: Vec3, target: Vec3, fovDegrees: number): void;
  /** Re-reads the scene's dynamic instance matrices and the wheel angle, then draws one frame. */
  render(timeSeconds: number, wheelAngle: number): void;
  resize(width: number, height: number): void;
  info(): RendererInfo;
  dispose(): void;
}
