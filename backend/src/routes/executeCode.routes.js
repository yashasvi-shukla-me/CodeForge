import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { executeCode } from "../controllers/executeCode.controller.js";
import { executeCodeSchema } from "../schemas/executeCode.schema.js";

const executionRoute = express.Router();

executionRoute.post(
  "/",
  authMiddleware,
  validate({ body: executeCodeSchema.shape.body }),
  executeCode,
);

export default executionRoute;
