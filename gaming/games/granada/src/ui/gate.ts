// Granada's first script: the platform's device check, and only then the game itself. On a phone, a small screen, an
// unsupported browser or a device without the graphics, the engine is never fetched and a plain page says why
// (docs/gaming/device-preflight.md). Nothing of the game's own code is changed by this.
import { behindTheGate } from "@im/platform/behind";

behindTheGate({
  app: document.getElementById("app")!,
  about: async (lang) => {
    const s = (await import(`../../i18n/${lang}.json`)).default as Record<string, string>;
    return { title: s.title!, text: [s.subtitle!, s.simulation_note!] };
  },
  refused: (reasons) => {
    (window as unknown as Record<string, unknown>).__GR__ = { ready: false, error: `unsupported: ${reasons.join(", ")}`, unsupported: reasons };
  },
  start: () => import("./app"),
});
