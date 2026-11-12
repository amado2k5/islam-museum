# Pilot check: Grade 6 Science expectations vs the Ministry text

Checked by: fresh-context verifier agent (Claude), read-only against the repo; official data retrieved 2026-11-12T04:38:54Z (page 04:38:25Z).
Claim tested: the 16 lesson records `data/course/ca-on-g6-sci-*-[1-4].yaml` (and the 4 unit records) carry the curriculum's official codes and texts.
Official source: Ontario Ministry of Education, *The Ontario Curriculum, Grades 1-8: Science and Technology (2022)*, Grade 6, as served by the Ministry's Curriculum and Resources site.
- Page: https://www.dcp.edu.gov.on.ca/en/curriculum/science-technology/grades/grade-6 (an Angular app; the HTML itself holds no expectation text, so it was saved only as evidence).
- Data source the page loads (Ministry's own content API, public, unauthenticated): `https://ws.api.dcp.edu.gov.on.ca/content/api/items?system.id=e6bcd561-07ae-4697-baf5-c03a88943bcc&language=en-CA&system.language[eq]=en-CA&depth=6` (course item "Science and Technology", grade 6, slug `grade-6`), and `...?system.type=l2___course&...` to find that id. Strands A-E and their overall/specific expectations were read from the `modular_content` tree under `e___sci___tech___grade_6___strands`.
- Retrieved (UTC times in `.cache/curricula/ontario-science-tech-2022/retrieved.txt` and `retrieved_api.txt`). Saved under `.cache/curricula/ontario-science-tech-2022/` (git-ignored). `g6-official.json` is extracted from `g6-science-depth6.json` (HTML tags stripped, whitespace and `&nbsp;` normalised).
- The Ministry's PDF was not used.

```
528b2250b5cec0931b4207239113b80871bc5185ea3174997e3a762f31f1543c  grade-6.html
0f628b3a445d962f46dd80c3f21cf817f06ec7c88b64625260490769eade29e1  courses.json
0174500eee2ac6abde5d65aba0ff80d1bbfd5593a43a45458b37744e18102e0a  g6-official.json
3d9ad875857dfc51b75070f58b1eb42d78ae5922c01f6c2377f7dc107449c4a0  g6-science-depth6.json
```

Official Grade 6 strands (from the Ministry): A STEM Skills and Connections; B Life Systems; C Matter and Energy; D Structures and Mechanisms; E Earth and Space Systems. Topics: B biodiversity, C electrical energy (static and current electricity, circuits), D flight, E solar system and space exploration.

## Summary
- Verdicts over 29 entries: EXACT 0; ABBREVIATED/PARAPHRASED 6; WRONG-CODE 17; NOT-FOUND 6.
- The pilot swaps strands C and D: its "C Flight" is official D, and its "D Electrical" is official C. Its unit labels "C Matter and Materials: Flight" and "D Structures and Mechanisms: Electrical..." match no official pairing (official C = Matter and Energy, D = Structures and Mechanisms). B and E names and letters are correct.
- No entry is a verbatim official expectation; the "text" fields are the pilot's own short paraphrases, capitalised, and the `ar` and `ur` text fields hold the same English string.

## Table (29 entries)
Verdict key: ABBREVIATED = same expectation, shortened or reworded; WRONG-CODE = the pilot's code exists officially (or not) but with a different expectation, and the pilot text is a paraphrase of another code; NOT-FOUND = no official expectation corresponds. Official text is shown for the pilot's code, lower-case as published.

| Lesson | Code | Pilot text (en) | Official text for that code | Verdict (nearest official counterpart) |
|---|---|---|---|---|
| bio-1 | B1.1 | Assess the importance of biodiversity | assess the benefits of biodiversity and the consequences of the diminishing of biodiversity | ABBREVIATED (B1.1 (pilot says "importance"; official says "benefits ... and consequences of the diminishing")) |
| bio-1 | B2.1 | Describe the distinguishing characteristics of different groups of organisms | describe the distinguishing characteristics of different groups of organisms, and use these characteristics to further classify these organisms using a classification system | ABBREVIATED (B2.1) |
| bio-2 | B2.1 | Describe the distinguishing characteristics of different groups of organisms | describe the distinguishing characteristics of different groups of organisms, and use these characteristics to further classify these organisms using a classification system | ABBREVIATED (B2.1) |
| bio-2 | B2.2 | Demonstrate an understanding of biodiversity as the diversity of life | demonstrate an understanding of biodiversity as the diversity of life on Earth, including the diversity of organisms within species, among species in a community, and among communities and the habitats that support them | ABBREVIATED (B2.2) |
| bio-3 | B2.3 | Describe the interrelationships between species | describe ways in which biodiversity within species is essential for their survival | WRONG-CODE (text matches B2.5; official B2.3 is about biodiversity within species) |
| bio-3 | B2.4 | Describe ways in which organisms depend on their habitats | describe ways in which biodiversity within and among communities is essential for maintaining the resilience of these communities | WRONG-CODE (nearest B2.5; official B2.4 is community resilience) |
| bio-4 | B1.1 | Assess the importance of biodiversity | assess the benefits of biodiversity and the consequences of the diminishing of biodiversity | ABBREVIATED (B1.1) |
| bio-4 | B1.2 | Assess the impacts of human activities on biodiversity | analyse a local issue related to biodiversity while considering different perspectives; plan a course of action in response to the issue; and act on their plan | NOT-FOUND (official B1.2 is a local-issue action plan; nearest in topic B1.1/B2.6/B2.7) |
| elec-1 | D2.2 | Describe the properties of static electricity | describe the relationships between the four forces of flight – lift, weight, thrust, and drag – that make flight possible | WRONG-CODE (strand letter wrong; text is a paraphrase of C2.1) |
| elec-1 | D2.3 | Explain how objects become charged | describe ways in which flying machines and various organisms use balanced and unbalanced forces to control their flight | WRONG-CODE (strand letter wrong; text is a paraphrase of C2.1) |
| elec-2 | D2.4 | Identify components of simple circuits | describe ways in which the four forces of flight can be altered | WRONG-CODE (strand letter wrong; text is a paraphrase of C2.6) |
| elec-2 | D2.5 | Construct series and parallel circuits | describe characteristics and adaptations that enable organisms to fly | WRONG-CODE (strand letter wrong; text is a paraphrase of C2.7 (official says distinguish, not construct)) |
| elec-3 | D2.6 | Identify sources of electrical energy | (code not in Grade 6) | WRONG-CODE (strand letter wrong; text is a paraphrase of C2.4) |
| elec-3 | D2.7 | Describe energy transformations | (code not in Grade 6) | WRONG-CODE (strand letter wrong; text is a paraphrase of C2.5) |
| elec-4 | D1.1 | Assess the short- and long-term environmental effects of electrical energy | assess the impacts on society of aviation technologies, while considering both local and global perspectives | WRONG-CODE (strand letter wrong; text is a paraphrase of C1.1) |
| elec-4 | D1.2 | Assess ways of reducing energy consumption | (code not in Grade 6) | WRONG-CODE (strand letter wrong; text is a paraphrase of C1.2) |
| fly-1 | C2.2 | Identify the four forces of flight | describe current electricity, and compare and contrast current electricity with static electricity | WRONG-CODE (nearest D2.2) |
| fly-1 | C2.3 | Describe the properties of air that make flight possible | identify materials that are good conductors of electric current and materials that are good insulators | WRONG-CODE (nearest D2.1) |
| fly-2 | C2.4 | Describe how lift is produced | describe how technologies transform various forms of energy into electrical energy | NOT-FOUND (no official expectation on how lift is produced; nearest D2.2/D2.4) |
| fly-2 | C2.5 | Explain how the design of a wing affects flight | describe ways in which electrical energy is transformed into other forms of energy | NOT-FOUND (no official expectation on wing design; nearest D2.4) |
| fly-3 | C2.6 | Explain how aircraft are controlled in flight | explain the functions of the components of a simple electrical circuit | WRONG-CODE (nearest D2.3) |
| fly-4 | C1.1 | Assess the benefits and costs of aviation | assess the short- and long-term impacts of electrical energy generation technologies in Canada on society and the environment, including impacts on First Nations, Métis, and Inuit communities, and on climate change | WRONG-CODE (nearest D1.1) |
| fly-4 | C1.2 | Assess the environmental impact of aviation | assess choices that reduce personal use of electrical energy from both renewable and non-renewable sources, and advocate for the responsible use of electrical energy by the school community | NOT-FOUND (no D1.2 exists; D1 has only D1.1) |
| space-1 | E2.1 | Describe the components of the solar system | identify components of the solar system, including the Sun, Earth and other planets, natural satellites, comets, asteroids, and meteoroids, and describe their main physical characteristics | ABBREVIATED (E2.1) |
| space-1 | E2.2 | Describe the relationship between the Earth, Moon and Sun | distinguish between the concepts of mass and weight | WRONG-CODE (nearest E2.5) |
| space-2 | E2.3 | Describe the phases of the Moon | describe the relationship between the force of gravity and the weight of a body | WRONG-CODE (nearest E2.5 (phases not named in official text)) |
| space-3 | E2.4 | Describe how people have used the sky for navigation and timekeeping | identify the types of bodies in space that emit light and those that reflect light | NOT-FOUND (no official expectation on navigation/timekeeping) |
| space-4 | E1.1 | Assess the benefits and challenges of space exploration | analyse the impact that conditions in space have on humans engaged in space exploration, and explain how humans meet their social, emotional, and physiological needs in space | WRONG-CODE (nearest E1.3) |
| space-4 | E2.5 | Describe Canada's contributions to space exploration | describe various effects of the relative positions and motions of Earth, the Moon, and the Sun | NOT-FOUND (no Canada-specific expectation; nearest E2.6) |

## Unit records (4)
Each unit has a single `expectations` entry that is a placeholder, not Ministry text (`B1 "Overall expectations, strand B"`, `C1`, `D1`, `E1` likewise, with Arabic and Urdu glosses). Official overall expectations: B1 "assess the importance of biodiversity, and describe ways of protecting biodiversity"; C1 "evaluate the impact of the use and generation of electrical energy on society and the environment, and suggest ways to use electrical energy responsibly"; D1 "assess the environmental impacts of flying machines"; E1 "assess the impact of space exploration on humans, society, and the environment". Unit codes are therefore not official texts; and the unit `ca-on-g6-sci-electricity` uses D1, which officially is flight; `ca-on-g6-sci-flight` uses C1, which officially is electricity.

## Strand labels
| Pilot label | Official |
|---|---|
| B Life Systems: Biodiversity | B Life Systems (biodiversity topic): letter and name match |
| C Matter and Materials: Flight | official C = Matter and Energy (electricity); official flight is D. Name and topic wrong |
| D Structures and Mechanisms: Electrical Phenomena, Energy and Devices | official D = Structures and Mechanisms (flight); electricity is C. Letter wrong, topic mislabelled |
| E Earth and Space Systems: Space | match |

## Strand A (STEM Skills and Connections)
Not represented: no lesson or unit carries any A-code (official A1.1-A1.5, A2.1-A2.2, A3.1-A3.3).

## Official B, C, D, E specific expectations not covered
Literal (by the code the pilot printed, wrong-code entries counted as that code): B2.5, B2.6, B2.7, B2.8, C2.1, C2.7, D2.1, E1.2, E1.3, E2.6.

Semantic (by what the pilot text actually corresponds to, NOT-FOUND entries counted as nothing; a judgement, nearest-counterpart mapping above): B1.2, B2.3, B2.4, B2.6, B2.7, B2.8, C2.2, C2.3, D2.4, D2.5, E1.1, E1.2, E2.2, E2.3, E2.4, E2.6.

Overall expectations B1, B2, C1, C2, D1, D2, E1, E2 are present only as the four placeholder unit codes B1, C1, D1, E1.
