# 63. Translating prose in bulk through Google Translate document files

Founder's instruction, 19 November 2026 (done on branch `release/spanish`, merged into `main` the same day; pull requests go to `main` only from then on): the remaining Spanish and French prose is
translated by uploading Word files to Google Translate's document translation in a browser, not by a local model and
not by a cloud AI model. This page records how it is done and what was measured, so no session has to find it out again.

Status of what this produces: machine translation, checked by script against its English source, **not read by a
human**. Every file names Google Translate in `translators` and `provenance` (`model: google-translate`).

## Why

Measured on 19 November 2026 on the founder's Mac:

| Method | Speed |
|---|---|
| Local model (TranslateGemma 27B, `scripts/local-mt/translate.py`) | about 4–5 English words per second per language |
| Google Translate, one Word file | about 1.1 million English words in about two minutes |

No model runs and no tokens are spent on the translation itself; an agent only builds the files, drives the browser
and imports the results.

## The round

One round is one English Word file, translated once into Spanish and once into French. Always from English.

1. **Build** — `python3 scripts/local-mt/build_gt.py --lang both --n <n> --bytes 2050000`
   writes `gt-<nnn>-en.docx` and `gt-<nnn>.json` (the map the importer needs) under
   `/Volumes/exmicroSD/islam-museum-local-mt/gt/`. It takes the records that have no file in either language, in the
   queue order of `translate.py`, and leaves out the held records (Qur'an passage pages, the firewall-exception
   records, records with reading-level sections, damaged English files), records another lane has taken
   (`fr-taken.txt`) and records that already failed (`logs/gt-<lang>.log.failed`). The founder released two of these held groups later: the Qur'an passage pages on 19 November 2026 (prose only, no verse text) and the firewall-exception records on 20 November 2026; a list of ids passed with `--ids-file` builds a file for them.
2. **Translate** — in the browser, `https://translate.google.com/?sl=en&tl=es&op=docs`: choose the file, Translate,
   Download translation. Then `sh scripts/local-mt/gt_round.sh got <n> es` (both downloads have the same name, so the
   first is moved aside). Repeat with `tl=fr` and `got <n> fr`.
3. **Import and ship** — `sh scripts/local-mt/gt_round.sh finish <n> 2050000` runs `import_gt.py` for both languages,
   validates (`npm run validate`, 0 errors; a record the validator refuses is set aside), commits, opens the pull
   request against `main` (it was `release/spanish` until 19 November 2026), merges it, writes one line per language to `gt/tracker.tsv`, deletes the
   uploaded and the downloaded files, and builds the next file.

Founder's rules for the browser step: wait at least one minute between uploads; if Google refuses a file, do not
retry it — report first; delete uploaded and downloaded files once both languages are merged.

## What the file looks like, and why

- Plain text, one Word paragraph per source line, no formatting, no images. Each record opens with a paragraph
  `#### n ####`; Google leaves it alone, so the file can be split back into records.
- What must survive verbatim (`{cite:…}`, `(needs_source…)`, code, URLs, bare `[[id]]` links) is replaced by a
  10-digit number in parentheses, `(8000000001)` for the first of a paragraph, and put back on import.
- A labelled link `[[id|label]]` becomes a **Word hyperlink** around the label (`w:hyperlink w:anchor="x1"`). Google
  translates the label and keeps the hyperlink; the importer reads the anchor and restores the id.

Measured on the same records, sent in all three styles in one file:

| Marker style for links | Spanish records intact | French records intact |
|---|---|---|
| Text tags `<x1>label</x1>` | 30 of 177 | 40 of 264 |
| 10-digit numbers around the label | 58 of 177 | 13 of 264 |
| Word hyperlink | 177 of 177 | 261 of 264 |

(Those were the hardest records, the ones that had already failed once. On ordinary files the hyperlink style passed
96–99% of records; the text tags passed 91% in Spanish and 63% in French after repair.)

## Limits found

- **Size is word volume, not megabytes.** Files of about 0.5, 1.09 and 1.2 million English words were accepted
  (1.0–2.3 MB of this compact text). Files of 1.6, 2.5 and 4.9 million words were refused with "Can't translate this
  file right now. Try again in a few minutes." Google's help page states 10 MB and, for PDFs, 300 pages; it states no
  word limit.
- **There is a usage limit.** After about fifteen files in ninety minutes a file that had just been accepted for
  Spanish was refused for French at once with "Can't translate this file right now. Try again later." Google
  documents no quota; how long it lasts was not measured.
- Bing Translator (`bing.com/translator`) takes text and images only, no documents (checked 19 November 2026).

## Checks on import

The same as the local translator (`check()` in `translate.py`): same wiki-link ids, same citation markers, same
headings and paragraph count, length ratio, no typed honorific, no Qur'an brackets, not left in English, no leftover
marker; plus: Markdown emphasis marks unchanged, and the Spanish Sunni label in the form the validator reads. The
fixed section headings (`En breve`, `Para los visitantes jóvenes`, …) are written by the importer, not by Google.
A record that fails is not written; its id goes to `logs/gt-<lang>.log.failed`.

## Arabic as the source: tested, not adopted

One test file (2,269 records, Arabic to Spanish, not imported). The markers survived in 2,233 records. In the samples
read, Google translated book titles as common words, dropped transliterated terms and spelt names differently from
the English-sourced records. The lane stays with English. This is a judgment from a few samples, not a measurement.

## Titles, summaries and other short texts inside data records

Added 20 November 2026. The prose flow above does not touch `data/`. The title, summary and other language blocks of a
record are filled by `scripts/local-mt/data_strings.py`: `build --lang <ur|fr|es>` writes Word files of about 950,000
English words holding only the texts that language lacks (a marker paragraph `#### n ####`, then the English);
`import --name <file> --docx <download>` checks each text and writes it as one new line in its record, re-reading the
record to prove nothing else changed; `names --lang <fr|es>` copies the English form of person names.

What it leaves alone: the title of a `source` record (bibliographic), and the Qur'an passage records
(`data/passage/quran-*.yaml`), which a commit guard freezes. What the machine gets wrong and the importer handles:
a blessing formula added after "the Prophet" (removed), Arabic text in brackets (wrapped in direction isolates), a
name left in Latin letters in Urdu (refused). Run `npm run validate` after an import: a transliteration can by chance
contain a blocked term, as one Urdu name did.

The Word files are uploaded by a person in an ordinary browser. On 19 and 20 November 2026 Google refused every upload
from the browser the agent drives ("Can't translate this file right now. Try again later") and accepted the same files
at once when the founder uploaded them by hand.
