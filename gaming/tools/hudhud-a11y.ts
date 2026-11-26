// Hudhud accessibility scan on a games host: Atlas, talk, settings, pause and results in English and Arabic.
// This is a machine scan, not WCAG conformance and not a screen-reader test. It reports semantic roles/names,
// focus order, sheet focus containment, measured text contrast and pointer targets under 44 px.
// Usage: npx tsx --tsconfig tsconfig.json tools/hudhud-a11y.ts <base> <out dir> [langs=en,ar]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";

const [base, outArg, langsArg = "en,ar"] = process.argv.slice(2);
if (!base || !outArg) throw new Error("usage: hudhud-a11y.ts <base> <out dir> [langs=en,ar]");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });

const SCAN = `(() => {
  const norm=(s)=>String(s||'').replace(/\\s+/g,' ').trim();
  const visible=(el)=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'};
  const roleOf=(el)=>el.getAttribute('role')||({BUTTON:'button',A:'link',INPUT:({checkbox:'checkbox',radio:'radio',range:'slider',number:'spinbutton'}[el.type]||'textbox'),SELECT:'combobox',TEXTAREA:'textbox',H1:'heading',H2:'heading',H3:'heading',H4:'heading',DIALOG:'dialog'}[el.tagName]||'generic');
  const nameOf=(el)=>norm(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.getAttribute('title')||('value' in el?el.value:'')||el.textContent).slice(0,120);
  const tabbables=[...document.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(visible);
  const focusOrder=tabbables.map((el,i)=>{const r=el.getBoundingClientRect();return {order:i+1,tag:el.tagName.toLowerCase(),role:roleOf(el),name:nameOf(el),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),tabIndex:el.tabIndex}});
  const small=focusOrder.filter(x=>x.w<44||x.h<44).map(x=>({role:x.role,name:x.name,w:x.w,h:x.h}));
  function rgb(s){const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return {r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]}}
  function over(f,b){const a=f.a+b.a*(1-f.a);return {r:(f.r*f.a+b.r*b.a*(1-f.a))/a,g:(f.g*f.a+b.g*b.a*(1-f.a))/a,b:(f.b*f.a+b.b*b.a*(1-f.a))/a,a}}
  function lum(c){const f=(x)=>{x/=255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
  function bg(el){let cur=el,base={r:255,g:255,b:255,a:1};const layers=[];while(cur){const c=rgb(getComputedStyle(cur).backgroundColor);if(c&&c.a>0)layers.push(c);cur=cur.parentElement}let col=base;for(let i=layers.length-1;i>=0;i--)col=over(layers[i],col);return col}
  const contrast=[];for(const el of [...document.querySelectorAll('body *')].filter(x=>visible(x)&&norm(x.childNodes.length?[...x.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(''):''))){const cs=getComputedStyle(el),fg=rgb(cs.color);if(!fg)continue;const b=bg(el),c=over(fg,b),l1=lum(c),l2=lum(b),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);contrast.push({tag:el.tagName.toLowerCase(),role:roleOf(el),text:norm(el.textContent).slice(0,80),ratio:Math.round(ratio*100)/100,fontSize:parseFloat(cs.fontSize),fontWeight:cs.fontWeight,color:cs.color,background:getComputedStyle(el).backgroundColor})}
  const lowContrast=contrast.filter(x=>x.text&&x.ratio<(parseFloat(x.fontWeight)>=700||x.fontSize>=24?3:4.5)).slice(0,80);
  const ratios=contrast.filter(x=>x.text).map(x=>x.ratio);
  const contrastSummary={measured:ratios.length,minRatio:ratios.length?Math.min(...ratios):null,maxRatio:ratios.length?Math.max(...ratios):null,belowNormalText4_5:lowContrast.length,method:'computed foreground colour composited over ancestor CSS backgrounds; canvas, images and gradients behind text are not measured'};
  const semantic=[...document.querySelectorAll('h1,h2,h3,button,a,input,select,textarea,[role]')].filter(visible).slice(0,240).map(el=>({tag:el.tagName.toLowerCase(),role:roleOf(el),name:nameOf(el),ariaLabel:el.getAttribute('aria-label'),text:norm(el.textContent).slice(0,100)}));
  return {title:document.title,lang:document.documentElement.lang,dir:document.documentElement.dir,focusOrder,smallTargets:small,lowContrast,contrastSummary,semantic,counts:{tabbables:tabbables.length,buttons:document.querySelectorAll('button').length,links:document.querySelectorAll('a').length,sheets:document.querySelectorAll('.sheet').length}};
})()`;

async function scan(page: Page, lang: string, state: string) {
  await page.waitForTimeout(250);
  const file = `hudhud-a11y-${lang}-${state.replace(/[^a-z0-9]+/g, "-")}.png`;
  await page.screenshot({ path: resolve(out, file) });
  const scanFn = new Function(`return ${SCAN.slice(0, -2)}`)() as () => Record<string, unknown>;
  const data = await page.evaluate(scanFn);
  return { state, lang, capture: file, ...(data as Record<string, unknown>) };
}

async function focusTrap(page: Page) {
  const count = await page.locator(".sheet section").count();
  if (!count) return { sheetOpen: false, trapped: null, sequence: [] as string[] };
  const sequence: string[] = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const item = (await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      return { inside: !!a?.closest(".sheet section"), tag: a?.tagName?.toLowerCase() ?? "", text: (a?.textContent || a?.getAttribute("aria-label") || "").trim().slice(0, 60) };
    })) as { inside: boolean; tag: string; text: string };
    sequence.push(`${item.inside ? "in" : "OUT"}:${item.tag}:${item.text}`);
  }
  return { sheetOpen: true, trapped: sequence.every((x) => x.startsWith("in:")), sequence };
}

async function clearTalk(page: Page) {
  for (let i = 0; i < 12; i++) {
    const talking = await page.evaluate(() => (window as any).__HH__?.state().talk !== null);
    if (!talking) return;
    await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
    await page.waitForTimeout(350);
  }
}

const channel = (await (await fetch(`${base}/_channel`)).json()) as { current: string; commit: string };
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1500,950", "--force-device-scale-factor=1"] });
const states: Record<string, unknown>[] = [];
for (const lang of langsArg.split(",")) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${base}/hudhud/?lang=${lang}&fresh=1&music=off`);
  await page.waitForFunction(() => (window as any).__HH__ && ((window as any).__HH__.ready || (window as any).__HH__.error), undefined, { timeout: 30000 });
  states.push(await scan(page, lang, "atlas"));
  await page.locator(".hub button.primary").click();
  await page.waitForFunction(() => (window as any).__HH__.where() !== null, undefined, { timeout: 30000 });
  await page.waitForTimeout(800);
  states.push(await scan(page, lang, "talk"));
  await page.evaluate(() => (window as any).__HH__.command({ type: "skip" }));
  await page.locator("header > button").last().click();
  states.push({ ...(await scan(page, lang, "settings-sheet")), focusTrap: await focusTrap(page) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  await page.locator("header > button").nth(-2).click();
  states.push({ ...(await scan(page, lang, "pause-sheet")), focusTrap: await focusTrap(page) });
  await page.keyboard.press("Escape");
  await page.locator(".words li button").first().click().catch(() => undefined);
  await page.evaluate(() => { (window as any).__HH__.touch("mirror-c"); (window as any).__HH__.touch("mirror-e"); });
  await page.waitForTimeout(2200);
  await clearTalk(page);
  await page.evaluate(() => (window as any).__HH__.touch("page"));
  await page.waitForTimeout(700);
  await clearTalk(page);
  states.push({ ...(await scan(page, lang, "results-sheet")), focusTrap: await focusTrap(page) });
  states.push({ state: "browser-errors", lang, errors });
  await context.close();
}
await browser.close();
const report = {
  base,
  release: channel.current,
  commit: channel.commit,
  ran: new Date().toISOString(),
  machine: `${process.platform} ${process.arch}`,
  note: "Machine scan only: not WCAG conformance and not a screen-reader test. A pass on this machine is not a pass on the two reference machines.",
  states,
};
writeFileSync(resolve(out, "hudhud-a11y.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(JSON.stringify(report, null, 1));
