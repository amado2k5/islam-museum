import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { p, readYaml } from "./lib.js";

// Founder approval 21 Nov 2026; docs/data/name-parts.md.
function validator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const f of readdirSync(p("schema")).filter((x) => x.endsWith(".schema.json"))) {
    ajv.addSchema(JSON.parse(readFileSync(p("schema", f), "utf8")));
  }
  return ajv.getSchema("person.schema.json")!;
}

describe("person name_parts", () => {
  const validate = validator();
  const base = readYaml(p("data", "person", "ibn-khaldun.yaml"));

  it("accepts the Ibn Khaldun record, which carries name_parts", () => {
    expect(base.name_parts).toBeTruthy();
    expect(validate(base), JSON.stringify(validate.errors)).toBe(true);
  });
  it("accepts several values per element, a link and a certainty", () => {
    const rec = { ...base, name_parts: { nisba: [{ value: "البخاري", link: "place/bukhara", link_kind: "place", certainty: "disputed", sources: ["source/x"] }, { value: "الجعفي", link_kind: "tribe" }], kunya: [{ value: "أبو عبد الله" }] } };
    expect(validate(rec), JSON.stringify(validate.errors)).toBe(true);
  });
  it("rejects an unknown element, an unknown certainty and a link that is not a record id", () => {
    expect(validate({ ...base, name_parts: { nickname: [{ value: "x" }] } })).toBe(false);
    expect(validate({ ...base, name_parts: { ism: [{ value: "x", certainty: "sure" }] } })).toBe(false);
    expect(validate({ ...base, name_parts: { nisba: [{ value: "x", link: "Bukhara" }] } })).toBe(false);
  });
  it("needs a value in every element", () => {
    expect(validate({ ...base, name_parts: { ism: [{ translit: "x" }] } })).toBe(false);
  });
});
