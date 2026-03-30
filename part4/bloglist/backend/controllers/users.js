import { Router } from "express";
import { User } from "../models/user.js";
import { AppError } from "../utils/middleware.js";
import bcrypt from "bcrypt";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  return res.status(200).json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  return res.status(200).json(user);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !password) {
    throw new AppError("missing content", 400);
  }

  if (password.length < 3) {
    throw new AppError("password must be at least 3 characters long", 400);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return res.status(201).json(savedUser);
});

export default usersRouter;
