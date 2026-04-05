import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "../components/Blog.jsx";

describe("<Blog />", () => {
  let onLikeBlog;
  let onRemoveBlog;
  let blog;
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
    const user = {
      username: "linus",
      name: "Linus Torvalds",

      id: "69ca329feef12d531f5a69aa",
    };

    render(
      <Blog
        key={blog.id}
        blog={blog}
        user={user}
        onLikeBlog={onLikeBlog}
        onRemoveBlog={onRemoveBlog}
      />,
    );
  });

  test("renders title and author", () => {
    screen.getByText(`${blog.title} ${blog.author}`);
  });

  test("does not render URL nor likes by default", () => {
    const url = screen.queryByText(blog.url);
    expect(url).not.toBeInTheDocument();
    const likes = screen.queryByText(`likes ${blog.likes}`);
    expect(likes).not.toBeInTheDocument();
  });

  test("renders URL and likes after clicking the view button", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const url = screen.queryByText(blog.url);
    expect(url).toBeInTheDocument();
    const likes = screen.queryByText(`likes ${blog.likes}`);
    expect(likes).toBeInTheDocument();
  });

  test("like button calls handler", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(onLikeBlog.mock.calls).toHaveLength(2);
  });
});
