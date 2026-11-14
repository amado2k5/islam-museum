# Lane A2: al-Battani, al-Zij al-Sabi (Byblion reprint of Nallino's Arabic text) progress

Source: `source/zij-sabi-nallino-byblion` (OCR on the microSD: books/medicine-science/zij-sabi-harrani/zij-sabi-harrani/, 286 scan pages, no page images kept in pages-png). Work: `work/al-zij-al-sabi`. Citations use scan page markers (the source entity's convention). Printed Arabic page number = scan page minus 4 for the text pages (e.g. scan 17 prints 13, scan 21 prints 17, scan 51 prints 47, scan 214 prints 210). Tables are not transcribed; the text pages carry a Latin critical apparatus at the foot (OCR of it is noise). Generator scripts: /Volumes/exmicroSD/islam-museum-harvest/scripts-zij/ (gen.py + body.py per batch).

## Chapter map (scan page of each chapter heading)
Front: 1-4 title and copyright; 5-9 contents list of 57 chapters (the Escorial text, with "fol. 1" marker); 10 text begins.
1 foreword 10 | 2 circle division, multiplication, roots, division 12 | 3 chords 17 | 4 obliquity 21 | 5 risings in the right sphere (heading missing in scan; see gaps) | 6 parallels and inhabited earth 25 | 7 rising and setting points of summer and winter 33 | 8 pole altitude from longest day 34 | 9 longest day from pole altitude 35 | 10 altitude and shadow 35 | 11 azimuth of altitude and shadow 37 | 12 meridian line 38 | 13 risings of the signs in each country 43 | 14 latitudes by observation 47 | 15 noon altitude 48 | 16 hours elapsed by the Sun, ascendant 48 | 17 altitude from hours 50 | 18 distances of stars from the equator 50 | 19 semi-arc of a star 52 | 20 degree rising with a star 53 | 21 night hours from a star 54 | 22 star altitude from night hours 56 | 23 star azimuth 57 | 24 distance of a star from the equator, azimuth of rising 58 | 25 degree of a star on the ecliptic 58 | 26 distances between stars 61 | 27 solar year and mean motion of the Sun 65 | 28 anomaly of the Sun 68 | 29 inequality of days 77 | 30 lunar spheres, eclipses' causes 80 | 31 spheres of the five planets 99 | 32 eras: Arab, Roman, Persian, Coptic 104 | 33 Sun's place 110 | 34 equated hours, Raqqa noon 112 | 35 ascendant and twelve houses 113 | 36 Moon's true place 115 | 37 lunar nodes 117 | 38 Moon's latitude 117 | 39 parallax 118 | 40 Moon's distance from the Earth 131 | 41 crescent visibility 133 | 42 conjunctions and oppositions 142 | 43 lunar eclipses 150 | 44 solar eclipses 161 | 45 positions of the five planets 175 | 46 stations and retrogradation 177 | 47 planetary latitudes 178 | 48 risings and disappearances 180 | 49 figures of stars with the Sun 183 | 50 distances, diameters, sizes 185 | 51 motion of the fixed stars 191 | 52 the talisman-makers' claim of a motion of the sphere 194 | 53 year transfers 196 | 54 conjunctions by latitude 198 | 55 risings between the cardinal points 202 | 56 flat marble dial and simple instruments 207 | 57 close of the book, the sphere-shaped instrument, observing instruments 213.
Scan 214-285: end of chapter 57, then the star catalogue of the Escorial text (star names by constellation, pp. 250-285 approx., tables of longitude and latitude, not to be transcribed) and appendices; scan 286 is the Latin title page of Nallino's Part III (Opus astronomicum, Milan). Later workers should confirm the exact end of prose (scan 214-249) before planning ranges. Chapters 28, 30, 39, 43 and 44 are long (9 to 19 scan pages each).

## Batch 1 (this PR): scan 5-23, chapters 1-4 (25 concepts, `concept/zij-sabi-*`)
Resume point: scan page 25, chapter 5 tail and chapter 6 (the parallels, begins on scan 25). Next batch should start at scan 25 and run through chapter 8 or 9.
The Zij is not finished.

## Gaps and garbled OCR
- Scan 24 is a leaf of the star catalogue (Capricornus figure table, header "من أسماء كواكب صورة الجدي", catalogue page number 262) misbound between the text pages 23 and 25; the printed text page 20 (the beginning of chapter 5, risings in the right sphere) is therefore missing from this scan, and chapter 5's heading never appears. Scan 25 opens with the tail of chapter 5. No chapter 5 concept written; the contents (scan 5) names its subject.
- Scan 13-14: the OCR of the two multiplication tables (rows of fractions) is noise; only the instructions are used.
- Scan 17: the second ancient value of the circumference ratio is garbled in the OCR ("ثلثة امثاله وعشرة اجزاء وشيء من احد وسبعين"); the entry says its wording is uncertain.
- Scan 21 end: the rule for the chord of half the remaining arc is garbled; the entry says so.
- Scan 22: the name of the observing instrument ("...الطويلة واقبنة المذكور عملها") is garbled; the entry says so and does not name it.
- Scan 23: the letter-numerals for the quarter boundaries are garbled; the entries use the fourfold division that agrees with the rest of the passage.
- "إرخس" and "الخس" in the OCR (scan 11, 22) are read as Hipparchus (Ptolemy's predecessor named in the passage); the identification is the worker's reading of the name, not stated in the book. No person record created for him.
- Qur'an quotations on scan 10 were described by subject only and not typed; the aya numbers in the apparatus are too garbled to link passages.

## GEMINI lines
GEMINI: person/hipparchus (not in the graph): the Zij (scan 11, 22) names "إرخس" as the earlier observer of the obliquity (47 deg 42 min arc between the solstices) and as the one Ptolemy corrected; confirm the identification with Hipparchus of Nicaea and the Wikidata and Pleiades-style identifiers, from a primary or Almagest source, before a person entity is created.
GEMINI: scan 22: which observing instrument does al-Battani name before "the long ... and the instruments whose making is mentioned"? Nallino's Latin translation (Opus astronomicum Part I, chapter 4) would settle it.

## Process notes
- harvest-register.yaml has no entry for this book; not updated (no entry to update).
- Proposal: register zij-sabi-harrani in docs/library/harvest-register.yaml when the orchestrator next edits it.
