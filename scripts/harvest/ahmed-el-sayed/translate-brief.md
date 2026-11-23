# Translation brief: one episode's claims into Urdu, French and Spanish (lane `ahmed-el-sayed`)

You translate a checked claims file (see `claims-brief.md`) so the museum's record of one lecture can ship in all five languages. English is the pivot: translate **from the English fields**, never from the Arabic, and never add or drop a claim.

## Input and output (outside git)
- Input: `~/islam-museum-harvest/ahmed-el-sayed/claims/epNN.json` (read all of it) and its ledger row in `harvest/ahmed-el-sayed/ledger.tsv` (`title_ar`, the lecture's title as published).
- Output: `~/islam-museum-harvest/ahmed-el-sayed/claims/epNN.tr.json`:

```json
{
  "episode": 1,
  "title": {"en": "...", "ur": "...", "fr": "...", "es": "..."},
  "summary": {"ar": "...", "ur": "...", "fr": "...", "es": "..."},
  "sections": [
    {"topic_ur": "...", "topic_fr": "...", "topic_es": "...",
     "claims_ur": ["..."], "claims_fr": ["..."], "claims_es": ["..."]}
  ]
}
```
- `title`: the lecture's title in English, Urdu, French and Spanish, translated from `title_ar` (the part after the series name and number; do not repeat the series name). Plain words, no quotation marks.
- `summary.ar`: write the episode summary in Arabic from `summary_en` (the museum's Arabic is written first, so make it natural Modern Standard Arabic). `summary.ur/fr/es`: translate `summary_en`.
- `sections`: exactly as many entries as `sections` in the claims file, in the same order, and for each section `claims_ur`, `claims_fr` and `claims_es` have exactly as many entries as `claims_en`, in the same order. A claim keeps its attribution ("He says that ...").

## Rules
1. Faithful and plain: say what the English says. No added facts, no softening, no adding the translator's views. Names: use the usual spelling of the language (Urdu in Urdu script; French and Spanish use the standard transliteration of Arabic names already used in the English, for example Abu Talib, Khadija).
2. No honorifics typed in any language (no phrase after a prophet's or Companion's name, none of the symbols or abbreviations that stand for them).
3. No quotation marks of any kind, no Qur'an or hadith wording; the claims already describe, not quote.
4. In Urdu, a parenthetical that contains Urdu or Arabic script is written `⁦(…)⁩`: U+2066 before the opening parenthesis and U+2069 after the closing one. Avoid parentheses where you can.
5. Machine-translation tier: you are an AI model; do not state otherwise anywhere in the text.
6. Write the file, then run `python3 -I scripts/harvest/ahmed-el-sayed/check_tr.py ~/islam-museum-harvest/ahmed-el-sayed/claims/epNN.json ~/islam-museum-harvest/ahmed-el-sayed/claims/epNN.tr.json` and fix every problem until it reports 0 problems; run it again after your last edit. Reply in one or two lines. Do not paste the file.
