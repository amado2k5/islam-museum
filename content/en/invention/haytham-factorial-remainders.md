---
id: invention/haytham-factorial-remainders
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b82", source: "Arabic-first prose from actual selected MacTutor/MathWorld passages and inspected Commons current image/rights. Modern least-positive/family derivation, not original Opuscula or recovered historical method2." }
---
## Summary

MacTutor presents [[person/ibn-al-haytham|Ibn al-Haytham]] considering a number that leaves remainder1 on division by2,3,4,5 and6, but is divisible by7. It explains a construction multiplying the consecutive integers and adding one:6!+1=721. This is a particular number-theoretic contribution, not the invention of every remainder problem or every set of simultaneous conditions {cite:haytham-mactutor number-theory}.

The account invokes what is now called Wilson's theorem and reports a second method giving all solutions, without reproducing its details. We distinguish that report from the museum's independent modern family301+420j. Nor is721 the least positive answer:301 is smaller and meets exactly the same conditions {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem eq1}.

## What it is

A remainder is what remains after removing a whole number of multiples of the divisor. Saying that721 leaves1 on division by6 means721=6×120+1, not that its quotient is1. The problem requires several conditions at once. Meeting one condition alone is not a fully checked solution {cite:haytham-mactutor number-theory}.

Factorial is our modern shorthand for multiplying successive positive integers:6!=1×2×3×4×5×6=720. The exclamation mark is mathematical notation, not punctuation copied from Ibn al-Haytham's original. We explain the relationship in language accessible today while keeping the reported historical construction separate from our way of checking it {cite:weisstein-wilson-theorem definition}.

## The world before it

MacTutor calls the problem a special case of the Chinese remainder theorem. It would therefore be wrong to credit Ibn al-Haytham with every idea of combining division conditions. This record identifies a specific factorial construction within a wider problem tradition. Earlier foundations do not erase a later contribution, but they prevent a story of one person starting from nothing {cite:haytham-mactutor number-theory}.

This question also differs from his [[invention/ibn-al-haytham-fourth-power-volumes|fourth-power volume method]] and [[invention/ibn-al-haytham-circular-reflection|circular reflection-point problem]]. We do not count one contribution repeatedly under different names. Here the constraints concern integers, not an optical surface or a volume. Working across subjects does not itself establish a direct transfer of a particular method between them {cite:haytham-mactutor number-theory}.

## The story

MacTutor refers to Opuscula and uses a translation in Rashed's study before describing two methods. It explains the first construction and says the second supplies all solutions of this type. We read that account, not the Arabic original or Rashed's full edition. We invent neither an Arabic treatise title nor an ancient book identity from a modern collection label {cite:haytham-mactutor Opuscula}.

The passage gives no securely dated teaching session or writing room. The author's late tenth- and early eleventh-century lifetime remains a broad horizon; Cairo is biographical context, not a confirmed composition site for this question. A date associated with the Book of Optics is not automatically a date for every other numerical idea {cite:haytham-mactutor biography-and-number-theory} {cite:tdv-ibnul-heysem biography}.

## The maker(s)

The author's existing individual identity basis, drawn from the Optics opening and TDV, is retained alongside the separately declared Sunni frame. We infer no new denomination from his Egyptian employment or a successful calculation. This session is not a fresh critical investigation of every biographical text {cite:manazir-sabra-1983 p.60} {cite:tdv-ibnul-heysem biography}.

Wilson is the modern name attached to the arithmetic result. MathWorld discusses Wilson, Waring, Leibniz's earlier knowledge and Lagrange's proof; MacTutor describes an earlier use by Ibn al-Haytham. Both historical accounts remain visible without inventing a direct manuscript-to-manuscript route or assigning the whole history to one person {cite:weisstein-wilson-theorem history} {cite:haytham-mactutor number-theory}.

## How it works

Every integer from2 through6 is a factor of720. Division of720 by any of them leaves0, so division of721 leaves1. That alone does not establish divisibility by7. The result now called Wilson's theorem supplies the prime condition: for primep, the number(p−1)!+1 is divisible byp. Here721=7×103 {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

This does not make721 prime: its factors7 and103 show the opposite. The prime condition concernsp, not the constructed answer. Nor can7 be replaced silently by an arbitrary composite: for4, the construction3!+1 gives7, which is not divisible by4. A formula valid under a hypothesis cannot be used after that hypothesis is discarded {cite:weisstein-wilson-theorem definition-and-composite-exception}.

Here is an independent modern derivation of all positive answers, not a recovery of the historical second method. The least common multiple of2 through6 is60, soN=60k+1. Since60 leaves remainder4 on division by7, we need4k+1 divisible by7. This requiresk=5+7j, givingN=301+420j.

Takej as a nonnegative integer for positive answers. The first are301,721 and1141. For example,301=5×60+1=7×43, while721=12×60+1=7×103. Listing a few answers does not alone prove completeness. Here completeness comes from reducing the conditions toN=60k+1 and solving the remaining condition modulo7, rather than stopping a search at an attractive number.

The increment420 explains repetition: it is divisible by60 and7, preserving every required remainder. Adding only7 to721 gives728, still divisible by7 but leaving2 rather than1 on division by6. Adding60 preserves the earlier conditions, not automatically the condition for7. An arbitrary increment therefore does not produce another answer. This checks the common period in our modern solution, not a list found in a manuscript or proof that our formulation reproduces the historical second method. Preserving one constraint differs from preserving the whole system.

## The spread

The sources read here provide no manuscript route directly connecting the author with Wilson. A modern name and an older result do not establish copying, translation or citation. Reports remain attributed to their sources, and an undocumented transmission link does not become a confident arrow in a diagram {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

Reporting a second method also does not establish its adoption in every school or market. A possible application is not a historical circulation statistic. Modern explanations are evidence of present-day teaching; connecting them to a particular old curriculum would require evidence absent from the passages consulted here.

## What it was built on

The immediate ingredients are multiplying the integers and adding one, together with a particular condition for the final divisor. Without that final condition, answers of the form60k+1 remain, rather than a unique number. Repeated factors make720 a suitable common multiple, but not the least common multiple. Multiplying everything is not always the shortest construction {cite:haytham-mactutor number-theory}.

We use60 in the modern explanation because it combines the conditions for divisors2 through6. Those divisors are not pairwise coprime:2,4 and6 have common factors. We must not silently apply a formula restricted to pairwise-coprime moduli. Identifying the actual structure matters more than invoking the broad theorem's name.

## What was built on it

MathWorld states the modern theorem as a necessary and sufficient primality condition forp>1. That modern explanation is not an announcement that we found both directions fully proved in Ibn al-Haytham's original. Using a result, proving it and designing a fast practical test from it are separate claims {cite:weisstein-wilson-theorem definition} {cite:haytham-mactutor number-theory}.

For teaching, one can multiply step by step while retaining only the current remainder, avoiding enormous written integers. This is a modern way to check examples, not a computer algorithm assigned to the medieval author. Similar arithmetic does not establish a direct lineage to every present software or cryptographic application.

## Impact on daily life

The consulted passages record no merchants' time savings or contracts applying this example. The supported contribution belongs to research on simultaneous numerical conditions and multiple solutions. We invent no commercial anecdote to make the arithmetic an ancient everyday device; a question does not need a measured financial return to deserve explanation {cite:haytham-mactutor number-theory}.

Today's reader gains a clear lesson: a correct answer need not be the smallest, and one answer is not every answer. A constructive method can produce a large, easily checked number while reformulating the conditions gives a shorter description of the entire family. That is a lesson from301 and721, not evidence of the author's personal economic motive.

## How it changed history

The problem makes the author's non-optical mathematics visible: integers under simultaneous constraints, not only mirrors and eyes. Yet the fame of the Optics does not prove priority in every other subject. Attribution here remains bounded to a particular construction described in the historical account {cite:haytham-mactutor number-theory}.

It also separates construction, verification and completeness. One can construct721, check each condition, then ask for smaller answers and the whole family. Those are different tasks. Reporting a second method shows that the historical account does not stop with producing the first number. We do not fill its missing details with a modern proof and conceal the substitution {cite:haytham-mactutor Opuscula}.

## Who invented it?

**Declared Sunni frame:** Ibn al-Haytham's existing individual identity basis is retained, not deduced from arithmetic. **Academic account:** MacTutor describes the earlier construction and use; MathWorld describes the theorem's name and later European history. Neither establishes our own direct transmission route or makes a modern name the limit of the idea's history {cite:tdv-ibnul-heysem biography} {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

“Improvement” protects the attribution's boundary: not the first Chinese remainder theorem, first factorial or every congruence calculation. We claim neither original-text reading nor a final ruling on every priority question. What we can show is a particular construction, its limits and a modern statement that helps readers check it.

## Today

The image has two grey clocks labelled0,3,6,9, with+4h between them. The hand moves from9 to1:9+4=13, which leaves1 modulo12. This is a modern analogy for cyclic arithmetic, not Ibn al-Haytham's clock or a manuscript illustration. Nor is it the prime7 problem itself:12 is composite {cite:commons-clock-group-spindled current-image}.

Congruence does not mean13=1 as ordinary integers. It means that they leave the same remainder on division by12. Remainder arithmetic is not erasing the difference between numbers. The picture helps explain the vocabulary, not prove every prime-number property needed by the factorial construction {cite:commons-clock-group-spindled description}.

## Surviving examples

We read the specified MacTutor passages and MathWorld's definition, first formula and historical paragraph. We did not read the original Opuscula or Rashed's full edition, and do not infer an Arabic manuscript ID from that label. Not creating a new work record here preserves that boundary; it does not assert that the author wrote nothing about the problem {cite:haytham-mactutor Opuscula}.

The actual Commons image and rights were inspected. Spindled made the original upload on19October2006; the current version includes a2008 text-alignment correction and carries CC BY-SA3.0. The current original SVG is published unmodified. Upload dates do not date the ancient mathematics or prove a surviving historical clock of this appearance {cite:commons-clock-group-spindled description-rights}.

## In culture

An invention story may favour a single name, triumphant scene and final number. This question becomes richer when a particular answer remains distinct from a general description, and a theorem's name from its earlier uses. That is not a judgement against named mathematicians; it is how the museum displays what the evidence does and does not establish {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

The explanation needs neither an imaginary portrait nor a fictional teaching gathering. Read the conditions, check them again, and recognize that the two-clock image belongs to another period. An explicitly declared comparison teaches without making a modern educational asset pretend to document an ancient scene.

## For young readers

Write721 and divide by2,3,4,5,6, then7. Record remainders, not only quotients. Repeat with301. The smaller number also meets the conditions. Do not stop at the first correct answer or call it smallest without a search or proof.

Now try7, obtained from3!+1: is it divisible by4? No. Ask which hypothesis differs from the original prime7 example. The modern clock was not necessarily in the author's hands; it is only a remainder analogy. Historical evidence and today's arithmetic meet without becoming the same thing {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

## References

- MacTutor: reported remainder problem and construction {cite:haytham-mactutor number-theory}.
- MathWorld: formula, history and primality condition {cite:weisstein-wilson-theorem eq1-and-history}.
- TDV: author's setting, not a verified composition site {cite:tdv-ibnul-heysem biography}.
- Commons: modern image and rights {cite:commons-clock-group-spindled description-rights}.
