# Angels Browser — engineering requirements (acceptance spec)

Public name: **متصفح الملائكة · Angels Browser · فرشتوں کا براؤزر**
Route: `/{lang}/angels/` and `/{lang}/angels/<slug>/` for `lang ∈ {ar, en, ur}`.
Plan: `docs/plan/36-angels-browser.md`. Lane: `angels`.

## Original requirements (founder request, preserved verbatim)

> "get latest from main, clone the repo to a separate folder then start working on
> متصفح الملائكة where it should list all the mentioned and written dreams that are in
> quran, sunnah, any of seerah and any dreams mentioned and written in books that were
> harvested and any future harvested book if it has a dream should be viewable here.
> add a box for it on landing page and in navigation menus. make sure this is done end
> to end and full detailed proses and make it ready for production at the end of this.
>
> also add this in engineering documents as the original requirements to allow AI later
> on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download
> any books, you can use mac apple vision to OCR and then harvest those OCRd books or
> you can find any other online website that you can decide whether or not can be
> authentic and trusted as a source and get from it information to fully enrich and
> fill detailed proses"

Follow-up clarifications from the same session:

> "in the end commit, push, raise PR and merge it"
> "this is only about angels and everything mentioned about angels in quran, sunnah,
> serrah, anywhere in any of the sunni books"
> "find all the instances where angels met or interacted with humans in the quran,
> seerah, sunna, quotes from sa7aba and tabi3een and add those stories, mentions, quotes"

Resolution recorded: the first message mixed "dreams" and "angels"; the founder
clarified the feature is **angels only**, covering angels and everything mentioned
about them in the Qur'an, Sunnah, Seerah and all Sunni books, including angel-human
encounters and reports from the Sahaba and Tabi'in. Dream records remain in the Ghayb
Browser (`ghayb-daily` section); the engineering rule below keeps the boundary.

## Functional requirements

| id | requirement | production check |
|---|---|---|
| A-01 | `/{lang}/angels/` renders in ar, en, ur with title, lede, badge, method note and API pointer inside `data-pagefind-body` | `curl -s https://islam.museum/ar/angels/ \| grep -c 'data-pagefind-body'` ≥ 1; same for en, ur |
| A-02 | Records grouped into six sections with counts computed at build time | page lists sections `doctrine, revelation, eschaton, recording, hosts, events` with non-zero counts |
| A-03 | Client-side filter box filters cards without JS dependency for reading | type a name in the filter; matching cards stay, others hide; page still readable with JS off |
| A-04 | `/{lang}/angels/<slug>/` renders for every tagged record in all three languages | spot-check `angels/jibril`, `angels/kiraman-katibin`, `angels/malaikat-ibrahim` in ar/en/ur return 200 |
| A-05 | Subject page shows linked Qur'an ayahs with frozen Tanzil text (never typed) and hadith reports with links | `angels/kiraman-katibin` shows ayahs 82:10–12, 86:4; `angels/malak-al-mawt` shows 32:11 |
| A-06 | Subject page shows citation footnotes and related records | footnote list present when summary carries `{cite:}`; related chips link to entity pages |
| A-07 | Landing page carries an Angels Browser card | landing page contains a card linking to `/{lang}/angels/` |
| A-08 | Navigation menus carry the entry | header Explore menu lists "The Angels Browser"/"متصفح الملائكة" |
| A-09 | `/api/v1/angels.json` exports every `angels-browser` record with kind, wings, themes, tags, edges | `curl -s https://api.islam.museum/api/v1/angels.json` returns items covering all tagged records |
| A-10 | OpenAPI and llms.txt document the endpoint | `site/public/openapi/v1.json` has `/angels.json`; `/{lang}/llms.txt` lists the dataset |
| A-11 | Search indexes the pages | Pagefind returns `/{lang}/angels/` for "الملائكة"/"angels" queries |

## Graph/data requirements

| id | requirement | production check |
|---|---|---|
| D-01 | Membership is `angels-browser` tag on ordinary records; no side table | `grep -l "angels-browser" data/**/*.yaml` covers concept/person/event/journey/question records only |
| D-02 | Section membership is `angels-<section>` for the six documented sections | every tagged record carries exactly one section tag |
| D-03 | Named angels are cited to defined `data/source/` entities with provenance blocks | `npm run cite-check` passes on every new record |
| D-04 | Qur'an mentions are `mentions` edges on frozen passage records; no Qur'an text typed in records or pages | passage records carry `mentions` → angel subjects; pages render `p.data.text` only |
| D-05 | Angel-human encounters (Qur'an stories, Seerah events, hadith reports, Sahaba/Tabi'in reports) are represented as tagged records and/or edges | `angels/malaikat-ibrahim`, `angels/malak-maryam`, `angels/malaikat-zakariyya`, `angels/malaikat-munfarij`, `angels/malaikat-laylat-al-qadr`, `angels/malaikat-salat-ala-l-nabi` pages render with their verse/report lists |
| D-06 | Contested identifications carry labelled perspectives, no museum verdict | e.g. Ridwan/Malik keeper hadith strength notes, Harut-Marit identity notes |
| D-07 | Future harvested angel material appears automatically once tagged | a new record tagged `angels-browser` + `angels-<section>` appears on the landing page and gets a subject page at next build |
| D-08 | Dream records stay in the Ghayb Browser; angel-related dream mentions may add `mentions` edges without moving the record | `ghayb-daily` records unchanged; no `angels-browser` tag on dream records unless the record is angel-centric |

## Engineering requirements

| id | requirement | production check |
|---|---|---|
| E-01 | Shared reader `site/src/lib/angels.ts` derives everything from the compiled graph at build time | file exists; `angelsItems` filtered by tag; no hardcoded record list |
| E-02 | Pages readable without JavaScript; WCAG 2.2 AA | filter is progressive enhancement; skip-link/landmarks per BaseLayout |
| E-03 | i18n in ar/en/ur for UI strings, labels, summaries | `i18n/{ar,en,ur}.yaml` carry `angels:` and `explore.pages.angels` blocks |
| E-04 | `kind: angel` registered in `schema/enums/kinds.yaml` and schemas regenerated | `npm run schema` output committed |
| E-05 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` succeeds | run on the PR branch before merge |
| E-06 | CANARY.md entry under the release block; version bumped per `docs/engineering/15-release-notes-and-versioning.md` (new feature → minor) | entry present in the merge commit |
| E-07 | Registers updated: `docs/site/browsers.md`, `docs/plan/00-README.md`, `docs/agents/lanes.md`, `docs/status.md`, `docs/data/README.md` | rows present |
| E-08 | No deployment by the agent; founder deploys manually | no deploy workflow triggered by the PR |

## Deferred / out of scope

- Prose enrichment waves beyond the seed summaries (curated stories per angel).
- Angel records for every tradition attestation (weak reports stay labelled).
- Moving Ghayb's angel sections into this browser — cross-links suffice.
- Any runtime AI, network fetch or side dataset.
