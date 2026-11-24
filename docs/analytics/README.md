# Traffic analytics — evidence records

Public, aggregate traffic evidence for islam.museum. Raw dashboard exports, screenshots
and any data containing account identifiers or client IP addresses are **not** committed;
they stay private with the founder. Only sanitized aggregates live here.

## Founder policy (binding)

The museum welcomes every form of traffic — human readers, search engines, AI
assistants, crawlers, archives and programmatic consumers. These records exist for
transparency, attribution and impact reporting. They are never a reason to block,
throttle, challenge or reduce traffic, and no change that would reduce requests may
be made without a separate, explicit founder approval.

## Files

| File | What it is |
|---|---|
| `traffic-evidence-2026-11-24.md` | The founding evidence baseline: founder-supplied Cloudflare exports (visitors, country and ASN request reports, AI Crawl Control, referral CSVs) and two public ranking files, covering 25 Oct – 24 Nov 2026. Historical snapshot. |
| `../engineering/68-singapore-traffic-investigation.md` | The engineering root-cause investigation behind the baseline: the `deploy.json` fetch chain, `/api/*` redirects, R2 cache behavior and release correlations. |

The public page `/{lang}/traffic/` renders from the canonical aggregate dataset
`site/src/data/traffic.json`; the site never duplicates numbers by hand — update the
JSON and the page follows in every language.

## Canonical data model (`site/src/data/traffic.json`)

Each observation record carries: a stable `id`; `provider` and `metric`; `value`
(`null` when unknown, e.g. exact Radar rank); `exact`/`tier_max` where a provider
reports a popularity tier rather than a rank; the observation `period` or `observed`
date; `evidence` (source ID); `status` (`verified-file`, `earlier-reported-unverified`,
`mixed`); a `note`; and a public `url` when one exists. Every source carries a `kind`
(`founder-export`, `founder-screenshot`, `public-download`), a `public` flag, and a
`sha256` when the original file was hashed. `public: false` sources are described,
never reproduced.

## Metric definitions (do not mix them)

- **Pageview** — a Cloudflare visitor-analytics page view (E1/E2 exports).
- **Visit** — Cloudflare's visit metric; not a session and not a person.
- **Request** — any HTTP request at the edge: HTML, assets, API calls, redirects,
  preflights (E3–E6 exports). Never compare requests to pageviews.
- **Referral** — a followed link carrying a referrer (E7/E8). Includes ordinary
  search/social referrers; not proof of AI-answer citations.
- **Detected crawler request** — Cloudflare AI Crawl Control's classification of a
  request from an identified bot (E7). Not a document, a training run or an answer.
- **Rank** — an exact position (Tranco). **Tier inclusion** — membership in an
  unordered popularity group (Radar top-N); row position in a Radar CSV is
  alphabetical, never a rank.

Country attaches to the requesting address, not the reader's nationality or an AI
user's location. ASN attaches to egress infrastructure, not the application running
on it. Figures from overlapping views (country reports, crawler reports, referral
exports) are never summed.

## Evidence status vocabulary

`verified-file` — rechecked directly against the original source file in this repo's
records. `founder-export` — private dashboard export, not independently public.
`earlier-reported-unverified` — an observation reported before the baseline, pending
verification against official history. `pending` — instrumentation not yet in place;
record it rather than guessing.

## Ongoing collection (read-only, no paid services)

Ranking files are public downloads; dashboard data is a manual founder export.

- **Tranco**: `https://tranco-list.eu/top-1m.csv.zip` (verify the row
  `rank,islam.museum` and record the list ID/date); domain history endpoint:
  `https://tranco-list.eu/api/ranks/domain/islam.museum`.
- **Cloudflare Radar**: domain profile `https://radar.cloudflare.com/domains/domain/islam.museum`;
  top-N CSV `https://radar.cloudflare.com/charts/LargerTopDomainsTable/attachment?top=200000`
  (same-tier checks only for the same reporting period).
- **AI Crawl Control / visitor analytics**: founder exports the dashboard views
  (visitors, per-country request reports, AI crawler detail and category CSVs,
  referral source/destination CSVs). Hash each file (`shasum -a 256`), record the
  hash and export coverage in the manifest, and append a new dated evidence file
  plus new observations to `traffic.json` — history is append-only, prior snapshots
  are never rewritten.
- **Google Search Console** (when access exists): clicks, impressions, countries,
  pages and queries, to corroborate referrer-header figures.

Missing data is recorded as unavailable — never as a traffic decline.
