// The founder's rule of 26 November 2026: until named reviewers have decided a game's entries in the historical-review
// ledger, the game's own page says that its history is pending review, in every language, and The Golden Age says
// that it is a fictional city inspired by records and not a reconstruction.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "..", "..");
const ledger = JSON.parse(readFileSync(resolve(root, "docs/gaming/historical-review/ledger.json"), "utf8")) as { entries: { game: string; decision: string }[] };
const MARK: Record<string, string> = {
  en: "Historical review pending",
  ar: "قيد المراجعة التاريخية",
  ur: "تاریخی جائزہ ابھی باقی ہے",
  fr: "Relecture historique en attente",
  es: "Revisión histórica pendiente",
  tr: "Tarihsel inceleme bekleniyor",
  id: "Menunggu tinjauan sejarah",
};
// The string of each game that stands wherever the game states or links history.
const WHERE: [string, string, string][] = [
  ["Granada", "granada", "simulation_note"],
  ["The Golden Age", "golden-age", "museum_note"],
  ["Atlas", "atlas", "sourced"],
  // Atlas shows history at each reveal, so the mark stands there as well as beside the note on its sources.
  ["Atlas", "atlas", "review_pending"],
  // Hudhud says it under the picture and again in the museum note at the end of a quest.
  ["Hudhud", "hudhud", "review_note"],
];
const strings = (game: string, lang: string) => JSON.parse(readFileSync(resolve(root, `gaming/games/${game}/i18n/${lang}.json`), "utf8")) as Record<string, string>;

describe("the mark of historical review", () => {
  it("is on the page of every game that has an entry still pending, in all seven languages", () => {
    for (const [name, game, key] of WHERE) {
      const pending = ledger.entries.some((e) => e.game === name && e.decision === "historical review pending");
      expect(ledger.entries.some((e) => e.game === name), `${name} has entries in the ledger`).toBe(true);
      if (!pending) continue;
      for (const [lang, mark] of Object.entries(MARK)) expect(strings(game, lang)[key], `${game} ${lang} ${key}`).toContain(mark);
      const app = readFileSync(resolve(root, `gaming/games/${game}/src/ui/app.ts`), "utf8");
      expect(app.includes(`"${key}"`) || app.includes(`.${key}`), `${game}: the page shows ${key}`).toBe(true);
    }
  });

  it("has The Golden Age call itself a fictional city inspired by records, in the founder's words", () => {
    expect(strings("golden-age", "en").help_7).toContain("A fictional city simulation inspired by records of Abbasid Baghdad and other historical institutions of the Islamic world.");
    for (const lang of Object.keys(MARK)) expect(strings("golden-age", lang).help_7!.length, lang).toBeGreaterThan(60);
  });
});
