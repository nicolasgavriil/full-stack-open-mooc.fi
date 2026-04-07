import { Link } from "react-router-dom";
import BlogPage from "./BlogPage.jsx";

const BlogList = ({ blogs }) => {
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);
  return (
    <>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {`${blog.title} by ${blog.author}`}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default BlogList;
