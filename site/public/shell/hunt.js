// The treasure hunt: checks an answer, opens the next riddle and keeps progress on this device only (localStorage; nothing is
// sent anywhere). Loaded by /<lang>/hunt/ only. Without it every riddle stays open and its answer is under "Show the answer".
(function () {
  var root = document.querySelector("[data-hunt]");
  if (!root) return;
  var K = "museum.hunt", items = [].slice.call(root.querySelectorAll("[data-clue]")), chest = root.querySelector("[data-chest]");
  var bar = root.querySelector("[data-bar]"), prog = root.querySelector("[data-prog]"), found = 0;
  try { found = Math.max(0, Math.min(items.length, parseInt(window.localStorage.getItem(K), 10) || 0)); } catch (e) { /* storage blocked */ }
  function save() { try { window.localStorage.setItem(K, String(found)); } catch (e) { /* storage blocked */ } }
  function fold(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/[ىیئ]/g, "ي").replace(/[کﻙ]/g, "ك")
      .replace(/[ةۃہ]/g, "ه").replace(/ı/g, "i").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  }
  // one letter wrong, missing or extra is forgiven in a word of five letters or more
  function near(a, b) {
    if (a === b) return true;
    if (b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = a.length, k = b.length;
    while (i < j && i < k && a[i] === b[i]) i++;
    while (j > i && k > i && a[j - 1] === b[k - 1]) { j--; k--; }
    return j - i <= 1 && k - i <= 1;
  }
  function ok(text, keys) {
    var words = fold(text).split(" ");
    words.push(words.join(""));
    return keys.some(function (k) { var f = fold(k); return words.some(function (w) { return near(w, f); }); });
  }
  function paint() {
    items.forEach(function (li, i) {
      var st = i < found ? "done" : i === found ? "open" : "lock";
      li.setAttribute("data-state", st);
      li.querySelector("[data-body]").hidden = st === "lock";
      li.querySelector("[data-lock]").hidden = st !== "lock";
      li.querySelector("[data-form]").hidden = st !== "open";
      li.querySelector("[data-reveal]").hidden = st !== "open";
      li.querySelector("[data-found]").hidden = st !== "done";
    });
    prog.textContent = prog.getAttribute("data-tpl").replace("{n}", new Intl.NumberFormat(prog.getAttribute("data-loc")).format(found));
    [].forEach.call(bar.children, function (s, i) { s.classList.toggle("on", i < found); });
    chest.setAttribute("data-state", found === items.length ? "done" : "lock");
    chest.querySelector("[data-secret]").hidden = found !== items.length;
    chest.querySelector("[data-wait]").hidden = found === items.length;
  }
  items.forEach(function (li, i) {
    var form = li.querySelector("form"), input = li.querySelector("input"), msg = li.querySelector("[data-msg]"), det = li.querySelector("details");
    input.addEventListener("input", function () { input.removeAttribute("aria-invalid"); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ok(input.value, JSON.parse(li.getAttribute("data-keys")))) { input.setAttribute("aria-invalid", "true"); msg.textContent = msg.getAttribute("data-wrong"); input.focus(); return; }
      found = i + 1; save(); msg.textContent = ""; paint();
      var f = li.querySelector("[data-found]"); f.setAttribute("tabindex", "-1"); f.focus();
    });
    det.addEventListener("toggle", function () { if (det.open && i === found) { found = i + 1; save(); paint(); var f = li.querySelector("[data-found]"); f.setAttribute("tabindex", "-1"); f.focus(); } });
  });
  root.querySelector("[data-reset]").addEventListener("click", function () {
    found = 0; save();
    items.forEach(function (li) { li.querySelector("input").value = ""; li.querySelector("details").open = false; li.querySelector("[data-msg]").textContent = ""; });
    paint(); items[0].querySelector("input").focus();
  });
  root.querySelector("[data-tools]").hidden = false;
  paint();
})();
