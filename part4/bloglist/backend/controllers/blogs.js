import { Router } from "express";
import { Blog } from "../models/blog.js";
import { AppError } from "../utils/middleware.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

const blogsRouter = Router();

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

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
  const body = req.body;
  if (!body) {
    throw new AppError("Missing content", 400);
  }

  const userData = jwt.verify(getTokenFrom(req), process.env.JWT_SECRET_KEY);
  if (!userData) {
    throw new AppError("Invalid credentials", 401);
  }

  const user = await User.findById(userData.id);

  const blog = new Blog({ ...body, user: user.id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  return res.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (req, res) => {
  const blogId = req.params.id;
  const blogToUpdate = await Blog.findById(blogId);
  if (!blogToUpdate) {
    throw new AppError("Person not found", 404);
  }
  blogToUpdate.likes = req.body.likes;
  const updatedBlog = await blogToUpdate.save();
  return res.status(200).json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const blogId = req.params.id;
  await Blog.findByIdAndDelete(blogId);
  return res.status(204).end();
});

export default blogsRouter;
