// Tiny shared client: any [data-print] button opens the print dialog.
// Dependency-free. Only include on pages that do not already wire
// [data-print] in their own component script (avoid double-binding).
document.querySelectorAll("[data-print]").forEach((b) =>
  b.addEventListener("click", () => window.print()));
