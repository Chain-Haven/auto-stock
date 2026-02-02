import { test, expect } from "@playwright/test";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

test.describe("manufacturer catalog", () => {
  test.skip(!hasSupabase, "Requires Supabase for catalog create");
  test("manufacturer creates catalog product", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(process.env.E2E_MANUFACTURER_EMAIL ?? "mfr@example.com");
    await page.getByLabel(/password/i).fill(process.env.E2E_MANUFACTURER_PASSWORD ?? "password123!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto("/dashboard/catalog/new");
    await expect(page.getByRole("heading", { name: /new catalog product/i })).toBeVisible();
    await page.getByLabel(/^sku$/i).fill("E2E-SKU-1");
    await page.getByLabel(/name/i).fill("E2E Product");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/catalog/);
    await expect(page.getByTestId("catalog-list").or(page.getByTestId("catalog-empty"))).toBeVisible();
  });

  test("catalog new page requires auth", async ({ page }) => {
    await page.goto("/dashboard/catalog/new");
    await expect(page).toHaveURL(/\/login/);
  });
});
