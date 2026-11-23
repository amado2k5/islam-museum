import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { p, readYaml } from "./lib.js";

// The name card (docs/data/name-parts.md): the same keys in all five interface files, and the layout shows the card only for a person with name_parts.
describe("name card", () => {
  const langs = ["ar", "en", "ur", "fr", "es", "tr", "id"];
  const keys = (l: string) => Object.keys(readYaml(p("i18n", `${l}.yaml`)).name_card ?? {}).sort();
  it("has the same keys in all five languages", () => {
    for (const l of langs) expect(keys(l), l).toEqual(keys("en"));
    expect(keys("en").length).toBeGreaterThan(10);
  });
  it("is wired into the entity layout for persons that carry name_parts", () => {
    const layout = readFileSync(p("site", "src", "layouts", "EntityLayout.astro"), "utf8");
    expect(layout).toContain('import NameCard from "../components/NameCard.astro"');
    expect(layout).toMatch(/n\.class === "person" && d\.name_parts && <NameCard/);
  });
});
