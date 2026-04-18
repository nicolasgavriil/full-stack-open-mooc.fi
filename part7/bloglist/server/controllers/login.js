import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Router } from "express";
import { User } from "../models/user.js";
import { AppError } from "../utils/middleware.js";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("missing content", 400);
  }

  const user = await User.findOne({ username });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!passwordCorrect) {
    throw new AppError("invalid username or password", 401);
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET_KEY);

  return res
    .status(200)
    .json({ token, username: user.username, name: user.name, id: user.id });
});

export default loginRouter;
