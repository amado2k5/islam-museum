// axe-core accessibility audit over a route matrix of the built site (dist/).
// Serves dist/ on a loopback server, opens each route in headless Chromium and runs axe.
// Fails on serious or critical violations; moderate/minor print as warnings.
// Run after `npm run build`:  npm run axe
import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { p } from "./lib";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const DIST = p("dist");
const PORT = 48123;

// One representative route per page family per language — interactive islands get
// their own entries so axe sees the enhanced DOM, not only the no-JS output.
const ROUTES = [
  "", // home
  "accessibility/",
  "person/ibn-sina/",
  "art/",
  "shabab/journey/",
  "search/",
  "today/",
];

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function serve(): Promise<Server> {
  const srv = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
      let file = join(DIST, p.endsWith("/") ? p + "index.html" : p);
      if (!file.startsWith(DIST)) throw 0;
      let body: Buffer;
      try {
        body = await readFile(file);
      } catch {
        file = join(DIST, p, "index.html");
        body = await readFile(file);
      }
      res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => srv.listen(PORT, () => ok(srv)));
}

const run = async () => {
  const server = await serve();
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  let failed = 0;
  for (const lang of ["ar", "en", "ur"]) {
    for (const r of ROUTES) {
      const path = `/${lang}/${r}`;
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400); // let islands hydrate
      const res = await new AxeBuilder({ page }).analyze();
      const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      const mild = res.violations.filter((v) => v.impact === "moderate" || v.impact === "minor");
      for (const v of bad) {
        failed++;
        console.log(`error  ${path}  [${v.impact}] ${v.id}: ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.log(`       ${n.target.join(", ")}`);
      }
      for (const v of mild) console.log(`warn   ${path}  [${v.impact}] ${v.id}: ${v.help}`);
      if (!res.violations.length) console.log(`ok     ${path}`);
    }
  }
  await browser.close();
  server.close();
  console.log(`\n${failed} serious/critical axe violation(s)`);
  if (failed) process.exit(1);
};

run().catch((e) => {
  console.error(e);
  process.exit(2);
});
