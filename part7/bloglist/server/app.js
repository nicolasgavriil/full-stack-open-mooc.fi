import express from "express";
import mongoose from "mongoose";
import path from "path";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middleware from "./utils/middleware.js";
import blogsRouter from "./controllers/blogs.js";
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";
import testingRouter from "./controllers/testing.js";

const app = express();

logger.info("Connecting to MongoDB");
try {
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
  logger.info("Connected to MongoDB");
} catch (err) {
  logger.error("Failed to connect to MongoDB", err);
}

const __dirname = import.meta.dirname;

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
