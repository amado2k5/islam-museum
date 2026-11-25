# G-0001: a self-contained `gaming/` package

_25 November 2026. Status: accepted._

## Question

Where does the gaming code live so that it builds, tests and releases on its own, and so that a game change can never slow or break the museum's pages?

## What the repository is (checked, not assumed)

- The site is its own npm package in `site/` (Astro 5, output to `../dist`), beside a root package of scripts. There are no npm workspaces.
- `site/package.json`, `site/astro.config.mjs`, `site/src/lib/nav.ts` and the layouts are "shell paths" (`tools/deploy/shell-paths.list`): a change to any of them rewrites all of the roughly 164,000 pages on the next deploy, about 19 GB.
- The root `vitest.config.ts` has no `include` filter: it collects every `*.test.ts` and `*.spec.ts` in the repository, with only the root's dependencies installed.
- `dist/` is ignored by git everywhere.

## Decision

1. All gaming code is in `gaming/`, an npm package of its own (`gaming/package.json`, `gaming/package-lock.json`), with every dependency pinned to an exact version. The museum's root and `site/` packages are not touched.
2. Inside it: `packages/` for shared code that has at least two users, `games/<id>/` per game, `labs/` for spikes and benchmarks, `tools/` for build, benchmark and validation scripts. Imports between them use the `@im/*` aliases.
3. Gaming tests are named `*.gtest.ts` and run with `npm --prefix gaming test`. The root test run never collects them, and the gaming run never collects the museum's.
4. The portal's pages, when they are written (M3), are ordinary museum pages under `site/src/pages/[lang]/play/`: they share the header, footer and languages and add a few hundred pages to 164,000. Game runtime code and assets are never imported by the site package; a play page loads them at run time from the release described in G-0004.

## Alternatives turned down

- **npm workspaces at the root.** Would rewrite the root `package.json` and lockfile, and change what `npm ci` installs for every museum job. No benefit a path alias does not give.
- **Inside `site/src`.** Couples every game build to the 45-minute site build and puts game dependencies into `site/package.json`, a shell path.
- **A second repository.** The mandate asks for the same repository, and the games read museum records at build time.
- **Excluding `gaming/**` in the root vitest config.** Works, but edits a shared file in the maintainer's lane for something a naming rule achieves with no edit.

## Consequences

- A gaming change touches `gaming/**` and `docs/gaming/**` only, so the `shell-impact` job never labels it `rewrites-all-pages`.
- `validate.yml` still runs on a gaming pull request (it runs on every pull request). A dedicated gaming workflow with path filters is M3 work and is proposed in G-0004.
- Two lockfiles to keep audited: `npm --prefix gaming audit` was clean on 25 November 2026 (0 vulnerabilities).
