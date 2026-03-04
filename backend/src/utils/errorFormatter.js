/**
 * Safe error formatter: avoid leaking stack traces or internal details in production.
 */
export function getPublicMessage(err) {
  if (err?.message && typeof err.message === "string") {
    // In development, allow detailed messages; in production, generic only for non-operational errors
    if (process.env.NODE_ENV === "development") {
      return err.message;
    }
    // Whitelist safe, user-facing messages (e.g. validation)
    const safePatterns = [
      /required/i,
      /invalid/i,
      /not found/i,
      /missing/i,
      /already exists/i,
    ];
    if (safePatterns.some((p) => p.test(err.message))) {
      return err.message;
    }
  }
  return "An unexpected error occurred";
}

export function sendError(res, statusCode, message, options = {}) {
  const body = {
    success: false,
    message: message || "An unexpected error occurred",
    ...options,
  };
  return res.status(statusCode).json(body);
}
