# Master fix pass — report (2026-10-15)

Scope: the "Master Fix Prompt" of 2026-10-14, sections 1–3. Basis: a fresh build of `main` at e533f060 plus this pass's
edits, checked in a real browser (Chromium device emulation at 390×844, 768×1024, 1024×768 and 1440×900) and in the
built `dist/`.

Starting point. Most §1 items had already landed on `main` on 2026-10-14, after the prompt was written: breakpoint scale
(85c837b9), 44 px timeline markers (f8246c7b), shuffle deck (fd81b915), search empty state (2637644a), year-only
ordering (898fc110, 15174720), honorific helper (f6c86f1d, 33f8c50a, 66b2d28f, e45186d1) and the veneration tag
(b3ca3959). This pass verified each against the prompt's exact checks and fixed what was still short. Every result
below was produced in this pass; nothing is carried over from the audit's assumptions.

## §1.1 Responsive system — verified, no change needed

What exists: `site/src/styles/global.css` has the four-step scale (480 / 720 / 1024 / 1440) at lines 532–547, on top
of the 720 and 900 rules.

Evidence (dev server, `document.documentElement.scrollWidth === window.innerWidth`):

| Page at 390×844 | scrollWidth | innerWidth |
|---|---|---|
| `/` | 390 | 390 |
| `/ar/time/` | 390 | 390 |
| `/ar/event/hijra/` | 390 | 390 |
| `/ar/search/` | 390 | 390 |
| `/ar/person/abu-bakr/` | 390 | 390 |
| `/ar/graph/` (constellation, 2 canvases/SVGs) | 390 | 390 |
| `/ar/journey/al-kudr-expedition/` (journey player, 1 column, map 318 px) | 390 | 390 |

- 390: menu collapses to the button; `aria-expanded` true after click, false after Escape, nav hidden again, focus
  back on the button.
- 390: timeline markers have `stroke-width: 44px` with `vector-effect: non-scaling-stroke`; `elementFromPoint`
  20 px right, up and down of a marker still hits it. 20 px to the left hit the neighbouring marker instead: on a
  crowded axis the 44 px areas overlap, so a dense year can be reached through the year card rather than by touch.
- 768: wings grid 3 columns, tick labels 12 px, no horizontal scroll (`/` and `/ar/time/`).
- 1024: wings 3 columns, `.wrap` side padding 24 px, no horizontal scroll.
- 1440: `.wrap` max-width 1240 px (rendered 1240), no horizontal scroll.
- Screenshots of `/` and `/ar/time/` at 390, 768, 1024 and 1440 were taken in the session; the layout holds at all four.

## §1.2 † legend — changed

- `i18n/ar.yaml:238`, `i18n/en.yaml:238`: new one-line `timeline.legend`
  («† تاريخ هجري محسوب آليًا من الميلادي — قد يختلف عن التاريخ المروي بيوم أو يومين» /
  "† Hijri date computed from the Gregorian — may differ from the transmitted date by a day or two").
- `site/src/pages/[lang]/[hall]/index.astro:42`: the time hall's banner now shows this short line (class `tl-legend`,
  muted) instead of the long sentence; the long sentence stays above the card grid, where the † dates are.

Evidence: at 390×844 the legend's bottom edge is at 472 px, inside the first screen; at 1440×900 at 347 px.
Rendered on `/ar/time/` and `/en/time/` (English text confirmed on `/en/time/`).

## §1.3 Shuffle — verified, no change needed

`site/src/pages/[lang]/wander/index.astro:18–38`: Fisher–Yates deck in `sessionStorage` (`wander-deck-v1-<N>`), position
advanced per click, reshuffled only when `pos` reaches `N`. The homepage "استكشف" tiles are links; the only shuffle is
the wander page (the "today" dice picks a random day with events and is not a deck by design).

Evidence: the built inline script was run in Node with stub `sessionStorage`/`location` (`wander-sim.mjs`):
N = 9905; after N+1 clicks the first N targets were 9905 distinct pages; the (N+1)th repeated one of them, i.e. the
deck was exhausted before any repeat; the stored position survives navigation (it is read back on every click).

## §1.4 Empty search — verified, no change needed

Evidence (built preview, `?q=zzzqqq`):
- `/ar/search/`: «لم نجد نتائج لـ «zzzqqq». جرّب كلمة أقصر أو تحقّق من الإملاء، أو جرّب: مكة، الصلاة، الأندلس.»
- `/en/search/`: "No results for “zzzqqq”. Try a shorter word or check the spelling, or try: Mecca, prayer, Andalusia."
- Empty query shows the hint with five example links («جرّب مثلًا: الهجرة · بدر · مكة · عائشة · القرآن» / "Try, for
  example: Hijra · Badr · Mecca · Aisha · Quran"). No console errors on either page.

## §1.5 Ordering inside 622 CE / 1 AH — changed

Audit of the rendered `/ar/time/` card grid before the fix: the two year-only 1 AH events (المؤاخاة, صحيفة المدينة,
«نحو 622 م · 1 هـ») were listed after رجب 2 هـ (سرية نخلة). Cause: `timelineKey` pushed a year-precision date to the end
of the *CE* year of its converted Hijri start (1 AH starts in July 622, so "end of 623"), past the first half of 2 AH.

- `site/src/lib/dates.ts:117–125`: a year-only date keyed by a Hijri year now sorts at the end of that Hijri year
  (just before 1 Muharram of the next); a CE-keyed year-only date sorts at the end of its CE year (floor, not round).
- `scripts/hijri/dates.test.ts:18–36`: the era test now asserts "before the first event of the next Hijri year", and a
  new test covers 1 AH year-only between ذو القعدة 1 هـ and صفر 2 هـ. 7/7 tests pass.

Rendered order after the fix (`/ar/time/`, cards 51–65), monotonic in the Hijri calendar:

```
51 بيعتا العقبة — نحو يوليو 621 م
52 الإسراء والمعراج — نحو 621 م
53 الهجرة النبوية — نحو 12 سبتمبر 622 م · نحو 29 صفر 1 هـ†
54 ليلة الخروج في الهجرة — نحو 12 سبتمبر 622 م · نحو 29 صفر 1 هـ†
55 اجتماع دار الندوة — نحو 12 سبتمبر 622 م · نحو 29 صفر 1 هـ†
56 ليالي غار ثور الثلاث — نحو 13 سبتمبر 622 م · نحو 1 ربيع الأول 1 هـ†
57 الإقامة بقباء — 23 سبتمبر 622 م · 8 ربيع الأول 1 هـ
58 أول جمعة في بني سالم بن عوف — 24 سبتمبر 622 م · 12 ربيع الأول 1 هـ
59 بناء المسجد النبوي — نحو 27 سبتمبر 622 م · ربيع الأول 1 هـ
60 سرية سيف البحر — نحو مارس 623 م · رمضان 1 هـ
61 سرية رابغ — نحو أبريل 623 م · شوال 1 هـ
62 سرية الخرار — نحو مايو 623 م · ذو القعدة 1 هـ
63 المؤاخاة بين المهاجرين والأنصار — نحو 622 م · 1 هـ
64 صحيفة المدينة — نحو 622 م · 1 هـ
65 غزوة الأبواء (ودان) — نحو أغسطس 623 م · صفر 2 هـ
```

The CE column reads "نحو 622" after "مايو 623" for the two year-only entries: 1 AH spans July 622 – July 623 and the
sources give only the Hijri year, so the CE label is the conventional one. The same key orders `/en/time/`: in the built `/en/time/`, cards 60–65 read
Sayf al-Bahr (Ramadan 1 AH) · Rabigh (Shawwal 1 AH) · al-Kharrar (Dhu al-Qa'da 1 AH) · the brotherhood (c. 622 CE · 1 AH) ·
the Constitution of Medina (c. 622 CE · 1 AH) · al-Abwa (Safar 2 AH), and 2 AH closes the same way (al-Sawiq, Dhu al-Hijja 2 AH,
then the two year-only 2 AH entries, then Dhu Amarr, Muharram 3 AH). The hall build's own assertion (non-decreasing keys)
passed for both editions.

Noted, not changed (data, outside this pass): «دفن النبي» is dated to the month (ربيع الأول 11 هـ) and therefore lists
before «وفاة النبي» (12 ربيع الأول); a day-precision date on the burial record would fix it.

## §1.6 English inner pages — changed (search index), verified (titles, h1)

20 random `/en/` person/event/concept pages from `dist/` (seed 20261015):

```
/en/event/fall-of-afshin-and-mazyar/            title ok (English)   h1=1
/en/event/qarmatian-actions-in-mecca/           title ok (Arabic)    h1=1
/en/event/rus-sack-of-bardaa-332/               title ok (Arabic)    h1=1
/en/event/treaty-of-hasan-and-muawiya/          title ok (Arabic)    h1=1
/en/event/uthman-ibn-hunayf-survey/             title ok (English)   h1=1
/en/event/wathiq-khutba-gap-740/                title ok (Arabic)    h1=1
/en/person/al-baharzi-abu-al-qasim-ali/         title ok (English)   h1=1
/en/person/al-idrisi-muhammad-ibn-abd-allah/    title ok (English)   h1=1
/en/person/al-muafa-al-nahrawani/               title ok (English)   h1=1
/en/person/al-tufayl-ibn-al-harith/             title ok (English)   h1=1
/en/person/aristutalis/                         title ok (English)   h1=1
/en/person/barmak-ibn-abdallah-al-dabili/       title ok (English)   h1=1
/en/person/ghazan-khan/                         title ok (Arabic)    h1=1
/en/person/hattab-ibn-al-harith/                title ok (English)   h1=1
/en/person/ibn-abi-nuaym/                       title ok (English)   h1=1
/en/person/ibn-al-mazyar/                       title ok (English)   h1=1
/en/person/iskandar-al-barudi/                  title ok (English)   h1=1
/en/person/najib-baladi/                        title ok (English)   h1=1
/en/person/shahid-ibn-al-husayn/                title ok (English)   h1=1
/en/person/tayhan-ibn-abjar/                    title ok (Arabic)    h1=1
```

- (a) No page has a slug as its title; `<title>` is `labelOf(n, lang)` which falls back to the Arabic label when no
  English label exists yet (6 of 20). That is a human title, not a slug; English labels arrive with Phase 4.
- (c) Exactly one `h1` on all 20.
- (b) Snippets: pages without English prose render the Arabic prose as a fallback inside the article, which is what
  Pagefind indexed, so English searches returned Arabic excerpts. Fix at the template level:
  `site/src/layouts/EntityLayout.astro:169` marks the fallback prose `data-pagefind-ignore` when it is in the other
  language, so each edition's index holds only text in its own language (titles and summaries never fall back
  across languages). Evidence after the rebuild: of 4,954 English person/event/concept pages, 91 carry Arabic
fallback prose and all 91 are now excluded from the English index (0 excluded before). On the built preview,
`/en/search/?q=mecca` returns 809 results; of the 18 excerpts rendered, 0 contain Arabic letters and 0 titles contain
Arabic; `/en/search/?q=prayer` returns 948 results, 0 of 11 rendered excerpts contain Arabic.

## §2.1 Honorifics — recommendation adopted (already on main), verified

`site/src/lib/markdown.ts:11–72`: one helper, `honorify`, applied to rendered article prose only (headings, tables and
link labels are skipped), with one state per article (`EntityLayout.astro:52`), so the Prophet gets ﷺ after the first
«النبي» / «رسول الله» and each Companion gets رضي الله عنه / عنها after the first mention. The English edition runs
the same helper with the gloss "(may God be pleased with him/her)"; the choice is documented in the comment at the top
of the helper. Nothing is typed into content: `content/ar/` contains no ﷺ, رضي الله عن or عليه السلام.

Evidence: `/ar/person/abu-bakr/` prose: «…أول خلفاء النبي ﷺ…» once; رضي الله عنه twice (two different Companions);
later mentions unmarked.

Two deliberate limits, for the owner: (1) the bare name «محمد» is not matched, because it is shared by hundreds of
later figures on the site and the data cannot tell them apart in running prose; the Prophet is marked through «النبي»
and «رسول الله». (2) عليه السلام is not rendered for the earlier prophets: the site never had it, and matching names
such as إبراهيم, موسى or يوسف in prose would hit later people of the same name. Both can be added later with a
link-aware match once names are wiki-linked consistently.

## §2.2 Affiliation tags — changed

Before: «يُعظَّم عند شيعة اثنا عشرية» (the enum label in the nominative, indefinite). Now:
- `i18n/ar.yaml:136–139`, `i18n/en.yaml:136–139`: `entity.venerated_label` per Shia tradition
  (الشيعة الاثني عشرية / الشيعة الإسماعيلية / الشيعة الزيدية; Twelver / Ismaili / Zaydi Shia).
- `site/src/layouts/EntityLayout.astro:137`: the veneration tag uses it; the museum's frame tag («يُعدّ في … أهل السنة»)
  is unchanged.

Evidence (dev server, "at a glance" panel):
- `/ar/person/ali-ibn-abi-talib/`: «يُعدّ في: أهل السنة · يُعظَّم عند الشيعة الاثني عشرية».
- `/ar/person/husayn-ibn-ali/`: «يُعدّ في: أهل السنة · يُعظَّم عند الشيعة الاثني عشرية».

## §2.3 Multi-view pattern — untouched

No change to the opinions block (`EntityLayout.astro`, "الرأي الأول · أهل السنة (إطار المتحف)" + «آراء أخرى»).

## §3 Regression guards — checked on the rebuilt site

- Search works: «مكة» 847 results, "mecca" on the Arabic edition 280, "mecca" on the English edition 809 (the counts
  have grown with the content since the audit; the English count also lost the Arabic-prose matches, by design).
- Date ranges: 0 raw `YYYY/YYYY` strings on `/ar/time/`.
- `/ar/event/hijra/`: «دراما تاريخية» present, `historical-drama` absent; axis ticks 610/620/630/640 rendered with the
  622 marker; the journey map and the draft badge with the GitHub issue-template link are present.
- Footer on `/ar/`: 14 links, no duplicates.
- Exactly one `h1` on `/`, `/ar/time/`, `/ar/event/hijra/`, `/ar/search/`, `/ar/person/abu-bakr/`, `/en/` and the 20
  English pages above; `<html lang="ar" dir="rtl">` / `<html lang="en" dir="ltr">`.
- Arabic letter-spacing overrides for `.eyebrow`, `.kicker` and `.page-banner .crumbs` are in the shipped CSS; the gold
  token `#c5a059` and the light-mode eyebrow `#654a15` are unchanged.
- Opinions block, revelation-order toggle, theme/font preferences, duplicate-person handling and the Fitna deferral were
  not touched by this pass (no file in those paths changed).
- `npm run build` (validate, graph, derive, api, Astro, Pagefind, check-site): 33,500 pages, 0 errors, 0 warnings;
  `npm test`: all suites pass.

## Not verified

- Shuffle: verified by running the page's own script in Node, not by 9,906 real clicks in the browser.
- Screenshots exist only in the session transcript; none were committed.
