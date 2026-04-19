import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import NavBar from "../components/NavBar.jsx";
import Notification from "../components/Notification.jsx";
import LoginForm from "../components/LoginForm.jsx";
import BlogsPage from "../components/BlogsPage.jsx";
import BlogPage from "../components/BlogPage.jsx";
import BlogCreationForm from "../components/BlogCreationForm.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import loginService from "../services/login.js";
import blogService from "../services/blogs.js";
import {
  useNotification,
  useNotificationActions,
} from "../stores/notificationStore.js";

const App = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { notify } = useNotificationActions();
  const [blogs, setBlogs] = useState([]);
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
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };

    fetchBlogs();
  }, []);

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

  const handleCreateBlog = async (content) => {
    try {
      const newBlog = await blogService.create(content);
      setBlogs(blogs.concat(newBlog));

      notify({
        message: `New blog: "${newBlog.title}" by ${newBlog.author} added`,
        type: "success",
      });
      navigate("/blogs");
    } catch (err) {
      notify({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });

      throw err;
    }
  };

  const handleLikeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.like(blog.id);
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id === blog.id ? updatedBlog : b)),
      );
    } catch (err) {
      notify({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });
    }
  };

  const handleRemoveBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
        notify({
          message: `Blog deleted`,
          type: "success",
        });
        navigate("/blogs");
      }
    } catch (err) {
      notify({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });
    }
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
              element={
                <BlogPage
                  blogs={blogs}
                  user={user}
                  onLikeBlog={handleLikeBlog}
                  onRemoveBlog={handleRemoveBlog}
                />
              }
            />
            <Route
              path="/create"
              element={<BlogCreationForm onCreateBlog={handleCreateBlog} />}
            />
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
