# البتاني — Hudhud quest dossier

**Historical review pending.** Read from museum records at `data/` commit `52cc0fc46b36265077e9109bc1205548b2bc7a8a`. Research handoff, not game text or approval.

## Records read

- `person/al-battani`
- `place/antioch`
- `place/baghdad`
- `place/harran`
- `place/qasr-al-jiss`
- `place/raqqa`
- `work/al-zij-al-sabi`
- `work/de-motu-stellarum-plato-tiburtinus`

## Arabic cross-check

Machine presence/citation check only, not a translation review:

- `person/al-battani`: English prose present (12 sections, 52 citations); Arabic prose present (12 sections, 52 citations).
- `place/antioch`: English prose present (3 sections, 5 citations); Arabic prose present (3 sections, 5 citations).
- `place/baghdad`: English prose present (38 sections, 99 citations); Arabic prose present (38 sections, 99 citations).
- `place/harran`: English prose present (5 sections, 10 citations); Arabic prose present (5 sections, 14 citations).
- `place/qasr-al-jiss`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `place/raqqa`: English prose present (4 sections, 10 citations); Arabic prose present (4 sections, 14 citations).
- `work/al-zij-al-sabi`: English prose present (13 sections, 51 citations); Arabic prose present (13 sections, 51 citations).
- `work/de-motu-stellarum-plato-tiburtinus`: English prose present (5 sections, 12 citations); Arabic prose present (5 sections, 12 citations).

## Who, where, when

- **Who:** ar: البتاني. Record labels: `person/al-battani` en='al-Battani', ar='محمد بن جابر البتاني'; `place/antioch` en='Antioch', ar='أنطاكية'; `place/baghdad` en='Baghdad', ar='بغداد'; `place/harran` en='Harran', ar='حران'; `place/qasr-al-jiss` en='Qasr al-Jiss', ar='قصر الجس'; `place/raqqa` en='al-Raqqa', ar='الرقة'; `work/al-zij-al-sabi` en='al-Zij al-Sabi (The Sabian Zij)', ar='الزيج الصابي'; `work/de-motu-stellarum-plato-tiburtinus` en="De motu stellarum: Plato of Tivoli's Latin translation of al-Battani's Zij", ar='ترجمة أفلاطون التيفولي اللاتينية لزيج البتاني \u2066(في حركة النجوم)\u2069'
- **Where:** `place/antioch` (Antioch) coordinates `[36.201, 36.161]`, precision `locality`; `place/baghdad` (Baghdad) coordinates `[33.3406, 44.4009]`, precision `site`; `place/harran` (Harran) coordinates `[36.87083333333333, 39.025]`, precision `approx`; `place/qasr-al-jiss` (Qasr al-Jiss) coordinates `[34.2386, 43.835]`, precision `site`; `place/raqqa` (al-Raqqa) coordinates `[35.95, 39.01]`, precision `approx` Place relations read: place/raqqa through `person/al-battani` relation `lived_in`, confidence `unmarked`; relation in record | place/harran through `person/al-battani` relation `lived_in`, confidence `unmarked`; relation in record | place/antioch through `person/al-battani` relation `traveled_to`, confidence `unmarked`; relation in record | place/baghdad through `person/al-battani` relation `traveled_to`, confidence `unmarked`; relation in record | place/qasr-al-jiss through `person/al-battani` relation `died_in`, confidence `unmarked`; relation in record
- **When:** `person/al-battani` `died`: EDTF `0929`, Hijri `0317`, precision `year`, status `tradition`. Record note: توفي سنة 317هـ في قصر الجص عائدًا من بغداد ⁦(ابن النديم والقفطي)⁩؛ وفي وفيات الأعيان «قصر الحضر»، ويرى نالينو أنه تصحيف {cite:nallino-albatenii-opus-astronomicum p. 17} {cite:nallino-albatenii-opus-astronomicum p. 27}. `place/baghdad` `founded`: EDTF `0762`, precision `year`, status `historical`. Record note: Founded by al-Mansur in 762 CE (muruj al-dhahab p. 276-278; the infobox of the English Wikipedia article gives 30 July 762, not used here).

## What the records say they did

1. Al-Battani was a leading observer, geometer, and astronomer who corrected the motions of the Sun and Moon in his work Zij. — source location `content/en/person/al-battani.md — Summary`; citation `{cite:nallino-albatenii-opus-astronomicum p. 17} {cite:muruj-al-dhahab p. 519} {cite:muruj-al-dhahab p. 736}`; flag: **stated**.
2. Most information about Al-Battani comes from Ibn al-Nadim's Fihrist and al-Qifti's History of the Sages, with some additions from Sa'id al-Andalusi's Tabaqat al-umam. — source location `content/en/person/al-battani.md — The sources for his life`; citation `{cite:nallino-albatenii-opus-astronomicum p. 17} {cite:nallino-albatenii-opus-astronomicum p. 18} {cite:nallino-albatenii-opus-astronomicum p. 18} {cite:nallino-albatenii-opus-astronomicum p. 19} {cite:nallino-albatenii-opus-astronomicum p. 20}`; flag: **stated**.
3. Al-Battani's full name included Muhammad, Abu Abd Allah, and several nisbas indicating his origin and residence. — source location `content/en/person/al-battani.md — Name and lineage`; citation `{cite:nallino-albatenii-opus-astronomicum p. 21} {cite:nallino-albatenii-opus-astronomicum p. 19} {cite:nallino-albatenii-opus-astronomicum p. 21} {cite:nallino-albatenii-opus-astronomicum p. 22} {cite:nallino-albatenii-opus-astronomicum p. 23}`; flag: **stated as uncertain**.
4. Al-Battani likely learned from his father, Jabir ibn Sinan al-Harrani, a famous maker of astronomical instruments. — source location `content/en/person/al-battani.md — Upbringing and family`; citation `{cite:nallino-albatenii-opus-astronomicum p. 23} {cite:nallino-albatenii-opus-astronomicum p. 23}`; flag: **stated**.
5. Harran, Al-Battani's birthplace, was known for its pagan worship until the people called themselves Sabians to avoid persecution. — source location `content/en/person/al-battani.md — Upbringing and family`; citation `{cite:nallino-albatenii-opus-astronomicum p. 23} {cite:nallino-albatenii-opus-astronomicum p. 24} {cite:nallino-albatenii-opus-astronomicum p. 25} {cite:nallino-albatenii-opus-astronomicum p. 26}`; flag: **stated**.
6. Al-Battani conducted extensive observations in al-Raqqa, measuring the Sun's course and fixing solstices and equinoxes. — source location `content/en/person/al-battani.md — Observations at al-Raqqa and Antioch`; citation `{cite:nallino-albatenii-opus-astronomicum p. 26} {cite:nallino-albatenii-opus-astronomicum p. 26} {cite:nallino-albatenii-opus-astronomicum p. 26} {cite:nallino-albatenii-opus-astronomicum p. 17}`; flag: **stated as uncertain**.
7. Nallino dismisses the European claim that Al-Battani was a prince or king, noting his modesty and dedication to study. — source location `content/en/person/al-battani.md — Observations at al-Raqqa and Antioch`; citation `{cite:nallino-albatenii-opus-astronomicum p. 26} {cite:nallino-albatenii-opus-astronomicum p. 26}`; flag: **stated**.
8. Al-Battani was highly esteemed by his contemporaries, as evidenced by his interactions with notable figures and his reputation for accuracy. — source location `content/en/person/al-battani.md — Standing among his contemporaries`; citation `{cite:nallino-albatenii-opus-astronomicum p. 26} {cite:nallino-albatenii-opus-astronomicum p. 17}`; flag: **stated**.
## Thumbnail elements without record support

The atlas title is الرجل الذي قاس السنة. No record read supports the exact pictured scene, costumes, objects, people, weather, lighting or child-facing drama implied by the thumbnail. Because the source pictures are not available in this checkout, this dossier uses the atlas titles rather than visual inspection; the title itself is not treated as a historical claim. Treat those elements as design fiction unless a reviewer supplies support.

## Setting

`place/antioch` (Antioch) coordinates `[36.201, 36.161]`, precision `locality`; `place/baghdad` (Baghdad) coordinates `[33.3406, 44.4009]`, precision `site`; `place/harran` (Harran) coordinates `[36.87083333333333, 39.025]`, precision `approx`; `place/qasr-al-jiss` (Qasr al-Jiss) coordinates `[34.2386, 43.835]`, precision `site`; `place/raqqa` (al-Raqqa) coordinates `[35.95, 39.01]`, precision `approx` Place relations read: place/raqqa through `person/al-battani` relation `lived_in`, confidence `unmarked`; relation in record | place/harran through `person/al-battani` relation `lived_in`, confidence `unmarked`; relation in record | place/antioch through `person/al-battani` relation `traveled_to`, confidence `unmarked`; relation in record | place/baghdad through `person/al-battani` relation `traveled_to`, confidence `unmarked`; relation in record | place/qasr-al-jiss through `person/al-battani` relation `died_in`, confidence `unmarked`; relation in record Landscape, interiors, clothing and objects beyond the linked records would be invention pending review.

## Related museum records a quest could link to

- `person/al-battani`
- `person/jabir-ibn-sinan-al-harrani`
- `place/antioch`
- `place/baghdad`
- `place/harran`
- `place/qasr-al-jiss`
- `place/raqqa`
- `work/al-zij-al-sabi`
- `work/de-motu-stellarum-plato-tiburtinus`
- `work/kitab-marifat-matali-al-buruj-battani`
- `work/risalat-tahqiq-aqdar-al-ittisalat`
- `work/sharh-al-maqalat-al-arba-battani`

## Three candidate quest premises

These are proposals for Claude and the founder, not content. They are deliberately conservative system scaffolding, not final quest designs. Each names one of the twelve systems in `design.md`; forms such as Measure, Journal, Care and Sail are not treated as separate systems. Claim numbers refer to the claims above.

1. Children help align a practice instrument with a star, horizon or landmark using the Trace and Align system so a reading can be checked. This rests on claims [1, 2] as its evidence anchor; the practice instrument, landmark choice, reading puzzle and the children's role are game invention, not record fact.

2. A child helps compare accounts, objects or clues using the Observe and Match system to find what the evidence supports. This rests on claims [1, 3] as its evidence anchor; the compared materials, missing details, matching puzzle and the child's role are game invention, not record fact.

3. A child helps connect people, resources or pieces of knowledge so they reach where they are needed using the Network system. This rests on claims [1, 4] as its evidence anchor; the exact people or resources, missing links, network puzzle and the child's role are game invention, not record fact.

## Sensitivities

Evidence scan, not a ruling: none of the tracked war, illness/death, slavery or sect-dispute terms appears in the extracted evidence. Any such material still requires the full content-safety and age-appropriateness review. Do not add war, illness, death, slavery, sect or living disputes unless the reviewed record requires them and they are necessary, age-appropriate and non-spectacular. Literary traditions must be labelled as such. Invented dialogue must be explicit dramatized paraphrase, never a false quotation.

## Gaps

The museum does not yet hold enough reviewed setting, material-culture or chronology detail for a production quest. Reviewer specialty needed: history of science; architecture/material culture.
