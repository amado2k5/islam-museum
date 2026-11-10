// The Hijri timeline's data for the browser script, one JSON file per language. Moved out of the page so that the
// page itself stays small; the page still draws its own markers without it.
import type { APIRoute } from "astro";
import { LANGS, type Lang } from "../../lib/i18n";
import { timelineModel } from "../../lib/timeline-model";

export function getStaticPaths() { return LANGS.map((lang) => ({ params: { lang }, props: { lang } })); }

export const GET: APIRoute = ({ props }) => {
  const { lang } = props as { lang: Lang };
  return new Response(JSON.stringify(timelineModel(lang).payload), { headers: { "content-type": "application/json; charset=utf-8" } });
};
