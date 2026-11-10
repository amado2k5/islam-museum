---
id: invention/abu-kamil-integer-enumeration
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b83", source: "Translation of Arabic museum article; actual historical/modern sources and image rights inspected. Modern counts not recovered original tables; no original/Saidan1986/full Sesiano reading." }
---
## Summary

Cengiz Aydin describes [[person/abu-kamil-shuja-ibn-aslam|Abu Kamil]] investigating multiple integer answers in his [[work/abu-kamil-taraif|Rare Things in Calculation]], rather than stopping at one solution. The problems reduce to two linear equations with three to five unknowns. This is a contribution to organizing and enumerating solutions, not the invention of every bird puzzle or numerical equation {cite:tdv-abu-kamil work2}.

It differs from his [[invention/abu-kamil-irrational-coefficients|irrational-coefficient algebra]]. Here quantities may have to be whole numbers because they count complete birds, even when prices are fractions. We examine an explicitly modern model and distinguish its checked count from differing reported historical totals. Correct museum arithmetic cannot by itself authenticate a manuscript reading {cite:tdv-abu-kamil work2} {cite:proofwiki-abu-kamil-birds historical-note}.

## What it is

Underdetermined does not mean unconstrained. More unknowns than equations can still leave a finite collection of answers when quantities must be positive integers within a fixed total. Aydin distinguishes seeking integer answers from accepting fractions that satisfy the equations, and describes Abu Kamil's algebraic treatment as systematic {cite:tdv-abu-kamil work2}.

Our bird model requires both a total number and a total cost. Buying100 birds is insufficient if their price is wrong; spending the whole budget is insufficient if too few birds are bought. We must also state whether a kind can be absent. Allowing zero changes the question, not simply the typography of the answer.

## The world before it

Aydin discusses Diophantus and Indian problems associated with Aryabhata, distinguishing attention to rational solutions from a search for all integer answers. These precedents rule out a story in which one person invented every indeterminate problem. Calling problems Diophantine does not prove that a particular procedure came directly from one particular book {cite:tdv-abu-kamil work2}.

MacTutor reports Sesiano's arguments about Abu Kamil's place among Arabic mathematicians, including procedures absent from the known books of the Arithmetica. This is a historian's argument reported through a biography we read, not our own comparison of every witness. Qualifications about what survives and what is known remain part of the priority claim {cite:abu-kamil-mactutor rare-things}.

## The story

Aydin separates the Taraif from a listed Book of Birds whose contents he calls unknown. We do not merge them because a problem happens to contain birds, or because a modern abstract uses that title. Nor do we make the arithmetic problems identical with the algebra or measurement book; each work needs its own evidence {cite:tdv-abu-kamil work2-and-conclusion}.

MacTutor emphasizes the scarcity of biographical information and gives approximate dates around850 and930. A late ninth-/early tenth-century horizon is therefore context, not a dated invention ceremony. An Egyptian author's identity does not establish a particular Cairo market, workshop, or place of composition for every problem {cite:abu-kamil-mactutor biography}.

## The maker(s)

Abu Kamil's individual Muslim basis is recorded from MacTutor's explicit description; the museum's Sunni frame is separately declared. Neither a similar Indian problem nor the title of a book supplies a new personal sectarian identification. This record preserves the existing biography and earlier contribution rather than replacing them to fit this topic {cite:abu-kamil-mactutor summary} {cite:tdv-abu-kamil biography}.

Aydin discusses knowledge of Indian problems while retaining disagreement over knowledge of the methods, and mentions parallels and an anonymous commentator. A resemblance or commentary report is not an author's signed admission of a precise transmission route. We attribute the argument without deciding independence or dependence merely from a shared bird setting {cite:tdv-abu-kamil work2}.

## How it works

This is the modern illustration presented in ProofWiki, not an original table we inspected:100 birds for100 coins, with five unit prices2,1,1/2,1/3,1/4. Write their quantities as x,y,z,w,v. Then x+y+z+w+v=100 and2x+y+z/2+w/3+v/4=100. These symbols and this presentation are modern teaching devices {cite:proofwiki-abu-kamil-birds prices}.

Multiply the cost equation by12:24x+12y+6z+4w+3v=1200. Subtract twelve times the count equation to obtain12x=6z+8w+9v; then y=100−x−z−w−v. Enumerate z,w,v within the total, accepting an integral x and a positive y. This is the museum's independent way to check the model, not recovered lines of the historical algorithm.

The tuple(4,90,1,3,2) works: its count is100 and its cost8+90+1/2+1+1/2=100. Another is(7,83,1,3,6). Their average(5.5,86.5,1,3,4) satisfies both equations but is not a purchase of whole birds. Satisfying equations alone does not remove the integer requirement.

Requiring every kind gives2678 positive solutions in our enumeration; permitting zero gives3727 nonnegative solutions. The latter includes(0,100,0,0,0): only the kind priced at1. These are answers to differently constrained questions, not rival answers to one question. Agreement with a reported historical total does not independently certify its manuscript origin.

The reduced equation supplies two preliminary restrictions: v must be even, because the other terms are even; w must be divisible by3, by considering remainders modulo3. Write w=3b and v=2c to get2x=z+4b+3c, so z+c must also be even. These are deductions within our model, not rules attributed to an unread manuscript. Divisibility is still insufficient: the total bound and a positive y must also be checked.

## The spread

Aydin reports a Hebrew translation associated with Mordecai Finzi, including an argument for a possible Spanish intermediary rather than direct translation from Arabic. He also reports a Latin witness through Suter. These are attributed scholarly reports, not a transmission chain newly established by our collating manuscripts {cite:tdv-abu-kamil work2-translations}.

MacTutor discusses the broader reception of Abu Kamil's work by al-Karaji and Fibonacci. That general reception is not automatic proof that this exact five-price table traveled by a particular route. Similar problems or totals do not alone identify which witness a reader used; a narrower claim needs narrower evidence {cite:abu-kamil-mactutor reception}.

## What it was built on

The ingredients are linear equations, integer quantities, and prices that may be fractional. A half coin does not require half a bird: the quantities being counted must be integers, not every coefficient in the cost equation. Aydin notes substitutable objects and people as well as birds, and a circulating problem tradition {cite:tdv-abu-kamil work2}.

He describes verbal unknown names such as thing, dinar, fals, and ring, with numbers mainly written in words except tables and some figures. We do not turn that account into a claim that Abu Kamil used modern x,y notation, or that each occurrence of a monetary word necessarily denotes a literal coin rather than an unknown {cite:tdv-abu-kamil work2-notation}.

## What was built on it

A modern reader can explore how two equations with several unknowns interact with bounds, integrality, and positivity. This comparison does not make all modern linear programming an invention of Abu Kamil. A present-day tool can check a problem without proving direct historical descent for every optimization application.

Our check uses two independent enumeration procedures, scaling cost by12 to avoid decimal rounding. Printing2678 is not enough: every tuple must satisfy both constraints, appear once, and agree with the complete independently generated set. These are modern checking standards, not a claim that the historical author used a computer or our notation.

## Impact on daily life

A purchase setting makes the constraints accessible, but the sources read do not document a market that actually used these five prices or a measured commercial benefit of the method. The photograph is not a trading record. Aydin's interchangeable objects help distinguish mathematical structure from the commodity in the story {cite:tdv-abu-kamil work2}.

The educational distinction is simple: finding an answer differs from finding every answer. A pupil can check a successful purchase and then ask what the example leaves undiscovered. That is a lesson available from the problem's structure, not an invented census of historical schools or a measured saving in ancient trading time.

## How it changed history

Aydin locates the work's importance in systematic treatment of problems admitting numerous integer answers, rather than satisfaction with one answer. Sesiano's argument, as reported by MacTutor, makes these procedures worth studying without requiring that every problem and idea began here. Both the contribution and its boundaries belong in the account {cite:tdv-abu-kamil work2} {cite:abu-kamil-mactutor rare-things}.

This also differs from extending algebra to irrational coefficients: one contribution concerns admissible quantities in equations, the other the collection of admissible answers. Fractional prices do not make this a renamed copy of the earlier radical example. The separate question and work justify a separate record {cite:tdv-abu-kamil work1-and-work2}.

## Who invented it?

**Declared Sunni frame:** the existing documented individual Muslim basis remains separate from priority. **Academic account:** Aydin retains precedents and disputed dependence on Indian methods; MacTutor reports Sesiano's arguments qualified by the texts known. The museum gives neither an absolute first-in-world verdict nor a proven direct route for every procedure {cite:abu-kamil-mactutor summary-and-rare-things} {cite:tdv-abu-kamil work2}.

Even a historical answer count cannot be settled by choosing a convenient number online. ProofWiki prints2696 and reports variants2676,2678,2698 in modern accounts. Our precisely constrained enumeration explains a model, not what each copyist wrote or why every witness differs {cite:proofwiki-abu-kamil-birds variant-counts}.

## Today

Comparing2678 with3727 exposes the effect of an apparently small condition: may a kind be absent? Two programs cannot be compared fairly if that rule changes between them. The tuple counts quantities by kind, not birds arranged in a line; swapping individuals of the same kind does not create another solution.

The contextual photograph shows one modern grey pigeon facing left, with an orange-red eye, white cere, and iridescent neck. It is not100 birds or proof of the identification of every medieval bird word. Resemblance to the example does not transform a modern photograph into a recorded event from the author's life {cite:commons-pigeon-portrait-dori current-image}.

## Surviving examples

We read MacTutor and Aydin, not original manuscripts, Saidan's1986 edition, or the complete Sesiano study. Aydin mentions one surviving manuscript in one passage but later reports Leiden and Paris witnesses. We preserve that reported tension rather than deciding the manuscript census through a collation we did not perform {cite:tdv-abu-kamil work2-witnesses}.

Dori's photograph is dated28March2008, Santa Barbara, and licensed CC BY-SA3.0US; the original JPG is used unchanged. The actual image and rights were inspected, not silently replaced by an unported licence. Its rights and subject are separate questions from authenticating a book or counting its solutions {cite:commons-pigeon-portrait-dori description-rights}.

## In culture

An entertaining puzzle can reveal the difference between existence and completeness. The bird setting alone does not demonstrate transmission between peoples. That is why the account preserves the scholarly discussion of resemblance and disagreement rather than substituting an easy story equating the same commodity with the same method {cite:tdv-abu-kamil work2}.

The explanation needs neither an invented court scene nor a title making its author founder of all modern enumeration. Readers can return to the conditions and see why some tuples qualify and others do not. The image accompanies understanding; it is neither an author portrait nor fabricated evidence of an original page.

## For young readers

Check(4,90,1,3,2) twice: once for count and once for price. Then ask whether any kind may be absent. If not,(0,100,0,0,0) is forbidden even though count and cost are correct. Write the game's conditions before searching, and do not change them when another result appears.

Do not split a bird in half to simplify the answer. Money may be fractional while bird counts must be whole. Find a second answer, then ask about every answer. This is a modern exploration inspired by the kind of problem Aydin describes, not an original table put into Abu Kamil's mouth {cite:tdv-abu-kamil work2} {cite:proofwiki-abu-kamil-birds prices}.

## References

- Aydin:work, integer solutions, witnesses {cite:tdv-abu-kamil work2}.
- MacTutor:biography and reported Sesiano argument {cite:abu-kamil-mactutor rare-things}.
- ProofWiki:modern prices and count variants {cite:proofwiki-abu-kamil-birds historical-note}.
- Commons:Dori photograph and rights {cite:commons-pigeon-portrait-dori description-rights}.
