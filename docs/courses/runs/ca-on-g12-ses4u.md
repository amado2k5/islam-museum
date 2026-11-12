# Run log: ca-on-g12-ses4u

Agent: Claude Code; claude-sonnet-5-5. Started 2026-11-12T06:06Z, ended 2026-11-12T06:24Z (both from `date -u`).

## Steps
- Fetch: "SES4U" -> ontario-ses4u ok (Earth and Space Science, Grade 12; strands A to F; 98 specific expectations). The first `--list` call failed with a JSON decode error (another fleet agent was rewriting the shared `.cache/curricula/_list/courses.json` at the same moment); a retry worked. Source: ontario_source.py returned source/ontario-curriculum-secondary-science (existing, untouched).
- Search (step 4): about 35 find_entity and grep searches. The museum holds nothing on stars, galaxies, the electromagnetic spectrum, the solar system's bodies, space exploration, geological time, fossils, dating, minerals, rock types, plate tectonics, seismic waves, weathering or sediments. It does hold astronomy of the Islamic world (instruments, observation reports, al-Biruni) and two historical earthquake reports.
- Plan: four lessons in three strands.

| lesson | title | expectations |
|---|---|---|
| ca-on-g12-ses4u-a-1 | Scientists of the Islamic world and their fields | A2.2 |
| ca-on-g12-ses4u-b-1 | Redesigning the astrolabe | B1.2 |
| ca-on-g12-ses4u-b-2 | Recording the sky as earlier observers did | B2.2 |
| ca-on-g12-ses4u-f-1 | Earthquakes recorded at Ramla | F3.8 |

- Link sentences.
  - A2.2 asks the student to describe scientists' contributions to the fields under study; person/al-biruni-muhammad-ibn-ahmad shows an astronomer, mathematician and geographer who dedicated an astronomical work to a sultan, and invention/al-biruni-earth-radius shows a documented method of measuring the Earth from a mountain.
  - B1.2 asks why and how an astronomical technology was developed and improved; invention/universal-astrolabe-al-zarqali shows a redesign for many latitudes and invention/tusi-linear-astrolabe a redesign as a staff, each with its stated limits.
  - B2.2 asks the student to locate sky features and record their position; event/comet-905 records a rising "from Aries" with a tail over Yemen, concept/eclipses gives al-Farghani on parallax and the observer's place, event/solar-eclipse-836 gives a dated report of duration. The museum cannot do the locating; the Brief says so.
  - F3.8 asks the student to plot recorded earthquakes on a map; the two Ramla records name places and damage. The Brief says the world map, volcanoes and boundary types are the class's.
- Judgement calls flagged for the reviewer: B2.2 and F3.8 are thin (the museum serves only the history of recording, and two events). A reviewer who finds either too thin should move it to the gap register.
- Considered and rejected: concept/earth-rotation-ship-analogy for B1.1 (a medieval debate that affirms the earth's rest, not a milestone that revolutionized thinking); invention/razi-substance-classification for E3.1 (says itself its "stones" are not a geological mineral list); Muwatta passages 668 to 670 on mines for E1.1 (legal treatment, not economic impact); event/comet-985 for B2.2 (reports duration and lore, no position); building/sharaf-al-dawla-observatory and exhibit/path-maragha for B1.2 (not read in depth; see More lessons possible); concept/al-harakat-al-thaniya for C3.7 (the planets' second motion in the Hay'a, not Kepler's laws).
- Counts: 3 units (A, B, F; strands C, D, E have none), 4 lessons, 9 connections, 4 expectations in lessons, 94 in the gap register, of 98.
- Gate: ingestion gate --strict --save: RESULT: GREEN (23 checks passed). cite-check over the 8 records: 0 fail.

## Judgement calls on the records' own wording
- invention/universal-astrolabe-al-zarqali: the English summary says "not invention of astronomy", the Arabic prose says "not invention of the astrolabe from scratch". I wrote only "a development of the astrolabe" (both records say it).
- invention/tusi-linear-astrolabe: the English prose says the marks "encode astronomical and angular information"; the Arabic says they "represent astronomical quantities and chords of angles". Each text follows its own language.
- concept/eclipses: the Urdu record writes "انیس ویں" for chapter 29; my Urdu text writes the correct "انتیسویں".
- invention/al-biruni-earth-radius: the English record puts the date of the book (416 AH/1025 CE) apart from the day of observation; I dropped the separate sentence to stay under 80 words and kept the book's date only.

## Runbook problems
- The shared `.cache/curricula/_list/courses.json` is rewritten by every `fetch_ontario.py --list` call, so parallel fleet agents can read a half-written file (one decode error cost one retry). The fetcher should write the list to a temporary name and rename it.
- `find_entity.py` took one to two minutes per call while many agents ran at once; about a third of the elapsed time was waiting for searches. A fleet run would be quicker if the graph's alias search were an in-memory index rather than a re-read of `.cache/graph.json` per call.
- The Ontario secondary course has no "Grade" in its Ministry name: `--list "Grade 12"` shows nothing useful for it; `--list SES` found "SES4U".

## More lessons possible
- building/sharaf-al-dawla-observatory and exhibit/path-maragha could carry a second B1.2 lesson (observatories as a research technology), but B1.2 is already in b-1 and an expectation may appear in one lesson only.

## Proposals
- Connection kind: no kind for an observation report or a natural event (used `story`) or for a concept record (used `reflection`).

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g12-ses4u-b-2, KEEP-BUT-FIX (comet-905 kept, eclipses fixed) and MOVE-TO-GAP (solar-eclipse-836, one connection).** The 836 connection deleted with its two evidence rows (no prose named it). B2.2 stays in the lesson (served by comet-905 and eclipses). Eclipses card: old "A solar eclipse is the moon's passing between the sun and the earth at conjunction; a lunar eclipse is ... Al-Farghani treats them in chapters twenty-eight, twenty-nine and thirty. If the conjunction falls away from the nodes, parallax makes ..." -> new "Al-Farghani writes that if the conjunction falls away from the nodes, parallax makes ..." (ar: "يذكر الفرغاني أنه إن كان الاجتماع في غير الرأس والذنب ..."; ur: "الفرغانی لکھتا ہے کہ اگر اجتماع ..."). I kept the name "Al-Farghani writes that" so the parallax sentence keeps its author; the closing question is unchanged. The definition row of the evidence table was deleted.
- **ca-on-g12-ses4u-f-1, KEEP-BUT-FIX.** 425 card (en): old "receded about three farsakhs" -> new "receded about three leagues" (the English record's word); the Arabic card keeps "ثلاثة فراسخ" and the Urdu "تین فرسخ", which are the Arabic record's word, so the three agree on the distance. Brief gains: "The records give no magnitude, depth or dates in the modern calendar, and dating them to a Gregorian year is for your class." (ar, ur the same). Evidence row updated. The card still never says "tsunami".
- Not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate and cite-check results below the list.
- ses4u-a-1, card person/al-biruni-muhammad-ibn-ahmad, FIX: the judgement of worth is now attributed to the reference works the record cites. en: "Abu al-Rayhan … was one of the great astronomers…" → "The reference works Mawsu'at A'lam al-Ulama' wa-l-Adaba' and Hajji Khalifa's Kashf al-Zunun describe Abu al-Rayhan … as one of the great astronomers…"; ar: "أبو الريحان … من كبار علماء الفلك…" → "تصف «موسوعة أعلام العلماء والأدباء العرب والمسلمين» و«كشف الظنون» لحاجي خليفة أبا الريحان … بأنه من كبار علماء الفلك…"; ur: "… بڑے فلکیات دان … تھے" → "«موسوعۃ اعلام…» اور حاجی خلیفہ کی «کشف الظنون» … کو … بڑے فلکیات دان … بتاتی ہیں". Evidence row updated.
- Other connections KEEP, unchanged. Not applied: none.
