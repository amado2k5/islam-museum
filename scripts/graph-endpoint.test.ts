// Guard for the constellation explorer's data path (site/src/scripts/graph.ts, /[lang]/graph/).
//
// The page fetches `/api/v1/graph/<class>/<slug>.json` at runtime. If the exporter stops writing that file, or the
// path the page builds stops matching it, the page still renders its chrome and then shows «could not be loaded»
// for every ID. Search died the same way. These tests fail in seconds when either side drifts:
//
//   1. the fetch template in the page matches the path scripts/export-api.ts writes;
//   2. when the build output exists, person/muhammad is present at the URL the page fetches and has a centre and nodes.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { p, rel } from "./lib";

const PAGE_SCRIPT = p("site", "src", "scripts", "graph.ts");
const EXPORTER = p("scripts", "export-api.ts");
const KNOWN_ID = "person/muhammad";
const OUTPUT = p("site", "public", "api", "v1", "graph", ...KNOWN_ID.split("/")) + ".json";

describe("graph explorer data endpoint", () => {
  it("the page fetches the same path the exporter writes", () => {
    const page = readFileSync(PAGE_SCRIPT, "utf8");
    const exporter = readFileSync(EXPORTER, "utf8");
    // `fetch(\`/api/v1/graph/${c}/${s}.json\`)` in the page
    expect(page, `${rel(PAGE_SCRIPT)} must fetch /api/v1/graph/<class>/<slug>.json`).toMatch(
      /fetch\(`\/api\/v1\/graph\/\$\{c\}\/\$\{s\}\.json`\)/,
    );
    // `write(\`graph/${n.class}/${n.slug}.json\`, …)` in the exporter
    expect(exporter, `${rel(EXPORTER)} must write graph/<class>/<slug>.json`).toMatch(
      /write\(`graph\/\$\{n\.class\}\/\$\{n\.slug\}\.json`/,
    );
  });

  it.skipIf(!existsSync(OUTPUT))(
    `${KNOWN_ID} is in the build output at the URL the page fetches`,
    () => {
      // Skipped when no API export has been generated (run `npm run api` or `npm run build` first).
      const data = JSON.parse(readFileSync(OUTPUT, "utf8"));
      expect(data.centre).toBe(KNOWN_ID);
      expect(Array.isArray(data.nodes) && data.nodes.length > 0, "nodes must be a non-empty array").toBe(true);
      expect(Array.isArray(data.edges), "edges must be an array").toBe(true);
    },
  );
});
