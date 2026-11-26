// The device check as rules: what may play and what is told that it may not, and why.
import { describe, expect, it } from "vitest";
import { BASE_NEEDS, browserOf, canRetry, judge, kindOf, overrideAllowed, type Device } from "../src/preflight";

const UA = {
  chromeMac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36",
  edgeWin: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36 Edg/158.0.0.0",
  firefoxWin: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
  safariMac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1",
  androidPhone: "Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Mobile Safari/537.36",
  androidTablet: "Mozilla/5.0 (Linux; Android 16; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36",
  instagram: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15 Instagram 300.0",
  opera: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36 OPR/120.0.0.0",
  oldChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
};
const desktop = (over: Partial<Device> = {}): Device => ({ userAgent: UA.chromeMac, uaMobile: false, maxTouchPoints: 0, coarsePointer: false, screen: { width: 1920, height: 1080 }, viewport: { width: 1920, height: 960 }, webgl2: true, renderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)", maxTextureSize: 16384, indexedDB: true, ...over });

describe("the device check", () => {
  it("lets a desktop or laptop with a large enough window, a known browser and real graphics play", () => {
    expect(judge(desktop())).toEqual([]);
    for (const ua of [UA.edgeWin, UA.firefoxWin, UA.safariMac]) expect(judge(desktop({ userAgent: ua, uaMobile: null })), ua).toEqual([]);
    expect(judge(desktop({ screen: { width: 1280, height: 800 }, viewport: { width: 1280, height: 800 } }))).toEqual([]);
  });
  it("refuses a phone, also one that claims a wide page or is held sideways", () => {
    const phone = desktop({ userAgent: UA.iphone, uaMobile: null, maxTouchPoints: 5, coarsePointer: true, screen: { width: 430, height: 932 }, viewport: { width: 430, height: 800 } });
    expect(judge(phone)).toContain("phone");
    expect(judge({ ...phone, screen: { width: 932, height: 430 }, viewport: { width: 932, height: 430 } })).toContain("phone");
    // "Request desktop site" on a phone: a desktop's name, a wide page, a phone's screen and finger.
    expect(judge(desktop({ maxTouchPoints: 5, coarsePointer: true, screen: { width: 412, height: 915 }, viewport: { width: 1280, height: 2840 } }))).toContain("phone");
    expect(judge(desktop({ userAgent: UA.androidPhone, uaMobile: true, maxTouchPoints: 5, coarsePointer: true, screen: { width: 1280, height: 2856 }, viewport: { width: 1280, height: 2700 } }))).toContain("phone");
    expect(judge(phone)).not.toContain("screen-small");
  });
  it("refuses a tablet until one has been tested, and lets a game that has tested one allow it", () => {
    const ipad = desktop({ userAgent: UA.safariMac, uaMobile: null, maxTouchPoints: 5, coarsePointer: true, screen: { width: 1366, height: 1024 }, viewport: { width: 1366, height: 950 } });
    expect(kindOf(ipad)).toBe("tablet");
    expect(judge(ipad)).toEqual(["tablet"]);
    expect(judge(ipad, { ...BASE_NEEDS, tablets: true })).toEqual([]);
    expect(judge(desktop({ userAgent: UA.androidTablet, maxTouchPoints: 10, coarsePointer: true, screen: { width: 1600, height: 1000 }, viewport: { width: 1600, height: 900 } }))).toEqual(["tablet"]);
    // A laptop with a touch screen and a mouse is a laptop.
    expect(kindOf(desktop({ userAgent: UA.edgeWin, maxTouchPoints: 10, coarsePointer: false }))).toBe("desktop");
  });
  it("tells a screen that is too small from a window that can be made larger", () => {
    expect(judge(desktop({ screen: { width: 1366, height: 768 }, viewport: { width: 1366, height: 650 } }))).toEqual(["screen-small"]);
    const small = judge(desktop({ viewport: { width: 1100, height: 700 } }));
    expect(small).toEqual(["window-small"]);
    expect(canRetry(small)).toBe(true);
    expect(judge(desktop({ viewport: { width: 1440, height: 780 } }))).toEqual(["window-small"]);
    expect(canRetry(["window-small", "webgl2"])).toBe(false);
    expect(canRetry([])).toBe(false);
  });
  it("refuses a browser inside another app, a browser it does not know and one too old; a name alone refuses nothing else", () => {
    expect(judge(desktop({ userAgent: UA.instagram }))).toEqual(["browser-unknown"]);
    expect(judge(desktop({ userAgent: UA.opera }))).toEqual(["browser-unknown"]);
    expect(judge(desktop({ userAgent: "SomethingElse/1.0" }))).toEqual(["browser-unknown"]);
    expect(judge(desktop({ userAgent: UA.oldChrome }))).toEqual(["browser-old"]);
    expect(browserOf(UA.edgeWin)).toEqual({ name: "edge", major: 158, inApp: false });
    expect(browserOf(UA.safariMac)).toEqual({ name: "safari", major: 19, inApp: false });
    expect(browserOf(UA.firefoxWin).name).toBe("firefox");
  });
  it("refuses a device without WebGL 2, with graphics drawn by software, or with too small a largest picture", () => {
    expect(judge(desktop({ webgl2: false }))).toEqual(["webgl2"]);
    expect(judge(desktop({ renderer: "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)" }))).toEqual(["no-acceleration"]);
    expect(judge(desktop({ renderer: "llvmpipe (LLVM 17.0.6, 256 bits)" }))).toEqual(["no-acceleration"]);
    expect(judge(desktop({ maxTextureSize: 2048 }))).toEqual(["texture"]);
    // A browser that will not name its renderer is not refused for that.
    expect(judge(desktop({ renderer: null }))).toEqual([]);
  });
  it("asks for storage only of a game that cannot be played without saving", () => {
    expect(judge(desktop({ indexedDB: false }))).toEqual([]);
    expect(judge(desktop({ indexedDB: false }), { ...BASE_NEEDS, storageRequired: true })).toEqual(["storage"]);
  });
  it("gives every reason at once, so that a player is not sent round twice", () => {
    expect(judge(desktop({ userAgent: UA.oldChrome, viewport: { width: 900, height: 600 }, webgl2: false }))).toEqual(["window-small", "browser-old", "webgl2"]);
  });
  it("honours the testing override on a developer's machine and on UAT, and nowhere else", () => {
    expect(overrideAllowed("127.0.0.1", "?preflight=off")).toBe(true);
    expect(overrideAllowed("localhost", "?lang=ar&preflight=off")).toBe(true);
    expect(overrideAllowed("uat-games.islam.museum", "?preflight=off")).toBe(true);
    expect(overrideAllowed("games.islam.museum", "?preflight=off")).toBe(false);
    expect(overrideAllowed("islam.museum", "?preflight=off")).toBe(false);
    expect(overrideAllowed("uat-games.islam.museum", "?preflight=on")).toBe(false);
    expect(overrideAllowed("uat-games.islam.museum", "")).toBe(false);
    expect(overrideAllowed("evil.example", "?preflight=off")).toBe(false);
  });
});
