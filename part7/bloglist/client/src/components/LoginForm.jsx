import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../stores/authStore.js";
import { TextField, Button } from "@mui/material";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/blogs");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            value={username}
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            value={password}
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 15 }}>
            LOGIN
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
