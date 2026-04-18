import { User } from "../models/user.js";
import logger from "./logger.js";
import jwt from "jsonwebtoken";

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    throw new AppError("missing credentials", 401);
  }

  const decodedData = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id);
  if (!user) {
    throw new AppError("invalid credentials", 401);
  }

  req.user = user;
  next();
};

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(409).json({ error: "username already exists" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }

  return res.status(err.status || 500).json({
    error: err.message || "internal server error",
  });
};

export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
