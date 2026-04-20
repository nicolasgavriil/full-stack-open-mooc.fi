import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Link,
} from "@mui/material";

const BlogPage = ({ blogs, user, onLikeBlog, onRemoveBlog }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);
  if (!blog) return <h1>404 - Post not found</h1>;

  const handleLike = async () => {
    await onLikeBlog(blog);
  };

  const handleDelete = async () => {
    await onRemoveBlog(blog);
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
      </CardContent>
    </Card>
  );
};

export default BlogPage;
