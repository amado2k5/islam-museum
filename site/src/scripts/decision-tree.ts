// DecisionTree client: render question → options → next or result, with restart.
{
interface Node { q?: { ar: string; en: string }; result?: { ar: string; en: string }; options?: { label: { ar: string; en: string }; next?: Node; result?: { ar: string; en: string } }[] }
function init(root: HTMLElement) {
  const payload = JSON.parse(root.querySelector("[data-payload]")!.textContent!) as { tree: Node; lang: string; labels: { restart: string } };
  const stage = root.querySelector("[data-stage]")!;
  const L = (x: { ar: string; en: string }) => (payload.lang === "ar" ? x.ar : x.en);
  const render = (node: Node) => {
    stage.innerHTML = "";
    if (node.result) {
      const div = document.createElement("div");
      div.className = "dt-result";
      div.innerHTML = `<p>${L(node.result)}</p><button class="dt-restart">${payload.labels.restart}</button>`;
      div.querySelector("button")!.addEventListener("click", () => render(payload.tree));
      stage.appendChild(div);
      return;
    }
    const q = document.createElement("p"); q.className = "dt-q"; q.textContent = L(node.q!);
    const opts = document.createElement("div"); opts.className = "dt-opts";
    node.options!.forEach((o) => {
      const b = document.createElement("button");
      b.className = "dt-opt"; b.textContent = L(o.label);
      b.addEventListener("click", () => render(o.next ?? { result: o.result }));
      opts.appendChild(b);
    });
    stage.append(q, opts);
  };
  render(payload.tree);
}
document.querySelectorAll("[data-dtree]").forEach((r) => init(r as HTMLElement));
}
