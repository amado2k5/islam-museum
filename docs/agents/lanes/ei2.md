# Lane `ei2`: the Encyclopaedia of Islam, 2nd edition, all entries

_Approved by the founder on 24 October 2026 (scope B: all entries, A to Z, volume by volume; language order as below). Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`, `docs/sources-policy.md`._

## Mission

Turn the entries of the Encyclopaedia of Islam, 2nd edition (Brill, 1954–2008, 13 volumes; the item `ei2-complete` on archive.org) into museum records. Reuse first: an entry whose subject already has a record gets the encyclopaedia as an extra source and its own claims; a new record is created only when nothing exists. Each entry is read in full and written in rich first-pass prose, as `content/*/` requires.

## Language order (founder decision, 24 Oct 2026)

- The encyclopaedia is English-original. Its prose is drafted **in English first, directly from the text**, so that its meaning and its authored detail survive.
- The English draft is then translated **into Arabic** (the canonical Arabic prose, `content/ar/`) and **into Urdu** (`content/ur/`, translated from the Arabic).
- The Arabic-first rule of `docs/language.md` still applies to any source that is Arabic-original. This exception applies only to sources not written in Arabic.
- Front matter for this lane: `source_lang: en` on `content/en/` and on the translations too, with the translator recorded.
- Recorded as a policy amendment in `docs/status.md`; `docs/language.md` is unchanged until the founder amends it.

## Source and rights

- Source entity: `source/encyclopaedia-of-islam-2` (`data/source/encyclopaedia-of-islam-2.yaml`). Brill copyright, not verified as public domain. Facts and rewritten prose enter the repository; the text never does, beyond quotations of 40 words or fewer.
- Citation: `{cite:encyclopaedia-of-islam-2 vol. N p. M}`. `M` is the **PDF page** of that volume's file (vol. 5 is `vol. 5.1`, `5.2`, `5.3`), not the printed page. The source's reliability note says so.
- Harvest workspace, outside git: `~/islam-museum-harvest/raw/library/encyclopaedia-of-islam-2/` (the 15 PDFs, checksummed) and `~/islam-museum-harvest/books/encyclopaedia-of-islam-2/<stem>/` (Apple Vision OCR: `pages.json`, `book.txt`, `meta.json`).

## Tools (scripts/harvest/encyclopaedia/)

1. `ocr_ei2.py`: Apple Vision OCR of every page (en-US, accurate, 200 dpi), resumable, two-column reading order. Run under caffeinate: `caffeinate -i uv run --quiet --with pymupdf --with ocrmac python scripts/harvest/encyclopaedia/ocr_ei2.py [stem ...]`.
2. `split_entries.py <volume-dir>`: splits a volume into entries (`entries.jsonl`: headword, cross-reference flag, page range, author signature, text). A headword is a capitalised word followed by a comma or a bracket; an entry ends at its author signature, e.g. `(V. MINORSKY)`. Cross-references (`[see ...]`) are recorded as aliases, never written as entities.

The splitter output is checked by reading each entry before it is written. Its noise (running heads, bibliography abbreviations) is skipped by hand, and every skip is noted in the batch.

## Batch rules

- At most 25 entities per commit. Batches follow the volume order (vol. 1 A–B, vol. 2 C–G, …), and within a volume the printed order.
- For each batch: (1) search `data/` by Arabic and by ASCII name for every headword, and read the existing record; (2) write a claims table in the harvest workspace (claim, volume and PDF page, quote of 40 words or fewer, target entity); (3) write the English prose, every fact cited; (4) translate to Arabic, then Urdu; (5) run the checks; (6) update the progress file.
- Every record: `label.ar`, `summary.ar` (required), `summary.en`, `summary.ur`, `sources: [source/encyclopaedia-of-islam-2, …]`, `provenance` (`layer: own-research`, the entry's volume and PDF pages, `generated_by`, `run: ei2-batch-<n>`), `status: { review: published }`.
- Contested entries (Shi'i, Ibadi, Isma'ili or Zaydi topics, polemical or Orientalist positions, the Sunni frame of the museum) carry `perspectives` in the order the content standards set: Sunni position first where one exists, then the academic view, then other views, each labelled and cited, no verdict.
- Where the encyclopaedia's own view is the only one, it is attributed to the author's signature (e.g. "V. Minorsky writes…") and not presented as the museum's.
- Birth and death dates with secondary accounts: where sources give different dates, keep the primary account in the `born` or `died` field and its source in that field's `sources`. Save the secondary account in the field's `note`, with its own citation to the source that gives it (for example `{cite:encyclopaedia-of-islam-2 vol. 1 p. 290}`). Save both; never drop one to make the record agree.
- Skip-and-log: an entry that is only a cross-reference, a bibliography line, a list of contributors or an OCR artefact is logged in the progress file with the reason, never forced into a record.

## Checks before each push

`npm run validate && npm test && npm run cite-check -- <ids>`, then `npm run coverage` in the same commit as any entity change, then a pull request, merged once green. `npm run build` is not needed for content-only batches; run it if a site file changes.

## Overlap

Existing records were written from other sources (for example `place/abadan`, `place/abar-qubadh`, `place/abaskun`, `building/jameh-mosque-of-abarkuh`). The lane reads each one, keeps its existing sources and facts, and adds the encyclopaedia as an additional source with its own dated claims. A conflicting date or number is a second claim with `status: debated`, never an overwrite.

## Queue

Batch 1: the first real entries of volume 1, in printed order from ABADAH (see the progress file for the list). Later batches follow the same order, volume by volume, until volume 13 (Index) is used for alias and checking work only.
