| id | verdict | what you see in the round-5 image (name the file) |
|---|---|---|
| EN-37 | gone | en-desktop-state-map-progress-1of2.jpg: in row 1 the tan tag pills of all four cards start at y=932 and end at y=949 (measured with PIL). "Done" (card 1) and "Next up" (card 2) sit below the tag row, not above it, so card 1's tags line up with cards 2 to 4. Phone view en-phone-state-map-progress-1of3.jpg also shows Done below the tags. |
| EN-44 | gone | en-desktop-map-1of2.jpg: pill top and bottom are identical across all four cards in every row (row 1 y=932-949, row 2 1309-1327, row 3 1686-1704, row 4 2014-2033), including rows where card titles take one or two lines and descriptions differ in length. Tags are pinned to the bottom of each card. |

New defects: none (the Arabic desktop files ar-desktop-map-1of2.jpg and ar-desktop-state-map-progress-1of2.jpg also show tag rows level within each row; the 2of2 files are blank footer slices; on the phone files the cards are single-column and the tag rows sit directly under the text with some empty space at the card bottom, which is not a misalignment).
