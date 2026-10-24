// Share cards (docs/delegation/education-master-plan.md E1): a 1080x1080 PNG drawn on the visitor's device with
// the canvas API, offered through the Web Share API where the browser has it and as a download otherwise, plus
// a plain text line for chat apps. Nothing is sent anywhere; there is no fetch and no server.
export interface ShareOpts {
  title: string;      // the big line (band or deck name)
  line: string;       // the result line ("3 of 11 stamps")
  icons?: string[];   // up to 8 emoji drawn as a row
  text: string;       // the text card for chat apps
  url: string;        // written in the footer
  rtl: boolean;
  fileName: string;
}

const W = 1080;

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const probe = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(probe).width > max && cur) { lines.push(cur); cur = w; } else cur = probe;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function drawCard(o: ShareOpts): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W; c.height = W;
  const ctx = c.getContext("2d")!;
  const family = getComputedStyle(document.body).fontFamily || "serif";
  const g = ctx.createLinearGradient(0, 0, W, W);
  g.addColorStop(0, "#0a2533"); g.addColorStop(1, "#113f4e");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
  // gold ring and an eight-point star, the museum's emblem geometry
  ctx.strokeStyle = "#c5a059"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(W / 2, 250, 118, 0, Math.PI * 2); ctx.stroke();
  ctx.save(); ctx.translate(W / 2, 250); ctx.lineWidth = 3;
  for (const r of [0, Math.PI / 4]) { ctx.save(); ctx.rotate(r); ctx.strokeRect(-62, -62, 124, 124); ctx.restore(); }
  ctx.restore();
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#f9f8f6";
  ctx.direction = o.rtl ? "rtl" : "ltr";
  ctx.font = `bold 60px ${family}`;
  const lines = wrap(ctx, o.title, 900);
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 450 + i * 78));
  const y0 = 450 + lines.length * 78 + 40;
  ctx.fillStyle = "#c5a059"; ctx.font = `bold 92px ${family}`;
  ctx.fillText(o.line, W / 2, y0 + 40);
  if (o.icons?.length) {
    ctx.font = `72px ${family}`; ctx.fillStyle = "#f9f8f6";
    const row = o.icons.slice(0, 8).join("  ");
    ctx.fillText(row, W / 2, y0 + 170);
  }
  ctx.fillStyle = "#e6d5b8"; ctx.font = `40px ${family}`; ctx.direction = "ltr";
  ctx.fillText(o.url, W / 2, W - 90);
  return c;
}

export function toBlob(c: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob"))), "image/png"));
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export async function shareCard(o: ShareOpts): Promise<"shared" | "downloaded"> {
  const blob = await toBlob(drawCard(o));
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  try {
    const file = new File([blob], o.fileName, { type: "image/png" });
    if (nav.share && nav.canShare?.({ files: [file] })) { await nav.share({ files: [file], text: o.text, title: o.title }); return "shared"; }
  } catch { /* the visitor cancelled, or sharing files is not supported: fall through to the download */ }
  download(blob, o.fileName);
  return "downloaded";
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* no clipboard permission */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch { return false; }
}

export interface ShareStrings { image: string; copy: string; copied: string; note: string }

/** Fill a [data-share-box] with the text card, a preview of the image and the two buttons. */
export function mountShareBox(box: HTMLElement, o: ShareOpts, t: ShareStrings) {
  box.innerHTML = "";
  box.hidden = false;
  const pre = document.createElement("pre"); pre.textContent = o.text; box.appendChild(pre);
  const img = document.createElement("img"); img.alt = o.title; img.src = drawCard(o).toDataURL("image/png"); box.appendChild(img);
  const row = document.createElement("div"); row.className = "passport-actions";
  const b1 = document.createElement("button"); b1.type = "button"; b1.className = "btn btn-lapis"; b1.textContent = t.image;
  b1.addEventListener("click", () => { shareCard(o); });
  const b2 = document.createElement("button"); b2.type = "button"; b2.className = "btn btn-outline"; b2.textContent = t.copy;
  const msg = document.createElement("span"); msg.setAttribute("role", "status");
  b2.addEventListener("click", async () => { msg.textContent = (await copyText(o.text)) ? t.copied : ""; });
  row.append(b1, b2, msg); box.appendChild(row);
  const note = document.createElement("p"); note.className = "muted"; note.style.fontSize = ".85rem"; note.textContent = t.note; box.appendChild(note);
}
