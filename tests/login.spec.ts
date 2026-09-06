// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("renders sign-in page with Google button", async ({ page }) => {
    await page.goto("/");

    // Adjust selector/text to match your actual button
    const signInButton = page.getByRole("button", {
      name: /sign in with google/i,
    });
    await expect(signInButton).toBeVisible();
  });

  test("clicking sign-in redirects toward Google OAuth", async ({ page }) => {
    await page.goto("/");

    const signInButton = page.getByRole("button", {
      name: /sign in with google/i,
    });

    // NextAuth's signIn() call triggers a navigation to Google's OAuth endpoint.
    // We only assert the redirect starts, not that it completes.
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("accounts.google.com")),
      signInButton.click(),
    ]);

    expect(request.url()).toContain("accounts.google.com");
  });
});
