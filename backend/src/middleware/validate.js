import { ZodError } from "zod";

/**
 * Validation middleware factory. Pass a Zod schema for body, params, or query.
 * @param {object} schemas - { body?, params?, query? } with Zod schemas
 */
export function validate(schemas = {}) {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message =
          err.errors?.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") ||
          "Validation failed";
        return res.status(400).json({ success: false, message });
      }
      next(err);
    }
  };
}
