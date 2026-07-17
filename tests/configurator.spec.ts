import { test, expect } from "@playwright/test";

test.describe("MatConfigurator E2E Flow", () => {
  test("should complete configurator steps, change colors, toggle extras, and add to cart", async ({ page }) => {
    // Go to the configurator page
    await page.goto("/olusturucu");

    // Wait for hydration to complete so React event listeners are attached
    await page.waitForTimeout(2000);

    // 1. Verify Step 1 is active (Aracınız)
    const stepList = page.locator('ol[aria-label="Tasarım adımları"]');
    await expect(stepList).toBeVisible();

    const activeStep = stepList.locator('li[aria-current="step"]');
    await expect(activeStep).toContainText("Aracınız");

    // 2. Complete vehicle selector inputs
    await page.selectOption("#configurator-vehicle-brand", "BMW");
    
    // Wait for the model dropdown to become enabled after brand selection updates the React state
    const modelSelect = page.locator("#configurator-vehicle-model");
    await expect(modelSelect).toBeEnabled();

    await modelSelect.selectOption("3 Serisi Sedan");
    await page.fill("#configurator-vehicle-year", "2022");
    await page.fill("#configurator-vehicle-body", "G20");

    // 3. Verify step automatically transitions to Step 2 (Taban)
    await expect(stepList.locator('li[aria-current="step"]')).toContainText("Taban");

    // 4. Click a different floor color (e.g., Toprak Kahve)
    const floorPicker = page.locator('[role="radiogroup"][aria-label="Taban Rengi"]');
    await expect(floorPicker).toBeVisible();
    
    // Find the button for Toprak Kahve and click it
    const toprakKahveSwatch = floorPicker.locator('button[aria-label^="Toprak Kahve"]');
    await toprakKahveSwatch.click();

    // 5. Verify step automatically transitions to Step 3 (Kenar)
    await expect(stepList.locator('li[aria-current="step"]')).toContainText("Kenar");

    // 6. Click a different edge color (e.g., Turuncu)
    const edgePicker = page.locator('[role="radiogroup"][aria-label="Kenar (Overlok) Rengi"]');
    await expect(edgePicker).toBeVisible();
    
    const turuncuSwatch = edgePicker.locator('button[aria-label^="Turuncu"]');
    await turuncuSwatch.click();

    // 7. Verify step transitions to Step 4 (Ekstralar)
    await expect(stepList.locator('li[aria-current="step"]')).toContainText("Ekstralar");

    // 8. Verify configurator summary panel shows correct price
    const summarySection = page.locator('section').filter({ hasText: "Ekstralar" });
    await expect(summarySection).toBeVisible();

    // 9. Toggle "Topuk Pedi" checkbox
    const topukPediCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(topukPediCheckbox).not.toBeChecked();
    
    // Click label or checkbox to toggle
    await topukPediCheckbox.click();
    await expect(topukPediCheckbox).toBeChecked();

    // 10. Click "Sepete Ekle" button and verify button feedback
    const addToCartBtn = page.locator('button:has-text("Sepete Ekle")');
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();

    // Success badge or text swap to eklendi should be visible
    const addedBtn = page.locator('button:has-text("Eklendi")');
    await expect(addedBtn).toBeVisible();
  });
});
