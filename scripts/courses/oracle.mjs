// Shared helpers for the courses-mission oracles written in JavaScript (the ones that need a browser).
// Same contract as scripts/courses/lib.py: print what was measured, end with `RESULT: GREEN (...)` or `RESULT: NOT-GREEN (...)`,
// and with --save keep the output under docs/courses-mission/oracle-output/.
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

export const BASELINE = "800467e93e2c9ef073807f6bd5c7b717b028f859";
export const DIST = resolve(".cache/courses-dist");
const sh = (c) => execSync(c, { encoding: "utf8" }).trim();

export class Oracle {
  constructor(num, title) {
    this.lines = []; this.passed = 0; this.failed = [];
    this.note(`ORACLE ${num}: ${title}`);
    const dirty = sh("git status --porcelain -- data content site i18n scripts/courses").split("\n").filter(Boolean).length;
    this.note(`run at commit ${sh("git rev-parse HEAD")} on ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC; baseline ${BASELINE.slice(0, 10)}; uncommitted paths under data/ content/ site/ i18n/ scripts/courses/: ${dirty}`);
    this.note();
  }
  note(s = "") { this.lines.push(s); console.log(s); }
  check(name, ok, detail = "") { if (ok) this.passed++; else this.failed.push(name); this.note(`  [${ok ? "PASS" : "FAIL"}] ${name}${detail ? ` — ${detail}` : ""}`); return ok; }
  done(slug) {
    this.note();
    this.note(this.failed.length ? `RESULT: NOT-GREEN (${this.failed.length} failed: ${this.failed.join("; ")})` : `RESULT: GREEN (${this.passed} checks passed)`);
    if (process.argv.includes("--save")) { mkdirSync("docs/courses-mission/oracle-output", { recursive: true }); writeFileSync(`docs/courses-mission/oracle-output/${slug}.out`, this.lines.join("\n") + "\n"); }
  }
}

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".jpg": "image/jpeg" };
const PUBLIC = resolve("site/public");
/** Serve the scoped build (falling back to site/public for static files the scoped build does not copy). */
export const serve = (port, dist = DIST) => new Promise((ok) => {
  const srv = createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    for (const root of [dist, PUBLIC]) {
      const f = join(root, p.endsWith("/") ? p + "index.html" : p);
      if (!f.startsWith(root)) continue;
      try { const b = await readFile(f); res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream" }); res.end(b); return; } catch {}
    }
    res.writeHead(404); res.end("not found");
  });
  srv.listen(port, () => ok(srv));
});

/** The course tree read from data/course/*.yaml with a minimal reader (ids, kinds, parents, order): no YAML dependency needed. */
export function courseTree() {
  const recs = readdirSync("data/course").filter((f) => f.endsWith(".yaml")).map((f) => {
    const t = readFileSync(join("data/course", f), "utf8");
    const g = (k) => (t.match(new RegExp(`^${k}:\\s*(.+)$`, "m")) ?? [])[1]?.trim();
    return { id: g("id"), slug: g("id").split("/")[1], kind: g("kind"), parent: g("part_of"), order: Number(g("order") ?? g("grade_number") ?? 0) };
  });
  const by = Object.fromEntries(recs.map((r) => [r.id, r]));
  const subjectOf = (r) => { let x = r; while (x && x.kind !== "subject") x = by[x.parent]; return x; };
  const lessons = recs.filter((r) => r.kind === "lesson").map((r) => ({ ...r, subject: subjectOf(r)?.slug }));
  return { recs, lessons };
}
