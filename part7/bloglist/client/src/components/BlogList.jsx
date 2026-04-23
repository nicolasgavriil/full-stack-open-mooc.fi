import { Link } from "react-router-dom";
import { useBlogs } from "../stores/blogStore.js";
import { List, ListItem, ListItemText } from "@mui/material";

const BlogList = () => {
  const blogs = useBlogs();
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    <List dense disablePadding sx={{ listStyleType: "disc", pl: 3 }}>
      {sortedBlogs.map((blog) => (
        <ListItem key={blog.id} sx={{ display: "list-item", pl: 0 }}>
          <Link to={`/blogs/${blog.id}`}>
            <ListItemText primary={`${blog.title} by ${blog.author}`} />
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default BlogList;
