import _ from "lodash";

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikes = blogs.reduce(
    (max, blog) => (blog.likes > max ? blog.likes : max),
    0,
  );
  return blogs.find((blog) => blog.likes === maxLikes);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const result = _(blogs)
    .groupBy("author")
    .map((authorBlogs, author) => ({
      author,
      blogs: authorBlogs.length,
    }))
    .maxBy("blogs");

  return result || null;
};

export default { totalLikes, favoriteBlog, mostBlogs };
