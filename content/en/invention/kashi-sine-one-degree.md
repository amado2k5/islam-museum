---
id: invention/kashi-sine-one-degree
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b61", source: "Arabic translation from actual scholarly accounts; modern cubic illustration, not original algorithm transcription" }
---

## Summary

The sine of one degree is not the degree itself, and improving its computation did not invent trigonometry. [[person/al-kashi|Ghiyath al-Din al-Kashi]]'s work associated with the [[work/risala-watar-jayb-kashi|Treatise on the Chord and Sine]] approximated a small value with high precision. MacTutor describes a cubic equation and an iterative numerical method. This differs from his [[invention/al-kashi-pi-calculation|circumference computation]]: here a side ratio, there circumference divided by diameter {cite:kashi-mactutor final treatise}.

Our attribution is improvement, not absolute origin. MacTutor acknowledges al-Biruni's earlier approximate treatment; sources describe completion, Qadi Zada's role and precision differently. We retain those limits, then offer a modern explanatory example. We have not read the original algorithm or collated its digits against a manuscript {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

## What it is

In a right triangle, the sine of an acute angle is the opposite side divided by the hypotenuse. The ratio has no unit of length and survives enlargement without changing the triangle's shape. “Chord” in the title also recalls circle geometry, but chord and sine are not interchangeable terms in every historical convention. TDV identifies the precise one-degree computation as a subject of this treatise {cite:tdv-kashi-okten work8}.

The result is not seventeen digits read from a ruler. Relations and successive arithmetic produce it. Iranica reports a decimal expansion of seventeen digits, while other accounts summarize accuracy differently. We do not turn those reports into independent certification of every digit, or claim a sky observation possessed the same precision as a computed value {cite:iranica-kashi sine computation} {cite:qadi-zada-mactutor original work}.

## The world before it

Sines, chords and tables preceded al-Kashi. The museum's [[invention/battani-sine-table-methods|al-Battani sine-table computation]] provides earlier context, not proof that a particular copy reached al-Kashi. MacTutor names al-Biruni as a predecessor in approximate solutions of the angle-trisection cubic. This was an inherited problem, not a question suddenly created in Samarkand {cite:kashi-mactutor final treatise}.

A table and a method for extracting a basic value are different things. One operation may interpolate between existing cells; another improves the values from which a table is constructed. We do not count every use of sine separately. This record concerns a particular numerical contribution associated with a named work, not a new label for all trigonometry, earlier sine tables or timekeeping {cite:tdv-kashi-okten work8} {cite:iranica-kashi sine computation}.

## The story

The biographies place al-Kashi in [[place/samarqand|Samarkand]]'s scholarly environment under Ulugh Beg: books, calculations, instruments and discussions. Letters to his father offer his judgements of colleagues, not a neutral ranking the museum endorses. Attending the same meeting does not establish co-authorship, and supporting an institution does not give a patron authorship of every result {cite:kashi-mactutor Samarkand and letters} {cite:iranica-kashi Life}.

MacTutor calls the Chord and Sine his last work, possibly unfinished at his death and completed by Qadi Zada. Iranica includes its title in the introduction's work list of the1427 Key to Arithmetic. A listed title does not settle whether every part was complete. Our open date ends at al-Kashi's1429 lifetime bound, not an invented composition year or a date for later commentary {cite:kashi-mactutor final treatise} {cite:iranica-kashi work list}.

## The maker(s)

MacTutor individually identifies al-Kashi as an Islamic mathematician. This supplies the recorded Muslim basis, not his name or city. The museum's separate default Sunni frame is not detailed proof of personal school. We do not derive it from a patron's affiliation or suggest these scholarly biographies constitute a complete record of his religious education {cite:kashi-mactutor summary} {cite:tdv-kashi-okten biography}.

Qadi Zada presents a separate documentation question. His MacTutor biography describes a different method for the same value; TDV names a commentary; al-Kashi's biography discusses possible completion. These may concern different works or stages, but we have not collated texts to decide. Neither erase his role nor silently make him equal co-author of every step {cite:qadi-zada-mactutor original work} {cite:tdv-kashi-okten work8} {cite:kashi-mactutor final treatise}.

## How it works

The following is a modern derivation, not a transcription. MacTutor connects the historical problem with a cubic and iteration; we explain that connection using present-day notation without attributing our exact sequence to al-Kashi. Let `x` be sine one degree and `a` sine three degrees. The triple-angle relation gives `a=3*x-4*x*x*x`. Tripling the angle does not simply triple its sine {cite:kashi-mactutor final treatise}.

Rearrange this as `x=(a+4*x*x*x)/3`. With an approximate input `a`, start at `x0=a/3`, then substitute the current estimate into the right-hand side to obtain another. Cubing means multiplying a number by itself three times, not multiplying it by three. We divide the specified sum, not every angle or side in a drawing.

Our modern computation takes `a≈0.05233595624294383` from a software trigonometric function. It starts near `0.017445318748`, then gives `0.017452397806`, then `0.017452406427`. Displayed values are rounded, not cells read from a historical table. Using a ready-made function tests this illustration; it does not reconstruct how an earlier mathematician obtained the input.

Why do these steps help here? Between zero and0.02 the derivative of the right-hand side, `4*x*x`, is at most0.0016. Output changes are much smaller than estimate changes. Our modern check verifies the transformation stays in this small interval and successive differences shrink. This concerns the chosen interval, not a promise that every cubic and starting guess converges.

The cubic has other roots; we want the small positive one appropriate to a one-degree acute angle. Root selection is part of solving, not decoration after writing an equation. Fast iteration cannot repair a wrong input: changing `a` changes the problem. More output digits cannot erase initial approximation or arithmetic-rounding error.

Historical precision remains reported through scholarship, not proved by this limited machine example. We do not call it Newton's method, attribute a modern program structure to al-Kashi, or infer exact straightedge-and-compass trisection of arbitrary angles. Numerical approximation and an exact geometric construction are distinct problems, even when both discuss angles {cite:kashi-mactutor final treatise}.

## The spread

TDV lists Qadi Zada's commentary, a Tehran printing numbered1299 and a Russian translation. We report that bibliographical statement without guessing a calendar conversion or claiming to have inspected the printing. A commentary or translation documents attention as described by a scholar, not a census of students or proof that all witnesses are identical {cite:tdv-kashi-okten work8}.

MacTutor says these achievements remained long unknown in Europe and were studied in the nineteenth and twentieth centuries. Resemblance to a modern method does not establish direct transmission. A documented route requires copies, readings and citations, not merely two dates and an assumption that an earlier author necessarily supplied every later one {cite:kashi-mactutor conclusion}.

## What it was built on

Trigonometric relations, arithmetic, algebra and place value lie behind the result. MacTutor acknowledges al-Biruni's approximate cubic work, not a manuscript transmission chain we have verified. Readers can compare [[invention/biruni-difference-interpolation|difference interpolation]] to distinguish correcting a table from repeatedly solving an algebraic relation; different tools need not become one algorithm {cite:kashi-mactutor final treatise}.

Our modern `a` also requires a known computational source. Saying “calculate sine three degrees” does not explain an earlier author's procedure. We cannot fill that gap with a software call and attribute it backward. Distinguishing input, relation, root selection and stopping rule reveals four layers of an explanation; having one does not prove the others.

## What was built on it

Sources place accurate computation within Samarkand astronomy, but an astronomical table combines observation, models, calendars and arithmetic. A precise sine does not make every star coordinate correct to the same number of places. We add no particular downstream invention merely because astronomy uses trigonometry {cite:iranica-kashi mathematics and astronomy} {cite:qadi-zada-mactutor collaborative catalogue}.

TDV's commentary report provides a reception strand, with differing descriptions of Qadi Zada's role retained. Modern software is a teaching comparison, not a demonstrated descendant. Leaving direct dependents empty is more honest than constructing an influence network of famous names without read evidence. It does not mean the work lacked value; this kind of specific connection is unestablished here {cite:tdv-kashi-okten work8}.

## Impact on daily life

A small value may seem remote, yet it illustrates a practical distinction between measuring a shape and performing reproducible calculation. Iranica links the search for greater sine precision to astronomical needs, not a household machine caused by those digits. We possess no measured total of money, time or journeys saved by the treatise and invent none {cite:iranica-kashi sine computation}.

Input quality matters alongside procedural skill. Continuing after the displayed digits settle supplies no new knowledge of a historical witness. That is a present educational use we propose, separate from documented social impact. Our paper calculation is not a navigation system, and the children's activity requires neither solar observation nor instrument-making.

## How it changed history

The work joins algebra and trigonometry: an angle problem becomes an equation, then an approximation process. MacTutor emphasizes iteration's quality and Iranica its reported accuracy. We describe a bounded numerical development, not evidence that every branch of modern mathematics began here, nor reason to erase earlier approximation {cite:kashi-mactutor final treatise} {cite:iranica-kashi sine computation}.

Its study also separates accomplishment from later reception. A text circulating in one setting, historians studying it elsewhere and contemporary software producing a related value are three stories, not an automatic single lineage. MacTutor's account of delayed European knowledge cannot stand for an independent inspection of every European author and library {cite:kashi-mactutor conclusion}.

## Who invented it?

Attribution rests on scholarship describing the Chord and Sine, not resemblance between a modern drawing and a manuscript. Al-Biruni is an acknowledged predecessor; Qadi Zada has differently described roles. Recognizing them neither removes al-Kashi nor promotes “possibly completed” into certain participation in every calculation {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

Accuracy reports also differ. Iranica says seventeen digits in a decimal expansion; al-Kashi's biography compares sine accuracy with pi, while Qadi Zada's biography gives a summary of order `10^-12`. We preserve those formulations rather than force agreement or call them independent readings of historical digits. A read numerical witness is needed to evaluate rounding and error {cite:iranica-kashi sine computation} {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

## Today

A modern lesson can test a small interval, compare successive estimates and inspect residual `3*x-4*x*x*x-a`. A small residual checks the input equation, not the input's historical correctness. Distinguish a rounded display from a longer internal value, otherwise two estimates may look identical simply because a screen hides their difference.

The reused image is TheOtherJesse's2007 right-triangle diagram, released to the public domain. LettersA,B,C and English side labels are modern; the drawn angle is not one degree. It contains neither al-Kashi's figures nor his page, and its scale does not establish his procedure. It explains opposite side and hypotenuse, not a historical witness {cite:commons-trigonometry-triangle Description licence and original history}.

## Surviving examples

Our evidence is the scholarly accounts actually read. TDV identifies treatise and commentary, and Iranica supplies a work list. We have not read original text, commentary or Dilgan's technical study cited by Qadi Zada's biography. No remembered shelfmark or unseen photographed page is presented as inspected evidence {cite:tdv-kashi-okten work8} {cite:iranica-kashi work list} {cite:qadi-zada-mactutor references}.

Completion, commentary and different-method descriptions remain visible in the work record and supporting prose. We do not pronounce the treatise lost from a search summary or claim an author's autograph survives. Stating what we read allows evaluation of the evidentiary layer: knowing a title differs from having established its text.

## In culture

Samarkand evokes architecture and an observatory, but this is also a story of calculation and books. Father-and-son letters, patronage and discussions with colleagues appear in the biographies. Praise remains attributed speech, not a national competition or the museum declaring that one scholar surpassed everyone in every field {cite:kashi-mactutor letters and patronage} {cite:iranica-kashi Life}.

Long numbers tempt heroic stories. Iranica distinguishes computational and instrument skill from less-established contributions to cosmological planetary theory. That does not diminish a numerical result; it makes a historical person more specific than a slogan. The complex authorship question belongs to knowledge's history, not a defect to conceal {cite:iranica-kashi concluding assessment}.

## For young readers

Write “angle” on one paper card and “ratio of sides” on another. Is a third of a number the same question as the sine of a third of an angle? An adult can identify triangle parts without measuring the picture's accuracy. The point is distinguishing kinds of quantity, not memorizing a long answer.

Then write an estimate, a correction and where the starting value came from. No sun, telescope or special equipment is needed. When displayed digits agree, ask whether the answer became exact or the paper merely stopped showing smaller differences. Recognizing an example's limits is part of learning, like recognizing that our drawing is not al-Kashi's page.

## References

- {cite:kashi-mactutor complete biography}
- {cite:tdv-kashi-okten work8 and biography}
- {cite:iranica-kashi mathematics work list and assessment}
- {cite:qadi-zada-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description licence and original history}
