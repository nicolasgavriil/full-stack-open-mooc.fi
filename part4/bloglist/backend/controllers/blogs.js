import { Router } from "express";
import { Blog } from "../models/blog.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res, next) => {
  const blogs = await Blog.find({});
  return res.status(200).json(blogs);
});

blogsRouter.post("/", async (req, res, next) => {
  const blog = new Blog(req.body);
  const result = await blog.save();
  return res.status(201).json(result);
});

export default blogsRouter;
