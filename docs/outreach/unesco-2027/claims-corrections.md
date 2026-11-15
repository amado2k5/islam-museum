# Claims corrections: the UNESCO campaign, 15 November 2026

_Draft for the founder. Every claim found stale, overstated, contradicted or unverifiable in four places: the commissioning brief, the dossier of 21 October, the outreach already sent, and the site itself. Status words are those of the public-claims ledger (`docs/audit/public-claims-audit-2026-11-15.md`): **CONTRADICTED**, **OVERSTATED**, **STALE**, **INCOMPLETE**, **UNVERIFIED**, **SUPPORTED**. Nothing here is fixed by this package. Rows that concern public text are entered in the ledger as R11 to R19. How each fact was checked: [`README.md`](README.md)._

## A. The commissioning brief of 15 November

| # | The brief said | Status | What the record shows | Evidence |
|---|---|---|---|---|
| A1 | IFLA, ICOMOS and IRCICA: "silence so far" | **CONTRADICTED** for IRCICA | IRCICA replied on 3 November: it does not nominate candidates for UNESCO prizes, this one included | The reply, read in Gmail; the outreach register already records it |
| A2 | The follow-ups of 2 November to IFLA, ICOMOS and IRCICA were "genuine second touches" | **CONTRADICTED** | Each was a reply to the founder's own sent message and was addressed to his own address alone. For IFLA the header reads from the founder, to the founder. IFLA and ICOMOS have never received the endorsement-letter request or the model letter | Message details in Gmail (IFLA); the same pattern on the ICOMOS and IRCICA threads |
| A3 | Nominations come from "NGOs in official partnership with UNESCO or other organisations eligible under the Prize's Statutes" | **INCOMPLETE** | Article 6.2 also admits Member State governments in consultation with their National Commissions, foundations in official partnership, former laureates, eminent personalities, and "any person or civil society organization working in the field of Arab Culture and for the advancement of peace and intercultural dialogue." The nomination form lists the same nominator types | 224 EX/9.II, Annex I; the form |
| A4 | The "National Commission route" claim is unverified and the UNESCO prize page carries no such text | **Partly SUPPORTED** | The prize page carries no such text, but the Statutes it links do, and the form lists "National Commission for UNESCO" as a nominator type. Of no use in Canada, whose Commission abstains. Whether the quotation Gemini gave was accurate was not checked | Same |
| A5 | 58,128 entries, 116,000 pages, 300 pathways are "the only figures cleared for outreach" | **STALE** | On 15 November the home page prints 63,078 entries, 194,832 record pages and 12 pathways. A reader who checks will see those | Home page; `counts.json` |
| A6 | "Records ≠ published entries; never mix the bases": 58,128 entries against 63,078 records including drafts | **CONTRADICTED** | They are one measure three days apart: every record with a page of its own, drafts included, stubs excluded. The site calls the 63,078 "entries". No separate count of published entries is in public use; records in review state `published` number 9,902 | `counts.json` definitions; `site/src/lib/numbers.ts`; audit script |
| A7 | "63,175 of 63,286 data records carry AI `generated_by` tags" | **Not reproduced** | Of 54,278 content records, 47,899 (88.2%) name an AI model or agent and 6,377 (11.7%) name a script, most of them the Qur'an text loaded from Tanzil. True to say: every record was produced by AI tools or scripts, and none is recorded as read by a human editor | `python3 scripts/report/claims_audit.py` at `034002e2da` |
| A8 | Whether the Muslim World League letter of 8 November was sent is "not confirmed" | **Settled** | It was sent on 8 November to the League's media and info addresses, with the model letter | Gmail |
| A9 | Whether ICOM was followed up is "not confirmed" | **Settled** | An email went to ICOM's General Secretariat on 2 November with the model letter, correctly addressed | Gmail |
| A10 | Reconcile the "prose CC BY-SA 4.0" claim with the site's current terms | **SUPPORTED** | Prose is CC BY-SA 4.0 in `LICENSE-CONTENT.md`, in the site footer, on the Method page and in the API index. The Museums + Heritage entry left it out; that is an omission, not a conflict | Those four sources |
| A11 | Five support channels | **INCOMPLETE** | The Support page lists six: GoFundMe as well | `/en/support/` |
| A12 | The museum will grow "until the results are announced in May 2027" | **Wrong prize** | May 2027 is the Museums + Heritage ceremony. No announcement date for the Sharjah Prize was found. Do not carry "May 2027" into UNESCO text | UNESCO call page |
| A13 | 659 discoveries in the Education Explorer | **UNVERIFIED** | Not re-counted; not used in the new texts | |
| A14 | Professor Hoyland called it "a wonderful resource for interested lay persons and students alike" | **SUPPORTED**, with a tense | His words: "I am sure it will be a wonderful resource for interested lay persons and students alike (which you may quote me on)." Quote the sentence whole; "will be", not "is" | His email of 29 October |
| A15 | H-Net distributed the announcement on 14 November | **SUPPORTED** | An H-Net Commons notification of 14 November carried it. This closes row 11 of the ledger's section 2 | Gmail |
| A16 | IIYL confirmed interest on 14 November | **SUPPORTED**, and there is more | A further reply of 15 November asks for a one-page concept note before a meeting. It was unread | Gmail |
| A17 | ICDE membership is institutional | **SUPPORTED** | Its reply says membership is open to institutions and organisations. The repository's "EUR 200 a year for an individual" is not in that reply | ICDE's email of 21 October (carries a confidentiality notice: paraphrase only) |
| A18 | islam.museum registered and launched 11 October 2026 | **SUPPORTED** | Registration record: 11 October 2026 | Public registration data |
| A19 | Zenodo: daily versioned deposits | **SUPPORTED** | Thirteen versions; one a day for the last five | Zenodo |

## B. The dossier of 21 October (`docs/outreach/unesco-nomination-dossier.md`) and the letters beside it

| # | The text says | Status | Correction |
|---|---|---|---|
| B1 | A.1: candidates "may be nominated only by a Member State through its National Commission, or by a non-governmental organization in official partnership" | **INCOMPLETE** | Article 6.2, as in A3. This sentence set the whole campaign's target list |
| B2 | Part B: "no record is marked reviewed until a person has checked it." Part C: "nothing is marked reviewed until a person has checked it"; "none has yet been marked reviewed by a person. Human review is the museum's largest cost and its next priority" | **CONTRADICTED** since 24 October and 15 November | 9,902 records are `published`, all AI-written, none recorded as human-read. The rule is now: sources and provenance, no human read required |
| B3 | 33,919 records in 21 classes; 32,526 relations; the class counts; about 19,700 articles a language | **STALE** | 63,078 entries live; 63,773 record files; 83,868 relations; about 32,700 prose files a language |
| B4 | 6,841 preliminary cards; "about 27,100 records with at least one citation other than the placeholder" | **STALE**; the second figure was a subtraction, not a measure | 11,264 preliminary cards (20.8%); 54.7% of content records cite a book |
| B5 | "Every record citing sources"; "every claim carries its source"; the validator rejects "uncited claims" | **OVERSTATED** | One content record in five is a preliminary card with a placeholder citation; 22 cite no source record |
| B6 | "A date without two sources is flagged" | **CONTRADICTED** | One source is enough for any fact, dated or not |
| B7 | Reach: 37,930 addresses, 1.41 million requests, the crawler shares | **STALE**, not re-read since 21 October | Removed. A current reading, with its date, is the founder's to add |
| B8 | "No servers, no databases, no per-visitor computation" | **OVERSTATED** in wording | A Cloudflare Worker serves the stored files. Say: no application server, no database, no AI at runtime |
| B9 | "Photographs of objects are never copied: they are displayed from the holding institutions' own servers" | **UNVERIFIED** today | True of the 187 V&A photographs when written. Whether it holds for all 735 media records was not checked. Left out |
| B10 | Planning "began in September 2025"; Annex A: "domain registered 19 September 2025" | **CONTRADICTED** as a statement about islam.museum | islam.museum was registered on 11 October 2026. The 2025 date can only be the prototype's |
| B11 | The "Canadian dimension" section; "published under Canadian stewardship" | **STALE**, and now a risk | The Canadian Commission abstains. Nothing may read as national backing |
| B12 | Commitments: to incorporate "before any prize funds are received", to publish "the share reviewed by a person each year", an annual indicator report | **UNVERIFIED** as current commitments | Not in the founder's present rulings. The new dossier promises none of them |
| B13 | Annex C links two videos about the prototype application | Conflicts with the rule that the museum's materials name no other project | Removed |
| B14 | 1,349 illustrations "made locally with an open-weights model" | Count **SUPPORTED**; method **UNVERIFIED** today | The new dossier uses the site's own label only |
| B15 | 220 answered questions; 301 learning trails | **STALE** | 320 questions; 298 trail records (the site's interface says "300 pathways") |
| B16 | `ngo-nomination-package.md`, letter to ICOM: "the legal entity is in formation" | **CONTRADICTED** | No entity exists and no filing has been made |
| B17 | The same file prints the founder's telephone number in three letters | A privacy matter in a public repository | For the founder to decide; the register's own rule is that no telephone number appears |
| B18 | A.1 and `ngo-nomination-package.md`: ICDE membership "EUR 200 for an individual" | **UNVERIFIED** | ICDE's reply speaks of institutions and organisations and gives no fee |

## C. Outreach already sent

| # | Where | The text says | Status | Correction for anything sent from now on |
|---|---|---|---|---|
| C1 | Follow-ups of 2 November (IFLA, ICOMOS, IRCICA drafts; the ICOM email) | "44,367 sourced entries"; "every entry carries its citations" | **OVERSTATED** | "some 63,000 entries, most labelled drafts, about a fifth preliminary cards whose sources are not yet checked" |
| C2 | The model endorsement letter of 2 and 8 November | "44,367 sourced entries"; "an outstanding contribution"; no heading for the three things Article 6.3 requires; sent as a `.md` file | **OVERSTATED** and incomplete | Replaced by the two models in [`form-texts.md`](form-texts.md), section 5 |
| C3 | Letter to the Muslim World League, 8 November | The League is "an organisation in official partnership with UNESCO" | **UNVERIFIED** | Not on UNESCO's NGO list of August 2025 (agent-read; the October 2026 list could not be opened). The request does not need it: Article 6.2 admits civil society organisations |
| C4 | The same letter | The British Library "is in contact about linking it to its catalogue" | **UNVERIFIED** | Not in the register and not in the brief. Do not repeat it until the evidence is on file |
| C5 | The same letter | More than 51,000 entries, 102,000 pages, 300 pathways | **STALE** | As C1 |
| C6 | First letters of 21 October (Secretariat, IFLA, ICOMOS, IRCICA) | "about 20,900 structured records in 21 classes, sourced and dated" | **STALE** and **OVERSTATED** | As C1. The dossier attached to three of them is the edition of 21 October |
| C7 | Letter to IIYL, 14 November | "58,128 entries ... cited, structured records"; "an Education Explorer of 360 lessons"; lessons "every one cited" | **STALE**; "cited" **OVERSTATED**; 361 lessons; the lesson citations **UNVERIFIED** | The concept note in [`letters.md`](letters.md) (L4) says the lessons are AI-written drafts not yet read by a human editor |
| C8 | H-Net announcement, 12 to 14 November | Title: "A Free, Sourced Digital Museum and CC0 Dataset" | "Sourced" needs the preliminary-card caveat | Nothing to recall. Avoid "sourced" as a bare adjective from now on |
| C9 | School and other packs of 5 to 9 November | "seeking a nomination for the UNESCO–Sharjah Prize through UNESCO's partner organisations" | **SUPPORTED** as claim discipline; narrower than the Statutes | From now on: "seeking a nomination for the UNESCO–Sharjah Prize" |

## D. On the site, where a juror or an endorser will look

| # | Where | What does not match | Status |
|---|---|---|---|
| S1 | The gift-shop storefront linked from the home page | It says twice that purchases support "the Islam Museum Foundation". Every UNESCO text says no organisation exists | **CONTRADICTED**; ledger R6, still open. **Correct it before anything is filed** |
| S2 | The "Museum Trustees" page; the register's record of an invitation to the museum's Board of Trustees (27 October) | A board of trustees reads as shared direction. The standing rule is that the founder shares management and decisions with no one | Open, founder's decision; ledger R10. Until it is settled the dossier mentions no board |
| S3 | The page titled "Foundation" | A reader may take the title for a legal foundation | Not read in full. Worth one look before filing |
| S4 | Support page, the LaunchGood line | "the first open digital Islamic museum" | **UNVERIFIED** superlative |
| S5 | `i18n/en.yaml`, `diff_structure` | "over 42,000 entries and some 86,000 pages ... joined by 300 pathways"; "every claim carries its source" | **STALE** and **OVERSTATED**. Where it is displayed was not traced |
| S6 | "Pathways" | The tour pages say "300 pathways" (there are 298 trail records); the home page says "12 pathways" (lessons tied to a curriculum). One word, two counts | Confusing. Say "guided trails" for the first |
| S7 | The Zenodo record | Its licence field says CC0 for an archive that is the whole repository, prose (CC BY-SA 4.0) and code (MIT) included | **OVERSTATED** label; founder's to correct on Zenodo |
| S8 | `/ur/grand-tour/` | Not found. The Grand Tour is in Arabic and English | Ledger R8, open. Never write "in three languages" of the Tour |

## E. Wording that is safe today

- "A free, Arabic-first digital museum of Islamic history; English and Urdu editions; the Grand Tour in Arabic and English."
- "63,078 entries on 15 November 2026, drafts included" or "some 63,000 entries".
- "Its entries are drafted, translated and cross-checked by AI tools from cited sources, under rules the founder wrote and published; most are labelled drafts; about one in five is a preliminary card whose sources are not yet checked."
- "Data CC0, prose CC BY-SA 4.0, code MIT."
- "A personal project; no organisation exists yet; Ontario non-profit incorporation is planned."
- "Seeking a nomination for the UNESCO–Sharjah Prize." "Digital Public Goods Alliance: application submitted, under review."
- Never: "sourced" as a bare adjective for the whole collection; "reviewed", "verified" or "curated" of the records; "nominated", "candidate for" or "submitted to UNESCO"; anything that suggests the Canadian Commission's support; "foundation" or "board" as if they existed in law.
