---
id: invention/abu-wafa-fixed-opening-constructions
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code (model unknown), from Arabic"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b35", source: "Arabic canonical account; selected actual Woepcke1855 French/Persian-based text and321 image, selected Raynaud2012 sections and inspected licensed modern photograph; no independent Arabic collation" }
---
## Summary

What changes in a geometrical problem when straightedge and compass are allowed, but changing the compass opening between steps is forbidden? In the collection attributed to [[person/abu-al-wafa-al-buzjani|Abu al-Wafa al-Buzjani]], the constraint is not an isolated puzzle: it connects several constructions into an organized apparatus, as Woepcke explains {cite:abu-wafa-woepcke-constructions-1855 pp.224–227}. We present the organization and development of these methods, not invention of the compass or every old construction, and distinguish textual evidence from the European-transmission hypothesis debated in modern research {cite:raynaud-abu-wafa-latinus-2012 secs.2,11}.

## What it is

A compass specifies a circle by a center and a fixed distance between its points. In this kind of problem that distance remains unchanged during construction, although the center can move and different arcs can be drawn {cite:abu-wafa-woepcke-constructions-1855 pp.224–227,321}. The straightedge supplies a line through two points; it is not secretly used as a graduated ruler to read off a new length. The challenge is not to forbid movement, but to achieve the result with less freedom than changing radius whenever convenient.

On227 Woepcke distinguishes choosing an opening from a length already among the problem's data from the stricter constraint of an opening given independently beforehand {cite:abu-wafa-woepcke-constructions-1855 p.227}. One attractive label should not erase that difference. The collection provides connected constrained solutions, but a general equivalence statement in the editor's discussion does not automatically become Abu al-Wafa's theorem for every possible construction {cite:abu-wafa-woepcke-constructions-1855 pp.226–227}.

## The world before it

Line-and-circle construction had an earlier history, and the scientific biography retains Greek and Indian precedents for some materials in Abu al-Wafa's book. This does not establish that every constrained method here is an identical copy of an earlier text {cite:abu-wafa-youschkevitch-dsb geometry}. A precedent may be a problem, figure or particular solution: these are different things. Earlier geometry need not disappear for us to appreciate collecting, arranging and solving problems again under a tool constraint.

Conversely, we do not adopt the nineteenth-century editor's “first example” wording as a universal priority judgment {cite:abu-wafa-woepcke-constructions-1855 pp.218–219}. He discusses the texts available to him; wider manuscript knowledge or different witnesses can change the claim. Not every repeated use of one radius is a complete fixed-opening theory, and that stricter theory is not identical to every successful partial procedure.

## The story

Abu al-Wafa belongs to the scholarly setting of [[place/baghdad|Baghdad]], but locating the city does not locate a workshop or lesson for every construction {cite:britannica-abu-al-wafa biography}. Woepcke describes his base as a Persian translation of an Arabic text apparently collecting the scholar's lessons through a pupil, perhaps also abridged. These are layers of redaction and translation, not an unmediated autograph notebook {cite:abu-wafa-woepcke-constructions-1855 pp.218–219}. The story includes those who preserved the knowledge and the limits of what we know about them.

Raynaud discusses a possible993–1008 compilation window from the patron's titles, with a possible993–998 authorial window and an alternative posthumous-redaction reading {cite:raynaud-abu-wafa-latinus-2012 sec.1 note2}. We use the interval as a compilation discussion, not each construction's invention date; no convenient single year or fabricated Hijri equivalent is supplied. Chapter counts also depend on version: twelve in the Persian extract, thirteen announced and eleven surviving in Raynaud's account {cite:abu-wafa-woepcke-constructions-1855 pp.319–321} {cite:raynaud-abu-wafa-latinus-2012 sec.1 note3}.

## The maker(s)

Britannica explicitly calls Abu al-Wafa himself a Muslim mathematician and astronomer: individual identity evidence, not inference from a name or patron's beliefs {cite:britannica-abu-al-wafa biography}. Sunni is the museum's declared frame, not testimony to his personal legal school. The contribution here is the constrained construction repertoire, distinct from his [[invention/abu-wafa-spherical-triangle-methods|spherical-triangle solution methods]]. We do not count the same arc calculation twice because the author is the same.

**Sunni—declared frame:** attribution stays within the witness, with the general frame separated from personal school testimony unavailable in the biography {cite:britannica-abu-al-wafa biography}. **Academic account:** Woepcke describes pupil, translation and abridgment; Raynaud discusses Arabic witnesses and different copies. Neither makes every surviving sentence the scholar's verbatim dictation {cite:abu-wafa-woepcke-constructions-1855 pp.218–219} {cite:raynaud-abu-wafa-latinus-2012 sec.1}. Author and preservers of the lesson both remain in the story.

## How it works

In the introduction's first construction, take the endpoints of a segment as centers of two circles with the same opening, then join their intersections. The resulting line is perpendicular to the segment. The first problem of chapter1 reuses it to bisect a segment or suitable arc {cite:abu-wafa-woepcke-constructions-1855 pp.321–322}. The second circle is not a retracing of the first: its center changes while its radius stays fixed. New information comes from intersecting figures, not measuring out a ready-made right angle with a protractor.

Explain this using modern coordinates, not the author's symbols: `A=(0,0)`, `B=(L,0)`, radius`r`. Intersections satisfy `x²+y²=r²` and `(x−L)²+y²=r²`; subtracting gives `x=L/2`. Their joining line therefore passes through the segment's midpoint, and their vertical coordinates are `y=±√(r²−L²/4)`. This is a teaching rewrite of the translated construction, not a claim that the text used coordinate algebra {cite:abu-wafa-woepcke-constructions-1855 pp.321–322}.

Two distinct intersections require `0<L<2r`. At twice the radius the circles touch at one point; beyond it they do not meet; at zero length they coincide and this step determines no perpendicular. In our modern example `L=2`, `r=2`, intersections are`(1,√3)` and`(1,−√3)`, with midpoint`(1,0)`. Success does not show that an arbitrarily small chosen opening immediately works for every segment—hence the importance of Woepcke's stated constraint {cite:abu-wafa-woepcke-constructions-1855 p.227}.

Page322 gives a perpendicular at a segment's endpoint without extending the segment beyond that endpoint: choose a point on the segment, draw two circles with radius equal to its distance from the endpoint, then use an intersection and an appropriate extended line {cite:abu-wafa-woepcke-constructions-1855 p.322}. Our modern example takes `A=(0,0)`, `C=(1,0)`, opening1. Choose intersection `D=(1/2,√3/2)` and extend`CD` past`D` by the same length`DC` to `E=2D−C=(0,√3)`. Then`AE` is perpendicular to the original line; the same distance can be held through the step without measuring a new ruler length.

This second example chooses its opening from`AC`, so is not proof of the stricter case where the radius is independent of every datum {cite:abu-wafa-woepcke-constructions-1855 p.227}. A perpendicular or bisector also does not establish exact trisection of any angle with these tools. The book includes wider problems and differing procedures; a correct account of one construction must not be extended to every polygon or section {cite:abu-wafa-mactutor geometry}.

The first construction can also be understood without coordinates. Each intersection is equally distant from the endpoints because both circles have the same radius. Symmetry of the triangles on the common segment makes the intersections' joining line its axis, combining perpendicularity and bisection {cite:abu-wafa-woepcke-constructions-1855 pp.321–322}. Coordinates are an independent teaching/checking tool, not an extra requirement imposed on the artisan or on geometrical proof.

## The spread

Woepcke thought some Renaissance geometers' one-opening constraint might indicate earlier eastern traditions. He framed this as a likelihood, not evidence of a specified translation, and did not reduce them to mere copyists {cite:abu-wafa-woepcke-constructions-1855 pp.225–226}. We cannot turn an editor's inclination into a verified manuscript itinerary between unwitnessed cities. A similar problem title does not alone establish that its solution traveled with a copy or a particular teacher.

Raynaud presents the independent-rediscovery argument, then tests solutions, diagram lettering and probability indices in particular works, including Tartaglia, Marolois and Schwenter {cite:raynaud-abu-wafa-latinus-2012 secs.2,11}. His conclusion concerns a bounded corpus, not all Arabic influence on European mathematics; nor do we infer that a manuscript never existed merely because its translation was not found here {cite:raynaud-abu-wafa-latinus-2012 sec.11}.

## What it was built on

Before problems, the translated introduction discusses checking the straightedge, compass and square—the right-angle tool {cite:abu-wafa-woepcke-constructions-1855 p.321}. This connects figure geometry to tool checking, not a promise that any defective tool still produces a correct figure. Later problems refer to earlier constructions; Woepcke identifies an organized repertoire from these connections, not merely from a circle on a page {cite:abu-wafa-woepcke-constructions-1855 p.226}. Earlier geometry remains visible without an invented chain of personal teachers.

## What was built on it

**Sunni—contribution boundary:** we establish a collection attributed to a Muslim scholar, not automatic descent of all later geometry {cite:britannica-abu-al-wafa biography} {cite:abu-wafa-woepcke-constructions-1855 pp.226–227}. **Academic account:** Woepcke's tentative eastern transmission contrasts with Raynaud's analysis favoring independent reconstruction in the works tested. Both are attributed, without a final museum verdict {cite:abu-wafa-woepcke-constructions-1855 pp.225–226} {cite:raynaud-abu-wafa-latinus-2012 sec.11}. Accordingly, our generic diagram does not make this a direct ancestor of a modern design program.

## Impact on daily life

The book's title and artisan connection establish practical geometry as a documented setting, not use of the same procedure in every workshop or building {cite:raynaud-abu-wafa-latinus-2012 sec.1}. Raynaud quotes discussion of defects during opening/closing and tools for larger drawings. We read this as a reason to care about control, not a modern measurement of percentage improvement or a universal engineering guarantee {cite:raynaud-abu-wafa-latinus-2012 sec.2.2}. Fewer opening changes are an intelligible aim; actual accuracy would need an experiment we have not performed.

## How it changed history

The collection shows how a constraint can organize inquiry rather than merely obstruct it: early problems feed into later solutions, allowing the relation between theory and working procedure to be examined {cite:abu-wafa-woepcke-constructions-1855 pp.226–227,321–324}. It also illustrates the difficulty of transmission history. Two similar drawings may reflect a common source or similar resources applied to the same problem. Raynaud calls for tests beyond visual resemblance, without extrapolating his results to every place and period {cite:raynaud-abu-wafa-latinus-2012 sec.11}.

## Who invented it?

The contribution established is organization/development of constrained solutions, not invention of every compass, perpendicular or bisector. Some materials have precedents, and the text has transmission layers {cite:abu-wafa-youschkevitch-dsb geometry} {cite:abu-wafa-woepcke-constructions-1855 pp.218–219,226–227}. **Sunni—declared frame:** the scholar's documented Muslim identity is separate from priority for each solution {cite:britannica-abu-al-wafa biography}. **Academic account:** lesson attribution, redaction date and subsequent pathways have differing evidence. An interpretation of transmission does not erase the collection's existence {cite:raynaud-abu-wafa-latinus-2012 secs.1,11}.

## Today

The photograph shows a modern drafting compass and attachments, photographed by Radomil in2005 under a share-alike licence. It is not Abu al-Wafa's tool or proof that its mechanism prevents opening changes {cite:commons-compass-radomil history and licensing}. It illustrates the two points and the distance between them. Compare that with the paper problem's constraint while distinguishing an adjustable instrument from the decision to hold its opening during a solution. No archaeological or reconstruction claim is needed.

## Surviving examples

The image of printed321 in the1855 publication was checked and specified analysis/extract passages read; no independent Arabic collation, complete article reading or original Persian manuscript inspection is claimed {cite:abu-wafa-woepcke-constructions-1855 pp.218–219,321–324}. Raynaud lists Arabic copies and differences in surviving chapters; we read those reports in his paper, not all manuscripts listed {cite:raynaud-abu-wafa-latinus-2012 sec.1 notes1–3}. A publication image witnesses a published text, not the age of the sheet on which a lesson was first recorded.

## In culture

The book connects mathematics and craft without making every later ornament its author's signature {cite:raynaud-abu-wafa-latinus-2012 secs.1,11}. Differences of headings, chapters and redaction show knowledge preserved through copying, translation and abridgment too, not only one author's biography {cite:abu-wafa-woepcke-constructions-1855 pp.218–219,319–321}. The museum does not claim that every Islamic design used this constraint, or turn the artisan title into a personal occupation for an unidentified maker.

## For young readers

Imagine keeping your compass opening while drawing circles from two centers: an intersection may tell you something you never drew directly. That is what the collection's right-angle example illustrates {cite:abu-wafa-woepcke-constructions-1855 p.321}. Always ask whether the radius permits an intersection and whether an example proves one problem or every problem. Discovering who preserved and translated a solution is as interesting as reaching the shape. Not every similar drawing was borrowed, and no old drawing is the beginning of all science.

## References

- Woepcke1855, selections218–220,224–227,319–324;321 image checked. French based on Persian, not complete article reading {cite:abu-wafa-woepcke-constructions-1855 selected passages}.
- Raynaud2012, abstract,1/notes,2.1–2.2 and11; not all appendices read or all tests independently reproduced {cite:raynaud-abu-wafa-latinus-2012 secs.1,2,11}.
- Individual biography, geometry context and licensed photograph {cite:britannica-abu-al-wafa biography} {cite:abu-wafa-youschkevitch-dsb geometry} {cite:abu-wafa-mactutor geometry} {cite:commons-compass-radomil licensing}.
