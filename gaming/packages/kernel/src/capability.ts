// WebGPU capability diagnostic. It reports what the browser actually grants (adapter, limits, features) and, when
// something is missing, which step failed. It never guesses video memory and never reads the user-agent string to
// decide support: the only test is whether the real calls succeed.

export interface GpuCapability {
  supported: boolean;
  /** Which step failed when supported is false. */
  failure?: "insecure-context" | "no-navigator-gpu" | "no-adapter" | "fallback-adapter" | "device-request-failed" | "pipeline-test-failed";
  failureDetail?: string;
  secureContext: boolean;
  crossOriginIsolated: boolean;
  adapter?: { vendor: string; architecture: string; device: string; description: string; isFallbackAdapter: boolean };
  preferredCanvasFormat?: string;
  limits?: Record<string, number>;
  features?: string[];
  hardwareConcurrency: number;
  devicePixelRatio: number;
  userAgent: string;
}

const LIMITS_OF_INTEREST = [
  "maxTextureDimension2D",
  "maxTextureArrayLayers",
  "maxBindGroups",
  "maxBufferSize",
  "maxStorageBufferBindingSize",
  "maxUniformBufferBindingSize",
  "maxVertexBuffers",
  "maxVertexAttributes",
  "maxColorAttachments",
  "maxComputeWorkgroupStorageSize",
  "maxComputeInvocationsPerWorkgroup",
  "maxSampledTexturesPerShaderStage",
  "maxStorageBuffersPerShaderStage",
] as const;

/** Runs the real WebGPU handshake and a one-triangle pipeline. Safe to call on any page; releases what it creates. */
export async function probeWebGPU(): Promise<GpuCapability> {
  const base: GpuCapability = {
    supported: false,
    secureContext: typeof isSecureContext === "boolean" ? isSecureContext : false,
    crossOriginIsolated: typeof crossOriginIsolated === "boolean" ? crossOriginIsolated : false,
    hardwareConcurrency: typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 0) : 0,
    devicePixelRatio: typeof devicePixelRatio === "number" ? devicePixelRatio : 1,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
  if (!base.secureContext) return { ...base, failure: "insecure-context" };
  const gpu = typeof navigator !== "undefined" ? navigator.gpu : undefined;
  if (!gpu) return { ...base, failure: "no-navigator-gpu" };

  let adapter: GPUAdapter | null = null;
  try {
    adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
  } catch (e) {
    return { ...base, failure: "no-adapter", failureDetail: String(e) };
  }
  if (!adapter) return { ...base, failure: "no-adapter" };

  const info = adapter.info;
  const isFallback = Boolean((info as unknown as { isFallbackAdapter?: boolean }).isFallbackAdapter ?? (adapter as unknown as { isFallbackAdapter?: boolean }).isFallbackAdapter);
  const adapterOut = {
    vendor: info?.vendor ?? "",
    architecture: info?.architecture ?? "",
    device: info?.device ?? "",
    description: info?.description ?? "",
    isFallbackAdapter: isFallback,
  };
  const limits: Record<string, number> = {};
  for (const k of LIMITS_OF_INTEREST) {
    const v = (adapter.limits as unknown as Record<string, number>)[k];
    if (typeof v === "number") limits[k] = v;
  }
  const features = [...adapter.features].sort();
  const withAdapter: GpuCapability = { ...base, adapter: adapterOut, limits, features, preferredCanvasFormat: gpu.getPreferredCanvasFormat() };
  if (isFallback) return { ...withAdapter, failure: "fallback-adapter" };

  let device: GPUDevice;
  try {
    device = await adapter.requestDevice();
  } catch (e) {
    return { ...withAdapter, failure: "device-request-failed", failureDetail: String(e) };
  }

  try {
    device.pushErrorScope("validation");
    const module = device.createShaderModule({
      code: `@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[i], 0.0, 1.0);
}
@fragment fn fs() -> @location(0) vec4f { return vec4f(0.25, 0.5, 0.75, 1.0); }`,
    });
    const format: GPUTextureFormat = "rgba8unorm";
    const pipeline = await device.createRenderPipelineAsync({
      layout: "auto",
      vertex: { module, entryPoint: "vs" },
      fragment: { module, entryPoint: "fs", targets: [{ format }] },
    });
    const texture = device.createTexture({ size: [4, 4], format, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC });
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({ colorAttachments: [{ view: texture.createView(), loadOp: "clear", storeOp: "store", clearValue: { r: 0, g: 0, b: 0, a: 1 } }] });
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();
    const err = await device.popErrorScope();
    texture.destroy();
    if (err) return { ...withAdapter, failure: "pipeline-test-failed", failureDetail: err.message };
  } catch (e) {
    return { ...withAdapter, failure: "pipeline-test-failed", failureDetail: String(e) };
  } finally {
    device.destroy();
  }
  return { ...withAdapter, supported: true };
}
