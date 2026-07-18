import { test, expect } from "@playwright/test";

test.describe("MatConfigurator E2E Flow", () => {
  test("should complete configurator steps, change colors, toggle extras, and add to cart", async ({ page }) => {
    // Go to the configurator page
    await page.goto("/olusturucu");

    // Wait for hydration to complete so React event listeners are attached.
    // Dev-mode routes compile lazily, so give React time to mount before driving inputs.
    await page.waitForTimeout(2500);

    // 1. Verify Step 1 is active (Araç)
    const stepList = page.locator('ol[aria-label="Tasarım adımları"]');
    await expect(stepList).toBeVisible();

    const activeStep = stepList.locator('li[aria-current="step"]');
    await expect(activeStep).toContainText("Araç");

    // 2. Complete vehicle selector inputs.
    // The brand <select> is controlled by React state; if selectOption fires
    // before hydration attaches onChange, the native DOM value updates but
    // React never sees it, so value.brand stays "" and the model select stays
    // disabled. selectOption + toHaveValue only proves the DOM changed, not
    // that React handled it. The model select's enabled state is derived from
    // React state (disabled={!value.brand}), so retry the brand selection
    // until the model dropdown actually becomes enabled.
    const brandSelect = page.locator("#configurator-vehicle-brand");
    const modelSelect = page.locator("#configurator-vehicle-model");
    await expect(async () => {
      await brandSelect.selectOption("BMW");
      await expect(modelSelect).toBeEnabled({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    // Fill the remaining fields and assert each value stuck in React state so
    // vehicleComplete can flip true (guards against hydration/render races).
    await modelSelect.selectOption("3 Serisi Sedan");
    await expect(modelSelect).toHaveValue("3 Serisi Sedan");

    const yearInput = page.locator("#configurator-vehicle-year");
    await yearInput.fill("2022");
    await expect(yearInput).toHaveValue("2022");

    const bodyInput = page.locator("#configurator-vehicle-body");
    await bodyInput.fill("G20");
    await expect(bodyInput).toHaveValue("G20");

    // 3. Verify step automatically transitions to Step 2 (Renkler) — floor
    //    and edge colors are now selected together in one merged step.
    //    currentStep is derived from React state, so give it room to settle.
    await expect(stepList.locator('li[aria-current="step"]')).toContainText(
      "Renkler",
      { timeout: 10000 }
    );

    // 4. Click a different floor color (e.g., Toprak Kahve)
    const floorPicker = page.locator('[role="radiogroup"][aria-label="Taban Rengi"]');
    await expect(floorPicker).toBeVisible();
    
    // Find the button for Toprak Kahve and click it
    const toprakKahveSwatch = floorPicker.locator('button[aria-label^="Toprak Kahve"]');
    await toprakKahveSwatch.click();

    // 5. Click a different edge color (e.g., Turuncu) within the same step
    const edgePicker = page.locator('[role="radiogroup"][aria-label="Kenar (Overlok) Rengi"]');
    await expect(edgePicker).toBeVisible();
    
    const turuncuSwatch = edgePicker.locator('button[aria-label^="Turuncu"]');
    await turuncuSwatch.click();

    // 6. Verify step transitions to the final step (Ekstralar)
    await expect(stepList.locator('li[aria-current="step"]')).toContainText("Ekstralar");

    // 7. Open the Ekstralar accordion, then toggle the first extra checkbox
    const extrasSummary = page.locator('summary').filter({ hasText: "Ekstralar" });
    await expect(extrasSummary).toBeVisible();
    await extrasSummary.click();

    const topukPediCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(topukPediCheckbox).toBeVisible();
    await expect(topukPediCheckbox).not.toBeChecked();
    
    // Click label or checkbox to toggle
    await topukPediCheckbox.click();
    await expect(topukPediCheckbox).toBeChecked();

    // 8. Click "Sepete Ekle" and verify button feedback.
    //    Two "Sepete Ekle" buttons exist in the DOM: the desktop summary button
    //    and the mobile sticky bar (lg:hidden). Scope to the visible summary one,
    //    which is the button that swaps its label to "Eklendi".
    const addToCartBtn = page
      .locator('button:has-text("Sepete Ekle")')
      .filter({ visible: true });
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();

    // Success badge or text swap to "Eklendi" should be visible
    const addedBtn = page.locator('button:has-text("Eklendi")');
    await expect(addedBtn).toBeVisible();
  });
});
