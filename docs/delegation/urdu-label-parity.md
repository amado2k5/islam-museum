# Urdu label and prose parity — enrichment task (important)

_Raised 17 Nov 2026 from the founder's question "is the site fully trilingual". The site runs trilingual everywhere (ar/en/ur routes, exact i18n parity of 6,112 keys per language), and prose is ~99.4% covered — but the Urdu label layer is not. Per the standing rule "Arabic first, English and Urdu always" (`AGENTS.md`), every record's `label.ur` and `summary.ur` should be enriched and equalized with `ar`/`en`._

## Measured state (17 Nov 2026, 78,612 `data/` records)

| Gap | Count | Notes |
|---|---|---|
| `label.ur` missing | **47,549 (60%)** | the structural gap — Urdu views fall back to `en`/`ar` names |
| `label.en` missing | 778 | mostly person/place records |
| `label.ar` missing | 7,687 | almost all legitimate `wikipedia-*-en` source stubs |
| `summary.ur` missing | ~same order as `label.ur` (verify per record) | |
| Missing `content/en/` prose | ~190 files | concentrated: `concept` (~114), `event` (57), `person` (10), `place` (7) |
| Missing `content/ur/` prose | ~200 files | same classes plus `building`, `object`, `journey` |

## Scope of work

1. **Urdu labels first** — `label.ur` for the ~47.5k records that lack it. Urdu labels for named entities are usually the established Urdu exonym or a faithful transliteration; translate descriptive labels (tombs, works, concepts) rather than transliterating. Do not machine-fill `summary.ur` without the summary content — a wrong summary is worse than a fallback.
2. **Prose backfill** — the ~200 missing `content/en/` and `content/ur/` files, worked top-down by class (`concept`, `event`, `person`), each with the `provenance` block and `status.review: draft` until a human reads them.
3. **`label.en` tail** — the 778 records missing `label.en`.
4. Excluded: `wikipedia-*`/`wikidata-*` source stubs and other meta-classes where a label in the source language is correct.

## Rules that apply

- Urdu is written in Arabic script with Urdu conventions (e.g. ے, ہ, ٔ, Arabic-script parentheses wrapped U+2066…U+2069 like Arabic).
- No honorifics typed anywhere (the UI renders them).
- AI-generated translations carry `provenance` and ship `status.review: draft` per `docs/agents/publication-standard.md`.
- Work the list top-down by reader reach (inbound links), same ranking convention as `docs/delegation/empty-records-priority.md`.

## Why it matters

Urdu is the museum's third publishing language and the largest readership it serves natively; 60% of records falling back to English names is the largest single language gap in the graph. The comparable Arabic/English gaps are an order of magnitude smaller.
