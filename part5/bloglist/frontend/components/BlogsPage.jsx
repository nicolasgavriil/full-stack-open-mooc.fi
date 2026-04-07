import BlogList from "./BlogList.jsx";

const BlogsPage = ({ blogs }) => {
  return (
    <>
      <h2>Blogs</h2>
      <BlogList blogs={blogs} />
    </>
  );
};

export default BlogsPage;
