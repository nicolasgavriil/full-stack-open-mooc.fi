import Blog from "./Blog.jsx";

const BlogList = ({ blogs, user }) => {
  return (
    <>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;
