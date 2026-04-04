import Blog from "./Blog.jsx";

const BlogList = ({ blogs, onLikeBlog }) => {
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);
  return (
    <>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onLikeBlog={onLikeBlog} />
      ))}
    </>
  );
};

export default BlogList;
