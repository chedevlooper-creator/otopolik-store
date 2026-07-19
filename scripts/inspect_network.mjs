import { chromium } from "@playwright/test";

const URL = "https://paspasburada.com.tr/online-eva-oto-paspas-olusturucu/";

const browser = await chromium.launch();
const page = await browser.newPage();

// Monitor network requests
page.on("request", (req) => {
  const url = req.url();
  if (url.includes("api") || url.includes(".json") || url.includes("vehicle") || url.includes("model")) {
    console.log("Request:", url);
  }
});

try {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  // Click BMW to trigger model loading
  const acceptBtn = page.locator('button:has-text("Kabul Et")');
  if (await acceptBtn.count() > 0) {
    await acceptBtn.first().click();
  }
  await page.waitForTimeout(500);
  
  console.log("Clicking BMW brand card...");
  const bmwBtn = page.locator('text=BMW').filter({ visible: true }).first();
  await bmwBtn.click({ force: true });
  await page.waitForTimeout(3000);
} catch (err) {
  console.error("Network inspection failed:", err.message);
} finally {
  await browser.close();
}
