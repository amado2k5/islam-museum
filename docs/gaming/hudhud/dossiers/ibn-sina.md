# Ibn Sina — Hudhud quest dossier

**Historical review pending.** Read from museum records at `data/` commit `52cc0fc46b36265077e9109bc1205548b2bc7a8a`. Research handoff, not game text or approval.

## Records read

- `person/ibn-sina`
- `building/avicenna-mausoleum-hamadan`
- `event/ibn-sina-leaves-for-gurgan-1012`
- `event/ibn-sina-service-at-rayy-1014`
- `event/ibn-sina-to-khuzistan-1030`
- `event/ibn-sina-vizier-hamadan-1015`
- `place/afshana`
- `place/bukhara`

## Arabic cross-check

Machine presence/citation check only, not a translation review:

- `person/ibn-sina`: English prose present (22 sections, 108 citations); Arabic prose present (22 sections, 109 citations).
- `building/avicenna-mausoleum-hamadan`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `event/ibn-sina-leaves-for-gurgan-1012`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `event/ibn-sina-service-at-rayy-1014`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `event/ibn-sina-to-khuzistan-1030`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `event/ibn-sina-vizier-hamadan-1015`: English prose absent (0 sections, 0 citations); Arabic prose absent (0 sections, 0 citations).
- `place/afshana`: English prose present (2 sections, 2 citations); Arabic prose present (2 sections, 2 citations).
- `place/bukhara`: English prose present (10 sections, 41 citations); Arabic prose present (10 sections, 41 citations).

## Who, where, when

- **Who:** en: Ibn Sina; ar: ابن سينا. Record labels: `person/ibn-sina` en='Ibn Sina (Avicenna)', ar='ابن سينا'; `building/avicenna-mausoleum-hamadan` en=None, ar=None; `event/ibn-sina-leaves-for-gurgan-1012` en='Ibn Sina travels west to Gorgan', ar='ابن سينا يرحل غربًا إلى جرجان'; `event/ibn-sina-service-at-rayy-1014` en='Ibn Sina enters Buyid service at Rayy', ar='ابن سينا في خدمة البويهيين بالري'; `event/ibn-sina-to-khuzistan-1030` en='Ibn Sina withdraws to Khuzistan', ar='ابن سينا ينتقل إلى خوزستان'; `event/ibn-sina-vizier-hamadan-1015` en='Ibn Sina becomes vizier to Shams al-Dawla at Hamadan', ar='ابن سينا وزيرًا لشمس الدولة بهمذان'; `place/afshana` en='Afshana', ar='أفشنة'; `place/bukhara` en='Bukhara', ar='بخارى'
- **Where:** `place/afshana` (Afshana) coordinates `[39.994444444444, 64.379166666667]`, precision `approx`; `place/bukhara` (Bukhara) coordinates `[39.7747, 64.4286]` Place relations read: place/afshana through `person/ibn-sina` relation `born_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/hamadan through `person/ibn-sina` relation `died_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/urgench through `person/ibn-sina` relation `lived_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/gorgan through `person/ibn-sina` relation `lived_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/hamadan through `person/ibn-sina` relation `lived_in`, confidence `medium`; Place link from Wikidata; pending a second source.
- **When:** `person/ibn-sina` `born`: EDTF `0980~`, Hijri `0370~`, precision `year`, status `historical`. Record note: Traditional date; his biography implies 980, some give 973. `person/ibn-sina` `died`: EDTF `1037-06`, Hijri `0428-09`, precision `month`, status `historical`. Record note: مات بهمدان يوم جمعة في شهر رمضان سنة ثمان وعشرين وأربعمائة وعاش ثلاثاً وخمسين سنة؛ اغتسل وتاب وتصدّق بما معه على الفقراء ورد المظالم وأعتق مماليكه وجعل يختم في كل ثلاثة أيام ختمة {cite:shadharat-dhahab p. 234}.

## What the records say they did

1. Abu Ali al-Husayn ibn Abd Allah ibn Sina, known as Avicenna, was a physician and philosopher born around 980 CE near Bukhara, with Persian origins. — source location `content/en/person/ibn-sina.md — Overview`; citation `{cite:shadharat-dhahab p. 234} {cite:farghani-elements-astronomy p. 420} {cite:gohlman-1974} {cite:shadharat-dhahab p. 234} {cite:assabile-tareq-al-suwaidan al-mubdioune/ep27 00:02:00} {cite:shadharat-dhahab p. 234} {cite:shadharat-dhahab p. 235} {cite:shadharat-dhahab p. 235} {cite:gutas-2014} {cite:shadharat-dhahab p. 234} {cite:encyclopaedia-of-islam-2 vol. 3 p. 973}`; flag: **stated**.
2. Ibn Sina authored nearly a hundred works, including the medical encyclopedia Qanun and the philosophical compendium Shifa', which were taught in European universities until the end of the seventeenth century. — source location `content/en/person/ibn-sina.md — Overview`; citation `{cite:shadharat-dhahab p. 236} {cite:gutas-2014} {cite:assabile-tareq-al-suwaidan al-mubdioune/ep27 00:17:00} {cite:gutas-2014} {cite:shadharat-dhahab p. 237}`; flag: **stated**.
3. Ibn Sina grew up in a city ruled by the Samanid dynasty and mastered the Qur'an and early sciences, then turned to logic, mathematics, and medicine. — source location `content/en/person/ibn-sina.md — Life`; citation `{cite:gohlman-1974}`; flag: **stated**.
4. After leaving Bukhara around 1002 CE, Ibn Sina worked as a physician and vizier at several courts in Iran, serving Ala al-Dawla in Isfahan before dying in Hamadan in June 1037 CE. — source location `content/en/person/ibn-sina.md — Life`; citation `{cite:gutas-2014}`; flag: **stated**.
5. Ibn Sina's life is well-documented, with his autobiography covering his first thirty years and al-Juzjani recording the rest, noting that Persian was his first language. — source location `content/en/person/ibn-sina.md — Life as the Encyclopaedia of Islam tells it`; citation `{cite:encyclopaedia-of-islam-2 vol. 3 p. 973} {cite:encyclopaedia-of-islam-2 vol. 3 p. 973}`; flag: **stated**.
6. By sixteen, Ibn Sina was directing famous physicians and had no teacher in natural sciences or medicine, though he found Aristotle's Metaphysics difficult. — source location `content/en/person/ibn-sina.md — Life as the Encyclopaedia of Islam tells it`; citation `{cite:encyclopaedia-of-islam-2 vol. 3 p. 973} {cite:encyclopaedia-of-islam-2 vol. 3 p. 973}`; flag: **stated**.
7. After his father's death, Ibn Sina entered administration and served as a minister, facing persecution from enemies and princes. — source location `content/en/person/ibn-sina.md — Life as the Encyclopaedia of Islam tells it`; citation `{cite:encyclopaedia-of-islam-2 vol. 3 p. 973} {cite:encyclopaedia-of-islam-2 vol. 3 p. 973}`; flag: **stated**.
8. Ibn Sina wrote his large works at night, often while moving, on horseback, or in prison, relying only on his memory. — source location `content/en/person/ibn-sina.md — How he worked`; citation `{cite:encyclopaedia-of-islam-2 vol. 3 p. 973}`; flag: **stated**.
## Thumbnail elements without record support

The atlas title is The Boy Who Healed a Prince / الطبيب الصغير. No record read supports the exact pictured scene, costumes, objects, people, weather, lighting or child-facing drama implied by the thumbnail. Because the source pictures are not available in this checkout, this dossier uses the atlas titles rather than visual inspection; the title itself is not treated as a historical claim. Treat those elements as design fiction unless a reviewer supplies support.

## Setting

`place/afshana` (Afshana) coordinates `[39.994444444444, 64.379166666667]`, precision `approx`; `place/bukhara` (Bukhara) coordinates `[39.7747, 64.4286]` Place relations read: place/afshana through `person/ibn-sina` relation `born_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/hamadan through `person/ibn-sina` relation `died_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/urgench through `person/ibn-sina` relation `lived_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/gorgan through `person/ibn-sina` relation `lived_in`, confidence `medium`; Place link from Wikidata; pending a second source. | place/hamadan through `person/ibn-sina` relation `lived_in`, confidence `medium`; Place link from Wikidata; pending a second source. Landscape, interiors, clothing and objects beyond the linked records would be invention pending review.

## Related museum records a quest could link to

- `building/avicenna-mausoleum-hamadan`
- `event/ibn-sina-leaves-for-gurgan-1012`
- `event/ibn-sina-service-at-rayy-1014`
- `event/ibn-sina-to-khuzistan-1030`
- `event/ibn-sina-vizier-hamadan-1015`
- `person/abu-abdallah-al-natili`
- `person/al-farabi`
- `person/al-ghazali`
- `person/ala-al-dawla-muhammad`
- `person/aristotle`
- `person/ibn-rushd`
- `person/ibn-sina`
- `person/thomas-aquinas`
- `place/afshana`
- `place/bukhara`
- `place/gorgan`
- `place/hamadan`
- `place/isfahan`
- `place/urgench`
- `work/al-isharat-wal-tanbihat`
- `work/al-qanun-fi-al-tibb`
- `work/kitab-al-shifa`

## Three candidate quest premises

These are proposals for Claude and the founder, not content. They are deliberately conservative system scaffolding, not final quest designs. Each names one of the twelve systems in `design.md`; forms such as Measure, Journal, Care and Sail are not treated as separate systems. Claim numbers refer to the claims above.

1. A child helps compare accounts, objects or clues using the Observe and Match system to find what the evidence supports. This rests on claims [1, 2] as its evidence anchor; the compared materials, missing details, matching puzzle and the child's role are game invention, not record fact.

2. A child helps connect people, resources or pieces of knowledge so they reach where they are needed using the Network system. This rests on claims [1, 3] as its evidence anchor; the exact people or resources, missing links, network puzzle and the child's role are game invention, not record fact.

3. A child helps gather careful answers from people affected by a small local problem using the Talk system before deciding what to do. This rests on claims [1, 4] as its evidence anchor; the speakers, dialogue, local problem, choice and the child's role are game invention, not record fact.

## Sensitivities

Evidence scan, not a ruling: illness/death. Any such material still requires the full content-safety and age-appropriateness review. Do not add war, illness, death, slavery, sect or living disputes unless the reviewed record requires them and they are necessary, age-appropriate and non-spectacular. Literary traditions must be labelled as such. Invented dialogue must be explicit dramatized paraphrase, never a false quotation.

## Gaps

The museum does not yet hold enough reviewed setting, material-culture or chronology detail for a production quest. Reviewer specialty needed: science and medicine; architecture/material culture.
