// Whole-list filter for the paginated browsers (audit of 13 November 2026, S18 and S36; site/src/lib/paged.ts).
// A browser's page shows one page of rows and its own filter script hides the rows that do not match. This adds the
// matches from every other page: on the first keystroke it fetches the browser's index (every row: path, label,
// text), says that it is searching, and lists the matches as links under the box. A failure is said at the box.
(function () {
  var norm = function (s) { return s.normalize("NFKC").replace(/[ً-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase().replace(/\s+/g, " ").trim(); };
  var MAX = 60;
  var boxes = document.querySelectorAll("[data-full-filter]");
  for (var b = 0; b < boxes.length; b++) (function (box) {
    var holder = box.previousElementSibling;
    var input = holder && holder.querySelector ? holder.querySelector('input[type="search"]') : null;
    if (!input) return;
    var rows = null, loading = null, timer = 0;
    var say = function (text) { box.textContent = ""; var p = document.createElement("p"); p.style.margin = "0"; p.textContent = text; box.appendChild(p); box.hidden = false; };
    var load = function () {
      if (!loading) loading = fetch(box.dataset.fullFilter).then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
        .then(function (j) { rows = j.rows.map(function (r) { return { path: r[0], label: r[1], text: r[2], key: norm(r[1] + " " + r[2]) }; }); });
      return loading;
    };
    var show = function () {
      var q = norm(input.value);
      if (q.length < 2) { box.hidden = true; box.textContent = ""; return; }
      if (!rows) { say(box.dataset.tLoading); load().then(show, function () { loading = null; say(box.dataset.tFailed); }); return; }
      var hits = [];
      for (var i = 0; i < rows.length; i++) if (rows[i].key.indexOf(q) >= 0) hits.push(rows[i]);
      box.textContent = "";
      var head = document.createElement("p"); head.style.cssText = "margin:0 0 .5rem;font-weight:600";
      head.textContent = box.dataset.tMatches.replace("{n}", String(hits.length)); box.appendChild(head);
      var ol = document.createElement("ol"); ol.setAttribute("role", "list"); ol.style.cssText = "list-style:none;margin:0;padding:0;display:grid;gap:6px";
      for (var k = 0; k < hits.length && k < MAX; k++) {
        var li = document.createElement("li"), a = document.createElement("a");
        a.href = box.dataset.base + hits[k].path; a.textContent = hits[k].label; a.style.fontWeight = "600"; li.appendChild(a);
        if (hits[k].text) { var sp = document.createElement("span"); sp.className = "muted"; sp.dir = "auto"; sp.style.cssText = "display:block;font-size:.88rem"; sp.textContent = hits[k].text; li.appendChild(sp); }
        ol.appendChild(li);
      }
      box.appendChild(ol);
      if (hits.length > MAX) { var more = document.createElement("p"); more.className = "muted"; more.style.margin = ".5rem 0 0"; more.textContent = box.dataset.tMore.replace("{n}", String(MAX)); box.appendChild(more); }
      box.hidden = false;
    };
    input.addEventListener("input", function () {
      clearTimeout(timer);
      // say at once that the whole list is being searched; the index arrives a moment later
      if (!rows && norm(input.value).length >= 2) say(box.dataset.tLoading);
      timer = setTimeout(show, 180);
    });
    if (input.value) show();
  })(boxes[b]);
})();
