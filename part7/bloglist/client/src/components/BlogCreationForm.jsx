import { Stack, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useField } from "../hooks/useField.js";
import { useBlogActions } from "../stores/blogStore.js";

const BlogCreationForm = () => {
  const navigate = useNavigate();
  const { createBlog } = useBlogActions();

  const title = useField("title", "text");
  const author = useField("author", "text");
  const url = useField("url", "text");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      });

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
          <TextField {...title.props} />

          <TextField {...author.props} />

          <TextField {...url.props} />

          <Button type="submit" variant="contained" style={{ marginTop: 15 }}>
            CREATE
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default BlogCreationForm;
