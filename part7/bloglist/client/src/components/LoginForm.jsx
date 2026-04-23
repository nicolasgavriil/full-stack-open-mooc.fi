import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../stores/authStore.js";
import { TextField, Button } from "@mui/material";
import { useField } from "../hooks/useField.js";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();

  const username = useField("username", "text", "standard");
  const password = useField("password", "password", "standard");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username: username.value, password: password.value });
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
          <TextField {...username.props} />
        </div>
        <div>
          <TextField {...password.props} />
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
