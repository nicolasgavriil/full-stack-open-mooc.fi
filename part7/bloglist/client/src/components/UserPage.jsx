import { useParams } from "react-router-dom";
import { useUsers } from "../stores/userStore.js";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const UserPage = () => {
  const users = useUsers();
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) return null;

  return (
    <>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        {user.name}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Added blogs
      </Typography>
      <List dense disablePadding sx={{ listStyleType: "disc", pl: 2 }}>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} sx={{ display: "list-item", pl: 0 }}>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default UserPage;
