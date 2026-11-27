// The page of this game: its strings in the seven languages carry what the page needs, and the page shows the
// prototype label and the way back to the museum. The day's puzzle itself is tested in packages/daily/test/.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");
describe("lantern", () => {
  it("has a title, how to play and a prototype label in all seven languages", () => {
    for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) {
      const s = JSON.parse(read(`../i18n/${lang}.json`)) as Record<string, string>;
      for (const k of ["title", "prototype", "how_1", "how_2", "how_3", "share"]) expect(s[k], `${lang} ${k}`).toBeTruthy();
    }
  });
  it("needs no canvas, no WebGL and no server: a plain page that loads its pack from the release", () => {
    const app = read("../src/ui/app.ts");
    expect(app).not.toMatch(/fetch\(|WebSocket|getContext\(/);
    expect(app).toContain('t("prototype")');
    expect(read("../index.html")).toContain('name="viewport"');
  });
});
