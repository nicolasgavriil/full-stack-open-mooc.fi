import { Router } from "express";
import { Blog } from "../models/blog.js";
import { AppError } from "../utils/middleware.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

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

blogsRouter.post("/", async (req, res) => {
  if (!req.token) {
    throw new AppError("missing credentials", 401);
  }
  const { title, author, url, likes } = req.body;
  if (!title || !url) {
    throw new AppError("missing content", 400);
  }

  const decodedData = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id);
  if (!user) {
    throw new AppError("invalid credentials", 401);
  }

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
    throw new AppError("person not found", 404);
  }
  blogToUpdate.likes = req.body.likes;
  const updatedBlog = await blogToUpdate.save();
  return res.status(200).json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  if (!req.token) {
    throw new AppError("missing credentials", 401);
  }

  const blogId = req.params.id;
  const blogToDelete = await Blog.findById(blogId);
  if (!blogToDelete) {
    throw new AppError("blog not found", 404);
  }

  const decodedData = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

  if (blogToDelete.user.toString() !== decodedData.id) {
    throw new AppError("not authorized to delete this blog", 403);
  }

  await Blog.findByIdAndDelete(blogId);

  const user = await User.findById(decodedData.id);
  user.blogs = user.blogs.filter((b) => b.toString() !== blogId);
  await user.save();

  return res.status(204).end();
});

export default blogsRouter;
