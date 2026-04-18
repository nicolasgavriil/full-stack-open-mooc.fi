import { useState } from "react";
import { TextField, Button } from "@mui/material";

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(username, password);
      setUsername("");
      setPassword("");
    } catch {
      // Catching error to prevent form reset; App handles notification
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
