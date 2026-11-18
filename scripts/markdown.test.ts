// GorillaQA #11 regression: raw HTML and script-scheme URLs in prose render inert,
// and the validator rejects them at authoring time.
import { describe, it, expect, vi } from "vitest";

vi.mock("../site/src/lib/graph", () => ({
  byId: new Map(),
  href: (lang: string, id: string) => `/${lang}/${id}/`,
  labelOf: (n: any) => n?.label?.en ?? "",
  realNodes: [],
  NEEDS_SOURCE: /\(needs_source[^)]*\)|\bneeds_source\b/g,
}));

import { renderProse, newHonState } from "../site/src/lib/markdown";

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
    const { proseUnsafeHtml } = await import("./validate");
    expect(proseUnsafeHtml(`Text.\n\n${PAYLOAD}`)).toMatch(/raw HTML/);
    expect(proseUnsafeHtml(SCRIPT_LINK)).toMatch(/javascript|data|vbscript/);
    expect(proseUnsafeHtml("No markup, only a [[concept/tawhid|link]] and {cite:sahih-al-bukhari}.")).toBeNull();
  });
});

describe("renderProse: ﷺ goes only to Muhammad", () => {
  const mark = '<span lang="ar">ﷺ</span>';
  it("marks the first plain mention of the Prophet", () => {
    expect(renderProse("قال النبي إن الدين يسر.", "ar").html).toContain(`النبي ${mark}`);
    expect(renderProse("The Prophet said so; the Prophet left.", "en").html).toContain(`the Prophet ${mark}`);
  });
  it("leaves another prophet named after the title unmarked, and marks a later mention of Muhammad", () => {
    const ar = renderProse("معركة النبي صموئيل سنة ١٩١٧م. وقال النبي محمد كذا.", "ar").html;
    expect(ar).not.toContain(`صموئيل ${mark}`);
    expect(ar).not.toMatch(/النبي <span lang="ar">ﷺ<\/span> صموئيل/);
    expect(ar).toContain(`النبي ${mark} محمد`);
    expect(renderProse("the Prophet Daniel Mosque of Kirkuk", "en").html).not.toContain(mark);
    expect(renderProse("قرية النبي صالح وجامع النبي يحيى ومقام النبي ذي الكفل", "ar").html).not.toContain(mark);
  });
  it("keeps ﷺ where the Prophet sends a man who shares a prophet's first name", () => {
    expect(renderProse("بعث النبي خالد بن الوليد إلى العزى.", "ar").html).toContain(`النبي ${mark}`);
    expect(renderProse("النبي خالد بن سنان", "ar").html).not.toContain(mark);
  });
  it("leaves \"the only prophet\" unmarked but marks \"he is the Prophet\"", () => {
    expect(renderProse("أول مفسر للقرآن هو النبي.", "ar").html).toContain(`النبي ${mark}`);
    expect(renderProse("كان موسى النبي الوحيد الذي كلمه ربه.", "ar").html).not.toContain(mark);
  });
});

describe("renderProse: on another prophet's page", () => {
  const mark = '<span lang="ar">ﷺ</span>';
  const ayyub = { id: "person/ayyub", data: { story_roles: [{ role: "prophet-figure" }] } };
  it("reads an opening or appositive \"النبي\" as that prophet, and still marks Muhammad later", () => {
    const hon = newHonState(ayyub);
    expect(renderProse("النبي المبتلى بالصبر.", "ar", hon).html).not.toContain(mark);
    expect(renderProse("عند البخاري قال النبي كذا.", "ar", hon).html).toContain(`النبي ${mark}`);
  });
  it("reads \"النبي\" right after another prophet's name as that prophet on any page", () => {
    expect(renderProse("قبر عزير النبي مشهور.", "ar").html).not.toContain(mark);
    expect(renderProse("يحيى بن زكريا، النبي الذي بشر به القرآن.", "ar", newHonState({ id: "person/yahya", data: { story_roles: [{ role: "prophet-figure" }] } })).html).not.toContain(mark);
  });
  it("keeps ﷺ after a verb or a historian that looks like a prophet's name", () => {
    expect(renderProse("صالح النبي أهل أيلة بتبوك.", "ar").html).toContain(`النبي ${mark}`);
    expect(renderProse("according to Ibn Ishaq, the Prophet had mosques", "en").html).toContain(`the Prophet ${mark}`);
    expect(renderProse("Ibrahim, the Prophet's son, died young.", "en").html).toContain(`the Prophet ${mark}`);
  });
  it("keeps the opening mention on Muhammad's own page", () => {
    const hon = newHonState({ id: "person/muhammad", data: { story_roles: [{ role: "prophet-figure" }] } });
    expect(renderProse("النبي خاتم الأنبياء.", "ar", hon).html).toContain(`النبي ${mark}`);
  });
});

describe("renderProse: ﷺ in Urdu", () => {
  const mark = '<span lang="ar">ﷺ</span>';
  it("marks Muhammad's titles and leaves another prophet's unmarked", () => {
    expect(renderProse("نبی کریم نے فرمایا۔", "ur").html).toContain(`نبی کریم ${mark}`);
    expect(renderProse("عیسیٰ رسول اللہ ہیں۔ پھر رسول اللہ نے فرمایا۔", "ur").html).not.toContain(`عیسیٰ رسول اللہ ${mark}`);
    expect(renderProse("عیسیٰ رسول اللہ ہیں۔ پھر رسول اللہ نے فرمایا۔", "ur").html).toContain(`پھر رسول اللہ ${mark}`);
  });
});

describe("renderProse: a kunya is not a prophet", () => {
  it("keeps ﷺ after \"Abu Ayyub\" and the like", () => {
    expect(renderProse("ابو ایوب رسول اللہ کے ساتھ بدر میں شریک ہوئے۔", "ur").html).toContain('رسول اللہ <span lang="ar">ﷺ</span>');
    expect(renderProse("نزل أبو أيوب عند النبي.", "ar").html).toContain('النبي <span lang="ar">ﷺ</span>');
  });
});
