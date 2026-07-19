#!/usr/bin/env node
// Agent driver for otopolik-store (Next.js storefront).
// Uses the repo's own @playwright/test chromium install — run from repo root:
//
//   node .claude/skills/run-otopolik-store/driver.mjs smoke          # full shop flow + screenshots
//   node .claude/skills/run-otopolik-store/driver.mjs ss / /urunler  # screenshot routes
//   node .claude/skills/run-otopolik-store/driver.mjs dom /sepet "main"   # dump text of selector
//
// Env: BASE_URL (default http://localhost:3000). Screenshots land in
// .claude/skills/run-otopolik-store/shots/.

import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SHOTS = join(dirname(fileURLToPath(import.meta.url)), "shots");
mkdirSync(SHOTS, { recursive: true });

// Git Bash (MSYS) rewrites "/urunler" args to "C:/Program Files/Git/urunler"
// before node sees them — strip that prefix back off.
const route = (a) => {
  const r = a.replace(/^[A-Za-z]:.*?\/Git\/?/, "/");
  return r.startsWith("/") ? r : `/${r}`;
};
const [, , cmd = "smoke", ...args] = process.argv;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(15_000);

const shot = async (name) => {
  const file = join(SHOTS, `${name}.png`);
  // Scroll down to the bottom of the page to trigger all scroll reveals/lazy loads
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 30);
    });
  });
  // Wait for reveal CSS transitions to complete
  await page.waitForTimeout(1200);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`shot: ${file}`);
};

const goto = async (path) => {
  const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) throw new Error(`GET ${path} -> ${res?.status()}`);
  // Next dev compiles routes lazily; give hydration a beat so listeners attach.
  await page.waitForTimeout(1500);
  console.log(`goto ${path} -> ${res.status()}`);
};

// The cookie-consent banner (ÇEREZ VE GİZLİLİK) overlays the bottom-left and can
// intercept clicks; dismiss it once per session.
const dismissConsent = async () => {
  const accept = page.locator('button:has-text("KABUL ET")');
  if (await accept.count()) await accept.first().click().catch(() => {});
};

try {
  if (cmd === "ss") {
    for (const path of (args.length ? args : ["/"]).map(route)) {
      await goto(path);
      await shot(path.replaceAll("/", "_") || "_root");
    }
  } else if (cmd === "dom") {
    const [path = "/", selector = "body"] = args;
    await goto(route(path));
    console.log(await page.locator(selector).first().innerText());
  } else if (cmd === "smoke") {
    // 1. Home renders
    await goto("/");
    await dismissConsent();
    await shot("01-home");

    // 2. Configurator renders
    await goto("/olusturucu");
    await shot("02-configurator");

    // 3. Fill vehicle fields in configurator
    const brandSelect = page.locator("#configurator-vehicle-brand");
    const modelSelect = page.locator("#configurator-vehicle-model");
    
    // Select brand and wait for model select to enable
    await brandSelect.selectOption("BMW");
    await page.waitForTimeout(500);
    await modelSelect.selectOption("3 Serisi Sedan");
    
    await page.fill("#configurator-vehicle-year", "2022");
    await page.fill("#configurator-vehicle-body", "G20");
    console.log("vehicle: filled");
    await shot("03-vehicle-filled");

    // 4. Add to cart, confirm the button flips to "Eklendi"
    const add = page.locator('button:has-text("Sepete Ekle")').filter({ visible: true }).first();
    await add.click();
    await page.locator('button:has-text("Eklendi")').first().waitFor();
    console.log("cart: item added (button shows Eklendi)");
    await shot("04-added");

    // 5. Checkout page shows the item / price details
    await goto("/odeme");
    const checkoutText = await page.locator("main").innerText();
    if (!/₺/.test(checkoutText)) throw new Error("checkout page shows no price details");
    console.log("checkout: /odeme loaded with item ✓");
    await shot("05-checkout");

    console.log("SMOKE PASS");
  } else {
    throw new Error(`unknown command: ${cmd}`);
  }
} catch (err) {
  await shot("FAIL");
  console.error("DRIVER FAIL:", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
