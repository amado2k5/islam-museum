// Writes the static JSON API (docs/plan/09 §6) to site/public/api/v1/ from the compiled graph.
//   /api/v1/<class>/<slug>.json   full entity     /api/v1/<class>/index.json   compact index
//   /api/v1/graph/nodes.ndjson, edges.ndjson      /api/v1/meta/coverage.json, meta/index.json
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { CLASSES, p } from "./lib.js";

const OUT = p("site", "public", "api", "v1");
const write = (rel: string, body: string) => {
  const f = `${OUT}/${rel}`;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, body);
};

const compact = (n: Node) => ({
  id: n.id, class: n.class, label: n.label, summary: n.summary, wings: n.wings, regions: n.regions,
  born: n.data.born, died: n.data.died, date: n.data.date, start: n.data.start, end: n.data.end,
  coordinates: n.coordinates, wikidata: n.data.external_ids?.wikidata, status: n.data.status?.review,
});

import { readFileSync as rf } from "node:fs";
import { parse as yparse } from "yaml";
function themeIndex(c: Compiled) {
  const themes: any[] = yparse(rf(p("schema", "enums", "themes.yaml"), "utf8"));
  return themes.map((t) => ({ ...t, entries: c.nodes.filter((n) => !n.stub && n.themes.includes(t.id)).map((n) => n.id) }));
}

export function exportApi(c: Compiled) {
  rmSync(OUT, { recursive: true, force: true });
  const real = c.nodes.filter((n) => !n.stub);
  for (const cls of CLASSES) {
    const items = real.filter((n) => n.class === cls);
    if (!items.length) continue;
    write(`${cls}/index.json`, JSON.stringify(items.map(compact), null, 1));
    for (const n of items) {
      const connections = c.edges.filter((e) => e.from === n.id).map(({ from, ...e }) => e);
      write(`${cls}/${n.slug}.json`, JSON.stringify({ ...n, connections, license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" } }, null, 1));
    }
  }
  write("graph/nodes.ndjson", c.nodes.map((n) => JSON.stringify(compact(n))).join("\n") + "\n");
  write("graph/edges.ndjson", c.edges.filter((e) => !e.inverse).map((e) => JSON.stringify(e)).join("\n") + "\n");
  write("themes/index.json", JSON.stringify(themeIndex(c), null, 1));
  write("meta/coverage.json", JSON.stringify({ generated: c.generated, ...c.coverage }, null, 1));
  write("meta/index.json", JSON.stringify({
    version: "v1", generated: c.generated, classes: CLASSES.filter((k) => real.some((n) => n.class === k)),
    docs: "https://github.com/amado2k5/islam-museum/blob/main/docs/plan/09-ai-content-pipeline.md",
    license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" },
  }, null, 1));
  return real.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  console.log(`api: ${exportApi(c)} entities -> site/public/api/v1/`);
}
