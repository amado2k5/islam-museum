# Singapore traffic investigation (AS45102, AS132203), 25 Oct – 24 Nov 2026

Investigation into the Cloudflare analytics the founder obtained for two Singapore
networks. Aggregate findings only; no client IP addresses are recorded here.

## Verdict in one paragraph

The volume is mostly a large, distributed, JavaScript-executing crawl fleet whose
cost per page view was multiplied by changes made **on our side**: since
6 November 2026 every HTML page fires an idle-time `fetch("/api/v1/meta/deploy.json")`
for the footer version, and every `/api/*` address on islam.museum is a **301 to
api.islam.museum**, an R2 custom domain that **does not edge-cache**
(`cf-cache-status: DYNAMIC`). One page view therefore became 4–7 requests and at
least one uncached R2 read where it used to be one cached HTML read. No polling
loop, service worker or reload bug exists — the code fires once per page load;
the fleet simply loads pages at enormous scale, without a shared browser cache.

## Verified findings

### 1. What requests `/api/v1/meta/deploy.json`

| Caller | When | File |
|---|---|---|
| Footer version | **Every page, once per page load**, via `requestIdleCallback` (fallback `setTimeout(go,1)`) | `site/public/shell/shell.js` (last IIFE) |
| Landing "Last updated" | Every language landing page, on load | `site/src/scripts/landing-random.ts:20` |
| Backstage stats | Backstage pages only | `site/src/scripts/backstage-stats.ts:17` |
| Graph auto-load | Every `/graph/` view fetches `/api/v1/graph/{centre}.json` for the default centre (person/muhammad) | `site/src/scripts/graph.ts:260,290` |
| Graph interactions | Each re-centre / filter / popstate | `site/src/scripts/graph.ts` |
| Canon index | First focus of the graph search box | `site/src/scripts/graph.ts:55` |
| Menu counts | First open of the wings menu | `shell.js` (`data-wing-count` toggle) |

No `setInterval`, polling, retry or `visibilitychange` refetch anywhere for these
endpoints. A parked background tab does **not** re-fire: `requestIdleCallback`
runs the fetch once, deferred at most. Indefinite volume comes from repeated
**page loads**, not repeated timers. There is no service worker in the site
(`grep navigator.serviceWorker`: nothing).

Introduced by commit `c6f01db` (6 Nov 2026, "stop page scripts, the version and
the e-books rewriting every deploy", `docs/engineering/16-deploy-churn-proposal.md`):
the version moved out of the HTML (which it rewrote on every deploy) into
`deploy.json`, and the fetch was added to `shell.js`.

### 2. The `/api/*` redirect chain (verified live)

```
GET https://islam.museum/api/v1/meta/deploy.json   → 301 → https://api.islam.museum/…
GET https://api.islam.museum/api/v1/meta/deploy.json → 200, cache-control: public, max-age=3600, s-w-r=86400
                                                        cf-cache-status: DYNAMIC (R2 custom domain: never cached)
OPTIONS (preflight) → 204, access-control-allow-methods: GET, HEAD, max-age=86400
GET https://islam.museum/ar/graph → 301 → /ar/graph/
```

- `site/public/_redirects`: `/api/* https://api.islam.museum/api/:splat 301`.
  Production `run_worker_first` (`workers/site/wrangler.production.toml`) does
  **not** include `/api/*`, so the assets layer answers the 301.
- `api.islam.museum` is an R2 **custom domain** on `islam-museum-search`
  (`docs/engineering/06-deployment.md` §21): no Worker, no edge caching. Every
  API GET is an R2 Class-B read.
- CORS: `Access-Control-Allow-Origin: *` everywhere; the browser `fetch()` is a
  simple request and needs **no** preflight (confirmed in a controlled
  Playwright session). The observed 204s are OPTIONS preflights issued by
  *client* stacks that preflight anyway or send non-simple headers — R2 answers
  them with 204.

### 3. Reproduction (Playwright, 24 Nov 2026, `https://islam.museum/ar/graph`)

```
GET /ar/graph                          → 301 /ar/graph/
GET /ar/graph/                         → 200 (+ shell.js, entity.js, CSS, fonts)
GET /api/v1/meta/deploy.json           → 301
GET api.islam.museum/…/deploy.json     → 200
GET /api/v1/graph/person/muhammad.json → 301      (auto centre load, graph.ts:290)
GET api.islam.museum/…/muhammad.json   → 200
```

**~9 requests for one page view**, of which 3 are redirects and 2 are uncached
R2 reads. A non-graph entity page costs ~6. Before 6 Nov it was 1 HTML + assets.

### 4. Why the cache-hit rate is 3.41 %

- `api.islam.museum`: `cf-cache-status: DYNAMIC` on every object — R2 custom
  domains do not cache; 100 % miss by design.
- `deploy.json` content changes on **every deploy** (it is the deploy stamp), so
  even its 1-hour edge allowance is invalidated by each release.
- `shell.js`/`entity.js` deliberately ship `max-age=300` — browsers revalidate
  them every 5 minutes (they are un-hashed by design, doc 16).
- Crawler clients do not share a cache across nodes, so every page load pays
  full price.
- Trailing-slash 301s double every slashless request (`/ar/graph`,
  `/ar/graph/` nearly equal in the analytics). Internal links are correct
  (`nav.ts` uses `/${lang}/graph/`); the slashless hits come from the client
  side normalising URLs.

### 5. Correlation with releases

| Window | Relevant change |
|---|---|
| 6 Nov | `c6f01db` — `shell.js` created; footer-version fetch added on every page; `deploy.json` stamped each deploy. Fleet page views start costing the 301+GET chain from the next deploys. **Matches the Nov 9–12 ramp.** |
| 19 Nov | `dd7418d`, `d018088` — root-address language redirect in `shell.js` (one extra navigation for `/` visits; guarded by `pathname !== "/"`, cannot loop). |
| 22 Nov | `8f1be67` — Turkish + Indonesian wired through registry/routing/search: URL space grows ~40 %; `workers/site` LANGS extended. |
| 19–23 Nov | Heavy ship cadence (viewpoints, nuzul, tajwid, maajim…): each deploy rewrites `deploy.json`, invalidating its 1 h cache for everyone. |

### 6. Who is doing it (what can and cannot be said)

- **Verified**: extremely distributed fleet (busiest IP ≈ 800–1 350 requests in
  a month), uniform top-10 user-agent frequencies (45.5–46.4 k each), desktop
  Windows Chrome, HTTP/1.1, referer `islam.museum` on ~60 % of Tencent requests.
  This is a headless/ scripted browser fleet rendering JS — a content harvest,
  not a monitoring probe and not a frontend bug.
- **Verified**: nothing in the repository runs monitoring from Alibaba or
  Tencent. Internal scripts that touch `deploy.json` (`scripts/courses/o01_audit.py`,
  `scripts/fable/*`, `scripts/indexnow.mjs`, CI smoke checks in `deploy-env.yml`)
  are ad-hoc, single-digit requests.
- **Cannot be determined from the ASN data alone**: the operating organisation.
  Alibaba AS45102 and Tencent AS132203 are egress networks used by many
  crawlers and AI pipelines; ASN does not prove application ownership.
- **Confirmed by Cloudflare AI Crawl Control (founder's screenshot, 24 Nov
  2026)**: 7.35 M AI-crawler requests in 30 days — PerplexityBot 1.81 M,
  GPTBot 1.6 M, ClaudeBot 1.24 M, Applebot 855 k, Amazonbot 660 k,
  Meta-ExternalAgent 305 k, Googlebot 223 k, BingBot 198 k, archive.org_bot
  189 k, Bytespider 55 k. Perplexity alone took **46.17 GB of HTML**. The most
  crawled path on the whole site is
  `api.islam.museum/api/v1/meta/deploy.json` (135.92 k successful requests in
  this view). The Alibaba/Tencent fleets are rented egress for these (and
  unidentified) AI crawlers — the two datasets describe the same harvest seen
  from different angles: the ASN view counts every request a browser-fleet node
  makes (pages, shell scripts, redirects, API hops), the crawler view counts
  identified bots.
- Alibaba vs Tencent differ mainly in shape: Alibaba fetched more bytes
  (24 GB — heavier asset graph); Tencent generated far more redirects/204s/API
  hits (deeper crawling of graph/explorer pages that trigger the `/api/*` chain).

## Request amplification estimate

Per JS-executing page view, vs the 1 HTML request a plain fetch costs:

| Page type | Requests | Redirects | Uncached R2 reads |
|---|---|---|---|
| Entity page | ~5–6 | 1–2 | 1 (deploy.json) |
| `/graph/` page | ~9 | 3 | 2 (deploy.json + graph JSON) |
| Slashless URL | +1 | +1 | — |
| Menu open / canon use / graph click | +2 each | +1 each | +1 each |

Tencent: 1.87 M requests ≈ ~300–400 k rendered page views at ~5× amplification.
Alibaba: 1.02 M requests ≈ ~250 k page views at ~4× (it fetched bigger assets).

## Cost implications

- R2 Class-B reads on api.islam.museum: ~0.8–1 M/month from the footer fetch
  alone ≈ **$0.30–0.40/month** — small, but every read is needless.
- Worker invocations: `/api/*` 301s and HTML under `run_worker_first` are billed
  per request; Workers Caching absorbs cached HTML for 1 h per PoP.
- Pages/requests: ~2.9 M/30 days from these two ASNs — the dominant cost is
  serving the fleet, not a code defect's bill.
- The `deploy.json` chain also pollutes real-user traffic: every visitor pays a
  301 + cross-origin round-trip just to render a footer version string.

## Recommendations (for the founder; nothing implemented)

1. **P1 — kill the footer `deploy.json` hop.** Cloudflare names it the single
   most crawled path on the site. Write the deploy stamp into a small
   same-origin file next to `shell.js` (e.g. `/shell/deploy.js` or a JSON
   under an R2 dir the Worker serves with the same 5-min policy). Zero
   cross-origin requests, no API involvement, same "one file per deploy" churn
   property that motivated the change. Alternatively point the fetch straight
   at `https://api.islam.museum/…` to drop the 301 (still uncached R2).
2. **P1 — cache the API at the edge.** Put a tiny Worker (or a Cache Rule) in
   front of `api.islam.museum` so JSON honours its `cache-control` —
   `s-maxage=3600` for meta, longer for entity JSON — instead of every hit being
   an R2 read. Also turns the 204 preflights into cheap cached responses.
3. **P2 — same-origin the API path.** Let the site Worker serve `/api/*` from
   the same bucket (add `/api/*` to `run_worker_first`, map to `api/*` keys) and
   keep the 301 only for legacy/api-subdomain links. Removes the per-fetch
   cross-origin hop and the CORS preflight class entirely.
4. **P2 — reduce per-view auto-fetches.** Gate the graph default-centre load
   behind first interaction, or embed the default centre's payload in the page
   (it is the same `person/muhammad` JSON for everyone).
5. **P3 — measure before blocking.** Enable per-path analytics/Logpush to watch
   `/api/*` and `/shell/*` rates; keep ASN blocking off the table (fleet is
   distributed; busiest IP ~1.3 k requests/month means IP-rate limits do
   little). If throttling is wanted later, a Cache Rule + Workers-side rate
   limit on `api.islam.museum` is the lever — needs founder approval.
6. **P3 — docs.** Record in `docs/engineering/16-deploy-churn-proposal.md` that
   the footer-version trade moved cost from deploy-time page churn to
   per-page-view request amplification under crawler load.

## Open questions for Cloudflare analytics (read-only, when available)

- Confirm the 204s are `OPTIONS` to api.islam.museum (method + host breakdown).
- Path histogram on AS132203 to confirm graph/explorer concentration.
- Whether the fleet honours `robots.txt` and what fraction hits `/pagefind-*`
  (immutable, 1-year cache — harmless) vs `/api/*` (never cached — the cost).
