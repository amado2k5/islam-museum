// GorillaQA #11 regression: raw HTML and script-scheme URLs in prose render inert,
// and the validator rejects them at authoring time.
import { describe, it, expect, vi } from "vitest";

vi.mock("./graph", () => ({
  byId: new Map(),
  href: (lang: string, id: string) => `/${lang}/${id}/`,
  labelOf: (n: any) => n?.label?.en ?? "",
  realNodes: [],
}));

import { renderProse } from "./markdown";

const PAYLOAD = '<img src=x onerror="alert(document.domain)">';
const SCRIPT_LINK = "[click](javascript:alert(document.domain))";
const DATA_IMG = "![x](data:text/html,<script>alert(1)</script>)";

describe("renderProse: raw HTML and script URLs are inert", () => {
  it("escapes a raw HTML payload instead of emitting it", () => {
    const { html } = renderProse(`A line.\n\n${PAYLOAD}\n`, "en");
    expect(html).not.toContain("<img");
    expect(html).not.toContain('onerror="');
    expect(html).toContain("&lt;img");
  });
  it("renders a javascript: link as text only", () => {
    const { html } = renderProse(SCRIPT_LINK, "en");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<a");
  });
  it("renders a data: image as its alt text only", () => {
    const { html } = renderProse(DATA_IMG, "en");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("data:text/html");
  });
  it("keeps legitimate constructs working", () => {
    const md = "A [[concept/tawhid|Tawhid]] link.{cite:sahih-al-bukhari 1}\n\n- **Sunni**: ok";
    const { html, cites } = renderProse(md, "en");
    expect(html).toContain("Tawhid");
    expect(html).toContain('<sup class="cite">');
    expect(cites.length).toBe(1);
  });
  it("still allows normal links and images", () => {
    const { html } = renderProse("[site](https://example.com) ![alt](/media/x.png)", "en");
    expect(html).toContain('<a href="https://example.com">site</a>');
    expect(html).toContain('<img src="/media/x.png" alt="alt">');
  });
});

describe("proseUnsafeHtml: the validator rejects the payload at authoring time", () => {
  it("flags raw HTML tags", async () => {
    const { proseUnsafeHtml } = await import("../../../scripts/validate");
    expect(proseUnsafeHtml(`Text.\n\n${PAYLOAD}`)).toMatch(/raw HTML/);
    expect(proseUnsafeHtml(SCRIPT_LINK)).toMatch(/javascript|data|vbscript/);
    expect(proseUnsafeHtml("No markup, only a [[concept/tawhid|link]] and {cite:sahih-al-bukhari}.")).toBeNull();
  });
});
