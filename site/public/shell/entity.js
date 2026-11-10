// Entity pages: the reading-progress rule and the "more opinions" disclosure. A plain file loaded by EntityLayout.astro
// from /shell/entity.js, so an edit here is one upload, not a rewrite of every entity page
// (docs/engineering/16-deploy-churn-proposal.md).

// Reading progress: a gold rule across the top, grown by scroll (inner-pages spec §4C). Nothing shows without scrolling room.
(function () {
  var bar = document.querySelector(".reading-progress"); if (!bar) return;
  var fill = bar.firstElementChild, ticking = false;
  var set = function () {
    ticking = false;
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
    bar.style.setProperty("--p", p.toFixed(4));
  };
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(set); } }, { passive: true });
  set();
})();

// Deep depth opens the "more opinions" list; without JS the native disclosure still works.
(function () {
  var art = document.getElementById("entity-article"), more = document.getElementById("more-opinions"); if (!art || !more) return;
  var sync = function () { if (art.dataset.depth === "deep") more.open = true; };
  sync();
  new MutationObserver(sync).observe(art, { attributes: true, attributeFilter: ["data-depth"] });
})();
