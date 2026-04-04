import { useState, useEffect } from "react";
import LoggedInView from "../components/LoggedInView.jsx";
import LoginForm from "../components/LoginForm.jsx";
import Notification from "../components/Notification.jsx";
import blogService from "../services/blogs";
import loginService from "../services/login";
import Togglable from "../components/Togglable.jsx";

const App = () => {
  const [notification, setNotification] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    return loggedUser ? JSON.parse(loggedUser) : null;
  });

  useEffect(() => {
    if (!notification) {
      return;
    }
    setTimeout(() => {
      setNotification(null);
    }, 10000);
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
      blogService.setToken(user.token);
      setUser(user);
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
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });
      throw err;
    }
  };

  const handleLikeBlog = async (blogId) => {
    try {
      const updatedBlog = await blogService.like(blogId);
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id === blogId ? updatedBlog : b)),
      );
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <div>
      <Notification notification={notification} />
      {user ? (
        <LoggedInView
          user={user}
          blogs={blogs}
          onLogout={handleLogout}
          onCreateBlog={handleCreateBlog}
          onLikeBlog={handleLikeBlog}
        />
      ) : (
        <Togglable buttonLabel="login">
          <LoginForm onSubmit={handleLogin} />
        </Togglable>
      )}
    </div>
  );
};

export default App;
