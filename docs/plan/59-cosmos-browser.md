# Plan 59 — Cosmos Browser (متصفح الكائنات الفضائية والأمم السابقة لبني البشر وأسرار الكون)

_Requested by the founder, 15 November 2026: "start working on متصفح الكائنات الفضائية والأمم السابقة
لبني البشر وأسرار الكون, where it should list all the mentioned and written [beings, earlier nations
and secrets of the cosmos] that are in the Qur'an, the seerah, the Sunnah, the Tabi'in's stories,
quotes, mentioned and written in books that were harvested and any future harvested book … add a box
for it on the landing page and in navigation menus … full detailed prose … ready for production."
The verbatim request and the acceptance spec for production validation are in
`docs/engineering/51-cosmos-browser-requirements.md` (`COSMOS-R..` ids)._

## 1. What it is

A browser over the one graph that gathers what the museum's sources say about what lies beyond the
human story as we know it. The sources do not speak of "aliens" in the modern sense, and the browser
does not pretend they do; it gathers the mentions that bear on the question and the neighbouring ones
the founder named, in eight themes:

| Theme (`cosmos-<topic>`) | Arabic | What it holds |
|---|---|---|
| `beyond-earth` | مخلوقات وراء الأرض | creatures the Qur'an says are dispersed in the heavens as well as the earth, the "hosts of your Lord", the unknown creation, and the commentators' readings |
| `many-worlds` | العوالم والأرضون السبع | "the worlds", the seven heavens and "the like of them of the earth", the seven-earths reports and their grading |
| `heavens` | السماوات والأفلاك والنجوم | the structure of the heavens, orbits, stars, the guarded heaven, the sun's course |
| `origins` | بدء الخلق | smoke, the rending and expansion, the six days, the Throne on the water |
| `before-adam` | من سكن الأرض قبل آدم | the angels' question, the jinn created earlier, the earlier-inhabitants reports and their evaluation |
| `lost-peoples` | الأمم البائدة | 'Ad, Thamud, Iram, al-Rass, Tubba', the Companions of the Thicket, the people of the Trench, Saba', the lost Arab peoples |
| `hidden-peoples` | الأقوام المحجوبة | Gog and Magog and the barrier, the Two-Horned, the Sleepers of the Cave, the beast of the earth, the island of al-Jassasa |
| `secrets` | أسرار الكون والغيب | the keys of the unseen, the dominion of the heavens and the earth, the Tablet, the Pen, the Lote-tree, the Throne and the Footstool, the Spirit |

It follows the Magic and Dream Browser architecture (`docs/plan/38-magic-browser.md`): there is no side
table and no second list. Passages are ordinary graph nodes; curated records carry the `cosmos-browser`
tag.

## 2. How records get in

1. **The Qur'an: a reviewed table, not a word search.** `scripts/cosmos.ts` `COSMOS_QURAN_REFS`
   lists the verses (sura, first aya, last aya, themes), each read against the verse text and the
   commentaries. The verse text is frozen (Tanzil) and never matched by vocabulary: a verse is in the
   browser because a person decided it speaks of the theme.
2. **Every other passage: a guarded lexicon, at build time.** The same file's Arabic and English
   patterns run over the passage's own text, search text, label and summary. Bare common words never
   match alone — «عاد» is "he returned", «السد» is a dam, «ستة أيام» is the fast of Shawwal, «الأفلاك»
   is in the medical books — so the lexicon uses phrases and names that carry the theme by themselves
   (`سبع أرضين`، `ما بث فيهما`، `قبل آدم`، `ثمود`، `يأجوج`، `اللوح المحفوظ` …). A mention in a book
   harvested next month appears the day its passage record lands (the founder's "any future harvested
   book" requirement, met by the detector and not by tagging).
3. **Curated records and hand-checked passages: tags.** `cosmos-browser` plus `cosmos-<topic>` (the
   topic chips) on any record; a passage whose wording the lexicon cannot see joins the same way.
4. `COSMOS_EXCLUDE` is the escape hatch for verified false positives, each read by hand.

## 3. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `concepts`
سجلات هذه الموضوعات — derived from each passage's work (`work/quran` first; genre `sira`; genre
`hadith` or `unit: hadith`; all else `books`) and, for curated records, `concepts`.

## 4. Pages

- `/[lang]/cosmos/` — home: lede, status count, method note (the sources' own wording is not "aliens"),
  API link, a signature view (`components/sig/CosmosThemes.astro`: one bar per theme, split by the
  section its records sit in, every segment a link), section chips with counts, a client-side filter
  over trilingual labels, summaries, work names, topic names and excerpts, and ordinary entity links;
  long sections are paged (`site/src/lib/paged.ts`).
- Landing card «متصفح الكائنات الفضائية والأمم السابقة لبني البشر وأسرار الكون» with an orbit icon and
  accent, and an Explore-menu entry under the **unseen** group, in all three languages.

## 5. API and documentation

- `/api/v1/cosmos.json` — every detected + tagged record with `section`, `topics`, `work`, `ref`,
  `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags` and edges; registered in
  `scripts/export-api.ts`, `site/public/openapi/v1.json`, `docs/data/README.md`, `llms.txt`.
- Registered in `docs/site/browsers.md`, `docs/site/signature-views.md`, the plan index, the roadmap,
  `docs/agents/lanes.md` (`cosmos` lane), `docs/status.md` and `CANARY.md`.

## 6. The curated layer

Existing records were tagged in place (29: the Gog and Magog, Cave and Trench records, the Throne,
Footstool, Tablet, Pen and Lote-tree, the seven heavens, `ghayb`, the Isra' and Mi'raj, 'Ad,
Thamud and Saba', Iram, al-Hijr, the Prophets Hud and Salih, the Two-Horned, and the celestial-body
records) and new records were written where the graph had none: life beyond the earth in the sources,
"the worlds", the seven earths, the hosts of your Lord, the earth before Adam, the jinn created before
man, the later readings of "Adam before Adam", the Companions of al-Rass, Tubba' and his people, the
Companions of the Thicket, the lost Arab peoples, readings of Iram, the Two-Horned's barrier, Gog and
Magog in the hadith, al-Jassasa and Tamim al-Dari, the shooting stars and the guarded heaven, creation
in six days, smoke, rending and expansion, the sun's prostration under the Throne, the reports on the
heavens' inhabitants, modern alien and UFO claims in Islamic discourse, and two tension cards:
*Is there life beyond the earth?* and *Who lived on the earth before Adam?* Each new record is
trilingual, cites defined sources, labels contested views (`perspectives`) and gives no verdict. The
final list and counts are in the requirements document (§2) and `CANARY.md`.

## 7. Scope decisions (made by the agent, recorded here for the founder's audit)

- **The founder's phrase is interpreted by what the sources say, not by the modern word.** "Aliens"
  becomes "beings beyond the earth" (creatures dispersed in the heavens; many worlds), kept separate
  from the angels and jinn, which have their own browsers (`/[lang]/angels/`, `/[lang]/jinn-devils/`)
  and are linked, not duplicated. The method note on the page says so plainly.
- **"Nations before mankind"** covers both readings of the phrase: the reports of earlier inhabitants
  of the earth before Adam (`before-adam`) and the peoples that vanished in the human story
  (`lost-peoples`, `hidden-peoples`). Modern pre-Adamite and alien-contact claims are recorded as
  modern discourse and labelled as such.
- **Reports with disputed chains are included with their grading, never dropped and never endorsed.**
- **Dreams, magic, jinn and angels stay in their own browsers**; a passage about two subjects may
  appear in both.
- **Push without waiting for CI** (founder instruction): the gates are run locally opportunistically.

## 8. Known limits

- Detection of non-Qur'an passages is lexical; a mention phrased without the lexicon needs a
  `cosmos-browser` (+ `cosmos-<topic>`) tag on the passage record — the documented escape hatch.
- The verse table is a reviewed judgement, not a closed list: a verse the table misses is added by a
  one-line pull request.
- The seerah section fills itself as seerah passages with these themes are harvested.
- All AI-authored records stay `status.review: draft` until a human reads them; nothing is live until
  the founder deploys.
