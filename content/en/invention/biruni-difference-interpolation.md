---
id: invention/biruni-difference-interpolation
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b48", source: "English from Arabic; actual selected Qanun text/scans, MeijeringII.B–II.C and Rashed publisher abstract only; modern PD image inspected; own normalized arithmetic not historical notation or measured data" }
---
## Summary

How can a reader obtain a value that a table does not give in its own row? Dividing the increase between rows into equal shares is not always enough: the increases themselves may change. [[person/al-biruni-muhammad-ibn-ahmad|Al-Biruni]] discusses this problem in the [[work/al-qanun-al-masudi|Qanun al-Mas'udi]], then explains a way of adjusting the calculation {cite:qanun-masudi-jundi-v1 scan pp.301–302,321–324}. This entry concerns a specific improvement in table use, not the invention of sine, all interpolation or every later quadratic formula. Earlier Indian methods belong in the account, not outside it {cite:meijering-interpolation-2002 II.B–II.C}. The evidence here is text and approximate calculation, not archaeological machinery or a demonstration that every result is more accurate.

## What it is

Interpolation estimates a value between known entries. The editor uses [[concept/istikmal-interpolation|istikmal]] when discussing al-Biruni; the actual primary passage distinguishes customary and refined procedures for finding a sine or finding an arc {cite:qanun-masudi-jundi-v1 scan pp.40–42,321–324}. Direct lookup seeks a sine from an arc; inverse lookup seeks an arc from a value. The author also warns against calling every tabular operation sine-finding when its object is something else {cite:qanun-masudi-jundi-v1 scan p.321}.

The refinement brings another difference into consideration: not only the change between neighbouring rows, but how that change differs from the preceding one. That procedure is the unit of this entry. Columns, subtraction and each multiplication are not separately counted inventions. Nor does calling an expression nonlinear establish its equality with every other nonlinear expression.

## The world before it

Meijering explains second-order formulas associated with Brahmagupta and subsequent Indian work before al-Biruni, within a much longer history of astronomical tables {cite:meijering-interpolation-2002 II.B–II.C}. Rashed's abstract reports four methods available to al-Biruni, two Indian, through a passage examined in al-Samaw'al {cite:rashed-interpolation-1991 abstract}. Reading that abstract is not reading its underlying manuscript or every mathematical proof in the full article.

The museum's separate [[invention/battani-sine-table-methods|al-Battani table-method entry]] includes direct and inverse linear interpolation {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. This entry is not a relabelling of that work. A precursor's existence does not make every later rule identical to it, but a specific later improvement cannot erase earlier work simply because a modern summary calls its author a pioneer.

## The story

The question begins before the instructions. Discussing the choice of diameter, al-Biruni prefers a greatest sine of one to reduce repeated multiplication and division, then argues geometrically that sine differences do not vary in the same fixed proportion as the arcs {cite:qanun-masudi-jundi-v1 scan pp.301–302}. He also acknowledges the labour of calculation at finer intervals and explains the quarter-degree spacing adopted for his sine table {cite:qanun-masudi-jundi-v1 scan p.302}.

Many numerical places do not replace a suitable procedure for using them. Dating here is the broad eleventh-century documentary context assigned to the Qanun by Meijering, not an exact invention day or the date of the modern edition {cite:meijering-interpolation-2002 II.C}. No calculated Hijri date is inserted as though it were an original historical report.

## The maker(s)

Attribution rests on al-Biruni's written exposition, not his general fame. His role here is improver of a particular tabular procedure, with predecessors retained {cite:qanun-masudi-jundi-v1 scan pp.321–324,339–340} {cite:meijering-interpolation-2002 II.B–II.C}. Textual author, edition editor, Rashed, Meijering and the modern illustrator are distinct contributors. Bringing their work together on a page does not turn them into one historical hand.

**Sunni frame:** Britannica and Tümer supply an individual basis for Muslim identity, while personal denominational classification remains debated. The biography presents Tümer's interpretation within the declared Sunni frame {cite:britannica-al-biruni biography} {cite:tdv-biruni-tumer religious-affiliation}.

**Reported Shia and Zaydi classifications:** The person record preserves both through Tümer, not as a decisive museum verdict {cite:tdv-biruni-tumer religious-affiliation}. A name, patron's affiliation or scan-hosting website cannot replace evidence about the individual.

## How it works

The reader takes the row whose arc is below the required arc, retains its value and the remaining portion of the arc, then distinguishes the customary correction from a refinement using the adjacent difference and its predecessor {cite:qanun-masudi-jundi-v1 scan pp.321–322}. The increase used in the calculation is therefore not held fixed throughout the interval. The text explains its gradual change geometrically {cite:qanun-masudi-jundi-v1 scan p.323}. Calling the result refined does not make it exact or error-free.

For increasing values, a modern unpacking uses starting value `y0`, preceding and following increases `Dprev` and `Dnext`, and fraction of a table interval `t`. The resulting instruction reads `y0+t*((1-t)*Dprev+t*Dnext)` {cite:qanun-masudi-jundi-v1 scan pp.322–323,339–340}. These are our teaching symbols, not the author's notation or the standard Newton rule that necessarily fits all three samples. Multiplication by the residual occurs twice, making the expression nonlinear.

Take an invented teaching table with values1,2,2.5 at positions−1,0,1. The preceding increase is1 and the following increase0.5. At half the next interval this procedure gives2.375, while linear interpolation gives2.25. Nothing in those samples alone tells us the actual intermediate value. This is not numerical data from the Qanun or proof of universally superior accuracy; it shows what changed in the instructions.

Units also matter. The four minutes in the primary instruction are the sexagesimal number1/15, standing for division by the fifteen arcminutes in a quarter-degree interval, not a new angle of four degrees {cite:qanun-masudi-jundi-v1 scan p.323}. Inverse lookup receives its own procedure; the inverse of an approximation is not automatically the true inverse function {cite:qanun-masudi-jundi-v1 scan pp.322,324}.

Returning from sine to arc deserves separate attention: the author starts with the nearest smaller sine, retains its arc and uses the remaining sine and differences to obtain an arc increment {cite:qanun-masudi-jundi-v1 scan p.322}. Simply swapping column headings while preserving every operation is not sufficient, because the known quantity and required residual have changed. Nor is the preceding difference zero merely because a reader's displayed window starts at the current row. A particular neighbour is required. Display limits are not historical table boundaries; no rule for a missing endpoint or silent replacement value is invented. This explains the instructions' requirements, not new software attributed to the author.

## The spread

Rashed's abstract reports that al-Samaw'al quoted al-Biruni, examined linear and nonlinear procedures, compared their results and tried to improve them {cite:rashed-interpolation-1991 abstract}. This is a particular witness to subsequent reading and discussion, not a complete map of migration between countries. We have not read the full article or manuscript for this entry and do not invent copyists or school dates from behind its abstract.

Meijering describes interpolation in Arabic and Persian sources and possible Indian influences, without establishing automatic identity between all formulas {cite:meijering-interpolation-2002 II.C}. The spread list contains no unsupported stations. Possible influence is not a documented dependency edge; recording that distinction is more useful than filling a map with attractive but unverified arrows.

## What it was built on

The procedure uses knowledge of arcs and sines, circular division, tables, sexagesimal arithmetic and differences between rows. The author explains choosing one and compares this with a radius of sixty {cite:qanun-masudi-jundi-v1 scan pp.301,323–324}. This choice does not make him inventor of fractions or every use of ratios.

Earlier Indian work is a substantial part of the history, not decorative background. However, the modern sources do not license a certain named teacher-to-pupil route for each particular instruction {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. An earlier technical tradition and a known copy reaching a known reader are different kinds of evidence. The first alone does not establish the second, and neither excuses ignoring the actual algorithm being exhibited.

## What was built on it

After discussing sines and shadows, the author explicitly generalizes refined work to all tables: retain a value, obtain neighbours, adjust the preceding difference according to changing differences, then calculate the fractional contribution {cite:qanun-masudi-jundi-v1 scan pp.339–340}. This moves from a trigonometric example to a broader procedure within the book itself, not proof of success for every imaginable dataset.

Al-Samaw'al's subsequent comparison is reported by Rashed's abstract and remains attributed to it {cite:rashed-interpolation-1991 abstract}. No line is drawn directly to every computer program or modern satellite. Similar modern symbols cannot prove a historical path to Newton. Mathematical resemblance and evidence that a text passed between its authors are separate questions; a teaching chain should not pretend otherwise.

## Impact on daily life

The directly supported benefit concerns table users seeking an unlisted angle's value or returning from a value to an angle, with an explanation of why a single proportion may not suffice {cite:qanun-masudi-jundi-v1 scan pp.321–324,328–329}. The inspected passages do not count households, mosques or journeys using this particular refinement. No numbers for money saved, calculation time or universal replacement of older tables are invented.

The comparison exposes an important distinction: a table may have been carefully calculated, while approximation enters when someone works between its rows. Describing a book as accurate cannot exempt every subsequent operation from examination of its units and assumptions. Practical usefulness here is a documented computational purpose, not a modern survey of adoption.

## How it changed history

The witness matters because an arithmetic assumption becomes an object of criticism and explanation. Al-Biruni does not simply issue instructions; he explains unequal differences {cite:qanun-masudi-jundi-v1 scan pp.301–302,323}. It is not necessary to replace mathematical history with a solitary-hero story to recognize that achievement.

Meijering's account places Indian and Chinese contributions alongside Arabic and Persian sources before later European developments {cite:meijering-interpolation-2002 II.B–II.C}. Chronological succession alone does not prove contact between every author and successor. Rereading operational wording also prevents a familiar modern formula being projected onto a different procedure merely because both use differences. That is a historical and educational value, without an invented numerical measure of its consequences.

## Who invented it?

**Text within the declared Sunni frame:** This entry attributes the specific inspected exposition to al-Biruni, retaining his biography's debated individual affiliation rather than making arithmetic into denominational evidence {cite:qanun-masudi-jundi-v1 scan pp.321–324} {cite:tdv-biruni-tumer religious-affiliation}. It does not award him the world's first second-order interpolation.

**Academic reading:** Meijering documents earlier Indian methods; Rashed's abstract describes four methods available to al-Biruni, Indian contributions and al-Samaw'al's comparisons {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. The edition introduction's comparison with Newton and Gregory remains an attributed interpretation, not a finding of identical formulas or direct transmission to them {cite:qanun-masudi-jundi-v1 scan pp.40–42}. Priority, plurality of methods and the details of this particular procedure must remain distinguishable.

## Today

Visitors can compare approximations on paper without telescopes or software. At `t=0` the unpacked procedure keeps the initial value; at `t=1` it reaches the next one. Equal increases reduce it to linear calculation. These are algebraic consequences of the teaching expression, not an experiment witnessed in al-Biruni's workshop {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

Agreement at the endpoints does not guarantee knowledge between them or superiority for every function. Understanding instructions and supplying a numerical guarantee not established by the research are different accomplishments. A reader can ask about error, interval limits and assumptions before admiring many digits. The historical account is not a recommendation for navigation or timing tasks requiring independent verification.

## Surviving examples

We read selected Arabic passages and inspected scans301,322,323,340, corresponding to printed300,321,322,339. New citations explicitly use scan pages; the printed number is one lower {cite:qanun-masudi-jundi-v1 scan pp.301,322–323,340}. This is not manuscript collation or reading every table, many of which are garbled in extracted text.

The displayed picture is DaBler's modern7 March2010 illustration, explicitly released into the public domain; its960×720 rendering was inspected {cite:commons-quadratic-interpolation description,rights,image}. It shows a parabola through three samples, a marked maximum and a lower difference/slope panel. It is a conceptual comparison, not this rule's exact weights or evidence that al-Biruni drew a modern derivative {cite:commons-quadratic-interpolation code}. Scans, extracted text and original binaries stay outside the repository.

## In culture

The passage combines geometrical language and instructions for calculators. The author chooses concise names for arcs and their complements to prevent confusion and discusses the labour of finer tabulation {cite:qanun-masudi-jundi-v1 scan pp.302,321}. This shows how practical knowledge is presented in a book, not that every historical reader understood or used it identically.

The modern illustration employs blue, red and plotted axes, a much later instructional language that is not attributed to the manuscript {cite:commons-quadratic-interpolation image,code}. Placing the two approaches together is useful only when their distance is explained. Elegance in today's drawing must not become evidence of an unexamined historical original or of notation the author never used in the passage read.

## For young readers

Write positions−1,0,1 on paper, with values1,2,2.5 below. The first increase is1, the next0.5. Halfway between the middle and last positions, the linear estimate is2.25. Blend the two increases equally to get0.75, take half and add it to2: the result is2.375. These invented game numbers illustrate the instruction sequence, not historical measurements {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

Keep the unknown intermediate value hidden and do not choose a winner: the cards alone do not give it. Try equal increases and notice agreement. Pen and paper suffice; do not observe the Sun or point a telescope at it. Ask not which number looks nicer, but what assumption led to it.

## References

- [[source/qanun-masudi-jundi-v1|Qanun al-Mas'udi, vol.1]], selected scan-page reading and specified image inspections; printed numbering is one lower.
- [[source/meijering-interpolation-2002|Meijering, A Chronology of Interpolation]],II.B–II.C, actual author-hosted article.
- [[source/rashed-interpolation-1991|Rashed, al-Samaw'al, al-Biruni and Brahmagupta]], publisher abstract only, not the full article.
- [[source/britannica-al-biruni|Britannica]] and [[source/tdv-biruni-tumer|Tümer]], individual identity and reported denominational classifications.
- [[source/commons-quadratic-interpolation|DaBler's illustration and rights]], modern public-domain comparison.
- [[source/nallino-albatenii-opus-astronomicum|Nallino's al-Battani edition]], boundary with the earlier linear-method entry.
