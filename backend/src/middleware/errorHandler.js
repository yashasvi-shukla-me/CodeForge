import { getPublicMessage } from "../utils/errorFormatter.js";

/**
 * Global error-handling middleware.
 * Use by calling next(err) in route handlers or async handlers wrapped with try/catch.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode ?? err.status ?? 500;
  const message = getPublicMessage(err);
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && err?.stack
      ? { stack: err.stack }
      : {}),
  });
}
