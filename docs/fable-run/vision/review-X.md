# Vision review X (third look)

Screenshots looked at: 24. Rows re-checked: 6. New defects: 2.

## 1. Defects looked for again

| Id | Verdict | What the new screenshot shows |
|---|---|---|
| R1 | GONE | Every forward arrow named in the row now has its head on the left in Arabic (pixel shape: the tall columns of the glyph are at its left end, the thin shaft runs right from them). Homepage pill: `ar-home-desktop.jpg` y≈339, head at x≈488–492, shaft to x≈503; `ar-home-tablet.jpg` y≈333, head at x≈259–262; `ar-home-phone.jpg` y≈368, head at x≈43–46. Last page: all nine heading arrows on `ar-complete-desktop.jpg` (y≈1316, 1466, 1616), on `ar-complete-tablet.jpg` (y≈1270, 1452, 1602) and on `ar-complete-phone.jpg` (nine headings, y≈1301 to 2316), and the dark button under them (y≈1800, 1820, 2465). English twins still point right: the pill on the three `en-home-*` shots (desktop y≈403, head at x≈833–838), nine card arrows and the dark button on `en-complete-desktop.jpg` and `en-complete-tablet.jpg`, eight card arrows on `en-complete-phone.jpg` (the ninth card and the buttons lie below the 2600 px capture cap, so they could not be seen). |
| T39 | CHANGED | The three things the brief lists are gone. Three cards to a row in three full rows on desktop and tablet (`ar-complete-desktop.jpg` rows y≈1285–1418, 1434–1568, 1583–1750; `en-complete-desktop.jpg` y≈1296–1442, 1458–1577, 1592–1738), one column on the phone; cards within a row are equal in height, and a row is as tall as its longest text (Arabic desktop 134, 135, 168 px; English desktop 147, 120, 147 px). Every heading carries an arrow, pointing left in Arabic and right in English (see R1). What is left of the first-round row: the cards still show no record count, which the homepage's wing cards do. |
| S6 | STILL THERE | The two kinds of arrow disagree again, as in round one. The pill's arrow now points left on all three Arabic homepage shots (see R1). Every older arrow still points right, back toward its own text, measured by pixel shape: «اقرأ القصة» in both day cards (`ar-home-desktop.jpg` y≈694, `ar-home-tablet.jpg` y≈688 and 878, `ar-home-phone.jpg` y≈750 and 970); «كل المسارات» and «متصفح المنهج» (desktop y≈1800, tablet y≈2204); the wing card headings (desktop y≈2008 and 2324, tablet y≈2411; on the phone they lie below the capture cap). The disagreement now also runs between pages: the same nine wing names carry a right arrow on the homepage and a left arrow on the tour's last page. |
| T27 | CHANGED | The hard cut is gone on all six river shots; a fade now lies over the far edge. Measured against the previous round's shots: the brightest pixel in each column falls steadily over the last 72 px and reaches the band's own background level (36 to 50 of 255) at the edge; beyond 72 px the two rounds are identical. Desktop: the 20 px sliver of card 6 with its broken letters is dissolved to a ghost (peak 40 to 58, was 154 to 232). Tablet: «أركان المتحف المؤرّخة في هذ» and "Cornerstones of the m" and card 4 now fade out instead of ending at a line. Phone: card 2 fades out through its title and date. No card or line of text is cut hard. What is left: on `en-river-phone.jpg` (y≈715) the first stretch's own count line still runs out of the band, so its number is still not shown; it is now dimmed from the word "of" onward. On the two desktop shots the fade lies almost wholly over empty band, so it is seen only in the river stripe and in the edge of card 5; with the sliver gone, little there says the band continues. |
| R2 | GONE | On all eight phone shots the ribbon is eight cells over seven, every cell 41 to 42 px wide with 4 px between, and each cell of the second row starts at the same x as the cell above it (within 0 to 2 px; the cell of the current century is drawn 3 px larger). Arabic: second row at x=61, 107, 152, 197, 242, 288, 333, the same as the first row's seven inner cells, leaving the slot at the far left empty. English: x=16, 61, 107, 152, 197, 242, 288, leaving the far right slot empty. 8 stands squarely under BH, 9 under 1, and so on to 14 under 6. Ribbon positions: `ar-room-first-phone.jpg` and `ar-room-last-phone.jpg` y≈518–589, `ar-room-badr-phone.jpg` y≈483–554, `ar-complete-phone.jpg` y≈503–574, `en-room-first-phone.jpg` and `en-room-badr-phone.jpg` y≈505–576, `en-room-last-phone.jpg` y≈551–622, `en-complete-phone.jpg` y≈636–707. |
| R9 | CHANGED | The pill sits 6 px lower than before. Gap from the lowest ink of the headline to the pill's top edge: 15 px on `ar-home-desktop.jpg` (y=298 to 314), 17 px on `ar-home-tablet.jpg` (y=290 to 308), 19 px on `ar-home-phone.jpg` (y=323 to 343). The same count on the previous round's shots gives 9, 11 and 13 px. The gap under the pill, to the date pill, is unchanged at 44, 43 and 44 px, so the pill is still about three times nearer the headline than the date. The English pill moved by the same amount (now 26, 24 and 25 px; was 19, 18 and 19), so the Arabic gap is still 6 to 11 px tighter than its twin. It no longer looks pressed against the title; it is still the tightest gap in the block. |

## 2. Defects in the new screenshots

| Id | Screenshot(s) | Where on the page | What is wrong | Severity |
|---|---|---|---|---|
| X1 | en-river-desktop.jpg | the count line of the second stretch, "Cornerstones of the museum dated to this stretch of the river: 67", y≈691, the number at x≈1136–1152 | The new fade covers the number. The line is whole, not cut, and ended 14 px inside the band's edge at full brightness in the previous round; now "67" is drawn at about 3.1:1 against the band (was about 11:1), below the 4.5:1 a small text needs, and "river:" before it at about 6.2:1 (was 9.4:1). The one figure of that line is the part that is hard to read. | minor |
| X2 | ar-river-desktop.jpg, ar-river-tablet.jpg, en-river-tablet.jpg | whole elements standing within 72 px of the band's far edge | The fade reaches 72 px in, further than what crosses the edge, so things that are not cut are half dimmed. `ar-river-desktop.jpg`: card 5, the last whole card (x≈149–333), has its gold top rule (y≈722) fading out from x≈186 to its corner, its far border dimmed, and the last glyph of its date (y≈878) down from 8.9:1 to 6.2:1; the card looks unevenly lit. `en-river-tablet.jpg`: in the heading "1st century AH" (y≈716) the "AH" drops from 13:1 to 5.8:1. `ar-river-tablet.jpg`: the last word of the heading «القرن الأول الهجري» (y≈665) drops from 11.7:1 to 7.8:1. All still readable; the headings look as if they were trailing off though they are complete. | cosmetic |

## Files looked at

All twenty-four in `docs/fable-run/vision/shots/`, as captured at commit `e2c16d9083` (`index.json`), each opened whole and
then in enlarged crops:

- `ar-home-phone.jpg`, `ar-home-tablet.jpg`, `ar-home-desktop.jpg`, `en-home-phone.jpg`, `en-home-tablet.jpg`, `en-home-desktop.jpg`
- `ar-complete-phone.jpg`, `ar-complete-tablet.jpg`, `ar-complete-desktop.jpg`, `en-complete-phone.jpg`, `en-complete-tablet.jpg`, `en-complete-desktop.jpg`
- `ar-river-phone.jpg`, `ar-river-tablet.jpg`, `ar-river-desktop.jpg`, `en-river-phone.jpg`, `en-river-tablet.jpg`, `en-river-desktop.jpg`
- `ar-room-first-phone.jpg`, `ar-room-badr-phone.jpg`, `ar-room-last-phone.jpg`, `en-room-first-phone.jpg`, `en-room-badr-phone.jpg`, `en-room-last-phone.jpg`

Also read: the brief, the rows for the six ids in `review-R.md`, `review-T.md` and `review-S.md`, and `shots/index.json`.

How the figures were taken. Positions are `y≈` pixels from the top of the committed image. Arrow directions come from the
pixel shape of each glyph (the height of its ink column by column), not from reading the picture. Gaps, cell edges and
the fade come from counting pixels in the JPEG. Where a row says "was", the same count was run on the previous round's
copy of the same file, read from git history (commit `d646e46c83`) into a scratch directory outside the repository;
nothing in the repository was changed but this file. Contrast figures compare the brightest pixels of a glyph with the
band behind it, so they are close estimates from a JPEG, not exact colour values. The site's source was not opened.

Limits. The captures stop at 2600 px, so on `en-complete-phone.jpg` the ninth wing card and the buttons under the cards
are not in the image, and on `ar-home-phone.jpg` the pathway links and the wing cards are not in the image. A fade can
only be judged at rest in a still image: what it does at the near edge after the band is scrolled was not seen.

Seen in passing, not caused by these changes and not counted above: in the Arabic footer of every page looked at, the
entry «البيانات المفتوحة» followed by "JSON" in parentheses is drawn with both parentheses curving the same way
(`ar-complete-desktop.jpg` y≈2093), and so is the year range in one rotating pick on `ar-home-desktop.jpg` (y≈2218).
This is the bracket fault that `review-S.md` already lists for the wing pages (S22).
