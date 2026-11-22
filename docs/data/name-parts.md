# Structured names on person records (`name_parts`)

Approved by the founder on 21 November 2026 (chat), after the research file on classical Arabic names. It is an additive, optional field on `class: person`: no record needs it, none is invalid without it, and existing `names:` entries stay as they are (golden set).

## Why

A classical Arabic name is not a first name plus a surname. It can record a given name, a parental designation, a line of descent, an epithet, one or several affiliations and the name by which the person is known. The museum stores those elements as data, each with its own sources and certainty, so that a page can show them and a reader can follow a nisba to a place, tribe, occupation, dynasty or school.

## Shape

```yaml
name_parts:
  ism:      [{ value: "عبد الرحمن", translit: "Abd al-Rahman", sources: [source/...] }]
  kunya:    [{ value: "أبو زيد", translit: "Abu Zayd" }]
  nasab:    [{ value: "بن محمد بن محمد", note: "The chain as the sources give it" }]
  laqab:    [{ value: "ولي الدين", meaning: { en: "Guardian of the religion", ar: "..." } }]
  khitab:   []          # honorific titles ending in al-Din, al-Dawla, al-Mulk
  nisba:    [{ value: "الحضرمي", link: place/hadramawt, link_kind: place, certainty: attested }]
  ancestral: [{ value: "ابن خلدون", note: "Khaldun was an ancestor, not the father" }]
  shuhra:   { value: "ابن خلدون" }     # the name by which the person is known
  spellings: ["Ibn Khaldun", "Ibn Khaldoun"]
  variants: [{ value: "...", sources: [source/...], certainty: disputed }]
```

Every element is an array, so a person can have several kunyas or nisbas. Each element may carry:

- `value` (required) and `lang`, the text in the language it is written in;
- `translit`, a transliteration, and `meaning`, a localized gloss;
- `certainty`: `attested` (default), `disputed` or `uncertain`;
- `sources`: source records that attest this element;
- `link`: a record id, with `link_kind` (place, tribe, occupation, dynasty, school, ancestor, other). **A link never asserts birth in a place or biological descent from a tribe.** It says only that the name element refers to that record. A nisba shows an association.
- `note`.

`validate` checks that every cited source and every link exists. `names:` (kind full, given, kunya, nasab, nisba, laqab, ...) remains for plain listings; `name_parts` is where sourced structure goes.

## Where it comes from

The structure follows the classical onomastic literature and the library authority-record practice described in the research summary supplied by the founder (Schimmel, *Islamic Names*; Sublet, *Le voile du nom*; Beeston, *Arabic Nomenclature*; the Bibliotheque nationale de France guidance; Onomasticon Arabicum). The summary's own caution applies: its references are starting points, so every record that uses `name_parts` cites its own sources.

## Not done yet

The site does not display `name_parts` yet and the API exports it as part of the person record. A display component (a name card on the person page) is a separate change.
