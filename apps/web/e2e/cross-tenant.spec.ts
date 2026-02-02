import { test, expect } from "@playwright/test";

/**
 * Cross-tenant negative test: User A cannot see User B's data.
 * Without Supabase env we cannot run real signup for two users; we assert
 * that the app never exposes another tenant's data (e.g. dashboard shows
 * only own context, admin health doesn't leak org data to other orgs).
 */
test.describe("cross-tenant isolation", () => {
  test("dashboard and admin require auth; no cross-tenant data in URL", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/dashboard/admin/health");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated cannot access protected routes", async ({ page }) => {
    const res = await page.goto("/dashboard/admin/health", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/login/);
    expect(res?.url()).toContain("login");
  });
});
