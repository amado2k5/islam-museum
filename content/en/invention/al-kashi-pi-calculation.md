---
id: invention/al-kashi-pi-calculation
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b60", source: "Arabic translation from actual MacTutor/Okten TDV/Iranica; modern finite-polygon explanation, not original Muhitiyya transcription" }
---

## Summary

A small drawing cannot establish sixteen decimal places. [[person/al-kashi|Ghiyath al-Din al-Kashi]]'s achievement in the [[work/risala-muhitiyya-kashi|Treatise on the Circumference]] was careful computation, not measuring a circle with a larger compass. MacTutor dates the work to 1424 and describes expressing twice the circumference-to-diameter ratio in sexagesimal and decimal forms with high precision. This improved an inherited calculation; it did not discover pi {cite:kashi-mactutor Circumference treatise}.

Our record concerns a numerical method within geometry and astronomy. Earlier circles and polygons do not disappear behind the author's name, nor does his result establish invention of decimal fractions. We explain bounds through a small modern example, separating it from historically reported output. We have not read the original manuscript or transcribed its calculation line by line {cite:kashi-mactutor decimal predecessors} {cite:iranica-kashi polygon computation}.

## What it is

Pi is circumference divided by diameter in ordinary plane geometry. Twice pi is the circumference of a unit-radius circle: confusing them doubles the answer incorrectly. Okten reports al-Kashi's decimal value 6.2831853071795865, an approximation to twice the ratio, not pi itself, together with a sexagesimal representation {cite:tdv-kashi-okten mathematics}.

This is not a finite expression equal to an infinite expansion. It is an approximation whose precision depends on controlling errors in roots, multiplication and division. Iranica describes polygons inside and around a circle, while MacTutor emphasizes the output in two numeral systems. Shape geometry and computational skill meet here; displaying a long number without explaining its meaning is insufficient {cite:iranica-kashi polygon computation} {cite:kashi-mactutor Circumference treatise}.

## The world before it

Circle problems and approximations preceded al-Kashi. Iranica connects his treatise with improving approximations used in astronomy and acknowledges older traditions. Geometry did not begin again in 1424, nor is merely drawing a polygon inside a circle his personal invention. The bounded contribution is the computational work and precision attained {cite:iranica-kashi As Mathematician and Astronomer}.

MacTutor also places decimals and root extraction within earlier work, including al-Karaji's school and al-Samawal. “Used fractions skilfully” must not become “invented all decimal fractions.” Nor does chronological comparison with later European results prove their authors read him. Earlier occurrence and documented textual transmission are different claims {cite:kashi-mactutor decimals and root methods}.

## The story

The sources describe a career from the Kashan environment to Samarkand, but the biographical details have unequal certainty. MacTutor estimates birth around 1380; Iranica discusses about 1386, inferred by assuming an age at the 1406 observation. We neither combine these into an invented birthday nor hide an estimate's character behind a familiar date {cite:kashi-mactutor biography} {cite:iranica-kashi Life}.

Ulugh Beg's scholarly environment offered support for astronomy and calculation. MacTutor dates the Muhitiyya to July 1424 and the Key to Arithmetic to 1427: different works. Studies also differ about stages of observatory construction. A building date cannot date every book or scholar's arrival. Our record uses only the treatise's year, without a guessed day or Hijri conversion {cite:kashi-mactutor Samarkand and works} {cite:iranica-kashi Life}.

## The maker(s)

MacTutor individually identifies al-Kashi as an Islamic mathematician. This is the recorded Muslim basis, not his name or family origin. The Sunni frame is separately the museum's default in the documented Timurid milieu, not a certificate of personal school or an inference from Ulugh Beg's religion. The scholarly biographies read here give no contrary personal sect attestation; silence is not a detailed creed biography {cite:kashi-mactutor summary} {cite:tdv-kashi-okten biography}.

He is an improver of computation. Qadi Zada, Ulugh Beg and other scholars shared the intellectual setting, but that does not establish co-authorship of every calculation in the Muhitiyya. Letters to his father rank colleagues' abilities; those are his assessments, not an objective league table announced by the museum {cite:iranica-kashi letters and scientific environment}.

## How it works

Imagine a unit-radius circle. A regular polygon with vertices on its circumference takes a shorter route; a surrounding tangent polygon takes a longer route. Halving their perimeters gives lower and upper bounds for pi. This modern explanation illustrates Iranica's description of polygon bounds; it does not reproduce al-Kashi's symbols or proof order {cite:iranica-kashi polygon computation}.

Call the number of sides n and the inscribed side length s. Our lower bound is `L=n*s/2`; the upper is `U=L/sqrt(1-s*s/4)`. For a hexagon s=1, giving L=3 and U approximately 3.464102. We do not need pi's long decimal expansion first: sides and radii yield geometric relations expressible through square roots.

Bisecting the central angle doubles the side count. Our explanatory recurrence is `s_new=s/sqrt(2+sqrt(4-s*s))`. Twelve sides give a lower bound about 3.105829 and upper about 3.215390. The interval remains broad but is narrower than the hexagon's. These are freshly checked modern numbers, not cells read from the Muhitiyya.

Continuing to 96 sides gives approximately `3.141032 < pi < 3.142715`. This cannot establish the historically reported long precision. It teaches narrowing an interval rather than announcing an exact answer. Every finite polygon remains a polygon; the accompanying two-hexagon picture neither reproduces the historical computation's full sequence nor its scale.

The equivalent expression `sqrt(2-sqrt(4-s*s))` subtracts nearly equal quantities when the side becomes small. We choose the first form for our modern example to reduce numerical cancellation. This is a contemporary computational explanation, not language or computer architecture attributed to a fifteenth-century scholar. A finite-precision machine demonstration does not independently certify every historical digit.

Sexagesimal and decimal notation express fractional quantities using different place values. Okten prints `6;16,59,28,1,34,51,46,15,50` and `6.2831853071795865`: after the sexagesimal separator, positions have denominators 60 and its powers. Converting a rounded quantity between bases or dividing it by two does not create information absent from the original calculation {cite:tdv-kashi-okten mathematics}.

However, checking the literal printed sequence reveals a discrepancy: it converts to approximately `6.2831853071795924`, not the accompanying decimal. We flag the mismatch without guessing a correction to a historical digit. Without reading the original, we cannot locate the error in transmission, typography or elsewhere. Reported high precision and verification that these two printed lines agree are different matters {cite:tdv-kashi-okten mathematics}.

## The spread

MacTutor describes al-Kashi's work remaining long unknown in Europe and later receiving nineteenth- and twentieth-century historical study. Okten lists Paul Luckey's German study and translation of the Circumference, published in 1953. This documents scholarship and publication, not direct transfer of every numerical technique to every European compared with him {cite:kashi-mactutor conclusion} {cite:tdv-kashi-okten work6}.

The Circumference must also be distinguished from the Key's use as a teaching text. Okten describes the larger textbook's reception and translations of parts, not identical circulation for this shorter treatise. We cannot borrow every sign of the Key's popularity as evidence for every Muhitiyya page or draw a certain map from only a general reception account {cite:tdv-kashi-okten work7}.

## What it was built on

The method needs circle and triangle relations, roots and fractional-place arithmetic. The biographies emphasize al-Kashi's combination of geometry and computation while distinguishing earlier decimal and root work. This does not identify a particular museum book behind every step; the precursor remains a sourced general description rather than an invented causal edge {cite:kashi-mactutor mathematical contributions}.

Astronomy helps explain the concern with precision, but the treatise is not merely an observation table. A computed ideal figure differs from a physical instrument affected by materials and movement. Iranica describes concern about large instruments warping: geometric, numerical and material accuracy are related without being identical {cite:iranica-kashi instruments and practical precision}.

## What was built on it

Al-Kashi's works address several problems: the Khaqani Zij updates earlier astronomy; the Key teaches arithmetic; the Chord and Sine treats another computation; instruments perform other tasks. These are not interchangeable titles for the Muhitiyya. Sine-one-degree precision does not belong to a circumference table, nor do numerous titles automatically justify multiplying one contribution into many records {cite:tdv-kashi-okten works} {cite:kashi-mactutor sine treatise}.

We document a bounded achievement for later study and comparison. Not every modern program computing pi becomes its descendant. Sharing a mathematical target does not prove inheritance of a particular algorithm. An old geometric procedure likewise does not become an infinite series or modern method merely because it produces a quantity we now know more precisely.

## Impact on daily life

MacTutor describes the Key's intended applications in astronomy, surveying, architecture, accounting and trade. That places calculation in a practical intellectual setting, but it does not measure effects of the Muhitiyya. We have no record showing how many buildings or transactions changed because of its sixteenth decimal place specifically {cite:kashi-mactutor Key to Arithmetic}.

The supported effect is improved computational capability and expressing a precise result in two systems. More digits do not mean every everyday task needs them or every contemporary instrument measures the world to that precision. Teaching can distinguish “calculable” from “measurable” without inventing savings or beneficiary counts that the sources do not supply {cite:tdv-kashi-okten mathematics}.

## How it changed history

The biographies describe a notable medieval computational achievement; MacTutor compares its precision with earlier and later results. We retain this as a historical account, not our independent certificate that every civilization and lost text has been searched. The achievement does not require deleting earlier Greek, Chinese or Islamic computations {cite:kashi-mactutor Circumference treatise}.

Recording sexagesimal and decimal output also shows movement between arithmetic tools within one work. MacTutor emphasizes using decimal fractions for quantities such as pi, not only algebraic-root approximations. This is a development in numerical practice, distinct from inventing the modern decimal point, every concept of real number or a direct route to a named European {cite:kashi-mactutor decimal contributions}.

## Who invented it?

Al-Kashi authored the calculation associated with this treatise, not the circle or every approximation to its ratio. The attribution is therefore improvement, not absolute origin. MacTutor explicitly qualifies decimal and root priority claims by considering predecessors. We do not import stronger claims merely to make the headline more exciting {cite:kashi-mactutor priority qualifications}.

The numerical unit is equally important: `6.2831853071795865` approximates twice pi. Decimal places are not sexagesimal positions. Halving rounded output can display an extra digit without new accuracy. Approximation, truncation and rounding are different operations; repeating “sixteen places” or showing a handsome diagram establishes none of them independently {cite:tdv-kashi-okten mathematics}.

## Today

The small example teaches bounds, accumulated error and a more stable expression. These are modern explanatory tools, not a documented reconstruction from the first manuscript. An exact historical algorithm requires reading a specified witness or edition and identifying its notation, not filling gaps with present-day programming knowledge.

Urutseg's 2009 image shows two circles with an inscribed and a circumscribed hexagon. Commons identifies this as modern simple geometry in the public domain, not a Samarkand painting. It contains neither millions of sides nor al-Kashi's digits. Separating illustration from evidence lets readers use what the picture actually explains without imagining what it does not show {cite:commons-archimedes-pi-urutseg Description and history}.

## Surviving examples

Okten names Luckey's edition and German translation and describes several other works preserved in manuscripts. We have not read the original Muhitiyya or German edition and do not present output as a transcription from a viewed page. Our references are the works actually consulted; the numerical result is reported through them with the numeral systems distinguished {cite:tdv-kashi-okten works6–8}.

Letters to his father offer a different window onto scientific life. Iranica discusses their value, self-praise and competition; they are neither an impartial inventory of colleagues' abilities nor substitutes for reading the arithmetic work. A different book's copy date cannot date the Muhitiyya, and a surviving title alone cannot establish one shared witness {cite:iranica-kashi letters and works}.

## In culture

Long numbers attract attention, but al-Kashi's story is not a digit-memorizing contest. The sources depict a scholar writing to his father, seeking support and working among colleagues and at court. Ulugh Beg's praise remains its speaker's judgement, not a museum verdict that every one of al-Kashi's opinions surpassed all rivals {cite:kashi-mactutor biography and patronage} {cite:iranica-kashi Life}.

Iranica distinguishes computational and instrument skill from the limits of known contributions to cosmological planetary theory. This does not belittle arithmetic: astronomy has several fields, and distinction in one does not automatically prove every achievement in all. A historical scholar is more than a famous number and less than a hero credited with everything {cite:iranica-kashi concluding assessment}.

## For young readers

Look at the circles and hexagons. Which has corners on the circumference, and which has sides touching the circle from outside? Draw a shorter and longer paper path and write “the answer lies here” between them. This is a bounds activity, not measuring sixteen decimal places from a small picture or exactly reenacting al-Kashi's work.

Does writing more digits make an answer correct? Write a short estimate and explain its limits rather than adding unsupported numbers. No instrument-building or sky observation is required. Paper and a question are enough. A slightly imperfect drawing also demonstrates why a picture that explains differs from a mathematical relation that proves.

## References

- {cite:kashi-mactutor complete biography}
- {cite:tdv-kashi-okten complete entry}
- {cite:iranica-kashi complete article body}
- {cite:commons-archimedes-pi-urutseg Description licence and history}
