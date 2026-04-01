const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Username
            <input type="text" value={username} onChange={onUsernameChange} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="text" value={password} onChange={onPasswordChange} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
