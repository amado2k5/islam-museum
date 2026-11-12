# Brief: a third look at six defects (fresh-context reviewer)

You did not build these pages and you have not seen their source. Do not open any file outside
`docs/fable-run/vision/` and `docs/fable-run/briefs/`. You are not here to say the pages look fine.

## What happened before you

`docs/fable-run/vision/shots/` holds screenshots of pages of islam.museum, a museum site in Arabic (right-to-left) and
English, at phone (390 px), tablet (820 px) and desktop (1280 px) widths. Two rounds of reviewers listed defects:
`review-T.md` and `review-S.md` (first round) and `review-R.md` (second round; read its rows for the ids below so you
know exactly what each reviewer saw and where). The builder then changed the pages and re-captured every screenshot.
The files now in `shots/` are the NEW set; `shots/index.json` names the commit they were captured at.

The builder says six defects are now fixed. Your job is to look, and to say for each whether it is GONE, STILL THERE
or CHANGED (and how). Do not take the builder's word. Measure where you can: enlarge, crop, count pixels (you may write
crops to your scratch directory, never into the repository). An arrow's direction is judged by its shape in the image.

| Id | What was reported | Where to look |
|---|---|---|
| R1 | In Arabic, forward arrows pointed right, back toward their own label: the arrow at the end of the dark Grand Tour button on the homepage, and the arrow after each of the nine wing names on the tour's last page. Forward in Arabic is left. | `ar-home-phone.jpg`, `ar-home-tablet.jpg`, `ar-home-desktop.jpg`; `ar-complete-phone.jpg`, `ar-complete-tablet.jpg`, `ar-complete-desktop.jpg`. Check the English twins too: there the arrows must still point right. |
| T39 | The nine wing cards on the last page: uneven rows, no arrow, and (second round) arrows pointing the wrong way in Arabic. | the six `*-complete-*.jpg` files |
| S6 | On the Arabic homepage the new button's arrow and the page's older arrows pointed in different directions. | the three `ar-home-*.jpg` files. Say which way each kind points now. |
| T27 | The far edge of the river band cut stop cards and text hard, mid-word, with no visible fade. | the six `*-river-*.jpg` files. Is there now a visible fade over whatever crosses the far edge (left edge in Arabic, right edge in English)? Is any card or line of text still cut hard? |
| R2 | On a phone the ribbon of centuries is two rows whose columns did not line up (eight cells over seven stretched ones). | `ar-room-first-phone.jpg`, `ar-room-badr-phone.jpg`, `ar-room-last-phone.jpg`, `ar-complete-phone.jpg` and their `en-` twins |
| R9 | On the Arabic homepage the button sat pushed up against the headline (10 to 15 px under its lowest stroke). | the three `ar-home-*.jpg` files; measure the gap |

Then look at those same files once more with fresh eyes and list anything these changes broke or introduced (for
example: a fade that now hides the last card or a control; a ribbon row that overflows; a button that moved somewhere
odd). Only new defects, not ones a row of `review-R.md` already lists as still there.

## What you write

`docs/fable-run/vision/review-X.md`, and nothing else in the repository:

```markdown
# Vision review X (third look)

Screenshots looked at: <n>. Rows re-checked: 6. New defects: <n>.

## 1. Defects looked for again

| Id | Verdict | What the new screenshot shows |
|---|---|---|
| R1 | GONE or STILL THERE or CHANGED | ... |
(one row for each of R1, T39, S6, T27, R2, R9; the verdict cell holds one of the three words first)

## 2. Defects in the new screenshots

| Id | Screenshot(s) | Where on the page | What is wrong | Severity |
|---|---|---|---|---|
| X1 | ... | ... | ... | major, minor or cosmetic |
(leave the table empty if you find none)

## Files looked at
```

End with a short report: the six verdicts, and every new defect in a line each.
