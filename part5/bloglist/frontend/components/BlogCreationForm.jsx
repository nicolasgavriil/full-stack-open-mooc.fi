import { useState } from "react";

const BlogCreationForm = ({ onCreateBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreateBlog({ title, author, url });
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch {
      // Catching error to prevent form reset; App handles notification
    }
  };

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Url:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogCreationForm;
