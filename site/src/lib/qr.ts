// QR codes for printables, rendered at build time as inline SVG (no client script, no image request).
// Uses qrcode-generator (MIT) in the build only; the page carries a few hundred bytes of path data.
import qrcode from "qrcode-generator";

export function qrSvg(text: string, size = 112, label = ""): string {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 2;
  const side = n + quiet * 2;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
  const a11y = label ? ` role="img" aria-label="${label.replace(/"/g, "&quot;")}"` : ` aria-hidden="true"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" width="${size}" height="${size}" shape-rendering="crispEdges"${a11y}><rect width="${side}" height="${side}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}
