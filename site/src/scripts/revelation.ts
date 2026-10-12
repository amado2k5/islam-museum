// Revelation-order reading, browser side (Part 3, C.6): the order toggle. Rows carry both sequence numbers; CSS `order`
// reads the one the list's data-order names, so switching is a single attribute change. Remembered per viewer.
const list = document.querySelector<HTMLElement>("[data-rv]");
const tools = document.querySelector<HTMLElement>("[data-rv-tools]");
if (list && tools) {
  const set = (o: string) => {
    list.dataset.order = o;
    tools.querySelectorAll<HTMLButtonElement>("[data-order]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.order === o)));
    try { localStorage.setItem("rv-order", o); } catch { /* fine without storage */ }
  };
  tools.querySelectorAll<HTMLButtonElement>("[data-order]").forEach((b) => b.addEventListener("click", () => set(b.dataset.order!)));
  try { const o = localStorage.getItem("rv-order"); if (o === "mushaf") set(o); } catch { /* fine */ }
}
