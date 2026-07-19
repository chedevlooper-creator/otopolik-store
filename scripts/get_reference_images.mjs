import { chromium } from "@playwright/test";

const URL = "https://paspasburada.com.tr/online-eva-oto-paspas-olusturucu/";

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Dismiss cookie banner
  const acceptBtn = page.locator('button:has-text("Kabul Et")');
  if (await acceptBtn.count() > 0) {
    await acceptBtn.first().click();
  }
  await page.waitForTimeout(1000);
  
  // Click BMW text
  const bmwBtn = page.locator('text=BMW').filter({ visible: true }).first();
  await bmwBtn.click({ force: true });
  await page.waitForTimeout(2000);
  
  // Extract all model card image sources and alt texts
  const items = await page.evaluate(() => {
    // Find all images within the model cards
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      classes: img.className
    }));
  });
  
  console.log("Found images:", JSON.stringify(items, null, 2));
} catch (err) {
  console.error("Error extracting images:", err.message);
} finally {
  await browser.close();
}
