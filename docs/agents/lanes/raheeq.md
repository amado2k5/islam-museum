# Lane `raheeq`: al-Raheeq al-Makhtum

**Book:** «الرحيق المختوم: بحث في السيرة النبوية» by صفي الرحمن المباركفوري (1943–2006), 512 pages; PDF page = printed page.
**Plan (read fully before starting):** `docs/plan/17-raheeq-makhtum.md`: §1 rights (read the whole book and rewrite what it says in the museum's own words, citing the book page and the classical source its footnote names; quotes at most 40 words; `docs/sources-policy.md`), the claims-table procedure and the batch order.
**Text (outside git):** `~/islam-museum-harvest/raw/books/raheeq-makhtum/`: `book.txt` (markers `===== [pN] =====`), `pages.json`, `pages-png/`, `toc.txt` (pp. 495–512), `bib.txt` (pp. 489–494), `README.md`.
**Progress and next step:** `docs/delegation/raheeq-progress.md` (read it first, resume at its "next step"; also `git log origin/main --oneline | grep raheeq`).
**Branch / stubs:** `content/raheeq-<agent>`; `data/_stubs.d/raheeq.yaml`. Commit prefix `content(raheeq)`.

Follow [`../mining-sources.md`](../mining-sources.md) and [`../content-standards.md`](../content-standards.md).

## Sources and claims

- Source ids: `source/mubarakpuri-raheeq` (cite `{cite:mubarakpuri-raheeq p.N}`) plus the classical source the footnote names, e.g. `{cite:ibn-hisham 1/135}`. Every classical work in `bib.txt` becomes its own `source` entity so citations resolve (batch 27 does the full list; create any source you cite as you go, after checking it does not exist).
- Status of claims: the book narrates the tradition, so facts are `status: tradition` unless an academic source supports `historical` or `debated`. Where the author argues a position (dates, routes, numbers), record it as his view with the page.
- The book is squarely Sunni; contested matters (Banu Qurayza, the succession passages, the role of particular Companions) still need a `perspectives` block.

## Batch order (27 batches; done batches are in the progress file)

1 Badr pp. 204–233 · 2 Hijra pp. 161–174 · 3 birth and the forty years pp. 54–64 · 4 first revelation and the secret call pp. 65–77 · 5 the public call pp. 78–108 · 6 the boycott and the Year of Sorrow pp. 109–124 · 7 outside Mecca and the Isra' pp. 125–142 · 8 the two Aqaba pledges and Dar al-Nadwa pp. 143–160 · 9 life in Medina pp. 175–203 · 10 between Badr and Uhud pp. 233–247 · 11 Uhud pp. 248–289 (map block, dataset; split in two) · 12 between Uhud and the Ahzab pp. 290–300 · 13 the Ahzab and Banu Qurayza pp. 301–324 (**Tier A**) · 14 Banu al-Mustaliq and the slander pp. 325–336 (**Tier A**) · 15 al-Hudaybiyya pp. 337–348 · 16 letters to the kings pp. 349–361 · 17 Khaybar pp. 362–379 · 18 year 7 and Mu'ta pp. 380–393 · 19 the conquest of Mecca pp. 394–411 (map) · 20 Hunayn and al-Ta'if pp. 412–423 (maps) · 21 the sariyas and Tabuk pp. 424–439 · 22 Abu Bakr's hajj and the delegations pp. 440–457 · 23 the Farewell Pilgrimage and the death pp. 458–472 (**Tier A**) · 24 the Prophet's household and description pp. 473–488 · 25 pre-Islamic Arabia pp. 15–47 · 26 lineage and family pp. 48–53 · 27 the bibliography pp. 489–494 (source entities).

## Overlap

Batches 18–21 overlap with the `hisham` lane (Mu'ta, the conquest of Mecca, Hunayn and al-Ta'if, Tabuk, the delegations). Reuse its event ids (`event/conquest-of-mecca`, `event/battle-of-hunayn`, `event/siege-of-taif`, `event/battle-of-mutah`, `event/expedition-to-tabuk` and their children); add this book's page and claims to them; add `has_part` children only where the child does not exist. See also `lanes.md` ("Overlap between lanes"). Reuse what is on main: persons and places from earlier batches, the Prophetic-era people and groups of the `people` lane.

## Acceptance tests (from plan 17 §7)

Badr: one parent event, 25 or more sub-events, a map block with sourced features, a dataset row, `revealed_about` edges to the cited ayat, no claim without a page. Every `{cite:mubarakpuri-raheeq p.N}` has a matching page; every classical citation resolves. The Hijra renders as a route with at least five legs. A reviewer verifies 20 random claims against the page images; at least 19 are exactly supported.
