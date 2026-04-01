import { useState, useEffect } from "react";
import BlogList from "../components/BlogList.jsx";
import LoginForm from "../components/LoginForm.jsx";
import Notification from "../components/Notification.jsx";
import blogService from "../services/blogs";
import loginService from "../services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const handleLogin = (e) => {
    e.preventDefault();
    const fetchUser = async () => {
      try {
        const user = await loginService.login(username, password);
        setUser(user);
        setUsername("");
        setPassword("");
      } catch (err) {
        console.error(err);
        setNotification({
          message: err.response?.data?.error || "Something went wrong",
          type: "error",
        });
      }
    };

    fetchUser();
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <div>
      <Notification notification={notification} />
      {user && <BlogList blogs={blogs} user={user} />}
      {!user && (
        <LoginForm
          username={username}
          password={password}
          onUsernameChange={handleUsernameChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleLogin}
        />
      )}
    </div>
  );
};

export default App;
