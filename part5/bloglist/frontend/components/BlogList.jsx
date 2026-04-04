import Blog from "./Blog.jsx";

const BlogList = ({ blogs, user, onLikeBlog, onRemoveBlog }) => {
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);
  return (
    <>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLikeBlog={onLikeBlog}
          onRemoveBlog={onRemoveBlog}
        />
      ))}
    </>
  );
};

export default BlogList;
