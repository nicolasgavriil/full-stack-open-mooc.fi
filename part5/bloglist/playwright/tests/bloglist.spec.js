import { test, expect } from "@playwright/test";
import { login, logout, createBlog } from "./helper.js";

test.describe("Bloglist", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Linus Torvalds",
        username: "linus",
        password: "linux",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "Alcachofus",
        username: "ttt",
        password: "555",
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
      await login(page, "linus", "linux");

      await expect(page.getByText("Linus Torvalds logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await login(page, "linus", "wrong");

      await expect(
        page.getByText("invalid username or password"),
      ).toBeVisible();
    });
  });

  test.describe("When logged in", () => {
    test.beforeEach(async ({ page }) => {
      await login(page, "linus", "linux");
    });

    test("create new blog button is shown", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "create new blog" }),
      ).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "title", "author", "url");

      await expect(
        page.getByText('New blog: "title" by author added'),
      ).toBeVisible();
      await expect(page.getByText("title author")).toBeVisible();
    });

    test("clicking the like button adds a like to the blog", async ({
      page,
    }) => {
      await createBlog(page, "title", "author", "url");
      await page.getByRole("button", { name: "view" }).click();

      await expect(page.getByText("likes 0")).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("clicking the delete button and confirming removes the blog", async ({
      page,
    }) => {
      await createBlog(page, "title", "author", "url");
      await page.getByRole("button", { name: "view" }).click();

      page.once("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        expect(dialog.message()).toBe("Remove blog: title by author");
        await dialog.accept();
      });

      await page.getByRole("button", { name: "delete" }).click();

      await expect(page.getByText("Blog deleted")).toBeVisible();
      await expect(page.getByText("title author")).not.toBeVisible();
    });

    test("clicking the delete button and cancelling does not remove the blog", async ({
      page,
    }) => {
      await createBlog(page, "title", "author", "url");
      await page.getByRole("button", { name: "view" }).click();

      page.once("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        expect(dialog.message()).toBe("Remove blog: title by author");
        await dialog.dismiss();
      });

      await page.getByRole("button", { name: "delete" }).click();

      await expect(page.getByText("Blog deleted")).not.toBeVisible();
      await expect(page.getByText("title author")).toBeVisible();
    });

    test("a user can not see the delete button on someone else's blog", async ({
      page,
    }) => {
      await createBlog(page, "title", "author", "url");
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "delete" })).toBeVisible();

      await logout(page);
      await expect(page.getByRole("button", { name: "login" })).toBeVisible();
      await login(page, "ttt", "555");
      await expect(page.getByText("Alcachofus")).toBeVisible();
      await expect(page.getByText("title author")).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "delete" }),
      ).not.toBeVisible();
    });

    test("blogs are ordered by likes, highest first", async ({ page }) => {
      await createBlog(page, "first", "author1", "url1");
      await createBlog(page, "second", "author2", "url2");
      await createBlog(page, "third", "author3", "url3");

      const blogs = page.locator(".blog");
      await expect(blogs).toHaveCount(3);

      const likeBlog = async (index, times) => {
        const blog = blogs.nth(index);
        await blog.getByRole("button", { name: "view" }).click();

        for (let i = 0; i < times; i++) {
          await blog.getByRole("button", { name: "like" }).click();
        }
      };

      await likeBlog(1, 5);
      await likeBlog(0, 2);
      await likeBlog(2, 1);

      await expect(blogs.nth(0)).toContainText("second");
      await expect(blogs.nth(1)).toContainText("first");
      await expect(blogs.nth(2)).toContainText("third");
    });
  });
});
