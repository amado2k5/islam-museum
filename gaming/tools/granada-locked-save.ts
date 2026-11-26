// Checks in real Chrome that a saved game which can be neither read nor copied aside is left exactly as it is:
// every place for a set-aside game is taken, the saved game is unreadable, a new game is played for some days,
// and the saved game and the four set aside are byte for byte what they were.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-locked-save.ts
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";

const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const url = `${served.base}/games/granada/index.html?lang=en&seed=7&music=off&view=plan&no3d=1`;
await page.goto(`${url}&fresh=1`);
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
const keys = ["im.granada.save.v1", "im.granada.save.v1.aside", "im.granada.save.v1.aside.2", "im.granada.save.v1.aside.3", "im.granada.save.v1.aside.4", "im.granada.yearstart.v1"];
await page.evaluate((ks) => { localStorage.clear(); ks.forEach((k, i) => localStorage.setItem(k, `{"v":1,"state":{"scenario":"nothing-${i}"}}`)); }, keys);
const before = await page.evaluate((ks) => ks.map((k) => localStorage.getItem(k)), keys);
await page.goto(url);
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
const noticeShown = (await page.locator("body").innerText()).includes("left untouched");
await page.locator("#brief-start").click();
await page.evaluate("window.__GR__.order({ kind: 'repair' }); window.__GR__.days(5)");
const after = await page.evaluate((ks) => ks.map((k) => localStorage.getItem(k)), keys);
const report = { noticeShown, untouched: JSON.stringify(before) === JSON.stringify(after), saveOk: await page.evaluate("window.__GR__.saveOk()"), day: await page.evaluate("window.__GR__.state().day") };
console.log(JSON.stringify(report));
await browser.close();
await served.close();
if (!report.noticeShown || !report.untouched || report.saveOk) process.exit(1);
