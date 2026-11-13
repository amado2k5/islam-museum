// The Wander page's pool (../index.astro): the path of every page the button can lead to. Fetched on the first click.
import type { APIRoute } from "astro";
import { LANGS, type Lang } from "../../../lib/i18n";
import { wanderPool } from "../../../lib/wander";
export function getStaticPaths() { return LANGS.map((lang) => ({ params: { lang }, props: { lang } })); }
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify({ paths: wanderPool((props as { lang: Lang }).lang) }), { headers: { "content-type": "application/json; charset=utf-8" } });
