# Viewpoints (the nine ways in, landing page and `/for/` pages)

Founder request, 23 and 24 November 2026; replaces the five persona doors of 23 November. The first design study is in `docs/design/viewpoints-poc/`; the founder then chose the arcade of nine doors, which is what is built. A viewpoint is a **navigation layer**: it adds no entity, no edge and no dataset, so nothing changes in the graph, the API or the data exports. Its pages are indexed by search through `data-pagefind-body`. Phase 1 (this document) is built; phases 2 and 3 are below.

## The nine viewpoints

| Key | Name (en) | First-person line | Accent (light / dark) |
|---|---|---|---|
| `new` | New to Islam | I said the shahada recently | `#3B6D11` / `#97C459` |
| `back` | Returning to Islam | I was born Muslim and I am coming back | `#0F6E56` / `#5DCAA5` |
| `five` | Five years on | I want depth, not a beginner list | `#993556` / `#ED93B1` |
| `curious` | Curious | I just want to know what this is | `#854F0B` / `#EF9F27` |
| `doubt` | Doubting | I have questions I cannot put away | `#993C1D` / `#F0997B` |
| `research` | Researching | I need sources, dates and method | `#185FA5` / `#85B7EB` |
| `learn` | Learning my faith | I practise and want to know why | `#534AB7` / `#AFA9EC` |
| `challenge` | Challenging | I disagree and want to see the evidence | `#A32D2D` / `#F09595` |
| `pass` | Just passing through | Give me three minutes | `#5F5E5A` / `#B4B2A9` |

White text on each light accent and `#0a2533` on each dark accent are above 4.5:1. 

## How it is built

- Landing: `site/src/components/ViewpointArcade.astro`, rendered in `Landing.astro` under the Grand Tour button: a stone arcade of nine doors, each `Door.astro` with its own arch profile (`ARCH` in `viewpoints.ts`: round, horseshoe, multifoil, four-centred, ogee, keel, pointed, trefoil, flat gateway). A tenth arch, "I want it all", has no door: it is not a viewpoint, has no `/for/` page and is never remembered; it links straight to `/{lang}/browse/`. Ten columns, five at 1000px and under, rows with the door beside its name at 680px and under. A plain list of links; the leaves open on hover, on keyboard focus and on the last door chosen (`.is-last`), without motion under `prefers-reduced-motion`. All inline SVG, styles scoped: nothing under `site/src/styles/` changes.
- Pages: `site/src/pages/[lang]/for/[viewpoint].astro`, route `/{lang}/for/{key}/`, all seven languages: a breadcrumb with "switch" and "reset", the hero with the open door and its accent line, "Thoughts you may have", "Your reading order" (steps with minutes, each a link to an existing hall) and one specific block (timeline, cards or two-voice questions), a line on what a viewpoint does, and the nine pills.
- Language-neutral parts (keys, accents, icons, the link and minutes of each step, the block kind) are in `site/src/lib/viewpoints.ts`. All text is in `i18n/<lang>.yaml` under `viewpoints:` in the same keys for ar, en, ur, fr, es, tr, id. The page throws at build time if a step list does not match `STEPS`.
- Remembering the choice: `site/public/shell/viewpoint.js`, a plain file loaded only by the landing page and the viewpoint pages. It stores the last viewpoint in `localStorage` (every access in try/catch), marks that card, and shows "Your viewpoint: X · reset". Nothing is sent anywhere; without the script or without storage everything still works.

## How to add a viewpoint

1. Add the key to `VIEWPOINTS`, `ACCENT`, `ICON`, `ARCH`, `STEPS` and `BLOCK` in `viewpoints.ts` (and `CARD_LINK` if a card links on).
2. Add `viewpoints.<key>` (name, line, h, thoughts x4, steps, block_title, block_sub, items) to all seven i18n files; the existing `links` keys are the labels of the halls a step may point to, add a `LINK_PATH` entry and a `links` label for a new hall.
3. Run `npm test`, then a one-language build.

## Old URLs

`/for/convert/` goes to `new`, `/for/doubter/` to `doubt`, `/for/researcher/` to `research`, `/for/learner/` to `learn`, `/for/critic/` to `challenge`. Each is a small static page with a canonical link and a meta refresh to the new page (`OLD_ALIASES` in `viewpoints.ts`).

## Deliberately not done (phase 1)

- No account, no tracking, no viewpoint bar on other pages. The converts exhibit does not exist yet: the "People who came to Islam" steps point to the trail `exhibit/path-hijra-converts` (`TODO(converts-exhibit)` in `viewpoints.ts`).
- The richer signature blocks of the mockups are not built: the Researching view's three panels (key sources from `data/source` with a Primary or Secondary tag, an inline-SVG evidence graph of one real example such as the Hijra, a method checklist from the method pages), the Challenging table "Topic / The challenge / The response", Learning in three columns "What / Why / Where it comes from", Five years on as a horizontal year line with a shelf of themes, "Today's wonder" as a rotating card, and the "Just passing through" 3:00 timer with a Go button (a plain three-step list works without script). Each needs real record data chosen and cited, not invented.
- No raster imagery from the mockups (AI-painted arches, doors, an astrolabe). Only inline SVG geometry or media whitelisted in `schema/enums/licenses.yaml`. A faint inline-SVG eight-point-star motif (about 6% opacity) in the landing hero corner is welcome but was not added in phase 1, because the hero belongs to `Landing.astro` and global styles.
- The hero headline's left edge is centred by the existing landing styles; aligning it with the block would need `global.css`, a shell file (whole-site rewrite).

## Truth notes

- The text describes; it does not rule. Doubting and Challenging label each voice (Sunni position, academic view, personal accounts) and give no verdict. Timelines and "what people say" lines are stated as general themes, not studies.
- Spanish, French, Urdu, Turkish and Indonesian text is careful machine translation written on 24 November 2026, not read by a human; Arabic and English were written by hand.

## Depth blocks (added 24 November 2026)

`site/src/components/ViewpointDepth.astro`, data in `site/src/lib/viewpoint-depth.ts`, text in `i18n/<lang>.yaml` under `vpdepth:`. Under the signature block of each viewpoint: sourced questions (`QUESTIONS`, question records), a first-week list (`CHECKLIST`, New to Islam only), a table of figures shared with Christianity and Judaism (`COMPARE`, from the question records for Adam, Noah, Abraham, Moses, David, Solomon, Jonah, Joseph, Jesus) and shelves of checked resources (`SHELVES`, `listing` records, with the official website read from the record). All of it points at graph records; none is new unsourced text. The 13 listing records added with it were each opened and read on 23 November 2026 (page status and the site's own description). Discord servers, forums and Reddit groups are not listed: invitations change, and Reddit blocks automated reading so `r/converts` could not be verified; `ummah.com`, once a forum, is now a finance site and was dropped. Translation of the new strings and records into fr, es, tr and id goes through the Word lane (`docs/engineering/63-translation-by-document-files.md`).

## Phase 2: the treasure hunt (built)

`/{lang}/hunt/`, linked by a dashed gold button under the arcade. Seven riddles on a locked trail, then the final secret. The stops, riddles and the lines between them are the rooms of `data/exhibit/hunt-seven-places.yaml` (kind `trail`, so it is in the graph, the API and search; its own page is the answer key). `site/src/lib/hunt.ts` holds the accepted words and the hint record of each stop; interface text is `hunt:` in the seven i18n files; `site/public/shell/hunt.js` locks, checks and keeps progress in `localStorage` only. Answers ignore case, accents and Arabic letter variants and forgive one slip; "Show the answer" moves on without one. Without script every riddle is open with its answer under that control. `scripts/hunt.test.ts` checks that each stop's name is accepted in every language and no other stop's is. The Arabic and English were written directly; the other five languages are machine translation no human has read.

## Phase 3: a viewpoint bar on every page (needs the founder's batch deploy)

A slim "Your viewpoint" bar and accent on every page of the museum would be **rewrites-all-pages** (about 164,000 HTML files, 19 GB). It would touch `site/src/layouts/BaseLayout.astro` and `EntityLayout.astro` (the bar markup), `site/src/styles/` (the bar and accent styles, inlined into every page), and `site/public/shell/shell.js` or `viewpoint.js` loaded from the layout; each is in `tools/deploy/shell-paths.list`. It must wait for the founder's weekly batch.

## Ideas for later viewpoints

"Art lover" (calligraphy, architecture, objects), "Teaching others" (parents and teachers), "Traveller" (places and maps), "A hard season" (hardship, grief). Not to be copied from mockups: accounts ("My Passport", "Sign in"; the museum has no accounts) and any invented hall descriptions.
