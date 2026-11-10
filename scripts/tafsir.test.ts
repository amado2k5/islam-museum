import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The Tafsir Browser pages (docs/plan/27-tafsir-browser.md, docs/site/browsers.md section 4):
// the landing header is searchable, the long lists are kept out of the Pagefind index.
const root = join(__dirname, "..", "site", "src", "pages", "[lang]", "tafsir");
const index = readFileSync(join(root, "index.astro"), "utf8");
const volume = readFileSync(join(root, "[volume].astro"), "utf8");

describe("Tafsir Browser Pagefind markup", () => {
  it("landing header is indexed and the volume list is ignored", () => {
    expect(index).toMatch(/<section data-pagefind-body>/);
    expect(index).toMatch(/aria-labelledby="tafsir-volumes" data-pagefind-ignore/);
  });

  it("volume page header is indexed and its verse list is ignored", () => {
    expect(volume).toMatch(/<section data-pagefind-body>/);
    expect(volume).toMatch(/aria-labelledby="tafsir-verses" data-pagefind-ignore/);
  });
});
