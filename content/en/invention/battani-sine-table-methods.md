---
id: invention/battani-sine-table-methods
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
---
## Summary

In chapter three of [[work/al-zij-al-sabi|his Zij]], [[person/al-battani|Muhammad ibn Jabir al-Battani]] explains constructing a table of half-chords of doubled arcs and using it in both directions: from an arc to a length, and from a length to an arc {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17; Latin pp. 9–11}. We call these quantities sines today; this is a computational refinement within older traditions, not invention of sine or all trigonometry {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. The chapter combines geometry, tabulation and approximation rather than presenting numbers without instructions for using them {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## What it is

The table connects an arc with a calculated length in a circle of specified scale: al-Battani chooses diameter120 and radius60 {cite:nallino-albatenii-opus-astronomicum Arabic p. 13; Latin p. 9}. A “half-chord of the doubled arc” means doubling the arc's angle and taking half the corresponding chord, not halving the original angle {cite:nallino-albatenii-opus-astronomicum Arabic pp. 15–16; Latin p. 10}. This makes the tabulated sine correspond directly to the user's input arc, avoiding repeated doubling during calculation {cite:nallino-albatenii-opus-astronomicum Latin p. 10}.

## The world before it

The author explicitly follows Ptolemy in choosing diameter120 for convenient calculation; the scale is inherited, not a private invention {cite:nallino-albatenii-opus-astronomicum Arabic p. 13; Latin p. 9}. He begins with chord geometry and right-triangle relationships, then constructs chords of further arcs through halving, addition and subtraction {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15; Latin pp. 9–10}. This does not establish that every operation first appeared in this book: the record concerns their practical arrangement and the table's use within the Zij {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## The story

Al-Battani's observing work was associated with [[place/raqqa|Raqqa]], and his Zij comprised fifty-seven chapters, not an isolated sheet of sines {cite:tdv-battani-muftuoglu biography and Kitab al-Zij} {cite:battani-mactutor chapter outline}. Computational foundations precede later chapters on using tables, making chapter three an introduction to a larger working tool {cite:tdv-battani-muftuoglu Kitab al-Zij}.

The inspected pages supply no independent composition year for this chapter; neither a star-catalogue epoch nor the beginning of observations becomes an invention date {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17} {cite:tdv-battani-muftuoglu biography}. The record's open-ended date terminates at his death in317 AH/929: a latest-lifetime bound, not a claim that he composed it specifically in929 {cite:tdv-battani-muftuoglu biography}.

## The maker(s)

Al-Battani's recorded role is “improver”: the text documents a computational choice and working procedures on top of earlier geometry {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. His Muslim identity here rests on the author's religious opening, read in Arabic, and Nallino's explicit argument from it—not his name or family affiliation {cite:nallino-albatenii-opus-astronomicum Arabic p. 6, scan1146; Latin preface XVI, scan25}. The museum's Sunni frame is separately declared for the Abbasid Raqqa setting, not presented as a personal legal-school declaration; his biography retains named historical identity opinions without inferring religion from “al-Sabi” alone {cite:tdv-battani-muftuoglu biography} {cite:nallino-albatenii-opus-astronomicum Latin preface XVI, scan25}.

## How it works

The chapter first constructs known chords, including the60-degree chord equal to the radius, using squared-side relationships in right triangles and chords whose arcs complete a semicircle {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15; Latin pp. 9–10}. It then turns to half-chords of doubled arcs, tabulated every half-degree through90 degrees {cite:nallino-albatenii-opus-astronomicum Arabic pp. 15–16; Latin p. 10}. The construction includes an approximation for the one-degree chord, so not every stage should be described as exact without approximation {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–10}.

In modern explanatory notation—not copied manuscript symbols—`S(theta) = 60 sin(theta)`; the entries for30 and90 degrees are therefore30 and60, not0.5 and1 until divided by60 {cite:nallino-albatenii-opus-astronomicum Arabic p. 16; Latin p. 10}. A full chord is recovered by doubling the sine of half its angle, not by doubling the sine of that same full angle {cite:nallino-albatenii-opus-astronomicum Arabic p. 17; Latin p. 11}.

For an angle between rows, take the difference between adjacent table values, multiply by the extra arcminutes above the lower row, divide by30 arcminutes, and add the result to the lower value {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17; Latin pp. 10–11}. This is linear interpolation: a teaching example derived from it places30 degrees15 minutes halfway between30 degrees and30 degrees30 minutes, taking half the tabular increase without inventing historical digits for the two entries {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

The reverse procedure locates the lower table value, converts the excess length into arcminutes proportionally to the adjacent-row difference, and adds them to the starting arc {cite:nallino-albatenii-opus-astronomicum Arabic p. 17; Latin p. 11}. Nallino calls this “arcuation”; his footnote explains choosing Latin sine/cosine terminology to render the half-chord expressions. The translator's Latin words should not be mistaken for literal Arabic phrasing {cite:nallino-albatenii-opus-astronomicum Latin p. 11 and note}.

## The spread

The Zij reached Latin and Castilian readers, and the biographies discuss the book's reception in later astronomy {cite:tdv-battani-muftuoglu Kitab al-Zij} {cite:battani-mactutor reception}. Transmission of a work containing computation and tables does not alone prove that each chapter-three step reached every reader unchanged; this record therefore draws no precisely dated worldwide itinerary for the procedure alone {cite:battani-mactutor reception}.

## What it was built on

The explanation's immediate foundation is chord geometry, the diameter120 convention, and procedures constructing arcs and their corresponding lengths; Ptolemy's name is retained where the author explicitly acknowledges his convention {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15}. Moving to half-chords of doubled arcs changes the input used in table work, but does not erase the preceding geometry or make the circle a new invention {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–10}.

## What was built on it

In the following chapter four, sine and inverse-arc computation serve a declination problem at the same radius: an identifiable application inside the work, rather than a merely modern resemblance {cite:nallino-albatenii-opus-astronomicum Latin p. 12}. The spherical sine law is not silently bundled into this result; a table and its use are not every theorem attributed to the Zij's author and require their own investigation {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–12}.

## Impact on daily life

The immediate benefit concerns the calculator's work: treating an unlisted angle and solving the reverse problem without reconstructing the geometry from scratch {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17}. The inspected pages provide no census of market or navigation users, so a computational benefit does not become an undocumented story about every household or ship {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

## How it changed history

MacTutor describes al-Battani's trigonometric methods as an advance in astronomical calculation; the inspected chapter exposes some of the work behind that broad statement {cite:battani-mactutor trigonometric methods} {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. Its value lies in connecting length construction, organized values and instructions for finding a quantity without its own printed row—not declaring one father of all modern digital computation {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## Who invented it?

The narrower answerable question is who explains this system in this Zij: al-Battani, with an explicit debt to older geometry {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}. The first sine, first table and first interpolation across every civilization are different questions, not settled by these pages or by a scholar's name on a book {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}.

## Today

Readers can compare the historical radius60 scale with modern unit normalization and understand interpolation as an estimate between entries, not an exact replacement for the underlying function at every input {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}. The image is a modern right-triangle teaching diagram released by TheOtherJesse to the public domain in2007, not al-Battani's table; its side names are relative to a particular angle {cite:commons-trigonometry-triangle Description and Licensing}.

## Surviving examples

The inspected textual witness is Nallino's edition: Arabic printed13–17 corresponds to scans1139 down to1135, and Latin printed9–11 to scans98–100; the Arabic part is reverse-ordered in this bound file {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17; Latin pp. 9–11}. This is reading specified pages of a published edition, not physically examining the manuscript or claiming to have read all the book's tables {cite:nallino-albatenii-opus-astronomicum edition}.

## In culture

The biography of “al-Battani” or “Albaten(i)us” belongs to the transmission of an Arabic work into other languages, but variant names among readers do not justify giving him credit for every later method {cite:battani-mactutor reception}. The museum distinguishes the old text, a translator's Latin terminology, and a modern teaching image accompanying it {cite:nallino-albatenii-opus-astronomicum Latin p. 11 note} {cite:commons-trigonometry-triangle Description}.

## For young readers

Imagine a table that cannot print every possible angle: what happens when yours falls between two rows? Al-Battani explains estimating a share of the difference, then reversing from length to angle; the lesson is a way of reading, not only memorizing a long string of numbers {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17}. Start with the halfway idea, remembering that it is an approximation, not a life-size drawing of the sky {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

## References

- Nallino's edition/translation: chapter three Arabic13–17/scans1139–1135, Latin9–11/scans98–100; beginning of chapter four Latin12; Arabic opening6/scan1146 and Latin identity argumentXVI/scan25 {cite:nallino-albatenii-opus-astronomicum edition}.
- Ferruh Müftüoğlu, “BETTÂNÎ,” TDV,6 (1992),9–10 {cite:tdv-battani-muftuoglu article}.
- O'Connor and Robertson, MacTutor, November1999; conflicting translation dates and name-only religious inference not adopted {cite:battani-mactutor biography}.
- TheOtherJesse's original archived2007 triangle and author-release metadata, not the revised2024 rendering {cite:commons-trigonometry-triangle Description, Licensing and file history}.
