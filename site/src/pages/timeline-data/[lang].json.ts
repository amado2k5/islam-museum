// The Hijri timeline's data for the browser script, one JSON file per language. Moved out of the page so that the
// page itself stays small; the page still draws its own markers without it.
import type { APIRoute } from "astro";
import { ALL_LANGS, LANGS, SHARED_BUILD, type Lang } from "../../lib/i18n";
import { timelineModel } from "../../lib/timeline-model";

// Shared data, one file per language: the shared build writes all of them, a language build only its own (unused).
export function getStaticPaths() { return (SHARED_BUILD ? ALL_LANGS : LANGS).map((lang) => ({ params: { lang }, props: { lang } })); }

export const GET: APIRoute = ({ props }) => {
  const { lang } = props as { lang: Lang };
  return new Response(JSON.stringify(timelineModel(lang).payload), { headers: { "content-type": "application/json; charset=utf-8" } });
};
