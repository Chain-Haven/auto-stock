import { test, expect } from "@playwright/test";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

test.describe("auth and onboarding", () => {
  test.skip(!hasSupabase, "Requires Supabase env for signup flow");
  test("signup merchant and land on dashboard shell", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();

    await page.getByLabel(/full name/i).fill("E2E Merchant");
    await page.getByLabel(/email/i).fill(`e2e-${Date.now()}@example.com`);
    await page.getByLabel(/password/i).fill("password123!");
    await page.getByRole("radio", { name: /merchant/i }).check();
    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
    await expect(page.getByText(/setup checklist/i)).toBeVisible();
    await expect(page.getByText(/role: merchant/i)).toBeVisible();
  });
});
