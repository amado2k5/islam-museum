/* islam.museum IIIF viewer loader — resolves a presentation manifest (v2 or v3)
 * to its first image service and opens it in the vendored OpenSeadragon.
 * Progressive enhancement only: without JS the manifest link and caption stay. */
(function () {
  "use strict";
  if (typeof OpenSeadragon !== "function") return;

  function imageService(m) {
    try {
      var canvases = (m.sequences && m.sequences[0] && m.sequences[0].canvases) || [];
      if (canvases.length) { // IIIF Presentation v2
        var svc = canvases[0].images[0].resource.service;
        return (svc["@id"] || svc.id || "") + "";
      }
      var items = m.items || []; // v3
      var svc3 = (((((items[0] || {}).items || [])[0] || {}).items || [])[0] || {}).body;
      var s = svc3 && svc3.service;
      s = Array.isArray(s) ? s[0] : s;
      return (s && (s.id || s["@id"])) || "";
    } catch (e) {
      return "";
    }
  }

  function open(el, src) {
    el.classList.add("osd-on");
    OpenSeadragon({
      element: el,
      tileSources: src,
      prefixUrl: "/vendor/osd-images/",
      crossOriginPolicy: "Anonymous",
      showRotationControl: false,
      gestureSettingsMouse: { clickToZoom: true },
      gestureSettingsTouch: { pinchToZoom: true },
    });
  }

  document.querySelectorAll("[data-iiif-viewer]").forEach(function (el) {
    var svc = el.getAttribute("data-iiif-service");
    if (svc) return open(el, svc.replace(/\/?$/, "/info.json"));
    var manifest = el.getAttribute("data-iiif-manifest");
    if (!manifest) return;
    fetch(manifest)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (m) {
        var s = imageService(m);
        if (s) open(el, s.replace(/\/?$/, "/info.json"));
      })
      .catch(function () { /* the manifest link below the panel stays */ });
  });
})();
