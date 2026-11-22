// What happens on screen in each scene of the Arabic Language Browser film. The page is one long static page, so the
// film is made of scrolls, hovers and two link clicks. See ../place-walkthrough/scripts/shots.mjs for the recorder model.
const SITE = "https://islam.museum";
const URL_ = `${SITE}/ar/arabiyya/`;
const place = async (r, x, y) => { if (r.kind === "touch") { r.x = -200; r.y = -200; return; } r.x = x; r.y = y; await r.page.mouse.move(x, y); };
const park = async (r) => { r.x = -200; r.y = -200; await r.page.mouse.move(2, r.height - 2); };
const reach = async (r, target, seconds = 0.7, opt) => { if (r.kind === "touch") { const [x, y] = await r.center(target, opt); if (r.x < -100) { r.x = x + 60; r.y = y + 90; } await r.move(x, y, Math.min(seconds, 0.45), "out"); } else await r.moveTo(target, seconds, opt); };
// Absolute top of an element, and the height of the site's header, which stays over the top of the window.
const topOf = (r, sel) => r.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY : null; }, sel);
const headH = (r) => r.page.evaluate(() => { const h = document.querySelector("header.site"); return h ? Math.ceil(h.getBoundingClientRect().height) : 0; });
// Scroll so that an element's top sits `gap` px under the header.
async function showTop(r, sel, gap = 24, seconds = 0.9, how = "inOut") { const y = await topOf(r, sel), h = await headH(r); await r.scrollTo(Math.max(0, y - h - gap), seconds, how); }
async function jumpTop(r, sel, gap = 24) { const y = await topOf(r, sel), h = await headH(r); await r.page.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), Math.max(0, y - h - gap)); }
// Move the pointer along an arc of a circle, a frame at a time.
async function arc(r, cx, cy, rad, a0, a1, seconds) {
  const k = Math.max(2, Math.round(seconds * 30));
  for (let i = 0; i <= k; i++) {
    const u = i / k, a = (a0 + (a1 - a0) * u) * Math.PI / 180;
    r.x = cx + rad * Math.cos(a); r.y = cy + rad * Math.sin(a);
    if (r.kind !== "touch") await r.page.mouse.move(r.x, r.y);
    await r.frame();
  }
}
async function ringCircle(r) { const b = await r.page.locator(".sg-ar-ring").boundingBox(); return { cx: b.x + b.width / 2, cy: b.y + b.height / 2, rad: b.width * 0.41 }; }
async function open(r, c) { await r.goto(URL_, { settle: 1500 }); await r.hold(0.3); }
const card = (r, tail) => r.page.locator(`a[href$="${tail}"]`).first();

export const SHOTS = {
  // The ring of the letters, filling the frame, with the pointer running round it from the throat letters to the lips.
  async hook(r, c) {
    await open(r, c); await jumpTop(r, ".sg-ar-ring", 18); await r.hold(0.4);
    const { cx, cy, rad } = await ringCircle(r);
    await place(r, cx + rad, cy - rad * 0.2);
    r.begin(c.dir);
    await r.until(c.at("h1_1") - 0.2);
    await arc(r, cx, cy, rad, -20, 250, Math.max(1.2, c.at("h2_0") + 1.8 - r.n / 30));
    await park(r);
    await r.until(c.end);
  },
  // The top of the page: the title, the lede and the status line.
  async reveal(r, c) {
    await open(r, c); await r.page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await r.hold(0.3);
    await place(r, r.width * 0.6, r.height * 0.9);
    r.begin(c.dir);
    const d = c.cue("r1_0");
    await r.until(d.at + d.dur * 0.15); await reach(r, "h1", 0.8);
    await r.until(d.at + d.dur * 0.55); await reach(r, ".panel.ui", 0.9);
    await r.until(c.end);
  },
  // The ring: the pointer along the arcs, group by group.
  async ring(r, c) {
    await open(r, c); await jumpTop(r, ".sg-ar-grid", 14); await r.hold(0.3);
    const { cx, cy, rad } = await ringCircle(r);
    await place(r, cx, cy + rad * 1.1);
    r.begin(c.dir);
    const d = c.cue("g1_0");
    await r.until(d.at + 0.3);
    await arc(r, cx, cy, rad, 200, 430, Math.max(1.5, d.dur - 0.6));
    await park(r); await r.until(c.end);
  },
  // The verses that name the tongue of the revelation.
  async verses(r, c) {
    await open(r, c); await jumpTop(r, "#c-quran", 14); await r.hold(0.3);
    await place(r, r.width * 0.5, r.height * 0.75);
    r.begin(c.dir);
    const d1 = c.cue("v1_0"), d2 = c.cue("v1_1"), y0 = await r.page.evaluate(() => scrollY);
    await r.until(d1.at + 0.3);
    await r.scrollTo(y0 + (c.tall ? 520 : 380), d1.dur + 0.4, "inOut");
    await r.until(d2.at); await reach(r, ".ar-verse a", 0.7);
    await r.scrollTo(y0 + (c.tall ? 1000 : 760), Math.max(0.8, c.end - r.n / 30 - 0.3), "inOut");
    await r.until(c.end);
  },
  // The chip row, then the nine chapters one after another.
  async chapters(r, c) {
    await open(r, c);
    await showTop(r, 'nav[aria-label] .chip', 20, 0.01); await r.hold(0.3);
    await place(r, r.width * 0.8, r.height * 0.5);
    r.begin(c.dir);
    const chips = r.page.locator('nav[aria-label] .chip'), n = await chips.count();
    const d1 = c.cue("c1_0"); await r.until(d1.at);
    await reach(r, chips.first(), 0.5); await r.moveTo?.(chips.nth(Math.min(8, n - 1)), Math.max(0.6, d1.dur - 0.5)).catch(() => {});
    const go = async (id) => showTop(r, `#s-${id}`, 20, 0.9);
    const plan = { c2_0: ["lisan", "ijaz", "origins"], c3_0: ["script", "sciences"], c4_0: ["dialects", "world", "scholars", "books"] };
    for (const [u, ids] of Object.entries(plan)) {
      const d = c.cue(u);
      for (let i = 0; i < ids.length; i++) { await r.until(d.at + d.dur * (i / ids.length) - 0.1); await go(ids[i]); }
    }
    await r.until(c.end);
  },
  // Open a record: the card for the science of grammar, then its page down to its sources.
  async record(r, c) {
    await open(r, c);
    const lnk = card(r, "/concept/ilm-al-nahw/");
    await r.page.evaluate(() => { const a = document.querySelector('a[href$="/concept/ilm-al-nahw/"]'); const h = document.querySelector("header.site").getBoundingClientRect().height; scrollTo({ top: a.getBoundingClientRect().top + scrollY - h - 120, behavior: "instant" }); });
    await r.hold(0.3); await place(r, r.width * 0.5, r.height * 0.8);
    r.begin(c.dir);
    const d = c.cue("p1_0"), d2 = c.cue("p1_1");
    await r.until(d.at + d.dur * 0.4); await reach(r, lnk, 0.8);
    await r.until(d2.at - 0.2); r.ring = r.n; await r.hold(0.12);
    await r.follow(() => lnk.click());
    if (r.kind === "touch") await park(r);
    await r.until(d2.at + 0.4);
    const ys = await r.page.evaluate(() => { const h = [...document.querySelectorAll("main h2")], src = h.find((e) => /المصادر/.test(e.textContent.trim())); return { first: h[0] ? h[0].getBoundingClientRect().top + scrollY : 700, src: src ? src.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight * 0.7 }; });
    const hh = await headH(r);
    await r.scrollTo(Math.max(0, ys.first - hh - 30), 1.2);
    await r.until(d2.at + d2.dur * 0.6);
    await r.scrollTo(Math.max(0, ys.src - hh - 20), 1.6);
    await r.until(c.end);
  },
  // A scholar: Sibawayh.
  async scholar(r, c) {
    await open(r, c);
    const lnk = card(r, "/person/sibawayh/");
    await r.page.evaluate(() => { const a = document.querySelector('a[href$="/person/sibawayh/"]'); const h = document.querySelector("header.site").getBoundingClientRect().height; scrollTo({ top: a.getBoundingClientRect().top + scrollY - h - 120, behavior: "instant" }); });
    await r.hold(0.3); await place(r, r.width * 0.5, r.height * 0.85);
    r.begin(c.dir);
    const d = c.cue("p2_0");
    await r.until(d.at + 0.4); await reach(r, lnk, 0.8);
    await r.until(d.at + d.dur * 0.5); r.ring = r.n; await r.hold(0.12);
    await r.follow(() => lnk.click());
    if (r.kind === "touch") await park(r);
    const hh = await headH(r);
    await r.hold(0.8);
    await r.scrollTo(Math.max(0, 700 - hh), Math.max(1, c.end - r.n / 30 - 0.4), "inOut");
    await r.until(c.end);
  },
  // What the sources say: two corpora under "what the sources said about Arabic".
  async sources(r, c) {
    await open(r, c); await jumpTop(r, "#passages-title", 14); await r.hold(0.3);
    await place(r, r.width * 0.5, r.height * 0.8);
    r.begin(c.dir);
    const d = c.cue("s1_0"), y0 = await r.page.evaluate(() => scrollY);
    await r.until(d.at); await r.scrollTo(y0 + (c.tall ? 900 : 700), Math.max(1, d.dur * 0.55), "inOut");
    await showTop(r, "#c-tafsir", 14, Math.max(0.8, d.dur * 0.4));
    await r.until(c.end);
  },
  // Depth: a fast, continuous scroll through the two longest chapters.
  async depth(r, c) {
    await open(r, c);
    const y0 = (await topOf(r, "#s-scholars")) - (await headH(r)) - 20;
    await r.page.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), y0); await r.hold(0.3);
    await place(r, r.width * 0.7, r.height * 0.8);
    r.begin(c.dir);
    const d1 = c.cue("d1_0"), y1 = (await topOf(r, "#passages-title")) - 400;
    await r.until(d1.at); await r.scrollTo(y1, Math.max(3, c.end - r.n / 30 - 1.4), "linear");
    await r.until(c.end);
  },
  // The neighbouring halls: the dictionaries browser.
  async kin(r, c) {
    await open(r, c); await jumpTop(r, "#kin-title", 60); await r.hold(0.3);
    await place(r, r.width * 0.3, r.height * 0.8);
    r.begin(c.dir);
    const links = r.page.locator("#kin-title ~ p a"), n = await links.count();
    const d = c.cue("k1_0");
    // The hall of dictionaries is a very large page, so it is not opened here: the pointer passes over the three doors.
    await r.until(d.at + 0.2); await reach(r, links.nth(0), 0.8);
    await r.until(d.at + d.dur * 0.45); await reach(r, links.nth(Math.min(1, n - 1)), 0.7);
    await r.until(d.at + d.dur * 0.75); await reach(r, links.nth(Math.min(2, n - 1)), 0.7);
    await r.until(c.end);
  },
  // The close: the ring again, the pointer away, a slow breath of scroll.
  async close(r, c) {
    await open(r, c); await jumpTop(r, ".sg-ar-ring", 18); await park(r); await r.hold(0.2);
    r.begin(c.dir);
    const y0 = await r.page.evaluate(() => scrollY);
    await r.scrollTo(y0 + 70, Math.max(2, c.end - 1.0), "inOut");
    await r.until(c.end);
  },
};
