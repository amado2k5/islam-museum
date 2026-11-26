// Reads from the browser the facts the device check judges. Small on purpose: it runs before any game's engine is
// fetched, makes one throwaway WebGL 2 context to ask the graphics card two things, and lets it go.
import type { Device } from "./preflight";

export function probe(win: Window = window): Device {
  const nav = win.navigator as Navigator & { userAgentData?: { mobile?: boolean } };
  let webgl2 = false;
  let renderer: string | null = null;
  let maxTextureSize = 0;
  try {
    const canvas = win.document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (gl) {
      webgl2 = true;
      maxTextureSize = Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 0;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl2 = false;
  }
  let indexedDB = false;
  try {
    indexedDB = typeof win.indexedDB === "object" && win.indexedDB !== null;
  } catch {
    indexedDB = false;
  }
  const media = (q: string) => {
    try {
      return win.matchMedia(q).matches;
    } catch {
      return false;
    }
  };
  return {
    userAgent: nav.userAgent,
    uaMobile: typeof nav.userAgentData?.mobile === "boolean" ? nav.userAgentData.mobile : null,
    maxTouchPoints: nav.maxTouchPoints || 0,
    coarsePointer: media("(pointer: coarse)"),
    screen: { width: win.screen.width, height: win.screen.height },
    viewport: { width: win.innerWidth, height: win.innerHeight },
    webgl2,
    renderer,
    maxTextureSize,
    indexedDB,
  };
}
