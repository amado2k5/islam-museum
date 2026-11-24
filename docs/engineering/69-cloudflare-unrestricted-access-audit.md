# 69 — Cloudflare unrestricted-access audit (2026-11-24)

**Date:** 24 November 2026
**Scope:** the islam.museum Cloudflare zone and its public hostnames only. Other projects in the same account were not inventoried and not modified.
**Method:** read-only dashboard inventory via the founder's signed-in Mac Chrome (four steps: zone/DNS, AI Crawl Control, Security, Rules/Caching/Workers/SSL/Network), a source review of the production Worker in the repository, and live-side curl checks from the audit VM. Pre-change snapshots of every inventoried area are kept with the internal record in the founder's private workspace (rollback basis).
**Founder policy applied:** welcome all traffic to public content — humans from every country, search crawlers, AI training/search/user-initiated crawlers, autonomous agents, scrapers, archives, API consumers, headless and command-line clients, verified and unverified crawlers, high-frequency retrieval, cloud/VPN/proxy origins. Preserve essential security for private/admin/write surfaces, passive analytics/monitoring, and CDN/caching.

This is the repository copy of the audit record, scrubbed of account and zone identifiers; the full internal record (with identifiers and the pre-change snapshots) is kept in the founder's private workspace. A short public transparency note was published alongside it.

## Zone facts

- Account: the founder's Cloudflare account (identifier in the internal record only); the account holds other projects, which were out of scope.
- Zone: islam.museum, **Pro plan** (next bill Dec 17, 2026), zone ID *(internal record only)*, DNS Setup: Full.
- Traffic at inventory time: 24h — 384.63k unique visitors, 1.33M requests, 38 GB served; 30d — 6.36M unique visitors, 28.5M requests, 713 GB. 7d (Security step): 8.27M requests, suspicious activity 0.

## Before / after table

| Configuration | Previous state | Final state | Action taken | Verification | Reason |
|---|---|---|---|---|---|
| DNS records (14, no A/AAAA) | Apex + www CNAME → islam-museum.pages.dev (Proxied); *.islam.museum CNAME → amado2k5.github.io (Proxied); api.islam.museum → R2 islam-museum-search (Proxied); uat.islam.museum → Worker islam-museum-site-uat (Proxied); uat-api.islam.museum → R2 islam-museum-uat (Proxied); Bing-verify CNAME (DNS only); 3 MX to Cloudflare Email Routing; TXT SPF / DKIM / DMARC (p=none) / google-site-verification | Unchanged | None — inventory only | Dashboard read, Step 1 snapshot | DNS routes public traffic to the site; nothing in DNS restricts who may resolve or connect |
| Zone quick toggle — Bot Preference Sync | ON | ON (unchanged) | None | Dashboard read, Steps 1–2 | Syncs the dashboard crawler preferences (all Allow) into robots.txt handling; consistent with the founder policy |
| Zone quick toggle — Markdown for Agents | ON | ON (unchanged) | None | Dashboard read, Steps 1–2 | Serves agent-friendly markdown; widens, not restricts, machine access |
| Zone quick toggle — Under Attack Mode | OFF | OFF (unchanged) | None | Dashboard read, Step 1 | Off means no interstitial challenge is imposed on visitors |
| Zone quick toggle — Development Mode | OFF | OFF (unchanged) | None | Dashboard read, Steps 1/4 | Cache-bypass mode; no access effect |
| Zone quick toggle — Precursor | OFF | OFF (unchanged) | None | Dashboard read, Steps 1–3 | Not enabled; no access effect |
| AI Crawl Control — global category defaults | Search = Allow (do not block); Training = Allow; Agents = Allow; personal agents (Claude Duet, dots, Gemini Spark, Muse) all Allow; default for unlisted crawlers = Allow | Unchanged | None | Dashboard read, Step 2 snapshot | Already matches the founder policy in full |
| AI Crawl Control — named crawlers (33) | All 33 listed crawlers set to Allow; every Block toggle OFF; none set to Charge: GPTBot, PerplexityBot, ClaudeBot, Meta-ExternalAgent, OAI-SearchBot, Amazonbot, Applebot, BingBot, archive.org_bot, Googlebot, Bytespider, ChatGPT-User, PetalBot, Baidu, Claude-User, Perplexity-User, CCBot, Muse, Anchor Browser, Arquivo Web Crawler, Claude-SearchBot, Cloudflare Crawler, DuckAssistBot, FacebookBot, Google-CloudVertexBot, Manus Bot, Meta-ExternalFetcher, MistralAI-User, Novellum AI Crawl, ProRataInc, Terracotta Bot, TikTok Spider, Timpibot | Unchanged (33 Allow / 0 Block / 0 Charge) | None | Dashboard read, Step 2 snapshot. 7d AI-crawler traffic: 3.3M requests, 2.98M answered HTTP 200; top GPTBot ~700k, PerplexityBot ~700k, ClaudeBot ~636k, all allowed | Already unrestricted |
| AI Crawl Control — pay-per-crawl | None configured anywhere; no crawler set to Charge | Unchanged | None | Dashboard read, Step 2 | No payment barrier to crawling exists |
| AI Crawl Control — "Redirects for AI Training" | ON (training crawlers redirected to canonical versions of outdated content) | ON (unchanged) | None | Dashboard read, Step 2 | Canonicalisation, not a block: the current content is served at the canonical URL. Retained and noted so it is not mistaken for a restriction |
| AI Crawl Control — blocked-response configuration | A 403 + "Please contact the site owner for access." response is configured for blocked crawlers, but no crawler is blocked; allowed-paths checkboxes (/robots.txt, /mcp, /llms.txt, /llms-full.txt, /ads.txt, /.well-known/*) all unchecked | Unchanged (dormant — nothing triggers it) | None | Dashboard read, Step 2 | Inert while every crawler is Allow |
| Super Bot Fight Mode | Verified bots allowed; "Definitely automated traffic" = Allow; JavaScript Detections OFF; Static resource protection OFF; Optimize for WordPress OFF | Unchanged | None | Dashboard read, Steps 2–3 | Automated traffic is allowed, not challenged or blocked |
| AI Labyrinth | OFF | OFF (unchanged) | None | Dashboard read, Steps 2–3 | No crawler-trapping is in place |
| WAF — Custom rules | 0 of 20 used (none exist) | Unchanged | None | Dashboard read, Steps 2–3 | No custom firewall rule can block anyone |
| WAF — Rate limiting rules | 0 of 2 used (none exist) | Unchanged | None | Dashboard read, Steps 2–3 | No rate limit applies to any client, however high-frequency |
| WAF — Managed rules / Cloudflare Managed Ruleset / OWASP / Leaked Credentials Check | All OFF; no managed rules created; AI Crawl Control generated no WAF rules. Dashboard shows a "Critical" action item urging that Managed Rules be enabled | Unchanged (all OFF) | None — the dashboard's recommendation to enable Managed Rules was considered and declined | Dashboard read, Steps 2–3 | Enabling managed rulesets adds false-positive risk for API and research traffic; the founder policy prefers open access on a static, read-only site |
| Browser Integrity Check | **ON — the only active blocker in the zone.** Security Analytics: 71 blocks in the last 24h, all Browser Integrity Check; 274 mitigated in 7d, all BIC-class. Blocked requests presented ancient spoofed browser signatures (MSIE 2.0 / 3.01 class) with Referer "None" | **OFF** | Toggled OFF in the dashboard (Security → Settings), islam.museum zone only, 24 Nov 2026 | (1) Dashboard re-read after the change: toggle unchecked (off) after a page reload. (2) Live curl tests after the change: a request with the previously blocked spoofed legacy-browser user agent now returns HTTP 200; default curl, GPTBot and no-user-agent requests to public pages also return 200 | A browser-integrity filter discriminates by client fingerprint, which the founder policy forbids on public content; the site is static and read-only, and always-on DDoS protection is unaffected |
| Challenge Passage | 1 configuration: a single global 30-minute passage after a passed challenge | Unchanged | None | Dashboard read, Step 3 | Inert: no rule in the zone issues a challenge, so nothing ever asks a visitor to pass one |
| Hotlink Protection | OFF | OFF (unchanged) | None | Dashboard read, Step 3 | Other sites and clients may embed/link museum media freely |
| Email Address Obfuscation | OFF | OFF (unchanged) | None | Dashboard read, Step 3 | Page content is served unaltered to every client |
| Continuous Script Monitoring | OFF | OFF (unchanged) | None | Dashboard read, Step 3 | No access effect |
| Schema Validation | ON, but 0 endpoints / 0 schemas configured | Unchanged | None | Dashboard read, Step 3 | Inert with no endpoints defined |
| Web Assets Protection | Shown ON in the zone overview; the Web Assets page lists no operations and 0 endpoints | Unchanged | None | Dashboard read, Steps 1/3 | Nothing in it blocks hotlinking, scraping or referrer-less requests |
| Security Level | Automated ("always protected") | Unchanged | None | Dashboard read, Steps 1/3 | No elevated security level imposing challenges |
| DDoS protection (HTTP + Network) | Always active | Always active (unchanged) | None — cannot be disabled | Dashboard read, Step 1 | Mandatory Cloudflare platform protection; it absorbs floods without discriminating between legitimate client types |
| IP Access Rules | None exist (no rules; only a create-rule entry point) | Unchanged | None | Dashboard read, Step 3 | No IP, ASN or country blocking exists |
| Account Lists | 0 custom lists, 0 IP lists; Cloudflare managed lists not in use | Unchanged | None | Dashboard read, Step 3 | No list-based blocking exists |
| Zone Lockdown | None | Unchanged | None | Dashboard read, Step 3 | No URL is locked to specific IPs |
| User-agent blocking rules | None | Unchanged | None | Dashboard read, Step 3 | No UA-based blocking (separate from Browser Integrity Check, above) |
| Access / Zero Trust | Not set up; no Access application covers any islam.museum hostname | Unchanged | None | Dashboard read, Step 3 | No login wall in front of any public hostname |
| Cache Rules | 2 rules, both benign and known-good since 6 Nov: "Static assets — long edge cache" (30-day edge TTL for /media/ and static extensions); "HTML pages — edge cache" (GET HTML, 4h edge TTL, excludes api + uat hosts) | Unchanged | None | Dashboard read, Step 4 | Caching speeds delivery for every client equally; the API and UAT hosts are excluded from page caching only |
| Cache settings | Tiered Cache ON (Smart); Cache Level Standard; Browser TTL 4h; Always Online ON; Crawler Hints ON | Unchanged | None | Dashboard read, Step 4 | Crawler Hints actively helps crawlers discover fresh content |
| Transform / Redirect / Page rule families | Redirect 0, URL Rewrite 0, Configuration 0, Origin 0, Request Header Transform 0, Cache Response 0, Custom Error 0, Compression 0, Snippets 0, Page Rules 0 | Unchanged (all zero) | None | Dashboard read, Step 4 | No rule rewrites, redirects or filters requests by client, geography or agent |
| Response Header Transform Rules | 3 rules: (1) remove-logging — removes NEL + Report-To headers on all requests; (2) API CORS — `Access-Control-Allow-Origin: *` for the api + uat-api hosts; (3) CSP for apex + www, mirroring the repository `_headers` CSP | Unchanged | None | Dashboard read, Step 4 | The CORS rule opens the API to any origin; the CSP is a browser-side resource policy and does not restrict retrieval of the pages themselves |
| Workers Routes | islam.museum/* and www.islam.museum/* → Worker islam-museum-site; UAT Worker attached via the custom domain uat.islam.museum (not a route) | Unchanged | None | Dashboard read, Step 4 | Routes send all public traffic to the production Worker reviewed below |
| Production Worker source (workers/site: index.js 124 lines + route.js 191) | No access restrictions in code: no user-agent/bot checks, no country/ASN/IP logic, no rate limiting or counters, no KV/Durable-Object throttling, no auth, no cookie requirements, no custom 403/429/503. Behaviour: canonical/alias 301 redirects from `_redirects`, `_headers` applied (including `Access-Control-Allow-Origin: *`), language pages served from R2, everything else from Pages assets, localised 404 pages (never cached) | Unchanged | None — review only | Source read, Step W snapshot | The application layer itself imposes no discrimination between clients |
| SSL/TLS | Mode Full; Always Use HTTPS ON; HSTS ON (max-age 1 month, no includeSubDomains, no preload); Minimum TLS 1.2; TLS 1.3 ON; Opportunistic Encryption ON | Unchanged | None | Dashboard read, Step 4 | Baseline transport security retained; Minimum TLS 1.2 is the one client-capability floor, kept as essential security |
| Network / Speed | HTTP/2 ON; HTTP/2 to Origin ON; HTTP/3 OFF; IPv6 ON; WebSockets ON; Onion Routing ON; gRPC OFF; Rocket Loader OFF; Polish OFF; Speed Brain OFF; Early Hints OFF | Unchanged | None | Dashboard read, Step 4 | HTTP/3 being off is a performance option, not an access rule — it denies no client; nothing content-rewriting is enabled |
| Repo robots.txt — Content-Signal line (`site/public/robots.txt`, served at islam.museum/robots.txt) | `Content-Signal: ai-train=no, search=yes, ai-input=no` — the one clear content restriction found, and it is **repository-authored, not Cloudflare-prepended** (live file matches the repo file; dashboard category policies are all Allow, so the no/no values live only in this line) | `Content-Signal: ai-train=yes, search=yes, ai-input=yes` (merged — see "State of the two changes") | Repository change prepared entirely through the GitHub API (local git in the audit clones was avoided after a security flag on fetched repo content; the founder chose the API route): one-line change to `site/public/robots.txt` plus the CANARY.md entry in the same commit, branch `fix/robots-content-signal`, commit `20f32c850a546562a05f578a3775b36874858733`, opened as PR #8189 | Content verified against origin/main via the API before and after blob creation (exactly one line differs; insertion-only CANARY change asserted in the apply script). Verified on origin/main after the merge (the line now reads `ai-train=yes, search=yes, ai-input=yes`). Live verification is pending: the change takes effect only at the founder's next manual deploy; until then the live robots.txt still shows the old line | The old signals contradicted the founder policy and the museum's own CC0 data licence: AI training and AI input (retrieval) are welcome. A related earlier proposal exists in the repo at `docs/decisions/inbox/content-signal-flip.yaml`; the decision ledger was not touched by the PR |
| Repo robots.txt — graph-explorer Disallow lines | `Disallow: /{ar,en,ur,fr,es}/graph/?` for query-string variants of the graph explorer (repo comment: crawlers fetched ~100,000 identical copies of one page per language via `?from=` links) | Unchanged | None | Live robots.txt read (200, 480 bytes), Step 1 | Duplicate-content control only: the bare /graph/ pages in all five languages stay crawlable; no content is withheld |
| UAT environment (uat.islam.museum) | Its robots.txt is `User-agent: * Disallow: /`, and the UAT Worker adds `X-Robots-Tag: noindex,nofollow` to every response (`ROBOTS="disallow"` exists only under `[env.uat.vars]` in wrangler.production.toml; the production environment does not set it). The 76 content-signal "violations" in 7d were crawlers hitting UAT | Unchanged — restriction retained, scoped to UAT only | None | Worker source review (Step W) + Signals page read (Step 2) | UAT is a non-public test environment; keeping crawlers out of it is intentional and does not touch any public content |
| Security Analytics / traffic monitoring | Passive event and traffic statistics collected (e.g. 7d: 8.27M requests, 274 mitigated — all Browser Integrity Check class; suspicious activity 0) | Unchanged — retained | None | Dashboard read, Step 3 | Passive monitoring only: it observes and reports; after the Browser Integrity Check change it no longer feeds any blocking on public content |

## Classification of findings

| # | Finding | Classification |
|---|---|---|
| 1 | DNS configuration (14 records) | Already unrestricted |
| 2 | Bot Preference Sync ON (synced preferences are all-Allow) | Already unrestricted |
| 3 | Markdown for Agents ON | Already unrestricted |
| 4 | Under Attack Mode OFF | Already unrestricted |
| 5 | AI Crawl Control global defaults (Search / Training / Agents / personal agents / unlisted) all Allow | Already unrestricted |
| 6 | All 33 named crawlers Allow; 0 Block; 0 Charge; no pay-per-crawl | Already unrestricted |
| 7 | "Redirects for AI Training" ON (canonicalisation, content still served) | Already unrestricted |
| 8 | Blocked-crawler 403 response configured but never triggered | Already unrestricted |
| 9 | Super Bot Fight Mode: verified bots allowed, definitely-automated = Allow, JS Detections OFF, static resource protection OFF | Already unrestricted |
| 10 | AI Labyrinth OFF | Already unrestricted |
| 11 | WAF custom rules: none (0/20) | Already unrestricted |
| 12 | WAF rate-limiting rules: none (0/2) | Already unrestricted |
| 13 | Managed Ruleset / OWASP / Leaked Credentials Check OFF (dashboard "Critical" recommendation to enable declined) | Already unrestricted |
| 14 | **Browser Integrity Check ON → OFF** | **Restriction removed** |
| 15 | Challenge Passage: one global 30-min configuration, never triggered | Already unrestricted |
| 16 | Hotlink Protection OFF | Already unrestricted |
| 17 | Email Address Obfuscation OFF | Already unrestricted |
| 18 | Schema Validation ON with 0 endpoints (inert) | Already unrestricted |
| 19 | Web Assets Protection: no operations, 0 endpoints | Already unrestricted |
| 20 | IP Access Rules: none | Already unrestricted |
| 21 | Account Lists: none in use | Already unrestricted |
| 22 | Zone Lockdown: none | Already unrestricted |
| 23 | User-agent blocking rules: none | Already unrestricted |
| 24 | Access / Zero Trust: not set up on any islam.museum hostname | Already unrestricted |
| 25 | Cache Rules (2) + cache settings (Tiered Cache, Always Online, Crawler Hints) | Already unrestricted |
| 26 | Ten rule families (Redirect, URL Rewrite, Configuration, Origin, Request Header Transform, Cache Response, Custom Error, Compression, Snippets, Page Rules) all at zero | Already unrestricted |
| 27 | Response Header Transform Rules (3: header hygiene, open API CORS, browser-side CSP) | Already unrestricted |
| 28 | Workers Routes (apex + www → production Worker) | Already unrestricted |
| 29 | Production Worker source: no access restrictions of any kind | Already unrestricted |
| 30 | HTTP/Network DDoS protection always active | Mandatory Cloudflare protection |
| 31 | Minimum TLS 1.2 (with Full TLS mode, Always HTTPS, HSTS, TLS 1.3) | Mandatory Cloudflare protection |
| 32 | Security Analytics and traffic statistics | Passive monitoring retained |
| 33 | **Repo robots.txt Content-Signal ai-train=no / ai-input=no → yes / yes** | **Requires repository changes** (PR #8189, merged 24 November 2026) |
| 34 | Repo robots.txt graph-explorer query-string Disallow lines (bare /graph/ pages crawlable) | Already unrestricted |
| 35 | UAT robots `Disallow: /` + noindex headers, scoped to the UAT test environment only | Restriction narrowed to protected resources |
| 36 | Any audited feature unavailable on the zone's Pro plan | Not available on current plan — **none identified**; every audited control was present and readable on the current plan |
| 37 | PR #8189 CI result and post-deploy live state of robots.txt | Requires further investigation — PR #8189 merged 24 November 2026 (merge commit `5c308e57308e2135bca7a52dee12ee58ef794765`); final confirmation needs the founder's next deploy, then a live re-read of islam.museum/robots.txt |

## Aggregate counts

- Areas inventoried across the five snapshots: **37 findings** (table above).
- Named AI crawlers: **33 listed — 33 Allow, 0 Block, 0 Charge**. Global category defaults: **4 of 4 Allow** (Search, Training, Agents, personal agents), plus Allow as the default for unlisted crawlers.
- WAF: **0** custom rules (of 20 slots), **0** rate-limiting rules (of 2 slots), **0** managed rulesets enabled.
- Rule families at zero: **10 of 10** (Redirect, URL Rewrite, Configuration, Origin, Request Header Transform, Cache Response, Custom Error, Compression, Snippets, Page Rules). Response Header Transform: **3** rules, all benign/open.
- IP Access Rules **0**; account Lists **0** in use; Zone Lockdown **0**; UA-blocking rules **0**; Access applications on islam.museum hostnames **0**.
- Active restrictions on public content found: **2** — Browser Integrity Check (dashboard) and the robots.txt Content-Signal line (repository).
- Observed blocking before changes: **71 blocks in 24h / 274 mitigated in 7d — 100% Browser Integrity Check class**; suspicious activity 0.
- AI-crawler traffic, 7d: **3.3M requests, 2.98M answered HTTP 200** (the remainder includes the UAT environment's intentional exclusions and ordinary non-200 responses — exact split unverified).
- Changes made: **2** — 1 completed and verified (Browser Integrity Check OFF), 1 in a pull request (robots.txt).
- Classification tally: Already unrestricted **29** · Restriction removed **1** · Restriction narrowed to protected resources **1** · Passive monitoring retained **1** · Mandatory Cloudflare protection **2** · Not available on current plan **0 found** (1 row recording that none was identified) · Requires repository changes **1** · Requires further investigation **1**.

## State of the two changes

1. **Browser Integrity Check — DONE and verified.** Turned OFF in the dashboard on 24 Nov 2026 (islam.museum zone only; no other setting changed). Verified two ways: the dashboard toggle read back as off after a page reload, and live curl tests showed the previously blocked class of request (a spoofed legacy-browser user agent) now returning HTTP 200, alongside default curl, GPTBot and no-agent requests at 200.
2. **robots.txt Content-Signal — MERGED, not yet live.** PR **#8189** (https://github.com/amado2k5/islam-museum/pull/8189), branch `fix/robots-content-signal`, commit `20f32c850a546562a05f578a3775b36874858733`, built entirely through the GitHub API, was merged on 24 November 2026 (merge commit `5c308e57308e2135bca7a52dee12ee58ef794765`, merged at the founder's direction without waiting for CI). The fix becomes live only at the founder's next manual deploy (merged ≠ live is the museum's standing deployment rule). Until then, the live robots.txt continues to serve the old `ai-train=no, ai-input=no` line.

## Questions from the brief

The original brief text is **not present in this audit directory** (the directory holds the five step snapshots and the audit's working files). The brief's numbered question list therefore cannot be reproduced or answered item-by-item here; the snapshot for Step 3 references the brief's §11 ("no browser-integrity enforcement on public content"), and the change set was executed against the brief's §18 verification and §22 deliverable requirements as recorded in the audit summary. Answers that the audit evidence does ground:

- **Is any crawler or bot blocked by name?** No. All 33 crawlers listed in AI Crawl Control are set to Allow; the global defaults for Search, Training, Agents and unlisted crawlers are all Allow; Super Bot Fight Mode allows verified bots and "definitely automated" traffic, with JavaScript Detections and static-resource protection off.
- **Is AI training permitted?** At the Cloudflare layer, yes (Training = Allow, no pay-per-crawl). The one dissenting signal was the repository-authored robots.txt Content-Signal (`ai-train=no, ai-input=no`); its correction, PR #8189, was merged on 24 November 2026 and becomes live at the founder's next deploy.
- **Are there any geographic, IP, ASN or user-agent restrictions?** None found: no IP Access Rules, no Lists in use, no Zone Lockdown, no UA-blocking rules, and the production Worker contains no country/ASN/IP/UA logic. The one fingerprint-based filter that did exist — Browser Integrity Check — has been turned off and the change verified live.
- **Is anything rate-limited or challenged?** No rate-limiting rules exist; Challenge Passage holds a single global configuration but no rule issues challenges; Under Attack Mode is off.
- **Is anything behind a login or Access wall?** No. Zero Trust Access is not set up, and no Access application covers any islam.museum hostname.
- **What still restricts anything at all?** Only: (a) the UAT test environment's intentional `Disallow: /` + noindex, scoped to uat.islam.museum; (b) the graph-explorer query-string Disallow lines, which block only duplicate URL variants while the bare pages stay crawlable; (c) always-on platform DDoS protection and the Minimum TLS 1.2 floor, retained as essential security; (d) the old Content-Signal line, live only until the founder's next deploy (its correction is merged on main).
- **What was changed, and how was it verified?** Two changes: Browser Integrity Check off (verified in the dashboard and by live curl tests, including a previously blocked user-agent class now returning 200); robots.txt Content-Signal (PR #8189, merged; verification of the live file pending the founder's deploy).

**Needs the brief text:** the brief's full numbered question list (17 questions per the audit summary) — each question should be answered explicitly against this report once the brief text is available; any question not covered by the grounded answers above is marked **unverified / not answerable from the snapshots alone**.

## Rollback note

Both changes are trivially reversible: Browser Integrity Check is a single dashboard toggle (previous state ON); the robots.txt change is a single line in one file, revertible by a follow-up commit restoring `Content-Signal: ai-train=no, search=yes, ai-input=no` (previous blob `4e10f2812d98edfd0bb294e76fd95bc0a0c929df`). The pre-change state of every other inventoried area is recorded in the five step snapshots in this directory.
