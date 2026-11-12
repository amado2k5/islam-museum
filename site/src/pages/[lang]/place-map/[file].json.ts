// The Place wing map's data for the browser script (site/public/shell/place-map.js), per language:
//   places.json   every place on the map: name, position, region, records tied to it, the years it is active
//   p-00 … p-7f   what stands around each place (people, events, buildings), fetched when a place is opened
//   e-00 … e-7f   each of those records' own links, fetched when one is put in focus
// Kept out of the page so the page stays small (it was 25 MB with the data inside it); built from the one graph by
// site/src/lib/place-map.ts. The path sits under /<lang>/, which the site Worker already serves from R2.
import type { APIRoute } from "astro";
import { LANGS, type Lang } from "../../../lib/i18n";
import { corePayload, shardName, shards, SHARDS } from "../../../lib/place-map";

export function getStaticPaths() {
  const files = ["places", ...Array.from({ length: SHARDS }, (_, i) => `p-${shardName(i)}`), ...Array.from({ length: SHARDS }, (_, i) => `e-${shardName(i)}`)];
  return LANGS.flatMap((lang) => files.map((file) => ({ params: { lang, file }, props: { lang, file } })));
}

export const GET: APIRoute = ({ props }) => {
  const { lang, file } = props as { lang: Lang; file: string };
  const body = file === "places" ? corePayload(lang) : shards(lang)[file[0] as "p" | "e"][parseInt(file.slice(2), 16)];
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json; charset=utf-8" } });
};
