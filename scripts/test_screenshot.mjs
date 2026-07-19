import { chromium } from "@playwright/test";

const URL = "http://localhost:3000/olusturucu";
const FILE = "/Users/pc/.gemini/antigravity-ide/brain/7537a569-fd03-4018-b66e-8e792c71b6df/shots/modal_inspection.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Click Brand selector button
  const brandBtn = page.locator('#configurator-vehicle-brand');
  await brandBtn.click();
  await page.waitForTimeout(1000);
  
  // Select BMW in the modal
  const bmwBtn = page.locator('button:has-text("BMW")').first();
  await bmwBtn.click();
  await page.waitForTimeout(1000);
  
  // Click Model selector button to open Model modal
  const modelBtn = page.locator('#configurator-vehicle-model');
  await modelBtn.click();
  await page.waitForTimeout(2000);
  
  // Capture screenshot of the modal
  await page.screenshot({ path: FILE });
  console.log("Modal inspection screenshot captured:", FILE);
} catch (err) {
  console.error("Screenshot test failed:", err.message);
} finally {
  await browser.close();
}
