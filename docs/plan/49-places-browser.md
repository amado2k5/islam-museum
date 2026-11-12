# Plan 49 — Sacred Places Browser (متصفح الأماكن المقدسة والهامة وذات القيمة في الإسلام)

_Requested by the founder 11 November 2026: "start working on متصفح الاماكن
المقدسة والهامة وذات القيمة في الاسلام where it should list all the mentioned
and written متصفح الاماكن المقدسة والهامة وذات القيمة في الاسلام that are in
quran, see rah, sunna, tabi3een stories, quotes, mentioned and written in
books that were harvested and any future harvested book if it has a
متصفح الاماكن المقدسة والهامة وذات القيمة في الاسلام should be viewable here.
add a box for it on landing page and in navigation menus. make sure this is
done end to end and full detailed proses and make it ready for production at
the end of this. this is only about متصفح الاماكن المقدسة والهامة وذات القيمة
في الاسلام and everything mentioned about متصفح الاماكن المقدسة والهامة وذات
القيمة في الاسلام anywhere in any of the sunni books or quran or sunna or
sera. find all the instances where الاماكن المقدسة والهامة وذات القيمة في
الاسلام were mentioned or part of quotes from quran, sunnah, Hadith, seerah
or from sahaba and tabi3een and add those stories, mentions, quotes, details.
also add this in engineering documents as the original requirements to allow
AI later on to test and validate it when it is in production."_

## 1. What it is

A browser over the one graph that gathers every **place of sanctity,
importance and value in Islam** the museum's sources mention: the three
sanctuaries (Mecca, Medina, Jerusalem), the stations of the hajj, the sites
of the seerah and the campaigns, the towns, lands and mountains the Qur'an
names, the sites the tradition venerates beyond those, and — automatically —
every place or building any passage in any harvested book names.

Unlike the corpus browsers (dreams, du'a, nubuwat), the subject here is a
**record class**, not a lexical pattern: a place is a `place` or `building`
node, and its mentions come from the `mentions → place/…|building/…` edges
passage records already carry (and that enrichment keeps adding). The
browser's home page therefore groups **places** into sanctity sections, and
each subject page groups that place's **mentioning passages** by corpus —
Qur'an, Sunnah, seerah, other books — like the Nature and Angels subject
pages do.

## 2. Graph model

- **No new class, no side table.** Members are `place` and `building` nodes.
- **Membership** (`scripts/places.ts`):
  - curated layer — `tags: [places-browser]` (+ optional `places-<section>`),
  - automatic layer — any `mentioned_in` edge from a non-stub `passage`
    (the inverse of `mentions`; `place` and `building` are in its range).
  A place named in a book harvested later enters automatically the day its
  passage record lands — no tagging step.
- **Sections** (`PLACES_SECTIONS`, set by `places-<section>` tag; untagged
  automatic members land in `mentioned`):

| id | ar | contents |
|---|---|---|
| `sanctuaries` | الحرمات الثلاثة | Mecca, Medina, Jerusalem; Masjid al-Haram/Kaaba, Prophet's Mosque, al-Aqsa |
| `hajj` | مشاعر الحج والمواقيت | Safa, Marwa, Mina, Arafat, Muzdalifa, Jamarat, the miqat stations |
| `seerah` | مواقع السيرة والمغازي | Hira, Thawr, Quba, Uhud, Badr, Hunayn, Hudaybiyya, Khaybar, Ta'if, al-Baqi'… |
| `quran` | أماكن سماها القرآن | Madyan, Saba, Misr, Babil, Iram, al-Ahqaf, Judi, Tur Sina, Najran, Yathrib… |
| `sacred` | مواقع موقّرة أخرى | al-Haram al-Ibrahimi, historic mosques, wells, mountains, shrines |
| `mentioned` | وردت في المصادر | every other passage-mentioned place/building — the self-growing shelf |

- **Corpus classifier** (`placeCorpusOf`): `work/quran` or `unit: ayah` →
  `quran`; genre `sira` → `seerah`; genre `hadith` or `unit: hadith` →
  `sunnah`; else `books`.
- **Mention edges** are written on the passage records only (`mentions`),
  each citing the passage's own source; inverses are computed at build.

## 3. Pages

- `/[lang]/places/` — home: badge, title, lede, method note, status counts
  (all inside `data-pagefind-body`), six section chips with counts, a
  trilingual filter, and a card grid per section (inside
  `data-pagefind-ignore`). Cards link to the browser subject page and show
  the place's per-corpus mention counts plus its summary.
- `/[lang]/places/<slug>/` — one place or building: lede from the record's
  summary, chip to the ordinary entity page, then the mention groups —
  Qur'an ayah cards rendering the frozen Tanzil `text` (never retyped;
  Arabic pages show no translation line), the Sunnah reports, the seerah
  reports, the other books — each with work + ref, then related records and
  the citation footnotes. Slug = the node's slug; a cross-class collision
  gets a `building-` prefix at build.
- Everything reads without JavaScript; the filter is progressive
  enhancement (`site/src/scripts/places-filter.ts`).

## 4. API, search, registration

- `/api/v1/places.json` — custom rows in `scripts/export-api.ts`
  (`placesRows`): every member with `section`, per-corpus `mentions`
  counts, kind, coordinates, regions, tags, connections, prose languages.
  Documented in `docs/data/README.md`, `site/public/openapi/v1.json`,
  `site/src/pages/llms.txt.ts`; expected in `scripts/features-api.test.ts`.
- Explore-menu entry (`site/src/lib/nav.ts` key `places`) and landing card
  (`site/src/components/Landing.astro`, Kaaba-and-qibla motif, accent
  `#4a7a52`) in all three languages.
- i18n `places:` block + `explore.pages.places` in `i18n/{ar,en,ur}.yaml`.
- Register row in `docs/site/browsers.md`, plan index `docs/plan/00-README.md`,
  roadmap `docs/plan/06-roadmap.md`, lane `places` in `docs/agents/lanes.md`,
  `docs/status.md`, `CANARY.md` (v1.21.0).
- Acceptance spec: `docs/engineering/37-places-browser-requirements.md`
  (`PLACE-R..`).

## 5. Content phases

1. **Skeleton** (this commit): detector, lib, pages, filter, export, nav,
   landing card, i18n, docs.
2. **Curated tagging**: `places-browser` + `places-<section>` on the
   canonical set — the three sanctuaries and their buildings, the hajj
   stations and miqats, the seerah trail, the Qur'anic places, the other
   venerated sites — reusing existing records before creating any.
3. **Edge enrichment**: `mentions → place/…|building/…` on passage records
   whose matn names a place — first the Qur'an ayahs that name places not
   yet linked, then the fadail/seerah reports of the harvested collections —
   each edge citing the passage's own source.
4. **Prose**: full trilingual `content/{ar,en,ur}/{place,building}/<slug>.md`
   for every member that lacks it (Arabic first, docent voice, cited to
   defined sources, `status.review: draft` + `provenance`), in batches of
   at most 25 entities per commit.

## 6. Out of scope / limits

- No place ranking or pilgrimage-itinerary tooling; the browser lists,
  groups and links.
- Places only named in un-harvested books appear when those books land —
  the automatic layer, not a hand list.
- Buildings are members only where they are themselves sacred sites or are
  named by a passage; the class is not bulk-tagged.
- All AI-authored prose is `status.review: draft` until a human reads it.
