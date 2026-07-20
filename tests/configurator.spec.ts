import { test, expect } from "@playwright/test";

test.describe("MatConfigurator E2E Flow", () => {
  test("should complete configurator steps, change colors, toggle extras, and add to cart", async ({ page }) => {
    // Go to the configurator page
    await page.goto("/olusturucu");

    // Wait for hydration to complete so React event listeners are attached.
    // Dev-mode routes compile lazily, so give React time to mount before driving inputs.
    await page.waitForTimeout(2500);

    // 1. Open brand selector modal
    const brandButton = page.locator("#configurator-vehicle-brand");
    await expect(brandButton).toBeVisible();
    await brandButton.click();

    // 2. Select BMW in the modal
    const bmwButton = page.locator('button').filter({ hasText: "BMW" }).first();
    await expect(bmwButton).toBeVisible();
    await bmwButton.click();

    // 3. Verify model select button is enabled and click it
    const modelButton = page.locator("#configurator-vehicle-model");
    await expect(modelButton).toBeEnabled();
    await modelButton.click();

    // 4. Select 3 Serisi in the model selector modal
    const modelItem = page.locator('button').filter({ hasText: "3 Serisi" }).first();
    await expect(modelItem).toBeVisible();
    await modelItem.click();

    // 5. Fill year and body details
    const yearInput = page.locator("#configurator-vehicle-year");
    await yearInput.fill("2022");
    await expect(yearInput).toHaveValue("2022");

    const bodyInput = page.locator("#configurator-vehicle-body");
    await bodyInput.fill("G20");
    await expect(bodyInput).toHaveValue("G20");

    // 6. Click a different floor color (e.g., Toprak Kahve)
    const floorPicker = page.locator('[role="radiogroup"][aria-label="Taban Rengi"]');
    await expect(floorPicker).toBeVisible();
    
    // Find the button for Toprak Kahve and click it
    const toprakKahveSwatch = floorPicker.locator('button[aria-label^="Toprak Kahve"]');
    await toprakKahveSwatch.click();

    // 7. Click a different edge color (e.g., Turuncu)
    const edgePicker = page.locator('[role="radiogroup"][aria-label="Kenar (Overlok) Rengi"]');
    await expect(edgePicker).toBeVisible();
    
    const turuncuSwatch = edgePicker.locator('button[aria-label^="Turuncu"]');
    await turuncuSwatch.click();

    // 8. Open the Ekstralar accordion, then toggle the first extra checkbox
    const extrasSummary = page.getByRole("button", { name: /Ekstralar/ });
    await expect(extrasSummary).toBeVisible();
    await extrasSummary.click();

    const topukPediCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(topukPediCheckbox).toBeVisible();
    await expect(topukPediCheckbox).not.toBeChecked();
    
    // Click label or checkbox to toggle
    await page.locator("label").filter({ hasText: "Topuk Pedi" }).click();
    await expect(topukPediCheckbox).toBeChecked();

    // 9. Click "Sepete Ekle" and verify button feedback
    const addToCartBtn = page
      .locator('button:has-text("Sepete Ekle")')
      .filter({ visible: true });
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();

    // Success badge or text swap to "Eklendi" should be visible
    const addedBtn = page.locator('button:has-text("Eklendi")');
    await expect(addedBtn).toBeVisible();
  });

  test("should calculate prices correctly for Yerli/İthal qualities and apply bag discounts", async ({ page }) => {
    await page.goto("/olusturucu");
    await page.waitForTimeout(2500);

    // 1. Complete vehicle selection
    const brandButton = page.locator("#configurator-vehicle-brand");
    await brandButton.click();
    await page.locator('button').filter({ hasText: "BMW" }).first().click();

    const modelButton = page.locator("#configurator-vehicle-model");
    await modelButton.click();
    await page.locator('button').filter({ hasText: "3 Serisi" }).first().click();

    await page.locator("#configurator-vehicle-year").fill("2022");
    await page.locator("#configurator-vehicle-body").fill("G20");

    // 2. Select Yerli Quality
    const yerliBtn = page.locator('button:has-text("Premium Yerli")');
    await expect(yerliBtn).toBeVisible();
    await yerliBtn.click();

    // 3. Open Ekstralar ve Çantalar
    const extrasSummary = page.getByRole("button", { name: /Ekstralar ve Çantalar/ });
    await expect(extrasSummary).toBeVisible();
    await extrasSummary.click();

    // 4. Select a Bag Size (50 cm)
    const bagSelect = page.locator('select').nth(1); // Second select is Bag size
    await expect(bagSelect).toBeVisible();
    await bagSelect.selectOption("50cm");

    // 5. Verify total price (2350 Yerli Base + 1400 discounted Bag = 3750)
    const totalPriceText = page.locator('p:has-text("3.750")').first();
    await expect(totalPriceText).toBeVisible();

    // 6. Select İthal Quality
    const ithalBtn = page.locator('button:has-text("İthal Sınıfı")');
    await expect(ithalBtn).toBeVisible();
    await ithalBtn.click();

    // Verify price without full set discount (3500 İthal Base + 2000 standard Bag = 5500)
    const standardPriceText = page.locator('p:has-text("5.500")').first();
    await expect(standardPriceText).toBeVisible();

    // 7. Toggle Bagaj Paspası (makes it a full İthal set)
    await page.locator('label:has-text("Bagaj Paspası")').click();

    // Verify price with 50% discount (3500 Base + 1750 Trunk Mat + 1000 discounted Bag = 6250)
    const fullSetPriceText = page.locator('p:has-text("6.250")').first();
    await expect(fullSetPriceText).toBeVisible();
  });
});

