// Starts and stops Phaser. One game, one scene; the canvas is sized to the device up to the limit the chosen effects
// preset allows, and Phaser's own keyboard, gamepad and audio are left off: the page has its own (input/, audio/),
// so that the same input code serves the canvas and the accessible page around it.
import * as Phaser from "phaser";
import { WORLD } from "../content/workshop";
import type { Quality } from "../save/save";
import { QUALITY, WorkshopScene, type SceneHost } from "../scenes/workshop";

export interface Running {
  game: Phaser.Game;
  scene(): WorkshopScene | null;
  /** Calls to the graphics card in the last frame, counted only when asked for (?perf=1). */
  drawCalls(): number | null;
  stop(): void;
}

export function start(parent: HTMLElement, host: SceneHost, quality: Quality, opts: { perf: boolean; onLost(): void; onRestored(): void }): Running {
  // As many pixels as the stage really shows, up to the limit of the chosen effects: never more than it can show.
  const shown = ((parent.clientWidth || WORLD.view.width) * (window.devicePixelRatio || 1)) / WORLD.view.width;
  const ratio = Math.min(Math.max(1, shown), QUALITY[quality].pixelRatio);
  const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent,
    width: Math.round(WORLD.view.width * ratio),
    height: Math.round(WORLD.view.height * ratio),
    backgroundColor: "#081530",
    banner: false,
    disableContextMenu: true,
    audio: { noAudio: true },
    input: { keyboard: false, gamepad: false, mouse: true, touch: true },
    render: { antialias: true, powerPreference: "high-performance" },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    fps: { target: 60 },
  });
  game.scene.add("workshop", WorkshopScene, true, { host });

  let calls: number | null = null;
  let counting = 0;
  if (opts.perf) {
    game.events.once(Phaser.Core.Events.READY, () => {
      const gl = game.canvas.getContext("webgl2") ?? game.canvas.getContext("webgl");
      if (!gl) return;
      for (const name of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"] as const) {
        const real = (gl as unknown as Record<string, (...a: unknown[]) => unknown>)[name];
        if (typeof real !== "function") continue;
        (gl as unknown as Record<string, unknown>)[name] = function (this: unknown, ...a: unknown[]) {
          counting++;
          return real.apply(gl, a);
        };
      }
      game.events.on(Phaser.Core.Events.POST_RENDER, () => {
        calls = counting;
        counting = 0;
      });
    });
  }
  const lost = (e: Event) => {
    e.preventDefault();
    opts.onLost();
  };
  const restored = () => opts.onRestored();
  game.canvas?.addEventListener("webglcontextlost", lost);
  game.canvas?.addEventListener("webglcontextrestored", restored);
  return {
    game,
    scene: () => (game.scene.isActive("workshop") || game.scene.isPaused("workshop") ? (game.scene.getScene("workshop") as WorkshopScene) : null),
    drawCalls: () => calls,
    stop: () => {
      game.canvas?.removeEventListener("webglcontextlost", lost);
      game.canvas?.removeEventListener("webglcontextrestored", restored);
      game.destroy(true);
    },
  };
}
