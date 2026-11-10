# Live-site review triage and fixes, 23 October 2026

Source: an external live-site retest (Muse, "islam-museum-review-6", 23 Oct 2026) with eight items. Each item was checked against the repository and the live site before deciding whether it is a real problem. Risk label for the whole change: `non-impacting` (no record, class, licence, language, route or privacy change; one media record stops linking its image).

| # | Item | Verdict | Change |
|---|---|---|---|
| 0 | Graph explorer fails to load | Not a site bug | None |
| 1 | Illustration and map media pages show no image | Real bug (illustrations); maps correctly omitted | `site/src/components/Extras.astro` |
| 2 | Trench illustration shows a modern skyline | Real content flaw | `data/media/illus-event-battle-of-the-trench.yaml` (image withdrawn, not regenerated) |
| 3 | Urdu 3D tour journey buttons in English | Real, minor | `tour/journeys.yaml` (Urdu `title` and `sub`) |
| 4 | `/browse/screen/` duplicates `/screen/` | By design | None |
| 5 | Kids' Wing listed twice in Explore | Real, minor | `site/src/layouts/BaseLayout.astro` |
| 6 | Empty search submits silently | Not an issue | None |
| 7 | Gibberish queries match single letters | No safe configuration | None |

## 0. Graph explorer

Tested in the app's built-in browser (a fresh profile with no extensions). `/en/graph/` drew the constellation for `person/muhammad`. On `/ar/graph/`, entering `event/battle-of-badr` in the page's own field drew that graph too. The page's resource timing shows both data requests, `https://islam.museum/api/v1/graph/person/muhammad.json` and `.../event/battle-of-badr.json`, returning 200 after the 301 to `api.islam.museum`. `curl` confirms that `api.islam.museum` answers `Access-Control-Allow-Origin: https://islam.museum`. The redirect is same-origin first, so the browser keeps the real `Origin` header on the second hop. The explorer works, and the failures in the test browser came from that environment. The code comment "(static, same origin)" in `site/src/pages/[lang]/graph/index.astro` is now out of date, but it was left alone because it is outside this task's scope.

## 1. Media pages

Cause: `Extras.astro` renders a media record's image only when the record has a remote `url` (museum photos). Local media (illustrations and maps) carry `files:` instead, and nothing rendered those files. Fix: a figure for `media` records without `url` whose own file (`files.webp_<lang>`, else `webp_en`, else `webp`) is present in `site/public/` at build time. It uses the same style as the existing photo figure, with the record's alt text in the page language plus attribution and licence. The existence check matches the map figure on event pages, and the validator already warns about missing files.

The repository has 3 illustration records and 1 map record (the retest's "9 + 3" counts pages, ×3 languages). The map files (`media/maps/battle-of-badr/map.{en,ar}.webp`) are not deployed: they return 404 live because they live in the separate media repo and `site/public/media/` is git-ignored. So the map page still shows no image, which is correct; it will appear once those files are published. The photo pages are unchanged, because the new block applies only when there is no `url`.

## 2. Trench illustration

Confirmed: `media/illustrations/trench.webp` shows a modern skyline across the whole horizon behind the oasis (multi-storey blocks and a tower). `docs/agents/lanes/illustrations.md` lists "modern objects" as a reject. The FLUX.2 [klein] weights are not on this machine (the Hugging Face cache is empty), so regenerating would have meant a large model download. Cropping cannot remove the skyline without losing most of the scene. The record no longer links the file, and its status note records why. The image file stays in git and nothing else changed, so regenerating it and restoring `files: { webp: media/illustrations/trench.webp }` puts it back. Before this change the image was not shown on any page, and after the item 1 fix it would have been, so withdrawing it keeps the flaw off the site.

Badr (`badr-well.webp`) and Uhud (`uhud.webp`) were inspected at full size. Neither has buildings, people, flags, text or modern objects. Badr shows dunes, palms, a stone well and footprints. Uhud shows sandstone cliffs and acacias. Both are clean.

## 3. Urdu journey buttons

The labels come from `tour/journeys.yaml` (`title` and `sub`), which `viewJourneys()` reads with a fallback to English. That file is shared tour data, not a `content/ur/` record, and the loader already allows `ur`. Urdu `title` and `sub` were added for all seven journeys, using the site's own era word «عیسوی» from `site/src/lib/dates.ts`. The file is already `status.review: draft`; the provenance note records the addition. The narration lines (`lines`) still fall back to English in Urdu. They are longer prose, left for the Urdu pass.

## 4. `/browse/screen/` and `/screen/`

`/{lang}/browse/<class>/` is one template that produces a plain A–Z list for every browsable class (`BROWSE_CLASSES`). `/screen/` is the curated Screening Room with filters. The same pairing exists for other classes with a dedicated hall (for example questions and exhibits). Redirecting one class would break the uniform "Browse types" index for a small SEO gain, so this was left as designed. Adding a `rel=canonical` from browse pages to the dedicated hall is an option for the founder to decide later.

## 5. Explore menu

`BaseLayout.astro` had a hard-coded Kids' Wing `<li>` after the `EXPLORE` list, which already contains `sighar` (`site/src/lib/nav.ts`). The hard-coded line was removed. The menu is shared, so AR, EN and UR now each list it once, with its description.

## 6. Empty search

Pagefind searches as you type, and there is no submit step. With an empty box the page already shows the hint "Try, for example: Hijra · Badr · Mecca · Aisha · Quran" (`search-hint`, visible while `data-empty="1"`), in all three languages. Checked live: pressing Enter on an empty box leaves that hint in place. Nothing to fix.

## 7. Noise matches

Pagefind 1.5 offers only ranking weights (`termFrequency`, `termSimilarity`, `pageLength`, `termSaturation`). It has no minimum-match or "disable back-off to shorter stems" option, so a gibberish term can still fall back to a short prefix. The only lever left is a client-side filter on result terms, and that would risk partial-word and Arabic morphology recall, which the brief says must not be traded. No change.

## Gates

- `npm run validate`: 34,747 entities and 65,011 prose files; 0 errors, 7,070 warnings (all existing).
- `npm test`: 11 files, 107 passed, 1 skipped. An earlier run failed 2 tests only because this fresh worktree had no `site/node_modules`; it passed after `npm --prefix site ci`.
- `npm run build`: 115,055 pages checked, 0 errors, 2 existing warnings (an empty `<li>` on `screen/678-2010`). No route was added or removed, so the page count is unchanged by this change.
- Built-output checks:
  - Badr and Uhud media pages contain `<img src="/media/illustrations/…">` in AR, EN and UR.
  - The Trench and Badr map pages contain no image, as intended.
  - `#site-nav` links `/sighar/` once per language.
  - `/ur/3d/` contains «غارِ حرا» and «مکہ · 610 عیسوی».
- `npm run coverage`: no change to `docs/coverage.md`, because no record was added or removed.
