// Remembers the last viewpoint on this device only (localStorage; nothing is sent anywhere). Loaded on the landing page and
// the viewpoint pages only. Every storage access is wrapped: the pages work fully without this script or without storage.
(function () {
  var K = "museum.viewpoint";
  function get() { try { return window.localStorage.getItem(K); } catch (e) { return null; } }
  function set(v) { try { window.localStorage.setItem(K, v); } catch (e) { /* storage blocked: nothing to do */ } }
  function clear() { try { window.localStorage.removeItem(K); } catch (e) { /* ignore */ } }
  var cards = document.querySelector("[data-vp-cards]");
  var page = document.querySelector("[data-viewpoint]");
  var keys = ((cards || page || {}).getAttribute ? (cards || page).getAttribute("data-vp-keys") || "" : "").split(",");
  var statusEl = document.querySelector("[data-vp-status]");
  function nameOf(k) {
    var a = document.querySelector('[data-vp="' + k + '"]');
    return a ? a.getAttribute("data-name") : k;
  }
  function paint() {
    var cur = get();
    if (keys.indexOf(cur) < 0) cur = null;
    var all = document.querySelectorAll("[data-vp]");
    for (var i = 0; i < all.length; i++) {
      var on = cur && all[i].getAttribute("data-vp") === cur && cards;
      all[i].classList.toggle("is-last", !!on);
      if (on) all[i].setAttribute("aria-current", "true"); else all[i].removeAttribute("aria-current");
    }
    if (statusEl) {
      var txt = statusEl.querySelector("[data-vp-text]");
      if (cur && txt) { txt.textContent = (statusEl.getAttribute("data-tpl") || "{name}").replace("{name}", nameOf(cur)); statusEl.hidden = false; }
      else statusEl.hidden = true;
    }
  }
  if (page) set(page.getAttribute("data-viewpoint"));
  var reset = document.querySelectorAll("[data-vp-reset]");
  for (var j = 0; j < reset.length; j++) reset[j].addEventListener("click", function () { clear(); paint(); });
  paint();
})();
