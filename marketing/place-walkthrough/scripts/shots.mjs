// What happens on screen in each scene. Every function drives the live site through the recorder (rec.mjs): the
// pointer moves, clicks and types; the site does the rest. `c.at(unit)` is the second, counted from the start of the
// scene, at which that sentence of the narration begins (build/<lang>/plan.json), so each action lands on its words.
//
// The same choreography serves both languages (the labels differ, the buttons do not) and both shapes: "wide" is the
// desktop layout, "tall" the phone layout, where the panel is a sheet at the bottom and choices are made from it.
const SITE = "https://islam.museum";

export const LABELS = {
  en: {
    arabia: "The Arabian peninsula", andalus: "al-Andalus and Europe", persia: "Persia and Central Asia", southasia: "South Asia",
    medina: /^Medina$/, abu: "Abu Bakr al-Siddiq", mecca: "Mecca", medinaNode: "Medina", lived: "Lived here",
    cordoba: "Cordoba", rushd: "Ibn Rushd al-Hafid", mosque: "Great Mosque of C", sources: /^Sources$/,
  },
  ar: {
    arabia: "الجزيرة العربية", andalus: "الأندلس وأوروبا", persia: "بلاد فارس وآسيا الوسطى", southasia: "جنوب آسيا",
    medina: /^المدينة المنورة$/, abu: "أبو بكر الصديق", mecca: "مكة المكرمة", medinaNode: "المدينة المنورة", lived: "مكان الإقامة",
    cordoba: "قرطبة", rushd: "ابن رشد الحفيد", mosque: "جامع قرطبة", sources: /^المصادر$/,
  },
};

// Open the Place map and put it in a known state, off camera.
async function map(r, c, { hash = "", full = true, panel = true } = {}) {
  await r.goto(`${SITE}/${c.lang}/place/${hash}`, { waitFor: () => !!document.querySelector(".pm-rname, .pm-core") && !document.querySelector(".pm-status:not(:empty)") });
  if (full) { await r.page.locator(".pm-fullbtn").click(); await r.hold(0.7); }
  if (!c.tall && !panel) { await r.page.locator(".pm-panel-toggle").click(); await r.hold(0.5); }
  await r.hold(0.4);
}
const nodesLoaded = () => document.querySelectorAll(".pm-node").length > 0;
// A region on the map. Its name is hidden whenever it would lie on another name, so the name is used when it is
// there and the region's own shape when it is not. Regions are numbered in the site's order.
const REGION = { andalus: 0, maghreb: 1, westafrica: 2, egypt: 3, eastafrica: 4, arabia: 5, levant: 6, anatolia: 7, persia: 8, southasia: 9, southeastasia: 10, china: 11 };
async function regionTarget(r, key, text) {
  const name = r.page.locator(".pm-rname", { hasText: text }).first();
  if (text && await name.count()) return name;
  return r.page.locator(`.pm-region[data-r="${REGION[key]}"]`).first();
}
// A point inside a region, kept inside the visible map.
async function regionPoint(r, key) {
  const b = await r.page.locator(`.pm-region[data-r="${REGION[key]}"]`).first().boundingBox();
  const v = await r.page.locator(".pm-view").boundingBox();
  const cx = Math.min(Math.max(b.x + b.width / 2, v.x + 40), v.x + v.width - 40), cy = Math.min(Math.max(b.y + b.height / 2, v.y + 40), v.y + v.height - 90);
  return [cx, cy];
}
const rname = (r, text) => r.page.locator(".pm-rname", { hasText: text }).first();
const node = (r, text) => r.page.locator(".pm-node", { hasText: text }).first();
const park = async (r) => { r.x = -200; r.y = -200; await r.page.mouse.move(2, r.height - 2); };
// Where the pointer rests before a scene's first action. A finger is not on the glass until it taps.
const place = async (r, x, y) => { if (r.kind === "touch") { r.x = -200; r.y = -200; return; } r.x = x; r.y = y; await r.page.mouse.move(x, y); };
// On the phone layout the finger appears where it is about to tap, then leaves.
const reach = async (r, target, seconds = 0.7, opt) => { if (r.kind === "touch") { const [x, y] = await r.center(target, opt); if (r.x < -100) { r.x = x + 60; r.y = y + 90; } await r.move(x, y, Math.min(seconds, 0.45), "out"); } else await r.moveTo(target, seconds, opt); };

export const SHOTS = {
  // "What happened here?" on Medina; "And here? And here?" as the view opens to the whole world.
  async hook(r, c) {
    const T = LABELS[c.lang];
    await map(r, c, { panel: false });
    await (await regionTarget(r, "arabia", T.arabia)).click(); await r.hold(1.8);
    if (c.tall) { await r.page.locator(".pm-panel-toggle").click(); await r.hold(0.6); } // fold the list away: the opening is the map alone
    const med = r.page.locator(".pm-pname").filter({ hasText: T.medina }).first();
    const [mx, my] = await r.center(med);
    await place(r, mx + (c.tall ? 70 : 170), my + (c.tall ? 120 : 110));
    r.begin(c.dir);
    await r.move(mx + 4, my + 3, 0.6, "out");
    await r.until(c.at("h2_0") - 0.1);
    await r.page.evaluate(() => document.querySelector('.pm-zoom [data-act="home"]').click());
    await r.hold(0.5);
    { const [x, y] = await regionPoint(r, "maghreb"); await r.move(x, y - 30, 0.55, r.kind === "touch" ? "out" : "inOut"); }
    await r.until(c.at("h2_1") - 0.1);
    { const [x, y] = await regionPoint(r, "persia"); await r.move(x, y, 0.6, r.kind === "touch" ? "out" : "inOut"); }
    await r.until(c.at("h3_0") + 0.4);
    if (r.kind !== "touch") await r.move(r.width * 0.86, r.height * 0.6, 1.1); else await park(r);
    await r.until(c.end);
  },

  // The page as a visitor meets it, with the museum's header; then the map is asked to fill the screen.
  async reveal(r, c) {
    await map(r, c, { full: false });
    await place(r, r.width * 0.5, r.height * 0.62);
    r.begin(c.dir);
    const cue = c.cue("r1_0");
    await r.until(cue.at + cue.dur * 0.12);
    await reach(r, r.page.locator("header").getByText("islam.museum", { exact: true }).first(), 0.8, { dy: 4 });
    await r.until(cue.at + cue.dur * 0.5);
    await reach(r, ".pm-fullbtn", 0.9);
    await r.until(cue.at + cue.dur * 0.68);
    await r.click();
    if (r.kind !== "touch") { await r.hold(0.5); await r.move(r.width * 0.62, r.height * 0.55, 0.9); }
    await r.until(c.end);
  },

  // The whole world, the twelve regions, and the year bar set running.
  async world(r, c) {
    const T = LABELS[c.lang];
    await map(r, c);
    await place(r, r.width * 0.7, r.height * 0.55);
    r.begin(c.dir);
    await r.until(c.at("d1_0"));
    { const [x, y] = await regionPoint(r, "maghreb"); await r.move(x, y - 20, 0.9); }
    await r.hold(0.15);
    { const [x, y] = await regionPoint(r, "southasia"); await r.move(x, y, 1.0); }
    await r.until(c.at("d1_1") + 0.2);
    if (!c.tall) {
      await r.moveTo(r.page.locator(".pm-panel .pm-row").nth(0), 0.7);
      await r.moveTo(r.page.locator(".pm-panel .pm-row").nth(3), 0.9, "linear");
    } else { const [x, y] = await regionPoint(r, "arabia"); await r.move(x, y, 0.5, "out"); }
    await r.until(c.at("d2_0") - 0.45);
    await reach(r, ".pm-play", 0.75);
    await r.until(c.at("d2_0") + 0.3);
    await r.click();
    await r.hold(0.5);
    if (r.kind !== "touch") await r.move(r.width * 0.6, r.height * 0.45, 1.0);
    await r.until(c.end);
  },

  // A region, then a place: Medina and what is linked to it.
  async place(r, c) {
    const T = LABELS[c.lang];
    await map(r, c);
    await place(r, r.width * 0.72, r.height * 0.3);
    r.begin(c.dir);
    await r.until(c.at("d3_0") - 0.3);
    await reach(r, await regionTarget(r, "arabia", T.arabia), 0.7);
    await r.until(c.at("d3_0") + 0.55);
    await r.click();
    await r.until(c.at("d4_0") - 0.1);
    const med = c.tall ? r.page.locator(".pm-panel .pm-row").filter({ hasText: T.medina.source.replace(/[\^$]/g, "") }).first()
                       : r.page.locator(".pm-pname").filter({ hasText: T.medina }).first();
    await reach(r, med, 0.7);
    await r.until(c.at("d4_1") + 0.1);
    await r.click();
    await r.settle(nodesLoaded);
    const d5 = c.cue("d5_0");
    await r.until(d5.at + d5.dur * 0.08);
    await reach(r, ".pm-core b", 0.7);
    await r.until(d5.at + d5.dur * 0.42);
    await reach(r, node(r, T.lived), 0.7);
    await r.until(d5.at + d5.dur * 0.7);
    if (!c.tall) {
      await r.moveTo(r.page.locator(".pm-chips button").nth(1), 0.7);
      await r.click();
      await r.hold(0.5);
      await r.moveTo(r.page.locator(".pm-node").nth(1), 0.8);
    } else {
      await reach(r, r.page.locator(".pm-core button").last(), 0.5);
      await r.click();
    }
    await r.until(c.end);
  },

  // From the place to a person: the map turns around Abu Bakr al-Siddiq.
  async person(r, c) {
    const T = LABELS[c.lang];
    await map(r, c, { hash: "#p=medina" });
    await r.settle(nodesLoaded); await r.hold(0.5);
    await place(r, r.width * 0.5, r.height * 0.8);
    r.begin(c.dir);
    const d6 = c.cue("d6_0"), d6b = c.cue("d6_1");
    await r.until(d6.at - 0.2);
    await reach(r, node(r, T.abu), 0.75);
    await r.until(d6.at + d6.dur * 0.42);
    await r.click();
    await r.settle(() => /\/person\//.test(document.querySelector(".pm-panel-body a.pm-link")?.getAttribute("href") || "") && document.querySelectorAll(".pm-node").length > 0);
    await r.until(d6b.at + d6b.dur * 0.38);
    await reach(r, node(r, T.mecca), 0.6);
    await r.until(d6b.at + d6b.dur * 0.72);
    await reach(r, node(r, T.medinaNode), 0.6);
    await r.until(c.end);
  },

  // From the map to the entry's own page, down to its sources.
  async entry(r, c) {
    const T = LABELS[c.lang];
    await map(r, c, { hash: "#p=medina" });
    await r.settle(nodesLoaded);
    await node(r, T.abu).click();
    await r.settle(() => /\/person\//.test(document.querySelector(".pm-panel-body a.pm-link")?.getAttribute("href") || ""));
    await r.hold(0.8);
    const link = r.page.locator(".pm-panel-body a.pm-link").first();
    await place(r, r.width * 0.55, r.height * 0.6);
    r.begin(c.dir);
    if (c.tall) { await reach(r, ".pm-panel-toggle", 0.4); await r.click(); await r.hold(0.35); }
    await reach(r, link, c.tall ? 0.4 : 0.7);
    r.ring = r.n; await r.hold(0.12);
    await r.follow(() => link.click());
    if (r.kind === "touch") await park(r);
    const d7 = c.cue("d7_0");
    await r.until(d7.at + d7.dur * 0.3);
    const ys = await r.page.evaluate((re) => {
      const h = [...document.querySelectorAll("main h2")], rx = new RegExp(re);
      const src = h.find((e) => rx.test(e.textContent.trim()));
      const first = h[0];
      return { first: first ? first.getBoundingClientRect().top + scrollY : 800, src: src ? src.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight * 0.8 };
    }, T.sources.source);
    await r.scrollTo(Math.max(0, ys.first - (c.tall ? 90 : 120)), 1.25);
    await r.until(d7.at + d7.dur * 0.74);
    await r.scrollTo(ys.src - (c.tall ? 110 : 90), 1.5);
    await r.until(c.end);
  },

  // Search: Cordoba, and what stands around it.
  async search(r, c) {
    const T = LABELS[c.lang];
    await map(r, c);
    await place(r, r.width * 0.5, r.height * 0.55);
    r.begin(c.dir);
    await r.until(c.at("d8_0") - 0.1);
    await reach(r, "#pm-q", 0.7);
    await r.click();
    await r.until(c.at("d8_1") - 0.3);
    await r.type(T.cordoba, 0.085);
    await r.settle(() => document.querySelectorAll("#pm-results li").length > 0);
    await r.hold(0.3);
    if (c.tall) {
      // At phone size the map's status line lies over the list of results and takes the tap, so the first result is
      // chosen as a phone keyboard does it: Go (the first result is the one already marked).
      await park(r);
      await r.hold(0.35);
      await r.page.keyboard.press("Enter");
    } else {
      await reach(r, r.page.locator("#pm-results li").first(), 0.45);
      await r.click();
    }
    await r.settle(nodesLoaded);
    const d = c.cue("d8_2");
    await r.until(d.at + d.dur * 0.02);
    await reach(r, node(r, T.rushd), 0.65);
    await r.until(d.at + d.dur * 0.3);
    const mosque = node(r, T.mosque);
    if (await mosque.count()) await reach(r, mosque, 0.65);
    await r.until(c.end);
  },

  // History as a web: from Cordoba to a person, to another place, to another person.
  async web(r, c) {
    const T = LABELS[c.lang];
    await map(r, c, { hash: "#p=cordoba" });
    await r.settle(nodesLoaded); await r.hold(0.5);
    await place(r, r.width * 0.55, r.height * 0.82);
    r.begin(c.dir);
    const core = () => r.page.locator(".pm-core b").textContent();
    await r.until(c.at("m1_0") - 0.25);
    await reach(r, node(r, T.rushd), 0.7);
    await r.until(c.at("m1_0") + 0.7);
    await r.click();
    await r.settle(() => document.querySelectorAll(".pm-node .pm-shape.c-place").length > 1);
    await r.until(c.at("m1_1") + 0.1);
    const before = await core();
    const next = r.page.locator(".pm-node:has(.pm-shape.c-place)").nth(1);
    await reach(r, next, 0.75);
    await r.until(c.at("m1_1") + 1.05);
    await r.click();
    await r.settle((b) => { const t = document.querySelector(".pm-core b"); return t && t.textContent !== b && document.querySelectorAll(".pm-node").length > 0; }, before);
    await r.until(c.at("m1_2") + 0.1);
    const who = r.page.locator(".pm-node:has(.pm-shape.c-person)").first();
    if (await who.count()) { await reach(r, who, 0.75); await r.until(c.at("m1_2") + 1.0); const b2 = await core(); await r.click(); await r.settle((b) => document.querySelector(".pm-core b")?.textContent !== b, b2).catch(() => {}); }
    await r.until(c.end);
  },

  // The Explore menu: every explorer and browser the museum has, as the site itself lists them.
  async menu(r, c) {
    await map(r, c, { full: false });
    await place(r, r.width * 0.6, r.height * 0.5);
    r.begin(c.dir);
    const scroller = () => { const d = [...document.querySelectorAll("header details[open]")].pop(); if (!d) return null; return [d, ...d.querySelectorAll("*")].find((e) => e.tagName !== "SUMMARY" && e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)) || null; };
    if (c.tall) {
      await reach(r, "#menu-btn", 0.5); await r.until(c.at("e1_0") + 0.15); await r.click(); await r.hold(0.4);
      const ex = r.page.locator("header details > summary").nth(1);
      await reach(r, ex, 0.45); await r.click(); await r.hold(0.3); await park(r);
    } else {
      await r.moveTo(r.page.locator("header details > summary").nth(1), 0.6);
      await r.until(c.at("e1_0") + 0.15);
      await r.click(); await r.hold(0.35);
      const [x, y] = await r.center(r.page.locator("header details[open] a").nth(3));
      await r.move(x, y, 0.5);
    }
    const max = await r.page.evaluate("(" + scroller.toString() + ")()?.scrollHeight || 0");
    const frames = Math.max(1, Math.round((c.end - r.n / 30) * 30) - 4);
    for (let i = 1; i <= frames; i++) {
      const u = i / frames, e = u * u * (3 - 2 * u);
      await r.page.evaluate(([fn, v, tall]) => { const el = (0, eval)("(" + fn + ")")(); if (el) el.scrollTop = v; else if (tall) window.scrollTo({ top: v, behavior: "instant" }); }, [scroller.toString(), e * (max ? Math.min(max, c.tall ? 2600 : 2200) : 1800), c.tall]);
      await r.frame();
    }
    await r.until(c.end);
  },

  // The Connections explorer: a constellation around one entry; choose a star and make it the centre.
  async graph(r, c) {
    await r.goto(`${SITE}/${c.lang}/graph/?from=person/abu-bakr`, { waitFor: () => document.querySelectorAll(".gx-node").length > 5, settle: 2500 });
    // the site's header stays at the top of the window: put the constellation just under it
    await r.page.evaluate(() => { const s = document.querySelector("main svg"), h = document.querySelector("header.site"); window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - (h ? h.getBoundingClientRect().height : 0) - 10, behavior: "instant" }); });
    await r.hold(0.6);
    await place(r, r.width * 0.78, r.height * 0.8);
    r.begin(c.dir);
    const d = c.cue("e2_0");
    // a star that nothing covers (the card and the header lie over part of the picture)
    const free = (sel) => { for (const g of document.querySelectorAll(sel)) { const b = g.querySelector("circle").getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2, el = document.elementFromPoint(x, y); if (el && g.contains(el)) return [x, y]; } return null; };
    await r.until(d.at + d.dur * 0.3);
    const centre = await r.page.evaluate(free, ".gx-node.hop-0");
    if (centre) await r.move(centre[0], centre[1], 0.8, r.kind === "touch" ? "out" : "inOut");
    await r.until(d.at + d.dur * 0.56);
    if (!c.tall) {
      // Desktop: the stars drift and a resting pointer picks up whichever passes under it, so the new centre is
      // chosen from the list of connections beside the picture, where each has its own "make it the centre".
      const go = r.page.locator('.gx-mini[data-recentre="person/umar-ibn-al-khattab"], .gx-mini[data-recentre^="person/"]').first();
      await r.moveTo(go, 0.9);
      await r.until(d.at + d.dur * 0.8);
      await r.click({ hold: 0 });
      await r.settle(() => document.querySelector(".gx-node.hop-0")?.dataset.id !== "person/abu-bakr").catch(() => {});
    } else {
      // Phone: tap a star, then the button on its card.
      const star = await r.page.evaluate(free, '.gx-node.hop-1[data-id^="person/"]');
      if (star) {
        await r.move(star[0], star[1], 0.7, "out");
        await r.until(d.at + d.dur * 0.72);
        await r.click({ hold: 0 });
        await r.hold(0.35);
        const go = r.page.locator(".gx-card .gx-mini[data-go]").first();
        if (await go.count()) { await reach(r, go, 0.55); await r.until(d.at + d.dur * 0.9); await r.click({ hold: 0 }); }
        await r.settle(() => document.querySelector(".gx-node.hop-0")?.dataset.id !== "person/abu-bakr").catch(() => {});
      }
    }
    await r.until(c.end);
  },

  // The 3D virtual tour: a few steps into the Grand Hall and a look round its gates.
  async tour3d(r, c) {
    await r.goto(`${SITE}/${c.lang}/3d/`);
    await r.page.clock.resume();
    await r.page.locator("main button, main a").filter({ hasText: /Enter the Museum|ادخل المتحف/ }).first().click();
    await r.page.waitForTimeout(7000);
    await r.page.clock.pauseAt((await r.page.evaluate(() => Date.now())) + 100);
    await park(r);
    await r.hold(0.5);
    r.begin(c.dir);
    await r.hold(0.3);
    await r.page.keyboard.down("ArrowUp"); await r.hold(0.9); await r.page.keyboard.up("ArrowUp");
    const cx = r.width / 2, cy = r.height * 0.5, span = c.tall ? 200 : 420, k = Math.round((c.end - r.n / 30 - 0.4) * 30);
    await r.page.mouse.move(cx, cy); await r.page.mouse.down();
    for (let i = 1; i <= k; i++) { const u = i / k, e = u * u * (3 - 2 * u); await r.page.mouse.move(cx - span * e, cy + 6 * Math.sin(u * 3.14)); await r.frame(); }
    await r.page.mouse.up();
    await r.until(c.end);
  },

  // The Grand Tour: the River of Time and its stops.
  async grand(r, c) {
    await r.goto(`${SITE}/${c.lang}/grand-tour/`);
    await place(r, r.width * 0.6, r.height * 0.7);
    r.begin(c.dir);
    const d = c.cue("e4_0");
    await r.until(d.at + d.dur * 0.3);
    const y = await r.page.evaluate(() => { const a = document.querySelector('main a[href*="/grand-tour/"][href$="/kaaba/"] ~ *, main ol, main [class*=river]'); const cards = [...document.querySelectorAll('main a[href*="/grand-tour/"]')].filter((e) => /^\s*\d/.test(e.textContent)); return cards.length ? cards[0].getBoundingClientRect().top + scrollY : 500; });
    await r.scrollTo(Math.max(0, y - (c.tall ? 220 : 190)), 1.1);
    const cards = r.page.locator('main a[href*="/grand-tour/"]').filter({ hasText: /^\s*\d/ });
    if (await cards.count() > 3) { await reach(r, cards.nth(0), 0.5); await r.moveTo?.(cards.nth(c.tall ? 1 : 3), 1.1, {}).catch(() => {}); }
    await r.until(c.end);
  },

  // The Timeline Explorer: one life, stop by stop.
  async tb(r, c) {
    await r.goto(`${SITE}/${c.lang}/time-browser/s/person/ibn-battuta-muhammad/`, { settle: 1800 });
    await place(r, r.width * 0.7, r.height * 0.75);
    r.begin(c.dir);
    const next = r.page.locator("main button, main a").filter({ hasText: /Next event|الحدث التالي|التالي/ }).first();
    if (await next.count()) {
      await r.hold(0.35);
      await reach(r, next, 0.6);
      await r.click(); await r.hold(0.8);
      if (c.end - r.n / 30 > 1.2) { await r.click(); }
    }
    await r.until(c.end);
  },

  // The Mushaf, then the hadith library.
  async quran(r, c) {
    await r.goto(`${SITE}/${c.lang}/words/quran/`);
    await park(r);
    r.begin(c.dir);
    const half = c.end * 0.52;
    const y1 = await r.page.evaluate(() => { const g = document.querySelector('main a[href*="/surah/"], main a[href*="/quran/"]'); return g ? g.getBoundingClientRect().top + scrollY - 150 : 420; });
    await r.scrollTo(Math.max(0, y1), Math.max(0.5, half - 0.15), "out");
    await r.until(half);
    await r.goto(`${SITE}/${c.lang}/words/hadith/`);
    await r.scrollTo(c.tall ? 420 : 330, Math.max(0.5, c.end - half - 0.1), "out");
    await r.until(c.end);
  },

  // The Companions Browser: a generation, year by year.
  async companions(r, c) {
    await r.goto(`${SITE}/${c.lang}/companions/`);
    const y = await r.page.evaluate(() => { const s = [...document.querySelectorAll("main svg")].find((e) => e.getBoundingClientRect().width > 300 && e.querySelectorAll("circle").length > 50); return s ? s.getBoundingClientRect().top + scrollY : 560; });
    await r.page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), Math.max(0, y - (c.tall ? 260 : 150)));
    await r.hold(0.3);
    await place(r, r.width * 0.25, r.height * 0.45);
    r.begin(c.dir);
    if (r.kind !== "touch") await r.move(r.width * 0.72, r.height * 0.42, Math.max(0.8, c.end - 0.3), "inOut");
    await r.until(c.end);
  },

  // The Inventions Browser: the workshop of centuries.
  async inventions(r, c) {
    await r.goto(`${SITE}/${c.lang}/inventions/`);
    const y = await r.page.evaluate(() => { const s = [...document.querySelectorAll("main svg")].find((e) => e.getBoundingClientRect().width > 300 && e.getBoundingClientRect().height > 200); return s ? s.getBoundingClientRect().top + scrollY : 600; });
    await r.page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), Math.max(0, y - (c.tall ? 240 : 110)));
    await r.hold(0.3);
    await place(r, r.width * 0.3, r.height * 0.5);
    r.begin(c.dir);
    if (r.kind !== "touch") await r.move(r.width * 0.7, r.height * 0.56, Math.max(0.8, c.end - 0.3), "inOut");
    await r.until(c.end);
  },

  // The Kids' Wing.
  async kids(r, c) {
    await r.goto(`${SITE}/${c.lang}/sighar/`);
    await park(r);
    r.begin(c.dir);
    await r.hold(0.5);
    await r.scrollTo(c.tall ? 330 : 150, Math.max(0.6, c.end - 0.7), "inOut");
    await r.until(c.end);
  },

  // The close: the whole map again, with the years running.
  async close(r, c) {
    await map(r, c, { panel: false });
    await park(r);
    await r.page.locator(".pm-play").click();
    await park(r);
    r.begin(c.dir);
    await r.until(c.end);
  },
};
