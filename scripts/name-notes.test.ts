// Every note inside a person's name_parts that is written as a block must carry all five languages (founder rule of
// 20 November 2026); a plain-string note is still allowed by the schema but is not used by the shipped records.
import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { readYaml } from "./lib.js";

const LANGS = ["ar", "en", "ur", "fr", "es"];
function notes(o: any, out: any[] = []): any[] {
  if (Array.isArray(o)) o.forEach((v) => notes(v, out));
  else if (o && typeof o === "object") {
    if ("note" in o && "value" in o) out.push(o.note);
    Object.values(o).forEach((v) => notes(v, out));
  }
  return out;
}

describe("name_parts notes", () => {
  it("are localized in all five languages", () => {
    const bad: string[] = [];
    for (const f of readdirSync("data/person").filter((x) => x.endsWith(".yaml"))) {
      const d: any = readYaml(`data/person/${f}`);
      if (!d?.name_parts) continue;
      for (const n of notes(d.name_parts)) {
        if (typeof n === "string") { bad.push(`${f}: plain string note`); continue; }
        for (const l of LANGS) if (!n?.[l]) bad.push(`${f}: missing ${l}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
