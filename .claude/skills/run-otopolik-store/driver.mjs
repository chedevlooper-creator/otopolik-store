#!/usr/bin/env node
// Playwright driver for the OTO POLİK storefront.
// Usage (from this directory, after `npm install`):
//   node driver.mjs smoke                     # visit key pages, screenshot, fail on page errors
//   node driver.mjs shot /olusturucu          # single screenshot of a route
//   node driver.mjs shot / --width 390 --height 844 --out mobile.png
// Env: SITE_URL (default http://localhost:3000)

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.SITE_URL ?? "http://localhost:3000";
const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, "screenshots");
mkdirSync(SHOTS, { recursive: true });

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) args[argv[i].slice(2)] = argv[++i];
    else args._.push(argv[i]);
  }
  return args;
}

async function newPage(browser, { width = 1440, height = 900 } = {}) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console.error] ${msg.text()}`);
  });
  return { context, page, errors };
}

async function dismissCookieBanner(page) {
  const kabul = page.locator('button:has-text("KABUL ET")');
  if (await kabul.count()) {
    await kabul.click();
    await page.waitForTimeout(300);
  }
}

async function smoke(browser) {
  const allErrors = [];
  const routes = ["/", "/urunler", "/olusturucu", "/sepet"];

  const { context, page, errors } = await newPage(browser);
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: join(SHOTS, `smoke-${name}.png`) });
    console.log(`ok  ${route}  → screenshots/smoke-${name}.png`);
  }
  await context.close();
  allErrors.push(...errors);

  // Mobil görünüm — hero + header regresyonlarını yakalar
  const mobile = await newPage(browser, { width: 390, height: 844 });
  await mobile.page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await mobile.page.waitForTimeout(500);
  await mobile.page.screenshot({ path: join(SHOTS, "smoke-home-mobile.png") });
  console.log("ok  / (390px)  → screenshots/smoke-home-mobile.png");
  await mobile.context.close();
  allErrors.push(...mobile.errors);

  if (allErrors.length) {
    console.error("\nPAGE ERRORS:\n" + allErrors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("\nno console/page errors");
  }
}

async function shot(browser, args) {
  const route = args._[1] ?? "/";
  const width = Number(args.width ?? 1440);
  const height = Number(args.height ?? 900);
  const out = args.out
    ? resolve(args.out)
    : join(SHOTS, `shot-${route.replaceAll("/", "-") || "home"}-${width}w.png`);

  const { context, page, errors } = await newPage(browser, { width, height });
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
  await dismissCookieBanner(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: out, fullPage: args.full === "true" });
  await context.close();
  console.log(out);
  if (errors.length) {
    console.error("PAGE ERRORS:\n" + errors.join("\n"));
    process.exitCode = 1;
  }
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] ?? "smoke";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
try {
  if (cmd === "smoke") await smoke(browser);
  else if (cmd === "shot") await shot(browser, args);
  else {
    console.error(`unknown command: ${cmd} (use: smoke | shot)`);
    process.exitCode = 2;
  }
} finally {
  await browser.close();
}
