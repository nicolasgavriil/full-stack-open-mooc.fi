import { Router } from "express";
import { Blog } from "../models/blog.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    return res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const result = await blog.save();
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default blogsRouter;
