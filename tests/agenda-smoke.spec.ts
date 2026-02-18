import { test, expect } from "@playwright/test";

test("agenda smoke placeholder", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});
