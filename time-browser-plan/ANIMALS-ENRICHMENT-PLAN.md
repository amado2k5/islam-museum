# Animals and insects: enrichment plan (29 Oct 2026)

Goal: take the animal and insect coverage from fiqh rulings plus one story to a full picture: each animal the founder named (cats, dogs, horses, camels, ants, spiders, pigeons) with its hadith, sira, Companion, scholar and caliph material, cited to defined sources, in the three languages, and reachable from the Time Browser.

Basis: `time-browser-plan/ANIMALS-COVERAGE-2026-10-29.md` (what exists and the gaps). Rules: `AGENTS.md` and `docs/agents/publication-standard.md` (cited, defined sources; one source is enough). Rich first pass: write the full detail in one pass, not in later rounds.

## 1. Where the sources are

The harvest drive (`/Volumes/exmicroSD/islam-museum-harvest/books/`) holds the OCR text (`book.txt`) for the registered books. A rough count of how often the Arabic words appear across those books (noisy: some words have other meanings):

| Topic | Arabic word | Books containing it | Note |
|---|---|---|---|
| Camel | الجمل / الناقة | 828 / 573 | Richest. Many sira and hadith passages |
| Horse | الفرس | 764 | Rich; fiqh, sira and poetry |
| Dog | الكلب | 770 | Rich, but also used for people's names and insults; must check context |
| Pigeon | الحمام | 624 | Many uses for bath; needs a precise term check (حمامة, حمام الحرم) |
| Ant | النمل | 573 | Mostly the Quran's ant of Surah al-Naml; check sira and hadith |
| Spider | العنكبوت | 433 | Mostly the Quran's spider of Surah al-Ankabut and the cave of Thawr |
| Cat | الهرة / القطة | 186 / 50 | Smallest; the hadith of the cat (هرة) is the main item |

Each hit is a lead, not a fact. The reading step decides what is a dated, cited event.

## 2. The work, in order

1. **Cats (smallest, clear hadith).** Find the hadith of the cat (هرة) in the hadith collections on the drive. Confirm the wording and the chain's source in the book. Write one or two records: the hadith as a cited ruling-and-story, with its narrator. Dated only if the source gives a date.
2. **Pigeons.** Check the precise term (حمامة / حمام الحرم) in sira and hadith. The cave of Thawr pigeon tale is not in the OCR texts checked so far; search the sira narratives (Ibn Ishaq, Ibn Hisham, Tabari) before writing anything.
3. **Ants and spiders.** The Thawr spider event exists (`event/spider-web-at-ghar-thawr`). Write its Arabic, English and Urdu prose. Find any hadith or sira ant story; if none is found, say so in the report and do not invent one.
4. **Dogs.** Find the hadith and sira events with a dog: the Companions' dog (Ashab al-Kahf, the dog in the cave, Surah al-Kahf 18:18), and the dog at the Hijra. Write only what the source states.
5. **Horses.** Two dated events exist. Find two or more more (the horses at Badr, Uhud, the Hijra road, Suraqa's horse already counted) to reach the four-node minimum for a story.
6. **Camels and the Companions.** Link the existing Companion and caliph records (Abu Bakr, Umar, Ali, Uthman) to the animal events they took part in, with `participated_in` relations. Adds the people the founder asked for without new records.
7. **Scholars.** Jahiz's Kitab al-Hayawan and Damiri's Hayat al-Hayawan have no event records. Add a work-plus-event pair for each, only where the book gives a dated fact about an animal.
8. **Time Browser.** Once each topic has at least four dated, cited nodes, make it a story: the umbrella story keeps all animal nodes, and each topic can become its own subject (cats, dogs, camels, horses, ants, spiders, pigeons).

## 3. Stop rules

- No fact without a defined source and a page. Read the page from the OCR before writing it.
- A topic with fewer than four dated, cited events does not become a story. It stays as records.
- If a source is not on the drive, mark the item as a lead, not as fact.
- Each topic is its own commit and PR, validated (`npm run validate`, `npm test`) before merge.

## 4. Done means

- Every topic the founder named has either a story or a written reason it has none.
- Every new prose file has Arabic, English and Urdu, with `status.review: published` and a provenance block.
- The coverage report and `docs/coverage.md` are updated.
- The Time Browser shows the animal stories in the existing groups, with no AI at runtime.

## 5. Who does it

Start with items 1 to 4 in one session (source reading and writing), then items 5 to 8. Each session takes one topic at a time, so two sessions never edit the same records.
