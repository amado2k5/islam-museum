# Library lane: Kitab al-Sunna of Ibn Abi Asim

**Worker:** Claude Code (OCR-harvest worker C), run `ocr-harvest-2026-11-04` (second run).

## Items and editions
| item | what it is | md5 (book.txt) | PDF pages | used as |
|---|---|---|---|---|
| `20250919_20250919_1821` | al-Maktab al-Islami, 1st ed. 1400/1980, with al-Albani's *Zilal al-Janna*, parts 1 and 2 in one scan | e7029906… | 687 | `source/sunna-ibn-abi-asim-albani-1400` — printed = PDF throughout |
| `k-459` | *al-Kamil fi Taqrib Kitab al-Sunna li-Ibn Abi Asim*, a modern abridgement without chains (Silsilat al-Kamil); OCR heavily spaced | 2a2bbf50… | 364 | not used |

## Done (4 Nov 2026), batch 1
Read: pp. 1–8, 307–317 (part 1 contents), 321–323, 336, 360 (the Basin), 545–550 (caliphate of Abu Bakr), 604–605, 657–687 (part 2 contents).
- New source: `sunna-ibn-abi-asim-albani-1400`.
- New: `work/kitab-al-sunna-ibn-abi-asim`, `concept/al-hawd` (eschatological Basin; `concept/hawd-basin-water` is the fiqh term for a water tank).
- Enriched: `question/did-the-prophet-indicate-abu-bakr-as-successor` (Ibn Abi Asim's chapter with al-Albani's gradings; a perspective and a section in ar/en/ur).

## Flags
- `work/kitab-al-sunna` (Wikidata Q120447507, draft, unnamed author) could not be identified offline (Wikidata unreachable from this session); it may be this book or another "Kitab al-Sunna". Not merged; to be checked.
- The person page `person/ibn-abi-asim` stays thin: this edition has no biography of the author.

## Next
The chapters on the Kharijites (p. 438), the Rafida (p. 474), irja' (p. 461), the vision of God and the attributes (part 1), intercession (pp. 364–414).

## Duplicate check (4 Nov 2026, third run, worker C)
`work/kitab-al-sunna` (Devin wikidata-import-wave2 draft: label «كتاب السنة» only, no author, no prose, source `al-aalam` without a page, Wikidata Q120447507) was compared with `work/kitab-al-sunna-ibn-abi-asim`. Nothing in the draft's own record (no author, date, edition or page) ties it to Ibn Abi Asim rather than to the other works of the same title in the graph (`work/al-sunnah-ibn-hanbal` for Abd Allah ibn Ahmad, `work/kitab-al-sunnah-khallal`, and others not yet carded such as al-Marwazi's). It has no inbound links (the links in `question/did-the-prophet-indicate-abu-bakr-as-successor` and `concept/al-hawd` already point to the Ibn Abi Asim record). **Not merged**: it is not clearly the same book. Resolving it needs the Wikidata item's author statement checked against a recorded revision.
