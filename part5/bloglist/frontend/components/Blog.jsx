import { useState } from "react";

const Blog = ({ blog, user, onLikeBlog, onRemoveBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const handleLike = async () => {
    await onLikeBlog(blog);
  };

  const handleDelete = async () => {
    await onRemoveBlog(blog);
  };

  return (
    <div className="blog">
      {blog.title} {blog.author}{" "}
      <button type="button" onClick={toggleShowDetails}>
        {showDetails ? "hide" : "view"}
      </button>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button type="button" onClick={handleLike}>
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.id === user.id && (
            <button
              className="delete-blog"
              type="button"
              onClick={handleDelete}
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
