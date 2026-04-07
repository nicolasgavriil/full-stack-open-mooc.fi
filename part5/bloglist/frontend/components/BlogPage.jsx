import { useParams } from "react-router-dom";

const BlogPage = ({ blogs, user, onLikeBlog, onRemoveBlog }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);
  if (!blog) return null;

  const handleLike = async () => {
    await onLikeBlog(blog);
  };

  const handleDelete = async () => {
    await onRemoveBlog(blog);
  };

  return (
    <div className="blog">
      <h3>{`${blog.author}: ${blog.title}`}</h3>

      <div>
        <div>{blog.url}</div>
        <div>
          {`likes ${blog.likes}`}
          {user && (
            <button type="button" onClick={handleLike}>
              like
            </button>
          )}
        </div>
        <div>Added by {blog.user.name}</div>
        {blog.user.id === user?.id && (
          <button className="delete-blog" type="button" onClick={handleDelete}>
            delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
