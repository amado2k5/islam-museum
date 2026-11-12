// One-off screenshots of a built page.
//   node scripts/courses/shot.mjs <path> <selector|-> <out.jpg> [width]
// With a selector, the element is scrolled to the top of the screen and the SCREEN is photographed (not the element):
// an element taller than the screen would be stitched from several scrolls, and the site's sticky header would be
// painted into the middle of the picture. With "-", the top of the page is photographed.
import { chromium } from "playwright";
import { serve } from "./oracle.mjs";
const [path, sel, out, w] = process.argv.slice(2);
const srv = await serve(48249);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: Number(w ?? 1280), height: 900 } })).newPage();
await p.goto("http://127.0.0.1:48249" + path, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
if (sel !== "-") await p.locator(sel).first().evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 90));
await p.screenshot({ path: out, type: "jpeg", quality: 70 });
await b.close(); srv.close();
