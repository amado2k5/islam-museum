// The whole-list filter index of a paginated browser (site/src/lib/paged.ts, /shell/list-filter.js): every row the
// browser lists, as [path, label, text], so the filter box can search what the current page does not show.
// Fetched only when a visitor types in the filter; static, built with the site.
import type { APIRoute } from "astro";
import { BROWSER_ROWS, HALL_SLUGS, CLASS_SLUGS, hallRows, classRows } from "../../../lib/browser-registry";
import { byId, href, labelOf, stripNeedsSource } from "../../../lib/graph";
import { LANGS, type Lang } from "../../../lib/i18n";

export function getStaticPaths() {
  return LANGS.flatMap((lang) => [...Object.keys(BROWSER_ROWS), ...HALL_SLUGS, ...CLASS_SLUGS].map((browser) => ({ params: { lang, browser }, props: { lang, browser } })));
}
const TEXT = 140;
/** A hall lists thousands of records: its rows carry a shorter text so the index stays a few hundred KB. */
const HALL_TEXT = 60;
export const GET: APIRoute = ({ props }) => {
  const { lang, browser } = props as { lang: Lang; browser: string };
  const seen = new Set<string>();
  const rows: [string, string, string][] = [];
  const hall = hallRows(browser, lang) ?? classRows(browser);
  const max = hall ? HALL_TEXT : TEXT;
  for (const { node: n } of hall ?? BROWSER_ROWS[browser]) {
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    const raw = n.class === "passage" ? String(n.data.text_search ?? n.data.text ?? "") : String(n.summary?.[lang] ?? n.summary?.ar ?? n.summary?.en ?? "");
    const text = stripNeedsSource(raw).replace(/\{cite:[^}]*\}/g, "").replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1").replace(/\s+/g, " ").trim();
    const work = n.class === "passage" && n.data.work && byId.get(n.data.work as string) ? `${labelOf(byId.get(n.data.work as string)!, lang)} · ` : "";
    rows.push([href(lang, n.id).replace(`/${lang}/`, ""), labelOf(n, lang), work + (text.length > max ? `${text.slice(0, max)}…` : text)]);
  }
  return new Response(JSON.stringify({ rows }), { headers: { "content-type": "application/json; charset=utf-8" } });
};
