# Vision review R (second round)

Screenshots looked at: 36 of 36. First-round rows re-checked: 50 (T1 to T44, S1 to S6). New defects: 12.

Scope: the thirty tour shots (`river`, `room-first`, `room-badr`, `room-last`, `complete`, Arabic and English, at
phone, tablet and desktop) and the six homepage shots (button area only), as re-captured at commit `0569404e3f`
(`index.json`). Every file was opened whole and then in enlarged crops. Positions are `y≈` pixels from the top of the
committed image. Arrow directions, bracket shapes, widths, gaps and contrast figures marked "measured" come from
counting pixels in the JPEG, not from reading the picture by eye. The site's source was not opened.

Verdict counts for the first-round rows: GONE 22, STILL THERE 13, CHANGED 15.
New defects by severity: major 0, minor 1, cosmetic 11.

Two limits of the evidence:

- `en-room-first-phone.jpg` and `en-room-badr-phone.jpg` are cut at 2,600 px inside the sources list, before the
  previous and next buttons and the side doors. Rows about those parts (T20, T23, T34) were checked at phone width on
  the four phone shots that reach them: the three Arabic room shots and `en-room-last-phone.jpg`.
- A still image cannot show that the route drawing scrolls. T4 is judged on what is painted: a hint line, and a
  drawing still cut at the box edge.

## 1. First-round defects, re-checked

| Id | Verdict | What the new screenshot shows |
|---|---|---|
| T1 | GONE | The footer is painted in all three files: column headings and links on `en-room-first-desktop.jpg` from y≈1880, on `ar-complete-desktop.jpg` from y≈1945 and on `ar-room-last-phone.jpg` from y≈2415. A scan of all thirty-six files for runs of empty rows finds nothing taller than the gap before the footer (T43). |
| T2 | GONE | `ar-room-last-desktop.jpg` is painted across its full width down to the end of the page at 2,546 px: three footer columns, the follow list, the licence line and the social icons. |
| T3 | GONE | `en-room-last-phone.jpg` shows the side-door cards under the heading: "Ibn Fadl Allah al-Umari" at y≈2430 and "Masalik al-Absar fi Mamalik al-Amsar" at y≈2540, the third card below the cut. |
| T4 | CHANGED | A line of small grey text now stands above the drawing on tablet and phone: "The drawing is wider than this screen: scroll it sideways to follow the route." and its Arabic twin. The drawing itself is cut as before. Tablet: circle 36 is sliced in half by the box edge (right in English, left in Arabic), stops 37 to 40 are off-screen and the "Made" lane is empty; the drawing misses the box by only about 100 px. Phone: stops 1 to 14 show, circle 14 is sliced by the edge with a gold stub running off it, 26 of 40 stops are hidden. No scrollbar, fade or arrow marks the cut edge. What is left: minor. |
| T5 | CHANGED | The English name now sits directly under the Arabic title, on the same side, clear of the emblem, in all nine Arabic room shots. It is still set large in a Times-like face (cap height 17 px, about 24 px type, measured on `ar-room-first-desktop.jpg`) where the Arabic name on the English pages is small (about 17 px type). What is left: cosmetic. |
| T6 | GONE | The sources are a numbered list, 1 to 14 in the Kaaba, 1 to 11 in Badr, 1 to 3 in the Kiswa, in both languages at all three widths. The numbers hang in the indent and match the footnote numbers in the text. |
| T7 | GONE | The references read in the right order in Arabic: "1/192-197" on line 10 and "1/64-65" on line 12, the same as the English page (`ar-room-first-phone.jpg` y≈1800 and y≈1860, tablet, desktop). |
| T8 | CHANGED | The comma is now the Arabic comma. The Latin "p." is still there on every Arabic citation line: «المباركفوري، p.20», «العمري، p.139», in all nine Arabic room shots. What is left: minor. |
| T9 | GONE | The parenthetical holding «مارس 624م» stays whole on the first line and its two parentheses face each other, on `ar-room-badr-tablet.jpg` (y≈568) and `ar-room-badr-desktop.jpg` (y≈560), and on the phone shot. |
| T10 | STILL THERE | The numbers are still set off by a space with the full stop after them, so the break still falls there. `ar-room-first-phone.jpg` y≈1203: «11 12 .» opens the line. `ar-room-badr-phone.jpg` y≈970: «5 .» opens the line. It now shows in English too: `en-room-first-desktop.jpg` (y≈1015 and y≈1050) and `en-room-first-tablet.jpg` (y≈1075 and y≈1105) end a line on note 11 and start the next with "12." and the full stop. On the Badr tablet and desktop shots no line happens to start that way at this width. |
| T11 | GONE | The first cell «ق.هـ» fits inside its cell with room on both sides on all four Arabic phone shots; the English "BH" cell likewise. |
| T12 | GONE | On a phone the ribbon is now two rows, eight cells then seven, each cell about 40 × 32 px with numerals of about 13 px. Readable. (The two rows do not line up: R2.) |
| T13 | GONE | One row on both phone shots: "Earlier", the label, "Later", with the slider on its own line beneath (`en-river-phone.jpg` y≈585–650, `ar-river-phone.jpg` y≈548–615). Same arrangement on tablet and desktop. |
| T14 | GONE | A legend now stands under the band on all six river shots: "† Hijri date derived by computation from the Gregorian/Julian date; it may differ from the transmitted date by a day or two." and its Arabic twin. |
| T15 | CHANGED | A teal stream with pale gold edges, 28 px thick the whole way (measured), now runs through the band at title height and the cards stand on it, so the cards read as stops on one line. It shows only in the 14 to 40 px gaps between cards and at the band's start; behind a card it is all but invisible (card colour over the stream and off it differ by a few levels), so what the eye sees is a chain of short teal links, not a river. No ticks or years on it. No text is hard to read where it passes: titles are white on near-navy, about 15:1 measured. On a phone one and a half cards show, with the label and the Later button to say there is more. What is left: cosmetic. |
| T16 | GONE | The lane labels are now dark text, about 14:1 against the beige (measured on `en-complete-desktop.jpg`), each with a small coloured square before it. All nine read clearly in both languages. (The squares themselves: R10.) |
| T17 | CHANGED | Lane labels on tablet and phone are now dark and about 11 px type (cap height 8 to 9 px, measured), readable in both languages. The numbers in the circles are still about 6 to 7 px high. What is left: cosmetic. |
| T18 | GONE | The caption is now "Every century walked" / «قطعتَ القرون كلها» over fifteen navy cells, so it no longer promises a marked position. All six complete shots. |
| T19 | STILL THERE | The honorific sign after "the Prophet" is still a grey smudge about 12 px high, followed directly by "'s" in the Kaaba text (`en-room-first-desktop.jpg` y≈955). On `en-room-badr-phone.jpg` (y≈965) it still wraps alone to the start of the next line. |
| T20 | STILL THERE | All three differences remain. Fourth side door: "Muwatta 524" in English, the number plus a three-line hadith title in Arabic, which makes that card and its row taller. Previous button in the last room: "Malcolm X" in English, a second name in parentheses in Arabic. Sources in the last room: "al-Umari (1924 printing)" in English, no printing note in Arabic. |
| T21 | GONE | The counts are now three lines, one count per line, with no separator dots. (A count that wraps alone to its own line: R3.) |
| T22 | GONE | On tablet the Arabic box is the same width as the narrative above it (both about 670 px, measured). On desktop the box now heads the side column and fills its width (329 px in both languages). |
| T23 | GONE | Both buttons now centre their content, each with a small heading line over its label and the arrow beside the label, and the two are the same height (about 74 px). Seen on `ar-room-first-phone.jpg` y≈1965–2125, `ar-room-badr-phone.jpg`, `ar-room-last-phone.jpg` y≈1610–1775 and `en-room-last-phone.jpg` y≈2195–2350. The two other English phone shots are cut before the buttons. |
| T24 | CHANGED | On desktop the body is now two columns: the narrative (about 660 px) and, beside it, the counts box and the numbered sources (about 330 px). The empty column is gone. The two columns are unequal, so a blank block stands under the shorter one: about 340 px under the narrative on `en-room-first-desktop.jpg` (y≈1130–1470), about 220 px on `ar-room-first-desktop.jpg`, about 240 px under the sources on `en-room-last-desktop.jpg`. On tablet the narrative, box and sources stop about 100 px short of the ribbon and the side-door grid. What is left: cosmetic. |
| T25 | CHANGED | Cards within one century are now the same height. Across the divider they differ: cards 4 and 5 are about 28 px taller than cards 1 to 3 on all four tablet and desktop shots, so the bottom edge steps at the dashed line and the taller cards carry about 60 px of empty space between title and date. The band is as tall as the tallest group, which leaves an empty dark strip under the cards: 50 to 80 px in English, 20 to 55 px in Arabic. What is left: cosmetic. |
| T26 | GONE | The stream is 26 to 28 px thick in every gap between cards in both centuries (measured in each visible gap on the four tablet and desktop shots). No splay. |
| T27 | STILL THERE | The far edge is a clean rounded rectangle, but what crosses it is still cut hard. Desktop: a sliver of card 6 about 20 px wide with broken letters and a slice of its circle. Tablet: "Cornerstones of the m", «أركان المتحف المؤرّخة في هذ» and card 4 cut through its date. Phone: card 2 cut through its title and date; on `en-river-phone.jpg` (y≈715) the first stretch's own count line is cut at "…this stretch of th", so its number is off-screen. A darkening of a few levels over the last 35 px is there (measured) but is too faint to read as a fade. |
| T28 | STILL THERE | "Before the Hijra" / «قبل الهجرة» is still printed twice about 40 px apart on all six river shots: as the control row's label and as the band's first heading. |
| T29 | CHANGED | The stat line is now all figures: "Stops: 40 · Wings: 9 · Centuries: 14". The count line now says "this stretch of the river", not "this century". Still there: "Centuries: 14" beside a band and ribbons of fifteen segments, and "…this stretch of the river: 8" directly over three cards. What is left: cosmetic. |
| T30 | GONE | "Earlier" / «أقدم» is greyed (pale fill, grey text and arrow) on all six river shots while "Later" keeps its full colour. |
| T31 | STILL THERE | Card 3 still has a red top edge beside gold ones, with no key, on the four tablet and desktop river shots. |
| T32 | STILL THERE | "Pre-Islamic Arabia, The Prophetic Era" still stands where the other cards show a date, and after "Era:" in the Kaaba banner. Data text. |
| T33 | STILL THERE | "Object" and "Objects", in Arabic «أثر» and «الآثار», still stand side by side on all six room-last shots, now followed by a third chip, "Made" / «صُنع». |
| T34 | STILL THERE | "Had participant" under Quraysh and Sa'd ibn Abi Waqqas, "Written about by" under Ibn Fadl Allah al-Umari and al-Azraqi, on the English Badr and Kiswa shots. |
| T35 | STILL THERE | Names still break after "al-", and on desktop more than before, because the sources now sit in a 330-px column: "Safi al-Rahman al-" / "Mubarakpuri" on nearly every line of `en-room-first-desktop.jpg` and `en-room-badr-desktop.jpg`, "Ibn Abd al-" / "Wahhab", "— al-" / "Umari (1924 printing)". In the narrative: "al-Raheeq al-" / "Makhtum", "al-" / "Ma'mun", "Dhu al-" / "Qa'da", "al-Hubab ibn al-" / "Mundhir". Page ranges also split: "p.230-" / "237", "1/192-" / "197". |
| T36 | STILL THERE | "Masalik al-Absar fi Mamalik al-Amsar" on the card and "Masalik al-absar fi mamalik al-amsar" in the sources; "The Battle of Badr" and "The Hijra" beside "The first revelation" and "The five pillars of Islam". |
| T37 | CHANGED | The crumbs are now consistent: "Museum › The Grand Tour" on the river, "… › Stop n of 40" in the rooms, "… › The Completion Room" on the last page, with the same root word as the wing pages. On `en-complete-phone.jpg` the crumb still wraps, after "THE" (y≈215–235). What is left: cosmetic; see also R5. |
| T38 | GONE | «العلاقات المباشرة بين المحطات نفسها: 27» is on one line on `ar-complete-tablet.jpg` and `ar-complete-desktop.jpg`. |
| T39 | CHANGED | The nine cards are three to a row on desktop and tablet, three full rows, and each heading now carries an arrow. No record count. In Arabic the new arrows point the wrong way: R1. |
| T40 | CHANGED | Neighbouring circles no longer touch: a gap of about 4 px with the gold line showing between them (10 to 14, 18 to 21, 29 to 32, 37 to 39, 33 and 34, 4 and 5, 24 and 25). The arcs out of stops 5 and 8 still run together into one teal band between those two stops and cannot be told apart. What is left: cosmetic. |
| T41 | STILL THERE | "Engineering" is still in English in the Arabic footer, now on all ten Arabic tablet and desktop tour shots (the two footers that were blank in round one show it too). Shared footer. |
| T42 | CHANGED | The line now names its source: "Wikidata, Q1511204" / «ويكيداتا، Q1511204». It is still an identifier where the other lines give a title and a page. What is left: cosmetic. |
| T43 | STILL THERE | The empty run before the footer is 192 px on both river phone shots and 112 to 120 px on tablet and desktop (measured). The same 192 px shows on `ar-room-last-phone.jpg` between the "open the full record" pill and the footer (y≈2223–2414). |
| T44 | CHANGED | The ribbon caption now reads "Your walk has reached: 14th century AH" / «بلغتَ في مسيرك: القرن الرابع عشر الهجري», which speaks of the walk and not of the record, with cells BH to 13 navy and 14 gold. The banner still says the record carries no single date. The two lines no longer contradict each other outright. What is left: cosmetic. |
| S1 | GONE | The button no longer sits under the cards. It is a pill 344 px wide (x 23–366, measured), centred to the pixel under the headline, between the centred title and the narrower date pill, so there is no edge for it to miss. |
| S2 | CHANGED | The label still wraps to two lines on `en-home-phone.jpg` ("Enter the Grand Tour: fourteen centuries in" / "40 stops →") and the button is 74 px tall against 53 px in Arabic. The arrow now follows the last word and both lines are centred, so nothing is stranded. What is left: cosmetic. |
| S3 | GONE | The button is a fully rounded pill at all six sizes, like the other buttons of the page, and its Arabic label is in the same bold sans face as «اقرأ القصة» and «ابدأ الاستكشاف». |
| S4 | GONE | The button now stands directly under the headline, above the date pill and the "On this day" heading, as part of the opening block. It no longer hangs off the random-event pill, and the "Travel through time" card is no longer stacked against it. |
| S5 | GONE | Measured positions: phone y 337–389 (Arabic) and 370–443 (English); tablet 302–354 and 393–441; desktop 308–360 and 372–420. All inside the first screen. |
| S6 | CHANGED | The two kinds of arrow now agree, but the change went the other way from what the row asked: the pill's arrow has been turned to point right, like the older arrows, on all three Arabic homepage shots (measured by pixel shape). Every forward arrow on the Arabic homepage now points right, back toward its own text. See R1. |

## 2. Defects in the new screenshots

| Id | Screenshot(s) | Where on the page | What is wrong | Severity |
|---|---|---|---|---|
| R1 | ar-complete-phone.jpg, ar-complete-tablet.jpg, ar-complete-desktop.jpg, ar-home-phone.jpg, ar-home-tablet.jpg, ar-home-desktop.jpg | the arrow after each of the nine wing names (ar-complete-desktop y≈1316, 1466, 1616); the arrow at the left end of the homepage pill (ar-home-desktop y≈334, x≈488–503) | In Arabic these arrows point right, back toward their own label; forward in Arabic is left. On the completion page the arrows are new in this round and point the opposite way from the dark button 60 px under the cards and from every "next" and "begin" button of the tour, all of which point left. On the homepage the pill's arrow pointed left in round one and now points right, so it disagrees with «ابدأ الجولة ←» on the page it opens. Checked by pixel shape. | minor |
| R2 | ar-room-first-phone.jpg, ar-room-badr-phone.jpg, ar-room-last-phone.jpg, ar-complete-phone.jpg, en-room-first-phone.jpg, en-room-badr-phone.jpg, en-room-last-phone.jpg, en-complete-phone.jpg | the ribbon of centuries, now two rows | The rows hold eight cells and seven cells, and the seven are stretched to the same total width, so the columns do not line up: 8 stands under BH, 9 under the gap between 1 and 2, and so on. It reads as two unrelated strips, not as one ribbon folded in two. | cosmetic |
| R3 | en-room-first-desktop.jpg, en-room-badr-desktop.jpg, en-room-last-desktop.jpg, ar-room-badr-desktop.jpg | the counts box at the head of the side column | In the narrow column a count wraps alone to a line of its own: "Museum pathways that pass through it:" / "11" (and "4" in Badr and the Kiswa); in Arabic «العلاقات الواصلة إلى هذا السجل في شبكة المتحف:» / "138". The number is cut off from what it counts. | cosmetic |
| R4 | en-room-first-tablet.jpg, ar-room-first-tablet.jpg, en-room-badr-tablet.jpg, ar-room-badr-tablet.jpg | side-door cards | Four cards in three columns: the fourth stands alone on a second row with two empty slots beside it. On ar-room-first-tablet.jpg the lone card is also the tall one with the three-line title. | cosmetic |
| R5 | en-room-last-phone.jpg, en-room-first-phone.jpg, en-room-badr-phone.jpg | banner breadcrumb (y≈205–240) | The crumb is as wide as the phone banner. On en-room-last-phone.jpg it wraps and leaves "40" alone on a second line ("STOP 40 OF" / "40"). On the other two it just fits, and its gold last part ("STOP 1 OF 40", "STOP 5 OF 40") is printed across the gold dome of the corner emblem. The Arabic crumb fits with room to spare. | cosmetic |
| R6 | en-river-phone.jpg, en-river-tablet.jpg, en-river-desktop.jpg, ar-river-phone.jpg, ar-river-tablet.jpg, ar-river-desktop.jpg | stop cards, the date line | Dates break in the middle. English: "10 August 610 CE · 21" / "Ramadan 12 BH"; "13 March 624 CE · 17" / "Ramadan 2 AH"; "c. 12 September 622 CE ·" with the separator dot left hanging. Arabic: «نحو 12 سبتمبر 622 م · نحو 29» / «صفر 1 هـ†»; «21 رمضان» / «12 ق.هـ». | cosmetic |
| R7 | all thirty tour shots; clearest on en-river-desktop.jpg and en-complete-desktop.jpg | buttons | Two button shapes share each page. "Earlier", "Later" and "Open the full record" are full pills, as is the homepage pill that leads here. "Begin the tour", "To the completion room", the previous and next buttons and the three buttons at the foot of the completion page are rectangles with small corners. Now that the homepage button is a pill, the tour's own main buttons are the odd ones out. | cosmetic |
| R8 | ar-river-tablet.jpg, ar-river-desktop.jpg, ar-room-first-tablet.jpg, ar-room-first-desktop.jpg, ar-room-badr-tablet.jpg, ar-room-badr-desktop.jpg, ar-room-last-tablet.jpg, ar-room-last-desktop.jpg, ar-complete-tablet.jpg, ar-complete-desktop.jpg | site footer, «الموارد» column, fourth link, directly above "Engineering" | The two brackets around "JSON" face the same way: "(JSON(". Measured by glyph shape. Shared footer; the first round listed it on the wing pages (S22) but not on the tour's pages. | cosmetic |
| R9 | ar-home-phone.jpg, ar-home-tablet.jpg, ar-home-desktop.jpg | the pill and the headline above it | The pill sits 10 to 15 px under the lowest stroke of the Arabic headline, the tail of the last letter of «الإسلام», and 44 px above the date pill (measured). It looks pushed up against the title. In English the gap above is 20 px. | cosmetic |
| R10 | all six complete shots | route drawing, the coloured square before each lane label | The squares do not work as a key. The "Made" square is pale gold on beige, 1.8:1 (measured), close to invisible. Four others are near-black blue-greens that cannot be told apart at 10 px: Place, Ideas, Words and Today; the circle outlines of stops 6, 17, 22, 23 and 26 have the same problem. | cosmetic |
| R11 | en-complete-tablet.jpg | banner title (y≈255–345) | The title breaks with one word alone on its second line: "You have walked the spine of the" / "museum". | cosmetic |
| R12 | all six complete shots | under the route drawing, "Key to the numbers +" / «مفتاح الأرقام +» | The control that opens the key is plain body text with a small plus after it: no border, underline or pill. It reads as a caption. On a page where only the key says which stop a number is, it is easy to miss. | cosmetic |

## The rebuilt parts, one by one

- **Control row above the river.** Two buttons flank a centred label, the slider runs the full width beneath, at all
  three widths in both languages. In Arabic "earlier" is on the right with a right arrow and the slider's thumb starts
  at the right. Correct. The label still repeats the band's first heading (T28).
- **River band.** The stream is even and continuous and the cards stand on it. It reads as a line of linked stops more
  than as a river (T15). No text is hard to read over it. The far edge has a clean shape but cuts cards and count lines
  mid-word with no fade (T27). Cards step in height at the century divider and leave an empty strip under them (T25).
- **Ribbon of centuries.** Readable at every width; on a phone two rows that do not line up (R2). Past cells navy,
  the current one gold, later ones beige, mirrored in Arabic.
- **Room body on desktop.** Narrative on one side, counts box and numbered sources beside it, mirrored in Arabic. The
  box's accent bar is on the reading side in both languages. Leftovers: unequal columns (T24), a count alone on a line
  (R3), names split after "al-" in the narrow column (T35).
- **Previous and next buttons.** Same height side by side and stacked; arrows point the right way in both languages.
- **Route drawing.** Lane labels now read clearly; numbered circles are apart; the hint line is there on tablet and
  phone. The drawing is still cut at the box edge with nothing at the edge to show it continues (T4). The colour
  squares are not a usable key (R10).
- **Nine wing cards.** Three to a row on tablet and desktop, with arrows. The Arabic arrows point right (R1).
- **Homepage button.** A pill under the headline at every size, inside the first screen, in the page's own button
  face. Two lines on the English phone (S2). The Arabic arrow now points right (R1, S6). Slightly tight under the
  Arabic headline (R9).

## Files looked at

Nothing wrong was found in the button area of `en-home-desktop.jpg` and `en-home-tablet.jpg`. Every other file has at
least one row.

| File | Rows still open after this round |
|---|---|
| ar-river-phone.jpg | T15, T25, T27, T28, T29, T43, R6, R7 |
| ar-river-tablet.jpg | T15, T25, T27, T28, T29, T31, T41, R6, R7, R8 |
| ar-river-desktop.jpg | T15, T25, T27, T28, T29, T31, T41, R6, R7, R8 |
| en-river-phone.jpg | T15, T25, T27, T28, T29, T32, T43, R6, R7 |
| en-river-tablet.jpg | T15, T25, T27, T28, T29, T31, T32, R6, R7 |
| en-river-desktop.jpg | T15, T25, T27, T28, T29, T31, T32, T36, R6, R7 |
| ar-room-first-phone.jpg | T5, T8, T10, T20, R2, R7 |
| ar-room-first-tablet.jpg | T5, T8, T20, T24, T41, R4, R7, R8 |
| ar-room-first-desktop.jpg | T5, T8, T20, T24, T41, R7, R8 |
| en-room-first-phone.jpg | T19, T32, T35, R2, R5, R7 |
| en-room-first-tablet.jpg | T10, T19, T20, T24, T32, R4, R7 |
| en-room-first-desktop.jpg | T10, T19, T20, T24, T32, T35, R3, R7 |
| ar-room-badr-phone.jpg | T5, T8, T10, R2, R7 |
| ar-room-badr-tablet.jpg | T5, T8, T24, T41, R4, R7, R8 |
| ar-room-badr-desktop.jpg | T5, T8, T24, T41, R3, R7, R8 |
| en-room-badr-phone.jpg | T19, T35, R2, R5, R7 |
| en-room-badr-tablet.jpg | T19, T24, T34, T35, T36, R4, R7 |
| en-room-badr-desktop.jpg | T19, T24, T34, T35, T36, R3, R7 |
| ar-room-last-phone.jpg | T5, T8, T20, T33, T42, T43, T44, R2, R7 |
| ar-room-last-tablet.jpg | T5, T8, T20, T24, T33, T41, T42, T44, R7, R8 |
| ar-room-last-desktop.jpg | T5, T8, T20, T24, T33, T41, T42, T44, R7, R8 |
| en-room-last-phone.jpg | T20, T33, T34, T35, T42, T44, R2, R5, R7 |
| en-room-last-tablet.jpg | T20, T24, T33, T34, T35, T36, T42, T44, R7 |
| en-room-last-desktop.jpg | T20, T24, T33, T34, T35, T36, T42, T44, R3, R7 |
| ar-complete-phone.jpg | T4, T17, T40, R1, R2, R7, R10, R12 |
| ar-complete-tablet.jpg | T4, T17, T40, T41, R1, R7, R8, R10, R12 |
| ar-complete-desktop.jpg | T40, T41, R1, R7, R8, R10, R12 |
| en-complete-phone.jpg | T4, T17, T37, T40, R2, R7, R10, R12 |
| en-complete-tablet.jpg | T4, T17, T40, R7, R10, R11, R12 |
| en-complete-desktop.jpg | T40, R7, R10, R12 |
| ar-home-phone.jpg | S6, R1, R9 |
| ar-home-tablet.jpg | S6, R1, R9 |
| ar-home-desktop.jpg | S6, R1, R9 |
| en-home-phone.jpg | S2 |
| en-home-tablet.jpg | none in the button area |
| en-home-desktop.jpg | none in the button area |

`horizontalOverflowPx` is 0 for all thirty-six files in `index.json`, and no shot shows a sideways scrollbar.
