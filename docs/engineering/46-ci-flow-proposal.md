# 46 · CI flow proposal: a fast answer for pull requests (November 2026)

**Status: proposal, awaiting the founder's approval.** Nothing in it is implemented. It covers the open items 7.1, 7.2 and
7.3 of [45 · Build and deploy review](45-build-deploy-review.md) and follows `docs/ai-change-gates.md` section 1.

**Risk label: `non-impacting`** (section 3 of the gates). It changes when and how checks run. It changes no page, no
record, no licence, no hosting, no API route and no document a submission links to. A full build of `main` produces the
same bytes as today. `deploy.yml`, `deploy-uat.yml` and `deploy-env.yml` are not touched, and no deploy is started.

## 1. What is wrong today (measured 13 November 2026)

| | Measured | Source |
|---|---|---|
| A pull-request run, after the speed work of pull request 6496 | 54 to 89 minutes | the 14 Validate runs finished since 10:34 UTC, for example 43429462820 (71 min), 43420881696 (54 min), 43411639148 (89 min) |
| The same, before it | 184 to 279 minutes | runs 43354836756 to 43358710635 |
| Result of the last 100 pull-request runs | 0 passed, 25 failed, 68 cancelled, 7 running | `gh run list --workflow=validate.yml` |
| Where the time goes in one run (43429462820) | build 54 min, `check:static` 4 min, link check 11 min, axe 1.5 min; unit tests 7 min in parallel | step timings |
| Builds of `main` waiting | 8 pending behind 1 running, the oldest pushed 1 h 40 min earlier | `gh run list --workflow=build.yml`, 14:20 UTC |

Three more facts found while measuring:

1. **Every pull request is red today for a reason that is not its own.** All 14 runs since 10:34 UTC fail at the axe step
   with the same finding: `/en/` has a `label-content-name-mismatch` (a control whose accessible name does not contain its
   visible text). `main` does not run axe, so nobody was told. It is not fixed here (section 6).
2. **`validate` already checks for U+FFFD, and still missed the one of 12 November.** The check walks every text field
   except four keys it skips on purpose for other rules: `text`, `text_search`, `provenance` and `id`
   (`textFields` in `scripts/validate.ts`). The broken letter was in the `text` of `passage/tirmidhi-api-767`.
3. **The full link check, axe and Lighthouse run only on pull requests.** `build.yml` does not run them. So today nothing
   checks the links of `main` unless a pull-request run reaches that step, and none has for days.

Where the render time goes (build run 43425447215, 202,274 pages, 1,400 s of rendering):

| Template | Pages | Time |
|---|---|---|
| `[lang]/[class]/[slug].astro` (entity pages) | 180,018 | 1,135 s |
| `[lang]/words/hadith/[work]/[kitab].astro` | 6,654 | 105 s |
| The other 195 templates together | 15,602 | about 160 s |

Two templates are 92 % of the pages and 89 % of the time. A sample build only has to thin those two.

## 2. Change 1: a sample build for pull requests

### What a pull request builds

Every template is built in full, except the two above. Of those two, the sample builds:

- **the pinned records**: the entity pages that a check opens by name (`event/hijra` for the weight budget,
  `person/ibn-sina` for axe and Lighthouse, `passage/quran-2-255` and `passage/quran-114-6` for `check:site`). If a later
  check names a new entity page and nobody pins it, the sample run fails with "not built", so the list cannot go stale
  silently;
- **the records the pull request changed**: every `data/<class>/<slug>.yaml` and `content/<lang>/<class>/<slug>.md` in
  the diff against the base, in the three languages;
- **a fixed spread**: 100 records of each class, evenly spaced by id, so every class's layout is exercised even when the
  pull request changes only code. The same for 20 hadith chapters.

That is about 25,000 pages instead of 202,000. All 71 routes that `scripts/check-weight.ts` weighs today (46 education
routes and 25 listing routes), all browser landings, all listings and all search pages are among them, because their
templates are built in full.

### How

- `scripts/sample-routes.ts` (new): writes the list of record ids to build to `.cache/sample/ids.txt` (pins, changed
  files from `git diff --name-only <base>...HEAD`, the spread).
- `site/src/lib/sample.ts` (new): one function. With the environment variable `SAMPLE_BUILD` unset it returns its input
  untouched, so a full build is exactly what it is today. With it set, it keeps the listed ids and writes the routes it
  left out to `.cache/sample/skipped.txt`.
- `site/src/pages/[lang]/[class]/[slug].astro` and `site/src/pages/[lang]/words/hadith/[work]/[kitab].astro`: one line
  each, passing the list of nodes through that function inside `getStaticPaths`.
- `scripts/sample-stubs.ts` (new): after the checks on the real pages, writes an empty placeholder page for every
  skipped route, so the link checker sees that the page will exist. A link to a record that does not exist still fails.
- `package.json`: scripts `sample:routes` and `sample:stubs`.
- `.github/workflows/validate.yml`:
  - the `build` job sets `SAMPLE_BUILD` and runs the same steps as today on the sample: `npm run build` (validate, graph,
    derive, API export, Astro, Pagefind, `check:site`, `check:weight`, e-books), `check:static`, the link check, axe and
    Lighthouse. Checkout depth becomes 2 so the diff against the base is available;
  - the `test` job runs `npm run validate` before the unit tests, so content errors answer in about two minutes;
  - a concurrency group per pull request with `cancel-in-progress: true`: a new push to a branch stops the run of the
    older push (item 7.2);
  - a pull request labelled `full-build` builds the whole site as today, for the rare change that wants it. Strike this
    line if you do not want the label.
- `docs/site/README.md` and `docs/agents/workflow.md`: the paragraph on automated checks says what a pull request builds.
- `docs/engineering/45-build-deploy-review.md`: sections 7.1 to 7.3 point here and record the result.

### Expected time

Estimated from the step timings above; the real figure is measured on the pull request that implements this and
reported back (section 8).

| Step | Today | Sample (estimate) |
|---|---|---|
| validate, graph, derive, API export | 10 min | 10 min (unchanged) |
| Astro rendering | 26 min | 4 min |
| Pagefind | 4.5 min | under 1 min |
| `check:site`, `check:weight`, e-books, `check:static` | 9 min | 2 min |
| Link check | 11 min | 2 min |
| axe, Lighthouse | 1.5 min, then never reached | 5 min |
| **Whole `build` job** | **54 to 89 min** | **about 20 to 25 min** |
| `test` job (validate, then unit tests) | 7 to 10 min | 9 to 12 min, first answer at 2 min |

Half of what is left is the ten minutes before Astro starts, of which the API export is almost six. Skipping it in a
sample is possible but changes what the link check sees, so it is left for a later proposal.

### What a sample build cannot catch, and what covers it

| Not caught by the sample | Covered by |
|---|---|
| A record page outside the sample that fails to render, or renders a banned pattern (U+FFFD made by a template, a Hijri year 0, a footnote link with no anchor). Typical cause: a template change that breaks on a rare shape of data, or a change to record A that breaks the page of record B that shows it | `build.yml` on `main`: it renders all pages and runs `check:site` over all of them, as today |
| A broken link on a page outside the sample | **Nothing today** (fact 3 above). Proposed: a new workflow `.github/workflows/site-checks.yml` that starts when a build of `main` succeeds, downloads its artifact and runs the link check on the whole site. It reports red or green on its own and does not change which build a deploy takes. Strike it if you prefer to accept the gap |
| Two records that claim the same address | `build.yml` (Astro stops on a route collision) |
| The size of the full search index, the page count, the build time against the six-hour limit | `build.yml` |
| Sources with U+FFFD | change 2, in seconds, before any build |

What the sample covers as well as the full build does: the weight budgets, axe and Lighthouse (the same fixed routes),
every listing and browser page, every page of every changed record, and `check:static` on the code that ships.

The price is plain: the faults in the first row are found after the merge, by the build of `main`, about an hour later,
and that build fails. They are the rare kind; the three kinds that broke `main` on 12 and 13 November (weight budget,
U+FFFD in a source, failing unit test) are all caught before the merge.

## 3. Change 2: U+FFFD in the sources fails `npm run validate`

- `scripts/check-encoding.ts` (new) with `scripts/check-encoding.test.ts`: reads every file under `data/` and `content/`
  as bytes and fails, naming the file and the line, on U+FFFD. It reads the raw file, so no field is skipped. `i18n/`,
  `edu/` and `tour/` are included too, since their text is printed on pages.
- `package.json`: added to the `validate` chain after `scripts/validate.ts`.

Checked now: no file in those folders contains the character, so the rule fits everything in the museum (golden set
rule), and the scan of 148,288 files takes about five seconds. The two existing checks in `validate.ts` stay.

## 4. Change 3: the build queue on `main`

`.github/workflows/build.yml`, the `concurrency` block only:

- builds started by hand keep their own group with `queue: max`: none is cancelled, they run in order, as the founder
  decided on 22 October 2026;
- builds started by a push get a second group with the default queue: one runs, the newest one waits, and an older
  waiting one is cancelled when a newer push arrives. A running build is never cancelled.

Effects: after ten merges in a row there are two builds, not ten, and the newest commit is built at most one build
later. A hand-started build and a push build can run at the same time (two runner slots). A replaced waiting run shows
as "cancelled"; the deploy already ignores those.

One point to verify: GitHub's documentation (read 13 November 2026) shows `queue` with fixed values only and does not
say whether it accepts an expression. The plan is `queue: ${{ github.event_name == 'workflow_dispatch' && 'max' || 'single' }}`,
tried first in a throwaway workflow on the pull-request branch (removed before the merge). If GitHub rejects it, the
fallback is to move the jobs into a reusable workflow that `build.yml` calls from two jobs, one per event, each with its
own fixed group. The run and its artifact stay under `build.yml`, so the deploy's choice of build is unchanged. I will
say which one was used.

## 5. Files touched

| File | Change |
|---|---|
| `.github/workflows/validate.yml` | sample build, validate first in `test`, concurrency per pull request, `full-build` label |
| `.github/workflows/build.yml` | the `concurrency` block (or the reusable-workflow fallback of section 4) |
| `.github/workflows/site-checks.yml` (new, optional) | full link check after a successful build of `main` |
| `scripts/sample-routes.ts`, `scripts/sample-stubs.ts`, `site/src/lib/sample.ts` (new), with tests | the sample |
| `site/src/pages/[lang]/[class]/[slug].astro`, `site/src/pages/[lang]/words/hadith/[work]/[kitab].astro` | one line each in `getStaticPaths` |
| `scripts/check-encoding.ts`, `scripts/check-encoding.test.ts` (new) | U+FFFD in sources |
| `package.json` | `validate` chain; `sample:*` scripts |
| `docs/site/README.md`, `docs/agents/workflow.md`, `docs/engineering/45-build-deploy-review.md`, this file | documentation |
| `CANARY.md` | the release note |
| `docs/decisions/` | the decision record |

Not a shell file: neither page template edit changes the bytes of any page in a full build, so the pull request is not a
`rewrites-all-pages` change. This is checked by building the same sample with and without the helper and comparing.

## 6. Not in this proposal

- **The axe failure on `/en/`** (fact 1). Until it is fixed every pull-request run stays red at that step, sample or
  not. It needs its own small fix and its own approval; I can find the element as soon as a sample build exists.
- Open items 7.4 and 7.5 of document 45.
- Any change to the deploy workflows.

## 7. Question for the founder (a decision, not part of the work)

Should the fast job be a **required status check** on `main`? Agents merge their own pull requests without waiting for
CI (decision dec-20261108-185). With the `test` job required (validate and unit tests, about ten minutes), GitHub would
refuse a merge until it passes, and a red `main` could not be merged into.

- For: the failures of 12 and 13 November could not have reached `main`.
- Against: every merge waits about ten minutes; while `main` itself is red, every pull request is blocked until the fix
  merges; a required check needs a ruleset change that only the founder can make.
- A middle way: require `test` only, never the sample build, so a slow or flaky browser step cannot block merging.

Nothing in this proposal depends on the answer.

## 8. Done means

One pull request against `main` with the changes above, a `CANARY.md` entry, `npm run validate` at 0 errors, `npm test`
passing, a local sample build, and the measured time of that pull request's own Validate run set beside the 54 to 89
minutes of today.
