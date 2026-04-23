import { useParams, useNavigate } from "react-router-dom";
import { useBlogActions } from "../stores/blogStore.js";
import { useBlogs } from "../stores/blogStore.js";
import { useAuth } from "../stores/authStore.js";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useField } from "../hooks/useField.js";

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuth();
  const { likeBlog, commentBlog, removeBlog } = useBlogActions();
  const blogs = useBlogs();
  const blog = blogs.find((b) => b.id === id);

  const comment = useField("comment", "text");

  if (!blog) return null;

  const handleLike = async () => {
    await likeBlog(blog);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      await removeBlog(blog);
      navigate("/blogs");
    }
  };

  const handleSubmit = async () => {
    try {
      await commentBlog(blog, comment.value);
    } catch (err) {
      console.log(err);
    }
    comment.reset();
  };

  return (
    <Card elevation={3} sx={{ mt: 3, maxWidth: 600, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {blog.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
          by {blog.author}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ display: "block", mb: 0.5, fontWeight: 600 }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Added by {blog.user.name}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Typography
            variant="body1"
            sx={{ fontWeight: "medium", display: "flex", alignItems: "center" }}
          >
            {blog.likes} likes
          </Typography>

          {user && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleLike}
              sx={{ fontWeight: 600, borderWidth: "2px" }}
            >
              LIKE
            </Button>
          )}

          {blog.user.id === user?.id && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDelete}
              sx={{ fontWeight: 600, borderWidth: "2px" }}
            >
              DELETE
            </Button>
          )}
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: "550", mt: 2, mb: 0.5 }}>
          comments
        </Typography>

        {user && (
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField size="small" {...comment.props} />
            <Button variant="contained" onClick={handleSubmit}>
              ADD COMMENT
            </Button>
          </Stack>
        )}

        <List dense disablePadding sx={{ listStyleType: "disc", pl: 3 }}>
          {blog.comments.map((c, i) => (
            <ListItem key={i} sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary={c} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default BlogPage;
