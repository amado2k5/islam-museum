/* The courses surface's one script (docs/courses-mission/DESIGN.md). A plain file, loaded only by courses pages.
   Everything it does is an addition: every page is complete and every lesson reachable without it.
   State is two localStorage keys in this browser only; nothing is sent anywhere, and there is no account.
     courses:done  {"<course-slug>/<lesson-slug>": "YYYY-MM-DD"}
     courses:last  {"course": slug, "lesson": slug, "title": text, "href": path, "nextHref": path, "nextTitle": text} */
(function () {
  var d = document, root = d.querySelector("[data-cx]");
  if (!root) return;
  var read = function (k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
  var write = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  var done = read("courses:done") || {}, last = read("courses:last");
  var kind = root.getAttribute("data-cx"), course = root.getAttribute("data-cx-course");
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  if (kind === "home") {
    var box = $("[data-cx-resume]");
    if (box && last && last.href && last.href.indexOf("/" + d.documentElement.lang + "/") === 0) {
      // a lesson already done is not where to pick up: offer the one after it
      var goNext = done[last.course + "/" + last.lesson] && last.nextHref;
      $("[data-cx-resume-title]", box).textContent = (goNext ? last.nextTitle : last.title) || "";
      $("[data-cx-resume-link]", box).setAttribute("href", goNext ? last.nextHref : last.href);
      box.hidden = false;
    }
    $$("[data-cx-lessons]").forEach(function (a) {
      var ls = a.getAttribute("data-cx-lessons").split(" "), c = a.getAttribute("data-cx-course"), el = $("[data-cx-count]", a);
      var k = ls.filter(function (s) { return done[c + "/" + s]; }).length;
      if (el && k > 0) { var f = new Intl.NumberFormat(el.getAttribute("data-locale")); el.textContent = el.getAttribute("data-tpl").replace("{done}", f.format(k)).replace("{n}", f.format(ls.length)); el.hidden = false; }
    });
  }

  if (kind === "course") {
    var links = $$("[data-cx-lesson]"), n = 0, next = null;
    links.forEach(function (a) {
      var st = $("[data-cx-state]", a), isDone = !!done[course + "/" + a.getAttribute("data-cx-lesson")];
      if (isDone) { n++; a.classList.add("is-done"); if (st) st.textContent = "✓ " + st.getAttribute("data-done"); }
      else if (!next) next = a;
    });
    if (n > 0 && next) { next.classList.add("is-next"); var s2 = $("[data-cx-state]", next); if (s2) s2.textContent = s2.getAttribute("data-next"); }
    var go = $("[data-cx-continue]");
    if (go && n > 0 && next) { go.setAttribute("href", next.getAttribute("href")); go.firstChild.textContent = go.getAttribute("data-label-next") + " "; }
    var meter = $("[data-cx-meter]"), p = $("[data-cx-progress]");
    if (meter && p) {
      var fmt = new Intl.NumberFormat(p.getAttribute("data-locale"));
      p.textContent = p.getAttribute("data-tpl").replace("{done}", fmt.format(n)).replace("{n}", fmt.format(links.length));
      $("[data-cx-fill]").style.width = (links.length ? Math.round((100 * n) / links.length) : 0) + "%";
      meter.hidden = false;
    }
  }

  if (kind === "lesson") {
    var key = course + "/" + root.getAttribute("data-cx-lesson");
    write("courses:last", { course: course, lesson: root.getAttribute("data-cx-lesson"), title: root.getAttribute("data-cx-title"), href: root.getAttribute("data-cx-href"), nextHref: root.getAttribute("data-cx-next-href"), nextTitle: root.getAttribute("data-cx-next-title") });
    var btn = $("[data-cx-done]"), state = $("[data-cx-donestate]");
    var paint = function () {
      var on = !!done[key];
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = btn.getAttribute(on ? "data-label-undo" : "data-label-do");
      btn.classList.toggle("primary", !on);
      state.textContent = on ? state.getAttribute("data-done") : "";
    };
    if (btn && write("courses:probe", 1)) {
      try { localStorage.removeItem("courses:probe"); } catch (e) {}
      btn.hidden = false; paint();
      btn.addEventListener("click", function () {
        done = read("courses:done") || {};
        if (done[key]) delete done[key]; else done[key] = new Date().toISOString().slice(0, 10);
        write("courses:done", done); paint();
      });
    }
    var rail = function () { $$("a[data-cx-lesson]").forEach(function (a) { a.classList.toggle("is-done", !!done[course + "/" + a.getAttribute("data-cx-lesson")]); }); };
    rail();
    if (btn) btn.addEventListener("click", rail);
    // the steps rail marks the step being read
    var railLinks = $$(".cx-steps a");
    if (railLinks.length && "IntersectionObserver" in window) {
      var mark = function (id) { railLinks.forEach(function (a) { if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); }); };
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); }); }, { rootMargin: "-20% 0px -70% 0px" });
      $$("[data-cx-step]").forEach(function (s) { io.observe(s); });
      mark("goal");
    }
    var pr = $("[data-cx-print]");
    if (pr) { pr.hidden = false; pr.addEventListener("click", function () { window.print(); }); }

    // classroom view: one step at a time, large, driven from the keyboard or the bar
    var steps = $$("[data-cx-step]"), at = 0, html = d.documentElement, pos = $("[data-cx-pres-pos]"), open = $("[data-cx-present]");
    var show = function (i) {
      at = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, k) { s.classList.toggle("is-shown", k === at); });
      if (pos) pos.textContent = (at + 1) + " / " + steps.length;
      var pb = $("[data-cx-pres-prev]"), nb = $("[data-cx-pres-next]");
      if (pb) pb.disabled = at === 0;
      if (nb) nb.disabled = at === steps.length - 1;
      window.scrollTo(0, 0);
    };
    var enter = function () { html.classList.add("cx-present"); show(0); var b = $("[data-cx-pres-next]"); if (b) b.focus(); };
    var leave = function () { html.classList.remove("cx-present"); steps.forEach(function (s) { s.classList.remove("is-shown"); }); if (open) open.focus(); };
    if (open && steps.length) {
      open.hidden = false;
      open.addEventListener("click", enter);
      $("[data-cx-pres-exit]").addEventListener("click", leave);
      $("[data-cx-pres-next]").addEventListener("click", function () { show(at + 1); });
      $("[data-cx-pres-prev]").addEventListener("click", function () { show(at - 1); });
      d.addEventListener("keydown", function (e) {
        if (!html.classList.contains("cx-present")) return;
        var t = e.target && e.target.tagName;
        if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
        var rtl = html.dir === "rtl";
        if (e.key === "Escape") leave();
        else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === (rtl ? "ArrowLeft" : "ArrowRight")) { show(at + 1); e.preventDefault(); }
        else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === (rtl ? "ArrowRight" : "ArrowLeft")) { show(at - 1); e.preventDefault(); }
      });
    }
  }
})();
