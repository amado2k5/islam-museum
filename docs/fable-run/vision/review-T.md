# Vision review T

Screenshots looked at: 30 of 30. Defects: 44.

Scope: the tour's pages (`river`, `room-first`, `room-badr`, `room-last`, `complete`) in Arabic and English at phone,
tablet and desktop. Every file was opened whole and then re-read in enlarged crops. Positions are given as `y≈` pixels
from the top of the committed image. For the header and banner comparison I also glanced at `en-home-desktop.jpg`,
`ar-wing-people-desktop.jpg` and the tops of `en-wing-people-desktop.jpg`, `en-wing-time-phone.jpg`,
`ar-wing-time-phone.jpg` and `en-wing-time-tablet.jpg` (not reviewed, reference only): the tour's header, banner
gradient, corner emblem and beige cards match those pages, so no row is written for them.

Severity counts: major 4, minor 15, cosmetic 25.

A note on T1, T2 and T3: they are blank, unpainted regions in the committed images. They may come from the capture and
not from the page (the same footer is painted in the sibling shots, and `index.json` gives `en-room-first-desktop` a
page height of 2,417 px against 3,187 px for its Arabic twin). I cannot tell from an image; they are listed as seen and
need a look in a browser or a re-capture.

| Id | Screenshot(s) | Where on the page | What is wrong | Severity |
|---|---|---|---|---|
| T1 | en-room-first-desktop.jpg, ar-complete-desktop.jpg, ar-room-last-phone.jpg | the site footer, below the last tour button (en-room-first-desktop y≈2035 to the end at 2417; ar-complete-desktop y≈2020 to the cut at 2600; ar-room-last-phone y≈2260 to the cut) | the footer is an empty beige block: no column headings, no links, no licence line, nothing. Every other shot shows the three link columns starting about 50 px below the footer's top edge. On en-room-first-desktop the whole footer is only about 380 px tall and blank to the end of the page | major |
| T2 | ar-room-last-desktop.jpg | from y≈1600 to the cut at 2600, where the footer should be | only a beige strip 255 px wide is painted at the left edge; the other 1,025 px of the width is the off-white page colour, and there is no footer text at all for 1,000 px. It reads as a half-drawn page | major |
| T3 | en-room-last-phone.jpg | under the heading "Side doors into the museum", y≈2250 to 2590 | the heading is followed by about 340 px of blank page where the three side-door cards should be (the Arabic phone shot shows them); only the top edge of the "Open the full record" pill peeks in at the cut | major |
| T4 | en-complete-tablet.jpg, ar-complete-tablet.jpg, en-complete-phone.jpg, ar-complete-phone.jpg | the route drawing (tablet: en y≈860–1200, ar y≈745–1090; phone: en y≈930–1275, ar y≈730–1075) | the drawing is wider than its box and is cut at the box edge. Tablet: circle 36 is sliced in half by the edge and stops 37 to 40 are not visible, so the "Made" lane is empty and the final stop of a completion page is missing. Phone: only stops 1 to 14 are visible, circle 14 sits against the edge and a gold line runs out of the box; 26 of 40 stops are hidden. No scrollbar, fade or hint says the box scrolls sideways (if it does, this drops to minor) | major |
| T5 | ar-room-first-phone.jpg, ar-room-first-tablet.jpg, ar-room-first-desktop.jpg, ar-room-badr-phone.jpg, ar-room-badr-tablet.jpg, ar-room-badr-desktop.jpg, ar-room-last-phone.jpg, ar-room-last-tablet.jpg, ar-room-last-desktop.jpg | the banner, the English name under the Arabic title ("The Kaaba", "The Battle of Badr", "The Kiswa") | the English name is set at the far left of the banner on a line of its own, the opposite side from the right-aligned Arabic title, and it lands on top of the corner emblem's calligraphy. In the English pages the Arabic name sits directly under the title on the same side. The English name here is also large (about 20 px, Times-like face) while the Arabic name on the English pages is small (about 14 px) | minor |
| T6 | all eighteen room shots (ar- and en- room-first, room-badr, room-last at phone, tablet, desktop) | the list under "Sources for this text" / "مصادر هذا النص" | the narrative carries footnote numbers 1 to 14 (1 to 11 in Badr, 1 to 3 in the Kiswa) but the list of sources shows no numbers: the lines are indented as a numbered list would be, with nothing in the indent. A reader cannot match note 7 to its source without counting lines | minor |
| T7 | ar-room-first-phone.jpg, ar-room-first-tablet.jpg, ar-room-first-desktop.jpg | sources list, the Ibn Hisham line and the al-Khudari line (phone y≈1680 and y≈1730) | volume-and-page references are reordered by the right-to-left line: they read "197-1/192" and "65-1/64" where the English page shows "1/192-197" and "1/64-65" | minor |
| T8 | all nine Arabic room shots | every line of the sources list | Arabic citation lines end in a Latin comma and a Latin "p.", for example "…المباركفوري, p.20": an untranslated abbreviation and Latin punctuation inside an Arabic line, where Arabic would use "،" and "ص" | minor |
| T9 | ar-room-badr-tablet.jpg, ar-room-badr-desktop.jpg | first paragraph of the narrative, end of line 1 and start of line 2 (tablet y≈565–605) | the parenthetical holding "مارس 624م" breaks across two lines and its parentheses land on the wrong sides: one parenthesis hangs at the far left end of line 1 after "مارس", the other opens line 2 at the far right before "624م". On the phone shot, where the phrase stays on one line, it is correct | minor |
| T10 | ar-room-first-phone.jpg, ar-room-badr-phone.jpg, ar-room-badr-tablet.jpg, ar-room-badr-desktop.jpg | narrative, starts of lines (ar-room-first-phone y≈1155: "11 12 ." opens the line; ar-room-badr-phone y≈1120: "5 ."; ar-room-badr-tablet y≈845 and desktop y≈838: "6 .") | footnote numbers and the sentence's full stop wrap to the start of the next line, cut off from the word they belong to. In all room shots, both languages, the numbers are set off by a space before them and the full stop comes after them, as in "Mecca 1." and "بمكة 1 .", which is what lets the line break fall there | minor |
| T11 | ar-room-first-phone.jpg, ar-room-badr-phone.jpg, ar-room-last-phone.jpg, ar-complete-phone.jpg | the ribbon of centuries, first cell at the right, "ق.هـ" | the label is wider than its cell: it touches and spills over both edges of the cell with no padding. The first cell is also narrower (about 18 px) than the other fourteen (about 22 px); the English "BH" cell is equally narrow and its text touches the edges | minor |
| T12 | ar- and en- room-first-phone, room-badr-phone, room-last-phone, complete-phone (8 files) | the ribbon of centuries | at 390 px the fifteen cells are about 22 × 25 px each with numerals in type of about 9 to 10 px: too small to read comfortably, and small targets if the cells are links | minor |
| T13 | ar-river-phone.jpg, en-river-phone.jpg | the control row above the river band (en y≈580–680, ar y≈545–645) | the row breaks in two: "Earlier" and the slider sit on the first line, and the century label with the "Later" button drop to a second line, so the slider is no longer flanked by its two buttons and "Later" floats mid-row beside the label | minor |
| T14 | en-river-tablet.jpg, en-river-desktop.jpg, ar-river-tablet.jpg, ar-river-desktop.jpg | river band, stop card 4 "The Hijra" / "الهجرة النبوية", date line | the Hijri date ends in a dagger ("c. 29 Safar 1 AH†") and nothing on the page says what the dagger means. The site's wing pages print the legend ("† Hijri date computed from the Gregorian…") in their banner; the tour entrance does not | minor |
| T15 | all six river shots, worst on ar-river-phone.jpg and en-river-phone.jpg | the river band | it does not read as a band of centuries with stops on it. The teal stripe is a plain bar with nothing on it (no ticks, no stop marks); the numbered stops are cards in a row below it with nothing tying a card to a point on the stripe. On phone a single century fills the whole band, so there is no sign that other centuries exist beyond a second card cut at the edge | minor |
| T16 | all six complete shots | route drawing, lane labels down the side | three labels are too faint against the beige: "Made" / "صُنع", pale gold, measured about 2:1; "Objects" / "الآثار", about 3:1 or less; and "Time" / "الزمان", about 3:1 to 3.8:1. "Made" is close to invisible, most of all in Arabic | minor |
| T17 | en-complete-tablet.jpg, ar-complete-tablet.jpg, en-complete-phone.jpg, ar-complete-phone.jpg | route drawing, lane labels and the numbers in the circles | lane labels are about 9 px and circle numbers about 7 to 8 px high; the Arabic lane labels at this size are hard to make out | minor |
| T18 | all six complete shots | the ribbon under "Where you stand in history" / "موقعك في التاريخ" | the caption promises a position but all fifteen cells are the same dark navy; no cell is marked, so the ribbon shows no place to stand (in the rooms the current century is gold) | minor |
| T19 | en-room-first-phone.jpg, en-room-first-tablet.jpg, en-room-first-desktop.jpg, en-room-badr-phone.jpg, en-room-badr-tablet.jpg, en-room-badr-desktop.jpg | narrative, the honorific sign after "the Prophet" | the sign is drawn so small (about 12 px) that it is an unreadable grey smudge, and in the Kaaba text it is followed directly by "'s" ("Prophet [sign]'s birth"). On en-room-badr-phone (y≈918) it wraps alone to the start of the next line, away from "Prophet" | minor |
| T20 | ar-room-first-phone.jpg, ar-room-first-tablet.jpg, ar-room-first-desktop.jpg against en-room-first-tablet.jpg, en-room-first-desktop.jpg; ar-room-last (3) against en-room-last (3) | side-door cards; previous button; sources list | the two languages show different labels for the same thing. Fourth side-door card: English "Muwatta 524", Arabic the number plus a full hadith title running to three lines, which makes that card (and on desktop the whole row) about 70 px taller. Previous button in the last room: English "Malcolm X", Arabic adds a second name in parentheses. Sources in the last room: English "al-Umari (1924 printing)", Arabic has no printing note | cosmetic |
| T21 | all nine English room shots; ar-room-first-phone.jpg, ar-room-badr-phone.jpg, ar-room-last-phone.jpg | the boxed line of counts ("Why this stop matters.") | a separator dot is left hanging at the end of a line ("…graph: 21 ·" then a new line), so the dot belongs to nothing | cosmetic |
| T22 | ar-room-first-tablet.jpg, ar-room-first-desktop.jpg, ar-room-badr-tablet.jpg, ar-room-badr-desktop.jpg, ar-room-last-tablet.jpg, ar-room-last-desktop.jpg | the boxed line of counts against the paragraph above it | in Arabic the box is about 90 px narrower than the narrative column, so its left edge is indented from the text's left edge; in English the box and the text column are the same width | cosmetic |
| T23 | ar- and en- room-first-phone, room-badr-phone, room-last-phone (6 files) | previous and next buttons, stacked full width | the previous button puts its arrow at one end and its label at the far opposite end with an empty gap between, and its label is aligned to the opposite side from the next button's label directly below, so the pair zig-zags. On room-first and room-last one button has a small heading line and the other has none, so the two are different heights (about 55 px and 75 px) | cosmetic |
| T24 | all six desktop room shots (and, less, the six tablet ones) | body of the page | the ribbon above and the side-door cards below span the full 1,052 px container, but the narrative, the counts box and the sources sit in a column about 600 to 650 px wide, leaving an empty column of about 400 px beside the text for the whole height of the story | cosmetic |
| T25 | en-river-phone.jpg, en-river-tablet.jpg, en-river-desktop.jpg, ar-river-tablet.jpg, ar-river-desktop.jpg | river band, the row of stop cards | cards in the same row are different heights (a two-line title or a one-line date changes the height), so the row has a ragged bottom edge | cosmetic |
| T26 | en-river-desktop.jpg, ar-river-desktop.jpg, en-river-tablet.jpg, ar-river-tablet.jpg | river band, the teal stripe in the second century (past the dashed divider) | the stripe is 26 px thick through the first century, then its edges splay to 32 px across the second (28 px on tablet). At that size it reads as a slightly crooked bar, not as a river widening | cosmetic |
| T27 | all six river shots | the inner edge of the river band on the "later" side (left in Arabic, right in English) | cards and the count line are cut hard at the band's edge in mid-word ("Cornerstones of the m", a card sliced through its title, on desktop a sliver of a circle) with no fade or other cue that the band continues | cosmetic |
| T28 | all six river shots | control row label and the band's first heading | "Before the Hijra" / "قبل الهجرة" is printed twice within about 50 px: once as the control row's label and again as the band's own heading directly under it | cosmetic |
| T29 | all six river shots | banner stat line; band count line | numbers that look odd on their face: "Stops: 40 · Wings: nine · Centuries: fourteen" mixes a figure with spelled-out numbers; the page says fourteen centuries but the band and the ribbon have fifteen segments (Before the Hijra plus 1 to 14) and the count line calls Before the Hijra "this century"; "Cornerstones of the museum dated to this century: 8" sits directly over three cards and reads as their count | cosmetic |
| T30 | all six river shots | control row, the "Earlier" / "أقدم" button | the slider is at its first position, yet "Earlier" looks exactly as active as "Later"; nothing shows it has nowhere to go | cosmetic |
| T31 | en-river-tablet.jpg, en-river-desktop.jpg, ar-river-tablet.jpg, ar-river-desktop.jpg | river band, top edge of the stop cards | card 3 has a red top edge while its neighbours have gold or brown ones; the page gives no key to the colours | cosmetic |
| T32 | en-river-phone.jpg, en-river-tablet.jpg, en-river-desktop.jpg, en-room-first-phone.jpg, en-room-first-tablet.jpg, en-room-first-desktop.jpg | stop card 1, second line; room banner "Era:" line | where the other cards show a date, the Kaaba shows a run-on list of period names with a capital mid-line: "Pre-Islamic Arabia, The Prophetic Era" | cosmetic |
| T33 | en-room-last-phone.jpg, en-room-last-tablet.jpg, en-room-last-desktop.jpg, ar-room-last-phone.jpg, ar-room-last-tablet.jpg, ar-room-last-desktop.jpg | banner chips | the chips "Object" and "Objects", in Arabic "أثر" and "الآثار", stand side by side and read as a duplicate or a typo | cosmetic |
| T34 | en-room-badr-tablet.jpg, en-room-badr-desktop.jpg, en-room-last-tablet.jpg, en-room-last-desktop.jpg | side-door cards, the small line under each name | relation labels read like raw field names: "Had participant" under Quraysh and Sa'd ibn Abi Waqqas, "Written about by" under Ibn Fadl Allah al-Umari and al-Azraqi | cosmetic |
| T35 | en-room-first-phone.jpg, en-room-badr-phone.jpg, en-room-last-phone.jpg, en-room-last-tablet.jpg, en-room-last-desktop.jpg | sources list and narrative, line ends | names break after "al-": "Safi al-Rahman al-" / "Mubarakpuri" on every source line on phone, "al-" / "Ma'mun", "al-Hubab ibn al-" / "Mundhir", "al-" / "Azraqi" in the narrative | cosmetic |
| T36 | en-room-last-tablet.jpg, en-room-last-desktop.jpg; en-river-desktop.jpg, en-room-badr-tablet.jpg, en-room-badr-desktop.jpg | side-door card against sources; stop titles on cards and next buttons | capitalisation is inconsistent: the same book is "Masalik al-Absar fi Mamalik al-Amsar" on the card and "Masalik al-absar fi mamalik al-amsar" in the sources 150 px above it; stop titles mix "The Battle of Badr" and "The Hijra" with "The first revelation" and "The five pillars of Islam" | cosmetic |
| T37 | all six complete shots; all six river shots | banner breadcrumb | on the completion page the last crumb is a button label, "To the completion room" / "إلى قاعة الختام", not the page's name, and on en-complete-phone it wraps to two lines. On the river the root crumb is "Islam Museum" / "متحف الإسلام" where the wing pages say "Museum" / "المتحف"; the rooms have no museum root at all | cosmetic |
| T38 | ar-complete-tablet.jpg, ar-complete-desktop.jpg | intro paragraph above the route drawing | the figure "27" wraps alone onto a line of its own after the colon | cosmetic |
| T39 | en-complete-desktop.jpg, ar-complete-desktop.jpg (grid); all six complete shots (card content) | the nine wing cards | on desktop the cards sit four to a row, leaving the ninth, "Made" / "صُنع", alone on a third row with three empty slots; the homepage shows the same nine wings three to a row. The cards here also lack the arrow and the record count that the homepage's wing cards carry, so they look like plain text boxes more than doors | cosmetic |
| T40 | all six complete shots | route drawing, circles and arcs | neighbouring circles on one lane touch edge to edge (10–14, 18–21, 29–32, 37–39, 33–34, 4–5, 24–25), so the gold route line vanishes between them; the dozen thin arcs that meet at stops 5 and 8 merge into a single teal smear and cannot be told apart | cosmetic |
| T41 | ar-river-tablet.jpg, ar-river-desktop.jpg, ar-room-first-tablet.jpg, ar-room-first-desktop.jpg, ar-room-badr-tablet.jpg, ar-room-badr-desktop.jpg, ar-room-last-tablet.jpg, ar-complete-tablet.jpg | site footer, "الموارد" column, fifth link | the link reads "Engineering" in English in the Arabic footer (shared footer, not the tour's own) | cosmetic |
| T42 | all six room-last shots | sources list, first line | a bare Wikidata identifier, "Q1511204", is shown as the citation | cosmetic |
| T43 | ar-river-phone.jpg, en-river-phone.jpg | between the "To the completion room" button and the footer (ar y≈1100–1265, en y≈1170–1340) | about 165 px of empty page separates the last button from the footer; on tablet and desktop the same gap is about 90 px | cosmetic |
| T44 | all six room-last shots | banner line against the ribbon caption | the banner says "Across the centuries: the record carries no single date" and, 150 px lower, the ribbon says "You are now in: 14th century AH" with cell 14 lit: the two lines contradict each other | cosmetic |

## Files with no defect

None. Every one of the thirty files shows at least one row above.

## Files looked at, with the rows seen in each

| File | Rows |
|---|---|
| ar-river-phone.jpg | T13, T15, T27, T28, T29, T30, T37, T43 |
| ar-river-tablet.jpg | T14, T15, T25, T26, T27, T28, T29, T30, T31, T37, T41 |
| ar-river-desktop.jpg | T14, T15, T25, T26, T27, T28, T29, T30, T31, T37, T41 |
| en-river-phone.jpg | T13, T15, T25, T27, T28, T29, T30, T32, T37, T43 |
| en-river-tablet.jpg | T14, T15, T25, T26, T27, T28, T29, T30, T31, T32, T37 |
| en-river-desktop.jpg | T14, T15, T25, T26, T27, T28, T29, T30, T31, T32, T36, T37 |
| ar-room-first-phone.jpg | T5, T6, T7, T8, T10, T11, T12, T20, T21, T23 |
| ar-room-first-tablet.jpg | T5, T6, T7, T8, T20, T22, T41 |
| ar-room-first-desktop.jpg | T5, T6, T7, T8, T20, T22, T24, T41 |
| en-room-first-phone.jpg | T6, T12, T19, T21, T23, T32, T35 |
| en-room-first-tablet.jpg | T6, T19, T21, T32 |
| en-room-first-desktop.jpg | T1, T6, T19, T21, T24, T32 |
| ar-room-badr-phone.jpg | T5, T6, T8, T10, T11, T12, T21, T23 |
| ar-room-badr-tablet.jpg | T5, T6, T8, T9, T10, T22, T41 |
| ar-room-badr-desktop.jpg | T5, T6, T8, T9, T10, T22, T24, T41 |
| en-room-badr-phone.jpg | T6, T12, T19, T21, T23, T35 |
| en-room-badr-tablet.jpg | T6, T19, T21, T34, T36 |
| en-room-badr-desktop.jpg | T6, T19, T21, T24, T34, T36 |
| ar-room-last-phone.jpg | T1, T5, T6, T8, T11, T12, T20, T21, T23, T33, T42, T44 |
| ar-room-last-tablet.jpg | T5, T6, T8, T20, T22, T33, T41, T42, T44 |
| ar-room-last-desktop.jpg | T2, T5, T6, T8, T20, T22, T24, T33, T42, T44 |
| en-room-last-phone.jpg | T3, T6, T12, T21, T23, T33, T35, T42, T44 |
| en-room-last-tablet.jpg | T6, T21, T33, T34, T35, T36, T42, T44 |
| en-room-last-desktop.jpg | T6, T21, T24, T33, T34, T35, T36, T42, T44 |
| ar-complete-phone.jpg | T4, T11, T12, T16, T17, T18, T37, T39, T40 |
| ar-complete-tablet.jpg | T4, T16, T17, T18, T37, T38, T39, T40, T41 |
| ar-complete-desktop.jpg | T1, T16, T18, T37, T38, T39, T40 |
| en-complete-phone.jpg | T4, T12, T16, T17, T18, T37, T39, T40 |
| en-complete-tablet.jpg | T4, T16, T17, T18, T37, T39, T40 |
| en-complete-desktop.jpg | T16, T18, T37, T39, T40 |

## Things checked and found right

- Sideways overflow is 0 px on all thirty pages in `index.json`, and no page shows a sideways scrollbar.
- Direction in Arabic: the river band, the ribbon, the route drawing, the side-door grid and the nine wing cards all
  start from the right; "next" arrows point left and "back" arrows point right; the accent bar on the wing cards and on
  the counts box moves to the right-hand side.
- Footnote numbers in Arabic run right to left in rising order.
- The previous and next buttons are the same height when they sit side by side (tablet and desktop, all three rooms).
- The tour's header, banner, corner emblem (cut by the page edge on the wing pages too) and card colours match the
  existing wing pages.
