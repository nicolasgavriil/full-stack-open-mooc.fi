import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";

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
        <Stack spacing={2}>
          <TextField
            label="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <TextField
            label="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Button type="submit" variant="contained" style={{ marginTop: 15 }}>
            CREATE
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default BlogCreationForm;
