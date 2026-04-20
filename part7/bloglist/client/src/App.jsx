import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import NavBar from "./components/NavBar.jsx";
import Notification from "./components/Notification.jsx";
import LoginForm from "./components/LoginForm.jsx";
import BlogsPage from "./components/BlogsPage.jsx";
import BlogPage from "./components/BlogPage.jsx";
import BlogCreationForm from "./components/BlogCreationForm.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import loginService from "./services/login.js";
import blogService from "./services/blogs.js";
import {
  useNotification,
  useNotificationActions,
} from "./stores/notificationStore.js";
import { useBlogs, useBlogActions } from "./stores/blogStore.js";

const App = () => {
  const { initializeBlogs } = useBlogActions();
  const blogs = useBlogs();
  const navigate = useNavigate();
  const notification = useNotification();
  const { notify } = useNotificationActions();

  const [user, setUser] = useState(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    return loggedUser ? JSON.parse(loggedUser) : null;
  });

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token);
    }
  }, [user]);

  useEffect(() => {
    initializeBlogs();
  }, [initializeBlogs]);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login(username, password);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setUser(user);
      navigate("/blogs");
    } catch (err) {
      notify({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });
      throw err;
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedUser");
    navigate("/blogs");
  };

  return (
    <Container>
      <div>
        <NavBar user={user} handleLogout={handleLogout} />
        <Notification notification={notification} />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogsPage blogs={blogs} />} />
            <Route path="/blogs" element={<BlogsPage blogs={blogs} />} />

            <Route
              path="/blogs/:id"
              element={<BlogPage blogs={blogs} user={user} />}
            />
            <Route path="/create" element={<BlogCreationForm />} />
            <Route
              path="/login"
              element={<LoginForm onSubmit={handleLogin} />}
            />
            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  );
};

export default App;
