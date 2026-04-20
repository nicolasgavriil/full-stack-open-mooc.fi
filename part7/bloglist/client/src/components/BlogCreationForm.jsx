import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useBlogActions } from "../stores/blogStore.js";

const BlogCreationForm = () => {
  const navigate = useNavigate();
  const { createBlog } = useBlogActions();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, author, url });

      navigate("/blogs");
    } catch (err) {
      console.log(err);
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
