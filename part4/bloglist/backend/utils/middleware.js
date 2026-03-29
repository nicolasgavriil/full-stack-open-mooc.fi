import logger from "./logger.js";

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(409).json({ error: "Username already exists" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};

export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default { requestLogger, unknownEndpoint, errorHandler };
