# islam.museum — the plan

A free, open, all-digital museum of Islam with nine wings and four cross-cutting entrances (Questions, Exhibits, the Screening Room, Themes), built as a knowledge graph in git, published as a static site on GitHub Pages behind Cloudflare. Read in order; each document stands alone.

| # | Document | What it answers |
|---|---|---|
| 01 | [Vision](01-vision.md) | What this is, who it is for, the charter, scope (nine wings, four entrances), what is genuinely new, success criteria |
| 02 | [Content model](02-content-model.md) | The twenty-two entity classes, relationships, time (EDTF + Hijri), space, languages, perspectives, example files |
| 03 | [Architecture](03-architecture.md) | Free-hosting constraints, stack (Astro, Svelte, Pagefind, MapLibre, Sigma), repo layout, build pipeline, URLs, Cloudflare, media, growth path |
| 04 | [Experience](04-experience.md) | Atrium, the Label (entity page anatomy), the eight halls, cross-cutting features, design language, acceptance scenarios |
| 05 | [Editorial](05-editorial.md) | Voice, claim status and perspectives, sensitive content, sourcing, transliteration, licensing, contribution workflow, governance |
| 06 | [Roadmap](06-roadmap.md) | Phases 0–6 with exit criteria, the "spine" seed lists (events, 150 people, 60 places, 30 polities, 60 questions), risks, metrics |
| 07 | [Prompts](07-prompts.md) | Copy-paste prompts: CLAUDE.md, scaffold, schema, entity authoring, cell batches, imports, judge, translation, questions, exhibits, halls, Hijri engine, deploy, review, docent |
| 08 | [Prior art](08-prior-art.md) | What exists (museums, text platforms, gazetteers, atlases, standards), what to ingest/link/learn from, licensing verdicts |
| 09 | [AI content pipeline](09-ai-content-pipeline.md) | How AI discovers, pulls, verifies and stores content from inception to now; source tiers; coverage grid; static JSON; UI consumption |
| 10 | [Image generation](10-image-generation.md) | Generating all illustrative imagery on a local Mac: policy, models, setup, commands, batch pipeline, monitoring, review, and the complete prompt system per class |
| 11 | [Made directory](11-made-directory.md) | The ninth wing: a directory of Muslim-made shops, brands, books, apps, studios, media, charities and institutions; schema, discovery, verification, presentation |
| 12 | [Screen index](12-screen-index.md) | Every film, series, documentary and programme about Islam, from any country in any language: scope, the `screen` class, sources and their licences, discovery in 30+ languages, rights, the Screening Room, verified seed list |
| 13 | [Figures](13-figures.md) | Everyone significant to the story at any time, for it and against it: the significance rule, time-scoped story roles, documented faith, seed lanes, discovery from events and works, editorial rules |
| 14 | [Themes atlas](14-themes-atlas.md) | The fourth axis: about 125 themes in 16 families (women, children, elderly, disability, indigenous peoples and minorities, sects and splits, wars and desertions, gatherings and conferences, organisations, websites, charity, halal food, science, medicine, astronomy, evolution, religion versus custom, contradictions); hubs, tension cards, coverage |
| 15 | [Local harvest](15-local-harvest.md) | Drilling Wikidata, Wikipedia in every language, the Qur'an text, classical texts, collections, directories and the web on the founder's Mac with local models and no Claude: setup, commands, licence layers, verification, schedule |

**Status (11 October 2026):** repository created; bilingual "opening soon" page live at https://islam.museum via GitHub Actions → GitHub Pages → Cloudflare. Phase 0 scaffold implemented (schema, pipeline, Astro site, CI) and deployed; Phase 1 spine begun (12 periods, first events of the Prophet's life). Plan extended with documents 12–15; their schema additions are now in the scaffold (`screen` class, 124 themes in 16 families, `story_roles`, `faith`, `labelled`, `tensions`, `sides`, `basis`, new kinds and predicates; validator rules for the licence wall, tension lint and one-sided conflicts; Screening Room and theme hub pages). Next: run day 1 of the local harvest on the Mac (15 §10), then continue people, places and events per `06-roadmap.md`.
