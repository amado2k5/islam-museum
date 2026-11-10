---
id: invention/farisi-amicable-factorization
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b84", source: "Arabic museum article translated; actual MacTutor/TDV/selected MathWorld/image rights. Modern arithmetic not original proof; no Rashed1982/full Hogendijk reading." }
---
## Summary

A number can yield another when its proper divisors are added, and the other's divisors can lead back to the first. Two different numbers with this property are amicable, like220 and284. [[person/kamal-al-din-al-farisi|Kamal al-Din al-Farisi]] did not invent this example or Thabit ibn Qurra's older rule. His contribution here is a new factorization/combinatorial approach to proving the rule, as MacTutor describes it {cite:weisstein-amicable-pair definition} {cite:farisi-mactutor number-theory}.

His [[work/farisi-tadhkirat-al-ahbab|Memorandum for friends on amicability]] is distinct from his [[invention/farisi-water-sphere-rainbow|rainbow model]]. This record awards neither absolute priority for factorization nor the first complete proof of its uniqueness. MacTutor attributes that interpretation to Rashed and notes scholarly disagreement over the proof's status {cite:farisi-mactutor factorization} {cite:tdv-farisi-bozhuyuk work5}.

## What it is

The divisors concerned are positive integers dividing without remainder. For amicability we exclude the number itself. Write sigma for the sum including self, and s for the sum excluding self: s(N)=sigma(N)−N. Confusing the two sums changes the question. These are modern explanatory symbols, not notation attributed to an inspected manuscript {cite:weisstein-amicable-pair definition-and-equations}.

The numbers must be positive, distinct, and satisfy both directions. For example,6 has proper divisors1,2,3 summing to6. It is perfect, not an amicable pair with itself under our definition. Nor is a one-way journey sufficient: the second number must lead back to the first.

## The world before it

MacTutor credits the construction to Thabit ibn Qurra before discussing al-Farisi's new proof. The predecessor keeps his name; not everything in the later treatise becomes a separate invention of its author. Mentioning that predecessor does not count him as a new Muslim maker through an inference from his environment {cite:farisi-mactutor inherited-rule}.

MacTutor also reports Hogendijk's argument that Thabit may already have known17296 and18416. We do not convert this into a new priority verdict or credit a later European merely because a familiar name accompanies the pair. Conventional naming, a surviving proof, and first discovery are different historical questions {cite:farisi-mactutor large-pair-history}.

## The story

The university biography notes that number-theoretical work became prominent in studies later than Rashed's older Dictionary of Scientific Biography article, which focused on optics. Omission from an earlier account does not demonstrate absence from the author's work. TDV separately lists the amicability treatise by title {cite:farisi-mactutor introduction} {cite:tdv-farisi-bozhuyuk work5}.

No exact composition date or conversational scene is established here. A late thirteenth-/early fourteenth-century horizon relates the work to its author, not an invention day or manufactured Hijri conversion. Tabriz belongs to his biographical setting; it is not a particular writing room verified from the original {cite:farisi-mactutor biography} {cite:tdv-farisi-bozhuyuk biography}.

## The maker(s)

Al-Farisi's documented individual Muslim basis is retained from MacTutor's explicit description, with the Sunni frame separately declared. A Persian name or teacher does not establish a personal sect. His earlier optical contribution remains intact: one scholar can work on light and numbers without making the two questions identical {cite:farisi-mactutor summary-and-biography}.

TDV differs from MacTutor on name and dates: Hasan ibn Ali ibn Hasan, birth1267 and death1319 from a student's reported colophon, rather than Muhammad and approximate1260/1320. We attribute the discrepancy, not invent another person or claim original collation. The inherited fields remain attributable to their earlier sources while readers can see the alternative {cite:tdv-farisi-bozhuyuk opening} {cite:farisi-mactutor quick-info}.

## How it works

For a modern illustration take220=2²×5×11. Each divisor chooses an exponent of2 from0 to2, and an exponent of5 and11 from0 to1. There are3×2×2=12 distinct choices including220 itself. Organizing these choices helps avoid missing or duplicate divisors; this illustrates the factorization structure in modern form {cite:farisi-mactutor factorization}.

The full divisor sum is(1+2+4)(1+5)(1+11)=7×6×12=504. Subtract220 to obtain284. Similarly284=2²×71, with full sum7×72=504;504−284=220. Direct listing checks both calculations independently. This is a modern explanatory verification, not a quotation of the old proof {cite:weisstein-amicable-pair divisors220284}.

Thabit's rule in modern notation takes n≥2 and forms p=3×2^(n−1)−1, q=3×2^n−1, r=9×2^(2n−1)−1. **If all three are prime**, A=2^n×p×q and B=2^n×r are amicable. Primality is part of the rule, not optional decoration. This sufficient construction supplies a family, not every possible amicable pair {cite:farisi-mactutor inherited-rule}.

For n=4 the primes are23,47,1151, yielding A=17296 and B=18416. Both full sums equal35712:31×24×48 for A and31×1152 for B. Subtracting either number returns the other. MacTutor describes al-Farisi using lemmas, including a sieve application, to establish1151's primality; our arithmetic does not reproduce the original sequence of lemmas {cite:farisi-mactutor example-n4}.

A counterexample clarifies the conditions. For n=3, r=287=7×41 is composite. The formulas give2024 and2296, and s(2024)=2296, but s(2296)=2744, not2024. Treating287 as prime and inserting1+287 into the divisor-product formula is wrong: the correct contribution is(1+7)(1+41). This independent modern calculation explains why both the premises and the return direction matter.

For the general structure put t=2^n. Under the prime conditions sigma(A)=sigma(B)=(2t−1)×9t²/2; algebraic expansion also gives A+B equal to that expression. Subtracting A therefore yields B, and conversely. Equal inclusive sums alone would be insufficient without their equality to A+B. This conditional explanation is modern museum algebra, not a transcription.

The restriction n≥2 keeps the assumed prime factors odd and different from2, allowing independent factor choices. Taking n=1 instead gives20 and34, which are not amicable. Dropping the lower bound and blaming that failure on the rule would test a formula outside its stated domain.

## The spread

MacTutor identifies knowledge of the larger pair before later European names, while leaving its earliest discovery open to investigation. MathWorld discusses rediscoveries and subsequent rules, not a manuscript chain we have established from al-Farisi to every later author. Identical numbers alone do not prove a direct textual route {cite:farisi-mactutor large-pair-history} {cite:weisstein-amicable-pair history}.

A modern edition is not itself evidence of historical school circulation. TDV lists Rashed's1982 edition and study; we did not read the full edition here. The work and its scholarly discussion are reported through the source actually read, without an invented manuscript journey or teaching encounter {cite:tdv-farisi-bozhuyuk work5}.

## What it was built on

The explanatory ingredients are prime powers, divisors, and exponent choices. The same product formula cannot simply be applied to overlapping factors:24=4×6 does not license multiplying the divisor sums of4 and6, since they share2. In our modern explanation we first separate distinct prime powers before organizing independent choices.

MacTutor attributes to Rashed an interpretation based on unique prime-power factorization and an attempted proof, then notes discussion over whether it was proved or only attempted. This limit matters. Two successful examples do not prove the general theorem, and listing the factors of one small integer is not a uniqueness proof for every integer {cite:farisi-mactutor factorization-debate}.

## What was built on it

A student can compare an actual divisor list with a product of prime-power sums, checking completeness and nonduplication. Our museum check compares these independently for many integers, not merely one successful result. That validates our present explanation; it does not recover a lost page of the treatise.

Even a correct rule need not produce every pair.1184 and1210 are amicable, but1210 is not divisible by4, whereas both members of this Thabit family are divisible by4 because n≥2. The pair therefore cannot arise from this formula. A sufficient condition generates examples without becoming a necessary condition for all amicability {cite:weisstein-amicable-pair pair-list} {cite:farisi-mactutor inherited-rule}.

## Impact on daily life

The sources read describe arithmetic and number theory, not a measured market benefit. The name amicability does not make the numbers a charm, treatment, or promise about human relationships. Our subject is a specified divisor relation, not evidence for supernatural effects or endorsement of an unexamined belief {cite:weisstein-amicable-pair definition}.

Its educational value is that separate conditions become visible: one direction is insufficient, an inclusive sum differs from a proper-divisor sum, and a composite factor is not prime. Readers can test these distinctions on the smaller pair before larger numbers, without claiming that our exercise reconstructs a documented historical lesson.

## How it changed history

MacTutor treats al-Farisi's work as more than a minor modification of Thabit's proof: a new approach employing factorization and combinatorial ideas. Appreciating that step requires neither erasing the rule's author nor assigning all modern number-theoretical language to al-Farisi. The contribution is a specified approach in a specified treatise {cite:farisi-mactutor new-approach}.

It is independent of the water-sphere experiment: one concerns divisors, primality, and numerical proof; the other concerns light paths. It is not another example of the same optical theory renamed to increase a record count. The biography itself distinguishes these two major contributions {cite:farisi-mactutor introduction-and-number-theory}.

## Who invented it?

**Declared Sunni frame:** the inherited individual Muslim basis remains, not a personal sectarian certificate extracted from a name. **Academic account:** Thabit's rule precedes al-Farisi's new approach; Rashed's interpretation of the factorization proof remains disputed. The museum awards neither a final first-complete-proof verdict nor first discovery of the larger pair {cite:farisi-mactutor summary-and-factorization}.

The source reports Hogendijk's argument for earlier knowledge by Thabit. His full article was not read here: the author index identifies it, while normal publisher browsing stopped at human verification. The argument remains attributed through MacTutor, not disguised as a full-paper reading completed despite the access barrier {cite:farisi-mactutor large-pair-history}.

## Today

We distinguish two different A,B from a perfect number returning to itself. We also distinguish other modern uses of “friendly” with a different definition: here the test is the sum of positive divisors excluding self. An appealing name does not replace writing the definition before comparing tables {cite:weisstein-amicable-pair definition-and-terminology}.

The contextual coloured-rod illustration places284 above220, with factor rows and proper-divisor sums. It is Hyacinth's modern picture, not rods used by al-Farisi or a page of the Memorandum. It illustrates the smaller example, not every step of the general proof or the pair17296/18416 {cite:commons-amicable-rods-hyacinth current-image}.

## Surviving examples

We read MacTutor, TDV, and selected modern definitions/examples, not the Arabic original, Rashed's1982 edition, or every bibliography item. TDV identifies the treatise by title, but its manuscript was not inspected here. The arithmetic account depends on the scholarly description actually read, not a new critical edition {cite:tdv-farisi-bozhuyuk work5} {cite:farisi-mactutor number-theory}.

The image was created28April2016; the29April history includes the current bold-number revision. It is CC BY-SA4.0, used as an unchanged original PNG. Both image and actual rights were inspected. We neither transfer another image's licence to it nor rename it an artifact from the author's lifetime {cite:commons-amicable-rods-hyacinth description-rights}.

## In culture

The title's “friends” invites attention to a relationship that can be checked numerically. Calling the numbers friends is a verbal analogy, not a mechanism governing their behavior or a mystical explanation. The proper-divisor sums must simply return the partner in both directions under the declared definition {cite:weisstein-amicable-pair definition}.

Limits remain part of the museum story: an earlier predecessor, an author developing a proof, and scholars disagreeing over strength and priority. No invented discovery scene is needed, nor a title making every modern factorization method one person's possession {cite:farisi-mactutor factorization-and-priority}.

## For young readers

Write220's proper divisors:1,2,4,5,10,11,20,22,44,55,110. Their sum is284. Reverse the exercise with1,2,4,71,142 to obtain220. Do not forget1 or include the number itself: changing either condition changes what you are calculating {cite:weisstein-amicable-pair divisors220284}.

Next try6 and ask why it is not a pair with itself. For a larger challenge, check the failed2024/2296 example in both directions rather than stopping at the first success. These are modern arithmetic explorations, not verbatim manuscript instructions or a final historical priority judgment.

## References

- MacTutor:approach, rule, disagreements {cite:farisi-mactutor number-theory}.
- Bozhuyuk:works and alternative biography {cite:tdv-farisi-bozhuyuk biography-and-work5}.
- MathWorld:definition/divisors {cite:weisstein-amicable-pair definition}.
- Commons:illustration/rights {cite:commons-amicable-rods-hyacinth description-rights}.
