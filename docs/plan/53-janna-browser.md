# Janna Browser — متصفح الجنة

Requested 11–12 Nov 2026 (founder, verbatim, abbreviated): build «متصفح الجنة» listing every
mention and every written report about الجنة — the Qur'an, the Sunnah, the seerah, the
Companion and Tabi'i reports, every book already harvested and every book harvested later —
with a landing-page box, navigation-menu entry and production-ready end-to-end delivery, the
requirements filed in engineering docs so a later agent can test and validate it live.

The Fire Browser's twin (plan 52): where nar lists every mention of Jahannam and its names,
janna lists every mention and description of Paradise — the names (الفردوس، جنات عدن، دار
السلام، جنة المأوى، جنة الخلد، جنة النعيم، مقام أمين), its descriptions (rivers, soil, gates,
degrees, chambers, the houri, the purified spouses), its people (أهل الجنة، أصحاب الجنة) and
every worldly mention where the text means the afterlife garden.

## 1. Detection — `scripts/janna.ts`

A guarded lexicon over passage `text_search`/`text` only (labels and summaries never count):

- **Strong signals** match unconditionally: al-Firdaws, jannat 'adn, jannat al-na'im,
  jannat al-khuld, jannat al-mawa, jannat al-firdaws, dar al-salam, dar al-janna,
  ahl/ashab al-janna, hur al-ayn, wildan mukhalladun, ghuraf, Tuba, al-Kawthar, Tasnim,
  Salsabil, maqam amin.
- **Weak signals** — the bare noun «الجنة/جنة/جنات/جنان/الجنان» — count only when a Paradise
  collocation sits within ~60/90 chars (khold, na'im, rivers, gates, degrees, the Fire
  counterpoint «الجنة والنار», entry/fallāḥ vocabulary), so a worldly orchard does not.
- **Masks**: the fasting-shield matn «الصيام جنة»/«الصوم جنة» is rewritten before matching
  (janna there means a shield); the whole jinn family is excluded by letter boundaries —
  «الجن» never matches the جنة patterns because ة/ات/ان is required.
- **Excludes**: verified false positives by id (`JANNA_EXCLUDE`), currently the orchard
  ayahs 18:33 and 34:15–16.
- **Signals** `jannaSignalsOf`, **kind** `jannaKindOf` (`description` when a strong
  description signal fired, else `mention`), **corpus** `jannaCorpusOf` (quran by
  `work/quran`; sunnah by hadith genre/unit; seerah by `sira` genre; else books), and
  `jannaTagSection` (`janna-<section>` tags; default `curated`).

Curated records join through `janna-browser`; tagged passages also admit via the pick.

## 2. Records

- **Detected passages**: everything the lexicon catches — expected to be the largest
  browser on the graph alongside nar/eschatology.
- **12 shared concepts tagged in place** (`janna-browser` appended, shared with
  ghayb/eschatology/nar/angels): jannah, jannat-adn, al-kawthar, anhar-al-jannah,
  thamarat-al-jannah, hur, hur-al-ayn, ashab-al-nar-wa-ashab-al-jannah,
  ridwan-keeper-of-jannah, sidrat-al-muntaha, qissat-sahib-al-jannatayn, jannat-al-tajriba.
- **10 new `concept` records** (kind `belief`, draft, cited to tanzil-quran / sahih
  collections / tafsir-ibn-kathir, trilingual label+summary+prose): firdaws,
  abwab-al-jannah, bab-al-rayyan, darajat-al-jannah, turab-al-jannah, shajarat-tuba,
  jannat-al-mawa, dar-al-salam, ghuraf-al-jannah, azwaj-mutahhara.
- **13 `mentions` edges** from the naming ayahs to the new concepts (see §4).

## 3. Site, API, nav

- `site/src/lib/janna.ts` (`jannaItems` = tagged ∪ detected, sectioned+s orted),
  `site/src/pages/[lang]/janna/index.astro` (five corpus sections, excerpts, work + ref,
  kind chip, `data-pagefind-body`), `site/src/scripts/janna-filter.ts` (diacritic-insensitive
  filter; the full list is on the page without JS).
- `/api/v1/jannas.json` registered in `scripts/export-api.ts`: class-standard fields plus
  `section`, `janna_kind`, `signals`.
- `ExplorePage` key `janna` + `/[lang]/janna/` in `nav.ts`; landing card with a
  garden-tree thumbnail at accent `#2e7d52`.
- i18n `janna:` page blocks and `explore.pages.janna` in en/ar/ur.

## 4. `mentions` edges

quran-18-107, 23-11 → concept/firdaws · quran-6-127, 10-25 → concept/dar-al-salam ·
quran-32-19, 53-15 → concept/jannat-al-mawa · quran-2-25, 3-15, 4-57 →
concept/azwaj-mutahhara · quran-25-75, 39-20 → concept/ghuraf-al-jannah ·
quran-39-73 → concept/abwab-al-jannah · quran-13-29 → concept/shajarat-tuba.

## 5. Acceptance

Machine-checkable requirements: `docs/engineering/41-janna-browser-requirements.md` (JAN-R..).
Tests: `scripts/features-api.test.ts` janna cases. Draft until a human reads the records;
nothing live until the founder deploys.

## 6. Next waves

More Paradise concepts as sources allow (the rivers individually, the walls and market,
the last man out of the Fire); Urdu prose for the shared concepts that lack it; seerah and
books sections fill automatically as those corpora are harvested; a dedicated harvest of the
descriptions-of-Paradise chapters (صفة الجنة) in the sunan collections.
