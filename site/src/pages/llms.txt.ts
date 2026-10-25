import type { APIRoute } from "astro";
import { href, labelOf, realNodes, SITE, summaryOf } from "../lib/graph";

export const GET: APIRoute = () => {
  const lines = [
    "# islam.museum",
    "",
    "> An open, free, all-digital museum of Islam: faith, civilization, peoples, places, ideas, objects and living culture. Published in Arabic (/ar/) and English (/en/); Arabic is canonical. Prose CC BY-SA 4.0; data CC0.",
    "",
    "Every entry cites sources and distinguishes scriptural, traditional, historical and debated claims. Contested topics carry parallel perspectives. Cite pages by URL.",
    "",
    "## Site statements",
    `- [Accessibility](${SITE}/en/accessibility/) — WCAG 2.2 AA statement, assistive-technology and feedback details`,
    `- [Privacy](${SITE}/en/privacy/)`,
    `- [Licenses](${SITE}/en/licenses/)`,
    `- [Authenticity](${SITE}/en/authenticity/)`,
    `- [Foundation](${SITE}/en/foundation/)`,
    "",
    "## Machine-readable data",
    `- [API index](${SITE}/api/v1/meta/index.json)`,
    `- [Coverage](${SITE}/api/v1/meta/coverage.json)`,
    `- [Graph nodes](${SITE}/api/v1/graph/nodes.ndjson)`,
    `- [Graph edges](${SITE}/api/v1/graph/edges.ndjson)`,
    "",
    "## Entries",
    ...realNodes.filter((n) => !["source", "media"].includes(n.class) && !(n.class === "passage" && n.data.unit === "ayah")).map((n) => `- [${labelOf(n, "en")} (${labelOf(n, "ar")})](${SITE}${href("en", n.id)}) — [ar](${SITE}${href("ar", n.id)}): ${summaryOf(n, "en") || summaryOf(n, "ar")}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
