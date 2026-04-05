import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Blog from "../components/Blog.jsx";

describe("<Blog />", () => {
  beforeEach(() => {
    const onLikeBlog = vi.fn();
    const onRemoveBlog = vi.fn();
    const blog = {
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
    screen.getByText("Testing frontend Linus Torvalds");
  });

  test("does not render URL nor likes by default", () => {
    const url = screen.queryByText("potatosftw.net");
    expect(url).not.toBeInTheDocument();
    const likes = screen.queryByText("likes 74");
    expect(likes).not.toBeInTheDocument();
  });
});
