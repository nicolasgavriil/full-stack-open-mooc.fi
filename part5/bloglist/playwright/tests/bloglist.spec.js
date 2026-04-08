import { test, expect } from "@playwright/test";
import { login, createBlog } from "./helper.js";

test.describe("Bloglist app", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await request.post("/api/users", {
      data: {
        name: "Linus Torvalds",
        username: "linus",
        password: "linux",
      },
    });

    await page.goto("/");
  });

  test("Login succeeds with correct credentials", async ({ page }) => {
    await login(page, "linus", "linux");

    await expect(page).toHaveURL(/\/blogs$/);
    await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  });

  test("Login fails with wrong credentials", async ({ page }) => {
    await login(page, "linus", "wrong");

    await expect(page.getByText("invalid username or password")).toBeVisible();
  });

  test.describe("When logged in", () => {
    test.beforeEach(async ({ page }) => {
      await login(page, "linus", "linux");
    });

    test("A logged-in user can create a blog", async ({ page }) => {
      await createBlog(page, "title", "author", "url");

      await expect(page.getByText("New blog:")).toBeVisible();
      await expect(
        page.getByRole("link", { name: "title by author" }),
      ).toBeVisible();
      await expect(page).toHaveURL(/\/blogs$/);
    });

    test("A logged-in user can like a blog", async ({ page }) => {
      await createBlog(page, "title", "author", "url");

      await page.getByRole("link", { name: "title by author" }).click();

      await expect(page.getByText("likes 0")).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("A logged-in user can delete a blog", async ({ page }) => {
      await createBlog(page, "title", "author", "url");

      await page.getByRole("link", { name: "title by author" }).click();

      page.once("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.accept();
      });

      await page.getByRole("button", { name: "delete" }).click();

      await expect(page).toHaveURL(/\/blogs$/);
      await expect(
        page.getByRole("link", { name: "title by author" }),
      ).not.toBeVisible();
    });
  });
});
