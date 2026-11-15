# 58 · Halal and Haram Browser (متصفح الحلال والحرام)

_Requested by the founder on 14 November 2026. Acceptance spec:
`docs/engineering/49-halal-haram-browser-requirements.md`. Lane: `halal`
(`docs/agents/lanes/halal.md`)._

## 1. What it is

A front door over the one graph at `/[lang]/halal/` that lists every mention
of «الحلال والحرام» — what the sources say God made lawful and what He made
unlawful — in the Qur'an, the Sunnah, the seerah, the reports of the
Companions and the Successors, and every harvested book, with detailed
curated records on the subject's principles and chapters. A book harvested
later shows its mentions the day its passage records land.

The browser describes and attributes. It issues no ruling, and where the
jurists differ it gives each view with its holder.

## 2. Scope

In: the two nouns «حلال» and «حرام»; the verbs of permitting and forbidding
with their doer or object; «تحريم»، «المحرمات»، «محارم الله»، «الاستحلال»;
and, beside those, «الطيبات»، «الخبائث»، «الشبهات»، «المباح»، «المكروه»،
«الرخصة».

Out, and removed before matching: the Sacred Mosque, the Sacred House and
the sacred months; the personal name Haram; the state of ihram and leaving
it; reward wordings («حرمه الله على النار»); untying and alighting senses of
«حلّ»; deprivation senses of «حُرم». The fixed penalties and major sins stay
with the Hudud Browser (plan 52), the sins theme with the Sayyi'at Browser
(plan 44), trade and money with the Islamic Economy Browser (plan 47).

## 3. Graph

No new class, predicate or side table.

- **Passages** are found at build time by `scripts/halal.ts`
  (`halalSignalsOf`): strong signals admit a passage; weak signals count only
  beside a strong one, with one pair rule (a bare permitting verb or «مباح»
  with a bare forbidding verb). `halalKindOf` gives `halal`, `haram` or
  `both`; `halalCorpusOf` gives the section from the work's genre.
- **Curated records** carry the tag `halal-haram-browser`. The umbrella is
  the existing `concept/halal-haram`; 23 existing concepts are tagged in
  place and eight new ones are written (section 5).
- **Edges**: harvested passages carry `mentions → concept/halal-haram`.

## 4. Harvest (14 November 2026)

| Source | Script | Rule | Records |
|---|---|---|---|
| The six collections and the Muwatta, hadith-api Arabic editions (Unlicense), read from the copy already on the harvest drive | `scripts/harvest-halal-hadithapi.ts` | a strong signal in the matn excerpt (≤55 words, honorifics left out); repeats of one wording inside a collection skipped; reports already in the graph skipped | 870 |
| Ten reports of scruple that do not use the two words | same script, `PINNED` | admitted by number, tagged `halal-haram-browser` | 10 |
| 25 OCR'd books already on the harvest drive: 6 seerah, 11 Companion/Successor/zuhd/Musannaf, 8 fiqh/usul/commentary | `scripts/harvest-halal-ocr.ts` | a 40-word window with one strong signal and two signals in all; no Qur'an quotation (marker, Uthmani letters, or four consecutive words of a verse); seven words in ten known; no honorific residue; densest pages first up to the book's cap, never two neighbouring pages | 808 |

No file was downloaded and no OCR was run: every text read was already on
the drive. The page counts per book, the candidates left above each cap and
every dropped category are in the lane file.

## 5. Curated records written

Each with `label`, `summary` and full prose in Arabic, English and Urdu,
cited to the museum's passage records, `status.review: draft`:

1. `concept/haqq-al-tahlil-wal-tahrim` — declaring lawful and unlawful belongs to God.
2. `concept/al-halal-bayyin-wal-haram-bayyin` — the hadith of al-Nu'man ibn Bashir and the doubtful matters.
3. `concept/al-atima-al-muharrama-wal-mubaha` — foods between the lawful and the unlawful.
4. `concept/idtirar-darura` — necessity and the forbidden.
5. `concept/talab-al-halal` — seeking the lawful and the purity of one's food.
6. `concept/wara-al-salaf-an-al-haram` — the scruple of the Prophet, the Companions and the Successors: the stories.
7. `concept/tahrim-ahl-al-jahiliyya` — what the people of the Jahiliyya forbade and permitted.
8. `concept/tadarruj-al-tashri-fi-al-halal-wal-haram` — the gradual revelation of the lawful and the unlawful.

## 6. Site

- `site/src/lib/halal.ts` — `halalItems` (the rows of the page and of the
  whole-list filter index, `browser-registry.ts`).
- `site/src/pages/[lang]/halal/[...page].astro` — landing and paged
  sections, curated first; `site/src/scripts/halal-filter.ts`.
- `site/src/components/sig/HalalScale.astro` — the signature view: a bar of
  passages by kind and two facing panels of lexicon terms with counts per
  corpus, drawn at build time, no script.
- `site/src/lib/nav.ts` (`halal` in the "conduct" group of the Explore
  menu), `site/src/components/Landing.astro` (the landing card),
  `i18n/{ar,en,ur}.yaml` (`explore.pages.halal`, `halal:`).

### Subjects (added 14 November 2026)

A visitor asks by subject, not by the verb a source used. Every record therefore also carries
subjects: principles, food, drink, hunting and slaughter, earnings and trade, marriage and
family, dress and adornment, life, property and honour, speech and conduct, worship and vows,
the sanctuaries of Makka and Madina, and other. A second lexicon in `scripts/halal.ts`
(`SUBJECT_RE`) reads the same folded text at build time; curated records take theirs from
`halal-subject-<id>` tags. The landing opens with a board of subject tiles
(`sig/HalalSubjects.astro`); each subject has its own paged page at
`/[lang]/halal/subject/<id>/`, ordered answers first (records, Qur'an in mushaf order, Sunnah,
seerah, other books). The pages state that the museum does not issue rulings. On the 1,820
passages at merge, about one in five matched no subject word and is listed under "other".

## 7. API and search

`/api/v1/halal.json` (`scripts/export-api.ts`): every item with `section`,
`halal_kind`, `signals`, work, ref, text, themes, tags and edges; documented
in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
Records are entity pages in Pagefind; the landing's title, lede and headings
are in `data-pagefind-body`.

## 8. Counts at merge

1,871 records: 31 curated, 57 Qur'an, 1,132 Sunnah,
132 seerah, 519 other books. By kind among passages:
151 lawful only, 965 unlawful only, 714 both.

## 9. Next

- A human read of the draft records.
- Raise the OCR caps book by book; add the fiqh books left out for want of a
  volume-neutral source record (al-Muhalla, al-Umm, al-Majmu', Bada'i'
  al-Sana'i', al-Hidaya) once their source records cover the scanned volumes.
- Musnad Ahmad, the Sunan of al-Bayhaqi and al-Darimi, and the Mustadrak
  from their OCR.
- Topic sub-sections (food, drink, dress, marriage, earnings) as tags on the
  curated records when the curated set grows.
