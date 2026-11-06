---
id: invention/ibn-al-haytham-fourth-power-volumes
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code; model unknown"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b36", source: "Arabic museum article from actual selected Katz163–168,174 and167–168 images, Bressoud I/III selections and Dennis/Addington notes; no independent Arabic paraboloid-treatise reading" }
---
## Summary

How can we measure a volume whose boundary is neither a box nor a cylinder? [[person/ibn-al-haytham|Ibn al-Haytham's]] method connects sums of fourth powers with trapping a curved solid between calculable quantities. In this problem its volume is eight fifteenths of its surrounding cylinder {cite:katz-calculus-islam-india-1995 pp.165–168}. This was not the invention of all calculus, or the first measurement of every paraboloid. It was a particular extension of geometrical calculation to a problem requiring fourth powers, accompanied by a proof rather than merely the impression that thin layers resemble the shape {cite:bressoud-calculus-before-newton-i pp.2–4}.

## What it is

The contribution is a calculating and proving method, not a surviving machine. A fourth power multiplies a number by itself four times: two to the fourth is sixteen. Adding consecutive fourth powers differs from raising the sum of those numbers to the fourth power {cite:dennis-addington-alhazen-summation-2009 pp.2–4}. Geometry requires both an explanation of why squaring the section's radius introduces fourth powers, and a way to calculate their sum without enumerating endlessly many layers {cite:katz-calculus-islam-india-1995 pp.167–168}.

The solid is not the ordinary paraboloid bowl obtained by rotating a parabola about its own axis. Here the rotation axis is perpendicular to the parabola's axis and lies at the boundary of the specified region {cite:bressoud-calculus-before-newton-i pp.2–3}. The8/15 ratio therefore does not apply to every bowl or dome called parabolic. Our comparison image shows the earlier ordinary axial solid, not the new dome.

## The world before it

Area and volume problems long preceded Ibn al-Haytham. Katz discusses Archimedes' sum of squares and Aryabhata's formula for cubes; their use in a later argument does not make these earlier results new inventions {cite:katz-calculus-islam-india-1995 p.165}. Geometrical results were often expressed as ratios to known shapes, rather than modern symbolic volume formulas {cite:dennis-addington-alhazen-summation-2009 pp.4–5}.

Bressoud distinguishes Archimedes' axial solid, with half the corresponding cylinder's volume, from the precedents of Thabit ibn Qurra and Abu Sahl al-Kuhi in Arabic scientific work {cite:bressoud-calculus-before-newton-i p.2}. Thabit stays in this account: the browser's maker-selection rule must not erase the people whose work preceded the contribution. Earlier work does not eliminate improvement, and improvement does not reduce earlier mathematicians to incidental names.

## The story

Katz situates the summation work in eleventh-century Egypt and connects the scholar from [[place/basra|Basra]] with his Egyptian life. TDV provides biographical details while reporting differences in accounts of his death {cite:katz-calculus-islam-india-1995 pp.165–166} {cite:tdv-ibnul-heysem pp.82–87}. We use [[place/cairo|Cairo]] as biographical context, not evidence for a particular room where this treatise was written. The broad activity-century date is not a precise invention or composition date.

The mathematical sources actually read here are modern scholarly explanations. Knowing where an edition or translation is listed does not amount to reading the original treatise. Calculation details rely on Katz and Bressoud; we claim neither independent Arabic manuscript collation nor reading every edition in their bibliographies {cite:katz-calculus-islam-india-1995 pp.166–168,174}.

## The maker(s)

The person record retains an individualized Muslim basis: the opening in his name in the *Optics*, and TDV's account of his writings defending prophethood and discussing theological questions. Neither his name nor the denomination of his host state supplies that identity {cite:manazir-sabra-1983 scan-p.60} {cite:tdv-ibnul-heysem pp.82–87}. The Sunni frame is the museum's declared frame, not documentation of a personal legal school. Fatimid patronage does not automatically determine his affiliation.

**Sunni—declared frame:** attribute the bounded contribution while retaining identity evidence and its limits {cite:tdv-ibnul-heysem pp.82–87}. **Academic account:** Katz distinguishes the author's examples from modern reconstruction; Bressoud explicitly finds no evidence he went beyond fourth powers, even though the method can be extended {cite:katz-calculus-islam-india-1995 pp.166–167} {cite:bressoud-calculus-before-newton-iii pp.2–3}. This is mathematically distinct from the existing [[invention/camera-obscura|dark-room experiments]], not another count of that experiment.

## How it works

We use modern teaching notation, not a reproduction of the author's symbols. For positive lengths `a,b`, take the parabola `x=a(y/b)^2` and the region between it and `x=a`, with `0≤y≤b`. Rotate this region around `x=a`. The horizontal section has radius `r(y)=a(1−(y/b)^2)`, falling from `a` at the base to zero at the summit {cite:bressoud-calculus-before-newton-i pp.2–3} {cite:katz-calculus-islam-india-1995 p.168}. Rotation about the other axis produces a different solid, not another view of the same volume.

Divide the height into `n` equal intervals, each `b/n` thick. A disk's area depends on the square of its radius. Squaring a radius expression containing `y²` introduces `y⁴`; no fourth spatial dimension is involved {cite:dennis-addington-alhazen-summation-2009 p.1}. An inner disk at height `ib/n` contributes `πa²b/n × (1−i²/n²)²`. Expanding the bracket as `1−2i²/n²+i⁴/n⁴` explains why both squares and fourth powers must be summed {cite:katz-calculus-islam-india-1995 p.168}.

In modern notation the fourth-power formula is `S4(n)=n^5/5+n^4/2+n^3/3−n/30`, equivalently `n(n+1)(2n+1)(3n²+3n−1)/30` {cite:katz-calculus-islam-india-1995 p.167}. For example, `1+16+81+256=354`. That checks a small case; it is not proof that the formula works for every positive integer.

A finite-sum rearrangement explains the derivation. Write `Sk` for a sum of kth powers. Then `(n+1)S3(n)=S4(n)+ΣS3(j)`, for `j=1,...,n`. Substituting the cube-sum formula makes the right side `5S4/4+S3/2+S2/4`. Consequently `S4=4(n+1/2)S3/5−S2/5`; substitute the known square and cube formulas to finish {cite:bressoud-calculus-before-newton-iii pp.2–3} {cite:katz-calculus-islam-india-1995 pp.166–167}. This is checkable modern reconstruction. Katz specifies that the author's derivation illustrates `n=4` and asserts the general result. Katz's modern presentation must not become an alleged literal medieval text.

After substitution, the inner disk sum divided by cylinder volume `πa²b` is `L(n)=8/15−1/(2n)−1/(30n^4)`. The outer sum is `U(n)=L(n)+1/n`. These teaching definitions enclose every actual layer between a smaller and a larger disk; their total difference is `1/n` of the cylinder and can be made as small as required. At `n=4`, `L=0.408203125` and `U=0.658203125`, enclosing `8/15` {cite:katz-calculus-islam-india-1995 p.168}.

Those numbers are our example, not historical measurements. Suppose the actual volume differed from `8πa²b/15`. Make the enclosing gap smaller than that supposed difference and obtain a contradiction with geometrical containment: this is a modern explanation of the exhaustion/double-reductio argument Katz describes {cite:katz-calculus-islam-india-1995 p.168}. There is no final zero-thickness disk, and convergence is not proved by drawing many layers. For our own lengths `a=2,b=3`, the volume is `32π/5` cubic units; the length units must agree.

Our reconstruction assumes a positive integer number of divisions and positive height/base radius. Zero height leaves no interval to divide; zero radius collapses the solid. These degenerate cases must not be hidden through division by zero. Increasing the number of divisions does not increase the object's height: disk thickness and count change while both lengths remain fixed. The disk models distinguish changing an approximation from changing what is measured {cite:bressoud-calculus-before-newton-i p.3} {cite:katz-calculus-islam-india-1995 p.168}.

Dimensional checking independently helps catch a mistranscribed formula. Volume needs cubed length, consistent with `a²b`, not the area factor `ab`. The ratio to the cylinder is dimensionless because both quantities have the same kind of unit. Doubling all lengths multiplies volume by eight while preserving the ratio. This is a teaching consequence of the displayed formula, not a reported experiment performed by the scholar {cite:katz-calculus-islam-india-1995 p.168}.

## The spread

Katz reports the fourth-power formula in later works of Ibn Haydur, Ibn Ghazi and al-Kashi, but presents transmission toward Europe as a manuscript-research question rather than a complete teacher-to-pupil chain {cite:katz-calculus-islam-india-1995 pp.168,174}. A formula's presence in a later book does not by itself establish the route by which it arrived. Nor does the documented Latin circulation of the *Optics* prove that every separate mathematical result circulated with it {cite:katz-calculus-islam-india-1995 p.166}.

## What it was built on

The calculation uses simpler power sums, circular area and enclosing/inscribed quantities. Dennis and Addington use rectangles and strips to explain rearrangement and the coordination of numerical representation with geometry {cite:dennis-addington-alhazen-summation-2009 pp.1–4}. This does not require assuming that Ibn al-Haytham directly read Archimedes' particular text about the solid. Bressoud distinguishes inherited geometry from proofs developed in Arabic scientific settings {cite:bressoud-calculus-before-newton-i p.2}.

## What was built on it

**Sunni—attribution boundary:** establishing this contribution does not require assigning every later mathematical development to its maker {cite:tdv-ibnul-heysem pp.82–87}. **Academic account:** Katz explains how the arithmetic structure can be generalized while separating what we can extract today from what the scholar stated; European routes remain a research question in his account {cite:katz-calculus-islam-india-1995 pp.166–167,174}. Our generic diagram therefore does not manufacture a direct link to a named design program or historic dome.

## Impact on daily life

The passages read do not document a workshop making tanks by this ratio, or quantify savings of money or materials. The documented achievement is mathematical: finding an exact volume through calculation and containment rather than estimating a curved boundary {cite:katz-calculus-islam-india-1995 pp.167–168}. Visitors may try paper layers, but cutting accuracy and paper thickness belong to a modern experiment, not the historical proof. A model's photograph is not evidence of its age or mathematical correctness.

## How it changed history

This method shows a history of volume and integration spread across problems and periods, not a single invention moment. Bressoud uses the difficulty of moving beyond square/cube geometry to explain knowledge preceding fast school formulas {cite:bressoud-calculus-before-newton-i pp.1–4}. Number and shape constrain each other: a summation formula is insufficient unless the disks enclose the correct solid, and a drawing is insufficient without calculating their sum. That relation makes the method more than a numerical curiosity.

## Who invented it?

The attribution is an extension of volume methods using fourth powers, not the invention of addition, the first dome or the Fundamental Theorem of Calculus {cite:katz-calculus-islam-india-1995 pp.165–168,174}. **Sunni:** the declared frame is not evidence of scientific priority {cite:tdv-ibnul-heysem pp.82–87}. **Academic account:** retain what the read explanations support and distinguish the author's argument from modern reconstruction. Not independently reading the Arabic original is a source limitation, not permission to supply it from memory {cite:katz-calculus-islam-india-1995 pp.166–168}.

## Today

The example teaches the difference between a finite sum and an exact volume, and between numerical verification and proof. Steven Baltakatei Sandoval's modern share-alike diagram shows the ordinary axial bowl with diameter and height: it is a comparison with the earlier problem, not an image of the8/15 dome {cite:commons-paraboloid-dh image and licensing}. Mentally changing the rotation axis changes the object itself, not just the camera angle.

## Surviving examples

Our inspected witnesses are the modern paper, including printed167–168 images, and Bressoud's exposition—not an autograph manuscript {cite:katz-calculus-islam-india-1995 pp.167–168} {cite:bressoud-calculus-before-newton-i pp.2–4}. Katz refers to Rashed's study of the paraboloid; that is a research lead, not permission to cite unread pages {cite:katz-calculus-islam-india-1995 p.174}. The licensed illustration is neither a historical instrument nor a newly discovered medieval sheet.

## In culture

The example helps tell mathematics through named people, questions and mediators, rather than claiming that one civilization made everything. Greek, Indian and Arabic-working mathematicians appear with different problems and periods in these accounts {cite:bressoud-calculus-before-newton-i pp.1–4} {cite:katz-calculus-islam-india-1995 pp.165–168}. Not every visible dome carries Ibn al-Haytham's mathematical signature: resemblance does not specify a curve exactly or prove that its builder used this formula.

## For young readers

Imagine a tower of disks narrowing upward. A narrow tower stays inside a curved shape; a wider one covers it. Thinner layers reduce the difference. This introduces the bounding idea behind the calculation {cite:katz-calculus-islam-india-1995 p.168}. Always ask what region is rotating, and around which line. Then try numbers, remembering that four successful layers cannot by themselves prove what happens for every number of layers.

## References

- Katz1995, selected163–168,174 read;167–168 images checked. Not the full article or original Arabic treatise {cite:katz-calculus-islam-india-1995 selected passages}.
- Bressoud I1–4 and III1–3, actual articles rather than platform AI summaries {cite:bressoud-calculus-before-newton-i pp.1–4} {cite:bressoud-calculus-before-newton-iii pp.1–3}.
- Dennis/Addington notes, existing individualized identity basis and modern image metadata {cite:dennis-addington-alhazen-summation-2009 pp.1–5} {cite:manazir-sabra-1983 scan-p.60} {cite:tdv-ibnul-heysem pp.82–87} {cite:commons-paraboloid-dh licensing}.
