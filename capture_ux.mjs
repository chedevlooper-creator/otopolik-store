import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 1024 } });
  const page = await context.newPage();

  // 1. Configurator Preview & Material Tech
  await page.goto("http://localhost:3000/olusturucu", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  // Scroll down slightly to ensure the Material Tech card is visible
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/Users/pc/.gemini/antigravity-ide/brain/44213991-d0b8-41f1-a954-57c0be27e313/configurator_new_ux.png" });

  // 2. Checkout UI (City dropdown, District, Badges)
  // First, add an item to cart so checkout is available
  await page.goto("http://localhost:3000/olusturucu", { waitUntil: "networkidle" });
  // Fill required fields
  await page.locator('#configurator-vehicle-brand').click();
  await page.locator('text="BMW"').click();
  await page.waitForTimeout(500);
  await page.locator('#configurator-vehicle-model').click();
  await page.locator('text="3 Serisi"').click();
  await page.waitForTimeout(500);
  await page.locator('text="F30 Sedan /"').click();
  await page.locator('#configurator-vehicle-year').fill('2018');
  await page.waitForTimeout(500);
  
  // Click add to cart
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.textContent.includes('Sepete Ekle'));
    if (addBtn) addBtn.click();
  });
  await page.waitForTimeout(1000);

  // Navigate to checkout
  await page.goto("http://localhost:3000/odeme", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  
  // Fill the city to trigger change
  await page.selectOption('select#checkout-city', 'İstanbul');
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/Users/pc/.gemini/antigravity-ide/brain/44213991-d0b8-41f1-a954-57c0be27e313/checkout_new_ux.png" });

  await browser.close();
}

run().catch(console.error);
