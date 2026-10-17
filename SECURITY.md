# Security policy

islam.museum is a static site: no server code, no database, no accounts, no runtime AI (`docs/adr/0002-no-ai-or-compute-at-runtime.md`). The attack surface is the build pipeline, the published files and the dependencies.

- **Report a vulnerability** privately to discover@islam.museum. Please do not open a public issue for a security problem. We acknowledge within a week and fix in the order of severity.
- **Content that should not be there** (illegal material, a living person's private data, a copyrighted text beyond a cited 40-word quotation, an un-whitelisted image): the same address, or the "Report an error" issue form. Removals are made in a commit, so the public history shows what was removed and when.
- **Supply chain:** `package-lock.json` is committed; the site is built only by GitHub Actions from `main` and published to GitHub Pages; `scripts/check-static.ts` fails the build if any page or script makes a runtime network call to a non-static or cross-origin endpoint or loads a third-party script.
- **Data:** the site processes no personal data (`/ar/privacy/`, `/en/privacy/`).
