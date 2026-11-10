// Classroom mode: when the URL carries ?classroom=1, add the "classroom" class
// to <html> (bigger type, 64px touch targets, erase controls hidden — see
// kids.css) and unhide the "vote together" banners ([data-vote-banner]).
// Dependency-free; loaded on every kids page via BaseLayout's kids topbar.
const run = (): void => {
  let classroom = false;
  try {
    classroom = new URLSearchParams(window.location.search).get("classroom") === "1";
  } catch {
    classroom = false;
  }
  if (!classroom) return;
  document.documentElement.classList.add("classroom");
  document.querySelectorAll("[data-vote-banner]").forEach((el) => {
    el.removeAttribute("hidden");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}
