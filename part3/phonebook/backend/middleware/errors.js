export const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
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
