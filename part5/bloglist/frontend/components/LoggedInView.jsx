import { useRef } from "react";
import BlogList from "./BlogList.jsx";
import BlogCreationForm from "./BlogCreationForm.jsx";
import Togglable from "./Togglable.jsx";

const LoggedInView = ({ user, blogs, onLogout, onCreateBlog, onLikeBlog }) => {
  const blogFormRef = useRef();

  const handleCreateAndHide = async (blogObject) => {
    try {
      await onCreateBlog(blogObject);
      blogFormRef.current.toggleVisibility();
    } catch {
      // Catching error to prevent form reset; App handles notification
    }
  };

  return (
    <>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={onLogout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogCreationForm onCreateBlog={handleCreateAndHide} />
      </Togglable>
      <BlogList blogs={blogs} onLikeBlog={onLikeBlog} />
    </>
  );
};

export default LoggedInView;
