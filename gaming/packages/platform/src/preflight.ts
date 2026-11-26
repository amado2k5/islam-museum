// The device check every game makes before it loads its engine or any large file: is this a place the game can be
// played? Pure rules over plain facts about the device, so that they run and are tested in Node; reading those facts
// from a browser is in probe.ts, and the page shown on a refusal is in gate.ts.
//
// The founder's rule of 26 November 2026 (docs/gaming/hudhud/owner-directive-2026-11-26-production-completion.md,
// section 9): no game starts on a phone, a small screen, an unsupported browser, or a device without the graphics
// it needs; it says so plainly instead, in seven languages, before anything heavy is fetched. The rule is not the
// browser's name alone: what the device can do is tested, and its name only refuses what is known not to work.

export type Reason =
  | "phone" // a phone-class device, whatever width it claims
  | "tablet" // a tablet: none has been tested, so none is allowed yet
  | "screen-small" // the screen itself is under the least size
  | "window-small" // the screen is large enough but the window is not: it can be made larger
  | "browser-old" // a browser the games know, older than they can run on
  | "browser-unknown" // not Chrome, Edge, Firefox or Safari, or a browser inside another app
  | "webgl2" // no WebGL 2
  | "no-acceleration" // WebGL 2 drawn by software: hardware acceleration is off or missing
  | "texture" // the graphics card's largest picture is too small
  | "storage"; // no IndexedDB, where a game must save

export type BrowserName = "chrome" | "edge" | "firefox" | "safari";
export interface Device {
  userAgent: string;
  /** What the browser itself says of "mobile" (User-Agent Client Hints), where it says anything. */
  uaMobile: boolean | null;
  maxTouchPoints: number;
  /** The main pointer is a finger. */
  coarsePointer: boolean;
  /** The whole screen, in CSS pixels. */
  screen: { width: number; height: number };
  /** The page's own area, in CSS pixels. */
  viewport: { width: number; height: number };
  webgl2: boolean;
  /** The renderer's name, where the browser gives it. */
  renderer: string | null;
  maxTextureSize: number;
  indexedDB: boolean;
}
export interface Needs {
  minWidth: number;
  minHeight: number;
  minTexture: number;
  /** The game cannot be played at all without saving. */
  storageRequired: boolean;
  /** Large tablets pass. False until one has been tested on a real device. */
  tablets: boolean;
}
/** The least the directive names for every game. A game may ask for more, never for less. */
export const BASE_NEEDS: Needs = { minWidth: 1280, minHeight: 800, minTexture: 4096, storageRequired: false, tablets: false };

/**
 * The oldest version of each browser the games can run on at all: the floor of what they use (ES modules with
 * top-level await, WebGL 2, pointer events, IndexedDB). This is a floor of features, not the list of what has been
 * tested: that list is support.json, and on 26 November 2026 it holds Chrome 158 on macOS and nothing else.
 */
export const BROWSER_FLOOR: Record<BrowserName, number> = { chrome: 120, edge: 120, firefox: 121, safari: 17 };

export interface Browser {
  name: BrowserName | null;
  major: number | null;
  /** A browser inside another app (a social app's own window, a web view). */
  inApp: boolean;
}
export function browserOf(ua: string): Browser {
  const inApp = /\bFBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|Snapchat|; wv\)|WebView|GSA\//i.test(ua);
  const m = (re: RegExp) => {
    const x = re.exec(ua);
    return x ? Number(x[1]) : null;
  };
  // Order matters: Edge and Chrome both say "Safari", and Edge says "Chrome".
  const edge = m(/\bEdg(?:e|A|iOS)?\/(\d+)/);
  if (edge !== null) return { name: "edge", major: edge, inApp };
  if (/\bOPR\/|\bOpera\b|\bSamsungBrowser\/|\bYaBrowser\/|\bUCBrowser\/|\bVivaldi\//.test(ua)) return { name: null, major: null, inApp };
  const firefox = m(/\b(?:Firefox|FxiOS)\/(\d+)/);
  if (firefox !== null) return { name: "firefox", major: firefox, inApp };
  const chrome = m(/\b(?:Chrome|CriOS)\/(\d+)/);
  if (chrome !== null) return { name: "chrome", major: chrome, inApp };
  const safari = /\bSafari\//.test(ua) ? m(/\bVersion\/(\d+)/) : null;
  if (safari !== null) return { name: "safari", major: safari, inApp };
  return { name: null, major: null, inApp };
}

export type Kind = "phone" | "tablet" | "desktop";
/** What sort of device this is, from several signs at once: a phone that claims a wide page is still a phone. */
export function kindOf(d: Device): Kind {
  const ua = d.userAgent;
  const short = Math.min(d.screen.width, d.screen.height);
  if (d.uaMobile === true || /\biPhone\b|\biPod\b|Windows Phone|\bAndroid\b.*\bMobile\b|\bMobile\b.*\bFirefox\b/.test(ua)) return "phone";
  const touchFirst = d.coarsePointer && d.maxTouchPoints > 0;
  if (touchFirst && short < 600) return "phone";
  // An iPad says it is a Mac; a Mac has no touch screen.
  if (/\biPad\b|\bAndroid\b|\bSilk\//.test(ua) || (/\bMacintosh\b/.test(ua) && d.maxTouchPoints > 1) || touchFirst) return "tablet";
  return "desktop";
}

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;

/** Every reason this device cannot play, most telling first. An empty list means it can. */
export function judge(d: Device, needs: Needs = BASE_NEEDS): Reason[] {
  const out: Reason[] = [];
  const kind = kindOf(d);
  if (kind === "phone") out.push("phone");
  else if (kind === "tablet" && !needs.tablets) out.push("tablet");
  // The screen is measured the way it would be held for play: its longer side across.
  const long = Math.max(d.screen.width, d.screen.height);
  const short = Math.min(d.screen.width, d.screen.height);
  if (kind !== "phone") {
    if (long < needs.minWidth || short < needs.minHeight) out.push("screen-small");
    else if (d.viewport.width < needs.minWidth || d.viewport.height < needs.minHeight) out.push("window-small");
  }
  const b = browserOf(d.userAgent);
  if (b.inApp || b.name === null) out.push("browser-unknown");
  else if (b.major !== null && b.major < BROWSER_FLOOR[b.name]) out.push("browser-old");
  if (!d.webgl2) out.push("webgl2");
  else {
    if (d.renderer !== null && SOFTWARE.test(d.renderer)) out.push("no-acceleration");
    if (d.maxTextureSize < needs.minTexture) out.push("texture");
  }
  if (needs.storageRequired && !d.indexedDB) out.push("storage");
  return out;
}

/**
 * The override for testing, which must never be a way past the check for the public: it is honoured only on a
 * developer's machine or a host whose name begins with "uat-", and only when the address asks for it by name.
 */
export function overrideAllowed(hostname: string, search: string): boolean {
  const local = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname.endsWith(".localhost");
  const uat = /^uat-[a-z0-9-]+\./.test(hostname);
  return (local || uat) && new URLSearchParams(search).get("preflight") === "off";
}

/** Only a window too small can be put right without leaving the page. */
export const canRetry = (reasons: readonly Reason[]): boolean => reasons.length > 0 && reasons.every((r) => r === "window-small");
