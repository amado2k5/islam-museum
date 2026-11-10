// Guard for the constellation explorer's data path (site/src/scripts/graph.ts, /[lang]/graph/).
//
// The page fetches `/api/v1/graph/<class>/<slug>.json` at runtime. If the exporter stops writing that file, or the
// path the page builds stops matching it, the page still renders its chrome and then shows «could not be loaded»
// for every ID. Search died the same way. These tests fail in seconds when either side drifts:
//
//   1. the fetch template in the page matches the path scripts/export-api.ts writes;
//   2. when the build output exists, person/muhammad is present at the URL the page fetches and has a centre and nodes;
//   3. every connected entity (at least one typed relation, scripts/export-api.ts connectedIds) gets a neighbourhood whose
//      centre is the entity and whose edges are real typed relations, and, when the build output exists, a file on disk.
//      The audit of 5 November 2026 read a missing file as a defect where the entity had theme-only `related` entries.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { compile } from "./build-graph";
import { buildNeighbourhoods, connectedIds, missingNeighbourhoods } from "./export-api";
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

  describe("every connected entity has a neighbourhood", () => {
    const c = compile();
    const real = c.nodes.filter((n) => !n.stub);
    const hoods = buildNeighbourhoods(c, real);
    const connected = connectedIds(c);
    const edgeKeys = new Set(c.edges.filter((e) => !e.inverse).map((e) => `${e.from}|${e.to}|${e.type}`));

    it("no connected entity is left without one, and no unconnected entity gets one", () => {
      expect(missingNeighbourhoods(c, real, hoods)).toEqual([]);
      const extra = [...hoods.keys()].filter((n) => !connected.has(n.id)).map((n) => n.id);
      expect(extra).toEqual([]);
      // EntityLayout.astro shows the "explore connections" link when degree > 0: that link must find a file.
      expect(real.filter((n) => n.degree > 0 && !connected.has(n.id)).map((n) => n.id)).toEqual([]);
    });

    it("each neighbourhood is centred on its entity and draws only typed relations", () => {
      const bad: string[] = [];
      for (const [n, h] of hoods) {
        const ids = new Set(h.nodes.map((x) => x.id));
        if (h.centre !== n.id || !ids.has(n.id) || h.edges.length === 0) bad.push(`${n.id}: centre or edges`);
        for (const e of h.edges) {
          if (!edgeKeys.has(`${e.s}|${e.t}|${e.r}`)) bad.push(`${n.id}: edge ${e.s} ${e.r} ${e.t} is not a typed relation`);
          if (!ids.has(e.s) || !ids.has(e.t)) bad.push(`${n.id}: edge ${e.s} ${e.r} ${e.t} names a node outside the file`);
        }
        if (bad.length > 20) break;
      }
      expect(bad).toEqual([]);
    });

    const GRAPH_DIR = p("site", "public", "api", "v1", "graph");
    it.skipIf(!existsSync(OUTPUT))("when the API is built, every connected entity has its file", () => {
      const missing = real.filter((n) => connected.has(n.id) && !existsSync(`${GRAPH_DIR}/${n.class}/${n.slug}.json`)).map((n) => n.id);
      expect(missing.slice(0, 20)).toEqual([]);
    });
  });
});
