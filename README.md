# islam.museum

An open, free, all-digital museum of Islam: the faith, the civilization, the peoples, the places, the ideas, the objects and the living culture, from its origins to today.

- **Live:** https://islam.museum (a bilingual "opening soon" page while the galleries are built)
- **Plan:** [`docs/plan/`](docs/plan/00-README.md) — vision, content model, architecture, experience, editorial policy, roadmap, prompts, prior art, AI content pipeline
- **Deploy:** GitHub Actions → GitHub Pages, behind Cloudflare. The workflow in `.github/workflows/deploy.yml` currently publishes `landing/`; Phase 0 replaces it with the Astro build.

Licenses (planned): code MIT · prose CC BY-SA 4.0 · structured data CC0 · media per item.
