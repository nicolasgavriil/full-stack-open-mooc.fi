import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import BlogPage from "../components/BlogPage.jsx";

describe("<BlogPage />", () => {
  let onLikeBlog;
  let onRemoveBlog;
  let blog;
  let creator;
  let otherUser;

  const renderBlogPage = (user = null) => {
    render(
      <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <BlogPage
                blogs={[blog]}
                user={user}
                onLikeBlog={onLikeBlog}
                onRemoveBlog={onRemoveBlog}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    onLikeBlog = vi.fn();
    onRemoveBlog = vi.fn();
    blog = {
      title: "Testing frontend",
      author: "Linus Torvalds",
      url: "potatosftw.net",
      likes: 74,
      user: {
        username: "linus",
        name: "Linus Torvalds",
        id: "69ca329feef12d531f5a69aa",
      },
      id: "69ccb2cce1c432606cafa002",
    };
    creator = {
      username: "linus",
      name: "Linus Torvalds",
      id: "69ca329feef12d531f5a69aa",
    };
    otherUser = {
      username: "someoneelse",
      name: "Someone Else",
      id: "111111111111111111111111",
    };
  });

  test("unauthenticated users see blog information and likes, but no buttons", () => {
    renderBlogPage();

    screen.getByText("Testing frontend");
    screen.getByText("by Linus Torvalds");
    screen.getByText("potatosftw.net");
    screen.getByText("74 likes");
    screen.getByText("Added by Linus Torvalds");

    expect(
      screen.queryByRole("button", { name: /like/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  test("authenticated non-creator sees only the like button", () => {
    renderBlogPage(otherUser);

    screen.getByText("Testing frontend");
    screen.getByText("by Linus Torvalds");
    screen.getByText("potatosftw.net");
    screen.getByText("74 likes");

    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  test("creator sees both like and delete buttons", () => {
    renderBlogPage(creator);

    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("clicking like calls handler", async () => {
    const user = userEvent.setup();
    renderBlogPage(otherUser);

    await user.click(screen.getByRole("button", { name: /like/i }));
    await user.click(screen.getByRole("button", { name: /like/i }));

    expect(onLikeBlog).toHaveBeenCalledTimes(2);
  });

  test("clicking delete calls handler for creator", async () => {
    const user = userEvent.setup();
    renderBlogPage(creator);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onRemoveBlog).toHaveBeenCalledTimes(1);
  });
});
