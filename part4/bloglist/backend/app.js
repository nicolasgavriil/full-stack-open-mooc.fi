import config from "./utils/config.js";
import logger from "./utils/logger.js";
import express from "express";
import mongoose from "mongoose";
import middleware from "./utils/middleware.js";
import blogsRouter from "./controllers/blogs.js";
import usersRouter from "./controllers/users.js";

const app = express();

logger.info("Connecting to MongoDB");
try {
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
  logger.info("Connected to MongoDB");
} catch (err) {
  logger.error("Failed to connect to MongoDB", err);
}

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
