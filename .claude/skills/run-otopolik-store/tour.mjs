import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = ".claude/skills/run-otopolik-store/shots";
const routes = [
  ["/", "tour-home"],
  ["/olusturucu", "tour-olusturucu"],
  ["/destek", "tour-destek"],
  ["/odeme", "tour-odeme"],
  ["/tesekkurler", "tour-tesekkurler"],
  ["/arac/fiat-egea-sedan", "tour-arac"],
  ["/boyle-bir-sayfa-yok", "tour-404"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function revealAll() {
  // gradually scroll to bottom so IntersectionObserver reveals fire
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  await page.waitForTimeout(800);
}

for (const [route, name] of routes) {
  const res = await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  try {
    await page.click('button:has-text("KABUL ET")', { timeout: 1200 });
  } catch {}
  await revealAll();
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(name, res.status());
}
await browser.close();
console.log("tour done");
