import BlogList from "./BlogList.jsx";
import BlogCreationForm from "./BlogCreationForm.jsx";

const LoggedInView = ({ user, blogs, onLogout, onCreateBlog }) => {
  return (
    <>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={onLogout}>
          logout
        </button>
      </p>
      <BlogCreationForm onCreateBlog={onCreateBlog} />
      <BlogList blogs={blogs} />
    </>
  );
};

export default LoggedInView;
