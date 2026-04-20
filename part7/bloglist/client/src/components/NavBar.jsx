import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "../stores/authStore.js";
import { useAuth } from "../stores/authStore.js";

const NavBar = () => {
  const navButtonStyle = {
    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
  };

  const navigate = useNavigate();
  const user = useAuth();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
    navigate("/blogs");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ fontWeight: "medium" }}>
          Blog App
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          component={Link}
          to="/blogs"
          sx={navButtonStyle}
        >
          blogs
        </Button>

        {user && (
          <Button
            color="inherit"
            component={Link}
            to="/create"
            sx={navButtonStyle}
          >
            new blog
          </Button>
        )}

        {user ? (
          <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
            logout
          </Button>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={navButtonStyle}
          >
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
