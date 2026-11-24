# islam.museum — Traffic, machine discovery and global popularity

**Evidence baseline: 24 November 2026 | Reporting window: 25 October 2026 09:12 to 24 November 2026 08:12 EST (Cloudflare PDF labels).** Referral CSVs cover 25 October–24 November inclusive; boundary days may be partial. This is a historical snapshot, not a live dashboard. Prepared from founder-supplied Cloudflare exports, screenshots and ranking downloads. Counts are rounded where the dashboard rounds them.

## 1. Public-facing executive summary

The museum serves humans and machines as an open historical knowledge resource. During the reporting window, Cloudflare reported 12.68 million pageviews and 10.51 million visits worldwide. These are edge analytics metrics, not counts of individual human visitors. Major search and AI crawlers accessed the collection; Cloudflare's AI Crawl Control screenshot reports approximately 7.35 million detected crawler requests and 6.36 million HTTP 200 responses. The museum appeared among Cloudflare Radar's global top 200,000 domains for 16–23 November 2026, and at rank 657,206 in a Tranco dataset whose ZIP member was dated 23 November. These measures describe different aspects of online discovery and must not be added or interpreted as human readership.

**Founder directive:** Welcome all forms of traffic, including humans, search engines, AI agents, crawlers, scrapers, archives and programmatic consumers. Do not block, throttle, challenge, exclude or otherwise suppress traffic as a result of this investigation. The founder states that the Cloudflare arrangement can support millions of requests without additional cost; this is not independently audited billing information. The purpose of analysis is transparency, attribution and understanding, not mitigation or traffic reduction. No access-policy changes are authorized.

## 2. Verified ranking evidence

| Provider | Observation | Date / scope | Interpretation |
|---|---:|---|---|
| Tranco | 657,206 | ZIP member timestamp 2026-11-23 22:27:28, timezone unspecified | Exact rank in supplied global list |
| Cloudflare Radar | Top 200,000 | 2026-11-16–23 | Inclusion in unordered global popularity group; exact rank unknown |

Both original files were rechecked in this session. Tranco contains 1,000,000 records, with exact row `657206,islam.museum`. Radar contains 200,000 domain records plus header `domain`; the exact domain occurs on physical line 88,103. That line number is alphabetical position, not popularity rank. Official Tranco list ID and publication date have not been independently recovered. Smaller Radar tiers have not been verified. Do not publish an exact Radar rank or a Singapore rank.

Previously reported Tranco history (verify against repo or official historical lists before marking verified):

| Date | Rank | Evidence status |
|---|---:|---|
| Oct 23 | 4,609,967 | Earlier reported observation; outside supplied top-million file |
| Nov 20 | 857,945 | Earlier reported observation |
| Nov 21 | 716,997 | Earlier reported observation |
| Nov 23 (file timestamp) | 657,206 | Directly verified |

Conditional on historical verification, improvement from Oct 23 is 3,952,761 positions (85.74% numerical reduction); from Nov 21, 59,791 positions. This is not a sevenfold increase in visitors. Tranco incorporates Cloudflare Radar among its inputs, so the rankings are not fully independent evidence. Radar DNS popularity is not an HTTP visitor counter.

Official references: [Tranco download](https://tranco-list.eu/top-1m.csv.zip), [domain API](https://tranco-list.eu/api/ranks/domain/islam.museum), [Radar domain profile](https://radar.cloudflare.com/domains/domain/islam.museum), [Radar top 200k download](https://radar.cloudflare.com/charts/LargerTopDomainsTable/attachment?top=200000), [Radar rankings documentation](https://developers.cloudflare.com/radar/).

## 3. Worldwide visitor analytics

Source E1, pp. 1–4. Pageviews 12.68M; visits 10.51M; approximate pageviews/visit 1.21. Cloudflare's visits metric is not a session or unique-human count. Earlier 24-hour dashboard screenshots reported 384,630 unique visitors (Cloudflare metric), 1.33M requests, 634,110 visits and 38.18 GB; these are a separate time window and must not be summed with monthly totals. Unique IP counts for the month are not provided.

| Country | Pageviews | Approx. global share |
|---|---:|---:|
| United States | 7,590,000 | 59.9% |
| Singapore | 1,350,000 | 10.6% |
| Brazil | 566,860 | 4.5% |
| Canada | 303,340 | 2.4% |
| China | 291,820 | 2.3% |
| Germany | 196,230 | 1.5% |
| Argentina | 139,010 | 1.1% |
| France | 126,430 | 1.0% |
| Finland | 91,200 | 0.7% |
| Bangladesh | 89,740 | 0.7% |

US and Singapore combined: approximately 70.5%. Client country is attributed by IP, not nationality or ultimate AI user's location. Cloudflare edge data center is a different dimension.

### Worldwide clients and content

Desktop 12.29M (~96.9%), mobile 384,600, tablet 4,870. Browser categories: unknown/others 7.09M, Chrome 3.54M, Firefox 585,460, AppleBot 462,440, curl 244,570, BingBot 185,310, Edge 175,760, GoogleBot 160,420, ChromeMobile 91,020, YandexBot 48,860. Unknown OS 7.57M, macOS 2.73M, Windows 1.92M, Android 274,090, Linux 119,510, ChromeOS 38,150, iOS 30,450. Unknown does not mean bot; normal browser identities do not guarantee humans.

Top graph pageviews: Arabic 257,820; Urdu 230,210; English 206,730; French 6,830; Spanish 6,460. Combined 708,050. Homepage 41,090; `/en/` 5,010; `/ar/` 2,100; `/fr/` 1,880; English search 1,260. Hosts: apex 8.12M, www 4.39M, UAT 161,860. No-referrer pageviews 10.19M (~80.4%); internal apex 1.20M, www 1.16M; Google 114,490; mobile Facebook 6,780; Facebook 420; www Facebook 260; Instagram 240; Bing 200.

Top network pageviews: Amazon (two ASNs) 2.15M and 971,410; Microsoft 1.39M; Alibaba 790,330; Apple 462,450; Facebook 440,970; Tencent 394,990; Google Cloud 372,830; Oracle 354,540; Cloudflare 345,690. This indicates extensive technology infrastructure activity, not the identity or intent of every customer of these networks.

## 4. Country and network request analytics

Sources E2–E6. Request metrics include assets, API calls, redirects and other non-pageview traffic; do not compare them as if they were pageviews. Singapore request subtotal below covers two ASNs only.

| Metric | US | Canada | SG Alibaba 45102 | SG Tencent 132203 |
|---|---:|---:|---:|---:|
| Requests | 10.86M | 365,990 | 1.02M | 1.87M |
| Visits | 6.53M | 283,280 | 768,930 | 373,220 |
| Transfer | 278.72 GB | 25.38 GB | 24.26 GB | 12.66 GB |
| Cache hit rate | 10.26% | 14.25% | 3.41% | 17.48% |
| 5xx rate | 0.03% | 0.00% (rounded) | 0.08% | 0.02% |
| p95 edge TTFB | 355 ms | 287 ms | 721 ms | 624 ms |
| 301 responses | 1.27M | 8,100 | 120,940 | 767,260 |
| API host requests | 1.03M | 7,490 | 118,340 | 713,070 |

Combined transfer across these non-overlapping filters: 341.02 GB. Counts and ratios derived from rounded/sampled dashboard values are approximate.

### Singapore: two dominant cloud networks

E2: 1.35M pageviews, 1.23M visits. Alibaba 772,240 pageviews, Tencent 378,200, Huawei 57,550, AWS 50,780, FiberPower 48,410, Zenlayer 13,090, unknown 11,440, Kingsoft 6,980, Datacamp 2,410, StarHub 1,050. Alibaba + Tencent ~85%; the four Chinese-associated cloud networks ~90%. Network affiliation does not establish the identity of a hosted application or location of its ultimate users.

Chrome 1.16M, Windows 800,540, macOS 389,800; desktop 1.2M, mobile 145,780, tablet 3,420. Top graph pageviews: Arabic 108,730, Urdu 104,860, English 66,990; combined 280,580 (~20.8%). Homepage 1,130. Google referrer 108,100, no referrer 1.12M. Google-referred pageviews in Singapore amount to ~94.4% of worldwide Google-referred pageviews in the matching visitor reports. This unusual pattern requires Search Console corroboration; a referrer header can be supplied by software.

**Alibaba (E3):** 898,740 HTTP 200 responses; 510 404s; 830 500s. Cache miss 696,670, expired 170,090, dynamic 118,310, hit 34,710. Graph requests Urdu 57,010, English 54,610, Arabic 54,470 (166,090 combined). Chrome 944,320, ChromeMobile 66,530, Windows 492,240, macOS 456,810. Top ten user-agent counts lie between 45,450 and 46,420; this near-uniform distribution is compatible with systematic identity rotation but not proof. Google referrer 110,730 HTTP requests; no referrer 788,230. Top ten IPs total 5,010 (~0.49%); busiest reported IP 800. This suggests dispersed activity, but adaptive sampling prevents a reliable distinct-IP count. Do not publish individual IPs.

**Tencent (E4):** 847,610 requests to `/api/v1/meta/deploy.json` (~45.3%); 767,260 redirects (~41%); 314,310 HTTP 204; 790,090 HTTP 200; 400 HTTP 500. Cache dynamic 713,050, miss 677,180, hit 324,790, bypass 91,400, expired 63,840. Graph paths with/without slash: Arabic 46,600/47,140; Urdu 39,550/38,160; English 4,690/5,000. Shell entity.js 4,880; shell.js 4,860. Internal apex referrer 1.13M; no referrer 738,670. Chrome ~1.87M; Windows 1.85M; HTTP/1.1 1.83M. Top ten IPs total ~13,220 (~0.71%); busiest ~1,350. These are not unique IP counts. Redirects, metadata checks and internal referrers suggest potential frontend-induced request multiplication; no path/status cross-tab or code reproduction yet establishes a causal link. Do not assume 204 means CORS without method data.

**Interpretation:** Distributed browser automation, content retrieval, synthetic traffic, proxy services and engineering tests remain plausible. Qwen/Hunyuan or any other specific service cannot be inferred from ASN. No confirmed Singapore social media explanation was established in the earlier search; search indexing is incomplete and private groups inaccessible. A Singapore resident using an AI service may generate requests from any region, or no fresh request at all if content is cached.

### United States (E5)

Top ASNs by requests: Amazon 2.54M and 1.28M, Microsoft 1.82M, Apple 859,830, Google Cloud 782,100, Facebook 502,360, Oracle 494,350, Colocation America 469,520, Cloudflare 353,240, Internet Archive 274,670. Top browser categories: unknown 8.87M (~81.7%), AppleBot 857,400, GoogleBot 217,950, BingBot 198,160, curl 97,590, Chrome 486,590, Edge 48,060, Firefox 37,270. No referrer 8.72M; internal www 1.17M and apex 958,550; Google 1,560. Top ten IPs collectively ~2.97M (~27.3%). Earlier IP research identified possible OpenAI, Anthropic and Perplexity infrastructure; prefer direct AI Crawl Control attribution below. Do not publish raw IPs or claim individual IP identity without current official ranges plus full user-agent verification. Internet Archive ASN activity is an archiving lead, not proof of successful preservation.

Top paths: deploy.json 172,890; English graph 44,040; Arabic graph 37,160; Urdu graph 33,100; homepage 27,890; robots.txt 20,800; favicon.svg 12,440; shell.js 12,100. Cache miss 4.45M, expired 3.99M, hit 1.05M, dynamic 1.04M, bypass 202,770. HTTP 200 9.37M; 404 205,600. High crawler activity is consistent with broad discovery of the museum's collection.

### Canada (E6)

Bell 287,290 requests (~78.5%); Rogers 14,450; Videotron 7,040; Shaw 6,830; OVH 5,910; TELUS 5,610; Cogeco 4,750; Shared Services Canada 2,730; Space Exploration Technologies 2,540; M247 2,130. Top two IP counts 156,420 and 108,540 (combined 264,960, ~72.4%); ownership not confirmed. `curl/8.7.1` 149,790 and `node` 92,260 (~66.1% combined); ChromeHeadless 7,020. UAT host 59,830 requests. These are strong signs of engineering/test traffic; correlate with founder's local public IP history and CI logs privately. No referrer 296,000; Google 150; ummah.build 40; school platform 30. Government and university-network leads do not establish institutional adoption or endorsement. Deploy.json 3,790; graph English 3,690, Arabic 3,580, Urdu 2,940. Cache miss 154,720, expired 147,730, hit 46,540. Large spikes visible in report; correlate with deployment records before asserting dates or causes.

### Engineering cross-comparison

The deployment metadata endpoint accounts for 847,610 Tencent requests, 172,890 US requests and 3,790 Canada requests (1,024,290 total across these non-overlapping filters). Relative shares ~45.3%, 1.59%, 1.04%. This is an investigation target, not a recommendation to reduce traffic. Measure the request lifecycle, routing, polling and cache behavior; no changes to frequency, access or request volume are authorized. The low error rates suggest most requests were served successfully. Cache statistics alone do not establish origin cost or billing.

## 5. AI Crawl Control: operator-level evidence

Source E7: founder dashboard screenshot; figures below transcribed in the preceding investigation, rounded; Devin should recheck screenshot labels before publication. Approximately 7.35M detected crawler requests; 6.36M HTTP 200; 138K referrals. Perplexity HTML transfer 46.17 GB. Deployment metadata endpoint on API host: 135,920 successful detected crawler requests. These figures overlap with country reports and must not be added to them.

| Operator | Allowed crawler requests (approx.) | Referrals (operator view) |
|---|---:|---:|
| Perplexity | 1,810,000 | 40 |
| OpenAI | 1,600,000 | 70 |
| Anthropic | 1,240,000 | 0 |
| Apple | 855,000 | 0 |
| Amazon | 660,170 | 0 |
| Meta | 304,780 | 19,850 |
| Google | 222,580 | 117,450 |
| Microsoft | 198,100 | 500 |
| Internet Archive | 188,560 | 0 |
| ByteDance | 54,970 | 10 |

Top three ~4.65M allowed requests. PerplexityBot total ~1.84M. These are detected requests, not unique documents, completed training runs or AI answers. Search indexing, training-related crawling, archival retrieval and user-directed fetches require separate crawler classifications. Do not claim training inclusion, endorsement or partnership. Obtain detailed crawler and category exports to distinguish GPTBot/OAI-SearchBot/ChatGPT-User, ClaudeBot/Claude-SearchBot/Claude-User, PerplexityBot/Perplexity-User and other agents. Zero reported referrals is not proof of no downstream readership.

## 6. Referral CSV analysis (directly recalculated)

E8 and E9: 31 date rows each. Source export totals 138,220 across 20 columns; destination export totals 71,230 across 17 path groups. These are different export coverages; do not force reconciliation or divide destination groups by the source total. Cloudflare's AI Referral Traffic grouping includes ordinary search/social referrers, not solely AI answers.

| Exact referrer | Count |
|---|---:|
| www.google.com | 117,370 |
| m.facebook.com | 18,300 |
| facebook.com | 760 |
| instagram.com | 290 |
| www.facebook.com | 280 |
| bing.com | 240 |
| m.baidu.com | 220 |
| l.facebook.com | 210 |
| www.bing.com | 210 |
| duckduckgo.com | 80 |
| chatgpt.com | 60 |
| myactivity.google.com | 50 |
| ntp.msn.com | 40 |
| www.perplexity.ai | 40 |
| mail.google.com | 20 |
| ads.openai.com | 10 |
| cn.bing.com | 10 |
| lm.facebook.com | 10 |
| google.com | 10 |
| www.tiktok.com | 10 |

Grouped totals: Google 117,450; Meta 19,850; Microsoft 500; Baidu 220; DuckDuckGo 80; OpenAI 70 (60 ChatGPT + 10 ads); Perplexity 40; TikTok 10. Direct referrals are consistent with link-following, but not necessarily unique humans, AI answer citations or independent discovery. Founder testing and ads may contribute. Keep paid ads separate from organic referrals.

| Destination group | Count |
|---|---:|
| /ur/* | 19,380 |
| / | 19,300 |
| /ar/* | 18,480 |
| /en/* | 13,470 |
| /en | 180 |
| /_astro/* | 90 |
| /api/* | 90 |
| /favicon.ico | 40 |
| /shell/* | 40 |
| /media/* | 40 |
| /es/* | 30 |
| /brand/* | 30 |
| /fr/* | 20 |
| /favicon.svg | 20 |
| /ar | 10 |
| /apple-touch-icon.png | 10 |


### Referral waves

Google peaked at 18,420 on Oct 29, with a sharp decline in early November. The earlier worldwide/Singapore visitor reports show the large Singapore concentration; verify independently against Search Console. Mobile Facebook grew from 270 on Nov 16 to 5,890 on Nov 22, 4,350 on Nov 23 and 1,620 on partial Nov 24. Screenshot-based Meta destination analysis reported 19,280 homepage referrals; verify screenshot before publishing. Possible sharing, ads, automated previews, browser automation or synthetic referrer activity; virality is not established. No specific public post has been linked to the surge.

## 7. Evidence strength and remaining questions

| Finding | Confidence / limitation |
|---|---|
| Rank 657,206; Radar top 200k | Direct file verification |
| Country and network volumes | Direct dashboard exports; rounded/sampled |
| Major crawler operators access museum | Dashboard classification; specific crawler purposes require breakdown |
| Singapore cloud concentration | Direct ASN aggregates |
| Distributed automation | Strong circumstantial evidence; not exact distinct IP count |
| Canadian internal engineering | Strong circumstantial evidence; IP ownership unconfirmed |
| Tencent frontend amplification | Hypothesis; reproduce and cross-tab |
| AI answer citations, training inclusion | Not established by crawler requests |
| Human readership and unique people | Not quantified |
| Organic Google or Facebook surge | Referrals measured; origin and authenticity unresolved |
| Singapore ranking | Not verified |

## 8. Follow-up investigation (read-only)

Obtain crawler/category CSVs; Google Search Console clicks, impressions, countries, pages and queries; Facebook/Google referrer-filtered request reports; Tencent deployment-path cross-tab by method, status, host and time; full user-agent strings and verified bot classifications; private distinct-IP counts where existing plan supports them. Correlate with git and CI history and existing test infrastructure. Investigate frontend lifecycle with controlled ordinary browser sessions, without altering request behavior. Use existing logs only; no paid service or security change. Pseudonymize client identifiers; publish aggregate statistics only. Do not enable extra telemetry that compromises the privacy policy.

## 9. Evidence manifest

The files are founder-supplied, not independently authenticated downloads from the private dashboard. Public sources should link to provider methodology; private exports cannot be publicly reproduced without authorization. Keep PDFs/screenshots containing account identifiers or raw IPs private. Recheck all screenshot transcription before release.

| ID | Source | Scope |
|---|---|---|
| E1 | Worldwide Visitors PDF, 4 pp. | Global pageviews, clients, countries, refs, ASNs |
| E2 | signapore.pdf, 4 pp. | Singapore Visitors |
| E3 | alibaba.pdf, 5 pp. | Singapore Requests AS45102 |
| E4 | tencent.pdf, 5 pp. | Singapore Requests AS132203 |
| E5 | unitedstates.pdf, 6 pp. | US Requests |
| E6 | canada.pdf, 6 pp. | Canada Requests |
| E7 | AI Crawl Control screenshot 2026-11-24 08:33:53 | Operator overview |
| E8 | ai-zone-islam.museum-referrals-sources-chart-2026-11-24.csv | Exact referrer time series |
| E9 | ai-zone-islam.museum-referrals-destinations-chart-2026-11-24.csv | Destination time series |
| E10 | top-1m.csv (1).zip | Tranco rank |
| E11 | cloudflare-radar_top-200000-domains_20261116-20261123 (1).csv | Radar tier |
| E12 | Four AI referral PNG exports | Supplementary dashboard views |

Verified SHA-256 (original bytes):

- E8: `68d53c5c1357c31d3ee895a4251fd26e828e6ff00a1df33117009aa10e94306c`
- E9: `95c4f99d38012660bfce3609e413af947b884a94355f65812ac0ad55d6bd71b6`
- E10: `b812c6edbe5dd264c7a804de9546549b961fe176ad9be10a8a8f3ba90f7bc54c`
- E11: `f2d0f86685ae0e4091ccc440db45432129c8b012fb6b1fea4fa0a386bfd3ea06`

Provider reference: [AI Crawl Control analytics](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/). Recheck current methodology and supported exports when implementing. Do not put raw logs, account IDs, personal IPs or authentication secrets in the public repo.
