import { useState, useEffect } from "react";
import LoggedInView from "../components/LoggedInView.jsx";
import LoginForm from "../components/LoginForm.jsx";
import Notification from "../components/Notification.jsx";
import blogService from "../services/blogs";
import loginService from "../services/login";

const App = () => {
  const [notification, setNotification] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = (e) => {
    e.preventDefault();
    const fetchUser = async () => {
      try {
        const user = await loginService.login(username, password);
        window.localStorage.setItem("loggedUser", JSON.stringify(user));
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

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedUser");
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <div>
      <Notification notification={notification} />
      {user ? (
        <LoggedInView user={user} blogs={blogs} onClick={handleLogout} />
      ) : (
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
