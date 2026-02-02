import { test, expect } from "@playwright/test";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

test.describe("merchant inventory", () => {
  test.skip(!hasSupabase, "Requires Supabase for seeded fixtures");
  test("merchant sees inventory list with seeded fixtures", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(process.env.E2E_MERCHANT_EMAIL ?? "merchant@example.com");
    await page.getByLabel(/password/i).fill(process.env.E2E_MERCHANT_PASSWORD ?? "password123!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto("/dashboard/inventory");
    await expect(page.getByRole("heading", { name: /inventory by sku/i })).toBeVisible();
    const list = page.getByTestId("inventory-list");
    const empty = page.getByTestId("inventory-empty");
    await expect(list.or(empty)).toBeVisible();
  });

  test("inventory page requires auth", async ({ page }) => {
    await page.goto("/dashboard/inventory");
    await expect(page).toHaveURL(/\/login/);
  });
});
