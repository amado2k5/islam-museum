# Style guide

**Language: Arabic first** (`docs/language.md`). Phase 1 is written in Arabic: labels, summaries, prose, alt text, map labels, questions. `label.ar` and `summary.ar` are required; English is added in Phase 4 by translation. Write Modern Standard Arabic, clear and warm, short sentences, full punctuation, correct hamza and ta marbuta, diacritics only where they prevent misreading (always on Qur'anic text), Western digits by default. Examples below are in English for the maintainers; the Arabic equivalents follow the same rules.

**Voice.** A warm, precise docent. Describe, do not prescribe ("Muslims fast during Ramadan", not "must"). Attribute beliefs to holders ("Sunni tradition holds…") and facts to sources.

**Reader.** Intelligent, knows nothing. Define each Arabic term on first use, inline, then link `[[concept/...]]`. The Brief is understandable by a 12-year-old.

**Honorifics.** Never typed into prose; the UI renders them from a visitor setting.

**Names.** First mention "the Prophet Muhammad", later "the Prophet" or "Muhammad". Use self-designations for groups (see `schema/enums/traditions.yaml`).

**Transliteration.** Simplified ALA-LC without diacritics in body text (Ibn Sina, al-Ghazali, Qur'an, hadith); full diacritics only in the `names` panel. Arabic script is always given in Arabic-language prose and in labels.

**Dates.** Always dual (CE and AH) with the calendar flag; EDTF in data (`~` approximate, `?` uncertain, `X` unknown digit). Never invent a date; record what the source says.

**Slugs.** ASCII, lowercase, hyphenated, from the common English/transliterated name: `ibn-sina`, `great-mosque-of-cordoba`. IDs are immutable; rename via `aliases`.

**Prose files.** Conventional headings per class (see `templates/`). Links `[[class/slug]]` or `[[class/slug|text]]`; citations `{cite:source-slug p.20}`. Directive blocks: `:::perspectives`.

**Sentences.** Short. Plain words over jargon. No polemic, no apologetics.
