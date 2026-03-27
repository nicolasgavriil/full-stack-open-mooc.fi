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

export default { totalLikes, favoriteBlog };
