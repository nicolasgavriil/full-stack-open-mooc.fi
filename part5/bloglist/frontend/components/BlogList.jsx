import Blog from "./Blog.jsx";

const BlogList = ({ blogs, onLikeBlog }) => {
  return (
    <>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onLikeBlog={onLikeBlog} />
      ))}
    </>
  );
};

export default BlogList;
