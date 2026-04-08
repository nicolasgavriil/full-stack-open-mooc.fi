import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import BlogsPage from "../components/BlogsPage.jsx";
import LoginForm from "../components/LoginForm.jsx";
import Notification from "../components/Notification.jsx";
import blogService from "../services/blogs";
import loginService from "../services/login";
import BlogCreationForm from "../components/BlogCreationForm.jsx";
import BlogPage from "../components/BlogPage.jsx";

const App = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
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
    if (!notification) {
      return;
    }
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, [notification]);

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
      setNotification({
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
    console.log("create blog");
    try {
      const newBlog = await blogService.create(content);
      setBlogs(blogs.concat(newBlog));
      setNotification({
        message: `New blog: "${newBlog.title}" by ${newBlog.author} added`,
        type: "success",
      });
      navigate("/blogs");
    } catch (err) {
      setNotification({
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
      setNotification({
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
        setNotification({
          message: `Blog deleted`,
          type: "success",
        });
        navigate("/blogs");
      }
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <Container>
      <div>
        <div>
          <Link className="page-link" to="/blogs">
            blogs
          </Link>
          {user && (
            <Link className="page-link" to="/create">
              new blog
            </Link>
          )}
          {user ? (
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          ) : (
            <Link className="page-link" to="/login">
              login
            </Link>
          )}
        </div>
        <Notification notification={notification} />
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
          <Route path="/login" element={<LoginForm onSubmit={handleLogin} />} />
        </Routes>
      </div>
    </Container>
  );
};

export default App;
