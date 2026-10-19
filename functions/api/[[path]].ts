// Cloudflare Pages Function: proxy all /api/* requests to R2.
// The full dist/api/ tree is synced to R2 (to stay under the 100k-file CF Pages limit);
// this function serves it transparently so the client-facing URL never changes.
// The _redirects 200-proxy rule does not work for external domains in CF Pages.
const R2_BASE = "https://pub-ab3983f1cb684ba8bb7c10be32804f74.r2.dev";

export const onRequest: PagesFunction = async ({ request, params }) => {
  const parts = params.path;
  const path = Array.isArray(parts) ? parts.join("/") : (parts ?? "");
  const upstream = await fetch(`${R2_BASE}/api/${path}`, {
    headers: { "Accept-Encoding": "identity" },
  });
  if (!upstream.ok) {
    return new Response("Not Found", { status: 404 });
  }
  const headers = new Headers({
    "Content-Type": upstream.headers.get("Content-Type") ?? "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    "Access-Control-Allow-Origin": "*",
  });
  return new Response(upstream.body, { status: 200, headers });
};
