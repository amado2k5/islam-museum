# Ontario, Grades 1 to 12: which courses can carry the museum

A review of every course the Ontario Ministry of Education serves from its curriculum service (383 entries on 12 November 2026, listed by `python3 scripts/courses/fetch_ontario.py --list`), made before the fleet run. It decides which courses are **attempted** through the pipeline. Attempting is not adding: the pipeline's mapping step decides, expectation by expectation, what becomes a lesson and what goes to the gap register, and a course that yields no honest lesson is recorded as a gap and gets no records.

The test for "attempt": the course's own expectations ask for something the museum holds records about (density by subject: `docs/courses-mission/oracle-output/density.out`). A course is not attempted because Muslims study it too.

## Attempted

| Group | Ministry course names | Why the expectations can meet the museum |
|---|---|---|
| Social Studies, elementary | `SSHG - Grade 1 (2023)`, `SSHG - Grade 2 (2023)`, `SSHG - Grade 3 (2023)`, `SSHG - Grade 4` (the proof course), `SSHG - Grade 5`, `SSHG - Grade 6 (2023)` | Family and community traditions and celebrations, global communities, early societies, communities and Canada's links with the world. Grade 4 strand A is the densest; the others are attempted and expected to yield less. |
| Geography, Grades 7 and 8 | `GEO - Grade 7`, `GEO - Grade 8` | Physical patterns, resources, global settlement and quality of life: places and cities the museum records. |
| Science and Technology, elementary | `Sci & Tech - Grade 1` … `Grade 8` (Grade 6 is the pilot) | Light and sound, the body, machines, fluids, water, space, living things: the museum's records on scholars, inventions and instruments. |
| Science, secondary | `SNC1W`, `SNC2D`, `SNC2P`, `SNC4M`, `SES4U`, `SPH3U`, `SPH4U`, `SPH4C`, `SCH3U`, `SBI3U`, `SVN3M` | Optics, astronomy, mechanics, chemistry, the body, the environment. |
| Mathematics | `Math - Grade 1` … `Grade 8`, `MTH1W` | Number systems, algebra, geometry, measurement. The museum's mathematics holdings are thin (54 records with prose), so few lessons are expected per grade. |
| The Arts | `Arts - Grade 1` … `Grade 8`; `AVI1O`, `AVI2O`, `AVI3M`, `AVI3O`, `AVI4M`, `AVI4E`; `AMU3M`, `AMU4M` | Visual arts and music across cultures and periods: architecture, calligraphy, objects, music. |
| World religions | `HRT3M`, `HRF3O` | The course studies the world's religions; the museum's densest holdings. |
| Philosophy | `HZB3M`, `HZT4U` | Metaphysics, ethics, epistemology and the history of philosophy. |
| Social sciences and humanities | `HSC4M` (World Cultures), `HSB4U`, `HSP3U`, `HSE4M`, `HFA4U`, `HNB4M`, `LVV4U` | Culture, social change, equity, food and culture, the world of fashion, classical civilization. Expected yield is low to moderate. |
| Languages | `LBABD – LDYBD`, `LBACU – LDYCU`, `LBADU – LDYDU` (International Languages, which includes Arabic) | The expectations ask for cultural knowledge of the language's regions. |

## Not attempted, with the reason

| Group | Courses | Reason |
|---|---|---|
| Published as PDF only | `CHW3M` (World History to the End of the Fifteenth Century), `CHY4U`, `CHY4C` (World History since the Fifteenth Century), `CHA3U`, `CHI4U`, `CHT3O`, `CHE3O`, `CHM4E`, all Grade 11–12 geography, economics, law and politics (`CG*`, `CI*`, `CL*`, `CP*`), Grade 10–12 mathematics (`MPM2D` … `MHF4U`), business (`B*` PDF), computer studies (`ICS*`) | The Ministry's service holds these as PDF files with no structured expectations; the fetcher cannot extract them. `CHW3M` and `CHY4U` are the two most relevant courses in the province for this museum and are the first candidates for a PDF extraction step, which does not exist yet. Registered as a pipeline gap, not skipped as irrelevant. |
| Canadian history and civics | `HIST - Grade 7 (2026)`, `HIST - Grade 8 (2026)`, `CHC2D`, `CHC2P`, `CHV2O`, `CGC1W` | The expectations are about Canada between 1713 and the present, its geography and its government. The museum holds no records on them. |
| First Nations, Métis and Inuit studies | `NAC*`, `NBE*`, `NBV*`, `ND*`, `Ind Lang - Grade 1–8` | The expectations are about Indigenous peoples of Canada. No honest link. |
| Language arts and second languages | `Lang - FRA - Grade 1–8`, `ENG*`/`ENL1W`, `FSL *`, `FSF*`, `FIF*`, `FEF*`, `ESL*`, `ELD*`, `LAS*`, `LNA*`, classical languages `LVG*` | Skills expectations (reading, writing, speaking) that name no subject matter. A text from the museum could be read in any of them, but nothing in the expectations asks for it. |
| Health, physical education, guidance | `HPE - Grade 1–8`, `PPL*`, `PLF4M`, `PPZ3C`, `PSK4U`, `GL*`, `GPP3O`, `GWL3O`, `Coop Linked Course`, `DCO3O`, `Kindergarten` | No expectation on the museum's subjects. |
| Family studies (most), technology, business, drama, dance, media arts | `HFN*`, `HFC*`, `HFL4E`, `HHD3O`, `HHG4M`, `HHS4*`, `HIF*`, `HIP4O`, `HLS3O`, `HNC3C`, `HNL2O`, `HP*`, `T**`, `BEM1O`, `BEP2O`, `ICD2O`, `ADA*`, `ATC*`, `ASM*`, `AEA*`, `ALC*`, `AMU1O`–`AMU3O`, `AMU4E`, `IDC*` | Either no subject matter the museum holds, or a link so loose it would be a stretch. The two senior music courses and the visual arts courses are attempted instead. |
| French-language duplicates and `(PDF)` twins | every `… (PDF)` entry and the `- FRA…` half of paired names | The same course in another format or language of instruction. |

Each attempted course ends in one of three states, recorded in `docs/courses/ontario-fleet.md` after the run: **ingested** (records, gate GREEN), **gap only** (no honest lesson; a gap register and no records), or **failed** (the run did not reach a green gate; what stopped it).
