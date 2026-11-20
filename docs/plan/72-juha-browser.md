# 72. The Juha and Islamic Folklore Browser

_Requested by the founder on 20 November 2026 («متصفح جحا والفلكلور الإسلامي عبر العصور والكوميديا والنكت والطرائف والنوادر»). Acceptance spec with the verbatim brief: `docs/engineering/64-juha-browser-requirements.md`._

## What it is

A front door over the one graph for humour in the Islamic tradition: Juha and Nasreddin Hoca, the named wits and fools, the anecdote genre (nawadir), jesting, laughter and smiling, and the ethics of the joke — in the Qur'an, the Sunnah, the seerah, the reports of the Companions and Successors, and every harvested Sunni book.

## How it works

| Part | Where | What it does |
|---|---|---|
| Detector | `scripts/juha.ts` | Guarded Arabic lexicon over passage texts; returns signals, a kind (`juha`, `wits`, `anecdote`, `jest`, `laughter`, `ethics`) and a section (`curated`, `juha`, `quran`, `sunnah`, `seerah`, `books`). Runs at build time, so later books join with no tagging step. |
| Hadith harvest | `scripts/harvest-juha-hadithapi.ts` | Humour reports from the seven hadith-api Arabic editions into `data/passage/<collection>-api-<n>.yaml`, 55-word matn excerpts. |
| Book harvest | `scripts/harvest-juha-ocr.ts` | Mode `books`: the strongest 40-word windows of each OCR'd book on the harvest drive (`BOOKS`, one line per book). Mode `--juha`: *Nawadir Juha al-Kubra* anecdote by anecdote, with five-language titles and retellings. |
| Curated records | tag `juha-browser` + `juha-kind-<kind>` | Persons, works, places and the four concepts `al-muzah`, `al-dahik`, `al-nawadir`, `al-zurafa-wa-al-mughaffalun`. |
| Page | `site/src/pages/[lang]/juha/[...page].astro`, `site/src/lib/juha.ts`, `site/src/scripts/juha-filter.ts` | The storyteller's gathering: rider hero, the majlis of the wits, the strip of Juha anecdotes, the scale of laughter, the bookshelf, then paged sections with kind chips and search. |
| API | `scripts/export-api.ts` → `/api/v1/juha.json` | Every item with `section`, `juha_kind`, `signals`. |

## Sources and trust criteria (recorded for audit)

- Qur'an: the frozen Tanzil passage records only, never typed.
- Sunnah: the hadith-api Arabic editions already used by the other browsers (Unlicense), cited to the collection and number.
- Books: only scans already registered in `docs/library/harvest-register.yaml` with a work and a source record; a scan whose edition is not identified is skipped (the Shama'il scans, for this reason).
- Juha: the introduction and anecdotes of *Nawadir Juha al-Kubra* (ed. Darwish al-Juwaydi), a modern edition of unknown copyright status: facts and short retellings in the museum's own words, excerpts within 40 words. The introduction's claims are attributed to the editor, and where it contradicts itself (Nasreddin Hoca's dates) both statements are given.
- Wikipedia is not used for prose.

## Next

1. Download, OCR and mine Ibn al-Jawzi's *Akhbar al-Hamqa wa-l-Mughaffalin* (chapter on Juha) and *Akhbar al-Ziraf wa-l-Mutamajinin*; al-Jahiz's *al-Bukhala'*; al-Khatib's *al-Tatfil*; al-Abi's *Nathr al-Durr*; volume 2 of *al-Mustatraf* (its chapters of anecdotes).
2. Match the Shama'il scans to an edition record and harvest the chapters on the Prophet's laughter and jesting.
3. Person records for Nu'ayman ibn Amr, Abu Dulama, Muzabbid and Habannaqa from the biographical dictionaries.
4. A human read of the Juha retellings and the translations.
