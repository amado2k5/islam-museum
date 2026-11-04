// Job Browser, step 1 (docs/jobs/schema.md): the job class, the person occupations block and the job ties on things.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { CLASSES } from "./lib.js";

const schema = (name: string) => JSON.parse(readFileSync(new URL(`../schema/${name}.schema.json`, import.meta.url), "utf8"));

describe("job class (docs/jobs/schema.md)", () => {
  it("is a registered class in the base schema", () => {
    expect(CLASSES).toContain("job");
    expect(schema("_base").properties.class.enum).toContain("job");
  });

  it("requires domain, kind and hirfa, and takes only the enumerated domains", () => {
    const job = schema("job");
    expect(job.required).toEqual(["domain", "kind", "hirfa"]);
    expect(job.properties.domain.enum).toHaveLength(14);
    expect(job.properties.domain.enum).toContain("building-making");
    expect(job.properties.kind.enum).toContain("modern-profession");
  });

  it("carries the craft block with the existing materials enum", () => {
    const craft = schema("job").properties.craft;
    expect(craft.type).toBe("object");
    expect(craft.additionalProperties).toBe(false);
    expect(craft.properties.materials.items.enum).toContain("copper");
  });
});

describe("person occupations and job ties", () => {
  it("an occupation names a job, a kind and at least one source", () => {
    const occ = schema("person").properties.occupations.items;
    expect(occ.required).toEqual(["job", "kind", "sources"]);
    expect(occ.properties.sources.minItems).toBe(1);
    expect(occ.properties.kind.enum).toEqual(["primary", "secondary", "episodic", "honorary"]);
    expect(occ.additionalProperties).toBe(false);
  });

  it("the things of a job (objects, buildings, works, groups, events, places, journeys) take job ties with sources", () => {
    for (const cls of ["object", "building", "work", "group", "event", "place", "journey"]) {
      const ties = schema(cls).properties.jobs.items;
      expect(ties.required, cls).toEqual(["job", "relation", "sources"]);
      expect(ties.properties.relation.enum, cls).toContain("made-by");
    }
  });

  it("people, and classes without a job tie, do not gain a jobs block", () => {
    expect(schema("person").properties.jobs).toBeUndefined();
    expect(schema("source").properties.jobs).toBeUndefined();
  });
});
