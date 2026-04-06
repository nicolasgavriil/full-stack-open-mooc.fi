import { test, expect } from "@playwright/test";

test.describe("Bloglist", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("api/users", {
      data: {
        name: "Linus Torvalds",
        username: "linus",
        password: "linux",
      },
    });

    await page.goto("/");
  });

  test("Login button is shown", async ({ page }) => {
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByText("Log in to application")).toBeVisible();
  });

  test.describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      await page.getByLabel("username").fill("linus");
      await page.getByLabel("password").fill("linux");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Linus Torvalds logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      await page.getByLabel("username").fill("linus");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("invalid username or password"),
      ).toBeVisible();
    });
  });
});
