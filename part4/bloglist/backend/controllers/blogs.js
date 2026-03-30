import { Router } from "express";
import { Blog } from "../models/blog.js";
import { AppError } from "../utils/middleware.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import middleware from "../utils/middleware.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  return res.status(200).json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  return res.status(200).json(blog);
});

blogsRouter.use(middleware.userExtractor);

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  if (!title || !url) {
    throw new AppError("missing content", 400);
  }

  const user = req.user;

  const blog = new Blog({ title, author, url, likes, user: user.id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  return res.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (req, res) => {
  const blogId = req.params.id;
  const blogToUpdate = await Blog.findById(blogId);
  if (!blogToUpdate) {
    throw new AppError("blog not found", 404);
  }

  const user = req.user;

  if (blogToUpdate.user.toString() !== user.id) {
    throw new AppError("not authorized to update this blog", 403);
  }

  blogToUpdate.likes = req.body.likes;
  const updatedBlog = await blogToUpdate.save();
  return res.status(200).json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const blogId = req.params.id;
  const blogToDelete = await Blog.findById(blogId);
  if (!blogToDelete) {
    throw new AppError("blog not found", 404);
  }

  const user = req.user;

  if (blogToDelete.user.toString() !== user.id) {
    throw new AppError("not authorized to delete this blog", 403);
  }

  await Blog.findByIdAndDelete(blogId);

  user.blogs = user.blogs.filter((b) => b.toString() !== blogId);
  await user.save();

  return res.status(204).end();
});

export default blogsRouter;
