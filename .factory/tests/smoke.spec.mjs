import { test, expect } from "@playwright/test";

test("service catalog loads in Amplify QA", async ({ page }) => {
  const url = process.env.AMPLIFY_QA_URL;
  if (!url) throw new Error("AMPLIFY_QA_URL is required");
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();
  await expect(page.getByText("HTS Service Catalog").first()).toBeVisible();
});
