# M0: what the repository, the hosting and this machine actually are

_Checked on 25 November 2026 against `origin/main` at `94cb4298a37`. The V2 specification says to discover these, not assume them; where it guessed, the guess is corrected here._

## Languages

Seven, read from `site/astro.config.mjs` and the files in `i18n/`: Arabic (`ar`, the default and the first written), English (`en`), Urdu (`ur`), French (`fr`), Spanish (`es`), Turkish (`tr`), Indonesian (`id`). Every route is prefixed (`/ar/…`). Arabic and Urdu are right-to-left. Interface strings are YAML, one file per language with the same keys. `AGENTS.md` requires all seven in the same change for anything a visitor reads, with machine translations marked as such; an Arabic-script parenthetical must be wrapped in the isolate characters U+2066 and U+2069.

## Site

- Astro 5.18 with Svelte islands and Tailwind 4, in `site/`, building to `dist/`; `trailingSlash: "always"`; the stylesheet is inlined into every page on purpose.
- About 164,000 HTML pages (the figure in `tools/deploy/shell-paths.list`).
- Header and menu: `site/src/layouts/BaseLayout.astro`, `site/src/lib/nav.ts` (`explorePages`), `site/public/shell/shell.js`. Homepage: `site/src/components/Landing.astro`. Labels: `i18n/<lang>.yaml`.
- Existing pages the portal must link to or sit beside, not duplicate: `/[lang]/developers/`, `/[lang]/press/`, `/[lang]/support/`, `/[lang]/accessibility/`, `/[lang]/changelog/`.
- The site already depends on three 0.160.0 for `/[lang]/3d/`. The games use their own copy (0.187.0) in `gaming/` and never share a bundle with it.
- **Shell paths.** A change to the layouts, `nav.ts`, `site/package.json`, `astro.config.mjs` or the styles rewrites every page, about 19 GB on the next deploy. Such pull requests are labelled `rewrites-all-pages` and the founder batches them into one deploy a week. Adding Play to the header, the footer and the homepage is such a change.

## Checks that gate a push

| Command | What it does | Measured here |
|---|---|---|
| `npm run validate` | YAML, schema, encoding, authenticity, content-safety, registers, decision records | 4 min 48 s; 89,037 entities, 254,481 prose files, **0 errors**, 7,674 warnings |
| `npm test` | Root vitest: every `*.test.ts` in the repository | See the ledger |
| `npm run build` | Prebuild, Astro build, Pagefind, `check:site`, `check:weight` | Not run: no file under `site/` changed |
| `npm run check:static` | Fails on runtime network calls in built pages | Not run, same reason |
| `npm --prefix gaming test` | Gaming unit tests (`*.gtest.ts`) | 21 tests, 0.5 s |
| `npm --prefix gaming run typecheck` | Strict TypeScript over the gaming workspace | Clean |

`validate.yml` runs on every pull request: validation and unit tests, then a sample build with page checks, link check, axe and Lighthouse. `build.yml` builds every push to `main`.

## Hosting and deployment

Cloudflare, static. Pages and the site Worker's assets hold code; an R2 bucket holds the HTML pages, search, open data and media, served by the site Worker (`workers/site/src/route.js`). Production is `islam.museum`; a full copy for review is `uat.islam.museum`. **Deployment is manual and the founder's alone**: no agent starts `deploy.yml`, `deploy-uat.yml` or any workflow that writes to a bucket. `main` accepts pull requests only. The details that matter to games are in [G-0004](adr/G-0004-hosting-and-release-model.md).

The content security policy and what it means for games and mods are in [`threat-model.md`](threat-model.md).

## Governance that applies

- `docs/ai-change-gates.md`: no edit without an approved written proposal; stay in scope; label anything that could alter a filed submission (DPGA, UNESCO) as `submission-impacting`. The founder's instruction of 25 November 2026 is the proposal for the gaming subsystem. Files touched by the first pull request: `gaming/**`, `docs/gaming/**`, one row in `docs/agents/lanes.md`, one line in `docs/status.md`, one entry in `CANARY.md`, one entry in `.claude/launch.json`. Risk: `non-impacting` (no site page, record, licence, privacy or hosting change).
- **Submission-impacting, waiting for the founder's sign-off with that label:** the Play entries in the header, footer and homepage and the portal pages (new scripts and browser storage are part of the privacy posture the submissions describe); any change to `_headers`, the Worker, the publish lists or a workflow.
- Lane: `gaming`, registered in `docs/agents/lanes.md`. Work outside lanes follows `docs/agents/workflow.md`: branch, pull request, own merge after a three-way merge with `origin/main`.
- Every commit carries the `AI-Agent`, `AI-Model` and `AI-Editor` trailers. Every change has a `CANARY.md` entry.

## This machine

| | |
|---|---|
| Computer | MacBook Pro `Mac16,5`, Apple M4 Max: 16 CPU cores (12 performance, 4 efficiency), 40 GPU cores, 128 GB unified memory, Metal 4 |
| Display | Built-in, 3456 × 2234, 120 Hz |
| System | macOS 27.2.1 |
| Browsers | Google Chrome 158.0.8127.38; Microsoft Edge 157.0.4341.60; Safari 27.2 |
| Tools | Node 25.4.0, npm 11.9.0, ffmpeg, Python 3 with Pillow. **Blender is not installed.** |

This is one high-end Apple-silicon laptop. There is no Windows or Linux machine and no NVIDIA, AMD or Intel GPU in reach of this session.

## Dependencies chosen, pinned and why

| Package | Version | Licence | Why |
|---|---|---|---|
| `three` | 0.187.0 | MIT | The chosen 3D stack ([G-0002](adr/G-0002-rendering-engine.md)) |
| `@babylonjs/core` | 9.37.2 | Apache-2.0 | The comparison engine; used by the lab only |
| `vite` | 8.3.8 | MIT | Dev server and bundler |
| `typescript` | 5.9.3 | Apache-2.0 | Strict type-checking |
| `vitest` | 5.1.2 | MIT | Unit tests. 3.2.x was tried first and replaced: `npm audit` flagged two of its dependencies |
| `tsx` | 4.20.6 | MIT | Runs the TypeScript tools |
| `playwright-core` | 1.64.1 | Apache-2.0 | Drives the installed Chrome for benchmarks and captures; downloads no browser |
| `@types/three`, `@types/node`, `@webgpu/types` | 0.187.0, 22.19.1, 0.1.74 | MIT, MIT, BSD-3-Clause | Types |
| `d3-geo` | 3.1.1 | ISC | Atlas: the orthographic projection and great-circle paths of the globe |
| `topojson-client` | 3.1.0 | ISC | Atlas: reads the coastline file |
| `world-atlas` | 2.0.2 | ISC (data: Natural Earth, public domain) | Atlas: coastlines at 1:110 million and 1:50 million. The site already uses the same package |
| `yaml` | 2.9.1 | ISC | Atlas pack builder: reads the museum's records. Build time only |
| `@types/d3-geo`, `@types/topojson-client`, `@types/topojson-specification` | 3.1.0, 3.1.5, 1.0.5 | MIT | Types |

`npm --prefix gaming audit`: 0 vulnerabilities on 25 November 2026.

## Rights baseline

- All gaming code is original to this repository and falls under its code licence (MIT).
- All geometry and textures in the reference district are generated by that code from a seed. No third-party model, texture, font, sound or image is used.
- The concept images in `spec-v2/assets/` were supplied by the founder and are AI-generated. They are references in documentation. They are not game assets, are not shipped to players, and are not evidence of anything.
- No museum record is used by a game yet. When one is, it is by stable id with its source, and images only under the licences in `schema/enums/licenses.yaml`.

## Where the specification's assumptions were wrong or untested

- It assumes a dev server managed by the desktop app is reliable. On this machine the app's launcher stopped answering twice, so `gaming/tools/bench.ts` and `shot.ts` now start their own server.
- It suggests `packages/{runtime,content,render,audio,input,ui,save,replay,i18n,sdk,mod-runtime,portal-adapters}`. Two packages exist (`kernel`, `worldkit`), because two is what has more than one user so far. The rest are created when a second consumer needs them, as the specification itself asks.
- It lists Blender, KTX2, meshopt, Rapier, WebAssembly and GPU compute as candidates. None is used yet and none has been measured; each is adopted only with a measurement.

## Blockers and approvals needed

Listed once, in the ledger, under "Needs the founder".
