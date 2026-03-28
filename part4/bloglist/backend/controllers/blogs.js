import { Router } from "express";
import { Blog } from "../models/blog.js";
import { AppError } from "../utils/middleware.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  return res.status(200).json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  return res.status(200).json(blog);
});

blogsRouter.post("/", async (req, res) => {
  if (!req.body) {
    throw new AppError("Missing content", 400);
  }
  const blog = new Blog(req.body);
  const result = await blog.save();
  return res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res) => {
  const blogId = req.params.id;
  await Blog.findByIdAndDelete(blogId);
  return res.status(204).end();
});

export default blogsRouter;
