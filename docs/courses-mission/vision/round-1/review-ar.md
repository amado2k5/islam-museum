# Round 1 visual review: Arabic (RTL) screenshots

Reviewed all 54 `ar-*` JPEGs. "Possible" means I could not confirm it from the image alone.

| id | file | where in the image | severity | defect |
|---|---|---|---|---|
| AR-1 | ar-phone-lesson-first-2of3, ar-phone-lesson-stubs-2of2, ar-phone-lesson-last-2of2, ar-tablet-lesson-first-2of2, ar-tablet-lesson-stubs-2of2, ar-tablet-lesson-last-2of2, ar-desktop-lesson-first-2of2, ar-desktop-lesson-last-2of2, ar-desktop-state-check-answered-2of3 | Previous/next cards at the bottom of every lesson | medium | The arrows are the wrong way round for RTL: "الدرس التالي" carries a right-pointing arrow and "الدرس السابق" a left-pointing arrow, while the classroom bar (السابق → / التالي ←) is correct, so the two navigations disagree. |
| AR-2 | ar-phone-lesson-first-1of3 and -2of3, ar-tablet-lesson-first-1of2, ar-desktop-lesson-first-1of2, ar-desktop-lesson-last-1of2 | "اقرأ الآية في المتحف →" in the Qur'an cards and "افتح في المتحف →" in the story/scholar cards | medium | These forward links show a right-pointing arrow placed after the text, while "ابدأ بالدرس الأول ←" and "تابع ←" point left; direction is inconsistent across the surface, and "كل المقررات ←" and "خريطة المقرر →" are mixed as well. |
| AR-3 | ar-phone-lesson-last-1of2, ar-tablet-lesson-last-1of2, ar-desktop-lesson-last-1of2 | Goal paragraph "يقوم استكشاف الفضاء على الأقمار الصناعية (الطقس وGPS والاتصالات) والمسارات…" | medium | The parenthetical that contains the Latin word "GPS" looks scrambled: the brackets sit on the wrong side of their words (the opening bracket reads as ")" before "الطقس") and the second line starts with "وGPS" to the left of the rest, so the sentence is hard to read. |
| AR-4 | ar-phone-lesson-last-1of2 (tip box "جرّب هذا"), ar-desktop-lesson-last-1of2, ar-phone-lesson-first-2of3 (source line "(1993)" and "(6:38)"), ar-desktop-lesson-first-1of2 | Parentheses around "خرائط، طقس، صور", "(1993)", "(6:38)" | medium | Possible: the brackets look mirrored or unbalanced (both ends drawn as ")" or facing inward) and there is a stray space between bracket and text, for example ")خرائط، طقس، صور(" and "الإسلام ) 1993 (". |
| AR-5 | ar-desktop-map-1of2, ar-tablet-map-1of2, ar-phone-map-1of2, ar-phone-state-map-progress-1of2 | Strand description lines ending "(التوقعات B1, B2)", "(… C1, C2)", "(… D1, D2)" | medium | The bracketed expectations list is split across two lines, leaving an orphan second line that starts with a full stop and ends with a bracket (".D1, D2)"), and the Latin codes appear to the right of the word "التوقعات", so the text reads backwards. |
| AR-6 | ar-phone-lesson-stubs-1of2, ar-tablet-lesson-stubs-1of2, ar-desktop-lesson-stubs-1of2, ar-phone-lesson-last-1of2, ar-tablet-lesson-last-1of2 | Dashed box under "كتاب الحيل", "الجزري", "سلطان بن سلمان آل سعود" inside the discovery cards | medium | The box says "لم يُكتب هذا السجل بعد." in small grey text and is otherwise empty, so a student sees a dead placeholder with a large blank area and no action. |
| AR-7 | ar-phone-lesson-first-2of3, ar-phone-lesson-stubs-2of2, ar-phone-lesson-last-2of2, ar-phone-state-check-answered-3of4 | "أستطيع الآن أن" checklist | medium | The English curriculum sentences are right-aligned in the Arabic page, the code badge (B1.1) is inserted in the middle of the sentence, and the wrapped last word ("biodiversity", "circuits") hangs alone on its own line; unlike the top of the lesson, these items carry no "official wording, not yet translated" label. |
| AR-8 | ar-tablet-lesson-first-1of2, ar-desktop-lesson-first-1of2, ar-desktop-lesson-stubs-1of2, ar-desktop-lesson-last-1of2, ar-desktop-state-classroom-1 | "توقعات المنهاج برموزها الرسمية" rows | low | The English sentence is left-aligned while its badge is at the far right, leaving a gap of 500+ px, and the "النص الرسمي…" label is right-aligned under the badge rather than under the English sentence. |
| AR-9 | ar-phone-state-classroom-1, ar-phone-state-classroom-3 | Fixed bottom bar | medium | The bar takes about 190 px of the 844 px screen and is cramped: the help text is squeezed into a 7-line column of 11 px text, "اخرج من عرض الصف" is broken into four short lines inside a narrow button, and the counter touches the "السابق" button. |
| AR-10 | ar-phone-state-classroom-1, ar-desktop-state-classroom-1 | Bar buttons "السابق" and counter "5 / 1" | low | "السابق" looks fully active on the first step, and the counter reads "5 / 1" left to right, which can be misread as "5 of 1" (possible). |
| AR-11 | ar-desktop-state-classroom-1, ar-desktop-state-classroom-3 | Body text and bar help text | low | Possible: body copy is about 22 px and the bar help text about 12 px, which looks small for a classroom projector; the full site title and progress header also stay visible and use space. |
| AR-12 | ar-phone-state-check-answered-3of4 | Question card "أيّ هؤلاء لقيته في هذا الدرس؟" | medium | The card is cut off right after the first (selected) option, with no bottom border, and a blank white gap of about 170 px follows where options 2 and 3 and any feedback should be, so the answered state cannot be read (possible capture artefact). |
| AR-13 | ar-desktop-state-check-answered-2of3 | Middle of the page, y≈320–420 | medium | The site header appears in the middle of the content, covering the "أنت هنا" rail title and the question text. The red message "ليس في هذا الدرس. عُد إلى البطاقات أعلاه." is half hidden below it. Possible capture artefact, but the answered state is not readable. |
| AR-14 | ar-phone-lesson-first-1of3, ar-desktop-lesson-first-1of2 | Step rail under the hero ("1 الهدف … 5 اختبر نفسك") | low | On the phone the fifth item is clipped at the left edge ("5 ا…") with no visible scroll cue, and in none of the widths is the current step highlighted, so the rail does not say where you are. |
| AR-15 | ar-phone-lesson-first-2of3, ar-phone-lesson-stubs-2of2, ar-phone-lesson-last-2of2 | "قارن بالبطاقة +" link and the "أستطيع الآن أن" checkboxes | medium | The compare link is a thin underlined line about 20 px high and the checkboxes are about 20 px wide, with only small gaps between rows, which are small tap targets for a child's finger. |
| AR-16 | ar-desktop-lesson-first-2of2, ar-desktop-lesson-last-2of2, ar-desktop-state-check-answered-2of3 | Previous/next card row | low | The row begins at x≈406, left of the main column edge at x≈443, so the next card sticks out beyond the column and does not line up with the cards above it. |
| AR-17 | ar-desktop-lesson-first-1of2, ar-desktop-lesson-stubs-1of2 | Step rail | low | The first rail item "1 الهدف" starts at x≈1177, about 11 px outside the right edge of the content column (x≈1166). |
| AR-18 | ar-print-lesson-first-1of2 | Hero, progress line under the lead (y≈155) | medium | The "الدرس 1 من 4 … 1 من 16 في المقرر" line is garbled and overlapped by the dots and the background pattern, so it is unreadable on paper. |
| AR-19 | ar-print-lesson-first-1of2 | "اقرأ الآية في المتحف →" and "افتح في المتحف →" | low | Web-only links are printed as if they were buttons; they do nothing on paper. |
| AR-20 | ar-phone-lesson-first-1of3, ar-phone-lesson-stubs-1of2, ar-phone-map-1of2, ar-tablet-lesson-stubs-1of2 | Hero breadcrumb, "الفرع ب —" / "الفرع د —" | low | An em dash is left hanging at the start or end of a wrapped breadcrumb line, so it looks like a stray mark. |
| AR-21 | ar-phone-state-map-progress-1of2, ar-desktop-state-map-progress-1of2 | "منجز ✓" and "التالي" tags on lesson cards | low | They are tiny (about 10 px), set apart at the far left of the tag row, and the "التالي" label is hard to read; the state is easy to miss. |
| AR-22 | ar-phone-home-1of2, ar-tablet-home, ar-desktop-home, ar-phone-state-home-resume-1of2 | Space between the grade card and the footer | low | A blank band of about 100–180 px sits under the single grade card, so the page looks unfinished. |
| AR-23 | ar-phone-nojs-home-1of2 | Below the grade card (y≈810) | low | Possible: the only visible no-script text is a clipped fragment "…وحده ويحتاج إلى جافاسكربت;", and the grade card shows an empty tan block with no readable label in frame, so I could not confirm that a visitor without scripts has a clear message or a way in. |
| AR-24 | ar-phone-map-1of2, ar-tablet-map-1of2, ar-desktop-map-1of2 | Strand headings | low | Possible: the first strand shown is "الفرع ب", so a student sees no strand A and may think something is missing. |

Counts: high 0, medium 12, low 12.

## Files reviewed with no defect found

- ar-phone-home-2of2
- ar-phone-map-2of2
- ar-phone-lesson-first-3of3
- ar-phone-lesson-stubs-2of2 (except AR-1, AR-7 and AR-15)
- ar-phone-lesson-last-2of2 (except AR-1, AR-7 and AR-15)
- ar-phone-state-check-answered-4of4
- ar-phone-state-map-progress-2of2
- ar-phone-state-home-resume-2of2
- ar-desktop-map-2of2
- ar-desktop-state-check-answered-3of3
- ar-phone-nojs-home-2of2
- ar-phone-nojs-lesson-first-1of3, -2of3, -3of3 (content mostly outside the frame because of the known sideways scroll; nothing else assessable)
- ar-print-lesson-first-2of2 (the quiz card is cut by the capture boundary but the print layout itself is fine: lines to write on, checkboxes, no interactive controls)
- ar-tablet-home (except AR-22)
- ar-desktop-state-home-resume (except AR-22; the resume banner has its title and a "تابع ←" button)
