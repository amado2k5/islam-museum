// Canon-first search (audit of 13 November 2026, S11; index built by scripts/search-canon.ts). When the query names a
// canon record, that record is shown as the first result, above Pagefind's own ranking, which knows nothing of the
// canon. Plain script, one file: nothing here is baked into a page. Without it, search works as before.
(function () {
  var host = document.getElementById("search");
  if (!host) return;
  var lang = host.dataset.lang || document.documentElement.lang || "ar";
  var label = host.dataset.canonLabel || "";
  var SEG = { question: "questions", exhibit: "exhibits" };
  var index = null;
  // copies of normSearch and stripArticle in scripts/search-canon.ts (scripts/search-canon.test.ts keeps them equal)
  var norm = function (t) { return t.normalize("NFKD").replace(/[̀-ًͯ-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").toLowerCase().replace(/['’‘`ʿʾ]/g, "").replace(/[-_()\/,.:«»"]/g, " ").replace(/\s+/g, " ").trim(); };
  var stripArticle = function (k) { return k.split(" ").map(function (w, i) { return i === 0 ? w.replace(/^ال(?=.{3,})/, "") : w; }).join(" ").replace(/^(the|al|an|a) /, ""); };
  var lookup = function (q) { if (!index || !q) return null; var k = norm(q); var i = index.keys[k]; if (i === undefined) i = index.keys[stripArticle(k)]; return i === undefined ? null : index.records[i]; };
  var hrefOf = function (id) { var p = id.split("/"); return "/" + lang + "/" + (SEG[p[0]] || p[0]) + "/" + p[1] + "/"; };
  // Audit S36: between a keystroke (or a ?q= arrival) and the first answer, the page says it is searching.
  var busyEl = document.getElementById("search-busy");
  var answered = function () { var m = host.querySelector(".pagefind-ui__message"); return !!(m && m.textContent && m.textContent.trim()) || !!host.querySelector(".pagefind-ui__result"); };
  var waiting = function (on) { if (busyEl) busyEl.hidden = !on; };
  var waitTimer = 0;
  var startWaiting = function () {
    var input = host.querySelector("input");
    if (!input || !input.value) return waiting(false);
    waiting(true);
    clearInterval(waitTimer);
    var tries = 0;
    waitTimer = setInterval(function () { if (answered() || ++tries > 300) { waiting(false); clearInterval(waitTimer); } }, 100);
  };
  document.addEventListener("input", function (e) { if (e.target && e.target.matches && e.target.matches("#search input")) startWaiting(); });
  if (new URLSearchParams(location.search).get("q")) waiting(true);
  var poll = setInterval(function () { if (host.querySelector("input")) { clearInterval(poll); startWaiting(); } }, 150);
  setTimeout(function () { clearInterval(poll); }, 15000);
  var busy = false;
  var place = function () {
    if (busy || !index) return;
    var input = host.querySelector("input");
    var typed = input ? input.value : "";
    var term = window.imSearchTerm || {};
    var hit = typed ? (lookup(typed) || (term.raw === typed ? lookup(term.processed) : null)) : null;
    var old = host.querySelector(".im-canon");
    var area = host.querySelector(".pagefind-ui__results-area");
    busy = true;
    try {
      if (!hit || !area) { if (old) old.remove(); return; }
      var url = hrefOf(hit.id);
      var list = area.querySelector(".pagefind-ui__results");
      if (!list) { list = document.createElement("ol"); list.className = "pagefind-ui__results im-canon-list"; area.appendChild(list); }
      if (!old || old.dataset.id !== hit.id || old.parentNode !== list || list.firstElementChild !== old) {
        if (old) old.remove();
        var li = document.createElement("li");
        li.className = "pagefind-ui__result im-canon";
        li.dataset.id = hit.id;
        var inner = document.createElement("div"); inner.className = "pagefind-ui__result-inner";
        var title = document.createElement("p"); title.className = "pagefind-ui__result-title";
        var a = document.createElement("a"); a.className = "pagefind-ui__result-link"; a.href = url; a.textContent = hit.title;
        title.appendChild(a);
        if (label) { var tag = document.createElement("span"); tag.className = "chip ui"; tag.style.cssText = "margin-inline-start:8px;font-size:.75rem;border:1px solid var(--gold)"; tag.textContent = label; title.appendChild(tag); }
        inner.appendChild(title);
        if (hit.summary) { var ex = document.createElement("p"); ex.className = "pagefind-ui__result-excerpt"; ex.textContent = hit.summary; inner.appendChild(ex); }
        li.appendChild(inner);
        list.insertBefore(li, list.firstChild);
      }
      // the same page further down Pagefind's own list is not shown twice
      var links = list.querySelectorAll(".pagefind-ui__result:not(.im-canon) > .pagefind-ui__result-inner > .pagefind-ui__result-title > .pagefind-ui__result-link");
      for (var i = 0; i < links.length; i++) { var row = links[i].closest(".pagefind-ui__result"); if (row) row.hidden = new URL(links[i].href, location.href).pathname === url; }
    } finally { busy = false; }
  };
  fetch("/api/v1/meta/search-canon." + lang + ".json").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j || !j.keys || !j.records) return;
    index = j;
    new MutationObserver(place).observe(host, { childList: true, subtree: true });
    document.addEventListener("im-search-term", function () { setTimeout(place, 0); });
    document.addEventListener("input", function (e) { if (e.target && e.target.matches && e.target.matches("#search input")) setTimeout(place, 0); });
    place();
  }).catch(function () { /* the canon card is an addition: search itself is unaffected */ });
})();
