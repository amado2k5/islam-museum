// The Time wing's year box (audit of 13 November 2026, S27): type a year, Hijri or Common Era, and go to the page of
// the century that holds it (/<lang>/time/all/c<NN>/). Plain script, one file. Without it the century links beside the
// box do the same job. A year outside the centuries the wing has pages for is said at the box, not below the fold.
(function () {
  var forms = document.querySelectorAll("form[data-year-jump]");
  for (var f = 0; f < forms.length; f++) (function (form) {
    var input = form.querySelector('input[name="year"]'), era = form.querySelector('select[name="era"]'), out = form.querySelector("[data-year-msg]");
    var groups = (form.dataset.groups || "").split(" ").filter(Boolean);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var y = parseInt(input.value, 10);
      if (!isFinite(y) || y < 1) { out.textContent = form.dataset.tInvalid; out.hidden = false; input.focus(); return; }
      // Hijri to Common Era, the same approximation the validator uses; a year straddles two, the earlier is taken
      var ce = era && era.value === "ah" ? Math.floor(y * 0.970224 + 621.57) : y;
      var id = "c" + String(Math.floor(ce / 100)).padStart(2, "0");
      if (groups.indexOf(id) < 0) { out.textContent = form.dataset.tNone.replace("{year}", String(ce)); out.hidden = false; return; }
      out.hidden = true;
      location.href = form.dataset.base + id + "/";
    });
  })(forms[f]);
})();
