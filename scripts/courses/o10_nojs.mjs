// Statement 10: with JavaScript disabled, every lesson in the prototype tree is still reachable and readable.
//
//   python3 scripts/courses/scoped_build.py && node scripts/courses/o10_nojs.mjs [--save]
//
// A browser with scripts off starts at the courses home and may only follow links it can see (and open <details>, which
// needs no script). Reachable: every lesson in data/course is found by that walk. Readable: on every lesson page the title,
// every step of the loop, every discovery card with its text, the curriculum codes, the self-check's question and the link
// to the next lesson are all rendered and visible; nothing a student needs is left hidden waiting for a script; and the
// self-check answers without a script (a radio shows its feedback through CSS).
// The pages must carry their stylesheet: an unstyled page would pass layout checks by accident (a Grand Tour lesson).
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { Oracle, serve, courseTree, DIST } from "./oracle.mjs";

const o = new Oracle("10", "with JavaScript disabled every lesson is reachable and readable (statement 10)");
const { lessons } = courseTree();
const conns = Object.fromEntries(lessons.map((l) => [l.slug, (readFileSync(`data/course/${l.slug}.yaml`, "utf8").match(/^- position:/gm) ?? []).length]));
const srv = await serve(48243);
const base = "http://127.0.0.1:48243";
const browser = await chromium.launch();
let reached = 0, readable = 0; const unreached = [], unreadable = [];
let styled = true, quizOk = 0, quizN = 0;
for (const lang of ["ar", "en"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  const home = `/${lang}/learn/courses/`;
  const seen = new Set([home]); let frontier = [home];
  for (let depth = 0; depth < 3 && frontier.length; depth++) {
    const nextF = [];
    for (const u of frontier) {
      await page.goto(base + u, { waitUntil: "load" });
      // links a student can reach with scripts off: visible ones, and ones inside a <details> (opened natively)
      const hrefs = await page.locator(".cx a[href]").evaluateAll((as) => as.filter((a) => a.closest("details") || (a.getBoundingClientRect().width > 0 && !a.closest("[hidden]"))).map((a) => new URL(a.href).pathname));
      for (const h of hrefs) if (h.startsWith(home) && !seen.has(h)) { seen.add(h); nextF.push(h); }
    }
    frontier = nextF;
  }
  for (const l of lessons) {
    const url = `${home}${l.subject}/${l.slug}/`;
    if (!seen.has(url)) { unreached.push(`${lang}:${l.slug}`); continue; }
    reached++;
    await page.goto(base + url, { waitUntil: "load" });
    const m = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden"; };
      const steps = [...document.querySelectorAll("[data-cx-step]")];
      const cards = [...document.querySelectorAll(".cx-card")];
      return {
        h1: (document.querySelector("h1")?.innerText ?? "").trim().length,
        steps: steps.length, stepsVisible: steps.filter(vis).length,
        cards: cards.length, cardsVisible: cards.filter((c) => vis(c) && c.querySelector("h3")?.innerText.trim() && [...c.querySelectorAll(":scope > p")].some((p) => p.innerText.trim().length > 20)).length,
        codes: [...document.querySelectorAll(".cx-exp .cx-code")].filter(vis).length,
        prose: [...document.querySelectorAll(".cx-brief, .cx-sec")].filter(vis).map((e) => e.innerText.trim().length).reduce((a, b) => a + b, 0),
        onward: [...document.querySelectorAll(".cx-nav a")].filter(vis).length,
        check: !!document.querySelector("#check") && vis(document.querySelector("#check")),
        scriptOnlyShown: [...document.querySelectorAll("[data-cx-done], [data-cx-print], [data-cx-present]")].filter(vis).length,
        style: !!document.querySelector("style") && getComputedStyle(document.querySelector(".cx-card") ?? document.body).borderRadius !== "0px",
      };
    });
    styled = styled && m.style;
    const ok = m.h1 > 0 && m.steps >= 3 && m.stepsVisible === m.steps && m.cards === conns[l.slug] && m.cardsVisible === m.cards && m.codes > 0 && m.prose > 100 && m.onward >= 1 && m.check && m.scriptOnlyShown === 0;
    if (ok) readable++; else unreadable.push(`${lang}:${l.slug} ${JSON.stringify(m)} (connections in the record: ${conns[l.slug]})`);
    // the self-check works without a script: choose each option, exactly one feedback line shows
    const radios = page.locator(".cx-q input[type=radio]");
    const n = await radios.count();
    if (n) { quizN++; let good = true; for (let i = 0; i < n; i++) { await radios.nth(i).check(); const shown = await page.locator(".cx-q .cx-fb").evaluateAll((fs) => fs.filter((f) => getComputedStyle(f).display !== "none").length); good = good && shown === 1; } if (good) quizOk++; }
  }
  await ctx.close();
}
await browser.close(); srv.close();
const total = lessons.length * 2;
o.note(`built site: ${DIST.replace(process.cwd() + "/", "")}; browser: Chromium with JavaScript disabled, 390 px wide`);
o.note(`lesson pages expected (Arabic + English): ${total}; reached from the home by links alone within 3 steps: ${reached}; readable in full: ${readable}`);
o.note(`lessons with a recognition question: ${quizN}; answering without a script shows exactly one feedback line for every option: ${quizOk}`);
o.check("every lesson is reached from the courses home with scripts off", reached === total, unreached.join(", ") || `${reached} of ${total}`);
o.check("every lesson page is complete with scripts off: title, every step, every card with its text, the codes, the check, the way onward", readable === total, unreadable.join(" | ") || `${readable} of ${total}`);
o.check("no control that needs a script is shown when scripts are off", readable === total || !unreadable.some((x) => !/"scriptOnlyShown":0/.test(x)));
o.check("the self-check answers without a script", quizOk === quizN && quizN > 0, `${quizOk} of ${quizN}`);
o.check("the pages measured carry their stylesheet", styled);
o.done("o10-nojs");
