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
  await page.screenshot({ path: file, fullPage: false });
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

    // 2. Product listing
    await goto("/urunler");
    const card = page.locator('a[href^="/urunler/"]').first();
    const href = await card.getAttribute("href");
    await shot("02-urunler");

    // 3. Product detail
    await goto(href);
    await shot("03-product");

    // 4. Fill vehicle fields if this product requires them
    const brand = page.locator("#product-vehicle-brand");
    if (await brand.count()) {
      await brand.selectOption({ index: 1 });
      const model = page.locator("#product-vehicle-model");
      await model.selectOption({ index: 1 });
      await page.fill("#product-vehicle-year", "2022");
      const body = page.locator("#product-vehicle-body");
      if (await body.count()) await body.fill("G20");
      console.log("vehicle: filled");
    }

    // 5. Add to cart, confirm the button flips to "Eklendi"
    const add = page.locator('button:has-text("Sepete Ekle")').first();
    await add.click();
    await page.locator('button:has-text("Eklendi")').first().waitFor();
    console.log("cart: item added (button shows Eklendi)");
    await shot("04-added");

    // 6. Cart page shows the line item
    await goto("/sepet");
    const cartText = await page.locator("main").innerText();
    if (!/₺/.test(cartText)) throw new Error("cart page shows no priced line item");
    console.log("cart: /sepet lists a priced item ✓");
    await shot("05-sepet");

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
