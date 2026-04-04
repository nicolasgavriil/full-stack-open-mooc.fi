import { useState } from "react";

const Blog = ({ blog, onLikeBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const handleLike = async () => {
    await onLikeBlog(blog.id);
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
        </div>
      )}
    </div>
  );
};

export default Blog;
