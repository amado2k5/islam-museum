// The founder's rule of 26 November 2026: a game stays marked as a prototype until its binding requirements and its
// production gates pass, and "final" is never reached by taking a label away. docs/gaming/spec-production/
// release-status.json says what each game is; it changes only with his approval of that game's evidence.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "..", "..");
const status = JSON.parse(readFileSync(resolve(root, "docs/gaming/spec-production/release-status.json"), "utf8")) as { games: Record<string, { status: string; approvedBy: string | null; evidence: string | null }> };
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];

describe("the prototype labels", () => {
  it("cover the three games that exist, and no other status is taken without an approval and its evidence", () => {
    expect(Object.keys(status.games).sort()).toEqual(["atlas", "golden-age", "granada"]);
    for (const [game, s] of Object.entries(status.games)) {
      expect(["prototype", "production"], game).toContain(s.status);
      if (s.status !== "prototype") {
        expect(s.approvedBy, `${game}: who approved it`).toBeTruthy();
        expect(s.evidence, `${game}: the evidence approved`).toBeTruthy();
      }
    }
  });

  it("are on the page of every game that is a prototype, in all seven languages", () => {
    for (const [game, s] of Object.entries(status.games)) {
      if (s.status !== "prototype") continue;
      for (const lang of LANGS) {
        const strings = JSON.parse(readFileSync(resolve(root, `gaming/games/${game}/i18n/${lang}.json`), "utf8")) as Record<string, unknown>;
        expect(typeof strings.prototype === "string" && strings.prototype.trim().length > 0, `${game} ${lang}: the word for prototype`).toBe(true);
      }
      const app = readFileSync(resolve(root, `gaming/games/${game}/src/ui/app.ts`), "utf8");
      expect(/t\("prototype"\)|strings\.prototype/.test(app), `${game}: the page shows the label`).toBe(true);
    }
  });
});
