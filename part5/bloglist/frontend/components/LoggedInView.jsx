import BlogList from "./BlogList.jsx";

const LoggedInView = ({ user, blogs, onClick }) => {
  return (
    <>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={onClick}>
          logout
        </button>
      </p>

      <BlogList blogs={blogs} />
    </>
  );
};

export default LoggedInView;
