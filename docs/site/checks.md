# Checks: what fails, where, and how to add one

Checks run at three points. Each one is a rule a change must keep true. If a check fails, fix the cause (the data, the template or the code). Do not weaken the check, skip it, or add a guard that hides bad data.

| When | Command | What it checks |
|---|---|---|
| Any data or content change | `npm run validate` | Schema, references, dates, honorifics, Qur'an text, licences, content lints (below). |
| Any logic change | `npm test` | Validator rules, the Qur'an text is frozen, scope rules, the date rules (`scripts/hijri/*.test.ts`), and the site inputs (i18n paths and dependencies, `scripts/site-deps.test.ts`). |
| Any site change | `npm run build` | `validate`, then the graph and derive steps, the Astro build (which contains its own assertions), then `check:site`. |
| Education page weight | `npm run check:weight` (part of `npm run build`) | The education routes listed in `scripts/check-weight.ts` stay under their HTML (CSS inlined) and JS budgets; a breach fails the build and is fixed by removing weight (plan `docs/delegation/education-master-plan.md` §3). |
| Network guard | `npm run check:static` | No runtime calls to external origins; the site stays static. |

## Content lints (`scripts/validate.ts`)

Errors (the build stops):

- **Replacement character** (U+FFFD) anywhere in data text or prose. Corrupted text has to be restored from a clean source, not left in.
- **Placeholder digit in a date:** an `X` after a hyphen (`0571-04-2X`) in an `edtf` or `hijri` value. Use the intended date, or `~` for an approximation.
- **`ق.م هـ`** in data or prose. The BCE Hijri form is `ق.هـ`.
- Plus the existing schema, reference, scope and licence rules.

Warnings (reported, do not stop the build):

- **Same title on two entities of different classes** (after normalising diacritics, alef and ta marbuta forms). Often a place and an event that share a name, which is legitimate. If it is one thing, merge it: keep one id and list the other under `aliases`.

## Rendered-output assertions (`scripts/check-site.ts`, run after the Astro build)

Errors:

- `0 هـ` (a Hijri year 0) on any page. The check ignores `10 هـ`, `20 هـ` and so on.
- U+FFFD, or `ق.م هـ`, on any page.
- A date rendered with a placeholder digit (`dddd-dd-dX`).
- A footnote link `#note-N` with no `id="note-N"` on the same page.
- An `<audio>` or `<video>` element without a text alternative: it must carry `aria-describedby` pointing to a transcript or stated text equivalent (or `aria-label`), or contain `<track kind="captions">`. Media never auto-plays, and captions and transcripts are provided in all published languages.

Warnings:

- An empty `<meta name="description">`.
- An empty `<li>`.

## Build-time assertions in the components

- **Time wing** (`site/src/pages/[lang]/[hall]/index.astro`): the rendered entries are non-decreasing by `timelineKey`. Throws otherwise.
- **Timeline strip** (`site/src/components/TimeStrip.astro`): every marker lies within the scale. Throws otherwise.
- **JSON-LD and metadata** fall back to a stub sentence for entities with no summary, so no page ships an empty description.

## Site inputs (`scripts/site-deps.test.ts`, run by `npm test`)

Two guards for the files the Astro build consumes. They exist because a commit on 17 Oct 2026 rewrote `i18n/ar.yaml`, `i18n/en.yaml` and `site/package.json` wholesale, dropping five top-level i18n blocks, nested keys such as `landing.shop_cats` and `nav.donate`, and the `simple-icons` dependency; `validate` and `test` passed, and the failure appeared minutes into the build (`Cannot read properties of undefined (reading 'apparel')` on `/ar/index.html`) and broke every deploy for hours. Both rules now fail in under a second and name the file, the expression and the missing path.

- **Every i18n path the site reads exists in `i18n/ar.yaml`.** The test scans `site/src/**/*.{astro,ts,svelte,mjs,js}`, follows the aliases a file binds (`const T = ui(lang)`, `const L = T.landing`, `const R = ui(lang).references`, an alias of an alias) and checks every dotted read through them at any depth: `L.shop_cats.oud` is the path `landing.shop_cats.oud`, `R.title` is `references.title`, `T["footer"].support` is `footer.support`. The walk stops at the first value that is not a mapping (so `T.name.length` checks only `name`), at `?.` (the code tolerates absence there), and at a dynamic index: `T.wings[w]` and `L.shop_cats[c.key]` have their prefix checked (`wings`, `landing.shop_cats`), and the keys such a read can reach may be declared per file in `DYNAMIC_I18N_READS` in the test, where they are checked like static reads (GiftShop's eight categories are). A dynamic read with no checkable prefix (`T[hall]`) must be declared there or the test fails. A `T` that is not the table (`const T = payload.t`, a generic `T[]`) is not scanned. `i18n/ar.yaml` is parsed with the `yaml` package, which also rejects a duplicated key.
- **Every bare import under `site/src` is declared in `site/package.json`** (`dependencies` or `devDependencies`). Static, `type`, re-export and `import()` specifiers count; relative paths, `astro:*`, `node:*`, `virtual:*` and Node built-ins are skipped; `@scope/name/sub?url` resolves to `@scope/name`. The root `package.json` does not count: the site must declare what it imports.

When one of these fails, restore the key or the dependency (`git log -S <key> -- i18n/` finds the commit that wrote it); do not add the key to an allowlist or remove the import. The first run of the extended scan found `support.github_title`, `github_body` and `github_cta`, read by the support page and dropped twice by kids-wing commits.

## Tests (`npm test`)

- `scripts/hijri/anchors.test.ts`: the Hijri converter anchors.
- `scripts/hijri/dates.test.ts`: BH rendering (no year 0), the era sort (an era after the events of its start year), Hijri-first ordering (8 AH after 7 AH), Hijri-only dates getting a position, and undated entries sorting last.
- `scripts/pipeline.test.ts`: validator rules, the frozen Qur'an text, scope rules, and content guards.
- `scripts/site-deps.test.ts`: every i18n path the site reads (through aliases, at any depth) exists in `i18n/ar.yaml`, and the site's bare imports are declared in `site/package.json` (section above).

The per-test timeout is 60 seconds (`vitest.config.ts`). The pipeline tests each validate the whole repository, which is slower on the CI runner than on a laptop. A test that times out there is not a failing rule; do not lower the limit back to the default. The pipeline test file also yields to the event loop before each test (`beforeEach` in `scripts/pipeline.test.ts`). Keep that yield: without it the worker blocks long enough for vitest's RPC to time out (`Timeout calling "onTaskUpdate"`), even when every test passes.

## Adding a check

1. Decide the level: a data problem is a `validate` error; a rendering problem is a `check-site` error; a judgement you cannot make mechanically is a warning.
2. Add the rule next to its siblings (`scripts/validate.ts` for data, `scripts/check-site.ts` for HTML). Keep messages specific: name the file and the value.
3. Add a unit test in `scripts/hijri/` or `scripts/pipeline.test.ts` for the rule itself, including a case that must pass.
4. Run `npm run validate && npm test && npm run build` and confirm the rule fails on a deliberately bad input, then remove the bad input.
