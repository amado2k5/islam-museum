// RSS: "new entities, updated exhibits" (docs/plan/04 §3). At build time the
// feed reads git log for commits that touched data/<class>/*.yaml and names
// the entities they changed. A shallow clone (fetch-depth 1) yields no history
// and an empty item list — deploy.yml checks out full depth so the published
// feed is real. No dates are invented: every item's pubDate is a commit date.
import { execSync } from "node:child_process";
import type { APIRoute } from "astro";
import { byId, href, labelOf, SITE } from "../lib/graph";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fileToId = (f: string) => f.replace(/^data\//, "").replace(/\.yaml$/, "");

export const GET: APIRoute = () => {
  const items: string[] = [];
  try {
    // endpoints run with the site dir as cwd; pathspecs must anchor at the repo root
    const root = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
    const log = execSync(`git log -40 --format="%H|%aI|%s" -- "data/"`, { encoding: "utf8", cwd: root }).trim();
    for (const line of log.split("\n").filter(Boolean)) {
      const [sha, date, ...rest] = line.split("|");
      const msg = rest.join("|");
      let files: string[] = [];
      try {
        files = execSync(`git diff-tree --no-commit-id --name-only -r ${sha} -- "data/"`, { encoding: "utf8", cwd: root })
          .trim().split("\n").filter((f) => /^data\/[a-z]+\/[a-z0-9-]+\.yaml$/.test(f));
      } catch { /* merge commit quirk: skip file list */ }
      const ids = [...new Set(files.map(fileToId))];
      const labels = ids.slice(0, 8).map((id) => (byId.has(id) ? labelOf(byId.get(id)!, "ar") : id));
      const title = labels.length ? `${labels.join("، ")}${ids.length > 8 ? ` +${ids.length - 8}` : ""}` : msg;
      const link = ids.length === 1 && byId.has(ids[0]) ? `${SITE}${href("ar", ids[0])}` : `${SITE}/ar/coverage/`;
      items.push(`    <item><title>${esc(title)}</title><link>${esc(link)}</link><guid isPermaLink="false">${esc(sha)}</guid><pubDate>${new Date(date).toUTCString()}</pubDate><description>${esc(msg)}</description></item>`);
    }
  } catch { /* no git history at build time: the feed still validates, with no items */ }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>islam.museum — جديد المتحف</title>
  <link>${SITE}/ar/</link>
  <description>أحدث ما أُضيف إلى المتحف أو حُدّث فيه · What is newest in the museum</description>
  <language>ar</language>
${items.join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
