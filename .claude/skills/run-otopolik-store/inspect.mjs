import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
try { await page.click('button:has-text("KABUL ET")', { timeout: 1200 }); } catch {}

const info = await page.evaluate(() => {
  const faq = document.querySelector(".faq");
  const faqItems = faq ? faq.querySelectorAll("details").length : -1;
  const faqSection = [...document.querySelectorAll("h2")].find(h => h.textContent.includes("Aklına"));
  const cpStage = document.querySelector(".cp-stage img");
  const cpImgs = [...document.querySelectorAll(".cp-stage img")].map(i => ({ src: i.getAttribute("src"), on: i.classList.contains("on"), complete: i.complete, nw: i.naturalWidth }));
  const bentoTiles = [...document.querySelectorAll(".bento .tile")].map(t => {
    const img = t.querySelector("img");
    return { cls: t.className.slice(0, 40), img: img ? { src: img.getAttribute("src"), nw: img.naturalWidth, complete: img.complete } : null, text: t.textContent.trim().slice(0, 50) };
  });
  return { faqItems, hasFaqSection: !!faqSection, cpImgs, bentoTiles };
});
console.log(JSON.stringify(info, null, 1));

// check --red-hot availability outside showroom
await page.goto(BASE + "/boyle-sayfa-yok", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const redHot = await page.evaluate(() => {
  const el = document.createElement("div");
  el.style.color = "var(--red-hot)";
  document.body.appendChild(el);
  const v = getComputedStyle(el).color;
  el.remove();
  return v; // if var undefined, color stays default (canvas text -> rgb(0,0,0)? actually inherits body)
});
console.log("red-hot-on-404 resolves to:", redHot);
await browser.close();
