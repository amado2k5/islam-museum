# 11 · Assessment — how this project rates against world-class work

An honest scorecard. The comparators are the best public knowledge projects
in the world — Wikidata/Wikipedia, Europeana, Pleiades (the ancient-world
gazetteer), Sefaria, the Met/Rijksmuseum open-access programs, MDN, and
Quran.com — not other hobby sites, because the charter aims that high.

Ratings: ⭐ 1–5. **5 = matches or beats the best public example.**
"World-class" here means *best achievable practice for the category*, and
category matters: this is a zero-budget, one-founder, agent-built project,
so several ratings are given *for its class* with an absolute note where the
gap is structural.

## Summary table

| Dimension | Rating | One-line verdict |
|---|---|---|
| Architecture | ★★★★★ | Graph-in-git + fully static + no runtime AI is genuinely exemplary — the same bet Wikidata and modern docs infra made, executed cleanly |
| Data structures / content model | ★★★★½ | EDTF+Hijri, predicate registry with computed inverses, immutable IDs + aliases, perspectives structure — near Pleiades/Wikidata rigor; held back by unverified enrichment depth and some unreviewed modelling |
| Testing | ★★★★ | Executable editorial policy (validator) is rarer and better than most institutional sites; unit coverage is thin outside pipeline/invariant tests and there are no content-correctness tests (by design) |
| Deployment | ★★★★ | Cost-aware, manifest-diffed, rollback-capable — but manual founder-only deploy is a single point of failure and a cadence limit |
| Performance | ★★★★½ | Everything precomputed, chunked immutable search, no-JS readability, Lighthouse on the RTL case — only unproven-at-10× scale keeps it from 5 |
| Security & privacy | ★★★★ | Tiny attack surface, executable privacy audit, attribution trail; no independent audit, and agent-self-merge is a trust trade-off |
| Documentation | ★★★★★ | Plan docs + ADRs + change gates + status/coverage as living files — better than most funded projects |
| Governance & sustainability | ★★★ | Clear gates and lanes, but one human deploy key, one Mac, one disk |
| Editorial correctness (content quality) | ★★★ (for its class) | Enormous draft corpus with provenance; 0% human-reviewed is the honest state — the structure is right, the review mass is the remaining work |
| Accessibility & i18n | ★★★★ | RTL-first, no-JS, AA targets, trilingual from day one — rare; full audit unproven |

**Overall: ★★★★ — world-class architecture and process; the gap to 5 is
reviewed-content mass, redundancy, and independent verification, not design.**

---

## 1. Architecture — ★★★★★

**Comparators:** Wikidata (graph in a DB + dumps), Europeana (graph in a
triple store), MDN/Yari (content in git, static build), Pleiades (git +
static).

**Why 5:**

- *Graph-in-git* (ADR 0001) matches the trajectory the field is converging
  on: MDN moved content to git; Pleiades version-controls its gazetteer;
  Wikidata offers complete git-like history via dumps. islam.museum gets
  blame, review and rollback on every **fact**, which even Wikidata can't
  do in one diff (item history ≠ cross-entity review).
- *No runtime compute* (ADR 0002) is stricter than Europeana or the Met
  (both run APIs + search backends) and is the reason security, cost and
  durability scores are high simultaneously — one decision, three wins.
- The pipeline (`validate → graph → derive → build → pagefind → api`) is a
  textbook modern static-data architecture: single compiled graph artefact
  feeding site, API and coverage — the same pattern OWID and large docs
  sites use.
- Separating pagefind/API to R2 while HTML goes to Pages is a thoughtful
  answer to a real platform limit (file counts), not a workaround smell.

**What's missing / what would be even better:**

- No formal published schema for `api/v1` consumers (versioned contract doc
  + changelog) — Wikidata's API stability guarantee is the bar.
- `.cache/graph.json` is not a published artefact; external consumers
  rebuild it themselves. Shipping it on R2 would make the graph itself a
  product (like Wikidata's RDF dump).

## 2. Data structures & content model — ★★★★½

**Comparators:** Wikidata's entity model, CIDOC-CRM (the museum standard),
Pleiades' place model, Sefaria's text-addressing scheme.

**Strengths vs. comparators:**

- **Dual-calendar dating** (EDTF + Hijri + calendar + precision + `derived`
  flag) is *better than Wikidata*, where Hijri modelling is a perennial
  pain point, and matches scholarly practice better than most museum
  systems.
- **Immutable `class/slug` + alias redirects** reproduces Wikidata QID
  stability with human-readable IDs — arguably a better URL product.
- **Predicate registry with computed inverses** enforces single-source
  edges; Wikidata permits inconsistent symmetric claims.
- **`perspectives` block with enforced ordering and labelling** is a
  structured-neutrality mechanism that Wikipedia achieves only socially
  (NPOV policy), and that CIDOC-CRM doesn't address at all.
- **Qur'an referenced by `sura:aya` against frozen, hash-verified text** —
  exactly the Sefaria/Quran.com pattern, with a stronger integrity check
  (byte-for-byte re-verification every build).

**Why not 5:**

- Wikidata's interlinking depth (sitelinks, tens of thousands of external
  ID properties) is far ahead; `external_ids` exist but coverage is early.
- Some modelling (themes, story_roles) is young and unreviewed at scale;
  Pleiades' advantage is 15+ years of editorial refinement.
- No formal ontology alignment/mapping to CIDOC-CRM or Wikidata — a stated
  export/mapping layer would make the model interoperable rather than
  merely excellent.

## 3. Testing — ★★★★

**Comparators:** Wikipedia's community + ORES review (social, huge),
Wikidata constraint violations (bot-reported, not blocking), MDN CI
(content lint + build), government/museum CMSs (mostly manual QA).

**Why 4 — genuinely strong:**

- The **validator is the standout**: schema + EDTF + link resolution +
  licence whitelist + honorifics + perspectives ordering + **byte-for-byte
  Qur'an verification** — this is *executable editorial policy*. Very few
  institutions enforce content rules in CI at all; Wikidata's constraint
  reports are advisory, this repo's are blocking. On this specific axis the
  project is arguably ahead of every comparator.
- Vitest suite (95 tests at last run) pins the important invariants:
  Hijri anchors, scope-ordering rules, language requirements, tension-card
  rules, tour/kids/cards data integrity.
- Lighthouse CI on the **Arabic** pages is a mature RTL-first testing
  instinct; the new education wing adds `check:weight` — per-route
  HTML/JS byte budgets enforced in the build, fix-by-removing-weight — a
  discipline most funded sites don't have.
- Deploy path has dedicated test workflows (`r2-sync-test`, `r2-html-test`,
  `r2-secrets-check`) — testing the plumbing, not just the product.

**Why not 5:**

- Unit coverage of site components/islands is thin — most tests target
  data/pipeline. A few rendering smoke tests (page anatomy, RTL snapshot)
  would catch layout regressions CI currently can't.
- No link-check on external citations, no visual regression testing
  (Percy/Chromatic-class tooling), no fuzz/property tests on the
  converters beyond fixed anchors.
- Test runtime is already ~20 min on a contended machine — the suite will
  need sharding or sampling as the corpus grows.

## 4. Deployment — ★★★★

**Comparators:** MDN/MDN-yari (fully automated deploy on merge), Wikipedia
(continuous deploy train), small-institution static sites (manual FTP —
the sad baseline).

**Why 4:**

- The R2 manifest-diff sync (upload only changed chunks, skip entirely on
  no content diff) is *better engineering than most deploy pipelines* — it
  treats a 60k+ object bucket correctly instead of brute-forcing it.
- Rollback story is real: revert PR + redeploy, plus CF Pages deployment
  history, plus a GitHub Pages fallback mirror.
- Secrets are minimal, scoped, and deploy workflows have their own test
  path.

**Why not 5:**

- **Manual, founder-only deploys** are a deliberate cost decision but a
  genuine bus-factor and freshness limit — world-class ops would have a
  scheduled or merge-triggered deploy with the same cost gates. A cheap
  compromise: a weekly scheduled dispatch the founder can pause.
- No staging/preview environment per PR (CF Pages preview deploys are the
  standard answer and are free).
- No automated post-deploy smoke test (the checklist in
  [06](06-deployment.md) §7 is manual).

## 5. Performance — ★★★★½

**Comparators:** Wikipedia (world-class edge infra, but a live backend),
MDN (static + CDN), Quran.com (JS-heavy SPA — a cautionary comparator).

**Why 4.5:**

- The fundamental play — *precompute everything* — is the strongest
  possible performance architecture: edge-cached HTML, immutable
  content-addressed search chunks, static JSON API, zero-JS readability.
- Pagefind with per-language chunked indexes and the passage exclusion
  (−44% chunks) shows real measurement-driven tuning, not defaults.
- MapLibre+PMTiles over range requests and build-time AVIF/WebP are the
  current best practice for free/cheap media delivery.
- Lighthouse budget enforced on RTL pages — the hard case, not the easy one.

**Held back from 5:**

- Unproven at 10× corpus: ~36k entities is fine; 300k pushes build time,
  pagefind index size and CF Pages file counts toward their documented
  limits. The escape hatches exist (D1 FTS5, R2 HTML) but aren't exercised.
- No field/Real-User measurement (only lab Lighthouse); cookieless RUM
  (e.g., CF Web Analytics vitals) would close the loop.

## 6. Security & privacy — ★★★★

**Comparators:** typical institutional CMS (login surface, plugins — far
worse), Wikimedia (huge professional security program — far better funded).

**Why 4:**

- The attack surface is nearly zero: no accounts, no forms, no PII, no
  runtime code — security through absence, which beats security through
  effort.
- `check-static.ts` makes the privacy posture *executable* — most sites
  assert privacy; this repo tests it.
- Deliberately disabled platform features (NEL, email obfuscation) show the
  team audits what the platform injects — a level of care beyond most
  funded sites.
- Provenance blocks + attribution trailers give per-fact and per-commit
  accountability that even Wikidata only partially matches.

**Gaps:**

- No independent security review or `SECURITY.md`-style disclosure policy
  review of the agent-merges-own-PR trust model.
- `main` protection + self-merge relies on executable gates; a compromised
  agent credential could merge bad-but-valid content. Mitigation exists
  (everything lands as `draft`, deploy is manual) — the control is real
  but worth stating as residual risk.
- No dependency update automation (Dependabot/renovate) mentioned —
  pinned-lockfile-only drifts stale.

## 7. Documentation — ★★★★★

22 numbered plan docs + ADRs + agent workflow docs + change gates + living
status/coverage + this engineering set. Most *funded* projects don't have a
written content model, an editorial policy, an AI-provenance policy, and a
claims register for filed submissions. Comparable only to Wikimedia's
policy corpus — and this is tighter and more consistent.

## 8. Governance & sustainability — ★★★

The weakest structural dimension, honestly stated:

- Bus factor ≈ 1: one deploy key, one Mac, one external drive holds the
  entire harvest (raw dumps + DuckDB + models). The *repository* would
  survive the founder; the *harvest capability* would not.
- `GOVERNANCE.md` exists; succession/backup-of-workspace does not. Fix: a
  documented harvest-bootstrap (plan 15 already covers setup), plus a
  second seeded drive or a documented "harvest state in N commands" runbook.
- Agent-lane governance (proposals, no-go registry, submission labels) is
  *ahead* of most projects — multi-agent governance is a problem almost
  nobody else has solved in writing.

## 9. Editorial correctness — ★★★ (for its class)

- ~36k entities / ~68k prose files, essentially all `draft` — the pipeline
  produces volume faster than humans can review. This is the same phase
  Wikipedia was in circa 2002–2004 (before critical mass of editors) and
  is honestly declared everywhere.
- The *mechanisms* for correctness (two-sources-or-flag, perspectives,
  provenance, byte-verified scripture) are stronger than Wikipedia's at
  equivalent age; the *evidence* of correctness (mass review) is the work
  that remains.

## 10. Accessibility & i18n — ★★★★

- Arabic-first with RTL as structure (logical CSS, Arabic font preload,
  honorifics rendered by UI) puts it ahead of most bilingual heritage
  sites, which bolt Arabic on.
- No-JS readability + AA targets + alt text enforced per published
  language is WCAG-serious.
- Missing: a real screen-reader/keyboard audit pass, and the trilingual
  coverage is young (en/ur prose still catching up to ar).

## Where it clearly beats the field

1. **Executable editorial policy** — nobody else lint-checks neutrality
   structure, honorifics and scripture bytes in CI.
2. **$0 marginal cost at real scale** — Europeana spends millions to serve
   a smaller-per-object collection.
3. **Multi-agent authorship governance** — proposals, lanes, attribution
   trailers: genuinely novel, documented, working.
4. **Hijri-first dating** — the only major knowledge project where the
   Islamic calendar is native rather than derived metadata.

## Honest remaining work (priority order)

1. **Human review throughput** — everything else is scaffolding for this.
   A review UI/queue, reviewer tooling, and "verified %" as a headline
   metric would convert draft mass into museum mass.
2. **Redundancy for the harvest workspace** — the one thing that isn't in
   git and can't be re-downloaded quickly is the derived DuckDB + filtered
   layers + briefs.
3. **Deploy automation with a kill switch** — scheduled dispatch preserves
   the cost model while removing the daily manual step.
4. **PR preview deploys** — free on CF Pages, transforms review of site and
   content changes.
5. **API versioning contract + published graph artefact** — turns `api/v1`
   from output into product.
6. **Field performance data** — enable web-vitals in CF Web Analytics.
7. **Dependency hygiene** — Dependabot + a periodic lock refresh lane.
8. **External link-check + visual regression tests** — the two test gaps.
