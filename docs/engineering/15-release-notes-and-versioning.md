# 15 · Release notes and versioning (the canary system)

Every change to islam.museum is recorded for readers in `CANARY.md` at the repo
root, in the same commit that makes the change. The changelog page
(`/{lang}/changelog/`) renders that file, and the site build reads the current
version and date from its top block and shows them in the footer of every page.
This document is the rule set; `AGENTS.md` carries the binding one-line version.

## The file

- Newest release on top. Each release block opens with
  `## v<MAJOR>.<MINOR>.<PATCH> — <YYYY-MM-DD>` and is separated from the next by
  a `---` line.
- Entries sit under category subheads, in this order when present:
  `Added`, `Changed`, `Fixed`, `Removed`, `Performance`, `Tests`, `Data`,
  `Breaking`, `Rolled back`.
- One bullet per change, written for a reader: what changed and why it matters,
  in plain language — never a commit message, a PR number alone, or an internal
  codename. Name the page, class, endpoint or behaviour a reader would know.
- A rollback is an entry, not a deletion: if a change is reverted, add a
  `Rolled back` entry naming what was reverted and why. History is never
  rewritten to pretend a change did not happen.
- Breaking changes (a data shape, an id scheme, an API path, a removed page)
  are called out under `Breaking`, in the release that makes them, with the
  migration note a consumer needs.

## Who writes, and when

- The agent or contributor landing a change appends its entry in the same
  commit. No entry, no merge — the change is not finished without it.
- Entries for a batch of related commits land with the last commit of the batch.
- Entries accumulate under the current version block. When a change warrants a
  version bump, its commit opens the new block on top (new version, today's
  date) and puts its entries there.

## Versioning

The museum as a product carries a semantic version, independent of the API's
own version (`v1` in every API address, which changes only on a breaking API
change):

- **MAJOR** — a breaking change to the data model, the id scheme, or the API.
- **MINOR** — a new feature, page, wing, record class, endpoint or edition.
- **PATCH** — fixes, corrections, enrichment, performance and test work.

The version means "the state of the museum a reader or a consumer is looking
at". Deployment is manual and the founder's alone: whatever the top block of
`CANARY.md` says when he deploys is the version the public site shows.

## Where the version surfaces

- The footer of every page: `islam.museum · v<version> · <date>`, linking to
  the changelog. The pages carry only the link; `site/public/shell/shell.js` fills in the
  version from `api/v1/meta/deploy.json`, which the deploy writes from the top block of
  `CANARY.md` of the deployed commit. A version in the page would make every release rewrite
  all 160,000 pages (`16-deploy-churn-proposal.md`). Without JavaScript, or where there is no
  deploy stamp (a local preview, the GitHub Pages mirror), the footer shows the link alone. The stamp is cached like the rest of `api/` (an hour, then stale-while-revalidate), so the footer can show the previous release for up to an hour after a deploy.
- The changelog page header, above the rendered notes (read at build time through
  `site/src/lib/version.ts`; that page changes with every `CANARY.md` edit, which is expected).
- Never hard-code the version in a page or a layout.

## Writing the entries in three languages

`CANARY.md` is kept in English as the engineering record. The changelog page's
own prose (title, introduction, what-comes-next) is ordinary i18n and ships in
Arabic, English and Urdu like every other page; the entries themselves render
from the file as written.
