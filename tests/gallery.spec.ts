import { test, expect } from "@playwright/test";

test.describe("Gallery and Lightbox E2E Flow", () => {
  test("should load gallery page, apply filters, and open/navigate lightbox", async ({ page }) => {
    // Go to the gallery page
    await page.goto("/galeri");

    // Wait for hydration to complete so React event listeners are attached
    await page.waitForTimeout(2000);

    // 1. Verify header is visible
    const title = page.locator("h1");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Gerçek Araçlar. Gerçek Uyum.");

    // 2. Locate filter buttons
    const filterGroup = page.locator('div[role="group"][aria-label="Galeri türünü filtrele"]');
    await expect(filterGroup).toBeVisible();

    const photoFilter = filterGroup.locator('button:has-text("Fotoğraflar")');
    await expect(photoFilter).toBeVisible();
    await photoFilter.click();
    await page.waitForTimeout(500); // Wait for filter animation

    // 3. Click first photo button to open lightbox
    const galleryGrid = page.locator("#gallery-grid");
    await expect(galleryGrid).toBeVisible();

    // Click on the first image button in the grid
    const firstItem = galleryGrid.locator('button[aria-label^="Müşteri uygulama fotoğrafını aç"]').first();
    await expect(firstItem).toBeVisible();
    await firstItem.click();

    // 4. Verify lightbox dialog is displayed (specifically targeting the lightbox using its title ID)
    const lightbox = page.locator('div[role="dialog"][aria-labelledby="gallery-lightbox-title"]');
    await expect(lightbox).toBeVisible();

    // Verify slide index indicator exists (e.g. 1 / N)
    const indexIndicator = lightbox.locator('span[aria-live="polite"]');
    await expect(indexIndicator).toBeVisible();
    await expect(indexIndicator).toContainText("1 /");

    // 5. Navigate using the "Next media" button
    const nextButton = lightbox.locator('button[aria-label="Sonraki medya"]');
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Verify slide index is updated to 2 / N
    await expect(indexIndicator).toContainText("2 /");

    // 6. Navigate using keyboard arrow keys
    await page.keyboard.press("ArrowRight");
    await expect(indexIndicator).toContainText("3 /");

    await page.keyboard.press("ArrowLeft");
    await expect(indexIndicator).toContainText("2 /");

    // 7. Click close button and verify lightbox closes
    const closeButton = lightbox.locator('button[aria-label="Galeri görüntüleyiciyi kapat"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // Lightbox should be detached/hidden
    await expect(lightbox).not.toBeVisible();
  });
});
