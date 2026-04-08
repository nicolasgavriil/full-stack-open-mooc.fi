import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogCreationForm from "../components/BlogCreationForm.jsx";

test("<BlogCreationForm /> calls the handler with the right data when a blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogCreationForm onCreateBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title");
  const authorInput = screen.getByLabelText("author");
  const urlInput = screen.getByLabelText("url");
  const submitButton = screen.getByText("CREATE");

  await user.type(titleInput, "title");
  await user.type(authorInput, "author");
  await user.type(urlInput, "url");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("title");
  expect(createBlog.mock.calls[0][0].author).toBe("author");
  expect(createBlog.mock.calls[0][0].url).toBe("url");
});
